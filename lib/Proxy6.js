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

import needle from 'needle';

export default class Proxy6 {
  url = `https://proxy6.net/api/${process.env.PROXY6_API_KEY}/{method}`;
  setTypeEndPoint = `https://proxy6.net/api/${process.env.PROXY6_API_KEY}/settype?ids={ids}&type={type}`;

  async getCountry() {
    const response = await needle('get', this.url.replace('{method}', 'getcountry'));
    if (response.statusCode !== 200) throw new Error(`Ошибка ответа сервера: ${response.statusCode}, ${response.statusMessage}`);
    console.log(response.body);
  }

  async getProxy() {
    const response = await needle('get', this.url.replace('{method}', 'getproxy'));
    if (response.statusCode !== 200) throw new Error(`Ошибка ответа сервера: ${response.statusCode}, ${response.statusMessage}`);
    return response.body;
  }

  async getProxies() {
    const response = await needle('get', this.url.replace('{method}', 'getproxy'));
    if (response.statusCode !== 200) throw new Error(`Ошибка ответа сервера: ${response.statusCode}, ${response.statusMessage}`);
    const proxies = Object.values(response.body.list);
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
    // https://proxy6.net/api/${process.env.PROXY6_API_KEY}/settype?ids={ids}&type={type}
    const url = this.setTypeEndPoint.replace('{ids}', ids).replace('{type}', type);
    const response = await needle('get', url);
    if (response.statusCode !== 200) throw new Error(`Ошибка ответа сервера: ${response.statusCode}, ${response.statusMessage}`);
    console.log(response);
  }
}

const proxy6 = new Proxy6();
await proxy6.setType('socks');
