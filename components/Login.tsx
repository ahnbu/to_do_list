
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Login: React.FC = () => {
  const context = useContext(AppContext);

  const handleLogin = () => {
    context?.login();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">모던 TODO 리스트</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">당신의 하루를 체계적으로 관리하세요.</p>
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          <svg className="w-6 h-6" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.655-3.373-11.303-8H6.306C9.656,39.663,16.318,44,24,44z"></path>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.297,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
          Google 계정으로 시작하기
        </button>
      </div>
    </div>
  );
};

export default Login;
