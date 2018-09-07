const https = require('https');
const http = require('http');
const fs = require('fs');

/*
const options = {
  key: fs.readFileSync('./keys/host.key'),
  cert: fs.readFileSync('./keys/host.cert')
};

const proxy = https.createServer(options, (req, res1) => {
*/

const proxy = http.createServer((req, res1) => {

  if('POST' == req.method){
    var targetUrl = '';

    req.on('data', function (data) {
        targetUrl += data;
    });

    req.on('end', function () {
      console.log('downloading: ', targetUrl);
      
      var buf = '';  
      https.get(targetUrl, function(res2) {

        res2.on('data', function(data) {
          buf += data;
        });
        
        res2.on('end', function() {
          buf = buf.replace(/<head>(?:.|\n|\r)+?<\/head>/, '');
          buf = buf.replace(/<script>(?:.|\n|\r)+?<\/script>/, '');
          buf = buf.replace(/<(?:.|\n)*?>/gm, '');
          buf = buf.replace(/\n\s*\n/g, '\n');
          buf = buf.replace(/\s\s+/g, '\ ');

          var xml = '<?xml version="1.0" encoding="utf-8"?>';
              xml+= '<result>' +buf +'</result>';
          // 
          var fn = targetUrl.replace(/\//ig, ':'); 
              fn = fn.replace(/:/ig, ':');
              fn = './dload/' +fn;

          fs.writeFile(fn, xml, function(err) {
            if(err){
              console.log('could not write file: ' +fn);
            }
            else {
              console.log('written to: ' +fn);
            }
          });
       
          res1.writeHead(200, {'Content-Type': 'application/xml'});
          res1.end(xml);
        
          return;
        });
      });
    });  
    return;

  }

  var doc = fs.readFileSync('reader.html');
  res1.writeHead(200, {'Content-Type': 'text/html'});
  res1.end(doc);

});

proxy.listen(8000);
