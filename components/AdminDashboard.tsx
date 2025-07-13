import React, { useEffect, useState } from 'react';

// 실제 서비스에서는 서버리스 함수나 Supabase Admin API를 통해 사용자 목록을 받아와야 합니다.
// 여기서는 예시 데이터와 안내 메시지로 대체합니다.

const exampleUsers = [
  { id: '1', email: 'byungwook.an@gmail.com', created_at: '2023-01-01', isAdmin: true },
  { id: '2', email: 'user1@example.com', created_at: '2023-02-01', isAdmin: false },
  { id: '3', email: 'user2@example.com', created_at: '2023-03-01', isAdmin: false },
];

const exampleStats = {
  userCount: 3,
  todoCount: 42,
  listCount: 7,
};

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState(exampleUsers);
  const [stats, setStats] = useState(exampleStats);

  // 실제 구현 시, 서버리스 함수/백엔드 API로 사용자/통계 데이터를 받아와야 함
  useEffect(() => {
    // fetchUsers();
    // fetchStats();
  }, []);

  const handleDisableUser = (userId: string) => {
    alert('사용자 비활성화 기능은 서버에서 구현해야 합니다.');
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">관리자 대시보드</h2>
      <div className="mb-6 p-4 bg-slate-100 rounded-lg">
        <h3 className="font-semibold mb-2">전체 통계</h3>
        <div>가입자 수: {stats.userCount}</div>
        <div>전체 할 일 수: {stats.todoCount}</div>
        <div>전체 리스트 수: {stats.listCount}</div>
      </div>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">사용자 목록</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-slate-200">
              <th className="p-2">이메일</th>
              <th className="p-2">가입일</th>
              <th className="p-2">관리자</th>
              <th className="p-2">비활성화</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t">
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.created_at}</td>
                <td className="p-2">{user.isAdmin ? 'O' : ''}</td>
                <td className="p-2">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded disabled:opacity-50"
                    onClick={() => handleDisableUser(user.id)}
                    disabled={user.isAdmin}
                  >
                    비활성화
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-sm text-slate-500">
        실제 사용자/통계 데이터는 서버리스 함수 또는 Supabase Admin API를 통해 받아와야 합니다.<br />
        (클라이언트에서 auth.users 테이블 직접 접근은 불가)
      </div>
    </div>
  );
};

export default AdminDashboard; 