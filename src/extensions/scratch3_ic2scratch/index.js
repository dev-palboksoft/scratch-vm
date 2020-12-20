const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const ml5 = require('ml5');
const formatMessage = require('format-message');

const HAT_TIMEOUT = 100;

const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHdpZHRoPSI0MHB4IiBoZWlnaHQ9IjQwcHgiIHZpZXdCb3g9IjAgMCA0MCA0MCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDAgNDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtkaXNwbGF5Om5vbmU7ZmlsbDojRkZGRkZGO30NCgkuc3Qxe2Rpc3BsYXk6bm9uZTtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOiNGRkZGRkY7fQ0KCS5zdDJ7ZGlzcGxheTpub25lO30NCgkuc3Qze2Rpc3BsYXk6aW5saW5lO2ZpbGw6I0FCNUQyNzt9DQoJLnN0NHtkaXNwbGF5OmlubGluZTtmaWxsOiNGOUIwOUE7fQ0KCS5zdDV7ZGlzcGxheTppbmxpbmU7ZmlsbDojN0YzNDFFO30NCgkuc3Q2e2Rpc3BsYXk6aW5saW5lO2ZpbGw6I0ZGRkZGRjt9DQoJLnN0N3tkaXNwbGF5OmlubGluZTtmaWxsOiNGN0EwOEE7fQ0KCS5zdDh7ZGlzcGxheTppbmxpbmU7fQ0KCS5zdDl7ZmlsbDojRkZGRkZGO30NCgkuc3QxMHtmaWxsOiMxMTkwQ0Y7fQ0KCS5zdDExe2ZpbGw6IzIzMUYyMDt9DQoJLnN0MTJ7ZmlsbDojNDlDOEY1O30NCgkuc3QxM3tkaXNwbGF5OmlubGluZTtmaWxsOiNGRURBMDA7fQ0KCS5zdDE0e2ZpbGw6I0ZFRENDNjt9DQoJLnN0MTV7ZmlsbDojMjMwOTNBO30NCgkuc3QxNntmaWxsOiNFRUMzQUI7fQ0KCS5zdDE3e2ZpbGw6IzQyNDE0Mzt9DQoJLnN0MTh7ZmlsbDojRTQxRDNDO30NCgkuc3QxOXtmaWxsOiNDQTFGM0Q7fQ0KCS5zdDIwe2ZpbGw6Izc0MzkxOTt9DQoJLnN0MjF7ZmlsbDojNjQzNTE0O30NCgkuc3QyMntmaWxsOiNDNDZDMjk7fQ0KCS5zdDIze2ZpbGw6IzI4QTc0RTt9DQoJLnN0MjR7ZmlsbDojMDg5MTQ2O30NCgkuc3QyNXtmaWxsOiMyMDc2M0I7fQ0KCS5zdDI2e2ZpbGw6I0M4MTczMDt9DQo8L3N0eWxlPg0KPHBhdGggY2xhc3M9InN0MCIgZD0iTTYuNCwxMS42djE2TDIwLDM0VjE3LjJMNi40LDExLjZ6IE0xNy40LDMwLjVsLTEuOC0wLjhsMC4yLTcuNWwwLDBsLTIuNCw2LjVMMTIuMSwyOGwtMi04LjZsMCwwTDkuOSwyN0w4LDI2LjINCglsMC4zLTExLjFsMi40LDEuMWwyLjEsOS4ybDAsMGwyLjUtNy4xbDIuNCwxLjFMMTcuNCwzMC41eiBNMjAsMTcuMlYzNGwxMy42LTYuNHYtMTZMMjAsMTcuMnogTTI0LjIsMjkuM3YtMTFsMi0wLjl2OS4zbDQuNC0ydjEuNw0KCUwyNC4yLDI5LjN6IE0xNywxMC4yQzE3LDEwLjIsMTcuMSwxMC4yLDE3LDEwLjJjMC4xLDAuMSwwLjEsMC4xLDAuMSwwLjFMMTcsMTAuOWMtMC4xLDAtMC4yLDAtMC4yLDAuMWwwLDBsLTEuNy0wLjVMMTcsMTAuMnoNCgkgTTE3LjQsOS44TDE3LjQsOS44TDE3LjQsOS44YzAuMSwwLDAuMSwwLDAuMSwwbDEuNC0xLjJsLTIuNSwwLjVsMC45LDAuN0gxNy40eiBNMTcuOCwxMC4ybDEuMiwxLjNsMC42LTAuNmwwLDANCgljLTAuMS0wLjEtMC4yLTAuMS0wLjItMC4ybDAsMGwwLDBMMTcuOCwxMC4yeiBNMTYuNiwxMS4yTDE2LjYsMTEuMkwxNi42LDExLjJsLTEuOC0wLjVsMC4yLDAuOWwxLjMsMC4zbDAuNC0wLjUNCglDMTYuNiwxMS4zLDE2LjYsMTEuMywxNi42LDExLjJ6IE0xNyw5LjlsLTAuOS0wLjdsLTEuMiwxLjJsMi0wLjRDMTcsMTAsMTcsOS45LDE3LDkuOXogTTIyLjEsMTAuOUwyMiwxMC4xbC0xLjQsMi40bDEuMy0xLjENCgljMC0wLjEtMC4xLTAuMS0wLjEtMC4ybDAsMGMwLTAuMSwwLjEtMC4yLDAuMi0wLjNIMjIuMXogTTIyLjUsOS44bDIuNywxLjVsLTAuNi0xLjVIMjIuNUwyMi41LDkuOHogTTIyLjUsOS42aDEuN2wtMS43LTAuOQ0KCWwtMC4yLDAuN2gwLjFDMjIuNCw5LjYsMjIuNSw5LjYsMjIuNSw5LjZ6IE0xNi45LDExLjVMMTYuNSwxMmwwLjgsMC43TDE2LjksMTEuNUwxNi45LDExLjV6IE0xNy44LDEwTDE3LjgsMTANCglDMTcuOCwxMC4xLDE3LjgsMTAuMSwxNy44LDEwbDEuNiwwLjVjMCwwLDAsMCwwLjEtMC4xYzAsMCwwLjEtMC4xLDAuMi0wLjFjLTAuMi0wLjYtMC4zLTEuMi0wLjUtMS44bC0xLjQsMS4yDQoJQzE3LjgsOS45LDE3LjgsMTAsMTcuOCwxMHogTTIyLjEsOS40bDAuMy0wLjhsLTIuNi0wLjFsMi4xLDFDMjEuOSw5LjUsMjIsOS41LDIyLjEsOS40eiBNMzMuNiwxMS42TDIwLDE3LjJMNi40LDExLjZMMjAsNg0KCUwzMy42LDExLjZ6IE0yNC4yLDEzYzAuNS0wLjQsMC45LTAuOSwxLjQtMS4zYy0wLjMtMC43LTAuNS0xLjMtMC44LTJsMCwwbDAsMGwwLDBsLTIuMS0xLjFsLTMuMy0wLjJoLTAuMUMxOC4xLDguNiwxNy4xLDguOCwxNiw5DQoJYy0wLjUsMC41LTEsMS0xLjUsMS41YzAuMSwwLjQsMC4yLDAuOCwwLjMsMS4ybDEuNSwwLjRsMS4yLDFsMi4yLDAuMWMwLDAuMSwwLjEsMC4xLDAuMSwwLjFjMC4xLDAuMSwwLjIsMC4xLDAuNCwwLjFsMCwwDQoJYzAuMSwwLDAuMSwwLDAuMiwwbDEuNywxLjNsMC4yLDAuMnYtMS4zTDI0LjIsMTN6IE0yMC42LDEzLjNsMS40LDEuMXYtMC44TDIwLjYsMTMuM0wyMC42LDEzLjN6IE0yMC42LDEyLjgNCgljMC4xLDAuMSwwLjEsMC4xLDAuMSwwLjJsMCwwYzAsMCwwLDAsMCwwLjFsMS4zLDAuMmwwLjEtMS44YzAsMCwwLDAtMC4xLDBMMjAuNiwxMi44eiBNMjIuNCwxMC45YzAuMSwwLDAuMywwLDAuNCwwLjENCglzMC4yLDAuMiwwLjIsMC4zbDAsMGwyLDAuMkwyMi4zLDEwbDAsMEwyMi40LDEwLjlMMjIuNCwxMC45eiBNMTcuNSwxMC4zTDE3LjUsMTAuM2wtMC4zLDAuNmMwLjEsMCwwLjEsMCwwLjEsMC4xDQoJYzAuMSwwLjEsMC4xLDAuMSwwLjEsMC4ybDAsMGMwLDAuMS0wLjEsMC4yLTAuMSwwLjJzLTAuMSwwLjEtMC4yLDAuMWwwLjQsMS4zbDEuMS0xLjFMMTcuNSwxMC4zeiBNMjIuOSwxMS40bC0wLjEsMC4xbDAsMGwxLjMsMS4yDQoJbDEuMS0xLjFMMjIuOSwxMS40eiBNMjIuNSwxMS42bC0wLjEsMS43bDEuNi0wLjVMMjIuNSwxMS42TDIyLjUsMTEuNnogTTE3LjgsMTIuOWwxLjgsMC4xYzAtMC4xLDAuMS0wLjEsMC4xLTAuMmwtMC44LTAuOQ0KCUwxNy44LDEyLjl6IE0xOS44LDExLjFsLTAuNywwLjZsMC45LDFsMCwwTDE5LjgsMTEuMUwxOS44LDExLjF6IE0yMC4zLDEwLjVsMS4zLTAuN2MwLDAsMCwwLDAtMC4xbDAsMFY5LjZsLTIuMi0xbDAuNSwxLjcNCglDMjAuMSwxMC40LDIwLjIsMTAuNCwyMC4zLDEwLjVMMjAuMywxMC41eiBNMjAuNSwxMC43TDIwLjUsMTAuN0wyMC41LDEwLjdjMCwwLjIsMCwwLjMtMC4xLDAuM3MtMC4xLDAuMS0wLjIsMC4xbDAuMSwxLjZsMS41LTIuNw0KCUwyMC41LDEwLjd6Ii8+DQo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjIuOCwxNS44bC0yLjEsOC42YzAsMCwwLDAtMC4xLDBjLTAuMywwLTAuNSwwLjEtMC42LDAuNGwtMi0wLjV2LTAuMWMwLTAuMi0wLjEtMC40LTAuMy0wLjVsMi4zLTguNQ0KCWMwLDAsMCwwLDAuMSwwYzAuMywwLDAuNS0wLjEsMC42LTAuNGwxLjcsMC41bDAsMEMyMi40LDE1LjQsMjIuNiwxNS43LDIyLjgsMTUuOHogTTMyLjcsMjFsLTYuNSwxbDAsMGMtMC42LDAuMS0xLjItMC4yLTEuNS0wLjcNCglsLTEuMi0ybC0xLjMsNC45bDUuMSwxLjdjMC41LDAuMiwwLjgsMC41LDEsMWwwLDBsMi42LDcuOGMwLjMsMC44LTAuMiwxLjctMSwxLjljLTAuOCwwLjMtMS43LTAuMi0xLjktMWwtMi4zLTcuMUwxOC40LDI2bC0yLjgsNS42DQoJYy0wLjEsMC4zLTAuNCwwLjUtMC42LDAuNmwtNi43LDQuMWMtMC43LDAuNC0xLjcsMC4yLTIuMS0wLjVTNiwzNC4xLDYuNywzMy43bDYuNC0zLjlsMy02bDIuMS04LjFMMTUuNCwxNmwtMi43LDUuOA0KCWMtMC40LDAuOC0xLjMsMS4xLTIsMC44Yy0wLjgtMC40LTEuMS0xLjMtMC44LTJsMy02LjZjMC4yLTAuNSwwLjctMC45LDEuMy0xbDYuMi0wLjNjLTEuMi0wLjktMi4xLTIuNC0yLjEtNC4xDQoJYzAtMi44LDIuMy01LjEsNS4xLTUuMXM1LjEsMi4zLDUuMSw1LjFzLTIuMiw1LTQuOSw1LjFsMyw1LjFsNS41LTAuOGMwLjgtMC4xLDEuNiwwLjUsMS43LDEuM0MzNC4xLDIwLjEsMzMuNSwyMC44LDMyLjcsMjF6DQoJIE0yNi4zLDguN2MwLDAuNCwwLjMsMC43LDAuNywwLjdzMC43LTAuMywwLjctMC43UzI3LjQsOCwyNyw4UzI2LjMsOC4zLDI2LjMsOC43eiBNMzMuMywxOS4zYzAtMC40LTAuMy0wLjctMC43LTAuNw0KCWMtMC4zLDAtMC42LDAuMy0wLjcsMC42TDI2LjUsMjBjMC0wLjMtMC4zLTAuNi0wLjctMC42aC0wLjFsLTIuMi0zLjljMC4xLTAuMSwwLjItMC4zLDAuMi0wLjVjMC0wLjQtMC4zLTAuNy0wLjctMC43DQoJYy0wLjMsMC0wLjUsMC4yLTAuNiwwLjRsLTEuNy0wLjRjMCwwLDAsMCwwLTAuMWMwLTAuNC0wLjMtMC43LTAuNy0wLjdjLTAuMywwLTAuNiwwLjMtMC43LDAuNmgtNC40Yy0wLjEtMC4yLTAuMy0wLjMtMC42LTAuMw0KCWMtMC40LDAtMC43LDAuMy0wLjcsMC43YzAsMC4yLDAuMSwwLjQsMC4yLDAuNWwtMi40LDUuMWMtMC4xLDAtMC4yLDAtMC4yLDBjLTAuNCwwLTAuNywwLjMtMC43LDAuN3MwLjMsMC43LDAuNywwLjcNCglzMC43LTAuMywwLjctMC43YzAtMC4yLTAuMS0wLjQtMC4yLTAuNWwyLjQtNS4xYzAuMSwwLDAuMiwwLjEsMC4zLDAuMWMwLjQsMCwwLjctMC4zLDAuNy0wLjdjMCwwLDAsMCwwLTAuMWg0LjQNCgljMC4xLDAuMiwwLjIsMC4zLDAuMywwLjRsLTIuMyw4LjVoLTAuMWMtMC40LDAtMC43LDAuMy0wLjcsMC43YzAsMC4yLDAuMSwwLjQsMC4zLDAuNUwxNC42LDMwaC0wLjFjLTAuNCwwLTAuNywwLjMtMC43LDAuNw0KCWMwLDAuMSwwLDAuMiwwLjEsMC40bC01LjQsMy4zQzguNCwzNC4xLDguMiwzNCw4LDM0Yy0wLjQsMC0wLjcsMC4zLTAuNywwLjdzMC4zLDAuNywwLjcsMC43czAuNy0wLjMsMC43LTAuN2MwLTAuMSwwLTAuMi0wLjEtMC4zDQoJbDUuNC0zLjNjMC4xLDAuMSwwLjMsMC4yLDAuNCwwLjJjMC40LDAsMC43LTAuMywwLjctMC43YzAtMC4yLTAuMS0wLjQtMC4zLTAuNmwyLjQtNS40YzAuMSwwLDAuMSwwLDAuMiwwYzAuMiwwLDAuNC0wLjEsMC42LTAuMw0KCWwyLDAuNWMwLDAsMCwwLDAsMC4xYzAsMC40LDAuMywwLjcsMC43LDAuN2MwLjIsMCwwLjQtMC4xLDAuNS0wLjJsNS4xLDEuOHYwLjFjMCwwLjQsMC4zLDAuNywwLjcsMC43aDAuMWwyLjEsNi4zDQoJYy0wLjIsMC4xLTAuNCwwLjMtMC40LDAuNmMwLDAuNCwwLjMsMC43LDAuNywwLjdjMC40LDAsMC43LTAuMywwLjctMC43cy0wLjMtMC43LTAuNy0wLjdjMCwwLDAsMC0wLjEsMEwyNy4yLDI4DQoJYzAuMi0wLjEsMC4zLTAuMywwLjMtMC41YzAtMC40LTAuMy0wLjctMC43LTAuN2MtMC4yLDAtMC40LDAuMS0wLjUsMC4zbC01LTEuOGMwLTAuMSwwLTAuMSwwLTAuMmMwLTAuMy0wLjEtMC41LTAuMy0wLjZsMi4xLTguNg0KCWwwLDBjMC4xLDAsMC4yLDAsMC4yLDBsMi4yLDMuOGMtMC4yLDAuMS0wLjMsMC4zLTAuMywwLjVjMCwwLjQsMC4zLDAuNywwLjcsMC43YzAuMywwLDAuNi0wLjIsMC42LTAuNWw1LjUtMC44DQoJYzAuMSwwLjMsMC4zLDAuNSwwLjYsMC41QzMzLDIwLDMzLjMsMTkuNywzMy4zLDE5LjN6Ii8+DQo8ZyBjbGFzcz0ic3QyIj4NCgk8cGF0aCBjbGFzcz0ic3QzIiBkPSJNMjAuNCwzNS4zTDIwLjQsMzUuM2MtNS40LDAtOS43LTQuNC05LjctOS43VjE0LjdDMTAuNiw5LjQsMTUsNSwyMC40LDVsMCwwYzUuNCwwLDkuNyw0LjQsOS43LDkuN3YxMC44DQoJCUMzMC4xLDMwLjksMjUuNywzNS4zLDIwLjQsMzUuM3oiLz4NCgk8cGF0aCBjbGFzcz0ic3Q0IiBkPSJNMjkuMiwxNi43aC0wLjFWMTVjMC00LjgtMy45LTguNy04LjctOC43cy04LjcsMy45LTguNyw4Ljd2MS43Yy0xLjEsMC4xLTIsMC45LTIuMiwyLjENCgkJYy0wLjEsMS4zLDAuOCwyLjUsMi4xLDIuNmMwLjEsMCwwLjMsMCwwLjQsMGMwLjksMy4yLDMuNSw1LjcsNi44LDYuM2MwLDAuMSwwLDAuMSwwLDAuMnYyYzAsMS4xLDAuOSwyLDIsMnMyLTAuOSwyLTJ2LTINCgkJYzAtMC4xLDAtMC4zLDAtMC40YzMtMC44LDUuMy0zLjIsNi4xLTYuMmMxLjIsMC4xLDIuMy0wLjgsMi41LTIuMUMzMS40LDE4LDMwLjUsMTYuOSwyOS4yLDE2Ljd6Ii8+DQoJPHBhdGggY2xhc3M9InN0MyIgZD0iTTMwLjEsMTUuOGMwLTEtMC4yLTMuMS0wLjUtNC4xYy0xLjMtMy45LTUtNi43LTkuMy02LjdsMCwwYy00LjYsMC04LjUsMy4yLTkuNSw3LjVjLTAuMiwwLjctMC4zLDMuMy0wLjMsNA0KCQljNS42LDAuNywxMS45LTAuNiwxNS4zLTQuN0MyNi40LDE0LjEsMjguNiwxNS42LDMwLjEsMTUuOHoiLz4NCgk8Y2lyY2xlIGNsYXNzPSJzdDUiIGN4PSIxNi4xIiBjeT0iMTkuMiIgcj0iMS4xIi8+DQoJPGNpcmNsZSBjbGFzcz0ic3Q1IiBjeD0iMjQuNSIgY3k9IjE5LjIiIHI9IjEuMSIvPg0KCTxwYXRoIGNsYXNzPSJzdDYiIGQ9Ik0xNy4xLDIyLjFoNi40YzAsMC0xLDEuNS0zLjIsMS41UzE3LjEsMjIuMSwxNy4xLDIyLjF6Ii8+DQoJPGVsbGlwc2UgY2xhc3M9InN0NyIgY3g9IjE1LjEiIGN5PSIyMS45IiByeD0iMS4yIiByeT0iMS4xIi8+DQoJPGVsbGlwc2UgY2xhc3M9InN0NyIgY3g9IjI1LjYiIGN5PSIyMS45IiByeD0iMS4yIiByeT0iMS4xIi8+DQoJPHBhdGggY2xhc3M9InN0NiIgZD0iTTExLDM0SDYuNnYtNS4xYzAtMC41LTAuNC0wLjgtMC44LTAuOGMtMC41LDAtMC44LDAuNC0wLjgsMC44djZjMCwwLjUsMC40LDAuOCwwLjgsMC44SDExDQoJCWMwLjUsMCwwLjgtMC40LDAuOC0wLjhTMTEuNCwzNCwxMSwzNHoiLz4NCgk8cGF0aCBjbGFzcz0ic3Q2IiBkPSJNMTEsNC4zSDUuOEM1LjQsNC4zLDUsNC43LDUsNS4ydjZDNSwxMS43LDUuNCwxMiw1LjgsMTJjMC41LDAsMC44LTAuNCwwLjgtMC44VjZIMTFjMC41LDAsMC44LTAuNCwwLjgtMC44DQoJCVMxMS40LDQuMywxMSw0LjN6Ii8+DQoJPHBhdGggY2xhc3M9InN0NiIgZD0iTTM0LjIsNC4zSDI5Yy0wLjUsMC0wLjgsMC40LTAuOCwwLjhTMjguNiw2LDI5LDZoNC4zdjUuMWMwLDAuNSwwLjQsMC44LDAuOCwwLjhzMC44LTAuNCwwLjgtMC44di02DQoJCUMzNSw0LjcsMzQuNiw0LjMsMzQuMiw0LjN6Ii8+DQoJPHBhdGggY2xhc3M9InN0NiIgZD0iTTM0LjIsMjguMWMtMC41LDAtMC44LDAuNC0wLjgsMC44VjM0SDI5Yy0wLjUsMC0wLjgsMC40LTAuOCwwLjhzMC40LDAuOCwwLjgsMC44aDUuMmMwLjUsMCwwLjgtMC40LDAuOC0wLjgNCgkJdi02QzM1LDI4LjQsMzQuNiwyOC4xLDM0LjIsMjguMXoiLz4NCjwvZz4NCjxnIGNsYXNzPSJzdDIiPg0KCTxnIGNsYXNzPSJzdDgiPg0KCQk8cGF0aCBjbGFzcz0ic3Q5IiBkPSJNOS43LDM0LjRjLTIuMiwwLTQtMS44LTQtNFY5LjZjMC0yLjIsMS44LTQsNC00aDIwLjZjMi4yLDAsNCwxLjgsNCw0djIwLjhjMCwyLjItMS44LDQtNCw0SDkuN3oiLz4NCgkJPHBhdGggY2xhc3M9InN0MTAiIGQ9Ik0zMC4zLDYuM2MxLjksMCwzLjQsMS41LDMuNCwzLjR2MjAuOGMwLDEuOS0xLjUsMy40LTMuNCwzLjRIOS43Yy0xLjksMC0zLjQtMS41LTMuNC0zLjRWOS42DQoJCQljMC0xLjksMS41LTMuNCwzLjQtMy40TDMwLjMsNi4zIE0zMC4zLDQuOUg5LjdDNy4xLDQuOSw1LDcsNSw5LjZ2MjAuOGMwLDIuNiwyLjEsNC43LDQuNyw0LjdoMjAuNmMyLjYsMCw0LjctMi4xLDQuNy00LjdWOS42DQoJCQlDMzUsNywzMi45LDQuOSwzMC4zLDQuOUwzMC4zLDQuOXoiLz4NCgk8L2c+DQoJPGcgY2xhc3M9InN0OCI+DQoJCTxnPg0KCQkJPHBhdGggY2xhc3M9InN0MTEiIGQ9Ik0yMi41LDE3LjRoNXYtNWgtNVYxNy40eiBNMjMuMSwxMy4xaDMuN3YzLjdoLTMuN1YxMy4xeiIvPg0KCQkJPHJlY3QgeD0iMjMuOSIgeT0iMTMuOSIgY2xhc3M9InN0MTEiIHdpZHRoPSIyLjEiIGhlaWdodD0iMi4xIi8+DQoJCQk8cGF0aCBjbGFzcz0ic3QxMSIgZD0iTTEyLjUsMTcuNGg1di01aC01VjE3LjR6IE0xMy4yLDEzLjFoMy43djMuN2gtMy43VjEzLjF6Ii8+DQoJCQk8cmVjdCB4PSIxNCIgeT0iMTMuOSIgY2xhc3M9InN0MTEiIHdpZHRoPSIyLjEiIGhlaWdodD0iMi4xIi8+DQoJCQk8cGF0aCBjbGFzcz0ic3QxMSIgZD0iTTE3LjUsMjIuNmgtNXY1aDVWMjIuNnogTTE2LjksMjYuOWgtMy43di0zLjdoMy43VjI2Ljl6Ii8+DQoJCQk8cmVjdCB4PSIxNCIgeT0iMjQiIGNsYXNzPSJzdDExIiB3aWR0aD0iMi4xIiBoZWlnaHQ9IjIuMSIvPg0KCQkJPHBhdGggY2xhc3M9InN0MTEiIGQ9Ik0yNy40LDIyLjZoLTV2NWg1VjIyLjZ6IE0yNi44LDI2LjloLTMuN3YtMy43aDMuN1YyNi45eiIvPg0KCQkJPHJlY3QgeD0iMjMuOSIgeT0iMjQiIGNsYXNzPSJzdDExIiB3aWR0aD0iMi4xIiBoZWlnaHQ9IjIuMSIvPg0KCQkJPHJlY3QgeD0iMjEuMSIgeT0iMTMuOSIgY2xhc3M9InN0MTEiIHdpZHRoPSIwLjciIGhlaWdodD0iMC43Ii8+DQoJCQk8cG9seWdvbiBjbGFzcz0ic3QxMSIgcG9pbnRzPSIxOS43LDE0IDE5LjcsMTMuOSAxOS43LDEyLjUgMjAuNCwxMi41IDIwLjQsMTMuOSAyMC40LDE0IDIwLjQsMTQuNiAxOS43LDE0LjYgCQkJIi8+DQoJCQk8cmVjdCB4PSIxOC4yIiB5PSIxNC42IiBjbGFzcz0ic3QxMSIgd2lkdGg9IjAuNyIgaGVpZ2h0PSIxLjQiLz4NCgkJCTxyZWN0IHg9IjE4LjIiIHk9IjE4LjIiIGNsYXNzPSJzdDExIiB3aWR0aD0iMC43IiBoZWlnaHQ9IjAuNyIvPg0KCQkJPHJlY3QgeD0iMTIuNSIgeT0iMTguMiIgY2xhc3M9InN0MTEiIHdpZHRoPSIwLjciIGhlaWdodD0iMC43Ii8+DQoJCQk8cG9seWdvbiBjbGFzcz0ic3QxMSIgcG9pbnRzPSIxNCwxOS42IDEzLjMsMTkuNiAxMy4zLDE4LjkgMTMuOSwxOC45IDEzLjksMTguMiAxNC42LDE4LjIgMTQuNiwxOC45IDE0LDE4LjkgCQkJIi8+DQoJCQk8cmVjdCB4PSIyMi41IiB5PSIxOC4yIiBjbGFzcz0ic3QxMSIgd2lkdGg9IjAuNyIgaGVpZ2h0PSIwLjciLz4NCgkJCTxwb2x5Z29uIGNsYXNzPSJzdDExIiBwb2ludHM9IjIzLjksMTkuNiAyMy4yLDE5LjYgMjMuMiwxOC45IDIzLjksMTguOSAyMy45LDE4LjIgMjQuNiwxOC4yIDI0LjYsMTguOSAyMy45LDE4LjkgCQkJIi8+DQoJCQk8cG9seWdvbiBjbGFzcz0ic3QxMSIgcG9pbnRzPSIyNi43LDE5LjYgMjQuNiwxOS42IDI0LjYsMTguOSAyNiwxOC45IDI2LDE4LjIgMjcuNSwxOC4yIDI3LjUsMTguOSAyNi43LDE4LjkgCQkJIi8+DQoJCQk8cG9seWdvbiBjbGFzcz0ic3QxMSIgcG9pbnRzPSIyNS4zLDIxLjEgMjQuNiwyMS4xIDIzLjksMjEuMSAyMy45LDIxLjggMjMuMiwyMS44IDIzLjIsMjEuMSAyMy45LDIxLjEgMjMuOSwyMC4zIDI0LjYsMjAuMyANCgkJCQkyNiwyMC4zIDI2LDIxLjEgMjcuNSwyMS4xIDI3LjUsMjEuOCAyNS4zLDIxLjggCQkJIi8+DQoJCQk8cG9seWdvbiBjbGFzcz0ic3QxMSIgcG9pbnRzPSIyMi41LDIxLjggMjAuNCwyMS44IDIwLjQsMjEuOCAxOS43LDIxLjggMTkuNywyMC4zIDIwLjQsMjAuMyAyMC40LDIxLjEgMjEuMSwyMS4xIDIxLjEsMjAuMyANCgkJCQkyMy4yLDIwLjMgMjMuMiwyMS4xIDIyLjUsMjEuMSAJCQkiLz4NCgkJCTxyZWN0IHg9IjE4LjIiIHk9IjE2LjgiIGNsYXNzPSJzdDExIiB3aWR0aD0iMC43IiBoZWlnaHQ9IjAuNyIvPg0KCQkJPHJlY3QgeD0iMTguMiIgeT0iMTIuNSIgY2xhc3M9InN0MTEiIHdpZHRoPSIwLjciIGhlaWdodD0iMS41Ii8+DQoJCQk8cmVjdCB4PSIyMS4xIiB5PSIyNCIgY2xhc3M9InN0MTEiIHdpZHRoPSIwLjciIGhlaWdodD0iMC43Ii8+DQoJCQk8cmVjdCB4PSIxOS43IiB5PSIyMi42IiBjbGFzcz0ic3QxMSIgd2lkdGg9IjAuNyIgaGVpZ2h0PSIxLjUiLz4NCgkJCTxwb2x5Z29uIGNsYXNzPSJzdDExIiBwb2ludHM9IjE5LDI2LjEgMTkuNywyNi4xIDE5LjcsMjQuNiAyMC40LDI0LjYgMjAuNCwyNy41IDE5LjgsMjcuNSAxOS44LDI3LjUgMTguOSwyNy41IDE4LjksMjcuNSANCgkJCQkxOC4yLDI3LjUgMTguMiwyNi44IDE4LjksMjYuOCAxOC45LDI2LjEgMTguMiwyNi4xIDE4LjIsMjQuNiAxOSwyNC42IAkJCSIvPg0KCQkJPHJlY3QgeD0iMjEuMSIgeT0iMjUuNCIgY2xhc3M9InN0MTEiIHdpZHRoPSIwLjciIGhlaWdodD0iMi4yIi8+DQoJCQk8cmVjdCB4PSIxOC4yIiB5PSIyMi42IiBjbGFzcz0ic3QxMSIgd2lkdGg9IjAuNyIgaGVpZ2h0PSIxLjUiLz4NCgkJCTxyZWN0IHg9IjIxLjEiIHk9IjE3LjUiIGNsYXNzPSJzdDExIiB3aWR0aD0iMC43IiBoZWlnaHQ9IjIuMiIvPg0KCQkJPHBvbHlnb24gY2xhc3M9InN0MTEiIHBvaW50cz0iMjEuMSwxNi44IDIwLjQsMTYuOCAyMC40LDE5LjYgMTkuNywxOS42IDE5LjcsMTUuMyAyMC40LDE1LjMgMjAuNCwxNS4zIDIxLjEsMTUuMyAJCQkiLz4NCgkJCTxwb2x5Z29uIGNsYXNzPSJzdDExIiBwb2ludHM9IjE2LjgsMTkuNiAxOC45LDE5LjYgMTguOSwyMC4yIDE4LjksMjAuNCAxOC45LDIxLjggMTguMiwyMS44IDE4LjIsMjAuNCAxNi44LDIwLjQgCQkJIi8+DQoJCQk8cG9seWdvbiBjbGFzcz0ic3QxMSIgcG9pbnRzPSIxNCwyMC40IDE0LDIxLjEgMTQuNiwyMS4xIDE0LjYsMjAuNCAxNS4zLDIwLjQgMTUuMywxOS42IDE0LjYsMTkuNiAxNC42LDE4LjkgMTYuMSwxOC45IA0KCQkJCTE2LjEsMTguMiAxNy41LDE4LjIgMTcuNSwxOC45IDE2LjgsMTguOSAxNi44LDE5LjYgMTYsMTkuNiAxNiwyMC40IDE1LjMsMjAuNCAxNS4zLDIxLjEgMTYuOSwyMS4xIDE2LjksMjEuOCAxMi41LDIxLjggDQoJCQkJMTIuNSwyMS4xIDEyLjUsMjEuMSAxMi41LDIwLjQgCQkJIi8+DQoJCTwvZz4NCgkJPGc+DQoJCQk8Zz4NCgkJCQk8cGF0aCBjbGFzcz0ic3QxMiIgZD0iTTMwLjEsMTQuMWMwLjIsMCwwLjQtMC4yLDAuNC0wLjRWOS45YzAtMC4yLTAuMi0wLjQtMC40LTAuNGgtMy44Yy0wLjIsMC0wLjQsMC4yLTAuNCwwLjRzMC4yLDAuNCwwLjQsMC40DQoJCQkJCWgzLjR2My40QzI5LjcsMTMuOSwyOS45LDE0LjEsMzAuMSwxNC4xeiIvPg0KCQkJPC9nPg0KCQkJPGc+DQoJCQkJPHBhdGggY2xhc3M9InN0MTIiIGQ9Ik05LjksMTQuMWMwLjIsMCwwLjQtMC4yLDAuNC0wLjR2LTMuNGgzLjRjMC4yLDAsMC40LTAuMiwwLjQtMC40cy0wLjItMC40LTAuNC0wLjRIOS45DQoJCQkJCWMtMC4yLDAtMC40LDAuMi0wLjQsMC40djMuOEM5LjUsMTMuOSw5LjcsMTQuMSw5LjksMTQuMXoiLz4NCgkJCTwvZz4NCgkJCTxnPg0KCQkJCTxwYXRoIGNsYXNzPSJzdDEyIiBkPSJNMjYuNCwzMC41aDMuOGMwLjIsMCwwLjQtMC4yLDAuNC0wLjR2LTMuOGMwLTAuMi0wLjItMC40LTAuNC0wLjRjLTAuMiwwLTAuNCwwLjItMC40LDAuNHYzLjRoLTMuNA0KCQkJCQljLTAuMiwwLTAuNCwwLjItMC40LDAuNFMyNi4xLDMwLjUsMjYuNCwzMC41eiIvPg0KCQkJPC9nPg0KCQkJPGc+DQoJCQkJPHBhdGggY2xhc3M9InN0MTIiIGQ9Ik05LjksMzAuNWgzLjhjMC4yLDAsMC40LTAuMiwwLjQtMC40YzAtMC4yLTAuMi0wLjQtMC40LTAuNGgtMy40di0zLjRjMC0wLjItMC4yLTAuNC0wLjQtMC40DQoJCQkJCXMtMC40LDAuMi0wLjQsMC40djMuOEM5LjUsMzAuMyw5LjcsMzAuNSw5LjksMzAuNXoiLz4NCgkJCTwvZz4NCgkJPC9nPg0KCTwvZz4NCjwvZz4NCjxnIGNsYXNzPSJzdDIiPg0KCTxwYXRoIGNsYXNzPSJzdDEzIiBkPSJNMTEuNCwzNi40aDE4LjdjMC0wLjksMC0xLjksMC0yLjdjLTAuMS0xLjItMC40LTIuNC0wLjktMy41bC0yLjMtNWMwLDAtMy41LTAuOS00LjQtMC40DQoJCWMtMy4yLDEuNi02LjgsMC43LTYuOCwwLjd2LTAuMWMtMC4xLDAtMC4xLDAuMS0wLjEsMC4xYy0wLjUsMC45LTEuMiwxLjktMS42LDIuOGMtMS4xLDIuNi0yLjksNS0yLjYsNy44DQoJCUMxMS4zLDM2LjIsMTEuMywzNi4zLDExLjQsMzYuNHoiLz4NCgk8ZyBpZD0iaGVhZCIgY2xhc3M9InN0OCI+DQoJCTxwYXRoIGNsYXNzPSJzdDE0IiBkPSJNMTAuMSwxMS43YzAsMC41LTAuMSwwLjktMC4xLDEuNGMtMC4xLDAuOS0wLjQsMi0xLjEsMi41Yy0wLjEsMC4xLTAuMiwwLjEtMC4zLDAuMmMtMC4yLDAuMiwwLDAuNCwwLjIsMC41DQoJCQlDOC45LDE2LjQsOSwxNi40LDksMTYuNXMwLDAuMiwwLjEsMC4zYzAuMSwwLjgsMC40LDEuNywwLjcsMi40YzAuMiwwLjQsMC40LDAuOSwwLjgsMS4yYzAuNCwwLjMsMC44LDAuMywxLjIsMC4zDQoJCQljMS41LDAsMy0wLjgsNC4yLTEuOGMwLjktMC44LDIuMi0xLjQsMi45LTIuNGMxLjItMS44LDEtNC4zLDEuMy02LjJjMC0wLjMtMS4yLTAuNy0xLjUtMC44cy0wLjgsMC4xLTEuMSwwLjENCgkJCWMtMC44LDAuMS0xLjYsMC4xLTIuMywwLjJjLTEuNSwwLjEtMy4xLDAuMy00LjYsMC40Yy0wLjEsMC0wLjEsMC0wLjIsMGMtMC4xLDAtMC4xLDAuMS0wLjEsMC4yQzEwLjMsMTAuOCwxMC4yLDExLjIsMTAuMSwxMS43eiINCgkJCS8+DQoJCTxwYXRoIGNsYXNzPSJzdDE0IiBkPSJNMTYuMywxNy45bC0wLjcsNy41YzAsMCw1LjksMS40LDkuNC0yLjhjMCwwLTUuNC02LjktNy41LThMMTYuMywxNy45eiIvPg0KCQk8ZWxsaXBzZSBjbGFzcz0ic3QxNSIgY3g9IjExLjkiIGN5PSIxMy4zIiByeD0iMC4zIiByeT0iMC41Ii8+DQoJCTxwYXRoIGNsYXNzPSJzdDE1IiBkPSJNMTEuNSwxN2MwLjIsMC43LTAuMSwxLjQtMC43LDEuNmMtMC41LDAuMi0xLjEtMC4zLTEuMy0xTDExLjUsMTd6Ii8+DQoJCTxwYXRoIGNsYXNzPSJzdDE1IiBkPSJNMTIuNiwxMi41TDEyLjYsMTIuNWMwLjEsMCwwLjEtMC4xLDAuMS0wLjFjLTAuMS0wLjQtMC41LTAuNi0wLjktMC41Yy0wLjEsMC0wLjEsMC4xLTAuMSwwLjENCgkJCWMwLDAuMSwwLjEsMC4xLDAuMSwwLjFDMTIuMSwxMS45LDEyLjQsMTIuMSwxMi42LDEyLjVDMTIuNSwxMi40LDEyLjUsMTIuNSwxMi42LDEyLjV6Ii8+DQoJCTxwYXRoIGNsYXNzPSJzdDE2IiBkPSJNMTguMSwxMy45TDE4LjEsMTMuOWMwLjEtMC4xLDAuMS0wLjIsMC4xLTAuMmMtMC4xLTAuMS0wLjEtMC4yLDAtMC4zYzAtMC4yLDAuMS0wLjMsMC4zLTAuNA0KCQkJYzAuMy0wLjEsMC41LDAsMC43LDAuMmMwLDAuMSwwLjEsMC4xLDAuMiwwYzAsMCwwLjEtMC4xLDAtMC4yYy0wLjMtMC40LTAuNy0wLjUtMS0wLjNjLTAuMiwwLjEtMC4zLDAuMy0wLjQsMC42DQoJCQlDMTcuOCwxMy41LDE3LjksMTMuNywxOC4xLDEzLjlDMTgsMTMuOSwxOCwxMy45LDE4LjEsMTMuOXoiLz4NCgk8L2c+DQoJPGcgaWQ9ImhhaXIiIGNsYXNzPSJzdDgiPg0KCQk8cGF0aCBjbGFzcz0ic3QxMSIgZD0iTTI4LjksMjkuNmMtMC41LTAuMi0wLjctMS43LTIuMy0xLjdjLTEuMiwwLTIuMiwwLjYtMy41LDBjLTAuNi0wLjMtMS4yLTAuOS0xLjUtMS42Yy0wLjYtMS42LDAuNC00LTEtNS4zDQoJCQljLTAuNy0wLjYtMS42LTAuOS0yLTEuOGMtMC41LTEuMS0wLjUtMi4zLTAuNC0zLjVjMC0wLjEsMC0wLjMsMC4xLTAuNGMwLjEtMC4xLDAuMy0wLjEsMC40LTAuMmMwLjgtMC4yLDEuNC0xLjMsMS0yLjENCgkJCWMtMC40LTAuOC0xLjctMC44LTIsMGMtMC4xLDAuMy0wLjIsMC42LTAuNSwwLjZzLTAuMy0wLjQtMC4zLTAuN2MwLjEtMC40LDAuMi0yLjYsMC4zLTNjMCwwLjEtMC42LDAuNC0wLjcsMC40DQoJCQljLTAuNiwwLjMtMS4zLDAuNi0yLDAuN2MtMSwwLjItMS45LDAuMy0yLjksMC4zYy0wLjcsMC0xLjQtMC4xLTIuMi0wLjNjLTAuNy0wLjEtMS40LTAuMy0xLjktMC44QzYuNyw5LjMsNyw4LDcuNSw3DQoJCQljMC42LTEuMSwxLjctMS43LDIuOS0yYzAuMy0wLjEsMC42LTAuMSwwLjgtMC4xYzEuMy0wLjEsMi42LDAuMywzLjksMC41YzEuNCwwLjIsMi43LDAuMiw0LjEsMC42YzEuNiwwLjQsMywxLjUsMy45LDIuOQ0KCQkJYzEuMSwxLjYsMS4yLDMuNiwyLjEsNS4yYzEuMywyLjUsMy4zLDEuNCw2LDQuOGMwLjgsMSwwLjgsMi4zLDEsMy42YzAuMSwwLjYsMC4zLDEuMiwwLjYsMS43YzAuNCwwLjUsMC45LDAuOSwxLjIsMS42DQoJCQljMC40LDEuMSwwLjMsMi43LTAuNywzLjNjLTAuNCwwLjItMC43LDAuNC0wLjksMC44cy0wLjMsMC45LTAuNiwxLjNjLTAuMiwwLjMtMC40LDAuNS0wLjcsMC42Yy0wLjIsMC4xLTAuOSwwLjMtMS4xLDAuMWwtMC41LTAuOA0KCQkJTDI4LjksMjkuNnoiLz4NCgkJPHBhdGggY2xhc3M9InN0MTciIGQ9Ik05LjEsNi45YzAtMC4yLDAuMS0wLjMsMC4yLTAuNWMwLjItMC4zLDAuNS0wLjYsMC45LTAuN2MwLjYtMC4yLDEuMi0wLjEsMS43LDAuMXMxLDAuNCwxLjUsMC43DQoJCQljMC41LDAuMywxLDAuNCwxLjYsMC41YzAuMSwwLDAuMiwwLDAuMywwczAuMSwwLjIsMCwwLjJjLTAuNiwwLTEuMi0wLjItMS44LTAuNGMtMC41LTAuMi0wLjktMC41LTEuNC0wLjdjLTAuMy0wLjEtMC42LTAuMi0xLTAuMw0KCQkJYy0wLjMtMC4xLTAuNS0wLjEtMC44LDBDMTAuMSw2LDkuOCw2LjIsOS42LDYuNWwwLDBsMCwwYzAsMCwwLDAuMS0wLjEsMC4xYzAsMC4xLTAuMSwwLjEtMC4xLDAuMmMwLDAsMCwwLDAsMC4xbDAsMGwwLDANCgkJCWMwLDAsMCwwLDAsMC4xbDAsMEM5LjMsNy4xLDkuMSw3LjEsOS4xLDYuOUw5LjEsNi45eiIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxNyIgZD0iTTI4LjIsMjYuNkMyOC4yLDI2LjYsMjguMywyNi42LDI4LjIsMjYuNmMwLjEtMC4xLDAuMS0wLjIsMC0wLjJzLTAuMy0wLjEtMC40LTAuMWMtMC45LTAuMi0xLjgtMC40LTIuNi0wLjkNCgkJCWMtMC45LTAuNi0xLTEuNC0xLjItMi40YzAtMC4yLTAuMS0wLjQtMC4xLTAuN2MtMC4yLTAuNy0wLjQtMS40LTAuOC0ycy0wLjktMS4xLTEuNS0xLjRjLTEuNC0wLjgtMi0xLjgtMS43LTMNCgkJCWMwLTAuMSwwLTAuMS0wLjEtMC4xcy0wLjEsMC0wLjEsMC4xYy0wLjIsMC43LTAuMSwxLjQsMC40LDJjMC4zLDAuNSwwLjgsMC45LDEuNSwxLjNjMSwwLjYsMS44LDEuOCwyLjIsMy4zDQoJCQljMC4xLDAuMiwwLjEsMC40LDAuMSwwLjZjMC4yLDEsMC40LDEuOSwxLjMsMi42YzAuOCwwLjUsMS44LDAuNywyLjcsMC45QzI3LjksMjYuNSwyOCwyNi42LDI4LjIsMjYuNkwyOC4yLDI2LjZ6Ii8+DQoJCTxwYXRoIGNsYXNzPSJzdDE3IiBkPSJNMjIuOCwxMC4zYzAuNCwxLDEsMS45LDEuNywyLjVjMC43LDAuNywxLjYsMS4xLDIuNiwxLjNjMS4xLDAuMiwyLjMsMCwzLjMsMC40YzAuNSwwLjIsMC45LDAuNSwxLjMsMC45DQoJCQlzMC42LDAuOSwwLjgsMS40YzAuNSwxLjIsMC42LDIuNSwwLjYsMy44YzAsMC4yLDAsMC4zLDAsMC41YzAsMC4xLTAuMiwwLjEtMC4yLDBjMC0xLjMsMC0yLjctMC41LTMuOWMtMC40LTEtMS0yLTItMi40DQoJCQljLTEuMS0wLjUtMi4yLTAuMy0zLjMtMC41Yy0xLTAuMS0xLjktMC42LTIuNy0xLjJjLTAuOC0wLjYtMS40LTEuNS0xLjgtMi40Yy0wLjEtMC4xLTAuMS0wLjItMC4xLTAuNGMwLTAuMSwwLTAuMSwwLjEtMC4xDQoJCQlDMjIuOCwxMC4yLDIyLjgsMTAuMywyMi44LDEwLjNMMjIuOCwxMC4zeiIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxNyIgZD0iTTI4LDE4YzAuMi0wLjEsMC4zLDAsMC40LDAuMnMwLjEsMC40LDAsMC42cy0wLjIsMC40LTAuMSwwLjZjMCwwLjIsMC4xLDAuMywwLjIsMC4zYzAuMywwLjIsMC43LDAuMiwxLDAuMw0KCQkJYzAuNCwwLjEsMC44LDAuMywxLjEsMC43YzAuMywwLjMsMC41LDAuOCwwLjQsMS4yYzAsMC4yLTAuMSwwLjQtMC4xLDAuN2MtMC4xLDAuMi0wLjEsMC40LDAsMC43YzAuMSwwLjIsMC4yLDAuNCwwLjQsMC41DQoJCQljMC4yLDAuMiwwLjMsMC4zLDAuNCwwLjVjMC4zLDAuMywwLjUsMC43LDAuNiwxLjJjMC4xLDAuNCwwLjEsMC44LDAsMS4xYy0wLjEsMC4zLTAuMywwLjYtMC42LDAuOGMtMC4xLDAtMC4xLDAuMS0wLjIsMC4xDQoJCQlzLTAuMS0wLjEsMC0wLjJjMC42LTAuMSwwLjktMSwwLjgtMS42Yy0wLjEtMC40LTAuMy0wLjgtMC41LTEuMmMtMC4xLTAuMi0wLjMtMC4zLTAuNC0wLjVjLTAuMS0wLjEtMC4zLTAuMy0wLjQtMC41DQoJCQlzLTAuMi0wLjQtMC4yLTAuNnMwLjEtMC40LDAuMi0wLjdjMC4xLTAuNCwwLTAuOS0wLjItMS4yYy0wLjItMC40LTAuNi0wLjYtMC45LTAuOGMtMC4zLTAuMS0wLjctMC4yLTEtMC4zDQoJCQljLTAuMy0wLjEtMC41LTAuMy0wLjYtMC43YzAtMC4yLDAuMS0wLjQsMC4yLTAuNnMwLjEtMC40LTAuMS0wLjVjMC0wLjEtMC4xLTAuMS0wLjIsMEMyOCwxOC4yLDI3LjksMTgsMjgsMThMMjgsMTh6Ii8+DQoJCTxwYXRoIGNsYXNzPSJzdDE3IiBkPSJNMTAuNCw1YzAuNS0wLjgsMS40LTEuMiwyLjMtMS4xYzAuNSwwLjEsMC45LDAuNCwxLjQsMC42YzAuNCwwLjMsMSwwLjUsMS41LDAuM2MwLjQtMC4xLDAuOC0wLjYsMC42LTEuMQ0KCQkJYzAtMC4xLDAtMC4xLDAtMC4yaDAuMWMwLjIsMC41LDAsMC45LTAuNCwxLjJzLTEsMC4zLTEuNSwwLjFjLTAuNCwwLTAuOS0wLjQtMS40LTAuNmMtMC40LTAuMi0wLjktMC4yLTEuMywwDQoJCQljLTAuNSwwLjEtMC45LDAuNS0xLjIsMC45QzEwLjUsNS4xLDEwLjQsNS4yLDEwLjQsNUMxMC40LDUuMSwxMC4zLDUsMTAuNCw1TDEwLjQsNXoiLz4NCgkJPHBhdGggY2xhc3M9InN0MTciIGQ9Ik0zMi40LDIzLjRjMCwwLjYsMC4zLDEuMSwwLjcsMS41czAuOSwwLjcsMS4zLDEuMmMwLjQsMC41LDAuNiwxLjEsMC41LDEuN2MwLDAuNi0wLjIsMS4yLTAuNiwxLjYNCgkJCWMtMC4xLDAuMS0wLjIsMC4yLTAuMywwLjNjLTAuMSwwLjEtMC4zLDAuMi0wLjQsMC4zYy0wLjIsMC4yLTAuNSwwLjUtMC41LDAuOGMwLDAuMS0wLjEsMC4xLTAuMSwwYy0wLjEtMC4zLDAuMS0wLjYsMC4zLTAuOA0KCQkJYzAuMi0wLjIsMC41LTAuNCwwLjctMC42YzAuNC0wLjQsMC43LTAuOSwwLjctMS41YzAuMS0wLjYtMC4xLTEuMy0wLjQtMS44Yy0wLjMtMC41LTAuOS0wLjgtMS4zLTEuMmMtMC41LTAuNC0wLjktMS0wLjktMS43DQoJCQlDMzIuMywyMy4zLDMyLjQsMjMuMywzMi40LDIzLjRMMzIuNCwyMy40eiIvPg0KCTwvZz4NCgk8ZyBjbGFzcz0ic3Q4Ij4NCgkJPHBhdGggY2xhc3M9InN0MTQiIGQ9Ik03LjYsMzUuMWMwLDAsMC4xLDAuNSwwLjQsMS4zaDMuMmMtMC40LTAuOC0wLjctMS41LTAuOS0yTDEwLDMzLjdjMCwwLDAuNi0yLjUsMS4zLTMuNg0KCQkJYzAuNC0wLjYsMC42LTAuOSwwLjctMWMwLjEtMC4xLDAuMS0wLjEsMC4xLTAuMXMwLjItMC43LTAuNi0wLjNjLTAuNywwLjQtMS4yLDEuMy0xLjcsMS45YzAtMC4xLTEuOC00LjQtMi41LTUuNw0KCQkJYy0xLjEtMi0wLjgtMC4yLTAuOC0wLjJsMC44LDIuOGMwLDAtMS4zLDAuNy0yLjEsMS41czIuMiw1LjEsMi4yLDUuMUw3LjYsMzUuMXoiLz4NCgkJPHBhdGggY2xhc3M9InN0MTQiIGQ9Ik0zMCwzNi40YzAuMS0wLjMsMC4xLTAuNSwwLjItMC44YzAuNS0yLjEsMC43LTQuNy0wLjctNi4zYy0wLjItMC4yLTIuMi0xLjctMi41LTEuMmMwLDAtMi40LDQuMS00LjksOC4zSDMwDQoJCQl6Ii8+DQoJPC9nPg0KPC9nPg0KPGc+DQoJPHBhdGggY2xhc3M9InN0MTgiIGQ9Ik0yMCwxMy4zYy0xLjktMS4xLTUuMy0xLjgtOC41LDBDOC4zLDE1LjIsNy4xLDE5LjUsOCwyMy45YzEsNC40LDQuNSw5LjksNi45LDEwLjhjMS42LDAuNiw0LjEtMC43LDUuMi0wLjQNCgkJYzEuMSwwLjMsMi42LDEuMyw1LjcsMGMzLjEtMS40LDUuNS04LjEsNi4zLTEyLjRzLTEuOS03LjktNS41LTkuMlMyMCwxMy4zLDIwLDEzLjN6Ii8+DQoJPHBhdGggY2xhc3M9InN0MTkiIGQ9Ik0xOS43LDE1LjFjMi4yLTAuMSwyLTEuOSw0LjgtMi44Yy0yLjYtMC4yLTQuNSwxLTQuNSwxYy0xLjMtMC44LTMuMy0xLjQtNS41LTENCgkJQzE2LjksMTIuNCwxNy42LDE1LjIsMTkuNywxNS4xeiIvPg0KCTxwYXRoIGNsYXNzPSJzdDIwIiBkPSJNMTkuNCwxNS4xQzE5LjMsMTEuMywyMSw2LjUsMjMuMSw1YzAuMywwLjMsMC43LDEsMC43LDFzLTMuNiwzLjMtMy43LDkuMUMyMCwxNS4yLDE5LjQsMTUuMSwxOS40LDE1LjF6Ii8+DQoJPHBhdGggY2xhc3M9InN0MjEiIGQ9Ik0yMCwxMC42Yy0wLjQsMS41LTAuNiwzLjEtMC42LDQuNWMwLDAsMC42LDAuMSwwLjcsMGMwLTAuOSwwLjEtMS43LDAuMy0yLjVDMTkuOSwxMi41LDE5LjgsMTEuOCwyMCwxMC42eiIvPg0KCTxwYXRoIGNsYXNzPSJzdDE5IiBkPSJNMTcuNiwxNC42YzAuNCwwLjEsMC44LDAuMSwxLjIsMC4yYzAuNCwwLDAuNywwLjEsMS4xLDAuMXMwLjcsMCwxLjEtMC4xYzAuMiwwLDAuNC0wLjEsMC42LTAuMQ0KCQlzMC40LTAuMSwwLjYtMC4xYy0wLjEsMC4xLTAuMiwwLjEtMC4yLDAuMmMtMC4xLDAuMS0wLjIsMC4xLTAuMywwLjJjLTAuMiwwLjEtMC40LDAuMi0wLjYsMC4zYy0wLjQsMC4xLTAuOCwwLjItMS4yLDAuMg0KCQljLTAuMSwwLTAuMiwwLTAuMywwYy0wLjEsMC0wLjIsMC0wLjMsMGMtMC4xLDAtMC4yLDAtMC4zLTAuMWMtMC4xLDAtMC4yLTAuMS0wLjMtMC4xQzE4LjMsMTUuMSwxNy45LDE0LjksMTcuNiwxNC42eiIvPg0KCTxwYXRoIGNsYXNzPSJzdDIyIiBkPSJNMjMuNiw1LjRjMC4yLDAuMywwLjMsMC41LDAuMiwwLjZjLTAuMSwwLjEtMC4zLTAuMS0wLjUtMC40QzIzLjEsNS4zLDIzLDUuMSwyMy4xLDUNCgkJQzIzLjIsNSwyMy40LDUuMSwyMy42LDUuNHoiLz4NCgk8cGF0aCBjbGFzcz0ic3QyMyIgZD0iTTEwLjMsNS4zYzAuNCwxLjYsMy45LDUuOSw5LjgsNS4yQzE5LDYuMywxNyw1LjksMTQuOCw1LjhDMTIuNSw1LjcsMTAuMyw1LjMsMTAuMyw1LjN6Ii8+DQoJPHBhdGggY2xhc3M9InN0MjQiIGQ9Ik0xNC44LDcuOGMtMS44LTAuNi0zLjQtMS40LTQuNS0yLjVsMCwwYzAuNCwxLjYsMy45LDUuOSw5LjgsNS4yQzE4LjQsOC4zLDE2LjksOC41LDE0LjgsNy44eiIvPg0KCTxwYXRoIGNsYXNzPSJzdDI1IiBkPSJNMTIuNCw2LjhjMC43LDAuMiwxLjQsMC41LDIsMC43YzAuMywwLjEsMC43LDAuMiwxLDAuM2MwLjMsMC4xLDAuNywwLjIsMSwwLjNsMC4zLDAuMWMwLjEsMCwwLjIsMCwwLjMsMC4xDQoJCWMwLjIsMCwwLjQsMC4xLDAuNSwwLjJjMC4yLDAuMSwwLjMsMC4yLDAuNSwwLjJjMC4yLDAuMSwwLjMsMC4yLDAuNSwwLjNjMC4zLDAuMiwwLjYsMC40LDAuOCwwLjdjMC4zLDAuMywwLjUsMC41LDAuNywwLjgNCgkJYy0wLjMtMC4zLTAuNS0wLjUtMC44LTAuN3MtMC42LTAuNC0wLjktMC42QzE4LDksMTcuNyw4LjksMTcuNCw4LjhjLTAuMi0wLjEtMC4zLTAuMS0wLjUtMC4yYy0wLjEsMC0wLjIsMC0wLjMtMC4xDQoJCWMtMC4xLDAtMC4yLDAtMC4zLTAuMWMtMC43LTAuMi0xLjQtMC40LTIuMS0wLjdDMTMuNyw3LjUsMTMuMSw3LjIsMTIuNCw2Ljh6Ii8+DQoJPHBhdGggY2xhc3M9InN0MTkiIGQ9Ik0xMi40LDEyLjljLTAuMywwLjEtMC42LDAuMy0wLjksMC40QzguMywxNS4yLDcuMSwxOS41LDgsMjMuOWMxLDQuNCw0LjUsOS45LDYuOSwxMC44DQoJCWMxLjYsMC42LDQuMS0wLjcsNS4yLTAuNGMxLjEsMC4zLDIuNiwxLjMsNS43LDBjMi4xLTEsNC00LjUsNS4yLTguMUMyMi4xLDM1LjIsOC4xLDI0LjEsMTIuNCwxMi45eiIvPg0KCTxwYXRoIGNsYXNzPSJzdDI2IiBkPSJNMjEuNiwzMy42Yy0yLjktMS40LTMuNCwwLjYtNS45LDAuMmMtMi4xLTAuNC02LjQtNi4zLTcuOC0xMS4xQzgsMjMuMSw4LDIzLjUsOC4xLDIzLjkNCgkJYzEsNC40LDQuNSw5LjksNi45LDEwLjhjMS42LDAuNiw0LjEtMC43LDUuMi0wLjRzMi42LDEuMyw1LjcsMGMwLjQtMC4yLDAuOS0wLjUsMS4zLTAuOUMyNS41LDM0LjMsMjMuNSwzNC41LDIxLjYsMzMuNnoiLz4NCjwvZz4NCjwvc3ZnPg0K';

