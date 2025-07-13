import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 이메일 회원가입
export async function signUpWithEmail(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

// 이메일 로그인
export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

// 현재 로그인한 사용자 정보
export function getCurrentUser() {
  return supabase.auth.getUser();
}

// 로그아웃
export function signOut() {
  return supabase.auth.signOut();
} 