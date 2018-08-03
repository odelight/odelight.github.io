export class AudioService {
    static setMusicOn(musicOn) {
        AudioService.musicOn = musicOn;
        if (musicOn == true) {
            this.playMusic();
        }
        else {
            this.stopMusic();
        }
    }
    static setSoundEffectsOn(soundEffectsOn) {
        AudioService.soundEffectsOn = soundEffectsOn;
    }
    static playErrorSound() {
        if (!AudioService.soundEffectsOn) {
            return;
        }
        var clonedNode = this.ErrorSound.cloneNode();
        clonedNode.volume = 0.35;
        clonedNode.play();
    }
    static playBuildTetradSound() {
        if (!AudioService.soundEffectsOn) {
            return;
        }
        this.buildTetradSound.cloneNode().play();
    }
    static playEliteTetradSound() {
        if (!AudioService.soundEffectsOn) {
            return;
        }
        this.EliteTetradSound.cloneNode().play();
    }
    static playVictorySound() {
        if (!AudioService.soundEffectsOn) {
            return;
        }
        this.stopMusic();
        this.victorySound.muted = false;
        this.victorySound.play();
    }
    static playDefeatSound() {
        if (!AudioService.soundEffectsOn) {
            return;
        }
        this.stopMusic();
        this.defeatSound.muted = false;
        this.defeatSound.play();
    }
    static playMusicForLevel(levelIndex) {
        if (!AudioService.musicOn) {
            return;
        }
        var newTrack;
        if (levelIndex < 3) {
            newTrack = 0;
        }
        else if (levelIndex < 6) {
            newTrack = 1;
        }
        else {
            newTrack = 2;
        }
        this.currentTrack = newTrack;
        this.stopMusic();
        this.playMusic();
    }
    static stopMusic() {
        for (var i = 0; i < this.audio.length; i++) {
            this.audio[i].pause();
        }
        this.defeatSound.muted = true;
        this.victorySound.muted = true;
        this.audioPlaying = false;
    }
    static playMusic() {
        if (!AudioService.musicOn || this.currentTrack < 0) {
            return;
        }
        var audio = this.audio[this.currentTrack];
        audio.loop = true;
        var playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => this.audioPlaying = true).catch(() => {
                setTimeout(() => this.playMusic(), 100);
            });
        }
    }
}
AudioService.musicOn = true;
AudioService.soundEffectsOn = true;
AudioService.audio = [new Audio('https://cdn.rawgit.com/odelight/tetradefense-deploy/2a15a8a2/resources/Journey.mp3'),
    new Audio('https://cdn.rawgit.com/odelight/tetradefense-deploy/3c14b21e/resources/Dixie.mp3'),
    new Audio('https://cdn.rawgit.com/odelight/tetradefense-deploy/dc5dd7b8/resources/Breeze.mp3')];
AudioService.victorySound = new Audio('https://cdn.rawgit.com/odelight/tetradefense-deploy/1c5d275a/resources/Victory.mp3');
AudioService.defeatSound = new Audio('https://cdn.rawgit.com/odelight/tetradefense-deploy/45552d4c/resources/Defeat.mp3');
AudioService.buildTetradSound = new Audio('https://cdn.rawgit.com/odelight/tetradefense-deploy/45552d4c/resources/Build_Tetrad.mp3');
AudioService.EliteTetradSound = new Audio('https://cdn.rawgit.com/odelight/tetradefense-deploy/45552d4c/resources/Elite_Tetrad.mp3');
AudioService.ErrorSound = new Audio('https://cdn.rawgit.com/odelight/tetradefense-deploy/f537c382/resources/Error.mp3');
AudioService.audioPlaying = false;
AudioService.currentTrack = -1;
