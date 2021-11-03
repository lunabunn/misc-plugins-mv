//=============================================================================
// LB_Font.js
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
 * @plugindesc A dead-simple font changer plugin.
 * @author Lunabunn
 *
 * @help Add any custom fonts you want to use to the font faces list and then
 * set the font options below to see them in-game with no additional setup.
 * 
 * @param fontFaces
 * @text Font Faces
 * @desc The list of font faces to use.
 * @type struct<FontFace>[]
 * 
 * @param chineseFonts
 * @text Chinese Font Faces
 * @desc The list of font faces to use for Chinese (comma-separated, highest to lowest priority).
 * @type text
 * @default SimHei, Heiti TC, sans-serif
 * 
 * @param koreanFonts
 * @text Korean Font Faces
 * @desc The list of font faces to use for Korean (comma-separated, highest to lowest priority).
 * @type text
 * @default Dotum, AppleGothic, sans-serif
 * 
 * @param defaultFonts
 * @text Default Font Faces
 * @desc The list of font faces to use (comma-separated, highest to lowest priority).
 * @type text
 * @default GameFont
 * 
 * @param defaultFontSize
 * @text Default Font Size
 * @desc The default font size to use.
 * @type number
 * @default 28
 * 
 * @param lineHeight
 * @text Line Height
 * @desc The line height to use.
 * @type number
 * @default 36
 * 
 * @param textPadding
 * @text Text Padding
 * @desc The text padding to use.
 * @type number
 * @default 6
 */

/*:ko
 * @plugindesc 간단한 글꼴 변경 플러그인입니다.
 *
 * @help 글꼴 목록에 사용하시고 싶은 글꼴들을 추가하신 후 하단의
 * 글꼴 옵션을 변경함으로써 추가 설정 없이 게임에서 사용이 가능합니다.
 * 
 * @param fontFaces
 * @text 글꼴
 * @desc 사용할 글꼴 목록
 * @type struct<FontFace>[]
 * 
 * @param chineseFonts
 * @text 중국어 글꼴
 * @desc 중국어를 표시하기 위해 사용할 글꼴들 (콤마로 구분, 우선순위 내림차순 정렬)
 * @type text
 * @default SimHei, Heiti TC, sans-serif
 * 
 * @param koreanFonts
 * @text 한국어 글꼴
 * @desc 한국어를 표시하기 위해 사용할 글꼴들 (콤마로 구분, 우선순위 내림차순 정렬)
 * @type text
 * @default Dotum, AppleGothic, sans-serif
 * 
 * @param defaultFonts
 * @text 기본 글꼴
 * @desc 기본 글꼴들 (콤마로 구분, 우선순위 내림차순 정렬)
 * @type text
 * @default GameFont
 * 
 * @param defaultFontSize
 * @text 기본 글씨 크기
 * @desc 기본 글씨 크기
 * @type number
 * @default 28
 * 
 * @param lineHeight
 * @text 줄 간격
 * @desc 줄 간격
 * @type number
 * @default 36
 * 
 * @param textPadding
 * @text 글씨 패딩
 * @desc 글씨 패딩
 * @type number
 * @default 6
 */

/*~struct~FontFace:ko
 * @param name
 * @text 글꼴 이름
 * @desc 글꼴의 이름
 * @type text
 *
 * @param file
 * @text 글꼴 파일
 * @desc 글꼴의 파일 경로 (fonts/ 기준).
 * @type text
 */

{
    const fontFaces = JSON.parse(PluginManager.parameters("LB_Font")["fontFaces"] || "[]");
    const chineseFonts = PluginManager.parameters("LB_Font")["chineseFonts"];
    const koreanFonts = PluginManager.parameters("LB_Font")["koreanFonts"];
    const defaultFonts = PluginManager.parameters("LB_Font")["defaultFonts"];
    const defaultFontSize = parseInt(PluginManager.parameters("LB_Font")["defaultFontSize"]);
    const lineHeight = parseInt(PluginManager.parameters("LB_Font")["lineHeight"]);
    const textPadding = parseInt(PluginManager.parameters("LB_Font")["textPadding"]);

    let style = document.createElement("style");
    for (e of fontFaces) {
        const fontFace = JSON.parse(e);
        style.innerHTML += `@font-face {
            font-family: ${fontFace.name};
            src: url("fonts/${fontFace.file}");
        }`;
    }
    document.head.appendChild(style);

    Window_Base.prototype.standardFontFace = function() {
        if ($gameSystem.isChinese()) {
            return chineseFonts;
        } else if ($gameSystem.isKorean()) {
            return koreanFonts;
        } else {
            return defaultFonts;
        }
    };
    
    Window_Base.prototype.standardFontSize = function() {
        return defaultFontSize;
    };

    Window_Base.prototype.lineHeight = function() {
        return lineHeight;
    };

    Window_Base.prototype.textPadding = function() {
        return textPadding;
    };
}
