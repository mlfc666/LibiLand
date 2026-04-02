import { useCallback } from 'react';
import { VideoCard, HeaderNav } from '@libiland/shared';
import { useInfiniteScroll } from '@libiland/shared';
import { getCollectList } from '@libiland/shared';
import type { CollectItem, Video } from '@libiland/shared';

export default function CollectPage() {
  const fetchCollects = useCallback(
    async (page: number) => {
      const res = await getCollectList(page);
      return { list: res.data?.list || [], total: res.data?.total || 0 };
    },
    []
  );

  const { data: items, loading, hasMore } = useInfiniteScroll({ fetchFn: fetchCollects, pageSize: 20, immediate: true });

  const videos = items.map((item: CollectItem) => item.video);

  return (
    <div className="min-h-screen bg-base-200">
      <HeaderNav />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">我的收藏</h1>

        {videos.length === 0 && !loading ? (
          <div className="text-center py-20">
            <p className="text-base-content/50 text-lg">暂无收藏</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videos.map((video: Video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
            <div className="flex justify-center py-8">
              {loading && <span className="loading loading-spinner loading-md text-primary" />}
              {!hasMore && videos.length > 0 && <p className="text-base-content/40 text-sm">没有更多了</p>}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
