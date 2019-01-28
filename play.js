// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var child_process = require("child_process");
var path = require("path");

var ipcRenderer = require('electron').ipcRenderer;
var tvbus = require("electron").remote.getGlobal("tvbus");

// events listeners
ipcRenderer.on("tvbus-init", function(event, args){
    console.log("[Render] tvbus-init:", args)
    document.getElementById('info').innerHTML = "Ready ...";
})

ipcRenderer.on("tvbus-start", function(event, args){
    console.log("[Render] tvbus-start:", args)
})

ipcRenderer.on("tvbus-prepared", function(event, url){
    loadStream(url);
})

ipcRenderer.on("tvbus-stats", function(event, stats){
	console.log("[Render] tvbus-stats:", stats)
	
	/*	
    var buffer = stats.split(" ")[0]
	if(buffer == 100){
		buffer = ''
	}
	*/
	
	var dlrate = parseInt(stats.split(" ")[1] / 1000) + " Kb/s"
	document.getElementById('info').innerHTML = dlrate;
})

ipcRenderer.on("tvbus-stop", function(event, code){
    document.getElementById('info').innerHTML = code;
})


// web page actions
document.getElementById('channeltest').onclick = function() {
	var channelvalue = document.getElementById('channelvalue').value
	if(channelvalue == ''){
		document.getElementById('info').innerHTML = 'no tvbus';
	}else{
		document.getElementById('info').innerHTML = 'startChannel';

		stopChannel()
        tvbus.startChannel(channelvalue)
	}
}

document.getElementById('channel1').onclick = function() {
    stopChannel()
    tvbus.startChannel("tvbus://12e2K3E6si8bTVT9k3HoSAy2os7sAsUrxwqTRCxMFBJWVifNmpr")
}

document.getElementById('channel2').onclick = function() {
    stopChannel()
    tvbus.startChannel("tvbus://1jU3Y7jex4jJWSB6jD9dZqUw3gyhLdiLHDaVE43CXtGuxxLSjY")
}

// access code channel
// document.getElementById('4').onclick = function() {
//     stopChannel()
//     tvbus.startChannel("tvbus://1vXH1gDoDaNBoC1Fs9UX8BrREtbdm18kgmjBcbZvQqTedNZtGXzyXZDxSjSgF", "1234")
// }


var Clappr = require("clappr")
var player = null;

// play the stream
function loadStream(url) {
    player = new Clappr.Player({
        source: url, 
        parentId: "#player",
        width: 815,
        height: 460,
        autoPlay: true,
    });
}

// 
var stopChannel = function() {
    if(player != null) {
        player.stop()
        player.destroy()
    }
    player = null;
}