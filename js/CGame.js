function CGame(oData, iPlayerTeam, iOpponentTeam) {
	var _idleBatterWait = 0
	var _idleBatterStrike = 0
	var _idlePitcher = 0
	var _iScore = 0
	var _iBallThrowed = 0
	var _iRandDir = 0
	var _iPressedDir = -1
	var _iLives

	var _bUpdate
	var _bWaiting = false //0 waiting state, 1 striking state
	var _bBallThrowed = false
	var _bMissed = false
	var _bInput = true
	var _bBeat = false
	var _bStartGame

	var _oInterface
	var _oEndPanel = null
	var _oParent

	var _oContainerGame

	var _oBatter
	var _oBowler
	var _oTarget
	var _oPole
	var _oCrowdCheering

	this._init = function (iPlayerTeam, iOpponentTeam) {
		$(s_oMain).trigger('start_session')

		setVolume(s_oSoundTrack, 0.35)

		_oCrowdCheering = playSound('crowd_cheering', 1, -1)

		var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'))
		s_oStage.addChild(oBg)

		_oContainerGame = new createjs.Container()
		s_oStage.addChild(_oContainerGame)

		_oInterface = new CInterface()

		_oBowler = new CBowler(_oContainerGame, iOpponentTeam)

		var oSpritePole = s_oSpriteLibrary.getSprite('pole_1')
		_oPole = new CPole(
			CANVAS_WIDTH_HALF - 8,
			CANVAS_HEIGHT - 812,
			oSpritePole,
			_oContainerGame
		)

		var oSpriteTarget = s_oSpriteLibrary.getSprite('ball_target')
		_oTarget = new CBallTarget(-100, -100, oSpriteTarget, _oContainerGame)
		_oTarget.setVisible(false)

		s_oBall = new CBall(_oContainerGame)

		this.ballResetPos()

		_iLives = LIVES

		_oBatter = new CBatter(_oContainerGame, iPlayerTeam)

		var oSpritePole = s_oSpriteLibrary.getSprite('pole_0')
		_oPole = new CPole(
			CANVAS_WIDTH_HALF,
			CANVAS_HEIGHT - 193,
			oSpritePole,
			_oContainerGame
		)

		document.onkeydown = onKeyDown
		_oInterface.createController()
		_oInterface.refreshButtonPos(s_iOffsetX, s_iOffsetY)
		_oInterface.createHitArea()

		_bStartGame = true
		_bBeat = true
		_oInterface.createHelpPanel()
	}

	this.launchCountdown = function () {
		var oMissed = createBitmap(s_oSpriteLibrary.getSprite('3'))
		oMissed.x = CANVAS_WIDTH / 2
		oMissed.y = CANVAS_HEIGHT / 2
		oMissed.regX = 40
		oMissed.regY = 84
		_oContainerGame.addChild(oMissed)
		playSound('countdown1', 1, 0)

		createjs.Tween.get(oMissed)
			.to({ scaleX: 1.3, scaleY: 1.3 }, 500, createjs.Ease.cubicOut)
			.wait(500)
			.call(function () {
				this.visible = false
				var oMissed = createBitmap(s_oSpriteLibrary.getSprite('2'))
				oMissed.x = CANVAS_WIDTH / 2
				oMissed.y = CANVAS_HEIGHT / 2
				oMissed.regX = 40
				oMissed.regY = 84
				oMissed.scaleX = 0.7
				oMissed.scaleY = 0.7
				_oContainerGame.addChild(oMissed)
				playSound('countdown1', 1, 0)

				if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
					createjs.Sound.play('countdown1')
				}

				createjs.Tween.get(oMissed)
					.to({ scaleX: 1.3, scaleY: 1.3 }, 500, createjs.Ease.cubicOut)
					.wait(500)
					.call(function () {
						_oContainerGame.removeChild(this)
						var oMissed = createBitmap(s_oSpriteLibrary.getSprite('1'))
						oMissed.x = CANVAS_WIDTH / 2
						oMissed.y = CANVAS_HEIGHT / 2
						oMissed.regX = 40
						oMissed.regY = 84
						oMissed.scaleX = 0.7
						oMissed.scaleY = 0.7
						_oContainerGame.addChild(oMissed)
						playSound('countdown1', 1, 0)

						if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
							createjs.Sound.play('countdown1')
						}
						createjs.Tween.get(oMissed)
							.to({ scaleX: 1.3, scaleY: 1.3 }, 500, createjs.Ease.cubicOut)
							.wait(500)
							.call(function () {
								_oContainerGame.removeChild(this)
								_oInterface.createAnimText(
									TEXT_START,
									48,
									false,
									null,
									300,
									function () {
										_oContainerGame.removeChild(this)
										_bUpdate = true
										_bBeat = false
										_oInterface.setHitAreaVisible(false)
									}
								)
								playSound('countdown2', 1, 0)
							})
					})
			})
	}

	this._onExitHelpPanel = function () {
		_oInterface.onExitFromHelp()
		this.launchCountdown()
		$(s_oMain).trigger('start_level', 1)
	}

	function onKeyDown(evt) {
		if (_bInput === true) {
			if (!_bBeat) {
				if (evt.keyCode === 37) {
					s_oGame.hitLeft()
				} else if (evt.keyCode === 38) {
					s_oGame.hitCenter()
				} else if (evt.keyCode === 39) {
					s_oGame.hitRight()
				}
			}
		}
		evt.preventDefault()
		return false
	}

	this.hitLeft = function () {
		_iPressedDir = HIT_LEFT
		s_oGame._strike()
		s_oGame.beatDirection()
	}

	this.hitCenter = function () {
		_iPressedDir = HIT_CENTER
		s_oGame._strike()
		s_oGame.beatDirection()
	}

	this.hitRight = function () {
		_iPressedDir = HIT_RIGHT
		s_oGame._strike()
		s_oGame.beatDirection()
	}

	this._strike = function () {
		if (!_bWaiting) {
			_oBatter.hideBatter(_idleBatterWait, _bWaiting)
			_idleBatterWait = 0
		} else {
			_oBatter.hideBatter(_idleBatterStrike, _bWaiting)
			_idleBatterStrike = 0
		}
		_bWaiting = !_bWaiting
		_bBeat = true
		_oInterface.setHitAreaVisible(true)
	}

	this._ballMissed = function () {
		_bUpdate = false
		_bMissed = true

		playSound('crowd_ohhh', 1, 0)
		_oInterface.createAnimText(
			TEXT_BOWLED,
			48,
			false,
			null,
			300,
			this.afterBallMissed
		)

		_oTarget.setVisible(false)

		_iLives--
		_oInterface.refreshLivesText(_iLives)
	}

	this.afterBallMissed = function () {
		_oBatter.hideBatter(_idleBatterWait, _bWaiting)
		_idleBatterWait = 0
		if (_bWaiting) {
			s_oGame._strike()
		}
		s_oGame.changeStateTarget(false)
		_bUpdate = true
		_bBeat = false
		_oInterface.setHitAreaVisible(false)
	}

	this.getMissed = function () {
		return _bMissed
	}

	this.setScore = function (iValue) {
		if (iValue >= POINT_TEXT_EXCELLENT) {
			_iScore += 6
		} else if (iValue > POINT_TEXT_GREAT) {
			_iScore += 4
		} else if (iValue > 70) {
			_iScore += 2
		} else if (iValue > 40) {
			_iScore += 2
		} else {
			_iScore += 1
		}
		//_iScore += Math.floor(iValue);
		_oInterface.viewScore(_iScore)
	}

	this.unload = function () {
		if (s_bMobile === false) {
			document.onkeydown = null
		}

		_oInterface.unload()
		if (_oEndPanel !== null) {
			_oEndPanel.unload()
		}

		createjs.Tween.removeAllTweens()
		s_oStage.removeAllChildren()
	}

	this.onExit = function () {
		this.unload()
		s_oMain.gotoMenu()

		setVolume(s_oSoundTrack, 1)

		destroySound(_oCrowdCheering)

		$(s_oMain).trigger('end_level', 1)
		$(s_oMain).trigger('show_interlevel_ad')
		$(s_oMain).trigger('end_session')
	}

	this.gameOver = function () {
		_bUpdate = false
		_bInput = false
		_oEndPanel = CEndPanel(s_oSpriteLibrary.getSprite('msg_box'))
		_oEndPanel.show(_iScore)
		s_iScore = _iScore
	}

	this._ballHitted = function (fHitValue) {
		_bUpdate = false
		var bStrobe = false
		var iPoint = SCORE_HIT - fHitValue
		var szText = TEXT_CONGRATULATION[0]
		if (iPoint >= POINT_TEXT_EXCELLENT) {
			szText = TEXT_CONGRATULATION[2]
			bStrobe = true
			playSound('applauses', 1, 0)
		} else if (iPoint > POINT_TEXT_GREAT) {
			szText = TEXT_CONGRATULATION[1]
			playSound('applauses', 1, 0)
		} else if (iPoint > 70) {
			szText = TEXT_CONGRATULATION[0]
		} else {
			szText = TEXT_CONGRATULATION[3]
		}
		this.setScore(iPoint)
		_oInterface.createAnimText(
			szText,
			48,
			bStrobe,
			TEXT_EXCELLENT_COLOR,
			300,
			this.afterBallHit
		)
		_iLives--
		_oInterface.refreshLivesText(_iLives)
	}

	this.afterBallHit = function () {
		s_oGame._restart()
		_bUpdate = true
	}

	this.changeStateTarget = function (bVal) {
		_oTarget.changeState(bVal)
	}

	this.randomDir = function () {
		if (LEVEL == 0) _iRandDir = 1
		else _iRandDir = Math.floor(Math.random() * LAUNCH_DIR_OFFSET_RANGE.length)
	}

	this.ballResetPos = function () {
		this.randomDir()

		var iRandRangeX =
			Math.random() *
				(LAUNCH_DIR_OFFSET_RANGE[_iRandDir].max -
					LAUNCH_DIR_OFFSET_RANGE[_iRandDir].min) +
			LAUNCH_DIR_OFFSET_RANGE[_iRandDir].min

		var pEndPosRandom = {
			x: END_POINT_X_THROWN + iRandRangeX,
			y: END_POINT_Y_THROWN,
		}

		PERFECT_HIT_X = pEndPosRandom.x

		_oTarget.setPosition(pEndPosRandom.x, pEndPosRandom.y)

		s_oBall.reset(pEndPosRandom)
	}

	this.pause = function (bVal) {
		_bStartGame = !bVal
		createjs.Ticker.paused = bVal
	}

	this._show_airView = function (endpoint, hitValue) {
		var score = SCORE_HIT - hitValue
		if (score >= POINT_TEXT_EXCELLENT || score > POINT_TEXT_GREAT) {
			_oAv = createBitmap(s_oSpriteLibrary.getSprite('air_view'))
			s_oStage.addChild(_oAv)
			//
			//show ball movement
			var imgTag = new Image()
			var canvas = document.getElementById('canvas')
			var ctx = canvas.getContext('2d')
			var x,
				y,
				framesPerSecond = 40
			//
			// starting point
			tx = endpoint
			if (tx <= 158) x = 275
			else if (tx > 158 && tx <= 316) x = 305
			else if (tx > 316 && tx <= 495) x = 385
			else if (tx > 495 && tx <= 632) x = 465
			else x = 495
			y = 500
			//
			//load image
			imgTag.onload = animate
			imgTag.src = 'sprites/ball_solo.png'
			//
			//animation function
			function animate() {
				ctx.drawImage(imgTag, x, y) // draw image at current position
				//check direction
				if (tx <= 158) x -= 3
				else if (tx > 158 && tx <= 316) x -= 1
				else if (tx > 316 && tx <= 474) x += 1
				else if (tx > 474 && tx <= 632) x += 1
				else x += 3
				y -= 3
				if (y > 400) {
					setTimeout(function () {
						requestAnimationFrame(animate)
					}, 1000 / framesPerSecond)
				}
			}
		}
	}

	this._restart = function () {
		if (typeof _oAv !== 'undefined') s_oStage.removeChild(_oAv)
		if (_iLives <= 0) {
			this.gameOver()
		} else {
			this.ballResetPos()
			_oTarget.setVisible(false)
			s_oGame.changeStateTarget(false)
			s_bBounce = true
			_bBallThrowed = false
			_bMissed = false
			this._strike()
			_bBeat = false
			_oInterface.setHitAreaVisible(false)
		}
	}

	this.resetGame = function () {
		_iLives = LIVES
		_oInterface.refreshLivesText(_iLives)
		_iScore = 0
		_oInterface.viewScore(_iScore)
		_bUpdate = true
		_bWaiting = true
		_bInput = true
		_bBeat = false
		this._restart()
		$(s_oMain).trigger('restart_level', 1)
	}

	this.ballMissedRestart = function () {
		if (_iLives <= 0) {
			this.gameOver()
		} else {
			this.ballResetPos()
			_bBallThrowed = false
			if (_idleBatterStrike > 0) {
				this._strike()
			}
			_bMissed = false
			_bBeat = false
			_oInterface.setHitAreaVisible(false)
		}
	}

	this.beatDirection = function () {
		if (_iPressedDir === _iRandDir) {
			s_oBall.hitControl()
		}
	}

	this.update = function () {
		if (_bUpdate && _bStartGame) {
			if (!_bWaiting) {
				//waiting the pitcher
				_oBatter.hideBatter(_idleBatterWait, _bWaiting)
				if (_idleBatterWait + 1 < NUM_SPRITE_BATTING) {
					_oBatter.viewBatter(_idleBatterWait + 1, _bWaiting)
					_idleBatterWait++
				} else {
					_idleBatterWait = 0
					_oBatter.viewBatter(_idleBatterWait, _bWaiting)
				}
			} else {
				//striking BATTITORE
				_oBatter.hideBatter(_idleBatterStrike, _bWaiting)
				if (_idleBatterStrike + 1 < NUM_SPRITE_BATTING) {
					_oBatter.viewBatter(_idleBatterStrike + 1, _bWaiting)
					_idleBatterStrike++
				} else {
					_oBatter.viewBatter(_idleBatterStrike, _bWaiting)
				}
				if (_idleBatterStrike === 8) {
					s_oBall.hitBall()
					//_bUpdate = false;
				}
			}

			if (_bMissed === true) {
				this.ballMissedRestart()
			}

			if (!_bBallThrowed || _idlePitcher + 1 < NUM_SPRITE_BOWLER) {
				_oBowler.hideBowler(_idlePitcher)
				if (_idlePitcher + 1 < NUM_SPRITE_BOWLER) {
					_oBowler.viewBowler(_idlePitcher + 1)
					_idlePitcher++
				} else {
					_idlePitcher = 0
				}
				if (_idlePitcher === 28) {
					_iBallThrowed++
					s_oBall.viewBall()
					_oTarget.setVisible(true)
					_bBallThrowed = true
				}
			}
			if (_bBallThrowed) {
				s_oBall.update()
			}
		}
	}

	s_oGame = this
	_oParent = this

	LIVES = oData.lives
	OFFSET_FOR_HIT = oData.offset_hit
	OFFSET_FOR_PERFECT_HIT = oData.offset_perfect_hit
	STEP_SPEED_BALL = oData.start_speed_ball
	BALL_VELOCITY_ADDED = oData.ball_velocity_added
	MAX_BALL_VELOCITY = oData.max_ball_velocity
	SCORE_HIT = oData.score_ball_hit
	NUM_LEVEL_FOR_ADS = oData.num_levels_for_ads

	ALMOST_MINUS = PERFECT_HIT_Y - OFFSET_FOR_HIT
	ALMOST_PLUS = PERFECT_HIT_Y + OFFSET_FOR_HIT
	POINT_TEXT_EXCELLENT = SCORE_HIT - OFFSET_FOR_PERFECT_HIT

	this._init(iPlayerTeam, iOpponentTeam)
}

var s_oGame
