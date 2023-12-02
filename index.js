const http = require('http');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const PORT = process.env.PORT || 8112;

const uri = 'mongodb+srv://iftiaz:iftiazalfi@cluster0.svmgu1a.mongodb.net/weatherForecast';
const client = new MongoClient(uri);

async function findCurrentWeather(client) {
    try {
        const cursor = client.db('weatherForecast').collection('currentWeather').find({});
        const results = await cursor.toArray();
        const js = JSON.stringify(results);
        return js;
    } catch (error) {
        console.error('Error finding current weather:', error);
        throw error;
    }
}

async function threeHourForecast(client) {
    try {
        const cursor = client.db('weatherForecast').collection('threeHourForecast').find({});
        const results = await cursor.toArray();
        const js = JSON.stringify(results);
        return js;
    } catch (error) {
        console.error('Error finding three hour forecast:', error);
        throw error;
    }
}

async function main() {
    try {
        await client.connect();
        console.log('Connected to MongoDB!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

main();

http.createServer(async (req, res) => {
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
    } else if (req.url === '/style.css') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        fs.createReadStream(__dirname + "/public/style.css", "utf8").pipe(res);
    } else if (req.url.startsWith('/images/')) {
        const imageName = req.url.substring(8); 
        const imagePath = path.join(__dirname, 'public', 'images', imageName);
        
        fs.readFile(imagePath, (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
            } else {
                // Determine the appropriate content type based on the file extension
                const ext = path.extname(imagePath).toLowerCase();
                const contentType = {
                    '.jpg': 'image/jpeg',
                    '.jpeg': 'image/jpeg',
                    '.png': 'image/png',
                }[ext] || 'application/octet-stream';

                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });
    } else if (req.url === '/api/currentWeather') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const content = await findCurrentWeather(client);
        res.end(content);
    } else if (req.url === '/api/threeHourForecast') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const content = await threeHourForecast(client);
        res.end(content);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Nothing is here</h1>');
    }
}).listen(PORT, () => console.log(`Server is running on port ${PORT}`));
