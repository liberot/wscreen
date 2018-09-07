const https = require('https');
const http = require('http');
const fs = require('fs');

const options = {
	key: fs.readFileSync('./keys/host.key'),
	cert: fs.readFileSync('./keys/host.cert')
};

const proxy = https.createServer(options, (req, res) => {
	var doc = fs.readFileSync('reader.html');
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end(doc);
});

proxy.listen(8001);
