import type { User, TodoList, TodoItem, Settings } from '../types';

const STORAGE_KEYS = {
  USER: 'todo_user',
  LISTS: 'todo_lists',
  ITEMS: 'todo_items',
  SETTINGS: 'todo_settings',
  VIEW: 'todo_view',
  FOCUSED_LIST: 'todo_focused_list'
} as const;

export class StorageError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'StorageError';
  }
}

export const storage = {
  // 사용자 데이터
  getUser: (): User | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get user from storage:', error);
      return null;
    }
  },

  setUser: (user: User | null): void => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (error) {
      throw new StorageError('Failed to save user to storage', error as Error);
    }
  },

  // 리스트 데이터
  getLists: (): TodoList[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LISTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get lists from storage:', error);
      return [];
    }
  },

  setLists: (lists: TodoList[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(lists));
    } catch (error) {
      throw new StorageError('Failed to save lists to storage', error as Error);
    }
  },

  // 아이템 데이터
  getItems: (): TodoItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ITEMS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get items from storage:', error);
      return [];
    }
  },

  setItems: (items: TodoItem[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    } catch (error) {
      throw new StorageError('Failed to save items to storage', error as Error);
    }
  },

  // 설정 데이터
  getSettings: (): Settings => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : { showItemsInDashboard: true, alwaysShowItemActions: true };
    } catch (error) {
      console.error('Failed to get settings from storage:', error);
      return { showItemsInDashboard: true, alwaysShowItemActions: true };
    }
  },

  setSettings: (settings: Settings): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      throw new StorageError('Failed to save settings to storage', error as Error);
    }
  },

  // 뷰 상태
  getView: (): string => {
    try {
      return localStorage.getItem(STORAGE_KEYS.VIEW) || 'dashboard';
    } catch (error) {
      console.error('Failed to get view from storage:', error);
      return 'dashboard';
    }
  },

  setView: (view: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.VIEW, view);
    } catch (error) {
      throw new StorageError('Failed to save view to storage', error as Error);
    }
  },

  // 포커스된 리스트
  getFocusedList: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.FOCUSED_LIST);
    } catch (error) {
      console.error('Failed to get focused list from storage:', error);
      return null;
    }
  },

  setFocusedList: (listId: string | null): void => {
    try {
      if (listId) {
        localStorage.setItem(STORAGE_KEYS.FOCUSED_LIST, listId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.FOCUSED_LIST);
      }
    } catch (error) {
      throw new StorageError('Failed to save focused list to storage', error as Error);
    }
  },

  // 전체 데이터 초기화
  clearAll: (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      throw new StorageError('Failed to clear storage', error as Error);
    }
  },

  // 스토리지 사용 가능 여부 확인
  isAvailable: (): boolean => {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}; 