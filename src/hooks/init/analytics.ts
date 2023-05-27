import { Hook } from '@oclif/core';
import Mixpanel from 'mixpanel';
import { platform, type, version } from 'os';

import pkg from '../../../package.json';

enum Metrics {
  COMMAND_RUN = 'command_run',
}

const hook: Hook<'init'> = async function (opts) {
  const mixpanel = Mixpanel.init('ca278339344787f6b1df246f331e3374');

  mixpanel.track(Metrics.COMMAND_RUN, {
    appVersion: pkg.version,
    command: opts.id,
    os: {
      platform: platform(),
      type: type(),
      version: version(),
    },
  });
};

export default hook;
