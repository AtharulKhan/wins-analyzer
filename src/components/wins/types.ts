
export interface Win {
  id: string;
  title: string;
  category: string;
  subCategories: string;
  summary: string;
  platform: string;
  date: Date;
  link: string;
  isFavorite?: boolean;
  isArchived?: boolean;
}

export interface WinsTrackerProps {
  view?: 'table' | 'kanban' | 'calendar' | 'dashboard';
}

export interface SortOption {
  key: string;
  order: string;
}

// Google Sheets API configuration
export const GOOGLE_SHEETS_API_KEY = 'AIzaSyDsoN29aqbA8yJPVoORiTemvl21ft1zBls';
export const GOOGLE_SHEETS_ID = '1zx957CNpMus2IOY17j0TIt5yopSWs1v3AkAf7TSnExw';
export const GOOGLE_SHEETS_RANGE = 'Master!A2:H'; // Updated to include column H
