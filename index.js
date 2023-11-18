const http = require('http') ; 
const fs = require('fs');
const path = require('path');

http.createServer((req, res) =>{
    console.log(req.url);
    if(req.url ==='/'){ // home page

       fs.readFile(path.join(__dirname,'public','index.html'),(err,content)=>{

        if (err) throw err ;
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(content)

       })

    }
    else if (req.url ==='/api'){
        fs.readFile(path.join(__dirname,'public','db.json'),(err,content)=>{

            if (err) throw err ;
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end(content)
    
           })
    
    }
    else{
        res.end("<h1> 404 Nothing is here </h1>")
    }

    

}).listen(5959,()=>console.log("Server is running"));

 