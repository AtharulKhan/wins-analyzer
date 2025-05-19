
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const DashboardView = () => {
  const { toast } = useToast();

  React.useEffect(() => {
    toast({
      title: "Dashboard View",
      description: "Dashboard view will be implemented in the next update."
    });
  }, [toast]);

  return (
    <PageLayout title="Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Wins per Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border rounded-md">
              <p className="text-muted-foreground">Bar chart will be implemented in the next update.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Win Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border rounded-md">
              <div className="text-center">
                <p className="text-4xl font-bold">0</p>
                <p className="text-muted-foreground">Current streak (days)</p>
                <p className="mt-2 text-sm">Best streak: 0 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardContent className="py-4 flex justify-center">
            <Button>Export chart as PNG</Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default DashboardView;
