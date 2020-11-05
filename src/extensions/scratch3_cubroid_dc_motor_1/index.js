const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const cast = require('../../util/cast');
const formatMessage = require('format-message');
const BLE = require('../../io/ble');
const Base64Util = require('../../util/base64-util');
const MathUtil = require('../../util/math-util');

/**
 * Icon png to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4yIiBiYXNlUHJvZmlsZT0idGlueSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiDQoJIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDBweCIgaGVpZ2h0PSI0MHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGNpcmNsZSBmaWxsPSIjMEI5MUNGIiBjeD0iMzMuNSIgY3k9IjYuNSIgcj0iNC41Ii8+DQo8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMzIuMiw1LjNjLTAuMSwwLTAuMi0wLjEtMC4zLTAuMmMtMC4xLTAuMS0wLjEtMC4zLDAtMC40QzMyLDQuNiwzMiw0LjUsMzIuMiw0LjRsMC45LTAuNQ0KCWMwLjEtMC4xLDAuMi0wLjEsMC4zLTAuMXMwLjIsMCwwLjMsMHMwLjIsMCwwLjMsMC4xYzAuMSwwLDAuMSwwLjEsMC4yLDAuMmMwLDAuMSwwLjEsMC4xLDAuMSwwLjJzMCwwLjIsMCwwLjJ2NC44DQoJYzAsMC4yLTAuMSwwLjMtMC4yLDAuNGMtMC4xLDAuMS0wLjMsMC4yLTAuNCwwLjJjLTAuMiwwLTAuMy0wLjEtMC40LTAuMmMtMC4xLTAuMS0wLjItMC4zLTAuMi0wLjRWNWwtMC41LDAuMw0KCUMzMi41LDUuMywzMi4zLDUuMywzMi4yLDUuM3oiLz4NCjxnPg0KCTxwYXRoIGZpbGw9IiNFNURERDciIGQ9Ik0yMC44LDE2LjN2MC41YzAsMC4yLTAuMiwwLjMtMC40LDAuM2gtNi45Yy0wLjIsMC0wLjQtMC4xLTAuNC0wLjN2LTAuNXYtMi41di0wLjdjMC0wLjIsMC4yLTAuMywwLjQtMC4zDQoJCWg2LjljMC4yLDAsMC40LDAuMSwwLjQsMC4zdjAuN1YxNi4zeiIvPg0KCTxwYXRoIGZpbGw9IiNFNURERDciIGQ9Ik0yMi45LDEzSDExLjFjLTAuNSwwLTAuOS0wLjQtMC45LTAuOXYwYzAtMy41LDIuOC02LjMsNi4zLTYuM2gxLjFjMy41LDAsNi4zLDIuOCw2LjMsNi4zbDAsMA0KCQlDMjMuOCwxMi42LDIzLjQsMTMsMjIuOSwxM3oiLz4NCgk8cmVjdCB4PSIxMC44IiB5PSI1LjUiIGZpbGw9IiMwRTcyOTQiIHdpZHRoPSIxMi41IiBoZWlnaHQ9IjQuMiIvPg0KCTxwYXRoIGZpbGw9IiNFNURERDciIGQ9Ik0yMC4zLDUuNmgtMC43Yy0wLjQsMC0wLjgtMC40LTAuOC0wLjh2MGMwLTAuNCwwLjQtMC44LDAuOC0wLjhoMC43YzAuNCwwLDAuOCwwLjQsMC44LDAuOHYwDQoJCUMyMS4xLDUuMiwyMC43LDUuNiwyMC4zLDUuNnoiLz4NCgk8cGF0aCBmaWxsPSIjRTVEREQ3IiBkPSJNMTQuNCw1LjZoLTAuN2MtMC40LDAtMC44LTAuNC0wLjgtMC44djBjMC0wLjQsMC40LTAuOCwwLjgtMC44aDAuN2MwLjQsMCwwLjgsMC40LDAuOCwwLjh2MA0KCQlDMTUuMiw1LjIsMTQuOSw1LjYsMTQuNCw1LjZ6Ii8+DQoJPHBhdGggZmlsbD0iI0U1RERENyIgZD0iTTE3LjQsNS42aC0wLjdjLTAuNCwwLTAuOC0wLjQtMC44LTAuOHYwYzAtMC40LDAuNC0wLjgsMC44LTAuOGgwLjdjMC40LDAsMC44LDAuNCwwLjgsMC44djANCgkJQzE4LjIsNS4yLDE3LjgsNS42LDE3LjQsNS42eiIvPg0KCTxwYXRoIGZpbGw9IiMwMEE2RTAiIGQ9Ik0xNC4zLDguM2MwLDAuMy0wLjIsMC41LTAuNSwwLjVjLTAuMywwLTAuNS0wLjItMC41LTAuNWMwLTAuMywwLjItMC41LDAuNS0wLjVDMTQuMSw3LjgsMTQuMyw4LDE0LjMsOC4zeiINCgkJLz4NCgk8cGF0aCBmaWxsPSIjMDBBNkUwIiBkPSJNMTkuNyw4LjNjMCwwLjMsMC4yLDAuNSwwLjUsMC41YzAuMywwLDAuNS0wLjIsMC41LTAuNWMwLTAuMy0wLjItMC41LTAuNS0wLjVDMTkuOSw3LjgsMTkuNyw4LDE5LjcsOC4zeiINCgkJLz4NCgk8cGF0aCBmaWxsPSIjQTA5NjkwIiBkPSJNMTguNCwxMWMwLDAsMC0wLjEsMC0wLjJjMCwwLTAuMSwwLTAuMiwwYy0wLjMsMC4zLTAuNywwLjUtMS4xLDAuNWMtMC40LDAtMC44LTAuMi0xLjEtMC41DQoJCWMwLDAtMC4xLTAuMS0wLjIsMGMwLDAtMC4xLDAuMSwwLDAuMmMwLjMsMC40LDAuOCwwLjYsMS4zLDAuNkMxNy42LDExLjYsMTguMSwxMS40LDE4LjQsMTF6Ii8+DQoJPHBhdGggZmlsbD0iIzAwQTZFMCIgZD0iTTIyLjMsNC44SDExLjdjLTAuMywwLTAuNiwwLjEtMC44LDAuM2wtMC40LDAuNGMtMC4yLDAuMi0wLjMsMC41LTAuMywwLjh2NS4zbDAsMGMwLjYsMCwxLTAuNSwxLTFWOC44DQoJCWMwLTEuNywxLjQtMywzLTNoNS42YzEuNywwLDMsMS40LDMsM3YxLjhjMCwwLjYsMC41LDEsMSwxbDAsMFY2LjNjMC0wLjMtMC4xLTAuNi0wLjMtMC44bC0wLjQtMC40QzIyLjksNC45LDIyLjYsNC44LDIyLjMsNC44eiIvPg0KCTxwYXRoIGZpbGw9IiMwRTcyOTQiIGQ9Ik0yNy4zLDI0LjdjLTAuOS0zLjctMi4zLTQuNC00LjMtNC40bDAtMC45YzIuOCwwLDQuMywxLjUsNS4yLDVMMjcuMywyNC43eiIvPg0KCTxwYXRoIGZpbGw9IiMwMEE2RTAiIGQ9Ik0zMCwyNS40bC0xLjMtMi4yYzAuMSwwLjEsMC4xLDAuMiwwLjEsMC4zYzAuMiwwLjYtMC4xLDEuMy0wLjYsMS42Yy0wLjEsMC4xLTAuMiwwLjItMC4yLDAuM2wwLjksMy44DQoJCWMwLDAuMiwwLjIsMC4zLDAuNCwwLjJsMC4zLTAuMWMwLjEsMCwwLjItMC4xLDAuMi0wLjNsMC4xLTMuNUMzMC4xLDI1LjUsMzAuMSwyNS40LDMwLDI1LjR6Ii8+DQoJPHBhdGggZmlsbD0iIzAwQTZFMCIgZD0iTTI2LDI0LjJjMC0wLjEsMC0wLjIsMC0wLjRsLTAuMSwyLjZjMCwwLDAsMC4xLDAsMC4ybDEuOCwzYzAuMSwwLjEsMC4yLDAuMiwwLjMsMC4xbDAuMy0wLjENCgkJYzAuMiwwLDAuMy0wLjIsMC4yLTAuNGwtMC45LTMuOGMwLTAuMS0wLjItMC4yLTAuMy0wLjJDMjYuNywyNS4zLDI2LjIsMjQuOCwyNiwyNC4yeiIvPg0KCTxnPg0KCQk8cGF0aCBmaWxsPSIjMDBBNkUwIiBkPSJNMjcuNCwyNS4xYy0wLjYsMC0xLjEtMC40LTEuMy0xYy0wLjItMC43LDAuMi0xLjQsMC45LTEuNmMwLjEsMCwwLjIsMCwwLjMsMGMwLjYsMCwxLjEsMC40LDEuMywxDQoJCQljMC4xLDAuMywwLDAuNy0wLjEsMWMtMC4yLDAuMy0wLjUsMC41LTAuOCwwLjZDMjcuNywyNS4xLDI3LjYsMjUuMSwyNy40LDI1LjF6Ii8+DQoJCTxwYXRoIGZpbGw9IiMwRTcyOTQiIGQ9Ik0yNy40LDIyLjdjMC41LDAsMSwwLjMsMS4xLDAuOGMwLjIsMC42LTAuMiwxLjItMC44LDEuNGMtMC4xLDAtMC4yLDAtMC4zLDBjLTAuNSwwLTEtMC4zLTEuMS0wLjgNCgkJCWMtMC4yLTAuNiwwLjItMS4yLDAuOC0xLjRDMjcuMywyMi43LDI3LjQsMjIuNywyNy40LDIyLjcgTTI3LjQsMjIuNGMtMC4xLDAtMC4yLDAtMC40LDBjLTAuOCwwLjItMS4zLDEtMS4xLDEuOA0KCQkJYzAuMiwwLjcsMC43LDEuMSwxLjQsMS4xYzAuMSwwLDAuMiwwLDAuNCwwYzAuNC0wLjEsMC43LTAuMywwLjktMC43YzAuMi0wLjMsMC4zLTAuNywwLjItMS4xQzI4LjcsMjIuOCwyOC4xLDIyLjQsMjcuNCwyMi40DQoJCQlMMjcuNCwyMi40eiIvPg0KCTwvZz4NCgk8cGF0aCBmaWxsPSIjMEU3Mjk0IiBkPSJNMTAuOSwyMWMtMi43LDAtNC4yLTEuNS01LjEtNWwwLjgtMC4yYzAuOSwzLjcsMi4zLDQuNCw0LjMsNC40bDAsMC45QzExLDIxLDExLDIxLDEwLjksMjF6Ii8+DQoJPGc+DQoJCTxwYXRoIGZpbGw9IiMwMEE2RTAiIGQ9Ik02LjYsMTcuOWMtMC42LDAtMS4xLTAuNC0xLjMtMWMtMC4xLTAuMywwLTAuNywwLjEtMWMwLjItMC4zLDAuNS0wLjUsMC44LTAuNmMwLjEsMCwwLjIsMCwwLjMsMA0KCQkJYzAuNiwwLDEuMSwwLjQsMS4zLDFjMC4xLDAuMywwLDAuNy0wLjEsMWMtMC4yLDAuMy0wLjUsMC41LTAuOCwwLjZDNi44LDE3LjksNi43LDE3LjksNi42LDE3Ljl6Ii8+DQoJCTxwYXRoIGZpbGw9IiMwRTcyOTQiIGQ9Ik02LjYsMTUuNWMwLjUsMCwxLDAuMywxLjEsMC44YzAuMiwwLjYtMC4yLDEuMi0wLjgsMS40Yy0wLjEsMC0wLjIsMC0wLjMsMGMtMC41LDAtMS0wLjMtMS4xLTAuOA0KCQkJYy0wLjItMC42LDAuMi0xLjIsMC44LTEuNEM2LjQsMTUuNSw2LjUsMTUuNSw2LjYsMTUuNSBNNi42LDE1LjFjLTAuMSwwLTAuMiwwLTAuNCwwYy0wLjgsMC4yLTEuMywxLTEuMSwxLjgNCgkJCWMwLjIsMC43LDAuNywxLjEsMS40LDEuMWMwLjEsMCwwLjIsMCwwLjQsMGMwLjQtMC4xLDAuNy0wLjMsMC45LTAuN0M4LDE3LDguMSwxNi42LDgsMTYuMkM3LjgsMTUuNiw3LjIsMTUuMSw2LjYsMTUuMUw2LjYsMTUuMXoiDQoJCQkvPg0KCTwvZz4NCgk8cGF0aCBmaWxsPSIjMDBBNkUwIiBkPSJNNCwxNS4xbDEuMywyLjJjLTAuMS0wLjEtMC4xLTAuMi0wLjEtMC4zQzUsMTYuMiw1LjMsMTUuNSw2LDE1LjJsLTEtNGMwLTAuMS0wLjItMC4yLTAuMy0wLjJsLTAuMywwLjENCgkJYy0wLjIsMC0wLjMsMC4yLTAuMywwLjNsLTAuMSwzLjRDMy45LDE0LjksNCwxNSw0LDE1LjF6Ii8+DQoJPHBhdGggZmlsbD0iIzAwQTZFMCIgZD0iTTgsMTYuMmMwLDAuMSwwLDAuMiwwLDAuNEw4LjEsMTRjMC0wLjEsMC0wLjEsMC0wLjJsLTEuOC0zYy0wLjEtMC4xLTAuMi0wLjItMC40LTAuMmwtMC4zLDAuMQ0KCQljLTAuMSwwLTAuMiwwLjItMC4yLDAuM2wxLDRDNy4xLDE1LjEsNy44LDE1LjUsOCwxNi4yeiIvPg0KCTxwYXRoIGZpbGw9IiMyQjI1MjIiIGQ9Ik0xNi43LDM2TDE2LjcsMzZjLTEuMiwwLTIuMi0xLTIuMi0yLjJ2LTUuM2g0LjR2NS4zQzE4LjksMzUsMTcuOSwzNiwxNi43LDM2eiIvPg0KCTxwYXRoIGZpbGw9IiM0ODQzNDIiIGQ9Ik0xNy44LDMyLjJoLTIuMWMtMC4zLDAtMC41LTAuMi0wLjUtMC41bDAsMGMwLTAuMywwLjItMC41LDAuNS0wLjVoMi4xYzAuMywwLDAuNSwwLjIsMC41LDAuNWwwLDANCgkJQzE4LjMsMzIsMTgsMzIuMiwxNy44LDMyLjJ6Ii8+DQoJPHBhdGggZmlsbD0iIzQ4NDM0MiIgZD0iTTE3LjgsMzMuOGgtMi4xYy0wLjMsMC0wLjUtMC4yLTAuNS0wLjVsMCwwYzAtMC4zLDAuMi0wLjUsMC41LTAuNWgyLjFjMC4zLDAsMC41LDAuMiwwLjUsMC41bDAsMA0KCQlDMTguMywzMy42LDE4LDMzLjgsMTcuOCwzMy44eiIvPg0KCTxwYXRoIGZpbGw9IiM0ODQzNDIiIGQ9Ik0xNy44LDM1LjRoLTIuMWMtMC4zLDAtMC41LTAuMi0wLjUtMC41bDAsMGMwLTAuMywwLjItMC41LDAuNS0wLjVoMi4xYzAuMywwLDAuNSwwLjIsMC41LDAuNWwwLDANCgkJQzE4LjMsMzUuMiwxOCwzNS40LDE3LjgsMzUuNHoiLz4NCgk8cGF0aCBmaWxsPSIjMDBBNkUwIiBkPSJNMjQuNSwzMC4xVjE4LjVjMC0wLjMtMC4xLTAuNi0wLjMtMC44bC0wLjUtMC41Yy0wLjItMC4yLTAuNS0wLjMtMC44LTAuM0gxMS4yYy0wLjMsMC0wLjYsMC4xLTAuOCwwLjMNCgkJbC0wLjUsMC41Yy0wLjIsMC4yLTAuMywwLjUtMC4zLDAuOHYxMS42YzAsMC4zLDAuMSwwLjYsMC4zLDAuOGwwLjUsMC41YzAuMiwwLjIsMC41LDAuMywwLjgsMC4zaDExLjZjMC4zLDAsMC42LTAuMSwwLjgtMC4zDQoJCWwwLjUtMC41QzI0LjMsMzAuNywyNC41LDMwLjQsMjQuNSwzMC4xeiIvPg0KCTxwYXRoIGZpbGw9IiNFNURERDciIGQ9Ik0xNywzMC42TDE3LDMwLjZjLTMuNSwwLTYuMy0yLjktNi4zLTYuM3YwYzAtMy41LDIuOS02LjMsNi4zLTYuM2gwYzMuNSwwLDYuMywyLjksNi4zLDYuM3YwDQoJCUMyMy4zLDI3LjgsMjAuNSwzMC42LDE3LDMwLjZ6Ii8+DQoJPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTE4LjUsMjEuMmgtMi45Yy0wLjQsMC0wLjgtMC40LTAuOC0wLjhsMCwwYzAtMC40LDAuNC0wLjgsMC44LTAuOGgyLjljMC40LDAsMC44LDAuNCwwLjgsMC44bDAsMA0KCQlDMTkuMywyMC44LDE4LjksMjEuMiwxOC41LDIxLjJ6Ii8+DQoJPHBhdGggZmlsbD0iIzAwQTZFMCIgZD0iTTE3LjQsMjBjLTAuMS0wLjEtMC4yLDAtMC4yLDBjMCwwLDAsMC4xLDAsMC4xYzAuMSwwLjEsMC4xLDAuMiwwLjEsMC4zYzAsMC4yLTAuMiwwLjQtMC41LDAuMw0KCQljLTAuMiwwLTAuMy0wLjItMC4zLTAuNGMwLTAuMSwwLjEtMC4yLDAuMS0wLjJjMCwwLDAtMC4xLDAtMC4yYzAsMC0wLjEsMC0wLjIsMGMtMC4xLDAuMi0wLjIsMC4zLTAuMiwwLjVjMC4xLDAuMywwLjQsMC41LDAuNywwLjUNCgkJYzAuMy0wLjEsMC41LTAuMywwLjUtMC42YzAsMCwwLDAsMCwwQzE3LjYsMjAuMiwxNy41LDIwLjEsMTcuNCwyMHoiLz4NCgk8cGF0aCBmaWxsPSIjMDBBNkUwIiBkPSJNMTYuOSwyMC4yYzAsMC4xLDAsMC4yLDAsMC4zYzAsMC4xLDAsMC4xLDAuMSwwLjFjMC4xLDAsMC4xLDAsMC4xLTAuMWMwLTAuMiwwLTAuNCwwLTAuNmMwLDAsMC0wLjEsMC0wLjENCgkJYzAsMC0wLjEsMC0wLjIsMGMwLDAsMCwwLDAsMC4xQzE2LjksMjAsMTYuOSwyMC4xLDE2LjksMjAuMkwxNi45LDIwLjJMMTYuOSwyMC4yeiIvPg0KPC9nPg0KPC9zdmc+DQo=";
const BLETimeout = 2500;
const BLEDataStoppedError = 'Cubroid extension stopped receiving data';


const BLEUUID = {
    name: 'DC Motor',
    misc_service: 'b7c23878-e520-466e-9b5b-480407ab4870',
    sensor_service: 'b7c23878-e520-466e-9b5b-480407ab4871',
};

class CubroidDcMotor01 {

    /**
     * Construct a EduBoyt communication object.
     * @param {Runtime} runtime - the Scratch 3.0 runtime
     * @param {string} extensionId - the id of the extension
     */
    constructor (runtime, extensionId) {
        this._runtime = runtime;

        this._ble = null;
        this._runtime.registerPeripheralExtension(extensionId, this);
        this._extensionId = extensionId;

        this._timeoutID = null;
        this._busy = false;
        this._busyTimeoutID = null;



        this.disconnect = this.disconnect.bind(this);
        this._onConnect = this._onConnect.bind(this);
        this._onMessage = this._onMessage.bind(this);
    }

    dcMotorControl (index) {
        var data = [];
        switch (index) {
            case MotorOptions.LEFT:
                data = [255, 0];
                break;
            case MotorOptions.RIGHT:
                data = [0, 255];
                break;
            case MotorOptions.STOP:
                data = [0,0];
                break;
            default:
                data = [0,0];
        }
        return this.send(BLEUUID.misc_service, BLEUUID.sensor_service, data);
    }

    send (service, characteristic, value) {
        if (!this.isConnected()) return;
        if (this._busy) return;

        this._busy = true;
        this._busyTimeoutID = window.setTimeout(() => {
            this._busy = false;
        }, 5000);

        const data = Base64Util.uint8ArrayToBase64(value);
        this._ble.write(service, characteristic, data, 'base64', true).then(
            () => {
                this._busy = false;
                window.clearTimeout(this._busyTimeoutID);
            }
        );
    }

