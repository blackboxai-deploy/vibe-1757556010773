import { GeneratedImage, GenerationSettings } from '@/types/image';

const STORAGE_KEYS = {
  GENERATED_IMAGES: 'ai-generator-images',
  USER_SETTINGS: 'ai-generator-settings',
} as const;

export function saveGeneratedImage(image: GeneratedImage): void {
  try {
    const existingImages = getGeneratedImages();
    const updatedImages = [image, ...existingImages.slice(0, 99)]; // Keep only latest 100
    localStorage.setItem(STORAGE_KEYS.GENERATED_IMAGES, JSON.stringify(updatedImages));
  } catch (error) {
    console.error('Error saving image to storage:', error);
  }
}

export function getGeneratedImages(): GeneratedImage[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GENERATED_IMAGES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error retrieving images from storage:', error);
    return [];
  }
}

export function deleteGeneratedImage(id: string): void {
  try {
    const existingImages = getGeneratedImages();
    const updatedImages = existingImages.filter(img => img.id !== id);
    localStorage.setItem(STORAGE_KEYS.GENERATED_IMAGES, JSON.stringify(updatedImages));
  } catch (error) {
    console.error('Error deleting image from storage:', error);
  }
}

export function toggleImageFavorite(id: string): void {
  try {
    const existingImages = getGeneratedImages();
    const updatedImages = existingImages.map(img => 
      img.id === id ? { ...img, isFavorite: !img.isFavorite } : img
    );
    localStorage.setItem(STORAGE_KEYS.GENERATED_IMAGES, JSON.stringify(updatedImages));
  } catch (error) {
    console.error('Error updating image favorite status:', error);
  }
}

export function saveUserSettings(settings: GenerationSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving user settings:', error);
  }
}

export function getUserSettings(): GenerationSettings | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error retrieving user settings:', error);
    return null;
  }
}

export function clearAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.GENERATED_IMAGES);
    localStorage.removeItem(STORAGE_KEYS.USER_SETTINGS);
  } catch (error) {
    console.error('Error clearing storage data:', error);
  }
}