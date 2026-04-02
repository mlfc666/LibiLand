import type { Comment } from '../../types/comment';
import { CommentItem } from './CommentItem';

interface CommentTreeProps {
  comments: Comment[];
  videoAuthorId: number;
  currentUserId?: number;
  onReply?: (comment: Comment) => void;
  onDelete?: (commentId: number) => void;
  onLike?: (commentId: number) => void;
  className?: string;
}

export function CommentTree({
  comments,
  videoAuthorId,
  currentUserId,
  onReply,
  onDelete,
  onLike,
  className = '',
}: CommentTreeProps) {
  const rootComments = comments.filter((c) => c.parentId === null);
  const replyMap = new Map<number, Comment[]>();

  comments.forEach((c) => {
    if (c.parentId !== null) {
      const list = replyMap.get(c.parentId) || [];
      list.push(c);
      replyMap.set(c.parentId, list);
    }
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {rootComments.map((root) => (
        <div key={root.id} className="border-b border-base-200 pb-2">
          <CommentItem
            comment={root}
            isVideoAuthor={root.userId === videoAuthorId}
            canDelete={currentUserId === root.userId || currentUserId === videoAuthorId}
            onReply={onReply}
            onDelete={onDelete}
            onLike={onLike}
          />
          {replyMap.has(root.id) && (
            <div className="ml-8 pl-4 border-l-2 border-base-200 space-y-2">
              {replyMap.get(root.id)!.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  isVideoAuthor={reply.userId === videoAuthorId}
                  canDelete={currentUserId === reply.userId || currentUserId === videoAuthorId}
                  onReply={onReply}
                  onDelete={onDelete}
                  onLike={onLike}
                />
              ))}
            </div>
          )}
        </div>
      ))}
      {rootComments.length === 0 && (
        <p className="text-center text-base-content/40 py-8">暂无评论，快来抢沙发吧</p>
      )}
    </div>
  );
}
