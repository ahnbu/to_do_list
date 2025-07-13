
import React, { createContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import type { User, TodoList, TodoItem, View, Settings } from '../types';
import { storage, StorageError } from '../utils/storage';
import { getCurrentUser, signOut } from '../src/lib/supabaseClient';

interface AppContextType {
  user: User | null;
  lists: TodoList[];
  items: TodoItem[];
  view: View;
  focusedListId: string | null;
  settings: Settings;
  login: () => void;
  logout: () => void;
  addList: (name: string) => void;
  updateList: (listId: string, newName: string) => void;
  deleteList: (listId: string) => void;
  addItem: (listId: string, content: string) => void;
  updateItem: (itemId: string, newContent: string) => void;
  toggleItemCompletion: (itemId: string) => void;
  toggleItemFavorite: (itemId: string) => void;
  deleteItem: (itemId: string) => void;
  moveItem: (itemId: string, targetListId: string) => void;
  setView: (view: View, listId?: string | null) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
  restoreList: (listId: string) => void;
  restoreItem: (itemId: string) => boolean;
  permanentlyDeleteList: (listId: string) => void;
  permanentlyDeleteItem: (itemId: string) => void;
  addFavoriteItem: (content: string) => void;
  deleteItemsByFilter: (filter: (item: TodoItem) => boolean) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const DEFAULT_LIST_NAME = '기본';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User & { isAdmin?: boolean } | null>(null);
  const [lists, setLists] = useState<TodoList[]>([]);
  const [items, setItems] = useState<TodoItem[]>([]);
  const [view, setViewState] = useState<View>('dashboard');
  const [focusedListId, setFocusedListId] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const s = storage.getSettings();
      return { ...{ showItemsInDashboard: true, alwaysShowItemActions: true, showDefaultList: false }, ...s };
    } catch {
      return { showItemsInDashboard: true, alwaysShowItemActions: true, showDefaultList: false };
    }
  });

  // Supabase 인증 상태 동기화
  useEffect(() => {
    (async () => {
      const { data } = await getCurrentUser();
      if (data.user) {
        const isAdmin = data.user.user_metadata?.isAdmin === true || data.user.email === 'byungwook.an@gmail.com';
        setUser({
          userId: data.user.id,
          email: data.user.email || '',
          displayName: data.user.user_metadata?.full_name || data.user.email || '',
          photoURL: data.user.user_metadata?.avatar_url || '',
          isAdmin,
        });
      } else {
        setUser(null);
      }
    })();
  }, []);

  // '기본' 목록이 여러 개 있을 경우 하나만 남기고 나머지는 삭제
  useEffect(() => {
    const defaultLists = lists.filter((l: TodoList) => l.name === DEFAULT_LIST_NAME && !l.isDeleted);
    let keepList = undefined;
    if (defaultLists.length > 1) {
      // 첫 번째만 남기고 나머지는 soft delete
      keepList = defaultLists[0];
      const toDelete = defaultLists.slice(1).map((l: TodoList) => l.listId);
      const updatedLists = lists.map((l: TodoList) => toDelete.includes(l.listId) ? { ...l, isDeleted: true } : l);
      setLists(updatedLists);
      storage.setLists(updatedLists);
    } else if (defaultLists.length === 1) {
      keepList = defaultLists[0];
    }
    // 이름이 '기본'이 아닌데 listId가 기존 기본 목록과 같은 경우도 soft delete
    if (keepList) {
      const nonDefaultButOldDefault = lists.filter((l: TodoList) => l.name !== DEFAULT_LIST_NAME && !l.isDeleted && l.listId === keepList.listId);
      if (nonDefaultButOldDefault.length > 0) {
        const updatedLists = lists.map((l: TodoList) => (l.listId === keepList.listId && l.name !== DEFAULT_LIST_NAME) ? { ...l, isDeleted: true } : l);
        setLists(updatedLists);
        storage.setLists(updatedLists);
      }
    }
  }, [lists]);

  // visibleLists: '기본' 목록도 항상 보이도록 수정
  const visibleLists = useMemo(() => {
    return lists.filter((l: TodoList) => !l.isDeleted);
  }, [lists]);
  const visibleItems = useMemo(() => items.filter((i: TodoItem) => !i.isDeleted), [items]);

  // 로그인: 인증 상태 동기화만 수행 (실제 인증은 Login.tsx에서 처리)
  const login = useCallback(() => {
    (async () => {
      const { data } = await getCurrentUser();
      if (data.user) {
        const isAdmin = data.user.user_metadata?.isAdmin === true || data.user.email === 'byungwook.an@gmail.com';
        setUser({
          userId: data.user.id,
          email: data.user.email || '',
          displayName: data.user.user_metadata?.full_name || data.user.email || '',
          photoURL: data.user.user_metadata?.avatar_url || '',
          isAdmin,
        });
      } else {
        setUser(null);
      }
    })();
  }, []);

  // 로그아웃: Supabase 로그아웃 및 상태 초기화
  const logout = useCallback(() => {
    signOut();
    setUser(null);
    setLists([]);
    setItems([]);
    storage.clearAll();
  }, []);

  const setView = useCallback((newView: View, listId: string | null = null) => {
    try {
      setViewState(newView);
      setFocusedListId(listId);
      
      // 로컬 스토리지에 저장
      storage.setView(newView);
      storage.setFocusedList(listId);
    } catch (error) {
      console.error('Failed to save view state:', error);
    }
  }, []);

  // addList: 이름 중복 방지 및 안내 메시지
  const addList = useCallback((name: string) => {
    if (!user) return;
    if (lists.some((l: TodoList) => l.name === name && !l.isDeleted)) {
      alert('동일한 이름의 리스트가 이미 존재합니다. 다른 이름을 입력해 주세요.');
      return;
    }
    try {
      const newList: TodoList = {
        listId: `list-${Date.now()}`,
        userId: user.userId,
        name,
        createdAt: Date.now(),
      };
      const updatedLists = [...lists, newList];
      setLists(updatedLists);
      storage.setLists(updatedLists);
    } catch (error) {
      console.error('Failed to add list:', error);
    }
  }, [user, lists]);
  
  const updateList = useCallback((listId: string, newName: string) => {
    try {
      const updatedLists = lists.map((list: TodoList) => list.listId === listId ? { ...list, name: newName } : list);
      setLists(updatedLists);
      storage.setLists(updatedLists);
    } catch (error) {
      console.error('Failed to update list:', error);
    }
  }, [lists]);

  const deleteList = useCallback((listId: string) => {
    try {
      // 소프트 삭제: 리스트와 해당 아이템에 isDeleted: true
      const updatedLists = lists.map((list: TodoList) => list.listId === listId ? { ...list, isDeleted: true } : list);
      const updatedItems = items.map((item: TodoItem) => item.listId === listId ? { ...item, isDeleted: true } : item);
      setLists(updatedLists);
      setItems(updatedItems);
      storage.setLists(updatedLists);
      storage.setItems(updatedItems);
    } catch (error) {
      console.error('Failed to delete list:', error);
    }
  }, [lists, items]);

  const addItem = useCallback((listId: string, content: string) => {
    if (!user) return;
    try {
      const newItem: TodoItem = {
        itemId: `item-${Date.now()}`,
        listId,
        userId: user.userId,
        content,
        isCompleted: false,
        createdAt: Date.now(),
        isFavorited: false,
      };
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      storage.setItems(updatedItems);
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  }, [user, items]);

  const updateItem = useCallback((itemId: string, newContent: string) => {
    try {
      const updatedItems = items.map((item: TodoItem) => item.itemId === itemId ? { ...item, content: newContent } : item);
      setItems(updatedItems);
      storage.setItems(updatedItems);
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  }, [items]);

  const toggleItemCompletion = useCallback((itemId: string) => {
    try {
      const updatedItems = items.map((item: TodoItem) => item.itemId === itemId ? { ...item, isCompleted: !item.isCompleted } : item);
      setItems(updatedItems);
      storage.setItems(updatedItems);
    } catch (error) {
      console.error('Failed to toggle item completion:', error);
    }
  }, [items]);

  const toggleItemFavorite = useCallback((itemId: string) => {
    try {
      const updatedItems = items.map((item: TodoItem) => item.itemId === itemId ? { ...item, isFavorited: !item.isFavorited } : item);
      setItems(updatedItems);
      storage.setItems(updatedItems);
    } catch (error) {
      console.error('Failed to toggle item favorite:', error);
    }
  }, [items]);

  const deleteItem = useCallback((itemId: string) => {
    try {
      // 소프트 삭제: isDeleted: true
      const updatedItems = items.map((item: TodoItem) => item.itemId === itemId ? { ...item, isDeleted: true } : item);
      setItems(updatedItems);
      storage.setItems(updatedItems);
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  }, [items]);

  const moveItem = useCallback((itemId: string, targetListId: string) => {
    try {
      const updatedItems = items.map((item: TodoItem) => item.itemId === itemId ? { ...item, listId: targetListId } : item);
      setItems(updatedItems);
      storage.setItems(updatedItems);
    } catch (error) {
      console.error('Failed to move item:', error);
    }
  }, [items]);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      storage.setSettings(updatedSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  }, [settings]);

  // 휴지통 복원/영구삭제 함수
  const restoreList = useCallback((listId: string) => {
    const updatedLists = lists.map((list: TodoList) => list.listId === listId ? { ...list, isDeleted: false } : list);
    setLists(updatedLists);
    storage.setLists(updatedLists);
  }, [lists]);

  const restoreItem = useCallback((itemId: string) => {
    const itemToRestore = items.find((item: TodoItem) => item.itemId === itemId);
    if (!itemToRestore) return false;
    
    // 해당 항목이 속한 리스트가 삭제되었는지 확인
    const parentList = lists.find((list: TodoList) => list.listId === itemToRestore.listId);
    if (!parentList || parentList.isDeleted) {
      return false; // 리스트가 삭제되었으므로 복원 불가
    }
    
    const updatedItems = items.map((item: TodoItem) => item.itemId === itemId ? { ...item, isDeleted: false } : item);
    setItems(updatedItems);
    storage.setItems(updatedItems);
    return true; // 복원 성공
  }, [items, lists]);

  const permanentlyDeleteList = useCallback((listId: string) => {
    const updatedLists = lists.filter((list: TodoList) => list.listId !== listId);
    const updatedItems = items.filter((item: TodoItem) => item.listId !== listId);
    setLists(updatedLists);
    setItems(updatedItems);
    storage.setLists(updatedLists);
    storage.setItems(updatedItems);
  }, [lists, items]);

  const permanentlyDeleteItem = useCallback((itemId: string) => {
    const updatedItems = items.filter((item: TodoItem) => item.itemId !== itemId);
    setItems(updatedItems);
    storage.setItems(updatedItems);
  }, [items]);

  // 즐겨찾기에서 추가 시 '기본' 목록에 추가, isFavorited: true
  const addFavoriteItem = useCallback((content: string) => {
    if (!user) return;
    // 삭제되지 않은 '기본' 목록만 대상으로
    const defaultLists = lists.filter((l: TodoList) => l.name === DEFAULT_LIST_NAME && !l.isDeleted);
    let defaultList = defaultLists[0];
    if (!defaultList) {
      // 기본 목록이 없으면 즉시 생성 후, 그 목록에 추가
      defaultList = {
        listId: `list-default`,
        userId: user.userId,
        name: DEFAULT_LIST_NAME,
        createdAt: Date.now(),
      };
      const updatedLists = [...lists, defaultList];
      setLists(updatedLists);
      storage.setLists(updatedLists);
      setTimeout(() => {
        addFavoriteItem(content); // 재귀적으로 다시 시도
      }, 50);
      return;
    }
    try {
      const newItem: TodoItem = {
        itemId: `item-${Date.now()}`,
        listId: defaultList.listId,
        userId: user.userId,
        content,
        isCompleted: false,
        createdAt: Date.now(),
        isFavorited: true,
      };
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      storage.setItems(updatedItems);
    } catch (error) {
      console.error('Failed to add favorite item:', error);
    }
  }, [user, items, lists]);

  // 여러 할일을 조건에 따라 soft delete
  const deleteItemsByFilter = useCallback((filter: (item: TodoItem) => boolean) => {
    const updatedItems = items.map((item: TodoItem) => filter(item) ? { ...item, isDeleted: true } : item);
    setItems(updatedItems);
    storage.setItems(updatedItems);
  }, [items]);

  const contextValue: AppContextType & { allItems: TodoItem[]; allLists: TodoList[]; addFavoriteItem: (content: string) => void; deleteItemsByFilter: (filter: (item: TodoItem) => boolean) => void } = {
    user,
    lists: visibleLists,
    items: visibleItems,
    allItems: items,
    allLists: lists,
    view,
    focusedListId,
    settings,
    login,
    logout,
    addList,
    updateList,
    deleteList,
    addItem,
    updateItem,
    toggleItemCompletion,
    toggleItemFavorite,
    deleteItem,
    moveItem,
    setView,
    updateSettings,
    restoreList,
    restoreItem,
    permanentlyDeleteList,
    permanentlyDeleteItem,
    addFavoriteItem, // 추가
    deleteItemsByFilter, // 추가
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};