import { cyan, green } from 'chalk';
import { join, keys, map, pipe, values } from 'lodash/fp';

import { loadAsync } from 'mod.js';

const standardPlugins = ['inert', 'vision'];

export default async function(server) {
  const filePlugins = await loadAsync(__dirname);
  const plugins = [...map(require, standardPlugins), ...values(filePlugins)];
  await server.register(plugins, { routes: { prefix: '/session-tracker' } });
  const pluginNames = pipe(keys, join(', '))(server.registrations);
  server.log(
    'debug',
    green('Plugins successfully loaded: ') + cyan(pluginNames)
  );
  return { server };
}
