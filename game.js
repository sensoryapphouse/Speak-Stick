var splash;
var button;
var button1;
var button2;
var button3;
var spdSlider;
var panel;
var panelvisible = false;
var settings;
var nouislider;
var progress;
var progressback;
var nouisliderHz;
var progressHz;
var progressbackHz;
var nouisliderz;
var progressz;
var progressbackz;
var home;
var beamSound;
var fallSound;
var isPointerDown = false; // used for mode 4
var mouseDown = false;
let game;
let gameOptions = {
    platformGapRange: [200, 250], // PB 200,400
    platformWidthRange: [150, 300], // PB 50, 150
    platformHeight: 250,
    playerWidth: 32,
    playerHeight: 64,
    poleWidth: 16,
    growTime: 2000,
    rotateTime: 500,
    walkTime: 4, // 3
    fallTime: 500,
    scrollTime: 250
}
const IDLE = 0;
const WAITING = 1;
const GROWING = 2;
const WALKING = 3;
var gameConfig;
var inputMode = 5;
var that;
var isQuiet = false;
var volume = 0;

window.onload = function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./sw.js');
    }

    setUpPanel();
    home = document.querySelector('home');
    home.style.left = "2vw";
    home.hidden = true;
    splash = document.querySelector('splash');
    canvas = document.getElementById('game');
    panel = document.querySelector('panel');
    settings = document.querySelector('settings');
    button = document.querySelector('button');
    button1 = document.querySelector('button1');
    button2 = document.querySelector('button2');
    button3 = document.querySelector('button3');
    home.onmousedown = function (e) {
        event.preventDefault();
        showMenu();
    }

    button.onmousedown = function (e) {
        event.preventDefault();
        e.stopPropagation();
        start(0);
    }
    button1.onmousedown = function (e) {
        event.preventDefault();
        e.stopPropagation();
        start(1);
    }
    button2.onmousedown = function (e) {
        event.preventDefault();
        e.stopPropagation();
        start(2);
    }
    button3.onmousedown = function (e) {
        event.preventDefault();
        e.stopPropagation();
        start(3);
    }



    window.addEventListener("resize", resize, false);

    function Highlight() {
        button.style.opacity = .7;
        button1.style.opacity = .7;
        button2.style.opacity = .7;
        button3.style.opacity = .7;

        switch (menuItem) {
            case 0:
                button.style.opacity = 1.;
                break;
            case 1:
                button1.style.opacity = 1.;
                break;
            case 2:
                button2.style.opacity = 1.;
                break;
            case 3:
                button3.style.opacity = 1.;
                break;
        }
    }

    var menuItem = 0;

    function showPressedButton(index) {
        if (!splash.hidden) { // splash screen
            switch (index) {
                case 0: // A
                case 1: // B
                case 2: // X
                case 3: // Y
                    start(menuItem);
                    break;
                case 12: // dup
                    if (menuItem >= 2)
                        menuItem -= 2;
                    Highlight();
                    break;
                case 13: // ddown
                    if (menuItem < 3)
                        menuItem += 2;
                    Highlight();
                    break;
                case 14: // dleft
                    if (menuItem > 0)
                        menuItem--;
                    Highlight();
                    break;
                case 15: // dright
                    if (menuItem < 4)
                        menuItem++;
                    Highlight();
                    break;
            }
        } else {
            switch (index) {
                case 8:
                case 9:
                case 0: // A
                case 14: // LEFT
                case 4: // LT
                case 6: //
                case 1: // B
                case 15: // RIGHT
                case 5: // RT
                case 7: //
                case 2: // X
                case 12: // dpad 
                case 3: // Y
                case 13:
                    that.pointerdown();
                    break;
                case 10: // XBox
                    showMenu();
                    break;
                default:
            }
        }
    }

    function removePressedButton(index) {
        try {
            switch (index) {
                case 8:
                case 9:
                case 0: // A
                case 14: // LEFT
                case 4: // LT
                case 6: //
                case 1: // B
                case 15: // RIGHT
                case 5: // RT
                case 7: //
                case 2: // X
                case 12: // dpad 
                case 3: // Y
                case 13:
                    that.pointerup();
                    break;
                default:
            }
        } catch (e) {}
    }

    var gpad;

    gamepads.addEventListener('connect', e => {
        console.log('Gamepad connected:');
        console.log(e.gamepad);
        gpad = e.gamepad;
        e.gamepad.addEventListener('buttonpress', e => showPressedButton(e.index));
        e.gamepad.addEventListener('buttonrelease', e => removePressedButton(e.index));
    });

    gamepads.addEventListener('disconnect', e => {
        console.log('Gamepad disconnected:');
        console.log(e.gamepad);
    });

    gamepads.start();

}

