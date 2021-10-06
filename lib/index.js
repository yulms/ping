import needle from 'needle';

async function getRequestInfo(url) {
  const startTime = new Date();
  const response = await needle('get', url, { compressed: true });
  if (response.statusCode !== 200) throw new Error(`Ошибка ответа сервера: ${response.statusCode}, ${response.statusMessage}`);
  const result = {};
  result.timeMs = new Date() - startTime;
  result.bytes = response.bytes;
  return result;
}

let count = 0;
let allTime = 0;

setInterval(() => {
  getRequestInfo('https://medium.com/_/api/collections/c114225aeaf7/latest')
    .then((info) => {
      count += 1;
      allTime += info.timeMs;
      console.log(`Время выполнения запроса: ${info.timeMs}, bytes: ${info.bytes}, среднее время: ${Math.round(allTime / count)}`);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}, 7000);
