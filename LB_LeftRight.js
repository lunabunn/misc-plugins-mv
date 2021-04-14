//=============================================================================
// LB_LeftRight.js
//=============================================================================

/*:
 * @plugindesc Fixes the diection of character sprites to the horizontal axis (left and right).
 * @author LunaBunn
 *
 * @help Whether or not to fix the direction of an event's sprite can be
 * specified in an event-by-event manner by inputting either <leftright: true>
 * or <leftright: false> in the Note box of an event. This takes priority over
 * the "Enable for events" plugin parameter. Further, any value other than true
 * (active) and false (deactivate) are ignored.
 * 
 * Whether or not to fix the direction of player sprites can also be
 * specified using the EnablePlayerLeftRight / DisablePlayerLeftRight
 * plugin commands.
 * 
 * @param players
 * @text Enable for players
 * @desc Enabled/Disables fixing the direction of player sprites to the horizontal axis.
 * @type boolean
 * @default true
 * 
 * @param events
 * @text Enable for events
 * @desc Enabled/Disables fixing the direction of event sprites to the horizontal axis BY DEFAULT.
 * @type boolean
 * @default true
 */

/*:ko
 * @plugindesc 캐릭터들의 스프라이트 방향을 왼쪽과 오른쪽으로 고정시켜주는 플러그인입니다.
 * @author LunaBunn
 *
 * @help 이벤트의 노트 항목에 <leftright: true> 혹은 <leftright: false>를
 * 입력하심으로써 스프라이트 고정 여부를 이벤트별로 설정하실 수 있습니다.
 * 이와 같이 고정 여부를 설정하실 경우, '이벤트들에게 사용' 플러그인
 * 파라미터의 값과 관계 없이 적용됩니다. 또한, true (활성화) 와
 * false (비활성화) 이외의 값은 무시됩니다.
 * 
 * EnablePlayerLeftRight / DisablePlayerLeftRight 플러그인 커맨드를 사용해
 * 플레이어의 고정 여부 역시 설정하실 수 있습니다.
 * 
 * @param players
 * @text 플레이어에게 사용
 * @desc 스프라이트 고정 기능을 플레이어에게 사용할지 여부
 *
 * @param events
 * @text 이벤트들에게 사용
 * @desc 스프라이트 고정 기능을 이벤트들에게 사용할지 여부 (기본값)
 */

{
    const params = PluginManager.parameters("LB_LeftRight");

    const initialize1 = Sprite_Character.prototype.initialize;
    Sprite_Character.prototype.initialize = function(character) {
        initialize1.call(this, character);
        this._direction = 6;
    };

    const initialize2 = Game_Player.prototype.initialize;
    Game_Player.prototype.initialize = function() {
        initialize2.call(this);
        this._leftRight = params["players"] == "true";
    };

    const regTrue = /<\s*leftright\s*:\s*true\s*>/;
    const regFalse = /<\s*leftright\s*:\s*false\s*>/;
    const setCharacter = Sprite_Character.prototype.setCharacter;
    Sprite_Character.prototype.setCharacter = function (character) {
        setCharacter.call(this, character);
        if (character instanceof Game_Event) {
            let note = character.event().note;
            if (note) {
                if (regTrue.test(note)) {
                    character._leftRight = true;
                } else if (regFalse.test(note)) {
                    character._leftRight = false;
                } else {
                    character._leftRight = params["events"] == "true";
                }
            } else {
                character._leftRight = params["events"] == "true";
            }
        }
    };

    const pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        pluginCommand.call(this, command, args);
        if (command == "EnablePlayerLeftRight") {
            $gamePlayer._leftRight = true;
            $gamePlayer._followers.forEach(follower => {
                follower._leftRight = true;
            });
        } else if (command == "DisablePlayerLeftRight") {
            $gamePlayer._leftRight = false;
            $gamePlayer._followers.forEach(follower => {
                follower._leftRight = false;
            });
        }
    };

    Sprite_Character.prototype.characterPatternY = function () {
        if (!this._character._leftRight) {
            return (this._character._direction - 2) / 2;
        }
        if (this._character._direction == 4 || this._character._direction == 6) {
            this._direction = this._character._direction;
        }
        return (this._direction - 2) / 2;
    };
}
