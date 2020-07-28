function CHelpPanel(iXPos, iYPos, oSprite) {
	var _oTitle
	var _oText1

	var _oHelpBg
	var _oFade
	var _oGroup
	var _oButContinue

	var _oContainerAnim
	var _bClick = false

	this._init = function (iXPos, iYPos, oSprite) {
		_oGroup = new createjs.Container()
		_oGroup.x = iXPos
		_oGroup.y = iYPos
		s_oStage.addChild(_oGroup)

		_oFade = new createjs.Shape()
		_oFade.graphics
			.beginFill('black')
			.drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
		_oFade.alpha = 0.5

		_oGroup.addChild(_oFade)

		_oHelpBg = createBitmap(oSprite)
		_oHelpBg.x = CANVAS_WIDTH_HALF
		_oHelpBg.y = CANVAS_HEIGHT_HALF
		_oHelpBg.regX = oSprite.width * 0.5
		_oHelpBg.regY = oSprite.height * 0.5

		_oGroup.addChild(_oHelpBg)

		_oTitle = new createjs.Text(
			TEXT_HOW_TO_PLAY,
			'bold 50px ' + FONT2,
			'#ffffff'
		)
		_oTitle.textAlign = 'center'
		_oTitle.lineWidth = 500
		_oTitle.x = CANVAS_WIDTH * 0.5
		_oTitle.y = CANVAS_HEIGHT * 0.5 - 240
		_oGroup.addChild(_oTitle)

		var szText

		if (s_bMobile) {
			szText = TEXT_HELP1_MOBILE_BATTER
		} else {
			szText = TEXT_HELP1_PC_BATTER
		}

		_oText1 = new createjs.Text(szText, '28px ' + FONT2, '#ffffff')
		_oText1.textAlign = 'center'
		_oText1.lineWidth = 450
		_oText1.x = CANVAS_WIDTH * 0.5
		_oText1.y = CANVAS_HEIGHT * 0.5 - 170
		_oGroup.addChild(_oText1)

		_oContainerAnim = new createjs.Container()

		var oSpriteTarget = s_oSpriteLibrary.getSprite('ball_target')
		var oTargetLeft = new CBallTarget(
			CANVAS_WIDTH_HALF - 150,
			CANVAS_HEIGHT_HALF - 30,
			oSpriteTarget,
			_oContainerAnim
		)
		var oTargetUp = new CBallTarget(
			CANVAS_WIDTH_HALF,
			CANVAS_HEIGHT_HALF - 30,
			oSpriteTarget,
			_oContainerAnim
		)
		var oTargetRight = new CBallTarget(
			CANVAS_WIDTH_HALF + 150,
			CANVAS_HEIGHT_HALF - 30,
			oSpriteTarget,
			_oContainerAnim
		)

		var oSpriteKeyLeft
		var oSpriteKeyUp
		var oSpriteKeyRight

		if (!s_bMobile) {
			oSpriteKeyLeft = s_oSpriteLibrary.getSprite('key_left')
			oSpriteKeyUp = s_oSpriteLibrary.getSprite('key_up')
			oSpriteKeyRight = s_oSpriteLibrary.getSprite('key_right')
		} else {
			oSpriteKeyLeft = s_oSpriteLibrary.getSprite('arrow')
			oSpriteKeyUp = s_oSpriteLibrary.getSprite('arrow')
			oSpriteKeyRight = s_oSpriteLibrary.getSprite('arrow')
		}

		var oKeyLeft = this.createKey(
			CANVAS_WIDTH_HALF - 150,
			CANVAS_HEIGHT_HALF + 60,
			oSpriteKeyLeft
		)

		var oKeyUp = this.createKey(
			CANVAS_WIDTH_HALF,
			CANVAS_HEIGHT_HALF + 60,
			oSpriteKeyUp
		)

		var oKeyRight = this.createKey(
			CANVAS_WIDTH_HALF + 150,
			CANVAS_HEIGHT_HALF + 60,
			oSpriteKeyRight
		)

		var iScaleLeftDown = 0.8
		if (s_bMobile) {
			oKeyLeft.scaleX = -1
			iScaleLeftDown = -0.8
			oKeyUp.rotation = 270
		}

		_oContainerAnim.addChild(oKeyLeft, oKeyUp, oKeyRight)

		_oGroup.addChild(_oContainerAnim)

		var oParent = this
		this.animKeyTarget(
			oKeyLeft,
			oTargetLeft,
			oKeyUp,
			oTargetUp,
			oKeyRight,
			oTargetRight,
			250,
			250,
			oKeyLeft.scaleX,
			iScaleLeftDown
		)

		var oSpriteContiune = s_oSpriteLibrary.getSprite('but_continue')
		_oButContinue = new CGfxButton(
			CANVAS_WIDTH / 2,
			CANVAS_HEIGHT_HALF + 180,
			oSpriteContiune,
			_oGroup
		)
		_oButContinue.addEventListener(ON_MOUSE_UP, this._onExitHelp, this)
		_oButContinue.pulseAnimation()

		_oGroup.on('pressup', function () {
			oParent._onExitHelp()
		})
	}

	this.animKeyTarget = function (
		oKeyLeft,
		oTargetLeft,
		oKeyUp,
		oTargetUp,
		oKeyRight,
		oTargetRight,
		iWaitTime,
		iTime,
		iScale,
		iScaleLeftDown
	) {
		var oParent = this
		createjs.Tween.get(oKeyLeft)
			.wait(iWaitTime)
			.call(function () {
				oParent.changeAnimArrayTarget(
					oKeyLeft,
					oTargetLeft,
					iScaleLeftDown,
					0.8,
					true
				)
				createjs.Tween.get(oKeyLeft)
					.wait(iTime)
					.call(function () {
						oParent.changeAnimArrayTarget(
							oKeyLeft,
							oTargetLeft,
							iScale,
							1,
							false
						)
						createjs.Tween.get(oKeyUp)
							.wait(iWaitTime)
							.call(function () {
								oParent.changeAnimArrayTarget(oKeyUp, oTargetUp, 0.8, 0.8, true)
								createjs.Tween.get(oKeyUp)
									.wait(iTime)
									.call(function () {
										oParent.changeAnimArrayTarget(
											oKeyUp,
											oTargetUp,
											1,
											1,
											false
										)
										createjs.Tween.get(oKeyRight)
											.wait(iWaitTime)
											.call(function () {
												oParent.changeAnimArrayTarget(
													oKeyRight,
													oTargetRight,
													0.8,
													0.8,
													true
												)
												createjs.Tween.get(oKeyRight)
													.wait(iTime)
													.call(function () {
														oParent.changeAnimArrayTarget(
															oKeyRight,
															oTargetRight,
															1,
															1,
															false
														)
														oParent.animKeyTarget(
															oKeyLeft,
															oTargetLeft,
															oKeyUp,
															oTargetUp,
															oKeyRight,
															oTargetRight,
															iWaitTime,
															iTime,
															iScale,
															iScaleLeftDown
														)
													})
											})
									})
							})
					})
			})
	}

	this.changeAnimArrayTarget = function (
		oKey,
		oTarget,
		fScaleX,
		fScaleY,
		bState
	) {
		oKey.scaleX = fScaleX
		oKey.scaleY = fScaleY
		oTarget.changeState(bState)
	}

	this.createKey = function (iX, iY, oSprite) {
		var oKey
		oKey = createBitmap(oSprite)
		oKey.x = iX
		oKey.y = iY
		oKey.regX = oSprite.width * 0.5
		oKey.regY = oSprite.height * 0.5

		return oKey
	}

	this.unload = function () {
		createjs.Tween.removeAllTweens()
		createjs.Tween.get(_oGroup)
			.to({ alpha: 0 }, 500, createjs.Ease.cubicIn)
			.call(function () {
				s_oStage.removeChild(_oGroup)
			})
		var oParent = this
		_oGroup.off('pressup', function () {
			oParent._onExitHelp()
		})
	}

	this._onExitHelp = function () {
		if (_bClick) {
			return
		}
		_bClick = true
		this.unload()
		s_oGame._onExitHelpPanel()
	}

	this._init(iXPos, iYPos, oSprite)

	return this
}
