const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const Cast = require('../../util/cast');
const MathUtil = require('../../util/math-util');
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
    name: 'Piezo Buzzer',
    misc_service: '17009349-c39a-4be1-917b-aed613614910',
    sensor_service: '17009349-c39a-4be1-917b-aed613614911',
};

class CubroidSound {

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

    soundControl (index) {
        var data = [];
        switch (index) {
            case SoundOptions.A_DO.name:
                data = [SoundOptions.A_DO.command];
                break;
            case SoundOptions.A_DO_S.name:
                data = [SoundOptions.A_DO_S.command];
                break;
            case SoundOptions.A_RE.name:
                data = [SoundOptions.A_RE.command];
                break;
            case SoundOptions.A_MI_B.name:
                data = [SoundOptions.A_MI_B.command];
                break;
            case SoundOptions.A_MI.name:
                data = [SoundOptions.A_MI.command];
                break;
            case SoundOptions.A_FA.name:
                data = [SoundOptions.A_FA.command];
                break;
            case SoundOptions.A_FA_S.name:
                data = [SoundOptions.A_FA_S.command];
                break;
            case SoundOptions.A_SOL.name:
                data = [SoundOptions.A_SOL.command];
                break;
            case SoundOptions.A_SOL_S.name:
                data = [SoundOptions.A_SOL_S.command];
                break;
            case SoundOptions.A_LA.name:
                data = [SoundOptions.A_LA.command];
                break;
            case SoundOptions.A_SI_B.name:
                data = [SoundOptions.A_SI_B.command];
                break;
            case SoundOptions.A_SI.name:
                data = [SoundOptions.A_SI.command];
                break;
            case SoundOptions.B_DO.name:
                data = [SoundOptions.B_DO.command];
                break;
            case SoundOptions.B_DO_S.name:
                data = [SoundOptions.B_DO_S.command];
                break;
            case SoundOptions.B_RE.name:
                data = [SoundOptions.B_RE.command];
                break;
            case SoundOptions.B_MI_B.name:
                data = [SoundOptions.B_MI_B.command];
                break;
            case SoundOptions.B_MI.name:
                data = [SoundOptions.B_MI.command];
                break;
            case SoundOptions.B_FA.name:
                data = [SoundOptions.B_FA.command];
                break;
            case SoundOptions.B_FA_S.name:
                data = [SoundOptions.B_FA_S.command];
                break;
            case SoundOptions.B_SOL.name:
                data = [SoundOptions.B_SOL.command];
                break;
            case SoundOptions.B_SOL_S.name:
                data = [SoundOptions.B_SOL_S.command];
                break;
            case SoundOptions.B_LA.name:
                data = [SoundOptions.B_LA.command];
                break;
            case SoundOptions.B_SI_B.name:
                data = [SoundOptions.B_SI_B.command];
                break;
            case SoundOptions.B_SI.name:
                data = [SoundOptions.B_SI.command];
                break;
            case SoundOptions.C_DO.name:
                data = [SoundOptions.C_DO.command];
                break;
            case SoundOptions.C_RE.name:
                data = [SoundOptions.C_RE.command];
                break;
            case SoundOptions.C_MI.name:
                data = [SoundOptions.C_MI.command];
                break;
            case SoundOptions.C_FA.name:
                data = [SoundOptions.C_FA.command];
                break;
            case SoundOptions.C_SOL.name:
                data = [SoundOptions.C_SOL.command];
                break;
            case SoundOptions.C_LA.name:
                data = [SoundOptions.C_LA.command];
                break;
            case SoundOptions.C_SI.name:
                data = [SoundOptions.C_SI.command];
                break;
            case SoundOptions.D_DO.name:
                data = [SoundOptions.D_DO.command];
                break;
            default:
                data = [SoundOptions.B_DO.command];
        }
        return this.send(BLEUUID.misc_service, BLEUUID.sensor_service, data);
    }

