(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"MultimediaSystemsProjectBI01_atlas_1", frames: [[0,0,1080,1080],[0,1082,1356,797]]},
		{name:"MultimediaSystemsProjectBI01_atlas_2", frames: [[0,612,1229,448],[1065,0,930,610],[0,0,1063,610],[0,1314,840,569],[1231,612,700,700]]},
		{name:"MultimediaSystemsProjectBI01_atlas_3", frames: [[979,739,98,16],[681,1199,62,65],[614,1199,65,63],[979,653,396,84],[650,487,634,164],[0,891,634,164],[745,1199,61,64],[871,1199,60,63],[808,1199,61,64],[933,1199,60,63],[0,0,648,733],[262,1238,59,62],[323,1238,59,62],[384,1238,58,61],[444,1238,58,61],[871,1264,56,59],[132,1243,57,60],[929,1264,56,59],[191,1243,57,60],[1993,1164,55,58],[0,1267,55,57],[1993,1224,55,58],[57,1267,54,57],[384,1301,54,56],[495,1301,53,55],[440,1301,53,56],[113,1305,52,54],[167,1305,51,54],[736,1322,51,53],[132,1169,63,72],[295,1302,52,55],[197,1169,63,72],[262,1169,63,67],[327,1169,63,67],[392,1169,63,67],[457,1169,63,67],[1993,1284,55,55],[1286,585,89,55],[827,653,63,75],[650,653,175,75],[745,1265,60,55],[892,653,63,75],[0,1114,552,53],[1286,487,64,96],[0,1169,64,96],[807,1265,60,55],[66,1169,64,96],[504,1238,47,49],[674,1266,60,55],[1844,1142,48,373],[1944,1164,47,373],[1894,1142,48,373],[1744,1142,48,374],[1794,1142,48,374],[1591,1142,49,374],[1437,1142,50,377],[1489,1142,49,376],[1642,1142,49,374],[1385,1142,50,378],[1333,1142,50,379],[1693,1142,49,374],[1540,1142,49,375],[1280,1142,51,380],[1118,1142,53,383],[1062,1142,54,384],[1227,1142,51,381],[1005,1142,55,387],[1994,0,54,385],[1173,1142,52,382],[556,1057,56,388],[1991,772,57,390],[614,1264,58,58],[250,1302,43,67],[1286,642,56,5],[614,1142,389,55],[1437,928,552,105],[636,928,799,105],[1437,1035,552,105],[0,735,977,154],[636,1035,799,105],[979,772,977,154],[1380,410,660,360],[1352,544,25,33],[650,0,728,485],[1380,0,612,408],[789,1322,45,41],[1352,487,20,55],[0,1057,554,55],[1958,772,20,124]]}
];


(lib.AnMovieClip = function(){
	this.currentSoundStreamInMovieclip;
	this.actionFrames = [];
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(positionOrLabel);
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		var keys = this.soundStreamDuration.keys();
		for(var i = 0;i<this.soundStreamDuration.size; i++){
			var key = keys.next().value;
			key.instance.stop();
		}
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var keys = this.soundStreamDuration.keys();
			for(var i = 0; i< this.soundStreamDuration.size ; i++){
				var key = keys.next().value; 
				var value = this.soundStreamDuration.get(key);
				if((value.end) == currentFrame){
					key.instance.stop();
					if(this.currentSoundStreamInMovieclip == key) { this.currentSoundStreamInMovieclip = undefined; }
					this.soundStreamDuration.delete(key);
				}
			}
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			if(this.soundStreamDuration.size > 0){
				var keys = this.soundStreamDuration.keys();
				var maxDuration = 0;
				for(var i=0;i<this.soundStreamDuration.size;i++){
					var key = keys.next().value;
					var value = this.soundStreamDuration.get(key);
					if(value.end > maxDuration){
						maxDuration = value.end;
						this.currentSoundStreamInMovieclip = key;
					}
				}
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_105 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_100 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_107 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_102 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_103 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_104 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_99 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_97 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_98 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_96 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_101 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_94 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_95 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_93 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_92 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_89 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_91 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_88 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_90 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_87 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_85 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_86 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_84 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_83 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_81 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_82 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_79 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_78 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_77 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_74 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_80 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_76 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_71 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_70 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_68 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(34);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_73 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(35);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_63 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(36);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_62 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(37);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_65 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(38);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_64 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(39);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_60 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(40);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_67 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(41);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_61 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(42);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_56 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(43);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_57 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(44);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_59 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(45);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_55 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(46);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_54 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(47);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_58 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(48);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_49 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(49);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_50 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(50);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_48 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(51);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_46 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(52);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_47 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(53);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_43 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(54);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_40 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(55);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_41 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(56);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_44 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(57);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_39 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(58);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_38 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(59);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_45 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(60);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_42 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(61);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_37 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(62);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_34 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(63);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_33 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(64);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_36 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(65);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_31 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(66);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_32 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(67);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_35 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(68);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_30 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(69);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_29 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(70);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_28 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(71);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_24 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(72);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_17 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(73);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_21 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(74);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_15 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(75);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_20 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_19 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_14 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(76);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_18 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_12 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(77);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_13 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(78);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_11 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(79);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_10 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(80);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_9 = function() {
	this.initialize(img.CachedBmp_9);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2155,213);


(lib._1811813482_homepnghomehomebuttonpngtransparentclipart = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib._460388 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.c755584da7b14dc78136fbffc01efc64 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(81);
}).prototype = p = new cjs.Sprite();



(lib.Bitmap9 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(82);
}).prototype = p = new cjs.Sprite();



(lib.singersbillieeilishamericansingerhdwallpaperpreviewremovebg = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(83);
}).prototype = p = new cjs.Sprite();



(lib.kisspngmusicalnoteportablenetworkgraphicsclipartimmusicnotespngvectorclipartpsdpeoplepngc5cf6824db1dae811664749155965908572851 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.blondesingersingerbillieeilishbillyrileyhdwallpaperpreviewremovebgpreview = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(84);
}).prototype = p = new cjs.Sprite();



(lib.Bitmap7 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(85);
}).prototype = p = new cjs.Sprite();



