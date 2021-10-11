import 'dotenv/config';
import Proxy6 from './Proxy6.js';
import Ping from './Ping.js';

const url = 'https://medium.com/_/api/collections/c114225aeaf7/latest';
// const url = 'https://data.gateapi.io/api2/1/ticker/eth_usdt';
// const url = 'https://api.binance.com/api/v3/ping';
// const url = 'https://api.binance.com/api/v3/exchangeInfo';
// const url = 'https://api.huobi.pro/market/trade?symbol=ethusdt';
// const url = 'https://api.ipify.org';

const options = {
  url,
  interval: 6000,
};

const useProxy = true;
if (useProxy) {
  const proxy6 = new Proxy6();
  options.agents = await proxy6.getAgents({ country: 'fr' });
}

const ping = new Ping(options);
ping.startRequestLoop();
