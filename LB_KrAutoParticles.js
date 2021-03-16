//=============================================================================
// LB_KrAutoParticles.js
//=============================================================================

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
