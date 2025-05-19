
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, Archive, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  
  // Convert subCategories string to array if needed
  const subCategoriesArray = typeof win.subCategories === 'string' 
    ? win.subCategories.split(',').map(sc => sc.trim()).filter(Boolean) 
    : Array.isArray(win.subCategories) 
      ? win.subCategories 
      : [];
  
  if (isMobile) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium flex items-center justify-between">
            <span className="truncate">{win.title}</span>
            <Badge variant={win.isFavorite ? "default" : "outline"}>
              {win.category}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-sm text-muted-foreground mb-1">
            <span>{win.platform} • {timeAgo}</span>
          </div>
          {subCategoriesArray.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {subCategoriesArray.map(subCategory => (
                <Badge key={subCategory} variant="secondary" className="text-xs">
                  {subCategory}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => toggleFavorite(win.id)}
            className={win.isFavorite ? "text-red-500" : ""}
          >
            <Heart className="h-4 w-4 mr-1" />
            {win.isFavorite ? "Favorited" : "Favorite"}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => toggleArchive(win.id)}
          >
            <Archive className="h-4 w-4 mr-1" />
            {win.isArchived ? "Archived" : "Archive"}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => viewSummary(win.summary)}
          >
            <Eye className="h-4 w-4 mr-1" />
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
        <div className="flex flex-wrap gap-1">
          {subCategoriesArray.map(subCategory => (
            <Badge key={subCategory} variant="secondary" className="text-xs">
              {subCategory}
            </Badge>
          ))}
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
