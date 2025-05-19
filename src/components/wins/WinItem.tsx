
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, Archive, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableRow, TableCell } from '@/components/ui/table';
import { Win } from './types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface WinItemProps {
  win: Win;
  toggleFavorite: (id: string) => void;
  toggleArchive: (id: string) => void;
  viewSummary: (summary: string) => void;
  isMobile?: boolean;
}

export function WinItem({ win, toggleFavorite, toggleArchive, viewSummary, isMobile = false }: WinItemProps) {
  const timeAgo = formatDistanceToNow(new Date(win.date), { addSuffix: true });
  const [showAllSubCategories, setShowAllSubCategories] = useState(false);
  
  // Convert subCategories string to array if needed
  const subCategoriesArray = typeof win.subCategories === 'string' 
    ? win.subCategories.split(',').map(sc => sc.trim()).filter(Boolean) 
    : Array.isArray(win.subCategories) 
      ? win.subCategories 
      : [];
  
  // Determine if we should show the "show more" button
  const hasMultipleSubCategories = subCategoriesArray.length > 2;
  const visibleSubCategories = showAllSubCategories ? subCategoriesArray : subCategoriesArray.slice(0, 2);
  
  if (isMobile) {
    return (
      <Card className="mb-4 mx-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium flex items-center justify-between">
            <span className="truncate max-w-[180px]">{win.title}</span>
            <Badge variant={win.isFavorite ? "default" : "outline"} className="ml-2 shrink-0">
              {win.category}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-sm text-muted-foreground mb-1">
            <span>{win.platform} • {timeAgo}</span>
          </div>
          {subCategoriesArray.length > 0 && (
            <div className="mt-2 w-full">
              <div className={cn(
                "flex flex-wrap gap-1 w-full", 
                !showAllSubCategories && hasMultipleSubCategories && "relative max-h-8 overflow-hidden"
              )}>
                {visibleSubCategories.map(subCategory => (
                  <Badge key={subCategory} variant="secondary" className="text-xs">
                    {subCategory}
                  </Badge>
                ))}
                {!showAllSubCategories && hasMultipleSubCategories && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card" />
                )}
              </div>
              
              {hasMultipleSubCategories && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAllSubCategories(!showAllSubCategories)}
                  className="text-xs p-0 h-6 mt-1 w-full flex justify-center items-center"
                >
                  {showAllSubCategories ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Show More ({subCategoriesArray.length - 2})
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap pt-0 gap-2 justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => toggleFavorite(win.id)}
            className={`${win.isFavorite ? "text-red-500" : ""} text-xs px-2`}
          >
            <Heart className="h-3 w-3 mr-1" />
            {win.isFavorite ? "Favorited" : "Favorite"}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => toggleArchive(win.id)}
            className="text-xs px-2"
          >
            <Archive className="h-3 w-3 mr-1" />
            {win.isArchived ? "Archived" : "Archive"}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => viewSummary(win.summary)}
            className="text-xs px-2"
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <TableRow>
      <TableCell className="font-medium">{win.title}</TableCell>
      <TableCell>{win.category}</TableCell>
      <TableCell>
        <div className="relative">
          <div className="flex flex-wrap gap-1">
            {visibleSubCategories.map(subCategory => (
              <Badge key={subCategory} variant="secondary" className="text-xs">
                {subCategory}
              </Badge>
            ))}
          </div>
          
          {hasMultipleSubCategories && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowAllSubCategories(!showAllSubCategories)}
              className="text-xs p-1 h-6 mt-1"
            >
              {showAllSubCategories ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Show More ({subCategoriesArray.length - 2})
                </>
              )}
            </Button>
          )}
        </div>
      </TableCell>
      <TableCell>{win.platform}</TableCell>
      <TableCell>{timeAgo}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => toggleFavorite(win.id)}
            className={win.isFavorite ? "text-red-500" : ""}
          >
            <Heart className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => toggleArchive(win.id)}
          >
            <Archive className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => viewSummary(win.summary)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
