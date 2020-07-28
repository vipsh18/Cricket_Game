function CBall(oParentContainerBall) {
	var _iCntFrames = 0
	var _iMaxFrames = MAX_FRAMES_THROWN
	var _iWidth
	var _iHeight
	var _iBufferTime = 0
	var _iFrame = 0

	var _fSpeed
	var _fStartSpeed
	var _fSpeedRate = 0.035

	var _bUpdate
	var _bHitted
	var _bMissed = false
	var _bPerfect
	var _bPlus
	var _bMinius

	var _oBall
	var _oHitValue

	var _pStartPoint = { x: 0, y: 0 }
	var _pEndPoint = { x: 0, y: 0 }

	var _aTrajectoryPoint

	this._init = function (oParentContainerBall) {
		var oSprite = s_oSpriteLibrary.getSprite('ball')
		var oData = {
			images: [oSprite],
			// width, height & registration point of each sprite
			frames: {
				width: oSprite.width / 7,
				height: oSprite.height / 3,
				regX: oSprite.width / 2 / 7,
				regY: oSprite.height / 2 / 3,
			},
			animations: { rotate: [0, 20] },
		}
		var oSpriteSheetHeroBottom = new createjs.SpriteSheet(oData)
		_oBall = createSprite(
			oSpriteSheetHeroBottom,
			'normal',
			oSprite.width / 2 / 7,
			oSprite.height / 2 / 3,
			oSprite.width / 7,
			oSprite.height / 3
		)
		_oBall.stop()

		_fSpeed = STEP_SPEED_BALL * BALL_VELOCITY_MULTIPLIER
		_fStartSpeed = STEP_SPEED_BALL * BALL_VELOCITY_MULTIPLIER

		oParentContainerBall.addChild(_oBall)
	}

	this.reset = function (pEndPos) {
		_oBall.x = BALL_X
		_oBall.y = BALL_Y
		_oBall.regX = _iWidth / 2
		_oBall.regY = _iHeight / 2
		_oBall.scaleX = 0.4
		_oBall.scaleY = 0.4
		_oBall.rotation = 0
		_oBall.visible = false

		_bHitted = false
		_bMissed = false
		_bPerfect = false
		_bPlus = false
		_bMinius = false

		_iMaxFrames = MAX_FRAMES_THROWN

		this.changeTrajectory(pEndPos)
	}

	this.changeTrajectory = function (pEndPos) {
		_pStartPoint.x = _oBall.x
		_pStartPoint.y = _oBall.y

		_pEndPoint.x = pEndPos.x
		_pEndPoint.y = pEndPos.y

		_fSpeed = _fStartSpeed

		this._calculateMid(_pStartPoint, _pEndPoint)
	}

	this.addVelocity = function () {
		if (_fSpeed < MAX_BALL_VELOCITY) {
			_fSpeed = _fSpeed + BALL_VELOCITY_ADDED
			_fStartSpeed = _fSpeed
		} else {
			_fSpeed = MAX_BALL_VELOCITY
		}
	}

	this.viewBall = function () {
		_oBall.visible = true
		this._calculateMid(_pStartPoint, _pEndPoint)
		_bUpdate = true
	}

	this.hideBall = function () {
		_oBall.visible = false
	}

	this._calculateMid = function (pStartPoint, pEndPoint) {
		//TRAIETTORIA CHE DEVE ANDARE SUL PUNTO DA TIRARE
		var t0
		var iRandT0 = Math.floor(Math.random() * 50) + 1
		if (_bHitted === true) {
			if (_bPerfect) {
				t0 = new createjs.Point(
					Math.floor(Math.random() * 100) + CANVAS_WIDTH / 2 - 100,
					TRAJECTORY_Y_BALL_CAUGHT - iRandT0
				)
			} else {
				if (pEndPoint.x < CANVAS_WIDTH / 2) {
					if (pEndPoint.y > CANVAS_HEIGHT / 2) {
						t0 = new createjs.Point(
							Math.floor(Math.random() * (CANVAS_WIDTH / 2)) - 100,
							TRAJECTORY_Y_BALL_CAUGHT - iRandT0
						)
					} else {
						t0 = new createjs.Point(
							Math.floor(Math.random() * (CANVAS_WIDTH / 2)) - 100,
							TRAJECTORY_Y_BALL_CAUGHT + iRandT0
						)
					}
				} else if (pEndPoint.x > CANVAS_WIDTH / 2) {
					if (pEndPoint.y > CANVAS_HEIGHT / 2) {
						t0 = new createjs.Point(
							Math.floor(Math.random() * (CANVAS_WIDTH / 2) + 125) + 250,
							TRAJECTORY_Y_BALL_CAUGHT - iRandT0
						)
					} else {
						t0 = new createjs.Point(
							Math.floor(
								Math.random() * (_pEndPoint.x - _pStartPoint.x) +
									CANVAS_WIDTH / 2 +
									iRandT0
							),
							TRAJECTORY_Y_BALL_CAUGHT + iRandT0
						)
					}
				} else {
					if (pEndPoint.x > CANVAS_WIDTH / 2) {
						t0 = new createjs.Point(
							CANVAS_WIDTH / 2 - 50,
							Math.floor(Math.random() * 200) + 100
						)
					} else {
						t0 = new createjs.Point(
							CANVAS_WIDTH / 2 + 50,
							Math.floor(Math.random() * 200) + 100
						)
					}
				}
			}
		} else if (_bMissed) {
			t0 = new createjs.Point(
				CANVAS_WIDTH_HALF + (END_POINT_X_MISSED_BALL - _oBall.x),
				CANVAS_HEIGHT_HALF + (END_POINT_Y_MISSED_BALL - _oBall.y)
			)
		} else {
			var iVal = Math.random()
			if (iVal < 0.5) {
				t0 = new createjs.Point(
					CANVAS_WIDTH / 2 - 50,
					Math.floor(Math.random() * (CANVAS_HEIGHT / 2) - 100) + 100
				)
			} else {
				t0 = new createjs.Point(
					CANVAS_WIDTH / 2 + 50,
					Math.floor(Math.random() * (CANVAS_HEIGHT / 2) - 100) + 100
				)
			}
		}
		_aTrajectoryPoint = { start: pStartPoint, end: pEndPoint, traj: t0 }
	}

	this._updateBall = function () {
		_iCntFrames += _fSpeed
		if (_iCntFrames > _iMaxFrames) {
			if (!_bMissed || _bHitted) {
				if (_bHitted === true) {
					s_oGame._ballHitted(_oHitValue)
				} else {
					_bMissed = true
					this.changeTrajectory({
						x: END_POINT_X_MISSED_BALL,
						y: END_POINT_Y_MISSED_BALL,
					})
				}
			} else {
				s_oGame._ballMissed()
				_oBall.visible = false //this is to resolve an issue when ball respawn
				_bUpdate = false
			}
			s_oGame.changeStateTarget(true)
			playSound('drop_bounce_grass', 1, 0)
			_iCntFrames = 0
		}

		var fLerp

		fLerp = easeLinear(_iCntFrames, 0, 1, _iMaxFrames)

		this.rolls()

		var pPos = getTrajectoryPoint(fLerp, _aTrajectoryPoint)
		_oBall.x = pPos.x
		_oBall.y = pPos.y
		if (_bHitted === true) {
			if (_oBall.scaleX >= 0) {
				_oBall.scaleX -= 0.03
				_oBall.scaleY -= 0.03
			}
			_fSpeed -= _fSpeedRate
		} else {
			if (_oBall.scaleX < 1) {
				_oBall.scaleX += 0.03
				_oBall.scaleY += 0.03
			} else {
				_fSpeed += 0.2
			}
		}
	}

	this.getValue = function () {
		return _oBall
	}

	this.hitControl = function () {
		var bHit = false

		if (
			_oBall.y >= PERFECT_HIT_Y - OFFSET_FOR_PERFECT_HIT &&
			_oBall.y <= PERFECT_HIT_Y + OFFSET_FOR_PERFECT_HIT
		) {
			_bPerfect = true
			bHit = true
		} else if (_oBall.y >= ALMOST_MINUS && _oBall.y <= PERFECT_HIT_Y) {
			_bMinius = true
			bHit = true
		} else if (_oBall.y <= ALMOST_PLUS && _oBall.y >= PERFECT_HIT_Y) {
			_bPlus = true

			bHit = true
		}

		if (bHit) {
			_oHitValue = _oBall.y - PERFECT_HIT_Y
			if (_oHitValue < 0) {
				_oHitValue *= -1
			}
		}

		_bUpdate = true
	}

	this.hitBall = function () {
		if (_bPerfect) {
			this.perfectHit()
		} else if (_bMinius) {
			this.miniusHit()
		} else if (_bPlus) {
			this.plusHit()
		}
		if (_bPerfect || _bMinius || _bPlus) {
			_bHitted = true
			_pStartPoint.x = _oBall.x
			_pStartPoint.y = _oBall.y
			_fSpeed = STEP_SPEED_BALL + BEAT_FORCE
			playSound('hit_ball', 1, 0)
			this._calculateMid(_pStartPoint, _pEndPoint)
			setTimeout(
				s_oGame._show_airView,
				700,
				_aTrajectoryPoint.end.x,
				_oHitValue
			)
			//s_oGame.setScore(SCORE_HIT - _oHitValue);
		}
	}

	this.perfectHit = function () {
		if (_aTrajectoryPoint.traj.x < CANVAS_WIDTH / 2) {
			//IF IS COMING FROM LEFT
			_iCntFrames = 0
			_pEndPoint.x = END_POINT_X_PERFECT_LEFT
			_pEndPoint.y = END_POINT_Y_PERFECT
		} else {
			_iCntFrames = 0
			_pEndPoint.x = END_POINT_X_PERFECT_RIGHT
			_pEndPoint.y = END_POINT_Y_PERFECT
		}
	}

	this.miniusHit = function () {
		if (_aTrajectoryPoint.traj.x < CANVAS_WIDTH / 2) {
			//IF IS COMING FROM LEFT
			_iCntFrames = 0
			_pEndPoint.x = END_POINT_X_ALMOST_MINUS_RIGHT
			_pEndPoint.y = END_POINT_Y_ALMOST_MINUS
		} else {
			_iCntFrames = 0
			_pEndPoint.x = END_POINT_X_ALMOST_MINUS_LEFT
			_pEndPoint.y = END_POINT_Y_ALMOST_MINUS
		}
	}

	this.plusHit = function () {
		if (_aTrajectoryPoint.traj.x < CANVAS_WIDTH / 2) {
			//IF IS COMING FROM LEFT
			_iCntFrames = 0
			_pEndPoint.x = END_POINT_X_ALMOST_PLUS_RIGHT
			_pEndPoint.y = END_POINT_Y_ALMOST_PLUS
		} else {
			_iCntFrames = 0
			_pEndPoint.x = END_POINT_X_ALMOST_PLUS_LEFT
			_pEndPoint.y = END_POINT_Y_ALMOST_PLUS
		}
	}

	this.rolls = function () {
		if (_fSpeed > 2) {
			_oBall.rotation += 10
		} else if (_fSpeed > 1) {
			_iBufferTime++
			if (_iBufferTime === 2) {
				_oBall.rotation += 8
				_iBufferTime = 0
			}
		} else if (_fSpeed > 0.5) {
			_iBufferTime++
			if (_iBufferTime === 3) {
				_oBall.rotation += 4
				_iBufferTime = 0
			}
		}

		var oFuncRot = this._goToPrevFrame

		if (_pStartPoint.y > _pEndPoint.y) {
			oFuncRot = this._goToNextFrame
		}

		if (_fSpeed > 1.5) {
			oFuncRot()
		} else if (_fSpeed > 1) {
			_iBufferTime++
			if (_iBufferTime > 1) {
				oFuncRot()
				_iBufferTime = 0
			}
		} else if (_fSpeed > 0.5) {
			_iBufferTime++
			if (_iBufferTime > 2) {
				oFuncRot()
				_iBufferTime = 0
			}
		}
	}

	this._goToPrevFrame = function () {
		if (_iFrame === 0) {
			_iFrame = 20
			_oBall.gotoAndStop(_iFrame)
		} else {
			_iFrame--
			_oBall.gotoAndStop(_iFrame)
		}
	}

	this._goToNextFrame = function () {
		if (_iFrame === 21) {
			_iFrame = 1
			_oBall.gotoAndStop(_iFrame)
		} else {
			_iFrame++
			_oBall.gotoAndStop(_iFrame)
		}
	}

	this.setPosition = function (iX, iY) {
		_oBall.x = iX
		_oBall.y = iY
	}

	this.changeState = function (iVal) {
		_oBall.gotoAndStop(iVal)
	}

	this.update = function () {
		if (_bUpdate) {
			this._updateBall()
		}
	}

	this._init(oParentContainerBall)

	return this
}
