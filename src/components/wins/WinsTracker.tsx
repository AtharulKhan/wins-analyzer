
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SearchBar } from './SearchBar';
import { FilterPopover } from './FilterPopover';
import { SortMenu } from './SortMenu';
import { WinsList } from './WinsList';
import { RecentWins, CategoryBreakdown, SubCategoryBreakdown } from './WinStats';
import { SummaryDialog } from './SummaryDialog';
import { useWinsData } from './useWinsData';
import { WinsTrackerProps } from './types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSearch } from '@/context/SearchContext';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose
} from "@/components/ui/drawer";
import { Filter, SortAsc, RefreshCw } from 'lucide-react';

export function WinsTracker({ view = 'table' }: WinsTrackerProps) {
  const isMobile = useIsMobile();
  const { globalSearch } = useSearch();
  
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
    subCategoryBreakdown,
    toggleFavorite,
    toggleArchive,
    resetFilters
  } = useWinsData();
  
  // Sync global search with local search
  useEffect(() => {
    setSearch(globalSearch);
  }, [globalSearch, setSearch]);
  
  // Mobile components
  const MobileFilterBar = () => (
    <div className="flex w-full gap-3 mb-6">
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm" variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-4">
          <div className="space-y-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-medium">Filters</h3>
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
              isMobileDrawer={true}
            />
            <DrawerClose asChild>
              <Button className="w-full mt-4">Done</Button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
      
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm" variant="outline" size="sm">
            <SortAsc className="h-4 w-4 mr-2" />
            Sort
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Sort Options</h3>
            <SortMenu
              sortBy={sortBy}
              setSortBy={setSortBy}
              groupBy={groupBy}
              setGroupBy={setGroupBy}
              isMobileDrawer={true}
            />
            <DrawerClose asChild>
              <Button className="w-full mt-4">Done</Button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
      
      <Button 
        variant="default" 
        size="sm"
        onClick={fetchData} 
        disabled={loading}
        className="flex-1 bg-primary hover:bg-primary/90 shadow-sm transition-all duration-200 hover:shadow-md"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Loading...' : 'Refresh'}
      </Button>
    </div>
  );
  
  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fade-in-up">
      {/* Main content */}
      <div className="flex-1 space-y-6">
        {/* Desktop toolbar */}
        {!isMobile && (
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex-1 min-w-[300px]">
                <SearchBar search={search} setSearch={setSearch} />
              </div>
              
              <div className="flex gap-2">
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
                  className="bg-primary hover:bg-primary/90 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Loading...' : 'Refresh Data'}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Mobile toolbar */}
        {isMobile && (
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-4 shadow-sm">
              <SearchBar search={search} setSearch={setSearch} />
            </div>
            <MobileFilterBar />
          </div>
        )}
        
        {/* Table View */}
        {view === 'table' && (
          <div className="animate-slide-up animate-delay-200">
            <WinsList 
              groupedWins={groupedWins}
              groupBy={groupBy}
              toggleFavorite={toggleFavorite}
              toggleArchive={toggleArchive}
              setSelectedSummary={setSelectedSummary}
              isMobile={isMobile}
            />
          </div>
        )}
      </div>
      
      {/* Right Sidebar - Only show on desktop */}
      {!isMobile && (
        <div className="w-full lg:w-80 space-y-6 animate-fade-in-up animate-delay-300">
          <div className="transform hover:scale-[1.02] transition-all duration-300">
            <RecentWins wins={recentWins} />
          </div>
          <div className="transform hover:scale-[1.02] transition-all duration-300">
            <CategoryBreakdown breakdown={categoryBreakdown} />
          </div>
          <div className="transform hover:scale-[1.02] transition-all duration-300">
            <SubCategoryBreakdown breakdown={subCategoryBreakdown} />
          </div>
        </div>
      )}
      
      {/* Summary Dialog */}
      <SummaryDialog
        summary={selectedSummary}
        onClose={() => setSelectedSummary(null)}
      />
    </div>
  );
}
