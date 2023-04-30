import { runCommand, runCommandWithStream } from '../../src/utils/shell';

describe('runCommand', () => {
  it('should return stdout if the command runs successfully', async () => {
    const result = await runCommand('echo "hello world"');
    expect(result).toEqual('hello world\n');
  });

  it('should throw an error if the command fails', async () => {
    await expect(runCommand('exit 1')).rejects.toThrow(
      'Command failed: exit 1'
    );
  });

  it('should throw an error if there is stderr output', async () => {
    await expect(runCommand('>&2 echo "error message"')).rejects.toThrow(
      'error message\n'
    );
  });
});

describe('runCommandWithStream', () => {
  it('should call onStdOut with stdout data', async () => {
    const onStdOut = jest.fn();
    const onStdErr = jest.fn();
    await runCommandWithStream('echo "hello world"', onStdOut, onStdErr);
    expect(onStdOut).toHaveBeenCalledWith('hello world\n');
  });

  it('should call onStdErr with stderr data', async () => {
    const onStdOut = jest.fn();
    const onStdErr = jest.fn();
    await runCommandWithStream('>&2 echo "error message"', onStdOut, onStdErr);
    expect(onStdErr).toHaveBeenCalledWith('error message\n');
  });

  it('should reject with an error if the command fails', async () => {
    const onStdOut = jest.fn();
    const onStdErr = jest.fn();
    await expect(
      runCommandWithStream('exit 1', onStdOut, onStdErr)
    ).rejects.toThrow('Command failed: exit 1');
  });
});
