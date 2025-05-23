import { renderHook, waitFor } from '@testing-library/react';
import { useProjectIdeasData } from './useProjectIdeasData';

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

describe('useProjectIdeasData', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should fetch and parse project ideas successfully', async () => {
    const mockData = [
      { title: 'Idea 1', category: 'Tech', summary: 'Summary 1' },
      { title: 'Idea 2', category: 'Health', summary: 'Summary 2' },
    ];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(`google.visualization.Query.setResponse(${JSON.stringify(mockGoogleSheetsResponse('ok', mockData))});`),
    });

    const { result } = renderHook(() => useProjectIdeasData());

    expect(result.current.loading).toBe(true);
    expect(result.current.projectIdeas).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.projectIdeas).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('should handle API errors from Google Sheets', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(`google.visualization.Query.setResponse(${JSON.stringify(mockGoogleSheetsResponse('error', [], ['Sheet not found']))});`),
    });

    const { result } = renderHook(() => useProjectIdeasData());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toContain('Google Sheets API error: Sheet not found');
    expect(result.current.projectIdeas).toEqual([]);
  });

  it('should handle network errors when fetching data', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network failed'));

    const { result } = renderHook(() => useProjectIdeasData());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Network failed');
    expect(result.current.projectIdeas).toEqual([]);
  });
  
  it('should handle malformed JSONP response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve('invalid jsonp response'),
    });

    const { result } = renderHook(() => useProjectIdeasData());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Failed to parse Google Sheets JSONP response.');
    expect(result.current.projectIdeas).toEqual([]);
  });

  it('should handle fetch not ok response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: () => Promise.resolve('Not Found'),
    });
    
    const { result } = renderHook(() => useProjectIdeasData());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('HTTP error! status: 404');
    expect(result.current.projectIdeas).toEqual([]);
  });
});
