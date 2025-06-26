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

const SUMMARY_CHAR_LIMIT = 100;

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
    <div className="container mx-auto py-4 space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-2 border rounded-md bg-card">
        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search title, category, summary..."
            className="pl-8 w-full h-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Category:</span>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px] h-9">
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
          ) : ( // category or other fields
            sortOrder === 'asc' ? <ArrowUpNarrowWide className="h-4 w-4" /> : <ArrowDownNarrowWide className="h-4 w-4" />
          )}
        </Button>

        {/* Refresh Button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchProjectIdeas} 
          disabled={loading}
          className="ml-auto h-9"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin mr-0", !loading && "mr-2")} />
          {!loading && "Refresh Data"}
        </Button>
      </div>

      <Table>
        <TableCaption>A list of your project ideas. {projectIdeas.length === 0 && !loading && "Add some from your Google Sheet!"}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Project Title</TableHead>
            <TableHead className="w-[20%]">Project Category</TableHead>
            <TableHead>Quick Summary</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projectIdeas.length === 0 && !loading ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No project ideas found. Try adjusting your filters or refresh.
              </TableCell>
            </TableRow>
          ) : (
            projectIdeas.map((idea, index) => {
              const isExpanded = expandedSummaries[index];
              const isLongSummary = idea.summary.length > SUMMARY_CHAR_LIMIT;

              return (
                <TableRow key={index}>
                  <TableCell className="font-medium align-top">{idea.title}</TableCell>
                  <TableCell className="align-top">{idea.category}</TableCell>
                  <TableCell className="align-top">
                    {isLongSummary ? (
                      <Collapsible open={isExpanded} onOpenChange={() => toggleSummary(index)}>
                        <div className="flex flex-col items-start">
                          <span className={cn(!isExpanded && "text-muted-foreground")}>
                            {isExpanded ? idea.summary : `${idea.summary.substring(0, SUMMARY_CHAR_LIMIT)}...`}
                          </span>
                          <CollapsibleTrigger asChild>
                            <Button variant="link" size="sm" className="p-0 h-auto mt-1 text-xs">
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
                        <CollapsibleContent>
                          {/* The full summary is already rendered above when expanded,
                              so this content area can be minimal or not strictly needed
                              if the trigger itself shows/hides the text directly.
                              However, using CollapsibleContent is good for semantics and animations.
                              For this setup, we are showing the full summary text directly
                              when isExpanded is true, so this content block isn't strictly
                              necessary to re-render the text, but it's part of the pattern.
                              If the summary were very long, one might put the full text
                              only in the CollapsibleContent.
                          */}
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <p>{idea.summary}</p>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectIdeasTracker;
