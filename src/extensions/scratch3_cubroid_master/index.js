const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const Cast = require('../../util/cast');
const Color = require('../../util/color');
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
const blockIconURI = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4yIiBiYXNlUHJvZmlsZT0idGlueSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiDQoJIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDBweCIgaGVpZ2h0PSI0MHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZmlsbD0iIzU4NTk1QiIgZD0iTTMyLjgsMjYuMmMtMi45LTUuNC03LjQtOC45LTkuNy03LjZsLTAuNC0wLjdjMi44LTEuNSw3LjUsMiwxMC43LDcuOUwzMi44LDI2LjJ6Ii8+DQoJPHBhdGggZmlsbD0iI0U1REVENyIgZD0iTTMwLjYsMjAuNGwtMi4yLDAuMWMtMC41LDAtMC45LTAuNC0wLjktMC44djBjMC0wLjUsMC40LTAuOSwwLjgtMC45bDIuMi0wLjFjMC41LDAsMC45LDAuNCwwLjksMC44bDAsMA0KCQlDMzEuNSwyMCwzMS4xLDIwLjQsMzAuNiwyMC40eiIvPg0KCTxwYXRoIGZpbGw9IiM0MTQwNDIiIGQ9Ik04LjMsMThjMC4xLTAuMSwwLjEtMC4xLDAuMS0wLjJsMC40LTEuNGMwLjEtMC4yLTAuMS0wLjQtMC4zLTAuNUM4LjMsMTUuOCw4LjEsMTYsOCwxNi4ybC0wLjQsMS40DQoJCUM3LjYsMTcuOCw3LjgsMTgsOCwxOC4xQzguMSwxOC4xLDguMiwxOC4xLDguMywxOHoiLz4NCgk8cGF0aCBmaWxsPSIjNDE0MDQyIiBkPSJNNy41LDE4LjNDNy41LDE4LjIsNy42LDE4LjIsNy41LDE4LjNjMC4yLTAuMiwwLjItMC41LDAtMC42bC0xLjgtMS43Yy0wLjItMC4yLTAuNC0wLjEtMC42LDANCgkJYy0wLjIsMC4yLTAuMSwwLjQsMCwwLjZMNywxOC4yQzcuMSwxOC40LDcuNCwxOC40LDcuNSwxOC4zeiIvPg0KCTxwYXRoIGZpbGw9IiM0MTQwNDIiIGQ9Ik03LjEsMTguN2MwLDAsMC4xLTAuMSwwLjEtMC4xYzAuMS0wLjIsMC4xLTAuNC0wLjEtMC42bC0yLjItMS4zYy0wLjItMC4xLTAuNC0wLjEtMC42LDAuMQ0KCQljLTAuMSwwLjItMC4xLDAuNCwwLjEsMC42bDIuMiwxLjNDNi44LDE4LjgsNywxOC44LDcuMSwxOC43eiIvPg0KCTxwYXRoIGZpbGw9IiM0MTQwNDIiIGQ9Ik03LDE5LjNjMC4xLTAuMSwwLjEtMC4xLDAuMS0wLjJjMC4xLTAuMi0wLjEtMC40LTAuMy0wLjVsLTIuNC0wLjZDNC4zLDE3LjksNC4xLDE4LDQsMTguMg0KCQljLTAuMSwwLjIsMC4xLDAuNCwwLjMsMC41bDIuNCwwLjZDNi44LDE5LjQsNi45LDE5LjQsNywxOS4zeiIvPg0KCTxwYXRoIGZpbGw9IiM0MTQwNDIiIGQ9Ik03LjQsMTkuN2MwLjEtMC4xLDAuMi0wLjIsMC4yLTAuNGMwLTAuMi0wLjItMC40LTAuNS0wLjNsLTIuMywwLjNjLTAuMiwwLTAuNCwwLjItMC4zLDAuNQ0KCQljMCwwLjIsMC4yLDAuNCwwLjUsMC4zbDIuMy0wLjNDNy4zLDE5LjgsNy40LDE5LjgsNy40LDE5Ljd6Ii8+DQoJPHBhdGggZmlsbD0iIzU4NTk1QiIgZD0iTTE1LjMsMjAuNWMwLDAsMC4xLTAuMSwwLjEtMC4xbC0wLjYtMC43Yy0wLjksMC43LTEuOCwxLTIuNywwLjljLTEuMS0wLjEtMi4zLTAuNy0zLjctMS45bC0wLjYsMC43DQoJCWMxLjUsMS4zLDIuOSwyLDQuMiwyLjFDMTMuMiwyMS42LDE0LjIsMjEuMywxNS4zLDIwLjV6Ii8+DQoJPHBhdGggZmlsbD0iI0U1REVENyIgZD0iTTguNiwxNy43YzAuNSwwLjcsMC40LDEuNi0wLjMsMi4xYy0wLjcsMC41LTEuNiwwLjQtMi4xLTAuM2MtMC41LTAuNy0wLjQtMS42LDAuMy0yLjENCgkJQzcuMiwxNi45LDguMSwxNyw4LjYsMTcuN3oiLz4NCgk8cGF0aCBmaWxsPSIjRTVERUQ3IiBkPSJNMTIuMywyMC40bDIuOSwwLjNjMC4zLDAsMC41LTAuMiwwLjUtMC40bDAuMS0wLjhjMC0wLjMtMC4yLTAuNS0wLjQtMC41bC0yLjktMC4zYy0wLjMsMC0wLjUsMC4yLTAuNSwwLjQNCgkJbC0wLjEsMC44QzExLjksMjAuMiwxMiwyMC40LDEyLjMsMjAuNHoiLz4NCgk8cGF0aCBmaWxsPSIjNDE0MDQyIiBkPSJNMTcuNSwzMWMwLDAtMy4yLDEuNC0zLjUsM2MtMC4zLDEuNiwzLjksMS4yLDMuOSwxLjJzMi40LTAuMiwyLjktMS4xYzAuNS0wLjksMC40LTMuMS0wLjItMy4xDQoJCUMyMCwzMC45LDE4LjIsMzAuNiwxNy41LDMxeiIvPg0KCTxwYXRoIGZpbGw9IiM0MTQwNDIiIGQ9Ik0yNS44LDMxYzAsMCwzLjIsMS40LDMuNSwzYzAuMywxLjYtMy45LDEuMi0zLjksMS4ycy0yLjQtMC4yLTIuOS0xLjFjLTAuNS0wLjktMC40LTMuMSwwLjItMy4xDQoJCUMyMy4zLDMwLjksMjUsMzAuNiwyNS44LDMxeiIvPg0KCTxwYXRoIGZpbGw9IiM0MTQwNDIiIGQ9Ik0yOS40LDI5LjlWMTcuOGMwLTAuMy0wLjEtMC42LTAuNC0wLjlsLTAuNS0wLjVjLTAuMi0wLjItMC41LTAuNC0wLjktMC40SDE1LjZjLTAuMywwLTAuNiwwLjEtMC45LDAuNA0KCQlMMTQuMiwxN2MtMC4yLDAuMi0wLjQsMC41LTAuNCwwLjl2MTIuMWMwLDAuMywwLjEsMC42LDAuNCwwLjlsMC41LDAuNWMwLjIsMC4yLDAuNSwwLjQsMC45LDAuNGgxMi4xYzAuMywwLDAuNi0wLjEsMC45LTAuNA0KCQlsMC41LTAuNUMyOS4zLDMwLjYsMjkuNCwzMC4yLDI5LjQsMjkuOXoiLz4NCgk8cGF0aCBmaWxsPSIjRTVERUQ3IiBkPSJNMjEuNiwzMC41TDIxLjYsMzAuNWMtMy42LDAtNi42LTMtNi42LTYuNnYwYzAtMy42LDMtNi42LDYuNi02LjZoMGMzLjYsMCw2LjYsMyw2LjYsNi42djANCgkJQzI4LjIsMjcuNSwyNS4zLDMwLjUsMjEuNiwzMC41eiIvPg0KCTxwYXRoIGZpbGw9IiM0MTQwNDIiIGQ9Ik0xOSwyMC44YzAsMC4yLTAuMiwwLjQtMC40LDAuNGMtMC4yLDAtMC40LTAuMi0wLjQtMC40YzAtMC4yLDAuMi0wLjQsMC40LTAuNEMxOC44LDIwLjQsMTksMjAuNiwxOSwyMC44eiINCgkJLz4NCgk8cGF0aCBmaWxsPSIjNDE0MDQyIiBkPSJNMjEsMjAuOGMwLDAuMi0wLjIsMC40LTAuNCwwLjRjLTAuMiwwLTAuNC0wLjItMC40LTAuNGMwLTAuMiwwLjItMC40LDAuNC0wLjRDMjAuOCwyMC40LDIxLDIwLjYsMjEsMjAuOHoiDQoJCS8+DQoJPHBhdGggZmlsbD0iIzQxNDA0MiIgZD0iTTIzLjEsMjAuOGMwLDAuMi0wLjIsMC40LTAuNCwwLjRjLTAuMiwwLTAuNC0wLjItMC40LTAuNGMwLTAuMiwwLjItMC40LDAuNC0wLjQNCgkJQzIyLjksMjAuNCwyMy4xLDIwLjYsMjMuMSwyMC44eiIvPg0KCTxwYXRoIGZpbGw9IiM0MTQwNDIiIGQ9Ik0yNS4xLDIwLjhjMCwwLjItMC4yLDAuNC0wLjQsMC40Yy0wLjIsMC0wLjQtMC4yLTAuNC0wLjRjMC0wLjIsMC4yLTAuNCwwLjQtMC40DQoJCUMyNC45LDIwLjQsMjUuMSwyMC42LDI1LjEsMjAuOHoiLz4NCgk8cGF0aCBmaWxsPSIjNDE0MDQyIiBkPSJNMTksMjIuOGMwLDAuMi0wLjIsMC40LTAuNCwwLjRjLTAuMiwwLTAuNC0wLjItMC40LTAuNGMwLTAuMiwwLjItMC40LDAuNC0wLjRDMTguOCwyMi40LDE5LDIyLjYsMTksMjIuOHoiDQoJCS8+DQoJPHBhdGggZmlsbD0iIzQxNDA0MiIgZD0iTTIxLjMsMjIuOGMwLDAuNC0wLjMsMC42LTAuNiwwLjZjLTAuNCwwLTAuNi0wLjMtMC42LTAuNmMwLTAuNCwwLjMtMC42LDAuNi0wLjYNCgkJQzIxLDIyLjIsMjEuMywyMi41LDIxLjMsMjIuOHoiLz4NCgk8cGF0aCBmaWxsPSIjNDE0MDQyIiBkPSJNMjMuMywyMi44YzAsMC40LTAuMywwLjYtMC42LDAuNmMtMC40LDAtMC42LTAuMy0wLjYtMC42YzAtMC40LDAuMy0wLjYsMC42LTAuNg0KCQlDMjMsMjIuMiwyMy4zLDIyLjUsMjMuMywyMi44eiIvPg0KCTxwYXRoIGZpbGw9IiM0MTQwNDIiIGQ9Ik0yNS4xLDIyLjhjMCwwLjItMC4yLDAuNC0wLjQsMC40Yy0wLjIsMC0wLjQtMC4yLTAuNC0wLjRjMC0wLjIsMC4yLTAuNCwwLjQtMC40DQoJCUMyNC45LDIyLjQsMjUuMSwyMi42LDI1LjEsMjIuOHoiLz4NCgk8cGF0aCBmaWxsPSIjNDE0MDQyIiBkPSJNMTksMjQuOWMwLDAuMi0wLjIsMC40LTAuNCwwLjRjLTAuMiwwLTAuNC0wLjItMC40LTAuNGMwLTAuMiwwLjItMC40LDAuNC0wLjRDMTguOCwyNC41LDE5LDI0LjcsMTksMjQuOXoiDQoJCS8+DQoJPHBhdGggZmlsbD0iIzQxNDA0MiIgZD0iTTIxLjMsMjQuOWMwLDAuNC0wLjMsMC42LTAuNiwwLjZjLTAuNCwwLTAuNi0wLjMtMC42LTAuNmMwLTAuNCwwLjMtMC42LDAuNi0wLjYNCgkJQzIxLDI0LjMsMjEuMywyNC41LDIxLjMsMjQuOXoiLz4NCgk8cGF0aCBmaWxsPSIjNDE0MDQyIiBkPSJNMjMuMywyNC45YzAsMC40LTAuMywwLjYtMC42LDAuNmMtMC40LDAtMC42LTAuMy0wLjYtMC42YzAtMC40LDAuMy0wLjYsMC42LTAuNg0KCQlDMjMsMjQuMywyMy4zLDI0LjUsMjMuMywyNC45eiIvPg0KCTxwYXRoIGZpbGw9IiM0MTQwNDIiIGQ9Ik0yNS4xLDI0LjljMCwwLjItMC4yLDAuNC0wLjQsMC40Yy0wLjIsMC0wLjQtMC4yLTAuNC0wLjRjMC0wLjIsMC4yLTAuNCwwLjQtMC40DQoJCUMyNC45LDI0LjUsMjUuMSwyNC43LDI1LjEsMjQuOXoiLz4NCgk8cGF0aCBmaWxsPSIjNDE0MDQyIiBkPSJNMTksMjdjMCwwLjItMC4yLDAuNC0wLjQsMC40Yy0wLjIsMC0wLjQtMC4yLTAuNC0wLjRjMC0wLjIsMC4yLTAuNCwwLjQtMC40QzE4LjgsMjYuNSwxOSwyNi43LDE5LDI3eiIvPg0KCTxwYXRoIGZpbGw9IiM0MTQwNDIiIGQ9Ik0yMSwyN2MwLDAuMi0wLjIsMC40LTAuNCwwLjRjLTAuMiwwLTAuNC0wLjItMC40LTAuNGMwLTAuMiwwLjItMC40LDAuNC0wLjRDMjAuOCwyNi41LDIxLDI2LjcsMjEsMjd6Ii8+DQoJPHBhdGggZmlsbD0iIzQxNDA0MiIgZD0iTTIzLjEsMjdjMCwwLjItMC4yLDAuNC0wLjQsMC40Yy0wLjIsMC0wLjQtMC4yLTAuNC0wLjRjMC0wLjIsMC4yLTAuNCwwLjQtMC40QzIyLjksMjYuNSwyMy4xLDI2LjcsMjMuMSwyNw0KCQl6Ii8+DQoJPHBhdGggZmlsbD0iIzQxNDA0MiIgZD0iTTI1LjEsMjdjMCwwLjItMC4yLDAuNC0wLjQsMC40Yy0wLjIsMC0wLjQtMC4yLTAuNC0wLjRjMC0wLjIsMC4yLTAuNCwwLjQtMC40QzI0LjksMjYuNSwyNS4xLDI2LjcsMjUuMSwyNw0KCQl6Ii8+DQoJPHBhdGggZmlsbD0iIzQxNDA0MiIgZD0iTTIzLjEsNi4yYzAsMC44LTAuNiwxLjQtMS40LDEuNGMtMC44LDAtMS40LTAuNi0xLjQtMS40YzAtMC44LDAuNi0xLjQsMS40LTEuNEMyMi41LDQuOCwyMy4xLDUuNCwyMy4xLDYuMg0KCQl6Ii8+DQoJPHBhdGggZmlsbD0iIzkzOTU5OCIgZD0iTTIyLjMsMTAuNWgtMS4yYzAsMC0wLjEsMC0wLjEtMC4xTDIxLjMsN2MwLTAuMiwwLjItMC40LDAuNC0wLjRsMCwwYzAuMiwwLDAuNCwwLjIsMC40LDAuNEwyMi4zLDEwLjUNCgkJQzIyLjQsMTAuNSwyMi4zLDEwLjUsMjIuMywxMC41eiIvPg0KCTxwYXRoIGZpbGw9IiM0MTQwNDIiIGQ9Ik0yNS4yLDEwLjRoLTdjLTEuNiwwLTIuOSwxLjMtMi45LDIuOWMwLDEuNiwxLjMsMi45LDIuOSwyLjloMC45YzEuNCwwLDIuNi0xLjEsMi42LTIuNg0KCQljMCwxLjQsMS4xLDIuNiwyLjYsMi42aDAuOWMxLjYsMCwyLjktMS4zLDIuOS0yLjlDMjgsMTEuNywyNi44LDEwLjQsMjUuMiwxMC40eiIvPg0KCTxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0yMC42LDEzLjNjMCwxLjItMSwyLjItMi4yLDIuMmMtMS4yLDAtMi4yLTEtMi4yLTIuMmMwLTEuMiwxLTIuMiwyLjItMi4yQzE5LjcsMTEuMSwyMC42LDEyLjEsMjAuNiwxMy4zeiINCgkJLz4NCgk8cGF0aCBmaWxsPSIjQ0RDRUNGIiBkPSJNMTguNSwxNS4xYy0xLjEsMC0yLjEtMC45LTIuMS0yYzAsMC4xLDAsMC4xLDAsMC4yYzAsMS4yLDEsMi4yLDIuMiwyLjJjMS4yLDAsMi4yLTEsMi4yLTIuMg0KCQljMC0wLjEsMC0wLjEsMC0wLjJDMjAuNiwxNC4yLDE5LjYsMTUuMSwxOC41LDE1LjF6Ii8+DQoJPHBhdGggZmlsbD0iIzU4NTk1QiIgZD0iTTIwLjQsMTMuNGMwLDAuOC0wLjYsMS41LTEuNSwxLjVjLTAuOCwwLTEuNS0wLjYtMS41LTEuNWMwLTAuOCwwLjYtMS41LDEuNS0xLjUNCgkJQzE5LjcsMTEuOSwyMC40LDEyLjYsMjAuNCwxMy40eiIvPg0KCTxwYXRoIGZpbGw9IiMyNjIyNjIiIGQ9Ik0xOC45LDE0LjRjLTAuNywwLTEuNC0wLjYtMS40LTEuM2MwLDAuMSwwLDAuMSwwLDAuMmMwLDAuOCwwLjYsMS41LDEuNSwxLjVjMC44LDAsMS41LTAuNiwxLjUtMS41DQoJCWMwLTAuMSwwLTAuMSwwLTAuMkMyMC4zLDEzLjksMTkuNywxNC40LDE4LjksMTQuNHoiLz4NCgk8cGF0aCBmaWxsPSIjMDAwMTAwIiBkPSJNMTkuNCwxMy40YzAsMC4yLTAuMiwwLjQtMC40LDAuNGMtMC4yLDAtMC40LTAuMi0wLjQtMC40YzAtMC4yLDAuMi0wLjQsMC40LTAuNA0KCQlDMTkuMiwxMi45LDE5LjQsMTMuMSwxOS40LDEzLjR6Ii8+DQoJPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTE5LjcsMTRjMCwwLjEtMC4xLDAuMi0wLjIsMC4ycy0wLjItMC4xLTAuMi0wLjJjMC0wLjEsMC4xLTAuMiwwLjItMC4yUzE5LjcsMTMuOSwxOS43LDE0eiIvPg0KCTxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xOC41LDEyLjJjLTAuMywwLTAuNiwwLjItMC43LDAuNWMwLDAuMiwwLjIsMC4zLDAuNCwwLjNjMC4yLDAsMC40LTAuMiwwLjQtMC40DQoJCUMxOC43LDEyLjQsMTguNiwxMi4zLDE4LjUsMTIuMnoiLz4NCgk8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMjcuMiwxMy4zYzAsMS4yLTEsMi4yLTIuMiwyLjJjLTEuMiwwLTIuMi0xLTIuMi0yLjJjMC0xLjIsMS0yLjIsMi4yLTIuMkMyNi4yLDExLjEsMjcuMiwxMi4xLDI3LjIsMTMuM3oiDQoJCS8+DQoJPHBhdGggZmlsbD0iI0NEQ0VDRiIgZD0iTTI1LDE1LjFjLTEuMSwwLTIuMS0wLjktMi4xLTJjMCwwLjEsMCwwLjEsMCwwLjJjMCwxLjIsMSwyLjIsMi4yLDIuMmMxLjIsMCwyLjItMSwyLjItMi4yDQoJCWMwLTAuMSwwLTAuMSwwLTAuMkMyNy4xLDE0LjIsMjYuMSwxNS4xLDI1LDE1LjF6Ii8+DQoJPHBhdGggZmlsbD0iIzU4NTk1QiIgZD0iTTI2LjgsMTMuNGMwLDAuOC0wLjYsMS41LTEuNSwxLjVjLTAuOCwwLTEuNS0wLjYtMS41LTEuNWMwLTAuOCwwLjYtMS41LDEuNS0xLjUNCgkJQzI2LjIsMTEuOSwyNi44LDEyLjYsMjYuOCwxMy40eiIvPg0KCTxwYXRoIGZpbGw9IiMyNjIyNjIiIGQ9Ik0yNS40LDE0LjRjLTAuNywwLTEuNC0wLjYtMS40LTEuM2MwLDAuMSwwLDAuMSwwLDAuMmMwLDAuOCwwLjYsMS41LDEuNSwxLjVjMC44LDAsMS41LTAuNiwxLjUtMS41DQoJCWMwLTAuMSwwLTAuMSwwLTAuMkMyNi43LDEzLjksMjYuMSwxNC40LDI1LjQsMTQuNHoiLz4NCgk8cGF0aCBmaWxsPSIjMDAwMTAwIiBkPSJNMjUuOCwxMy40YzAsMC4yLTAuMiwwLjQtMC40LDAuNGMtMC4yLDAtMC40LTAuMi0wLjQtMC40YzAtMC4yLDAuMi0wLjQsMC40LTAuNA0KCQlDMjUuNiwxMi45LDI1LjgsMTMuMSwyNS44LDEzLjR6Ii8+DQoJPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTI2LjEsMTRjMCwwLjEtMC4xLDAuMi0wLjIsMC4yYy0wLjEsMC0wLjItMC4xLTAuMi0wLjJjMC0wLjEsMC4xLTAuMiwwLjItMC4yQzI2LDEzLjgsMjYuMSwxMy45LDI2LjEsMTR6Ig0KCQkvPg0KCTxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0yNC45LDEyLjJjLTAuMywwLTAuNiwwLjItMC43LDAuNWMwLDAuMiwwLjIsMC4zLDAuNCwwLjNjMC4yLDAsMC40LTAuMiwwLjQtMC40DQoJCUMyNS4xLDEyLjQsMjUsMTIuMywyNC45LDEyLjJ6Ii8+DQoJPHBhdGggZmlsbD0iI0U1REVENyIgZD0iTTI3LjUsMTEuMUgxNS45Yy0wLjMsMC0wLjYtMC4zLTAuNi0wLjZsMCwwYzAtMC4zLDAuMy0wLjYsMC42LTAuNmgxMS42YzAuMywwLDAuNiwwLjMsMC42LDAuNmwwLDANCgkJQzI4LDEwLjgsMjcuOCwxMS4xLDI3LjUsMTEuMXoiLz4NCgk8cGF0aCBmaWxsPSIjNDE0MDQyIiBkPSJNMzEuOSwyNi4xYy0wLjEsMC0wLjIsMC0wLjMsMC4xTDMwLjQsMjdjLTAuMiwwLjEtMC4yLDAuNC0wLjEsMC42YzAuMSwwLjIsMC40LDAuMiwwLjYsMC4xbDEuMi0wLjgNCgkJYzAuMi0wLjEsMC4yLTAuNCwwLjEtMC42QzMyLjEsMjYuMiwzMiwyNi4xLDMxLjksMjYuMXoiLz4NCgk8cGF0aCBmaWxsPSIjNDE0MDQyIiBkPSJNMzIuNywyNi40QzMyLjYsMjYuNCwzMi42LDI2LjQsMzIuNywyNi40Yy0wLjMsMC0wLjUsMC4yLTAuNCwwLjRsMC4yLDIuNWMwLDAuMiwwLjIsMC40LDAuNCwwLjQNCgkJYzAuMiwwLDAuNC0wLjIsMC40LTAuNEwzMywyNi44QzMzLDI2LjYsMzIuOCwyNi40LDMyLjcsMjYuNHoiLz4NCgk8cGF0aCBmaWxsPSIjNDE0MDQyIiBkPSJNMzMuMywyNi4zYy0wLjEsMC0wLjEsMC0wLjIsMGMtMC4yLDAuMS0wLjMsMC4zLTAuMywwLjVsMC44LDIuNGMwLjEsMC4yLDAuMywwLjMsMC41LDAuMw0KCQljMC4yLTAuMSwwLjMtMC4zLDAuMy0wLjVsLTAuOC0yLjRDMzMuNiwyNi41LDMzLjQsMjYuNCwzMy4zLDI2LjN6Ii8+DQoJPHBhdGggZmlsbD0iIzQxNDA0MiIgZD0iTTMzLjcsMjZjLTAuMSwwLTAuMiwwLTAuMywwLjFjLTAuMiwwLjEtMC4yLDAuNC0wLjEsMC42bDEuNCwyLjFjMC4xLDAuMiwwLjQsMC4yLDAuNiwwLjENCgkJYzAuMi0wLjEsMC4yLTAuNCwwLjEtMC42TDM0LDI2LjFDMzMuOSwyNiwzMy44LDI2LDMzLjcsMjZ6Ii8+DQoJPHBhdGggZmlsbD0iIzQxNDA0MiIgZD0iTTMzLjcsMjUuNGMtMC4xLDAtMC4zLDAuMS0wLjQsMC4yYy0wLjEsMC4yLTAuMSwwLjQsMC4xLDAuNmwxLjksMS4zYzAuMiwwLjEsMC40LDAuMSwwLjYtMC4xDQoJCWMwLjEtMC4yLDAuMS0wLjQtMC4xLTAuNmwtMS45LTEuM0MzMy44LDI1LjQsMzMuOCwyNS40LDMzLjcsMjUuNHoiLz4NCgk8cGF0aCBmaWxsPSIjRTVERUQ3IiBkPSJNMzEuNSwyNi4xYzAuMS0wLjgsMC44LTEuNCwxLjYtMS40YzAuOCwwLjEsMS40LDAuOCwxLjQsMS42Yy0wLjEsMC44LTAuOCwxLjQtMS42LDEuNA0KCQlDMzIsMjcuNiwzMS40LDI2LjksMzEuNSwyNi4xeiIvPg0KPC9nPg0KPC9zdmc+DQo=";
const BLETimeout = 2500;
const BLEDataStoppedError = 'Cubroid extension stopped receiving data';


