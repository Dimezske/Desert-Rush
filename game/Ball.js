import Phaser from '../lib/phaser.js'

export default class Ball extends Phaser.Physics.Arcade.Sprite
{
	/**
	 * @param {Phaser.Scene} scene 
	 * @param {number} x 
	 * @param {number} y 
	 * @param {string} texture 
	 */
	constructor(scene, x, y, texture = 'ball')
	{
		super(scene, x, y, texture)

		this.setScale(1)
	}
	addBallAbove(sprite)
	{
		const y = sprite.y - sprite.displayHeight

		const ball = this.balls.get(sprite.x, y, 'ball')

		ball.setActive(true)
		ball.setVisible(true)

		this.add.existing(ball)

		ball.body.setSize(ball.width, ball.height)

		this.physics.world.enable(ball)

		return ball
	}
	handleCollectBall(player, ball)
	{
		this.balls.killAndHide(ball)

		this.physics.world.disableBody(ball.body)

		this.ballsCollected++
		this.sound.play('powerup')

		this.ballsCollectedText.text = `Balls: ${this.ballsCollected}`
	}
}
