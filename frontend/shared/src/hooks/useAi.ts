import { useState, useCallback } from 'react';

const AI_BASE_URL = import.meta.env.VITE_AI_BASE_URL || 'https://api.deepseek.com';
const AI_API_KEY = import.meta.env.VITE_AI_API_KEY || '';
const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'deepseek-chat';

interface UseAiResult {
  getSearchSuggestions: (keyword: string) => Promise<string[]>;
  loading: boolean;
}

export function useAi(): UseAiResult {
  const [loading, setLoading] = useState(false);

  const getSearchSuggestions = useCallback(async (keyword: string): Promise<string[]> => {
    if (!keyword.trim()) return [];
    setLoading(true);
    try {
      const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify({
          model: AI_MODEL,
          messages: [
            {
              role: 'user',
              content: `用户搜索关键词："${keyword}"，这是一个视频平台的搜索场景。请推荐5个与该关键词相关的用户可能想要搜索的热词。只返回关键词列表，用逗号分隔，不需要其他文字。`,
            },
          ],
          temperature: 0.7,
          max_tokens: 100,
        }),
      });
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      const suggestions = content
        .split(/[,，、]/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0 && s.length < 20);
      return suggestions.slice(0, 5);
    } catch {
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { getSearchSuggestions, loading };
}
