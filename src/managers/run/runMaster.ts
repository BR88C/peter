import MasterManager from '../Master';

// Import modules.
import { Utils } from '@br88c/discord-utils';

/**
 * Starts a master manager process.
 */
export default (): MasterManager => {
    const master = new MasterManager();
    master.start().catch((error) => Utils.logError(error));
    return master;
};
