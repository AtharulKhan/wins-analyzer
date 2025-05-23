import React, { useState } from 'react';
import { useProjectIdeasData } from './useProjectIdeasData';
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
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
  const { projectIdeas, loading, error } = useProjectIdeasData();
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
    <div className="container mx-auto py-4">
      <Table>
        <TableCaption>A list of your project ideas.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Project Title</TableHead>
            <TableHead className="w-[20%]">Project Category</TableHead>
            <TableHead>Quick Summary</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projectIdeas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No project ideas found. Add some from your Google Sheet!
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
