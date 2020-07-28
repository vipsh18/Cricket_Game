function CMain(oData) {
	var _bUpdate
	var _iCurResource = 0
	var RESOURCE_TO_LOAD = 0
	var _iState = STATE_LOADING
	var _oData

	var _oPreloader
	var _oMenu
	var _oGame
	var _oTeamChoose

	var _aTeamLoadedBatter = new Array()

	this.initContainer = function () {
		s_oCanvas = document.getElementById('canvas')
		s_oStage = new createjs.Stage(s_oCanvas)
		createjs.Touch.enable(s_oStage)
		s_oStage.preventSelection = false

		s_bMobile = jQuery.browser.mobile
		if (s_bMobile === false) {
			s_oStage.enableMouseOver(20)
			$('body').on('contextmenu', '#canvas', function (e) {
				return false
			})
		}

		s_iPrevTime = new Date().getTime()

		createjs.Ticker.addEventListener('tick', this._update)
		createjs.Ticker.setFPS(30)

		if (navigator.userAgent.match(/Windows Phone/i)) {
			DISABLE_SOUND_MOBILE = true
		}

		s_oSpriteLibrary = new CSpriteLibrary()

		this.setLoadedArray()

		//ADD PRELOADER
		_oPreloader = new CPreloader()
		this.getLocation()
	}

	this.preloaderReady = function () {
		if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
			this._initSounds()
		}

		this._loadImages()
		_bUpdate = true
	}

	this.soundLoaded = function (evt) {
		_iCurResource++
		var iPerc = Math.floor((_iCurResource / RESOURCE_TO_LOAD) * 100)
		_oPreloader.refreshLoader(iPerc)

		if (_iCurResource === RESOURCE_TO_LOAD) {
			this._onRemovePreloader()
		}
	}

	this._initSounds = function () {
		if (!createjs.Sound.initializeDefaultPlugins()) {
			return
		}

		if (navigator.userAgent.indexOf('Opera') > 0 || navigator.userAgent.indexOf('OPR') > 0) {
			createjs.Sound.alternateExtensions = ['mp3']
			createjs.Sound.addEventListener('fileload', createjs.proxy(this.soundLoaded, this))

			createjs.Sound.registerSound('./sounds/soundtrack.ogg', 'soundtrack')

			createjs.Sound.registerSound('./sounds/buzzer.ogg', 'buzzer')
			createjs.Sound.registerSound('./sounds/countdown_1.ogg', 'countdown1')

			createjs.Sound.registerSound('./sounds/countdown_2.ogg', 'countdown2')

			createjs.Sound.registerSound('./sounds/drop_bounce_grass.ogg', 'drop_bounce_grass')
			createjs.Sound.registerSound('./sounds/hit_ball.ogg', 'hit_ball')

			createjs.Sound.registerSound('./sounds/crowd_cheering.ogg', 'crowd_cheering')
			createjs.Sound.registerSound('./sounds/applauses.ogg', 'applauses')

			createjs.Sound.registerSound('./sounds/crowd_ohhh.ogg', 'crowd_ohhh')
			createjs.Sound.registerSound('./sounds/click.ogg', 'click')
		} else {
			createjs.Sound.alternateExtensions = ['ogg']
			createjs.Sound.addEventListener('fileload', createjs.proxy(this.soundLoaded, this))

			createjs.Sound.registerSound('./sounds/soundtrack.mp3', 'soundtrack')
			createjs.Sound.registerSound('./sounds/buzzer.mp3', 'buzzer')

			createjs.Sound.registerSound('./sounds/countdown_1.mp3', 'countdown1')
			createjs.Sound.registerSound('./sounds/countdown_2.mp3', 'countdown2')

			createjs.Sound.registerSound('./sounds/drop_bounce_grass.mp3', 'drop_bounce_grass')

			createjs.Sound.registerSound('./sounds/hit_ball.mp3', 'hit_ball')
			createjs.Sound.registerSound('./sounds/crowd_cheering.mp3', 'crowd_cheering')

			createjs.Sound.registerSound('./sounds/applauses.mp3', 'applauses')
			createjs.Sound.registerSound('./sounds/crowd_ohhh.mp3', 'crowd_ohhh')

			createjs.Sound.registerSound('./sounds/click.mp3', 'click')
		}

		RESOURCE_TO_LOAD += 10
	}

	this._loadImages = function () {
		s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this)

		s_oSpriteLibrary.addSprite('but_play', './sprites/but_play.png')
		s_oSpriteLibrary.addSprite('msg_box', './sprites/msg_box.png')

		s_oSpriteLibrary.addSprite('but_exit', './sprites/but_exit.png')
		s_oSpriteLibrary.addSprite('logo_menu', './sprites/logo_menu.png')

		s_oSpriteLibrary.addSprite('audio_icon', './sprites/audio_icon.png')
		s_oSpriteLibrary.addSprite('preloader_anim', './sprites/preloader_anim.png')

		s_oSpriteLibrary.addSprite('bg_game', './sprites/bg_game.jpg')
		s_oSpriteLibrary.addSprite('score_panel', './sprites/score_panel.png')
		s_oSpriteLibrary.addSprite('ball', './sprites/ball.png')
		s_oSpriteLibrary.addSprite('ball_solo', './sprites/ball_solo.png')

		s_oSpriteLibrary.addSprite('1', './sprites/1.png')
		s_oSpriteLibrary.addSprite('2', './sprites/2.png')
		s_oSpriteLibrary.addSprite('3', './sprites/3.png')
		s_oSpriteLibrary.addSprite('1_small', './sprites/1_small.png')
		s_oSpriteLibrary.addSprite('2_small', './sprites/2_small.png')
		s_oSpriteLibrary.addSprite('3_small', './sprites/3_small.png')
		s_oSpriteLibrary.addSprite('but_credits', './sprites/but_credits.png')
		s_oSpriteLibrary.addSprite('logo_credits', './sprites/logo_credits.png')

		s_oSpriteLibrary.addSprite('ball_target', './sprites/ball_target.png')
		s_oSpriteLibrary.addSprite('bg_select_team', './sprites/bg_select_team.jpg')
		s_oSpriteLibrary.addSprite('bg_select_mode', './sprites/bg_select_mode.jpg')
		s_oSpriteLibrary.addSprite('flag_selection', './sprites/flag_selection.png')
		s_oSpriteLibrary.addSprite('but_continue', './sprites/but_continue.png')
		s_oSpriteLibrary.addSprite('pole_0', './sprites/pole_0.png')

		s_oSpriteLibrary.addSprite('pole_1', './sprites/pole_1.png')
		s_oSpriteLibrary.addSprite('but_pause', './sprites/but_pause.png')
		s_oSpriteLibrary.addSprite('but_yes', './sprites/but_yes.png')
		s_oSpriteLibrary.addSprite('but_no', './sprites/but_no.png')

		s_oSpriteLibrary.addSprite('arrow', './sprites/arrow.png')
		s_oSpriteLibrary.addSprite('bg_text', './sprites/bg_text.png')

		s_oSpriteLibrary.addSprite('but_home', './sprites/but_home.png')
		s_oSpriteLibrary.addSprite('but_restart', './sprites/but_restart.png')

		s_oSpriteLibrary.addSprite('key_up', './sprites/key_up.png')
		s_oSpriteLibrary.addSprite('key_left', './sprites/key_left.png')
		s_oSpriteLibrary.addSprite('key_right', './sprites/key_right.png')

		s_oSpriteLibrary.addSprite('bg_help', './sprites/bg_help.png')
		s_oSpriteLibrary.addSprite('but_fullscreen', './sprites/but_fullscreen.png')

		s_oSpriteLibrary.addSprite('air_view', './sprites/air_view.png')

		RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites()
		s_oSpriteLibrary.loadSprites()
	}

	this._onImagesLoaded = function () {
		_iCurResource++
		var iPerc = Math.floor((_iCurResource / RESOURCE_TO_LOAD) * 100)
		_oPreloader.refreshLoader(iPerc)

		if (_iCurResource === RESOURCE_TO_LOAD) {
			this._onRemovePreloader()
		}
	}

	this._loadChoosedTeam = function (iPlayerTeam, iOpponentTeam) {
		if (LEVEL == 0) BALL_VELOCITY_MULTIPLIER = 0.8
		else if (LEVEL == 1) BALL_VELOCITY_MULTIPLIER = 1.1
		else if (LEVEL == 2) BALL_VELOCITY_MULTIPLIER = 1.4
		s_iPlayerTeam = iPlayerTeam
		s_iOpponentTeam = iOpponentTeam
		_iCurResource = 0
		RESOURCE_TO_LOAD = 0

		if (_aTeamLoadedBatter[iPlayerTeam] && _aTeamLoadedBatter[iOpponentTeam]) {
			this.gotoGame(s_iPlayerTeam, s_iOpponentTeam)
			return
		}

		s_oSpriteLibrary.init(this._onTeamsLoaded, this._onAllImagesLoaded, this)

		for (var i = 0; i < NUM_SPRITE_BATTING; i++) {
			if (_aTeamLoadedBatter[iPlayerTeam] === false) {
				s_oSpriteLibrary.addSprite(
					'batter_batting_' + iPlayerTeam + '_' + i,
					'./sprites/batter_hit_' +
						iPlayerTeam +
						'/batter_batting_' +
						iPlayerTeam +
						'_' +
						i +
						'.png'
				)
			}
			if (_aTeamLoadedBatter[iOpponentTeam] === false) {
				s_oSpriteLibrary.addSprite(
					'batter_batting_' + iOpponentTeam + '_' + i,
					'./sprites/batter_hit_' +
						iOpponentTeam +
						'/batter_batting_' +
						iOpponentTeam +
						'_' +
						i +
						'.png'
				)
			}
		}
		for (var i = 0; i < NUM_SPRITE_PLAYERS; i++) {
			if (_aTeamLoadedBatter[iPlayerTeam] === false) {
				s_oSpriteLibrary.addSprite(
					'batter_idle_' + iPlayerTeam + '_' + i,
					'./sprites/batter_idle_' +
						iPlayerTeam +
						'/batter_idle_' +
						iPlayerTeam +
						'_' +
						i +
						'.png'
				)
			}
			if (_aTeamLoadedBatter[iOpponentTeam] === false) {
				s_oSpriteLibrary.addSprite(
					'batter_idle_' + iOpponentTeam + '_' + i,
					'./sprites/batter_idle_' +
						iOpponentTeam +
						'/batter_idle_' +
						iOpponentTeam +
						'_' +
						i +
						'.png'
				)
			}
		}

		for (var i = 0; i < NUM_SPRITE_BOWLER; i++) {
			if (_aTeamLoadedBatter[iPlayerTeam] === false) {
				s_oSpriteLibrary.addSprite(
					'bowler_' + iPlayerTeam + '_' + i,
					'./sprites/bowler_' + iPlayerTeam + '/bowler_' + iPlayerTeam + '_' + i + '.png'
				)
			}

			if (_aTeamLoadedBatter[iOpponentTeam] === false) {
				s_oSpriteLibrary.addSprite(
					'bowler_' + iOpponentTeam + '_' + i,
					'./sprites/bowler_' +
						iOpponentTeam +
						'/bowler_' +
						iOpponentTeam +
						'_' +
						i +
						'.png'
				)
			}
		}

		RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites()

		s_oSpriteLibrary.loadSprites()
	}

	this._onTeamsLoaded = function () {
		_iCurResource++
		if (_iCurResource === RESOURCE_TO_LOAD) {
			this.gotoGame(s_iPlayerTeam, s_iOpponentTeam)
		}
	}

	this._onAllImagesLoaded = function () {}

	this.onAllPreloaderImagesLoaded = function () {
		this._loadImages()
	}

	this.setLoadedArray = function () {
		for (var i = 0; i < TOT_TEAMS; i++) {
			_aTeamLoadedBatter[i] = false
		}
	}

	this._onRemovePreloader = function () {
		_oPreloader.unload()

		if (!isIOS()) {
			if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
				s_oSoundTrack = createjs.Sound.play('soundtrack', { loop: -1 })
			}
		}

		this.gotoMenu()
	}

	this.gotoMenu = function () {
		_oMenu = new CMenu()
		_iState = STATE_MENU
		this.getUserName(s_userName, s_isLogin)
	}

	this.gotoGame = function (iPlayerTeam, iOpponentTeam) {
		_oTeamChoose.unload()
		_aTeamLoadedBatter[s_iOpponentTeam] = true
		_aTeamLoadedBatter[s_iPlayerTeam] = true
		_oGame = new CGame(_oData, iPlayerTeam, iOpponentTeam)
		_iState = STATE_GAME
	}

	this.gotoTeamChoose = function () {
		_oTeamChoose = new CTeamChoose()
		_iState = STATE_MENU
	}

	this.stopUpdate = function () {
		_bUpdate = false
		createjs.Ticker.paused = true
		$('#block_game').css('display', 'block')
		createjs.Sound.setMute(true)
	}

	this.startUpdate = function () {
		s_iPrevTime = new Date().getTime()
		_bUpdate = true
		createjs.Ticker.paused = false
		$('#block_game').css('display', 'none')

		if (s_bAudioActive) {
			createjs.Sound.setMute(false)
		}
	}

	this._update = function (event) {
		if (_bUpdate === false) {
			return
		}
		var iCurTime = new Date().getTime()
		s_iTimeElaps = iCurTime - s_iPrevTime
		s_iCntTime += s_iTimeElaps
		s_iCntFps++
		s_iPrevTime = iCurTime

		if (s_iCntTime >= 1000) {
			s_iCurFps = s_iCntFps
			s_iCntTime -= 1000
			s_iCntFps = 0
		}

		if (_iState === STATE_GAME) {
			_oGame.update()
		}

		s_oStage.update(event)
	}

	/********************Id net and Branding Functions***************/

	this.getUserName = function (_getUserName, _flag) {
		s_isLogin = _flag
		s_userName = _getUserName
		if (_iState === STATE_MENU) {
			_oMenu.getUserName()
		}
	}
	this.getLocation = function () {
		s_URLlocation = self.location.hostname
	}
	this.sponsorStatus = function (_getSponsorStatus) {
		s_sponsor = _getSponsorStatus
		if (_iState === STATE_LOADING && s_sponsor === true) {
		}
		if (_iState === STATE_MENU && s_sponsor === true) {
		}
	}

	this.unloadScreens = function (scr) {
		if (scr === STATE_MENU && s_oMenu != null) {
			console.log('_oMenu ' + _oMenu)
			_oMenu.unload()
		}
		if (scr === STATE_LOADING) {
			_oPreloader.unload()
		}
		if (scr === STATE_GAME) {
			_oGame.unload()
		}
	}

	this.gotoLoginWindows = function () {
		console.log('gotoLoginWindows ')
		_iState = STATE_SAVESLOTS
		_oSaveSlot = new CSaveSlot()
	}

	/*********************************************************************/

	s_oMain = this

	_oData = oData
	ENABLE_FULLSCREEN = oData.fullscreen
	ENABLE_CHECK_ORIENTATION = oData.check_orientation

	this.initContainer()
}
var s_bMobile
var s_bAudioActive = true
var s_bFullscreen = false
var s_iCntTime = 0
var s_iTimeElaps = 0
var s_iPrevTime = 0
var s_iCntFps = 0
var s_iCurFps = 0
var s_iPlayerTeam
var s_iOpponentTeam
var s_iMode
var s_iAdsLevel = 1
var s_bBounce = true

var s_oDrawLayer
var s_oStage
var s_oMain
var s_oStadium
var s_oBall
var s_oSpriteLibrary
var s_oSoundTrack = null
var s_oBgSound
var s_oCanvas
var s_iCanvasResizeHeight
var s_iCanvasResizeWidth
var s_iCanvasOffsetHeight
var s_iCanvasOffsetWidth

//Id net variables
var s_isLogin = false
var s_userName = 'guest'
var s_URLlocation
var s_gameName = 'cricket_batter_challenge'
var s_isBlacklisted = false
var isTutorial = false

var s_sponsor = false
var s_iScore
