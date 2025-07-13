import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { storage } from '../utils/storage';

const StorageStatus: React.FC = () => {
  const context = useContext(AppContext);
  const [isStorageAvailable, setIsStorageAvailable] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const checkStorage = () => {
      const available = storage.isAvailable();
      setIsStorageAvailable(available);
      
      if (!available && !showWarning) {
        setShowWarning(true);
      }
    };

    checkStorage();
    
    // 스토리지 상태를 주기적으로 확인
    const interval = setInterval(checkStorage, 5000);
    
    return () => clearInterval(interval);
  }, [showWarning]);

  if (!isStorageAvailable && showWarning) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-sm z-50">
        <div className="flex items-start gap-3">
          <div className="text-xl">⚠️</div>
          <div>
            <h3 className="font-semibold mb-1">데이터 저장 불가</h3>
            <p className="text-sm opacity-90">
              로컬 스토리지에 접근할 수 없습니다. 
              데이터가 저장되지 않을 수 있습니다.
            </p>
            <button 
              onClick={() => setShowWarning(false)}
              className="text-xs underline mt-2 hover:opacity-80"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StorageStatus; 