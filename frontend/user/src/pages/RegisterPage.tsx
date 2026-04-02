import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userRegister } from '@libiland/shared';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('请填写所有字段');
      return;
    }
    if (!/^[a-zA-Z0-9_]{3,12}$/.test(username)) {
      setError('用户名需为3-12位字母/数字/下划线');
      return;
    }
    if (password.length < 6 || password.length > 20) {
      setError('密码需为6-20位');
      return;
    }
    if (password !== confirmPassword) {
      setError('两次密码输入不一致');
      return;
    }

    setLoading(true);
    const res = await userRegister({ username, password });
    setLoading(false);

    if (res.code === 200) {
      navigate('/user/login');
    } else {
      setError(res.msg || '注册失败');
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card bg-base-100 w-full max-w-md shadow-lg">
        <div className="card-body gap-4">
          <h1 className="text-2xl font-bold text-center">注册</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="alert alert-error text-sm py-2">
                <span>{error}</span>
              </div>
            )}
            <div className="form-control">
              <label className="label" htmlFor="username">
                <span className="label-text">用户名</span>
              </label>
              <input
                id="username"
                type="text"
                className="input input-bordered"
                placeholder="3-12位字母/数字/下划线"
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
                placeholder="6-20位密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="confirmPassword">
                <span className="label-text">确认密码</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="input input-bordered"
                placeholder="再次输入密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? '注册中...' : '注册'}
            </button>
          </form>
          <p className="text-center text-sm text-base-content/60">
            已有账号？<Link to="/user/login" className="link link-primary">立即登录</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
