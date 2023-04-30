import chalk from 'chalk';
import figlet from 'figlet';

export function printBanner(log: (msg: string) => void): void {
  log(chalk.bold.hex('#0077be')(figlet.textSync('Shelly')));
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
