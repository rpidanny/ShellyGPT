import chalk from 'chalk';

import { BaseCommand } from '../../baseCommand.js';
import shell from '../../utils/shell.js';

export default class Start extends BaseCommand<typeof Start> {
  static description = 'Start local Milvus vector store';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {};

  public async run(): Promise<void> {
    await shell.runCommandWithStream(
      `docker-compose -f ${this.config.root}/docker/milvus/docker-compose.yml -p shelly-milvus up -d`,
      (msg) => this.log(msg),
      (msg) => this.log(msg)
    );

    this.log(
      `${chalk.green.bold(`Milvus Started🚀:`)} ${chalk.cyanBright.underline(
        `http://localhost:8848`
      )}`
    );
    this.log('');
    this.log(chalk.magenta('Good Luck!'));
  }
}