const Message = {
  when_received_block: {
    'ja': '認識の候補を受け取ったとき',
    'ja-Hira': 'にんしきのこうほをうけとったとき',
    'en': 'when received classification candidates',
    'zh-cn': '收到分类候选人时',
    'ko': '분류 후보를 받았을 때',
    'de': 'wenn erhalten Klassifizierungskandidaten',
    'es': 'cuando recibieron candidatos de clasificación',
    'ru': 'когда получены классификационные кандидаты',
    'sr': 'kada su primljeni kandidati za klasifikaciju'
  },
  result1: {
    'ja': '候補1',
    'ja-Hira': 'こうほ1',
    'en': 'candidate1',
    'zh-cn': '候选人1',
    'ko': '후보1',
    'de': 'Kandidat1',
    'es': 'candidato1',
    'ru': 'кандидат1',
    'sr': 'kandidat1'
  },
  result2: {
    'ja': '候補2',
    'ja-Hira': 'こうほ2',
    'en': 'candidate2',
    'zh-cn': '候选人2',
    'ko': '후보2',
    'de': 'Kandidat2',
    'es': 'candidato2',
    'ru': 'кандидат2',
    'sr': 'kandidat2'
  },
  result3: {
    'ja': '候補3',
    'ja-Hira': 'こうほ3',
    'en': 'candidate3',
    'zh-cn': '候选人3',
    'ko': '후보3',
    'de': 'Kandidat3',
    'es': 'candidato3',
    'ru': 'кандидат3',
    'sr': 'kandidat3'
  },
  confidence1: {
    'ja': '確信度1',
    'ja-Hira': 'かくしんど1',
    'en': 'confidence1',
    'zh-cn': '置信1',
    'ko': '신뢰도1',
    'de': 'Vertrauen1',
    'es': 'confianza1',
    'ru': 'уверенность1',
    'sr': 'pouzdanje1'
  },
  confidence2: {
    'ja': '確信度2',
    'ja-Hira': 'かくしんど2',
    'en': 'confidence2',
    'zh-cn': '置信2',
    'ko': '신뢰도2',
    'de': 'Vertrauen2',
    'es': 'confianza2',
    'ru': 'уверенность2',
    'sr': 'pouzdanje2'
  },
  confidence3: {
    'ja': '確信度3',
    'ja-Hira': 'かくしんど3',
    'en': 'confidence3',
    'zh-cn': '置信3',
    'ko': '신뢰도3',
    'de': 'Vertrauen3',
    'es': 'confianza3',
    'ru': 'уверенность3',
    'sr': 'pouzdanje3'
  },
  toggle_classification: {
    'ja': '画像認識を[CLASSIFICATION_STATE]にする',
    'ja-Hira': 'がぞうにんしきを[CLASSIFICATION_STATE]にする',
    'en': 'turn classification [CLASSIFICATION_STATE]',
    'zh-cn': '打开分类 [CLASSIFICATION_STATE]',
    'ko': '분류 [CLASSIFICATION_STATE]',
    'de': 'Klassifizierung einschalten [CLASSIFICATION_STATE]',
    'es': 'activar clasificación [CLASSIFICATION_STATE]',
    'ru': 'включить классификацию [CLASSIFICATION_STATE]',
    'sr': 'uključiti klasifikaciju [CLASSIFICATION_STATE]'
  },
  set_classification_interval: {
    'ja': '画像認識を[CLASSIFICATION_INTERVAL]秒間に1回行う',
    'ja-Hira': 'がぞうにんしきを[CLASSIFICATION_INTERVAL]びょうかんに1かいおこなう',
    'en': 'Classify once every [CLASSIFICATION_INTERVAL] seconds',
    'zh-cn': '每[CLASSIFICATION_INTERVAL]秒分类一次',
    'ko': '[CLASSIFICATION_INTERVAL]초마다 한 번씩 분류',
    'de': 'Klassifizieren Sie einmal alle [CLASSIFICATION_INTERVAL] Sekunden',
    'es': 'Clasifica una vez cada [CLASSIFICATION_INTERVAL] segundos',
    'ru': 'Классифицировать каждые [CLASSIFICATION_INTERVAL] секунду',
    'sr': 'Klasificirajte jednom u [CLASSIFICATION_INTERVAL] sekundi'
  },
  video_toggle: {
    'ja': 'ビデオを[VIDEO_STATE]にする',
    'ja-Hira': 'ビデオを[VIDEO_STATE]にする',
    'en': 'turn video [VIDEO_STATE]',
    'zh-cn': '打开视频[VIDEO_STATE]',
    'ko': '비디오 [VIDEO_STATE]',
    'de': 'Video einschalten [VIDEO_STATE]',
    'es': 'encender video [VIDEO_STATE]',
    'ru': 'включить видео [VIDEO_STATE]',
    'sr': 'uključiti video [VIDEO_STATE]'
  },
  on: {
    'ja': '入',
    'ja-Hira': 'いり',
    'en': 'on',
    'ko': '켜기',
    'zh-cn': '打开',
    'de': 'ein',
    'es': 'activar',
    'ru': 'включить',
    'sr': 'uključiti'
  },
  off: {
    'ja': '切',
    'ja-Hira': 'きり',
    'en': 'off',
    'ko': '끄기',
    'zh-cn': '关闭',
    'de': 'aus',
    'es': 'desactivar',
    'ru': 'выключить',
    'sr': 'isključiti'
  },
  video_on_flipped: {
    'ja': '左右反転',
    'ja-Hira': 'さゆうはんてん',
    'en': 'on flipped',
    'ko': '뒤집힌 상태로 켜기',
    'zh-cn': '镜像开启',
    'de': 'auf gespiegelt',
    'es': 'invertir',
    'ru': 'включить в обратную',
    'sr': 'измени укљученост'
  },
}

