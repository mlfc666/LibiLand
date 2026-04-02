import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions<T> {
  fetchFn: (page: number) => Promise<{ list: T[]; total: number }>;
  pageSize?: number;
  immediate?: boolean;
}

interface UseInfiniteScrollResult<T> {
  data: T[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => void;
  refresh: () => void;
  reset: () => void;
}

export function useInfiniteScroll<T>({
  fetchFn,
  pageSize = 20,
  immediate = true,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchData = useCallback(
    async (pageNum: number, isRefresh = false) => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchFn(pageNum);
        if (isRefresh) {
          setData(result.list);
        } else {
          setData((prev) => (pageNum === 1 ? result.list : [...prev, ...result.list]));
        }
        setTotal(result.total);
        setHasMore(result.list.length >= pageSize && data.length + result.list.length < result.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败');
      } finally {
        setLoading(false);
      }
    },
    [fetchFn, pageSize, data.length]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  const refresh = useCallback(() => {
    setPage(1);
    fetchData(1, true);
  }, [fetchData]);

  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  useEffect(() => {
    if (immediate) {
      fetchData(1, true);
    }
  }, []);

  useEffect(() => {
    if (page > 1 || (page === 1 && data.length === 0 && immediate)) {
      fetchData(page);
    }
  }, [page]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
    return () => {
      observerRef.current?.disconnect();
    };
  }, [hasMore, loading, loadMore]);

  return {
    data,
    loading,
    hasMore,
    error,
    loadMore,
    refresh,
    reset,
  };
}
