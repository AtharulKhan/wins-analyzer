
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Link, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
      <Card className="mb-3 mx-1 bg-white/90 backdrop-blur-sm border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] rounded-lg overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-r from-slate-50/50 to-white border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <Checkbox 
                checked={win.isFavorite} 
                onCheckedChange={() => toggleFavorite(win.id)}
                className="mt-1 border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <CardTitle className="text-base font-semibold text-slate-800 leading-tight">
                {win.title}
              </CardTitle>
            </div>
          </div>
          <div className="ml-7">
            <Badge variant={win.isFavorite ? "default" : "outline"} className="text-xs font-medium">
              {win.category}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-3">
          <div className="text-xs text-slate-500 mb-3 flex items-center gap-2">
            <span className="font-medium">{win.platform}</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span>{timeAgo}</span>
          </div>
          
          {subCategoriesArray.length > 0 && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {visibleSubCategories.map(subCategory => (
                  <Badge 
                    key={subCategory} 
                    variant="secondary" 
                    className="text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
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
                  className="text-xs h-6 px-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
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
        
        <CardFooter className="p-4 pt-0 bg-slate-50/30 border-t border-slate-100">
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={openLink}
              disabled={!win.link}
              className="flex-1 text-xs h-8 bg-white hover:bg-slate-50 border-slate-200"
            >
              <Link className="h-3 w-3 mr-1.5" />
              View Link
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => viewSummary(win.summary)}
              className="flex-1 text-xs h-8 bg-white hover:bg-slate-50 border-slate-200"
            >
              <Eye className="h-3 w-3 mr-1.5" />
              Summary
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <div className="px-6 py-4 grid grid-cols-6 gap-4 items-center group hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-white transition-all duration-200">
      {/* Title & Category Column */}
      <div className="col-span-2 space-y-2">
        <div className="flex items-start gap-3">
          <Checkbox 
            checked={win.isFavorite} 
            onCheckedChange={() => toggleFavorite(win.id)}
            className="mt-1 border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-200 hover:scale-110"
          />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-slate-800 text-sm leading-tight mb-1 group-hover:text-slate-900 transition-colors">
              {win.title}
            </div>
            <Badge 
              variant={win.isFavorite ? "default" : "outline"} 
              className="text-xs font-medium transition-all duration-200 hover:scale-105"
            >
              {win.category}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Sub-Categories Column */}
      <div className="space-y-1">
        <div className="flex flex-wrap gap-1">
          {visibleSubCategories.map(subCategory => (
            <Badge 
              key={subCategory} 
              variant="secondary" 
              className="text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all duration-200 hover:scale-105"
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
            className="text-xs p-1 h-5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200"
          >
            {showAllSubCategories ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                +{subCategoriesArray.length - 2}
              </>
            )}
          </Button>
        )}
      </div>
      
      {/* Platform Column */}
      <div className="text-sm text-slate-600 font-medium">
        {win.platform}
      </div>
      
      {/* Date Column */}
      <div className="text-sm text-slate-500">
        {timeAgo}
      </div>
      
      {/* Actions Column */}
      <div className="flex items-center justify-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={openLink}
          disabled={!win.link}
          className="h-8 w-8 hover:bg-slate-100 transition-all duration-200 hover:scale-110 disabled:opacity-40"
          title={win.link ? "Open link" : "No link available"}
        >
          <Link className="h-4 w-4 text-slate-600" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => viewSummary(win.summary)}
          className="h-8 w-8 hover:bg-slate-100 transition-all duration-200 hover:scale-110"
          title="View summary"
        >
          <Eye className="h-4 w-4 text-slate-600" />
        </Button>
      </div>
    </div>
  );
}
