/* альтернатива tunnel
import HttpsProxyAgent from 'https-proxy-agent';  */

/*
https://proxy6.net/api/${process.env.PROXY6_API_KEY}/{method}/?{params}
getprice - Получение информации о сумме заказа;
getcount - Получение информации о доступном кол-ве прокси для конкретной страны;
getcountry - Получение списка доступных стран;
getproxy - Получение списка ваших прокси;
settype - Изменение типа (протокола) прокси;
setdescr - Обновление технического комментария;
buy - Покупка прокси;
prolong - Продление списка прокси;
delete - Удаление прокси;
check - Проверка валидности прокси. */

import 'dotenv/config';
import needle from 'needle';
import tunnel from 'tunnel';

export default class Proxy6 {
  getProxyEndPoint = `https://proxy6.net/api/${process.env.PROXY6_API_KEY}/{method}`;
  setTypeEndPoint = `https://proxy6.net/api/${process.env.PROXY6_API_KEY}/settype?ids={ids}&type={type}`;

  async getProxy() {
    const response = await needle('get', this.getProxyEndPoint.replace('{method}', 'getproxy'));
    if (response.statusCode !== 200) throw new Error(`Ошибка ответа сервера: ${response.statusCode}, ${response.statusMessage}`);
    return response.body;
  }

  async getProxies(ipVersion = '4', country) {
    const response = await needle('get', this.getProxyEndPoint.replace('{method}', 'getproxy'));
    if (response.statusCode !== 200) throw new Error(`Ошибка ответа сервера: ${response.statusCode}, ${response.statusMessage}`);
    const proxies = Object.values(response.body.list)
      .filter((proxy) => {
        if (country) {
          return (proxy.version === ipVersion) && (proxy.country === country);
        }
        return (proxy.version === ipVersion);
      });
    /* [ {
      id: '11970349',
      version: '6',
      ip: '2001:19f0:7001:4f6:c2c8:f7f7:fb7c:f435',
      host: '45.32.56.105',
      port: '31129',
      user: 'RXYAns',
      pass: '0ppAAe',
      type: 'http',
      country: 'jp',
      date: '2021-10-06 12:00:40',
      date_end: '2021-10-09 12:00:40',
      unixtime: 1633510840,
      unixtime_end: 1633770040,
      descr: '',
      active: '1'
    }, ...] */
    return proxies;
  }

  async getAgents({ ipVersion, country }) {
    const proxies = await this.getProxies(ipVersion, country);
    return proxies.map((proxy) => (tunnel.httpsOverHttp({
      proxy: {
        host: proxy.host,
        port: proxy.port,
        proxyAuth: `${proxy.user}:${proxy.pass}`,
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36',
        'accept-encoding': 'gzip, deflate, br',
      },
    })));
  }

  async getProxyUris() {
    const proxies = await this.getProxies();
    // 'http://user:pass@proxy.server.com:3128'
    const proxyUris = proxies.map((proxy) => `https://${proxy.user}:${proxy.pass}@${proxy.ip}:${proxy.port}`);
    return proxyUris;
  }

  async setType(type = 'socks') {
    /* установка типа прокси http или socks */
    const proxies = await this.getProxies();
    const ids = proxies.map((proxy) => proxy.id).join(',');
    const url = this.setTypeEndPoint.replace('{ids}', ids).replace('{type}', type);
    const response = await needle('get', url);
    if (response.statusCode !== 200) throw new Error(`Ошибка ответа сервера: ${response.statusCode}, ${response.statusMessage}`);
  }
}

// const proxy6 = new Proxy6();
// proxy6.setType('http');
// console.log(await proxy6.getProxyUris());
