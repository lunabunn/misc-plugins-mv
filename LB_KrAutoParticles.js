//=============================================================================
// LB_KrAutoParticles.js
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
 * @plugindesc 이전 음절의 받침 유무에 따라 자동으로 알맞은 조사를 표시하는 플러그인입니다.
 * @author LunaBunn
 *
 * @help 지원하는 메시지 코드:
 * \은 / \는
 * \이 / \가
 * \을 / \를
 * \kr[받침이 있는 글자 뒤에 오는 조사 형태, 받침이 없는 글자 뒤에 오는 조사 형태] (예: "내 이름은 \N[1]\kr[이다, 다].")
 */

{
    let convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function (text) {
        text = convertEscapeCharacters.call(this, text);
        text = text.replace(/(.)\x1b[은는]/g, function () {
            return arguments[1] + pickParticle(arguments[1], "은", "는");
        }.bind(this));
        text = text.replace(/(.)\x1b[이가]/g, function () {
            return arguments[1] + pickParticle(arguments[1], "이", "가");
        }.bind(this));
        text = text.replace(/(.)\x1b[을를]/g, function () {
            return arguments[1] + pickParticle(arguments[1], "을", "를");
        }.bind(this));
        text = text.replace(/(.)\x1bkr\[\s*(.*)\s*,\s*(.*)\s*\]/g, function () {
            return arguments[1] + pickParticle(arguments[1], arguments[2], arguments[3]);
        }.bind(this));
        return text;
    };

    function pickParticle(c, a, b) {
        let hasBatchim = (c.charCodeAt(0) - 0xAC00) % (21 * 28) % 28 != 0;
        return hasBatchim ? a : b;
    }
}
