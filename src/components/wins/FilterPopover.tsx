
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FilterPopoverProps {
  categoryFilter: string[];
  setCategoryFilter: (categories: string[]) => void;
  subCategoryFilter: string[];
  setSubCategoryFilter: (subCategories: string[]) => void;
  platformFilter: string[];
  setPlatformFilter: (platforms: string[]) => void;
  dateRange: { preset: string; from: Date | null; to: Date | null };
  setDateRange: (dateRange: { preset: string; from: Date | null; to: Date | null }) => void;
  categories: string[];
  subCategories: string[];
  platforms: string[];
  resetFilters: () => void;
  isMobileDrawer?: boolean;
}

export function FilterPopover({
  categoryFilter,
  setCategoryFilter,
  subCategoryFilter,
  setSubCategoryFilter,
  platformFilter,
  setPlatformFilter,
  dateRange,
  setDateRange,
  categories,
  subCategories,
  platforms,
  resetFilters,
  isMobileDrawer = false
}: FilterPopoverProps) {
  const hasActiveFilters = categoryFilter.length > 0 || 
                          subCategoryFilter.length > 0 || 
                          platformFilter.length > 0 || 
                          dateRange.preset !== 'all';

  // Helper functions to handle array updates properly
  const toggleArrayItem = (array: string[], item: string): string[] => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const FilterContent = () => (
    <>
      <div className="mb-4">
        <h4 className="mb-2 text-sm font-medium">Categories</h4>
        <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto">
          {categories.map(category => (
            <Button
              key={category}
              variant={categoryFilter.includes(category) ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                // Fix: Use the new helper function instead of passing a callback
                setCategoryFilter(toggleArrayItem(categoryFilter, category));
              }}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="mb-2 text-sm font-medium">Sub-Categories</h4>
        <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto">
          {subCategories.map(subCategory => (
            <Button
              key={subCategory}
              variant={subCategoryFilter.includes(subCategory) ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                // Fix: Use the new helper function instead of passing a callback
                setSubCategoryFilter(toggleArrayItem(subCategoryFilter, subCategory));
              }}
            >
              {subCategory}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="mb-2 text-sm font-medium">Platform</h4>
        <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto">
          {platforms.map(platform => (
            <Button
              key={platform}
              variant={platformFilter.includes(platform) ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                // Fix: Use the new helper function instead of passing a callback
                setPlatformFilter(toggleArrayItem(platformFilter, platform));
              }}
            >
              {platform}
            </Button>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="mb-2 text-sm font-medium">Date Range</h4>
        <div className="space-y-1">
          {[
            { label: 'All time', value: 'all' },
            { label: 'Last 7 days', value: 'last7' },
            { label: 'This month', value: 'month' }
          ].map(option => (
            <Button 
              key={option.value}
              variant={dateRange.preset === option.value ? "default" : "outline"}
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => setDateRange({ preset: option.value, from: null, to: null })}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
      
      <hr className="my-4" />
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full"
        onClick={resetFilters}
      >
        Reset Filters
      </Button>
    </>
  );

  // For mobile drawer view, just return the content
  if (isMobileDrawer) {
    return <FilterContent />;
  }

  // For desktop, return the popover
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
          {hasActiveFilters && (
            <span className="ml-1 flex h-2 w-2 rounded-full bg-primary"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <FilterContent />
      </PopoverContent>
    </Popover>
  );
}
