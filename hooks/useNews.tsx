import { useState, useEffect } from 'react';
import { newsApiService, NewsArticle } from '../services/newsApi';

export function useNews(params: {
  country?: string;
  category?: string;
  language?: string;
  trending?: 'all' | 'trending' | 'non-trending';
}) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const result = await newsApiService.fetchNewsFromInoreader({
        country: params.country,
        category: params.category,
        language: params.language,
        trending: params.trending,
        limit: 20
      });

      if (result.articles) {
        setNews(result.articles);
      }
    } catch (err) {
      // Suppress errors to prevent UI crashes, service handles fallbacks
      setError(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const searchNews = async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await newsApiService.searchNews(query, {
        country: params.country,
        category: params.category,
        limit: 20
      });

      if (result.articles) {
        setNews(result.articles);
      }
    } catch (err) {
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshNews = () => {
    fetchNews(true);
  };

  useEffect(() => {
    fetchNews();
  }, [params.country, params.category, params.language, params.trending]);

  return {
    news,
    loading,
    error,
    refreshing,
    fetchNews,
    searchNews,
    refreshNews
  };
}