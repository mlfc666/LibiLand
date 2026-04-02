import { useNavigate } from 'react-router-dom';
import { Play, Eye, ThumbsUp, Coins } from 'lucide-react';
import type { Video } from '../../types/video';
import { UserAvatar } from '../base/UserAvatar';
import { AiTagBadge } from '../base/AiTagBadge';
import { formatDuration, formatNumber } from '../../utils/format';

interface VideoCardProps {
  video: Video;
  onClick?: () => void;
  className?: string;
}

export function VideoCard({ video, onClick, className = '' }: VideoCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/video/detail/${video.id}`);
    }
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    navigate(`/video/search?keyword=${encodeURIComponent(tag)}`);
  };

  const aiTags = video.aiTags
    ? video.aiTags.split(',').filter(Boolean).slice(0, 3)
    : [];

  return (
    <div
      className={`card bg-base-100 cursor-pointer hover:shadow-md transition-shadow ${className}`}
      onClick={handleClick}
    >
      <figure className="relative aspect-video overflow-hidden">
        <img
          src={video.coverUrl || 'https://picsum.photos/seed/' + video.id + '/320/180'}
          alt={video.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
          {formatDuration(video.duration)}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
          <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
            <Play className="w-6 h-6 text-black fill-black" />
          </div>
        </div>
      </figure>
      <div className="card-body p-3 gap-2">
        <h3
          className="text-sm font-medium line-clamp-1 hover:line-clamp-none"
          title={video.title}
        >
          {video.title}
        </h3>
        {aiTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {aiTags.map((tag) => (
              <AiTagBadge key={tag} tag={tag} onClick={handleTagClick} />
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 mt-1">
          <UserAvatar
            src={video.authorAvatar}
            size="xs"
            userId={video.authorId}
          />
          <span className="text-xs text-base-content/60 truncate max-w-24">
            {video.authorName}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-base-content/50">
          <span className="flex items-center gap-0.5">
            <Eye className="w-3 h-3" />
            {formatNumber(video.clicks)}
          </span>
          <span className="flex items-center gap-0.5">
            <ThumbsUp className="w-3 h-3" />
            {formatNumber(video.likes)}
          </span>
          <span className="flex items-center gap-0.5">
            <Coins className="w-3 h-3" />
            {formatNumber(video.coins)}
          </span>
        </div>
      </div>
    </div>
  );
}
