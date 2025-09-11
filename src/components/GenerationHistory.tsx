'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { GeneratedImage } from '@/types/image';
import { getGeneratedImages } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface GenerationHistoryProps {
  onSelectImage?: (image: GeneratedImage) => void;
  refreshKey?: number;
  maxItems?: number;
  className?: string;
}

export default function GenerationHistory({
  onSelectImage,
  refreshKey = 0,
  maxItems = 10,
  className = '',
}: GenerationHistoryProps) {
  const [recentImages, setRecentImages] = useState<GeneratedImage[]>([]);

  useEffect(() => {
    loadRecentImages();
  }, [refreshKey, maxItems]);

  const loadRecentImages = () => {
    const allImages = getGeneratedImages();
    const recent = allImages.slice(0, maxItems);
    setRecentImages(recent);
  };

  const handleImageClick = (image: GeneratedImage) => {
    onSelectImage?.(image);
  };

  const formatDate = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const truncatePrompt = (prompt: string, maxLength: number = 80) => {
    return prompt.length > maxLength 
      ? `${prompt.substring(0, maxLength)}...` 
      : prompt;
  };

  if (recentImages.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Recent Generations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <span className="text-xl">🎨</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No images generated yet
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Recent Generations</CardTitle>
        <Badge variant="secondary" className="text-xs">
          {recentImages.length}
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96 px-6">
          <div className="space-y-3 pb-4">
            {recentImages.map((image) => (
              <div
                key={image.id}
                className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                onClick={() => handleImageClick(image)}
              >
                {/* Thumbnail */}
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={image.url}
                    alt={image.prompt}
                    fill
                    className="object-cover rounded-md"
                    sizes="48px"
                  />
                  {image.isFavorite && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">★</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-900 dark:text-white font-medium line-clamp-2 leading-tight mb-1">
                    {truncatePrompt(image.prompt, 60)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(image.timestamp)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {image.settings.width}×{image.settings.height}
                      </Badge>
                      {image.settings.style && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          {image.settings.style.substring(0, 3)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {/* View All Button */}
        <div className="p-4 pt-0">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => window.location.href = '/gallery'}
          >
            View All Images
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}