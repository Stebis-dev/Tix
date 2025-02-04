/* eslint-disable @typescript-eslint/no-var-requires */
const { writeFile } = require('fs');
const { promisify } = require('util');
const dotenv = require('dotenv');

dotenv.config();

const writeFilePromisified = promisify(writeFile);

const targetEnvPath = './src/environments/environment.ts';
const targetDevEnvPath = './src/environments/environment.development.ts';

const envConfigFile = (isProduction = true) =>
  `import { FakeAuthServiceConfig } from '@ntx-auth/classes/fake-auth.service';
import { OAuth2ServiceConfig } from '@ntx-auth/classes/oauth2.service';

export const environment = {
  production: ${isProduction},
  development: ${!isProduction},
  api: {
    serverUrl: '${process.env['API_SERVER_URL']}',
  },
};
`;

const targetProxyPath = './src/proxy.conf.json';
const targetDevProxyPath = './src/proxy.conf.development.json';

const proxyConfigFile = (isProduction = true) =>
  `{
  "/api": {
    "target": "${process.env['API_SERVER_URL']}",
    "secure": true,
    "changeOrigin": true,
    "logLevel": "${isProduction ? '' : 'debug'}"
  },
}`;

(async () => {
  try {
    await writeFilePromisified(targetEnvPath, envConfigFile(true));
    await writeFilePromisified(targetDevEnvPath, envConfigFile(false));

    await writeFilePromisified(targetProxyPath, proxyConfigFile(true));
    await writeFilePromisified(targetDevProxyPath, proxyConfigFile(false));
  } catch (err) {
    console.error(err);
    throw err;
  }
})();
