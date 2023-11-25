const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8112;


http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    console.log(req.url);
    
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } else if (req.url === '/api') {
        fs.readFile(path.join(__dirname, 'public', 'db.json'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(content);
        });
    } else {
        res.end("<h1>404 Nothing is here</h1>");
    }
}).listen(PORT, () => console.log(`Server is running on port ${PORT}`));
