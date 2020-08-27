global.bases = require("./json/bases.json")
global.bullets = require("./json/bullets.json")
global.fs=require("fs")
global.express = require("express")
global.fps = 30;
let httpsConfig={
  key: fs.readFileSync('./cert/privkey1.pem'),
 cert: fs.readFileSync('./cert/cert1.crt')
};

global.app = express()
app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","*")
  res.header("Access-Control-Allow-Methods","*")
  next()
})

  app.use(express.static(__dirname + "/static"))
  app.post("/start_deploy",async (req,res)=>{
    res.send("Starting deploy...")
    let cp=require("child_process")
    cp.execSync("git pull origin master")
    cp.execSync("npm i")
    cp.execSync("pm2 reload druon.io &")
    process.exit()
  })
global.https = require('https').createServer(httpsConfig,app);
global.http = require('http').createServer(app);
http.listen(3000,()=>{});
https.listen(process.env.PORT||8080,()=>{});
require("./js/functions.js");
require("./js/game.js")()
console.log("God code: "+godcode);
