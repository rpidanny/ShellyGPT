import bodyParser from 'body-parser';
import chalk from 'chalk';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import { Server } from 'http';

import { Sender } from '../../utils/sender.enums.js';
import { ILogger, IWebServiceDependencies } from './interfaces.js';

export class WebService {
  private app: Express;
  private server!: Server;

  constructor(
    private readonly rootDir: string,
    private readonly dependencies: IWebServiceDependencies,
    private readonly logger: ILogger
  ) {
    this.app = express();
  }

  async start(port: number, collection: string): Promise<void> {
    this.init();
    this.setupRoutes(collection);

    this.server = this.app.listen(port, () => {
      this.logger.log(
        `Server started on ${chalk.green(`http://localhost:${port}`)}`
      );
    });
  }

  async close(): Promise<void> {
    this.server.close();
  }

  private init() {
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use(express.static(`${this.rootDir}/client/build`));
    this.app.use((req: Request, res: any, next: () => void) => {
      this.logger.log(
        `Incoming request ${chalk.bold(req.method)} ${chalk.bold(req.url)}`
      );
      next();
    });
  }

  private setupRoutes(collection: string) {
    this.app.post('/api/chat', async (req: Request, res: Response) => {
      const { message } = req.body;

      await this.dependencies.historyService.storeMessage({
        message,
        sender: Sender.User,
        collection,
        date: new Date().toUTCString(),
      });

      const answer = await this.dependencies.askService.askAboutCollection(
        message,
        collection
      );

      await this.dependencies.historyService.storeMessage({
        message: answer,
        sender: Sender.Shelly,
        collection,
        date: new Date().toUTCString(),
      });

      res.json({
        text: answer,
        sender: Sender.Shelly,
        date: new Date().toUTCString(),
      });
    });

    this.app.get('/api/init', async (req: Request, res: Response) => {
      const history = await this.dependencies.historyService.getHistory(
        collection
      );
      res.json({ history, collection });
    });
  }
}
