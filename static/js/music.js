function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

var happy= document.getElementById("happy_music");
var sad = document.getElementById("sad_music");

function playHappy() {
    if(isPlaying(sad)){
        sad.pause();
    }
    happy.play();
}

function playSad() {
    if(isPlaying(happy)){
        happy.pause();
    }
    sad.play();
}

function isPlaying(audelem) {
    return !audelem.paused;
}

var sounds = document.getElementsByTagName('audio');


function playMusic(music){
    happy.pause();
    sad.pause();
    music.play();
}