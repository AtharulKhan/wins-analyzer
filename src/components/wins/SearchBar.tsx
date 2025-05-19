
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
}

export function SearchBar({ search, setSearch }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search wins..."
        className="pl-8"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
