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