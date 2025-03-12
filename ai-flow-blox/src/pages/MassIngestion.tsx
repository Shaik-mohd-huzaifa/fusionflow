
import React from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import { Database, FileUp, Filter, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MassIngestion = () => {
  return (
    <div className="flex h-screen">
      <div className="w-64 border-r border-border">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Mass Ingestion
              </h1>
              <p className="text-muted-foreground mt-1">
                Ingest, process, and load large volumes of data efficiently
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                Documentation
              </Button>
              <Button>
                New Ingestion <FileUp className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="mb-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="sources">Data Sources</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Active Tasks</h3>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Data Processed</h3>
                  <p className="text-2xl font-bold">2.4 TB</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Success Rate</h3>
                  <p className="text-2xl font-bold">98.7%</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Data Sources</h3>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Ingestion Activities</h2>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" /> Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart className="h-4 w-4 mr-2" /> Reports
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-border rounded-md hover:border-primary hover:bg-accent/50 transition-colors">
                      <div>
                        <h3 className="font-medium">Daily Sales Data Ingestion</h3>
                        <p className="text-sm text-muted-foreground">Source: S3 Bucket • Target: Snowflake</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">12.8 GB processed</div>
                        <div className="text-xs text-muted-foreground">Last run: 2 hours ago</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tasks">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">Ingestion Tasks</h2>
                <p className="text-muted-foreground">Select the Tasks tab to manage your data ingestion tasks.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="sources">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">Data Sources</h2>
                <p className="text-muted-foreground">Configure and manage your data sources here.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="monitoring">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">Monitoring Dashboard</h2>
                <p className="text-muted-foreground">Monitor the performance of your mass ingestion tasks.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MassIngestion;
