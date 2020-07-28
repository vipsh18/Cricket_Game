function CInterface() {
	var _oAudioToggle
	var _oButExit
	var _oButPause
	var _oButFullscreen
	var _fRequestFullScreen = null
	var _fCancelFullScreen = null

	var _oSpriteBall
	var _oScoreText
	var _oScoreText1
	var _oBallText1
	var _oTargetText

	var _oScoreBoard
	var _oController = null

	var _oPause
	var _oHelpPanel = null
	var _oHitArea = null

	var _pStartPosScore
	var _pStartPosBall
	var _pStartPositionScoreText
	var _pStartPositionScore
	var _pStartPositionBallText

	var _pStartPosExit
	var _pStartPosAudio
	var _pStartPosPause
	var _pStartPosFullscreen
	var _pStartPositionTargetText

	var _iStep

	this._init = function () {
		var oSprite = s_oSpriteLibrary.getSprite('but_exit')
		_pStartPosExit = {
			x: CANVAS_WIDTH - oSprite.height / 2 - 10,
			y: oSprite.height / 2 + 10,
		}
		_oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite)
		_oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this)

		var oSprite = s_oSpriteLibrary.getSprite('but_pause')
		_pStartPosPause = {
			x: _pStartPosExit.x - oSprite.height - 10,
			y: _pStartPosExit.y,
		}
		_oButPause = new CGfxButton(_pStartPosPause.x, _pStartPosPause.y, oSprite)
		_oButPause.addEventListener(ON_MOUSE_UP, this.onButPauseRelease, this)

		if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
			var oSprite = s_oSpriteLibrary.getSprite('audio_icon')
			_pStartPosAudio = {
				x: _pStartPosPause.x - oSprite.height - 10,
				y: _pStartPosExit.y,
			}
			_oAudioToggle = new CToggle(
				_pStartPosAudio.x,
				_pStartPosAudio.y,
				oSprite,
				s_bAudioActive
			)
			_oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this)

			_pStartPosFullscreen = {
				x: _pStartPosAudio.x - oSprite.width / 2 - 10,
				y: _pStartPosAudio.y - 2000,
			}
		} else {
			_pStartPosFullscreen = {
				x: _pStartPosPause.x - oSprite.height - 10,
				y: _pStartPosExit.y,
			}
		}

		var doc = window.document
		var docEl = doc.documentElement
		_fRequestFullScreen =
			docEl.requestFullscreen ||
			docEl.mozRequestFullScreen ||
			docEl.webkitRequestFullScreen ||
			docEl.msRequestFullscreen
		_fCancelFullScreen =
			doc.exitFullscreen ||
			doc.mozCancelFullScreen ||
			doc.webkitExitFullscreen ||
			doc.msExitFullscreen

		if (ENABLE_FULLSCREEN === false) {
			_fRequestFullScreen = false
		}

		if (_fRequestFullScreen && inIframe() === false) {
			oSprite = s_oSpriteLibrary.getSprite('but_fullscreen')

			_oButFullscreen = new CToggle(
				_pStartPosFullscreen.x,
				_pStartPosFullscreen.y,
				oSprite,
				s_bFullscreen,
				s_oStage
			)
			_oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this)
		}

		var oSpriteScore = s_oSpriteLibrary.getSprite('score_panel')
		_pStartPosScore = { x: 85, y: 63 }
		_oScoreBoard = createBitmap(oSpriteScore)
		_oScoreBoard.x = _pStartPosScore.x
		_oScoreBoard.y = _pStartPosScore.y
		_oScoreBoard.regX = oSpriteScore.width * 0.5
		_oScoreBoard.regY = oSpriteScore.height * 0.5

		s_oStage.addChild(_oScoreBoard)

		_pStartPositionScoreText = { x: 55, y: 73 }
		_oScoreText = new createjs.Text(SCORE_TEXT, '35px ' + FONT3, '#ffffff')
		_oScoreText.x = _pStartPositionScoreText.x
		_oScoreText.y = _pStartPositionScoreText.y
		_oScoreText.textAlign = 'center'
		_oScoreText.textBaseline = 'alphabetic'
		s_oStage.addChild(_oScoreText)

		_pStartPositionScore = { x: 165, y: 73 }
		_oScoreText1 = new createjs.Text('0', '35px ' + FONT3, '#ffffff')
		_oScoreText1.x = _pStartPositionScore.x
		_oScoreText1.y = _pStartPositionScore.y
		_oScoreText1.textBaseline = 'alphabetic'
		s_oStage.addChild(_oScoreText1)

		_pStartPosBall = { x: 26, y: 105 }

		_pStartPositionBallText = { x: 75, y: 110 }

		_oBallText1 = new createjs.Text(' x   ' + LIVES, '30px ' + FONT2, '#000')
		_oBallText1.x = _pStartPositionBallText.x
		_oBallText1.y = _pStartPositionBallText.y
		_oBallText1.textAlign = 'left'
		_oBallText1.textBaseline = 'alphabetic'
		s_oStage.addChild(_oBallText1)

		var width = window.innerWidth > 0 ? window.innerWidth : screen.width
		// if (width < 500) _pStartPositionTargetText = { x: 130, y: 8 }
		// else if (width > 700 && width < 850)
		// 	_pStartPositionTargetText = { x: 42, y: 8 }
		// else _pStartPositionTargetText = { x: 6, y: 8 }

		_pStartPositionTargetText = { x: 60, y: 35 }

		_oTargetText = new createjs.Text(TARGET_TEXT, '35px ' + FONT3, '#000')
		_oTargetText.x = _pStartPositionTargetText.x
		_oTargetText.y = _pStartPositionTargetText.y
		_oTargetText.textAlign = 'center'
		_oTargetText.textBaseline = 'alphabetic'
		s_oStage.addChild(_oTargetText)

		// if (width < 500)
		// 	_pStartPositionTargetRuns = _pStartPositionTargetRuns = { x: 290, y: 8 }
		// else if (width > 700 && width < 850)
		// 	_pStartPositionTargetRuns = _pStartPositionTargetRuns = { x: 198, y: 8 }
		// else
		// 	_pStartPositionTargetRuns = _pStartPositionTargetRuns = { x: 161, y: 8 }
		_pStartPositionTargetRuns = { x: 165, y: 35 }
		if (LEVEL == 0) _oTargetRuns = new createjs.Text('8', '35px ' + FONT3, '#000')
		else if (LEVEL == 1) _oTargetRuns = new createjs.Text('10', '35px ' + FONT3, '#000')
		else _oTargetRuns = new createjs.Text('12', '35px ' + FONT3, '#000')

		_oTargetRuns.x = _pStartPositionTargetRuns.x
		_oTargetRuns.y = _pStartPositionTargetRuns.y
		_oTargetRuns.textAlign = 'left'
		_oTargetRuns.textBaseline = 'alphabetic'
		s_oStage.addChild(_oTargetRuns)

		this.refreshButtonPos(s_iOffsetX, s_iOffsetY)
	}

	this.unload = function () {
		if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
			_oAudioToggle.unload()
			_oAudioToggle = null
		}

		if (_fRequestFullScreen && inIframe() === false) {
			_oButFullscreen.unload()
		}

		_oButExit.unload()

		if (s_bMobile) {
			_oHitArea.removeAllEventListeners()
			_oController.unload()
		}

		s_oInterface = null
	}

	this.refreshButtonPos = function (iNewX, iNewY) {
		_oButExit.setPosition(_pStartPosExit.x - iNewX, iNewY + _pStartPosExit.y)
		if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
			_oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, iNewY + _pStartPosAudio.y)
		}

		if (_fRequestFullScreen && inIframe() === false) {
			_oButFullscreen.setPosition(
				_pStartPosFullscreen.x - iNewX,
				_pStartPosFullscreen.y + iNewY
			)
		}

		_oScoreBoard.x = _pStartPosScore.x + iNewX
		_oScoreBoard.y = _pStartPosScore.y + iNewY

		_oButPause.setPosition(_pStartPosPause.x - iNewX, iNewY + _pStartPosPause.y)

		_oTargetRuns.x = _pStartPositionTargetRuns.x + iNewX
		_oTargetText.x = _pStartPositionTargetText.x + iNewX
		_oScoreText.x = _pStartPositionScoreText.x + iNewX
		_oScoreText1.x = _pStartPositionScore.x + iNewX
		_oBallText1.x = _pStartPositionBallText.x + iNewX

		if (_oController !== null) {
			var oPosLeft = _oController.getStartPositionControlLeft()
			_oController.setPositionControlLeft(oPosLeft.x + iNewX, oPosLeft.y - iNewY)

			var oPosRight = _oController.getStartPositionControlRight()
			_oController.setPositionControlRight(oPosRight.x - iNewX, oPosRight.y - iNewY)
		}
	}

	this.createController = function () {
		_oController = new CController()
	}

	this.createHitArea = function () {
		_oHitArea = new createjs.Shape()
		_oHitArea.graphics.beginFill('#0f0f0f').drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
		_oHitArea.alpha = 0.01
		_oHitArea.on('click', function () {})
		s_oStage.addChild(_oHitArea)
	}

	this.setHitAreaVisible = function (bVal) {
		if (_oHitArea !== null) _oHitArea.visible = bVal
	}

	this.createAnimText = function (szText, iSize, bStrobo, aColors, iTime, oFunction) {
		var oContainer = new createjs.Container()
		oContainer.scaleX = 0
		oContainer.scaleY = 0

		var oTextStroke = new createjs.Text(szText, iSize + 'px ' + FONT2, '#000')
		oTextStroke.x = 0
		oTextStroke.y = 0
		oTextStroke.textAlign = 'center'
		oTextStroke.textBaseline = 'middle'
		oTextStroke.outline = 4
		oContainer.addChild(oTextStroke)

		var oText = new createjs.Text(szText, iSize + 'px ' + FONT2, '#ffffff')
		oText.x = 0
		oText.y = 0
		oText.textAlign = 'center'
		oText.textBaseline = 'middle'
		oContainer.addChild(oText)

		oContainer.x = CANVAS_WIDTH_HALF
		oContainer.y = CANVAS_HEIGHT_HALF

		if (bStrobo) {
			_iStep = 0
			s_oInterface.strobeText(oText, aColors)
		}
		s_oStage.addChild(oContainer)

		createjs.Tween.get(oContainer)
			.to({ scaleX: 1, scaleY: 1 }, iTime, createjs.Ease.cubicOut)
			.call(function () {
				createjs.Tween.get(oContainer)
					.wait(300)
					.to({ scaleX: 0, scaleY: 0 }, iTime, createjs.Ease.cubicOut)
					.call(function () {
						if (bStrobo) {
							createjs.Tween.removeTweens(oText)
						}
						oFunction()
						s_oStage.removeChild(oContainer)
					})
			})
	}

	this.strobeText = function (oText, aColors) {
		createjs.Tween.get(oText)
			.wait(30)
			.call(function () {
				if (_iStep < aColors.length - 1) {
					_iStep++
				} else {
					_iStep = 0
				}
				oText.color = aColors[_iStep]
				s_oInterface.strobeText(oText, aColors)
			})
	}

	this.animBallHit = function () {
		var oSpriteHit = s_oSpriteLibrary.getSprite('hit_msg')
		var oHit = createBitmap(oSpriteHit)
		oHit.x = CANVAS_WIDTH_HALF
		oHit.y = CANVAS_HEIGHT_HALF
		oHit.regX = oSpriteHit.width * 0.5
		oHit.regY = oSpriteHit.height * 0.5
		oHit.scaleX = 0
		oHit.scaleY = 0

		s_oStage.addChild(oHit)

		createjs.Tween.get(oHit)
			.to({ scaleX: 1, scaleY: 1 }, 500, createjs.Ease.cubicOut)
			.wait(800)
			.call(function () {
				s_oGame.afterBallHit()
				s_oStage.removeChild(oHit)
			})
	}

	this.viewScore = function (iValue) {
		if (iValue.toString().length >= 2) {
			tos = iValue.toString()
			if (tos[0] == '2' || tos[0] == '3') _oScoreText1.x -= 8
		}
		_oScoreText1.text = iValue
	}

	this.refreshLivesText = function (iLives) {
		_oBallText1.text = ' x   ' + iLives
	}

	this.createHelpPanel = function () {
		_oHelpPanel = new CHelpPanel(0, 0, s_oSpriteLibrary.getSprite('bg_help'))
	}

	this._onButRestartRelease = function () {
		s_oGame.restartGame()
	}

	this.onExitFromHelp = function () {
		if (_oHelpPanel !== null) _oHelpPanel.unload()
	}

	this.unloadPause = function () {
		_oPause.unload()
		_oPause = null
	}

	this.onButPauseRelease = function () {
		_oPause = new CPause()
	}

	this._onAudioToggle = function () {
		createjs.Sound.setMute(s_bAudioActive)
		s_bAudioActive = !s_bAudioActive
	}

	this._onExit = function () {
		var oAreYouSure = new CAreYouSurePanel(s_oStage)
		oAreYouSure.show()
	}

	this._onFullscreenRelease = function () {
		if (s_bFullscreen) {
			_fCancelFullScreen.call(window.document)
			s_bFullscreen = false
		} else {
			_fRequestFullScreen.call(window.document.documentElement)
			s_bFullscreen = true
		}

		sizeHandler()
	}

	s_oInterface = this

	this._init()

	return this
}

var s_oInterface = null
