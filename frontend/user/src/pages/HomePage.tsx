import { useCallback, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { VideoCard, HeaderNav } from '@libiland/shared';
import { useInfiniteScroll } from '@libiland/shared';
import { getVideoList } from '@libiland/shared';
import type { Video } from '@libiland/shared';

export default function HomePage() {
  const fetchVideos = useCallback(
    async (page: number) => {
      const res = await getVideoList({ page, size: 20 });
      return { list: res.data?.list || [], total: res.data?.total || 0 };
    },
    []
  );

  const { data: videos, loading, hasMore, loadMore, refresh } = useInfiniteScroll({ fetchFn: fetchVideos, pageSize: 20, immediate: true });

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  return (
    <div className="min-h-screen bg-base-200">
      <HeaderNav />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">热门推荐</h1>
          <button type="button" className="btn btn-ghost btn-sm gap-2" onClick={refresh}>
            <RefreshCw className="w-4 h-4" />
            刷新
          </button>
        </div>

        {videos.length === 0 && !loading ? (
          <div className="text-center py-20">
            <p className="text-base-content/50 text-lg">暂无视频</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videos.map((video: Video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
            <div ref={sentinelRef} className="flex justify-center py-8">
              {loading && <span className="loading loading-spinner loading-md text-primary" />}
              {!hasMore && videos.length > 0 && (
                <p className="text-base-content/40 text-sm">没有更多了</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
