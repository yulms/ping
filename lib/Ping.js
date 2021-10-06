import needle from 'needle';

export default class Ping {
  url;
  interval = 7000;
  proxies;
  requestOptions = {
    compressed: true,
  };

  constructor({ url, interval, requestOptions, proxies }) {
    this.url = url;
    this.interval = interval ?? this.interval;
    this.proxies = proxies || [];
    Object.assign(this.requestOptions, requestOptions);
  }

  startRequestLoop() {
    const doIteration = async (count = 0, allTime = 0) => {
      const info = await this.getRequestInfo().catch((err) => {
        console.error(err);
        process.exit(1);
      });
      count += 1;
      allTime += info.timeMs;
      console.log(`Время выполнения запроса: ${info.timeMs}, bytes: ${info.bytes}, среднее время: ${Math.round(allTime / count)}`);
      setTimeout(doIteration, this.interval, count, allTime);
    };

    doIteration();
  }

  async getRequestInfo({ additionalOptions, proxy }) {
    const options = Object.assign(this.requestOptions, additionalOptions, { proxy });
    const startTime = new Date();
    const response = await needle('get', this.url, options);
    if (response.statusCode !== 200) throw new Error(`Ошибка ответа сервера: ${response.statusCode}, ${response.statusMessage}`);
    const result = {};
    result.timeMs = new Date() - startTime;
    result.bytes = response.bytes;
    return result;
  }
}
