import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThumbsUp, Coins, Bookmark, Eye, MessageSquare, AlertTriangle } from 'lucide-react';
import {
  HeaderNav,
  UserAvatar,
  AiTagBadge,
  CommentTree,
} from '@libiland/shared';
import { useUserStore } from '@libiland/shared';
import {
  getVideoDetail,
  getCommentList,
  recordHistory,
  toggleLike,
  toggleCollect,
  throwCoin,
  publishComment,
  deleteComment,
  reportVideo,
} from '@libiland/shared';
import type { Video, Comment } from '@libiland/shared';
import { formatNumber, formatDate } from '@libiland/shared';

const REPORT_REASONS: Record<number, string> = {
  1: '违法违规',
  2: '色情低俗',
  3: '暴力血腥',
  4: '垃圾广告',
  5: '其他',
};

export default function VideoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const videoId = Number(id);
  const navigate = useNavigate();
  const { userInfo } = useUserStore();

  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(false);
  const [collected, setCollected] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Report dialog state
  const [showReport, setShowReport] = useState(false);
  const [reportReasonType, setReportReasonType] = useState<number>(1);
  const [reportReasonDetail, setReportReasonDetail] = useState('');

  useEffect(() => {
    if (!videoId) return;
    setLoading(true);
    Promise.all([
      getVideoDetail(videoId),
      getCommentList(videoId),
    ]).then(([vRes, cRes]) => {
      if (vRes.code === 200) setVideo(vRes.data);
      if (cRes.code === 200) setComments(cRes.data?.list || []);
      setLoading(false);
    });
    recordHistory(videoId);
  }, [videoId]);

  const handleLike = async () => {
    if (!userInfo) { navigate('/user/login'); return; }
    const res = await toggleLike(videoId);
    if (res.code === 200) setLiked(!liked);
  };

  const handleCollect = async () => {
    if (!userInfo) { navigate('/user/login'); return; }
    const res = await toggleCollect(videoId);
    if (res.code === 200) setCollected(!collected);
  };

  const handleCoin = async () => {
    if (!userInfo) { navigate('/user/login'); return; }
    const res = await throwCoin(videoId);
    if (res.code === 200) {
      setVideo((v) => v ? { ...v, coins: v.coins + 1 } : v);
    }
  };

  const handleCommentSubmit = async () => {
    if (!userInfo) { navigate('/user/login'); return; }
    if (!commentText.trim()) return;
    setSubmitting(true);
    const res = await publishComment({
      videoId,
      content: commentText,
      parentId: replyTo?.id,
    });
    setSubmitting(false);
    if (res.code === 200) {
      setComments((prev) => [res.data!, ...prev]);
      setCommentText('');
      setReplyTo(null);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    await deleteComment(commentId);
    setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, status: 0 } : c));
  };

  const handleReportSubmit = async () => {
    await reportVideo({ videoId, reasonType: reportReasonType as 1 | 2 | 3 | 4 | 5, reasonDetail: reportReasonDetail });
    setShowReport(false);
    setReportReasonDetail('');
    setReportReasonType(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200">
        <HeaderNav />
        <div className="flex items-center justify-center min-h-64">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-base-200">
        <HeaderNav />
        <div className="text-center py-20">
          <p className="text-lg text-base-content/50">视频不存在或已被删除</p>
        </div>
      </div>
    );
  }

  const aiTags = video.aiTags ? video.aiTags.split(',').filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-base-200">
      <HeaderNav />
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Video Player */}
        <div className="bg-black rounded-lg overflow-hidden">
          <video
            className="w-full aspect-video"
            controls
            src={video.filePath}
            poster={video.coverUrl}
          />
        </div>

        {/* Video Info */}
        <div className="bg-base-100 rounded-lg p-4 space-y-4">
          <h1 className="text-xl font-bold">{video.title}</h1>

          <div className="flex items-center gap-3">
            <UserAvatar src={video.authorAvatar} size="md" userId={video.authorId} />
            <div>
              <p className="font-medium">{video.authorName}</p>
              <p className="text-xs text-base-content/50">
                发布于 {formatDate(video.publishedAt || video.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/60">
            <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{formatNumber(video.clicks)} 播放</span>
            <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" />{formatNumber(video.likes)} 点赞</span>
            <span className="flex items-center gap-1"><Coins className="w-4 h-4" />{formatNumber(video.coins)} 投币</span>
            <span className="flex items-center gap-1"><Bookmark className="w-4 h-4" />{formatNumber(video.collects)} 收藏</span>
            <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" />{formatNumber(video.comments)} 评论</span>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" className={`btn btn-sm gap-2 ${liked ? 'btn-primary' : 'btn-ghost'}`} onClick={handleLike}>
              <ThumbsUp className="w-4 h-4" />{liked ? '已点赞' : '点赞'}
            </button>
            <button type="button" className={`btn btn-sm gap-2 ${collected ? 'btn-secondary' : 'btn-ghost'}`} onClick={handleCollect}>
              <Bookmark className="w-4 h-4" />{collected ? '已收藏' : '收藏'}
            </button>
            <button type="button" className="btn btn-sm btn-warning gap-2" onClick={handleCoin}>
              <Coins className="w-4 h-4" />投币
            </button>
            <button type="button" className="btn btn-sm btn-ghost gap-2 text-error" onClick={() => setShowReport(true)}>
              <AlertTriangle className="w-4 h-4" />举报
            </button>
          </div>

          {video.aiSummary && (
            <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r">
              <p className="text-xs font-medium text-primary mb-1">AI摘要</p>
              <p className="text-sm">{video.aiSummary}</p>
            </div>
          )}

          {aiTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {aiTags.map((tag) => (
                <AiTagBadge key={tag} tag={tag} onClick={(t) => navigate(`/video/search?keyword=${encodeURIComponent(t)}`)} />
              ))}
            </div>
          )}

          {video.description && (
            <p className="text-sm text-base-content/70">{video.description}</p>
          )}
        </div>

        {/* Comments */}
        <div className="bg-base-100 rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">评论</h2>
          <div className="mb-6">
            {replyTo && (
              <div className="flex items-center gap-2 mb-2 text-sm text-base-content/50">
                <span>回复 @{replyTo.username}</span>
                <button type="button" className="btn btn-xs btn-ghost" onClick={() => setReplyTo(null)}>取消</button>
              </div>
            )}
            <textarea
              id="comment-input"
              className="textarea textarea-bordered w-full resize-none"
              rows={3}
              placeholder="发表看法..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <button type="button" className="btn btn-primary btn-sm" disabled={!commentText.trim() || submitting} onClick={handleCommentSubmit}>
                {submitting ? '发布中...' : '发布评论'}
              </button>
            </div>
          </div>

          <CommentTree
            comments={comments}
            videoAuthorId={video.authorId}
            currentUserId={userInfo?.id}
            onReply={(c) => setReplyTo(c)}
            onDelete={handleDeleteComment}
          />
        </div>
      </main>

      {/* Report Dialog */}
      {showReport && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">举报视频</h3>
            <div className="space-y-3">
              <div className="form-control">
                <label className="label"><span className="label-text">举报原因</span></label>
                <select
                  className="select select-bordered"
                  value={reportReasonType}
                  onChange={(e) => setReportReasonType(Number(e.target.value))}
                >
                  {Object.entries(REPORT_REASONS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">详细说明（可选）</span></label>
                <textarea
                  className="textarea textarea-bordered"
                  rows={3}
                  placeholder="补充更多信息"
                  value={reportReasonDetail}
                  onChange={(e) => setReportReasonDetail(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-action">
              <button type="button" className="btn" onClick={() => setShowReport(false)}>取消</button>
              <button type="button" className="btn btn-error" onClick={handleReportSubmit}>提交举报</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowReport(false)} />
        </div>
      )}
    </div>
  );
}
