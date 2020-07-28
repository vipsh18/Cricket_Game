function CBallTarget(iXPos, iYPos, oSprite, oParentContainer) {
	var _oTarget
	var _oParentContainer = oParentContainer

	this._init = function (iXPos, iYPos, oSprite) {
		var oData = {
			images: [oSprite],
			// width, height & registration point of each sprite
			frames: {
				width: oSprite.width / 2,
				height: oSprite.height,
				regX: oSprite.width / 2 / 2,
				regY: oSprite.height / 2,
			},
			animations: { state_true: [1], state_false: [0] },
		}

		var oSpriteSheet = new createjs.SpriteSheet(oData)

		_oTarget = createSprite(
			oSpriteSheet,
			'state_' + false,
			oSprite.width / 2 / 2,
			oSprite.height / 2,
			oSprite.width / 2,
			oSprite.height
		)

		_oTarget.x = iXPos
		_oTarget.y = iYPos
		_oTarget.stop()

		_oParentContainer.addChild(_oTarget)
	}

	this.unload = function () {
		_oParentContainer.removeChild(_oTarget)
	}

	this.changeState = function (bVal) {
		_oTarget.gotoAndStop('state_' + bVal)
	}

	this.setPosition = function (iXPos, iYPos) {
		_oTarget.x = iXPos
		_oTarget.y = iYPos
	}

	this.setVisible = function (bVisible) {
		_oTarget.visible = bVisible
	}

	this._init(iXPos, iYPos, oSprite)

	return this
}
