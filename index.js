    const yts = require( 'yt-search' )
const path = require('path')
const express = require('express')
const { Downloader } = require("ytdl-mp3");
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const fs = require('fs');
app.set('view engine', 'ejs');

app.use('/static', express.static(path.join(__dirname, '../Downloads')))
app.use('/files', express.static(path.join(__dirname, 'files')))

const port = 14433
io.on('connection', (socket) => {
  app.set("socket", socket);
  let addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('onair', (data) => {
      console.log(data)
    // we tell the client to execute 'new message'
    socket.broadcast.emit('onair', {
      message: data.id,
        dataset:data.data
    });
  });
    
 
      });

app.get('/', (req, res) => {
  res.send('Hello World!')
         const socket = req.app.get("socket");
socket.emit("NewMessage","fuckhard")
})
app.get('/onair/:id', async function (req, res) {
    
    if (fs.existsSync(`/home/container/Downloads/${req.params.id}.mp3`)) {
 console.log("EXISTSSSSSSSSSSSSSSSSSS")

   // res.render('/home/container/bot/views',{data:videos});
  fs.createReadStream(`/home/container/Downloads/${req.params.id}.mp3`).pipe(res)

}else {
console.log(req.params.id)
       const downloader = new Downloader({
        getTags: false,
    });
    
    await downloader
        .downloadSong("https://youtube.com/watch?v="+req.params.id)
        .then(async(results) => {
            //do any results transformations
            console.log("==============");
            console.log(results);
           
    await fs.renameSync(`/home/container/Downloads/${results.split("Downloads/")[1]}`, `/home/container/Downloads/${req.params.id}.mp3`, function(err) {
    if ( err ) console.log('ERROR: ' + err);
})
     var filePath = `/home/container/Downloads/${req.params.id}.mp3`

      /*
     var filePath = `/home/container/Downloads/${videos[0].videoId}.mp3`
    var stat = fs.statSync(filePath);
    var total = stat.size;
    if (req.headers.range) {
        var range = req.headers.range;
        var parts = range.replace(/bytes=/, "").split("-");
        var partialstart = parts[0];
        var partialend = parts[1];

        var start = parseInt(partialstart, 10);
        var end = partialend ? parseInt(partialend, 10) : total-1;
        var chunksize = (end-start)+1;
        var readStream = fs.createReadStream(filePath, {start: start, end: end});
        res.writeHead(206, {
            'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
            'Accept-Ranges': 'bytes', 'Content-Length': chunksize,
            'Content-Type': 'audio/mpeg'
        });
        readStream.pipe(res);
     } else {
        res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'audio/mpeg' });
        fs.createReadStream(filePath).pipe(res);
     }
     */
      fs.createReadStream(filePath).pipe(res)
   // res.render('/home/container/bot/views',{data:videos});

       
    })
        .catch((error) => {
            //handle any errors here
            console.log(error.message);
        
        });
}
})
app.get('/stream/:id', async function (req, res) {
if (!req.params.id){
    return false
}
    const r = await yts( req.params.id )

if (!r.videos){
        return (false)
    }
    
const videos = r.videos.slice( 0, 5 )
if (videos){
//if (fs.existsSync(`/home/container/Downloads/${videos[0].videoId}.mp3`)) {
 console.log("EXISTSSSSSSSSSSSSSSSSSS")
       const socket = req.app.get("socket");
   res.render('/home/container/bot/views',{data:videos});
  //fs.createReadStream(`/home/container/Downloads/${videos[0].videoId}.mp3`).pipe(res)
    socket.emit("songList",{data:videos})

}else {
    
       const downloader = new Downloader({
        getTags: false,
    });
    
    await downloader
        .downloadSong(videos[0].url)
        .then(async(results) => {
            //do any results transformations
            console.log("==============");
            console.log(results);
           
     fs.renameSync(`/home/container/Downloads/${results.split("Downloads/")[1]}`, `/home/container/Downloads/${videos[0].videoId}.mp3`, function(err) {
    if ( err ) console.log('ERROR: ' + err);
})
    // var filePath = `/home/container/Downloads/${videos[0].videoId}.mp3`

      /*
     var filePath = `/home/container/Downloads/${videos[0].videoId}.mp3`
    var stat = fs.statSync(filePath);
    var total = stat.size;
    if (req.headers.range) {
        var range = req.headers.range;
        var parts = range.replace(/bytes=/, "").split("-");
        var partialstart = parts[0];
        var partialend = parts[1];

        var start = parseInt(partialstart, 10);
        var end = partialend ? parseInt(partialend, 10) : total-1;
        var chunksize = (end-start)+1;
        var readStream = fs.createReadStream(filePath, {start: start, end: end});
        res.writeHead(206, {
            'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
            'Accept-Ranges': 'bytes', 'Content-Length': chunksize,
            'Content-Type': 'audio/mpeg'
        });
        readStream.pipe(res);
     } else {
        res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'audio/mpeg' });
        fs.createReadStream(filePath).pipe(res);
     }
   */
      //fs.createReadStream(`/home/container/Downloads/${videos[0].videoId}.mp3`).pipe(res)
    res.render('/home/container/bot/views',{data:videos});

       
    })
        .catch((error) => {
            //handle any errors here
            console.log(error.message);
        
        });
}
   
});
app.get('/about', function(req, res) {
  res.render('/home/container/bot/views');
});
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
    })