var socket;
var player;
var dotdotdot;
var failures;
var watcher_data = {"running": 0, "stop": 0, "skip": 0}, cur_video = {"num": -1, "id": ""};
function tostr(e) {
	return JSON.stringify(e);
}
function onYouTubePlayerAPIReady() {
	player = new YT.Player('ytplayer', {
		height: '200',
		width: '200',
		events: {"onReady": onPlayerReady}
	});
}
function onPlayerReady(event) {
	event.target.mute();
}
function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}
function watcher(videos) {
	var vids = [];
	videos.forEach(function(item, id){
		vids[vids.length] = item.videoId;
	});
	vids = shuffleArray(vids);
	var watch = setInterval(function(){
		try {
			var p_state = player.getPlayerState();
		} catch(e) {
			alert("Youtube player error! Send this to Admin: " + tostr(e));
			failures++;
		}
		if(failures > 3){
			clearInterval(watch);
		};
		console.log("Current video item in array: %s, Player state: %s, Current video id: %s, last video: %s, Stop trigger: %s, Skip trigger: %s", cur_video.num, p_state, cur_video.id, vids[vids.length-1], watcher_data.stop, watcher_data.skip)
		if(p_state == 0){
			if (vids.length-1 == cur_video.num) {
				console.log("You saw last video! Starting over");
				cur_video.id = "";
				cur_video.num = -1;
				vids = shuffleArray(vids);
			} else {
				cur_video.num++;
				cur_video.id = vids[cur_video.num];
				player.loadVideoById({'videoId': cur_video.id, "endSeconds": 65});
			};
		} else if(p_state == 5){
			cur_video.num = 0;
			cur_video.id = vids[cur_video.num];
			player.loadVideoById({'videoId': cur_video.id, "endSeconds": 65});
		} else if(p_state == -1){
			player.playVideo();
		}
		if(watcher_data.skip == 1){
			player.seekTo(player.getDuration());
			watcher_data.skip = 0;
		} else if(watcher_data.stop == 1) {
			player.stopVideo();
			player.clearVideo();
			watcher_data.stop = 0;
			watcher_data.running = 0;
			clearInterval(watch);
		} else {
			watcher_data.running = 1;
		}
	}, 1000); /* This thing eats lots of resources, needs fix */
}
function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

function adduser(user,pw,email) {
	if(!(user) || !(pw) || !(validateEmail(email))) return false;
	var reg = $.post("/register", {"username": user, "password": Sha256.hash(pw), "email": email});
	reg.done(function(data){
		console.log(data);
	});
	return false;
}
function addvideo(url) {
	if(!(url)) return false;
	socket.emit("client-event", {"action": "addvideo", "content": {"url": url}});
}
function rmvideo(video_id) {
	if(!(video_id)) return false;
	socket.emit("client-event", {"action": "rmvideo", "content": {"id": video_id}});
}
function loading_close () {
        if(!(Cookies.enabled)) {
		alert("You don't have cookies enabled, you may experience issues");
	}
	$("#overlay").hide();
	clearInterval(dotdotdot);
}
function init_ws(){
};

function show_success(text){
	var p = $("#psuccess").parent();
	p.show();
	$("#psuccess").text(text);
}
function show_error(text){
	var p = $("#perror").parent()
	p.show();
	$("#perror").text(text);
}
function show_info(text){
	var p = $("#pinfo").parent();
	p.show();
	$("#pinfo").text(text);
}
function loading() {
	var over = '<div id="overlay"><span id="loading"><img src="/static/img/loading4.gif" onClick="loading_close();"><div style="color: white">Loading<span id="loading-dot-dot-dot"></span></div><div id="loaderror" style="color: red"></div></span></div>';
	$(over).appendTo('body');
	var dotspan = document.getElementById("loading-dot-dot-dot");
	var cycle = 0;
	dotdotdot = setInterval(function() {
		if(dotspan.innerHTML.length == 3) {
			dotspan.innerHTML = "";
		} else {
			dotspan.innerHTML += ".";
		}
		cycle++
	}, 250);
};

$(document).ready(function(){
	loading();
	$(".pmessage").hide();
	$("#stop_watch").hide();
	var tab = window.location.hash.substring(1);
	if ((tab != "") || (tab != "home")) {
		$('#maintabs li a[href="#'+tab+'"]').tab('show');
	}
	$('.nav li a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
		window.location.hash = this.hash;
	});
	$("#register_container").hide();
	$("#logged_in_container").hide();
	$("#swr").click(function(){
		$("#signin_container").hide(100);
		$("#register_container").show(100);
	});
	$("#swl").click(function(){
		$("#register_container").hide(100);
		$("#signin_container").show(100);
	});
	$("#register_button").click(function(){
		$("#register_container").hide(100);
		$("#signin_container").show(100);
	});
	$("#start_watch").click(function(){
		if(watcher_data.running == 0) {
			socket.emit("client-event", {"action": "start-watching"});
			$("#start_watch").hide();
			$("#stop_watch").show();
		}
	});
	$("#pw").keyup(function(e){
		$("#pw_hashed").val(Sha256.hash(this.val()));
	});
	$("#stop_watch").click(function(){
		if(watcher_data.running == 1){
			watcher_data.stop = 1;
			$("#stop_watch").hide();
			$("#start_watch").show();
		}
	});
	$("#skip_watch").click(function(){
		if(watcher_data.running == 1){
			watcher_data.skip = 1;
		}
	});
	init_ws();
});
