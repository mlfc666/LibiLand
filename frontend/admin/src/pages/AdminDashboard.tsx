import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Film, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import { getAdminStats } from '@libiland/shared';
import type { AdminStats } from '@libiland/shared';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then((res) => {
      if (res.code === 200) setStats(res.data);
      setLoading(false);
    });
  }, []);

  const statCards = [
    { label: '用户总数', value: stats?.totalUsers ?? '-', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', href: '/admin/user' },
    { label: '视频总数', value: stats?.totalVideos ?? '-', icon: Film, color: 'text-green-500', bg: 'bg-green-500/10', href: '/admin/audit' },
    { label: '待审核视频', value: stats?.pendingVideos ?? '-', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', href: '/admin/audit' },
    { label: '待处理举报', value: stats?.pendingReports ?? '-', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10', href: '/admin/report' },
  ];

  const quickLinks = [
    { label: '视频审核', href: '/admin/audit', desc: '审核待发布视频' },
    { label: '用户管理', href: '/admin/user', desc: '查看/封禁用户' },
    { label: '举报处理', href: '/admin/report', desc: '处理用户举报' },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 border-b border-base-200">
        <div className="flex-1">
          <span className="text-xl font-bold">管理后台</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">数据概览</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((card) => (
                <Link key={card.label} to={card.href} className="card bg-base-100 shadow hover:shadow-md transition-shadow">
                  <div className="card-body items-center text-center">
                    <div className={`p-3 rounded-full ${card.bg}`}>
                      <card.icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                    <p className="text-3xl font-bold mt-2">{card.value}</p>
                    <p className="text-sm text-base-content/60">{card.label}</p>
                  </div>
                </Link>
              ))}
            </div>

            <h2 className="text-lg font-bold mb-4">快捷入口</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="card bg-base-100 shadow hover:shadow-md transition-shadow"
                >
                  <div className="card-body flex-row items-center justify-between">
                    <div>
                      <p className="font-medium">{link.label}</p>
                      <p className="text-xs text-base-content/50 mt-1">{link.desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-base-content/30" />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
