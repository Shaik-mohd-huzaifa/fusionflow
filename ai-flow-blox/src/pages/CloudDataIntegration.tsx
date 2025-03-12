
import React from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import { Server, ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CloudDataIntegration = () => {
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
                <Server className="h-5 w-5 text-primary" />
                Cloud Data Integration
              </h1>
              <p className="text-muted-foreground mt-1">
                Design, develop and run data integration tasks in the cloud
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                Help
              </Button>
              <Button>
                New Integration <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Getting Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-md border border-border hover:border-primary hover:bg-accent transition-colors">
                <h3 className="font-medium mb-2">Create Connections</h3>
                <p className="text-sm text-muted-foreground">Connect to your data sources and targets</p>
              </div>
              <div className="p-4 rounded-md border border-border hover:border-primary hover:bg-accent transition-colors">
                <h3 className="font-medium mb-2">Design Mappings</h3>
                <p className="text-sm text-muted-foreground">Create data transformation mappings</p>
              </div>
              <div className="p-4 rounded-md border border-border hover:border-primary hover:bg-accent transition-colors">
                <h3 className="font-medium mb-2">Run Tasks</h3>
                <p className="text-sm text-muted-foreground">Schedule and monitor integration tasks</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Recent Integrations</h2>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search integrations" className="pl-8" />
              </div>
            </div>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Last Modified</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="px-4 py-3 text-sm">Customer Data Integration</td>
                    <td className="px-4 py-3 text-sm">Mapping Task</td>
                    <td className="px-4 py-3 text-sm">Today, 2:30 PM</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                    </td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-4 py-3 text-sm">Sales Data Sync</td>
                    <td className="px-4 py-3 text-sm">Mapping Task</td>
                    <td className="px-4 py-3 text-sm">Yesterday, 10:15 AM</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Idle</span>
                    </td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-4 py-3 text-sm">Product Catalog Export</td>
                    <td className="px-4 py-3 text-sm">Mapping Task</td>
                    <td className="px-4 py-3 text-sm">2 days ago</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Scheduled</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudDataIntegration;
