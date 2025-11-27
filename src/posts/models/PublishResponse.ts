import { OpenAIResponse } from 'src/common/models/OpenAIResponse';
import { Post } from '../entities/post.entity';

export interface PostPublishResponse {
  OpenAIResponse?: OpenAIResponse[];
  post: Post;
}
