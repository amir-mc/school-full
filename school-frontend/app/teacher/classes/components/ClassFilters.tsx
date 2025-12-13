//teacher/classes/components/ClassFilters.tsx
'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface ClassFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  onRefresh: () => void;
}

export default function ClassFilters({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  onRefresh
}: ClassFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              جستجو و فیلتر
            </CardTitle>
          </div>
          <Button variant="outline" onClick={onRefresh}>
            بروزرسانی لیست
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* جستجو */}
          <div className="space-y-2">
            <label className="text-sm font-medium">جستجوی کلاس</label>
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="جستجوی نام کلاس..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          {/* فیلتر پایه */}
          <div className="space-y-2">
            <label className="text-sm font-medium">فیلتر بر اساس پایه</label>
            <Tabs value={activeTab} onValueChange={onTabChange}>
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="all">همه</TabsTrigger>
                <TabsTrigger value="10">دهم</TabsTrigger>
                <TabsTrigger value="11">یازدهم</TabsTrigger>
                <TabsTrigger value="12">دوازدهم</TabsTrigger>
                <TabsTrigger value="other">سایر</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}