
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
    <Card className={isMobile ? "mx-2" : ""}>
      <CardContent className="p-0">
        {groupBy === 'none' ? (
          <Table>
            {!isMobile && (
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sub-Categories</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
            )}
            <TableBody>
              {groupedWins.ungrouped.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No wins found. Try adjusting your filters or adding new wins.
                  </TableCell>
                </TableRow>
              ) : (
                isMobile ? (
                  <div className="px-2 py-4">
                    {groupedWins.ungrouped.map((win) => (
                      <WinItem 
                        key={win.id}
                        win={win}
                        toggleFavorite={toggleFavorite}
                        toggleArchive={toggleArchive}
                        viewSummary={setSelectedSummary}
                        isMobile={isMobile}
                      />
                    ))}
                  </div>
                ) : (
                  groupedWins.ungrouped.map((win) => (
                    <WinItem 
                      key={win.id}
                      win={win}
                      toggleFavorite={toggleFavorite}
                      toggleArchive={toggleArchive}
                      viewSummary={setSelectedSummary}
                      isMobile={isMobile}
                    />
                  ))
                )
              )}
            </TableBody>
          </Table>
        ) : (
          <div className="divide-y">
            {Object.entries(groupedWins).map(([group, groupWins]) => (
              <div key={group}>
                <div className="p-3 font-medium bg-muted/30">
                  {group}
                </div>
                {isMobile ? (
                  <div className="px-2 py-4">
                    {groupWins.map((win) => (
                      <WinItem
                        key={win.id}
                        win={win}
                        toggleFavorite={toggleFavorite}
                        toggleArchive={toggleArchive}
                        viewSummary={setSelectedSummary}
                        isMobile={isMobile}
                      />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Sub-Categories</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="w-[150px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupWins.map((win) => (
                        <WinItem
                          key={win.id}
                          win={win}
                          toggleFavorite={toggleFavorite}
                          toggleArchive={toggleArchive}
                          viewSummary={setSelectedSummary}
                          isMobile={isMobile}
                        />
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
