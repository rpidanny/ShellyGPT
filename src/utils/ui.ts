import chalk from 'chalk';
import figlet from 'figlet';
import { marked } from 'marked';
import TerminalRenderer from 'marked-terminal';

import { IChatMessage } from '../hooks/chat/interfaces.js';
import { Sender } from './sender.enums.js';

marked.setOptions({
  renderer: new TerminalRenderer(),
});

export function printBanner(version: string, log: (msg: string) => void): void {
  log(
    `${chalk.bold.hex('#0077be')(
      figlet.textSync(`Shelly`, {
        font: 'Standard',
      })
    )} ${chalk.hex('#0077be')(`v${version}`)}`
  );
}

export function printConfigurationError(log: (msg: string) => void): void {
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

export function printChatMessage(
  chat: IChatMessage,
  log: (msg: string) => void
): void {
  log('');
  log(
    `${chalk[chat.sender === Sender.User ? 'blue' : 'green'].bold(
      chat.sender.toUpperCase()
    )} ${chalk.gray(`${chat.date.toUTCString()}`)}`
  );
  log(
    marked(
      chat.message.replace(/```ts/g, '```js').replace(/```typescript/g, '```js')
    )
  );
}
