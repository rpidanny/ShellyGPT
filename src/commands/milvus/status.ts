import { BaseCommand } from '../../baseCommand.js';
import shell from '../../utils/shell.js';

export default class Status extends BaseCommand<typeof Status> {
  static description = 'Check to see if Milvus is running or not';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {};

  public async run(): Promise<void> {
    const output = await shell.runCommand(
      'docker-compose ls --filter name=shelly-milvus'
    );
    this.log(output);
  }
}
