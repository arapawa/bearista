var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 300 },
          debug: false
      }
  },
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

var game = new Phaser.Game(config);

function preload () {
  {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('bear', 
        'assets/bear-proto.png',
        { frameWidth: 20, frameHeight: 32 }
    );

    // prototype bucket
    this.load.spritesheet('bucket', 'assets/bucket.png', { frameWidth: 32, frameHeight: 48 });

    // TODO: add boat and bucket

    this.load.audio('waves', [
      'music/gentle-ocean-waves-birdsong-and-gull-pixabay.mp3',
      'music/gentle-ocean-waves-birdsong-and-gull-pixabay.ogg',
      'music/gentle-ocean-waves-birdsong-and-gull-pixabay.m4a'
      ]
    );
  }
}

var platforms;
var player;
var score = 0;
var scoreText;
var instructionsText;

function create ()
{
  this.add.image(400, 300, 'sky');

  platforms = this.physics.add.staticGroup();

  platforms.create(400, 568, 'ground').setScale(2).refreshBody(); // bottom ground

  platforms.create(200, 160, 'ground');
  platforms.create(600, 160, 'ground');

  player = this.physics.add.sprite(100, 100, 'bear');

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  bucket = this.physics.add.sprite(100, 154, 'bucket');
  bucket.setCollideWorldBounds(true);

  this.physics.add.collider(player, platforms); // collision between player and platforms

  this.physics.add.collider(player, bucket); // collision between player and bucket

  cursors = this.input.keyboard.createCursorKeys(); // create keyboard input

  // BEGIN player animations
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('bear', { start: 0, end: 1 }),
    frameRate: 10,
    repeat: -1
  });

  // this.anims.create({
  //   key: 'turn',
  //   frames: [ { key: 'bear', frame: 4 } ],
  //   frameRate: 20
  // });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('bear', { start: 2, end: 3 }),
    frameRate: 10,
    repeat: -1
  });
  // END player animations

  // TODO: add boat animations for left and right
  // TODO: add bucket animations for up, down, open, close

  // The score
  this.scoreText = this.add.text(600, 16, 'Cash: 0', { fontSize: '32px', fill: '#FFF' });

  // Keyboard instructions
  this.instructionsText = this.add.text(18, 570, 'Arrows to move, Space to open and close bucket', {fontSize: '16px', fill: '#FFF' }); 

  // play waves audio (note to self, must use _, not - in sound variable naming)
  let waves_music = this.sound.add('waves');
  waves_music.play();

}

function update () {
  // player movement controls
  cursors = this.input.keyboard.createCursorKeys();
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    bucket.setVelocityX(-160);

    player.anims.play('left', true);
  }
  else if (cursors.right.isDown) {
    player.setVelocityX(160);
    bucket.setVelocityX(160);

    player.anims.play('right', true);
  }
  else {
    player.setVelocityX(0);
    bucket.setVelocityX(0);

    player.anims.play('turn');
  }

  // TODO: prevent bucket from pushing bear upward
  if (cursors.up.isDown) {
    bucket.setVelocityY(-330);
  }
  else if (cursors.up.isDown && bucket.body.touching.player) {
    bucket.setVelocityY(0);
  }
  
  if (cursors.down.isDown) {
    bucket.setVelocityY(330);
  }



  // TODO: add boat controls for left and right
  // TODO: add bucket controls open and close (SPACE)

}