import { Hook } from '@oclif/core';
import fs from 'fs-extra';
import path from 'path';

import { CONFIG_FILE_NAME } from '../../config/constants.js';
import { ConfigSchema } from '../../config/schema.js';

const hook: Hook<'init'> = async function (opts) {
  if (opts.id === 'configure') return;

  try {
    const configFilePath = path.join(this.config.configDir, CONFIG_FILE_NAME);
    const config = await fs.readJSON(configFilePath);

    ConfigSchema.parse(config);
  } catch (err) {
    this.log('Config not present / invalid.');
    this.log('Run shelly config to setup config');
    this.exit();
  }
};

export default hook;
