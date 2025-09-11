'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageGallery from '@/components/ImageGallery';
import { Button } from '@/components/ui/button';
import { clearAllData } from '@/lib/storage';

export default function GalleryPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete all generated images? This action cannot be undone.')) {
      clearAllData();
      setRefreshKey(prev => prev + 1);
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-7xl mx-auto p-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Image Gallery
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Browse and manage all your AI-generated images
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline">
                ← Back to Generator
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearAll}
              className="text-sm"
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <ImageGallery refreshKey={refreshKey} showSearch={true} />
        </div>
      </div>
    </div>
  );
}