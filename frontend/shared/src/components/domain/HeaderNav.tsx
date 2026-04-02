import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, Video, Menu, X } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { UserAvatar } from '../base/UserAvatar';

interface HeaderNavProps {
  keyword?: string;
  onSearch?: (kw: string) => void;
  className?: string;
}

export function HeaderNav({ keyword: initialKeyword = '', onSearch, className = '' }: HeaderNavProps) {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userInfo, isLoggedIn, logout } = useUserStore();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(keyword);
    } else {
      navigate(`/video/search?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar bg-base-100 border-b border-base-200 px-4 ${className}`}>
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl font-bold tracking-tight">
          LiBiLiBi
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex-none join">
        <input
          type="text"
          placeholder="搜索视频..."
          className="input input-bordered join-item w-48 md:w-64"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit" className="btn btn-primary join-item">
          <Search className="w-4 h-4" />
        </button>
      </form>

      <div className="flex-none md:hidden ml-2">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="hidden md:flex items-center gap-2 ml-4">
        {isLoggedIn && userInfo ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="flex items-center gap-2 cursor-pointer">
              <UserAvatar src={userInfo.avatar} size="sm" userId={userInfo.id} />
              <span className="text-sm">{userInfo.username}</span>
            </div>
            <ul className="dropdown-content z-50 menu p-2 shadow-lg bg-base-100 rounded-box w-48 border border-base-200">
              <li>
                <Link to="/user/profile" className="gap-2">
                  <User className="w-4 h-4" />
                  个人中心
                </Link>
              </li>
              <li>
                <Link to="/video/publish" className="gap-2">
                  <Video className="w-4 h-4" />
                  投稿
                </Link>
              </li>
              <li>
                <button type="button" onClick={handleLogout} className="gap-2 text-error">
                  <LogOut className="w-4 h-4" />
                  退出
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <Link to="/user/login" className="btn btn-ghost btn-sm">
              登录
            </Link>
            <Link to="/user/register" className="btn btn-primary btn-sm">
              注册
            </Link>
          </>
        )}
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-base-100 border-b border-base-200 p-4 md:hidden z-50">
          {isLoggedIn && userInfo ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <UserAvatar src={userInfo.avatar} size="sm" userId={userInfo.id} />
                <span className="text-sm font-medium">{userInfo.username}</span>
              </div>
              <ul className="menu menu-sm w-full">
                <li>
                  <Link to="/user/profile" onClick={() => setMobileMenuOpen(false)}>
                    个人中心
                  </Link>
                </li>
                <li>
                  <Link to="/video/publish" onClick={() => setMobileMenuOpen(false)}>
                    投稿
                  </Link>
                </li>
                <li>
                  <button type="button" onClick={handleLogout} className="text-error">
                    退出
                  </button>
                </li>
              </ul>
            </>
          ) : (
            <ul className="menu menu-sm w-full">
              <li>
                <Link to="/user/login" onClick={() => setMobileMenuOpen(false)}>
                  登录
                </Link>
              </li>
              <li>
                <Link to="/user/register" onClick={() => setMobileMenuOpen(false)}>
                  注册
                </Link>
              </li>
            </ul>
          )}
        </div>
      )}
    </nav>
  );
}
