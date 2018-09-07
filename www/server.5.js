const https = require('https');
const http = require('http');
const fs = require('fs');

const options = {
	key: fs.readFileSync('./keys/host.key'),
	cert: fs.readFileSync('./keys/host.cert')
};

const proxy = https.createServer(options);



proxy.listen(8001);