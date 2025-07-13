
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import type { TodoItem } from '../types';
import Modal from './Modal';

interface MoveTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToMove: TodoItem;
}

const MoveTodoModal: React.FC<MoveTodoModalProps> = ({ isOpen, onClose, itemToMove }) => {
  const context = useContext(AppContext);
  const [targetListId, setTargetListId] = useState<string>('');
  
  if (!context) return null;
  const { lists, moveItem } = context;

  const availableLists = lists.filter(list => list.listId !== itemToMove.listId);

  React.useEffect(() => {
    if (availableLists.length > 0) {
      setTargetListId(availableLists[0].listId);
    }
  }, [isOpen, availableLists]);

  const handleMove = () => {
    if (targetListId) {
      moveItem(itemToMove.itemId, targetListId);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="할 일 이동">
      <div className="mt-4">
        <p className="text-slate-600 dark:text-slate-400 mb-4">"<span className="font-bold">{itemToMove.content}</span>" 항목을 이동할 리스트를 선택하세요.</p>
        {availableLists.length > 0 ? (
          <>
            <select
              value={targetListId}
              onChange={(e) => setTargetListId(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            >
              {availableLists.map(list => (
                <option key={list.listId} value={list.listId}>{list.name}</option>
              ))}
            </select>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={onClose} className="py-2 px-4 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold transition-colors">취소</button>
              <button onClick={handleMove} className="py-2 px-4 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-colors">이동</button>
            </div>
          </>
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400 py-4">이동할 다른 리스트가 없습니다.</p>
        )}
      </div>
    </Modal>
  );
};

export default MoveTodoModal;
