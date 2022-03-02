import Phaser from 'phaser';
import Player from './game/Player';
import Animations from './helpers/animations';
import GameOver from './scenes/GameOver'
import BootScene from './scenes/BootScene';
import TitleScene from './scenes/TitleScene';
import ParallaxScene from './helpers/paralaxscene.js';
import Platforms from './game/platform'
import MovingPlatforms from './game/movingplatform'
import Clouds from './game/clouds';
import RainClouds from './game/rainclouds'
import Rains from './helpers/rain'
import BackgroundImg from'./assets/desert-background.png';
import LogoImg from './assets/logo.png';
import Sky from './assets/sky.png';
import Mountains from './assets/mountains.png';
import Plateau from'./assets/plateau.png';

import matrixFont from './assets/knighthawks-font.png';
import GroundImg from './assets/ground_sand_broken_wall.png';
import GroundSandImg from './assets/ground_sand.png'
import GroundGrassImg from './assets/ground_grass-img.png'
import PlatformImg from './assets/ground_sand_broken.png';
import PlayerImg from './assets/characterSheet.png';
import Rain from './assets/rain3.png';
import CloudsImg from './assets/clouds.png';
import RainCloudsImg from './assets/clouds.png';
import { SetXY } from 'phaser/src/actions';

import JumpSound from './assets/sfx/jump.wav';
import ClingSound from './assets/sfx/cling.wav';
import PlayerDieSound from './assets/sfx/playerdied.mp3';
import PowerupSound from './assets/sfx/powerup.wav';

import Trees from './ForestHikerMod/Assets/Trees.png';
import Rocks from './ForestHikerMod/Assets/Rocks.png';
import ForrestBgImg from './ForestHikerMod/Assets/forest-bg.png';
import ForestSky from './ForestHikerMod/Assets/sky.png';
import ForestHaze from './ForestHikerMod/Assets/forest-haze.png';
import ForestGroundImg from './ForestHikerMod/Assets/forest-ground_sand_broken_wall.png';
import ForestPlatformImg from './ForestHikerMod/Assets/forest-ground_sand_broken.png';
import ForestGroundSand from './ForestHikerMod/Assets/forest-ground_sand.png';
import ForestPlatformGrassImg from './ForestHikerMod/Assets/forest-ground_grass_broken.png';

import Insects from './environment/insect';
import HummingBirdImg from './ForestHikerMod/Assets/hummingbird.png';

import MeleeWeapons from './game/Weapons';
import SchimitarImg from './assets/schimitar'
/**
 * @param {Phaser.Scene} scene
 * @param {number} totalWidth
 * @param {string} texture
 * @param {number} scrollFactor
 */
 const createAligned = (scene, totalWidth, texture, scrollFactor, scale = 0) => {
    const w = scene.textures.get(texture).getSourceImage().width
    //const totalWidth = scene.scale.width * 10
    const count = Math.ceil(totalWidth / w) * scrollFactor
    let x = 0
    for(let i = 0; i < count; ++i)
    {
        const m = scene.add.image(x, scene.scale.height, texture)
            .setOrigin(0,1)
            .setScrollFactor(scrollFactor)

            if (scale > 0)
               m.setScale(scale);

            x += m.width
    }
}
   
class GameScene extends Phaser.Scene
{
    constructor(scene) {
        super({
            key: 'GameScene'
        });
    } 
    preload() {
        this.load.image('background', BackgroundImg);
        this.load.image('logo', LogoImg);
        this.load.image('sky', Sky);
        this.load.image('mountains', Mountains);
        this.load.image('plateau2', Plateau);
        this.load.image('plateau', Plateau);

        // --------forest-----------------------
        this.load.image('forest-background', ForrestBgImg);
        this.load.image('forest-sky', ForestSky);
        this.load.image('trees', Trees);
        this.load.image('rocks', Rocks);
        this.load.image('forest-haze', ForestHaze);
        
        this.load.image('ground', GroundGrassImg);
        this.load.image('platform', ForestPlatformGrassImg);
        this.load.image('mplatform', PlatformImg);
        this.load.spritesheet('minsect', HummingBirdImg, {
            frameWidth: 100,
            frameHeight: 100
        });
        //-----------------------------------------------
        this.load.spritesheet('font', matrixFont, {
             frameWidth: 32, frameHeight: 25 
        });
        this.load.audio('jump', JumpSound);
        this.load.audio('powerup', PowerupSound)
		this.load.audio('dead', PlayerDieSound)
		this.load.audio('cling', ClingSound)
        //this.load.image('ground', GroundImg);
        //this.load.image('platform', PlatformImg);
        //this.load.image('mplatform', PlatformImg);
        this.load.spritesheet('player-sprite', PlayerImg, {
            frameWidth: 60,
            frameHeight: 80
        });
        this.load.spritesheet('schimitar', SchimitarImg, {
            frameWidth: 100,
            frameHeight: 100
        });
        this.load.json('version', '/src/leveldata/version.json');
        //this.load.json('level_platform', 'src/leveldata/level_platform.json');
        //this.load.json('level_mplatforms', 'src/leveldata/level_mplatforms.json');
        this.load.json('level_ground', 'src/leveldata/level_ground.json');
        this.load.json('level_clouds', 'src/leveldata/level_clouds.json');
        this.load.json('level_insects', 'src/leveldata/level_insects.json');
        this.load.json('level1', 'src/leveldata/level1.json');

        this.load.spritesheet('rain', Rain,{
            frameWidth: 17,
            frameHeight: 25
        });
		

        this.cursors = this.input.keyboard.createCursorKeys();
        this.load.image('clouds', CloudsImg);
        this.load.image('rainclouds', RainCloudsImg);
        //this.load.image('mCloud', CloudsImg);
        /*
        var particles = this.add.particles('clouds');
        this.cloudsEmitter = particles.createEmitter({
            frame: [ 'red', 'blue', 'green', 'yellow' ],
            x: 400,
            y: 300,
            speed: 200,
            lifespan: 3000,
            blendMode: 'ADD'
        });*/
    }
    
