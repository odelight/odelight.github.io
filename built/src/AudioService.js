export class AudioService {
    static playErrorSound() {
        if (AudioService.muted) {
            return;
        }
        var clonedNode = this.ErrorSound.cloneNode();
        clonedNode.volume = 0.35;
        clonedNode.play();
    }
    static playBuildTetradSound() {
        if (AudioService.muted) {
            return;
        }
        this.buildTetradSound.cloneNode().play();
    }
    static playEliteTetradSound() {
        if (AudioService.muted) {
            return;
        }
        this.EliteTetradSound.cloneNode().play();
    }
    static playVictorySound() {
        if (AudioService.muted) {
            return;
        }
        this.stopMusic();
        this.victorySound.play();
    }
    static playDefeatSound() {
        if (AudioService.muted) {
            return;
        }
        this.stopMusic();
        this.defeatSound.play();
    }
    static playMusicForLevel(levelIndex) {
        if (AudioService.muted) {
            return;
        }
        if (!this.audioPlaying) {
            if (levelIndex < 5) {
                this.playMusic(this.audio[0]);
            }
            else {
                this.playMusic(this.audio[1]);
            }
        }
    }
    static stopMusic() {
        if (AudioService.muted) {
            return;
        }
        for (var i = 0; i < this.audio.length; i++) {
            this.audio[i].pause();
        }
        this.audioPlaying = false;
    }
    static playMusic(audio) {
        if (AudioService.muted) {
            return;
        }
        audio.loop = true;
        var playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => this.audioPlaying = true).catch(() => {
                setTimeout(() => this.playMusic(audio), 100);
            });
        }
    }
}
AudioService.audio = [new Audio('https://cdn.rawgit.com/odelight/tetradefense-deploy/2a15a8a2/resources/Journey.mp3'), new Audio('https://cdn.rawgit.com/odelight/tetradefense-deploy/3c14b21e/resources/Dixie.mp3')];
AudioService.victorySound = new Audio('https://cdn.rawgit.com/odelight/tetradefense-deploy/1c5d275a/resources/Victory.mp3');
AudioService.defeatSound = new Audio('https://cdn.rawgit.com/odelight/tetradefense-deploy/45552d4c/resources/Defeat.mp3');
AudioService.buildTetradSound = new Audio('https://cdn.rawgit.com/odelight/tetradefense-deploy/45552d4c/resources/Build_Tetrad.mp3');
AudioService.EliteTetradSound = new Audio('https://cdn.rawgit.com/odelight/tetradefense-deploy/45552d4c/resources/Elite_Tetrad.mp3');
AudioService.ErrorSound = new Audio('https://cdn.rawgit.com/odelight/tetradefense-deploy/f537c382/resources/Error.mp3');
AudioService.audioPlaying = false;
AudioService.muted = true;
