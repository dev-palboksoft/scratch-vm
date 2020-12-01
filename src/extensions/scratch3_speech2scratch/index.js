const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const Cast = require('../../util/cast');
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4yIiBiYXNlUHJvZmlsZT0idGlueSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiDQoJIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDBweCIgaGVpZ2h0PSI0MHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggZGlzcGxheT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTYuNCwxMS42djE2TDIwLDM0VjE3LjJMNi40LDExLjZ6IE0xNy40LDMwLjVsLTEuOC0wLjhsMC4yLTcuNWwwLDBsLTIuNCw2LjVMMTIuMSwyOGwtMi04LjYNCglsMCwwTDkuOSwyN0w4LDI2LjJsMC4zLTExLjFsMi40LDEuMWwyLjEsOS4ybDAsMGwyLjUtNy4xbDIuNCwxLjFMMTcuNCwzMC41eiBNMjAsMTcuMlYzNGwxMy42LTYuNHYtMTZMMjAsMTcuMnogTTI0LjIsMjkuM2wwLTExDQoJbDItMC45bDAsOS4zbDQuNC0ybDAsMS43TDI0LjIsMjkuM3ogTTE3LDEwLjJDMTcsMTAuMiwxNy4xLDEwLjIsMTcsMTAuMmMwLjEsMC4xLDAuMSwwLjEsMC4xLDAuMUwxNywxMC45Yy0wLjEsMC0wLjIsMC0wLjIsMC4xDQoJYzAsMCwwLDAsMCwwbC0xLjctMC41TDE3LDEwLjJ6IE0xNy40LDkuOEwxNy40LDkuOEwxNy40LDkuOGMwLjEsMCwwLjEsMCwwLjEsMGwxLjQtMS4ybC0yLjUsMC41bDAuOSwwLjcNCglDMTcuMyw5LjgsMTcuNCw5LjgsMTcuNCw5Ljh6IE0xNy44LDEwLjJsMS4yLDEuM2wwLjYtMC42bDAsMGMtMC4xLTAuMS0wLjItMC4xLTAuMi0wLjJjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBMMTcuOCwxMC4yeg0KCSBNMTYuNiwxMS4yQzE2LjYsMTEuMiwxNi42LDExLjIsMTYuNiwxMS4yQzE2LjYsMTEuMiwxNi42LDExLjIsMTYuNiwxMS4ybC0xLjgtMC41bDAuMiwwLjlsMS4zLDAuM2wwLjQtMC41DQoJQzE2LjYsMTEuMywxNi42LDExLjMsMTYuNiwxMS4yeiBNMTcsOS45bC0wLjktMC43bC0xLjIsMS4ybDItMC40QzE3LDEwLDE3LDkuOSwxNyw5Ljl6IE0yMi4xLDEwLjlMMjIsMTAuMWwtMS40LDIuNGwxLjMtMS4xDQoJYzAtMC4xLTAuMS0wLjEtMC4xLTAuMmMwLDAsMCwwLDAsMGMwLTAuMSwwLjEtMC4yLDAuMi0wLjNDMjIsMTAuOSwyMi4xLDEwLjksMjIuMSwxMC45eiBNMjIuNSw5LjhsMi43LDEuNWwtMC42LTEuNUwyMi41LDkuOA0KCUMyMi41LDkuOCwyMi41LDkuOCwyMi41LDkuOHogTTIyLjUsOS42bDEuNywwbC0xLjctMC45bC0wLjIsMC43YzAsMCwwLjEsMCwwLjEsMEMyMi40LDkuNiwyMi41LDkuNiwyMi41LDkuNnogTTE2LjksMTEuNUwxNi41LDEyDQoJbDAuOCwwLjdMMTYuOSwxMS41QzE2LjksMTEuNSwxNi45LDExLjUsMTYuOSwxMS41eiBNMTcuOCwxMEMxNy44LDEwLDE3LjgsMTAsMTcuOCwxMEMxNy44LDEwLjEsMTcuOCwxMC4xLDE3LjgsMTBsMS42LDAuNQ0KCWMwLDAsMCwwLDAuMS0wLjFjMCwwLDAuMS0wLjEsMC4yLTAuMWMtMC4yLTAuNi0wLjMtMS4yLTAuNS0xLjhsLTEuNCwxLjJDMTcuOCw5LjksMTcuOCwxMCwxNy44LDEweiBNMjIuMSw5LjRsMC4zLTAuOGwtMi42LTAuMQ0KCWwyLjEsMUMyMS45LDkuNSwyMiw5LjUsMjIuMSw5LjR6IE0zMy42LDExLjZMMjAsMTcuMkw2LjQsMTEuNkwyMCw2TDMzLjYsMTEuNnogTTI0LjIsMTNjMC41LTAuNCwwLjktMC45LDEuNC0xLjMNCgljLTAuMy0wLjctMC41LTEuMy0wLjgtMmwwLDBsMCwwbDAsMGwtMi4xLTEuMWwtMy4zLTAuMmwtMC4xLDBDMTguMSw4LjYsMTcuMSw4LjgsMTYsOWMtMC41LDAuNS0xLDEtMS41LDEuNQ0KCWMwLjEsMC40LDAuMiwwLjgsMC4zLDEuMmwxLjUsMC40bDEuMiwxbDIuMiwwLjFjMCwwLjEsMC4xLDAuMSwwLjEsMC4xYzAuMSwwLjEsMC4yLDAuMSwwLjQsMC4xYzAsMCwwLDAsMCwwYzAuMSwwLDAuMSwwLDAuMiwwDQoJbDEuNywxLjNsMC4yLDAuMmwwLTEuM0wyNC4yLDEzeiBNMjAuNiwxMy4zbDEuNCwxLjFsMC0wLjhMMjAuNiwxMy4zQzIwLjYsMTMuMywyMC42LDEzLjMsMjAuNiwxMy4zeiBNMjAuNiwxMi44DQoJYzAuMSwwLjEsMC4xLDAuMSwwLjEsMC4yYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwLjFsMS4zLDAuMmwwLjEtMS44YzAsMCwwLDAtMC4xLDBMMjAuNiwxMi44eiBNMjIuNCwxMC45YzAuMSwwLDAuMywwLDAuNCwwLjENCgljMC4xLDAuMSwwLjIsMC4yLDAuMiwwLjN2MGwyLDAuMkwyMi4zLDEwYzAsMCwwLDAsMCwwTDIyLjQsMTAuOUwyMi40LDEwLjl6IE0xNy41LDEwLjNDMTcuNSwxMC4zLDE3LjUsMTAuMywxNy41LDEwLjNsLTAuMywwLjYNCgljMC4xLDAsMC4xLDAsMC4xLDAuMWMwLjEsMC4xLDAuMSwwLjEsMC4xLDAuMmMwLDAsMCwwLDAsMGMwLDAuMS0wLjEsMC4yLTAuMSwwLjJjMCwwLTAuMSwwLjEtMC4yLDAuMWwwLjQsMS4zbDEuMS0xLjFMMTcuNSwxMC4zeg0KCSBNMjIuOSwxMS40YzAsMC0wLjEsMC4xLTAuMSwwLjFsMCwwbDEuMywxLjJsMS4xLTEuMUwyMi45LDExLjR6IE0yMi41LDExLjZsLTAuMSwxLjdsMS42LTAuNUwyMi41LDExLjYNCglDMjIuNSwxMS42LDIyLjUsMTEuNiwyMi41LDExLjZ6IE0xNy44LDEyLjlsMS44LDAuMWMwLTAuMSwwLjEtMC4xLDAuMS0wLjJsLTAuOC0wLjlMMTcuOCwxMi45eiBNMTkuOCwxMS4xbC0wLjcsMC42bDAuOSwxbDAsMA0KCUwxOS44LDExLjFDMTkuOCwxMS4xLDE5LjgsMTEuMSwxOS44LDExLjF6IE0yMC4zLDEwLjVsMS4zLTAuN2MwLDAsMCwwLDAtMC4xYzAsMCwwLDAsMCwwYzAsMCwwLTAuMSwwLTAuMWwtMi4yLTFsMC41LDEuNw0KCUMyMC4xLDEwLjQsMjAuMiwxMC40LDIwLjMsMTAuNUMyMC4zLDEwLjUsMjAuMywxMC41LDIwLjMsMTAuNXogTTIwLjUsMTAuN0MyMC41LDEwLjcsMjAuNSwxMC43LDIwLjUsMTAuNw0KCUMyMC41LDEwLjcsMjAuNSwxMC43LDIwLjUsMTAuN2MwLDAuMiwwLDAuMy0wLjEsMC4zYy0wLjEsMC0wLjEsMC4xLTAuMiwwLjFsMC4xLDEuNmwxLjUtMi43TDIwLjUsMTAuN3oiLz4NCjxwYXRoIGRpc3BsYXk9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iI0ZGRkZGRiIgZD0iTTIyLjgsMTUuOGwtMi4xLDguNmMwLDAsMCwwLTAuMSwwYy0wLjMsMC0wLjUsMC4xLTAuNiwwLjRsLTItMC41DQoJYzAsMCwwLTAuMSwwLTAuMWMwLTAuMi0wLjEtMC40LTAuMy0wLjVsMi4zLTguNWMwLDAsMCwwLDAuMSwwYzAuMywwLDAuNS0wLjEsMC42LTAuNGwxLjcsMC41YzAsMCwwLDAsMCwwDQoJQzIyLjQsMTUuNCwyMi42LDE1LjcsMjIuOCwxNS44eiBNMzIuNywyMWwtNi41LDFsMCwwYy0wLjYsMC4xLTEuMi0wLjItMS41LTAuN2wtMS4yLTJsLTEuMyw0LjlsNS4xLDEuN2MwLjUsMC4yLDAuOCwwLjUsMSwxbDAsMA0KCWwyLjYsNy44YzAuMywwLjgtMC4yLDEuNy0xLDEuOWMtMC44LDAuMy0xLjctMC4yLTEuOS0xbC0yLjMtNy4xTDE4LjQsMjZsLTIuOCw1LjZjLTAuMSwwLjMtMC40LDAuNS0wLjYsMC42bC02LjcsNC4xDQoJYy0wLjcsMC40LTEuNywwLjItMi4xLTAuNWMtMC40LTAuNy0wLjItMS43LDAuNS0yLjFsNi40LTMuOWwzLTZsMi4xLTguMUwxNS40LDE2bC0yLjcsNS44Yy0wLjQsMC44LTEuMywxLjEtMiwwLjgNCgljLTAuOC0wLjQtMS4xLTEuMy0wLjgtMmwzLTYuNmMwLjItMC41LDAuNy0wLjksMS4zLTFsNi4yLTAuM2MtMS4yLTAuOS0yLjEtMi40LTIuMS00LjFjMC0yLjgsMi4zLTUuMSw1LjEtNS4xczUuMSwyLjMsNS4xLDUuMQ0KCWMwLDIuOC0yLjIsNS00LjksNS4xbDMsNS4xbDUuNS0wLjhjMC44LTAuMSwxLjYsMC41LDEuNywxLjNDMzQuMSwyMC4xLDMzLjUsMjAuOCwzMi43LDIxeiBNMjYuMyw4LjdjMCwwLjQsMC4zLDAuNywwLjcsMC43DQoJczAuNy0wLjMsMC43LTAuN1MyNy40LDgsMjcsOFMyNi4zLDguMywyNi4zLDguN3ogTTMzLjMsMTkuM2MwLTAuNC0wLjMtMC43LTAuNy0wLjdjLTAuMywwLTAuNiwwLjMtMC43LDAuNmwtNS40LDAuOA0KCWMwLTAuMy0wLjMtMC42LTAuNy0wLjZjMCwwLTAuMSwwLTAuMSwwbC0yLjItMy45YzAuMS0wLjEsMC4yLTAuMywwLjItMC41YzAtMC40LTAuMy0wLjctMC43LTAuN2MtMC4zLDAtMC41LDAuMi0wLjYsMC40bC0xLjctMC40DQoJYzAsMCwwLDAsMC0wLjFjMC0wLjQtMC4zLTAuNy0wLjctMC43Yy0wLjMsMC0wLjYsMC4zLTAuNywwLjZsLTQuNCwwYy0wLjEtMC4yLTAuMy0wLjMtMC42LTAuM2MtMC40LDAtMC43LDAuMy0wLjcsMC43DQoJYzAsMC4yLDAuMSwwLjQsMC4yLDAuNWwtMi40LDUuMWMtMC4xLDAtMC4yLDAtMC4yLDBjLTAuNCwwLTAuNywwLjMtMC43LDAuN3MwLjMsMC43LDAuNywwLjdjMC40LDAsMC43LTAuMywwLjctMC43DQoJYzAtMC4yLTAuMS0wLjQtMC4yLTAuNWwyLjQtNS4xYzAuMSwwLDAuMiwwLjEsMC4zLDAuMWMwLjQsMCwwLjctMC4zLDAuNy0wLjdjMCwwLDAsMCwwLTAuMWw0LjQsMGMwLjEsMC4yLDAuMiwwLjMsMC4zLDAuNGwtMi4zLDguNQ0KCWMwLDAtMC4xLDAtMC4xLDBjLTAuNCwwLTAuNywwLjMtMC43LDAuN2MwLDAuMiwwLjEsMC40LDAuMywwLjVMMTQuNiwzMGMwLDAtMC4xLDAtMC4xLDBjLTAuNCwwLTAuNywwLjMtMC43LDAuNw0KCWMwLDAuMSwwLDAuMiwwLjEsMC40bC01LjQsMy4zQzguNCwzNC4xLDguMiwzNCw4LDM0Yy0wLjQsMC0wLjcsMC4zLTAuNywwLjdzMC4zLDAuNywwLjcsMC43YzAuNCwwLDAuNy0wLjMsMC43LTAuNw0KCWMwLTAuMSwwLTAuMi0wLjEtMC4zbDUuNC0zLjNjMC4xLDAuMSwwLjMsMC4yLDAuNCwwLjJjMC40LDAsMC43LTAuMywwLjctMC43YzAtMC4yLTAuMS0wLjQtMC4zLTAuNmwyLjQtNS40YzAuMSwwLDAuMSwwLDAuMiwwDQoJYzAuMiwwLDAuNC0wLjEsMC42LTAuM2wyLDAuNWMwLDAsMCwwLDAsMC4xYzAsMC40LDAuMywwLjcsMC43LDAuN2MwLjIsMCwwLjQtMC4xLDAuNS0wLjJsNS4xLDEuOGMwLDAsMCwwLjEsMCwwLjENCgljMCwwLjQsMC4zLDAuNywwLjcsMC43YzAsMCwwLjEsMCwwLjEsMGwyLjEsNi4zYy0wLjIsMC4xLTAuNCwwLjMtMC40LDAuNmMwLDAuNCwwLjMsMC43LDAuNywwLjdjMC40LDAsMC43LTAuMywwLjctMC43DQoJcy0wLjMtMC43LTAuNy0wLjdjMCwwLDAsMC0wLjEsMEwyNy4yLDI4YzAuMi0wLjEsMC4zLTAuMywwLjMtMC41YzAtMC40LTAuMy0wLjctMC43LTAuN2MtMC4yLDAtMC40LDAuMS0wLjUsMC4zbC01LTEuOA0KCWMwLTAuMSwwLTAuMSwwLTAuMmMwLTAuMy0wLjEtMC41LTAuMy0wLjZsMi4xLTguNmMwLDAsMCwwLDAsMGMwLjEsMCwwLjIsMCwwLjIsMGwyLjIsMy44Yy0wLjIsMC4xLTAuMywwLjMtMC4zLDAuNQ0KCWMwLDAuNCwwLjMsMC43LDAuNywwLjdjMC4zLDAsMC42LTAuMiwwLjYtMC41bDUuNS0wLjhjMC4xLDAuMywwLjMsMC41LDAuNiwwLjVDMzMsMjAsMzMuMywxOS43LDMzLjMsMTkuM3oiLz4NCjxnIGRpc3BsYXk9Im5vbmUiPg0KCTxwYXRoIGRpc3BsYXk9ImlubGluZSIgZmlsbD0iI0FCNUQyNyIgZD0iTTIwLjQsMzUuM0wyMC40LDM1LjNjLTUuNCwwLTkuNy00LjQtOS43LTkuN1YxNC43QzEwLjYsOS40LDE1LDUsMjAuNCw1aDANCgkJYzUuNCwwLDkuNyw0LjQsOS43LDkuN3YxMC44QzMwLjEsMzAuOSwyNS43LDM1LjMsMjAuNCwzNS4zeiIvPg0KCTxwYXRoIGRpc3BsYXk9ImlubGluZSIgZmlsbD0iI0Y5QjA5QSIgZD0iTTI5LjIsMTYuN2MwLDAtMC4xLDAtMC4xLDBWMTVjMC00LjgtMy45LTguNy04LjctOC43cy04LjcsMy45LTguNyw4Ljd2MS43DQoJCWMtMS4xLDAuMS0yLDAuOS0yLjIsMi4xYy0wLjEsMS4zLDAuOCwyLjUsMi4xLDIuNmMwLjEsMCwwLjMsMCwwLjQsMGMwLjksMy4yLDMuNSw1LjcsNi44LDYuM2MwLDAuMSwwLDAuMSwwLDAuMnYyYzAsMS4xLDAuOSwyLDIsMg0KCQljMS4xLDAsMi0wLjksMi0ydi0yYzAtMC4xLDAtMC4zLDAtMC40YzMtMC44LDUuMy0zLjIsNi4xLTYuMmMxLjIsMC4xLDIuMy0wLjgsMi41LTIuMUMzMS40LDE4LDMwLjUsMTYuOSwyOS4yLDE2Ljd6Ii8+DQoJPHBhdGggZGlzcGxheT0iaW5saW5lIiBmaWxsPSIjQUI1RDI3IiBkPSJNMzAuMSwxNS44YzAtMS0wLjItMy4xLTAuNS00LjFjLTEuMy0zLjktNS02LjctOS4zLTYuN2gwYy00LjYsMC04LjUsMy4yLTkuNSw3LjUNCgkJYy0wLjIsMC43LTAuMywzLjMtMC4zLDRjNS42LDAuNywxMS45LTAuNiwxNS4zLTQuN0MyNi40LDE0LjEsMjguNiwxNS42LDMwLjEsMTUuOHoiLz4NCgk8Y2lyY2xlIGRpc3BsYXk9ImlubGluZSIgZmlsbD0iIzdGMzQxRSIgY3g9IjE2LjEiIGN5PSIxOS4yIiByPSIxLjEiLz4NCgk8Y2lyY2xlIGRpc3BsYXk9ImlubGluZSIgZmlsbD0iIzdGMzQxRSIgY3g9IjI0LjUiIGN5PSIxOS4yIiByPSIxLjEiLz4NCgk8cGF0aCBkaXNwbGF5PSJpbmxpbmUiIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xNy4xLDIyLjFoNi40YzAsMC0xLDEuNS0zLjIsMS41UzE3LjEsMjIuMSwxNy4xLDIyLjF6Ii8+DQoJPGVsbGlwc2UgZGlzcGxheT0iaW5saW5lIiBmaWxsPSIjRjdBMDhBIiBjeD0iMTUuMSIgY3k9IjIxLjkiIHJ4PSIxLjIiIHJ5PSIxLjEiLz4NCgk8ZWxsaXBzZSBkaXNwbGF5PSJpbmxpbmUiIGZpbGw9IiNGN0EwOEEiIGN4PSIyNS42IiBjeT0iMjEuOSIgcng9IjEuMiIgcnk9IjEuMSIvPg0KCTxwYXRoIGRpc3BsYXk9ImlubGluZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTExLDM0SDYuNnYtNS4xYzAtMC41LTAuNC0wLjgtMC44LTAuOGMtMC41LDAtMC44LDAuNC0wLjgsMC44djZjMCwwLjUsMC40LDAuOCwwLjgsMC44DQoJCUgxMWMwLjUsMCwwLjgtMC40LDAuOC0wLjhTMTEuNCwzNCwxMSwzNHoiLz4NCgk8cGF0aCBkaXNwbGF5PSJpbmxpbmUiIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xMSw0LjNINS44QzUuNCw0LjMsNSw0LjcsNSw1LjJ2NmMwLDAuNSwwLjQsMC44LDAuOCwwLjhjMC41LDAsMC44LTAuNCwwLjgtMC44VjZIMTENCgkJYzAuNSwwLDAuOC0wLjQsMC44LTAuOFMxMS40LDQuMywxMSw0LjN6Ii8+DQoJPHBhdGggZGlzcGxheT0iaW5saW5lIiBmaWxsPSIjRkZGRkZGIiBkPSJNMzQuMiw0LjNIMjljLTAuNSwwLTAuOCwwLjQtMC44LDAuOFMyOC42LDYsMjksNmg0LjN2NS4xYzAsMC41LDAuNCwwLjgsMC44LDAuOA0KCQlzMC44LTAuNCwwLjgtMC44di02QzM1LDQuNywzNC42LDQuMywzNC4yLDQuM3oiLz4NCgk8cGF0aCBkaXNwbGF5PSJpbmxpbmUiIGZpbGw9IiNGRkZGRkYiIGQ9Ik0zNC4yLDI4LjFjLTAuNSwwLTAuOCwwLjQtMC44LDAuOFYzNEgyOWMtMC41LDAtMC44LDAuNC0wLjgsMC44czAuNCwwLjgsMC44LDAuOGg1LjINCgkJYzAuNSwwLDAuOC0wLjQsMC44LTAuOHYtNkMzNSwyOC40LDM0LjYsMjguMSwzNC4yLDI4LjF6Ii8+DQo8L2c+DQo8ZyBkaXNwbGF5PSJub25lIj4NCgk8ZyBkaXNwbGF5PSJpbmxpbmUiPg0KCQk8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNOS43LDM0LjRjLTIuMiwwLTQtMS44LTQtNFY5LjZjMC0yLjIsMS44LTQsNC00aDIwLjZjMi4yLDAsNCwxLjgsNCw0djIwLjhjMCwyLjItMS44LDQtNCw0SDkuN3oiLz4NCgkJPHBhdGggZmlsbD0iIzExOTBDRiIgZD0iTTMwLjMsNi4zYzEuOSwwLDMuNCwxLjUsMy40LDMuNHYyMC44YzAsMS45LTEuNSwzLjQtMy40LDMuNEg5LjdjLTEuOSwwLTMuNC0xLjUtMy40LTMuNFY5LjYNCgkJCWMwLTEuOSwxLjUtMy40LDMuNC0zLjRIMzAuMyBNMzAuMyw0LjlIOS43QzcuMSw0LjksNSw3LDUsOS42djIwLjhjMCwyLjYsMi4xLDQuNyw0LjcsNC43aDIwLjZjMi42LDAsNC43LTIuMSw0LjctNC43VjkuNg0KCQkJQzM1LDcsMzIuOSw0LjksMzAuMyw0LjlMMzAuMyw0Ljl6Ii8+DQoJPC9nPg0KCTxnIGRpc3BsYXk9ImlubGluZSI+DQoJCTxnPg0KCQkJPHBhdGggZmlsbD0iIzIzMUYyMCIgZD0iTTIyLjUsMTcuNGw1LDBsMC01bC01LDBMMjIuNSwxNy40eiBNMjMuMSwxMy4xbDMuNywwbDAsMy43bC0zLjcsMEwyMy4xLDEzLjF6Ii8+DQoJCQk8cmVjdCB4PSIyMy45IiB5PSIxMy45IiBmaWxsPSIjMjMxRjIwIiB3aWR0aD0iMi4xIiBoZWlnaHQ9IjIuMSIvPg0KCQkJPHBhdGggZmlsbD0iIzIzMUYyMCIgZD0iTTEyLjUsMTcuNGw1LDBsMC01bC01LDBMMTIuNSwxNy40eiBNMTMuMiwxMy4xbDMuNywwbDAsMy43bC0zLjcsMEwxMy4yLDEzLjF6Ii8+DQoJCQk8cmVjdCB4PSIxNCIgeT0iMTMuOSIgZmlsbD0iIzIzMUYyMCIgd2lkdGg9IjIuMSIgaGVpZ2h0PSIyLjEiLz4NCgkJCTxwYXRoIGZpbGw9IiMyMzFGMjAiIGQ9Ik0xNy41LDIyLjZsLTUsMGwwLDVsNSwwTDE3LjUsMjIuNnogTTE2LjksMjYuOWwtMy43LDBsMC0zLjdsMy43LDBMMTYuOSwyNi45eiIvPg0KCQkJPHJlY3QgeD0iMTQiIHk9IjI0IiBmaWxsPSIjMjMxRjIwIiB3aWR0aD0iMi4xIiBoZWlnaHQ9IjIuMSIvPg0KCQkJPHBhdGggZmlsbD0iIzIzMUYyMCIgZD0iTTI3LjQsMjIuNmwtNSwwbDAsNWw1LDBMMjcuNCwyMi42eiBNMjYuOCwyNi45bC0zLjcsMGwwLTMuN2wzLjcsMEwyNi44LDI2Ljl6Ii8+DQoJCQk8cmVjdCB4PSIyMy45IiB5PSIyNCIgZmlsbD0iIzIzMUYyMCIgd2lkdGg9IjIuMSIgaGVpZ2h0PSIyLjEiLz4NCgkJCTxyZWN0IHg9IjIxLjEiIHk9IjEzLjkiIGZpbGw9IiMyMzFGMjAiIHdpZHRoPSIwLjciIGhlaWdodD0iMC43Ii8+DQoJCQk8cG9seWdvbiBmaWxsPSIjMjMxRjIwIiBwb2ludHM9IjE5LjcsMTQgMTkuNywxMy45IDE5LjcsMTIuNSAyMC40LDEyLjUgMjAuNCwxMy45IDIwLjQsMTQgMjAuNCwxNC42IDE5LjcsMTQuNiAJCQkiLz4NCgkJCTxyZWN0IHg9IjE4LjIiIHk9IjE0LjYiIGZpbGw9IiMyMzFGMjAiIHdpZHRoPSIwLjciIGhlaWdodD0iMS40Ii8+DQoJCQk8cmVjdCB4PSIxOC4yIiB5PSIxOC4yIiBmaWxsPSIjMjMxRjIwIiB3aWR0aD0iMC43IiBoZWlnaHQ9IjAuNyIvPg0KCQkJPHJlY3QgeD0iMTIuNSIgeT0iMTguMiIgZmlsbD0iIzIzMUYyMCIgd2lkdGg9IjAuNyIgaGVpZ2h0PSIwLjciLz4NCgkJCTxwb2x5Z29uIGZpbGw9IiMyMzFGMjAiIHBvaW50cz0iMTQsMTkuNiAxMy4zLDE5LjYgMTMuMywxOC45IDEzLjksMTguOSAxMy45LDE4LjIgMTQuNiwxOC4yIDE0LjYsMTguOSAxNCwxOC45IAkJCSIvPg0KCQkJPHJlY3QgeD0iMjIuNSIgeT0iMTguMiIgZmlsbD0iIzIzMUYyMCIgd2lkdGg9IjAuNyIgaGVpZ2h0PSIwLjciLz4NCgkJCTxwb2x5Z29uIGZpbGw9IiMyMzFGMjAiIHBvaW50cz0iMjMuOSwxOS42IDIzLjIsMTkuNiAyMy4yLDE4LjkgMjMuOSwxOC45IDIzLjksMTguMiAyNC42LDE4LjIgMjQuNiwxOC45IDIzLjksMTguOSAJCQkiLz4NCgkJCTxwb2x5Z29uIGZpbGw9IiMyMzFGMjAiIHBvaW50cz0iMjYuNywxOS42IDI0LjYsMTkuNiAyNC42LDE4LjkgMjYsMTguOSAyNiwxOC4yIDI3LjUsMTguMiAyNy41LDE4LjkgMjYuNywxOC45IAkJCSIvPg0KCQkJPHBvbHlnb24gZmlsbD0iIzIzMUYyMCIgcG9pbnRzPSIyNS4zLDIxLjEgMjQuNiwyMS4xIDIzLjksMjEuMSAyMy45LDIxLjggMjMuMiwyMS44IDIzLjIsMjEuMSAyMy45LDIxLjEgMjMuOSwyMC4zIDI0LjYsMjAuMyANCgkJCQkyNiwyMC4zIDI2LDIxLjEgMjcuNSwyMS4xIDI3LjUsMjEuOCAyNS4zLDIxLjggCQkJIi8+DQoJCQk8cG9seWdvbiBmaWxsPSIjMjMxRjIwIiBwb2ludHM9IjIyLjUsMjEuOCAyMC40LDIxLjggMjAuNCwyMS44IDE5LjcsMjEuOCAxOS43LDIwLjMgMjAuNCwyMC4zIDIwLjQsMjEuMSAyMS4xLDIxLjEgMjEuMSwyMC4zIA0KCQkJCTIzLjIsMjAuMyAyMy4yLDIxLjEgMjIuNSwyMS4xIAkJCSIvPg0KCQkJPHJlY3QgeD0iMTguMiIgeT0iMTYuOCIgZmlsbD0iIzIzMUYyMCIgd2lkdGg9IjAuNyIgaGVpZ2h0PSIwLjciLz4NCgkJCTxyZWN0IHg9IjE4LjIiIHk9IjEyLjUiIGZpbGw9IiMyMzFGMjAiIHdpZHRoPSIwLjciIGhlaWdodD0iMS41Ii8+DQoJCQk8cmVjdCB4PSIyMS4xIiB5PSIyNCIgZmlsbD0iIzIzMUYyMCIgd2lkdGg9IjAuNyIgaGVpZ2h0PSIwLjciLz4NCgkJCTxyZWN0IHg9IjE5LjciIHk9IjIyLjYiIGZpbGw9IiMyMzFGMjAiIHdpZHRoPSIwLjciIGhlaWdodD0iMS41Ii8+DQoJCQk8cG9seWdvbiBmaWxsPSIjMjMxRjIwIiBwb2ludHM9IjE5LDI2LjEgMTkuNywyNi4xIDE5LjcsMjQuNiAyMC40LDI0LjYgMjAuNCwyNy41IDE5LjgsMjcuNSAxOS44LDI3LjUgMTguOSwyNy41IDE4LjksMjcuNSANCgkJCQkxOC4yLDI3LjUgMTguMiwyNi44IDE4LjksMjYuOCAxOC45LDI2LjEgMTguMiwyNi4xIDE4LjIsMjQuNiAxOSwyNC42IAkJCSIvPg0KCQkJPHJlY3QgeD0iMjEuMSIgeT0iMjUuNCIgZmlsbD0iIzIzMUYyMCIgd2lkdGg9IjAuNyIgaGVpZ2h0PSIyLjIiLz4NCgkJCTxyZWN0IHg9IjE4LjIiIHk9IjIyLjYiIGZpbGw9IiMyMzFGMjAiIHdpZHRoPSIwLjciIGhlaWdodD0iMS41Ii8+DQoJCQk8cmVjdCB4PSIyMS4xIiB5PSIxNy41IiBmaWxsPSIjMjMxRjIwIiB3aWR0aD0iMC43IiBoZWlnaHQ9IjIuMiIvPg0KCQkJPHBvbHlnb24gZmlsbD0iIzIzMUYyMCIgcG9pbnRzPSIyMS4xLDE2LjggMjAuNCwxNi44IDIwLjQsMTkuNiAxOS43LDE5LjYgMTkuNywxNS4zIDIwLjQsMTUuMyAyMC40LDE1LjMgMjEuMSwxNS4zIAkJCSIvPg0KCQkJPHBvbHlnb24gZmlsbD0iIzIzMUYyMCIgcG9pbnRzPSIxNi44LDE5LjYgMTguOSwxOS42IDE4LjksMjAuMiAxOC45LDIwLjQgMTguOSwyMS44IDE4LjIsMjEuOCAxOC4yLDIwLjQgMTYuOCwyMC40IAkJCSIvPg0KCQkJPHBvbHlnb24gZmlsbD0iIzIzMUYyMCIgcG9pbnRzPSIxNCwyMC40IDE0LDIxLjEgMTQuNiwyMS4xIDE0LjYsMjAuNCAxNS4zLDIwLjQgMTUuMywxOS42IDE0LjYsMTkuNiAxNC42LDE4LjkgMTYuMSwxOC45IA0KCQkJCTE2LjEsMTguMiAxNy41LDE4LjIgMTcuNSwxOC45IDE2LjgsMTguOSAxNi44LDE5LjYgMTYsMTkuNiAxNiwyMC40IDE1LjMsMjAuNCAxNS4zLDIxLjEgMTYuOSwyMS4xIDE2LjksMjEuOCAxMi41LDIxLjggDQoJCQkJMTIuNSwyMS4xIDEyLjUsMjEuMSAxMi41LDIwLjQgCQkJIi8+DQoJCTwvZz4NCgkJPGc+DQoJCQk8Zz4NCgkJCQk8cGF0aCBmaWxsPSIjNDlDOEY1IiBkPSJNMzAuMSwxNC4xYzAuMiwwLDAuNC0wLjIsMC40LTAuNGwwLTMuOGMwLTAuMi0wLjItMC40LTAuNC0wLjRsLTMuOCwwYy0wLjIsMC0wLjQsMC4yLTAuNCwwLjQNCgkJCQkJYzAsMC4yLDAuMiwwLjQsMC40LDAuNGwzLjQsMGwwLDMuNEMyOS43LDEzLjksMjkuOSwxNC4xLDMwLjEsMTQuMXoiLz4NCgkJCTwvZz4NCgkJCTxnPg0KCQkJCTxwYXRoIGZpbGw9IiM0OUM4RjUiIGQ9Ik05LjksMTQuMWMwLjIsMCwwLjQtMC4yLDAuNC0wLjRsMC0zLjRsMy40LDBjMC4yLDAsMC40LTAuMiwwLjQtMC40YzAtMC4yLTAuMi0wLjQtMC40LTAuNGwtMy44LDANCgkJCQkJYy0wLjIsMC0wLjQsMC4yLTAuNCwwLjRsMCwzLjhDOS41LDEzLjksOS43LDE0LjEsOS45LDE0LjF6Ii8+DQoJCQk8L2c+DQoJCQk8Zz4NCgkJCQk8cGF0aCBmaWxsPSIjNDlDOEY1IiBkPSJNMjYuNCwzMC41bDMuOCwwYzAuMiwwLDAuNC0wLjIsMC40LTAuNGwwLTMuOGMwLTAuMi0wLjItMC40LTAuNC0wLjRjLTAuMiwwLTAuNCwwLjItMC40LDAuNGwwLDMuNA0KCQkJCQlsLTMuNCwwYy0wLjIsMC0wLjQsMC4yLTAuNCwwLjRDMjYsMzAuMywyNi4xLDMwLjUsMjYuNCwzMC41eiIvPg0KCQkJPC9nPg0KCQkJPGc+DQoJCQkJPHBhdGggZmlsbD0iIzQ5QzhGNSIgZD0iTTkuOSwzMC41bDMuOCwwYzAuMiwwLDAuNC0wLjIsMC40LTAuNGMwLTAuMi0wLjItMC40LTAuNC0wLjRsLTMuNCwwbDAtMy40YzAtMC4yLTAuMi0wLjQtMC40LTAuNA0KCQkJCQljLTAuMiwwLTAuNCwwLjItMC40LDAuNGwwLDMuOEM5LjUsMzAuMyw5LjcsMzAuNSw5LjksMzAuNXoiLz4NCgkJCTwvZz4NCgkJPC9nPg0KCTwvZz4NCjwvZz4NCjxnPg0KCTxwYXRoIGZpbGw9IiNGRURBMDAiIGQ9Ik0xMS40LDM2LjRoMTguN2MwLTAuOSwwLTEuOSwwLTIuN2MtMC4xLTEuMi0wLjQtMi40LTAuOS0zLjVsLTIuMy01YzAsMC0zLjUtMC45LTQuNC0wLjQNCgkJYy0zLjIsMS42LTYuOCwwLjctNi44LDAuN2wwLTAuMWMtMC4xLDAtMC4xLDAuMS0wLjEsMC4xYy0wLjUsMC45LTEuMiwxLjktMS42LDIuOGMtMS4xLDIuNi0yLjksNS0yLjYsNy44DQoJCUMxMS4zLDM2LjIsMTEuMywzNi4zLDExLjQsMzYuNHoiLz4NCgk8ZyBpZD0iaGVhZCI+DQoJCTxwYXRoIGZpbGw9IiNGRURDQzYiIGQ9Ik0xMC4xLDExLjdjMCwwLjUtMC4xLDAuOS0wLjEsMS40Yy0wLjEsMC45LTAuNCwyLTEuMSwyLjVjLTAuMSwwLjEtMC4yLDAuMS0wLjMsMC4yDQoJCQljLTAuMiwwLjIsMCwwLjQsMC4yLDAuNWMwLjEsMC4xLDAuMiwwLjEsMC4yLDAuMmMwLDAuMSwwLDAuMiwwLjEsMC4zYzAuMSwwLjgsMC40LDEuNywwLjcsMi40YzAuMiwwLjQsMC40LDAuOSwwLjgsMS4yDQoJCQljMC40LDAuMywwLjgsMC4zLDEuMiwwLjNjMS41LDAsMy0wLjgsNC4yLTEuOGMwLjktMC44LDIuMi0xLjQsMi45LTIuNGMxLjItMS44LDEtNC4zLDEuMy02LjJjMC0wLjMtMS4yLTAuNy0xLjUtMC44DQoJCQljLTAuMy0wLjEtMC44LDAuMS0xLjEsMC4xYy0wLjgsMC4xLTEuNiwwLjEtMi4zLDAuMmMtMS41LDAuMS0zLjEsMC4zLTQuNiwwLjRjLTAuMSwwLTAuMSwwLTAuMiwwYy0wLjEsMC0wLjEsMC4xLTAuMSwwLjINCgkJCUMxMC4zLDEwLjgsMTAuMiwxMS4yLDEwLjEsMTEuN3oiLz4NCgkJPHBhdGggZmlsbD0iI0ZFRENDNiIgZD0iTTE2LjMsMTcuOWwtMC43LDcuNWMwLDAsNS45LDEuNCw5LjQtMi44YzAsMC01LjQtNi45LTcuNS04TDE2LjMsMTcuOXoiLz4NCgkJPGVsbGlwc2UgZmlsbD0iIzIzMDkzQSIgY3g9IjExLjkiIGN5PSIxMy4zIiByeD0iMC4zIiByeT0iMC41Ii8+DQoJCTxwYXRoIGZpbGw9IiMyMzA5M0EiIGQ9Ik0xMS41LDE3YzAuMiwwLjctMC4xLDEuNC0wLjcsMS42Yy0wLjUsMC4yLTEuMS0wLjMtMS4zLTFMMTEuNSwxN3oiLz4NCgkJPHBhdGggZmlsbD0iIzIzMDkzQSIgZD0iTTEyLjYsMTIuNUMxMi42LDEyLjUsMTIuNiwxMi41LDEyLjYsMTIuNWMwLjEsMCwwLjEtMC4xLDAuMS0wLjFjLTAuMS0wLjQtMC41LTAuNi0wLjktMC41DQoJCQljLTAuMSwwLTAuMSwwLjEtMC4xLDAuMWMwLDAuMSwwLjEsMC4xLDAuMSwwLjFDMTIuMSwxMS45LDEyLjQsMTIuMSwxMi42LDEyLjVDMTIuNSwxMi40LDEyLjUsMTIuNSwxMi42LDEyLjV6Ii8+DQoJCTxwYXRoIGZpbGw9IiNFRUMzQUIiIGQ9Ik0xOC4xLDEzLjlDMTguMSwxMy45LDE4LjEsMTMuOSwxOC4xLDEzLjljMC4xLTAuMSwwLjEtMC4yLDAuMS0wLjJjLTAuMS0wLjEtMC4xLTAuMiwwLTAuMw0KCQkJYzAtMC4yLDAuMS0wLjMsMC4zLTAuNGMwLjMtMC4xLDAuNSwwLDAuNywwLjJjMCwwLjEsMC4xLDAuMSwwLjIsMGMwLDAsMC4xLTAuMSwwLTAuMmMtMC4zLTAuNC0wLjctMC41LTEtMC4zDQoJCQljLTAuMiwwLjEtMC4zLDAuMy0wLjQsMC42QzE3LjgsMTMuNSwxNy45LDEzLjcsMTguMSwxMy45QzE4LDEzLjksMTgsMTMuOSwxOC4xLDEzLjl6Ii8+DQoJPC9nPg0KCTxnIGlkPSJoYWlyIj4NCgkJPHBhdGggZmlsbD0iIzIzMUYyMCIgZD0iTTI4LjksMjkuNmMtMC41LTAuMi0wLjctMS43LTIuMy0xLjdjLTEuMiwwLTIuMiwwLjYtMy41LDBjLTAuNi0wLjMtMS4yLTAuOS0xLjUtMS42Yy0wLjYtMS42LDAuNC00LTEtNS4zDQoJCQljLTAuNy0wLjYtMS42LTAuOS0yLTEuOGMtMC41LTEuMS0wLjUtMi4zLTAuNC0zLjVjMC0wLjEsMC0wLjMsMC4xLTAuNGMwLjEtMC4xLDAuMy0wLjEsMC40LTAuMmMwLjgtMC4yLDEuNC0xLjMsMS0yLjENCgkJCWMtMC40LTAuOC0xLjctMC44LTIsMGMtMC4xLDAuMy0wLjIsMC42LTAuNSwwLjZjLTAuMywwLTAuMy0wLjQtMC4zLTAuN2MwLjEtMC40LDAuMi0yLjYsMC4zLTNjMCwwLjEtMC42LDAuNC0wLjcsMC40DQoJCQljLTAuNiwwLjMtMS4zLDAuNi0yLDAuN2MtMSwwLjItMS45LDAuMy0yLjksMC4zYy0wLjcsMC0xLjQtMC4xLTIuMi0wLjNjLTAuNy0wLjEtMS40LTAuMy0xLjktMC44Yy0wLjgtMC45LTAuNS0yLjIsMC0zLjINCgkJCWMwLjYtMS4xLDEuNy0xLjcsMi45LTJjMC4zLTAuMSwwLjYtMC4xLDAuOC0wLjFjMS4zLTAuMSwyLjYsMC4zLDMuOSwwLjVjMS40LDAuMiwyLjcsMC4yLDQuMSwwLjZjMS42LDAuNCwzLDEuNSwzLjksMi45DQoJCQljMS4xLDEuNiwxLjIsMy42LDIuMSw1LjJjMS4zLDIuNSwzLjMsMS40LDYsNC44YzAuOCwxLDAuOCwyLjMsMSwzLjZjMC4xLDAuNiwwLjMsMS4yLDAuNiwxLjdjMC40LDAuNSwwLjksMC45LDEuMiwxLjYNCgkJCWMwLjQsMS4xLDAuMywyLjctMC43LDMuM2MtMC40LDAuMi0wLjcsMC40LTAuOSwwLjhjLTAuMiwwLjQtMC4zLDAuOS0wLjYsMS4zYy0wLjIsMC4zLTAuNCwwLjUtMC43LDAuNmMtMC4yLDAuMS0wLjksMC4zLTEuMSwwLjENCgkJCWMwLDAtMC41LTAuOC0wLjUtMC44TDI4LjksMjkuNnoiLz4NCgkJPHBhdGggZmlsbD0iIzQyNDE0MyIgZD0iTTkuMSw2LjljMC0wLjIsMC4xLTAuMywwLjItMC41YzAuMi0wLjMsMC41LTAuNiwwLjktMC43YzAuNi0wLjIsMS4yLTAuMSwxLjcsMC4xYzAuNSwwLjIsMSwwLjQsMS41LDAuNw0KCQkJYzAuNSwwLjMsMSwwLjQsMS42LDAuNWMwLjEsMCwwLjIsMCwwLjMsMGMwLjEsMCwwLjEsMC4yLDAsMC4yYy0wLjYsMC0xLjItMC4yLTEuOC0wLjRjLTAuNS0wLjItMC45LTAuNS0xLjQtMC43DQoJCQljLTAuMy0wLjEtMC42LTAuMi0xLTAuM2MtMC4zLTAuMS0wLjUtMC4xLTAuOCwwQzEwLjEsNiw5LjgsNi4yLDkuNiw2LjVjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwwLDAsMC4xLTAuMSwwLjENCgkJCWMwLDAuMS0wLjEsMC4xLTAuMSwwLjJjMCwwLDAsMCwwLDAuMWMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMGMwLDAsMCwwLDAsMC4xYzAsMCwwLDAsMCwwQzkuMyw3LjEsOS4xLDcuMSw5LjEsNi45TDkuMSw2Ljl6Ii8+DQoJCTxwYXRoIGZpbGw9IiM0MjQxNDMiIGQ9Ik0yOC4yLDI2LjZDMjguMiwyNi42LDI4LjMsMjYuNiwyOC4yLDI2LjZjMC4xLTAuMSwwLjEtMC4yLDAtMC4yYy0wLjEsMC0wLjMtMC4xLTAuNC0wLjENCgkJCWMtMC45LTAuMi0xLjgtMC40LTIuNi0wLjljLTAuOS0wLjYtMS0xLjQtMS4yLTIuNGMwLTAuMi0wLjEtMC40LTAuMS0wLjdjLTAuMi0wLjctMC40LTEuNC0wLjgtMmMtMC40LTAuNi0wLjktMS4xLTEuNS0xLjQNCgkJCWMtMS40LTAuOC0yLTEuOC0xLjctM2MwLTAuMSwwLTAuMS0wLjEtMC4xYy0wLjEsMC0wLjEsMC0wLjEsMC4xYy0wLjIsMC43LTAuMSwxLjQsMC40LDJjMC4zLDAuNSwwLjgsMC45LDEuNSwxLjMNCgkJCWMxLDAuNiwxLjgsMS44LDIuMiwzLjNjMC4xLDAuMiwwLjEsMC40LDAuMSwwLjZjMC4yLDEsMC40LDEuOSwxLjMsMi42YzAuOCwwLjUsMS44LDAuNywyLjcsMC45QzI3LjksMjYuNSwyOCwyNi42LDI4LjIsMjYuNg0KCQkJQzI4LjIsMjYuNiwyOC4yLDI2LjYsMjguMiwyNi42eiIvPg0KCQk8cGF0aCBmaWxsPSIjNDI0MTQzIiBkPSJNMjIuOCwxMC4zYzAuNCwxLDEsMS45LDEuNywyLjVjMC43LDAuNywxLjYsMS4xLDIuNiwxLjNjMS4xLDAuMiwyLjMsMCwzLjMsMC40YzAuNSwwLjIsMC45LDAuNSwxLjMsMC45DQoJCQljMC40LDAuNCwwLjYsMC45LDAuOCwxLjRjMC41LDEuMiwwLjYsMi41LDAuNiwzLjhjMCwwLjIsMCwwLjMsMCwwLjVjMCwwLjEtMC4yLDAuMS0wLjIsMGMwLTEuMywwLTIuNy0wLjUtMy45Yy0wLjQtMS0xLTItMi0yLjQNCgkJCWMtMS4xLTAuNS0yLjItMC4zLTMuMy0wLjVjLTEtMC4xLTEuOS0wLjYtMi43LTEuMmMtMC44LTAuNi0xLjQtMS41LTEuOC0yLjRjLTAuMS0wLjEtMC4xLTAuMi0wLjEtMC40YzAtMC4xLDAtMC4xLDAuMS0wLjENCgkJCUMyMi44LDEwLjIsMjIuOCwxMC4zLDIyLjgsMTAuM0wyMi44LDEwLjN6Ii8+DQoJCTxwYXRoIGZpbGw9IiM0MjQxNDMiIGQ9Ik0yOCwxOGMwLjItMC4xLDAuMywwLDAuNCwwLjJjMC4xLDAuMiwwLjEsMC40LDAsMC42Yy0wLjEsMC4yLTAuMiwwLjQtMC4xLDAuNmMwLDAuMiwwLjEsMC4zLDAuMiwwLjMNCgkJCWMwLjMsMC4yLDAuNywwLjIsMSwwLjNjMC40LDAuMSwwLjgsMC4zLDEuMSwwLjdjMC4zLDAuMywwLjUsMC44LDAuNCwxLjJjMCwwLjItMC4xLDAuNC0wLjEsMC43Yy0wLjEsMC4yLTAuMSwwLjQsMCwwLjcNCgkJCWMwLjEsMC4yLDAuMiwwLjQsMC40LDAuNWMwLjIsMC4yLDAuMywwLjMsMC40LDAuNWMwLjMsMC4zLDAuNSwwLjcsMC42LDEuMmMwLjEsMC40LDAuMSwwLjgsMCwxLjFjLTAuMSwwLjMtMC4zLDAuNi0wLjYsMC44DQoJCQljLTAuMSwwLTAuMSwwLjEtMC4yLDAuMWMtMC4xLDAtMC4xLTAuMSwwLTAuMmMwLjYtMC4xLDAuOS0xLDAuOC0xLjZjLTAuMS0wLjQtMC4zLTAuOC0wLjUtMS4yYy0wLjEtMC4yLTAuMy0wLjMtMC40LTAuNQ0KCQkJYy0wLjEtMC4xLTAuMy0wLjMtMC40LTAuNWMtMC4xLTAuMi0wLjItMC40LTAuMi0wLjZjMC0wLjIsMC4xLTAuNCwwLjItMC43YzAuMS0wLjQsMC0wLjktMC4yLTEuMmMtMC4yLTAuNC0wLjYtMC42LTAuOS0wLjgNCgkJCWMtMC4zLTAuMS0wLjctMC4yLTEtMC4zYy0wLjMtMC4xLTAuNS0wLjMtMC42LTAuN2MwLTAuMiwwLjEtMC40LDAuMi0wLjZjMC4xLTAuMiwwLjEtMC40LTAuMS0wLjVjMC0wLjEtMC4xLTAuMS0wLjIsMA0KCQkJQzI4LDE4LjIsMjcuOSwxOCwyOCwxOEwyOCwxOHoiLz4NCgkJPHBhdGggZmlsbD0iIzQyNDE0MyIgZD0iTTEwLjQsNWMwLjUtMC44LDEuNC0xLjIsMi4zLTEuMWMwLjUsMC4xLDAuOSwwLjQsMS40LDAuNmMwLjQsMC4zLDEsMC41LDEuNSwwLjNjMC40LTAuMSwwLjgtMC42LDAuNi0xLjENCgkJCWMwLTAuMSwwLTAuMSwwLTAuMmMwLDAsMC4xLDAsMC4xLDBjMC4yLDAuNSwwLDAuOS0wLjQsMS4yYy0wLjQsMC4zLTEsMC4zLTEuNSwwLjFDMTQsNC44LDEzLjUsNC40LDEzLDQuMmMtMC40LTAuMi0wLjktMC4yLTEuMywwDQoJCQljLTAuNSwwLjEtMC45LDAuNS0xLjIsMC45YzAsMC0wLjEsMC4xLTAuMSwwQzEwLjQsNS4xLDEwLjMsNSwxMC40LDVMMTAuNCw1eiIvPg0KCQk8cGF0aCBmaWxsPSIjNDI0MTQzIiBkPSJNMzIuNCwyMy40YzAsMC42LDAuMywxLjEsMC43LDEuNWMwLjQsMC40LDAuOSwwLjcsMS4zLDEuMmMwLjQsMC41LDAuNiwxLjEsMC41LDEuN2MwLDAuNi0wLjIsMS4yLTAuNiwxLjYNCgkJCWMtMC4xLDAuMS0wLjIsMC4yLTAuMywwLjNjLTAuMSwwLjEtMC4zLDAuMi0wLjQsMC4zYy0wLjIsMC4yLTAuNSwwLjUtMC41LDAuOGMwLDAuMS0wLjEsMC4xLTAuMSwwYy0wLjEtMC4zLDAuMS0wLjYsMC4zLTAuOA0KCQkJYzAuMi0wLjIsMC41LTAuNCwwLjctMC42YzAuNC0wLjQsMC43LTAuOSwwLjctMS41YzAuMS0wLjYtMC4xLTEuMy0wLjQtMS44Yy0wLjMtMC41LTAuOS0wLjgtMS4zLTEuMmMtMC41LTAuNC0wLjktMS0wLjktMS43DQoJCQlDMzIuMywyMy4zLDMyLjQsMjMuMywzMi40LDIzLjRMMzIuNCwyMy40eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggZmlsbD0iI0ZFRENDNiIgZD0iTTcuNiwzNS4xYzAsMCwwLjEsMC41LDAuNCwxLjNoMy4yYy0wLjQtMC44LTAuNy0xLjUtMC45LTJMMTAsMzMuN2MwLDAsMC42LTIuNSwxLjMtMy42DQoJCQljMC40LTAuNiwwLjYtMC45LDAuNy0xYzAuMS0wLjEsMC4xLTAuMSwwLjEtMC4xczAuMi0wLjctMC42LTAuM2MtMC43LDAuNC0xLjIsMS4zLTEuNywxLjljMC0wLjEtMS44LTQuNC0yLjUtNS43DQoJCQljLTEuMS0yLTAuOC0wLjItMC44LTAuMmwwLjgsMi44YzAsMC0xLjMsMC43LTIuMSwxLjVjLTAuOCwwLjgsMi4yLDUuMSwyLjIsNS4xTDcuNiwzNS4xeiIvPg0KCQk8cGF0aCBmaWxsPSIjRkVEQ0M2IiBkPSJNMzAsMzYuNGMwLjEtMC4zLDAuMS0wLjUsMC4yLTAuOGMwLjUtMi4xLDAuNy00LjctMC43LTYuM2MtMC4yLTAuMi0yLjItMS43LTIuNS0xLjJjMCwwLTIuNCw0LjEtNC45LDguMw0KCQkJSDMweiIvPg0KCTwvZz4NCjwvZz4NCjwvc3ZnPg0K';

