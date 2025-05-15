# EasyMovement

EasyMovement is a Foundry VTT module allowing users to simplify and customize the way they move their tokens. It offers more intuitive waypoint management during token dragging (mirroring the way e.g. drawing tools work) and allows for quick switching between movement types via configurable hotkeys.

# Features

- **Configurable Behavior:** All features of this module can configured and disabled separately for each user.
- **Intuitive Right-Click Waypoints:** During a token drag, right-click to add a waypoint. Hold CTRL (or CMD on Mac) and right-click to remove the last added waypoint. This mirrors the way some drawing tools or other map tools handle point placement/removal.
- **Precise Movement Type Switching:** Assign specific movement types (like Walk, Fly, Swim) to hotkeys (default Shift+1 through Shift+6) which allows you to instantly change the active movement type for all selected tokens without having to tab multiple times or use the Token HUD.

# Installation

This module can be installed from the Foundry VTT module browser or via manifest url from the latest release: `https://github.com/Belodri/easymovement/releases/latest/download/module.json`

# Configuration

- **Enable Right-Click Waypoints:** Check to enable the modified right-click waypoint controls or uncheck to use Foundry VTT's default behavior.
- **Movement Action Hotkeys:** Assign movement types (e.g., 'Walk,' 'Fly,' 'Burrow') to up to six hotkeys. These default to Shift+1 through Shift+6 but can be fully customized via the 'Configure Controls' menu.

# Usage & Interface

- **Right-Click Waypoints:** If the **Enable Right-Click Waypoints** setting is enabled you can right-click while dragging tokens to set a new waypoint.
    - **Shift:** Hold Shift while right-clicking to place a waypoint without snapping.
        **Note for Firefox Users:** Firefox overrides certain shift-right-clicks by default which messes with this functionality. This override can be disabled via a browser setting (`about:config` -> `dom.event.contextmenu.shift_suppresses_event` to `false`).
    - **CTRL/CMD:** Hold CTRL (or CMD on Mac) while right-clicking to remove the last waypoint, or to cancel the drag if no waypoint remains.
- **Movement Action Hotkeys:** Once you have assigned a movement type to a hotkey in the settings, you can use that hotkey to quickly change the movement action for all selected tokens that can use that movement type, even while you're already dragging them. 

# Reporting Issues and Requesting Features

If you are experiencing a bug or have an idea for a new feature, submit an [issue](https://github.com/belodri/easymovement/issues).
