import 'dotenv/config';
import Proxy6 from './Proxy6.js';
import Ping from './Ping.js';

const url = 'https://medium.com/_/api/collections/c114225aeaf7/latest';
// const url = 'https://api.ipify.org';

// const proxy6 = new Proxy6();
// const agents = await proxy6.getAgents({ country: 'us' });
// const ping = new Ping({ url, agents, interval: 6000 });
const ping = new Ping({ url, interval: 7000 });
ping.startRequestLoop();
