import { useState } from 'react';
import { Reply, Trash2, ThumbsUp } from 'lucide-react';
import type { Comment } from '../../types/comment';
import { UserAvatar } from '../base/UserAvatar';
import { SentimentBar } from '../business/SentimentBar';
import { formatRelativeTime } from '../../utils/format';

interface CommentItemProps {
  comment: Comment;
  isVideoAuthor?: boolean;
  onReply?: (comment: Comment) => void;
  onDelete?: (commentId: number) => void;
  onLike?: (commentId: number) => void;
  canDelete?: boolean;
  className?: string;
}

export function CommentItem({
  comment,
  isVideoAuthor,
  onReply,
  onDelete,
  onLike,
  canDelete,
  className = '',
}: CommentItemProps) {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    onLike?.(comment.id);
  };

  return (
    <div className={`flex gap-3 py-3 ${className}`}>
      <UserAvatar src={comment.userAvatar} size="sm" userId={comment.userId} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{comment.username}</span>
          {isVideoAuthor && (
            <span className="badge badge-xs badge-primary">UP主</span>
          )}
          <span className="text-xs text-base-content/40">
            {formatRelativeTime(comment.createdAt)}
          </span>
        </div>
        {comment.status === 0 ? (
          <p className="text-base-content/40 italic text-sm">该评论已删除</p>
        ) : (
          <>
            <p className="text-sm mt-1 break-words">{comment.content}</p>
            <div className="flex items-center gap-3 mt-2">
              <SentimentBar score={comment.sentimentScore} label={comment.sentimentLabel} showLabel={false} />
              <span className="text-xs text-base-content/50">
                {comment.sentimentScore > 0
                  ? `${Math.round(comment.sentimentScore * 100)}% 正面`
                  : '未分析'}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                className={`btn btn-xs btn-ghost gap-1 ${liked ? 'text-primary' : 'text-base-content/50'}`}
                onClick={handleLike}
              >
                <ThumbsUp className="w-3 h-3" />
                {comment.likeCount + (liked ? 1 : 0)}
              </button>
              <button
                type="button"
                className="btn btn-xs btn-ghost gap-1 text-base-content/50"
                onClick={() => onReply?.(comment)}
              >
                <Reply className="w-3 h-3" />
                回复
              </button>
              {canDelete && (
                <button
                  type="button"
                  className="btn btn-xs btn-ghost gap-1 text-error/50"
                  onClick={() => onDelete?.(comment.id)}
                >
                  <Trash2 className="w-3 h-3" />
                  删除
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
