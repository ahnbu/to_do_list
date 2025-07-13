
export interface User {
  userId: string;
  email: string;
  displayName: string;
  photoURL: string;
}

export interface TodoList {
  listId: string;
  userId: string;
  name: string;
  createdAt: number;
  isDeleted?: boolean;
}

export interface TodoItem {
  itemId: string;
  listId: string;
  userId:string;
  content: string;
  isCompleted: boolean;
  createdAt: number;
  isFavorited: boolean;
  isDeleted?: boolean;
}

export interface Settings {
  showItemsInDashboard: boolean;
  alwaysShowItemActions: boolean;
  showDefaultList: boolean; // "기본" 할일 목록 보이기/숨기기
}

export type View = 'dashboard' | 'focus' | 'all' | 'favorites';