import { NextRequest, NextResponse } from 'next/server';
import { GenerationRequest, GenerationResponse } from '@/types/image';

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json();
    const { prompt, settings } = body;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required', id: '' },
        { status: 400 }
      );
    }

    // Create enhanced prompt with style and settings
    const enhancedPrompt = createEnhancedPrompt(prompt, settings);

    // Call the AI image generation API
    const aiResponse = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'customerId': 'cus_S1UMHsRHgj8wNi',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx',
      },
      body: JSON.stringify({
        model: 'replicate/black-forest-labs/flux-1.1-pro',
        messages: [
          {
            role: 'user',
            content: enhancedPrompt,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API Error:', errorText);
      return NextResponse.json(
        { 
          success: false, 
          error: `AI API Error: ${aiResponse.status} - ${errorText}`,
          id: '',
        },
        { status: 500 }
      );
    }

    const aiData = await aiResponse.json();
    
    // Extract image URL from AI response
    let imageUrl = '';
    if (aiData.choices && aiData.choices[0] && aiData.choices[0].message) {
      const content = aiData.choices[0].message.content;
      if (typeof content === 'string' && content.startsWith('http')) {
        imageUrl = content;
      }
    }

    if (!imageUrl) {
      console.error('No image URL in AI response:', aiData);
      return NextResponse.json(
        { 
          success: false, 
          error: 'No image URL received from AI service',
          id: '',
        },
        { status: 500 }
      );
    }

    const response: GenerationResponse = {
      success: true,
      imageUrl,
      id: generateId(),
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        id: '',
      },
      { status: 500 }
    );
  }
}

function createEnhancedPrompt(basePrompt: string, settings: any): string {
  const { width, height, style } = settings;
  
  let enhancedPrompt = basePrompt;
  
  // Add style modifier if specified
  if (style && style !== 'Default') {
    enhancedPrompt = `${basePrompt}, ${style.toLowerCase()} style`;
  }
  
  // Add technical specifications for better quality
  enhancedPrompt += ', high quality, detailed, sharp focus, professional';
  
  // Add aspect ratio information
  if (width && height) {
    const aspectRatio = width / height;
    if (aspectRatio > 1.5) {
      enhancedPrompt += ', wide landscape format';
    } else if (aspectRatio < 0.7) {
      enhancedPrompt += ', tall portrait format';
    }
  }
  
  return enhancedPrompt;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}