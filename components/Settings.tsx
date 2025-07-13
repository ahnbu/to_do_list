import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { SettingsIcon, XIcon } from './icons';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const context = useContext(AppContext);
  const [localSettings, setLocalSettings] = useState<{
    showItemsInDashboard: boolean;
    alwaysShowItemActions: boolean;
    showDefaultList: boolean;
  }>(context?.settings || {
    showItemsInDashboard: true,
    alwaysShowItemActions: true,
    showDefaultList: false
  });

  if (!context || !isOpen) return null;

  const { settings, updateSettings } = context;

  const handleSettingChange = (key: 'showItemsInDashboard' | 'alwaysShowItemActions' | 'showDefaultList', value: boolean) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
  };

  const handleSave = () => {
    updateSettings(localSettings);
    onClose();
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1E293B] rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white">설정</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <XIcon className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="space-y-6">
          {/* 할일 항목 액션 메뉴 설정 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">할일 항목 메뉴</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="itemActions"
                  checked={localSettings.alwaysShowItemActions}
                  onChange={() => handleSettingChange('alwaysShowItemActions', true)}
                  className="w-4 h-4 text-indigo-500 bg-slate-700 border-slate-600 focus:ring-indigo-500"
                />
                <span className="text-slate-300">항상 보이기</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="itemActions"
                  checked={!localSettings.alwaysShowItemActions}
                  onChange={() => handleSettingChange('alwaysShowItemActions', false)}
                  className="w-4 h-4 text-indigo-500 bg-slate-700 border-slate-600 focus:ring-indigo-500"
                />
                <span className="text-slate-300">마우스 오버시 보이기</span>
              </label>
            </div>
            <p className="text-sm text-slate-400">
              할일 항목 위에 마우스를 올렸을 때 나타나는 즐겨찾기, 편집, 삭제 등의 메뉴 표시 방식을 선택하세요.
            </p>
          </div>

          {/* 대시보드 할일 항목 표시 설정 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">대시보드 표시</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.showItemsInDashboard}
                  onChange={(e) => handleSettingChange('showItemsInDashboard', e.target.checked)}
                  className="w-4 h-4 text-indigo-500 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500"
                />
                <span className="text-slate-300">대시보드에서 할일 항목 보이기</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.showDefaultList}
                  onChange={(e) => handleSettingChange('showDefaultList', e.target.checked)}
                  className="w-4 h-4 text-indigo-500 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500"
                />
                <span className="text-slate-300">"기본" 할일 목록 보이기</span>
              </label>
            </div>
            <p className="text-sm text-slate-400">
              대시보드의 각 할일 목록에서 세부 할일 항목들을 표시할지, "기본" 할일 목록을 표시할지 선택하세요.
            </p>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 