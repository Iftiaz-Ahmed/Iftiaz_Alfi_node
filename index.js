const http = require('http');

http.createServer((req, res) => {

    res.end("Hello World");

}).listen(5959, () => console.log("Server is running"))