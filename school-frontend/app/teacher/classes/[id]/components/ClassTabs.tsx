'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReactNode } from 'react';

interface Tab {
  value: string;
  label: string;
  content: ReactNode;
}

interface ClassTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  tabs: Tab[];
}

export default function ClassTabs({ activeTab, onTabChange, tabs }: ClassTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid grid-cols-4">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="space-y-4">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}