(lib.billieeilish = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_2 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(86);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(87);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_4 = function() {
	this.initialize(ss["MultimediaSystemsProjectBI01_atlas_3"]);
	this.gotoAndStop(88);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_5 = function() {
	this.initialize(img.CachedBmp_5);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2164,205);


(lib.CachedBmp_7 = function() {
	this.initialize(img.CachedBmp_7);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2088,488);


(lib.CachedBmp_6 = function() {
	this.initialize(img.CachedBmp_6);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2088,621);// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.an_Video = function(options) {
	this.initialize();
	this._element = new $.an.Video(options);
	this._el = this._element.create();
}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,400,300);

p._tick = _tick;
p._handleDrawEnd = _handleDrawEnd;
p._updateVisibility = _updateVisibility;
p.draw = _componentDraw;



(lib.Tween18 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_107();
	this.instance.setTransform(-16.15,-15.75,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-16.1,-15.7,32.5,31.5);


(lib.Tween17 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_107();
	this.instance.setTransform(-16.15,-15.7,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-16.1,-15.7,32.5,31.5);


(lib.Tween1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_105();
	this.instance.setTransform(-24.5,-4,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-24.5,-4,49,8);


(lib.title2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// masking (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_0 = new cjs.Graphics().p("A9XHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_1 = new cjs.Graphics().p("A83HHIAAuNMA5fAAAIAAONg");
	var mask_graphics_2 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_3 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_4 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_5 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_6 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_7 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_8 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_9 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_10 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_11 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_12 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_13 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_14 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_15 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_16 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_17 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_18 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_19 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_20 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_21 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_22 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_23 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_24 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_25 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_26 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_27 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_28 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_29 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_30 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_31 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_32 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_33 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_34 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_35 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_36 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_37 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_38 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_39 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_40 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_41 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_42 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_43 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_44 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_45 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_46 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_47 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_48 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_49 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_50 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_51 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_52 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_53 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_54 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_55 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_56 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_57 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_58 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");
	var mask_graphics_59 = new cjs.Graphics().p("A8vHHIAAuNMA5fAAAIAAONg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:mask_graphics_0,x:-187.95,y:36.3}).wait(1).to({graphics:mask_graphics_1,x:-184.7648,y:36.3}).wait(1).to({graphics:mask_graphics_2,x:-179.1843,y:36.3}).wait(1).to({graphics:mask_graphics_3,x:-172.814,y:36.3}).wait(1).to({graphics:mask_graphics_4,x:-166.4436,y:36.3}).wait(1).to({graphics:mask_graphics_5,x:-160.0733,y:36.3}).wait(1).to({graphics:mask_graphics_6,x:-153.703,y:36.3}).wait(1).to({graphics:mask_graphics_7,x:-147.3326,y:36.3}).wait(1).to({graphics:mask_graphics_8,x:-140.9623,y:36.3}).wait(1).to({graphics:mask_graphics_9,x:-134.5919,y:36.3}).wait(1).to({graphics:mask_graphics_10,x:-128.2216,y:36.3}).wait(1).to({graphics:mask_graphics_11,x:-121.8513,y:36.3}).wait(1).to({graphics:mask_graphics_12,x:-115.4809,y:36.3}).wait(1).to({graphics:mask_graphics_13,x:-109.1106,y:36.3}).wait(1).to({graphics:mask_graphics_14,x:-102.7402,y:36.3}).wait(1).to({graphics:mask_graphics_15,x:-96.3699,y:36.3}).wait(1).to({graphics:mask_graphics_16,x:-89.9996,y:36.3}).wait(1).to({graphics:mask_graphics_17,x:-83.6292,y:36.3}).wait(1).to({graphics:mask_graphics_18,x:-77.2589,y:36.3}).wait(1).to({graphics:mask_graphics_19,x:-70.8886,y:36.3}).wait(1).to({graphics:mask_graphics_20,x:-64.5182,y:36.3}).wait(1).to({graphics:mask_graphics_21,x:-58.1479,y:36.3}).wait(1).to({graphics:mask_graphics_22,x:-51.7775,y:36.3}).wait(1).to({graphics:mask_graphics_23,x:-45.4072,y:36.3}).wait(1).to({graphics:mask_graphics_24,x:-39.0369,y:36.3}).wait(1).to({graphics:mask_graphics_25,x:-32.6665,y:36.3}).wait(1).to({graphics:mask_graphics_26,x:-26.2962,y:36.3}).wait(1).to({graphics:mask_graphics_27,x:-19.9258,y:36.3}).wait(1).to({graphics:mask_graphics_28,x:-13.5555,y:36.3}).wait(1).to({graphics:mask_graphics_29,x:-7.1852,y:36.3}).wait(1).to({graphics:mask_graphics_30,x:-0.8148,y:36.3}).wait(1).to({graphics:mask_graphics_31,x:5.5555,y:36.3}).wait(1).to({graphics:mask_graphics_32,x:11.9258,y:36.3}).wait(1).to({graphics:mask_graphics_33,x:18.2962,y:36.3}).wait(1).to({graphics:mask_graphics_34,x:24.6665,y:36.3}).wait(1).to({graphics:mask_graphics_35,x:31.0369,y:36.3}).wait(1).to({graphics:mask_graphics_36,x:37.4072,y:36.3}).wait(1).to({graphics:mask_graphics_37,x:43.7775,y:36.3}).wait(1).to({graphics:mask_graphics_38,x:50.1479,y:36.3}).wait(1).to({graphics:mask_graphics_39,x:56.5182,y:36.3}).wait(1).to({graphics:mask_graphics_40,x:62.8886,y:36.3}).wait(1).to({graphics:mask_graphics_41,x:69.2589,y:36.3}).wait(1).to({graphics:mask_graphics_42,x:75.6292,y:36.3}).wait(1).to({graphics:mask_graphics_43,x:81.9996,y:36.3}).wait(1).to({graphics:mask_graphics_44,x:88.3699,y:36.3}).wait(1).to({graphics:mask_graphics_45,x:94.7403,y:36.3}).wait(1).to({graphics:mask_graphics_46,x:101.1106,y:36.3}).wait(1).to({graphics:mask_graphics_47,x:107.4809,y:36.3}).wait(1).to({graphics:mask_graphics_48,x:113.8513,y:36.3}).wait(1).to({graphics:mask_graphics_49,x:120.2216,y:36.3}).wait(1).to({graphics:mask_graphics_50,x:126.592,y:36.3}).wait(1).to({graphics:mask_graphics_51,x:132.9623,y:36.3}).wait(1).to({graphics:mask_graphics_52,x:139.3326,y:36.3}).wait(1).to({graphics:mask_graphics_53,x:145.703,y:36.3}).wait(1).to({graphics:mask_graphics_54,x:152.0733,y:36.3}).wait(1).to({graphics:mask_graphics_55,x:158.4436,y:36.3}).wait(1).to({graphics:mask_graphics_56,x:164.814,y:36.3}).wait(1).to({graphics:mask_graphics_57,x:171.1843,y:36.3}).wait(1).to({graphics:mask_graphics_58,x:177.5547,y:36.3}).wait(1).to({graphics:mask_graphics_59,x:183.975,y:36.3}).wait(1));

	// Layer_1
	this.instance = new lib.CachedBmp_103();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_104();
	this.instance_1.setTransform(0,0,0.5,0.5);

	var maskedShapeInstanceList = [this.instance,this.instance_1];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},59).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,317,81.8);


(lib.title = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_102();
	this.instance.setTransform(41.25,19.25,0.3056,0.3056);

	this.instance_1 = new lib._460388();
	this.instance_1.setTransform(24.1,44.9,0.1463,0.1463);

	this.instance_2 = new lib.CachedBmp_101();
	this.instance_2.setTransform(0,0,0.3056,0.3056);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,198,224);


(lib.Symbol1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.kisspngmusicalnoteportablenetworkgraphicsclipartimmusicnotespngvectorclipartpsdpeoplepngc5cf6824db1dae811664749155965908572851();
	this.instance.setTransform(102,0,0.1457,0.1806,0,0,180);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol1, new cjs.Rectangle(0,0,102,126.4), null);


(lib.star = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_77();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_78();
	this.instance_1.setTransform(1.9,6.55,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_79();
	this.instance_2.setTransform(3.75,13.1,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_80();
	this.instance_3.setTransform(5.65,19.7,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_81();
	this.instance_4.setTransform(7.5,26.25,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_82();
	this.instance_5.setTransform(9.4,32.8,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_83();
	this.instance_6.setTransform(11.3,39.35,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_84();
	this.instance_7.setTransform(13.15,45.9,0.5,0.5);

	this.instance_8 = new lib.CachedBmp_85();
	this.instance_8.setTransform(15.05,52.45,0.5,0.5);

	this.instance_9 = new lib.CachedBmp_86();
	this.instance_9.setTransform(16.9,59.05,0.5,0.5);

	this.instance_10 = new lib.CachedBmp_87();
	this.instance_10.setTransform(18.8,65.6,0.5,0.5);

	this.instance_11 = new lib.CachedBmp_88();
	this.instance_11.setTransform(20.7,72.15,0.5,0.5);

	this.instance_12 = new lib.CachedBmp_89();
	this.instance_12.setTransform(22.55,78.7,0.5,0.5);

	this.instance_13 = new lib.CachedBmp_90();
	this.instance_13.setTransform(24.45,85.25,0.5,0.5);

	this.instance_14 = new lib.CachedBmp_91();
	this.instance_14.setTransform(26.35,91.8,0.5,0.5);

	this.instance_15 = new lib.CachedBmp_92();
	this.instance_15.setTransform(28.2,98.4,0.5,0.5);

	this.instance_16 = new lib.CachedBmp_93();
	this.instance_16.setTransform(30.1,104.95,0.5,0.5);

	this.instance_17 = new lib.CachedBmp_94();
	this.instance_17.setTransform(31.95,111.5,0.5,0.5);

	this.instance_18 = new lib.CachedBmp_95();
	this.instance_18.setTransform(33.85,118.05,0.5,0.5);

	this.instance_19 = new lib.CachedBmp_96();
	this.instance_19.setTransform(35.75,124.6,0.5,0.5);

	this.instance_20 = new lib.CachedBmp_97();
	this.instance_20.setTransform(37.6,131.15,0.5,0.5);

	this.instance_21 = new lib.CachedBmp_98();
	this.instance_21.setTransform(39.5,137.75,0.5,0.5);

	this.instance_22 = new lib.CachedBmp_99();
	this.instance_22.setTransform(41.35,144.3,0.5,0.5);

	this.instance_23 = new lib.CachedBmp_100();
	this.instance_23.setTransform(43.25,150.85,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_14}]},1).to({state:[{t:this.instance_15}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_17}]},1).to({state:[{t:this.instance_18}]},1).to({state:[{t:this.instance_19}]},1).to({state:[{t:this.instance_20}]},1).to({state:[{t:this.instance_21}]},1).to({state:[{t:this.instance_22}]},1).to({state:[{t:this.instance_23}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,74.3,183.4);


(lib.Scene_1_pict2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// pict2
	this.instance = new lib.blondesingersingerbillieeilishbillyrileyhdwallpaperpreviewremovebgpreview();
	this.instance.setTransform(314,808,0.7353,0.7184);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({x:721,y:475},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_pict1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// pict1
	this.instance = new lib.singersbillieeilishamericansingerhdwallpaperpreviewremovebg();
	this.instance.setTransform(0,662,0.3379,0.2249);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({x:6,y:658},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_new_single = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// new_single
	this.instance = new lib.CachedBmp_21();
	this.instance.setTransform(385.45,117.3,0.5,0.5);

	this.instance_1 = new lib.c755584da7b14dc78136fbffc01efc64();
	this.instance_1.setTransform(0,0,0.6222,0.6222);

	this.instance_2 = new lib.CachedBmp_20();
	this.instance_2.setTransform(410.35,0.1,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Scene_1_new_single, null, null);


(lib.Scene_1_fotage = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// fotage
	this.instance = new lib.CachedBmp_9();
	this.instance.setTransform(-32,662,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_deskripsi_album = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// deskripsi_album
	this.instance = new lib.CachedBmp_12();
	this.instance.setTransform(511,475.5,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_11();
	this.instance_1.setTransform(511,417.75,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_10();
	this.instance_2.setTransform(511,324.95,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_15();
	this.instance_3.setTransform(498.4,192.5,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_14();
	this.instance_4.setTransform(498.4,134.75,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_13();
	this.instance_5.setTransform(498.4,41.95,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_5},{t:this.instance_4},{t:this.instance_3}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_album_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// album
	this.instance = new lib.billieeilish();
	this.instance.setTransform(51,343,0.3172,0.2923);

	this.instance_1 = new lib.CachedBmp_18();
	this.instance_1.setTransform(31.55,283.45,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_19();
	this.instance_2.setTransform(-0.5,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance,p:{x:51,y:343}}]}).to({state:[{t:this.instance_2},{t:this.instance,p:{x:19,y:59}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.play_button4 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_74();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_76();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,31.5,36);


(lib.play_button3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_71();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_73();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,31.5,33.5);


(lib.play_button2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_68();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_70();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,31.5,33.5);


(lib.play_button1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_65();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_67();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,31.5,37.5);


(lib.next_button2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_64();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,87.5,37.5);


(lib.next_button = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.Bitmap9();
	this.instance.setTransform(8.6,8.45,0.5606,0.3303);

	this.instance_1 = new lib.CachedBmp_63();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,27.5,27.5);


(lib.love_button = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.Bitmap7();
	this.instance.setTransform(0,0,0.6897,0.6578);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,31.1,27);


(lib.hyperlink = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_62();
	this.instance.setTransform(0,-1,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_61();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-1,276,27.5);


(lib.home_button = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib._1811813482_homepnghomehomebuttonpngtransparentclipart();
	this.instance.setTransform(0,0,0.1468,0.1687);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,123.3,96);


(lib.favorite_button = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_58();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_59();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_60();
	this.instance_2.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,30,27.5);


(lib.download_button = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_55();
	this.instance.setTransform(-0.5,-0.5,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_56();
	this.instance_1.setTransform(-0.5,-0.5,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_57();
	this.instance_2.setTransform(-0.5,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.5,-0.5,32,48);


(lib.button_list = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.CachedBmp_28();
	this.instance.setTransform(0,166.45,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_28();
	this.instance_1.setTransform(0,108.95,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_28();
	this.instance_2.setTransform(0,57.15,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_28();
	this.instance_3.setTransform(0,0,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_29();
	this.instance_4.setTransform(0,0.1,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_30();
	this.instance_5.setTransform(0,0.25,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_31();
	this.instance_6.setTransform(0,0.35,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_32();
	this.instance_7.setTransform(0,0.45,0.5,0.5);

	this.instance_8 = new lib.CachedBmp_33();
	this.instance_8.setTransform(0,0.45,0.5,0.5);

	this.instance_9 = new lib.CachedBmp_34();
	this.instance_9.setTransform(0,0.5,0.5,0.5);

	this.instance_10 = new lib.CachedBmp_35();
	this.instance_10.setTransform(0,0.5,0.5,0.5);

	this.instance_11 = new lib.CachedBmp_36();
	this.instance_11.setTransform(0,0.45,0.5,0.5);

	this.instance_12 = new lib.CachedBmp_37();
	this.instance_12.setTransform(0,0.45,0.5,0.5);

	this.instance_13 = new lib.CachedBmp_38();
	this.instance_13.setTransform(0,0.4,0.5,0.5);

	this.instance_14 = new lib.CachedBmp_39();
	this.instance_14.setTransform(0,0.35,0.5,0.5);

	this.instance_15 = new lib.CachedBmp_40();
	this.instance_15.setTransform(0,0.35,0.5,0.5);

	this.instance_16 = new lib.CachedBmp_41();
	this.instance_16.setTransform(0,0.3,0.5,0.5);

	this.instance_17 = new lib.CachedBmp_42();
	this.instance_17.setTransform(0,0.25,0.5,0.5);

	this.instance_18 = new lib.CachedBmp_43();
	this.instance_18.setTransform(0,0.25,0.5,0.5);

	this.instance_19 = new lib.CachedBmp_44();
	this.instance_19.setTransform(0,0.2,0.5,0.5);

	this.instance_20 = new lib.CachedBmp_45();
	this.instance_20.setTransform(0,0.2,0.5,0.5);

	this.instance_21 = new lib.CachedBmp_46();
	this.instance_21.setTransform(0,0.15,0.5,0.5);

	this.instance_22 = new lib.CachedBmp_47();
	this.instance_22.setTransform(0,0.1,0.5,0.5);

	this.instance_23 = new lib.CachedBmp_48();
	this.instance_23.setTransform(0,0.1,0.5,0.5);

	this.instance_24 = new lib.CachedBmp_49();
	this.instance_24.setTransform(0,0.05,0.5,0.5);

	this.instance_25 = new lib.CachedBmp_50();
	this.instance_25.setTransform(0,0.05,0.5,0.5);

	this.instance_26 = new lib.CachedBmp_54();
	this.instance_26.setTransform(0,161.65,0.5,0.5);

	this.instance_27 = new lib.CachedBmp_54();
	this.instance_27.setTransform(0,108.95,0.5,0.5);

	this.instance_28 = new lib.CachedBmp_54();
	this.instance_28.setTransform(0,57.15,0.5,0.5);

	this.instance_29 = new lib.CachedBmp_54();
	this.instance_29.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_10}]},1).to({state:[{t:this.instance_11}]},1).to({state:[{t:this.instance_12}]},1).to({state:[{t:this.instance_13}]},1).to({state:[{t:this.instance_14}]},1).to({state:[{t:this.instance_15}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_17}]},1).to({state:[{t:this.instance_18}]},1).to({state:[{t:this.instance_19}]},1).to({state:[{t:this.instance_20}]},1).to({state:[{t:this.instance_21}]},1).to({state:[{t:this.instance_22}]},1).to({state:[{t:this.instance_23}]},1).to({state:[{t:this.instance_24}]},1).to({state:[{t:this.instance_25}]},1).to({state:[{t:this.instance_29},{t:this.instance_28},{t:this.instance_27},{t:this.instance_26}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,29,195.5);


(lib.billie_masking = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// masking (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_0 = new cjs.Graphics().p("AnmHnIAAvNIPOAAIAAPNg");
	var mask_graphics_1 = new cjs.Graphics().p("AnnHnIAAvNIPPAAIAAPNg");
	var mask_graphics_2 = new cjs.Graphics().p("AnnHnIAAvNIPOAAIAAPNg");
	var mask_graphics_3 = new cjs.Graphics().p("AnmHnIAAvNIPNAAIAAPNg");
	var mask_graphics_4 = new cjs.Graphics().p("AnlHnIAAvNIPOAAIAAPNg");
	var mask_graphics_5 = new cjs.Graphics().p("AlqHnIAAvNIPOAAIAAPNg");
	var mask_graphics_6 = new cjs.Graphics().p("AjwHnIAAvNIPOAAIAAPNg");
	var mask_graphics_7 = new cjs.Graphics().p("Ah2HnIAAvNIPOAAIAAPNg");
	var mask_graphics_8 = new cjs.Graphics().p("AADHnIAAvNIPPAAIAAPNg");
	var mask_graphics_9 = new cjs.Graphics().p("AB+HnIAAvNIPPAAIAAPNg");
	var mask_graphics_10 = new cjs.Graphics().p("AD4HnIAAvNIPPAAIAAPNg");
	var mask_graphics_11 = new cjs.Graphics().p("AFyHnIAAvNIPPAAIAAPNg");
	var mask_graphics_12 = new cjs.Graphics().p("AHtHnIAAvNIPPAAIAAPNg");
	var mask_graphics_13 = new cjs.Graphics().p("AJnHnIAAvNIPPAAIAAPNg");
	var mask_graphics_14 = new cjs.Graphics().p("ALhHnIAAvNIPPAAIAAPNg");
	var mask_graphics_15 = new cjs.Graphics().p("ANcHnIAAvNIPPAAIAAPNg");
	var mask_graphics_16 = new cjs.Graphics().p("APWHnIAAvNIPPAAIAAPNg");
	var mask_graphics_17 = new cjs.Graphics().p("ARQHnIAAvNIPPAAIAAPNg");
	var mask_graphics_18 = new cjs.Graphics().p("ATKHnIAAvNIPPAAIAAPNg");
	var mask_graphics_19 = new cjs.Graphics().p("AVFHnIAAvNIPPAAIAAPNg");
	var mask_graphics_20 = new cjs.Graphics().p("AW/HnIAAvNIPPAAIAAPNg");
	var mask_graphics_21 = new cjs.Graphics().p("AY5HnIAAvNIPPAAIAAPNg");
	var mask_graphics_22 = new cjs.Graphics().p("Aa0HnIAAvNIPPAAIAAPNg");
	var mask_graphics_23 = new cjs.Graphics().p("AcuHnIAAvNIPPAAIAAPNg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:mask_graphics_0,x:-48.75,y:33.8}).wait(1).to({graphics:mask_graphics_1,x:-24.2891,y:33.8}).wait(1).to({graphics:mask_graphics_2,x:0.1717,y:33.8}).wait(1).to({graphics:mask_graphics_3,x:24.6326,y:33.8}).wait(1).to({graphics:mask_graphics_4,x:48.9217,y:33.8}).wait(1).to({graphics:mask_graphics_5,x:61.1522,y:33.8}).wait(1).to({graphics:mask_graphics_6,x:73.3826,y:33.8}).wait(1).to({graphics:mask_graphics_7,x:85.613,y:33.8}).wait(1).to({graphics:mask_graphics_8,x:97.8435,y:33.8}).wait(1).to({graphics:mask_graphics_9,x:110.0739,y:33.8}).wait(1).to({graphics:mask_graphics_10,x:122.3044,y:33.8}).wait(1).to({graphics:mask_graphics_11,x:134.5348,y:33.8}).wait(1).to({graphics:mask_graphics_12,x:146.7652,y:33.8}).wait(1).to({graphics:mask_graphics_13,x:158.9957,y:33.8}).wait(1).to({graphics:mask_graphics_14,x:171.2261,y:33.8}).wait(1).to({graphics:mask_graphics_15,x:183.4565,y:33.8}).wait(1).to({graphics:mask_graphics_16,x:195.687,y:33.8}).wait(1).to({graphics:mask_graphics_17,x:207.9174,y:33.8}).wait(1).to({graphics:mask_graphics_18,x:220.1478,y:33.8}).wait(1).to({graphics:mask_graphics_19,x:232.3783,y:33.8}).wait(1).to({graphics:mask_graphics_20,x:244.6087,y:33.8}).wait(1).to({graphics:mask_graphics_21,x:256.8391,y:33.8}).wait(1).to({graphics:mask_graphics_22,x:269.0696,y:33.8}).wait(1).to({graphics:mask_graphics_23,x:281.3,y:33.8}).wait(1));

	// Layer_1
	this.text = new cjs.Text("BILLIE EILISH", "50px 'Engravers MT'", "#666666");
	this.text.lineHeight = 60;
	this.text.lineWidth = 461;
	this.text.parent = this;
	this.text.setTransform(2,2);

	var maskedShapeInstanceList = [this.text];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.text).wait(24));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,465.1,62.3);


(lib.___Camera___ = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.visible = false;
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(2));

	// cameraBoundary
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(0,0,0,0)").ss(2,1,1,3,true).p("EAq+AfQMhV7AAAMAAAg+fMBV7AAAg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-513,-385,1026,770);


(lib.star_guide = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.Tween17("synched",0);
	this.instance.setTransform(66.15,76.35);

	this.instance_1 = new lib.Tween18("synched",0);
	this.instance_1.setTransform(329.75,-54.15);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},23).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true,guide:{path:[67.4,76.3,67.4,63.9,67.4,51.4,69.5,48.2,69.4,45.4,90.9,29.4,112.4,13.4,115.9,13.4,119.4,13.4,150.3,-14,181.3,-41.5,189.8,-71,198.3,-100.5,229.6,-127.9,272.3,-121.5,287.8,-107,303.3,-92.5,316.1,-73,328.9,-53.5]}},23).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(50,-138.4,296.1,230.60000000000002);


(lib.Scene_1_track_list = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// track_list
	this.instance = new lib.play_button4();
	this.instance.setTransform(-1244.45,-198.6,1,1,0,0,0,15.8,18.1);
	new cjs.ButtonHelper(this.instance, 0, 1, 2);

	this.instance_1 = new lib.play_button3();
	this.instance_1.setTransform(-1244.45,-257.6,1,1,0,0,0,15.8,16.6);
	new cjs.ButtonHelper(this.instance_1, 0, 1, 2);

	this.instance_2 = new lib.play_button2();
	this.instance_2.setTransform(-1244.45,-309.55,1,1,0,0,0,15.8,16.6);
	new cjs.ButtonHelper(this.instance_2, 0, 1, 2);

	this.instance_3 = new lib.play_button1();
	this.instance_3.setTransform(-1260.25,-380.5);
	new cjs.ButtonHelper(this.instance_3, 0, 1, 2);

	this.text = new cjs.Text("All the Good Girls Go to Hell", "25px 'Comic Sans MS'", "#999999");
	this.text.lineHeight = 37;
	this.text.lineWidth = 341;
	this.text.parent = this;
	this.text.setTransform(-1213.65,-214.7);

	this.text_1 = new cjs.Text("Wish You Were a Gay", "25px 'Comic Sans MS'", "#999999");
	this.text_1.lineHeight = 37;
	this.text_1.lineWidth = 266;
	this.text_1.parent = this;
	this.text_1.setTransform(-1213.65,-272.2);

	this.text_2 = new cjs.Text("Bury a Friend", "25px 'Comic Sans MS'", "#999999");
	this.text_2.lineHeight = 37;
	this.text_2.lineWidth = 174;
	this.text_2.parent = this;
	this.text_2.setTransform(-1213.65,-324.15);

	this.text_3 = new cjs.Text("Bad Guy", "25px 'Comic Sans MS'", "#999999");
	this.text_3.lineHeight = 37;
	this.text_3.lineWidth = 201;
	this.text_3.parent = this;
	this.text_3.setTransform(-1213.65,-381.15);

	this.text_4 = new cjs.Text("Track List", "25px 'Gill Sans Ultra Bold'", "#666666");
	this.text_4.lineHeight = 33;
	this.text_4.lineWidth = 211;
	this.text_4.parent = this;
	this.text_4.setTransform(-1256.7,-431.7);

	this.instance_4 = new lib.CachedBmp_6();
	this.instance_4.setTransform(-1350.75,-344.2,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_7();
	this.instance_5.setTransform(6.2,523.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.text_4,p:{x:-1256.7,y:-431.7}},{t:this.text_3,p:{x:-1213.65,y:-381.15}},{t:this.text_2,p:{x:-1213.65,y:-324.15}},{t:this.text_1,p:{x:-1213.65,y:-272.2}},{t:this.text,p:{x:-1213.65,y:-214.7}},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_5},{t:this.text_4,p:{x:100.25,y:369.3}},{t:this.text_3,p:{x:143.3,y:419.85}},{t:this.text_2,p:{x:143.3,y:476.85}},{t:this.text_1,p:{x:143.3,y:528.8}},{t:this.text,p:{x:143.3,y:586.3}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_title = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// title
	this.title = new lib.title();
	this.title.name = "title";
	this.title.setTransform(862.9,112.1,1,1,0,0,0,99,112);
	new cjs.ButtonHelper(this.title, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get(this.title).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Scene_1_title, null, null);


(lib.Scene_1_next_button_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// next_button
	this.next_button2 = new lib.next_button2();
	this.next_button2.name = "next_button2";
	this.next_button2.setTransform(523.7,175.75,1,1,0,0,0,43.8,18.6);
	this.next_button2._off = true;
	new cjs.ButtonHelper(this.next_button2, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get(this.next_button2).wait(2).to({_off:false},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_next_button = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// next_button
	this.next_button = new lib.next_button();
	this.next_button.name = "next_button";
	this.next_button.setTransform(512.2,575.35,1,1,0,0,0,13.8,13.8);
	new cjs.ButtonHelper(this.next_button, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get(this.next_button).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Scene_1_next_button, null, null);


(lib.Scene_1_movie = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// movie
	this.instance = new lib.an_Video({'id': '', 'src':'videos/sdflaksjdflksda.mp4', 'autoplay':false, 'controls':true, 'muted':false, 'loop':true, 'poster':'', 'preload':true, 'class':'video'});

	this.instance.setTransform(-383.5,465.3,1.6,0.9867,0,0,0,200.1,150);

	this.movie = new lib.an_Video({'id': 'movie', 'src':'videos/sdflaksjdflksda.mp4', 'autoplay':false, 'controls':true, 'muted':false, 'loop':true, 'poster':'', 'preload':true, 'class':'video'});

	this.movie.name = "movie";
	this.movie.setTransform(512.05,351.9,1.6,0.9867,0,0,0,200.1,150);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},1).to({state:[{t:this.movie}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_love_button = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// love_button
	this.instance = new lib.favorite_button();
	this.instance.setTransform(594.9,574.4,1,1,0,0,0,14.9,13.8);
	new cjs.ButtonHelper(this.instance, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({x:603.1,y:300.35},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Layer_4 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_4
	this.instance = new lib.star();
	this.instance.setTransform(295.3,35,1,1,0,0,0,12.7,13.3);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Scene_1_Layer_4, null, null);


(lib.Scene_1_Layer_2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_2
	this.instance = new lib.title2();
	this.instance.setTransform(504.7,56.15,1,1,0,0,0,158.5,40.9);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Scene_1_Layer_2, null, null);


(lib.Scene_1_hyperlink = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// hyperlink
	this.instance = new lib.CachedBmp_2();
	this.instance.setTransform(517.7,499.2,0.5,0.5);

	this.hyperlink_button = new lib.hyperlink();
	this.hyperlink_button.name = "hyperlink_button";
	this.hyperlink_button.setTransform(649,514.85,1,1,0,0,0,138,13.1);
	new cjs.ButtonHelper(this.hyperlink_button, 0, 1, 1);

	this.instance_1 = new lib.CachedBmp_3();
	this.instance_1.setTransform(510.5,501.25,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_4();
	this.instance_2.setTransform(505.1,216.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1,p:{x:510.5,y:501.25}},{t:this.hyperlink_button,p:{x:649,y:514.85}},{t:this.instance}]}).to({state:[{t:this.instance_1,p:{x:497.9,y:218.25}},{t:this.hyperlink_button,p:{x:636.4,y:231.85}},{t:this.instance_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_home_button = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// home_button
	this.home_button = new lib.home_button();
	this.home_button.name = "home_button";
	this.home_button.setTransform(843.85,-65.95,1,1,0,0,0,61.6,48);
	new cjs.ButtonHelper(this.home_button, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get(this.home_button).wait(1).to({x:962.6,y:48},0).wait(3));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_guided_star = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// guided_star
	this.instance = new lib.star_guide();
	this.instance.setTransform(403.85,-102.65,1,1,0,0,0,16.1,15.7);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({x:721.45,y:594.65},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_download_button = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// download_button
	this.download_button = new lib.download_button();
	this.download_button.name = "download_button";
	this.download_button.setTransform(536.75,550.8);
	new cjs.ButtonHelper(this.download_button, 0, 1, 2);

	this.instance = new lib.CachedBmp_17();
	this.instance.setTransform(519.05,406.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance,p:{x:519.05,y:406.05}},{t:this.download_button,p:{x:536.75,y:550.8}}]}).to({state:[{t:this.instance,p:{x:590.7,y:322.85}},{t:this.download_button,p:{x:547.4,y:276.6}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_button_list = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// button_list
	this.instance = new lib.button_list();
	this.instance.setTransform(706.9,-105.75,1,1,0,0,0,14.5,97.7);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({x:112.75,y:515.55},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_album = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// album
	this.title = new lib.title();
	this.title.name = "title";
	this.title.setTransform(519.9,351.9,1.6364,1.4732,0,0,0,99,112);
	this.title._off = true;
	new cjs.ButtonHelper(this.title, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get(this.title).wait(3).to({_off:false},0).wait(20).to({scaleX:1,scaleY:1},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.musical_note1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_3
	this.instance = new lib.Symbol1();
	this.instance.setTransform(33.3,1.8,0.1844,0.148,0,6.0551,-173.9431,28.1,35);
	this.instance.filters = [new cjs.ColorFilter(0.57, 0.57, 0.57, 1, 109.65, 109.65, 109.65, 0)];
	this.instance.cache(-2,-2,106,130);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:51,regY:63.2,skewX:6.0604,skewY:-173.9396,x:29.3,y:3.9},0).wait(1).to({x:29.85,y:2.45},0).wait(1).to({x:30.2,y:1.1},0).wait(1).to({x:30.45,y:-0.05},0).wait(1).to({x:30.5,y:-1.05},0).wait(1).to({x:30.4,y:-1.9},0).wait(1).to({x:30.2,y:-2.6},0).wait(1).to({x:29.8,y:-3.15},0).wait(1).to({x:29.25,y:-3.55},0).wait(1).to({x:28.55,y:-3.8},0).wait(1).to({x:27.7,y:-3.9},0).wait(1).to({x:26.7,y:-3.85},0).wait(1).to({x:25.55,y:-3.65},0).wait(1).to({x:24.2,y:-3.3},0).wait(1).to({x:22.75,y:-2.8},0).wait(1).to({x:21.15,y:-2.2},0).wait(1).to({x:19.5,y:-1.85},0).wait(1).to({x:18.05,y:-1.7},0).wait(1).to({x:16.7,y:-1.6},0).wait(1).to({x:15.5,y:-1.7},0).wait(1).to({x:14.45,y:-1.85},0).wait(1).to({x:13.5,y:-2.2},0).wait(1).to({x:12.7,y:-2.65},0).wait(1).to({x:12.05,y:-3.2},0).wait(1).to({x:11.5,y:-3.9},0).wait(1).to({x:11.1,y:-4.7},0).wait(1).to({x:10.8,y:-5.65},0).wait(1).to({x:10.65,y:-6.7},0).wait(1).to({y:-7.9},0).wait(1).to({x:10.75,y:-9.2},0).wait(1).to({x:11,y:-10.65},0).wait(1).to({x:11.4,y:-12.2},0).wait(1).to({x:11.95,y:-13.9},0).wait(1).to({x:12.6,y:-15.75},0).wait(1));

	// Layer_2
	this.instance_1 = new lib.Symbol1();
	this.instance_1.setTransform(11.45,-2.6,0.0962,0.1031,-23.9324);
	this.instance_1.filters = [new cjs.ColorFilter(0.57, 0.57, 0.57, 1, 109.65, 109.65, 109.65, 0)];
	this.instance_1.cache(-2,-2,106,130);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1).to({regX:51,regY:63.2,rotation:-23.9339,x:17.95,y:0.2},0).wait(1).to({x:17.1,y:-0.85},0).wait(1).to({x:16.1,y:-1.85},0).wait(1).to({x:15.05,y:-2.7},0).wait(1).to({x:13.8,y:-3.35},0).wait(1).to({x:12.7,y:-3.95},0).wait(1).to({x:12.5,y:-5.3},0).wait(1).to({x:12.55,y:-6.65},0).wait(1).to({x:12.8,y:-7.95},0).wait(1).to({x:13.15,y:-9.3},0).wait(1).to({x:13.6,y:-10.6},0).wait(1).to({x:14.1,y:-11.85},0).wait(1).to({x:14.6,y:-13.1},0).wait(1).to({x:15.25,y:-14.35},0).wait(1).to({x:15.85,y:-15.5},0).wait(1).to({x:16.7,y:-17},0).wait(1).to({x:16.95,y:-18},0).wait(1).to({x:16.75,y:-19.35},0).wait(1).to({x:16.3,y:-20.65},0).wait(1).to({x:15.55,y:-21.75},0).wait(1).to({x:14.55,y:-22.7},0).wait(1).to({x:13.35,y:-23.35},0).wait(1).to({x:12.05,y:-23.75},0).wait(1).to({x:10.65,y:-23.9},0).wait(1).to({x:9.3,y:-23.95},0).wait(1).to({x:7.95,y:-24},0).wait(1).to({x:6.65,y:-24.1},0).wait(1).to({x:5.3,y:-24.25},0).wait(1).to({x:3.95,y:-24.4},0).wait(1).to({x:2.6,y:-24.6},0).wait(1).to({x:1.25,y:-24.8},0).wait(1).to({x:-0.05,y:-25},0).wait(1).to({x:-1.45,y:-25.3},0).wait(1).to({x:-2.75,y:-25.65},0).wait(1));

	// Layer_1
	this.instance_2 = new lib.Symbol1();
	this.instance_2.setTransform(21.15,5.9,0.1844,0.148,0,-38.9357,141.0669);
	this.instance_2.filters = [new cjs.ColorFilter(0.57, 0.57, 0.57, 1, 109.65, 109.65, 109.65, 0)];
	this.instance_2.cache(-2,-2,106,130);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1).to({regX:51,regY:63.2,skewX:-38.9354,skewY:141.0646,x:18.6,y:20.9},0).wait(1).to({x:17.55,y:22.85},0).wait(1).to({x:16.7,y:24.85},0).wait(1).to({x:15.5,y:26.65},0).wait(1).to({x:13.35,y:27.15},0).wait(1).to({x:11.2,y:26.9},0).wait(1).to({x:9.2,y:26.1},0).wait(1).to({x:7.25,y:25.1},0).wait(1).to({x:5.3,y:24.1},0).wait(1).to({x:3.35,y:23.05},0).wait(1).to({x:1.45,y:21.95},0).wait(1).to({x:-0.4,y:20.75},0).wait(1).to({x:-2.1,y:19.45},0).wait(1).to({x:-2.05,y:18.15},0).wait(1).to({x:0.15,y:17.65},0).wait(1).to({x:2.15,y:16.75},0).wait(1).to({x:3.7,y:15.45},0).wait(1).to({x:4.1,y:13.2},0).wait(1).to({x:4.4,y:11.05},0).wait(1).to({x:4.65,y:8.9},0).wait(1).to({x:4.9,y:6.7},0).wait(1).to({x:5.05,y:4.55},0).wait(1).to({x:5.15,y:2.35},0).wait(1).to({y:0.15},0).wait(1).to({x:5,y:-2},0).wait(1).to({x:4.7,y:-4.15},0).wait(1).to({x:4.15,y:-6.25},0).wait(1).to({x:3.2,y:-8.2},0).wait(1).to({x:1.65,y:-9.7},0).wait(1).to({x:-0.4,y:-10.35},0).wait(1).to({x:-2.5,y:-10.15},0).wait(1).to({x:-4.6,y:-9.5},0).wait(1).to({x:-6.6,y:-8.55},0).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-19.7,-33.5,60.5,73.8);


(lib.movie_clip = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.Tween1("synched",0);
	this.instance.setTransform(24.5,4);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({x:429.6},34).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,454.1,8);


(lib.heartGuided = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.love_button = new lib.love_button();
	this.love_button.name = "love_button";
	this.love_button.setTransform(31.05,13.5,1,1,0,0,0,15.5,13.5);
	new cjs.ButtonHelper(this.love_button, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get(this.love_button).to({guide:{path:[31,13.4,15.5,13.4,0,13.4,-1,7.5,-1.2,7.4,-15,-11.3,-28.9,-30,-31.6,-40,-34.3,-50,-36.6,-58.5,-38.9,-67,-35.9,-71,-32.9,-75,-16.9,-86.9,3.7,-82.5,13,-80.5,18,-71,18,-64,18,-57,11,-53.5,4,-50,-15.1,-50,-34.3,-50,-36.1,-50,-37.9,-50,-71.7,-73.3,-66.8,-116.6,-62.9,-150.2,-37.9,-167.9,-34.9,-170.9,-31.9,-173.9]}},23).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-82.5,-187.4,129.1,214.4);


(lib.guidedHeart2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.heartGuided();
	this.instance.setTransform(15.5,13.5,1,1,0,0,0,15.5,13.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({guide:{path:[15.6,13.5,45.5,-14.8,64.4,-45.9,84.1,-78.3,57.7,-102.4,55.7,-104.3,53.6,-105.9,26.5,-127.7,4.1,-103.1,-3.6,-94.5,-1.8,-81.9,0.7,-81.9,3.2,-81.9,34.7,-73.8,51.4,-102,52.5,-103.9,53.6,-105.9,68.8,-133.9,67.1,-167.8,56.6,-178.8,46.1,-189.8]}},23).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.1,-203.4,105.69999999999999,230.4);


(lib.btnPlay2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1
	this.instance = new lib.play_button1();
	new cjs.ButtonHelper(this.instance, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,31.5,37.5);


(lib.Scene_1_musical_notes = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// musical_notes
	this.instance = new lib.musical_note1();
	this.instance.setTransform(496.7,-53.3,1,1,0,0,0,13.2,13.2);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({x:492.2,y:287.35},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_guided_heart2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// guided_heart2
	this.instance = new lib.guidedHeart2();
	this.instance.setTransform(1139.5,551.3,1,1,0,0,0,15.5,13.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({x:1310.75,y:186.6},0).wait(1).to({x:857.9,y:486.45},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_guided_heart = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// guided_heart
	this.instance = new lib.heartGuided();
	this.instance.setTransform(157.45,486.45,1,1,0,0,0,15.5,13.5);

	this.instance_1 = new lib.heartGuided();
	this.instance_1.setTransform(157.45,486.45,1,1,0,0,0,15.5,13.5);

	this.instance_2 = new lib.CachedBmp_24();
	this.instance_2.setTransform(136.45,467.1,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2,p:{x:136.45,y:467.1}},{t:this.instance_1},{t:this.instance,p:{x:157.45,y:486.45}}]}).to({state:[{t:this.instance_2,p:{x:1212.55,y:417.35}},{t:this.instance,p:{x:1233.55,y:436.7}}]},1).to({state:[{t:this.instance_2,p:{x:136.45,y:467.1}},{t:this.instance,p:{x:157.45,y:486.45}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_classic = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// classic
	this.instance = new lib.movie_clip();
	this.instance.setTransform(297.2,734.3);
	this.instance.compositeOperation = "lighter";

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({x:308.7,y:737.1},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_btnplay = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// btnplay
	this.btnPlay2 = new lib.btnPlay2();
	this.btnPlay2.name = "btnPlay2";
	this.btnPlay2.setTransform(771.65,-39,1,1,0,0,0,15.8,18.7);
	new cjs.ButtonHelper(this.btnPlay2, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get(this.btnPlay2).wait(1).to({x:523.75,y:305.25},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_billie_eilish = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// billie_eilish
	this.instance = new lib.movie_clip();
	this.instance.setTransform(-756.4,556.75);
	this.instance.compositeOperation = "lighter";

	this.instance_1 = new lib.star_guide();
	this.instance_1.setTransform(-343.65,414.3,1,1,0,0,0,16.1,15.7);

	this.instance_2 = new lib.blondesingersingerbillieeilishbillyrileyhdwallpaperpreviewremovebgpreview();
	this.instance_2.setTransform(-344,295,0.7353,0.7184);

	this.instance_3 = new lib.singersbillieeilishamericansingerhdwallpaperpreviewremovebg();
	this.instance_3.setTransform(-1059,478,0.3379,0.2249);

	this.instance_4 = new lib.billie_masking();
	this.instance_4.setTransform(-530.25,531.6,1,1,0,0,0,232.6,31.1);

	this.text = new cjs.Text("", "50px 'EngraversMT'", "#666666");
	this.text.lineHeight = 60;
	this.text.lineWidth = 100;
	this.text.parent = this;
	this.text.setTransform(-1234.25,-160.9);

	this.text_1 = new cjs.Text("BILLIE EILISH", "50px 'Engravers MT'", "#666666");
	this.text_1.lineHeight = 60;
	this.text_1.lineWidth = 461;
	this.text_1.parent = this;
	this.text_1.setTransform(285.65,682.05);

	this.instance_5 = new lib.CachedBmp_5();
	this.instance_5.setTransform(-1097.1,480.4,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_5},{t:this.text_1},{t:this.text},{t:this.instance_4,p:{x:-530.25,y:531.6}},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_4,p:{x:534.85,y:711.95}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


// stage content:
(lib.MultimediaSystemsProjectBI01 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	this.actionFrames = [0,1,2,3,23];
	this.___GetDepth___ = function(obj) {
		var depth = obj.depth;
		var cameraObj = this.___camera___instance;
		if(cameraObj && cameraObj.depth && obj.isAttachedToCamera)
		{
			depth += depth + cameraObj.depth;
		}
		return depth;
		}
	this.___needSorting___ = function() {
		for (var i = 0; i < this.numChildren - 1; i++)
		{
			var prevDepth = this.___GetDepth___(this.getChildAt(i));
			var nextDepth = this.___GetDepth___(this.getChildAt(i + 1));
			if (prevDepth < nextDepth)
				return true;
		}
		return false;
	}
	this.___sortFunction___ = function(obj1, obj2) {
		return (this.exportRoot.___GetDepth___(obj2) - this.exportRoot.___GetDepth___(obj1));
	}
	this.on('tick', function (event){
		var curTimeline = event.currentTarget;
		if (curTimeline.___needSorting___()){
			this.sortChildren(curTimeline.___sortFunction___);
		}
	});

	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		if(this.home_button.parent == undefined || this.home_button.parent == this)
		this.home_button = this.home_button.home_button;
		this.hyperlink_button = this.hyperlink.hyperlink_button;
		this.btnPlay2 = this.btnplay.btnPlay2;
		if(this.download_button.parent == undefined || this.download_button.parent == this)
		this.download_button = this.download_button.download_button;
		if(this.next_button.parent == undefined || this.next_button.parent == this)
		this.next_button = this.next_button.next_button;
		if(this.title.parent == undefined || this.title.parent == this)
		this.title = this.title.title;
		this.stop();
		
		this.next_button.addEventListener('click', nextScene.bind(this));
		
		function nextScene(){
			this.gotoAndStop(1);
		}
		
		this.hyperlink_button.addEventListener('click', hyperlink.bind(this));
		
		function hyperlink(){
			window.open("https://www.billieeilish.com/");
		}
		
		this.title.addEventListener('click', nextScene2.bind(this));
		
		function nextScene2(){
			this.gotoAndStop(2);
		}
	}
	this.frame_1 = function() {
		this.btnPlay2 = undefined;this.hyperlink_button = undefined;if(this.home_button.parent == undefined || this.home_button.parent == this)
		this.home_button = this.home_button.home_button;
		this.hyperlink_button = this.hyperlink.hyperlink_button;
		this.btnPlay2 = this.btnplay.btnPlay2;
		if(this.download_button.parent == undefined || this.download_button.parent == this)
		this.download_button = this.download_button.download_button;
		this.hyperlink_button.addEventListener('click', hyperlink.bind(this));
		
		function hyperlink(){
			window.open("https://www.billieeilish.com/");
		}
		
		this.home_button.addEventListener('click', prevScene.bind(this));
		
		function prevScene(){
			this.gotoAndStop(0);
		}
		
		this.stop()
		this.btnPlay2.addEventListener('click', ppMusic.bind(this))
		createjs.Sound.registerSound('Assets/Billie Elish.mp3','music')
		
		var isPlayed = false
		var isPaused = false
		var isStop = false
		
		function ppMusic(){
		 if(!isPlayed){
		  window.sounds = createjs.Sound.play('music')
		  isPlayed = true
		 }
		 else if (!isPaused){
		  window.sounds.paused = true
		  isPaused = true
		 }
		 else{
		  window.sounds.paused = false
		  isPaused = false
		 }
		}
	}
	this.frame_2 = function() {
		if(this.home_button.parent == undefined || this.home_button.parent == this)
		this.home_button = this.home_button.home_button;
		this.next_button2 = this.next_button_1.next_button2;
		if(this.movie.parent == undefined || this.movie.parent == this)
		this.movie = this.movie.movie;
		this.home_button.addEventListener('click', prevScene.bind(this));
		
		function prevScene(){
			this.gotoAndStop(0);
		}
		
		this.next_button2.addEventListener('click', nextScene2.bind(this));
		
		function nextScene2(){
			this.gotoAndPlay(3);
		}
		
		this.stop(movie)
	}
	this.frame_3 = function() {
		this.title = this.album.title;
		if(this.home_button.parent == undefined || this.home_button.parent == this)
		this.home_button = this.home_button.home_button;
	}
	this.frame_23 = function() {
		this.title = undefined;this.title = this.album.title;
		this.___loopingOver___ = true;
		this.gotoAndStop(23);
		
		this.title.addEventListener('click', home.bind(this));
		
		function home(){
			this.gotoAndStop(0);
		}
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1).call(this.frame_2).wait(1).call(this.frame_3).wait(20).call(this.frame_23).wait(1));

	// Camera
	this.___camera___instance = new lib.___Camera___();
	this.___camera___instance.name = "___camera___instance";
	this.___camera___instance.setTransform(512.05,383.95,1,1,0,0,0,0.1,0.1);
	this.___camera___instance.depth = 0;
	this.___camera___instance.visible = false;

	this.timeline.addTween(cjs.Tween.get(this.___camera___instance).wait(3).to({x:511.9,y:383.85},0).to({regY:0.2,x:511.85,y:383.95},1).to({scaleX:1.2556,scaleY:1.2556,x:512.1,y:384.05},19).wait(1));

	// album_obj_
	this.album = new lib.Scene_1_album();
	this.album.name = "album";
	this.album.setTransform(-0.05,0.05,1,1,0,0,0,-0.1,-0.1);
	this.album.depth = 0;
	this.album.isAttachedToCamera = 0
	this.album.isAttachedToMask = 0
	this.album.layerDepth = 0
	this.album.layerIndex = 0
	this.album.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.album).wait(3).to({regX:-0.2,regY:-0.2,x:0},0).wait(20).to({regX:-130.8,regY:-98.2,scaleX:0.7964,scaleY:0.7964,x:0.05},0).wait(1));

	// home_button_obj_
	this.home_button = new lib.Scene_1_home_button();
	this.home_button.name = "home_button";
	this.home_button.setTransform(843.95,-65.95,1,1,0,0,0,843.9,-66.1);
	this.home_button.depth = 0;
	this.home_button.isAttachedToCamera = 0
	this.home_button.isAttachedToMask = 0
	this.home_button.layerDepth = 0
	this.home_button.layerIndex = 1
	this.home_button.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.home_button).wait(3).to({regX:843.7,regY:-66.2,x:843.9},0).to({_off:true},1).wait(20));

	// musical_notes_obj_
	this.musical_notes = new lib.Scene_1_musical_notes();
	this.musical_notes.name = "musical_notes";
	this.musical_notes.setTransform(498.15,-65.15,1,1,0,0,0,498.1,-65.3);
	this.musical_notes.depth = 0;
	this.musical_notes.isAttachedToCamera = 0
	this.musical_notes.isAttachedToMask = 0
	this.musical_notes.layerDepth = 0
	this.musical_notes.layerIndex = 2
	this.musical_notes.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.musical_notes).wait(1).to({_off:true},1).wait(22));

	// hyperlink_obj_
	this.hyperlink = new lib.Scene_1_hyperlink();
	this.hyperlink.name = "hyperlink";
	this.hyperlink.setTransform(649.05,513.95,1,1,0,0,0,649,513.8);
	this.hyperlink.depth = 0;
	this.hyperlink.isAttachedToCamera = 0
	this.hyperlink.isAttachedToMask = 0
	this.hyperlink.layerDepth = 0
	this.hyperlink.layerIndex = 3
	this.hyperlink.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.hyperlink).wait(1).to({_off:true},1).wait(22));

	// classic_obj_
	this.classic = new lib.Scene_1_classic();
	this.classic.name = "classic";
	this.classic.setTransform(321.75,738.25,1,1,0,0,0,321.7,738.1);
	this.classic.depth = 0;
	this.classic.isAttachedToCamera = 0
	this.classic.isAttachedToMask = 0
	this.classic.layerDepth = 0
	this.classic.layerIndex = 4
	this.classic.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.classic).wait(1).to({_off:true},1).wait(22));

	// guided_star_obj_
	this.guided_star = new lib.Scene_1_guided_star();
	this.guided_star.name = "guided_star";
	this.guided_star.setTransform(437.05,-64.45,1,1,0,0,0,437,-64.6);
	this.guided_star.depth = 0;
	this.guided_star.isAttachedToCamera = 0
	this.guided_star.isAttachedToMask = 0
	this.guided_star.layerDepth = 0
	this.guided_star.layerIndex = 5
	this.guided_star.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.guided_star).wait(1).to({_off:true},1).wait(22));

	// pict2_obj_
	this.pict2 = new lib.Scene_1_pict2();
	this.pict2.name = "pict2";
	this.pict2.setTransform(539.05,954.55,1,1,0,0,0,539,954.4);
	this.pict2.depth = 0;
	this.pict2.isAttachedToCamera = 0
	this.pict2.isAttachedToMask = 0
	this.pict2.layerDepth = 0
	this.pict2.layerIndex = 6
	this.pict2.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.pict2).wait(1).to({_off:true},1).wait(22));

	// pict1_obj_
	this.pict1 = new lib.Scene_1_pict1();
	this.pict1.name = "pict1";
	this.pict1.setTransform(122.95,716.55,1,1,0,0,0,122.9,716.4);
	this.pict1.depth = 0;
	this.pict1.isAttachedToCamera = 0
	this.pict1.isAttachedToMask = 0
	this.pict1.layerDepth = 0
	this.pict1.layerIndex = 7
	this.pict1.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.pict1).wait(1).to({_off:true},1).wait(22));

	// billie_eilish_obj_
	this.billie_eilish = new lib.Scene_1_billie_eilish();
	this.billie_eilish.name = "billie_eilish";
	this.billie_eilish.setTransform(-243.75,289.75,1,1,0,0,0,-243.8,289.6);
	this.billie_eilish.depth = 0;
	this.billie_eilish.isAttachedToCamera = 0
	this.billie_eilish.isAttachedToMask = 0
	this.billie_eilish.layerDepth = 0
	this.billie_eilish.layerIndex = 8
	this.billie_eilish.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.billie_eilish).wait(1).to({_off:true},1).wait(22));

	// btnplay_obj_
	this.btnplay = new lib.Scene_1_btnplay();
	this.btnplay.name = "btnplay";
	this.btnplay.setTransform(771.65,-38.95,1,1,0,0,0,771.6,-39.1);
	this.btnplay.depth = 0;
	this.btnplay.isAttachedToCamera = 0
	this.btnplay.isAttachedToMask = 0
	this.btnplay.layerDepth = 0
	this.btnplay.layerIndex = 9
	this.btnplay.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.btnplay).wait(1).to({_off:true},1).wait(22));

	// button_list_obj_
	this.button_list = new lib.Scene_1_button_list();
	this.button_list.name = "button_list";
	this.button_list.setTransform(706.95,-105.75,1,1,0,0,0,706.9,-105.9);
	this.button_list.depth = 0;
	this.button_list.isAttachedToCamera = 0
	this.button_list.isAttachedToMask = 0
	this.button_list.layerDepth = 0
	this.button_list.layerIndex = 10
	this.button_list.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.button_list).wait(1).to({_off:true},1).wait(22));

	// track_list_obj_
	this.track_list = new lib.Scene_1_track_list();
	this.track_list.name = "track_list";
	this.track_list.setTransform(-828.75,-233.65,1,1,0,0,0,-828.8,-233.8);
	this.track_list.depth = 0;
	this.track_list.isAttachedToCamera = 0
	this.track_list.isAttachedToMask = 0
	this.track_list.layerDepth = 0
	this.track_list.layerIndex = 11
	this.track_list.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.track_list).wait(1).to({_off:true},1).wait(22));

	// fotage_obj_
	this.fotage = new lib.Scene_1_fotage();
	this.fotage.name = "fotage";
	this.fotage.setTransform(506.75,715.25,1,1,0,0,0,506.7,715.1);
	this.fotage.depth = 0;
	this.fotage.isAttachedToCamera = 0
	this.fotage.isAttachedToMask = 0
	this.fotage.layerDepth = 0
	this.fotage.layerIndex = 12
	this.fotage.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.fotage).wait(1).to({_off:true},1).wait(22));

	// deskripsi_album_obj_
	this.deskripsi_album = new lib.Scene_1_deskripsi_album();
	this.deskripsi_album.name = "deskripsi_album";
	this.deskripsi_album.setTransform(755.25,426.45,1,1,0,0,0,755.2,426.3);
	this.deskripsi_album.depth = 0;
	this.deskripsi_album.isAttachedToCamera = 0
	this.deskripsi_album.isAttachedToMask = 0
	this.deskripsi_album.layerDepth = 0
	this.deskripsi_album.layerIndex = 13
	this.deskripsi_album.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.deskripsi_album).wait(1).to({_off:true},1).wait(22));

	// love_button_obj_
	this.love_button = new lib.Scene_1_love_button();
	this.love_button.name = "love_button";
	this.love_button.setTransform(595.05,574.35,1,1,0,0,0,595,574.2);
	this.love_button.depth = 0;
	this.love_button.isAttachedToCamera = 0
	this.love_button.isAttachedToMask = 0
	this.love_button.layerDepth = 0
	this.love_button.layerIndex = 14
	this.love_button.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.love_button).wait(1).to({_off:true},1).wait(22));

	// download_button_obj_
	this.download_button = new lib.Scene_1_download_button();
	this.download_button.name = "download_button";
	this.download_button.setTransform(543.65,502.15,1,1,0,0,0,543.6,502);
	this.download_button.depth = 0;
	this.download_button.isAttachedToCamera = 0
	this.download_button.isAttachedToMask = 0
	this.download_button.layerDepth = 0
	this.download_button.layerIndex = 15
	this.download_button.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.download_button).wait(1).to({_off:true},1).wait(22));

	// next_button_obj_
	this.next_button = new lib.Scene_1_next_button();
	this.next_button.name = "next_button";
	this.next_button.setTransform(512.15,575.25,1,1,0,0,0,512.1,575.1);
	this.next_button.depth = 0;
	this.next_button.isAttachedToCamera = 0
	this.next_button.isAttachedToMask = 0
	this.next_button.layerDepth = 0
	this.next_button.layerIndex = 16
	this.next_button.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.next_button).to({_off:true},1).wait(23));

	// album_obj_
	this.album_1 = new lib.Scene_1_album_1();
	this.album_1.name = "album_1";
	this.album_1.setTransform(297.25,435.95,1,1,0,0,0,297.2,435.8);
	this.album_1.depth = 0;
	this.album_1.isAttachedToCamera = 0
	this.album_1.isAttachedToMask = 0
	this.album_1.layerDepth = 0
	this.album_1.layerIndex = 17
	this.album_1.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.album_1).wait(1).to({_off:true},1).wait(22));

	// title_obj_
	this.title = new lib.Scene_1_title();
	this.title.name = "title";
	this.title.setTransform(862.95,112.05,1,1,0,0,0,862.9,111.9);
	this.title.depth = 0;
	this.title.isAttachedToCamera = 0
	this.title.isAttachedToMask = 0
	this.title.layerDepth = 0
	this.title.layerIndex = 18
	this.title.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.title).to({_off:true},1).wait(23));

	// Layer_2_obj_
	this.Layer_2 = new lib.Scene_1_Layer_2();
	this.Layer_2.name = "Layer_2";
	this.Layer_2.setTransform(316.75,51.65,1,1,0,0,0,316.7,51.5);
	this.Layer_2.depth = 0;
	this.Layer_2.isAttachedToCamera = 0
	this.Layer_2.isAttachedToMask = 0
	this.Layer_2.layerDepth = 0
	this.Layer_2.layerIndex = 19
	this.Layer_2.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Layer_2).to({_off:true},1).wait(23));

	// Layer_4_obj_
	this.Layer_4 = new lib.Scene_1_Layer_4();
	this.Layer_4.name = "Layer_4";
	this.Layer_4.setTransform(295.35,34.95,1,1,0,0,0,295.3,34.8);
	this.Layer_4.depth = 0;
	this.Layer_4.isAttachedToCamera = 0
	this.Layer_4.isAttachedToMask = 0
	this.Layer_4.layerDepth = 0
	this.Layer_4.layerIndex = 20
	this.Layer_4.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Layer_4).to({_off:true},1).wait(23));

	// new_single_obj_
	this.new_single = new lib.Scene_1_new_single();
	this.new_single.name = "new_single";
	this.new_single.setTransform(512.45,112.05,1,1,0,0,0,512.4,111.9);
	this.new_single.depth = 0;
	this.new_single.isAttachedToCamera = 0
	this.new_single.isAttachedToMask = 0
	this.new_single.layerDepth = 0
	this.new_single.layerIndex = 21
	this.new_single.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.new_single).to({_off:true},1).wait(23));

	// guided_heart2_obj_
	this.guided_heart2 = new lib.Scene_1_guided_heart2();
	this.guided_heart2.name = "guided_heart2";
	this.guided_heart2.setTransform(1155.05,551.25,1,1,0,0,0,1155,551.1);
	this.guided_heart2.depth = 0;
	this.guided_heart2.isAttachedToCamera = 0
	this.guided_heart2.isAttachedToMask = 0
	this.guided_heart2.layerDepth = 0
	this.guided_heart2.layerIndex = 22
	this.guided_heart2.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.guided_heart2).wait(2).to({_off:true},1).wait(21));

	// guided_heart_obj_
	this.guided_heart = new lib.Scene_1_guided_heart();
	this.guided_heart.name = "guided_heart";
	this.guided_heart.setTransform(162.55,483.85,1,1,0,0,0,162.5,483.7);
	this.guided_heart.depth = 0;
	this.guided_heart.isAttachedToCamera = 0
	this.guided_heart.isAttachedToMask = 0
	this.guided_heart.layerDepth = 0
	this.guided_heart.layerIndex = 23
	this.guided_heart.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.guided_heart).wait(2).to({_off:true},1).wait(21));

	// next_button_obj_
	this.next_button_1 = new lib.Scene_1_next_button_1();
	this.next_button_1.name = "next_button_1";
	this.next_button_1.setTransform(-0.05,0.05,1,1,0,0,0,-0.1,-0.1);
	this.next_button_1.depth = 0;
	this.next_button_1.isAttachedToCamera = 0
	this.next_button_1.isAttachedToMask = 0
	this.next_button_1.layerDepth = 0
	this.next_button_1.layerIndex = 24
	this.next_button_1.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.next_button_1).wait(2).to({_off:true},1).wait(21));

	// movie_obj_
	this.movie = new lib.Scene_1_movie();
	this.movie.name = "movie";
	this.movie.setTransform(-0.05,0.05,1,1,0,0,0,-0.1,-0.1);
	this.movie.depth = 0;
	this.movie.isAttachedToCamera = 0
	this.movie.isAttachedToMask = 0
	this.movie.layerDepth = 0
	this.movie.layerIndex = 25
	this.movie.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.movie).wait(2).to({_off:true},1).wait(21));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(-838.7,-49.7,2180.6000000000004,1150.8);
