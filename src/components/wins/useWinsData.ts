
import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Win, GOOGLE_SHEETS_API_KEY, GOOGLE_SHEETS_ID, GOOGLE_SHEETS_RANGE } from './types';

export function useWinsData() {
  const { toast } = useToast();
  
  const [wins, setWins] = useState<Win[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [subCategoryFilter, setSubCategoryFilter] = useState<string[]>([]);
  const [platformFilter, setPlatformFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ preset: 'all', from: null, to: null });
  const [favorites, setFavorites] = useLocalStorage('win-favorites', [] as string[]);
  const [archived, setArchived] = useLocalStorage('win-archived', [] as string[]);
  const [sortBy, setSortBy] = useState({ key: 'date', order: 'desc' });
  const [groupBy, setGroupBy] = useState('none');
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);

  // Fetch data from Google Sheets
  const fetchData = async () => {
    setLoading(true);
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_ID}/values/${GOOGLE_SHEETS_RANGE}?key=${GOOGLE_SHEETS_API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.values && data.values.length) {
        const parsedWins: Win[] = data.values.map((row: string[], index: number) => {
          const [title, category, subCategories, summary, platform, dateStr, link] = row;
          const id = `win-${index}-${dateStr}`;
          return {
            id,
            title: title || 'Untitled',
            category: category || 'Uncategorized',
            subCategories: subCategories || '',
            summary: summary || '',
            platform: platform || '',
            date: dateStr ? new Date(dateStr) : new Date(),
            link: link || '',
            isFavorite: favorites.includes(id),
            isArchived: archived.includes(id)
          };
        });
        
        setWins(parsedWins);
        toast({
          title: "Data loaded",
          description: `Loaded ${parsedWins.length} wins from Google Sheets.`
        });
      } else {
        toast({
          title: "No data found",
          description: "Your sheet is empty or the range doesn't contain data.",
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "Failed to load data",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get unique categories for filtering
  const categories = useMemo(() => {
    const allCategories = wins.flatMap(win => 
      win.category.split(',').map(cat => cat.trim())
    );
    return [...new Set(allCategories)].filter(Boolean).sort();
  }, [wins]);
  
  // Get unique subcategories for filtering
  const subCategories = useMemo(() => {
    const allSubCategories = wins.flatMap(win => 
      win.subCategories.split(',').map(subCat => subCat.trim())
    );
    return [...new Set(allSubCategories)].filter(Boolean).sort();
  }, [wins]);
  
  // Get unique platforms for filtering
  const platforms = useMemo(() => {
    return [...new Set(wins.map(win => win.platform))].filter(Boolean).sort();
  }, [wins]);
  
  // Filter wins based on search and filters
  const filteredWins = useMemo(() => {
    return wins.filter(win => {
      // Skip archived items
      if (win.isArchived) return false;
      
      // Text search (case insensitive)
      const searchMatch = !search || 
        `${win.title} ${win.category} ${win.subCategories} ${win.summary} ${win.platform}`.toLowerCase().includes(search.toLowerCase());
      if (!searchMatch) return false;
      
      // Category filter
      const categoryMatch = categoryFilter.length === 0 || 
        win.category.split(',').some(cat => 
          categoryFilter.includes(cat.trim())
        );
      if (!categoryMatch) return false;
      
      // Sub-category filter
      const subCategoryMatch = subCategoryFilter.length === 0 ||
        win.subCategories.split(',').some(subCat => 
          subCategoryFilter.includes(subCat.trim())
        );
      if (!subCategoryMatch) return false;
      
      // Platform filter
      const platformMatch = platformFilter.length === 0 || platformFilter.includes(win.platform);
      if (!platformMatch) return false;
      
      // Date range filter
      if (dateRange.preset !== 'all') {
        const now = new Date();
        let from: Date | null = null;
        let to: Date | null = now;
        
        if (dateRange.preset === 'last7') {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          from = sevenDaysAgo;
        } else if (dateRange.preset === 'month') {
          from = new Date(now.getFullYear(), now.getMonth(), 1);
        } else {
          from = dateRange.from;
          to = dateRange.to;
        }
        
        if (from && win.date < from) return false;
        if (to && win.date > to) return false;
      }
      
      return true;
    });
  }, [wins, search, categoryFilter, subCategoryFilter, platformFilter, dateRange]);
  
  // Sort wins based on sort criteria
  const sortedWins = useMemo(() => {
    return [...filteredWins].sort((a, b) => {
      if (sortBy.key === 'date') {
        return sortBy.order === 'asc' 
          ? a.date.getTime() - b.date.getTime() 
          : b.date.getTime() - a.date.getTime();
      } else if (sortBy.key === 'title') {
        return sortBy.order === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy.key === 'category') {
        return sortBy.order === 'asc'
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      } else if (sortBy.key === 'platform') {
        return sortBy.order === 'asc'
          ? a.platform.localeCompare(b.platform)
          : b.platform.localeCompare(a.platform);
      }
      return 0;
    });
  }, [filteredWins, sortBy]);
  
  // Group wins if grouping is enabled
  const groupedWins = useMemo(() => {
    if (groupBy === 'none') {
      return { ungrouped: sortedWins };
    }
    
    const grouped: Record<string, Win[]> = {};
    
    if (groupBy === 'category') {
      sortedWins.forEach(win => {
        const categories = win.category.split(',').map(c => c.trim());
        categories.forEach(category => {
          if (!grouped[category]) {
            grouped[category] = [];
          }
          grouped[category].push(win);
        });
      });
    } else if (groupBy === 'subCategory') {
      sortedWins.forEach(win => {
        const subCategories = win.subCategories.split(',').map(sc => sc.trim());
        if (subCategories.length === 0 || (subCategories.length === 1 && !subCategories[0])) {
          // Handle empty subCategories
          if (!grouped['Uncategorized']) {
            grouped['Uncategorized'] = [];
          }
          grouped['Uncategorized'].push(win);
        } else {
          subCategories.forEach(subCategory => {
            if (!grouped[subCategory]) {
              grouped[subCategory] = [];
            }
            grouped[subCategory].push(win);
          });
        }
      });
    } else if (groupBy === 'platform') {
      sortedWins.forEach(win => {
        const platform = win.platform || 'Unknown';
        if (!grouped[platform]) {
          grouped[platform] = [];
        }
        grouped[platform].push(win);
      });
    } else if (groupBy === 'month') {
      sortedWins.forEach(win => {
        const monthYear = win.date.toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!grouped[monthYear]) {
          grouped[monthYear] = [];
        }
        grouped[monthYear].push(win);
      });
    }
    
    return grouped;
  }, [sortedWins, groupBy]);
  
  // Get recent wins for sidebar
  const recentWins = useMemo(() => {
    return [...wins]
      .filter(win => !win.isArchived)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  }, [wins]);
  
  // Get category breakdown data for chart
  const categoryBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    const activeWins = wins.filter(win => !win.isArchived);
    
    activeWins.forEach(win => {
      win.category.split(',').forEach(category => {
        const cat = category.trim();
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(counts)
      .map(([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  }, [wins]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
    
    setWins(prev => 
      prev.map(win => 
        win.id === id ? { ...win, isFavorite: !win.isFavorite } : win
      )
    );
  };
  
  const toggleArchive = (id: string) => {
    setArchived(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
    
    setWins(prev => 
      prev.map(win => 
        win.id === id ? { ...win, isArchived: !win.isArchived } : win
      )
    );
  };
  
  const resetFilters = () => {
    setSearch('');
    setCategoryFilter([]);
    setSubCategoryFilter([]);
    setPlatformFilter([]);
    setDateRange({ preset: 'all', from: null, to: null });
  };

  return {
    wins,
    loading,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    subCategoryFilter,
    setSubCategoryFilter,
    platformFilter,
    setPlatformFilter,
    dateRange,
    setDateRange,
    sortBy,
    setSortBy,
    groupBy,
    setGroupBy,
    selectedSummary,
    setSelectedSummary,
    fetchData,
    categories,
    subCategories,
    platforms,
    filteredWins,
    sortedWins,
    groupedWins,
    recentWins,
    categoryBreakdown,
    toggleFavorite,
    toggleArchive,
    resetFilters
  };
}
