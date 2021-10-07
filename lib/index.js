import 'dotenv/config';
import needle from 'needle';
import tunnel from 'tunnel';
// import SocksProxyAgent from 'socks-proxy-agent';
// import HttpsProxyAgent from 'https-proxy-agent';
import Proxy6 from './Proxy6.js';
import Ping from './Ping.js';

// const url = 'https://medium.com/_/api/collections/c114225aeaf7/latest';

// const proxy6 = new Proxy6();
// const proxies = await proxy6.getProxyUris();
// console.log(proxies);
// const ping = new Ping({ url, proxies });
// const result = await ping.getRequestInfo({ proxy: proxies[1] });
// console.log(result);
// const startTime = new Date();

// * socks: среднее время 1940 (япония)
// const createAgent = () => new SocksProxyAgent('socks://T1JHshd:c4NxzTd@168.80.121.139:8000');
// setInterval(async () => {
//   const startTime = new Date();
//   const result = await needle('get', 'https://medium.com/_/api/collections/c114225aeaf7/latest', { agent: createAgent(), compressed: true });
//   console.log(`Время выполнения: ${Date.now() - startTime}`);
//   console.log(`statusCode: ${result.statusCode}`, result.statusMessage);
// }, 7000);

// * рабочее решение: среднее время 1555 (япония), 736 (америка)
const tunnelingAgent = tunnel.httpsOverHttp({
  proxy: {
    host: '193.8.234.86',
    port: 8000,
    proxyAuth: 'MJ5oTS:50aakc',
  },
  // Header fields for proxy server if necessary
  headers: {
    'User-Agent': 'Node',
    'accept-encoding': 'gzip, deflate, br',
  },
});

setInterval(async () => {
  const startTime = new Date();
  const result = await needle('get', 'https://medium.com/_/api/collections/c114225aeaf7/latest', { agent: tunnelingAgent, compressed: true });
  console.log(`Время выполнения: ${Date.now() - startTime}`);
  console.log(`statusCode: ${result.statusCode}`, result.statusMessage);
}, 7000);

// * рабочее решение: среднее время 1545 (япония), 768 (америка)
// const agent = new HttpsProxyAgent('http://MJ5oTSd:50aakcd@193.8.234.86:8000');
// setInterval(async () => {
//   const startTime = new Date();
//   const result = await needle('get', 'https://medium.com/_/api/collections/c114225aeaf7/latest', { agent, compressed: true });
//   console.log(`Время выполнения: ${Date.now() - startTime}`);
//   console.log(`statusCode: ${result.statusCode}`, result.statusMessage);
// }, 7000);
