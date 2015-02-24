var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}},
	Sha256={};Sha256.hash=function(msg,utf8encode){utf8encode=typeof utf8encode=="undefined"?true:utf8encode;if(utf8encode)msg=Utf8.encode(msg);var K=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];var H=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225];msg+=String.fromCharCode(128);var l=msg.length/4+2;var N=Math.ceil(l/16);var M=new Array(N);for(var i=0;i<N;i++){M[i]=new Array(16);for(var j=0;j<16;j++){M[i][j]=msg.charCodeAt(i*64+j*4)<<24|msg.charCodeAt(i*64+j*4+1)<<16|msg.charCodeAt(i*64+j*4+2)<<8|msg.charCodeAt(i*64+j*4+3)}}M[N-1][14]=(msg.length-1)*8/Math.pow(2,32);M[N-1][14]=Math.floor(M[N-1][14]);M[N-1][15]=(msg.length-1)*8&4294967295;var W=new Array(64);var a,b,c,d,e,f,g,h;for(var i=0;i<N;i++){for(var t=0;t<16;t++)W[t]=M[i][t];for(var t=16;t<64;t++)W[t]=Sha256.sigma1(W[t-2])+W[t-7]+Sha256.sigma0(W[t-15])+W[t-16]&4294967295;a=H[0];b=H[1];c=H[2];d=H[3];e=H[4];f=H[5];g=H[6];h=H[7];for(var t=0;t<64;t++){var T1=h+Sha256.Sigma1(e)+Sha256.Ch(e,f,g)+K[t]+W[t];var T2=Sha256.Sigma0(a)+Sha256.Maj(a,b,c);h=g;g=f;f=e;e=d+T1&4294967295;d=c;c=b;b=a;a=T1+T2&4294967295}H[0]=H[0]+a&4294967295;H[1]=H[1]+b&4294967295;H[2]=H[2]+c&4294967295;H[3]=H[3]+d&4294967295;H[4]=H[4]+e&4294967295;H[5]=H[5]+f&4294967295;H[6]=H[6]+g&4294967295;H[7]=H[7]+h&4294967295}return Sha256.toHexStr(H[0])+Sha256.toHexStr(H[1])+Sha256.toHexStr(H[2])+Sha256.toHexStr(H[3])+Sha256.toHexStr(H[4])+Sha256.toHexStr(H[5])+Sha256.toHexStr(H[6])+Sha256.toHexStr(H[7])};Sha256.ROTR=function(n,x){return x>>>n|x<<32-n};Sha256.Sigma0=function(x){return Sha256.ROTR(2,x)^Sha256.ROTR(13,x)^Sha256.ROTR(22,x)};Sha256.Sigma1=function(x){return Sha256.ROTR(6,x)^Sha256.ROTR(11,x)^Sha256.ROTR(25,x)};Sha256.sigma0=function(x){return Sha256.ROTR(7,x)^Sha256.ROTR(18,x)^x>>>3};Sha256.sigma1=function(x){return Sha256.ROTR(17,x)^Sha256.ROTR(19,x)^x>>>10};Sha256.Ch=function(x,y,z){return x&y^~x&z};Sha256.Maj=function(x,y,z){return x&y^x&z^y&z};Sha256.toHexStr=function(n){var s="",v;for(var i=7;i>=0;i--){v=n>>>i*4&15;s+=v.toString(16)}return s};var Utf8={};Utf8.encode=function(strUni){var strUtf=strUni.replace(/[\u0080-\u07ff]/g,function(c){var cc=c.charCodeAt(0);return String.fromCharCode(192|cc>>6,128|cc&63)});strUtf=strUtf.replace(/[\u0800-\uffff]/g,function(c){var cc=c.charCodeAt(0);return String.fromCharCode(224|cc>>12,128|cc>>6&63,128|cc&63)});return strUtf};Utf8.decode=function(strUtf){var strUni=strUtf.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,function(c){var cc=(c.charCodeAt(0)&15)<<12|(c.charCodeAt(1)&63)<<6|c.charCodeAt(2)&63;return String.fromCharCode(cc)});strUni=strUni.replace(/[\u00c0-\u00df][\u0080-\u00bf]/g,function(c){var cc=(c.charCodeAt(0)&31)<<6|c.charCodeAt(1)&63;return String.fromCharCode(cc)});return strUni},
	tostr=function(e){return JSON.stringify(e);},
	loading=function(){var a=document.getElementById("loadingdots"),b=0;loadingscreen=setInterval(function(){if(a.innerHTML.length==3){a.innerHTML="";}else{a.innerHTML+=".";};b++;},250);},
	shufArr=function(a){var i,j,b;for(i=a.length-1;i>0;i--){j=Math.floor(Math.random()*(i+1));b=a[i];a[i]=a[j];a[j]=b;};return a;},
	valEmail=function(a){var b;b=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;return b.test(a);},
	player=null,
	watcherId=0,
	watcherRunning=0;

