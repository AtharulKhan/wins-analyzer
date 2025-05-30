
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Win } from './types';

interface RecentWinsProps {
  wins: Win[];
}

export function RecentWins({ wins }: RecentWinsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Wins</CardTitle>
        <p className="text-sm text-muted-foreground">Your latest achievements</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {wins.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent wins found.</p>
        ) : (
          wins.map(win => (
            <div key={win.id} className="border-b pb-3 last:border-b-0 last:pb-0">
              <h3 className="font-medium">{win.title}</h3>
              <div className="flex gap-2 text-sm text-muted-foreground mb-1">
                <span>{win.category.split(',')[0]}</span>
                <span>•</span>
                <span>{win.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              {win.summary && (
                <p className="text-sm line-clamp-2">{win.summary}</p>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

interface CategoryBreakdownItem {
  category: string;
  count: number;
  percentage: number;
}

interface CategoryBreakdownProps {
  breakdown: CategoryBreakdownItem[];
}

export function CategoryBreakdown({ breakdown }: CategoryBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Category Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">Distribution of your wins</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {breakdown.map(({ category, count, percentage }) => (
            <div key={category}>
              <div className="flex justify-between text-sm">
                <span>{category}</span>
                <span>{count} ({percentage}%)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface SubCategoryBreakdownItem {
  subCategory: string;
  count: number;
  percentage: number;
}

interface SubCategoryBreakdownProps {
  breakdown: SubCategoryBreakdownItem[];
}

export function SubCategoryBreakdown({ breakdown }: SubCategoryBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">SubCategory Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">Distribution by subcategories</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {breakdown.map(({ subCategory, count, percentage }) => (
            <div key={subCategory}>
              <div className="flex justify-between text-sm">
                <span>{subCategory}</span>
                <span>{count} ({percentage}%)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-secondary h-2 rounded-full" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
