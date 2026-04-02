import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Ban, CheckCircle, Download } from 'lucide-react';
import { getUserList, banUser, unbanUser } from '@libiland/shared';
import type { UserInfo } from '@libiland/shared';
import { formatDate } from '@libiland/shared';

export default function UserManagePage() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState(-1);
  const [processing, setProcessing] = useState<number | null>(null);

  const loadUsers = () => {
    setLoading(true);
    getUserList({ keyword: keyword || undefined, status: statusFilter }).then((res) => {
      if (res.code === 200) setUsers(res.data?.list || []);
      setLoading(false);
    });
  };

  useEffect(() => { loadUsers(); }, [keyword, statusFilter]);

  const handleBan = async (id: number) => {
    setProcessing(id);
    const res = await banUser(id);
    setProcessing(null);
    if (res.code === 200) {
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: 1 } : u));
    }
  };

  const handleUnban = async (id: number) => {
    setProcessing(id);
    const res = await unbanUser(id);
    setProcessing(null);
    if (res.code === 200) {
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: 0 } : u));
    }
  };

  const handleExport = () => {
    const csv = [
      ['ID', '用户名', '角色', '状态', '硬币', '经验', '注册时间'].join(','),
      ...users.map((u) => [u.id, u.username, u.role, u.status === 0 ? '正常' : '已封禁', u.coins, u.experience, formatDate(u.createdAt)].join(',')),
    ].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 border-b border-base-200">
        <div className="flex-1">
          <span className="text-xl font-bold">用户管理</span>
        </div>
        <div className="flex-none gap-2">
          <button type="button" className="btn btn-sm btn-ghost gap-1" onClick={handleExport}>
            <Download className="w-4 h-4" />
            导出CSV
          </button>
          <Link to="/admin/dashboard" className="btn btn-ghost btn-sm">返回首页</Link>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="join">
            <input
              type="text"
              className="input input-bordered join-item w-48"
              placeholder="搜索用户名"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="button" className="btn join-item">
              <Search className="w-4 h-4" />
            </button>
          </div>
          <select
            className="select select-bordered select-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(Number(e.target.value))}
          >
            <option value={-1}>全部状态</option>
            <option value={0}>正常</option>
            <option value={1}>已封禁</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : (
          <div className="bg-base-100 rounded-lg shadow overflow-hidden">
            <table className="table">
              <thead>
                <tr className="bg-base-200">
                  <th>ID</th>
                  <th>用户名</th>
                  <th>角色</th>
                  <th>状态</th>
                  <th>硬币</th>
                  <th>经验</th>
                  <th>注册时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="hover">
                    <td className="text-sm">{user.id}</td>
                    <td className="font-medium">{user.username}</td>
                    <td>
                      <span className={`badge ${user.role === 'ADMIN' ? 'badge-primary' : 'badge-ghost'}`}>
                        {user.role === 'ADMIN' ? '管理员' : '用户'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.status === 0 ? 'badge-success' : 'badge-error'}`}>
                        {user.status === 0 ? '正常' : '已封禁'}
                      </span>
                    </td>
                    <td className="text-sm">{user.coins}</td>
                    <td className="text-sm">{user.experience}</td>
                    <td className="text-sm text-base-content/60">{formatDate(user.createdAt)}</td>
                    <td>
                      {user.role !== 'ADMIN' && (
                        user.status === 0 ? (
                          <button
                            type="button"
                            className="btn btn-xs btn-error gap-1"
                            disabled={processing === user.id}
                            onClick={() => handleBan(user.id)}
                          >
                            <Ban className="w-3 h-3" />
                            封禁
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-xs btn-success gap-1"
                            disabled={processing === user.id}
                            onClick={() => handleUnban(user.id)}
                          >
                            <CheckCircle className="w-3 h-3" />
                            解封
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-base-content/50">暂无数据</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
