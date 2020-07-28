function CMenu() {
	var _oBg
	var _oLogo
	var _oButPlay
	var _oFade
	var _oAudioToggle
	var _oButInfo
	var _oButFullscreen
	var _fRequestFullScreen = null
	var _fCancelFullScreen = null

	var _pStartPosAudio
	var _pStartPosInfo
	var _pStartPosFullscreen

	//Idnet Variables
	var _loginText
	var _textGroup

	this._init = function () {
		_oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'))
		s_oStage.addChild(_oBg)

		_oLogo = createBitmap(s_oSpriteLibrary.getSprite('logo_menu'))
		_oLogo.x = 200
		_oLogo.y = 90
		s_oStage.addChild(_oLogo)

		var oSprite = s_oSpriteLibrary.getSprite('but_play')
		_oButPlay = new CGfxButton(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 225, oSprite)
		_oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this)

		if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
			var oSprite = s_oSpriteLibrary.getSprite('audio_icon')
			_pStartPosAudio = {
				x: CANVAS_WIDTH - oSprite.height / 2 - 10,
				y: oSprite.height / 2 + 10,
			}
			_oAudioToggle = new CToggle(
				_pStartPosAudio.x,
				_pStartPosAudio.y,
				oSprite,
				s_bAudioActive
			)
			_oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this)
		}

		var oSprite = s_oSpriteLibrary.getSprite('but_credits')
		var width = window.innerWidth > 0 ? window.innerWidth : screen.width
		if (width < 350)
			_pStartPosInfo = {
				x: CANVAS_WIDTH - oSprite.height / 2 - 300,
				y: oSprite.height / 2 + 10,
			}
		else if (width > 350 && width < 450)
			_pStartPosInfo = {
				x: CANVAS_WIDTH - oSprite.height / 2 - 350,
				y: oSprite.height / 2 + 10,
			}
		else if (width > 450 && width < 800)
			_pStartPosInfo = {
				x: CANVAS_WIDTH - oSprite.height / 2 - 120,
				y: oSprite.height / 2 + 10,
			}
		else
			_pStartPosInfo = {
				x: CANVAS_WIDTH - oSprite.height / 2 - 60,
				y: oSprite.height / 2 + 10,
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
			_pStartPosFullscreen = {
				x: _pStartPosInfo.x + oSprite.width / 2 - 45,
				y: _pStartPosInfo.y - 2000,
			}

			_oButFullscreen = new CToggle(
				_pStartPosFullscreen.x,
				_pStartPosFullscreen.y,
				oSprite,
				s_bFullscreen,
				s_oStage
			)
			_oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this)
		}

		_loginText = new createjs.Text('', 'bold 20px ' + FONT, '#FFFFFF')
		_loginText.shadow = new createjs.Shadow('#000000', 3, 3, 3)
		_loginText.x = CANVAS_WIDTH / 2
		_loginText.y = CANVAS_HEIGHT / 2 - 420
		_loginText.textBaseline = 'alphabetic'
		_loginText.lineWidth = 500
		_loginText.text = ''
		_loginText.textAlign = 'center'
		_textGroup = new createjs.Container()
		_textGroup.alpha = 1
		_textGroup.visible = true
		_textGroup.addChild(_loginText)
		s_oStage.addChild(_textGroup)

		_oFade = new createjs.Shape()
		_oFade.graphics.beginFill('black').drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

		s_oStage.addChild(_oFade)

		createjs.Tween.get(_oFade)
			.to({ alpha: 0 }, 1000)
			.call(function () {
				_oFade.visible = false
			})

		this.refreshButtonPos(s_iOffsetX, s_iOffsetY)
	}

	this.unload = function () {
		_oButPlay.unload()
		_oButPlay = null
		_oFade.visible = false

		if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
			_oAudioToggle.unload()
			_oAudioToggle = null
		}

		if (_fRequestFullScreen && inIframe() === false) {
			_oButFullscreen.unload()
		}

		s_oStage.removeAllChildren()
		s_oMenu = null
	}

	this.getUserName = function () {
		if (s_isLogin === true) {
			_loginText.text = 'Welcome ' + s_userName
			//_oLoginBtn.setVisible(false);
		} else {
			_loginText.text = ''
		}
	}

	this.refreshButtonPos = function (iNewX, iNewY) {
		if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
			_oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, iNewY + _pStartPosAudio.y)
		}

		if (_fRequestFullScreen && inIframe() === false) {
			_oButFullscreen.setPosition(
				_pStartPosFullscreen.x + iNewX,
				_pStartPosFullscreen.y + iNewY
			)
		}
		_loginText.x = CANVAS_WIDTH / 2
		_loginText.y = CANVAS_HEIGHT / 2 - 420 + iNewY
	}

	this._onAudioToggle = function () {
		createjs.Sound.setMute(s_bAudioActive)
		s_bAudioActive = !s_bAudioActive
	}

	this._onCredits = function () {
		new CCreditsPanel()
	}

	this._onButPlayRelease = function () {
		this.unload()
		if (isIOS() && s_oSoundTrack === null) {
			if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
				s_oSoundTrack = createjs.Sound.play('soundtrack', { loop: -1 })
			}
		}

		s_oMain.gotoTeamChoose()
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

	s_oMenu = this

	this._init()
}

var s_oMenu = null
