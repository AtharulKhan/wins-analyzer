
import React from 'react';
import { Star, Archive, ExternalLink, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableRow, TableCell } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Win } from './types';

interface WinItemProps {
  win: Win;
  toggleFavorite: (id: string) => void;
  toggleArchive: (id: string) => void;
  viewSummary: (summary: string) => void;
}

export function WinItem({ win, toggleFavorite, toggleArchive, viewSummary }: WinItemProps) {
  return (
    <TableRow key={win.id}>
      <TableCell>
        <div className="flex items-center gap-1">
          <a 
            href={win.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium hover:underline flex items-center gap-1"
          >
            {win.title}
            {win.link && <ExternalLink className="h-3 w-3" />}
          </a>
          {win.isFavorite && <Star className="h-3 w-3 text-yellow-500" />}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {win.category.split(',').map((cat, idx) => (
            <span 
              key={idx} 
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted"
            >
              {cat.trim()}
            </span>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {win.subCategories.split(',').map((subCat, idx) => (
            <span 
              key={idx} 
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted/60"
            >
              {subCat.trim()}
            </span>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-muted/30">
          {win.platform}
        </span>
      </TableCell>
      <TableCell>
        {win.date.toLocaleDateString()}
      </TableCell>
      <TableCell>
        <div className="flex space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => viewSummary(win.summary)}
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Summary</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavorite(win.id)}
                >
                  <Star className={`h-4 w-4 ${win.isFavorite ? "text-yellow-500 fill-yellow-500" : ""}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{win.isFavorite ? "Remove from favorites" : "Add to favorites"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleArchive(win.id)}
                >
                  <Archive className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Archive win</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  );
}
