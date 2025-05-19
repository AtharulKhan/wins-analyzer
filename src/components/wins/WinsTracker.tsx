
import React from 'react';
import { Button } from '@/components/ui/button';
import { SearchBar } from './SearchBar';
import { FilterPopover } from './FilterPopover';
import { SortMenu } from './SortMenu';
import { WinsList } from './WinsList';
import { RecentWins, CategoryBreakdown } from './WinStats';
import { SummaryDialog } from './SummaryDialog';
import { useWinsData } from './useWinsData';
import { WinsTrackerProps } from './types';

export function WinsTracker({ view = 'table' }: WinsTrackerProps) {
  const {
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
    groupedWins,
    recentWins,
    categoryBreakdown,
    toggleFavorite,
    toggleArchive,
    resetFilters
  } = useWinsData();
  
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Main content */}
      <div className="flex-1 space-y-4">
        <div className="flex flex-wrap gap-2">
          <SearchBar search={search} setSearch={setSearch} />
          
          <FilterPopover
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            subCategoryFilter={subCategoryFilter}
            setSubCategoryFilter={setSubCategoryFilter}
            platformFilter={platformFilter}
            setPlatformFilter={setPlatformFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            categories={categories}
            subCategories={subCategories}
            platforms={platforms}
            resetFilters={resetFilters}
          />
          
          <SortMenu
            sortBy={sortBy}
            setSortBy={setSortBy}
            groupBy={groupBy}
            setGroupBy={setGroupBy}
          />
          
          <Button 
            variant="default" 
            onClick={fetchData} 
            disabled={loading}
            className="ml-auto"
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </Button>
        </div>
        
        {/* Table View */}
        {view === 'table' && (
          <WinsList 
            groupedWins={groupedWins}
            groupBy={groupBy}
            toggleFavorite={toggleFavorite}
            toggleArchive={toggleArchive}
            setSelectedSummary={setSelectedSummary}
          />
        )}
      </div>
      
      {/* Right Sidebar */}
      <div className="w-full lg:w-80 space-y-4">
        {/* Recent Wins */}
        <RecentWins wins={recentWins} />
        
        {/* Category Breakdown */}
        <CategoryBreakdown breakdown={categoryBreakdown} />
      </div>
      
      {/* Summary Dialog */}
      <SummaryDialog
        summary={selectedSummary}
        onClose={() => setSelectedSummary(null)}
      />
    </div>
  );
}
