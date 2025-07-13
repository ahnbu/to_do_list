
import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import TodoItemComponent from './TodoItem';
import { ArrowLeftIcon, HomeIcon, StarIcon, TrashIcon } from './icons';
import MoveTodoModal from './MoveTodoModal';
import type { TodoItem } from '../types';
import { DEFAULT_LIST_NAME } from '../context/AppContext';

interface AllTodosViewProps {
  mode: 'all' | 'favorites';
}

const AllTodosView: React.FC<AllTodosViewProps> = ({ mode = 'all' }) => {
  const context = useContext(AppContext);
  const [isMoveModalOpen, setMoveModalOpen] = useState(false);
  const [itemToMove, setItemToMove] = useState<TodoItem | null>(null);
  const [showDefaultList, setShowDefaultList] = useState(false);

  if (!context) return null;
  const { allItems, allLists, setView, deleteItemsByFilter } = context as typeof context & { allItems: TodoItem[]; allLists: any[]; deleteItemsByFilter: (filter: (item: TodoItem) => boolean) => void };

  const getListName = (listId: string): string => {
    return allLists.find(l => l.listId === listId)?.name || '알 수 없는 리스트';
  };

  const isFavoritesMode = mode === 'favorites';

  // 기본 목록만 추출
  const defaultList = allLists.find(l => l.name === DEFAULT_LIST_NAME && !l.isDeleted);
  const defaultListItems = defaultList ? allItems.filter(i => i.listId === defaultList.listId && !i.isDeleted) : [];

  const sortedItems = useMemo(() => {
    // 삭제되지 않은 리스트에 속한, 삭제되지 않은 할일만
    const validListIds = allLists.filter(l => !l.isDeleted).map(l => l.listId);
    const sourceItems = isFavoritesMode
      ? allItems.filter(i => i.isFavorited && !i.isDeleted && validListIds.includes(i.listId))
      : allItems.filter(i => !i.isDeleted && validListIds.includes(i.listId));
    return [...sourceItems].sort((a, b) => (a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1) || (b.createdAt - a.createdAt));
  }, [allItems, allLists, isFavoritesMode]);
  
  const openMoveModal = (item: TodoItem) => {
    setItemToMove(item);
    setMoveModalOpen(true);
  };
  
  // 전체 삭제 핸들러
  const handleDeleteAll = () => {
    if (window.confirm(mode === 'favorites' ? '즐겨찾기 할일을 모두 삭제하시겠습니까?' : '모든 할일을 삭제하시겠습니까?')) {
      if (mode === 'favorites') {
        deleteItemsByFilter((item) => item.isFavorited && !item.isDeleted);
      } else {
        deleteItemsByFilter((item) => !item.isDeleted);
      }
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      {!showDefaultList && (
        <header className="flex items-center justify-between mb-8">
          <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
            <ArrowLeftIcon className="w-6 h-6" />
            <span className="font-semibold hidden sm:inline">대시보드로</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-indigo-500 bg-slate-100 dark:bg-slate-800 text-indigo-500 font-semibold hover:bg-indigo-50 dark:hover:bg-violet-700 transition-colors"
              title={mode === 'favorites' ? '즐겨찾기 할일 전체 삭제' : '모든 할일 전체 삭제'}
            >
              <TrashIcon className="w-5 h-5" />
              <span className="hidden sm:inline">할일 전체 삭제</span>
            </button>
            <button onClick={() => setView('dashboard')} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="대시보드로">
              <HomeIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </header>
      )}

      {!showDefaultList && (
        <h1 className="text-4xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-3">
          {isFavoritesMode ? (
            <>
              <StarIcon filled className="w-8 h-8 text-amber-400" />
              <span>즐겨찾기</span>
            </>
          ) : (
            "모든 TODO"
          )}
        </h1>
      )}

      <main className="space-y-3">
        {showDefaultList && defaultList ? (
          <>
            <header className="flex items-center justify-between mb-8">
              <button onClick={() => setShowDefaultList(false)} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                <ArrowLeftIcon className="w-6 h-6" />
                <span className="font-semibold hidden sm:inline">전체 할일 보기</span>
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (window.confirm('기본 할일을 모두 삭제하시겠습니까?')) {
                      deleteItemsByFilter((item) => item.listId === defaultList.listId && !item.isDeleted);
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-indigo-500 bg-slate-100 dark:bg-slate-800 text-indigo-500 font-semibold hover:bg-indigo-50 dark:hover:bg-violet-700 transition-colors"
                  title="기본 할일 전체 삭제"
                >
                  <TrashIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">할일 전체 삭제</span>
                </button>
                <button onClick={() => setView('dashboard')} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="대시보드로">
                  <HomeIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            </header>
            <h1 className="text-4xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-3">기본 할일 목록</h1>
            {defaultListItems.length > 0 ? (
              defaultListItems.map(item => (
                <TodoItemComponent 
                  key={item.itemId} 
                  item={item} 
                  listName={defaultList.name} 
                  onMoveRequest={openMoveModal}
                />
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800/50 rounded-lg">
                <p>기본 할일이 없습니다.</p>
              </div>
            )}
          </>
        ) : (
          <>
            {sortedItems.length > 0 ? (
              sortedItems.map(item => (
                <TodoItemComponent 
                  key={item.itemId} 
                  item={item} 
                  listName={getListName(item.listId)} 
                  onMoveRequest={openMoveModal}
                />
              ))
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                 {isFavoritesMode ? (
                  <>
                    <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">즐겨찾기한 항목이 없습니다</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">할 일 항목의 별표를 클릭하여 즐겨찾기에 추가하세요.</p>
                  </>
                ) : (
                  <p className="text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800/50 rounded-lg">TODO 항목이 하나도 없네요!</p>
                )}
              </div>
            )}
          </>
        )}
      </main>
      {!showDefaultList && defaultList && (
        <div className="flex justify-center mt-10">
          <button onClick={() => setShowDefaultList(true)} className="px-6 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-colors">기본 할일 보기</button>
        </div>
      )}

      {itemToMove && (
        <MoveTodoModal 
          isOpen={isMoveModalOpen}
          onClose={() => setMoveModalOpen(false)}
          itemToMove={itemToMove}
        />
      )}
    </div>
  );
};

export default AllTodosView;
