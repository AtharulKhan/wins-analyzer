
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { WinsTracker } from '@/components/wins/WinsTracker';

const Index = () => {
  return (
    <PageLayout title="Wins Tracker">
      <WinsTracker view="table" />
    </PageLayout>
  );
};

export default Index;
