import { useState, useEffect } from 'react';

interface ProjectIdea {
  title: string;
  category: string;
  summary: string;
}

const SPREADSHEET_ID = '1zx957CNpMus2IOY17j0TIt5yopSWs1v3AkAf7TSnExw';
const SHEET_NAME = 'Project Ideas';
const RANGE = 'A2:C';

// Construct the URL for fetching data from Google Sheets
// Reference: https://developers.google.com/chart/interactive/docs/spreadsheets#making-a-query
const GOOGLE_SHEETS_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?sheet=${encodeURIComponent(SHEET_NAME)}&range=${encodeURIComponent(RANGE)}`;

export const useProjectIdeasData = () => {
  const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(GOOGLE_SHEETS_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        
        // Google Sheets gviz API returns a JSONP-like response.
        // We need to extract the JSON part from the response.
        // The response looks like: `google.visualization.Query.setResponse({...});`
        // We need the object passed to setResponse.
        const jsonString = text.match(/google\.visualization\.Query\.setResponse\((.*)\)/s);
        if (!jsonString || jsonString.length < 2) {
          throw new Error('Failed to parse Google Sheets JSONP response.');
        }
        
        const data = JSON.parse(jsonString[1]);

        if (data.status === 'error') {
          throw new Error(`Google Sheets API error: ${data.errors.map((e: any) => e.detailed_message).join(', ')}`);
        }

        const rows = data.table?.rows || [];
        const parsedIdeas: ProjectIdea[] = rows.map((row: any) => {
          // Ensure row and row.c exist and have enough elements
          const title = row?.c?.[0]?.v ?? 'Untitled';
          const category = row?.c?.[1]?.v ?? 'Uncategorized';
          const summary = row?.c?.[2]?.v ?? '';
          return { title, category, summary };
        }).filter((idea: ProjectIdea) => idea.title !== 'Untitled' || idea.category !== 'Uncategorized' || idea.summary !== ''); // Filter out completely empty rows if any

        setProjectIdeas(parsedIdeas);
      } catch (err) {
        console.error("Error fetching project ideas:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { projectIdeas, loading, error };
};
