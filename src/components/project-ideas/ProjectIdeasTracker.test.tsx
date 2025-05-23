import React from 'react';
import { render, screen } from '@testing-library/react';
import ProjectIdeasTracker from './ProjectIdeasTracker';

describe('ProjectIdeasTracker', () => {
  it('renders the placeholder text', () => {
    render(<ProjectIdeasTracker />);
    expect(screen.getByText('Project Ideas Tracker')).toBeInTheDocument();
  });
});
