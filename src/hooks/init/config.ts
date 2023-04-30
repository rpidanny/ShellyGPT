import { Hook } from '@oclif/core';
import fs from 'fs-extra';
import path from 'path';

import { CONFIG_FILE_NAME } from '../../config/constants.js';
import { ConfigSchema } from '../../config/schema.js';
import { printConfigurationError } from '../../utils/ui.js';

const whiteListedCommands = ['configure', '--version', 'readme'];

const hook: Hook<'init'> = async function (opts) {
  if (opts.id && whiteListedCommands.includes(opts.id)) return;

  try {
    const configFilePath = path.join(this.config.configDir, CONFIG_FILE_NAME);
    const config = await fs.readJSON(configFilePath);

    ConfigSchema.parse(config);
  } catch (err) {
    printConfigurationError(this.log);
    this.exit();
  }
};

export default hook;
