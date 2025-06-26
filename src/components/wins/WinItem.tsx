
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
  colorIndex?: number;
}

// Color schemes for categories
const getCategoryBadgeColor = (category: string, index: number = 0, isFavorite: boolean = false) => {
  if (isFavorite) {
    const favoriteColors = [
      'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200',
      'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-200',
      'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-200',
      'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-200',
      'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-200',
      'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-200',
      'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-200'
    ];
    return favoriteColors[index % favoriteColors.length];
  }
  
  const colors = [
    'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200',
    'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    'bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200',
    'bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200',
    'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
    'bg-lime-100 text-lime-800 border-lime-200 hover:bg-lime-200'
  ];
  return colors[index % colors.length];
};

// Color schemes for sub-category badges
const getSubCategoryColors = (index: number) => {
  const colors = [
    'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
    'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100',
    'bg-green-50 text-green-700 border-green-100 hover:bg-green-100',
    'bg-violet-50 text-violet-700 border-violet-100 hover:bg-violet-100',
    'bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-100',
    'bg-pink-50 text-pink-700 border-pink-100 hover:bg-pink-100',
    'bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-100'
  ];
  return colors[index % colors.length];
};

// Platform colors
const getPlatformColor = (platform: string, index: number) => {
  const colors = [
    'text-blue-600 font-semibold',
    'text-emerald-600 font-semibold',
    'text-purple-600 font-semibold',
    'text-amber-600 font-semibold',
    'text-rose-600 font-semibold',
    'text-cyan-600 font-semibold',
    'text-orange-600 font-semibold'
  ];
  return colors[index % colors.length];
};

export function WinItem({ win, toggleFavorite, toggleArchive, viewSummary, isMobile = false, colorIndex = 0 }: WinItemProps) {
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
    const cardColors = [
      'from-blue-50 via-white to-indigo-50 border-blue-200',
      'from-emerald-50 via-white to-green-50 border-emerald-200',
      'from-purple-50 via-white to-violet-50 border-purple-200',
      'from-amber-50 via-white to-yellow-50 border-amber-200',
      'from-rose-50 via-white to-pink-50 border-rose-200',
      'from-cyan-50 via-white to-teal-50 border-cyan-200',
      'from-orange-50 via-white to-red-50 border-orange-200'
    ];
    
    return (
      <Card className={`mb-3 mx-1 bg-gradient-to-br ${cardColors[colorIndex % cardColors.length]} backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-xl overflow-hidden border-2`}>
        <CardHeader className="pb-3 bg-gradient-to-r from-white/60 to-white/30 border-b border-slate-200/50 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <Checkbox 
                checked={win.isFavorite} 
                onCheckedChange={() => toggleFavorite(win.id)}
                className="mt-1 border-slate-400 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-indigo-600 data-[state=checked]:border-blue-500 shadow-sm hover:shadow-md transition-all duration-200"
              />
              <CardTitle className="text-base font-bold text-slate-800 leading-tight">
                {win.title}
              </CardTitle>
            </div>
          </div>
          <div className="ml-7">
            <Badge className={`text-xs font-semibold border transition-all duration-200 hover:scale-105 ${getCategoryBadgeColor(win.category, colorIndex, win.isFavorite)}`}>
              {win.category}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-3">
          <div className="text-xs text-slate-500 mb-3 flex items-center gap-2">
            <span className={`font-bold ${getPlatformColor(win.platform, colorIndex)}`}>{win.platform}</span>
            <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
            <span className="text-slate-600 font-medium">{timeAgo}</span>
          </div>
          
          {subCategoriesArray.length > 0 && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {visibleSubCategories.map((subCategory, idx) => (
                  <Badge 
                    key={subCategory} 
                    className={`text-xs border transition-all duration-200 hover:scale-105 ${getSubCategoryColors(idx + colorIndex)}`}
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
                  className="text-xs h-6 px-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all duration-200"
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
        
        <CardFooter className="p-4 pt-0 bg-gradient-to-r from-slate-50/50 to-white/80 border-t border-slate-200/60 backdrop-blur-sm">
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={openLink}
              disabled={!win.link}
              className="flex-1 text-xs h-8 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-slate-300 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Link className="h-3 w-3 mr-1.5" />
              View Link
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => viewSummary(win.summary)}
              className="flex-1 text-xs h-8 bg-white hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 border-slate-300 hover:border-emerald-300 text-emerald-700 hover:text-emerald-800 transition-all duration-200 shadow-sm hover:shadow-md"
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
    <div className="px-6 py-5 grid grid-cols-6 gap-4 items-center group transition-all duration-300">
      {/* Title & Category Column */}
      <div className="col-span-2 space-y-2">
        <div className="flex items-start gap-3">
          <Checkbox 
            checked={win.isFavorite} 
            onCheckedChange={() => toggleFavorite(win.id)}
            className="mt-1 border-slate-400 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-indigo-600 data-[state=checked]:border-blue-500 transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md"
          />
          <div className="flex-1 min-w-0">
            <div className="font-bold text-slate-800 text-sm leading-tight mb-2 group-hover:text-slate-900 transition-colors">
              {win.title}
            </div>
            <Badge 
              className={`text-xs font-semibold border transition-all duration-200 hover:scale-105 ${getCategoryBadgeColor(win.category, colorIndex, win.isFavorite)}`}
            >
              {win.category}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Sub-Categories Column */}
      <div className="space-y-1">
        <div className="flex flex-wrap gap-1">
          {visibleSubCategories.map((subCategory, idx) => (
            <Badge 
              key={subCategory} 
              className={`text-xs border transition-all duration-200 hover:scale-105 ${getSubCategoryColors(idx + colorIndex)}`}
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
            className="text-xs p-1 h-5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200 rounded-full"
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
      <div className={`text-sm font-bold ${getPlatformColor(win.platform, colorIndex)}`}>
        {win.platform}
      </div>
      
      {/* Date Column */}
      <div className="text-sm text-slate-600 font-medium">
        {timeAgo}
      </div>
      
      {/* Actions Column */}
      <div className="flex items-center justify-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={openLink}
          disabled={!win.link}
          className="h-8 w-8 hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 hover:scale-110 disabled:opacity-40 rounded-full shadow-sm hover:shadow-md"
          title={win.link ? "Open link" : "No link available"}
        >
          <Link className="h-4 w-4 text-blue-600" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => viewSummary(win.summary)}
          className="h-8 w-8 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-green-100 transition-all duration-200 hover:scale-110 rounded-full shadow-sm hover:shadow-md"
          title="View summary"
        >
          <Eye className="h-4 w-4 text-emerald-600" />
        </Button>
      </div>
    </div>
  );
}