function setUpPanel() {
    panel = document.querySelector('panel');
    settings = document.querySelector('settings');
    panel.style.left = "130vw";
    panel.hidden = true;
    slideTo(panel, 130);
    mute = document.createElement("INPUT");
    mute.style.position = "absolute";
    mute.style.height = "3vh";
    mute.style.width = "3vw";
    mute.style.left = "18vw";
    mute.style.top = "2.5vh";
    mute.checked = false;
    mute.setAttribute("type", "checkbox");
    mute.checked = false;
    //    spdSlider = document.createElement("INPUT");
    //    spdSlider.setAttribute("type", "range");
    //    spdSlider.style.position = "absolute";
    //    spdSlider.style.height = "2vh";
    //    spdSlider.style.width = "18vw";
    //    spdSlider.style.left = "5vw";
    //    spdSlider.style.top = "9.5vh";
    //    spdSlider.style.color = 'green';
    //    spdSlider.value = 3;
    //    spdSlider.min = 1;
    //    spdSlider.max = 4;

    panel.appendChild(mute);
    //panel.appendChild(spdSlider);

    nouislider = document.createElement("LABEL");
    progress = document.createElement("LABEL");
    progressback = document.createElement("LABEL");
    nouisliderHz = document.createElement("LABEL");
    progressHz = document.createElement("LABEL");
    progressbackHz = document.createElement("LABEL");
    nouisliderz = document.createElement("LABEL");
    progressz = document.createElement("LABEL");
    progressbackz = document.createElement("LABEL");

    noUiSlider.create(nouislider, {
        start: [10, 100],
        connect: true,
        step: 1,
        range: {
            'min': 1,
            'max': 100
        },
        // make numbers whole
        format: {
            to: value => value,
            from: value => value
        }
    });
    progressback.style.position = "absolute";
    progressback.style.borderRadius = "15%";
    progressback.style.height = "2vh";
    progressback.style.width = "18vw";
    progressback.style.left = "5vw";
    progressback.style.top = "10vh";
    progressback.style.backgroundColor = 'lightgrey';

    progress.style.position = "absolute";
    progress.style.borderRadius = "15%";
    progress.style.height = "2vh";
    progress.style.width = "0vw";
    progress.style.left = "5vw";
    progress.style.top = "10vh";
    progress.style.backgroundColor = 'royalblue';

    nouislider.style.position = "absolute";
    nouislider.style.height = "2vh";
    nouislider.style.width = "18vw";
    nouislider.style.left = "5vw";
    nouislider.style.top = "10vh";

    noUiSlider.create(nouisliderHz, {
        start: [0, 400],
        connect: true,
        step: 10,
        range: {
            'min': 1,
            'max': 500
        },
        // make numbers whole
        format: {
            to: value => value,
            from: value => value
        }
    });
    progressbackHz.style.position = "absolute";
    progressbackHz.style.borderRadius = "15%";
    progressbackHz.style.height = "2vh";
    progressbackHz.style.width = "18vw";
    progressbackHz.style.left = "5vw";
    progressbackHz.style.top = "17vh";
    progressbackHz.style.backgroundColor = 'lightgrey';

    progressHz.style.position = "absolute";
    progressHz.style.borderRadius = "15%";
    progressHz.style.height = "2vh";
    progressHz.style.width = "0vw";
    progressHz.style.left = "5vw";
    progressHz.style.top = "17vh";
    progressHz.style.backgroundColor = 'royalblue';

    nouisliderHz.style.position = "absolute";
    nouisliderHz.style.height = "2vh";
    nouisliderHz.style.width = "18vw";
    nouisliderHz.style.left = "5vw";
    nouisliderHz.style.top = "17vh";

    noUiSlider.create(nouisliderz, {
        start: [2000, 8000],
        connect: true,
        step: 100,
        range: {
            'min': 1000,
            'max': 8000
        },
        // make numbers whole
        format: {
            to: value => value,
            from: value => value
        }
    });
    progressbackz.style.position = "absolute";
    progressbackz.style.borderRadius = "15%";
    progressbackz.style.height = "2vh";
    progressbackz.style.width = "18vw";
    progressbackz.style.left = "5vw";
    progressbackz.style.top = "24vh";
    progressbackz.style.backgroundColor = 'lightgrey';

    progressz.style.position = "absolute";
    progressz.style.borderRadius = "15%";
    progressz.style.height = "2vh";
    progressz.style.width = "0vw";
    progressz.style.left = "5vw";
    progressz.style.top = "24vh";
    progressz.style.backgroundColor = 'royalblue';

    nouisliderz.style.position = "absolute";
    nouisliderz.style.height = "2vh";
    nouisliderz.style.width = "18vw";
    nouisliderz.style.left = "5vw";
    nouisliderz.style.top = "24vh";

    s1 = document.createElement("INPUT");
    s1.style.position = "absolute";
    s1.style.height = "2vh";
    s1.style.width = "2vw";
    s1.style.left = "0px";
    s1.style.top = "9.5vh";
    s2 = document.createElement("INPUT");
    s2.style.position = "absolute";
    s2.style.height = "2vh";
    s2.style.width = "2vw";
    s2.style.left = "0px";
    s2.style.top = "16.5vh";
    s3 = document.createElement("INPUT");
    s3.style.position = "absolute";
    s3.style.height = "2vh";
    s3.style.width = "2vw";
    s3.style.left = "0px";
    s3.style.top = "23.5vh";
    s4 = document.createElement("INPUT");
    s4.style.position = "absolute";
    s4.style.height = "2vh";
    s4.style.width = "2vw";
    s4.style.left = "0px";
    s4.style.top = "30.5vh";
    s5 = document.createElement("INPUT");
    s5.style.position = "absolute";
    s5.style.height = "2vh";
    s5.style.width = "2vw";
    s5.style.left = "0px";
    s5.style.top = "37.5vh";
    s1.setAttribute("type", "radio");
    s2.setAttribute("type", "radio");
    s3.setAttribute("type", "radio");
    s4.setAttribute("type", "radio");
    s5.setAttribute("type", "radio");
    s5.checked = true;

    function switchOption(i) {
        progress.style.backgroundColor = 'grey';
        progressHz.style.backgroundColor = 'grey';
        progressz.style.backgroundColor = 'grey';
        inputMode = i;
        s1.checked = s2.checked = s3.checked = s4.checked = s5.checked = false;
        switch (i) {
            case 1:
                s1.checked = true;
                localStorage.setItem("SpeakStick.mode", 1);
                progress.style.backgroundColor = 'royalblue';
                break;
            case 2:
                s2.checked = true;
                localStorage.setItem("SpeakStick.mode", 2);
                progress.style.backgroundColor = 'royalblue';
                progressHz.style.backgroundColor = 'royalblue';
                break;
            case 3:
                s3.checked = true;
                localStorage.setItem("SpeakStick.mode", 3);
                progress.style.backgroundColor = 'royalblue';
                progressz.style.backgroundColor = 'royalblue';
                break;
            case 4:
                s4.checked = true;
                localStorage.setItem("SpeakStick.mode", 4);
                break;
            case 5:
                s5.checked = true;
                localStorage.setItem("SpeakStick.mode", 5);
                progress.style.backgroundColor = 'grey';
                progressHz.style.backgroundColor = 'grey';
                progressz.style.backgroundColor = 'grey';
                break;
        }
    }

    s1.onclick = function (e) {
        e.stopPropagation();
        switchOption(1);
    }
    s2.onclick = function (e) {
        e.stopPropagation();
        switchOption(2);
    }
    s3.onclick = function (e) {
        e.stopPropagation();
        switchOption(3);
    }
    s4.onclick = function (e) {
        e.stopPropagation();
        switchOption(4);
    }
    s5.onclick = function (e) {
        e.stopPropagation();
        switchOption(5);
    }

    panel.appendChild(progressback);
    panel.appendChild(progress);
    panel.appendChild(nouislider);
    panel.appendChild(progressbackHz);
    panel.appendChild(progressHz);
    panel.appendChild(nouisliderHz);
    panel.appendChild(progressbackz);
    panel.appendChild(progressz);
    panel.appendChild(nouisliderz);
    panel.appendChild(s1);
    panel.appendChild(s2);
    panel.appendChild(s3);
    panel.appendChild(s4);
    panel.appendChild(s5);

    settings.style.left = "94vw";
    // Retrieve settings

    var s = parseInt(localStorage.getItem("SpeakStick.mode"));
    if (s < 1 || s > 5 || isNaN(s))
        s = 5;
    switchOption(s);

    s = localStorage.getItem("SpeakStick.mute");
    mute.checked = (s == "true");

    mute.onclick = function (e) {
        e.stopPropagation();
        localStorage.setItem("SpeakStick.mute", mute.checked);
    }

    panel.onmousedown = function (e) { // speed, paddle size, ball size
        e.stopPropagation();
    }
    panel.onmouseup = function (e) { // speed, paddle size, ball size
        e.stopPropagation();
    }

    s = parseInt(localStorage.getItem("SpeakStick.slider1a"));
    nouislider.noUiSlider.set([localStorage.getItem("SpeakStick.slider1a"), localStorage.getItem("SpeakStick.slider1b")]);
    nouisliderHz.noUiSlider.set([localStorage.getItem("SpeakStick.slider2a"), localStorage.getItem("SpeakStick.slider2b")]);
    nouisliderz.noUiSlider.set([localStorage.getItem("SpeakStick.slider3a"), localStorage.getItem("SpeakStick.slider3b")]);
    nouislider.noUiSlider.on('change', saveSliders);
    nouisliderHz.noUiSlider.on('change', saveSliders);
    nouisliderz.noUiSlider.on('change', saveSliders);

    function saveSliders() {
        localStorage.setItem("SpeakStick.slider1a", nouislider.noUiSlider.get()[0]);
        localStorage.setItem("SpeakStick.slider1b", nouislider.noUiSlider.get()[1]);
        localStorage.setItem("SpeakStick.slider2a", nouisliderHz.noUiSlider.get()[0]);
        localStorage.setItem("SpeakStick.slider2b", nouisliderHz.noUiSlider.get()[1]);
        localStorage.setItem("SpeakStick.slider3a", nouisliderz.noUiSlider.get()[0]);
        localStorage.setItem("SpeakStick.slider3b", nouisliderz.noUiSlider.get()[1]);
    }

    settings.onmousedown = function (e) {
        //        e.stopPropagation();
        if (audioContext == null)
            startAudio();
        if (panelvisible) { // save stored values
            panel.hidden = true;
            slideTo(panel, 130);
            slideTo(settings, 94);
        } else {
            slideTo(panel, 75);
            slideTo(settings, 76);
            panel.hidden = false;
        }
        panelvisible = !panelvisible;
    }

    function slideTo(el, left) {
        var steps = 5;
        var timer = 50;
        var elLeft = parseInt(el.style.left) || 0;
        var diff = left - elLeft;
        var stepSize = diff / steps;
        console.log(stepSize, ", ", steps);

        function step() {
            elLeft += stepSize;
            el.style.left = elLeft + "vw";
            if (--steps) {
                setTimeout(step, timer);
            }
        }
        step();
    }
}


