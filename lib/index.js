import 'dotenv/config';
import needle from 'needle';
import tunnel from 'tunnel';
import SocksProxyAgent from 'socks-proxy-agent';
import Proxy6 from './Proxy6.js';
import Ping from './Ping.js';

// const url = 'https://medium.com/_/api/collections/c114225aeaf7/latest';

// const proxy6 = new Proxy6();
// const proxies = await proxy6.getProxyUris();
// console.log(proxies);
// const ping = new Ping({ url, proxies });
// const result = await ping.getRequestInfo({ proxy: proxies[1] });
// console.log(result);
const startTime = new Date();

// * socks пробуем
const createAgent = () => new SocksProxyAgent('socks://T1JHsh:c4NxzT@168.80.121.139:8000');
//   {
//   host: '168.80.121.139',
//   userId: 'T1JHsh',
//   password: 'c4NxzT',
// });
const result = await needle('get', 'https://medium.com/_/api/collections/c114225aeaf7/latest', { agent: createAgent(), compressed: true });

// * рабочее решение
// const tunnelingAgent = tunnel.httpsOverHttp({
//   proxy: {
//     host: '168.80.121.139',
//     port: 8000,
//     proxyAuth: 'T1JHsh:c4NxzT',
//   },
//   // Header fields for proxy server if necessary
//   headers: {
//     'User-Agent': 'Node',
//     'accept-encoding': 'gzip, deflate, br',
//   },
// });
// const result = await needle('get', 'https://medium.com/_/api/collections/c114225aeaf7/latest', { agent: tunnelingAgent, compressed: true });

console.log(`Время выполнения: ${Date.now() - startTime}`);
console.log(`statusCode: ${result.statusCode}`, result.statusMessage);
console.log(result.body);
