express = require "express"
fs = require "fs"
MongoClient = require("mongodb").MongoClient
uuid = require "node-uuid"
sha256 = require "sha256"
ejs = require "ejs"
http = require "http"
url = require "url"
ip = process.env.OPENSHIFT_NODEJS_IP
port = process.env.OPENSHIFT_NODEJS_PORT or 8080
app = express()
server = http.createServer(app)
b64d = (a) ->
  new Buffer(a, 'base64').toString "ascii"
b64e = (a) ->
  new Buffer(a).toString "base64"
isEmpty = (a) ->
  if typeof a is "object" and not a
    true
  else if typeof a is "object"
    Object.keys(a).length is 0
  else a.length is 0  if typeof a is "string"

# Config 
mongodb_addr = "mongodb://127.0.0.1/y2views"
# Config  END 
app.use "/*", (req, res, next) ->
  res.header "Cache-Control", "private, no-cache, no-store, must-revalidate"
  res.header "Expires", "-1"
  res.header "Pragma", "no-cache"
  res.header "X-Frame-Options", "DENY"
  next()
  return

app.get "/favicon.ico", (req, res) ->
  res.setHeader "Content-Type", "image/x-icon"
  require("fs").readFile "./favicon.ico", (err, data) ->
    res.send data
    return

  return


# OpenShift shit what i need 
if typeof ip is "undefined"
  console.warn "No OPENSHIFT_NODEJS_IP var, using 127.0.0.1"
  ip = "127.0.0.1"
  ws_addr = "127.0.0.1"
terminator = (sig) ->
  if typeof sig is "string"
    console.log "%s: Received %s - terminating app ...", Date(Date.now()), sig
    process.exit 1
  console.log "%s: Node server stopped.", Date(Date.now())
  return

setupTerminationHandlers = ->
  process.on "exit", ->
    terminator()
    return

  [
    "SIGHUP"
    "SIGINT"
    "SIGQUIT"
    "SIGILL"
    "SIGTRAP"
    "SIGABRT"
    "SIGBUS"
    "SIGFPE"
    "SIGUSR1"
    "SIGSEGV"
    "SIGUSR2"
    "SIGTERM"
  ].forEach (element, index, array) ->
    process.on element, ->
      terminator element
      return

    return

  return

app.set "views", __dirname + "/views"
app.use "/static", express.static(__dirname + "/static")
app.engine "html", ejs.renderFile
app.get "/", (req, res) ->
  res.render "new_main.html"
  return


app.get "/json", (req, res) ->
  query = req.query;
  action = query["action"];
  data = query["data"];
  if not data or not action
    res.send {result: {status: "error", text: "DO NOT FUCKING SNOOP AROUND!!!"}}
    return
  try
    data = JSON.parse(b64d(data));
  catch e
    console.log "base64 decode error, data: #{data}"
    res.send {result: {status: "error", text: "Base64 decode error"}}
    return
  if data && action
#    console.log "#{data} #{action}"
    switch action
      when "login"
        username = data.username
        password = data.password
        MongoClient.connect mongodb_addr, (err,db) ->
          users = db.collection "users"
          sessions = db.collection "sessions"
          console.log "searching for user #{username}"
          users.findOne
            username: username
          , (err,data) ->
            console.log "found #{JSON.stringify data} for user #{username}"
            unless isEmpty(data) is true
              if sha256(password + data.password_salt) is data.password
                token = uuid.v4()
                sessions.insert
                  username: username
                  token: token
                , (err,data) ->
                  console.log "added new user session for user #{username} with id #{token}"
                  res.send
                    result:
                      status: "ok"
                      text: "login ok"
                      data:
                        username: username
                        token: token
              else
                res.send
                  result:
                    status: "error"
                    text: "invalid username or password"
                    data: null
            else
              res.send
                result:
                  status: "error"
                  text: "invalid username or password"
                  data: null
      when "checklogin"
        token = data.token
        MongoClient.connect mongodb_addr, (err,db) ->
          sessions = db.collection "sessions"
          console.log "searching for token #{token}"
          sessions.findOne
            token: token
          , (err,data) ->
            unless isEmpty(data) is true
              console.log "found #{JSON.stringify data} for token #{token}"
              console.log "restoring session for user #{data.username}"
              res.send
                result:
                  status: "ok"
                  text: "token valid"
                  data:
                    username: data.username
              return
            else
              console.log "token #{token} was invalid"
              res.send
                result:
                  status: "error"
                  text: "invalid token"
                  data: null
              return

      when "logout"
        token = data.token
        MongoClient.connect mongodb_addr, (err,db) ->
          sessions = db.collection "sessions"
          console.log "searching for token #{token}"
          sessions.findOne
            token: token
          , (err,data) ->
            unless isEmpty(data) is true
              console.log "found #{JSON.stringify data} for token #{token}"
              console.log "killing session for user #{data.username}"
              sessions.remove data, (err,data) ->
                res.send
                  result:
                    status: "ok"
                    text: "logged out"
                    data: null
              return
            else
              console.log "token #{token} was invalid"
              res.send
                result:
                  status: "error"
                  text: "invalid token"
                  data: null
              return

      when "getvideos"
        token = data.token
        MongoClient.connect mongodb_addr, (err,db) ->
          sessions = db.collection "sessions"
          videos = db.collection "videos"
          console.log "searching for token #{token}"
          sessions.findOne
            token: token
          , (err,data) ->
            unless isEmpty(data) is true
              console.log "found #{JSON.stringify data} for token #{token}"
              user = data.username
              videos.find().toArray (err,data) ->
                console.log "sending video list to user #{user}"
                res.send
                  result:
                    status: "ok"
                    text: null
                    data:
                      videos: data
                return
            else
              console.log "token #{token} was invalid"
              res.send
                result:
                  status: "error"
                  text: "invalid token"
                  data: null
              return
        
      when "adduser"
        username = data.username
        userid = uuid.v4()
