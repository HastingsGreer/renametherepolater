var SFXPath = "/static/sfx/";
var BGMPath = "/static/music/";

class SFX { 
	
	constructor(Audio) { this.Audio = Audio; }

	Initialize() { 
		this.PreloadAllSFX();
	}

	PreloadAllSFX() { 
		var noVolume = 1;

		console.log("music")
	
		//ADD ALL SFX HERE FROM FOLDER!
		this.Play("SFX_Dodge.wav",noVolume)
		this.Play("SFX_Extras_BigBomb.wav",noVolume)
		this.Play("SFX_Extras_DropLong.wav",noVolume)
		this.Play("SFX_Extras_DropMedium.wav",noVolume)
		this.Play("SFX_Extras_DropShort.wav",noVolume)
		this.Play("SFX_Extras_TreebuchetThrow.wav",noVolume)
		this.Play("SFX_Move_Space.wav",noVolume)
		this.Play("SFX_Select_Forward.wav",noVolume)
		this.Play("SFX_Select_Move.wav",noVolume)
		this.Play("SFX_Units_Austin_1.wav",noVolume)
		this.Play("SFX_Units_BenchBoi_1.wav",noVolume)
		this.Play("SFX_Units_BlankBenchBoi_1.wav",noVolume)
		this.Play("SFX_Units_Cat_1.wav",noVolume)
		this.Play("SFX_Units_Cynthia_1.wav",noVolume)
		this.Play("SFX_Units_Cynthia_2.wav",noVolume)
		this.Play("SFX_Units_Doggo_1.wav",noVolume)
		this.Play("SFX_Units_FlowerGirl_1.wav",noVolume)
		this.Play("SFX_Units_Lumberjack_1.wav",noVolume)
		this.Play("SFX_Units_Pirate_1.wav",noVolume)
		this.Play("SFX_Units_Therapist_1.wav",noVolume)
		this.Play("SFX_Units_Therapist_2.wav",noVolume)
		this.Play("SFX_Units_Therapist_3.wav",noVolume)
		this.Play("SFX_Units_Treebuchet_1.wav",noVolume)
		this.Play("SFX_Units_Treebuchet_2.wav",noVolume)
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

unit_selected_sound = {
	"austin" 		: "SFX_Units_Austin_1.wav", 
	"bench_boi"		: "SFX_Units_BenchBoi_1.wav",
	"therapist" 	: "SFX_Units_Therapist_1.wav",
	"normie" 		: "SFX_Units_Cynthia_1.wav", 
	"treebuchet" 	: "SFX_Units_Normie_1.wav", 
	"flower_girl" 	: "SFX_Units_FlowerGirl_1.wav"
}
	
unit_attack_sound = {
	"austin" 		: "SFX_Units_Austin_1.wav", 
	"bench_boi" 	: "SFX_Units_BlankBenchBoi_1.wav", 
	"therapist" 	: "SFX_Units_Therapist_2.wav", 
	"normie" 		: "SFX_Units_Cynthia_1.wav", 
	"treebuchet" 	: "SFX_Units_Treebuchet_2.wav", 
	"flower_girl" 	: "SFX_Units_FlowerGirl_1.wav"
}