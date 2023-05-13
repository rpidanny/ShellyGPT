import { AskService } from '../ask/ask.js';
import { HistoryService } from '../history/history.js';

export interface IWebServiceDependencies {
  askService: AskService;
  historyService: HistoryService;
}

export interface ILogger {
  log: (message: string) => void;
  error: (message: string) => void;
  warn: (message: string) => void;
}
