const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');


const mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css",
};
http.createServer((req, res) => {
    const uri = url.parse(req.url).pathname;
    const filename = path.join(process.cwd(), unescape(uri));
    console.log(`Loading ${uri}`);
    let stats;

    try {
        stats = fs.lstatSync(filename);
    }catch (e) {
        res.writeHead(404, { 'Content-Type': 'text/plain'});
        res.write('404 Not Found\n');
        res.end();
        return;
    }
    if(stats.isFile()){
        let mimeType = mimeTypes[path.extname(filename).split(".").reverse()[0]];
        res.writeHead(200, { 'Content-Type': mimeType });

        const fileStream = fs.createReadStream(filename);
        fileStream.pipe(res);
    } else if(stats.isDirectory()){
        res.writeHead(302, {
            'Location': 'index.html'
        });
        res.end();
    }else {
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });
        res.write('500 internal Error\n');
        res.end();
    }
}).listen(3001);


