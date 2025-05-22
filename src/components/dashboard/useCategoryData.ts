
import { useMemo, useState } from 'react';
import { Win } from './useDashboardData';

export interface CategoryItem {
  name: string;
  value: number;
  fill: string;
  z: number;
}

export interface TopCategory {
  title: string;
  name: string;
  count: number;
  color: string;
}

export const useCategoryData = (activeWins: Win[]) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryWins, setCategoryWins] = useState<Win[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get category data with enhanced bubble chart format
  const categoryData = useMemo(() => {
    // Count occurrences of each category
    const categories: Record<string, number> = {};
    
    activeWins.forEach(win => {
      if (win.category) {
        const cats = win.category.split(',');
        cats.forEach(cat => {
          const trimmedCat = cat.trim();
          if (trimmedCat) {
            categories[trimmedCat] = (categories[trimmedCat] || 0) + 1;
          }
        });
      }
    });
    
    // Convert to array for chart
    const categoryArray = Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    
    // Assign colors and calculate sizes for bubble chart
    const colors = [
      '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#22C55E', 
      '#EAB308', '#EC4899', '#06B6D4', '#9b87f5', '#7E69AB', 
      '#6E59A5', '#D6BCFA', '#33C3F0', '#ea384c'
    ];
    
    return categoryArray.map((category, index) => ({
      ...category,
      fill: colors[index % colors.length],
      // Normalize size for bubble chart (min size 20, max size 60)
      z: Math.max(20, Math.min(60, category.value * 5))
    }));
  }, [activeWins]);

  // Handle bubble click (similar to pie click)
  const handleBubbleClick = (data: any) => {
    if (data && data.payload && data.payload.name) {
      const category = data.payload.name;
      // Find all wins with this category
      const winsInCategory = activeWins.filter(win => {
        const categories = win.category.split(',').map(cat => cat.trim());
        return categories.includes(category);
      });
      
      setSelectedCategory(category);
      setCategoryWins(winsInCategory);
      setDialogOpen(true);
    }
  };

  // Get top categories (top 3)
  const topCategories = useMemo(() => {
    return categoryData.slice(0, 3).map((category, index) => {
      const titles = ['Top', 'Second', 'Third'];
      return {
        title: `${titles[index]} Category`,
        name: category.name,
        count: category.value,
        color: category.fill
      };
    });
  }, [categoryData]);

  // Calculate z-axis domain for bubble chart
  const zAxisDomain = useMemo(() => 
    [0, Math.max(...categoryData.map(item => item.value)) * 1.2], 
    [categoryData]
  );

  return { 
    categoryData, 
    topCategories, 
    selectedCategory, 
    categoryWins, 
    dialogOpen, 
    setDialogOpen, 
    handleBubbleClick, 
    setSelectedCategory,
    setCategoryWins,
    zAxisDomain
  };
};
