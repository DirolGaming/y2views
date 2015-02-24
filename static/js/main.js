var primus,
    player,
    loadingscreen,
    user,
    playerd,
    purl = window.location.href + "json",
    testvideos = [{"videoId": "BniV6jyIDPQ"}, {"videoId": "2WbhWwiH53A"}, {"videoId": "VWPFY5-v6ag"}, {"videoId": "tFOmzhIDvMs"}];


//if(!(Cookies.enabled)) window.location.href="/enable-cookies";

var tabs={init: function(){
		var g=window.location.hash.substring(1);
		if(g!=""){
			$('#maintabs li a[href="#'+g+'"]').tab("show");
		};
		$(".nav li a").click(function(e){
			e.preventDefault();
			$(this).tab("show");
			window.location.hash=this.hash;
		});
		if(localStorage["1mg00dhex0r"]=="true"){
			$("#maintabs").append('<li><a href="javascript:void(0)" data-toggle="tab2" onClick="$(\'#devmodal\').modal()">Dev menu</a></li>');
		}
	},
	switch: function(a){
		if(a){
			$('#maintabs li a[href="#'+a+'"]').tab("show");
			window.location.hash="#" + a;
		}
	}
};


var ubuntu = {
	yes: function(){
		$(document.body).attr("style", "font-family:'Ubuntu',sans-serif;")
		localStorage["ilikeubuntu"]=true;
	},
	no: function() {
		$(document.body).attr("style", "font-family:'Josefin Sans',sans-serif;")
		localStorage["ilikeubuntu"]=false;
	},
	check: function(){
		if(localStorage["ilikeubuntu"]=="true"){
			$(document.body).attr("style", "font-family:'Ubuntu',sans-serif;")
		} else {
			$(document.body).attr("style", "font-family:'Josefin Sans',sans-serif;")
		}
	}
}
function onYouTubePlayerAPIReady() {
    var ytp = new YT.Player('ytplayer', {height: '200', width: '200', events: {"onReady": onPlayerReady}, controls: 0});
    player = new ytplayer(ytp);
}
function onPlayerReady(event) {
    event.target.mute();
}

var forms = {
	login: function(a,b){
		User.login(a,b,function(data){
			console.log(data)
			var userbtn=$('#logged-in-tab-button').children()[0];
			$('#login-tab-button').hide(100);
			$(userbtn).text(a);
			$('#logged-in-tab-button').show(100);
			tabs.switch('logged-in');
//			message.error("Login failed");
		});
	},
	logout: function(a){
	}
};
var User = {
    login: function(a,b,c) {
        if(!(a) || !(b) || !(c)) return false;
        $.get(purl, {action: "login", data: {user: a, pw: Sha256.hash(b)}}, c);
    },
    logout: function(a,b) {
        if(!(a) || !(b)) return false;
        $.get(purl, {"action": "logout"}, b);
    },
    chkl: function(a,b) {
        if(!(a) || !(b)) return false;
        $.get(purl, {"action": "chkl"}, b);
    },
    addu: function(a,b,c,d) {
        if(!(a) || !(b) || !(c) || !(d)) return false;
        if(!(valEmail(c))) { message.error('Email "' + c + '" was invalid, please try again!'); return false};
        $.get(purl, {"action": "addu", "data": {"username": a, "password": Sha256.hash(b), "email": c}}, d);
    },
    delu: function(a,b){
        if(!(a) || !(b)) return false;
        $.get(purl, {"action": "delu", "data": {"username": a}}, b);
    },
    cpw: function(a,b,c,d){
        if(!(a) || !(b) || !(c) || !(d)) return false;
	if(!(b == c)) return false;
        $.get(purl, {"action": "cpw", "data": {"username": a, "password": Sha256.hash(b)}}, d);
    },
    addv: function(a,b){
        if(!(a) || !(b)) return false;
        $.get(purl, {"action": "addv", "data": {"video_url": a}}, b);
    },
    delv: function(a,b){
        if(!(a) || !(b)) return false;
        $.get(purl, {"action": "delv", "data": {"video_id": a}}, b);
    }
}
var message = {
    _template: function(a,b){var c=document.createElement("div"),d=document.createElement("span"),e=document.createElement("a");c.className="alert " + a;$(c).attr("role", "alert");d.innerHTML=b;$(e).attr("onClick", "message.close(this)");e.className="pull-right";e.innerHTML="&times;";e.href="javascript:void(0)";$(c).append(d);$(c).append(e);return c;},
    success: function(a){$("#messages").append(this._template("alert-success", a));},
    error: function(a){$("#messages").append(this._template("alert-danger", a));},
    info: function(a){$("#messages").append(this._template("alert-info", a));},
    close: function(a){var b=a.parentNode;b.parentNode.removeChild(b);}
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


var watcher = function(a){
	var i = 0, playlist = [];
	a.forEach(function(c){playlist[playlist.length] = c.videoId;}); // convert object to array what we can easily use
	playlist = shufArr(playlist);
	playerd = setInterval(function(){
		if(player.status.state == "NOTSTARTED"){
			player.loadAndPlayVideo({"id": playlist[i], endsec: 35});
		} else if(player.status.state == "STOPPED"){
			i++;
			player.loadAndPlayVideo({"id": playlist[i], endsec: 35});
		} else if(player.status.state == "LOADED"){
			player.play();
		} else if(playlist.length-1 == i) {
			i = 0;
		}
	}, 500);
};

/*
    a.forEach(function(c){b[b.length] = c.videoId;});
    b = shufArr(b);
    watcher_data.video.id = b[0];
    player.cueVideoById({'videoId': watcher_data.video.id, "endSeconds": 65});
*/


$(document).ready(function(){
    loading();
    tabs.init();
    ubuntu.check();
    clearInterval(loadingscreen), $("#overlay").hide();
});
