const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const cast = require('../../util/cast');
const formatMessage = require('format-message');
const BLE = require('../../io/ble');
const Base64Util = require('../../util/base64-util');

/**
 * Icon png to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4yIiBiYXNlUHJvZmlsZT0idGlueSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiDQoJIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDBweCIgaGVpZ2h0PSI0MHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZmlsbD0iIzU4NTk1QiIgZD0iTTE0LjgsMjAuNWMwLDAsMC4xLTAuMSwwLjEtMC4xbC0wLjYtMC44Yy0xLDAuOC0xLjksMS4xLTIuOCwxYy0xLjEtMC4xLTIuNC0wLjctMy45LTJMNywxOS40DQoJCWMxLjYsMS40LDMuMSwyLjEsNC40LDIuMkMxMi42LDIxLjcsMTMuNiwyMS40LDE0LjgsMjAuNXoiLz4NCgk8cGF0aCBmaWxsPSIjRjc5NDFEIiBkPSJNNC40LDE3LjhDNC40LDE3LjgsNC41LDE3LjgsNC40LDE3LjhjMC4yLTAuMywwLjItMC42LTAuMS0wLjdsLTEuNi0xLjJjLTAuMi0wLjItMC41LTAuMS0wLjcsMC4xDQoJCWMtMC4yLDAuMi0wLjEsMC41LDAuMSwwLjdsMS42LDEuMkM0LDE4LDQuMiwxOCw0LjQsMTcuOHoiLz4NCgk8cGF0aCBmaWxsPSIjRjc5NDFEIiBkPSJNNC45LDE2LjhDNC45LDE2LjgsNC45LDE2LjgsNC45LDE2LjhjMC4yLTAuMywwLjItMC42LDAtMC43bC0xLjUtMS4zYy0wLjItMC4yLTAuNS0wLjItMC43LDANCgkJYy0wLjIsMC4yLTAuMiwwLjUsMCwwLjdsMS41LDEuM0M0LjQsMTcsNC43LDE3LDQuOSwxNi44eiIvPg0KCTxwYXRoIGZpbGw9IiNGNzk0MUQiIGQ9Ik01LjgsMTYuM0M1LjksMTYuMyw1LjksMTYuMyw1LjgsMTYuM2MwLjMtMC4yLDAuMy0wLjUsMC4xLTAuN2wtMS4zLTEuNWMtMC4yLTAuMi0wLjUtMC4yLTAuNywwDQoJCWMtMC4yLDAuMi0wLjIsMC41LDAsMC43bDEuMywxLjVDNS40LDE2LjQsNS42LDE2LjQsNS44LDE2LjN6Ii8+DQoJPHBhdGggZmlsbD0iI0Y3OTQxRCIgZD0iTTYuNiwxNi44QzYuNiwxNi44LDYuNywxNi44LDYuNiwxNi44YzAuNCwwLDAuNi0wLjIsMC42LTAuNWwwLjEtMmMwLTAuMy0wLjItMC41LTAuNS0wLjUNCgkJYy0wLjMsMC0wLjUsMC4yLTAuNSwwLjVsLTAuMSwyQzYuMiwxNi41LDYuNCwxNi43LDYuNiwxNi44eiIvPg0KCTxwYXRoIGZpbGw9IiNFNURFRDciIGQ9Ik02LDE1LjJjLTAuMi0wLjEtMC40LTAuMi0wLjYsMGwtMiwyLjJjLTAuMiwwLjItMC4xLDAuNCwwLDAuNmMwLDAsMC4zLDAuNiwzLjEsMi40YzAuMiwwLjEsMC40LDAuMSwwLjYsMA0KCQlsMS41LTEuNmMwLjItMC4yLDAuMS0wLjMsMC0wLjZDOC42LDE4LjIsNy4xLDE2LDYsMTUuMnoiLz4NCgk8cGF0aCBmaWxsPSIjRjc5NDFEIiBkPSJNNi45LDE3LjRsLTEuMiwxLjJjLTAuMSwwLjEtMC4yLDAuMS0wLjIsMGwtMC43LTAuNWMtMC4xLTAuMS0wLjEtMC4yLDAtMC4zbDEuMy0xLjRjMC4xLTAuMSwwLjItMC4xLDAuMywwDQoJCWwwLjUsMC43QzcsMTcuMiw3LDE3LjMsNi45LDE3LjR6Ii8+DQoJPHBhdGggZmlsbD0iIzU4NTk1QiIgZD0iTTI1LjIsMjAuNWMwLDAtMC4xLTAuMS0wLjEtMC4xbDAuNi0wLjhjMSwwLjgsMS45LDEuMSwyLjgsMWMxLjEtMC4xLDIuNC0wLjcsMy45LTJsMC42LDAuNw0KCQljLTEuNiwxLjQtMy4xLDIuMS00LjQsMi4yQzI3LjQsMjEuNywyNi40LDIxLjQsMjUuMiwyMC41eiIvPg0KCTxwYXRoIGZpbGw9IiNGNzk0MUQiIGQ9Ik0zNS42LDE3LjhDMzUuNiwxNy44LDM1LjUsMTcuOCwzNS42LDE3LjhjLTAuMi0wLjMtMC4yLTAuNiwwLjEtMC43bDEuNi0xLjJjMC4yLTAuMiwwLjUtMC4xLDAuNywwLjENCgkJYzAuMiwwLjIsMC4xLDAuNS0wLjEsMC43bC0xLjYsMS4yQzM2LDE4LDM1LjgsMTgsMzUuNiwxNy44eiIvPg0KCTxwYXRoIGZpbGw9IiNGNzk0MUQiIGQ9Ik0zNS4xLDE2LjhDMzUuMSwxNi44LDM1LjEsMTYuOCwzNS4xLDE2LjhjLTAuMi0wLjMtMC4yLTAuNiwwLTAuN2wxLjUtMS4zYzAuMi0wLjIsMC41LTAuMiwwLjcsMA0KCQljMC4yLDAuMiwwLjIsMC41LDAsMC43bC0xLjUsMS4zQzM1LjYsMTcsMzUuMywxNywzNS4xLDE2Ljh6Ii8+DQoJPHBhdGggZmlsbD0iI0Y3OTQxRCIgZD0iTTM0LjIsMTYuM0MzNC4xLDE2LjMsMzQuMSwxNi4zLDM0LjIsMTYuM2MtMC4zLTAuMi0wLjMtMC41LTAuMS0wLjdsMS4zLTEuNWMwLjItMC4yLDAuNS0wLjIsMC43LDANCgkJYzAuMiwwLjIsMC4yLDAuNSwwLDAuN2wtMS4zLDEuNUMzNC42LDE2LjQsMzQuNCwxNi40LDM0LjIsMTYuM3oiLz4NCgk8cGF0aCBmaWxsPSIjRjc5NDFEIiBkPSJNMzMuNCwxNi44QzMzLjQsMTYuOCwzMy4zLDE2LjgsMzMuNCwxNi44Yy0wLjQsMC0wLjYtMC4yLTAuNi0wLjVsLTAuMS0yYzAtMC4zLDAuMi0wLjUsMC41LTAuNQ0KCQljMC4zLDAsMC41LDAuMiwwLjUsMC41bDAuMSwyQzMzLjgsMTYuNSwzMy42LDE2LjcsMzMuNCwxNi44eiIvPg0KCTxwYXRoIGZpbGw9IiNFNURFRDciIGQ9Ik0zNCwxNS4yYzAuMi0wLjEsMC40LTAuMiwwLjYsMGwyLDIuMmMwLjIsMC4yLDAuMSwwLjQsMCwwLjZjMCwwLTAuMywwLjYtMy4xLDIuNGMtMC4yLDAuMS0wLjQsMC4xLTAuNiwwDQoJCWwtMS41LTEuNmMtMC4yLTAuMi0wLjEtMC4zLDAtMC42QzMxLjQsMTguMiwzMi45LDE2LDM0LDE1LjJ6Ii8+DQoJPHBhdGggZmlsbD0iI0Y3OTQxRCIgZD0iTTMzLjEsMTcuNGwxLjIsMS4yYzAuMSwwLjEsMC4yLDAuMSwwLjIsMGwwLjctMC41YzAuMS0wLjEsMC4xLTAuMiwwLTAuM2wtMS4zLTEuNGMtMC4xLTAuMS0wLjItMC4xLTAuMywwDQoJCWwtMC41LDAuN0MzMywxNy4yLDMzLDE3LjMsMzMuMSwxNy40eiIvPg0KCTxwYXRoIGZpbGw9IiM2RDZFNzEiIGQ9Ik0yNS4yLDE0LjRjMC4yLDAsMC4zLTAuMSwwLjMtMC4yTDI1LDExLjZjLTAuMi0xLjEtMS41LTEuOC0zLjItMmwtMS4xLTAuMWMtMC40LDAtMC44LDAtMS4yLDBsLTEuMSwwLjENCgkJYy0xLjcsMC4xLTMsMC45LTMuMiwybC0wLjUsMi42YzAsMC4xLDAuMSwwLjIsMC4zLDAuMkMxNC44LDE0LjQsMTkuOSwxNS44LDI1LjIsMTQuNHoiLz4NCgk8cGF0aCBmaWxsPSIjRTVERUQ3IiBkPSJNMjYsMTUuOGwtMC42LTQuNGMtMC4yLTEuOS0xLjctMS40LTMuNS0xLjZsLTEuMi0wLjFjLTAuNCwwLTAuOSwwLTEuMywwbC0xLjIsMC4xDQoJCWMtMS45LDAuMi0zLjItMC4yLTMuNCwxLjZsLTAuNiw0LjRjMCwwLjIsMC4xLDAuMywwLjMsMC4zaDUuN2gwLjJoNS4zQzI1LjgsMTYuMSwyNiwxNiwyNiwxNS44eiIvPg0KCTxwYXRoIGZpbGw9IiNFNURFRDciIGQ9Ik0yNiwxNS44bC0wLjYtNC40Yy0wLjItMS45LTEuNy0xLjktMy41LTIuMmwtMS4yLTAuMWMtMC40LDAtMC45LDAtMS4zLDBsLTEuMiwwLjENCgkJYy0xLjksMC4yLTMuMiwwLjMtMy40LDIuMmwtMC42LDQuNGMwLDAuMiwwLjEsMC4zLDAuMywwLjNoNS43aDAuMmg1LjNDMjUuOCwxNi4xLDI2LDE2LDI2LDE1Ljh6Ii8+DQoJPHBhdGggZmlsbD0iIzRGMjUwRSIgZD0iTTI0LjcsMTMuOWMwLjIsMCwwLjMtMC4xLDAuMi0wLjJsLTAuMy0yLjRjLTAuMi0xLTEuNC0xLjctMy0xLjhsLTEsMGMtMC40LDAtMC44LDAtMS4yLDBsLTEsMA0KCQljLTEuNiwwLjEtMi44LDAuOC0zLDEuOGwtMC4zLDIuNGMwLDAuMiwwLjEsMC4yLDAuMiwwLjJDMTUuNCwxMy45LDE5LjcsMTUuMiwyNC43LDEzLjl6Ii8+DQoJPHBhdGggZmlsbD0iI0U1REVENyIgZD0iTTE3LjcsOS45Yy0wLjYsMC4xLTEuMiwwLjItMS43LDAuNGMtMC4xLDAtMC4zLDAtMC4zLTAuMmMtMC4xLTAuMy0wLjItMC42LTAuMy0xYzAtMC4xLDAtMC4zLDAuMi0wLjMNCgkJYzAuNi0wLjIsMS4zLTAuMywxLjktMC40YzAuMiwwLDAuMywwLjEsMC4zLDAuMmMwLDAuMywwLjEsMC43LDAuMSwxQzE4LDkuOCwxNy45LDkuOSwxNy43LDkuOXoiLz4NCgk8cGF0aCBmaWxsPSIjRTVERUQ3IiBkPSJNMjAuOSw5LjhjLTAuNiwwLTEuMiwwLTEuNywwYy0wLjEsMC0wLjMtMC4xLTAuMy0wLjJjMC0wLjMtMC4xLTAuNy0wLjEtMWMwLTAuMSwwLjEtMC4zLDAuMy0wLjMNCgkJYzAuNiwwLDEuMywwLDEuOSwwYzAuMiwwLDAuMywwLjEsMC4zLDAuM2MwLDAuMy0wLjEsMC43LTAuMSwxQzIxLjIsOS43LDIxLDkuOCwyMC45LDkuOHoiLz4NCgk8cGF0aCBmaWxsPSIjRTVERUQ3IiBkPSJNMjQuMSwxMC4zYy0wLjYtMC4xLTEuMS0wLjMtMS43LTAuM2MtMC4xLDAtMC4yLTAuMS0wLjItMC4zYzAtMC4zLDAuMS0wLjcsMC4xLTFjMC0wLjEsMC4yLTAuMiwwLjMtMC4yDQoJCWMwLjYsMC4xLDEuMywwLjIsMS45LDAuNGMwLjIsMCwwLjMsMC4yLDAuMiwwLjNjLTAuMSwwLjMtMC4yLDAuNy0wLjMsMUMyNC40LDEwLjIsMjQuMiwxMC4zLDI0LjEsMTAuM3oiLz4NCgk8cGF0aCBmaWxsPSIjRTNEREQ2IiBkPSJNMjYuMiwxMS41Yy00LTEuNy04LjEtMS41LTEyLjMsMGMtMC4yLDAuMS0wLjUsMC0wLjYtMC4zbDAsMGMtMC4xLTAuMywwLTAuNiwwLjMtMC44DQoJCWM0LjItMS45LDguNy0xLjksMTIuOSwwYzAuMywwLjEsMC40LDAuNSwwLjMsMC44bDAsMEMyNi43LDExLjUsMjYuNCwxMS42LDI2LjIsMTEuNXoiLz4NCgk8cGF0aCBmaWxsPSIjRjc5NDFEIiBkPSJNMjguMiwzMC4xVjE3LjNjMC0wLjMtMC4xLTAuNy0wLjQtMC45bC0wLjUtMC41Yy0wLjItMC4yLTAuNi0wLjQtMC45LTAuNEgxMy42Yy0wLjMsMC0wLjcsMC4xLTAuOSwwLjQNCgkJbC0wLjUsMC41Yy0wLjIsMC4yLTAuNCwwLjYtMC40LDAuOXYxMi44YzAsMC4zLDAuMSwwLjcsMC40LDAuOWwwLjUsMC41YzAuMiwwLjIsMC42LDAuNCwwLjksMC40aDEyLjhjMC4zLDAsMC43LTAuMSwwLjktMC40DQoJCWwwLjUtMC41QzI4LDMwLjcsMjguMiwzMC40LDI4LjIsMzAuMXoiLz4NCgk8cGF0aCBmaWxsPSIjRTVERUQ3IiBkPSJNMjAsMzAuN0wyMCwzMC43Yy0zLjksMC03LTMuMS03LTd2MGMwLTMuOSwzLjEtNyw3LTdoMGMzLjksMCw3LDMuMSw3LDdsMCwwQzI3LDI3LjUsMjMuOCwzMC43LDIwLDMwLjd6Ii8+DQoJPHBhdGggZmlsbD0iI0Q3Q0JDMSIgZD0iTTIwLDI5LjZMMjAsMjkuNmMtMy4zLDAtNS45LTIuNy01LjktNS45bDAsMGMwLTMuMywyLjctNS45LDUuOS01LjloMGMzLjMsMCw1LjksMi43LDUuOSw1Ljl2MA0KCQlDMjUuOSwyNywyMy4zLDI5LjYsMjAsMjkuNnoiLz4NCgk8cGF0aCBmaWxsPSIjNkQ2RTcxIiBkPSJNMjAsMjguOEwyMCwyOC44Yy0yLjgsMC01LjEtMi4zLTUuMS01LjF2MGMwLTIuOCwyLjMtNS4xLDUuMS01LjFoMGMyLjgsMCw1LjEsMi4zLDUuMSw1LjF2MA0KCQlDMjUuMSwyNi41LDIyLjgsMjguOCwyMCwyOC44eiIvPg0KCTxwYXRoIGZpbGw9IiM1ODU5NUIiIGQ9Ik0yMS44LDI1LjhIMThjLTEuMywwLTIuMy0xLTIuMy0yLjNsMCwwYzAtMS4zLDEtMi4zLDIuMy0yLjNoMy44YzEuMywwLDIuMywxLDIuMywyLjNsMCwwDQoJCUMyNC4xLDI0LjgsMjMuMSwyNS44LDIxLjgsMjUuOHoiLz4NCgk8Y2lyY2xlIGZpbGw9IiM4MDgyODUiIGN4PSIxOC4xIiBjeT0iMjMuNSIgcj0iMS41Ii8+DQoJPGNpcmNsZSBmaWxsPSIjODA4Mjg1IiBjeD0iMjEuNyIgY3k9IjIzLjUiIHI9IjEuNSIvPg0KCTxwYXRoIGZpbGw9IiNCQTc4NDEiIGQ9Ik0xNy4xLDEzLjNjLTAuMSwwLTAuMiwwLTAuMi0wLjFjLTAuMS0wLjEsMC0wLjMsMC4xLTAuNGwwLjYtMC4zTDE3LDEyLjFjLTAuMS0wLjEtMC4yLTAuMi0wLjEtMC40DQoJCWMwLjEtMC4xLDAuMi0wLjIsMC40LTAuMWwxLDAuNmMwLjEsMCwwLjEsMC4xLDAuMSwwLjJjMCwwLjEtMC4xLDAuMi0wLjEsMC4ybC0xLDAuNkMxNy4yLDEzLjMsMTcuMiwxMy4zLDE3LjEsMTMuM3oiLz4NCgk8cGF0aCBmaWxsPSIjQkE3ODQxIiBkPSJNMjMsMTMuM2MwLDAtMC4xLDAtMC4xLDBsLTEtMC42Yy0wLjEsMC0wLjEtMC4xLTAuMS0wLjJjMC0wLjEsMC0wLjIsMC4xLTAuMmwxLTAuNmMwLjEtMC4xLDAuMywwLDAuNCwwLjENCgkJYzAuMSwwLjEsMCwwLjMtMC4xLDAuNGwtMC42LDAuM2wwLjYsMC4zYzAuMSwwLjEsMC4yLDAuMiwwLjEsMC40QzIzLjEsMTMuMiwyMy4xLDEzLjMsMjMsMTMuM3oiLz4NCjwvZz4NCjwvc3ZnPg0K";
const BLETimeout = 2500;
const BLEDataStoppedError = 'Cubroid extension stopped receiving data';

const BLEUUID = {
    name: 'Ditance Sensor',
    service_strings: '499ee8bf-b20a-4dfb-8e47-a6ac0ed5baa0',
    characteristic: '499ee8bf-b20a-4dfb-8e47-a6ac0ed5baa1',
};

const ProximityStatus = {
    NEAR: false
};

const IntervalTime = 200;

class CubroidProximity {
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

    scan() {
        if (this._ble) {
            this._ble.disconnect();
        }

        let bleName = '';
        let arrFilters = [];
        if (localStorage.getItem('groupNumber')) {
            // 그룹넘버링이 있을 경우
            bleName = BLEUUID.name + '-' + localStorage.getItem('groupNumber');
            arrFilters = [
                { namePrefix: bleName }
            ];
        } else {
            bleName = BLEUUID.name;
            arrFilters = [
                { name: bleName }
            ];
        }

        this._ble = new BLE(this._runtime, this._extensionId, {
            filters: arrFilters,
            optionalServices: [
                BLEUUID.service_strings
            ]

        }, this._onConnect, this.reset);

        // console.log("BLEUUID.name = ", BLEUUID.name);
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

    ble_read (service, characteristic) {
        if (!this.isConnected()) return;
        if (this._busy) return;
        this._ble.read(service, characteristic, false, this._onMessage);
    }

    _onConnect() {
        // console.log("_onConnect")
        window.setInterval(() => {
            this.ble_read(BLEUUID.service_strings, BLEUUID.characteristic);
        }, IntervalTime);
    }

    _onMessage(base64) {
        const data = Base64Util.base64ToUint8Array(base64);
        // console.log("_onMessage", data[0]);
        ProximityStatus.NEAR = data[0] == 1 ? true : false;
    }
}

/**
 * Scratch 3.0 blocks to interact with a cubroid proximity sensor peripheral.
 */
