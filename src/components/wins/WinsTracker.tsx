
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
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose
} from "@/components/ui/drawer";
import { Filter, SortAsc } from 'lucide-react';

export function WinsTracker({ view = 'table' }: WinsTrackerProps) {
  const isMobile = useIsMobile();
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
  
  // Mobile components
  const MobileFilterBar = () => (
    <div className="flex w-full gap-2 mb-4">
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="flex-1" variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
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
          <Button className="flex-1" variant="outline" size="sm">
            <SortAsc className="h-4 w-4 mr-1" />
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
        className="flex-1"
      >
        {loading ? 'Loading...' : 'Refresh'}
      </Button>
    </div>
  );
  
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Main content */}
      <div className="flex-1 space-y-4">
        {/* Desktop toolbar */}
        {!isMobile && (
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
        )}
        
        {/* Mobile toolbar */}
        {isMobile && (
          <>
            <SearchBar search={search} setSearch={setSearch} />
            <MobileFilterBar />
          </>
        )}
        
        {/* Table View */}
        {view === 'table' && (
          <WinsList 
            groupedWins={groupedWins}
            groupBy={groupBy}
            toggleFavorite={toggleFavorite}
            toggleArchive={toggleArchive}
            setSelectedSummary={setSelectedSummary}
            isMobile={isMobile}
          />
        )}
      </div>
      
      {/* Right Sidebar - Only show on desktop */}
      {!isMobile && (
        <div className="w-full lg:w-80 space-y-4">
          <RecentWins wins={recentWins} />
          <CategoryBreakdown breakdown={categoryBreakdown} />
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
