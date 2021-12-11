//=============================================================================
// LB_HangulTypingAnimation.js
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
 * @plugindesc 대화창의 한글 텍스트에 타자 효과를 주는 플러그인입니다.
 * @author Lunabunn
 *
 * @help \HTA[1]과 \HTA[0] 메시지 코드를 사용하여 타자 효과를 켜고 끌 수 있습니다.
 * 별도의 파라미터 없이 \HTA만 사용해 토글도 가능합니다.
 * 
 * 기본 MV에서는 대화창의 입력 속도가 너무 빨라 타자 효과가 제대로 보이지
 * 않을 수 있습니다. Kino 님의 SlowText 플러그인 등 대화창의 입력 속도를
 * 조정하는 플러그인의 사용을 권장합니다.
 * 
 * SlowText 플러그인 사용시 정상적인 작동을 위해서는 플러그인 관리 창에서
 * 본 플러그인의 상단에 배치해 주세요. 플러그인 배치 순서가 잘못되었을 경우
 * 일부 기능이 작동하지 않을 수 있습니다.
 * 
 * Yanfly 님의 Message Core를 포함한 타 메시지 플러그인과의 호환성은 테스트되지
 * 않았으며, 호환되지 않을 가능성이 매우 높습니다.
 * 
 * 호환성, 기능 추가, 버그픽스 등의 문의 사항이 있으실 경우 연락 주세요.
 * https://github.com/lunabunn/misc-plugins-mv
 * 
 * 
 * @param enabled
 * @text 기본으로 활성화
 * @desc 타자 효과를 기본으로 활성화할지 여부를 설정합니다.
 * @type boolean
 * @default false
 */

{
    let enabled = PluginManager.parameters("LB_HangulTypingAnimation")["enabled"] === "true";

    const Window_initialize = Window.prototype.initialize;
    Window.prototype.initialize = function () {
        Window_initialize.call(this);
        if (Window_Message.prototype.isPrototypeOf(this)) {
            this._htaSprite = new Sprite();
            this.addChild(this._htaSprite);
        }
    };

    const Window_Message__refreshContents = Window_Message.prototype._refreshContents;
    Window_Message.prototype._refreshContents = function () {
        Window_Message__refreshContents.call(this);
        this._htaSprite.move(this.padding, this.padding);
    };

    const Window_Message__updateContents = Window_Message.prototype._updateContents;
    Window_Message.prototype._updateContents = function () {
        Window_Message__updateContents.call(this);
        this._htaSprite.setFrame(
            this._windowContentsSprite._frame.x,
            this._windowContentsSprite._frame.y,
            this._windowContentsSprite._frame.width,
            this._windowContentsSprite._frame.height
        );
        this._htaSprite.visible = this._windowContentsSprite.visible;
    };

    const Window_Message_createContents = Window_Message.prototype.createContents;
    Window_Message.prototype.createContents = function () {
        this._htaSprite.bitmap = new Bitmap(this.contentsWidth(), this.contentsHeight());
        Window_Message_createContents.call(this);
    };

    const Window_Message_resetFontSettings = Window_Message.prototype.resetFontSettings;
    Window_Message.prototype.resetFontSettings = function () {
        Window_Message_resetFontSettings.call(this);
        this._htaSprite.bitmap.fontFace = this.contents.fontFace;
        this._htaSprite.bitmap.fontSize = this.contents.fontSize;
    };

    const Window_Message_changeTextColor = Window_Message.prototype.changeTextColor;
    Window_Message.prototype.changeTextColor = function (color) {
        Window_Message_changeTextColor.call(this, color);
        this._htaSprite.bitmap.textColor = this.contents.textColor;
    };

    const Window_Message_changePaintOpacity = Window_Message.prototype.changePaintOpacity;
    Window_Message.prototype.changePaintOpacity = function (enabled) {
        Window_Message_changePaintOpacity.call(this, enabled);
        this._htaSprite.bitmap.paintOpacity = this.contents.paintOpacity;
    };

    const Window_Message_newPage = Window_Message.prototype.newPage;
    Window_Message.prototype.newPage = function (textState) {
        this._htaSprite.bitmap.clear();
        Window_Message_newPage.call(this, textState);
    };

    const Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function () {
        Window_Message_startMessage.call(this);
        this._textState._hangulSteps = [];
    };

    const Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function (code, textState) {
        console.log(code);
        if (code === "HTA") {
            console.log(textState.text.slice(textState.index));
            let param = this.obtainEscapeParam(textState);
            if (param) {
                enabled = param != 0;
            } else {
                enabled = !enabled;
            }
            return;
        }
        Window_Message_processEscapeCharacter.call(this, code, textState);
    };

    function combineHangul(cho, jung, jong) {
        return String.fromCharCode((((cho * 21) + jung) * 28) + jong + 0xAC00);
    }

    function getHangulSteps(c) {
        let code = c.charCodeAt(0);
        code -= 0xAC00;
        if (code < 0 || code > 11171) {
            return null;
        }

        let jong = code % 28;
        code -= jong;
        code /= 28;
        let jung = code % 21;
        code -= jung;
        code /= 21;
        let cho = code % 28;

        let steps = [];

        // add lone cho
        steps.push(["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"][cho]);

        // add cho + jung
        if (jung >= 9 && jung <= 11) {
            // add intermediary ㅗ for ㅘ/ㅙ/ㅚ
            steps.push(combineHangul(cho, 8, 0));
        } else if (jung >= 14 && jung <= 16) {
            // add intermediary ㅜ for ㅝ/ㅞ/ㅟ
            steps.push(combineHangul(cho, 13, 0));
        }
        steps.push(combineHangul(cho, jung, 0));

        // add cho + jung + jong
        if (jong != 0) {
            if (jong == 3) {
                // add intermediary ㄱ for ㄳ
                steps.push(combineHangul(cho, jung, 1));
            } else if (jong == 5 || jong == 6) {
                // add intermediary ㄴ for ㄵ/ㄶ
                steps.push(combineHangul(cho, jung, 4));
            } else if (jong >= 9 && jong <= 15) {
                // add intermediary ㄹ for ㄺ/ㄻ/ㄼ/ㄽ/ㄾ/ㄿ/ㅀ
                steps.push(combineHangul(cho, jung, 8));
            }
            steps.push(combineHangul(cho, jung, jong));
        }

        return steps;
    }

    Window_Base_processNormalCharacter = Window_Base.prototype.processNormalCharacter;
    Window_Base.prototype.processNormalCharacter = function (textState) {
        if (enabled && Window_Message.prototype.isPrototypeOf(this)) {
            if (!textState._hangulSteps.length) {
                let c = textState.text[textState.index];

                let steps = getHangulSteps(c);
                if (steps) {
                    textState._hangulSteps = steps;
                } else {
                    var w = this.textWidth(c);
                    this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
                    textState.x += w;
                    textState.index++;
                    return;
                }
            }

            let c = textState._hangulSteps.shift();
            if (!textState._hangulSteps.length) {
                this._htaSprite.bitmap.clear();
                var w = this.textWidth(c);
                this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
                textState.x += w;
                textState.index++;
            } else {
                this._htaSprite.bitmap.clear();
                this._htaSprite.bitmap.drawText(c, textState.x, textState.y, w * 2, textState.height);
            }
        } else {
            Window_Base_processNormalCharacter.call(this, textState);
        }
    };
}
