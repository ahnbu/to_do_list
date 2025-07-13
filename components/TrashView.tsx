import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { ArrowLeftIcon, TrashIcon } from './icons';

const TrashView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const context = useContext(AppContext);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  if (!context) return null;
  const { allLists, allItems, restoreList, restoreItem, permanentlyDeleteList, permanentlyDeleteItem } = context as any;

  const deletedLists = allLists.filter((l: any) => l.isDeleted);
  const deletedItems = allItems.filter((i: any) => i.isDeleted);

  const handleRestoreItem = (itemId: string) => {
    const success = restoreItem(itemId);
    if (!success) {
      setErrorMessage('해당 항목이 속한 리스트가 삭제되어 복원할 수 없습니다. 리스트를 먼저 복원해주세요.');
      setTimeout(() => setErrorMessage(null), 5000); // 5초 후 메시지 제거
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex items-center justify-between mb-8">
        <button onClick={onClose} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
          <ArrowLeftIcon className="w-6 h-6" />
          <span className="font-semibold hidden sm:inline">대시보드로</span>
        </button>
        <h1 className="text-3xl font-bold text-red-500 flex items-center gap-2"><TrashIcon className="w-7 h-7" />휴지통</h1>
      </header>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-semibold">복원 불가</p>
          <p>{errorMessage}</p>
        </div>
      )}

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3 text-slate-700 dark:text-slate-200">삭제된 리스트</h2>
        {deletedLists.length === 0 ? (
          <p className="text-slate-400">삭제된 리스트가 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {deletedLists.map((list: any) => (
              <li key={list.listId} className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-200">{list.name}</span>
                <div className="flex gap-2">
                  <button onClick={() => restoreList(list.listId)} className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white text-sm">복원</button>
                  <button onClick={() => permanentlyDeleteList(list.listId)} className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm">영구삭제</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3 text-slate-700 dark:text-slate-200">삭제된 할일</h2>
        {deletedItems.length === 0 ? (
          <p className="text-slate-400">삭제된 할일이 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {deletedItems.map((item: any) => (
              <li key={item.itemId} className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-200">{item.content}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleRestoreItem(item.itemId)} className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white text-sm">복원</button>
                  <button onClick={() => permanentlyDeleteItem(item.itemId)} className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm">영구삭제</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default TrashView; 