import fs from 'fs';
import net from 'net';
import { nap } from '../../../src/helper';

export const rmdir = path => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(file => {
      const curPath = `${path}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) {
        rmdir(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

export const isPortOpen = async port => {
  await new Promise((resolve, reject) => {
    const client = new net.Socket();
    client.on('error', reject);
    client.on('close', resolve);
    client.on('connect', () => client.destroy());
    client.connect(port, 'localhost');
  });
};

export const killProcess = async pid => {
  let terminated = false;
  while (!terminated) {
    try {
      process.kill(pid);
      await nap(500);
    } catch (e) {
      terminated = true;
    }
  }
};