var login = function(username,password,cb){
	$.get("/json",{action: "login", data: Base64.encode(tostr({username: username, password: Sha256.hash(password)}))}, function(data){
		if(data.result.status === "ok" && /login ok/i.test(data.result.text)){
			sessionStorage["token"] = data.result.data.token;
			$("#loginform").hide();
			$("#main").show();
			$("#name").text(data.result.data.username);
			cb && cb()
		} else {
			alert("login failed!");
		}
	});
}
var changepw = function(username,password,newpassword){
	if(!sessionStorage["token"]) {__alert_login(); return}
}
var adduser = function(username,password,email,cb){
	$.get("/json",{action: "adduser", data: Base64.encode(tostr({username: username, password: Sha256.hash(password), email:valEmail(email)}))}, function(data){
		if(data.result.status === "ok" && /user added/i.test(data.result.text)){
			alert("You can log in now!")
			cb && cb()
		} else {
			alert("User adding failed, check console");
			console.warn(tostr(data))
		}
	});
}
var addvideo = function(videourl){
	if(!sessionStorage["token"]) {__alert_login(); return}
	$.get("/json",{action: "addvideo", data: Base64.encode(tostr({videourl:videourl,token:sessionStorage["token"]}))}, function(data){
		console.log(data)
	});
}

var getvideos = function(){
	if(!sessionStorage["token"]) {__alert_login(); return}
	$.get("/json",{action: "getvideos", data: Base64.encode(tostr({token:sessionStorage["token"]}))}, function(data){
		if(data.result.status === "ok"){
			$("#videolist").html("");
			if(data.result.data.videos.length === 0){
				$("#videolist").append("<li>No videos, sorry :/</li>");
			} else {
				data.result.data.videos.forEach(function(item){
					$("#videolist").append("<li><a href='https://youtube.com/watch?v=" + item.videoId + "'>https://youtube.com/watch?v=" + item.videoId + "</a> by " + item.username + "</li>");
				});
				watcher(data.result.data.videos);
			}
		}
	});
}
var delvideo = function(videoId){
	if(!sessionStorage["token"]) {__alert_login(); return}
}
var deluser = function(){
	if(!sessionStorage["token"]) {__alert_login(); return}
}
var logout = function(){
	if(!sessionStorage["token"]) {__alert_login(); return}
	$.get("/json",{action: "logout", data: Base64.encode(tostr({token:sessionStorage["token"]}))}, function(data){
		if(data.result.status === "ok" && /logged out/i.test(data.result.text)){
			delete sessionStorage["token"];
			$("#loginform").show();
			$("#main").hide();
			$("#videolist").html("");
			$("#name").text("");
		} else { //grr something failed in the server
			console.warn("didn't delete session id properly in server!!");
			delete sessionStorage["token"];
			$("#loginform").show();
			$("#main").hide();
			$("#name").text("");
		}
	});
}
var video_watched = function(videoId){
	if(!sessionStorage["token"]) return; //just damn return
	$.get("/json",{action: "videoWatched", data: Base64.encode(tostr({token:sessionStorage["token"],videoId:videoId}))}, function(data){
		if(data.result.status === "ok"){
			return
		} else {
			console.warn("hmm something failed while tried to send info about watched video");
		}
	});
	
}

var flogin = function(){
	var u = $("input[name='username']").val();
	var p = $("input[name='password']").val();
	login(u,p,function(){
		$("input[name='username']").val("");
		$("input[name='password']").val("");
	});
}
var fregister = function(){
	var u = $("input[name='nusername']").val();
	var p = $("input[name='npassword']").val();
	var p2 = $("input[name='npassword2']").val();
	if(p === p2){
		adduser(u,p,null,function(){
			$("input[name='nusername']").val("");
			$("input[name='npassword']").val("");
			$("input[name='npassword2']").val("");
		});
	} else {
		alert("passwords must match!")
	}
}

