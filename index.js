global.bases = require("./json/bases.json")
global.bullets = require("./json/bullets.json")
global.fs=require("fs")
global.fetch=require("node-fetch")
global.express = require("express")
global.fps = 30;
global.discordUser=require("./json/discord.json")
let httpsConfig={
  key: fs.readFileSync('./cert/privkey1.pem'),
 cert: fs.readFileSync('./cert/cert1.crt')
};

global.app = express()
app.use(express.json())
app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","*")
  res.header("Access-Control-Allow-Methods","*")
res.header("Access-Control-Allow-Headers","*")
  next()
})
app.get("/login",(req,res)=>{

  res.redirect(discordUser.link.replace("$host",encodeURIComponent(req.get("host"))))
})

app.get("/auth",async (req,res)=>{
  let code=req.query.code;
  if(!code){return res.redirect("/")}

let body=formUrlencode({
    "client_id":discordUser.id,
    "client_secret":discordUser.secret,
    "grant_type":"authorization_code",
    "code":code,
    "redirect_uri":`https://${req.get("host")}/auth`,
    "scope":"identify"
  })
    let token=await fetch("https://discord.com/api/oauth2/token",{
      method:"POST",
      headers:{
        "Content-Type":"application/x-www-form-urlencoded"
      },
      body:body
    })
    console.log(await token.text());
})
  app.use(express.static(__dirname + "/static"))
  app.post("/start_deploy",async (req,res)=>{
    console.log(req.body);
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
