
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Link, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { TableRow, TableCell } from '@/components/ui/table';
import { Win } from './types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

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
  const [isChecked, setIsChecked] = useState(false);
  
  // Convert subCategories string to array if needed
  const subCategoriesArray = typeof win.subCategories === 'string' 
    ? win.subCategories.split(',').map(sc => sc.trim()).filter(Boolean) 
    : Array.isArray(win.subCategories) 
      ? win.subCategories 
      : [];
  
  // Determine if we should show the "show more" button
  const hasMultipleSubCategories = subCategoriesArray.length > 2;
  const visibleSubCategories = showAllSubCategories ? subCategoriesArray : subCategoriesArray.slice(0, 2);
  
  // Function to open the link
  const openLink = () => {
    if (win.link) {
      window.open(win.link, '_blank', 'noopener,noreferrer');
    }
  };
  
  if (isMobile) {
    return (
      <Card className="mb-4 mx-1 w-full bg-white/90 backdrop-blur-sm border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <Checkbox 
              checked={isChecked}
              onCheckedChange={setIsChecked}
              className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <div className="flex-1">
              <CardTitle className="text-base font-semibold text-slate-800 leading-relaxed">
                {win.title}
              </CardTitle>
              <div className="mt-2">
                <Badge 
                  variant={win.isFavorite ? "default" : "outline"} 
                  className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors duration-200"
                >
                  {win.category}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="text-sm text-slate-600 mb-3 flex items-center gap-2">
            <span className="bg-slate-100 px-2 py-1 rounded-md text-xs font-medium">
              {win.platform}
            </span>
            <span>•</span>
            <span>{timeAgo}</span>
          </div>
          {subCategoriesArray.length > 0 && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {visibleSubCategories.map(subCategory => (
                  <Badge 
                    key={subCategory} 
                    variant="secondary" 
                    className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors duration-200"
                  >
                    {subCategory}
                  </Badge>
                ))}
              </div>
              
              {hasMultipleSubCategories && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAllSubCategories(!showAllSubCategories)}
                  className="text-xs h-7 text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200"
                >
                  {showAllSubCategories ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      +{subCategoriesArray.length - 2} more
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2 pt-0">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={openLink}
            disabled={!win.link}
            className="text-xs px-3 py-1.5 h-auto text-slate-600 hover:text-primary hover:bg-primary/10 transition-all duration-200"
          >
            <Link className="h-3 w-3 mr-1.5" />
            View Link
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => viewSummary(win.summary)}
            className="text-xs px-3 py-1.5 h-auto text-slate-600 hover:text-primary hover:bg-primary/10 transition-all duration-200"
          >
            <Eye className="h-3 w-3 mr-1.5" />
            View Summary
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <TableRow className="group hover:bg-slate-50/50 transition-all duration-200 border-b border-slate-100/60">
      <TableCell className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Checkbox 
            checked={isChecked}
            onCheckedChange={setIsChecked}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <span className="font-medium text-slate-800 group-hover:text-slate-900 transition-colors duration-200">
            {win.title}
          </span>
        </div>
      </TableCell>
      <TableCell className="px-6 py-4">
        <Badge 
          variant={win.isFavorite ? "default" : "outline"}
          className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors duration-200"
        >
          {win.category}
        </Badge>
      </TableCell>
      <TableCell className="px-6 py-4">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {visibleSubCategories.map(subCategory => (
              <Badge 
                key={subCategory} 
                variant="secondary" 
                className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors duration-200"
              >
                {subCategory}
              </Badge>
            ))}
          </div>
          
          {hasMultipleSubCategories && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowAllSubCategories(!showAllSubCategories)}
              className="text-xs p-1 h-6 text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200"
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
      <TableCell className="px-6 py-4">
        <span className="text-slate-700 bg-slate-100 px-2 py-1 rounded-md text-sm font-medium">
          {win.platform}
        </span>
      </TableCell>
      <TableCell className="px-6 py-4 text-slate-600 text-sm">
        {timeAgo}
      </TableCell>
      <TableCell className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={openLink}
            disabled={!win.link}
            title={win.link ? "Open link" : "No link available"}
            className="h-8 w-8 text-slate-600 hover:text-primary hover:bg-primary/10 transition-all duration-200"
          >
            <Link className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => viewSummary(win.summary)}
            className="h-8 w-8 text-slate-600 hover:text-primary hover:bg-primary/10 transition-all duration-200"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
