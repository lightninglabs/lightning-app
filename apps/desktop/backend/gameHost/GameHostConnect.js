const ioClient = require('socket.io-client');
var ip = require("ip");
var publicIp = require("public-ip");
var hostServer = require('./server');
var axios = require('axios');
var ngrok = require('../../../../ngrok/index.js');

const host_socket = ioClient("https://secure-depths-49472.herokuapp.com/");
let hosting = false;
let serverUrl;
let ngrokInstance;



function disconnect() {
  hosting = false;
  ngrok.kill();
  hostServer.closeServer();
}

async function connect(gameName) {
  hosting = true;
  let external_ip = await publicIp.v4();
  let game = hostServer.startServer();
  ngrok.kill();
  ngrok.connect(9090, function (err, url) {
    console.log(err);
    host_socket.emit('HOST_CONNECT', {
      internal_ip: ip.address(),
      game_name: gameName,
      external_ip: external_ip,
      game_socket_ip: url,
      activePlayers: game.gameState.players.length,
    })
  });
}


// On connection
host_socket.on('Connected', () =>{
  console.log("here");
})

// When the host is added to the db
host_socket.on('RECORDED', () => {
  console.log("Was recorded");
})

// When the host reconnects and their status is updated
host_socket.on('WELCOME_BACK', () => {
  console.log("Welcome back!");
})

// On error
host_socket.on('ERROR', (err) => {
  console.log("Error", err);
})

// Response to PING, lets central server know host is active
host_socket.on('PING', (data) => {
  if(hosting) {
    host_socket.emit('PONG', {active_players: 0})
  }
})

module.exports = {
  connect,
  disconnect
}
