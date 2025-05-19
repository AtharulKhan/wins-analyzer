
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';

// Hard-coded Google Sheets API values
const GOOGLE_SHEETS_API_KEY = 'AIzaSyDsoN29aqbA8yJPVoORiTemvl21ft1zBls';
const GOOGLE_SHEETS_ID = '1zx957CNpMus2IOY17j0TIt5yopSWs1v3AkAf7TSnExw';
const GOOGLE_SHEETS_RANGE = 'Master!A2:G';

const Settings = () => {
  const { toast } = useToast();
  const [autoRefresh, setAutoRefresh] = useLocalStorage('auto-refresh', false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSave = () => {
    toast({
      title: "Success",
      description: "Settings saved successfully",
      variant: "default"
    });
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    toast({
      title: "Testing connection...",
      description: "Attempting to connect to Google Sheets."
    });

    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_ID}/values/${GOOGLE_SHEETS_RANGE}?key=${GOOGLE_SHEETS_API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.values && data.values.length) {
        toast({
          title: "Connection successful!",
          description: `Retrieved ${data.values.length} rows from your sheet.`,
          variant: "default"
        });
      } else {
        toast({
          title: "Connected, but no data found",
          description: "Your API key works, but the sheet or range might be empty.",
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Could not connect to Google Sheets API.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout title="Settings">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Google Sheets Integration</CardTitle>
            <CardDescription>
              Test your Google Sheets API connection and configure auto-refresh settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/20 rounded-lg">
              <h3 className="font-medium mb-2">Connection Details</h3>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Spreadsheet ID:</span>
                  <span className="font-mono text-xs bg-muted p-1 rounded">{GOOGLE_SHEETS_ID}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sheet Range:</span>
                  <span className="font-mono text-xs bg-muted p-1 rounded">{GOOGLE_SHEETS_RANGE}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <Label htmlFor="auto-refresh">Auto Refresh</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically refresh data every 5 minutes
                </p>
              </div>
              <Switch 
                id="auto-refresh" 
                checked={autoRefresh} 
                onCheckedChange={setAutoRefresh} 
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={isLoading}
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isLoading}
            >
              Save Settings
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Settings;