    create (data) {
        //const background = this.add.image(1450/2, 775/2, 'background');
		//background.setScale(Math.max(1450 / background.width, 775 / background.height))
        //.setScrollFactor(0);
        const background = this.add.image(1450/2, 775/2, 'forest-background');
		background.setScale(Math.max(1450 / background.width, 775 / background.height))
        .setScrollFactor(0);
        // --------------- parallax----------------------------------
        const width = this.scale.width
        const height = this.scale.height
        const totalWidth = width * 10
        //this.add.image(width * 0.5, height * 0.5, 'sky')
        //.setScrollFactor(0)

        //createAligned(this, totalWidth, 'mountains', 0.25)
        //createAligned(this, totalWidth, 'plateau2', 0.35)
        //createAligned(this, totalWidth, 'plateau', 0.5)
        
        this.add.image(width * 0.5, height * 0.5, 'forest-sky')
        .setScrollFactor(0)

        createAligned(this, totalWidth, 'trees', 0.25)
        createAligned(this, totalWidth, 'rocks', 0.35)
        createAligned(this, totalWidth, 'rocks', 0.5)
        this.cameras.main.setBounds(0,this.player, width * 10, height)
        //--------------Player----------------------------------------
        this.player = this.physics.add.existing(new Player(this, 100, 100, 'player-sprite', 0));
        this.player.cursors = this.input.keyboard.createCursorKeys()
		this.player.body.checkCollision.up = true
		this.player.body.checkCollision.left = true
	    this.player.body.checkCollision.right = true
		this.player.body.checkCollision.down = true
        this.player.body.setBounce(0.2);
        this.player.setScale(0.7)
        this.player.body.setCollideWorldBounds(false);
        this.cameras.main.startFollow(this.player,false,0.8,0.5,0,5);
        //this.cameras.main.setDeadzone(this.scale.width * 1.5)
        //---------------Weapons-------------------------------------
        this.schimitar = this.physics.add.existing(new MeleeWeapons(this, this.player.x, this.player.y, 'schimitar', 0));
        this.startFollow(this.player.body)
        //--------------Platform data---------------------------------
        
        this.ground_sand = this.add.sprite(100,400, 'ground');
        this.physics.add.staticGroup(this.ground_sand);
        this.ground_sand.body.allowGravity = false;
        this.ground_sand.body.immovable = true;

        this.levelData_Ground = this.cache.json.get('level_ground');
        //console.log(this.levelData_Ground);

        //this.levelData_Platforms = this.cache.json.get('level_platform');
        //console.log(this.levelData_Platforms);

        //this.levelData_mPlatforms = this.cache.json.get('level_mplatforms');
        //console.log(this.levelData_mPlatforms);
        this.levelData_level1 = this.cache.json.get('level1');
        this.levelData_Insects = this.cache.json.get('level_insects');
            //console.log(this.levelData_level1);

        this.platforms = this.physics.add.staticGroup()
        this.platforms.enableBody = true;
        /*
        this.levelData_Ground.platformData.forEach(function(element){
            this.platforms.create(element.x, element.y, 'ground');
        }, this)*/
        this.levelData_Ground.platformData.forEach((element)=>{
            this.platforms.create(element.x, element.y, 'ground');
        });
        //const platformsGroup = new Platforms(this.physics.world, this);
        this.physics.add.collider(this.platforms, this.player)
        this.physics.add.collider(this.ground_sand, this.player)
        /*
        this.platform = [];
        this.levelData_Platforms = this.cache.json.get('level_platform');
        this.levelData_Platforms.platformData.forEach(function(element){
            this.platform.push(new Platforms(this, element.x, element.y, 'platform', element.scale));
        }, this)
        
        this.mPlatform = [];
        this.levelData_mPlatforms = this.cache.json.get('level_mplatforms');
        this.levelData_mPlatforms.platformData.forEach(function(element){
            this.mPlatform.push(new Platforms(this, element.x, element.y, element.scale));
        }, this)
        */
       /*
        this.platform = [];
        this.levelData_level1.platformData.forEach(function(element){
            this.platform.push(new Platforms(this, element.x, element.y, 'platform', element.scale));
        }, this)

        this.mPlatform = [];
        this.levelData_level1.movingPlatformData.forEach(function(element){
            this.mPlatform.push(new MovingPlatforms(this, element.x, element.y, element.scale, element.movementType, element.time, element.distance));
        }, this)*/
        this.platform = [];
        this.levelData_level1.platformData.forEach((element)=>{
            this.platform.push(new Platforms(this, element.x, element.y, 'platform', element.scale));
        });
        this.mPlatform = [];
        this.levelData_level1.movingPlatformData.forEach((element)=>{
            this.mPlatform.push(new MovingPlatforms(this, element.x, element.y, element.scale, element.movementType, element.time, element.distance));
        });
        
        this.HummingBird = [];
        this.levelData_Insects.InsectData.forEach((element)=>{
            this.HummingBird.push(new Insects(this, element.x, element.y, element.scale, element.movementType, element.time, element.distance));
        });

        //this.levelData_Platforms.platformData.forEach(function(element){
        //    this.platforms.create(element.x, element.y, 'platform');
        //}, this)
        
        this.platform.forEach(element=>this.physics.add.collider(element, this.player))
        this.mPlatform.forEach(element=>this.physics.add.collider(element, this.player))
        //----------------------------MIST------------------------------------
        
        var particles = this.add.particles('rain');

        var emitter = particles.createEmitter({
            
            x: 500,
            y: -400,
            angle: { min: 0, max: 120 },
            speed: 300,
            gravityY: 100,
            lifespan: { min: 1000, max: 2000 },
            blendMode: 'ADD'
            
        });

        //-------------------------Insects-----------------------------------------

        for (const insect of this.HummingBird) {}
        //this.mCloud = this.physics.add.existing(new Clouds(this, 500, 500,'clouds'))
        
        this.Cloud = []
        this.levelData_Clouds = this.cache.json.get('level_clouds')
        this.levelData_Clouds.cloudData.forEach(element=>this.Cloud.push(new Clouds(this, element.x, element.y, 'clouds', element.isAddative)))

        emitter.startFollow(this.Cloud[0])

        this.rCloud = [];
        this.levelData_Clouds = this.cache.json.get('level_clouds');
        this.levelData_Clouds.rain_cloudData.forEach(element=>this.rCloud.push(new RainClouds(this, element.x, element.y, 'rainclouds', element.isAddative)))
        
        emitter.startFollow(this.rCloud[0])
        //------------------------Haze
        //const haze_bg = this.add.image(1450/2, 775/2, 'forest-haze');
		//haze_bg.setScale(Math.max(1450 / haze_bg.width, 775 / haze_bg.height))
        //.setScrollFactor(0);
        
    }
    

