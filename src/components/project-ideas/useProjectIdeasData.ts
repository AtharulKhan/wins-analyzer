import { useState, useEffect } from 'react';

interface ProjectIdea {
  title: string;
  category: string;
  summary: string;
}

const mockProjectIdeas: ProjectIdea[] = [
  { 
    title: 'AI-Powered Task Manager', 
    category: 'Productivity', 
    summary: 'A task manager that uses AI to prioritize and suggest tasks.' 
  },
  { 
    title: 'Community Garden App', 
    category: 'Social Good', 
    summary: 'An app to connect local gardeners and manage community garden plots.' 
  },
  {
    title: 'Recipe Sharing Platform',
    category: 'Food',
    summary: 'A platform for users to share and discover new recipes.'
  },
  {
    title: 'Language Learning Game',
    category: 'Education',
    summary: 'A gamified approach to learning new languages with interactive challenges.'
  }
];

export const useProjectIdeasData = () => {
  const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setProjectIdeas(mockProjectIdeas);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []);

  return { projectIdeas, loading };
};
