import { IChatMessage } from '../../src/hooks/chat/interfaces';

export function getSampleChat(): IChatMessage {
  return {
    message: 'Hello World!',
    date: '2020-01-01T00:00:00.000Z',
    collection: 'chat',
    sender: 'AI',
  };
}

export function getSampleChatHistory(): string {
  return '{"date":"2020-01-01T00:00:00.000Z","sender":"AI","collection":"chat","message":"Hello World!"}\n';
}
