import { renderHook, waitFor, act } from '@testing-library/react';
import { useProjectIdeasData, SortByType, SortOrderType } from './useProjectIdeasData';

// Mock global fetch
global.fetch = jest.fn();

const mockGoogleSheetsResponse = (status: 'ok' | 'error', rows: any[] = [], errorMessages: string[] = []) => {
  if (status === 'error') {
    return {
      status: 'error',
      errors: errorMessages.map(msg => ({ detailed_message: msg })),
    };
  }
  return {
    status: 'ok',
    table: {
      cols: [
        { id: 'A', label: 'Project Title', type: 'string' },
        { id: 'B', label: 'Project Category', type: 'string' },
        { id: 'C', label: 'Quick Summary', type: 'string' },
      ],
      rows: rows.map(row => ({
        c: [
          { v: row.title },
          { v: row.category },
          { v: row.summary },
        ],
      })),
    },
  };
};

const initialMockData = [
  { title: 'Alpha Idea', category: 'Tech', summary: 'Unique summary for Alpha' },
  { title: 'Beta Idea', category: 'Health', summary: 'Another Beta summary' },
  { title: 'Charlie Idea', category: 'Tech', summary: 'Charlie uses Health keyword' },
  { title: 'Delta Idea', category: 'Finance', summary: 'Finance details for Delta' },
];


