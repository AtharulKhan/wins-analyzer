import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import ProjectIdeasTracker from '@/components/project-ideas/ProjectIdeasTracker';

const ProjectIdeasView: React.FC = () => {
  return (
    <PageLayout title="Project Ideas (To Do)">
      <ProjectIdeasTracker />
    </PageLayout>
  );
};

export default ProjectIdeasView;
