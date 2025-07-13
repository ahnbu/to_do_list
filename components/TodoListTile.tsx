import React, { useContext, useState } from 'react';
import type { TodoList, TodoItem } from '../types';
import { AppContext } from '../context/AppContext';
import { StarIcon } from './icons';

interface TodoListTileProps {
  list: TodoList;
  totalCount: number;
  completedCount: number;
  itemsPreview: TodoItem[];
  showItemsInDashboard: boolean;
}

const TodoListTile: React.FC<TodoListTileProps> = ({ list, totalCount, completedCount, itemsPreview, showItemsInDashboard }) => {
  const context = useContext(AppContext);
  const [newTodo, setNewTodo] = useState('');
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleTileClick = (e?: React.MouseEvent) => {
    // 인풋 클릭 등에서 focus 진입 방지
    if (e && (e.target as HTMLElement).closest('.todo-input-area')) return;
    context?.setView('focus', list.listId);
  };

  const handleAddTodo = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newTodo.trim() && context) {
      context.addItem(list.listId, newTodo.trim());
      setNewTodo('');
    }
  };
  
  return (
    <div 
      onClick={handleTileClick}
      className="bg-[#1E293B] p-4 sm:p-6 rounded-2xl transition-colors duration-300 cursor-pointer flex flex-col hover:bg-[#334155] h-full"
    >
      <div className="flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-4 truncate">{list.name}</h3>
        {showItemsInDashboard && itemsPreview.length > 0 && (
            <div className="mb-4 space-y-2">
                {itemsPreview.map(item => (
                    <div key={item.itemId} className="flex items-center">
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); context?.toggleItemFavorite(item.itemId); }}
                          className="mr-2 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                          <StarIcon filled={item.isFavorited} className={`w-4 h-4 ${item.isFavorited ? 'text-amber-400' : 'text-slate-400'}`} />
                        </button>
                        <input
                          type="checkbox"
                          checked={item.isCompleted}
                          onClick={e => e.stopPropagation()}
                          onChange={() => context?.toggleItemCompletion(item.itemId)}
                          className="w-4 h-4 rounded-sm border-2 border-slate-500 mr-2 bg-slate-800 focus:ring-indigo-500"
                        />
                        <p className={`text-sm truncate ${item.isCompleted ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{item.content}</p>
                    </div>
                ))}
            </div>
        )}
        <div className="text-sm text-slate-400">
          <p>{completedCount} / {totalCount} 완료</p>
        </div>
      </div>
      <div className="mt-auto flex flex-col gap-0">
        <form className="todo-input-area mt-4 flex gap-2 w-full" onClick={e => e.stopPropagation()} onSubmit={handleAddTodo}>
          <input
            type="text"
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
            placeholder="새 할일 입력..."
            className="flex-1 min-w-0 px-2 sm:px-3 py-2 rounded-lg bg-slate-800 text-slate-100 border border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-xs sm:text-sm"
          />
          <button
            type="submit"
            className="px-3 sm:px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap"
          >
            추가
          </button>
        </form>
        <div className="mt-6">
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-indigo-500 h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-right text-xs text-slate-400 mt-2">{progress}%</p>
        </div>
      </div>
    </div>
  );
};

export default TodoListTile;