describe('useProjectIdeasData', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    // Default fetch mock for most tests
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(`google.visualization.Query.setResponse(${JSON.stringify(mockGoogleSheetsResponse('ok', initialMockData))});`),
    });
  });

  it('should have correct initial state for filters, sorting and search', async () => {
    const { result } = renderHook(() => useProjectIdeasData());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.categoryFilter).toBe('All');
    expect(result.current.sortBy).toBe('title');
    expect(result.current.sortOrder).toBe('asc');
    expect(result.current.searchTerm).toBe('');
  });

  it('should update categoryFilter and filter projectIdeas', async () => {
    const { result } = renderHook(() => useProjectIdeasData());
    await waitFor(() => expect(result.current.loading).toBe(false)); 

    act(() => {
      result.current.setCategoryFilter('Health');
    });
    expect(result.current.projectIdeas).toEqual([
      { title: 'Beta Idea', category: 'Health', summary: 'Another Beta summary' },
    ]);
  });

  it('should update sortBy and sortOrder and sort projectIdeas', async () => {
    const { result } = renderHook(() => useProjectIdeasData());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setSortBy('category');
    });
    expect(result.current.projectIdeas.map(p => p.title)).toEqual(['Delta Idea', 'Beta Idea', 'Alpha Idea', 'Charlie Idea']);
  });
  
  it('should update searchTerm and filter projectIdeas', async () => {
    const { result } = renderHook(() => useProjectIdeasData());
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Search by title
    act(() => result.current.setSearchTerm('Alpha'));
    expect(result.current.searchTerm).toBe('Alpha');
    expect(result.current.projectIdeas).toEqual([initialMockData[0]]);

    // Search by category (case-insensitive)
    act(() => result.current.setSearchTerm('health'));
    expect(result.current.searchTerm).toBe('health');
    // Beta Idea (category) and Charlie Idea (summary)
    expect(result.current.projectIdeas.map(p=>p.title).sort()).toEqual(['Beta Idea', 'Charlie Idea'].sort());


    // Search by summary
    act(() => result.current.setSearchTerm('Unique summary'));
    expect(result.current.searchTerm).toBe('Unique summary');
    expect(result.current.projectIdeas).toEqual([initialMockData[0]]);
    
    // Search matching multiple ideas
    act(() => result.current.setSearchTerm('Idea')); // Matches all titles
    expect(result.current.projectIdeas.length).toBe(initialMockData.length);

    // Search matching nothing
    act(() => result.current.setSearchTerm('NonExistentTerm'));
    expect(result.current.projectIdeas.length).toBe(0);
    
    // Empty search term should return all (respecting other filters)
    act(() => result.current.setSearchTerm(''));
    expect(result.current.projectIdeas.length).toBe(initialMockData.length);
  });
  
  it('should correctly interact search filtering with category filtering', async () => {
    const { result } = renderHook(() => useProjectIdeasData());
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Set category to 'Tech'
    act(() => result.current.setCategoryFilter('Tech'));
    expect(result.current.projectIdeas.length).toBe(2); // Alpha, Charlie

    // Search within 'Tech' category
    act(() => result.current.setSearchTerm('Alpha'));
    expect(result.current.projectIdeas).toEqual([initialMockData[0]]);
    
    act(() => result.current.setSearchTerm('Charlie'));
    expect(result.current.projectIdeas).toEqual([initialMockData[2]]);

    // Search for something not in 'Tech' but present in other categories
    act(() => result.current.setSearchTerm('Beta'));
    expect(result.current.projectIdeas.length).toBe(0); // Should be empty as Beta is not Tech

    // Search for 'Health' keyword within 'Tech' category (Charlie has 'Health' in summary)
    act(() => result.current.setSearchTerm('Health'));
    expect(result.current.projectIdeas).toEqual([initialMockData[2]]);


    // Reset search, still filtered by 'Tech'
    act(() => result.current.setSearchTerm(''));
    expect(result.current.projectIdeas.length).toBe(2); 
    expect(result.current.projectIdeas.map(p=>p.title).sort()).toEqual(['Alpha Idea', 'Charlie Idea'].sort());


    // Reset category, search term still empty
    act(() => result.current.setCategoryFilter('All'));
    expect(result.current.projectIdeas.length).toBe(initialMockData.length);
  });


  it('should correctly derive allCategories', async () => {
    const { result } = renderHook(() => useProjectIdeasData());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.allCategories).toEqual(['All', 'Finance', 'Health', 'Tech']);
  });
  
  it('should fetch and parse project ideas successfully', async () => {
    const { result } = renderHook(() => useProjectIdeasData());
    await waitFor(() => expect(result.current.loading).toBe(false));
    // Default sort is title: asc
    const expectedTitles = initialMockData.map(d => d.title).sort();
    const actualTitles = result.current.projectIdeas.map(d => d.title);
    expect(actualTitles).toEqual(expectedTitles);
  });

  it('should handle manual refresh with fetchProjectIdeas', async () => {
    const { result } = renderHook(() => useProjectIdeasData());
    await waitFor(() => expect(result.current.loading).toBe(false)); 

    const updatedMockData = [
      { title: 'Epsilon Idea', category: 'NewCat', summary: 'Summary Epsilon' },
    ];
    (fetch as jest.Mock).mockResolvedValueOnce({ 
      ok: true,
      text: () => Promise.resolve(`google.visualization.Query.setResponse(${JSON.stringify(mockGoogleSheetsResponse('ok', updatedMockData))});`),
    });

    act(() => result.current.fetchProjectIdeas());
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    expect(result.current.projectIdeas).toEqual(updatedMockData); 
    expect(result.current.allCategories).toEqual(['All', 'NewCat']);
  });

  it('should handle API errors from Google Sheets', async () => {
    (fetch as jest.Mock).mockReset().mockResolvedValueOnce({ 
      ok: true,
      text: () => Promise.resolve(`google.visualization.Query.setResponse(${JSON.stringify(mockGoogleSheetsResponse('error', [], ['Sheet not found']))});`),
    });
    const { result } = renderHook(() => useProjectIdeasData());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toContain('Google Sheets API error: Sheet not found');
  });

  it('should handle network errors when fetching data', async () => {
    (fetch as jest.Mock).mockReset().mockRejectedValueOnce(new Error('Network failed')); 
    const { result } = renderHook(() => useProjectIdeasData());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Network failed');
  });
  
  it('should handle malformed JSONP response', async () => {
    (fetch as jest.Mock).mockReset().mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve('invalid jsonp response'),
    });
    const { result } = renderHook(() => useProjectIdeasData());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Failed to parse Google Sheets JSONP response.');
  });

  it('should handle fetch not ok response', async () => {
    (fetch as jest.Mock).mockReset().mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: () => Promise.resolve('Not Found'),
    });
    const { result } = renderHook(() => useProjectIdeasData());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('HTTP error! status: 404');
  });
});
