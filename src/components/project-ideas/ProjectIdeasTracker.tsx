
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose
} from "@/components/ui/drawer";

const SUMMARY_CHAR_LIMIT = 100;

// Subtle color schemes for categories
const getCategoryColors = (index: number) => {
  const colors = [
    'bg-slate-50 text-slate-700 border-slate-200',
    'bg-blue-50 text-blue-700 border-blue-200',
    'bg-emerald-50 text-emerald-700 border-emerald-200',
    'bg-purple-50 text-purple-700 border-purple-200',
    'bg-amber-50 text-amber-700 border-amber-200',
    'bg-rose-50 text-rose-700 border-rose-200',
    'bg-cyan-50 text-cyan-700 border-cyan-200',
    'bg-orange-50 text-orange-700 border-orange-200'
  ];
  return colors[index % colors.length];
};

const getCardColors = (index: number) => {
  const colors = [
    'from-slate-50 via-white to-slate-50/50 border-slate-200/60',
    'from-blue-50 via-white to-blue-50/50 border-blue-200/60',
    'from-emerald-50 via-white to-emerald-50/50 border-emerald-200/60',
    'from-purple-50 via-white to-purple-50/50 border-purple-200/60',
    'from-amber-50 via-white to-amber-50/50 border-amber-200/60',
    'from-rose-50 via-white to-rose-50/50 border-rose-200/60',
    'from-cyan-50 via-white to-cyan-50/50 border-cyan-200/60',
    'from-orange-50 via-white to-orange-50/50 border-orange-200/60'
  ];
  return colors[index % colors.length];
};

const ProjectIdeaCard: React.FC<{
  idea: any;
  index: number;
  expandedSummaries: Record<number, boolean>;
  toggleSummary: (index: number) => void;
}> = ({ idea, index, expandedSummaries, toggleSummary }) => {
  const isExpanded = expandedSummaries[index];
  const isLongSummary = idea.summary.length > SUMMARY_CHAR_LIMIT;

  return (
    <Card className={`bg-gradient-to-br ${getCardColors(index)} shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] rounded-xl border-2 animate-fade-in-up`}
          style={{ animationDelay: `${index * 80}ms` }}>
      <CardHeader className="pb-3 bg-gradient-to-r from-white/60 to-white/30 border-b border-slate-200/50 backdrop-blur-sm">
        <CardTitle className="text-base font-bold text-slate-800 leading-tight mb-2">
          {idea.title}
        </CardTitle>
        <Badge className={`text-xs font-semibold border transition-all duration-200 hover:scale-105 w-fit ${getCategoryColors(index)}`}>
          {idea.category}
        </Badge>
      </CardHeader>
      
      <CardContent className="p-4">
        {isLongSummary ? (
          <Collapsible open={isExpanded} onOpenChange={() => toggleSummary(index)}>
            <div className="space-y-2">
              <p className="text-sm text-slate-600 leading-relaxed">
                {isExpanded ? idea.summary : `${idea.summary.substring(0, SUMMARY_CHAR_LIMIT)}...`}
              </p>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-slate-500 hover:text-slate-700 transition-colors">
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
          <p className="text-sm text-slate-600 leading-relaxed">{idea.summary}</p>
        )}
      </CardContent>
    </Card>
  );
};

