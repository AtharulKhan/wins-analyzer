import React from 'react';
import { render, screen } from '@testing-library/react';
import ProjectIdeasView from './ProjectIdeasView';

// Mock the child components to isolate the ProjectIdeasView component for testing
jest.mock('@/components/layout/PageLayout', () => ({
  PageLayout: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div data-testid="page-layout">
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

jest.mock('@/components/project-ideas/ProjectIdeasTracker', () => () => <div data-testid="project-ideas-tracker">ProjectIdeasTracker</div>);

describe('ProjectIdeasView', () => {
  it('renders PageLayout with the correct title', () => {
    render(<ProjectIdeasView />);
    expect(screen.getByTestId('page-layout')).toBeInTheDocument();
    expect(screen.getByText('Project Ideas (To Do)')).toBeInTheDocument();
  });

  it('renders ProjectIdeasTracker component', () => {
    render(<ProjectIdeasView />);
    expect(screen.getByTestId('project-ideas-tracker')).toBeInTheDocument();
    expect(screen.getByText('ProjectIdeasTracker')).toBeInTheDocument();
  });
});
