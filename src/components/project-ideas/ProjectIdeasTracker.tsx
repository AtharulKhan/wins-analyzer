
import React, { useState } from 'react';
import { useProjectIdeasData, SortByType } from './useProjectIdeasData';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, RefreshCw, ArrowUpAZ, ArrowDownAZ, ArrowUpNarrowWide, ArrowDownNarrowWide, Search, Filter, SortAsc } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose
} from "@/components/ui/drawer";

const SUMMARY_CHAR_LIMIT = 100;

// Color schemes for different categories
const getCategoryColorClass = (category: string, index: number) => {
  const colors = [
    'from-blue-50 to-indigo-100 border-blue-200',
    'from-emerald-50 to-green-100 border-emerald-200',
    'from-purple-50 to-violet-100 border-purple-200',
    'from-amber-50 to-yellow-100 border-amber-200',
    'from-rose-50 to-pink-100 border-rose-200',
    'from-cyan-50 to-teal-100 border-cyan-200',
    'from-orange-50 to-red-100 border-orange-200',
    'from-lime-50 to-green-100 border-lime-200'
  ];
  return colors[index % colors.length];
};

const getCategoryBadgeColor = (category: string, index: number = 0) => {
  const colors = [
    'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200',
    'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-200',
    'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-200',
    'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-200',
    'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-200',
    'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-200',
    'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-200'
  ];
  return colors[index % colors.length];
};