const MobileFilterBar: React.FC<{
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  allCategories: string[];
  sortBy: SortByType;
  setSortBy: (value: SortByType) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (value: 'asc' | 'desc') => void;
  fetchProjectIdeas: () => void;
  loading: boolean;
}> = ({ categoryFilter, setCategoryFilter, allCategories, sortBy, setSortBy, sortOrder, setSortOrder, fetchProjectIdeas, loading }) => (
  <div className="flex w-full gap-2 mb-4">
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/60 shadow-sm" variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4">
        <div className="space-y-4 max-h-[80vh] overflow-y-auto">
          <h3 className="text-lg font-semibold text-slate-800">Filters</h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-slate-600 mb-2 block">Category:</span>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Categories" />
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
          </div>
          <DrawerClose asChild>
            <Button className="w-full mt-4">Done</Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
    
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/60 shadow-sm" variant="outline" size="sm">
          <SortAsc className="h-4 w-4 mr-2" />
          Sort
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Sort Options</h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-slate-600 mb-2 block">Sort by:</span>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortByType)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Project Title</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <span className="text-sm font-medium text-slate-600 mb-2 block">Order:</span>
              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
      className="flex-1 bg-slate-800 hover:bg-slate-700 shadow-sm transition-all duration-200 hover:shadow-md"
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
      {loading ? 'Loading...' : 'Refresh'}
    </Button>
  </div>
);

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

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <p className="text-center text-slate-500 animate-pulse">Loading project ideas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800 font-medium">Error loading project ideas:</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 animate-fade-in-up">
      {/* Desktop toolbar */}
      {!isMobile && (
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search project ideas..."
                className="pl-10 bg-white border-slate-200/60 focus:border-slate-300 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-600 whitespace-nowrap">Category:</span>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px] bg-white border-slate-200/60">
                    <SelectValue placeholder="All Categories" />
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
                <span className="text-sm font-medium text-slate-600 whitespace-nowrap">Sort:</span>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortByType)}>
                  <SelectTrigger className="w-[140px] bg-white border-slate-200/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order Toggle */}
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white border-slate-200/60 hover:bg-slate-50"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                title={`Sort order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
              >
                {sortBy === 'title' ? (
                  sortOrder === 'asc' ? <ArrowUpAZ className="h-4 w-4" /> : <ArrowDownAZ className="h-4 w-4" />
                ) : (
                  sortOrder === 'asc' ? <ArrowUpNarrowWide className="h-4 w-4" /> : <ArrowDownNarrowWide className="h-4 w-4" />
                )}
              </Button>

              {/* Refresh Button */}
              <Button 
                variant="default" 
                onClick={fetchProjectIdeas} 
                disabled={loading}
                className="bg-slate-800 hover:bg-slate-700 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile toolbar */}
      {isMobile && (
        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-4 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search project ideas..."
                className="pl-10 bg-white border-slate-200/60"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <MobileFilterBar
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            allCategories={allCategories}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            fetchProjectIdeas={fetchProjectIdeas}
            loading={loading}
          />
        </div>
      )}

      {/* Content */}
      {isMobile ? (
        // Mobile Card View
        <div className="space-y-3 px-2">
          {projectIdeas.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200/60">
                <div className="text-slate-500 text-lg font-medium mb-2">No project ideas found</div>
                <div className="text-slate-400 text-sm">Try adjusting your filters or add some ideas from your Google Sheet!</div>
              </div>
            </div>
          ) : (
            projectIdeas.map((idea, index) => (
              <ProjectIdeaCard
                key={index}
                idea={idea}
                index={index}
                expandedSummaries={expandedSummaries}
                toggleSummary={toggleSummary}
              />
            ))
          )}
        </div>
      ) : (
        // Desktop Table View
        <Card className="bg-gradient-to-br from-white via-slate-50/30 to-slate-50/50 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableCaption className="text-slate-500 py-4">
                {projectIdeas.length === 0 ? 
                  "No project ideas found. Add some from your Google Sheet!" : 
                  `${projectIdeas.length} project idea${projectIdeas.length === 1 ? '' : 's'} found`
                }
              </TableCaption>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-slate-100 via-blue-50/50 to-slate-100 border-b border-slate-200/60 hover:bg-gradient-to-r hover:from-slate-100 hover:via-blue-50/70 hover:to-slate-100">
                  <TableHead className="font-bold text-slate-700 w-[30%]">Project Title</TableHead>
                  <TableHead className="font-bold text-slate-700 w-[20%]">Category</TableHead>
                  <TableHead className="font-bold text-slate-700">Summary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectIdeas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-32 text-center">
                      <div className="text-slate-500 text-lg font-medium mb-2">No project ideas found</div>
                      <div className="text-slate-400 text-sm">Try adjusting your filters or refresh the data.</div>
                    </TableCell>
                  </TableRow>
                ) : (
                  projectIdeas.map((idea, index) => {
                    const isExpanded = expandedSummaries[index];
                    const isLongSummary = idea.summary.length > SUMMARY_CHAR_LIMIT;

                    return (
                      <TableRow 
                        key={index} 
                        className={`hover:bg-gradient-to-r ${getCardColors(index).replace('border-', 'hover:border-')} transition-all duration-300 hover:shadow-sm animate-fade-in-up`}
                        style={{ animationDelay: `${index * 80}ms` }}
                      >
                        <TableCell className="font-semibold text-slate-800 align-top py-4">
                          {idea.title}
                        </TableCell>
                        <TableCell className="align-top py-4">
                          <Badge className={`text-xs font-semibold border transition-all duration-200 hover:scale-105 ${getCategoryColors(index)}`}>
                            {idea.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="align-top py-4">
                          {isLongSummary ? (
                            <Collapsible open={isExpanded} onOpenChange={() => toggleSummary(index)}>
                              <div className="space-y-2">
                                <p className="text-slate-600 leading-relaxed">
                                  {isExpanded ? idea.summary : `${idea.summary.substring(0, SUMMARY_CHAR_LIMIT)}...`}
                                </p>
                                <CollapsibleTrigger asChild>
                                  <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-slate-500 hover:text-slate-700 transition-colors">
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
                            <p className="text-slate-600 leading-relaxed">{idea.summary}</p>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectIdeasTracker;
