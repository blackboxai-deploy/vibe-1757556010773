'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GeneratedImage } from '@/types/image';
import { downloadImage } from '@/lib/api';
import { toggleImageFavorite, deleteGeneratedImage } from '@/lib/storage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ImageModalProps {
  image: GeneratedImage | null;
  isOpen: boolean;
  onClose: () => void;
  onImageUpdate?: () => void;
}

export default function ImageModal({ 
  image, 
  isOpen, 
  onClose, 
  onImageUpdate 
}: ImageModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  if (!image) return null;

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const filename = `ai-generated-${image.id}.jpg`;
      await downloadImage(image.url, filename);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(image.prompt);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
  };

  const handleToggleFavorite = () => {
    toggleImageFavorite(image.id);
    onImageUpdate?.();
  };

  const handleDelete = () => {
    deleteGeneratedImage(image.id);
    onImageUpdate?.();
    onClose();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Generated Image</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFavorite}
                className="text-yellow-500 hover:text-yellow-600"
              >
                {image.isFavorite ? '★' : '☆'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                ✕
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            Created on {formatDate(image.timestamp)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image Display */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="relative w-full aspect-square">
                  <Image
                    src={image.url}
                    alt={image.prompt}
                    fill
                    className="object-contain rounded-lg"
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-4">
              <Button 
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 sm:flex-none"
              >
                {isDownloading ? 'Downloading...' : 'Download Image'}
              </Button>
              <Button 
                variant="outline"
                onClick={handleCopyPrompt}
                className="flex-1 sm:flex-none"
              >
                {copySuccess ? 'Copied!' : 'Copy Prompt'}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="flex-1 sm:flex-none"
              >
                Delete
              </Button>
            </div>
          </div>

          {/* Image Details */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-2">
                    Prompt
                  </h3>
                  <p className="text-sm bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
                    {image.prompt}
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-3">
                    Settings
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Dimensions:</span>
                      <Badge variant="secondary">
                        {image.settings.width}×{image.settings.height}
                      </Badge>
                    </div>
                    
                    {image.settings.style && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Style:</span>
                        <Badge variant="outline">
                          {image.settings.style}
                        </Badge>
                      </div>
                    )}
                    
                    {image.settings.quality && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Quality:</span>
                        <Badge variant="outline">
                          {image.settings.quality}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-2">
                    Status
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={image.isFavorite ? "default" : "secondary"}>
                      {image.isFavorite ? 'Favorited' : 'Regular'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}