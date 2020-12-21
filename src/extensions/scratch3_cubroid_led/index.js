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
const blockIconURI = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4yIiBiYXNlUHJvZmlsZT0idGlueSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiDQoJIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDBweCIgaGVpZ2h0PSI0MHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZmlsbD0iI0U1REVENyIgZD0iTTIyLDguN0gxOGMtMC43LDAtMS4zLDAuNC0xLjYsMWwtMi4zLDQuOWMtMC4yLDAuNS0wLjIsMSwwLDEuNWwyLjMsNC45YzAuMywwLjYsMC45LDEsMS42LDFIMjINCgkJYzAuNywwLDEuMy0wLjQsMS42LTFsMi4zLTQuOWMwLjItMC41LDAuMi0xLDAtMS41bC0yLjMtNC45QzIzLjMsOS4xLDIyLjcsOC43LDIyLDguN3oiLz4NCgk8cGF0aCBmaWxsPSIjODI2N0FEIiBkPSJNMjcuNCwyOC43VjE3LjFjMC0wLjMtMC4xLTAuNi0wLjMtMC44bC0wLjUtMC41Yy0wLjItMC4yLTAuNS0wLjMtMC44LTAuM0gxNC4yYy0wLjMsMC0wLjYsMC4xLTAuOCwwLjMNCgkJbC0wLjUsMC41Yy0wLjIsMC4yLTAuMywwLjUtMC4zLDAuOHYxMS42YzAsMC4zLDAuMSwwLjYsMC4zLDAuOGwwLjUsMC41YzAuMiwwLjIsMC41LDAuMywwLjgsMC4zaDExLjZjMC4zLDAsMC42LTAuMSwwLjgtMC4zDQoJCWwwLjUtMC41QzI3LjMsMjkuMywyNy40LDI5LDI3LjQsMjguN3oiLz4NCgk8cGF0aCBmaWxsPSIjRTVERUQ3IiBkPSJNMjAsMjkuMkwyMCwyOS4yYy0zLjUsMC02LjMtMi44LTYuMy02LjNsMCwwYzAtMy41LDIuOC02LjMsNi4zLTYuM2gwYzMuNSwwLDYuMywyLjgsNi4zLDYuM3YwDQoJCUMyNi4yLDI2LjQsMjMuNCwyOS4yLDIwLDI5LjJ6Ii8+DQoJPHBhdGggZmlsbD0iIzJCMjUyMiIgZD0iTTEwLjIsMzMuNUwxMC4yLDMzLjVjLTEuMywwLTIuMy0xLjEtMi4zLTIuM3YtMy4zYzAtMS4zLDEtMi4zLDIuMy0yLjNoMGMxLjMsMCwyLjMsMSwyLjMsMi4zdjMuMw0KCQlDMTIuNiwzMi40LDExLjUsMzMuNSwxMC4yLDMzLjV6Ii8+DQoJPHBhdGggZmlsbD0iIzQ4NDM0MiIgZD0iTTExLjYsMjkuM0g4LjljLTAuMiwwLTAuMy0wLjEtMC4zLTAuM2wwLDBjMC0wLjIsMC4xLTAuMywwLjMtMC4zaDIuN2MwLjIsMCwwLjMsMC4xLDAuMywwLjNsMCwwDQoJCUMxMS45LDI5LjIsMTEuNywyOS4zLDExLjYsMjkuM3oiLz4NCgk8cGF0aCBmaWxsPSIjNDg0MzQyIiBkPSJNMTEuNiwzMC4ySDguOWMtMC4yLDAtMC4zLTAuMS0wLjMtMC4zbDAsMGMwLTAuMiwwLjEtMC4zLDAuMy0wLjNoMi43YzAuMiwwLDAuMywwLjEsMC4zLDAuM2wwLDANCgkJQzExLjksMzAuMSwxMS43LDMwLjIsMTEuNiwzMC4yeiIvPg0KCTxwYXRoIGZpbGw9IiM0ODQzNDIiIGQ9Ik0xMS42LDMxLjFIOC45Yy0wLjIsMC0wLjMtMC4xLTAuMy0wLjNsMCwwYzAtMC4yLDAuMS0wLjMsMC4zLTAuM2gyLjdjMC4yLDAsMC4zLDAuMSwwLjMsMC4zbDAsMA0KCQlDMTEuOSwzMSwxMS43LDMxLjEsMTEuNiwzMS4xeiIvPg0KCTxwYXRoIGZpbGw9IiM0ODQzNDIiIGQ9Ik0xMS42LDMySDguOWMtMC4yLDAtMC4zLTAuMS0wLjMtMC4zbDAsMGMwLTAuMiwwLjEtMC4zLDAuMy0wLjNoMi43YzAuMiwwLDAuMywwLjEsMC4zLDAuM2wwLDANCgkJQzExLjksMzEuOCwxMS43LDMyLDExLjYsMzJ6Ii8+DQoJPHBhdGggZmlsbD0iIzQ4NDM0MiIgZD0iTTExLjYsMzIuOUg4LjljLTAuMiwwLTAuMy0wLjEtMC4zLTAuM2wwLDBjMC0wLjIsMC4xLTAuMywwLjMtMC4zaDIuN2MwLjIsMCwwLjMsMC4xLDAuMywwLjNsMCwwDQoJCUMxMS45LDMyLjcsMTEuNywzMi45LDExLjYsMzIuOXoiLz4NCgk8cGF0aCBmaWxsPSIjNDg0MzQyIiBkPSJNMTEuNiwyNi42SDguOWMtMC4yLDAtMC4zLTAuMS0wLjMtMC4zbDAsMGMwLTAuMiwwLjEtMC4zLDAuMy0wLjNoMi43YzAuMiwwLDAuMywwLjEsMC4zLDAuM2wwLDANCgkJQzExLjksMjYuNSwxMS43LDI2LjYsMTEuNiwyNi42eiIvPg0KCTxwYXRoIGZpbGw9IiM0ODQzNDIiIGQ9Ik0xMS42LDI3LjVIOC45Yy0wLjIsMC0wLjMtMC4xLTAuMy0wLjNsMCwwYzAtMC4yLDAuMS0wLjMsMC4zLTAuM2gyLjdjMC4yLDAsMC4zLDAuMSwwLjMsMC4zbDAsMA0KCQlDMTEuOSwyNy40LDExLjcsMjcuNSwxMS42LDI3LjV6Ii8+DQoJPHBhdGggZmlsbD0iIzQ4NDM0MiIgZD0iTTExLjYsMjguNEg4LjljLTAuMiwwLTAuMy0wLjEtMC4zLTAuM2wwLDBjMC0wLjIsMC4xLTAuMywwLjMtMC4zaDIuN2MwLjIsMCwwLjMsMC4xLDAuMywwLjNsMCwwDQoJCUMxMS45LDI4LjMsMTEuNywyOC40LDExLjYsMjguNHoiLz4NCgk8cGF0aCBmaWxsPSIjMkIyNTIyIiBkPSJNMjkuOCwzMy41TDI5LjgsMzMuNWMtMS4zLDAtMi4zLTEuMS0yLjMtMi4zdi0zLjNjMC0xLjMsMS0yLjMsMi4zLTIuM2gwYzEuMywwLDIuMywxLDIuMywyLjN2My4zDQoJCUMzMi4xLDMyLjQsMzEuMSwzMy41LDI5LjgsMzMuNXoiLz4NCgk8cGF0aCBmaWxsPSIjNDg0MzQyIiBkPSJNMzEuMSwyOS4zaC0yLjdjLTAuMiwwLTAuMy0wLjEtMC4zLTAuM2wwLDBjMC0wLjIsMC4xLTAuMywwLjMtMC4zaDIuN2MwLjIsMCwwLjMsMC4xLDAuMywwLjNsMCwwDQoJCUMzMS40LDI5LjIsMzEuMywyOS4zLDMxLjEsMjkuM3oiLz4NCgk8cGF0aCBmaWxsPSIjNDg0MzQyIiBkPSJNMzEuMSwzMC4yaC0yLjdjLTAuMiwwLTAuMy0wLjEtMC4zLTAuM2wwLDBjMC0wLjIsMC4xLTAuMywwLjMtMC4zaDIuN2MwLjIsMCwwLjMsMC4xLDAuMywwLjNsMCwwDQoJCUMzMS40LDMwLjEsMzEuMywzMC4yLDMxLjEsMzAuMnoiLz4NCgk8cGF0aCBmaWxsPSIjNDg0MzQyIiBkPSJNMzEuMSwzMS4xaC0yLjdjLTAuMiwwLTAuMy0wLjEtMC4zLTAuM2wwLDBjMC0wLjIsMC4xLTAuMywwLjMtMC4zaDIuN2MwLjIsMCwwLjMsMC4xLDAuMywwLjNsMCwwDQoJCUMzMS40LDMxLDMxLjMsMzEuMSwzMS4xLDMxLjF6Ii8+DQoJPHBhdGggZmlsbD0iIzQ4NDM0MiIgZD0iTTMxLjEsMzJoLTIuN2MtMC4yLDAtMC4zLTAuMS0wLjMtMC4zbDAsMGMwLTAuMiwwLjEtMC4zLDAuMy0wLjNoMi43YzAuMiwwLDAuMywwLjEsMC4zLDAuM2wwLDANCgkJQzMxLjQsMzEuOCwzMS4zLDMyLDMxLjEsMzJ6Ii8+DQoJPHBhdGggZmlsbD0iIzQ4NDM0MiIgZD0iTTMxLjEsMzIuOWgtMi43Yy0wLjIsMC0wLjMtMC4xLTAuMy0wLjNsMCwwYzAtMC4yLDAuMS0wLjMsMC4zLTAuM2gyLjdjMC4yLDAsMC4zLDAuMSwwLjMsMC4zbDAsMA0KCQlDMzEuNCwzMi43LDMxLjMsMzIuOSwzMS4xLDMyLjl6Ii8+DQoJPHBhdGggZmlsbD0iIzQ4NDM0MiIgZD0iTTMxLjEsMjYuNmgtMi43Yy0wLjIsMC0wLjMtMC4xLTAuMy0wLjNsMCwwYzAtMC4yLDAuMS0wLjMsMC4zLTAuM2gyLjdjMC4yLDAsMC4zLDAuMSwwLjMsMC4zbDAsMA0KCQlDMzEuNCwyNi41LDMxLjMsMjYuNiwzMS4xLDI2LjZ6Ii8+DQoJPHBhdGggZmlsbD0iIzQ4NDM0MiIgZD0iTTMxLjEsMjcuNWgtMi43Yy0wLjIsMC0wLjMtMC4xLTAuMy0wLjNsMCwwYzAtMC4yLDAuMS0wLjMsMC4zLTAuM2gyLjdjMC4yLDAsMC4zLDAuMSwwLjMsMC4zbDAsMA0KCQlDMzEuNCwyNy40LDMxLjMsMjcuNSwzMS4xLDI3LjV6Ii8+DQoJPHBhdGggZmlsbD0iIzQ4NDM0MiIgZD0iTTMxLjEsMjguNGgtMi43Yy0wLjIsMC0wLjMtMC4xLTAuMy0wLjNsMCwwYzAtMC4yLDAuMS0wLjMsMC4zLTAuM2gyLjdjMC4yLDAsMC4zLDAuMSwwLjMsMC4zbDAsMA0KCQlDMzEuNCwyOC4zLDMxLjMsMjguNCwzMS4xLDI4LjR6Ii8+DQoJPHBhdGggZmlsbD0iI0M0QjVBRCIgZD0iTTIwLDI3LjdMMjAsMjcuN2MtMi43LDAtNC45LTIuMi00LjktNC45djBjMC0yLjcsMi4yLTQuOSw0LjktNC45aDBjMi43LDAsNC45LDIuMiw0LjksNC45djANCgkJQzI0LjksMjUuNiwyMi43LDI3LjcsMjAsMjcuN3oiLz4NCgk8cGF0aCBmaWxsPSIjMkIyNTIyIiBkPSJNOC4zLDEzQzguMiwxMyw4LDEyLjksOCwxMi44Yy0wLjEtMC4yLTAuMS0wLjQsMC4xLTAuNmwxLjEtMC45YzAuMi0wLjEsMC40LTAuMSwwLjYsMC4xDQoJCWMwLjEsMC4yLDAuMSwwLjQtMC4xLDAuNmwtMS4xLDAuOUM4LjUsMTIuOSw4LjQsMTMsOC4zLDEzeiIvPg0KCTxwYXRoIGZpbGw9IiMyQjI1MjIiIGQ9Ik03LjUsMTIuN2MtMC4yLDAtMC40LTAuMS0wLjQtMC4zTDYuNyw5LjljMC0wLjIsMC4xLTAuNCwwLjMtMC41YzAuMiwwLDAuNCwwLjEsMC41LDAuM2wwLjQsMi41DQoJCUM3LjksMTIuNCw3LjgsMTIuNyw3LjUsMTIuN0M3LjUsMTIuNyw3LjUsMTIuNyw3LjUsMTIuN3oiLz4NCgk8cGF0aCBmaWxsPSIjMkIyNTIyIiBkPSJNNi44LDEyLjNjLTAuMiwwLTAuMy0wLjEtMC40LTAuMmwtMC45LTEuOWMtMC4xLTAuMiwwLTAuNCwwLjItMC41YzAuMi0wLjEsMC40LDAsMC41LDAuMmwwLjksMS45DQoJCWMwLjEsMC4yLDAsMC40LTAuMiwwLjVDNi45LDEyLjMsNi44LDEyLjMsNi44LDEyLjN6Ii8+DQoJPHBhdGggZmlsbD0iIzJCMjUyMiIgZD0iTTYuNCwxMi44Yy0wLjEsMC0wLjIsMC0wLjMtMC4xbC0xLjYtMS42Yy0wLjItMC4yLTAuMi0wLjQsMC0wLjZjMC4yLTAuMiwwLjQtMC4yLDAuNiwwbDEuNiwxLjYNCgkJYzAuMiwwLjIsMC4yLDAuNCwwLDAuNkM2LjYsMTIuNyw2LjUsMTIuOCw2LjQsMTIuOHoiLz4NCgk8cGF0aCBmaWxsPSIjMkIyNTIyIiBkPSJNNi42LDEzLjVjLTAuMSwwLTAuMSwwLTAuMiwwbC0yLjItMS4xQzQsMTIuMywzLjksMTIsNCwxMS44YzAuMS0wLjIsMC4zLTAuMywwLjUtMC4ybDIuMiwxLjENCgkJQzcsMTIuOCw3LjEsMTMsNywxMy4yQzYuOSwxMy40LDYuOCwxMy41LDYuNiwxMy41eiIvPg0KCTxwYXRoIGZpbGw9IiM1QjQxN0MiIGQ9Ik0xMi41LDE5LjNjLTIuOSwwLTQuNS0xLjYtNS40LTUuNEw4LDEzLjdjMC45LDMuOSwyLjUsNC43LDQuNiw0LjZsMCwwLjlDMTIuNSwxOS4zLDEyLjUsMTkuMywxMi41LDE5LjN6Ig0KCQkvPg0KCTxwYXRoIGZpbGw9IiM4MjY3QUQiIGQ9Ik04LjcsMTIuOWMwLDAuOC0wLjcsMS41LTEuNSwxLjVjLTAuOCwwLTEuNS0wLjctMS41LTEuNWMwLTAuOCwwLjctMS41LDEuNS0xLjVDOCwxMS40LDguNywxMi4xLDguNywxMi45eiINCgkJLz4NCgk8cGF0aCBmaWxsPSIjMkIyNTIyIiBkPSJNMzEuNywxM2MtMC4xLDAtMC4yLDAtMC4zLTAuMUwzMC4zLDEyYy0wLjItMC4xLTAuMi0wLjQtMC4xLTAuNmMwLjEtMC4yLDAuNC0wLjIsMC42LTAuMWwxLjEsMC45DQoJCWMwLjIsMC4xLDAuMiwwLjQsMC4xLDAuNkMzMiwxMi45LDMxLjksMTMsMzEuNywxM3oiLz4NCgk8cGF0aCBmaWxsPSIjMkIyNTIyIiBkPSJNMzIuNSwxMi43QzMyLjUsMTIuNywzMi41LDEyLjcsMzIuNSwxMi43Yy0wLjMsMC0wLjQtMC4zLTAuNC0wLjVsMC40LTIuNWMwLTAuMiwwLjItMC40LDAuNS0wLjMNCgkJYzAuMiwwLDAuNCwwLjIsMC4zLDAuNWwtMC40LDIuNUMzMi45LDEyLjYsMzIuNywxMi43LDMyLjUsMTIuN3oiLz4NCgk8cGF0aCBmaWxsPSIjMkIyNTIyIiBkPSJNMzMuMiwxMi44Yy0wLjEsMC0wLjEsMC0wLjIsMGMtMC4yLTAuMS0wLjMtMC4zLTAuMi0wLjVsMS0yLjRjMC4xLTAuMiwwLjMtMC4zLDAuNS0wLjINCgkJYzAuMiwwLjEsMC4zLDAuMywwLjIsMC41bC0xLDIuNEMzMy41LDEyLjcsMzMuMywxMi44LDMzLjIsMTIuOHoiLz4NCgk8cGF0aCBmaWxsPSIjMkIyNTIyIiBkPSJNMzMuNiwxMy4zYy0wLjEsMC0wLjIsMC0wLjMtMC4xYy0wLjItMC4xLTAuMi0wLjQtMC4xLTAuNmwxLjYtMmMwLjEtMC4yLDAuNC0wLjIsMC42LTAuMQ0KCQljMC4yLDAuMSwwLjIsMC40LDAuMSwwLjZsLTEuNiwyQzMzLjgsMTMuMiwzMy43LDEzLjMsMzMuNiwxMy4zeiIvPg0KCTxwYXRoIGZpbGw9IiMyQjI1MjIiIGQ9Ik0zMy41LDEzLjhjLTAuMSwwLTAuMy0wLjEtMC40LTAuMmMtMC4xLTAuMiwwLTAuNCwwLjItMC42bDIuMS0xLjFjMC4yLTAuMSwwLjQsMCwwLjYsMC4yDQoJCWMwLjEsMC4yLDAsMC40LTAuMiwwLjZsLTIuMSwxLjFDMzMuNiwxMy44LDMzLjYsMTMuOCwzMy41LDEzLjh6Ii8+DQoJPHBhdGggZmlsbD0iIzVCNDE3QyIgZD0iTTI3LjYsMTkuM2MwLDAtMC4xLDAtMC4xLDBsMC0wLjljMi45LDAuMSwzLjktMS44LDQuNi00LjZsMC45LDAuMkMzMi4xLDE3LjcsMzAuNSwxOS4zLDI3LjYsMTkuM3oiLz4NCgk8cGF0aCBmaWxsPSIjODI2N0FEIiBkPSJNMzEuMywxMi45YzAsMC44LDAuNywxLjUsMS41LDEuNWMwLjgsMCwxLjUtMC43LDEuNS0xLjVjMC0wLjgtMC43LTEuNS0xLjUtMS41DQoJCUMzMiwxMS40LDMxLjMsMTIuMSwzMS4zLDEyLjl6Ii8+DQoJPHBhdGggZmlsbD0iI0U1REVENyIgZD0iTTIzLjIsOS4zYzAsMC40LTEuNCwwLjgtMy4yLDAuOGMtMS44LDAtMy4yLTAuNC0zLjItMC44YzAtMC40LDEuNC0wLjgsMy4yLTAuOEMyMS44LDguNSwyMy4yLDguOSwyMy4yLDkuMw0KCQl6Ii8+DQoJPHBhdGggZmlsbD0iI0YwNEU2OSIgZD0iTTIyLjcsMjAuMWMtMC40LTAuMy0wLjctMC4zLTAuOC0wLjNjMCwwLTAuMSwwLTAuMywwYy0wLjMsMC0xLDAuMS0xLjYsMC43Yy0wLjYtMC42LTEuMy0wLjctMS42LTAuNw0KCQljLTAuMSwwLTAuMiwwLTAuMywwYy0wLjEsMC0wLjQsMC4xLTAuOCwwLjNjLTAuNCwwLjMtMC44LDAuOC0wLjgsMS44YzAsMS45LDMuMiw0LjEsMy40LDQuMmMwLDAsMC4xLDAsMC4xLDBjMCwwLDAuMSwwLDAuMSwwDQoJCWMwLjEtMC4xLDMuNC0yLjMsMy40LTQuMkMyMy41LDIwLjgsMjMsMjAuMywyMi43LDIwLjF6Ii8+DQoJPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTE5LjMsMTIuNWMwLDAuOS0wLjcsMS42LTEuNiwxLjZjLTAuOSwwLTEuNi0wLjctMS42LTEuNmMwLTAuOSwwLjctMS42LDEuNi0xLjYNCgkJQzE4LjUsMTAuOSwxOS4zLDExLjYsMTkuMywxMi41eiIvPg0KCTxwYXRoIGZpbGw9IiM1QjQxN0MiIGQ9Ik0xNy42LDE0LjJjLTAuOSwwLTEuNy0wLjgtMS43LTEuN2MwLTAuOSwwLjgtMS43LDEuNy0xLjdjMC45LDAsMS43LDAuOCwxLjcsMS43DQoJCUMxOS4zLDEzLjQsMTguNiwxNC4yLDE3LjYsMTQuMnogTTE3LjYsMTAuOWMtMC45LDAtMS41LDAuNy0xLjUsMS41czAuNywxLjUsMS41LDEuNWMwLjksMCwxLjUtMC43LDEuNS0xLjVTMTguNSwxMC45LDE3LjYsMTAuOXoiDQoJCS8+DQoJPHBhdGggZmlsbD0iI0NEQ0VDRiIgZD0iTTE3LjYsMTMuOGMtMC44LDAtMS41LTAuNi0xLjUtMS40YzAsMCwwLDAuMSwwLDAuMWMwLDAuOSwwLjcsMS41LDEuNSwxLjVjMC45LDAsMS41LTAuNywxLjUtMS41DQoJCWMwLDAsMC0wLjEsMC0wLjFDMTkuMSwxMy4yLDE4LjUsMTMuOCwxNy42LDEzLjh6Ii8+DQoJPHBhdGggZmlsbD0iIzVCNDE3QyIgZD0iTTE4LjcsMTIuNmMwLDAuNi0wLjUsMS4xLTEuMSwxLjFjLTAuNiwwLTEuMS0wLjUtMS4xLTEuMWMwLTAuNiwwLjUtMS4xLDEuMS0xLjENCgkJQzE4LjIsMTEuNSwxOC43LDEyLDE4LjcsMTIuNnoiLz4NCgk8cGF0aCBmaWxsPSIjMTQzNzE4IiBkPSJNMTcuNiwxMy40Yy0wLjYsMC0xLTAuNC0xLjEtMWMwLDAsMCwwLjEsMCwwLjFjMCwwLjYsMC41LDEuMSwxLjEsMS4xYzAuNiwwLDEuMS0wLjUsMS4xLTEuMQ0KCQljMCwwLDAtMC4xLDAtMC4xQzE4LjcsMTMsMTguMiwxMy40LDE3LjYsMTMuNHoiLz4NCgk8cGF0aCBmaWxsPSIjMDAwMTAwIiBkPSJNMTgsMTIuNmMwLDAuMi0wLjIsMC4zLTAuMywwLjNjLTAuMiwwLTAuMy0wLjItMC4zLTAuM2MwLTAuMiwwLjItMC4zLDAuMy0wLjNDMTcuOCwxMi4yLDE4LDEyLjQsMTgsMTIuNnoiDQoJCS8+DQoJPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTE4LjIsMTNjMCwwLjEtMC4xLDAuMS0wLjEsMC4xYy0wLjEsMC0wLjEtMC4xLTAuMS0wLjFjMC0wLjEsMC4xLTAuMSwwLjEtMC4xQzE4LjIsMTIuOSwxOC4yLDEzLDE4LjIsMTN6Ig0KCQkvPg0KCTxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xNy4zLDExLjdjLTAuMiwwLTAuNCwwLjItMC41LDAuNGMwLDAuMiwwLjIsMC4zLDAuMywwLjNjMC4yLDAsMC4zLTAuMSwwLjMtMC4zDQoJCUMxNy41LDExLjksMTcuNCwxMS44LDE3LjMsMTEuN3oiLz4NCgk8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMjQsMTIuNWMwLDAuOS0wLjcsMS42LTEuNiwxLjZjLTAuOSwwLTEuNi0wLjctMS42LTEuNmMwLTAuOSwwLjctMS42LDEuNi0xLjZDMjMuMywxMC45LDI0LDExLjYsMjQsMTIuNXoiDQoJCS8+DQoJPHBhdGggZmlsbD0iIzVCNDE3QyIgZD0iTTIyLjQsMTQuMmMtMC45LDAtMS43LTAuOC0xLjctMS43YzAtMC45LDAuOC0xLjcsMS43LTEuN2MwLjksMCwxLjcsMC44LDEuNywxLjcNCgkJQzI0LjEsMTMuNCwyMy40LDE0LjIsMjIuNCwxNC4yeiBNMjIuNCwxMC45Yy0wLjksMC0xLjUsMC43LTEuNSwxLjVzMC43LDEuNSwxLjUsMS41YzAuOSwwLDEuNS0wLjcsMS41LTEuNVMyMy4zLDEwLjksMjIuNCwxMC45eiINCgkJLz4NCgk8cGF0aCBmaWxsPSIjQ0RDRUNGIiBkPSJNMjIuNCwxMy44Yy0wLjgsMC0xLjUtMC42LTEuNS0xLjRjMCwwLDAsMC4xLDAsMC4xYzAsMC45LDAuNywxLjUsMS41LDEuNWMwLjksMCwxLjUtMC43LDEuNS0xLjUNCgkJYzAsMCwwLTAuMSwwLTAuMUMyMy45LDEzLjIsMjMuMiwxMy44LDIyLjQsMTMuOHoiLz4NCgk8cGF0aCBmaWxsPSIjNUI0MTdDIiBkPSJNMjMuNSwxMi42YzAsMC42LTAuNSwxLjEtMS4xLDEuMWMtMC42LDAtMS4xLTAuNS0xLjEtMS4xYzAtMC42LDAuNS0xLjEsMS4xLTEuMUMyMywxMS41LDIzLjUsMTIsMjMuNSwxMi42DQoJCXoiLz4NCgk8cGF0aCBmaWxsPSIjMTQzNzE4IiBkPSJNMjIuNCwxMy40Yy0wLjYsMC0xLTAuNC0xLjEtMWMwLDAsMCwwLjEsMCwwLjFjMCwwLjYsMC41LDEuMSwxLjEsMS4xYzAuNiwwLDEuMS0wLjUsMS4xLTEuMQ0KCQljMCwwLDAtMC4xLDAtMC4xQzIzLjQsMTMsMjMsMTMuNCwyMi40LDEzLjR6Ii8+DQoJPHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTIyLjgsMTIuNmMwLDAuMi0wLjIsMC4zLTAuMywwLjNjLTAuMiwwLTAuMy0wLjItMC4zLTAuM2MwLTAuMiwwLjItMC4zLDAuMy0wLjMNCgkJQzIyLjYsMTIuMiwyMi44LDEyLjQsMjIuOCwxMi42eiIvPg0KCTxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0yMywxM2MwLDAuMS0wLjEsMC4xLTAuMSwwLjFjLTAuMSwwLTAuMS0wLjEtMC4xLTAuMWMwLTAuMSwwLjEtMC4xLDAuMS0wLjFDMjIuOSwxMi45LDIzLDEzLDIzLDEzeiIvPg0KCTxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0yMi4xLDExLjdjLTAuMiwwLTAuNCwwLjItMC41LDAuNGMwLDAuMiwwLjIsMC4zLDAuMywwLjNjMC4yLDAsMC4zLTAuMSwwLjMtMC4zDQoJCUMyMi4yLDExLjksMjIuMiwxMS44LDIyLjEsMTEuN3oiLz4NCgk8cGF0aCBmaWxsPSIjNUI0MTdDIiBkPSJNMTkuMywxMC43Yy0wLjEtMC4xLTAuMy0wLjItMC40LTAuMmMtMC4xLTAuMS0wLjMtMC4xLTAuNC0wLjFjLTAuMSwwLTAuMywwLTAuNCwwYy0wLjEsMC0wLjMsMC0wLjQsMA0KCQljLTAuMiwwLTAuMywwLTAuNCwwLjFjLTAuMSwwLTAuMywwLjEtMC40LDAuMWMtMC4xLDAtMC4zLDAuMS0wLjQsMC4xYy0wLjEsMC0wLjMsMC4xLTAuNCwwLjJsMCwwYzAuMS0wLjIsMC4yLTAuMywwLjMtMC40DQoJCWMwLjEtMC4xLDAuMy0wLjIsMC40LTAuMmMwLjItMC4xLDAuMy0wLjEsMC41LTAuMWMwLjIsMCwwLjMsMCwwLjUsMGMwLjMsMCwwLjYsMC4xLDAuOSwwLjJjMC4yLDAuMSwwLjMsMC4xLDAuNCwwLjINCgkJYzAuMSwwLDAuMSwwLjEsMC4yLDAuMUMxOS4yLDEwLjUsMTkuMiwxMC42LDE5LjMsMTAuN0wxOS4zLDEwLjd6Ii8+DQoJPHBhdGggZmlsbD0iIzVCNDE3QyIgZD0iTTIwLjgsMTAuMUwyMC44LDEwLjFjMC0wLjEsMC0wLjEsMC4xLTAuMWMwLDAsMC0wLjEsMC4xLTAuMWwwLTAuMWMwLDAsMCwwLDAtMC4xbDAtMC4xbDAsMA0KCQljMC4xLTAuMSwwLjMtMC4yLDAuNC0wLjNjMC4yLTAuMSwwLjMtMC4yLDAuNS0wLjJjMC4yLDAsMC40LTAuMSwwLjUtMC4xYzAuMiwwLDAuNCwwLDAuNSwwYzAuMiwwLDAuNCwwLjEsMC41LDAuMg0KCQljMC4yLDAuMSwwLjMsMC4yLDAuNCwwLjRjMC4xLDAuMSwwLjIsMC4zLDAuMiwwLjVsMCwwQzI0LjEsMTAsMjQsOS45LDIzLjksOS44Yy0wLjEtMC4xLTAuMy0wLjEtMC40LTAuMmMtMC4xLTAuMS0wLjMtMC4xLTAuNC0wLjENCgkJYy0wLjEsMC0wLjMtMC4xLTAuNS0wLjFjLTAuMiwwLTAuMywwLTAuNSwwYy0wLjIsMC0wLjMsMC4xLTAuNSwwLjFjLTAuMiwwLjEtMC4zLDAuMS0wLjQsMC4ybDAsMGwwLDBjMCwwLDAsMCwwLDBsMCwwDQoJCWMwLDAtMC4xLDAuMS0wLjEsMC4xQzIwLjksMTAsMjAuOSwxMCwyMC44LDEwLjFMMjAuOCwxMC4xTDIwLjgsMTAuMXoiLz4NCjwvZz4NCjwvc3ZnPg0K";
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


        this._sensors = {ledMatrixState: new Uint8Array(8)}
    }


    /**
     * @return {Uint8Array} - the current state of the 5x5 LED matrix.
     */
    get ledMatrixState () {
        return this._sensors.ledMatrixState;
    }

    lceControl (hexString) {
        const data = Uint8Array.from(Buffer.from(hexString, 'hex'));
        // console.log(data)
        return this.send(BLEUUID.service_strings, BLEUUID.characteristic, data);
    }

    lceControl2 (uint8array) {
        return this.send(BLEUUID.service_strings, BLEUUID.characteristic, uint8array);
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
            name: formatMessage({
                id: 'cubroidled.extensionName',
                default: 'LED 블록',
                description: 'LED 블록'
            }),
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: 'lceMatrix8x8Control',
                    text: formatMessage({
                        id: 'cubroidled.ledMatrixBlock',
                        default: '[MATRIX] 보여주기',
                        description: '[MATRIX] 보여주기'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        MATRIX: {
                            type: ArgumentType.MATRIX8X8,
                            defaultValue: '0000000000000000000000000000000000000000000000000000000000000000'
                        }
                    }
                },
                {
                    opcode: 'lceAlpabetControl',
                    text: formatMessage({
                        id: 'cubroidled.ledWordBlock',
                        default: '글자 [MATRIX] 보여주기',
                        description: '글자 [MATRIX] 보여주기'
                    }),
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
                    text: formatMessage({
                        id: 'cubroidled.ledNumberBlock',
                        default: '숫자 [MATRIX] 보여주기',
                        description: '숫자 [MATRIX] 보여주기'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        MATRIX: {
                            type: ArgumentType.MATRIX,
                            menu: 'MenuNumber',
                            defaultValue: '0018181c1818187e'
                        }
                    }
                },
                {
                    opcode: 'lceImgControl',
                    text: formatMessage({
                        id: 'cubroidled.ledMatrixBlock',
                        default: '[MATRIX] 보여주기',
                        description: '[MATRIX] 보여주기'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        MATRIX: {
                            type: ArgumentType.MATRIX,
                            menu: 'MenuImg',
                            defaultValue: '0066660000427e3c'
                        }
                    }
                },
                {
                    opcode: 'ledAllClearControl',
                    text: formatMessage({
                        id: 'cubroidled.ledAllClearBlock',
                        default: '화면 지우기',
                        description: '화면 지우기'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                    }
                },
            ],
            menus: {
                MenuAlpabet: this.MENU_ALPABET, 
                MenuNumber: this.MENU_NUMBER,
                MenuImg: this.MENU_IMG
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

    get MENU_IMG () {
        return [
            {
                text: 'Smile1',
                value: '0066660000427e3c'
            },
            {
                text: 'Smile2',
                value: '0042e7420081663c'
            },
            {
                text: 'Smile3',
                value: '3c42a581a599423c'
            },
            {
                text: 'Smile4',
                value: 'ffffc3a500423c00'
            },
            {
                text: 'Happy',
                value: '00006600423c0000'
            },
            {
                text: 'Cry',
                value: '0000e7c3003c4200'
            },
            {
                text: 'Angry',
                value: '4224006666001824'
            },
            {
                text: 'Sad',
                value: '3c42a581bd81423c'
            },
            {
                text: 'Sun',
                value: '00281a7c3e581400'
            },
            {
                text: 'Moon',
                value: '00381c0c0c1c3800'
            },
            {
                text: 'Square',
                value: '007e7e7e7e7e7e00'
            },
            {
                text: 'Circle',
                value: '003c7e7e7e7e3c00'
            },
            {
                text: 'Triangle',
                value: '0002060e1e3e7e00'
            },
            {
                text: 'Flower',
                value: '3c3cdbe7e7db3c3c'
            },
            {
                text: 'Heart',
                value: '0066ffffff7e3c18'
            },
            {
                text: '8angles',
                value: '00183c7e7e3c1800'
            },
            {
                text: 'Exclamation',
                value: '00183c3c3c180018'
            },
            {
                text: 'Question',
                value: '003c666038180018'
            },
            {
                text: 'Star',
                value: '0018187e7e3c6600'
            },
            {
                text: 'Minus',
                value: '0000007e7e000000'
            },
            {
                text: 'Plus',
                value: '0018187e7e181800'
            },
            {
                text: 'Multiply',
                value: '00666e1c38766600'   
            },
            {
                text: 'Division',
                value: '0018007e7e001800'
            },
            {
                text: 'Durk',
                value: '70c88810205f7e3c'
            },
            {
                text: 'Note1',
                value: '000c0a0808183830'
            },
            {
                text: 'Note2',
                value: '001e3222266eecc0'
            },
            {
                text: 'O',
                value: '3c7ee7c3c3e77e3c'
            },
            {
                text: 'X',
                value: 'c3e77e3c3c7ee7c3'
            },
            {
                text: 'Full',
                value: 'ffffffffffffffff'
            },
            {
                text: 'Forward',
                value: '00183c5a18181800' 
            },
            {
                text: 'Backward',
                value: '001818185a3c1800'
            },
            {
                text: 'Right',
                value: '0010207e7e201000'
            },
            {
                text: 'Left',
                value: '0008047e7e040800'
            }
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

    lceImgControl (args) {
        const matrix = args.MATRIX;
        this._peripheral.lceControl(matrix);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 100);
        });
    }

    lceMatrix8x8Control (args) {

        const symbol = cast.toString(args.MATRIX).replace(/\s/g, '');

        const a0 = (symbol.substr(0, 8).toString()).split('').reverse().join('');
        const a1 = (symbol.substr(8, 8).toString()).split('').reverse().join('');
        const a2 = (symbol.substr(16, 8).toString()).split('').reverse().join('');
        const a3 = (symbol.substr(24, 8).toString()).split('').reverse().join('');
        const a4 = (symbol.substr(32, 8).toString()).split('').reverse().join('');
        const a5 = (symbol.substr(40, 8).toString()).split('').reverse().join('');
        const a6 = (symbol.substr(48, 8).toString()).split('').reverse().join('');
        const a7 = (symbol.substr(56, 8).toString()).split('').reverse().join('');

        const hs0 = parseInt(a0, 2).toString(16).toUpperCase().toString().padStart(2, '0');
        const hs1 = parseInt(a1, 2).toString(16).toUpperCase().toString().padStart(2, '0');
        const hs2 = parseInt(a2, 2).toString(16).toUpperCase().toString().padStart(2, '0');
        const hs3 = parseInt(a3, 2).toString(16).toUpperCase().toString().padStart(2, '0');
        const hs4 = parseInt(a4, 2).toString(16).toUpperCase().toString().padStart(2, '0');
        const hs5 = parseInt(a5, 2).toString(16).toUpperCase().toString().padStart(2, '0');
        const hs6 = parseInt(a6, 2).toString(16).toUpperCase().toString().padStart(2, '0');
        const hs7 = parseInt(a7, 2).toString(16).toUpperCase().toString().padStart(2, '0');

        // console.log(hs0)
        // console.log(hs1)
        // console.log(hs2)
        // console.log(hs3)
        // console.log(hs4)
        // console.log(hs5)
        // console.log(hs6)
        // console.log(hs7)
        const hexString = hs0 + hs1 + hs2 + hs3 + hs4 + hs5 + hs6 + hs7
        this._peripheral.lceControl(hexString);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 100);
        });
    }

    ledAllClearControl (args) {
        this._peripheral.lceControl('0000000000000000');

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 100);
        });
    }
}

module.exports = Scratch3CubroidLEDBlocks;
