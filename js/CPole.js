function CPole(iX, iY, oSprite, oParentContainer) {
	var _oPole
	var _oParentContainer = oParentContainer

	this._init = function (iX, iY, oSprite) {
		_oPole = createBitmap(oSprite)
		_oPole.x = iX
		_oPole.y = iY
		_oPole.regX = oSprite.width * 0.5
		_oPole.regY = oSprite.height * 0.5

		_oParentContainer.addChild(_oPole)
	}

	this.getValue = function () {
		return _oPole
	}

	this.unload = function () {
		_oParentContainer.removeChild(_oPole)
	}

	this._init(iX, iY, oSprite)

	return this
}
