import _debug from 'debug';
import config from 'config';
import app from '../src/index';
import connectToDB from '../src/db';

(async () => {
    const debug = _debug('app:bin:server');
    const port = config.server_port;
    const host = config.server_host;
    try {
        await connectToDB(config);
        app.listen(port);

        debug(`Server is now running at http://${host}:${port}.`);
        debug(`Server accessible via localhost:${port} if you are using the project defaults.`);
    }catch(error) {
        debug(`Shutting server down due to error: ${error}`);
    }
})();