const ProjectIdeasTracker: React.FC = () => {
  const { 
    projectIdeas, 
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
    fetchProjectIdeas
  } = useProjectIdeasData();
  
  const [expandedSummaries, setExpandedSummaries] = useState<Record<number, boolean>>({});
  const isMobile = useIsMobile();

  const toggleSummary = (index: number) => {
    setExpandedSummaries(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const resetFilters = () => {
    setCategoryFilter('All');
    setSearchTerm('');
    setSortBy('title');
    setSortOrder('asc');
  };

  if (loading) {
    return (
      <div className="space-y-2 p-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <p className="text-center text-muted-foreground">Loading project ideas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-destructive">
        <p>Error loading project ideas:</p>
        <p>{error}</p>
      </div>
    );
  }

  // Mobile Filter Bar Component
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
            
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Category:</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reset Filters */}
            <Button variant="outline" onClick={resetFilters} className="w-full">
              Reset Filters
            </Button>
            
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
            
            {/* Sort By Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Sort by:</label>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortByType)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Project Title</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Order:</label>
              <Button 
                variant="outline" 
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="w-full justify-start"
              >
                {sortBy === 'title' ? (
                  sortOrder === 'asc' ? <ArrowUpAZ className="h-4 w-4 mr-2" /> : <ArrowDownAZ className="h-4 w-4 mr-2" />
                ) : (
                  sortOrder === 'asc' ? <ArrowUpNarrowWide className="h-4 w-4 mr-2" /> : <ArrowDownNarrowWide className="h-4 w-4 mr-2" />
                )}
                {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </Button>
            </div>
            
            <DrawerClose asChild>
              <Button className="w-full mt-4">Done</Button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
      
      <Button 
        variant="default" 
        size="sm"
        onClick={fetchProjectIdeas} 
        disabled={loading}
        className="flex-1 bg-primary hover:bg-primary/90 shadow-sm transition-all duration-200 hover:shadow-md"
      >
        <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
        {loading ? 'Loading...' : 'Refresh'}
      </Button>
    </div>
  );

  // Mobile Card View
  const MobileCardView = () => (
    <div className="space-y-3">
      {projectIdeas.length === 0 ? (
        <div className="p-8 text-center bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl">
          <div className="text-slate-500 text-lg mb-2 font-semibold">No project ideas found</div>
          <div className="text-slate-400 text-sm">Try adjusting your filters or adding new ideas.</div>
        </div>
      ) : (
        projectIdeas.map((idea, index) => {
          const isExpanded = expandedSummaries[index];
          const isLongSummary = idea.summary.length > SUMMARY_CHAR_LIMIT;

          return (
            <Card 
              key={index} 
              className={`bg-gradient-to-br ${getCategoryColorClass(idea.category, index)} backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-xl overflow-hidden border-2 animate-slide-up`}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <CardHeader className="pb-3 bg-gradient-to-r from-white/60 to-white/30 border-b border-slate-200/50 backdrop-blur-sm">
                <CardTitle className="text-base font-bold text-slate-800 leading-tight">
                  {idea.title}
                </CardTitle>
                <Badge className={`text-xs font-semibold border transition-all duration-200 hover:scale-105 w-fit ${getCategoryBadgeColor(idea.category, index)}`}>
                  {idea.category}
                </Badge>
              </CardHeader>
              
              <CardContent className="p-4">
                {isLongSummary ? (
                  <Collapsible open={isExpanded} onOpenChange={() => toggleSummary(index)}>
                    <div className="flex flex-col items-start">
                      <span className={cn("text-sm text-slate-700", !isExpanded && "text-muted-foreground")}>
                        {isExpanded ? idea.summary : `${idea.summary.substring(0, SUMMARY_CHAR_LIMIT)}...`}
                      </span>
                      <CollapsibleTrigger asChild>
                        <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-xs text-blue-600 hover:text-blue-800">
                          {isExpanded ? (
                            <>
                              Read less <ChevronUp className="h-3 w-3 ml-1" />
                            </>
                          ) : (
                            <>
                              Read more <ChevronDown className="h-3 w-3 ml-1" />
                            </>
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent />
                  </Collapsible>
                ) : (
                  <p className="text-sm text-slate-700">{idea.summary}</p>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );

  // Desktop Table View
  const DesktopTableView = () => (
    <Card className="bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden animate-fade-in-up">
      <CardContent className="p-0">
        <div className="overflow-hidden rounded-2xl">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-slate-100 via-blue-50 to-indigo-100/80 border-b border-slate-200/60 px-6 py-5 backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-4 text-sm font-bold text-slate-700 uppercase tracking-wider">
              <div className="text-indigo-700">Project Title</div>
              <div className="text-emerald-700">Category</div>
              <div className="text-purple-700">Summary</div>
            </div>
          </div>
          
          {/* Table Body */}
          <div className="divide-y divide-slate-200/50">
            {projectIdeas.length === 0 ? (
              <div className="p-16 text-center bg-gradient-to-br from-slate-50 to-blue-50/30">
                <div className="text-slate-500 text-xl mb-3 font-semibold">No project ideas found</div>
                <div className="text-slate-400 text-sm">Try adjusting your filters or adding new ideas.</div>
              </div>
            ) : (
              projectIdeas.map((idea, index) => {
                const isExpanded = expandedSummaries[index];
                const isLongSummary = idea.summary.length > SUMMARY_CHAR_LIMIT;

                return (
                  <div 
                    key={index} 
                    className={`animate-slide-up hover:bg-gradient-to-r ${getCategoryColorClass(idea.category, index)} hover:shadow-lg transition-all duration-300 hover:scale-[1.01] px-6 py-5 grid grid-cols-3 gap-4 items-start group`}
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    {/* Project Title */}
                    <div className="space-y-2">
                      <div className="font-bold text-slate-800 text-sm leading-tight group-hover:text-slate-900 transition-colors">
                        {idea.title}
                      </div>
                    </div>
                    
                    {/* Category */}
                    <div>
                      <Badge 
                        className={`text-xs font-semibold border transition-all duration-200 hover:scale-105 ${getCategoryBadgeColor(idea.category, index)}`}
                      >
                        {idea.category}
                      </Badge>
                    </div>
                    
                    {/* Summary */}
                    <div>
                      {isLongSummary ? (
                        <Collapsible open={isExpanded} onOpenChange={() => toggleSummary(index)}>
                          <div className="flex flex-col items-start">
                            <span className={cn("text-sm text-slate-700", !isExpanded && "text-muted-foreground")}>
                              {isExpanded ? idea.summary : `${idea.summary.substring(0, SUMMARY_CHAR_LIMIT)}...`}
                            </span>
                            <CollapsibleTrigger asChild>
                              <Button variant="link" size="sm" className="p-0 h-auto mt-1 text-xs text-blue-600 hover:text-blue-800">
                                {isExpanded ? (
                                  <>
                                    Read less <ChevronUp className="h-3 w-3 ml-1" />
                                  </>
                                ) : (
                                  <>
                                    Read more <ChevronDown className="h-3 w-3 ml-1" />
                                  </>
                                )}
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                          <CollapsibleContent />
                        </Collapsible>
                      ) : (
                        <p className="text-sm text-slate-700">{idea.summary}</p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-4 space-y-4">
      {/* Desktop Toolbar */}
      {!isMobile && (
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search title, category, summary..."
                className="pl-8 w-full h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Category:</span>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px] h-9">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By Field */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortByType)}>
                  <SelectTrigger className="w-[150px] h-9">
                    <SelectValue placeholder="Sort by field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Project Title</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order Toggle */}
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                title={`Sort order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
              >
                {sortBy === 'title' ? (
                  sortOrder === 'asc' ? <ArrowUpAZ className="h-4 w-4" /> : <ArrowDownAZ className="h-4 w-4" />
                ) : (
                  sortOrder === 'asc' ? <ArrowUpNarrowWide className="h-4 w-4" /> : <ArrowDownNarrowWide className="h-4 w-4" />
                )}
              </Button>

              {/* Reset Filters */}
              <Button variant="outline" onClick={resetFilters} className="h-9">
                Reset
              </Button>

              {/* Refresh Button */}
              <Button 
                variant="default" 
                onClick={fetchProjectIdeas} 
                disabled={loading}
                className="bg-primary hover:bg-primary/90 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 h-9"
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                {loading ? 'Loading...' : 'Refresh Data'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Toolbar */}
      {isMobile && (
        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-4 shadow-sm">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search project ideas..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <MobileFilterBar />
        </div>
      )}

      {/* Content */}
      {isMobile ? <MobileCardView /> : <DesktopTableView />}
    </div>
  );
};

export default ProjectIdeasTracker;