#        email = data.email
        passwordSalt = uuid.v4()
        password = sha256(data.password + passwordSalt)
        MongoClient.connect mongodb_addr, (err,db) ->
          users = db.collection "users"
          console.log "searching for existing user #{username}"
          users.findOne
            username: username
          , (err,data) ->
            if isEmpty(data) is true
              console.log "username #{username} was not found, adding"
              users.insert
                id: userid
                username: username
#                email: email
                password: password
                password_salt: passwordSalt
              , (err,data) ->
                console.log "Yay we have new user! welcome #{username}"
                res.send
                  result:
                    status: "ok"
                    text: "user added"
                    data: null
                return
            else
              console.log "user #{username} was found, not adding new user with such name"
              res.send
                result:
                  status: "error"
                  text: "user already exists"
                  data: null
              return

          
      when "addvideo"
        token = data.token
        uparsed = url.parse data.videourl, 1
        hostregex = new RegExp "^(http|https):"
        if uparsed.host is "youtube.com" or uparsed.host is "www.youtube.com"
          if hostregex.test(uparsed.protocol) and uparsed.query.v
            videoid = uparsed.query.v
            MongoClient.connect mongodb_addr, (err,db) ->
              sessions = db.collection "sessions"
              videos = db.collection "videos"
              console.log "searching for token #{token}"
              sessions.findOne
                token: token
              , (err,data) ->
                unless isEmpty(data) is true
                  console.log "found #{JSON.stringify data} for token #{token}"
                  user = data.username
                  videos.findOne
                    videoId: videoid
                  , (err,data) ->
                    if isEmpty(data) is true
                      console.log "adding user #{user} video #{videoid} to database"
                      videos.insert
                        id: uuid.v4()
                        username: user
                        videoId: videoid
                      , (err,data) ->
                        res.send
                          result:
                            status: "ok"
                            text: "video added"
                            data: null
                        return
                    else
                      console.log "not adding user #{user} video to database, because video #{videoid} already exists (owned by #{user})"
                      if data.username is user
                        res.send
                          result:
                            status: "error"
                            text: "you already added that video"
                            data: null
                      else
                        res.send
                          result:
                            status: "error"
                            text: "video already exists"
                            data:
                              whoOwns: data.username
                      return
                else
                  console.log "token #{token} was invalid"
                  res.send
                    result:
                      status: "error"
                      text: "invalid token"
                      data: null
                  return
          else
            res.send
              result:
                status: "error"
                text: "invalid youtube address"
                data: null
            return
        else
          res.send
            result:
              status: "error"
              text: "we only support youtube addresses"
              data: null
          return

      when "delvideo"
        res.send "disabled"

      when "videoWatched"
#        token = data.token
#        vidId = data.videoId
#        MongoClient.connect mongodb_addr, (err,db) ->
#          sessions = db.collection "sessions"
#          users = db.collection "users"
#          videos = db.collection "videos"
#          console.log "searching for token #{token}"
#          sessions.findOne
#            token: token
#          , (err,data) ->
#            unless isEmpty(data) is true
#              console.log "found #{JSON.stringify data} for token #{token}"
#              user = data.username
#              users.findOne
#                username: user
#              , (err,data) ->
#              videos.findOne
#                videoId: vidId
#              , (err,data) ->
#            else
#              console.log "token #{token} was invalid"
#              res.send
#                result:
#                  status: "error"
#                  text: "invalid token"
#                  data: null
#              return
        res.send
          result:
            status: "ok"
            text: null
            data: null

  else
    res.send
      result:
        status: "error"
        text: "No action specified"
        data: null

# Main 
server.listen port, ip, ->
  console.log "App is up and running"
