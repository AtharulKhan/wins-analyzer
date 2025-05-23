import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectIdeasTracker from './ProjectIdeasTracker';
import { useProjectIdeasData } from './useProjectIdeasData';

// Mock the custom hook
jest.mock('./useProjectIdeasData');

const mockUseProjectIdeasData = useProjectIdeasData as jest.Mock;

describe('ProjectIdeasTracker', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    mockUseProjectIdeasData.mockReturnValue({
      projectIdeas: [],
      loading: true,
      error: null,
    });
    render(<ProjectIdeasTracker />);
    expect(screen.getByText('Loading project ideas...')).toBeInTheDocument();
    // Check for skeleton elements (assuming they have a distinct role or class)
    // For example, if Skeleton components add a role="progressbar" or a specific test id
    // This might need adjustment based on the actual Skeleton component implementation
    const skeletons = screen.getAllByRole('generic', { name: /skeleton/i }); // A more generic way if skeletons don't have specific roles
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders error state correctly', () => {
    mockUseProjectIdeasData.mockReturnValue({
      projectIdeas: [],
      loading: false,
      error: 'Failed to fetch data',
    });
    render(<ProjectIdeasTracker />);
    expect(screen.getByText('Error loading project ideas:')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
  });

  it('renders empty state correctly', () => {
    mockUseProjectIdeasData.mockReturnValue({
      projectIdeas: [],
      loading: false,
      error: null,
    });
    render(<ProjectIdeasTracker />);
    expect(screen.getByText('No project ideas found. Add some from your Google Sheet!')).toBeInTheDocument();
  });

  const mockIdeas = [
    { title: 'Project Alpha', category: 'Web', summary: 'Short summary for Alpha.' },
    { title: 'Project Beta', category: 'Mobile', summary: 'This is a very long summary for Project Beta designed to exceed the one hundred character limit and therefore test the expand and collapse functionality of the summary cell in the table.' },
    { title: 'Project Gamma', category: 'AI', summary: 'Another short one for Gamma.' },
  ];

  it('renders project ideas data in a table correctly', () => {
    mockUseProjectIdeasData.mockReturnValue({
      projectIdeas: mockIdeas,
      loading: false,
      error: null,
    });
    render(<ProjectIdeasTracker />);

    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    expect(screen.getByText('Web')).toBeInTheDocument();
    expect(screen.getByText('Short summary for Alpha.')).toBeInTheDocument();

    expect(screen.getByText('Project Beta')).toBeInTheDocument();
    expect(screen.getByText('Mobile')).toBeInTheDocument();
    // Check for truncated summary of Project Beta
    expect(screen.getByText(/This is a very long summary for Project Beta designed to exceed the one hundred character limit/)).toBeInTheDocument();
    expect(screen.getByText(/Read more/)).toBeInTheDocument();


    expect(screen.getByText('Project Gamma')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByText('Another short one for Gamma.')).toBeInTheDocument();
    
    // Check for table headers
    expect(screen.getByText('Project Title')).toBeInTheDocument();
    expect(screen.getByText('Project Category')).toBeInTheDocument();
    expect(screen.getByText('Quick Summary')).toBeInTheDocument();

    // Check number of data rows
    const rows = screen.getAllByRole('row');
    // Rows include header row, so data rows = total rows - 1
    expect(rows.length - 1).toBe(mockIdeas.length); 
  });

  it('handles expandable summary correctly', () => {
    mockUseProjectIdeasData.mockReturnValue({
      projectIdeas: mockIdeas, // Using the same mockIdeas with a long summary
      loading: false,
      error: null,
    });
    render(<ProjectIdeasTracker />);

    const readMoreButton = screen.getByText('Read more');
    expect(readMoreButton).toBeInTheDocument();
    
    // Verify initial truncated state for Project Beta's summary
    const summaryCellBeta = screen.getByText(/This is a very long summary for Project Beta designed to exceed the one hundred character limit/i);
    expect(summaryCellBeta.textContent).toContain('...');
    expect(summaryCellBeta.textContent?.length).toBeLessThan(mockIdeas[1].summary.length);


    // Click "Read more"
    fireEvent.click(readMoreButton);

    // Verify full summary is shown and button text changes
    expect(screen.getByText(mockIdeas[1].summary)).toBeInTheDocument(); // Full summary
    const readLessButton = screen.getByText('Read less');
    expect(readLessButton).toBeInTheDocument();
    expect(screen.queryByText('Read more')).not.toBeInTheDocument(); // Read more should be gone

    // Click "Read less"
    fireEvent.click(readLessButton);

    // Verify summary is truncated again and button text changes back
    expect(summaryCellBeta.textContent).toContain('...');
    expect(summaryCellBeta.textContent?.length).toBeLessThan(mockIdeas[1].summary.length);
    expect(screen.getByText('Read more')).toBeInTheDocument();
    expect(screen.queryByText('Read less')).not.toBeInTheDocument(); // Read less should be gone
  });
});
