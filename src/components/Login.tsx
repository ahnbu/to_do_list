
import React, { useContext, useState } from 'react';
import { AppContext } from "../../context/AppContext";
import { signUpWithEmail, signInWithEmail } from "../../src/lib/supabaseClient";

const Login: React.FC = () => {
  const context = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const handleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        const { data, error } = await signInWithEmail(email, password);
        if (error || !data.session) throw error || new Error('로그인 실패');
        context?.login && context.login();
      } else {
        const { data, error } = await signUpWithEmail(email, password);
        if (error || !data.user) throw error || new Error('회원가입 실패');
        alert('회원가입 성공! 이메일 인증 후 로그인하세요.');
        setMode('login');
      }
    } catch (err: any) {
      setError(err?.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">모던 TODO 리스트</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">당신의 하루를 체계적으로 관리하세요.</p>
        <div className="mb-4">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full mb-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="current-password"
          />
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 mb-2"
        >
          {loading ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입'}
        </button>
        <button
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="w-full text-blue-500 hover:underline text-sm mb-2"
        >
          {mode === 'login' ? '회원가입' : '로그인'}으로 전환
        </button>
      </div>
    </div>
  );
};

export default Login;
