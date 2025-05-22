
import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';

// Hard-coded Google Sheets API values
const GOOGLE_SHEETS_API_KEY = 'AIzaSyDsoN29aqbA8yJPVoORiTemvl21ft1zBls';
const GOOGLE_SHEETS_ID = '1zx957CNpMus2IOY17j0TIt5yopSWs1v3AkAf7TSnExw';
const GOOGLE_SHEETS_RANGE = 'Master!A2:H';

export interface Win {
  id: string;
  title: string;
  category: string;
  date: Date;
  link: string;
  desc: string;
}

export const useDashboardData = () => {
  const { toast } = useToast();
  const [archived] = useLocalStorage('win-archived', [] as string[]);
  
  const [wins, setWins] = useState<Win[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch data from Google Sheets
  const fetchData = async () => {
    setLoading(true);
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_ID}/values/${GOOGLE_SHEETS_RANGE}?key=${GOOGLE_SHEETS_API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.values && data.values.length) {
        const parsedWins: Win[] = data.values.map((row: string[], index: number) => {
          const [title, category, subCategories, summary, platform, dateStr, linkText, linkUrl] = row;
          const id = `win-${index}-${dateStr}`;
          return {
            id,
            title: title || 'Untitled',
            category: category || 'Uncategorized',
            date: dateStr ? new Date(dateStr) : new Date(),
            link: linkUrl || '',
            desc: summary || '',
          };
        });
        
        setWins(parsedWins);
      } else {
        toast({
          title: "No data found",
          description: "Your sheet is empty or the range doesn't contain data.",
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "Failed to load data",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter out archived wins
  const activeWins = useMemo(() => {
    return Array.isArray(wins) ? wins.filter(win => !archived.includes(win.id)) : [];
  }, [wins, archived]);

  return {
    wins,
    activeWins,
    loading,
    fetchData
  };
};
