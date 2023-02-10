import Resolver from '@forge/resolver';
import { Config } from './macro/Config';
import ForgeUI, { render } from '@forge/ui';
const { getCurrentUser, getUserEPToken, registerUserEPToken, updateUserEPToken, deleteUserEPToken } = require('./macro/utils/apiUtils');
const { parseSolaceLink, getEventPortalResource } = require('./macro/utils/epUtils');
const resolver = new Resolver();

resolver.define('get-config', async({ context }) => {
  // console.log('get-config', context.extension?.config);
  return context.extension?.config
});

resolver.define('get-user', ({ context }) => {
  // console.log('get-user');
  return getCurrentUser();
});

resolver.define('get-token', ({ context }) => {
  console.log('get-token', context.accountId);
  return getUserEPToken(context.accountId);
});

resolver.define('register-token', async ({ payload, context }) => {
  console.log('register-token', payload);
  return registerUserEPToken(payload);
});

resolver.define('update-token', async ({ payload, context }) => {
  console.log('update-token', payload);
  return updateUserEPToken(payload);
});

resolver.define('delete-token', async ({ context }) => {
  console.log('delete-token', context.accountId);
  return deleteUserEPToken(context.accountId);
});

resolver.define('parse-solace-link', async({payload, context }) => {
  console.log('parse-solace-link', payload.url, payload.pageSize, payload.pageNumber);
  return parseSolaceLink(payload.url, payload.pageSize, payload.pageNumber);
});

resolver.define('get-ep-resource', async({ payload, context }) => {
  console.log('get-ep-resource');
  return getEventPortalResource(payload.command, payload.token);
});

export const config = render(<Config />);

export const handler = resolver.getDefinitions();
