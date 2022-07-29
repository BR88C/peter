import { ClientManager } from './structures/ClientManager';
import { loadTokens } from './utils/tokens';

loadTokens();
const clientManager = new ClientManager();

// @ts-expect-error 7017
if (process.env.NODE_ENV === `dev`) global.clientManager = clientManager;

clientManager.init();
