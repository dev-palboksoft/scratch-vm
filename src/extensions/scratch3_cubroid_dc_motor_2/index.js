const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');
const BLE = require('../../io/ble');
const Base64Util = require('../../util/base64-util');
const MathUtil = require('../../util/math-util');

/**
 * Icon png to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4yIiBiYXNlUHJvZmlsZT0idGlueSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiDQoJIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDBweCIgaGVpZ2h0PSI0MHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGNpcmNsZSBmaWxsPSIjMEI5MUNGIiBjeD0iMzMuNSIgY3k9IjYuNSIgcj0iNC41Ii8+DQo8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMzEuOSw5LjFjLTAuMS0wLjEtMC4xLTAuMi0wLjEtMC4zYzAtMC4xLDAtMC4yLDAuMS0wLjNjMC0wLjEsMC4xLTAuMSwwLjEtMC4yYzAuNC0wLjQsMC43LTAuNywxLTENCglzMC41LTAuNSwwLjctMC43czAuMy0wLjQsMC40LTAuNmMwLjEtMC4yLDAuMS0wLjMsMC4xLTAuNWMwLTAuMi0wLjEtMC40LTAuMi0wLjZjLTAuMS0wLjItMC4zLTAuMi0wLjYtMC4yYy0wLjEsMC0wLjMsMC0wLjQsMC4xDQoJYy0wLjIsMC4xLTAuMywwLjItMC41LDAuM2MwLDAtMC4xLDAuMS0wLjEsMC4xYy0wLjEsMC0wLjEsMC4xLTAuMiwwLjFjLTAuMSwwLTAuMSwwLTAuMiwwYy0wLjEsMC0wLjEtMC4xLTAuMi0wLjENCglDMzEuOCw1LjEsMzEuOCw1LDMxLjgsNWMwLTAuMSwwLTAuMiwwLTAuMnMwLjEtMC4xLDAuMS0wLjJjMCwwLDAuMS0wLjEsMC4xLTAuMWMwLjItMC4yLDAuNS0wLjMsMC43LTAuNHMwLjUtMC4xLDAuOC0wLjENCgljMC4zLDAsMC41LDAsMC44LDAuMXMwLjQsMC4yLDAuNSwwLjRjMC4xLDAuMiwwLjIsMC4zLDAuMywwLjVjMC4xLDAuMiwwLjEsMC40LDAuMSwwLjZjMCwwLjItMC4xLDAuNS0wLjEsMC43DQoJYy0wLjEsMC4yLTAuMiwwLjQtMC40LDAuNnMtMC40LDAuNC0wLjYsMC43Yy0wLjIsMC4yLTAuNSwwLjUtMC44LDAuOGgxLjZjMC4xLDAsMC4zLDAsMC4zLDAuMXMwLjEsMC4yLDAuMSwwLjNjMCwwLjEsMCwwLjItMC4xLDAuMw0KCWMtMC4xLDAuMS0wLjIsMC4xLTAuMywwLjFoLTIuN0MzMi4xLDkuMiwzMiw5LjIsMzEuOSw5LjF6Ii8+DQo8Zz4NCgk8cGF0aCBmaWxsPSIjRTVEREQ3IiBkPSJNMjAuOCwxNi4zdjAuNWMwLDAuMi0wLjIsMC4zLTAuNCwwLjNoLTYuOWMtMC4yLDAtMC40LTAuMS0wLjQtMC4zdi0wLjV2LTIuNXYtMC43YzAtMC4yLDAuMi0wLjMsMC40LTAuMw0KCQloNi45YzAuMiwwLDAuNCwwLjEsMC40LDAuM3YwLjdWMTYuM3oiLz4NCgk8cGF0aCBmaWxsPSIjRTVEREQ3IiBkPSJNMjIuOSwxM0gxMS4xYy0wLjUsMC0wLjktMC40LTAuOS0wLjlsMCwwYzAtMy41LDIuOC02LjMsNi4zLTYuM2gxLjFjMy41LDAsNi4zLDIuOCw2LjMsNi4zbDAsMA0KCQlDMjMuOCwxMi42LDIzLjQsMTMsMjIuOSwxM3oiLz4NCgk8cmVjdCB4PSIxMC44IiB5PSI1LjUiIGZpbGw9IiMwRTcyOTQiIHdpZHRoPSIxMi41IiBoZWlnaHQ9IjQuMiIvPg0KCTxwYXRoIGZpbGw9IiNFNURERDciIGQ9Ik0yMC4zLDUuNmgtMC43Yy0wLjQsMC0wLjgtMC40LTAuOC0wLjhsMCwwYzAtMC40LDAuNC0wLjgsMC44LTAuOGgwLjdjMC40LDAsMC44LDAuNCwwLjgsMC44bDAsMA0KCQlDMjEuMSw1LjIsMjAuNyw1LjYsMjAuMyw1LjZ6Ii8+DQoJPHBhdGggZmlsbD0iI0U1RERENyIgZD0iTTE0LjQsNS42aC0wLjdjLTAuNCwwLTAuOC0wLjQtMC44LTAuOGwwLDBjMC0wLjQsMC40LTAuOCwwLjgtMC44aDAuN2MwLjQsMCwwLjgsMC40LDAuOCwwLjhsMCwwDQoJCUMxNS4yLDUuMiwxNC45LDUuNiwxNC40LDUuNnoiLz4NCgk8cGF0aCBmaWxsPSIjRTVEREQ3IiBkPSJNMTcuNCw1LjZoLTAuN2MtMC40LDAtMC44LTAuNC0wLjgtMC44bDAsMGMwLTAuNCwwLjQtMC44LDAuOC0wLjhoMC43YzAuNCwwLDAuOCwwLjQsMC44LDAuOGwwLDANCgkJQzE4LjIsNS4yLDE3LjgsNS42LDE3LjQsNS42eiIvPg0KCTxwYXRoIGZpbGw9IiMwMEE2RTAiIGQ9Ik0xNC4zLDguM2MwLDAuMy0wLjIsMC41LTAuNSwwLjVzLTAuNS0wLjItMC41LTAuNXMwLjItMC41LDAuNS0wLjVTMTQuMyw4LDE0LjMsOC4zeiIvPg0KCTxwYXRoIGZpbGw9IiMwMEE2RTAiIGQ9Ik0xOS43LDguM2MwLDAuMywwLjIsMC41LDAuNSwwLjVzMC41LTAuMiwwLjUtMC41cy0wLjItMC41LTAuNS0wLjVDMTkuOSw3LjgsMTkuNyw4LDE5LjcsOC4zeiIvPg0KCTxwYXRoIGZpbGw9IiNBMDk2OTAiIGQ9Ik0xOC40LDExYzAsMCwwLTAuMSwwLTAuMmMwLDAtMC4xLDAtMC4yLDBjLTAuMywwLjMtMC43LDAuNS0xLjEsMC41cy0wLjgtMC4yLTEuMS0wLjVjMCwwLTAuMS0wLjEtMC4yLDANCgkJYzAsMC0wLjEsMC4xLDAsMC4yYzAuMywwLjQsMC44LDAuNiwxLjMsMC42QzE3LjYsMTEuNiwxOC4xLDExLjQsMTguNCwxMXoiLz4NCgk8cGF0aCBmaWxsPSIjMDBBNkUwIiBkPSJNMjIuMyw0LjhIMTEuN2MtMC4zLDAtMC42LDAuMS0wLjgsMC4zbC0wLjQsMC40Yy0wLjIsMC4yLTAuMywwLjUtMC4zLDAuOHY1LjNsMCwwYzAuNiwwLDEtMC41LDEtMVY4LjgNCgkJYzAtMS43LDEuNC0zLDMtM2g1LjZjMS43LDAsMywxLjQsMywzdjEuOGMwLDAuNiwwLjUsMSwxLDFsMCwwVjYuM2MwLTAuMy0wLjEtMC42LTAuMy0wLjhsLTAuNC0wLjRDMjIuOSw0LjksMjIuNiw0LjgsMjIuMyw0Ljh6Ii8+DQoJPHBhdGggZmlsbD0iIzBFNzI5NCIgZD0iTTI3LjMsMjQuN0MyNi40LDIxLDI1LDIwLjMsMjMsMjAuM3YtMC45YzIuOCwwLDQuMywxLjUsNS4yLDVMMjcuMywyNC43eiIvPg0KCTxwYXRoIGZpbGw9IiMwMEE2RTAiIGQ9Ik0zMCwyNS40bC0xLjMtMi4yYzAuMSwwLjEsMC4xLDAuMiwwLjEsMC4zYzAuMiwwLjYtMC4xLDEuMy0wLjYsMS42Yy0wLjEsMC4xLTAuMiwwLjItMC4yLDAuM2wwLjksMy44DQoJCWMwLDAuMiwwLjIsMC4zLDAuNCwwLjJsMC4zLTAuMWMwLjEsMCwwLjItMC4xLDAuMi0wLjNsMC4xLTMuNUMzMC4xLDI1LjUsMzAuMSwyNS40LDMwLDI1LjR6Ii8+DQoJPHBhdGggZmlsbD0iIzAwQTZFMCIgZD0iTTI2LDI0LjJjMC0wLjEsMC0wLjIsMC0wLjRsLTAuMSwyLjZjMCwwLDAsMC4xLDAsMC4ybDEuOCwzYzAuMSwwLjEsMC4yLDAuMiwwLjMsMC4xbDAuMy0wLjENCgkJYzAuMiwwLDAuMy0wLjIsMC4yLTAuNGwtMC45LTMuOGMwLTAuMS0wLjItMC4yLTAuMy0wLjJDMjYuNywyNS4zLDI2LjIsMjQuOCwyNiwyNC4yeiIvPg0KCTxnPg0KCQk8cGF0aCBmaWxsPSIjMDBBNkUwIiBkPSJNMjcuNCwyNS4xYy0wLjYsMC0xLjEtMC40LTEuMy0xYy0wLjItMC43LDAuMi0xLjQsMC45LTEuNmMwLjEsMCwwLjIsMCwwLjMsMGMwLjYsMCwxLjEsMC40LDEuMywxDQoJCQljMC4xLDAuMywwLDAuNy0wLjEsMWMtMC4yLDAuMy0wLjUsMC41LTAuOCwwLjZDMjcuNywyNS4xLDI3LjYsMjUuMSwyNy40LDI1LjF6Ii8+DQoJCTxwYXRoIGZpbGw9IiMwRTcyOTQiIGQ9Ik0yNy40LDIyLjdjMC41LDAsMSwwLjMsMS4xLDAuOGMwLjIsMC42LTAuMiwxLjItMC44LDEuNGMtMC4xLDAtMC4yLDAtMC4zLDBjLTAuNSwwLTEtMC4zLTEuMS0wLjgNCgkJCWMtMC4yLTAuNiwwLjItMS4yLDAuOC0xLjRDMjcuMywyMi43LDI3LjQsMjIuNywyNy40LDIyLjcgTTI3LjQsMjIuNGMtMC4xLDAtMC4yLDAtMC40LDBjLTAuOCwwLjItMS4zLDEtMS4xLDEuOA0KCQkJYzAuMiwwLjcsMC43LDEuMSwxLjQsMS4xYzAuMSwwLDAuMiwwLDAuNCwwYzAuNC0wLjEsMC43LTAuMywwLjktMC43YzAuMi0wLjMsMC4zLTAuNywwLjItMS4xQzI4LjcsMjIuOCwyOC4xLDIyLjQsMjcuNCwyMi40DQoJCQlMMjcuNCwyMi40eiIvPg0KCTwvZz4NCgk8cGF0aCBmaWxsPSIjMEU3Mjk0IiBkPSJNMTAuOSwyMWMtMi43LDAtNC4yLTEuNS01LjEtNWwwLjgtMC4yYzAuOSwzLjcsMi4zLDQuNCw0LjMsNC40djAuOUMxMSwyMSwxMSwyMSwxMC45LDIxeiIvPg0KCTxnPg0KCQk8cGF0aCBmaWxsPSIjMDBBNkUwIiBkPSJNNi42LDE3LjljLTAuNiwwLTEuMS0wLjQtMS4zLTFjLTAuMS0wLjMsMC0wLjcsMC4xLTFjMC4yLTAuMywwLjUtMC41LDAuOC0wLjZjMC4xLDAsMC4yLDAsMC4zLDANCgkJCWMwLjYsMCwxLjEsMC40LDEuMywxYzAuMSwwLjMsMCwwLjctMC4xLDFjLTAuMiwwLjMtMC41LDAuNS0wLjgsMC42QzYuOCwxNy45LDYuNywxNy45LDYuNiwxNy45eiIvPg0KCQk8cGF0aCBmaWxsPSIjMEU3Mjk0IiBkPSJNNi42LDE1LjVjMC41LDAsMSwwLjMsMS4xLDAuOGMwLjIsMC42LTAuMiwxLjItMC44LDEuNGMtMC4xLDAtMC4yLDAtMC4zLDBjLTAuNSwwLTEtMC4zLTEuMS0wLjgNCgkJCWMtMC4yLTAuNiwwLjItMS4yLDAuOC0xLjRDNi40LDE1LjUsNi41LDE1LjUsNi42LDE1LjUgTTYuNiwxNS4xYy0wLjEsMC0wLjIsMC0wLjQsMGMtMC44LDAuMi0xLjMsMS0xLjEsMS44DQoJCQlDNS4zLDE3LjYsNS44LDE4LDYuNSwxOGMwLjEsMCwwLjIsMCwwLjQsMGMwLjQtMC4xLDAuNy0wLjMsMC45LTAuN0M4LDE3LDguMSwxNi42LDgsMTYuMkM3LjgsMTUuNiw3LjIsMTUuMSw2LjYsMTUuMUw2LjYsMTUuMXoiDQoJCQkvPg0KCTwvZz4NCgk8cGF0aCBmaWxsPSIjMDBBNkUwIiBkPSJNNCwxNS4xbDEuMywyLjJjLTAuMS0wLjEtMC4xLTAuMi0wLjEtMC4zQzUsMTYuMiw1LjMsMTUuNSw2LDE1LjJsLTEtNEM1LDExLjEsNC44LDExLDQuNywxMWwtMC4zLDAuMQ0KCQljLTAuMiwwLTAuMywwLjItMC4zLDAuM0w0LDE0LjhDMy45LDE0LjksNCwxNSw0LDE1LjF6Ii8+DQoJPHBhdGggZmlsbD0iIzAwQTZFMCIgZD0iTTgsMTYuMmMwLDAuMSwwLDAuMiwwLDAuNEw4LjEsMTRjMC0wLjEsMC0wLjEsMC0wLjJsLTEuOC0zYy0wLjEtMC4xLTAuMi0wLjItMC40LTAuMmwtMC4zLDAuMQ0KCQljLTAuMSwwLTAuMiwwLjItMC4yLDAuM2wxLDRDNy4xLDE1LjEsNy44LDE1LjUsOCwxNi4yeiIvPg0KCTxwYXRoIGZpbGw9IiMyQjI1MjIiIGQ9Ik0xNi43LDM2TDE2LjcsMzZjLTEuMiwwLTIuMi0xLTIuMi0yLjJ2LTUuM2g0LjR2NS4zQzE4LjksMzUsMTcuOSwzNiwxNi43LDM2eiIvPg0KCTxwYXRoIGZpbGw9IiM0ODQzNDIiIGQ9Ik0xNy44LDMyLjJoLTIuMWMtMC4zLDAtMC41LTAuMi0wLjUtMC41bDAsMGMwLTAuMywwLjItMC41LDAuNS0wLjVoMi4xYzAuMywwLDAuNSwwLjIsMC41LDAuNWwwLDANCgkJQzE4LjMsMzIsMTgsMzIuMiwxNy44LDMyLjJ6Ii8+DQoJPHBhdGggZmlsbD0iIzQ4NDM0MiIgZD0iTTE3LjgsMzMuOGgtMi4xYy0wLjMsMC0wLjUtMC4yLTAuNS0wLjVsMCwwYzAtMC4zLDAuMi0wLjUsMC41LTAuNWgyLjFjMC4zLDAsMC41LDAuMiwwLjUsMC41bDAsMA0KCQlDMTguMywzMy42LDE4LDMzLjgsMTcuOCwzMy44eiIvPg0KCTxwYXRoIGZpbGw9IiM0ODQzNDIiIGQ9Ik0xNy44LDM1LjRoLTIuMWMtMC4zLDAtMC41LTAuMi0wLjUtMC41bDAsMGMwLTAuMywwLjItMC41LDAuNS0wLjVoMi4xYzAuMywwLDAuNSwwLjIsMC41LDAuNWwwLDANCgkJQzE4LjMsMzUuMiwxOCwzNS40LDE3LjgsMzUuNHoiLz4NCgk8cGF0aCBmaWxsPSIjMDBBNkUwIiBkPSJNMjQuNSwzMC4xVjE4LjVjMC0wLjMtMC4xLTAuNi0wLjMtMC44bC0wLjUtMC41Yy0wLjItMC4yLTAuNS0wLjMtMC44LTAuM0gxMS4yYy0wLjMsMC0wLjYsMC4xLTAuOCwwLjMNCgkJbC0wLjUsMC41Yy0wLjIsMC4yLTAuMywwLjUtMC4zLDAuOHYxMS42YzAsMC4zLDAuMSwwLjYsMC4zLDAuOGwwLjUsMC41YzAuMiwwLjIsMC41LDAuMywwLjgsMC4zaDExLjZjMC4zLDAsMC42LTAuMSwwLjgtMC4zDQoJCWwwLjUtMC41QzI0LjMsMzAuNywyNC41LDMwLjQsMjQuNSwzMC4xeiIvPg0KCTxwYXRoIGZpbGw9IiNFNURERDciIGQ9Ik0xNywzMC42TDE3LDMwLjZjLTMuNSwwLTYuMy0yLjktNi4zLTYuM2wwLDBjMC0zLjUsMi45LTYuMyw2LjMtNi4zbDAsMGMzLjUsMCw2LjMsMi45LDYuMyw2LjNsMCwwDQoJCUMyMy4zLDI3LjgsMjAuNSwzMC42LDE3LDMwLjZ6Ii8+DQoJPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTE4LjUsMjEuMmgtMi45Yy0wLjQsMC0wLjgtMC40LTAuOC0wLjhsMCwwYzAtMC40LDAuNC0wLjgsMC44LTAuOGgyLjljMC40LDAsMC44LDAuNCwwLjgsMC44bDAsMA0KCQlDMTkuMywyMC44LDE4LjksMjEuMiwxOC41LDIxLjJ6Ii8+DQoJPHBhdGggZmlsbD0iIzAwQTZFMCIgZD0iTTE3LjQsMjBjLTAuMS0wLjEtMC4yLDAtMC4yLDB2MC4xYzAuMSwwLjEsMC4xLDAuMiwwLjEsMC4zYzAsMC4yLTAuMiwwLjQtMC41LDAuM2MtMC4yLDAtMC4zLTAuMi0wLjMtMC40DQoJCWMwLTAuMSwwLjEtMC4yLDAuMS0wLjJzMC0wLjEsMC0wLjJjMCwwLTAuMSwwLTAuMiwwYy0wLjEsMC4yLTAuMiwwLjMtMC4yLDAuNWMwLjEsMC4zLDAuNCwwLjUsMC43LDAuNWMwLjMtMC4xLDAuNS0wLjMsMC41LTAuNg0KCQlsMCwwQzE3LjYsMjAuMiwxNy41LDIwLjEsMTcuNCwyMHoiLz4NCgk8cGF0aCBmaWxsPSIjMDBBNkUwIiBkPSJNMTYuOSwyMC4yYzAsMC4xLDAsMC4yLDAsMC4zYzAsMC4xLDAsMC4xLDAuMSwwLjFzMC4xLDAsMC4xLTAuMWMwLTAuMiwwLTAuNCwwLTAuNnYtMC4xYzAsMC0wLjEsMC0wLjIsMA0KCQljMCwwLDAsMCwwLDAuMVMxNi45LDIwLjEsMTYuOSwyMC4yTDE2LjksMjAuMkwxNi45LDIwLjJ6Ii8+DQo8L2c+DQo8L3N2Zz4NCg==";
const BLETimeout = 2500;
const BLEDataStoppedError = 'Cubroid extension stopped receiving data';


const BLEUUID = {
    name: 'DC Motor',
    misc_service: 'b7c23878-e520-466e-9b5b-480407ab4870',
    sensor_service: 'b7c23878-e520-466e-9b5b-480407ab4871',
};

class CubroidDcMotor02 {

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
class Scratch3CubroidDcMotor02Blocks {

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return 'Cubroid Dc Motor 2';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return 'cubroiddcmotor02';
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
        this._peripheral = new CubroidDcMotor02(this.runtime, Scratch3CubroidDcMotor02Blocks.EXTENSION_ID);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: Scratch3CubroidDcMotor02Blocks.EXTENSION_ID,
            name: formatMessage({
                id: 'cubroiddcmotor02.extensionName',
                default: 'DC 모터 2번 블록',
                description: 'DC 모터 2번 블록'
            }),
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: 'dcMotorControl',
                    text: formatMessage({
                        id: 'cubroiddcmotor02.dcMotorControl',
                        default: 'DC 모터 2번을 [INDEX]',
                        description: 'DC 모터 2번을 [INDEX]'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        INDEX: {
                            type: ArgumentType.STRING,
                            menu: 'MotorAction',
                            defaultValue: MotorOptions.LEFT
                        }
                    }
                },
                {
                    opcode: 'dcMotorControl2',
                    text: formatMessage({
                        id: 'cubroiddcmotor02.dcMotorControl2',
                        default: 'DC 모터 2번을 [TIME]초 동안 [INDEX]',
                        description: 'DC 모터 2번을 [TIME]초 동안 [INDEX]'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TIME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        INDEX: {
                            type: ArgumentType.STRING,
                            menu: 'MotorAction',
                            defaultValue: MotorOptions.LEFT
                        }
                    }
                },
                {
                    opcode: 'dcMotorStop',
                    text: formatMessage({
                        id: 'cubroiddcmotor02.dcMotorStop',
                        default: 'DC 모터 2번을 끄기',
                        description: 'DC 모터 2번을 끄기'
                    }),
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
                    id: 'cubroiddcmotor02.motoroptionmenu.left',
                    default: 'Left',
                    description: 'Left'
                }),
                value: MotorOptions.LEFT
            },
            {
                text: formatMessage({
                    id: 'cubroiddcmotor02.motoroptionmenu.right',
                    default: 'Right',
                    description: 'Right'
                }),
                value: MotorOptions.RIGHT
            },
            {
                text: formatMessage({
                    id: 'cubroiddcmotor02.motoroptionmenu.stop',
                    default: 'Stop',
                    description: 'Stop'
                }),
                value: MotorOptions.STOP
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
            setTimeout(resolve, time + 500);    // STOP과 혼선을 막기위해 500 딜레이
        });
    }

    dcMotorStop () {
        this._peripheral.dcMotorControl(MotorOptions.STOP);
    }
}

module.exports = Scratch3CubroidDcMotor02Blocks;
