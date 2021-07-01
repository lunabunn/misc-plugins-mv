//=============================================================================
// LB_JumpHeight.js
//=============================================================================

/**
 * Copyright (c) 2021 lunabunn
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 * 2. Altered source versions must be plainly marked as such, and must not be
 *    misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 */

/*:
 * @plugindesc Lets you control the height and speed of jumps.
 * @author LunaBunn
 *
 * @help This plugin can be used by adding a script command
 * to your Set Movement Route event and calling the following:
 * this.jump(X offset, Y offset, Jump height (Default: 1), Jump speed (Default: 1));
 */

/*:ko
 * @plugindesc 점프 높이와 속도를 조정할 수 있는 플러그인입니다.
 * @author LunaBunn
 *
 * @help 이동 루트 설정 이벤트 내부에서 스크립트 명령을 추가하신 뒤
 * this.jump(X 오프셋, Y 오프셋, 점프 높이 (1이 기본), 점프 속도 (1이 기본));
 * 을 호출하는 것으로 사용하실 수 있습니다.
 */

{
    const initMembers = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function() {
        initMembers.call(this);
        this._jumpHeightFactor = 1;
        this._jumpSpeedFactor = 1;
    }

    const jumpHeight = Game_CharacterBase.prototype.jumpHeight;
    Game_CharacterBase.prototype.jumpHeight = function() {
        return jumpHeight.call(this) * this._jumpHeightFactor;
    };

    const updateJump = Game_CharacterBase.prototype.updateJump;
    Game_CharacterBase.prototype.updateJump = function() {
        this._jumpCount += 1 - this._jumpSpeedFactor;
        updateJump.call(this);
    };

    const jump = Game_CharacterBase.prototype.jump;
    Game_CharacterBase.prototype.jump = function(xPlus, yPlus, heightFactor=1, speedFactor=1) {
        this._jumpHeightFactor = heightFactor;
        this._jumpSpeedFactor = speedFactor;
        jump.call(this, xPlus, yPlus);
    };

    Game_Player.prototype.jump = function(xPlus, yPlus, heightFactor, speedFactor) {
        Game_Character.prototype.jump.call(this, xPlus, yPlus, heightFactor, speedFactor);
        this._followers.jumpAll();
    };

    Game_Followers.prototype.jumpAll = function() {
        if ($gamePlayer.isJumping()) {
            for (var i = 0; i < this._data.length; i++) {
                var follower = this._data[i];
                var sx = $gamePlayer.deltaXFrom(follower.x);
                var sy = $gamePlayer.deltaYFrom(follower.y);
                var heightFactor = $gamePlayer._jumpHeightFactor;
                var speedFactor = $gamePlayer._jumpSpeedFactor;
                follower.jump(sx, sy, heightFactor, speedFactor);
            }
        }
    };
}