    errorSoundControl (index) {
        var data = [];
        switch (index) {
            case ErrorSoundOptions.SOUND01.name:
                data = [ErrorSoundOptions.SOUND01.command];
                break;
            case ErrorSoundOptions.SOUND02.name:
                data = [ErrorSoundOptions.SOUND02.command];
                break;
            case ErrorSoundOptions.SOUND03.name:
                data = [ErrorSoundOptions.SOUND03.command];
                break;
            case ErrorSoundOptions.SOUND04.name:
                data = [ErrorSoundOptions.SOUND04.command];
                break;
            case ErrorSoundOptions.SOUND05.name:
                data = [ErrorSoundOptions.SOUND05.command];
                break;
            case ErrorSoundOptions.SOUND06.name:
                data = [ErrorSoundOptions.SOUND06.command];
                break;
            default:
                data = [ErrorSoundOptions.SOUND01.command];
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

    scan() {
        if (this._ble) {
            this._ble.disconnect();
        }

        this._ble = new BLE(this._runtime, this._extensionId, {
            filters: [
                { name: BLEUUID.name }
            ],
            optionalServices: [
                BLEUUID.misc_service
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

    }

    _onMessage(base64) {
        const data = Base64Util.base64ToUint8Array(base64);
    }
}

const ErrorSoundOptions = {
    SOUND01: {
        name: '에러',
        command: 0x00
    },
    SOUND02: {
        name: '작은 효과',
        command: 0x02
    },
    SOUND03: {
        name: '경고',
        command: 0x03
    },
    SOUND04: {
        name: '경쾌한',
        command: 0x04
    },
    SOUND05: {
        name: '기본',
        command: 0x05
    },
    SOUND06: {
        name: '큰 효과',
        command: 0x06
    },

}

const SoundOptions = {
    A_DO: {
        name: '도 C(48)',
        command: 0x62
    },
    A_DO_S: {
        name: '도# C#(49)',
        command: 0x60
    },
    A_RE: {
        name: '레 D(50)',
        command: 0x56
    },
    A_MI_B: {
        name: '미b Eb(51)',
        command: 0x54
    },
    A_MI: {
        name: '미 E(52)',
        command: 0x50
    },
    A_FA: {
        name: '파 F(53)',
        command: 0x47
    },
    A_FA_S: {
        name: '파# F#(54)',
        command: 0x44
    },
    A_SOL: {
        name: '솔 G(55)',
        command: 0x42
    },
    A_SOL_S: {
        name: '솔# G#(56)',
        command: 0x40
    },
    A_LA: {
        name: '라 A(57)',
        command: 0x37
    },
    A_SI_B: {
        name: '시b Bb(58)',
        command: 0x35
    },
    A_SI: {
        name: '시 B(59)',
        command: 0x33
    },
    B_DO: {
        name: '도 C(60)',
        command: 0x1b
    },
    B_DO_S: {
        name: '도# C#(61)',
        command: 0x30
    },
    B_RE: {
        name: '레 D(62)',
        command: 0x19
    },
    B_MI_B: {
        name: '미b Eb(63)',
        command: 0x27
    },
    B_MI: {
        name: '미 E(64)',
        command: 0x17
    },
    B_FA: {
        name: '파 F(65)',
        command: 0x15
    },
    B_FA_S: {
        name: '파# F#(66)',
        command: 0x22
    },
    B_SOL: {
        name: '솔 G(67)',
        command: 0x13
    },
    B_SOL_S: {
        name: '솔# G#(68)',
        command: 0x20
    },
    B_LA: {
        name: '라 A(69)',
        command: 0x11
    },
    B_SI_B: {
        name: '시b Bb(70)',
        command: 0x18
    },
    B_SI: {
        name: '시 B(71)',
        command: 0x0f
    },
    C_DO: {
        name: '도 C(72)',
        command: 0x0d
    },
    C_RE: {
        name: '레 D(74)',
        command: 0x95
    },
    C_MI: {
        name: '미 E(76)',
        command: 0x93
    },
    C_FA: {
        name: '파 F(77)',
        command: 0x12
    },
    C_SOL: {
        name: '솔 G(79)',
        command: 0x91
    },
    C_LA: {
        name: '라 A(81)',
        command: 0x10
    },
    C_SI: {
        name: '시 B(83)',
        command: 0x09
    },
    D_DO: {
        name: '도 C(84)',
        command: 0x08
    },
}

/**
 * Scratch 3.0 blocks to interact with a cubroid dc motor peripheral.
 */
class Scratch3CubroidSoundBlocks {

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return 'CubroidSound';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return 'cubroidsound';
    }

    static get BEAT_RANGE () {
        return {min: 0, max: 100};
    }

    _clampBeats (beats) {
        return MathUtil.clamp(beats, Scratch3CubroidSoundBlocks.BEAT_RANGE.min, Scratch3CubroidSoundBlocks.BEAT_RANGE.max);
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
        this._peripheral = new CubroidSound(this.runtime, Scratch3CubroidSoundBlocks.EXTENSION_ID);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: Scratch3CubroidSoundBlocks.EXTENSION_ID,
            name: formatMessage({
                id: 'cubroidsound.extensionName',
                default: 'Sound Block',
                description: 'Sound Block'
            }),
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: 'soundControl',
                    text:  formatMessage({
                        id: 'cubroidsound.playSoundBlock',
                        default: 'Play [SOUND]',
                        description: 'Play [SOUND]'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SOUND: {
                            type: ArgumentType.STRING,
                            menu: 'soundAction',
                            defaultValue: SoundOptions.A_DO.name
                        }
                    }
                },
                {
                    opcode: 'soundBeatControl',
                    blockType: BlockType.COMMAND,
                    text:  formatMessage({
                        id: 'cubroidsound.playSoundBeatBlock',
                        default: 'Play [SOUND] for [BEATS] beat',
                        description: 'Play [SOUND] for [BEATS] beat'
                    }),
                    arguments: {
                        SOUND: {
                            type: ArgumentType.STRING,
                            menu: 'soundAction',
                            defaultValue: SoundOptions.A_DO.name
                        },
                        BEATS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.25
                        }
                    }
                },
                {
                    opcode: 'errorSoundControl',
                    text:  formatMessage({
                        id: 'cubroidsound.playErrorSoundBlock',
                        default: 'Play [ERROR_SOUND]',
                        description: 'Play [ERROR_SOUND]'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ERROR_SOUND: {
                            type: ArgumentType.STRING,
                            menu: 'errorSoundAction',
                            defaultValue: ErrorSoundOptions.SOUND01.name
                        }
                    }
                },
                {
                    opcode: 'errorSoundBeatControl',
                    text:  formatMessage({
                        id: 'cubroidsound.playErrorSoundBeatBlock',
                        default: 'Play [ERROR_SOUND] for [BEATS] beat',
                        description: 'Play [ERROR_SOUND] for [BEATS] beat'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ERROR_SOUND: {
                            type: ArgumentType.STRING,
                            menu: 'errorSoundAction',
                            defaultValue: ErrorSoundOptions.SOUND01.name
                        },
                        BEATS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.25
                        }
                    }
                },
            ],
            menus: {
                soundAction: {
                    acceptReporters: true,
                    items: this.SOUND_ACTION_MENU
                },
                errorSoundAction: {
                    acceptReporters: true,
                    items: this.ERROR_SOUND_ACTION_MENU
                }
            }
        };
    }

    get ERROR_SOUND_ACTION_MENU () {
        return [
            {
                text:  formatMessage({
                    id: 'cubroidSound.errorSound01',
                    default: '에러',
                    description: '에러'
                }),
                value: ErrorSoundOptions.SOUND01.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.errorSound02',
                    default: '작은 효과',
                    description: '작은 효과'
                }),
                value: ErrorSoundOptions.SOUND02.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.errorSound03',
                    default: '경고',
                    description: '경고'
                }),
                value: ErrorSoundOptions.SOUND03.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.errorSound04',
                    default: '경쾌한',
                    description: '경쾌한'
                }),
                value: ErrorSoundOptions.SOUND04.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.errorSound05',
                    default: '기본',
                    description: '기본'
                }),
                value: ErrorSoundOptions.SOUND05.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.errorSound06',
                    default: '큰 효과',
                    description: '큰 효과'
                }),
                value: ErrorSoundOptions.SOUND06.name
            }
        ]
    };

    get SOUND_ACTION_MENU () {
        return [
            {
                text:  formatMessage({
                    id: 'cubroidSound.ado',
                    default: '도 C(48)',
                    description: '도 C(48)'
                }),
                value: SoundOptions.A_DO.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.ados',
                    default: '도# C#(49)',
                    description: '도# C#(49)'
                }),
                value: SoundOptions.A_DO_S.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.are',
                    default: '레 D(50)',
                    description: '레 D(50)'
                }),
                value: SoundOptions.A_RE.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.amib',
                    default: '미b Eb(51)',
                    description: '미b Eb(51)'
                }),
                value: SoundOptions.A_MI_B.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.ami',
                    default: '미 E(52)',
                    description: '미 E(52)'
                }),
                value: SoundOptions.A_MI.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.afa',
                    default: '파 F(53)',
                    description: '파 F(53)'
                }),
                value: SoundOptions.A_FA.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.afas',
                    default: '파# F#(54)',
                    description: '파# F#(54)'
                }),
                value: SoundOptions.A_FA_S.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.asol',
                    default: '솔 G(55)',
                    description: '솔 G(55)'
                }),
                value: SoundOptions.A_SOL.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.asols',
                    default: '솔# G#(56)',
                    description: '솔# G#(56)'
                }),
                value: SoundOptions.A_SOL_S.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.ala',
                    default: '라 A(57)',
                    description: '라 A(57)'
                }),
                value: SoundOptions.A_LA.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.asib',
                    default: '시b Bb(58',
                    description: '시b Bb(58'
                }),
                value: SoundOptions.A_SI_B.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.asi',
                    default: '시 B(59)',
                    description: '시 B(59)'
                }),
                value: SoundOptions.A_SI.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.bdo',
                    default: '도 C(60)',
                    description: '도 C(60)'
                }),
                value: SoundOptions.B_DO.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.bdos',
                    default: '도# C#(61)',
                    description: '도# C#(61)'
                }),
                value: SoundOptions.B_DO_S.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.bre',
                    default: '레 D(62)',
                    description: '레 D(62)'
                }),
                value: SoundOptions.B_RE.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.bmib',
                    default: '미b Eb(63)',
                    description: '미b Eb(63)'
                }),
                value: SoundOptions.B_MI_B.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.bmi',
                    default: '미 E(64)',
                    description: '미 E(64)'
                }),
                value: SoundOptions.B_MI.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.bfa',
                    default: '파 F(65)',
                    description: '파 F(65)'
                }),
                value: SoundOptions.B_FA.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.bfas',
                    default: '파# F#(66)',
                    description: '파# F#(66)'
                }),
                value: SoundOptions.B_FA_S.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.bsol',
                    default: '솔 G(67)',
                    description: '솔 G(67)'
                }),
                value: SoundOptions.B_SOL.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.bsols',
                    default: '솔# G#(68)',
                    description: '솔# G#(68)'
                }),
                value: SoundOptions.B_SOL_S.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.bla',
                    default: '라 A(69)',
                    description: '라 A(69)'
                }),
                value: SoundOptions.B_LA.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.bsib',
                    default: '시b Bb(70)',
                    description: '시b Bb(70)'
                }),
                value: SoundOptions.B_SI_B.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.bsi',
                    default: '시 B(71)',
                    description: '시 B(71)'
                }),
                value: SoundOptions.B_SI.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.cdo',
                    default: '도 C(72)',
                    description: '도 C(72)'
                }),
                value: SoundOptions.C_DO.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.cre',
                    default: '레 D(74)',
                    description: '레 D(74)'
                }),
                value: SoundOptions.C_RE.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.cmi',
                    default: '미 E(76)',
                    description: '미 E(76)'
                }),
                value: SoundOptions.C_MI.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.cfa',
                    default: '파 F(77)',
                    description: '파 F(77)'
                }),
                value: SoundOptions.C_FA.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.csol',
                    default: '솔 G(79)',
                    description: '솔 G(79)'
                }),
                value: SoundOptions.C_SOL.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.cla',
                    default: '라 A(81)',
                    description: '라 A(81)'
                }),
                value: SoundOptions.C_LA.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.csi',
                    default: '시 B(83)',
                    description: '시 B(83)'
                }),
                value: SoundOptions.C_SI.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidSound.ddo',
                    default: '도 C(84)',
                    description: '도 C(84)'
                }),
                value: SoundOptions.D_DO.name
            },
        ]
    }

    soundControl (args) {
        const sound = args.SOUND;

        this._peripheral.soundControl(sound);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 200);
        });
    }

    soundBeatControl (args, util) {
        const sound = args.SOUND;
        let beats = Cast.toNumber(args.BEATS);
        beats = (this._clampBeats(beats) * 1000);
        
        const SETINTERVAL = setInterval(
            () => {
                this._peripheral.soundControl(sound);
            },
            50
        );
        setTimeout(() => {
            clearInterval(SETINTERVAL);
        }, beats);

        return new Promise(resolve => {
            setTimeout(() => {
                clearInterval(SETINTERVAL);
                resolve();
            }, beats + 150);
        });
    }

    errorSoundControl (args) {
        const sound = args.ERROR_SOUND;

        this._peripheral.errorSoundControl(sound);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 200);
        });
    }

    errorSoundBeatControl (args, util) {
        const sound = args.ERROR_SOUND;
        let beats = Cast.toNumber(args.BEATS);
        beats = (this._clampBeats(beats) * 1000);
        
        const SETINTERVAL = setInterval(
            () => {
                this._peripheral.errorSoundControl(sound);
            },
            50
        );
        setTimeout(() => {
            clearInterval(SETINTERVAL);
            resolve();
        }, beats);

        return new Promise(resolve => {
            setTimeout(() => {
                clearInterval(SETINTERVAL);
                resolve();
            }, beats + 150);
        });
    }
}

module.exports = Scratch3CubroidSoundBlocks;
