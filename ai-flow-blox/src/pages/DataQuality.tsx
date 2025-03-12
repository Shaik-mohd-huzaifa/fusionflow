
import React from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import { GitBranch, Shield, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const DataQuality = () => {
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
                <GitBranch className="h-5 w-5 text-primary" />
                Data Quality
              </h1>
              <p className="text-muted-foreground mt-1">
                Monitor, measure, and improve the quality of your data
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                View Reports
              </Button>
              <Button>
                New Rule <Shield className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Quality Score</h2>
                <div className="text-2xl font-bold">92%</div>
              </div>
              <Progress value={92} className="h-2 mb-4" />
              <p className="text-sm text-muted-foreground">Improved by 3% since last scan</p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Rules Status</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Passing</span>
                  </div>
                  <span className="font-medium">42</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                    <span className="text-sm">Warnings</span>
                  </div>
                  <span className="font-medium">7</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm">Failing</span>
                  </div>
                  <span className="font-medium">3</span>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Monitoring</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm">Last Scan</span>
                  </div>
                  <span className="font-medium">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Datasets Monitored</span>
                  </div>
                  <span className="font-medium">15</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <GitBranch className="h-4 w-4 text-purple-500 mr-2" />
                    <span className="text-sm">Active Rules</span>
                  </div>
                  <span className="font-medium">52</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-medium mb-6">Critical Issues</h2>
            
            <div className="space-y-4">
              <div className="border border-border rounded-md p-4 hover:border-destructive transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium mb-1">Customer Data - Email Validation</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      129 records failed validation rules for email format
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Dataset: Customer Records</span>
                      <span>•</span>
                      <span>Severity: High</span>
                    </div>
                  </div>
                  <Button size="sm" variant="destructive">Fix Issue</Button>
                </div>
              </div>
              
              <div className="border border-border rounded-md p-4 hover:border-destructive transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium mb-1">Product Inventory - Null Values</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      43 products have missing values in required fields
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Dataset: Product Catalog</span>
                      <span>•</span>
                      <span>Severity: High</span>
                    </div>
                  </div>
                  <Button size="sm" variant="destructive">Fix Issue</Button>
                </div>
              </div>
              
              <div className="border border-border rounded-md p-4 hover:border-yellow-500 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium mb-1">Order Data - Duplicate Detection</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      17 potential duplicate orders identified
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Dataset: Sales Orders</span>
                      <span>•</span>
                      <span>Severity: Medium</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Review</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataQuality;
