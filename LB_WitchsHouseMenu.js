//=============================================================================
// LB_WitchsHouseMenu.js
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
 * @plugindesc Implements a basic menu resembling that of the Witch's House.
 * @author Lunabunn
 *
 * @help You can change the menu placement as needed. Default values are
 * tailored to the default game resolution of 816 by 624.
 * 
 * You can change the menu commands displayed by changing the
 * menu commands option on the right. The command function should be one of
 * item, skill, equip, status, formation, options, save, and gameEnd.
 * 
 * Custom functions are not yet implemented.
 * If you have a feature request, please contact me.
 * 
 * @param ---Main Menu---
 * 
 * @param menuCommands
 * @text Menu Commands
 * @desc The commands that will be displayed in the main menu.
 * @type struct<MenuCommand>[]
 * @default ["{\"text\":\"Items\",\"function\":\"item\",\"enabled\":\"this.areMainCommandsEnabled()\"}","{\"text\":\"Save\",\"function\":\"save\",\"enabled\":\"this.isSaveEnabled()\"}","{\"text\":\"Options\",\"function\":\"options\",\"enabled\":\"this.isOptionsEnabled()\"}"]
 * 
 * @param menuCommandWidth
 * @text Menu Command Window Width
 * @desc The width of the menu commands window.
 * @type number
 * @default 240
 * 
 * @param menuStatusWidth
 * @text Menu Status Window Width
 * @desc The width of the menu status window.
 * @type number
 * @default 576
 * 
 * @param menuHeight
 * @text Menu Height
 * @desc The height of the menu.
 * @type number
 * @default 183
 * 
 * @param menuSideGap
 * @text Menu Side Gap
 * @desc The gap between the menu commands window and the menu status window.
 * @type number
 * @default 0
 * 
 * @param menuBottomGap
 * @text Menu Bottom Gap
 * @desc The gap between the menu and the bottom of the screen.
 * @type number
 * @default 0
 * 
 * @param hideMp
 * @text Hide MP
 * @desc Hide the MP gauge and status effect icons.
 * @type boolean
 * @default false
 * 
 * @param ---Item Menu---
 * 
 * @param itemMenuWidth
 * @text Item Menu Width
 * @desc The width of the item menu.
 * @type number
 * @default 816
 * 
 * @param itemHeight
 * @text Item Window Height
 * @desc The height of the item window.
 * @type number
 * @default 183
 * 
 * @param itemHelperHeight
 * @text Item Helper Window Height
 * @desc The height of the item helper window.
 * @type number
 * @default 48
 * 
 * @param itemBtwnGap
 * @text Item Menu Gap
 * @desc The gap between the item window and the item helper window.
 * @type number
 * @default 0
 * 
 * @param itemBottomGap
 * @text Item Menu Bottom Gap
 * @desc The gap between the item menu and the bottom of the screen.
 * @type number
 * @default 0
 */

/*~struct~MenuCommand:
 * @param text
 * @text Command Text
 * @desc The menu text for the command.
 * @type text
 * 
 * @param function
 * @text Command Function
 * @desc The function to be called when the command is selected (case-sensitive).
 * 
 * @param enabled
 * @text Enabled
 * @desc The JavaScript expression representing the enabled condition for the command.
 * @type text
*/

