export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  settings: GenerationSettings;
  isFavorite?: boolean;
}

export interface GenerationSettings {
  width: number;
  height: number;
  style?: string;
  quality?: string;
  seed?: number;
}

export interface GenerationRequest {
  prompt: string;
  settings: GenerationSettings;
}

export interface GenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  id: string;
}

export interface ImagePreset {
  name: string;
  prompt: string;
  settings: GenerationSettings;
}

export const IMAGE_DIMENSIONS = [
  { label: 'Square (1024x1024)', width: 1024, height: 1024 },
  { label: 'Portrait (1024x1536)', width: 1024, height: 1536 },
  { label: 'Landscape (1536x1024)', width: 1536, height: 1024 },
  { label: 'Wide (1920x1080)', width: 1920, height: 1080 },
] as const;

export const STYLE_PRESETS = [
  'Photorealistic',
  'Artistic',
  'Abstract',
  'Minimalist',
  'Vintage',
  'Futuristic',
  'Watercolor',
  'Oil Painting',
] as const;