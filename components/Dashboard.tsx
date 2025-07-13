import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { PlusIcon, StarIcon, SettingsIcon, TrashIcon } from './icons';
import TodoListTile from './TodoListTile';
import Modal from './Modal';
import MoveTodoModal from './MoveTodoModal';
import Settings from './Settings';
import TrashView from './TrashView';
import type { TodoItem, TodoList as TodoListType } from '../types';
import { DEFAULT_LIST_NAME } from '../context/AppContext';

const Dashboard: React.FC = () => {
  const context = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [isMoveModalOpen, setMoveModalOpen] = useState(false);
  const [itemToMove, setItemToMove] = useState<TodoItem | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTrashView, setIsTrashView] = useState(false);
  const [newFavoriteTodo, setNewFavoriteTodo] = useState('');

  // 모든 훅 호출 후에 조건부 return 처리
  if (!context) return null;
  const { user, lists, items, addList, setView, settings, addFavoriteItem } = context;

  const handleCreateList = () => {
    if (newListName.trim()) {
      addList(newListName.trim());
      setNewListName('');
      setIsModalOpen(false);
    }
  };

  // 즐겨찾기 추가 핸들러
  const handleAddFavoriteTodo = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newFavoriteTodo.trim()) {
      addFavoriteItem(newFavoriteTodo.trim());
      setNewFavoriteTodo('');
    }
  };
  
  const favoriteItems = useMemo(() => items.filter((item: TodoItem) => item.isFavorited), [items]);
  const completedFavoriteItems = useMemo(() => favoriteItems.filter((item: TodoItem) => item.isCompleted), [favoriteItems]);
  const favoriteProgress = favoriteItems.length > 0 ? Math.round((completedFavoriteItems.length / favoriteItems.length) * 100) : 0;
  
  const itemsByList = useMemo(() => {
    return items.reduce((acc: Record<string, TodoItem[]>, item: TodoItem) => {
      if (!acc[item.listId]) {
        acc[item.listId] = [];
      }
      acc[item.listId].push(item);
      return acc;
    }, {} as Record<string, TodoItem[]>);
  }, [items]);
  
  const sortedUncompleted = (itemList: TodoItem[]) => {
    return itemList
      .filter((item: TodoItem) => !item.isCompleted)
      .sort((a: TodoItem, b: TodoItem) => b.createdAt - a.createdAt)
      .slice(0, 5);
  };
  const sortedUncompletedFavorites = () => {
    return favoriteItems
      .filter((item: TodoItem) => !item.isCompleted)
      .sort((a: TodoItem, b: TodoItem) => b.createdAt - a.createdAt)
      .slice(0, 5);
  };

  // TrashView 렌더링 조건을 모든 훅 호출 후로 이동
  if (isTrashView) {
    return <TrashView onClose={() => setIsTrashView(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 w-full">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">✅ ToDoList</h1>
          <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-3">
                <img src={user?.photoURL} alt={user?.displayName} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
              </div>
            
            <button onClick={() => setView('all')} className="hidden sm:inline-flex items-center justify-center bg-[#1E293B] hover:bg-[#334155] text-slate-300 font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
              전체 모아보기
            </button>
            <button onClick={() => setIsTrashView(true)} className="inline-flex items-center justify-center bg-[#1E293B] hover:bg-[#334155] text-slate-300 font-semibold py-2 px-3 rounded-lg transition-colors duration-200" title="휴지통">
              <TrashIcon className="w-5 h-5" />
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="inline-flex items-center justify-center bg-[#1E293B] hover:bg-[#334155] text-slate-300 font-semibold py-2 px-3 rounded-lg transition-colors duration-200">
              <SettingsIcon className="w-5 h-5" />
            </button>
            <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition-colors duration-200 shadow-lg">
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

      <main>
          {lists.length > 0 || favoriteItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-stretch">
              {/* 즐겨찾기 타일 */}
              <div 
                onClick={() => setView('favorites')}
                className="bg-[#1E293B] p-4 sm:p-6 rounded-2xl transition-colors duration-300 cursor-pointer flex flex-col justify-between hover:bg-[#334155] min-w-[320px]"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-4 justify-between">
                    <div className="flex items-center gap-3">
                      <StarIcon filled className="w-6 h-6 text-amber-400" />
                      <h3 className="text-xl font-bold text-white truncate">즐겨찾기</h3>
                    </div>
                    {/* 전체 삭제 버튼 제거: 필요 없음 */}
                  </div>
                  {settings.showItemsInDashboard && sortedUncompletedFavorites().length > 0 && (
                    <div className="mb-4 space-y-2">
                      {sortedUncompletedFavorites().map(item => (
                        <div key={item.itemId} className="flex items-center">
                          <button
                            type="button"
                            onClick={e => { e.stopPropagation(); context.toggleItemFavorite(item.itemId); }}
                            className="mr-2 p-1 rounded-full hover:bg-slate-700"
                          >
                            <StarIcon filled={item.isFavorited} className={`w-4 h-4 ${item.isFavorited ? 'text-amber-400' : 'text-slate-400'}`} />
                          </button>
                          <input
                            type="checkbox"
                            checked={item.isCompleted}
                            onClick={e => e.stopPropagation()}
                            onChange={() => context.toggleItemCompletion(item.itemId)}
                            className="w-4 h-4 rounded-sm border-2 border-slate-500 mr-2 bg-slate-800 focus:ring-amber-500"
                          />
                          <p className={`text-sm truncate ${item.isCompleted ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{item.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="text-sm text-slate-400">
                    <p>{completedFavoriteItems.length} / {favoriteItems.length} 완료</p>
                  </div>
                </div>
                {/* 즐겨찾기 할일 입력 폼 - TodoListTile과 동일하게 스타일 통일 및 하단 정렬 */}
                <form className="todo-input-area mt-4 flex gap-2 w-full" style={{ marginBottom: 0 }} onClick={e => e.stopPropagation()} onSubmit={handleAddFavoriteTodo}>
                  <input
                    type="text"
                    value={newFavoriteTodo}
                    onChange={e => setNewFavoriteTodo(e.target.value)}
                    placeholder="즐겨찾기 할일 추가..."
                    className="flex-1 min-w-0 px-2 sm:px-3 py-2 rounded-lg bg-slate-800 text-slate-100 border border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-xs sm:text-sm"
                  />
                  <button
                    type="submit"
                    className="px-3 sm:px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0"
                    style={{ maxWidth: '80px' }}
                  >
                    추가
                  </button>
                </form>
                <div className="mt-6">
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-amber-400 h-2 rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${favoriteProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-xs text-slate-400 mt-2">{favoriteProgress}%</p>
                </div>
              </div>

              {/* 일반 리스트 타일들: '기본' 목록도 항상 보이도록 수정 */}
              {[...lists]
                .filter(list => list.name !== DEFAULT_LIST_NAME)
                .sort((a, b) => a.name.localeCompare(b.name, 'ko'))
                .map(list => {
                  const listItems = itemsByList[list.listId] || [];
                  const completedItems = listItems.filter(item => item.isCompleted);
                  const previewItems = settings.showItemsInDashboard ? sortedUncompleted(listItems) : [];
                  return (
                      <div key={list.listId} className="min-w-[320px]">
                        <TodoListTile 
                            list={list} 
                            totalCount={listItems.length} 
                            completedCount={completedItems.length}
                            itemsPreview={previewItems}
                            showItemsInDashboard={settings.showItemsInDashboard}
                        />
                      </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#1E293B]/50 rounded-2xl border-2 border-dashed border-slate-700">
              <h2 className="text-2xl font-semibold text-slate-300">리스트가 없습니다</h2>
              <p className="text-slate-400 mt-2 mb-6">새로운 TODO 리스트를 만들어 작업을 시작하세요.</p>
              <button onClick={() => setIsModalOpen(true)} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 shadow-md">
                새 리스트 생성
              </button>
            </div>
          )}
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="새 리스트 생성">
        <div className="mt-4">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateList()}
            placeholder="리스트 이름"
            className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-white"
            autoFocus
          />
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={() => setIsModalOpen(false)} className="py-2 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold transition-colors">취소</button>
            <button onClick={handleCreateList} className="py-2 px-4 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-colors">생성</button>
          </div>
        </div>
      </Modal>

      {itemToMove && (
        <MoveTodoModal 
          isOpen={isMoveModalOpen}
          onClose={() => setMoveModalOpen(false)}
          itemToMove={itemToMove}
        />
      )}

      <Settings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      </div>
    </div>
  );
};

export default Dashboard;