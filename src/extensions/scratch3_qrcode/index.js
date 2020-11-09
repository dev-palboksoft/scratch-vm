const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const Cast = require('../../util/cast.js');
const formatMessage = require('format-message');
const Video = require('../../io/video');
const StageLayering = require('../../engine/stage-layering');

const jsQR = require('jsqr'); //https://github.com/cozmo/jsQR
const encoding = require('encoding-japanese'); //https://github.com/polygonplanet/encoding.js

const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4yIiBiYXNlUHJvZmlsZT0idGlueSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiDQoJIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDBweCIgaGVpZ2h0PSI0MHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggZGlzcGxheT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTYuNCwxMS42djE2TDIwLDM0VjE3LjJMNi40LDExLjZ6IE0xNy40LDMwLjVsLTEuOC0wLjhsMC4yLTcuNWwwLDBsLTIuNCw2LjVMMTIuMSwyOGwtMi04LjYNCglsMCwwTDkuOSwyN0w4LDI2LjJsMC4zLTExLjFsMi40LDEuMWwyLjEsOS4ybDAsMGwyLjUtNy4xbDIuNCwxLjFMMTcuNCwzMC41eiBNMjAsMTcuMlYzNGwxMy42LTYuNHYtMTZMMjAsMTcuMnogTTI0LjIsMjkuM3YtMTENCglsMi0wLjl2OS4zbDQuNC0ydjEuN0wyNC4yLDI5LjN6IE0xNywxMC4yQzE3LDEwLjIsMTcuMSwxMC4yLDE3LDEwLjJjMC4xLDAuMSwwLjEsMC4xLDAuMSwwLjFMMTcsMTAuOWMtMC4xLDAtMC4yLDAtMC4yLDAuMWwwLDANCglsLTEuNy0wLjVMMTcsMTAuMnogTTE3LjQsOS44TDE3LjQsOS44TDE3LjQsOS44YzAuMSwwLDAuMSwwLDAuMSwwbDEuNC0xLjJsLTIuNSwwLjVsMC45LDAuN0gxNy40eiBNMTcuOCwxMC4ybDEuMiwxLjNsMC42LTAuNmwwLDANCgljLTAuMS0wLjEtMC4yLTAuMS0wLjItMC4ybDAsMGwwLDBMMTcuOCwxMC4yeiBNMTYuNiwxMS4yTDE2LjYsMTEuMkwxNi42LDExLjJsLTEuOC0wLjVsMC4yLDAuOWwxLjMsMC4zbDAuNC0wLjUNCglDMTYuNiwxMS4zLDE2LjYsMTEuMywxNi42LDExLjJ6IE0xNyw5LjlsLTAuOS0wLjdsLTEuMiwxLjJsMi0wLjRDMTcsMTAsMTcsOS45LDE3LDkuOXogTTIyLjEsMTAuOUwyMiwxMC4xbC0xLjQsMi40bDEuMy0xLjENCgljMC0wLjEtMC4xLTAuMS0wLjEtMC4ybDAsMGMwLTAuMSwwLjEtMC4yLDAuMi0wLjNIMjIuMXogTTIyLjUsOS44bDIuNywxLjVsLTAuNi0xLjVIMjIuNUwyMi41LDkuOHogTTIyLjUsOS42aDEuN2wtMS43LTAuOQ0KCWwtMC4yLDAuN2gwLjFDMjIuNCw5LjYsMjIuNSw5LjYsMjIuNSw5LjZ6IE0xNi45LDExLjVMMTYuNSwxMmwwLjgsMC43TDE2LjksMTEuNUwxNi45LDExLjV6IE0xNy44LDEwTDE3LjgsMTANCglDMTcuOCwxMC4xLDE3LjgsMTAuMSwxNy44LDEwbDEuNiwwLjVjMCwwLDAsMCwwLjEtMC4xYzAsMCwwLjEtMC4xLDAuMi0wLjFjLTAuMi0wLjYtMC4zLTEuMi0wLjUtMS44bC0xLjQsMS4yDQoJQzE3LjgsOS45LDE3LjgsMTAsMTcuOCwxMHogTTIyLjEsOS40bDAuMy0wLjhsLTIuNi0wLjFsMi4xLDFDMjEuOSw5LjUsMjIsOS41LDIyLjEsOS40eiBNMzMuNiwxMS42TDIwLDE3LjJMNi40LDExLjZMMjAsNg0KCUwzMy42LDExLjZ6IE0yNC4yLDEzYzAuNS0wLjQsMC45LTAuOSwxLjQtMS4zYy0wLjMtMC43LTAuNS0xLjMtMC44LTJsMCwwbDAsMGwwLDBsLTIuMS0xLjFsLTMuMy0wLjJoLTAuMUMxOC4xLDguNiwxNy4xLDguOCwxNiw5DQoJYy0wLjUsMC41LTEsMS0xLjUsMS41YzAuMSwwLjQsMC4yLDAuOCwwLjMsMS4ybDEuNSwwLjRsMS4yLDFsMi4yLDAuMWMwLDAuMSwwLjEsMC4xLDAuMSwwLjFjMC4xLDAuMSwwLjIsMC4xLDAuNCwwLjFsMCwwDQoJYzAuMSwwLDAuMSwwLDAuMiwwbDEuNywxLjNsMC4yLDAuMnYtMS4zTDI0LjIsMTN6IE0yMC42LDEzLjNsMS40LDEuMXYtMC44TDIwLjYsMTMuM0wyMC42LDEzLjN6IE0yMC42LDEyLjgNCgljMC4xLDAuMSwwLjEsMC4xLDAuMSwwLjJsMCwwYzAsMCwwLDAsMCwwLjFsMS4zLDAuMmwwLjEtMS44YzAsMCwwLDAtMC4xLDBMMjAuNiwxMi44eiBNMjIuNCwxMC45YzAuMSwwLDAuMywwLDAuNCwwLjENCglzMC4yLDAuMiwwLjIsMC4zbDAsMGwyLDAuMkwyMi4zLDEwbDAsMEwyMi40LDEwLjlMMjIuNCwxMC45eiBNMTcuNSwxMC4zTDE3LjUsMTAuM2wtMC4zLDAuNmMwLjEsMCwwLjEsMCwwLjEsMC4xDQoJYzAuMSwwLjEsMC4xLDAuMSwwLjEsMC4ybDAsMGMwLDAuMS0wLjEsMC4yLTAuMSwwLjJzLTAuMSwwLjEtMC4yLDAuMWwwLjQsMS4zbDEuMS0xLjFMMTcuNSwxMC4zeiBNMjIuOSwxMS40bC0wLjEsMC4xbDAsMGwxLjMsMS4yDQoJbDEuMS0xLjFMMjIuOSwxMS40eiBNMjIuNSwxMS42bC0wLjEsMS43bDEuNi0wLjVMMjIuNSwxMS42TDIyLjUsMTEuNnogTTE3LjgsMTIuOWwxLjgsMC4xYzAtMC4xLDAuMS0wLjEsMC4xLTAuMmwtMC44LTAuOQ0KCUwxNy44LDEyLjl6IE0xOS44LDExLjFsLTAuNywwLjZsMC45LDFsMCwwTDE5LjgsMTEuMUwxOS44LDExLjF6IE0yMC4zLDEwLjVsMS4zLTAuN2MwLDAsMCwwLDAtMC4xbDAsMFY5LjZsLTIuMi0xbDAuNSwxLjcNCglDMjAuMSwxMC40LDIwLjIsMTAuNCwyMC4zLDEwLjVMMjAuMywxMC41eiBNMjAuNSwxMC43TDIwLjUsMTAuN0wyMC41LDEwLjdjMCwwLjIsMCwwLjMtMC4xLDAuM3MtMC4xLDAuMS0wLjIsMC4xbDAuMSwxLjZsMS41LTIuNw0KCUwyMC41LDEwLjd6Ii8+DQo8cGF0aCBkaXNwbGF5PSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiNGRkZGRkYiIGQ9Ik0yMi44LDE1LjhsLTIuMSw4LjZjMCwwLDAsMC0wLjEsMGMtMC4zLDAtMC41LDAuMS0wLjYsMC40bC0yLTAuNXYtMC4xDQoJYzAtMC4yLTAuMS0wLjQtMC4zLTAuNWwyLjMtOC41YzAsMCwwLDAsMC4xLDBjMC4zLDAsMC41LTAuMSwwLjYtMC40bDEuNywwLjVsMCwwQzIyLjQsMTUuNCwyMi42LDE1LjcsMjIuOCwxNS44eiBNMzIuNywyMWwtNi41LDENCglsMCwwYy0wLjYsMC4xLTEuMi0wLjItMS41LTAuN2wtMS4yLTJsLTEuMyw0LjlsNS4xLDEuN2MwLjUsMC4yLDAuOCwwLjUsMSwxbDAsMGwyLjYsNy44YzAuMywwLjgtMC4yLDEuNy0xLDEuOQ0KCWMtMC44LDAuMy0xLjctMC4yLTEuOS0xbC0yLjMtNy4xTDE4LjQsMjZsLTIuOCw1LjZjLTAuMSwwLjMtMC40LDAuNS0wLjYsMC42bC02LjcsNC4xYy0wLjcsMC40LTEuNywwLjItMi4xLTAuNVM2LDM0LjEsNi43LDMzLjcNCglsNi40LTMuOWwzLTZsMi4xLTguMUwxNS40LDE2bC0yLjcsNS44Yy0wLjQsMC44LTEuMywxLjEtMiwwLjhjLTAuOC0wLjQtMS4xLTEuMy0wLjgtMmwzLTYuNmMwLjItMC41LDAuNy0wLjksMS4zLTFsNi4yLTAuMw0KCWMtMS4yLTAuOS0yLjEtMi40LTIuMS00LjFjMC0yLjgsMi4zLTUuMSw1LjEtNS4xczUuMSwyLjMsNS4xLDUuMXMtMi4yLDUtNC45LDUuMWwzLDUuMWw1LjUtMC44YzAuOC0wLjEsMS42LDAuNSwxLjcsMS4zDQoJQzM0LjEsMjAuMSwzMy41LDIwLjgsMzIuNywyMXogTTI2LjMsOC43YzAsMC40LDAuMywwLjcsMC43LDAuN3MwLjctMC4zLDAuNy0wLjdTMjcuNCw4LDI3LDhTMjYuMyw4LjMsMjYuMyw4Ljd6IE0zMy4zLDE5LjMNCgljMC0wLjQtMC4zLTAuNy0wLjctMC43Yy0wLjMsMC0wLjYsMC4zLTAuNywwLjZMMjYuNSwyMGMwLTAuMy0wLjMtMC42LTAuNy0wLjZoLTAuMWwtMi4yLTMuOWMwLjEtMC4xLDAuMi0wLjMsMC4yLTAuNQ0KCWMwLTAuNC0wLjMtMC43LTAuNy0wLjdjLTAuMywwLTAuNSwwLjItMC42LDAuNGwtMS43LTAuNGMwLDAsMCwwLDAtMC4xYzAtMC40LTAuMy0wLjctMC43LTAuN2MtMC4zLDAtMC42LDAuMy0wLjcsMC42aC00LjQNCgljLTAuMS0wLjItMC4zLTAuMy0wLjYtMC4zYy0wLjQsMC0wLjcsMC4zLTAuNywwLjdjMCwwLjIsMC4xLDAuNCwwLjIsMC41bC0yLjQsNS4xYy0wLjEsMC0wLjIsMC0wLjIsMGMtMC40LDAtMC43LDAuMy0wLjcsMC43DQoJczAuMywwLjcsMC43LDAuN3MwLjctMC4zLDAuNy0wLjdjMC0wLjItMC4xLTAuNC0wLjItMC41bDIuNC01LjFjMC4xLDAsMC4yLDAuMSwwLjMsMC4xYzAuNCwwLDAuNy0wLjMsMC43LTAuN2MwLDAsMCwwLDAtMC4xaDQuNA0KCWMwLjEsMC4yLDAuMiwwLjMsMC4zLDAuNGwtMi4zLDguNWgtMC4xYy0wLjQsMC0wLjcsMC4zLTAuNywwLjdjMCwwLjIsMC4xLDAuNCwwLjMsMC41TDE0LjYsMzBoLTAuMWMtMC40LDAtMC43LDAuMy0wLjcsMC43DQoJYzAsMC4xLDAsMC4yLDAuMSwwLjRsLTUuNCwzLjNDOC40LDM0LjEsOC4yLDM0LDgsMzRjLTAuNCwwLTAuNywwLjMtMC43LDAuN3MwLjMsMC43LDAuNywwLjdzMC43LTAuMywwLjctMC43YzAtMC4xLDAtMC4yLTAuMS0wLjMNCglsNS40LTMuM2MwLjEsMC4xLDAuMywwLjIsMC40LDAuMmMwLjQsMCwwLjctMC4zLDAuNy0wLjdjMC0wLjItMC4xLTAuNC0wLjMtMC42bDIuNC01LjRjMC4xLDAsMC4xLDAsMC4yLDBjMC4yLDAsMC40LTAuMSwwLjYtMC4zDQoJbDIsMC41YzAsMCwwLDAsMCwwLjFjMCwwLjQsMC4zLDAuNywwLjcsMC43YzAuMiwwLDAuNC0wLjEsMC41LTAuMmw1LjEsMS44djAuMWMwLDAuNCwwLjMsMC43LDAuNywwLjdoMC4xbDIuMSw2LjMNCgljLTAuMiwwLjEtMC40LDAuMy0wLjQsMC42YzAsMC40LDAuMywwLjcsMC43LDAuN2MwLjQsMCwwLjctMC4zLDAuNy0wLjdzLTAuMy0wLjctMC43LTAuN2MwLDAsMCwwLTAuMSwwTDI3LjIsMjgNCgljMC4yLTAuMSwwLjMtMC4zLDAuMy0wLjVjMC0wLjQtMC4zLTAuNy0wLjctMC43Yy0wLjIsMC0wLjQsMC4xLTAuNSwwLjNsLTUtMS44YzAtMC4xLDAtMC4xLDAtMC4yYzAtMC4zLTAuMS0wLjUtMC4zLTAuNmwyLjEtOC42DQoJbDAsMGMwLjEsMCwwLjIsMCwwLjIsMGwyLjIsMy44Yy0wLjIsMC4xLTAuMywwLjMtMC4zLDAuNWMwLDAuNCwwLjMsMC43LDAuNywwLjdjMC4zLDAsMC42LTAuMiwwLjYtMC41bDUuNS0wLjgNCgljMC4xLDAuMywwLjMsMC41LDAuNiwwLjVDMzMsMjAsMzMuMywxOS43LDMzLjMsMTkuM3oiLz4NCjxnIGRpc3BsYXk9Im5vbmUiPg0KCTxwYXRoIGRpc3BsYXk9ImlubGluZSIgZmlsbD0iI0FCNUQyNyIgZD0iTTIwLjQsMzUuM0wyMC40LDM1LjNjLTUuNCwwLTkuNy00LjQtOS43LTkuN1YxNC43QzEwLjYsOS40LDE1LDUsMjAuNCw1bDAsMA0KCQljNS40LDAsOS43LDQuNCw5LjcsOS43djEwLjhDMzAuMSwzMC45LDI1LjcsMzUuMywyMC40LDM1LjN6Ii8+DQoJPHBhdGggZGlzcGxheT0iaW5saW5lIiBmaWxsPSIjRjlCMDlBIiBkPSJNMjkuMiwxNi43aC0wLjFWMTVjMC00LjgtMy45LTguNy04LjctOC43cy04LjcsMy45LTguNyw4Ljd2MS43Yy0xLjEsMC4xLTIsMC45LTIuMiwyLjENCgkJYy0wLjEsMS4zLDAuOCwyLjUsMi4xLDIuNmMwLjEsMCwwLjMsMCwwLjQsMGMwLjksMy4yLDMuNSw1LjcsNi44LDYuM2MwLDAuMSwwLDAuMSwwLDAuMnYyYzAsMS4xLDAuOSwyLDIsMnMyLTAuOSwyLTJ2LTINCgkJYzAtMC4xLDAtMC4zLDAtMC40YzMtMC44LDUuMy0zLjIsNi4xLTYuMmMxLjIsMC4xLDIuMy0wLjgsMi41LTIuMUMzMS40LDE4LDMwLjUsMTYuOSwyOS4yLDE2Ljd6Ii8+DQoJPHBhdGggZGlzcGxheT0iaW5saW5lIiBmaWxsPSIjQUI1RDI3IiBkPSJNMzAuMSwxNS44YzAtMS0wLjItMy4xLTAuNS00LjFjLTEuMy0zLjktNS02LjctOS4zLTYuN2wwLDBjLTQuNiwwLTguNSwzLjItOS41LDcuNQ0KCQljLTAuMiwwLjctMC4zLDMuMy0wLjMsNGM1LjYsMC43LDExLjktMC42LDE1LjMtNC43QzI2LjQsMTQuMSwyOC42LDE1LjYsMzAuMSwxNS44eiIvPg0KCTxjaXJjbGUgZGlzcGxheT0iaW5saW5lIiBmaWxsPSIjN0YzNDFFIiBjeD0iMTYuMSIgY3k9IjE5LjIiIHI9IjEuMSIvPg0KCTxjaXJjbGUgZGlzcGxheT0iaW5saW5lIiBmaWxsPSIjN0YzNDFFIiBjeD0iMjQuNSIgY3k9IjE5LjIiIHI9IjEuMSIvPg0KCTxwYXRoIGRpc3BsYXk9ImlubGluZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTE3LjEsMjIuMWg2LjRjMCwwLTEsMS41LTMuMiwxLjVTMTcuMSwyMi4xLDE3LjEsMjIuMXoiLz4NCgk8ZWxsaXBzZSBkaXNwbGF5PSJpbmxpbmUiIGZpbGw9IiNGN0EwOEEiIGN4PSIxNS4xIiBjeT0iMjEuOSIgcng9IjEuMiIgcnk9IjEuMSIvPg0KCTxlbGxpcHNlIGRpc3BsYXk9ImlubGluZSIgZmlsbD0iI0Y3QTA4QSIgY3g9IjI1LjYiIGN5PSIyMS45IiByeD0iMS4yIiByeT0iMS4xIi8+DQoJPHBhdGggZGlzcGxheT0iaW5saW5lIiBmaWxsPSIjRkZGRkZGIiBkPSJNMTEsMzRINi42di01LjFjMC0wLjUtMC40LTAuOC0wLjgtMC44Yy0wLjUsMC0wLjgsMC40LTAuOCwwLjh2NmMwLDAuNSwwLjQsMC44LDAuOCwwLjgNCgkJSDExYzAuNSwwLDAuOC0wLjQsMC44LTAuOFMxMS40LDM0LDExLDM0eiIvPg0KCTxwYXRoIGRpc3BsYXk9ImlubGluZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTExLDQuM0g1LjhDNS40LDQuMyw1LDQuNyw1LDUuMnY2QzUsMTEuNyw1LjQsMTIsNS44LDEyYzAuNSwwLDAuOC0wLjQsMC44LTAuOFY2SDExDQoJCWMwLjUsMCwwLjgtMC40LDAuOC0wLjhTMTEuNCw0LjMsMTEsNC4zeiIvPg0KCTxwYXRoIGRpc3BsYXk9ImlubGluZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTM0LjIsNC4zSDI5Yy0wLjUsMC0wLjgsMC40LTAuOCwwLjhTMjguNiw2LDI5LDZoNC4zdjUuMWMwLDAuNSwwLjQsMC44LDAuOCwwLjgNCgkJczAuOC0wLjQsMC44LTAuOHYtNkMzNSw0LjcsMzQuNiw0LjMsMzQuMiw0LjN6Ii8+DQoJPHBhdGggZGlzcGxheT0iaW5saW5lIiBmaWxsPSIjRkZGRkZGIiBkPSJNMzQuMiwyOC4xYy0wLjUsMC0wLjgsMC40LTAuOCwwLjhWMzRIMjljLTAuNSwwLTAuOCwwLjQtMC44LDAuOHMwLjQsMC44LDAuOCwwLjhoNS4yDQoJCWMwLjUsMCwwLjgtMC40LDAuOC0wLjh2LTZDMzUsMjguNCwzNC42LDI4LjEsMzQuMiwyOC4xeiIvPg0KPC9nPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik05LjcsMzQuNGMtMi4yLDAtNC0xLjgtNC00VjkuNmMwLTIuMiwxLjgtNCw0LTRoMjAuNmMyLjIsMCw0LDEuOCw0LDR2MjAuOGMwLDIuMi0xLjgsNC00LDRIOS43eiIvPg0KCQk8cGF0aCBmaWxsPSIjMTE5MENGIiBkPSJNMzAuMyw2LjJjMS45LDAsMy40LDEuNiwzLjQsMy41djIwLjhjMCwxLjktMS41LDMuNC0zLjQsMy40SDkuN2MtMS45LDAtMy40LTEuNS0zLjQtMy40VjkuNg0KCQkJYzAtMS45LDEuNS0zLjQsMy40LTMuNEgzMC4zIE0zMC4zLDQuOUg5LjdDNy4xLDQuOSw1LDcsNSw5LjZ2MjAuOGMwLDIuNiwyLjEsNC43LDQuNyw0LjdoMjAuNmMyLjYsMCw0LjctMi4xLDQuNy00LjdWOS42DQoJCQlDMzUsNywzMi45LDQuOSwzMC4zLDQuOUwzMC4zLDQuOXoiLz4NCgk8L2c+DQoJPGc+DQoJCTxnPg0KCQkJPHBhdGggZmlsbD0iIzIzMUYyMCIgZD0iTTIyLjUsMTcuNGg1di01aC01VjE3LjR6IE0yMy4xLDEzLjFoMy43djMuN2gtMy43VjEzLjF6Ii8+DQoJCQk8cmVjdCB4PSIyMy45IiB5PSIxMy45IiBmaWxsPSIjMjMxRjIwIiB3aWR0aD0iMi4xIiBoZWlnaHQ9IjIuMSIvPg0KCQkJPHBhdGggZmlsbD0iIzIzMUYyMCIgZD0iTTEyLjUsMTcuNGg1di01aC01VjE3LjR6IE0xMy4yLDEzLjFoMy43djMuN2gtMy43VjEzLjF6Ii8+DQoJCQk8cmVjdCB4PSIxNCIgeT0iMTMuOSIgZmlsbD0iIzIzMUYyMCIgd2lkdGg9IjIuMSIgaGVpZ2h0PSIyLjEiLz4NCgkJCTxwYXRoIGZpbGw9IiMyMzFGMjAiIGQ9Ik0xNy41LDIyLjZoLTV2NWg1VjIyLjZ6IE0xNi45LDI2LjloLTMuN3YtMy43aDMuN1YyNi45eiIvPg0KCQkJPHJlY3QgeD0iMTQiIHk9IjI0IiBmaWxsPSIjMjMxRjIwIiB3aWR0aD0iMi4xIiBoZWlnaHQ9IjIuMSIvPg0KCQkJPHBhdGggZmlsbD0iIzIzMUYyMCIgZD0iTTI3LjQsMjIuNmgtNXY1aDVWMjIuNnogTTI2LjgsMjYuOWgtMy43di0zLjdoMy43VjI2Ljl6Ii8+DQoJCQk8cmVjdCB4PSIyMy45IiB5PSIyNCIgZmlsbD0iIzIzMUYyMCIgd2lkdGg9IjIuMSIgaGVpZ2h0PSIyLjEiLz4NCgkJCTxyZWN0IHg9IjIxLjEiIHk9IjEzLjkiIGZpbGw9IiMyMzFGMjAiIHdpZHRoPSIwLjciIGhlaWdodD0iMC43Ii8+DQoJCQk8cG9seWdvbiBmaWxsPSIjMjMxRjIwIiBwb2ludHM9IjE5LjcsMTQgMTkuNywxMy45IDE5LjcsMTIuNSAyMC40LDEyLjUgMjAuNCwxMy45IDIwLjQsMTQgMjAuNCwxNC42IDE5LjcsMTQuNiAJCQkiLz4NCgkJCTxyZWN0IHg9IjE4LjIiIHk9IjE0LjYiIGZpbGw9IiMyMzFGMjAiIHdpZHRoPSIwLjciIGhlaWdodD0iMS40Ii8+DQoJCQk8cmVjdCB4PSIxOC4yIiB5PSIxOC4yIiBmaWxsPSIjMjMxRjIwIiB3aWR0aD0iMC43IiBoZWlnaHQ9IjAuNyIvPg0KCQkJPHJlY3QgeD0iMTIuNSIgeT0iMTguMiIgZmlsbD0iIzIzMUYyMCIgd2lkdGg9IjAuNyIgaGVpZ2h0PSIwLjciLz4NCgkJCTxwb2x5Z29uIGZpbGw9IiMyMzFGMjAiIHBvaW50cz0iMTQsMTkuNiAxMy4zLDE5LjYgMTMuMywxOC45IDEzLjksMTguOSAxMy45LDE4LjIgMTQuNiwxOC4yIDE0LjYsMTguOSAxNCwxOC45IAkJCSIvPg0KCQkJPHJlY3QgeD0iMjIuNSIgeT0iMTguMiIgZmlsbD0iIzIzMUYyMCIgd2lkdGg9IjAuNyIgaGVpZ2h0PSIwLjciLz4NCgkJCTxwb2x5Z29uIGZpbGw9IiMyMzFGMjAiIHBvaW50cz0iMjMuOSwxOS42IDIzLjIsMTkuNiAyMy4yLDE4LjkgMjMuOSwxOC45IDIzLjksMTguMiAyNC42LDE4LjIgMjQuNiwxOC45IDIzLjksMTguOSAJCQkiLz4NCgkJCTxwb2x5Z29uIGZpbGw9IiMyMzFGMjAiIHBvaW50cz0iMjYuNywxOS42IDI0LjYsMTkuNiAyNC42LDE4LjkgMjYsMTguOSAyNiwxOC4yIDI3LjUsMTguMiAyNy41LDE4LjkgMjYuNywxOC45IAkJCSIvPg0KCQkJPHBvbHlnb24gZmlsbD0iIzIzMUYyMCIgcG9pbnRzPSIyNS4zLDIxLjEgMjQuNiwyMS4xIDIzLjksMjEuMSAyMy45LDIxLjggMjMuMiwyMS44IDIzLjIsMjEuMSAyMy45LDIxLjEgMjMuOSwyMC4zIDI0LjYsMjAuMyANCgkJCQkyNiwyMC4zIDI2LDIxLjEgMjcuNSwyMS4xIDI3LjUsMjEuOCAyNS4zLDIxLjggCQkJIi8+DQoJCQk8cG9seWdvbiBmaWxsPSIjMjMxRjIwIiBwb2ludHM9IjIyLjUsMjEuOCAyMC40LDIxLjggMjAuNCwyMS44IDE5LjcsMjEuOCAxOS43LDIwLjMgMjAuNCwyMC4zIDIwLjQsMjEuMSAyMS4xLDIxLjEgMjEuMSwyMC4zIA0KCQkJCTIzLjIsMjAuMyAyMy4yLDIxLjEgMjIuNSwyMS4xIAkJCSIvPg0KCQkJPHJlY3QgeD0iMTguMiIgeT0iMTYuOCIgZmlsbD0iIzIzMUYyMCIgd2lkdGg9IjAuNyIgaGVpZ2h0PSIwLjciLz4NCgkJCTxyZWN0IHg9IjE4LjIiIHk9IjEyLjUiIGZpbGw9IiMyMzFGMjAiIHdpZHRoPSIwLjciIGhlaWdodD0iMS41Ii8+DQoJCQk8cmVjdCB4PSIyMS4xIiB5PSIyNCIgZmlsbD0iIzIzMUYyMCIgd2lkdGg9IjAuNyIgaGVpZ2h0PSIwLjciLz4NCgkJCTxyZWN0IHg9IjE5LjciIHk9IjIyLjYiIGZpbGw9IiMyMzFGMjAiIHdpZHRoPSIwLjciIGhlaWdodD0iMS41Ii8+DQoJCQk8cG9seWdvbiBmaWxsPSIjMjMxRjIwIiBwb2ludHM9IjE5LDI2LjEgMTkuNywyNi4xIDE5LjcsMjQuNiAyMC40LDI0LjYgMjAuNCwyNy41IDE5LjgsMjcuNSAxOS44LDI3LjUgMTguOSwyNy41IDE4LjksMjcuNSANCgkJCQkxOC4yLDI3LjUgMTguMiwyNi44IDE4LjksMjYuOCAxOC45LDI2LjEgMTguMiwyNi4xIDE4LjIsMjQuNiAxOSwyNC42IAkJCSIvPg0KCQkJPHJlY3QgeD0iMjEuMSIgeT0iMjUuNCIgZmlsbD0iIzIzMUYyMCIgd2lkdGg9IjAuNyIgaGVpZ2h0PSIyLjIiLz4NCgkJCTxyZWN0IHg9IjE4LjIiIHk9IjIyLjYiIGZpbGw9IiMyMzFGMjAiIHdpZHRoPSIwLjciIGhlaWdodD0iMS41Ii8+DQoJCQk8cmVjdCB4PSIyMS4xIiB5PSIxNy41IiBmaWxsPSIjMjMxRjIwIiB3aWR0aD0iMC43IiBoZWlnaHQ9IjIuMiIvPg0KCQkJPHBvbHlnb24gZmlsbD0iIzIzMUYyMCIgcG9pbnRzPSIyMS4xLDE2LjggMjAuNCwxNi44IDIwLjQsMTkuNiAxOS43LDE5LjYgMTkuNywxNS4zIDIwLjQsMTUuMyAyMC40LDE1LjMgMjEuMSwxNS4zIAkJCSIvPg0KCQkJPHBvbHlnb24gZmlsbD0iIzIzMUYyMCIgcG9pbnRzPSIxNi44LDE5LjYgMTguOSwxOS42IDE4LjksMjAuMiAxOC45LDIwLjQgMTguOSwyMS44IDE4LjIsMjEuOCAxOC4yLDIwLjQgMTYuOCwyMC40IAkJCSIvPg0KCQkJPHBvbHlnb24gZmlsbD0iIzIzMUYyMCIgcG9pbnRzPSIxNCwyMC40IDE0LDIxLjEgMTQuNiwyMS4xIDE0LjYsMjAuNCAxNS4zLDIwLjQgMTUuMywxOS42IDE0LjYsMTkuNiAxNC42LDE4LjkgMTYuMSwxOC45IA0KCQkJCTE2LjEsMTguMiAxNy41LDE4LjIgMTcuNSwxOC45IDE2LjgsMTguOSAxNi44LDE5LjYgMTYsMTkuNiAxNiwyMC40IDE1LjMsMjAuNCAxNS4zLDIxLjEgMTYuOSwyMS4xIDE2LjksMjEuOCAxMi41LDIxLjggDQoJCQkJMTIuNSwyMS4xIDEyLjUsMjEuMSAxMi41LDIwLjQgCQkJIi8+DQoJCTwvZz4NCgkJPGc+DQoJCQk8Zz4NCgkJCQk8cGF0aCBmaWxsPSIjNDlDOEY1IiBkPSJNMzAuMSwxNC4xYzAuMiwwLDAuNC0wLjIsMC40LTAuNFY5LjljMC0wLjItMC4yLTAuNC0wLjQtMC40aC0zLjhjLTAuMiwwLTAuNCwwLjItMC40LDAuNA0KCQkJCQlzMC4yLDAuNCwwLjQsMC40aDMuNHYzLjRDMjkuNywxMy45LDI5LjksMTQuMSwzMC4xLDE0LjF6Ii8+DQoJCQk8L2c+DQoJCQk8Zz4NCgkJCQk8cGF0aCBmaWxsPSIjNDlDOEY1IiBkPSJNOS45LDE0LjFjMC4yLDAsMC40LTAuMiwwLjQtMC40di0zLjRoMy40YzAuMiwwLDAuNC0wLjIsMC40LTAuNHMtMC4yLTAuNC0wLjQtMC40SDkuOQ0KCQkJCQljLTAuMiwwLTAuNCwwLjItMC40LDAuNHYzLjhDOS41LDEzLjksOS43LDE0LjEsOS45LDE0LjF6Ii8+DQoJCQk8L2c+DQoJCQk8Zz4NCgkJCQk8cGF0aCBmaWxsPSIjNDlDOEY1IiBkPSJNMjYuNCwzMC41aDMuOGMwLjIsMCwwLjQtMC4yLDAuNC0wLjR2LTMuOGMwLTAuMi0wLjItMC40LTAuNC0wLjRjLTAuMiwwLTAuNCwwLjItMC40LDAuNHYzLjRoLTMuNA0KCQkJCQljLTAuMiwwLTAuNCwwLjItMC40LDAuNFMyNi4xLDMwLjUsMjYuNCwzMC41eiIvPg0KCQkJPC9nPg0KCQkJPGc+DQoJCQkJPHBhdGggZmlsbD0iIzQ5QzhGNSIgZD0iTTkuOSwzMC41aDMuOGMwLjIsMCwwLjQtMC4yLDAuNC0wLjRjMC0wLjItMC4yLTAuNC0wLjQtMC40aC0zLjR2LTMuNGMwLTAuMi0wLjItMC40LTAuNC0wLjQNCgkJCQkJcy0wLjQsMC4yLTAuNCwwLjR2My44QzkuNSwzMC4zLDkuNywzMC41LDkuOSwzMC41eiIvPg0KCQkJPC9nPg0KCQk8L2c+DQoJPC9nPg0KPC9nPg0KPC9zdmc+DQo=';

