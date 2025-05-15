const MODULE_ID = "easymovement";

Hooks.once("init", registerSettings);
Hooks.once("ready", patchDragLeftCancel);

/** 
 * Patches `foundry.canvas.placeables.Token.prototype._onDragLeftCancel` if the `modifyDragBehavior` setting is enabled
 * to replace (some of) it's default behavior.
 * Any any issues are encountered during execution, logs the error to console and falls back on the original method.
 * 
 * Note: The shift-right-click doesn't work on Firefox by default (prevent by `dom.event.contextmenu.shift_suppresses_event` if true);
 * 
 * Watch for core updates that change the original Token#_onDragLeftCancel!
 * 
 * TODO: Rewrite this using libWrapper once that's updated to V13
 */
function patchDragLeftCancel() {
    if(!game.settings.get(MODULE_ID, "modifyDragBehavior")) return;

    const originalMethod = foundry.canvas.placeables.Token.prototype._onDragLeftCancel;
    if(!originalMethod) {
        ui.notifications.error("EASYMOVEMENT.Notifications.registrationError", {console: false, localize: true});
        console.error(_prepMsg("Registration error: 'foundry.canvas.placeables.Token.prototype._onDragLeftCancel' is not a function."));
        return;
    }

    const parentProto = Object.getPrototypeOf(foundry.canvas.placeables.Token.prototype);
    if(!parentProto) {
        ui.notifications.error("EASYMOVEMENT.Notifications.registrationError", {console: false, localize: true});
        console.error(_prepMsg("Registration error: Unable to get prototype of 'foundry.canvas.placeables.Token'."));
        return;
    }

    foundry.canvas.placeables.Token.prototype._onDragLeftCancel = function(event) {
        try {
            if ( event.interactionData.cancelled || event.interactionData.dropped ) return true;
            if ( event.interactionData.released ) return false;
            if ( event.interactionData.contexts[this.document.id].waypoints ) {
                // Remove last waypoints if CTRL is down
                const isCtrl = event.ctrlKey || event.metaKey;
                if ( isCtrl ) this._removeDragWaypoint();
                // Add waypoints
                else this._addDragWaypoint(event.interactionData.destination, {snap: !event.shiftKey});
                return false;
            }
            return parentProto._onDragLeftCancel.call(this, event);
        } catch(err) {
            console.error(_prepMsg("_onDragLeftCancel error; falling back to original method."), err);
            return originalMethod.call(this, event);
        }
    }
}

/**
 * Registers settings and keybindings
 */
function registerSettings() {
    game.settings.register(MODULE_ID, "modifyDragBehavior", {
        name: "EASYMOVEMENT.Settings.modifyDragBehavior.Name",
        hint: "EASYMOVEMENT.Settings.modifyDragBehavior.Hint",
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
        requiresReload: true,
    });

    // This approach should work even if movement actions are changed to no longer be hardcoded.
    for(let i = 1; i <= 6; i++) {
        const key = `placeholders.${i}`;

        game.settings.register(MODULE_ID, key, {
            name: `EASYMOVEMENT.Settings.PlaceholderKeys.names.${i}`,
            hint: `EASYMOVEMENT.Settings.PlaceholderKeys.hints.${i}`,
            scope: "client",
            config: true,
            type: new foundry.data.fields.StringField({
                choices: () => Object.fromEntries(
                    Object.entries(CONFIG.Token.movement.actions)
                        .map(([k, v]) => [k, v.label])
                ),
                blank: true,
            }),
            default: "",
        });

        game.keybindings.register(MODULE_ID, key, {
            name: `EASYMOVEMENT.Settings.PlaceholderKeys.names.${i}`,
            editable: [{ key: `Digit${i}`, modifiers: ["Shift"] }],
            onDown: () => onPlaceholderKeyDown(i)
        });
    }
}

/**
 * Called when one of the registered placeholder keys is pressed.
 * @param {number} keyIndex 
 */
function onPlaceholderKeyDown(keyIndex) {
    const action = game.settings.get(MODULE_ID, `placeholders.${keyIndex}`);
    if(action) changeMovementAction(action);
}

let latestNotif;

/**
 * Changes the movement action of all currently controlled tokens that can select it to the given action.
 * @param {string} action 
 */
async function changeMovementAction(action) {
    const actionConfig = CONFIG.Token.movement.actions[action];
    if(!actionConfig) return;

    const updates = canvas.tokens.controlled
        .filter(t => t.document.movementAction !== action && actionConfig.canSelect(t.document))
        .map(t => ({ _id: t.document.id, movementAction: action }));
    if(updates.length) {
        await canvas.scene.updateEmbeddedDocuments("Token", updates);
        canvas.tokens.recalculatePlannedMovementPaths();
    }

    if(latestNotif) ui.notifications.remove(latestNotif);
    latestNotif = ui.notifications.success(actionConfig.label, {console: false, localize: true});
}

/**
 * Prepends the module id to a string.
 * @param {string} msg 
 * @returns {string}
 */
function _prepMsg(msg) { return `EasyMovement | ${msg}`; }
