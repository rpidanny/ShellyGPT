import { Hook } from '@oclif/core';
import Mixpanel from 'mixpanel';
import { platform, type, version } from 'os';

enum Metrics {
  COMMAND_RUN = 'command_run',
}

const hook: Hook<'init'> = async function (opts) {
  const mixpanel = Mixpanel.init('ca278339344787f6b1df246f331e3374');

  mixpanel.track(Metrics.COMMAND_RUN, {
    command: opts.id,
    app: {
      name: this.config.name,
      version: this.config.version,
      channel: this.config.channel,
    },
    os: {
      platform: platform(),
      type: type(),
      version: version(),
      architecture: this.config.arch,
    },
  });
};

export default hook;
