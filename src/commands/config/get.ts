import { BaseCommand } from '../../baseCommand.js';
import { TConfig } from '../../config/schema.js';

export default class Get extends BaseCommand<typeof Get> {
  static description = 'Get currently set configs';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {};

  private printConfig(config: TConfig): void {
    this.logJson(config);
  }

  public async run(): Promise<TConfig> {
    this.printConfig(this.localConfig);
    return this.localConfig;
  }
}
