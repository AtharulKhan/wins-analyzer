
import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSearch } from '@/context/SearchContext';

interface NavbarProps {
  className?: string;
  children?: React.ReactNode;
}

export function Navbar({
  className,
  children
}: NavbarProps) {
  const { globalSearch, setGlobalSearch } = useSearch();
  
  return null;
}
