
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const CalendarView = () => {
  const { toast } = useToast();

  React.useEffect(() => {
    toast({
      title: "Calendar View",
      description: "Calendar view will be implemented in the next update."
    });
  }, [toast]);

  return (
    <PageLayout title="Calendar View">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border rounded-md">
            <p className="text-muted-foreground">Calendar view will be implemented in the next update.</p>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default CalendarView;
