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
const blockIconURI = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4yIiBiYXNlUHJvZmlsZT0idGlueSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiDQoJIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDBweCIgaGVpZ2h0PSI0MHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZmlsbD0iI0Q3Q0JDMSIgZD0iTTE5LjcsMzIuN0MxOS43LDMyLjcsMTkuNywzMi43LDE5LjcsMzIuN2MwLTAuMy0wLjUtMC43LTEuMy0wLjljLTEuMy0wLjMtMy4xLTAuMi0zLjksMC4zbC0xLjgsMQ0KCQljLTAuMywwLjItMC40LDAuNC0wLjQsMC41YzAsMCwwLDAsMCwwbDAsMS4zYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwDQoJCWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMA0KCQljMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAuMSwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLjEsMA0KCQljMCwwLDAsMCwwLDBjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMC4xLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAuMSwwLDAuMSwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLjEsMCwwLjEsMA0KCQljMCwwLDAsMCwwLDBjMCwwLDAuMSwwLDAuMSwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAuMSwwLDAuMSwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwDQoJCWMwLDAsMC4xLDAsMC4xLDBjMCwwLDAuMSwwLDAuMSwwYzAsMCwwLDAsMCwwYzAuMSwwLDAuMSwwLDAuMiwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLjEsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMA0KCQljMCwwLDAuMSwwLDAuMSwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAuMSwwLDAuMSwwLDAuMiwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLjEsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMA0KCQljMCwwLDAuMSwwLDAuMSwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAuMSwwLDAuMSwwLDAuMiwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLjEsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMA0KCQljMC4xLDAsMC4xLDAsMC4yLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMC4xLDAsMC4xLDAsMC4yLDBjMCwwLDAsMCwwLDBoMGMwLDAsMC4xLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAuMSwwLDAuMSwwDQoJCWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMC4xLDAsMC4xLDBjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAuMSwwYzAsMCwwLDAsMC4xLDBjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAuMSwwYzAsMCwwLDAsMC4xLDANCgkJYzAsMCwwLDAsMC4xLDBjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAuMSwwYzAsMCwwLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMC4xLDAsMC4xLDBjMCwwLDAsMCwwLDANCgkJYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLjEsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMC4xLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMA0KCQljMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLjEsMGwxLjgtMWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMA0KCQljMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDANCgkJYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwDQoJCWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMA0KCQljMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBsMCwwTDE5LjcsMzIuN3oiLz4NCgk8cGF0aCBmaWxsPSIjRTVERUQ3IiBkPSJNMTguNCwzMS44YzEuMywwLjMsMS43LDAuOSwwLjksMS40bC0xLjgsMWMtMC44LDAuNS0yLjYsMC42LTMuOSwwLjNjLTEuMy0wLjMtMS43LTAuOS0wLjktMS40bDEuOC0xDQoJCUMxNS4zLDMxLjcsMTcuMSwzMS41LDE4LjQsMzEuOHoiLz4NCgk8cGF0aCBmaWxsPSIjQjcyMTI2IiBkPSJNMTguMywzMi40di02YzAtMC43LTAuNi0xLjMtMS4zLTEuM2gtMC44Yy0wLjcsMC0xLjMsMC42LTEuMywxLjN2Ni4xYzAsMC4yLDAuMSwwLjQsMC40LDAuNQ0KCQljMC41LDAuMiwxLjMsMC40LDIuNSwwQzE4LjEsMzMsMTguMywzMi43LDE4LjMsMzIuNHoiLz4NCgk8cGF0aCBmaWxsPSIjRDdDQkMxIiBkPSJNMjAuNiwzNEwyMC42LDM0QzIwLjYsMzQsMjAuNiwzNCwyMC42LDM0QzIwLjYsMzQsMjAuNiwzNCwyMC42LDM0QzIwLjYsMzQsMjAuNiwzNC4xLDIwLjYsMzQNCgkJQzIwLjYsMzQuMSwyMC42LDM0LjEsMjAuNiwzNEMyMC42LDM0LjEsMjAuNiwzNC4xLDIwLjYsMzRDMjAuNiwzNC4xLDIwLjYsMzQuMSwyMC42LDM0QzIwLjYsMzQuMSwyMC42LDM0LjEsMjAuNiwzNA0KCQljMCwwLjEsMCwwLjEsMCwwLjFjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDANCgkJYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwDQoJCWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMA0KCQljMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBsMS44LDFjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMA0KCQljMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMC4xLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAuMSwwLDAuMSwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwDQoJCWMwLDAsMCwwLDAsMGMwLDAsMC4xLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAuMSwwYzAsMCwwLDAsMC4xLDBjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAuMSwwDQoJCWMwLDAsMCwwLDAuMSwwYzAsMCwwLDAsMC4xLDBjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAuMSwwYzAsMCwwLDAsMC4xLDBjMCwwLDAsMCwwLjEsMGMwLDAsMC4xLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDANCgkJYzAsMCwwLjEsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMC4xLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMC4xLDAsMC4xLDAsMC4yLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDANCgkJYzAuMSwwLDAuMSwwLDAuMiwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLjEsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLjEsMCwwLjEsMCwwLjIsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMA0KCQljMCwwLDAuMSwwLDAuMSwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLjEsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLjEsMCwwLjEsMCwwLjIsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMA0KCQljMCwwLDAuMSwwLDAuMSwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLjEsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLjEsMCwwLjEsMCwwLjIsMGMwLDAsMCwwLDAsMGMwLDAsMC4xLDAsMC4xLDANCgkJYzAsMCwwLjEsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMC4xLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMC4xLDAsMC4xLDANCgkJYzAsMCwwLDAsMCwwYzAsMCwwLjEsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMC4xLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAuMSwwLDAuMSwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMC4xLDANCgkJYzAsMCwwLDAsMCwwYzAsMCwwLDAsMC4xLDBjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLjEsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAuMSwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMC4xLDBjMCwwLDAsMCwwLDANCgkJYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwDQoJCWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGwwLTEuM2MwLDAsMCwwLDAsMGMwLTAuMi0wLjEtMC40LTAuNC0wLjUNCgkJbC0xLjgtMWMtMC44LTAuNS0yLjYtMC42LTMuOS0wLjNjLTAuOSwwLjItMS4zLDAuNS0xLjMsMC45YzAsMCwwLDAsMCwwTDIwLjYsMzR6Ii8+DQoJPHBhdGggZmlsbD0iI0U1REVENyIgZD0iTTIxLjksMzEuOGMtMS4zLDAuMy0xLjcsMC45LTAuOSwxLjRsMS44LDFjMC44LDAuNSwyLjYsMC42LDMuOSwwLjNjMS4zLTAuMywxLjctMC45LDAuOS0xLjRsLTEuOC0xDQoJCUMyNSwzMS43LDIzLjIsMzEuNSwyMS45LDMxLjh6Ii8+DQoJPHBhdGggZmlsbD0iI0I3MjEyNiIgZD0iTTIyLDMyLjR2LTZjMC0wLjcsMC42LTEuMywxLjMtMS4zaDAuOGMwLjcsMCwxLjMsMC42LDEuMywxLjN2Ni4xYzAsMC4yLTAuMSwwLjQtMC40LDAuNQ0KCQljLTAuNSwwLjItMS4zLDAuNC0yLjUsMEMyMi4yLDMzLDIyLDMyLjcsMjIsMzIuNHoiLz4NCgk8cGF0aCBmaWxsPSIjRjA0RTRBIiBkPSJNMTYuNyw0LjZjMC4yLDAuNSwwLDEuMS0wLjYsMS40Yy0wLjUsMC4yLTEuMSwwLTEuNC0wLjZjLTAuMi0wLjUsMC0xLjEsMC42LTEuNA0KCQlDMTUuOCwzLjksMTYuNCw0LjEsMTYuNyw0LjZ6Ii8+DQoJPHBhdGggZmlsbD0iIzkzOTU5OCIgZD0iTTE3LjMsNy44bC0wLjgsMC4zYzAsMC0wLjEsMC0wLjEsMGwtMC44LTIuNGMtMC4xLTAuMSwwLTAuMywwLjEtMC4zbDAsMGMwLjEtMC4xLDAuMywwLDAuMywwLjFMMTcuMyw3LjgNCgkJQzE3LjQsNy44LDE3LjQsNy44LDE3LjMsNy44eiIvPg0KCTxwYXRoIGZpbGw9IiNGMDRFNEEiIGQ9Ik0yMy40LDQuNmMtMC4yLDAuNSwwLDEuMSwwLjYsMS40YzAuNSwwLjIsMS4xLDAsMS40LTAuNmMwLjItMC41LDAtMS4xLTAuNi0xLjRDMjQuMywzLjksMjMuNyw0LjEsMjMuNCw0LjYNCgkJeiIvPg0KCTxwYXRoIGZpbGw9IiM5Mzk1OTgiIGQ9Ik0yMi43LDcuOGwwLjgsMC4zYzAsMCwwLjEsMCwwLjEsMGwwLjgtMi40YzAuMS0wLjEsMC0wLjMtMC4xLTAuM2wwLDBjLTAuMS0wLjEtMC4zLDAtMC4zLDAuMUwyMi43LDcuOA0KCQlDMjIuNyw3LjgsMjIuNyw3LjgsMjIuNyw3Ljh6Ii8+DQoJPHBhdGggZmlsbD0iI0I3MjEyNiIgZD0iTTEyLjMsMTQuOGMtMC41LTAuOC0xLjYtMS0yLjQtMC41Yy0wLjgsMC41LTEsMS42LTAuNSwyLjRjMC41LDAuOCwxLjYsMSwyLjQsMC41DQoJCUMxMi43LDE2LjcsMTIuOSwxNS42LDEyLjMsMTQuOHoiLz4NCgk8cGF0aCBmaWxsPSIjNTg1OTVCIiBkPSJNMTAuNSwxNi43Yy0wLjgsMC44LTEuNSwyLjEtMiwzLjlsLTEtMC4zYzAuNi0yLDEuMy0zLjQsMi4zLTQuM2MwLjItMC4yLDAuNi0wLjIsMC44LDBsMCwwDQoJCUMxMC43LDE2LjIsMTAuNiwxNi41LDEwLjUsMTYuN3oiLz4NCgk8cGF0aCBmaWxsPSIjRjA0RTRBIiBkPSJNNC41LDIyLjNjLTAuMywxLjYsMC43LDMuMSwyLjMsMy40YzEuNiwwLjMsMy4xLTAuNywzLjQtMi4zYzAuMy0xLjYtMC43LTMuMS0yLjMtMy40DQoJCUM2LjQsMTkuNyw0LjgsMjAuOCw0LjUsMjIuM3oiLz4NCgk8cGF0aCBmaWxsPSIjQjcyMTI2IiBkPSJNNi41LDI1LjdjMC4xLDAsMC4yLDAuMSwwLjMsMC4xYzAuMSwwLDAuMiwwLDAuMywwbDAuNC0xLjlsLTAuNS0wLjFMNi41LDI1Ljd6Ii8+DQoJPHBhdGggZmlsbD0iI0I3MjEyNiIgZD0iTTcsMjQuN2MtMC4yLTAuMy0wLjktMS4zLTAuNy0yYzAuMS0wLjYsMC43LTEsMS4zLTAuOWMwLjYsMC4xLDEsMC43LDAuOSwxLjNDOC4zLDIzLjksNy4zLDI0LjUsNywyNC43eiIvPg0KCTxwYXRoIGZpbGw9IiNCNzIxMjYiIGQ9Ik0yNy43LDE0LjhjMC41LTAuOCwxLjYtMSwyLjQtMC41YzAuOCwwLjUsMSwxLjYsMC41LDIuNGMtMC41LDAuOC0xLjYsMS0yLjQsMC41DQoJCUMyNy40LDE2LjcsMjcuMiwxNS42LDI3LjcsMTQuOHoiLz4NCgk8cGF0aCBmaWxsPSIjNTg1OTVCIiBkPSJNMjkuNiwxNi43YzAuOCwwLjgsMS41LDIuMSwyLDMuOWwxLTAuM2MtMC42LTItMS4zLTMuNC0yLjItNC40Yy0wLjItMC4yLTAuNi0wLjItMC44LDBsMCwwDQoJCUMyOS40LDE2LjIsMjkuNCwxNi41LDI5LjYsMTYuN3oiLz4NCgk8cGF0aCBmaWxsPSIjRjA0RTRBIiBkPSJNMzUuNSwyMi40YzAuMywxLjYtMC43LDMuMS0yLjMsMy40Yy0xLjYsMC4zLTMuMS0wLjctMy40LTIuM2MtMC4zLTEuNiwwLjctMy4xLDIuMy0zLjQNCgkJQzMzLjcsMTkuOCwzNS4yLDIwLjgsMzUuNSwyMi40eiIvPg0KCTxwYXRoIGZpbGw9IiNCNzIxMjYiIGQ9Ik0zMi45LDI1LjhjMC4xLDAsMC4yLDAsMC4zLDBjMC4xLDAsMC4yLTAuMSwwLjMtMC4xbC0wLjQtMS45bC0wLjUsMC4xTDMyLjksMjUuOHoiLz4NCgk8cGF0aCBmaWxsPSIjQjcyMTI2IiBkPSJNMzEuNSwyMy4yYy0wLjEtMC42LDAuMy0xLjIsMC45LTEuM2MwLjYtMC4xLDEuMiwwLjMsMS4zLDAuOWMwLjEsMC43LTAuNSwxLjctMC44LDINCgkJQzMyLjcsMjQuNSwzMS43LDIzLjksMzEuNSwyMy4yeiIvPg0KCTxwYXRoIGZpbGw9IiNGMDRFNEEiIGQ9Ik0yOS4xLDI4LjJWMTRjMC0wLjQtMC4yLTAuNy0wLjQtMWwtMC42LTAuNmMtMC4zLTAuMy0wLjYtMC40LTEtMC40SDEyLjljLTAuNCwwLTAuNywwLjItMSwwLjRMMTEuMywxMw0KCQljLTAuMywwLjMtMC40LDAuNi0wLjQsMXYxNC4yYzAsMC40LDAuMiwwLjcsMC40LDFsMC42LDAuNmMwLjMsMC4zLDAuNiwwLjQsMSwwLjRoMTQuMmMwLjQsMCwwLjctMC4yLDEtMC40bDAuNi0wLjYNCgkJQzI5LDI4LjksMjkuMSwyOC42LDI5LjEsMjguMnoiLz4NCgk8cGF0aCBmaWxsPSIjRTVERUQ3IiBkPSJNMjAsMjguOEwyMCwyOC44Yy00LjMsMC03LjgtMy41LTcuOC03LjhsMCwwYzAtNC4zLDMuNS03LjgsNy44LTcuOGgwYzQuMywwLDcuOCwzLjUsNy44LDcuOHYwDQoJCUMyNy44LDI1LjQsMjQuMywyOC44LDIwLDI4Ljh6Ii8+DQoJPHBhdGggZmlsbD0iI0Q3Q0JDMSIgZD0iTTI2LjMsMjEuMWMwLDMuNS0yLjgsNi4zLTYuMyw2LjNjLTMuNSwwLTYuMy0yLjgtNi4zLTYuM2MwLTMuNSwyLjgtNi4zLDYuMy02LjMNCgkJQzIzLjUsMTQuOCwyNi4zLDE3LjYsMjYuMywyMS4xeiIvPg0KCTxwYXRoIGZpbGw9IiNCMzdGODMiIGQ9Ik0yNS42LDIxLjFjMCwzLjEtMi41LDUuNi01LjYsNS42Yy0zLjEsMC01LjYtMi41LTUuNi01LjZjMC0zLjEsMi41LTUuNiw1LjYtNS42DQoJCUMyMy4xLDE1LjQsMjUuNiwxOCwyNS42LDIxLjF6Ii8+DQoJPHBhdGggZmlsbD0iIzdENjQ2NiIgZD0iTTIyLDIxLjFjMCwxLjEtMC45LDItMiwyYy0xLjEsMC0yLTAuOS0yLTJjMC0xLjEsMC45LTIsMi0yQzIxLjEsMTkuMSwyMiwyMCwyMiwyMS4xeiIvPg0KCTxwYXRoIGZpbGw9IiNBMzdBN0MiIGQ9Ik0yMC43LDE3LjdjMCwwLjQtMC4zLDAuNy0wLjcsMC43Yy0wLjQsMC0wLjctMC4zLTAuNy0wLjdjMC0wLjQsMC4zLTAuNywwLjctMC43DQoJCUMyMC40LDE3LDIwLjcsMTcuMywyMC43LDE3Ljd6Ii8+DQoJPHBhdGggZmlsbD0iI0EzN0E3QyIgZD0iTTIwLjcsMjQuNWMwLDAuNC0wLjMsMC43LTAuNywwLjdjLTAuNCwwLTAuNy0wLjMtMC43LTAuN2MwLTAuNCwwLjMtMC43LDAuNy0wLjcNCgkJQzIwLjQsMjMuOCwyMC43LDI0LjEsMjAuNywyNC41eiIvPg0KCTxwYXRoIGZpbGw9IiNBMzdBN0MiIGQ9Ik0xNi42LDIwLjRjMC40LDAsMC43LDAuMywwLjcsMC43YzAsMC40LTAuMywwLjctMC43LDAuN2MtMC40LDAtMC43LTAuMy0wLjctMC43DQoJCUMxNS45LDIwLjcsMTYuMywyMC40LDE2LjYsMjAuNHoiLz4NCgk8cGF0aCBmaWxsPSIjQTM3QTdDIiBkPSJNMjMuNCwyMC40YzAuNCwwLDAuNywwLjMsMC43LDAuN2MwLDAuNC0wLjMsMC43LTAuNywwLjdjLTAuNCwwLTAuNy0wLjMtMC43LTAuNw0KCQlDMjIuNywyMC43LDIzLDIwLjQsMjMuNCwyMC40eiIvPg0KCTxwYXRoIGZpbGw9IiNFNURFRDciIGQ9Ik0yNi45LDExLjljMC4yLDAsMC4zLTAuMiwwLjItMC40QzI1LjgsOC45LDIzLjEsNywyMCw3cy01LjcsMS44LTcuMSw0LjVjLTAuMSwwLjIsMCwwLjQsMC4yLDAuNEgyNi45eiIvPg0KCTxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xOC44LDguN2MwLDEtMC44LDEuOS0xLjksMS45Yy0xLDAtMS45LTAuOC0xLjktMS45czAuOC0xLjksMS45LTEuOUMxOCw2LjgsMTguOCw3LjcsMTguOCw4Ljd6Ii8+DQoJPHBhdGggZmlsbD0iI0NDNDc0NyIgZD0iTTE2LjksMTAuN2MtMS4xLDAtMi0wLjktMi0yczAuOS0yLDItMmMxLjEsMCwyLDAuOSwyLDJTMTgsMTAuNywxNi45LDEwLjd6IE0xNi45LDYuOWMtMSwwLTEuOCwwLjgtMS44LDEuOA0KCQlzMC44LDEuOCwxLjgsMS44YzEsMCwxLjgtMC44LDEuOC0xLjhTMTcuOSw2LjksMTYuOSw2Ljl6Ii8+DQoJPHBhdGggZmlsbD0iI0NEQ0VDRiIgZD0iTTE2LjksMTAuMmMtMC45LDAtMS43LTAuNy0xLjgtMS43YzAsMCwwLDAuMSwwLDAuMWMwLDEsMC44LDEuOCwxLjgsMS44YzEsMCwxLjgtMC44LDEuOC0xLjgNCgkJYzAsMCwwLTAuMSwwLTAuMUMxOC42LDkuNSwxNy45LDEwLjIsMTYuOSwxMC4yeiIvPg0KCTxwYXRoIGZpbGw9IiNCNzIxMjYiIGQ9Ik0xOC42LDguOGMwLDAuNy0wLjYsMS4zLTEuMywxLjNjLTAuNywwLTEuMy0wLjYtMS4zLTEuM2MwLTAuNywwLjYtMS4zLDEuMy0xLjNDMTgsNy41LDE4LjYsOC4xLDE4LjYsOC44eiINCgkJLz4NCgk8cGF0aCBmaWxsPSIjODAxMjE0IiBkPSJNMTcuMyw5LjdjLTAuNiwwLTEuMi0wLjUtMS4zLTEuMWMwLDAuMSwwLDAuMSwwLDAuMmMwLDAuNywwLjYsMS4zLDEuMywxLjNjMC43LDAsMS4zLTAuNiwxLjMtMS4zDQoJCWMwLTAuMSwwLTAuMSwwLTAuMkMxOC41LDkuMywxNy45LDkuNywxNy4zLDkuN3oiLz4NCgk8cGF0aCBmaWxsPSIjMDAwMTAwIiBkPSJNMTcuNyw4LjhjMCwwLjItMC4yLDAuNC0wLjQsMC40Yy0wLjIsMC0wLjQtMC4yLTAuNC0wLjRjMC0wLjIsMC4yLTAuNCwwLjQtMC40QzE3LjUsOC40LDE3LjcsOC42LDE3LjcsOC44DQoJCXoiLz4NCgk8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMTgsOS4zYzAsMC4xLTAuMSwwLjItMC4yLDAuMmMtMC4xLDAtMC4yLTAuMS0wLjItMC4yYzAtMC4xLDAuMS0wLjIsMC4yLTAuMkMxNy45LDkuMiwxOCw5LjMsMTgsOS4zeiIvPg0KCTxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xNi45LDcuOGMtMC4zLDAtMC41LDAuMi0wLjYsMC40YzAsMC4yLDAuMiwwLjMsMC40LDAuM2MwLjIsMCwwLjQtMC4yLDAuNC0wLjRDMTcuMSw4LDE3LDcuOSwxNi45LDcuOHoiLz4NCgk8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMjQuNSw4LjdjMCwxLTAuOCwxLjktMS45LDEuOWMtMSwwLTEuOS0wLjgtMS45LTEuOXMwLjgtMS45LDEuOS0xLjlDMjMuNiw2LjgsMjQuNSw3LjcsMjQuNSw4Ljd6Ii8+DQoJPHBhdGggZmlsbD0iI0NDNDc0NyIgZD0iTTIyLjYsMTAuN2MtMS4xLDAtMi0wLjktMi0yczAuOS0yLDItMmMxLjEsMCwyLDAuOSwyLDJTMjMuNywxMC43LDIyLjYsMTAuN3ogTTIyLjYsNi45DQoJCWMtMSwwLTEuOCwwLjgtMS44LDEuOHMwLjgsMS44LDEuOCwxLjhjMSwwLDEuOC0wLjgsMS44LTEuOFMyMy42LDYuOSwyMi42LDYuOXoiLz4NCgk8cGF0aCBmaWxsPSIjQ0RDRUNGIiBkPSJNMjIuNiwxMC4yYy0wLjksMC0xLjctMC43LTEuOC0xLjdjMCwwLDAsMC4xLDAsMC4xYzAsMSwwLjgsMS44LDEuOCwxLjhjMSwwLDEuOC0wLjgsMS44LTEuOA0KCQljMCwwLDAtMC4xLDAtMC4xQzI0LjMsOS41LDIzLjUsMTAuMiwyMi42LDEwLjJ6Ii8+DQoJPHBhdGggZmlsbD0iI0I3MjEyNiIgZD0iTTI0LjIsOC44YzAsMC43LTAuNiwxLjMtMS4zLDEuM2MtMC43LDAtMS4zLTAuNi0xLjMtMS4zYzAtMC43LDAuNi0xLjMsMS4zLTEuM0MyMy42LDcuNSwyNC4yLDguMSwyNC4yLDguOA0KCQl6Ii8+DQoJPHBhdGggZmlsbD0iIzgwMTIxNCIgZD0iTTIyLjksOS43Yy0wLjYsMC0xLjItMC41LTEuMy0xLjFjMCwwLjEsMCwwLjEsMCwwLjJjMCwwLjcsMC42LDEuMywxLjMsMS4zYzAuNywwLDEuMy0wLjYsMS4zLTEuMw0KCQljMC0wLjEsMC0wLjEsMC0wLjJDMjQuMSw5LjMsMjMuNiw5LjcsMjIuOSw5Ljd6Ii8+DQoJPHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTIzLjMsOC44YzAsMC4yLTAuMiwwLjQtMC40LDAuNGMtMC4yLDAtMC40LTAuMi0wLjQtMC40YzAtMC4yLDAuMi0wLjQsMC40LTAuNEMyMy4xLDguNCwyMy4zLDguNiwyMy4zLDguOA0KCQl6Ii8+DQoJPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTIzLjYsOS4zYzAsMC4xLTAuMSwwLjItMC4yLDAuMmMtMC4xLDAtMC4yLTAuMS0wLjItMC4yYzAtMC4xLDAuMS0wLjIsMC4yLTAuMkMyMy41LDkuMiwyMy42LDkuMywyMy42LDkuMw0KCQl6Ii8+DQoJPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTIyLjUsNy44Yy0wLjMsMC0wLjUsMC4yLTAuNiwwLjRjMCwwLjIsMC4yLDAuMywwLjQsMC4zYzAuMiwwLDAuNC0wLjIsMC40LTAuNEMyMi43LDgsMjIuNiw3LjksMjIuNSw3Ljh6Ig0KCQkvPg0KCTxwYXRoIGZpbGw9IiNBMTk2OTEiIGQ9Ik0yMS4zLDExYzAuMS0wLjEsMC0wLjEsMC0wLjJjLTAuMS0wLjEtMC4xLDAtMC4yLDBjLTAuMywwLjQtMC44LDAuNi0xLjMsMC42Yy0wLjUsMC0xLTAuMi0xLjMtMC42DQoJCWMtMC4xLTAuMS0wLjEtMC4xLTAuMiwwYy0wLjEsMC4xLTAuMSwwLjEsMCwwLjJjMC40LDAuNCwxLDAuNywxLjUsMC43QzIwLjMsMTEuNywyMC45LDExLjQsMjEuMywxMXoiLz4NCjwvZz4NCjwvc3ZnPg0K";
const BLETimeout = 2500;
const BLEDataStoppedError = 'Cubroid extension stopped receiving data';

