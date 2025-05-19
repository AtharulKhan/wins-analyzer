
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface SortMenuProps {
  sortBy: { key: string; order: string };
  setSortBy: (sortBy: { key: string; order: string }) => void;
  groupBy: string;
  setGroupBy: (groupBy: string) => void;
}

export function SortMenu({ sortBy, setSortBy, groupBy, setGroupBy }: SortMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1">
          {sortBy.order === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          <span>Sort & Group</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => setSortBy({ key: 'date', order: 'desc' })}
        >
          {sortBy.key === 'date' && sortBy.order === 'desc' && <span className="mr-2">✓</span>}
          Newest First
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setSortBy({ key: 'date', order: 'asc' })}
        >
          {sortBy.key === 'date' && sortBy.order === 'asc' && <span className="mr-2">✓</span>}
          Oldest First
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setSortBy({ key: 'title', order: 'asc' })}
        >
          {sortBy.key === 'title' && sortBy.order === 'asc' && <span className="mr-2">✓</span>}
          Title A-Z
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setSortBy({ key: 'title', order: 'desc' })}
        >
          {sortBy.key === 'title' && sortBy.order === 'desc' && <span className="mr-2">✓</span>}
          Title Z-A
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setSortBy({ key: 'category', order: 'asc' })}
        >
          {sortBy.key === 'category' && sortBy.order === 'asc' && <span className="mr-2">✓</span>}
          Category A-Z
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setSortBy({ key: 'platform', order: 'asc' })}
        >
          {sortBy.key === 'platform' && sortBy.order === 'asc' && <span className="mr-2">✓</span>}
          Platform A-Z
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Group By</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => setGroupBy('none')}
        >
          {groupBy === 'none' && <span className="mr-2">✓</span>}
          No Grouping
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setGroupBy('category')}
        >
          {groupBy === 'category' && <span className="mr-2">✓</span>}
          Group by Category
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setGroupBy('subCategory')}
        >
          {groupBy === 'subCategory' && <span className="mr-2">✓</span>}
          Group by Sub-Category
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setGroupBy('platform')}
        >
          {groupBy === 'platform' && <span className="mr-2">✓</span>}
          Group by Platform
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setGroupBy('month')}
        >
          {groupBy === 'month' && <span className="mr-2">✓</span>}
          Group by Month
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