	update(time, delta) {
        this.player.body.setVelocityX(0)
        this.player.__ani_setup()
        this.player.control_handler()
        //this.mCloud.checkCloudMovement()
        //this.mCloud.setCloudMovement()
        this.schimitar.weapon_control_handler()
        this.schimitar.control_handler()
        
        this.Cloud.forEach(element => {element.checkCloudMovement()})
        this.rCloud.forEach(element => {element.checkCloudMovement()})
        this.mPlatform.forEach(element => {element.checkPlatformMovement()})
        this.HummingBird.forEach(element => {element.checkInsectMovement()})

        //this.cloud.movingClouds();
        const bottomPlatform = this.findBottomMostPlatform()
		if (this.player.y > bottomPlatform.y + 200)
		{
			this.scene.start('game-over')
			this.sound.play('dead')
		}
    }
    findBottomMostPlatform()
    {
        const platforms = this.platforms.getChildren()
        let bottomPlatform = platforms[0]
        platforms.map(platform=>{
            if (platform.y < bottomPlatform.y) return false
            bottomPlatform = platform
        })
        return bottomPlatform
    }
}
const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 1450,
	height: 775,
    scene: [

       // BootScene,
        //TitleScene,
        GameScene,
       GameOver,
        ParallaxScene
    ],
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {
				y: 200
			},
			debug: false
		}
	}
};
const game = new Phaser.Game(config);