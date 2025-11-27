import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/env.model';

import OpenAI from 'openai';
import { OpenAIResponse } from 'src/common/models/OpenAIResponse';

@Injectable()
export class OpenaiService {
  private openai = new OpenAI();
  constructor(private readonly configService: ConfigService<Env>) {
    const apiKey = this.configService.get('OPENAI_API_KEY', { infer: true });
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not defined in environment variables');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async generateSummary(prompt: string): Promise<OpenAIResponse> {
    try {
      const response = await this.openai.responses.create({
        model: 'gpt-4o-mini',
        instructions: 'You are a helpful assistant that summarizes blog posts that will be used as meta descriptions. Provide a concise and engaging summary in 5-10 sentences.',
        input: prompt,
      });
      return { type: 'summary', status: 'success', data: response.output_text };
    } catch (error) {
      console.error('Error generating summary:', error);
      return { type: 'summary', status: 'error', data: 'Generic summary text', error: error.message };
    }
  }

  async generateImage(prompt: string): Promise<OpenAIResponse> {
    try {
      const instrucctions_prompt = `A high-quality, professional illustration of ${prompt}, digital art`;
      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt: instrucctions_prompt,
        size: '1024x1024',
        response_format: 'url',
      });

      if (!response.data?.[0]?.url) {
        throw new Error('Failed to generate image');
      }
      return { type: 'image', status: 'success', data: response.data[0].url };
    } catch (error) {
      console.error('Error generating image:', error);
      return { type: 'image', status: 'error', data: 'https://placehold.co/600x400/EEE/31343C', error: error.message };
    }
  }
}
