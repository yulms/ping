import needle from 'needle';
import getMedian from './getMedian.js';

export default class Ping {
  url;
  interval = 6000;
  agents;
  requestOptions = { compressed: true };
  requestTimes = [];

  constructor({ url, interval, requestOptions, agents }) {
    this.url = url;
    this.interval = interval ?? this.interval;
    this.agents = agents || [];
    this.requestOptions = Object.assign(this.requestOptions, requestOptions);
  }

  startRequestLoop() {
    const doIteration = async (count = 0, allTime = 0) => {
      count += 1;
      const agent = this.agents.length ? this.agents[count % this.agents.length] : null;
      const info = await this.getRequestInfo(agent).catch((err) => {
        console.error(err);
        process.exit(1);
      });
      allTime += info.timeMs;
      this.requestTimes.push(info.timeMs);
      console.log(`Время выполнения запроса: ${info.timeMs}, bytes: ${info.bytes}, среднее время: ${Math.round(allTime / count)}, медиана: ${getMedian(this.requestTimes)}`);
      setTimeout(doIteration, this.interval, count, allTime);
    };

    doIteration();
  }

  async getRequestInfo(agent) {
    const options = agent ? Object.assign(this.requestOptions, { agent }) : this.requestOptions;
    const startTime = new Date();
    const response = await needle('get', this.url, options);
    console.log(`${agent.options.proxy.host}: запрос выполнен`);
    if (response.statusCode !== 200) throw new Error(`Ошибка ответа сервера: ${response.statusCode}, ${response.statusMessage}`);
    const result = {};
    result.timeMs = new Date() - startTime;
    result.bytes = response.bytes;
    return result;
  }
}
