import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { VideoCard, HeaderNav } from '@libiland/shared';
import { useInfiniteScroll, useAi, useDebounce } from '@libiland/shared';
import { searchVideos } from '@libiland/shared';
import type { Video } from '@libiland/shared';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const [inputKw, setInputKw] = useState(keyword);
  const debouncedKw = useDebounce(inputKw, 300);
  const { getSearchSuggestions: getAiSuggestions, loading: aiLoading } = useAi();
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);

  useEffect(() => {
    setSearchParams({ keyword: debouncedKw });
  }, [debouncedKw, setSearchParams]);

  const handleAiSearch = () => {
    if (!debouncedKw.trim()) return;
    setShowAiSuggestions(true);
    getAiSuggestions(debouncedKw).then(setAiSuggestions);
  };

  const fetchResults = useCallback(
    async (page: number) => {
      if (!debouncedKw.trim()) return { list: [], total: 0 };
      const res = await searchVideos(debouncedKw, page);
      return { list: res.data?.list || [], total: res.data?.total || 0 };
    },
    [debouncedKw]
  );

  const { data: results, loading, hasMore } = useInfiniteScroll({
    fetchFn: fetchResults,
    pageSize: 20,
    immediate: !!debouncedKw,
  });

  useEffect(() => {
    if (!debouncedKw.trim() || results.length > 0) {
      setAiSuggestions([]);
      return;
    }
    if (showAiSuggestions) {
      getAiSuggestions(debouncedKw).then(setAiSuggestions);
    }
  }, [debouncedKw, results.length, getAiSuggestions, showAiSuggestions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ keyword: inputKw });
  };

  return (
    <div className="min-h-screen bg-base-200">
      <HeaderNav keyword={inputKw} onSearch={(kw) => { setInputKw(kw); setSearchParams({ keyword: kw }); }} />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="搜索视频..."
            className="input input-bordered flex-1"
            value={inputKw}
            onChange={(e) => setInputKw(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            <Search className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="btn btn-ghost border border-base-300 gap-2"
            onClick={handleAiSearch}
            disabled={!debouncedKw.trim() || aiLoading}
          >
            {aiLoading ? (
              <span className="loading loading-spinner loading-xs" />
            ) : null}
            AI智能推荐
          </button>
        </form>

        {debouncedKw && (
          <p className="text-sm text-base-content/60 mb-4">
            搜索 "{debouncedKw}"，共 {results.length} 个结果
          </p>
        )}

        {results.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.map((video: Video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
            <div className="flex justify-center py-8">
              {loading && <span className="loading loading-spinner loading-md text-primary" />}
              {!hasMore && results.length > 0 && <p className="text-base-content/40 text-sm">没有更多了</p>}
            </div>
          </>
        ) : !loading && debouncedKw ? (
          <div className="text-center py-16 space-y-4">
            <p className="text-lg text-base-content/50">未找到相关内容</p>
            {showAiSuggestions && aiLoading && <span className="loading loading-spinner loading-md text-primary" />}
            {showAiSuggestions && aiSuggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-base-content/50">您是否在找：</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {aiSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="btn btn-sm btn-ghost border border-base-300"
                      onClick={() => { setInputKw(s); setSearchParams({ keyword: s }); }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-base-content/40">输入关键词搜索视频</p>
          </div>
        )}
      </main>
    </div>
  );
}
