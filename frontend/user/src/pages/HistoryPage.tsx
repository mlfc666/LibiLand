import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { HeaderNav } from '@libiland/shared';
import { getHistory } from '@libiland/shared';
import type { HistoryItem } from '@libiland/shared';
import { formatRelativeTime } from '@libiland/shared';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory().then((res) => {
      if (res.code === 200) setItems(res.data?.list || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-base-200">
      <HeaderNav />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">观看历史</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-base-content/50 text-lg">暂无观看记录</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="card bg-base-100 shadow-sm hover:shadow transition-shadow cursor-pointer"
                onClick={() => navigate(`/video/detail/${item.videoId}`)}
              >
                <div className="card-body p-4 flex-row items-center gap-4">
                  <img
                    src={item.video.coverUrl || `https://picsum.photos/seed/${item.videoId}/160/90`}
                    alt={item.video.title}
                    className="w-28 h-16 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.video.title}</p>
                    <p className="text-xs text-base-content/60 mt-1">{item.video.authorName}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-base-content/50">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(item.watchedAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