const AvailableLocales = ['en', 'ja', 'ja-Hira', 'zh-cn', 'ko', 'de', 'es', 'ru', 'sr'];

class Scratch3ImageClassifierBlocks {
  constructor (runtime) {
    this.runtime = runtime;
    this.when_received = false;
    this.results = [];
    this.locale = this.setLocale();

    this.video = document.createElement("video");
    this.video.width = 480;
    this.video.height = 360;
    this.video.autoplay = true;
    this.video.style.display = "none";

    this.blockClickedAt = null;

    this.interval = 1000;

    let media = navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });

    media.then((stream) => {
      this.video.srcObject = stream;
    });

    this.classifier = ml5.imageClassifier('MobileNet', () => {
      console.log('Model Loaded!');
      this.timer = setInterval(() => {
        this.classify();
      }, this.interval);
    });

    this.runtime.ioDevices.video.enableVideo();
  }

  getInfo() {
    this.locale = this.setLocale();

    return {
      id: 'ic2scratch',
      name: 'Cubroid Image Classifier',
      blockIconURI: blockIconURI,
      blocks: [
        {
          opcode: 'getResult1',
          text: Message.result1[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getResult2',
          text: Message.result2[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getResult3',
          text: Message.result3[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getConfidence1',
          text: Message.confidence1[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getConfidence2',
          text: Message.confidence2[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getConfidence3',
          text: Message.confidence3[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'whenReceived',
          text: Message.when_received_block[this.locale],
          blockType: BlockType.HAT,
        },
        {
          opcode: 'toggleClassification',
          text: Message.toggle_classification[this.locale],
          blockType: BlockType.COMMAND,
          arguments: {
            CLASSIFICATION_STATE: {
              type: ArgumentType.STRING,
              menu: 'classification_menu',
              defaultValue: 'off'
            }
          }
        },
        {
          opcode: 'setClassificationInterval',
          text: Message.set_classification_interval[this.locale],
          blockType: BlockType.COMMAND,
          arguments: {
            CLASSIFICATION_INTERVAL: {
              type: ArgumentType.STRING,
              menu: 'classification_interval_menu',
              defaultValue: '1'
            }
          }
        },
        {
          opcode: 'videoToggle',
          text: Message.video_toggle[this.locale],
          blockType: BlockType.COMMAND,
          arguments: {
            VIDEO_STATE: {
              type: ArgumentType.STRING,
              menu: 'video_menu',
              defaultValue: 'off'
            }
          }
        }
      ],
      menus: {
        video_menu: this.getVideoMenu(),
        classification_interval_menu: this.getClassificationIntervalMenu(),
        classification_menu: this.getClassificationMenu()
      }
    };
  }

  getResult1() {
    return this.results[0]['label'];
  }

  getResult2() {
    return this.results[1]['label'];
  }

  getResult3() {
    return this.results[2]['label'];
  }

  getConfidence1() {
    return this.results[0]['confidence'];
  }

  getConfidence2() {
    return this.results[1]['confidence'];
  }

  getConfidence3() {
    return this.results[2]['confidence'];
  }

  whenReceived(args) {
    if (this.when_received) {
      setTimeout(() => {
          this.when_received = false;
      }, HAT_TIMEOUT);
      return true;
    }
    return false;
  }

  toggleClassification (args) {
    if (this.actionRepeated()) { return };

    let state = args.CLASSIFICATION_STATE;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (state === 'on') {
      this.timer = setInterval(() => {
        this.classify();
      }, this.interval);
    }
  }

  setClassificationInterval (args) {
    if (this.actionRepeated()) { return };

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.interval = args.CLASSIFICATION_INTERVAL * 1000;
    this.timer = setInterval(() => {
      this.classify();
    }, this.interval);
  }

  videoToggle (args) {
    if (this.actionRepeated()) { return };

    let state = args.VIDEO_STATE;
    if (state === 'off') {
      this.runtime.ioDevices.video.disableVideo();
    } else {
      this.runtime.ioDevices.video.enableVideo();
      this.runtime.ioDevices.video.mirror = state === "on";
    }
  }

  classify() {
    this.classifier.classify(this.video, (err, results) => {
      if (err) {
        console.error(err);
      } else {
        this.when_received = true;
        this.results = results;
      }
    });
  }

  actionRepeated() {
    let currentTime = Date.now();
    if (this.blockClickedAt && (this.blockClickedAt + 250) > currentTime) {
      console.log('Please do not repeat trigerring this block.');
      this.blockClickedAt = currentTime;
      return true;
    } else {
      this.blockClickedAt = currentTime;
      return false;
    }
  }

  getVideoMenu() {
    return [
      {
        text: Message.off[this.locale],
        value: 'off'
      },
      {
        text: Message.on[this.locale],
        value: 'on'
      },
      {
        text: Message.video_on_flipped[this.locale],
        value: 'on-flipped'
      }
    ]
  }

  getClassificationIntervalMenu() {
    return [
      {
        text: '5',
        value: '5'
      },
      {
        text: '2',
        value: '2'
      },
      {
        text: '1',
        value: '1'
      },
      {
        text: '0.5',
        value: '0.5'
      }
    ]
  }

  getClassificationMenu() {
    return [
      {
        text: Message.off[this.locale],
        value: 'off'
      },
      {
        text: Message.on[this.locale],
        value: 'on'
      }
    ]
  }

  setLocale() {
    let locale = formatMessage.setup().locale;
    if (AvailableLocales.includes(locale)) {
      return locale;
    } else {
      return 'en';
    }
  }
}

module.exports = Scratch3ImageClassifierBlocks;