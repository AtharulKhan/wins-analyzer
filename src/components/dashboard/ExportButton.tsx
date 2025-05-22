
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const ExportButton: React.FC = () => {
  const { toast } = useToast();

  const handleExportDashboard = () => {
    toast({
      title: "Export Initiated",
      description: "Dashboard image export has started",
    });
    // In a real app, we would use html2canvas or similar library to export as PNG
  };

  return (
    <Card className="lg:col-span-4">
      <CardContent className="py-4 flex justify-center">
        <Button onClick={handleExportDashboard}>Export dashboard as PNG</Button>
      </CardContent>
    </Card>
  );
};
