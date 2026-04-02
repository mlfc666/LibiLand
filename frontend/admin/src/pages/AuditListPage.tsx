import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Check, X } from 'lucide-react';
import { UserAvatar, ConfirmDialog } from '@libiland/shared';
import { getPendingVideos, approveVideo, rejectVideo } from '@libiland/shared';
import type { Video } from '@libiland/shared';
import { formatDate } from '@libiland/shared';

export default function AuditListPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    getPendingVideos().then((res) => {
      if (res.code === 200) setVideos(res.data?.list || []);
      setLoading(false);
    });
  }, []);

  const handleApprove = async (id: number) => {
    setProcessing(id);
    const res = await approveVideo(id);
    setProcessing(null);
    if (res.code === 200) {
      setVideos((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const handleReject = async () => {
    if (rejectId === null) return;
    setProcessing(rejectId);
    const res = await rejectVideo(rejectId, rejectReason);
    setProcessing(null);
    if (res.code === 200) {
      setVideos((prev) => prev.filter((v) => v.id !== rejectId));
    }
    setRejectId(null);
    setRejectReason('');
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 border-b border-base-200">
        <div className="flex-1">
          <span className="text-xl font-bold">视频审核</span>
        </div>
        <div className="flex-none">
          <Link to="/admin/dashboard" className="btn btn-ghost btn-sm">返回首页</Link>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-base-content/50">暂无待审核视频</p>
          </div>
        ) : (
          <div className="space-y-4">
            {videos.map((video) => (
              <div key={video.id} className="card bg-base-100 shadow">
                <div className="card-body">
                  <div className="flex gap-4">
                    <img
                      src={video.coverUrl || `https://picsum.photos/seed/${video.id}/160/90`}
                      alt={video.title}
                      className="w-40 h-24 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate">{video.title}</h3>
                      <p className="text-sm text-base-content/60 mt-1 line-clamp-2">{video.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <UserAvatar src={video.authorAvatar} size="xs" userId={video.authorId} />
                        <span className="text-sm">{video.authorName}</span>
                        <span className="text-xs text-base-content/40">{formatDate(video.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost gap-1"
                        onClick={() => window.open(`/video/detail/${video.id}`, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                        预览
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-success gap-1"
                        disabled={processing === video.id}
                        onClick={() => handleApprove(video.id)}
                      >
                        <Check className="w-4 h-4" />
                        通过
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-error gap-1"
                        onClick={() => setRejectId(video.id)}
                      >
                        <X className="w-4 h-4" />
                        驳回
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <ConfirmDialog
        open={rejectId !== null}
        title="驳回视频"
        confirmText="确认驳回"
        danger
        onConfirm={handleReject}
        onCancel={() => { setRejectId(null); setRejectReason(''); }}
      >
        <div className="py-2">
          <label className="label"><span className="label-text">驳回原因</span></label>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={3}
            placeholder="请输入驳回原因"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </div>
      </ConfirmDialog>
    </div>
  );
}
