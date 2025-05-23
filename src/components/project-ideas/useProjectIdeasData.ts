import { useState, useEffect, useMemo, useCallback } from 'react';

interface ProjectIdea {
  title: string;
  category: string;
  summary: string;
}

const SPREADSHEET_ID = '1zx957CNpMus2IOY17j0TIt5yopSWs1v3AkAf7TSnExw';
const SHEET_NAME = 'Project Ideas';
const RANGE = 'A2:C';
const GOOGLE_SHEETS_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?sheet=${encodeURIComponent(SHEET_NAME)}&range=${encodeURIComponent(RANGE)}`;

export type SortByType = 'title' | 'category';
export type SortOrderType = 'asc' | 'desc';

export const useProjectIdeasData = () => {
  const [rawProjectIdeas, setRawProjectIdeas] = useState<ProjectIdea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [categoryFilter, setCategoryFilter] = useState<string>('All'); // 'All' means no filter
  const [sortBy, setSortBy] = useState<SortByType>('title');
  const [sortOrder, setSortOrder] = useState<SortOrderType>('asc');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchProjectIdeas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(GOOGLE_SHEETS_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      const jsonString = text.match(/google\.visualization\.Query\.setResponse\((.*)\)/s);
      if (!jsonString || jsonString.length < 2) {
        throw new Error('Failed to parse Google Sheets JSONP response.');
      }
      const data = JSON.parse(jsonString[1]);
      if (data.status === 'error') {
        throw new Error(`Google Sheets API error: ${data.errors.map((e: any) => e.detailed_message).join(', ')}`);
      }
      const rows = data.table?.rows || [];
      const parsedIdeas: ProjectIdea[] = rows.map((row: any) => ({
        title: row?.c?.[0]?.v ?? 'Untitled',
        category: row?.c?.[1]?.v ?? 'Uncategorized',
        summary: row?.c?.[2]?.v ?? '',
      })).filter((idea: ProjectIdea) => idea.title !== 'Untitled' || idea.category !== 'Uncategorized' || idea.summary !== '');
      
      setRawProjectIdeas(parsedIdeas);
    } catch (err) {
      console.error("Error fetching project ideas:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setRawProjectIdeas([]); // Clear data on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjectIdeas();
  }, [fetchProjectIdeas]);

  const allCategories = useMemo(() => {
    const categories = new Set(rawProjectIdeas.map(idea => idea.category));
    return ['All', ...Array.from(categories)].sort();
  }, [rawProjectIdeas]);

  const projectIdeas = useMemo(() => {
    let ideas = [...rawProjectIdeas];

    // Filtering by Category
    if (categoryFilter && categoryFilter !== 'All') {
      ideas = ideas.filter(idea => idea.category === categoryFilter);
    }

    // Filtering by Search Term
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      ideas = ideas.filter(idea => 
        idea.title.toLowerCase().includes(lowercasedSearchTerm) ||
        idea.category.toLowerCase().includes(lowercasedSearchTerm) ||
        idea.summary.toLowerCase().includes(lowercasedSearchTerm)
      );
    }

    // Sorting
    ideas.sort((a, b) => {
      const valA = a[sortBy]?.toLowerCase() || '';
      const valB = b[sortBy]?.toLowerCase() || '';

      if (valA < valB) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (valA > valB) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return ideas;
  }, [rawProjectIdeas, categoryFilter, searchTerm, sortBy, sortOrder]);

  return {
    projectIdeas, // This is now filteredAndSortedIdeas
    loading,
    error,
    allCategories,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    searchTerm,
    setSearchTerm,
    fetchProjectIdeas, // Manual refresh function
  };
};
