import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '@libiland/shared';
import { useUserStore } from '@libiland/shared';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useUserStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('请填写用户名和密码');
      return;
    }
    setLoading(true);
    setError('');
    const res = await adminLogin({ username, password });
    setLoading(false);
    if (res.code === 200) {
      login(res.data);
      navigate('/admin/dashboard');
    } else {
      setError(res.msg || '登录失败');
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card bg-base-100 w-full max-w-md shadow-lg">
        <div className="card-body gap-4">
          <h1 className="text-2xl font-bold text-center">管理后台登录</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="alert alert-error text-sm py-2">
                <span>{error}</span>
              </div>
            )}
            <div className="form-control">
              <label className="label" htmlFor="username">
                <span className="label-text">管理员账号</span>
              </label>
              <input
                id="username"
                type="text"
                className="input input-bordered"
                placeholder="请输入管理员用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">密码</span>
              </label>
              <input
                id="password"
                type="password"
                className="input input-bordered"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
          <p className="text-center text-xs text-base-content/40">
            管理员账号: admin / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
