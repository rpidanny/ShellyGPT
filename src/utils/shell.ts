import { exec, spawn } from 'child_process';
import { promisify } from 'util';

export async function runCommand(command: string): Promise<string> {
  const execAsync = promisify(exec);

  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) throw new Error(stderr);
    return stdout;
  } catch (error) {
    throw error;
  }
}

export async function runCommandWithStream(
  command: string,
  onStdOut: (msg: string) => void,
  onStrErr: (msg: string) => void
): Promise<void> {
  const child = spawn(command, { shell: true });

  child.stdout.on('data', (data) => {
    onStdOut(data.toString());
  });

  child.stderr.on('data', (data) => {
    onStrErr(data.toString());
  });

  return new Promise((resolve, reject) => {
    child.on('close', (code) => {
      if (code !== 0) {
        const error = new Error(`Command failed: exit ${code}`);
        reject(error);
      } else {
        resolve();
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}