const BLEUUID = {
    name: 'BnL Sensor',
    service_strings_touch: '9f41d229-fb5a-4f9d-9ced-d91154c22220',
    characteristic_touch: '9f41d229-fb5a-4f9d-9ced-d91154c22221',
    service_strings_light: '5a1aad12-5260-49c2-80ed-4bb80a63eaa0',
    characteristic_light: '5a1aad12-5260-49c2-80ed-4bb80a63eaa1',
};

const LightTouchStatus = {
    LIGHT_VALUE: 0,
    IS_PRESS: false
};
const ThisSensorType = {    // 'light' or 'touch' or null
    TYPE: null
}
const IntervalTime = 500;

class CubroidLightTouch {
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
        this._onMessageForLight = this._onMessage.bind(this);
        this._onMessageForTouch = this._onMessage.bind(this);

        this.lightSensorControl = this.lightSensorControl.bind(this);
        this.touchSensorControl = this.touchSensorControl.bind(this);
        this.ble_read = this.ble_read.bind(this);
        this.lightValue = this.lightValue.bind(this);
        this._initValue = this._initValue.bind(this);
    }

    lightSensorControl () {
        this.ble_read(BLEUUID.service_strings_light, BLEUUID.characteristic_light, this._onMessageForLight);
    }

    touchSensorControl () {
        this.ble_read(BLEUUID.service_strings_touch, BLEUUID.characteristic_touch, this._onMessageForTouch);
    }

    ble_read (service, characteristic, callback=()=>{}) {
        if (!this.isConnected()) return;
        if (this._busy) return;
        this._ble.read(service, characteristic, false, callback);
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
                BLEUUID.service_strings_touch, 
                BLEUUID.service_strings_light
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
        this._initValue();
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

    lightValue (uint8Array) {
        let value = 0;
        try {
            value = uint8Array[0] + (uint8Array[1] * 255);
        } catch (e) {
            value = 0;
        }
        return value;
    }

    _initValue() {
        LightTouchStatus.LIGHT_VALUE = 0;
        LightTouchStatus.IS_PRESS = false;
    }

    _onConnect() {
        window.setInterval(() => {
            this.ble_read(BLEUUID.service_strings_light, BLEUUID.characteristic_light, this._onMessageForLight);
        }, IntervalTime);
        window.setInterval(() => {
            this.ble_read(BLEUUID.service_strings_touch, BLEUUID.characteristic_touch, this._onMessageForTouch);
        }, IntervalTime);
    }

    _onMessage(base64) {
        const data = Base64Util.base64ToUint8Array(base64);
        // console.log('_onMessage', data.length, data)
        if (data.length > 1) {
            // 빛 센서
            LightTouchStatus.LIGHT_VALUE = this.lightValue(data);
        } else {
            // 버튼 
            LightTouchStatus.IS_PRESS = data[0] === 1 ? true : false;
        }
    }

    _onMessageForLight(base64) {
        const data = Base64Util.base64ToUint8Array(base64);
        // console.log("_onMessageForLight", data)
        LightTouchStatus.LIGHT_VALUE = this.lightValue(data);
    }

    _onMessageForTouch(base64) {
        const data = Base64Util.base64ToUint8Array(base64);
        // console.log("_onMessageForTouch", data)
        LightTouchStatus.IS_PRESS = data[0] === 1 ? true : false;
    }
}

