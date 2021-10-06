import 'dotenv/config';
import Proxy6 from './Proxy6.js';
import Ping from './Ping.js';

// const url = 'https://medium.com/_/api/collections/c114225aeaf7/latest';
const url = 'https://google.com';

const proxy6 = new Proxy6();
const proxies = await proxy6.getProxyUrls();
// console.log(proxies);
const ping = new Ping({ url, proxies });
const result = await ping.getRequestInfo({ proxy: proxies[1] });
console.log(result);
