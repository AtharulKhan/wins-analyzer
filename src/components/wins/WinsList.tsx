
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
import { Checkbox } from "@/components/ui/checkbox";
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
    <Card className={`${isMobile ? "mx-2 w-full" : ""} bg-white/90 backdrop-blur-sm border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300`}>
      <CardContent className="p-0">
        {groupBy === 'none' ? (
          <div className="overflow-hidden rounded-xl">
            <Table>
              {!isMobile && (
                <TableHeader className="bg-slate-50/80 border-b border-slate-200/60">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-12 px-6 text-slate-700 font-semibold text-sm">
                      <div className="flex items-center gap-2">
                        <Checkbox className="data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                        Title
                      </div>
                    </TableHead>
                    <TableHead className="h-12 px-6 text-slate-700 font-semibold text-sm">Category</TableHead>
                    <TableHead className="h-12 px-6 text-slate-700 font-semibold text-sm">Sub-Categories</TableHead>
                    <TableHead className="h-12 px-6 text-slate-700 font-semibold text-sm">Platform</TableHead>
                    <TableHead className="h-12 px-6 text-slate-700 font-semibold text-sm">Date</TableHead>
                    <TableHead className="h-12 px-6 text-slate-700 font-semibold text-sm w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
              )}
              <TableBody className="divide-y divide-slate-100/80">
                {groupedWins.ungrouped.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3 text-slate-500">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">No wins found</p>
                          <p className="text-sm text-slate-400">Try adjusting your filters or adding new wins</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  isMobile ? (
                    <div className="px-4 py-6 space-y-4">
                      {groupedWins.ungrouped.map((win, index) => (
                        <div 
                          key={win.id}
                          className="animate-fade-in-up"
                          style={{ animationDelay: `${index * 100}ms` }}
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
                        className="animate-fade-in-up"
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
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="divide-y divide-slate-100/80">
            {Object.entries(groupedWins).map(([group, groupWins], groupIndex) => (
              <div 
                key={group}
                className="animate-fade-in-up"
                style={{ animationDelay: `${groupIndex * 150}ms` }}
              >
                <div className="px-6 py-4 bg-gradient-to-r from-slate-50/80 to-transparent border-b border-slate-100/60">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full"></div>
                    <h3 className="font-semibold text-slate-800 text-lg">{group}</h3>
                    <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                      {groupWins.length} {groupWins.length === 1 ? 'win' : 'wins'}
                    </span>
                  </div>
                </div>
                {isMobile ? (
                  <div className="px-4 py-6 space-y-4">
                    {groupWins.map((win, index) => (
                      <div 
                        key={win.id}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${(groupIndex * 150) + (index * 100) + 200}ms` }}
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
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-50/40">
                        <TableRow className="hover:bg-transparent border-b border-slate-100/60">
                          <TableHead className="h-12 px-6 text-slate-700 font-semibold text-sm">
                            <div className="flex items-center gap-2">
                              <Checkbox className="data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                              Title
                            </div>
                          </TableHead>
                          <TableHead className="h-12 px-6 text-slate-700 font-semibold text-sm">Category</TableHead>
                          <TableHead className="h-12 px-6 text-slate-700 font-semibold text-sm">Sub-Categories</TableHead>
                          <TableHead className="h-12 px-6 text-slate-700 font-semibold text-sm">Platform</TableHead>
                          <TableHead className="h-12 px-6 text-slate-700 font-semibold text-sm">Date</TableHead>
                          <TableHead className="h-12 px-6 text-slate-700 font-semibold text-sm w-[150px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-slate-100/60">
                        {groupWins.map((win, index) => (
                          <div 
                            key={win.id}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${(groupIndex * 150) + (index * 50) + 200}ms` }}
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
                      </TableBody>
                    </Table>
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