var page_init = function(){
	console.log("Hi snooper! Nice to meet ya :)");
	console.log("I hope you find something useful here\nAlso, don't mind progressJs errors, developer was lazy and didn't expect\nthat progressbar could move fast");
	$("#main").hide();
	var progbar=new progressJs();$(document).ajaxStart(function(){progbar.start()});$(document).ajaxSend(function(){progbar.set(25)});$(document).ajaxStop(function(){progbar.set(75)});$(document).ajaxComplete(function(){progbar.end()});	
	if(sessionStorage["token"]){
		$.get("/json",{action: "checklogin", data: Base64.encode(tostr({token:sessionStorage["token"]}))}, function(data){
			if(data.result.status === "ok" && /token valid/i.test(data.result.text)){
				$("#loginform").hide()
				$("#main").show();
				$("#name").text(data.result.data.username)
				$("#overlay").hide();
			} else { // not valid
				delete sessionStorage["token"];
				$("#overlay").hide();
			}
		});
	} else {
		$("#overlay").hide();
	}
}
var __alert_login = function(){alert("You need to be logged in to do this!")}
var watcher = function(a){
	if(watcherRunning===1) clearInterval(watcherId)
	watcherRunning = 1; var i = 0; player.playlist = [];
	a.forEach(function(c){player.playlist[player.playlist.length] = c.videoId;}); // convert object to array what we can easily use
	player.playlist = shufArr(player.playlist);
	watcherId = setInterval(function(){
		console.info("Status: " + player.status.state + " VideoId: " + player.playlist[i] + " videoNum: " + i + " playlist: " + player.playlist.length);
		if(player.status.state == "NOTSTARTED"){
			player.loadAndPlayVideo({"id": player.playlist[i], endsec: 35});
		} else if(player.status.state == "LOADED"){
			player.play();
		} else if(player.status.state == "STOPPED"){
			video_watched(player.playlist[i])
			if(player.playlist.length-1 == i) {
				i=0;
			} else {
				i++;
			}
			player.loadAndPlayVideo({"id": player.playlist[i], endsec: 35});
		}
		return
	}, 500);
};
function ytplayer(a){
	this.player = a;
	this.init = function() {
		if(!window["YT"]){
			throw "Youtube player wrapper requires Google Youtube API";
		}
		if(!typeof a == "object"){
			throw "Youtube player wrapper requires first arg to be player object";
		}
		this.player.addEventListener("onStateChange", 'playerstate')
	}
	this.init();
	this.statuses = ["NOTSTARTED", "PLAYING", "PAUSED", "STOPPED", "ERROR", "LOADED"]
	this.status = {"video": {"id": ""},"state": "NOTSTARTED"};
	this.playlist = [];
	this.loadAndPlayVideo = function(a){if(typeof a == "object"){if(a.id){var ssec = a.startsec || 0;var esec = a.endsec || undefined;this.player.cueVideoById({"videoId": a.id, "startSeconds": ssec, "endSeconds": esec});this.play()} else {throw 'loadAndPlayVideo({"id":<>, ["startsec":<>], ["endsec":<>]})';}} else {throw 'loadAndPlayVideo argument should be object, {"id":<>, ["startsec":<>], ["endsec":<>]}';}}
	this.loadVideo = function(a){if(typeof a == "object"){if(a.id){var ssec = a.startsec || 0;var esec = a.endsec || undefined;this.player.cueVideoById({"videoId": a.id, "startSeconds": ssec, "endSeconds": esec});} else {throw 'loadVideo({"id":<>, ["startsec":<>], ["endsec":<>]})'}} else {throw 'loadVideo argument should be object, {"id":<>, ["startsec":<>], ["endsec":<>]}';}}
	this.play = function(){this.player.playVideo();}
	this.stop = function(){this.player.stop();}
	this.skip = function(){this.player.seekTo(this.player.getDuration())};
	this.pause = function(){this.player.pauseVideo()}
}
var playerstate = function(b){
	var a = b.target.A.playerState; // wat ?
	if(a == "0"){
		player.status.state = "STOPPED";
	} else if(a == "1"){
		player.status.state = "PLAYING";
	} else if(a == "2") {
		player.status.state = "PAUSED";
	} else if(a == "5") {
		player.status.state = "LOADED";
	}
}
function onYouTubePlayerAPIReady() {
    var ytp = new YT.Player('ytplayer', {height: '200', width: '200', events: {"onReady": onPlayerReady}, controls: 0});
    player = new ytplayer(ytp);
}
function onPlayerReady(event) {
	event.target.mute();
}

$(document).ready(page_init)
