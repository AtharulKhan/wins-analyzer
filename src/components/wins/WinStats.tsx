import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Win } from './types';
import { Calendar, TrendingUp, BarChart3 } from 'lucide-react';

interface RecentWinsProps {
  wins: Win[];
}

export function RecentWins({ wins }: RecentWinsProps) {
  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white via-slate-50/50 to-white border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/3 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="relative z-10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors duration-300">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-primary transition-colors duration-300">
              Recent Wins
            </CardTitle>
            <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-300">
              Your latest achievements
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 relative z-10">
        {wins.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500">No recent wins found.</p>
          </div>
        ) : (
          wins.map((win, index) => (
            <div 
              key={win.id} 
              className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0 group/item hover:bg-slate-50/50 -mx-2 px-2 py-2 rounded-lg transition-all duration-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="font-medium text-slate-900 group-hover/item:text-primary transition-colors duration-200 line-clamp-2">
                {win.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2 mt-1">
                <span className="bg-slate-100 px-2 py-1 rounded-md text-xs font-medium">
                  {win.category.split(',')[0]}
                </span>
                <span>•</span>
                <span>{win.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              {win.summary && (
                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {win.summary}
                </p>
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
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white via-slate-50/50 to-white border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/3 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="relative z-10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors duration-300">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors duration-300">
              Category Breakdown
            </CardTitle>
            <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-300">
              Distribution of your wins
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="space-y-4">
          {breakdown.map(({ category, count, percentage }, index) => (
            <div 
              key={category}
              className="group/item hover:bg-slate-50/50 -mx-2 px-2 py-2 rounded-lg transition-all duration-200"
              style={{ animationDelay: `${index * 100 + 200}ms` }}
            >
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="font-medium text-slate-700 group-hover/item:text-slate-900 transition-colors duration-200">
                  {category}
                </span>
                <span className="text-slate-500 bg-slate-100 px-2 py-1 rounded-md text-xs font-medium">
                  {count} ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full animate-progress"
                  style={{ 
                    '--progress-width': `${percentage}%`,
                    animationDelay: `${index * 150 + 300}ms`
                  } as React.CSSProperties}
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
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white via-slate-50/50 to-white border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02]">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/3 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="relative z-10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-500/10 rounded-xl group-hover:bg-violet-500/20 transition-colors duration-300">
            <TrendingUp className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-violet-600 transition-colors duration-300">
              SubCategory Breakdown
            </CardTitle>
            <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-300">
              Distribution by subcategories
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="space-y-4">
          {breakdown.map(({ subCategory, count, percentage }, index) => (
            <div 
              key={subCategory}
              className="group/item hover:bg-slate-50/50 -mx-2 px-2 py-2 rounded-lg transition-all duration-200"
              style={{ animationDelay: `${index * 100 + 400}ms` }}
            >
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="font-medium text-slate-700 group-hover/item:text-slate-900 transition-colors duration-200">
                  {subCategory}
                </span>
                <span className="text-slate-500 bg-slate-100 px-2 py-1 rounded-md text-xs font-medium">
                  {count} ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-violet-400 to-violet-500 h-2 rounded-full animate-progress"
                  style={{ 
                    '--progress-width': `${percentage}%`,
                    animationDelay: `${index * 150 + 500}ms`
                  } as React.CSSProperties}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
