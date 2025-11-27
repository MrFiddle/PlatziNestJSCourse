export interface OpenAIResponse {
  type: 'summary' | 'image';
  status: 'success' | 'error';
  data: any;
  error?: string;
}
