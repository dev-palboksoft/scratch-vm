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
const blockIconURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAHUmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMTItMjdUMTk6MDQ6NTMrMDk6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTktMTItMjdUMjI6MjM6MTArMDk6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTEyLTI3VDIyOjIzOjEwKzA5OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmEyYjJiNzM5LTRlNTgtNDVlMS1iMDFiLWFhYmMzZWZjYzJlYyIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjYzZWM1ODU3LWI3YzYtY2Y0OC1iZjM1LTBkZDYzOTI5OTU5YSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjQ2MzY2MGIwLWUyNTUtNGFjZC1hYThkLTczNzNkNTkzODE3ZCIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NDYzNjYwYjAtZTI1NS00YWNkLWFhOGQtNzM3M2Q1OTM4MTdkIiBzdEV2dDp3aGVuPSIyMDE5LTEyLTI3VDE5OjA0OjUzKzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NGJmY2Y3OGUtMzA3Yy00ZDQ3LTliMjYtOTU3ZTE0YzQxYzU2IiBzdEV2dDp3aGVuPSIyMDE5LTEyLTI3VDE5OjA0OjUzKzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YTJiMmI3MzktNGU1OC00NWUxLWIwMWItYWFiYzNlZmNjMmVjIiBzdEV2dDp3aGVuPSIyMDE5LTEyLTI3VDIyOjIzOjEwKzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+eG1wLmRpZDowODNGRTVGMDA0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";
const BLETimeout = 2500;
const BLEDataStoppedError = 'Cubroid extension stopped receiving data';


const BLEUUID = {
    name: 'DOT MATRIX',
    service_strings: '268d6478-81c1-4add-837f-2aaab0f860b0',
    characteristic: '268d6478-81c1-4add-837f-2aaab0f860b1',
};

class CubroidLED {

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

    lceControl (hexString) {
        const data = Uint8Array.from(Buffer.from(hexString, 'hex'));
        // console.log(data)
        return this.send(BLEUUID.service_strings, BLEUUID.characteristic, data);
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
//                {services: [BLEUUID.motor_service, BLEUUID.service_strings, BLEUUID.characteristic]}
//            ]
//        }, this._onConnect, this.disconnect);
//    }

    scan() {
        if (this._ble) {
            this._ble.disconnect();
        }

        this._ble = new BLE(this._runtime, this._extensionId, {
            filters: [
                { name: BLEUUID.name }
            ],
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

    _onConnect() {
//        this._ble.read(BLEUUID.service_strings, BLEUUID.characteristic, true, this._onMessage);
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
class Scratch3CubroidLEDBlocks {

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return 'Cubroid Dot Matrix';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return 'cubroidled';
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
        this._peripheral = new CubroidLED(this.runtime, Scratch3CubroidLEDBlocks.EXTENSION_ID);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: Scratch3CubroidLEDBlocks.EXTENSION_ID,
            name: Scratch3CubroidLEDBlocks.EXTENSION_NAME,
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: 'lceAlpabetControl',
                    text: '글자 [MATRIX] 보여지기',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        MATRIX: {
                            type: ArgumentType.MATRIX,
                            menu: 'MenuAlpabet',
                            defaultValue: '003c66667e666666'
                        }
                    }
                },
                {
                    opcode: 'lceNumberControl',
                    text: '숫자 [MATRIX] 보여지기',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        MATRIX: {
                            type: ArgumentType.MATRIX,
                            menu: 'MenuNumber',
                            defaultValue: '0018181c1818187e'
                        }
                    }
                },
            ],
            menus: {
                MenuAlpabet: this.MENU_ALPABET, 
                MenuNumber: this.MENU_NUMBER
            }
        };
    }

    get MENU_ALPABET () {
        return [
            {
                text: 'A',
                value: '003c66667e666666'
            },
            {
                text: 'B',
                value: '003e66663e66663e'
            },
            {
                text: 'C',
                value: '003c66060606663c'
            },
            {
                text: 'D',
                value: '003e66666666663e'
            },
            {
                text: 'E',
                value: '007e06063e06067e'
            },
            {
                text: 'F',
                value: '007e06063e060606'
            },
            {
                text: 'G',
                value: '003c66060676663c'
            },
            {
                text: 'H',
                value: '006666667e666666'
            },
            {
                text: 'I',
                value: '003c18181818183c'
            },
            {
                text: 'J',
                value: '007830303036361c'
            },
            {
                text: 'K',
                value: '0066361e0e1e3666'
            },
            {
                text: 'L',
                value: '000606060606067e'
            },
            {
                text: 'M',
                value: '00c6eefed6c6c6c6'
            },
            {
                text: 'N',
                value: '00c6cedef6e6c6c6'
            },
            {
                text: 'O',
                value: '003c66666666663c'
            },
            {
                text: 'P',
                value: '003e6666663e0606'
            },
            {
                text: 'Q',
                value: '003c666666763c60'
            },
            {
                text: 'R',
                value: '003e66663e1e3666'
            },
            {
                text: 'S',
                value: '003c66063c60663c'
            },
            {
                text: 'T',
                value: '007e5a1818181818'
            },
            {
                text: 'U',
                value: '006666666666667c'
            },
            {
                text: 'V',
                value: '0066666666663c18'
            },
            {
                text: 'W',
                value: '00c6c6c6d6feeec6'
            },
            {
                text: 'X',
                value: '00c6c66c386cc6c6'
            },
            {
                text: 'Y',
                value: '006666663c181818'
            },
            {
                text: 'Z',
                value: '007e6030180c067e'
            },
        ]
    }

    get MENU_NUMBER () {
        return [
            {
                text: '1',
                value: '0018181c1818187e'
            },
            {
                text: '2',
                value: '003c6660300c067e'
            },
            {
                text: '3',
                value: '003c66603860663c'
            },
            {
                text: '4',
                value: '00303834327e3030'
            },
            {
                text: '5',
                value: '007e063e6060663c'
            },
            {
                text: '6',
                value: '003c66063e66663c'
            },
            {
                text: '7',
                value: '007e663030181818'
            },
            {
                text: '8',
                value: '003c66663c66663c'
            },
            {
                text: '9',
                value: '003c66667c60663c'
            },
            {
                text: '0',
                value: '003c66766e66663c'
            },
        ]
    };

    lceAlpabetControl (args) {
        const matrix = args.MATRIX;
        this._peripheral.lceControl(matrix);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 100);
        });
    }

    lceNumberControl (args) {
        const matrix = args.MATRIX;
        this._peripheral.lceControl(matrix);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 100);
        });
    }
}

module.exports = Scratch3CubroidLEDBlocks;
