function CBowler(oParentContainer, iTeam) {
	var _aBowler = new Array()

	this._init = function (oParentContainer, iTeam) {
		for (var i = 0; i < NUM_SPRITE_BOWLER; i++) {
			_aBowler.push(
				createBitmap(s_oSpriteLibrary.getSprite('bowler_' + iTeam + '_' + i))
			)
			_aBowler[i].x = BOWLER_X
			_aBowler[i].y = BOWLER_Y
			_aBowler[i].rotation = 0
			_aBowler[i].visible = false
			oParentContainer.addChild(_aBowler[i])
		}

		_aBowler[0].visible = true
	}

	this.viewBowler = function (iPitcher) {
		_aBowler[iPitcher].visible = true
	}

	this.hideBowler = function (iPitcher) {
		_aBowler[iPitcher].visible = false
	}

	s_oPticher = this

	this._init(oParentContainer, iTeam)
}
s_oPticher = null
