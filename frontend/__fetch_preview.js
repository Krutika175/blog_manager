const http = require('http');
const options = { hostname: '127.0.0.1', port: 4173, path: '/', method: 'GET' };
const req = http.request(options, (res) => {
  console.log('STATUS', res.statusCode);
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('LENGTH', data.length);
    console.log(data.slice(0, 400));
  });
});
req.on('error', (err) => console.error('ERROR', err));
req.end();
