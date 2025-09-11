'use client';

import { useState, useEffect } from 'react';
import { GeneratedImage, GenerationSettings } from '@/types/image';
import { generateImage } from '@/lib/api';
import { saveGeneratedImage, getUserSettings, saveUserSettings } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import SettingsPanel from './SettingsPanel';
import ImageGallery from './ImageGallery';
import GenerationHistory from './GenerationHistory';
import ImageModal from './ImageModal';

const EXAMPLE_PROMPTS = [
  'A serene mountain landscape at sunset with golden light',
  'A futuristic cityscape with flying cars and neon lights',
  'An abstract painting with vibrant colors and flowing shapes',
  'A cozy coffee shop interior with warm lighting',
  'A majestic dragon soaring through stormy clouds',
  'A peaceful zen garden with cherry blossoms',
];

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [, setLastGeneratedImage] = useState<GeneratedImage | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedHistoryImage, setSelectedHistoryImage] = useState<GeneratedImage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<GenerationSettings>({
    width: 1024,
    height: 1024,
    style: 'Photorealistic',
    quality: 'High',
  });

  useEffect(() => {
    // Load user settings on mount
    const savedSettings = getUserSettings();
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  useEffect(() => {
    // Save settings when they change
    saveUserSettings(settings);
  }, [settings]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 20;
      });
    }, 1000);

    try {
      const result = await generateImage({
        prompt: prompt.trim(),
        settings,
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (result.success && result.imageUrl) {
        const newImage: GeneratedImage = {
          id: result.id,
          url: result.imageUrl,
          prompt: prompt.trim(),
          timestamp: Date.now(),
          settings: { ...settings },
        };

        // Save to local storage
        saveGeneratedImage(newImage);
        setLastGeneratedImage(newImage);
        setRefreshKey(prev => prev + 1);

        // Clear the prompt for next generation
        setPrompt('');
      } else {
        setError(result.error || 'Failed to generate image');
      }
    } catch (error) {
      clearInterval(progressInterval);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 2000);
    }
  };

  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt);
    setError(null);
  };

  const handleSettingsChange = (newSettings: GenerationSettings) => {
    setSettings(newSettings);
  };

  const handleHistoryImageSelect = (image: GeneratedImage) => {
    setSelectedHistoryImage(image);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedHistoryImage(null);
  };

  const handleImageUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleGenerate();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Generation Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              AI Image Generator
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Transform your imagination into stunning visuals
            </p>
          </div>

          {/* Main Input Card */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Create Your Image</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  Settings
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Prompt Input */}
              <div>
                <Textarea
                  placeholder="Describe the image you want to create... (Ctrl/Cmd + Enter to generate)"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-24 text-base"
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-slate-500">
                    {prompt.length}/500 characters
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {settings.width}×{settings.height}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {settings.style}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Progress Bar */}
              {isGenerating && (
                <div className="space-y-2">
                  <Progress value={generationProgress} className="w-full" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                    Generating your image... This may take up to 5 minutes.
                  </p>
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                size="lg"
                className="w-full"
              >
                {isGenerating ? 'Generating Image...' : 'Generate Image'}
              </Button>

              {/* Example Prompts */}
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Try these example prompts:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {EXAMPLE_PROMPTS.slice(0, 6).map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example)}
                      className="text-left text-xs p-2 rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>

            {/* Settings Panel Overlay */}
            {showSettings && (
              <div className="absolute top-full left-0 right-0 z-10 mt-2">
                <SettingsPanel
                  settings={settings}
                  onSettingsChange={handleSettingsChange}
                  onClose={() => setShowSettings(false)}
                />
              </div>
            )}
          </Card>

          {/* Recent Generated Images */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Your Recent Creations
            </h2>
            <ImageGallery refreshKey={refreshKey} maxImages={8} showSearch={false} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <GenerationHistory
            onSelectImage={handleHistoryImageSelect}
            refreshKey={refreshKey}
            maxItems={15}
          />
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        image={selectedHistoryImage}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onImageUpdate={handleImageUpdate}
      />
    </div>
  );
}