const Locales = ['ja', 'ja-Hira', 'en'];

const Message = {
    qrCode : {
        'ja': 'QRコード',
        'ja-Hira': 'QRコード',
        'en': 'QR code'
    },
    qrStart : {
        'ja': '[INPUT]の読み取りを始める',
        'ja-Hira': '[INPUT]のよみとりをはじめる',
        'en': 'Start scanning [INPUT]'
    },
    qrCameraInput : {
        'ja': 'カメラ',
        'ja-Hira': 'カメラ',
        'en': 'camera'
    },
    qrStageInput : {
        'ja': 'ステージ',
        'ja-Hira': 'ステージ',
        'en': 'stage'
    },
    qrStop : {
        'ja': '読み取りを止める',
        'ja-Hira': 'よみとりをとめる',
        'en': 'Stop scanning'
    },
    qrScanning : {
        'ja': '読み取り中',
        'ja-Hira': 'よみとりちゅう',
        'en': 'scanning?'
    },
    qrSetInterval : {
        'ja': '読み取りの間隔を[INTERVAL]秒にする',
        'ja-Hira': 'よみとりのかんかくを[INTERVAL]びょうにする',
        'en': 'set scan interval [INTERVAL] sec'
    },
    qrData : {
        'ja': '読み取り結果',
        'ja-Hira': 'よみとりけっか',
        'en': 'data'
    },
    qrASCII : {
        'ja': '読み取り結果の[INDEX]番目の文字のASCIIコード',
        'ja-Hira': 'よみとりけっかの[INDEX]ばんめのもじのASCIIコード',
        'en': 'letter [INDEX] ASCII code of data'
    },
    qrReset : {
        'ja': '読み取り結果を消す',
        'ja-Hira': 'よみとりけっかをけす',
        'en': 'reset data'
    },
    qrSetCameraTransparency : {
        'ja': 'カメラの透明度を[TRANSPARENCY]にする',
        'ja-Hira': 'カメラのとうめいどを[TRANSPARENCY]にする',
        'en': 'set camera transparency to [TRANSPARENCY]'
    }
};

