'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { GeneratedImage } from '@/types/image';
import { getGeneratedImages } from '@/lib/storage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageModal from './ImageModal';

interface ImageGalleryProps {
  refreshKey?: number;
  showSearch?: boolean;
  maxImages?: number;
}

export default function ImageGallery({ 
  refreshKey = 0, 
  showSearch = true,
  maxImages
}: ImageGalleryProps) {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'favorites'>('newest');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadImages();
  }, [refreshKey]);

  useEffect(() => {
    filterAndSortImages();
  }, [images, searchTerm, sortBy]);

  const loadImages = () => {
    const storedImages = getGeneratedImages();
    const limitedImages = maxImages ? storedImages.slice(0, maxImages) : storedImages;
    setImages(limitedImages);
  };

  const filterAndSortImages = () => {
    let filtered = images.filter(image =>
      image.prompt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort images
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => a.timestamp - b.timestamp);
        break;
      case 'favorites':
        filtered.sort((a, b) => {
          if (a.isFavorite && !b.isFavorite) return -1;
          if (!a.isFavorite && b.isFavorite) return 1;
          return b.timestamp - a.timestamp;
        });
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => b.timestamp - a.timestamp);
        break;
    }

    setFilteredImages(filtered);
  };

  const handleImageClick = (image: GeneratedImage) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleImageUpdate = () => {
    loadImages();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
          <span className="text-3xl">🎨</span>
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
          No images yet
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Start generating amazing images with AI. Your creations will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Search and Filter Controls */}
      {showSearch && (
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by prompt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="favorites">Favorites</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Results Count */}
      {showSearch && searchTerm && (
        <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">
          {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''} found
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredImages.map((image) => (
          <Card 
            key={image.id}
            className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => handleImageClick(image)}
          >
            <CardContent className="p-0 relative">
              <div className="relative w-full aspect-square">
                <Image
                  src={image.url}
                  alt={image.prompt}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200 rounded-lg flex items-end p-3">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-full">
                    <p className="text-xs font-medium truncate mb-1">
                      {image.prompt}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span>{formatDate(image.timestamp)}</span>
                      {image.isFavorite && (
                        <span className="text-yellow-400">★</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button - if maxImages is set and there are more images */}
      {maxImages && images.length >= maxImages && (
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/gallery'}
          >
            View All Images
          </Button>
        </div>
      )}

      {/* Image Modal */}
      <ImageModal
        image={selectedImage}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onImageUpdate={handleImageUpdate}
      />
    </div>
  );
}