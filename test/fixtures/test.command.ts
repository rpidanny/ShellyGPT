import { Args, Flags } from '@oclif/core';

import { BaseCommand } from '../../src/baseCommand.js';
import { TConfig } from '../../src/config/schema.js';

export class TestCommand extends BaseCommand<typeof TestCommand> {
  static description = 'Get currently set configs';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    verbose: Flags.boolean({
      char: 'v',
      description: 'enable verbose mode',
    }),
  };

  static args = {
    question: Args.string({
      description: 'some argument',
      required: true,
    }),
  };

  public async run(): Promise<string> {
    return 'hello';
  }

  public async getConfig(): Promise<TConfig> {
    return this.localConfig;
  }

  public getFlags(): Record<string, any> {
    return this.flags;
  }

  public getArgs(): Record<string, any> {
    return this.args;
  }
}
