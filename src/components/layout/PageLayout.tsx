
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function PageLayout({ children, title }: PageLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950/50">
      <Navbar>
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden mr-2 h-9 w-9 rounded-lg bg-white/80 dark:bg-slate-800/80 shadow-sm hover:shadow-md border border-slate-200/60 dark:border-slate-700/60 transition-all duration-200" 
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
      </Navbar>
      
      <div className="flex-1 flex">
        {/* Desktop sidebar */}
        {!isMobile && (
          <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
        )}
        
        {/* Mobile sidebar as sheet */}
        {isMobile && (
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetContent 
              side="left" 
              className="p-0 w-64 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900 border-r border-slate-200/60 dark:border-slate-700/60 shadow-xl backdrop-blur-sm"
            >
              <Sidebar 
                isCollapsed={false} 
                onToggle={() => setMobileMenuOpen(false)} 
                className="w-full border-none shadow-none" 
              />
            </SheetContent>
          </Sheet>
        )}
        
        <main className="flex-1 transition-all duration-300 relative">
          {/* Mobile menu button positioned at top-left when navbar is removed */}
          {isMobile && (
            <div className="absolute top-4 left-4 z-10">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-lg bg-white/80 dark:bg-slate-800/80 shadow-sm hover:shadow-md border border-slate-200/60 dark:border-slate-700/60 transition-all duration-200" 
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="container max-w-full p-6 lg:p-8 animate-fade-in-up space-y-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-8 bg-gradient-to-b from-primary to-primary/60 rounded-full shadow-sm"></div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">{title}</h1>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
