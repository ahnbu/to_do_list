
import React, { useState, useContext, useEffect, useRef } from 'react';
import type { TodoItem } from '../types';
import { AppContext } from '../context/AppContext';
import { CheckIcon, EditIcon, TrashIcon, MoveIcon, StarIcon } from './icons';

interface TodoItemProps {
  item: TodoItem;
  listName?: string;
  onMoveRequest: (item: TodoItem) => void;
}

const TodoItemComponent: React.FC<TodoItemProps> = ({ item, listName, onMoveRequest }) => {
  const context = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(item.content);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);
  
  if (!context) return null;
  const { toggleItemCompletion, updateItem, deleteItem, toggleItemFavorite } = context;

  const handleUpdate = () => {
    if (content.trim() && content.trim() !== item.content) {
      updateItem(item.itemId, content.trim());
    } else {
      setContent(item.content);
    }
    setIsEditing(false);
  };
  
  return (
    <div className={`group flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm transition-colors duration-300 ${item.isCompleted ? 'opacity-50' : ''}`}>
      <button onClick={() => toggleItemCompletion(item.itemId)} className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${item.isCompleted ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400'}`}>
        {item.isCompleted && <CheckIcon className="w-4 h-4 text-white" />}
      </button>
      
      <div className="ml-4 flex-grow">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleUpdate}
            onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
            className="w-full bg-transparent focus:outline-none text-slate-800 dark:text-slate-100"
          />
        ) : (
          <p className={`text-slate-800 dark:text-slate-100 ${item.isCompleted ? 'line-through' : ''}`} onDoubleClick={() => setIsEditing(true)}>
            {item.content}
          </p>
        )}
        {listName && <span className="text-xs text-indigo-500 dark:text-indigo-400 font-medium">{listName}</span>}
      </div>
      
      <div className={`flex items-center gap-1 ml-2 transition-opacity ${
        context.settings.alwaysShowItemActions 
          ? 'opacity-100' 
          : 'opacity-0 group-hover:opacity-100 hover:!opacity-100 focus-within:!opacity-100'
      }`}>
        <button onClick={() => toggleItemFavorite(item.itemId)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
          <StarIcon filled={item.isFavorited} className={`w-4 h-4 ${item.isFavorited ? 'text-amber-400' : 'text-slate-500 dark:text-slate-400'}`} />
        </button>
        <button onClick={() => onMoveRequest(item)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
          <MoveIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        </button>
        <button onClick={() => deleteItem(item.itemId)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
          <TrashIcon className="w-4 h-4 text-red-500" />
        </button>
      </div>
    </div>
  );
};
export default TodoItemComponent;
