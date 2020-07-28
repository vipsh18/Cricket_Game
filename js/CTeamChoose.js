function CTeamChoose() {
	var _pStartPosAudio
	var _pStartPosExit
	var _pStartPosContinue
	var _pStartPosFullscreen

	var _oBg
	var _oButContinue
	var _oContTextSelectTeam
	var _oContTextSelectOppTeam
	var _oContTextYourTeam
	var _oContTextOppTeam
	var _oFade
	var _oLoadingScreen = null
	var _oAudioToggle
	var _oButFullscreen
	var _fRequestFullScreen = null
	var _fCancelFullScreen = null
	var _oButExit
	var _oPlayerFlagSelect
	var _oOpponentFlagSelect
	var _oContainer
	var _oYourTeamText
	var _oOppTeamText
	var _oYourTeamTextStroke
	var _oOppTeamTextStroke
	var _aPlayerTeamFlag = 0
	var _aOpponentTeamFlag = 1
	var _aTeamText
	var _iActivePlayerTeam
	var _iActiveOpponentTeam
	LEVEL = 0

	this._init = function () {
		_oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_select_team'))
		s_oStage.addChild(_oBg)

		_aTeamText = new Array()

		_oContainer = new createjs.Container()

		_iActivePlayerTeam = 0
		_iActiveOpponentTeam = 1

		var iTimeAnim = 1500

		_aPlayerTeamFlag = this.createFlagSelection(
			PLAYER_SELECTION_FLAG_START_POS.x,
			PLAYER_SELECTION_FLAG_START_POS.y,
			iTimeAnim,
			this._onButPlayerTeamChoose
		)

		var oSpriteFlagSelection = s_oSpriteLibrary.getSprite('flag_selection')

		_oPlayerFlagSelect = createBitmap(oSpriteFlagSelection)
		_oPlayerFlagSelect.x = _aPlayerTeamFlag[0].getX()
		_oPlayerFlagSelect.y = _aPlayerTeamFlag[0].getY()
		_oPlayerFlagSelect.regX = oSpriteFlagSelection.width * 0.5
		_oPlayerFlagSelect.regY = oSpriteFlagSelection.height * 0.5

		s_oStage.addChild(_oContainer)

		_oContTextSelectTeam = this.createText(TEXT_SELECT_YOUR_TEAM, 22, 200).container
		_oContTextSelectTeam.x = CANVAS_WIDTH_HALF
		_oContTextSelectTeam.y = 320

		s_oStage.addChild(_oContTextSelectTeam)

		var oTextYourTeam = this.createText(TEXT_TEAM[0], 30, 500)

		_oContTextYourTeam = oTextYourTeam.container
		_oContTextYourTeam.x = CANVAS_WIDTH_HALF
		_oContTextYourTeam.y = CANVAS_HEIGHT_HALF + 132

		_oYourTeamText = oTextYourTeam.text
		_oYourTeamTextStroke = oTextYourTeam.text_stroke

		s_oStage.addChild(_oContTextYourTeam)

		if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
			var oSprite = s_oSpriteLibrary.getSprite('audio_icon')
			_pStartPosAudio = {
				x: CANVAS_WIDTH - oSprite.width / 2 - 60,
				y: oSprite.height / 2 + 20,
			}
			_oAudioToggle = new CToggle(
				_pStartPosAudio.x,
				_pStartPosAudio.y,
				oSprite,
				s_bAudioActive,
				s_oStage
			)
			_oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this)
		}
		//
		var width = window.innerWidth > 0 ? window.innerWidth : screen.width
		if (width < 350) width += 200
		else if (width > 350 && width < 400) width += 150
		else if (width > 400 && width < 500) width += 110
		else if (width > 500 && width < 800) width = width / 2 + 40
		else width = CANVAS_WIDTH_HALF
		//
		//
		_pStartPosContinue = {
			x: width,
			y: CANVAS_HEIGHT * 0.5 + 330,
		}
		var oSpriteContinue = s_oSpriteLibrary.getSprite('but_continue')

		_oButContinue = new CGfxButton(
			_pStartPosContinue.x,
			_pStartPosContinue.y,
			oSpriteContinue,
			s_oStage
		)
		_oButContinue.textAlign = 'center'
		_oButContinue.addEventListener(ON_MOUSE_UP, this._onButContinueRelease, this)
		_oButContinue.pulseAnimation()

		var oSpriteExit = s_oSpriteLibrary.getSprite('but_exit')
		_pStartPosExit = {
			x: CANVAS_WIDTH - oSpriteExit.width / 2 - 15,
			y: oSpriteExit.height / 2 + 20,
		}
		_oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSpriteExit, s_oStage)
		_oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this)

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
			_pStartPosFullscreen = { x: oSprite.width / 4 + 10, y: _pStartPosExit.y - 2000 }

			_oButFullscreen = new CToggle(
				_pStartPosFullscreen.x,
				_pStartPosFullscreen.y,
				oSprite,
				s_bFullscreen,
				s_oStage
			)
			_oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this)
		}

		_oFade = new createjs.Shape()
		_oFade.graphics.beginFill('black').drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

		s_oStage.addChild(_oFade)

		createjs.Tween.get(_oFade)
			.to({ alpha: 0 }, 1000)
			.call(function () {
				_oFade.visible = false
				_oContainer.addChild(_oPlayerFlagSelect)
			})

		this.refreshButtonPos(s_iOffsetX, s_iOffsetY)
	}

	this._createFlag = function (
		i,
		iOffsetX,
		iOffsetY,
		iTimeWait,
		iTimeAnim,
		oFunction,
		oContainer
	) {
		var oFlag
		var oSpriteFlag = s_oSpriteLibrary.getSprite(i + 1 + '_small')
		oFlag = new CGfxButton(iOffsetX, iOffsetY, oSpriteFlag, oContainer)
		oFlag.addEventListenerWithParams(ON_MOUSE_UP, oFunction, this, i)

		var oButtonFlag = oFlag.getButton()

		oButtonFlag.scaleX = 0
		oButtonFlag.scaleY = 0

		createjs.Tween.get(oButtonFlag)
			.wait(iTimeWait)
			.to({ scaleY: 1, scaleX: 1 }, iTimeAnim, createjs.Ease.elasticOut)

		return oFlag
	}

	this.createFlagSelection = function (iStartX, iStartY, iTimeAnim, oFunction) {
		var aFlag = new Array()
		var iX = iStartX
		var iY = iStartY

		for (var i = 0; i < TOT_TEAMS; i++) {
			var iTimeWait = Math.floor(Math.random() * 500)
			aFlag[i] = this._createFlag(i, iX, iY, iTimeWait, iTimeAnim, oFunction, _oContainer)
			iX = iStartX
			iY += FLAG_OFFSET.y
		}
		return aFlag
	}

	this.createText = function (szText, iSize, iLineWidth) {
		var oContainer = new createjs.Container()
		var oText

		oText = new createjs.Text(szText, iSize + 'px ' + FONT2, '#ffffff')
		oText.textAlign = 'center'
		oText.lineWidth = iLineWidth
		oText.x = 0
		oText.y = 0

		oContainer.addChild(oText)

		return { container: oContainer, text: oText }
	}

	this.refreshButtonPos = function (iNewX, iNewY) {
		_oButExit.setPosition(_pStartPosExit.x - iNewX, iNewY + _pStartPosExit.y)
		_oButContinue.setPosition(_pStartPosContinue.x - iNewX, _pStartPosContinue.y - iNewY)
		if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
			_oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, iNewY + _pStartPosAudio.y)
		}
		if (_fRequestFullScreen && inIframe() === false) {
			_oButFullscreen.setPosition(
				_pStartPosFullscreen.x + iNewX,
				_pStartPosFullscreen.y + iNewY
			)
		}
	}

	this._onButPlayerTeamChoose = function (iID) {
		if (_iActivePlayerTeam !== iID) {
			_oPlayerFlagSelect.x = _aPlayerTeamFlag[iID].getX()
			_oPlayerFlagSelect.y = _aPlayerTeamFlag[iID].getY()

			_oYourTeamText.text = TEXT_TEAM[iID]

			_iActivePlayerTeam = iID
			LEVEL = iID
		}
	}

	this.unload = function () {
		for (var i = 0; i < _aPlayerTeamFlag.length; i++) {
			_aPlayerTeamFlag[i].unload()
			_aPlayerTeamFlag[i] = null
		}

		for (var i = 0; i < _aOpponentTeamFlag.length; i++) {
			_aOpponentTeamFlag[i].unload()
			_aOpponentTeamFlag[i] = null
		}

		_oButExit.unload()
		_oButExit = null

		_oButContinue.unload()
		_oButContinue = null

		if (_oLoadingScreen !== null) {
			_oLoadingScreen.unload()
			_oLoadingScreen = null
		}

		if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
			_oAudioToggle.unload()
			_oAudioToggle = null
		}

		if (_fRequestFullScreen && inIframe() === false) {
			_oButFullscreen.unload()
		}

		s_oStage.removeAllChildren()
		createjs.Tween.removeAllTweens()

		s_oTeamChoose = null
	}

	this.loadingScreen = function () {
		var oContainerLoad = new createjs.Container()
		oContainerLoad.alpha = 0

		_oLoadingScreen = new CLoadingScreen(oContainerLoad, this)

		createjs.Tween.get(oContainerLoad).to({ alpha: 1 }, 250, createjs.Ease.cubicOut)
	}

	this._onExit = function () {
		this.unload()

		s_oMain.gotoMenu()
	}

	this._onAudioToggle = function () {
		createjs.Sound.setMute(s_bAudioActive)
		s_bAudioActive = !s_bAudioActive
	}

	this._onButContinueRelease = function () {
		_oButContinue.block(true)
		this.loadingScreen()

		s_oMain._loadChoosedTeam(0, _iActiveOpponentTeam)
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

	s_oTeamChoose = this

	this._init()
}

var s_oTeamChoose = null