//    scan () {
//        if (this._ble) {
//            this._ble.disconnect();
//        }
//        this._ble = new BLE(this._runtime, this._extensionId, {
//            filters: [
//                {services: [BLEUUID.motor_service, BLEUUID.misc_service, BLEUUID.sensor_service]}
//            ]
//        }, this._onConnect, this.disconnect);
//    }

    scan() {
        if (this._ble) {
            this._ble.disconnect();
        }

        const bleName = localStorage.getItem('groupNumber') ? BLEUUID.name + '-' + localStorage.getItem('groupNumber') : BLEUUID.name;

        this._ble = new BLE(this._runtime, this._extensionId, {
            filters: [
                { name: bleName }
            ],
            optionalServices: [
                BLEUUID.misc_service
            ]

        }, this._onConnect, this.reset);
        // console.log("BLEUUID.name = ", bleName);
    }


    connect (id) {
        if (this._ble) {
            this._ble.connectPeripheral(id);
        }
    }

    disconnect () {
        window.clearInterval(this._timeoutID);
        if (this._ble) {
            this._ble.disconnect();
        }
    }

    isConnected () {
        let connected = false;
        if (this._ble) {
            connected = this._ble.isConnected();
        }
        return connected;
    }

    _onConnect() {
//        this._ble.read(BLEUUID.misc_service, BLEUUID.sensor_service, true, this._onMessage);
//        this._timeoutID = window.setInterval(
//            () => this._ble.handleDisconnectError(BLEDataStoppedError),
//            BLETimeout
//        );
    }

    _onMessage(base64) {
//        const data = Base64Util.base64ToUint8Array(base64);

//        // cancel disconnect timeout and start a new one
//        window.clearInterval(this._timeoutID);
//        this._timeoutID = window.setInterval(
//            () => this._ble.handleDisconnectError(BLEDataStoppedError),
//            BLETimeout
//        );
    }
}

