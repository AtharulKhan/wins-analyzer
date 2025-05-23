import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock child components to simplify App testing
jest.mock('./pages/Index', () => () => <div data-testid="index-page">Index Page</div>);
jest.mock('./pages/KanbanView', () => () => <div data-testid="kanban-page">Kanban Page</div>);
jest.mock('./pages/CalendarView', () => () => <div data-testid="calendar-page">Calendar Page</div>);
jest.mock('./pages/DashboardView', () => () => <div data-testid="dashboard-page">Dashboard Page</div>);
jest.mock('./pages/Settings', () => () => <div data-testid="settings-page">Settings Page</div>);
jest.mock('./pages/NotFound', () => () => <div data-testid="notfound-page">Not Found Page</div>);
jest.mock('@/pages/ProjectIdeasView', () => () => <div data-testid="project-ideas-page">Project Ideas Page</div>);


describe('App Routing', () => {
  it('renders Index page for / route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('index-page')).toBeInTheDocument();
  });

  it('renders KanbanView page for /kanban route', () => {
    render(
      <MemoryRouter initialEntries={['/kanban']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('kanban-page')).toBeInTheDocument();
  });

  it('renders CalendarView page for /calendar route', () => {
    render(
      <MemoryRouter initialEntries={['/calendar']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('calendar-page')).toBeInTheDocument();
  });

  it('renders DashboardView page for /dashboard route', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  it('renders ProjectIdeasView page for /project-ideas route', () => {
    render(
      <MemoryRouter initialEntries={['/project-ideas']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('project-ideas-page')).toBeInTheDocument();
  });

  it('renders Settings page for /settings route', () => {
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('settings-page')).toBeInTheDocument();
  });

  it('renders NotFound page for unknown routes', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-route']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('notfound-page')).toBeInTheDocument();
  });
});
