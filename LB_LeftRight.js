//=============================================================================
// LB_LeftRight.js
//=============================================================================

/*:
 * @plugindesc Fixes the diection of all character sprites (including both player characters and events) to the horizontal axis (left and right).
 * @author LunaBunn
 *
 * @help This plugin does not provide plugin commands.
 */

/*:ko
 * @plugindesc 플레이어와 이벤트를 포함한 캐릭터들의 스프라이트 방향을 왼쪽과 오른쪽으로 고정시켜주는 플러그인입니다.
 * @author LunaBunn
 *
 * @help 본 플러그인은 플러그인 커맨드를 포함하고 있지 않습니다.
 */

Sprite_Character.prototype.characterPatternY = function () {
    this._direction = this._direction || 6;
    if (this._character._direction == 4 || this._character._direction == 6) {
        this._direction = this._character._direction;
    }
    return (this._direction - 2) / 2;
};