const DefaultInterval = 300;

const DefaultStageWidth = 480;
const DefaultStageHeight = 360;

const MakerAttributes = {
    color4f: [0.9, 0.6, 0.2, 0.7],
    diameter: 5
};

const Mode = {
    CAMERA: 1,
    STAGE: 2
};

class Scratch3QRCodeBlocks {
    constructor (runtime) {
        this.runtime = runtime;
        this.locale = this._getViewerLanguageCode();
        this._canvas = document.querySelector('canvas');
        this._scanning = false;
        this._mode = null;
        this._interval = DefaultInterval;
        this._data = '';
        this._binaryData = null;

        this.runtime.on('PROJECT_STOP_ALL', this.qrStop.bind(this));

        this._penSkinId = this.runtime.renderer.createPenSkin();
        const penDrawableId = this.runtime.renderer.createDrawable(StageLayering.SPRITE_LAYER);
        this.runtime.renderer.updateDrawableProperties(penDrawableId, {skinId: this._penSkinId});
    }

    getInfo () {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            stage.videoTransparency = 0;
        }

        this.locale = this._getViewerLanguageCode();
        return {
            id: 'qrcode',
            name: Message.qrCode[this.locale],
            blockIconURI: blockIconURI,
            //docsURI: 'https://',
            blocks: [
                {
                    opcode: 'qrStart',
                    text: Message.qrStart[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        INPUT: {
                            type: ArgumentType.STRING,
                            menu: 'inputMenu',
                            defaultValue: Message.qrCameraInput[this.locale]
                        }
                    }
                },
                {
                    opcode: 'qrStop',
                    text: Message.qrStop[this.locale],
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'qrSetInterval',
                    text: Message.qrSetInterval[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        INTERVAL: {
                            type: ArgumentType.NUMBER,
                            menu: 'intervalMenu',
                            defaultValue: 0.3
                        }
                    }
                },
                {
                    opcode: 'qrScanning',
                    text: Message.qrScanning[this.locale],
                    blockType: BlockType.BOOLEAN
                },
                '---',
                {
                    opcode: 'qrData',
                    text: Message.qrData[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'qrASCII',
                    text: Message.qrASCII[this.locale],
                    blockType: BlockType.REPORTER,
                    arguments: {
                        INDEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'qrReset',
                    text: Message.qrReset[this.locale],
                    blockType: BlockType.COMMAND
                },
                '---',
                {
                    opcode: 'qrSetCameraTransparency',
                    text: Message.qrSetCameraTransparency[this.locale],
                    arguments: {
                        TRANSPARENCY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                }
            ],
            menus: {
                inputMenu: {
                    acceptReporters: false,
                    items: [Message.qrCameraInput[this.locale], Message.qrStageInput[this.locale]]
                },
                intervalMenu: {
                    acceptReporters: false,
                    items: ['0.3', '0.5', '1']
                }
            }
        }
    };

    _getViewerLanguageCode () {
        const locale = formatMessage.setup().locale;
        if (Locales.includes(locale)) {
            return locale;
        }
        return 'en';
    }

    _scan(){
        if(!this._scanning ||  (this._mode == Mode.CAMERA && !this.runtime.ioDevices.video.videoReady)){
            this._scanning = false;
            this._clearMark();
            return;
        }

        let frame = null;
        let width, height;
        if(this._mode == Mode.CAMERA){
            frame = this.runtime.ioDevices.video.getFrame({
                format: Video.FORMAT_IMAGE_DATA,
                dimensions: Video.DIMENSIONS
            }).data;
            width = DefaultStageWidth;
            height = DefaultStageHeight;
        } else if (this._mode == Mode.STAGE){
            const webgl = this.runtime.renderer.gl;
            frame = new Uint8Array(webgl.drawingBufferWidth * webgl.drawingBufferHeight * 4);
            webgl.readPixels(0, 0, webgl.drawingBufferWidth, webgl.drawingBufferHeight, webgl.RGBA, webgl.UNSIGNED_BYTE, frame);
            width = webgl.drawingBufferWidth;
            height = webgl.drawingBufferHeight;
        }

        const code = jsQR(frame, width, height, {
            inversionAttempts: 'dontInvert',
        });

        this._clearMark();
        if(code){
            const delimiter = code.binaryData.indexOf(0); //NULL index
            if(delimiter != -1){
                code.binaryData = code.binaryData.slice(0, delimiter);
            }
            this._data = this._decodeBinaryData(code.binaryData);
            this._binaryData = code.binaryData;
            this._drawMark(code.location, width, height);
        }
        setTimeout(this._scan.bind(this), this._interval);
    }

    _drawMark(location, width, height){
        let widthScale = DefaultStageWidth / width;
        let heightScale = DefaultStageHeight / height;

        location.topLeftCorner.x = location.topLeftCorner.x * widthScale - width / 2 * widthScale;
        location.topRightCorner.x = location.topRightCorner.x * widthScale - width / 2 * widthScale;
        location.bottomRightCorner.x = location.bottomRightCorner.x * widthScale - width / 2 * widthScale;
        location.bottomLeftCorner.x = location.bottomLeftCorner.x * widthScale - width / 2 * widthScale;

        if(this._mode == Mode.CAMERA){
            location.topLeftCorner.y = height / 2 * heightScale - location.topLeftCorner.y * heightScale;
            location.topRightCorner.y = height / 2 * heightScale - location.topRightCorner.y * heightScale;
            location.bottomRightCorner.y = height / 2 * heightScale - location.bottomRightCorner.y * heightScale;
            location.bottomLeftCorner.y = height / 2 * heightScale - location.bottomLeftCorner.y * heightScale;
        } else if (this._mode == Mode.STAGE){
            location.topLeftCorner.y = location.topLeftCorner.y * heightScale - height / 2 * heightScale;
            location.topRightCorner.y = location.topRightCorner.y * heightScale - height / 2 * heightScale;
            location.bottomRightCorner.y = location.bottomRightCorner.y * heightScale - height / 2 * heightScale;
            location.bottomLeftCorner.y = location.bottomLeftCorner.y * heightScale - height / 2 * heightScale;
        }

        this.runtime.renderer.penLine(this._penSkinId, MakerAttributes, location.topLeftCorner.x, location.topLeftCorner.y, location.topRightCorner.x, location.topRightCorner.y);
        this.runtime.renderer.penLine(this._penSkinId, MakerAttributes, location.topRightCorner.x, location.topRightCorner.y, location.bottomRightCorner.x, location.bottomRightCorner.y);
        this.runtime.renderer.penLine(this._penSkinId, MakerAttributes, location.bottomRightCorner.x, location.bottomRightCorner.y, location.bottomLeftCorner.x, location.bottomLeftCorner.y);
        this.runtime.renderer.penLine(this._penSkinId, MakerAttributes, location.bottomLeftCorner.x, location.bottomLeftCorner.y, location.topLeftCorner.x, location.topLeftCorner.y);
    }

    _clearMark(){
        this.runtime.renderer.penClear(this._penSkinId);
    }

    _decodeBinaryData(binaryData){
        let encode = encoding.detect(binaryData);
        if(encode == 'UTF16'){
            return  new TextDecoder('utf-16').decode(Uint16Array.from(binaryData).buffer);
        }else{
            try{
                return new TextDecoder(encode).decode(Uint8Array.from(binaryData).buffer);
            }catch (e) {
                return '';
            }
        }
    }

    _getGlobalVideoTransparency () {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            return stage.videoTransparency;
        }
        return 0;
    }

    qrStart(args, util) {
        if(args.INPUT == Message.qrCameraInput[this.locale]){
            this._mode = Mode.CAMERA;
        } else if (args.INPUT == Message.qrStageInput[this.locale]){
            this._mode = Mode.STAGE;
        }

        if(this._scanning || (this._mode == Mode.CAMERA && !this.runtime.ioDevices)){
            return;
        }

        if(this._mode == Mode.CAMERA){
            this.runtime.ioDevices.video.setPreviewGhost(this._getGlobalVideoTransparency());
            this.runtime.ioDevices.video.mirror = false;
            this.runtime.ioDevices.video.enableVideo();
            if(this.runtime.ioDevices.video.videoReady){
                this._scanning = true;
                this._scan();
            }else{
                setTimeout(this.qrStart.bind(this, args, util), 500);
            }
        } else if (this._mode == Mode.STAGE){
            this._scanning = true;
            this._scan();
        }
    }

    qrStop(args, util) {
        if(!this._scanning){
            return;
        }

        this.runtime.ioDevices.video.disableVideo();
        this._clearMark();
        this._scanning = false;
    }

    qrSetInterval(args, util){
        this._interval = args.INTERVAL * 1000;
    }

    qrScanning(args, util){
        return this._scanning;
    }

    qrData(args, util) {
        return this._data;
    }

    qrASCII(args, util) {
        if(this._data.length == 0 || this._binaryData.length == 0){
            return 0;
        }
        const index = Cast.toNumber(args.INDEX) - 1;
        if (index < 0 || index >= this._data.length) {
            return 0;
        }

        const encoder = new TextEncoder();
        const codes = encoder.encode(this._data.charAt(index));
        if(codes.length != 1 && codes[0] > 127){
            return 0;
        }
        return codes[0];
    }

    qrReset(args, util) {
        this._data = '';
        this._binaryData = null;
    }

    qrSetCameraTransparency(args, util) {
        const transparency = Cast.toNumber(args.TRANSPARENCY);
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            stage.videoTransparency = transparency;
        }
        this.runtime.ioDevices.video.setPreviewGhost(transparency);
    }
}

module.exports = Scratch3QRCodeBlocks;