class Scratch3CubroidProximityBlocks {
    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return 'CubroidProximity';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return 'cubroidproximity';
    }

    /**
     * Construct a set of cubroid proximity sensor blocks.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor (runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        // Create a new cubroid proximity sensor peripheral instance (아래는 큐브로이드를 연결하기 전에 찾는 화면이 보여주는 코드)
        this._peripheral = new CubroidProximity(this.runtime, Scratch3CubroidProximityBlocks.EXTENSION_ID);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: Scratch3CubroidProximityBlocks.EXTENSION_ID,
            name: formatMessage({
                id: 'cubroidproximity.extensionName',
                default: '근접 센서 블록',
                description: '근접 센서 블록'
            }),
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: 'whenTheDistanceIsClose',
                    text: formatMessage({
                        id: 'cubroidproximity.proximityControl',
                        default: '장애물이 감지되었을 때',
                        description: '장애물이 감지되었을 때'
                    }),
                    blockType: BlockType.HAT,
                },
                {
                    opcode: 'isProximity',
                    text: formatMessage({
                        id: 'cubroidproximity.isProximityControl',
                        default: '장애물이 감지되었는가?',
                        description: '장애물이 감지되었는가?'
                    }),
                    blockType: BlockType.BOOLEAN,
                }
            ],
            menus: {
            }
        };
    }


    // 버튼이 눌러졌을 때
    whenTheDistanceIsClose () {
        return ProximityStatus.NEAR;
    }

    // 버튼이 눌러졌는가?
    isProximity () {
        return ProximityStatus.NEAR;
    }
}

module.exports = Scratch3CubroidProximityBlocks;