const BLEUUID = {
    name: 'MASTER',
    service_strings: 'ab4bec65-e0bd-44c1-b12a-cac7f541ae60',
    characteristic: 'ab4bec65-e0bd-44c1-b12a-cac7f541ae61',
};

class CubroidMaster {

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

    colorControl (rgb) {
        var data = [rgb.r, rgb.g, rgb.b];
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
        
    }

    _onMessage(base64) {
        
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
class Scratch3CubroidMasterBlocks {

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
        return 'cubroidmaster';
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
        this._peripheral = new CubroidMaster(this.runtime, Scratch3CubroidMasterBlocks.EXTENSION_ID);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: Scratch3CubroidMasterBlocks.EXTENSION_ID,
            name: formatMessage({
                id: 'cubroidmaster.extensionName',
                default: '마스터 블록',
                description: '마스터 블록'
            }),
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: 'colorControl',
                    text: formatMessage({
                        id: 'cubroidmaster.colorControl',
                        default: '[COLOR] 색 불빛 켜기',
                        description: '[COLOR] 색 불빛 켜기'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        COLOR: {
                            type: ArgumentType.COLOR,
                            defaultValue: '#ff0000'
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'colorOffControl',
                    text: formatMessage({
                        id: 'cubroidmaster.colorOff',
                        default: '불빛 끄기',
                        description: '불빛 끄기'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                    }
                }
            ],
            menus: {
            }
        };
    }

    colorControl (args, util) {
        const color = args.COLOR
        // console.log("color", color)
        const rgb = Cast.toRgbColorObject(color);
        // console.log("rgb", rgb)
        // const hsv = Color.rgbToHsv(rgb);
        // console.log("hsv", hsv)

        this._peripheral.colorControl(rgb);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    }

    colorOffControl () {
        const rgb = {r: 0, g: 0, b: 0};
        this._peripheral.colorControl(rgb);
    }

}

module.exports = Scratch3CubroidMasterBlocks;