// library properties:
lib.properties = {
	id: '23FF6F38CAAC3440A82B4A1D0D1D09E2',
	width: 1024,
	height: 768,
	fps: 24,
	color: "#000000",
	opacity: 1.00,
	manifest: [
		{src:"images/CachedBmp_9.png?1634725457082", id:"CachedBmp_9"},
		{src:"images/CachedBmp_5.png?1634725457082", id:"CachedBmp_5"},
		{src:"images/CachedBmp_7.png?1634725457082", id:"CachedBmp_7"},
		{src:"images/CachedBmp_6.png?1634725457082", id:"CachedBmp_6"},
		{src:"images/MultimediaSystemsProjectBI01_atlas_1.png?1634725456797", id:"MultimediaSystemsProjectBI01_atlas_1"},
		{src:"images/MultimediaSystemsProjectBI01_atlas_2.png?1634725456797", id:"MultimediaSystemsProjectBI01_atlas_2"},
		{src:"images/MultimediaSystemsProjectBI01_atlas_3.png?1634725456802", id:"MultimediaSystemsProjectBI01_atlas_3"},
		{src:"https://code.jquery.com/jquery-3.4.1.min.js?1634725457082", id:"lib/jquery-3.4.1.min.js"},
		{src:"components/sdk/anwidget.js?1634725457082", id:"sdk/anwidget.js"},
		{src:"components/video/src/video.js?1634725457082", id:"an.Video"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['23FF6F38CAAC3440A82B4A1D0D1D09E2'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}

p._getProjectionMatrix = function(container, totalDepth) {	var focalLength = 528.25;
	var projectionCenter = { x : lib.properties.width/2, y : lib.properties.height/2 };
	var scale = (totalDepth + focalLength)/focalLength;
	var scaleMat = new createjs.Matrix2D;
	scaleMat.a = 1/scale;
	scaleMat.d = 1/scale;
	var projMat = new createjs.Matrix2D;
	projMat.tx = -projectionCenter.x;
	projMat.ty = -projectionCenter.y;
	projMat = projMat.prependMatrix(scaleMat);
	projMat.tx += projectionCenter.x;
	projMat.ty += projectionCenter.y;
	return projMat;
}
p._handleTick = function(event) {
	var cameraInstance = exportRoot.___camera___instance;
	if(cameraInstance !== undefined && cameraInstance.pinToObject !== undefined)
	{
		cameraInstance.x = cameraInstance.pinToObject.x + cameraInstance.pinToObject.pinOffsetX;
		cameraInstance.y = cameraInstance.pinToObject.y + cameraInstance.pinToObject.pinOffsetY;
		if(cameraInstance.pinToObject.parent !== undefined && cameraInstance.pinToObject.parent.depth !== undefined)
		cameraInstance.depth = cameraInstance.pinToObject.parent.depth + cameraInstance.pinToObject.pinOffsetZ;
	}
	stage._applyLayerZDepth(exportRoot);
}
p._applyLayerZDepth = function(parent)
{
	var cameraInstance = parent.___camera___instance;
	var focalLength = 528.25;
	var projectionCenter = { 'x' : 0, 'y' : 0};
	if(parent === exportRoot)
	{
		var stageCenter = { 'x' : lib.properties.width/2, 'y' : lib.properties.height/2 };
		projectionCenter.x = stageCenter.x;
		projectionCenter.y = stageCenter.y;
	}
	for(child in parent.children)
	{
		var layerObj = parent.children[child];
		if(layerObj == cameraInstance)
			continue;
		stage._applyLayerZDepth(layerObj, cameraInstance);
		if(layerObj.layerDepth === undefined)
			continue;
		if(layerObj.currentFrame != layerObj.parent.currentFrame)
		{
			layerObj.gotoAndPlay(layerObj.parent.currentFrame);
		}
		var matToApply = new createjs.Matrix2D;
		var cameraMat = new createjs.Matrix2D;
		var totalDepth = layerObj.layerDepth ? layerObj.layerDepth : 0;
		var cameraDepth = 0;
		if(cameraInstance && !layerObj.isAttachedToCamera)
		{
			var mat = cameraInstance.getMatrix();
			mat.tx -= projectionCenter.x;
			mat.ty -= projectionCenter.y;
			cameraMat = mat.invert();
			cameraMat.prependTransform(projectionCenter.x, projectionCenter.y, 1, 1, 0, 0, 0, 0, 0);
			cameraMat.appendTransform(-projectionCenter.x, -projectionCenter.y, 1, 1, 0, 0, 0, 0, 0);
			if(cameraInstance.depth)
				cameraDepth = cameraInstance.depth;
		}
		if(layerObj.depth)
		{
			totalDepth = layerObj.depth;
		}
		//Offset by camera depth
		totalDepth -= cameraDepth;
		if(totalDepth < -focalLength)
		{
			matToApply.a = 0;
			matToApply.d = 0;
		}
		else
		{
			if(layerObj.layerDepth)
			{
				var sizeLockedMat = stage._getProjectionMatrix(parent, layerObj.layerDepth);
				if(sizeLockedMat)
				{
					sizeLockedMat.invert();
					matToApply.prependMatrix(sizeLockedMat);
				}
			}
			matToApply.prependMatrix(cameraMat);
			var projMat = stage._getProjectionMatrix(parent, totalDepth);
			if(projMat)
			{
				matToApply.prependMatrix(projMat);
			}
		}
		layerObj.transformMatrix = matToApply;
	}
}
an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}			
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;			
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});			
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;			
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}

