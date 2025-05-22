
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeywordItem } from './useKeywordData';

interface ThemeCloudProps {
  commonKeywords: KeywordItem[];
}

export const ThemeCloud: React.FC<ThemeCloudProps> = ({ 
  commonKeywords 
}) => {
  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle>Common Themes</CardTitle>
        <p className="text-sm text-muted-foreground">Meaningful keywords from titles and descriptions</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 justify-center">
          {commonKeywords.length > 0 ? (
            commonKeywords.map(({ word, size, opacity, color }) => (
              <div 
                key={word}
                className="px-3 py-1.5 rounded-full text-white"
                style={{ 
                  fontSize: `${size}rem`,
                  opacity,
                  backgroundColor: color
                }}
              >
                {word}
              </div>
            ))
          ) : (
            <div className="text-muted-foreground text-sm">No meaningful keywords found</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
