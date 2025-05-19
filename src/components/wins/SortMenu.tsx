
import React from 'react';
import { SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface SortMenuProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  groupBy: string;
  setGroupBy: (value: string) => void;
  isMobileDrawer?: boolean;
}

export function SortMenu({ sortBy, setSortBy, groupBy, setGroupBy, isMobileDrawer = false }: SortMenuProps) {
  const SortContent = () => (
    <>
      <div className="space-y-4">
        <div>
          <h4 className="mb-2 text-sm font-medium">Sort By</h4>
          <RadioGroup value={sortBy} onValueChange={setSortBy}>
            {[
              { label: 'Most Recent', value: 'date-desc' },
              { label: 'Oldest First', value: 'date-asc' },
              { label: 'Title (A-Z)', value: 'title-asc' },
              { label: 'Title (Z-A)', value: 'title-desc' }
            ].map(option => (
              <div key={option.value} className="flex items-center space-x-2 py-1">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <div>
          <h4 className="mb-2 text-sm font-medium">Group By</h4>
          <RadioGroup value={groupBy} onValueChange={setGroupBy}>
            {[
              { label: 'None', value: 'none' },
              { label: 'Category', value: 'category' },
              { label: 'Platform', value: 'platform' },
              { label: 'Date', value: 'date' }
            ].map(option => (
              <div key={option.value} className="flex items-center space-x-2 py-1">
                <RadioGroupItem value={option.value} id={`group-${option.value}`} />
                <Label htmlFor={`group-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </>
  );

  // For mobile drawer view, just return the content
  if (isMobileDrawer) {
    return <SortContent />;
  }

  // For desktop, return the dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1">
          <SortAsc className="h-4 w-4" />
          <span>Sort & Group</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
          <DropdownMenuRadioItem value="date-desc">Most Recent</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="date-asc">Oldest First</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="title-asc">Title (A-Z)</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="title-desc">Title (Z-A)</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Group By</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={groupBy} onValueChange={setGroupBy}>
          <DropdownMenuRadioItem value="none">None</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="category">Category</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="platform">Platform</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
