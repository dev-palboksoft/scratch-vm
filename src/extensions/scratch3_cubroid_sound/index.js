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
const blockIconURI = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4yIiBiYXNlUHJvZmlsZT0idGlueSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiDQoJIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDBweCIgaGVpZ2h0PSI0MHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZmlsbD0iIzQ2QjI0OSIgZD0iTTE5LjUsMzIuMkMxOS41LDMyLjIsMTkuNSwzMi4yLDE5LjUsMzIuMmMwLDAsMC0wLjEsMC0wLjFjMCwwLDAsMCwwLDBjMCwwLDAtMC4xLTAuMS0wLjFjMCwwLDAsMCwwLDANCgkJYzAsMCwwLTAuMS0wLjEtMC4xYzAsMCwwLDAsMCwwYzAsMC0wLjEtMC4xLTAuMS0wLjFjMCwwLDAsMCwwLDBjLTAuMSwwLTAuMS0wLjEtMC4yLTAuMWMwLDAsMCwwLDAsMGMtMC4xLDAtMC4xLTAuMS0wLjItMC4xDQoJCWMwLDAsMCwwLTAuMSwwYy0wLjEsMC0wLjEsMC0wLjItMC4xYzAsMCwwLDAtMC4xLDBjLTAuMSwwLTAuMi0wLjEtMC4zLTAuMWMtMS4zLTAuMy0zLjEtMC4yLTMuOSwwLjNsLTEuOSwxDQoJCWMtMC4xLDAtMC4xLDAuMS0wLjIsMC4xYzAsMCwwLDAsMCwwYzAsMC0wLjEsMC4xLTAuMSwwLjFjMCwwLDAsMCwwLDBjMCwwLTAuMSwwLjEtMC4xLDAuMWMwLDAsMCwwLDAsMGMwLDAsMCwwLjEsMCwwLjENCgkJYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwbDAsMS4zYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwDQoJCWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMA0KCQljMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAuMSwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAuMSwwDQoJCWMwLDAsMCwwLDAsMGMwLDAsMC4xLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAuMSwwLDAuMSwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLjEsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMC4xLDAsMC4xLDANCgkJYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAuMSwwLDAuMSwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLjEsMCwwLjEsMGMwLDAsMC4xLDAsMC4xLDANCgkJYzAsMCwwLDAsMCwwYzAuMSwwLDAuMSwwLDAuMiwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLjEsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMC4xLDAsMC4xLDBjMCwwLDAsMCwwLDANCgkJYzAsMCwwLDAsMCwwYzAuMSwwLDAuMSwwLDAuMiwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLjEsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMC4xLDAsMC4xLDBjMCwwLDAsMCwwLDANCgkJYzAsMCwwLDAsMCwwYzAuMSwwLDAuMSwwLDAuMiwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLjEsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLjEsMCwwLjEsMCwwLjIsMGMwLDAsMCwwLDAsMA0KCQljMCwwLDAsMCwwLDBjMC4xLDAsMC4xLDAsMC4yLDBjMCwwLDAsMCwwLDBoMGMwLDAsMC4xLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAuMSwwLDAuMSwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwDQoJCWMwLDAsMC4xLDAsMC4xLDBjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAuMSwwYzAsMCwwLDAsMC4xLDBjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAuMSwwYzAsMCwwLDAsMC4xLDBjMCwwLDAsMCwwLjEsMA0KCQljMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAuMSwwYzAsMCwwLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMC4xLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDANCgkJYzAsMCwwLDAsMCwwYzAsMCwwLjEsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMC4xLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMA0KCQljMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLjEsMGwxLjktMWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMA0KCQljMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDANCgkJYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwDQoJCWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMA0KCQljMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBMMTkuNSwzMi4yQzE5LjUsMzIuMiwxOS41LDMyLjIsMTkuNSwzMi4yeiIvPg0KCTxwYXRoIGZpbGw9IiM0NkIyNDkiIGQ9Ik0yOC40LDMzLjFDMjguNCwzMy4xLDI4LjQsMzMuMSwyOC40LDMzLjFDMjguNCwzMy4xLDI4LjMsMzMuMSwyOC40LDMzLjFjMCwwLDAtMC4xLDAtMC4xYzAsMCwwLDAsMCwwDQoJCWMwLDAsMC0wLjEtMC4xLTAuMWMwLDAsMCwwLDAsMGMwLDAtMC4xLTAuMS0wLjEtMC4xYzAsMCwwLDAsMCwwYy0wLjEsMC0wLjEtMC4xLTAuMi0wLjFsLTEuOS0xYy0wLjgtMC41LTIuNi0wLjYtMy45LTAuMw0KCQljLTAuMSwwLTAuMiwwLTAuMywwLjFjMCwwLTAuMSwwLTAuMSwwYy0wLjEsMC0wLjEsMC0wLjIsMC4xYzAsMCwwLDAtMC4xLDBjLTAuMSwwLTAuMSwwLjEtMC4yLDAuMWMwLDAsMCwwLDAsMA0KCQljLTAuMSwwLTAuMSwwLjEtMC4yLDAuMWMwLDAsMCwwLDAsMGMwLDAtMC4xLDAuMS0wLjEsMC4xYzAsMCwwLDAsMCwwYzAsMC0wLjEsMC4xLTAuMSwwLjFjMCwwLDAsMCwwLDBjMCwwLDAsMC4xLTAuMSwwLjENCgkJYzAsMCwwLDAsMCwwYzAsMCwwLDAuMSwwLDAuMWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGwwLDEuM2MwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMA0KCQljMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDANCgkJYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwDQoJCWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMA0KCQljMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBsMS45LDFjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMA0KCQljMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMC4xLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAuMSwwLDAuMSwwDQoJCWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMC4xLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAuMSwwYzAsMCwwLDAsMC4xLDANCgkJYzAsMCwwLDAsMC4xLDBjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAuMSwwYzAsMCwwLDAsMC4xLDBjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAuMSwwYzAsMCwwLDAsMC4xLDBjMCwwLDAsMCwwLjEsMA0KCQljMCwwLDAuMSwwLDAuMSwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLjEsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMC4xLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMC4xLDAsMC4xLDAsMC4yLDANCgkJYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAuMSwwLDAuMSwwLDAuMiwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLjEsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLjEsMCwwLjEsMCwwLjIsMA0KCQljMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAuMSwwLDAuMSwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLjEsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLjEsMCwwLjEsMCwwLjIsMA0KCQljMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAuMSwwLDAuMSwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLjEsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLjEsMCwwLjEsMCwwLjIsMA0KCQljMCwwLDAsMCwwLDBjMCwwLDAuMSwwLDAuMSwwYzAsMCwwLjEsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMC4xLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAsMA0KCQljMCwwLDAsMCwwLDBjMCwwLDAuMSwwLDAuMSwwYzAsMCwwLDAsMCwwYzAsMCwwLjEsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMC4xLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAuMSwwLDAuMSwwDQoJCWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAuMSwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAuMSwwYzAsMCwwLDAsMCwwDQoJCWMwLDAsMCwwLDAuMSwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwDQoJCWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMEwyOC40LDMzLjF6Ii8+DQoJPHBhdGggZmlsbD0iIzU4NTk1QiIgZD0iTTE4LjIsMzEuOXYtNi4xYzAtMC43LTAuNi0xLjMtMS4zLTEuM2gtMC44Yy0wLjcsMC0xLjMsMC42LTEuMywxLjNWMzJjMCwwLjIsMC4yLDAuNSwwLjQsMC41DQoJCWMwLjUsMC4yLDEuNCwwLjQsMi42LDBDMTgsMzIuNCwxOC4yLDMyLjIsMTguMiwzMS45eiIvPg0KCTxwYXRoIGZpbGw9IiM1ODU5NUIiIGQ9Ik0yMi4xLDMxLjl2LTYuMWMwLTAuNywwLjYtMS4zLDEuMy0xLjNoMC44YzAuNywwLDEuMywwLjYsMS4zLDEuM1YzMmMwLDAuMi0wLjIsMC41LTAuNCwwLjUNCgkJYy0wLjUsMC4yLTEuNCwwLjQtMi42LDBDMjIuMywzMi40LDIyLjEsMzIuMiwyMi4xLDMxLjl6Ii8+DQoJPHBhdGggZmlsbD0iIzNDNjUzNSIgZD0iTTEyLjEsMTUuOGMtMC41LDAuOC0xLjcsMS0yLjUsMC41cy0xLTEuNy0wLjUtMi41czEuNy0xLDIuNS0wLjVDMTIuNCwxMy44LDEyLjcsMTQuOSwxMi4xLDE1Ljh6Ii8+DQoJPHBhdGggZmlsbD0iIzNDNjUzNSIgZD0iTTEwLjIsMTMuOGMtMC44LTAuOC0xLjUtMi4yLTIuMS00bC0xLDAuM2MwLjYsMiwxLjQsMy41LDIuMyw0LjVjMC4yLDAuMiwwLjYsMC4yLDAuOCwwbDAsMA0KCQlDMTAuNCwxNC4zLDEwLjQsMTQsMTAuMiwxMy44eiIvPg0KCTxwYXRoIGZpbGw9IiM0NkIzNDkiIGQ9Ik00LjEsOEMzLjcsNi40LDQuOCw0LjgsNi40LDQuNXMzLjIsMC43LDMuNSwyLjNjMC4zLDEuNi0wLjcsMy4yLTIuMywzLjVDNiwxMC43LDQuNCw5LjYsNC4xLDh6Ii8+DQoJPHBhdGggZmlsbD0iIzNDNjUzNSIgZD0iTTYuNCw0LjVjLTAuMSwwLTAuMiwwLjEtMC4zLDAuMWwwLjQsMkw3LDYuNWwtMC40LTJDNi42LDQuNSw2LjUsNC41LDYuNCw0LjV6Ii8+DQoJPHBhdGggZmlsbD0iIzNDNjUzNSIgZD0iTTYuNiw1LjZjLTAuMiwwLjMtMC45LDEuMy0wLjgsMmMwLjEsMC42LDAuNywxLDEuNCwwLjljMC42LTAuMSwxLTAuNywwLjktMS40UzcsNS44LDYuNiw1LjZ6Ii8+DQoJPHBhdGggZmlsbD0iIzNDNjUzNSIgZD0iTTI3LjksMTMuN2MwLjUtMC44LDEuNy0xLDIuNS0wLjVzMSwxLjcsMC41LDIuNXMtMS43LDEtMi41LDAuNUMyNy42LDE1LjcsMjcuNCwxNC42LDI3LjksMTMuN3oiLz4NCgk8cGF0aCBmaWxsPSIjM0M2NTM1IiBkPSJNMjkuOSwxNS43YzAuOCwwLjgsMS41LDIuMiwyLDRsMS0wLjNjLTAuNi0yLTEuMy0zLjUtMi4zLTQuNWMtMC4yLTAuMi0wLjYtMC4yLTAuOCwwbDAsMA0KCQlDMjkuNywxNS4yLDI5LjcsMTUuNSwyOS45LDE1Ljd6Ii8+DQoJPHBhdGggZmlsbD0iIzQ2QjM0OSIgZD0iTTM1LjksMjEuNWMwLjMsMS42LTAuNywzLjItMi40LDMuNWMtMS42LDAuMy0zLjItMC43LTMuNS0yLjRjLTAuMy0xLjYsMC43LTMuMiwyLjQtMy41DQoJCUMzNC4xLDE4LjksMzUuNiwxOS45LDM1LjksMjEuNXoiLz4NCgk8cGF0aCBmaWxsPSIjM0M2NTM1IiBkPSJNMzEuOSwyMi4zYy0wLjEtMC42LDAuMy0xLjIsMC45LTEuNGMwLjYtMC4xLDEuMiwwLjMsMS40LDAuOWMwLjEsMC43LTAuNSwxLjctMC44LDINCgkJQzMzLDIzLjcsMzIsMjMuMSwzMS45LDIyLjN6Ii8+DQoJPHBhdGggZmlsbD0iIzNDNjUzNSIgZD0iTTMzLjMsMjUuMWMwLjEsMCwwLjIsMCwwLjMsMHMwLjItMC4xLDAuMy0wLjFsLTAuNC0yTDMzLDIzLjFMMzMuMywyNS4xeiIvPg0KCTxwYXRoIGZpbGw9IiM0NkIzNDkiIGQ9Ik0yOS40LDI3LjVWMTIuOWMwLTAuNC0wLjItMC44LTAuNC0xbC0wLjYtMC42Yy0wLjMtMC4zLTAuNy0wLjQtMS0wLjRIMTIuN2MtMC40LDAtMC44LDAuMi0xLDAuNGwtMC42LDAuNg0KCQljLTAuMywwLjMtMC40LDAuNy0wLjQsMXYxNC42YzAsMC40LDAuMiwwLjgsMC40LDFsMC42LDAuNmMwLjMsMC4zLDAuNywwLjQsMSwwLjRoMTQuNmMwLjQsMCwwLjgtMC4yLDEtMC40bDAuNi0wLjYNCgkJQzI5LjIsMjguMywyOS40LDI3LjksMjkuNCwyNy41eiIvPg0KCTxwYXRoIGZpbGw9IiNFNURFRDciIGQ9Ik0yMCwyOC4yTDIwLDI4LjJjLTQuNCwwLTgtMy42LTgtOGwwLDBjMC00LjQsMy42LTgsOC04bDAsMGM0LjQsMCw4LDMuNiw4LDhsMCwwQzI4LDI0LjYsMjQuNCwyOC4yLDIwLDI4LjINCgkJeiIvPg0KCTxwYXRoIGZpbGw9IiNEN0NCQzEiIGQ9Ik0yNi41LDIwLjJjMCwzLjYtMi45LDYuNS02LjUsNi41cy02LjUtMi45LTYuNS02LjVzMi45LTYuNSw2LjUtNi41QzIzLjYsMTMuNywyNi41LDE2LjYsMjYuNSwyMC4yeiIvPg0KCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0M0QjVBRCIgc3Ryb2tlLXdpZHRoPSI1LjY2OTMiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTIzLjQsMjAuMmMwLDEuOS0xLjUsMy40LTMuNCwzLjQNCgkJcy0zLjQtMS41LTMuNC0zLjRzMS41LTMuNCwzLjQtMy40QzIxLjksMTYuOCwyMy40LDE4LjMsMjMuNCwyMC4yeiIvPg0KCTxwYXRoIGZpbGw9IiNEN0NCQzEiIGQ9Ik0yNi41LDIwLjJjMCwzLjYtMi45LDYuNS02LjUsNi41cy02LjUtMi45LTYuNS02LjVzMi45LTYuNSw2LjUtNi41QzIzLjYsMTMuNywyNi41LDE2LjYsMjYuNSwyMC4yeiIvPg0KCTxwYXRoIGZpbGw9IiNDNEI1QUQiIGQ9Ik0yMCwyNC40Yy0yLjMsMC00LjItMS45LTQuMi00LjJTMTcuNywxNiwyMCwxNnM0LjIsMS45LDQuMiw0LjJTMjIuMywyNC40LDIwLDI0LjR6IE0yMCwxNy43DQoJCWMtMS40LDAtMi41LDEuMS0yLjUsMi41czEuMSwyLjUsMi41LDIuNXMyLjUtMS4xLDIuNS0yLjVDMjIuNSwxOC44LDIxLjQsMTcuNywyMCwxNy43eiIvPg0KCTxwYXRoIGZpbGw9IiM1ODU5NUIiIGQ9Ik0xNy40LDIyLjdjLTAuMS0wLjEtMC4xLTAuMywwLTAuNGwwLDBjMC4xLTAuMSwwLjMtMC4xLDAuNCwwbDAsMGMwLjEsMC4xLDAuMSwwLjMsMCwwLjRsMCwwDQoJCWMtMC4xLDAuMS0wLjEsMC4xLTAuMiwwLjFsMCwwQzE3LjUsMjIuOCwxNy40LDIyLjgsMTcuNCwyMi43eiBNMTYuNiwyMS41Yy0wLjEtMC4yLDAtMC4zLDAuMi0wLjRsMCwwYzAuMi0wLjEsMC4zLDAsMC40LDAuMmwwLDANCgkJYzAuMSwwLjIsMCwwLjMtMC4yLDAuNGwwLDBoLTAuMWwwLDBDMTYuOCwyMS43LDE2LjcsMjEuNywxNi42LDIxLjV6IE0xNi43LDIwLjVjLTAuMiwwLTAuMy0wLjEtMC4zLTAuM2wwLDBsMCwwbDAsMA0KCQljMC0wLjIsMC4xLTAuMywwLjMtMC4zbDAsMGMwLjIsMCwwLjMsMC4xLDAuMywwLjNsMCwwQzE3LDIwLjMsMTYuOCwyMC41LDE2LjcsMjAuNUwxNi43LDIwLjVMMTYuNywyMC41eiBNMTcsMjAuMkwxNywyMC4yTDE3LDIwLjINCgkJTDE3LDIwLjJ6IE0xNi44LDE5LjJjLTAuMi0wLjEtMC4yLTAuMi0wLjItMC40bDAsMGMwLjEtMC4yLDAuMi0wLjIsMC40LTAuMmwwLDBjMC4yLDAuMSwwLjIsMC4yLDAuMiwwLjRsMCwwDQoJCWMwLDAuMS0wLjIsMC4yLTAuMywwLjJsMCwwSDE2Ljh6IE0xNy40LDE4Yy0wLjEtMC4xLTAuMS0wLjMsMC0wLjRsMCwwYzAuMS0wLjEsMC4zLTAuMSwwLjQsMGwwLDBjMC4xLDAuMSwwLjEsMC4zLDAsMC40bDAsMA0KCQljLTAuMSwwLjEtMC4xLDAuMS0wLjIsMC4xbDAsMEMxNy42LDE4LjEsMTcuNSwxOC4xLDE3LjQsMTh6Ii8+DQoJPHBhdGggZmlsbD0iIzU4NTk1QiIgZD0iTTIyLjMsMjIuOEwyMi4zLDIyLjhjLTAuMSwwLTAuMiwwLTAuMi0wLjFsMCwwYy0wLjEtMC4xLTAuMS0wLjMsMC0wLjRsMCwwYzAuMS0wLjEsMC4zLTAuMSwwLjQsMGwwLDANCgkJYzAuMSwwLjEsMC4xLDAuMywwLDAuNEMyMi41LDIyLjgsMjIuNCwyMi44LDIyLjMsMjIuOHogTTIzLDIxLjdMMjMsMjEuN2gtMC4xbDAsMGMtMC4yLTAuMS0wLjItMC4yLTAuMi0wLjRsMCwwDQoJCWMwLjEtMC4yLDAuMi0wLjIsMC40LTAuMmwwLDBjMC4yLDAuMSwwLjIsMC4yLDAuMiwwLjRDMjMuMywyMS43LDIzLjIsMjEuNywyMywyMS43eiBNMjMuMywyMC41TDIzLjMsMjAuNWMtMC4yLDAtMC4zLTAuMS0wLjMtMC4zDQoJCWwwLDBjMC0wLjIsMC4xLTAuMywwLjMtMC4zbDAsMGMwLjIsMCwwLjMsMC4xLDAuMywwLjNsMCwwbDAsMGwwLDBDMjMuNiwyMC4zLDIzLjUsMjAuNSwyMy4zLDIwLjVMMjMuMywyMC41eiBNMjMsMjAuMkwyMywyMC4yDQoJCUwyMywyMC4yTDIzLDIwLjJ6IE0yMywxOS4yTDIzLDE5LjJjLTAuMSwwLTAuMi0wLjEtMC4zLTAuMmwwLDBjLTAuMS0wLjIsMC0wLjMsMC4yLTAuNGwwLDBjMC4yLTAuMSwwLjMsMCwwLjQsMC4ybDAsMA0KCQljMC4xLDAuMiwwLDAuMy0wLjIsMC40QzIzLjEsMTkuMiwyMy4xLDE5LjIsMjMsMTkuMnogTTIyLjMsMTguMUwyMi4zLDE4LjFjLTAuMSwwLTAuMiwwLTAuMi0wLjFsMCwwYy0wLjEtMC4xLTAuMS0wLjMsMC0wLjRsMCwwDQoJCWMwLjEtMC4xLDAuMy0wLjEsMC40LDBsMCwwYzAuMSwwLjEsMC4xLDAuMywwLDAuNEMyMi41LDE4LjEsMjIuNCwxOC4xLDIyLjMsMTguMXoiLz4NCgk8cGF0aCBmaWxsPSIjRTVERUQ3IiBkPSJNMjcuMSwxMC44YzAuMiwwLDAuMy0wLjIsMC4yLTAuNGMtMS40LTIuOC00LjEtNC43LTcuMy00LjdjLTMuMSwwLTUuOSwxLjktNy4zLDQuN2MtMC4xLDAuMiwwLDAuNCwwLjIsMC40DQoJCUgyNy4xeiIvPg0KCTxwYXRoIGZpbGw9IiMzQzY1MzUiIGQ9Ik0xMi44LDEwLjRjLTAuMSwwLjIsMCwwLjQsMC4yLDAuNGgxNGMwLjIsMCwwLjMtMC4yLDAuMi0wLjRIMTIuOHoiLz4NCgk8cGF0aCBmaWxsPSIjNDZCMzQ5IiBkPSJNMjQuOCw3LjNoLTkuNGMtMS4xLDAuOC0xLjksMS45LTIuNSwzLjFoMTQuNUMyNi43LDkuMiwyNS44LDguMSwyNC44LDcuM3oiLz4NCgk8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMTguOCw3LjVjMCwxLjEtMC45LDEuOS0xLjksMS45Yy0xLjEsMC0xLjktMC45LTEuOS0xLjlzMC45LTEuOSwxLjktMS45QzE3LjksNS41LDE4LjgsNi40LDE4LjgsNy41eiIvPg0KCTxwYXRoIGZpbGw9IiM0NkIzNDkiIGQ9Ik0xNi44LDkuNWMtMS4xLDAtMi0wLjktMi0yczAuOS0yLDItMnMyLDAuOSwyLDJTMTcuOSw5LjUsMTYuOCw5LjV6IE0xNi44LDUuNmMtMSwwLTEuOCwwLjgtMS44LDEuOA0KCQlzMC44LDEuOCwxLjgsMS44czEuOC0wLjgsMS44LTEuOFMxNy44LDUuNiwxNi44LDUuNnoiLz4NCgk8cGF0aCBmaWxsPSIjQ0RDRUNGIiBkPSJNMTYuOCw5Yy0xLDAtMS44LTAuOC0xLjgtMS43djAuMWMwLDEsMC44LDEuOCwxLjgsMS44czEuOC0wLjgsMS44LTEuOFY3LjNDMTguNiw4LjMsMTcuOCw5LDE2LjgsOXoiLz4NCgk8cGF0aCBmaWxsPSIjNDZCMzQ5IiBkPSJNMTguNSw3LjVjMCwwLjctMC42LDEuMy0xLjMsMS4zYy0wLjcsMC0xLjMtMC42LTEuMy0xLjNzMC42LTEuMywxLjMtMS4zQzE3LjksNi4yLDE4LjUsNi44LDE4LjUsNy41eiIvPg0KCTxwYXRoIGZpbGw9IiMzQzY1MzUiIGQ9Ik0xNy4yLDguNWMtMC43LDAtMS4yLTAuNS0xLjMtMS4xYzAsMC4xLDAsMC4xLDAsMC4yYzAsMC43LDAuNiwxLjMsMS4zLDEuM3MxLjMtMC42LDEuMy0xLjMNCgkJYzAtMC4xLDAtMC4xLDAtMC4yQzE4LjQsOCwxNy45LDguNSwxNy4yLDguNXoiLz4NCgk8cGF0aCBmaWxsPSIjMDAwMTAwIiBkPSJNMTcuNiw3LjVjMCwwLjItMC4yLDAuNC0wLjQsMC40Yy0wLjIsMC0wLjQtMC4yLTAuNC0wLjRjMC0wLjIsMC4yLTAuNCwwLjQtMC40UzE3LjYsNy4zLDE3LjYsNy41eiIvPg0KCTxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xNy45LDguMWMwLDAuMS0wLjEsMC4yLTAuMiwwLjJzLTAuMi0wLjEtMC4yLTAuMmMwLTAuMSwwLjEtMC4yLDAuMi0wLjJDMTcuOCw3LjksMTcuOSw4LDE3LjksOC4xeiIvPg0KCTxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xNi44LDYuNWMtMC4zLDAtMC41LDAuMi0wLjYsMC40YzAsMC4yLDAuMiwwLjMsMC40LDAuM0MxNi44LDcuMiwxNyw3LDE3LDYuOEMxNyw2LjcsMTYuOSw2LjYsMTYuOCw2LjV6Ig0KCQkvPg0KCTxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0yNC42LDcuNWMwLDEuMS0wLjksMS45LTEuOSwxLjljLTEuMSwwLTEuOS0wLjktMS45LTEuOXMwLjktMS45LDEuOS0xLjlDMjMuNyw1LjUsMjQuNiw2LjQsMjQuNiw3LjV6Ii8+DQoJPHBhdGggZmlsbD0iIzQ2QjM0OSIgZD0iTTIyLjcsOS41Yy0xLjEsMC0yLTAuOS0yLTJzMC45LTIsMi0yczIsMC45LDIsMlMyMy44LDkuNSwyMi43LDkuNXogTTIyLjcsNS42Yy0xLDAtMS44LDAuOC0xLjgsMS44DQoJCXMwLjgsMS44LDEuOCwxLjhzMS44LTAuOCwxLjgtMS44UzIzLjcsNS42LDIyLjcsNS42eiIvPg0KCTxwYXRoIGZpbGw9IiNDRENFQ0YiIGQ9Ik0yMi43LDljLTEsMC0xLjgtMC44LTEuOC0xLjd2MC4xYzAsMSwwLjgsMS44LDEuOCwxLjhzMS44LTAuOCwxLjgtMS44VjcuM0MyNC40LDguMywyMy42LDksMjIuNyw5eiIvPg0KCTxwYXRoIGZpbGw9IiM0NkIzNDkiIGQ9Ik0yNC4zLDcuNWMwLDAuNy0wLjYsMS4zLTEuMywxLjNjLTAuNywwLTEuMy0wLjYtMS4zLTEuM3MwLjYtMS4zLDEuMy0xLjNDMjMuNyw2LjIsMjQuMyw2LjgsMjQuMyw3LjV6Ii8+DQoJPHBhdGggZmlsbD0iIzNDNjUzNSIgZD0iTTIzLDguNWMtMC43LDAtMS4yLTAuNS0xLjMtMS4xYzAsMC4xLDAsMC4xLDAsMC4yYzAsMC43LDAuNiwxLjMsMS4zLDEuM2MwLjcsMCwxLjMtMC42LDEuMy0xLjMNCgkJYzAtMC4xLDAtMC4xLDAtMC4yQzI0LjIsOCwyMy43LDguNSwyMyw4LjV6Ii8+DQoJPHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTIzLjQsNy41YzAsMC4yLTAuMiwwLjQtMC40LDAuNGMtMC4yLDAtMC40LTAuMi0wLjQtMC40YzAtMC4yLDAuMi0wLjQsMC40LTAuNEMyMy4yLDcuMSwyMy40LDcuMywyMy40LDcuNQ0KCQl6Ii8+DQoJPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTIzLjcsOC4xYzAsMC4xLTAuMSwwLjItMC4yLDAuMnMtMC4yLTAuMS0wLjItMC4yYzAtMC4xLDAuMS0wLjIsMC4yLTAuMkMyMy42LDcuOSwyMy43LDgsMjMuNyw4LjF6Ii8+DQoJPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTIyLjYsNi41Yy0wLjMsMC0wLjUsMC4yLTAuNiwwLjRjMCwwLjIsMC4yLDAuMywwLjQsMC4zYzAuMiwwLDAuNC0wLjIsMC40LTAuNEMyMi44LDYuNywyMi43LDYuNiwyMi42LDYuNQ0KCQl6Ii8+DQoJPHBhdGggZmlsbD0iIzNDNjUzNSIgZD0iTTIwLjMsOS4xaC0xLjJjLTAuMiwwLTAuMywwLjEtMC4zLDAuM2wwLDBjMCwwLjIsMC4xLDAuMywwLjMsMC4zaDEuMmMwLjIsMCwwLjMtMC4xLDAuMy0wLjNsMCwwDQoJCUMyMC42LDkuMywyMC41LDkuMSwyMC4zLDkuMXoiLz4NCjwvZz4NCjwvc3ZnPg0K";
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
                default: '사운드 블록',
                description: '사운드 블록'
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
                            menu: 'cubroidSoundAction',
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
                            menu: 'cubroidSoundAction',
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
                            menu: 'cubroidErrorSoundAction',
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
                            menu: 'cubroidErrorSoundAction',
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
                cubroidSoundAction: {
                    acceptReporters: true,
                    items: this.SOUND_ACTION_MENU
                },
                cubroidErrorSoundAction: {
                    acceptReporters: true,
                    items: this.ERROR_SOUND_ACTION_MENU
                }
            }
        };
    }

    get ERROR_SOUND_ACTION_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'cubroidsound.errorSound01',
                    default: '에러',
                    description: '에러'
                }),
                value: ErrorSoundOptions.SOUND01.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.errorSound02',
                    default: '작은 효과',
                    description: '작은 효과'
                }),
                value: ErrorSoundOptions.SOUND02.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.errorSound03',
                    default: '경고',
                    description: '경고'
                }),
                value: ErrorSoundOptions.SOUND03.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.errorSound04',
                    default: '경쾌한',
                    description: '경쾌한'
                }),
                value: ErrorSoundOptions.SOUND04.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.errorSound05',
                    default: '기본',
                    description: '기본'
                }),
                value: ErrorSoundOptions.SOUND05.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.errorSound06',
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
                text: formatMessage({
                    id: 'cubroidsound.ado',
                    default: '도 C(48)',
                    description: '도 C(48)'
                }),
                value: SoundOptions.A_DO.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.ados',
                    default: '도# C#(49)',
                    description: '도# C#(49)'
                }),
                value: SoundOptions.A_DO_S.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.are',
                    default: '레 D(50)',
                    description: '레 D(50)'
                }),
                value: SoundOptions.A_RE.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.amib',
                    default: '미b Eb(51)',
                    description: '미b Eb(51)'
                }),
                value: SoundOptions.A_MI_B.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.ami',
                    default: '미 E(52)',
                    description: '미 E(52)'
                }),
                value: SoundOptions.A_MI.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.afa',
                    default: '파 F(53)',
                    description: '파 F(53)'
                }),
                value: SoundOptions.A_FA.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.afas',
                    default: '파# F#(54)',
                    description: '파# F#(54)'
                }),
                value: SoundOptions.A_FA_S.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.asol',
                    default: '솔 G(55)',
                    description: '솔 G(55)'
                }),
                value: SoundOptions.A_SOL.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.asols',
                    default: '솔# G#(56)',
                    description: '솔# G#(56)'
                }),
                value: SoundOptions.A_SOL_S.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.ala',
                    default: '라 A(57)',
                    description: '라 A(57)'
                }),
                value: SoundOptions.A_LA.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.asib',
                    default: '시b Bb(58',
                    description: '시b Bb(58'
                }),
                value: SoundOptions.A_SI_B.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.asi',
                    default: '시 B(59)',
                    description: '시 B(59)'
                }),
                value: SoundOptions.A_SI.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.bdo',
                    default: '도 C(60)',
                    description: '도 C(60)'
                }),
                value: SoundOptions.B_DO.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.bdos',
                    default: '도# C#(61)',
                    description: '도# C#(61)'
                }),
                value: SoundOptions.B_DO_S.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.bre',
                    default: '레 D(62)',
                    description: '레 D(62)'
                }),
                value: SoundOptions.B_RE.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.bmib',
                    default: '미b Eb(63)',
                    description: '미b Eb(63)'
                }),
                value: SoundOptions.B_MI_B.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.bmi',
                    default: '미 E(64)',
                    description: '미 E(64)'
                }),
                value: SoundOptions.B_MI.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.bfa',
                    default: '파 F(65)',
                    description: '파 F(65)'
                }),
                value: SoundOptions.B_FA.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.bfas',
                    default: '파# F#(66)',
                    description: '파# F#(66)'
                }),
                value: SoundOptions.B_FA_S.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.bsol',
                    default: '솔 G(67)',
                    description: '솔 G(67)'
                }),
                value: SoundOptions.B_SOL.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.bsols',
                    default: '솔# G#(68)',
                    description: '솔# G#(68)'
                }),
                value: SoundOptions.B_SOL_S.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.bla',
                    default: '라 A(69)',
                    description: '라 A(69)'
                }),
                value: SoundOptions.B_LA.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.bsib',
                    default: '시b Bb(70)',
                    description: '시b Bb(70)'
                }),
                value: SoundOptions.B_SI_B.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.bsi',
                    default: '시 B(71)',
                    description: '시 B(71)'
                }),
                value: SoundOptions.B_SI.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.cdo',
                    default: '도 C(72)',
                    description: '도 C(72)'
                }),
                value: SoundOptions.C_DO.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidsound.cre',
                    default: '레 D(74)',
                    description: '레 D(74)'
                }),
                value: SoundOptions.C_RE.name
            },
            {
                text:  formatMessage({
                    id: 'cubroidsound.cmi',
                    default: '미 E(76)',
                    description: '미 E(76)'
                }),
                value: SoundOptions.C_MI.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.cfa',
                    default: '파 F(77)',
                    description: '파 F(77)'
                }),
                value: SoundOptions.C_FA.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.csol',
                    default: '솔 G(79)',
                    description: '솔 G(79)'
                }),
                value: SoundOptions.C_SOL.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.cla',
                    default: '라 A(81)',
                    description: '라 A(81)'
                }),
                value: SoundOptions.C_LA.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.csi',
                    default: '시 B(83)',
                    description: '시 B(83)'
                }),
                value: SoundOptions.C_SI.name
            },
            {
                text: formatMessage({
                    id: 'cubroidsound.ddo',
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
