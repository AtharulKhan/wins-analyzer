
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

// Color schemes for different categories
const getCategoryColorClass = (category: string, index: number) => {
  const colors = [
    'from-blue-50 to-indigo-100 border-blue-200',
    'from-emerald-50 to-green-100 border-emerald-200',
    'from-purple-50 to-violet-100 border-purple-200',
    'from-amber-50 to-yellow-100 border-amber-200',
    'from-rose-50 to-pink-100 border-rose-200',
    'from-cyan-50 to-teal-100 border-cyan-200',
    'from-orange-50 to-red-100 border-orange-200',
    'from-lime-50 to-green-100 border-lime-200'
  ];
  return colors[index % colors.length];
};

const getGroupHeaderColor = (index: number) => {
  const colors = [
    'from-blue-500/10 to-indigo-500/20 border-blue-300/30',
    'from-emerald-500/10 to-green-500/20 border-emerald-300/30',
    'from-purple-500/10 to-violet-500/20 border-purple-300/30',
    'from-amber-500/10 to-yellow-500/20 border-amber-300/30',
    'from-rose-500/10 to-pink-500/20 border-rose-300/30',
    'from-cyan-500/10 to-teal-500/20 border-cyan-300/30',
    'from-orange-500/10 to-red-500/20 border-orange-300/30',
    'from-lime-500/10 to-green-500/20 border-lime-300/30'
  ];
  return colors[index % colors.length];
};

export function WinsList({ 
  groupedWins, 
  groupBy, 
  toggleFavorite, 
  toggleArchive, 
  setSelectedSummary,
  isMobile = false
}: WinsListProps) {
  return (
    <Card className={`${isMobile ? "mx-2 w-full" : ""} bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden animate-fade-in-up`}>
      <CardContent className="p-0">
        {groupBy === 'none' ? (
          <div className="overflow-hidden rounded-2xl">
            {!isMobile && (
              <div className="bg-gradient-to-r from-slate-100 via-blue-50 to-indigo-100/80 border-b border-slate-200/60 px-6 py-5 backdrop-blur-sm">
                <div className="grid grid-cols-6 gap-4 text-sm font-bold text-slate-700 uppercase tracking-wider">
                  <div className="col-span-2 text-indigo-700">Title & Category</div>
                  <div className="text-emerald-700">Sub-Categories</div>
                  <div className="text-purple-700">Platform</div>
                  <div className="text-amber-700">Date</div>
                  <div className="text-center text-rose-700">Actions</div>
                </div>
              </div>
            )}
            
            <div className="divide-y divide-slate-200/50">
              {groupedWins.ungrouped.length === 0 ? (
                <div className="p-16 text-center bg-gradient-to-br from-slate-50 to-blue-50/30">
                  <div className="text-slate-500 text-xl mb-3 font-semibold">No wins found</div>
                  <div className="text-slate-400 text-sm">Try adjusting your filters or adding new wins.</div>
                </div>
              ) : (
                isMobile ? (
                  <div className="p-3 space-y-2">
                    {groupedWins.ungrouped.map((win, index) => (
                      <div 
                        key={win.id} 
                        className="animate-slide-up"
                        style={{ animationDelay: `${index * 80}ms` }}
                      >
                        <WinItem 
                          win={win}
                          toggleFavorite={toggleFavorite}
                          toggleArchive={toggleArchive}
                          viewSummary={setSelectedSummary}
                          isMobile={isMobile}
                          colorIndex={index}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  groupedWins.ungrouped.map((win, index) => (
                    <div 
                      key={win.id} 
                      className={`animate-slide-up hover:bg-gradient-to-r ${getCategoryColorClass(win.category, index)} hover:shadow-lg transition-all duration-300 hover:scale-[1.01]`}
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <WinItem 
                        win={win}
                        toggleFavorite={toggleFavorite}
                        toggleArchive={toggleArchive}
                        viewSummary={setSelectedSummary}
                        isMobile={isMobile}
                        colorIndex={index}
                      />
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-300/40">
            {Object.entries(groupedWins).map(([group, groupWins], groupIndex) => (
              <div key={group} className="animate-fade-in-up" style={{ animationDelay: `${groupIndex * 150}ms` }}>
                <div className={`bg-gradient-to-r ${getGroupHeaderColor(groupIndex)} px-6 py-5 border-b backdrop-blur-sm`}>
                  <h3 className="font-bold text-slate-800 text-xl tracking-wide">{group}</h3>
                </div>
                
                {isMobile ? (
                  <div className="p-3 space-y-2">
                    {groupWins.map((win, index) => (
                      <div 
                        key={win.id} 
                        className="animate-slide-up"
                        style={{ animationDelay: `${(groupIndex * 150) + (index * 80)}ms` }}
                      >
                        <WinItem
                          win={win}
                          toggleFavorite={toggleFavorite}
                          toggleArchive={toggleArchive}
                          viewSummary={setSelectedSummary}
                          isMobile={isMobile}
                          colorIndex={index + groupIndex}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div className="bg-gradient-to-r from-slate-50 via-blue-50/30 to-indigo-50/40 px-6 py-4 border-b border-slate-200/50">
                      <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-slate-700">
                        <div className="col-span-2 text-indigo-700">Title & Category</div>
                        <div className="text-emerald-700">Sub-Categories</div>
                        <div className="text-purple-700">Platform</div>
                        <div className="text-amber-700">Date</div>
                        <div className="text-center text-rose-700">Actions</div>
                      </div>
                    </div>
                    <div className="divide-y divide-slate-200/50">
                      {groupWins.map((win, index) => (
                        <div 
                          key={win.id} 
                          className={`animate-slide-up hover:bg-gradient-to-r ${getCategoryColorClass(win.category, index + groupIndex)} hover:shadow-lg transition-all duration-300 hover:scale-[1.01]`}
                          style={{ animationDelay: `${(groupIndex * 150) + (index * 80)}ms` }}
                        >
                          <WinItem
                            win={win}
                            toggleFavorite={toggleFavorite}
                            toggleArchive={toggleArchive}
                            viewSummary={setSelectedSummary}
                            isMobile={isMobile}
                            colorIndex={index + groupIndex}
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
