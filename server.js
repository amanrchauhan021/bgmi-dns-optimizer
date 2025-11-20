const dns = require('dns2');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// BGMI Optimized DNS Mappings
const bgmiServers = {
  'pubgmobile.com': '149.154.175.50',
  'www.pubgmobile.com': '149.154.175.50', 
  'bgmi.com': '149.154.175.50',
  'game.pubgmobile.com': '149.154.167.91',
  'sgp.pubgmobile.com': '149.154.175.50',
  'ind.pubgmobile.com': '149.154.167.91',
  'akamaitechnologies.com': '23.67.230.166'
};

const dnsServer = dns.createServer({
  udp: true,
  handle: (request, sendResponse) => {
    const response = dns.Packet.createResponseFromRequest(request);
    const [question] = request.questions;
    const { name } = question;

    if (bgmiServers[name]) {
      response.answers.push({
        name,
        type: dns.Packet.TYPE.A,
        class: dns.Packet.CLASS.IN,
        ttl: 300,
        address: bgmiServers[name]
      });
    }

    sendResponse(response);
  }
});

dnsServer.listen({
  udp: 53,
  tcp: 53
}).then(() => {
  console.log('BGMI DNS Server running on port 53');
});

app.get('/', (req, res) => {
  res.send('BGMI DNS Server is Running!');
});

app.listen(port, () => {
  console.log(`Web server running on port ${port}`);
});