// Virtual camera API : 

an.VirtualCamera = new function() {
var _camera = new Object();
function VC(timeline) {
	this.timeline = timeline;
	this.camera = timeline.___camera___instance;
	this.centerX = lib.properties.width / 2;
	this.centerY = lib.properties.height / 2;
	this.camAxisX = this.camera.x;
	this.camAxisY = this.camera.y;
	if(timeline.___camera___instance == null || timeline.___camera___instance == undefined ) {
		timeline.___camera___instance = new cjs.MovieClip();
		timeline.___camera___instance.visible = false;
		timeline.___camera___instance.parent = timeline;
		timeline.___camera___instance.setTransform(this.centerX, this.centerY);
	}
	this.camera = timeline.___camera___instance;
}

VC.prototype.moveBy = function(x, y, z) {
z = typeof z !== 'undefined' ? z : 0;
	var position = this.___getCamPosition___();
	var rotAngle = this.getRotation()*Math.PI/180;
	var sinTheta = Math.sin(rotAngle);
	var cosTheta = Math.cos(rotAngle);
	var offX= x*cosTheta + y*sinTheta;
	var offY = y*cosTheta - x*sinTheta;
	this.camAxisX = this.camAxisX - x;
	this.camAxisY = this.camAxisY - y;
	var posX = position.x + offX;
	var posY = position.y + offY;
	this.camera.x = this.centerX - posX;
	this.camera.y = this.centerY - posY;
	this.camera.depth += z;
};

VC.prototype.setPosition = function(x, y, z) {
	z = typeof z !== 'undefined' ? z : 0;

	const MAX_X = 10000;
	const MIN_X = -10000;
	const MAX_Y = 10000;
	const MIN_Y = -10000;
	const MAX_Z = 10000;
	const MIN_Z = -5000;

	if(x > MAX_X)
	  x = MAX_X;
	else if(x < MIN_X)
	  x = MIN_X;
	if(y > MAX_Y)
	  y = MAX_Y;
	else if(y < MIN_Y)
	  y = MIN_Y;
	if(z > MAX_Z)
	  z = MAX_Z;
	else if(z < MIN_Z)
	  z = MIN_Z;

	var rotAngle = this.getRotation()*Math.PI/180;
	var sinTheta = Math.sin(rotAngle);
	var cosTheta = Math.cos(rotAngle);
	var offX= x*cosTheta + y*sinTheta;
	var offY = y*cosTheta - x*sinTheta;
	
	this.camAxisX = this.centerX - x;
	this.camAxisY = this.centerY - y;
	this.camera.x = this.centerX - offX;
	this.camera.y = this.centerY - offY;
	this.camera.depth = z;
};

VC.prototype.getPosition = function() {
	var loc = new Object();
	loc['x'] = this.centerX - this.camAxisX;
	loc['y'] = this.centerY - this.camAxisY;
	loc['z'] = this.camera.depth;
	return loc;
};

VC.prototype.resetPosition = function() {
	this.setPosition(0, 0);
};

VC.prototype.zoomBy = function(zoom) {
	this.setZoom( (this.getZoom() * zoom) / 100);
};

VC.prototype.setZoom = function(zoom) {
	const MAX_zoom = 10000;
	const MIN_zoom = 1;
	if(zoom > MAX_zoom)
	zoom = MAX_zoom;
	else if(zoom < MIN_zoom)
	zoom = MIN_zoom;
	this.camera.scaleX = 100 / zoom;
	this.camera.scaleY = 100 / zoom;
};

VC.prototype.getZoom = function() {
	return 100 / this.camera.scaleX;
};

VC.prototype.resetZoom = function() {
	this.setZoom(100);
};

VC.prototype.rotateBy = function(angle) {
	this.setRotation( this.getRotation() + angle );
};

VC.prototype.setRotation = function(angle) {
	const MAX_angle = 180;
	const MIN_angle = -179;
	if(angle > MAX_angle)
		angle = MAX_angle;
	else if(angle < MIN_angle)
		angle = MIN_angle;
	this.camera.rotation = -angle;
};

VC.prototype.getRotation = function() {
	return -this.camera.rotation;
};

VC.prototype.resetRotation = function() {
	this.setRotation(0);
};

VC.prototype.reset = function() {
	this.resetPosition();
	this.resetZoom();
	this.resetRotation();
	this.unpinCamera();
};
VC.prototype.setZDepth = function(zDepth) {
	const MAX_zDepth = 10000;
	const MIN_zDepth = -5000;
	if(zDepth > MAX_zDepth)
		zDepth = MAX_zDepth;
	else if(zDepth < MIN_zDepth)
		zDepth = MIN_zDepth;
	this.camera.depth = zDepth;
}
VC.prototype.getZDepth = function() {
	return this.camera.depth;
}
VC.prototype.resetZDepth = function() {
	this.camera.depth = 0;
}

VC.prototype.pinCameraToObject = function(obj, offsetX, offsetY, offsetZ) {

	offsetX = typeof offsetX !== 'undefined' ? offsetX : 0;

	offsetY = typeof offsetY !== 'undefined' ? offsetY : 0;

	offsetZ = typeof offsetZ !== 'undefined' ? offsetZ : 0;
	if(obj === undefined)
		return;
	this.camera.pinToObject = obj;
	this.camera.pinToObject.pinOffsetX = offsetX;
	this.camera.pinToObject.pinOffsetY = offsetY;
	this.camera.pinToObject.pinOffsetZ = offsetZ;
};

VC.prototype.setPinOffset = function(offsetX, offsetY, offsetZ) {
	if(this.camera.pinToObject != undefined) {
	this.camera.pinToObject.pinOffsetX = offsetX;
	this.camera.pinToObject.pinOffsetY = offsetY;
	this.camera.pinToObject.pinOffsetZ = offsetZ;
	}
};

VC.prototype.unpinCamera = function() {
	this.camera.pinToObject = undefined;
};
VC.prototype.___getCamPosition___ = function() {
	var loc = new Object();
	loc['x'] = this.centerX - this.camera.x;
	loc['y'] = this.centerY - this.camera.y;
	loc['z'] = this.depth;
	return loc;
};

this.getCamera = function(timeline) {
	timeline = typeof timeline !== 'undefined' ? timeline : null;
	if(timeline === null) timeline = exportRoot;
	if(_camera[timeline] == undefined)
	_camera[timeline] = new VC(timeline);
	return _camera[timeline];
}

this.getCameraAsMovieClip = function(timeline) {
	timeline = typeof timeline !== 'undefined' ? timeline : null;
	if(timeline === null) timeline = exportRoot;
	return this.getCamera(timeline).camera;
}
}


