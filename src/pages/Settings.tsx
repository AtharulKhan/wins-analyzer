import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';

const Settings = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useLocalStorage('google-sheets-api-key', '');
  const [sheetId, setSheetId] = useLocalStorage('google-sheets-id', '1zx957CNpMus2IOY17j0TIt5yopSWs1v3AkAf7TSnExw');
  const [range, setRange] = useLocalStorage('google-sheets-range', 'Master!A2:E');
  const [autoRefresh, setAutoRefresh] = useLocalStorage('auto-refresh', false);
  
  const handleSave = () => {
    toast({
      title: "Success",
      description: "Settings saved successfully",
      variant: "default"
    });
  };

  const handleTestConnection = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google Sheets API key.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Testing connection...",
      description: "Attempting to connect to Google Sheets."
    });

    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
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
    }
  };

  return (
    <PageLayout title="Settings">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Google Sheets Integration</CardTitle>
            <CardDescription>
              Configure your Google Sheets API connection to fetch your wins data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">Google Sheets API Key</Label>
              <Input 
                id="api-key" 
                type="password" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)} 
                placeholder="Enter your Google Sheets API key" 
              />
              <p className="text-sm text-muted-foreground">
                You can obtain an API key from the <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-primary underline">Google Cloud Console</a>. 
                Enable the Google Sheets API for your project.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sheet-id">Spreadsheet ID</Label>
              <Input 
                id="sheet-id" 
                value={sheetId} 
                onChange={(e) => setSheetId(e.target.value)} 
                placeholder="Spreadsheet ID from the URL" 
              />
              <p className="text-sm text-muted-foreground">
                This is the long string of characters in your Google Sheets URL.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="range">Sheet Range</Label>
              <Input 
                id="range" 
                value={range} 
                onChange={(e) => setRange(e.target.value)} 
                placeholder="e.g., Sheet1!A2:E" 
              />
              <p className="text-sm text-muted-foreground">
                Specify the tab name and cell range containing your data.
              </p>
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
            <Button variant="outline" onClick={handleTestConnection}>
              Test Connection
            </Button>
            <Button onClick={handleSave}>Save Settings</Button>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Settings;
