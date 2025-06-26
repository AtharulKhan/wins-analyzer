
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
import { ChevronDown, ChevronUp, RefreshCw, ArrowUpAZ, ArrowDownAZ, ArrowUpNarrowWide, ArrowDownNarrowWide, Search } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";

const SUMMARY_CHAR_LIMIT = 100;

// Color schemes for different categories
const getCategoryBadgeColor = (category: string, index: number) => {
  const colors = [
    'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm',
    'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm',
    'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-sm',
    'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-sm',
    'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-sm',
    'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-sm',
    'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-sm',
    'bg-gradient-to-r from-lime-500 to-green-600 text-white shadow-sm'
  ];
  return colors[index % colors.length];
};

const getRowBackgroundColor = (index: number) => {
  const colors = [
    'hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30',
    'hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-green-50/30',
    'hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-violet-50/30',
    'hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-yellow-50/30',
    'hover:bg-gradient-to-r hover:from-rose-50/50 hover:to-pink-50/30',
    'hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-teal-50/30',
    'hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-red-50/30',
    'hover:bg-gradient-to-r hover:from-lime-50/50 hover:to-green-50/30'
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

  const toggleSummary = (index: number) => {
    setExpandedSummaries(prev => ({ ...prev, [index]: !prev[index] }));
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

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in-up">
      {/* Header Card */}
      <Card className="bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-100 via-blue-50 to-indigo-100/80 border-b border-slate-200/60 backdrop-blur-sm">
          <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Search className="h-4 w-4 text-white" />
            </div>
            Project Ideas Tracker
          </CardTitle>
        </CardHeader>
        
        {/* Toolbar */}
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search title, category, summary..."
                className="pl-10 h-10 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Category:</span>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px] h-10 bg-white border-slate-200 shadow-sm">
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
              <span className="text-sm font-medium text-slate-600">Sort by:</span>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortByType)}>
                <SelectTrigger className="w-[150px] h-10 bg-white border-slate-200 shadow-sm">
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
              className="h-10 w-10 bg-white border-slate-200 shadow-sm hover:bg-slate-50"
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
              variant="outline" 
              onClick={fetchProjectIdeas} 
              disabled={loading}
              className="h-10 bg-white border-slate-200 shadow-sm hover:bg-slate-50"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin mr-0", !loading && "mr-2")} />
              {!loading && "Refresh"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card className="bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-2xl">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-slate-100 via-blue-50 to-indigo-100/80 border-b border-slate-200/60 px-6 py-4 backdrop-blur-sm">
              <div className="grid grid-cols-3 gap-6 text-sm font-bold text-slate-700 uppercase tracking-wider">
                <div className="text-indigo-700">Project Title</div>
                <div className="text-emerald-700">Category</div>
                <div className="text-purple-700">Summary</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-slate-200/50">
              {projectIdeas.length === 0 && !loading ? (
                <div className="p-16 text-center bg-gradient-to-br from-slate-50 to-blue-50/30">
                  <div className="text-slate-500 text-xl mb-3 font-semibold">No project ideas found</div>
                  <div className="text-slate-400 text-sm">Try adjusting your filters or adding new project ideas to your Google Sheet.</div>
                </div>
              ) : (
                projectIdeas.map((idea, index) => {
                  const isExpanded = expandedSummaries[index];
                  const isLongSummary = idea.summary.length > SUMMARY_CHAR_LIMIT;

                  return (
                    <div 
                      key={index} 
                      className={cn(
                        "px-6 py-5 grid grid-cols-3 gap-6 items-start group transition-all duration-300 hover:shadow-lg hover:scale-[1.01]",
                        getRowBackgroundColor(index),
                        "animate-slide-up"
                      )}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Project Title */}
                      <div className="space-y-2">
                        <div className="font-bold text-slate-800 text-base leading-tight group-hover:text-slate-900 transition-colors">
                          {idea.title}
                        </div>
                      </div>
                      
                      {/* Category */}
                      <div>
                        <Badge 
                          className={cn(
                            "text-sm font-semibold border-0 transition-all duration-200 hover:scale-105 shadow-md",
                            getCategoryBadgeColor(idea.category, index)
                          )}
                        >
                          {idea.category}
                        </Badge>
                      </div>
                      
                      {/* Summary */}
                      <div>
                        {isLongSummary ? (
                          <Collapsible open={isExpanded} onOpenChange={() => toggleSummary(index)}>
                            <div className="space-y-2">
                              <div className="text-slate-700 text-sm leading-relaxed">
                                {isExpanded ? idea.summary : `${idea.summary.substring(0, SUMMARY_CHAR_LIMIT)}...`}
                              </div>
                              <CollapsibleTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="p-0 h-auto text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full px-2 py-1 transition-all duration-200"
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronUp className="h-3 w-3 mr-1" />
                                      Show Less
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="h-3 w-3 mr-1" />
                                      Read More
                                    </>
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent />
                          </Collapsible>
                        ) : (
                          <div className="text-slate-700 text-sm leading-relaxed">{idea.summary}</div>
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
    </div>
  );
};

export default ProjectIdeasTracker;