function hideMenu() {
    splash.hidden = true;
    button.hidden = true;
    button1.hidden = true;
    button2.hidden = true;
    button3.hidden = true;
    inMenu = false;
    home.hidden = false;
}

function showMenu() {
    // also stop game playing
    splash.hidden = false;
    button.hidden = false;
    button1.hidden = false;
    button2.hidden = false;
    button3.hidden = false;
    home.hidden = true;
    inMenu = true;
    try {
        game.destroy(true);
    } catch (e) {};
}

function start(i) {
    if (audioContext == null)
        startAudio();
    gameNo = i;
    var w = window.innerWidth;
    var h = window.innerHeight;
    gameConfig = {
        type: Phaser.AUTO,
        width: 1600,
        height: 1600 * h / w,
        scene: [playGame],
        backgroundColor: 0x0000,
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
    resize();
    window.focus();
    if (gameNo >= 0)
        hideMenu();
}

var bgtile;
var bgposition = 0;
var tweeningPlatform = false;
class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    preload() {
        this.load.audio("fall", "sounds/fall.mp3");
        this.load.audio("beam", "sounds/bang.mp3");
        switch (gameNo) {
            case 0: // no coin, train, cars etc in mountains, 
                this.load.image("ground", "assets/Ground/5007.png");
                this.load.image("coin", "assets/coin.png");
                this.load.image("player", "assets/Players/1 torex-earth-mover.png");
                this.load.image("branch", "assets/Beams/beam.png");
                this.load.image('bgtile', 'assets/Backgrounds/1 sky.jpg');
                gameOptions = {
                    platformGapRange: [200, 200], // PB 200,400
                    platformWidthRange: [200, 200], // PB 50, 150
                    platformHeight: 250,
                    playerWidth: 32,
                    playerHeight: 64,
                    poleWidth: 16,
                    growTime: 1500,
                    rotateTime: 500,
                    walkTime: 4, // 3
                    fallTime: 1000,
                    scrollTime: 250
                }
                break;
            case 1: // no coin, monkey, hippo etc and falling trees
                this.load.image("ground", "assets/Ground/ground.png");
                this.load.image("coin", "assets/coin.png");
                this.load.image("player", "assets/Players/2 hippo.png");
                this.load.image("branch", "assets/Beams/branch.png");
                this.load.image('bgtile', 'assets/Backgrounds/2 5015.png');
                gameOptions = {
                    platformGapRange: [200, 300], // PB 200,400
                    platformWidthRange: [200, 250], // PB 50, 150
                    platformHeight: 250,
                    playerWidth: 32,
                    playerHeight: 64,
                    poleWidth: 16,
                    growTime: 1500,
                    rotateTime: 500,
                    walkTime: 4, // 3
                    fallTime: 1000,
                    scrollTime: 250
                }
                break;
            case 2: // coins to space and robots
                this.load.image("ground", "assets/Ground/metal2.png");
                this.load.image("coin", "assets/coin.png");
                this.load.image("player", "assets/Players/3 CipyRoue.png");
                this.load.image("branch", "assets/Beams/ooze2.png");
                this.load.image('bgtile', 'assets/Backgrounds/3 cyberglow.png');
                gameOptions = {
                    platformGapRange: [200, 350], // PB 200,400
                    platformWidthRange: [150, 200], // PB 50, 150
                    platformHeight: 250,
                    playerWidth: 32,
                    playerHeight: 64,
                    poleWidth: 16,
                    growTime: 1000,
                    rotateTime: 500,
                    walkTime: 4, // 3
                    fallTime: 1000,
                    scrollTime: 250
                }
                break;
            case 3: // ghost and spooky
                this.load.image("ground", "assets/Ground/ground3.png");
                this.load.image("coin", "assets/coin.png");
                this.load.image("player", "assets/Players/4 ghost yellow.png");
                this.load.image("branch", "assets/Beams/goo-rope.png");
                this.load.image('bgtile', 'assets/Backgrounds/4 ghosts.jpg');
                gameOptions = {
                    platformGapRange: [200, 400], // PB 200,400
                    platformWidthRange: [150, 200], // PB 50, 150
                    platformHeight: 250,
                    playerWidth: 32,
                    playerHeight: 64,
                    poleWidth: 16,
                    growTime: 1000,
                    rotateTime: 500,
                    walkTime: 4, // 3
                    fallTime: 1000,
                    scrollTime: 250
                }
                break;
        }
    }
    create() {
        that = this;
        fallSound = this.sound.add('fall');
        beamSound = this.sound.add('beam');
        //        bgtile = this.add.tileSprite(0, 0, this.stage.bounds.width, this.cache.getImage('bgtile').height, 'bgtile');
        bgtile = this.add.tileSprite(0, 0, gameConfig.width * 2, gameConfig.height * 2, "bgtile");
        //        bgtile.scale.setTo(2, 2)
        //        this.addCoin();
        this.addPlatforms();
        this.addPole();
        this.addPlayer();
        this.input.on("pointerdown", this.pointerdown, this);
        this.input.on("pointerup", this.pointerup, this);
        this.input.keyboard.on('keydown', this.pointerdown, this);
        this.input.keyboard.on('keyup', this.pointerup, this);
        var keyESC = this.input.keyboard.addKey('ESC'); // Get key object
        keyESC.on('down', showMenu);
    }
    pointerdown() {
        //        if (panelvisible)
        //            return;
        mouseDown = true;
        if (inputMode == 4) {
            if (isPointerDown)
                this.stop();
            else
                this.grow();
            isPointerDown = !isPointerDown;
        } else
            this.grow();
    }
    pointerup() {
        //        if (panelvisible)
        //            return;
        mouseDown = false;
        if (inputMode != 4)
            this.stop();
    }
    addPlatforms() {
        this.mainPlatform = 0;
        this.platforms = [];
        this.platforms.push(this.addPlatform(10));
        this.platforms.push(this.addPlatform(game.config.width));
        this.tweenPlatform();
    }
    addPlatform(posX) {
        let platform = this.add.sprite(posX, game.config.height - gameOptions.platformHeight, "ground");
        platform.displayWidth = (gameOptions.platformWidthRange[0] + gameOptions.platformWidthRange[1]) / 2;
        platform.displayHeight = gameOptions.platformHeight;
        platform.alpha = 1;
        platform.setOrigin(0, 0);
        return platform
    }
    addCoin() {
        this.coin = this.add.sprite(0, game.config.height - gameOptions.platformHeight - gameOptions.playerHeight * 3, "coin");
        this.coin.visible = false;
    }
    placeCoin() {
        this.coin.x = Phaser.Math.Between(this.platforms[this.mainPlatform].getBounds().right + 10, this.platforms[1 - this.mainPlatform].getBounds().left - 10);
        this.coin.visible = true;
    }
    tweenPlatform() {
        tweeningPlatform = true;
        let destination = this.platforms[this.mainPlatform].displayWidth + Phaser.Math.Between(gameOptions.platformGapRange[0], gameOptions.platformGapRange[1]);
        let size = Phaser.Math.Between(gameOptions.platformWidthRange[0], gameOptions.platformWidthRange[1]);
        this.tweens.add({
            targets: [this.platforms[1 - this.mainPlatform]],
            x: destination,
            displayWidth: size,
            duration: gameOptions.scrollTime,
            callbackScope: this,
            onComplete: function () {
                this.gameMode = WAITING;
                tweeningPlatform = false;
                //                this.placeCoin(); // PB lose coin
            }
        })
    }
    addPlayer() {
        this.player = this.add.sprite(this.platforms[this.mainPlatform].displayWidth - gameOptions.poleWidth, game.config.height - gameOptions.platformHeight, "player");
        this.player.setOrigin(1, 1)
    }
    addPole() {
        this.pole = this.add.sprite(this.platforms[this.mainPlatform].displayWidth + 5, game.config.height - gameOptions.platformHeight + gameOptions.poleWidth / 2, "branch");
        this.pole.setOrigin(1, 1);
        this.pole.displayWidth = gameOptions.poleWidth;
        this.pole.displayHeight = gameOptions.playerHeight / 4;
    }
    grow() {
        if (this.gameMode == WAITING) {
            this.gameMode = GROWING;
            this.growTween = this.tweens.add({
                targets: [this.pole],
                displayHeight: gameOptions.platformGapRange[1] + gameOptions.platformWidthRange[1],
                duration: gameOptions.growTime
            });
        }
        if (this.gameMode == WALKING) {
            if (this.player.flipY) {
                //                this.player.flipY = false;
                //                this.player.y = game.config.height - gameOptions.platformHeight;
            } else {
                //                this.player.flipY = true;
                //                this.player.y = game.config.height - gameOptions.platformHeight + gameOptions.playerHeight - gameOptions.poleWidth;
                //                let playerBound = this.player.getBounds();
                //                let platformBound = this.platforms[1 - this.mainPlatform].getBounds();
                //                if (Phaser.Geom.Rectangle.Intersection(playerBound, platformBound).width != 0) {
                //                    this.player.flipY = false;
                //                    this.player.y = game.config.height - gameOptions.platformHeight;
                //                }
            }
        }
    }
    stop() {
        if (this.gameMode == GROWING) {
            this.gameMode = IDLE;
            this.growTween.stop();
            if (this.pole.displayHeight > this.platforms[1 - this.mainPlatform].x - this.pole.x) {
                this.time.addEvent({
                    delay: gameOptions.rotateTime * .6,
                    callback: this.beam,
                    callbackScope: this
                });
                this.tweens.add({
                    targets: [this.pole],
                    angle: 90,
                    duration: gameOptions.rotateTime,
                    ease: "Bounce.easeOut",
                    callbackScope: this,
                    onComplete: function () {
                        this.gameMode = WALKING;
                        if (this.pole.displayHeight < this.platforms[1 - this.mainPlatform].x + this.platforms[1 - this.mainPlatform].displayWidth - this.pole.x) {
                            this.walkTween = this.tweens.add({
                                targets: [this.player],
                                x: this.platforms[1 - this.mainPlatform].x + this.platforms[1 - this.mainPlatform].displayWidth - this.pole.displayWidth,
                                duration: gameOptions.walkTime * this.pole.displayHeight,
                                callbackScope: this,
                                onComplete: function () {
                                    //                                    this.coin.visible = false;
                                    this.tweens.add({
                                        targets: [this.player, this.pole, this.platforms[1 - this.mainPlatform], this.platforms[this.mainPlatform]],
                                        props: {
                                            x: {
                                                value: "-= " + (this.platforms[1 - this.mainPlatform].x - 10)
                                            }
                                        },
                                        duration: gameOptions.scrollTime,
                                        callbackScope: this,
                                        onComplete: function () {
                                            this.prepareNextMove();
                                        }
                                    })
                                }
                            })
                        } else {
                            this.platformTooLong();
                        }
                    }
                })
            } else {
                this.platformTooShort();
            }
        }
    }
    beam() {
        if (!mute.checked)
            beamSound.play();
    }
    fall() {
        if (!mute.checked)
            fallSound.play();
    }
    platformTooLong() {
        this.walkTween = this.tweens.add({
            targets: [this.player],
            x: this.pole.x + this.pole.displayHeight + this.player.displayWidth,
            duration: gameOptions.walkTime * this.pole.displayHeight,
            callbackScope: this,
            onComplete: function () {
                this.fallAndDie();
            }
        })
    }
    platformTooShort() {
        this.tweens.add({
            targets: [this.pole],
            angle: 90,
            duration: gameOptions.rotateTime,
            ease: "Cubic.easeIn",
            callbackScope: this,
            onComplete: function () {
                this.gameMode = WALKING;
                this.tweens.add({
                    targets: [this.player],
                    x: this.pole.x + this.pole.displayHeight,
                    duration: gameOptions.walkTime * this.pole.displayHeight,
                    callbackScope: this,
                    onComplete: function () {
                        this.tweens.add({
                            targets: [this.pole],
                            angle: 180,
                            duration: gameOptions.rotateTime,
                            ease: "Cubic.easeIn"
                        })
                        this.fallAndDie();
                    }
                })
            }
        })
    }
    fallAndDie() {
        this.time.addEvent({
            delay: gameOptions.fallTime / 2,
            callback: this.fall,
            callbackScope: this
        });
        this.gameMode = IDLE;
        this.tweens.add({
            targets: [this.player],
            y: game.config.height + this.player.displayHeight * 2,
            duration: gameOptions.fallTime,
            ease: "Cubic.easeIn",
            callbackScope: this,
            onComplete: function () {
                this.shakeAndRestart();
            }
        })
    }
    prepareNextMove() {
        this.gameMode = IDLE;
        this.platforms[this.mainPlatform].x = game.config.width;
        this.mainPlatform = 1 - this.mainPlatform;
        this.tweenPlatform();
        this.pole.angle = 0;
        this.pole.x = this.platforms[this.mainPlatform].displayWidth + 5;
        this.pole.displayHeight = gameOptions.poleWidth;
    }
    shakeAndRestart() {
        this.cameras.main.shake(800, 0.01);
        this.time.addEvent({
            delay: 2000,
            callbackScope: this,
            callback: function () {
                this.scene.start("PlayGame");
            }
        })
    }
    update() {
        if (this.gameMode == WALKING)
            bgtile.setTilePosition(bgposition++);
        if (tweeningPlatform) {
            bgtile.setTilePosition(bgposition++);
        }
        if (this.player.flipY) {
            let playerBound = this.player.getBounds();
            let coinBound = this.coin.getBounds();
            let platformBound = this.platforms[1 - this.mainPlatform].getBounds();
            if (Phaser.Geom.Rectangle.Intersection(playerBound, platformBound).width != 0) {
                this.walkTween.stop();
                this.gameMode = IDLE;
                this.shakeAndRestart();
            }
            //            if (this.coin.visible && Phaser.Geom.Rectangle.Intersection(playerBound, coinBound).width != 0) {
            //                this.coin.visible = false;
            //            }
        }
        if (inputMode < 4 && !mouseDown) { // audio control
            if (smoothMax == 0)
                volume = 0;
            else if (smoothMax > nouislider.noUiSlider.get()[1] || smoothMax < nouislider.noUiSlider.get()[0])
                volume = 0;
            else {
                volume = 1;
            }
            //            if (isQuiet && volume == 1)
            //                that.grow();
            //            if (!isQuiet && volume == 0)
            //                that.stop();

            if (volume == 1) {
                switch (inputMode) {
                    case 1: // volume
                        that.grow();
                        break;
                    case 2: // pitch
                        if (Pitch == 0)
                            that.stop();
                        else if (Pitch > nouisliderHz.noUiSlider.get()[0] && Pitch < nouisliderHz.noUiSlider.get()[1])
                            that.grow();
                        break;
                    case 3: // fricative
                        if (fricValue < nouisliderz.noUiSlider.get()[1] && fricValue > nouisliderz.noUiSlider.get()[0]) {
                            that.grow();
                        } else
                            that.stop();
                        break;
                }
            }
            if (!isQuiet && volume == 0)
                that.stop();
            isQuiet = (volume == 0);
            console.log("update", isQuiet, volume)
        }
    }
};

function resize() {
    let canvas = document.querySelector("canvas");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let windowRatio = windowWidth / windowHeight;
    try {
        let gameRatio = game.config.width / game.config.height;
        if (windowRatio < gameRatio) {
            canvas.style.width = windowWidth + "px";
            canvas.style.height = (windowWidth / gameRatio) + "px";
        } else {
            canvas.style.width = (windowHeight * gameRatio) + "px";
            canvas.style.height = windowHeight + "px";
        }
    } catch (e) {}
}
