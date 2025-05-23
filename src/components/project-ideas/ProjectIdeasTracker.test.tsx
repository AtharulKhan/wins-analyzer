import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import ProjectIdeasTracker from './ProjectIdeasTracker';
import { useProjectIdeasData, SortByType, SortOrderType } from './useProjectIdeasData';

// Mock the custom hook
jest.mock('./useProjectIdeasData');

const mockUseProjectIdeasData = useProjectIdeasData as jest.Mock;

// Default mock values for the hook
const mockSetCategoryFilter = jest.fn();
const mockSetSortBy = jest.fn();
const mockSetSortOrder = jest.fn();
const mockFetchProjectIdeas = jest.fn();
const mockSetSearchTerm = jest.fn(); // New mock for setSearchTerm

const defaultMockHookValues = {
  projectIdeas: [],
  loading: false,
  error: null,
  allCategories: ['All', 'AI', 'Mobile', 'Web'],
  categoryFilter: 'All',
  setCategoryFilter: mockSetCategoryFilter,
  sortBy: 'title' as SortByType,
  setSortBy: mockSetSortBy,
  sortOrder: 'asc' as SortOrderType,
  setSortOrder: mockSetSortOrder,
  searchTerm: '', // New default value for searchTerm
  setSearchTerm: mockSetSearchTerm, // New mock function
  fetchProjectIdeas: mockFetchProjectIdeas,
};

describe('ProjectIdeasTracker', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    // Setup default mock implementation
    mockUseProjectIdeasData.mockReturnValue(defaultMockHookValues);
  });

  it('renders loading state correctly', () => {
    mockUseProjectIdeasData.mockReturnValue({ ...defaultMockHookValues, loading: true });
    render(<ProjectIdeasTracker />);
    expect(screen.getByText('Loading project ideas...')).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    mockUseProjectIdeasData.mockReturnValue({ ...defaultMockHookValues, error: 'Failed to fetch data' });
    render(<ProjectIdeasTracker />);
    expect(screen.getByText('Error loading project ideas:')).toBeInTheDocument();
  });

  it('renders empty state correctly', () => {
    render(<ProjectIdeasTracker />);
    expect(screen.getByText('No project ideas found. Try adjusting your filters or refresh.')).toBeInTheDocument();
  });

  const mockIdeas = [
    { title: 'Project Alpha', category: 'Web', summary: 'Short summary for Alpha.' },
    { title: 'Project Beta', category: 'Mobile', summary: 'This is a very long summary for Project Beta.' },
  ];

  it('renders project ideas data in a table correctly', () => {
    mockUseProjectIdeasData.mockReturnValue({ ...defaultMockHookValues, projectIdeas: mockIdeas });
    render(<ProjectIdeasTracker />);
    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
  });
  
  it('handles expandable summary correctly', () => {
    // To make this test more robust, ensure the summary is long enough
    const longSummaryIdea = [{ title: 'Project Long', category: 'Test', summary: 'This is a very very long summary designed to exceed the one hundred character limit and therefore test the expand and collapse functionality of the summary cell in the table, ensuring it works as expected.' }];
    mockUseProjectIdeasData.mockReturnValue({ ...defaultMockHookValues, projectIdeas: longSummaryIdea });
    render(<ProjectIdeasTracker />);
    const readMoreButton = screen.getByText('Read more');
    fireEvent.click(readMoreButton);
    expect(screen.getByText(longSummaryIdea[0].summary)).toBeInTheDocument();
  });

  describe('Toolbar UI Interactions', () => {
    it('interacts with Search Input correctly', () => {
      render(<ProjectIdeasTracker />);
      const searchInput = screen.getByPlaceholderText('Search title, category, summary...');
      expect(searchInput).toBeInTheDocument();

      fireEvent.change(searchInput, { target: { value: 'test search' } });
      expect(mockSetSearchTerm).toHaveBeenCalledWith('test search');
    });

    it('displays the searchTerm from hook in Search Input', () => {
      mockUseProjectIdeasData.mockReturnValue({ ...defaultMockHookValues, searchTerm: 'hello from hook' });
      render(<ProjectIdeasTracker />);
      const searchInput = screen.getByPlaceholderText('Search title, category, summary...');
      expect(searchInput).toHaveValue('hello from hook');
    });

    it('interacts with Category Filter correctly', async () => {
      render(<ProjectIdeasTracker />);
      const categoryFilterSelect = screen.getByText('Category:').nextElementSibling?.querySelector('button');
      if (!categoryFilterSelect) throw new Error("Category filter select trigger not found");
      fireEvent.mouseDown(categoryFilterSelect);
      const webOption = await screen.findByText('Web');
      fireEvent.click(webOption);
      expect(mockSetCategoryFilter).toHaveBeenCalledWith('Web');
    });

    it('interacts with Sort By Field correctly', async () => {
      render(<ProjectIdeasTracker />);
      const sortBySelect = screen.getByText('Sort by:').nextElementSibling?.querySelector('button');
      if (!sortBySelect) throw new Error("Sort by select trigger not found");
      fireEvent.mouseDown(sortBySelect);
      const categorySortOption = await screen.findByText('Category');
      fireEvent.click(categorySortOption);
      expect(mockSetSortBy).toHaveBeenCalledWith('category');
    });

    it('interacts with Sort Order Toggle correctly', () => {
      render(<ProjectIdeasTracker />);
      const sortOrderButton = screen.getByTitle(/Sort order: Ascending/i);
      fireEvent.click(sortOrderButton);
      expect(mockSetSortOrder).toHaveBeenCalledWith(expect.any(Function));
    });
    
    it('interacts with Refresh Button correctly and shows loading state', () => {
      render(<ProjectIdeasTracker />);
      const refreshButton = screen.getByText('Refresh Data');
      fireEvent.click(refreshButton);
      expect(mockFetchProjectIdeas).toHaveBeenCalledTimes(1);

      mockUseProjectIdeasData.mockReturnValue({ ...defaultMockHookValues, loading: true });
      render(<ProjectIdeasTracker />);
      const loadingRefreshButton = screen.getByRole('button', { name: /refresh/i });
      expect(loadingRefreshButton.getAttribute('aria-disabled') === 'true' || loadingRefreshButton.hasAttribute('disabled')).toBe(true);
      expect(loadingRefreshButton.querySelector('.animate-spin')).toBeInTheDocument();
    });
  });
});
