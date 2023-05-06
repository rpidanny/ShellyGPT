import chalk from 'chalk';
import figlet from 'figlet';
import { marked } from 'marked';
import TerminalRenderer from 'marked-terminal';

import { IChatMessage } from '../../hooks/chat/interfaces.js';
import { Sender } from '../sender.enums.js';

marked.setOptions({
  renderer: new TerminalRenderer(),
});

function printBanner(version: string, log: (msg: string) => void): void {
  log(
    `${chalk.bold.hex('#0077be')(
      figlet.textSync(`Shelly`, {
        font: 'Standard',
      })
    )} ${chalk.hex('#0077be')(`v${version}`)}`
  );
}

function printConfigurationError(log: (msg: string) => void): void {
  log(
    chalk.yellow(
      `${chalk.bold.italic(
        'Bazinga!'
      )} It appears that you have not configured the CLI app or the current configuration is clearly invalid.`
    )
  );

  log(
    chalk.green(
      `Please run ${chalk.bold(
        '"shelly configure"'
      )} and rectify this situation at once.`
    )
  );
}

function printChatMessage(
  chat: IChatMessage,
  log: (msg: string) => void
): void {
  log('');
  log(
    `${chalk[chat.sender === Sender.User ? 'blue' : 'green'].bold(
      chat.sender.toUpperCase()
    )} ${chalk.gray(`${chat.date}`)}`
  );
  log(
    marked(
      chat.message.replace(/```ts/g, '```js').replace(/```typescript/g, '```js')
    )
  );
}

function printInvalidCommandMessage(
  command: string,
  log: (msg: string) => void
): void {
  log('');
  log(
    chalk.redBright(
      `${chalk.bold.italic('Bazinga!')} The command "${chalk.bold(
        command
      )}" is as non-existent as a Higgs boson without a particle accelerator.`
    )
  );

  log('');

  log(
    chalk.yellow(
      `Please run ${chalk.bold(
        `"shelly --help"`
      )} to see the list of available commands.`
    )
  );
}

export default {
  printBanner,
  printConfigurationError,
  printChatMessage,
  printInvalidCommandMessage,
};