/**
 * Scratch 3.0 blocks to interact with a cubroid lightTouch sensor peripheral.
 */
class Scratch3CubroidLightTouchBlocks {
    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return  'Cubroid Light N Touch Block';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return 'cubroidlighttouch';
    }

    /**
     * Construct a set of cubroid lightTouch sensor blocks.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor (runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        // Create a new cubroid lightTouch sensor peripheral instance (아래는 큐브로이드를 연결하기 전에 찾는 화면이 보여주는 코드)
        this._peripheral = new CubroidLightTouch(this.runtime, Scratch3CubroidLightTouchBlocks.EXTENSION_ID);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     * formatMessage({
                id: 'cubroidlighttouch.extensionName',
                default: 'Light N Touch Block',
                description: 'Light N Touch Block'
            })
     */
    getInfo () {
        return {
            id: Scratch3CubroidLightTouchBlocks.EXTENSION_ID,
            name: formatMessage({
                id: 'cubroidlighttouch.extensionName',
                default: 'LightNTouch',
                description: 'LightNTouch'
            }),
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: 'whenButtonPressed',
                    text: formatMessage({
                        id: 'cubroidlighttouch.whenButtonPressed',
                        default: 'When button Pressed',
                        description: 'When button Pressed'
                    }),
                    blockType: BlockType.HAT,
                },
                {
                    opcode: 'isButtonPressed',
                    text: formatMessage({
                        id: 'cubroidlighttouch.isButtonPressed',
                        default: 'Is button pressed?',
                        description: 'Is button pressed?'
                    }),
                    blockType: BlockType.BOOLEAN,
                },
                {
                    opcode: 'whenBrightnessLessThan01',
                    text: formatMessage({
                        id: 'cubroidlighttouch.whenBrightnessLessThan01',
                        default: 'when brightness < [DISTANCE]',
                        description: 'when brightness < [DISTANCE]'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        DISTANCE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 500
                        }
                    }
                },
                {
                    opcode: 'whenBrightnessLessThan02',
                    text: formatMessage({
                        id: 'cubroidlighttouch.whenBrightnessLessThan02',
                        default: 'when brightness > [DISTANCE]',
                        description: 'when brightness > [DISTANCE]'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        DISTANCE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 500
                        }
                    }
                },
                {
                    opcode: 'getBrightness',
                    text: formatMessage({
                        id: 'cubroidlighttouch.getBrightness',
                        default: 'brightness',
                        description: 'brightness'
                    }),
                    blockType: BlockType.REPORTER
                },
            ],
            menus: {
            }
        };
    }

    // 버튼이 눌러졌을 때
    whenButtonPressed () {
        return LightTouchStatus.IS_PRESS;
    }

    // 버튼이 눌러졌는가?
    isButtonPressed () {
        return LightTouchStatus.IS_PRESS;
    }

    // 밝기 < [DISTANCE] 일 때
    whenBrightnessLessThan01 (arg) {
        const distance = arg.DISTANCE;
        return LightTouchStatus.LIGHT_VALUE < distance ? true : false;
    }

    // 밝기 > [DISTANCE] 일 때
    whenBrightnessLessThan02 (arg) {
        const distance = arg.DISTANCE;
        return LightTouchStatus.LIGHT_VALUE > distance ? true : false;
    }

    // 빛센서 값
    getBrightness () {
        return LightTouchStatus.LIGHT_VALUE;
    }
}

module.exports = Scratch3CubroidLightTouchBlocks;
