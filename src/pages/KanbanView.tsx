
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const KanbanView = () => {
  const { toast } = useToast();

  React.useEffect(() => {
    toast({
      title: "Kanban View",
      description: "Kanban view will be implemented in the next update."
    });
  }, [toast]);

  return (
    <PageLayout title="Kanban View">
      <Card>
        <CardHeader>
          <CardTitle>Kanban Board</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border rounded-md">
            <p className="text-muted-foreground">Kanban view will be implemented in the next update.</p>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default KanbanView;
