
import { useMemo } from 'react';
import { Win } from './useDashboardData';

export interface KeywordItem {
  word: string;
  count: number;
  color: string;
  size: number;
  opacity: number;
}

export const useKeywordData = (activeWins: Win[]) => {
  // Extract common themes/keywords
  const commonKeywords = useMemo(() => {
    if (!activeWins.length) return [];
    
    // Combine text ONLY from title and description fields
    let allText = activeWins.map(win => 
      `${win.title || ''} ${win.desc || ''}`
    ).join(' ').toLowerCase();
    
    // Extended stopwords list
    const stopWords = [
      'the', 'and', 'a', 'to', 'in', 'with', 'of', 'for', 'on', 'at', 'from', 'by', 
      'is', 'are', 'was', 'were', 'will', 'would', 'should', 'can', 'could',
      'has', 'have', 'had', 'not', 'be', 'been', 'being', 'as', 'if', 'or',
      'this', 'that', 'these', 'those', 'it', 'its', 'they', 'them', 'their',
      'who', 'whom', 'whose', 'what', 'which', 'when', 'where', 'why', 'how',
      'all', 'any', 'both', 'each', 'few', 'more', 'most', 'some', 'such',
      'no', 'nor', 'too', 'very', 'just', 'but',
      'http', 'https', 'www', 'com', 'net', 'org', 'io', 'html', 'css',
      'google', 'docs', 'doc', 'sheet', 'sheets', 'drive', 'document',
      'tab', 'edit', 'view', 'file', 'folder', 'click', 'email', 'url',
      'link', 'href', 'browser', 'window', 'site', 'page', 'login'
    ];
    
    // Split by non-word characters and filter
    const words = allText.split(/\W+/).filter(word => {
      if (word.length <= 3) return false;
      if (stopWords.includes(word)) return false;
      if (!isNaN(Number(word))) return false;
      if (/^[a-z0-9_-]{10,}$/i.test(word)) return false;
      if (/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]+$/.test(word)) return false;
      return true;
    });
    
    // Count word frequencies
    const wordCounts: Record<string, number> = {};
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
    
    // Colors for word cloud
    const colors = [
      '#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#8B5CF6',
      '#D946EF', '#F97316', '#0EA5E9', '#33C3F0', '#ea384c'
    ];
    
    // Convert to array and sort by frequency
    return Object.entries(wordCounts)
      .filter(([_, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, count], index) => ({ 
        word, 
        count,
        color: colors[index % colors.length],
        size: Math.max(0.8, Math.min(1.4, 0.8 + (count / 10) * 0.6)),
        opacity: Math.max(0.6, Math.min(1, 0.6 + (count / 10) * 0.4))
      }));
  }, [activeWins]);

  return { commonKeywords };
};
