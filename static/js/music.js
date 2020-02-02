var SFXPath = "static/sfx/";
var BGMPath = "static/music/";

class SFX { 
	
	constructor(Audio) { this.Audio = Audio; }

	Initialize() { 
		PreloadAllSFX();
	}

	PreloadAllSFX() { 
		var noVolume = 0.5;
	
		//ADD ALL SFX HERE FROM FOLDER!
		this.Play("SFX_Dodge.wav",noVolume)
		this.Play("SFX_Drop_Long.wav",noVolume)
		this.Play("SFX_Drop_Medium.wav",noVolume);
		this.Play("SFX_Glissando.wav",noVolume);
		this.Play("SFX_Hit_Long.wav",noVolume);
		this.Play("SFX_Hit_Short.wav",noVolume);
		this.Play("SFX_Move_Space.wav",noVolume);
		this.Play("SFX_MoveSpace.wav",noVolume);
		this.Play("SFX_Select_Forward.wav",noVolume);
		this.Play("SFX_Select_Move.wav",noVolume);
		this.Play("SFX_Thunder_Bomb.wav",noVolume);
		this.Play("SFX_ThunderBomb.wav",noVolume);
		this.Play("SFX_Treebuchet_THROW.wav",noVolume);
		this.Play("SFX_Voices_CatMeow.wav",noVolume);
		this.Play("SFX_Voices_PirateArg.wav",noVolume);
	}

	Play(_fileName,_volume) { 
		this.SFXAudio = document.createElement("Audio");
		
		this.SFXAudio.setAttribute("preload","auto");
		this.SFXAudio.setAttribute("controls", "none");
		this.SFXAudio.style.display = "none";

		this.filePath = SFXPath + _fileName;

		console.log(this.filePath);

		this.SFXAudio.src = SFXPath + _fileName;
		this.SFXAudio.volume = _volume;		

		this.SFXAudio.play();
	}

}

class BGM {

	constructor(Audio) { this.Audio = Audio; }

	Initialize() { 
		Audio = document.createElement("Audio");
		
		//Auto play needs to be on for it to play, it's off by default...
		Audio.setAttribute("preload", "auto");
		Audio.setAttribute("controls", "none");
		Audio.style.display = "none";
	}
	
	Play(_fileName,_doLoop) { 
		Audio.src = BGMPath + _fileName;
		Audio.loop = _doLoop;
		
		Audio.play();
	}
	
	SetVolume(_volume) { 
		Audio.volume = _volume;
	}
	
	Stop() { 
		Audio.pause();
	}

}



















function SFXPlay(_fileName, _volume) { 
	
	this.SFXAudio = document.createElement("Audio");
	
	this.SFXAudio.setAttribute("preload","auto");
	this.SFXAudio.setAttribute("controls", "none");
	this.SFXAudio.style.display = "none";

	this.filePath = SFXPath + _fileName;

	console.log(this.filePath);

	this.SFXAudio.src = SFXPath + _fileName;
	this.SFXAudio.volume = _volume;		

	this.SFXAudio.play();

}























function BGM_Stop() { 
	BGM = document.getElementById("BGM");
}

function BGM_Initialize() { 

	BGM = document.createElement("Audio");
	
	//Auto play needs to be on for it to play, it's off by default...
	BGM.setAttribute("preload", "auto");
	BGM.setAttribute("controls", "none");
	BGM.style.display = "none";

	BGM.stop = function() { 
		BGM.pause();
	}

	BGM.volume = function(_volume) { 
		BGM.volume = _volume;
	}	
	
}



function BGM_Load(_path,_volume,_doLoop) { 

	console.log("Trying to play music as source: " + _path);
	console.log("music _volume passed is = " + _volume);
	console.log ("_doloop is set to = " + _doLoop);
	
	if (typeof _doLoop != "boolean") { 
		console.log("Can't play sound, _doLoop must be a bool!");
		return;
	}
	
	BGM.src 		= _path;
	BGM.volume 		= _volume;
	BGM.loop 		= _doLoop;
	
	BGM.play();

	

}



	// this.sound 				= document.createElement("audio");
	
	// this.sound.src 			= _path;
	// this.sound.volume 		= _volume;
	
	// if (typeof _doLoop != "boolean") { 
		// console.log("Can't play sound, _doLoop must be a bool!");
		// return null;
	// }
	
	// this.sound.loop 		= _doLoop;
	
	// this.sound.setAttribute("preload", "auto");
	// this.sound.setAttribute("controls", "none");
	// this.sound.style.display = "none";
	
	// document.body.appendChild(this.sound);

	// this.play = function() { 
		// this.sound.play();
	// }
	// this.stop = function() { 
		// this.sound.pause();
	// }

	// this.volume = function(_volume) { 
		// if (_volume > 1.0 || _volume < 0.0) { 
			// console.log("Sound _volume must be between 0.0 and 1.0!");
		// } else { 
			// this.volume = _volume;
		// }
	// }
}

// -----------------------------------------------------------------------------------------


// function sound(src) {
  // this.sound = document.createElement("audio");
  // this.sound.src = src;
  // this.sound.setAttribute("preload", "auto");
  // this.sound.setAttribute("controls", "none");
  // this.sound.style.display = "none";
  // document.body.appendChild(this.sound);
  // this.play = function(){
    // this.sound.play();
  // }
  // this.stop = function(){
    // this.sound.pause();
  // }
// }



// var happy = document.getElementById("happy_music");
// var sad = document.getElementById("sad_music");

// function playHappy() {
    // if(isPlaying(sad)){
        // sad.pause();
    // }
    // happy.play();
// }

// function playSad() {
    // if(isPlaying(happy)){
        // happy.pause();
    // }
    // sad.play();
// }

// function isPlaying(audelem) {
    // return !audelem.paused;
// }

// var sounds = document.getElementsByTagName('audio');

// function playMusic(music, volume){
    // happy.pause();
    // sad.pause();
    // music.play();
	// if (volume < 1.01 && volume > 0.01) {
		// music.volume = volume;
	// } else { 
		// music.volume = 1.00;
	// }
// }