// Layer depth API : 

an.Layer = new function() {
	this.getLayerZDepth = function(timeline, layerName)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline." + layerName + ".depth; else 0;";
		return eval(script);
	}
	this.setLayerZDepth = function(timeline, layerName, zDepth)
	{
		const MAX_zDepth = 10000;
		const MIN_zDepth = -5000;
		if(zDepth > MAX_zDepth)
			zDepth = MAX_zDepth;
		else if(zDepth < MIN_zDepth)
			zDepth = MIN_zDepth;
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline." + layerName + ".depth = " + zDepth + ";";
		eval(script);
	}
	this.removeLayer = function(timeline, layerName)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline.removeChild(timeline." + layerName + ");";
		eval(script);
	}
	this.addNewLayer = function(timeline, layerName, zDepth)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		zDepth = typeof zDepth !== 'undefined' ? zDepth : 0;
		var layer = new createjs.MovieClip();
		layer.name = layerName;
		layer.depth = zDepth;
		layer.layerIndex = 0;
		timeline.addChild(layer);
	}
}
function _updateVisibility(evt) {
	if((this.stage == null || this._off || this._lastAddedFrame != this.parent.currentFrame) && this._element && this._element._attached) {
		this._element.detach();
		stage.removeEventListener('drawstart', this._updateVisibilityCbk);
		this._updateVisibilityCbk = false;
	}
}
function _handleDrawEnd(evt) {
	if(this._element && this._element._attached) {
		var props = this.getConcatenatedDisplayProps(this._props), mat = props.matrix;
		var tx1 = mat.decompose(); var sx = tx1.scaleX; var sy = tx1.scaleY;
		var dp = window.devicePixelRatio || 1; var w = this.nominalBounds.width * sx; var h = this.nominalBounds.height * sy;
		mat.tx/=dp;mat.ty/=dp; mat.a/=(dp*sx);mat.b/=(dp*sx);mat.c/=(dp*sy);mat.d/=(dp*sy);
		this._element.setProperty('transform-origin', this.regX + 'px ' + this.regY + 'px');
		var x = (mat.tx + this.regX*mat.a + this.regY*mat.c - this.regX);
		var y = (mat.ty + this.regX*mat.b + this.regY*mat.d - this.regY);
		var tx = 'matrix(' + mat.a + ',' + mat.b + ',' + mat.c + ',' + mat.d + ',' + x + ',' + y + ')';
		this._element.setProperty('transform', tx);
		this._element.setProperty('width', w);
		this._element.setProperty('height', h);
		this._element.update();
	}
}

function _tick(evt) {
	this._lastAddedFrame = this.parent.currentFrame;
	var stage = this.stage;
	stage&&stage.on('drawend', this._handleDrawEnd, this, true);
	if(!this._updateVisibilityCbk) {
		this._updateVisibilityCbk = stage.on('drawstart', this._updateVisibility, this, false);
	}
}
function _componentDraw(ctx) {
	if(this._element && !this._element._attached) {
		this._element.attach($('#dom_overlay_container'));
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused){
			stageChild.syncStreamSounds();
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;