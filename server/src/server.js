import 'source-map-support';

import { cyan, green } from 'chalk';

import { Server } from 'hapi';
import pkg from '../package';
import registerPlugins from './plugins';

const server = new Server({
  connections: {
    router: {
      stripTrailingSlash: true,
    },
    routes: {
      validate: {
        options: {
          abortEarly: false,
        },
      },
    },
  },
});

server.connection({
  port: 3000,
  labels: ['session-tracking'],
  host: 'localhost',
});

async function bootstrap() {
  try {
    const startTime = process.hrtime();

    await registerPlugins(server);
    await server.initialize();

    if (process.env.NODE_ENV !== 'test') {
      await server.start();
      server.log(
        'info',
        `Starting ${green(pkg.name)} at ${cyan(server.info.uri)}`
      );
    }

    const [s, ns] = process.hrtime(startTime);
    const [sms, nms] = [s * 1e3, ns / 1e6];

    server.log('debug', `Server took ${sms + nms}ms to start up`);

    return server;
  } catch (err) {
    console.error(err);

    process.exit(1);
  }
}

export default bootstrap();