/**
 * motor options.
 * @readonly
 * @enum {string}
 */
const MotorOptions = {
    LEFT: 'Left',
    RIGHT: 'Right',
    STOP: 'Stop'
}

/**
 * Scratch 3.0 blocks to interact with a cubroid dc motor peripheral.
 */
class Scratch3CubroidDcMotor01Blocks {

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return 'Cubroid Dc Motor 1';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return 'cubroiddcmotor01';
    }

    /**
     * Construct a set of cubroid dc motor blocks.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor (runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        // Create a new cubroid dc motor peripheral instance (아래는 큐브로이드를 연결하기 전에 찾는 화면이 보여주는 코드)
        this._peripheral = new CubroidDcMotor01(this.runtime, Scratch3CubroidDcMotor01Blocks.EXTENSION_ID);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: Scratch3CubroidDcMotor01Blocks.EXTENSION_ID,
            name: Scratch3CubroidDcMotor01Blocks.EXTENSION_NAME,
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: 'dcMotorControl',
                    text: formatMessage({
                        id: 'cubroiddcmotor01.dcMotorControl',
                        default: 'DC Motor 1 [INDEX]',
                        description: 'Cubroid dc motor 1'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        INDEX: {
                            type: ArgumentType.STRING,
                            menu: 'MotorAction',
                            defaultValue: 'Stop'
                        }
                    }
                },
                {
                    opcode: 'dcMotorControl2',
                    text: 'DC 모터 1번을 [TIME]초 동안 [INDEX]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TIME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        INDEX: {
                            type: ArgumentType.STRING,
                            menu: 'MotorAction',
                            defaultValue: 'Stop'
                        }
                    }
                },
                {
                    opcode: 'dcMotorStop',
                    text: 'DC 모터 1번을 끄기',
                    blockType: BlockType.COMMAND,
                    arguments: {
                    }
                }
            ],
            menus: {
                MotorAction: this.MOTOR_ACTION_MENU
            }
        };
    }

    get MOTOR_ACTION_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'cubroiddcmotor01.motoroptionmenu.stop',
                    default: 'Stop',
                    description: 'Stop'
                }),
                value: MotorOptions.STOP
            },
            {
                text: formatMessage({
                    id: 'cubroiddcmotor01.motoroptionmenu.left',
                    default: 'Left',
                    description: 'Left'
                }),
                value: MotorOptions.LEFT
            },
            {
                text: formatMessage({
                    id: 'cubroiddcmotor01.motoroptionmenu.right',
                    default: 'Right',
                    description: 'Right'
                }),
                value: MotorOptions.RIGHT
            }
        ]
    }

    dcMotorControl (args) {
        const index = args.INDEX;

        //if (index >= 0 && index <= 3) {
        this._peripheral.dcMotorControl(index);
        //}

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 50);
        });
    }

    dcMotorControl2 (args) {
        const index = args.INDEX;

        let time = Cast.toNumber(args.TIME) * 1000;
        time = MathUtil.clamp(time, 0, 360000);

        return new Promise(resolve => {
            this._peripheral.dcMotorControl(index);
            setTimeout(() => {
                this._peripheral.dcMotorControl(MotorOptions.STOP);
            }, time);
            // Run for some time even when no motor is connected
            setTimeout(resolve, time + 500);
        });
    }

    dcMotorStop () {
        this._peripheral.dcMotorControl(MotorOptions.STOP);
    }
}

module.exports = Scratch3CubroidDcMotor01Blocks;
