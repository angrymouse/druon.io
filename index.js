global.bases = require("./json/bases.json")
global.bullets = require("./json/bullets.json")
global.fs = require("fs")
global.debug=fs.existsSync("./debug.txt")
global.fetch = require("node-fetch")
global.express = require("express")
let secretKey = "dfgdsjl8478fYYIU8fopE87idsfdsJ9d813qqppMm4"
global.fps = 30;
global.discordUser = require("./json/discord.json")
let httpsConfig = {
  key: fs.readFileSync('./cert/privkey1.pem'),
  cert: fs.readFileSync('./cert/cert1.crt')
};
let {
  User
} = require("./js/classes.js")
global.app = express()
app.use(express.json())
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
})
app.get("/login", (req, res) => {

  res.redirect(discordUser.link.replace("$host", encodeURIComponent(req.get("host"))))
})

app.get("/auth", async (req, res) => {
  let code = req.query.code;
  if (!code) {
    return res.redirect("/")
  }

  let body = formUrlencode({
    "client_id": discordUser.id,
    "client_secret": discordUser.secret,
    "grant_type": "authorization_code",
    "code": code,
    "redirect_uri": `https://${req.get("host")}/auth`,
    "scope": "identify"
  })
  let token = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: body
  })
  token = await token.json()
  if (token.error) {
    return res.redirect("/")
  }
  res.send(fs.readFileSync(__dirname + "/static/setStorage.html", "utf8")
    .replace("$val", JSON.stringify({token:token.token_type+" "+token.access_token}))
  )
})

app.use(express.static(__dirname + "/static"))
app.post("/start_deploy/" + secretKey, async (req, res) => {

  res.send("Starting deploy...")
  let cp = require("child_process")
  cp.execSync("git pull origin master")
  cp.execSync("npm i")
  cp.execSync("pm2 reload druon.io &")
  process.exit()
})
app.get("/api/profile/:token",async (req,res)=>{
  let user=new User(req.params.token)
  let platformUser=await user.fetchUser()
  if(!platformUser){return res.json({error:true})}
  let userProfile=await user.fetchProfile()

  return res.json({...platformUser,...userProfile})
})
global.https = require('https').createServer(httpsConfig, app);
global.http = require('http').createServer(app);
let mongoClient=require("mongodb").MongoClient("mongodb://root:HippothebestDB@"+(debug?"192.168.0.6:27017":"kh1.bravery.fun:2023")+"/admin",{ useNewUrlParser: true,useUnifiedTopology:true })
mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    global.db=client.db("druon")
    http.listen(3000, () => {});
    https.listen(process.env.PORT || 8080, () => {});
});

require("./js/functions.js");
require("./js/game.js")()
console.log("God code: " + godcode);
