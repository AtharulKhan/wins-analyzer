
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WinItem } from './WinItem';
import { Win } from './types';

interface WinsListProps {
  groupedWins: Record<string, Win[]>;
  groupBy: string;
  toggleFavorite: (id: string) => void;
  toggleArchive: (id: string) => void;
  setSelectedSummary: (summary: string) => void;
  isMobile?: boolean;
}

export function WinsList({ 
  groupedWins, 
  groupBy, 
  toggleFavorite, 
  toggleArchive, 
  setSelectedSummary,
  isMobile = false
}: WinsListProps) {
  return (
    <Card className={`${isMobile ? "mx-2 w-full" : ""} bg-white/95 backdrop-blur-sm border-0 shadow-lg rounded-xl overflow-hidden animate-fade-in-up`}>
      <CardContent className="p-0">
        {groupBy === 'none' ? (
          <div className="overflow-hidden rounded-xl">
            {!isMobile && (
              <div className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/60 px-6 py-4">
                <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  <div className="col-span-2">Title & Category</div>
                  <div>Sub-Categories</div>
                  <div>Platform</div>
                  <div>Date</div>
                  <div className="text-center">Actions</div>
                </div>
              </div>
            )}
            
            <div className="divide-y divide-slate-100">
              {groupedWins.ungrouped.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-slate-400 text-lg mb-2">No wins found</div>
                  <div className="text-slate-500 text-sm">Try adjusting your filters or adding new wins.</div>
                </div>
              ) : (
                isMobile ? (
                  <div className="p-2">
                    {groupedWins.ungrouped.map((win, index) => (
                      <div 
                        key={win.id} 
                        className="animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <WinItem 
                          win={win}
                          toggleFavorite={toggleFavorite}
                          toggleArchive={toggleArchive}
                          viewSummary={setSelectedSummary}
                          isMobile={isMobile}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  groupedWins.ungrouped.map((win, index) => (
                    <div 
                      key={win.id} 
                      className="animate-slide-up hover:bg-slate-50/50 transition-colors duration-200"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <WinItem 
                        win={win}
                        toggleFavorite={toggleFavorite}
                        toggleArchive={toggleArchive}
                        viewSummary={setSelectedSummary}
                        isMobile={isMobile}
                      />
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {Object.entries(groupedWins).map(([group, groupWins], groupIndex) => (
              <div key={group} className="animate-fade-in-up" style={{ animationDelay: `${groupIndex * 100}ms` }}>
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b border-slate-200/60">
                  <h3 className="font-semibold text-slate-700 text-lg">{group}</h3>
                </div>
                
                {isMobile ? (
                  <div className="p-2">
                    {groupWins.map((win, index) => (
                      <div 
                        key={win.id} 
                        className="animate-slide-up"
                        style={{ animationDelay: `${(groupIndex * 100) + (index * 50)}ms` }}
                      >
                        <WinItem
                          win={win}
                          toggleFavorite={toggleFavorite}
                          toggleArchive={toggleArchive}
                          viewSummary={setSelectedSummary}
                          isMobile={isMobile}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-200/40">
                      <div className="grid grid-cols-6 gap-4 text-sm font-medium text-slate-600">
                        <div className="col-span-2">Title & Category</div>
                        <div>Sub-Categories</div>
                        <div>Platform</div>
                        <div>Date</div>
                        <div className="text-center">Actions</div>
                      </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {groupWins.map((win, index) => (
                        <div 
                          key={win.id} 
                          className="animate-slide-up hover:bg-slate-50/50 transition-colors duration-200"
                          style={{ animationDelay: `${(groupIndex * 100) + (index * 50)}ms` }}
                        >
                          <WinItem
                            win={win}
                            toggleFavorite={toggleFavorite}
                            toggleArchive={toggleArchive}
                            viewSummary={setSelectedSummary}
                            isMobile={isMobile}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