const Locales = ['ja', 'ja-Hira', 'en', 'ko', 'zh-cn', 'de', 'es', 'ru', 'sr'];

const Message = {
    startRecognition : {
        'ja': 'Start Speech Recognition',
        'ja-Hira': 'Start Speech Recognition',
        'en': 'Start Speech Recognition',
        'ko': '음성 인식 시작',
        'zh-cn': '开始语音识别',
        'de': 'Starten Sie die Spracherkennung',
        'es': 'Iniciar el reconocimiento de voz',
        'ru': 'Начать распознавание речи',
        'sr': 'Pokrenite prepoznavanje govora'
    },
    getSpeech : {
        'ja': 'Speech',
        'ja-Hira': 'Speech',
        'en': 'Speech',
        'ko': '음성',
        'zh-cn': '言语',
        'de': 'Rede',
        'es': 'Habla',
        'ru': 'Речь',
        'sr': 'Govor'
    },
};

class Scratch3Speech2Scratch {
    constructor (runtime) {
        this.runtime = runtime;
        this.speech = '';
        this.locale = this._getViewerLanguageCode();
    }

    _getViewerLanguageCode () {
        const locale = formatMessage.setup().locale;
        if (Locales.includes(locale)) {
            return locale;
        }
        return 'en';
    }

    getInfo () {

        this.locale = this._getViewerLanguageCode();

        return {
            id: 'speech2scratch',
            name: 'cubroid speech',
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'startRecognition',
                    blockType: BlockType.COMMAND,
                    text: Message.startRecognition[this.locale]
                },
                {
                    opcode: 'getSpeech',
                    blockType: BlockType.REPORTER,
                    text: Message.getSpeech[this.locale]
                }
            ],
            menus: {
            }
        };
    }

    startRecognition () {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new window.SpeechRecognition();
        recognition.addEventListener("result", e => {
            this.speech = e.results[0][0].transcript;
        });
        recognition.start();
    }

    getSpeech() {
        return this.speech;
    }
}

module.exports = Scratch3Speech2Scratch;