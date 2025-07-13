
import React, { useContext, useState, useMemo, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { DEFAULT_LIST_NAME } from '../context/AppContext';
import TodoItemComponent from './TodoItem';
import { ArrowLeftIcon, EditIcon, TrashIcon, PlusIcon, HomeIcon } from './icons';
import Modal from './Modal';
import MoveTodoModal from './MoveTodoModal';
import type { TodoItem } from '../types';

interface FocusViewProps {
  listId: string;
}

const FocusView: React.FC<FocusViewProps> = ({ listId }) => {
  const context = useContext(AppContext);
  const [newTodoContent, setNewTodoContent] = useState('');
  const [isEditingListName, setIsEditingListName] = useState(false);
  const [currentListName, setCurrentListName] = useState('');
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isMoveModalOpen, setMoveModalOpen] = useState(false);
  const [itemToMove, setItemToMove] = useState<TodoItem | null>(null);

  const list = useMemo(() => context?.lists.find(l => l.listId === listId), [context?.lists, listId]);
  
  useEffect(() => {
    if (list) {
      setCurrentListName(list.name);
    }
  }, [list]);

  if (!context || !list) {
    // This can happen briefly if a list is deleted.
    // A more robust solution might redirect, but for now, showing nothing is fine.
    return <div className="p-8 text-center">리스트를 찾을 수 없습니다. 대시보드로 돌아가세요.</div>;
  }

  const { items, setView, updateList, deleteList, addItem, deleteItemsByFilter } = context;

  const listItems = useMemo(() => 
    items.filter(item => item.listId === listId)
         .sort((a,b) => (a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1) || (b.createdAt - a.createdAt)),
    [items, listId]
  );
  
  const handleAddItem = () => {
    if (newTodoContent.trim()) {
      addItem(listId, newTodoContent.trim());
      setNewTodoContent('');
    }
  };

  const handleListNameUpdate = () => {
    // '기본' 목록은 이름 변경 불가
    if (list.name === DEFAULT_LIST_NAME) {
      alert('"기본" 목록의 이름은 변경할 수 없습니다.');
      setCurrentListName(list.name);
      setIsEditingListName(false);
      return;
    }
    if (currentListName.trim() && currentListName.trim() !== list.name) {
      updateList(listId, currentListName.trim());
    } else {
      setCurrentListName(list.name);
    }
    setIsEditingListName(false);
  };
  
  const handleDeleteList = () => {
    deleteList(listId);
    setView('dashboard');
    setDeleteModalOpen(false);
  };

  // 리스트 전체 할일 삭제
  const handleDeleteAllItems = () => {
    if (window.confirm('이 리스트의 모든 할일을 삭제하시겠습니까?')) {
      deleteItemsByFilter((item) => item.listId === listId && !item.isDeleted);
    }
  };

  const openMoveModal = (item: TodoItem) => {
    setItemToMove(item);
    setMoveModalOpen(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex items-center justify-between mb-8">
        <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
          <ArrowLeftIcon className="w-6 h-6" />
          <span className="font-semibold hidden sm:inline">대시보드로</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDeleteAllItems}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-indigo-500 bg-slate-100 dark:bg-slate-800 text-indigo-500 font-semibold hover:bg-indigo-50 dark:hover:bg-violet-700 transition-colors"
            title="이 목록의 모든 할일 삭제"
          >
            <TrashIcon className="w-5 h-5" />
            <span className="hidden sm:inline">할일 전체 삭제</span>
          </button>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-colors"
            title="이 목록 자체 삭제"
          >
            <TrashIcon className="w-5 h-5 text-white" />
            <span className="hidden sm:inline">목록 삭제</span>
          </button>
          <button onClick={() => setView('dashboard')} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="대시보드로">
              <HomeIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </header>

      {isEditingListName ? (
        list.name === DEFAULT_LIST_NAME ? (
          <h1 className="text-4xl font-bold mb-6 text-slate-800 dark:text-slate-100">{list.name}</h1>
        ) : (
          <input
            type="text"
            value={currentListName}
            onChange={(e) => setCurrentListName(e.target.value)}
            onBlur={handleListNameUpdate}
            onKeyPress={(e) => e.key === 'Enter' && handleListNameUpdate()}
            className="text-4xl font-bold w-full bg-transparent border-b-2 border-indigo-500 focus:outline-none mb-6 text-slate-800 dark:text-slate-100"
            autoFocus
          />
        )
      ) : (
        <h1 className="text-4xl font-bold mb-6 text-slate-800 dark:text-slate-100 cursor-pointer" onClick={() => list.name !== DEFAULT_LIST_NAME && setIsEditingListName(true)}>{list.name}</h1>
      )}

      <main className="space-y-3">
        {listItems.length > 0 ? (
          listItems.map(item => <TodoItemComponent key={item.itemId} item={item} onMoveRequest={openMoveModal} />)
        ) : (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800/50 rounded-lg">
            <p>아직 할 일이 없네요.</p>
            <p>첫 번째 할 일을 추가해보세요!</p>
          </div>
        )}
      </main>

      <footer className="mt-8 flex gap-2">
        <input
          type="text"
          value={newTodoContent}
          onChange={(e) => setNewTodoContent(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          placeholder="새로운 할 일 추가..."
          className="flex-grow px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
        />
        <button onClick={handleAddItem} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold p-3 rounded-lg transition-colors shadow-md flex-shrink-0">
          <PlusIcon className="w-6 h-6" />
        </button>
      </footer>
      
      <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="리스트 삭제 확인">
        <p className="mt-2 text-slate-600 dark:text-slate-400">"{list.name}" 리스트를 정말로 삭제하시겠습니까? 이 리스트에 포함된 모든 할 일도 함께 삭제되며, 이 작업은 되돌릴 수 없습니다.</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setDeleteModalOpen(false)} className="py-2 px-4 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold transition-colors">취소</button>
          <button onClick={handleDeleteList} className="py-2 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors">삭제</button>
        </div>
      </Modal>

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

export default FocusView;
