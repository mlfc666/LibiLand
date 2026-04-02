import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Eye, ThumbsUp, Coins } from 'lucide-react';
import { HeaderNav, StatusBadge, ConfirmDialog } from '@libiland/shared';
import { getMyVideos, deleteVideo } from '@libiland/shared';
import type { Video } from '@libiland/shared';
import { formatDate, formatNumber } from '@libiland/shared';

export default function MyVideosPage() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    getMyVideos().then((res) => {
      if (res.code === 200) setVideos(res.data?.list || []);
      setLoading(false);
    });
  }, []);

  const handleDelete = async () => {
    if (deleteId === null) return;
    const res = await deleteVideo(deleteId);
    if (res.code === 200) {
      setVideos((prev) => prev.filter((v) => v.id !== deleteId));
    }
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <HeaderNav />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">我的投稿</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-base-content/50 text-lg mb-4">还没有投稿</p>
            <button type="button" className="btn btn-primary" onClick={() => navigate('/video/publish')}>
              发布第一个视频
            </button>
          </div>
        ) : (
          <div className="bg-base-100 rounded-lg shadow overflow-hidden">
            <table className="table">
              <thead>
                <tr className="bg-base-200">
                  <th className="w-24">封面</th>
                  <th>标题</th>
                  <th>状态</th>
                  <th>数据</th>
                  <th>发布时间</th>
                  <th className="w-20">操作</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr key={video.id} className="hover">
                    <td>
                      <img
                        src={video.coverUrl || `https://picsum.photos/seed/${video.id}/80/45`}
                        alt={video.title}
                        className="w-20 rounded object-cover cursor-pointer"
                        onClick={() => navigate(`/video/detail/${video.id}`)}
                      />
                    </td>
                    <td>
                      <p className="font-medium text-sm truncate max-w-xs" title={video.title}>{video.title}</p>
                    </td>
                    <td><StatusBadge status={video.status} /></td>
                    <td>
                      <div className="flex gap-2 text-xs text-base-content/60">
                        <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{formatNumber(video.clicks)}</span>
                        <span className="flex items-center gap-0.5"><ThumbsUp className="w-3 h-3" />{formatNumber(video.likes)}</span>
                        <span className="flex items-center gap-0.5"><Coins className="w-3 h-3" />{formatNumber(video.coins)}</span>
                      </div>
                    </td>
                    <td className="text-sm text-base-content/60">
                      {formatDate(video.publishedAt || video.createdAt)}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-xs btn-ghost text-error"
                        onClick={() => setDeleteId(video.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <ConfirmDialog
        open={deleteId !== null}
        title="删除视频"
        message="确定要删除这个视频吗？此操作不可恢复。"
        danger
        confirmText="删除"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
