'use client';

import { useState } from 'react';
import { GenerationSettings, IMAGE_DIMENSIONS, STYLE_PRESETS } from '@/types/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface SettingsPanelProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: GenerationSettings) => void;
  onClose?: () => void;
  className?: string;
}

export default function SettingsPanel({
  settings,
  onSettingsChange,
  onClose,
  className = '',
}: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState<GenerationSettings>(settings);

  const handleDimensionChange = (value: string) => {
    const dimension = IMAGE_DIMENSIONS.find(d => `${d.width}x${d.height}` === value);
    if (dimension) {
      const newSettings = {
        ...localSettings,
        width: dimension.width,
        height: dimension.height,
      };
      setLocalSettings(newSettings);
      onSettingsChange(newSettings);
    }
  };

  const handleStyleChange = (value: string) => {
    const newSettings = {
      ...localSettings,
      style: value,
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleQualityChange = (value: string) => {
    const newSettings = {
      ...localSettings,
      quality: value,
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const resetSettings = () => {
    const defaultSettings: GenerationSettings = {
      width: 1024,
      height: 1024,
      style: 'Photorealistic',
      quality: 'High',
    };
    setLocalSettings(defaultSettings);
    onSettingsChange(defaultSettings);
  };

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Generation Settings</CardTitle>
        {onClose && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            ✕
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Dimensions */}
        <div className="space-y-2">
          <Label htmlFor="dimensions" className="text-sm font-medium">
            Image Dimensions
          </Label>
          <Select
            value={`${localSettings.width}x${localSettings.height}`}
            onValueChange={handleDimensionChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select dimensions" />
            </SelectTrigger>
            <SelectContent>
              {IMAGE_DIMENSIONS.map((dimension) => (
                <SelectItem
                  key={`${dimension.width}x${dimension.height}`}
                  value={`${dimension.width}x${dimension.height}`}
                >
                  {dimension.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Style Preset */}
        <div className="space-y-2">
          <Label htmlFor="style" className="text-sm font-medium">
            Style Preset
          </Label>
          <Select
            value={localSettings.style || 'Photorealistic'}
            onValueChange={handleStyleChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {STYLE_PRESETS.map((style) => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Quality Setting */}
        <div className="space-y-2">
          <Label htmlFor="quality" className="text-sm font-medium">
            Quality
          </Label>
          <Select
            value={localSettings.quality || 'High'}
            onValueChange={handleQualityChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Reset Button */}
        <Button
          variant="outline"
          onClick={resetSettings}
          className="w-full"
        >
          Reset to Defaults
        </Button>
      </CardContent>
    </Card>
  );
}