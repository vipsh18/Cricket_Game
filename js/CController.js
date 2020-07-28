function CController() {
	var _pStartPosControlRight
	var _pStartPosControlLeft
	var _pStartPosControlUp
	var _oControlLeft
	var _oControlRight
	var _oControlUp

	this._init = function () {
		_pStartPosControlRight = {
			x: CANVAS_WIDTH * 0.5 + 320,
			y: CANVAS_HEIGHT - 120,
		}
		_pStartPosControlLeft = {
			x: CANVAS_WIDTH * 0.5 - 320,
			y: CANVAS_HEIGHT - 120,
		}
		_pStartPosControlUp = { x: CANVAS_WIDTH * 0.5, y: CANVAS_HEIGHT - 120 }

		var oSpriteArrow = s_oSpriteLibrary.getSprite('arrow')

		_oControlLeft = new CGfxButton(
			_pStartPosControlLeft.x,
			_pStartPosControlLeft.y,
			oSpriteArrow,
			s_oStage
		)
		_oControlLeft.addEventListener(ON_MOUSE_DOWN, s_oGame.hitLeft, this)
		_oControlLeft.setScaleX(-1)

		_oControlRight = new CGfxButton(
			_pStartPosControlRight.x,
			_pStartPosControlRight.y,
			oSpriteArrow,
			s_oStage
		)
		_oControlRight.addEventListener(ON_MOUSE_DOWN, s_oGame.hitRight, this)

		_oControlUp = new CGfxButton(
			_pStartPosControlUp.x,
			_pStartPosControlUp.y,
			oSpriteArrow,
			s_oStage
		)
		_oControlUp.addEventListener(ON_MOUSE_DOWN, s_oGame.hitCenter, this)
		_oControlUp.rotation(-90)
	}

	this.getStartPositionControlRight = function () {
		return _pStartPosControlRight
	}

	this.getStartPositionControlLeft = function () {
		return _pStartPosControlLeft
	}

	this.getStartPositionControlUp = function () {
		return _pStartPosControlUp
	}

	this.setPositionControlRight = function (iX, iY) {
		_oControlRight.setPosition(iX, iY)
	}

	this.setPositionControlLeft = function (iX, iY) {
		_oControlLeft.setPosition(iX, iY)
	}

	this.setPositionControlUp = function (iX, iY) {
		_oControlUp.setPosition(iX, iY)
	}

	this.unload = function () {
		_oControlLeft.unload()
		_oControlLeft = null

		_oControlRight.unload()
		_oControlRight = null

		_oControlUp.unload()
		_oControlUp = null
	}

	this._init()

	return this
}