{
    const menuCommands = JSON.parse(PluginManager.parameters("LB_WitchsHouseMenu")["menuCommands"]).map(e => JSON.parse(e));
    const menuCommandWidth = parseInt(PluginManager.parameters("LB_WitchsHouseMenu")["menuCommandWidth"]) || 240;
    const menuStatusWidth = parseInt(PluginManager.parameters("LB_WitchsHouseMenu")["menuStatusWidth"]) || 576;
    const menuHeight = parseInt(PluginManager.parameters("LB_WitchsHouseMenu")["menuHeight"]) || 183;
    const menuSideGap = parseInt(PluginManager.parameters("LB_WitchsHouseMenu")["menuSideGap"]) || 0;
    const menuBottomGap = parseInt(PluginManager.parameters("LB_WitchsHouseMenu")["menuBottomGap"]) || 0;
    const hideMp = PluginManager.parameters("LB_WitchsHouseMenu")["hideMp"] === "true";
    const itemMenuWidth = parseInt(PluginManager.parameters("LB_WitchsHouseMenu")["itemMenuWidth"]) || 816;
    const itemHeight = parseInt(PluginManager.parameters("LB_WitchsHouseMenu")["itemHeight"]) || 183;
    const itemHelperHeight = parseInt(PluginManager.parameters("LB_WitchsHouseMenu")["itemHelperHeight"]) || 48;
    const itemBtwnGap = parseInt(PluginManager.parameters("LB_WitchsHouseMenu")["itemBtwnGap"]) || 0;
    const itemBottomGap = parseInt(PluginManager.parameters("LB_WitchsHouseMenu")["itemBottomGap"]) || 0;

    /* Scene_Menu */

    const menuTotalWidth = menuCommandWidth + menuStatusWidth + menuSideGap;

    if (hideMp) {
        Window_MenuStatus.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
            var lineHeight = this.lineHeight();
            var x2 = x + 180;
            var width2 = Math.min(200, width - 180 - this.textPadding());
            this.drawActorName(actor, x, y + lineHeight * 0.5);
            this.drawActorLevel(actor, x, y + lineHeight * 1.5);
            this.drawActorClass(actor, x2, y + lineHeight * 0.5);
            this.drawActorHp(actor, x2, y + lineHeight * 1.5, width2);
        };
    };

    Window_MenuStatus_initialize = Window_MenuStatus.prototype.initialize;
    Window_MenuStatus.prototype.initialize = function (x, y) {
        Window_MenuStatus_initialize.call(this, x, y);
        const menuX = (Graphics.boxWidth - menuTotalWidth) / 2 + menuCommandWidth + menuSideGap;
        const menuY = Graphics.boxHeight - menuHeight - menuBottomGap;
        this.move(menuX, menuY, menuStatusWidth, menuHeight);
    };

    Window_MenuStatus.prototype.numVisibleRows = function () {
        return 1;
    };

    Window_MenuCommand_initialize = Window_MenuCommand.prototype.initialize;
    Window_MenuCommand.prototype.initialize = function (x, y) {
        Window_MenuCommand_initialize.call(this, x, y);
        const menuX = (Graphics.boxWidth - menuTotalWidth) / 2;
        const menuY = Graphics.boxHeight - menuHeight - menuBottomGap;
        this.move(menuX, menuY, menuCommandWidth, menuHeight);
        this.selectLast();
    };

    Window_MenuCommand.prototype.makeCommandList = function () {
        for (menuCommand of menuCommands) {
            this.addCommand(menuCommand.text, menuCommand.function, eval(menuCommand.enabled));
        }
    };

    Scene_Menu.prototype.createGoldWindow = function () {
        // Get rid of the gold window
    };

    /* Scene_Item */

    const Window_ItemList_includes = Window_ItemList.prototype.includes;
    Window_ItemList.prototype.includes = function (item) {
        return this._category === "all" || Window_ItemList_includes.call(this, item);
    };

    Scene_Item.prototype.createCategoryWindow = function () {
        // Get rid of the category window
    };

    const Scene_Item_createHelpWindow = Scene_Item.prototype.createHelpWindow;
    Scene_Item.prototype.createHelpWindow = function () {
        Scene_Item_createHelpWindow.call(this);
        const menuX = (Graphics.boxWidth - itemMenuWidth) / 2;
        const menuY = Graphics.boxHeight - itemHeight - itemHelperHeight - itemBottomGap - itemBtwnGap;
        this._helpWindow.move(menuX, menuY, itemMenuWidth, itemHelperHeight);
    };

    Scene_Item.prototype.createItemWindow = function () {
        const menuX = (Graphics.boxWidth - itemMenuWidth) / 2;
        const menuY = Graphics.boxHeight - itemHeight - itemBottomGap;
        this._itemWindow = new Window_ItemList(menuX, menuY, itemMenuWidth, itemHeight);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
        this._itemWindow.setHandler("cancel", this.popScene.bind(this));
        this._itemWindow.setCategory("all");
        this.addWindow(this._itemWindow);
        this._itemWindow.activate();
        this._itemWindow.select(0);
    };
}
