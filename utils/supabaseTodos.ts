import { supabase } from '../lib/supabaseClient';
import type { TodoList, TodoItem } from '../types';

// 로그인한 사용자 ID 가져오기
async function getUserId() {
  const { data } = await supabase.auth.getUser();
  return data.user?.id;
}

// 리스트 불러오기
export async function fetchLists() {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('todo_lists')
    .select('*')
    .eq('user_id', userId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// 리스트 추가
export async function addList(name: string) {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('todo_lists')
    .insert([{ name, user_id: userId }])
    .select();
  if (error) throw error;
  return data;
}

// 리스트 삭제(soft delete)
export async function deleteList(listId: string) {
  const userId = await getUserId();
  const { error } = await supabase
    .from('todo_lists')
    .update({ is_deleted: true })
    .eq('list_id', listId)
    .eq('user_id', userId);
  if (error) throw error;
}

// 아이템 불러오기
export async function fetchItems(listId: string) {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('todo_items')
    .select('*')
    .eq('list_id', listId)
    .eq('user_id', userId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// 아이템 추가
export async function addItem(listId: string, content: string) {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('todo_items')
    .insert([{ list_id: listId, content, user_id: userId }])
    .select();
  if (error) throw error;
  return data;
}

// 아이템 완료/미완료 토글
export async function toggleItem(itemId: string, isCompleted: boolean) {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('todo_items')
    .update({ is_completed: isCompleted })
    .eq('item_id', itemId)
    .eq('user_id', userId)
    .select();
  if (error) throw error;
  return data;
}

// 아이템 삭제(soft delete)
export async function deleteItem(itemId: string) {
  const userId = await getUserId();
  const { error } = await supabase
    .from('todo_items')
    .update({ is_deleted: true })
    .eq('item_id', itemId)
    .eq('user_id', userId);
  if (error) throw error;
} 