const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const MathUtil = require('../../util/math-util');
const log = require('../../util/log');
const ml5 = require('ml5');
const formatMessage = require('format-message');
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHdpZHRoPSI0MHB4IiBoZWlnaHQ9IjQwcHgiIHZpZXdCb3g9IjAgMCA0MCA0MCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDAgNDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtkaXNwbGF5Om5vbmU7ZmlsbDojRkZGRkZGO30NCgkuc3Qxe2Rpc3BsYXk6bm9uZTtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOiNGRkZGRkY7fQ0KCS5zdDJ7ZmlsbDojQUI1RDI3O30NCgkuc3Qze2ZpbGw6I0Y5QjA5QTt9DQoJLnN0NHtmaWxsOiM3RjM0MUU7fQ0KCS5zdDV7ZmlsbDojRkZGRkZGO30NCgkuc3Q2e2ZpbGw6I0Y3QTA4QTt9DQo8L3N0eWxlPg0KPHBhdGggY2xhc3M9InN0MCIgZD0iTTYuNCwxMS42djE2TDIwLDM0VjE3LjJMNi40LDExLjZ6IE0xNy40LDMwLjVsLTEuOC0wLjhsMC4yLTcuNWwwLDBsLTIuNCw2LjVMMTIuMSwyOGwtMi04LjZsMCwwTDkuOSwyN0w4LDI2LjINCglsMC4zLTExLjFsMi40LDEuMWwyLjEsOS4ybDAsMGwyLjUtNy4xbDIuNCwxLjFMMTcuNCwzMC41eiBNMjAsMTcuMlYzNGwxMy42LTYuNHYtMTZMMjAsMTcuMnogTTI0LjIsMjkuM3YtMTFsMi0wLjl2OS4zbDQuNC0ydjEuNw0KCUwyNC4yLDI5LjN6IE0xNywxMC4yQzE3LDEwLjIsMTcuMSwxMC4yLDE3LDEwLjJjMC4xLDAuMSwwLjEsMC4xLDAuMSwwLjFMMTcsMTAuOWMtMC4xLDAtMC4yLDAtMC4yLDAuMWwwLDBsLTEuNy0wLjVMMTcsMTAuMnoNCgkgTTE3LjQsOS44TDE3LjQsOS44TDE3LjQsOS44YzAuMSwwLDAuMSwwLDAuMSwwbDEuNC0xLjJsLTIuNSwwLjVsMC45LDAuN0gxNy40eiBNMTcuOCwxMC4ybDEuMiwxLjNsMC42LTAuNmwwLDANCgljLTAuMS0wLjEtMC4yLTAuMS0wLjItMC4ybDAsMGwwLDBMMTcuOCwxMC4yeiBNMTYuNiwxMS4yTDE2LjYsMTEuMkwxNi42LDExLjJsLTEuOC0wLjVsMC4yLDAuOWwxLjMsMC4zbDAuNC0wLjUNCglDMTYuNiwxMS4zLDE2LjYsMTEuMywxNi42LDExLjJ6IE0xNyw5LjlsLTAuOS0wLjdsLTEuMiwxLjJsMi0wLjRDMTcsMTAsMTcsOS45LDE3LDkuOXogTTIyLjEsMTAuOUwyMiwxMC4xbC0xLjQsMi40bDEuMy0xLjENCgljMC0wLjEtMC4xLTAuMS0wLjEtMC4ybDAsMGMwLTAuMSwwLjEtMC4yLDAuMi0wLjNIMjIuMXogTTIyLjUsOS44bDIuNywxLjVsLTAuNi0xLjVIMjIuNUwyMi41LDkuOHogTTIyLjUsOS42aDEuN2wtMS43LTAuOQ0KCWwtMC4yLDAuN2gwLjFDMjIuNCw5LjYsMjIuNSw5LjYsMjIuNSw5LjZ6IE0xNi45LDExLjVMMTYuNSwxMmwwLjgsMC43TDE2LjksMTEuNUwxNi45LDExLjV6IE0xNy44LDEwTDE3LjgsMTANCglDMTcuOCwxMC4xLDE3LjgsMTAuMSwxNy44LDEwbDEuNiwwLjVjMCwwLDAsMCwwLjEtMC4xYzAsMCwwLjEtMC4xLDAuMi0wLjFjLTAuMi0wLjYtMC4zLTEuMi0wLjUtMS44bC0xLjQsMS4yDQoJQzE3LjgsOS45LDE3LjgsMTAsMTcuOCwxMHogTTIyLjEsOS40bDAuMy0wLjhsLTIuNi0wLjFsMi4xLDFDMjEuOSw5LjUsMjIsOS41LDIyLjEsOS40eiBNMzMuNiwxMS42TDIwLDE3LjJMNi40LDExLjZMMjAsNg0KCUwzMy42LDExLjZ6IE0yNC4yLDEzYzAuNS0wLjQsMC45LTAuOSwxLjQtMS4zYy0wLjMtMC43LTAuNS0xLjMtMC44LTJsMCwwbDAsMGwwLDBsLTIuMS0xLjFsLTMuMy0wLjJoLTAuMUMxOC4xLDguNiwxNy4xLDguOCwxNiw5DQoJYy0wLjUsMC41LTEsMS0xLjUsMS41YzAuMSwwLjQsMC4yLDAuOCwwLjMsMS4ybDEuNSwwLjRsMS4yLDFsMi4yLDAuMWMwLDAuMSwwLjEsMC4xLDAuMSwwLjFjMC4xLDAuMSwwLjIsMC4xLDAuNCwwLjFsMCwwDQoJYzAuMSwwLDAuMSwwLDAuMiwwbDEuNywxLjNsMC4yLDAuMnYtMS4zTDI0LjIsMTN6IE0yMC42LDEzLjNsMS40LDEuMXYtMC44TDIwLjYsMTMuM0wyMC42LDEzLjN6IE0yMC42LDEyLjgNCgljMC4xLDAuMSwwLjEsMC4xLDAuMSwwLjJsMCwwYzAsMCwwLDAsMCwwLjFsMS4zLDAuMmwwLjEtMS44YzAsMCwwLDAtMC4xLDBMMjAuNiwxMi44eiBNMjIuNCwxMC45YzAuMSwwLDAuMywwLDAuNCwwLjENCglzMC4yLDAuMiwwLjIsMC4zbDAsMGwyLDAuMkwyMi4zLDEwbDAsMEwyMi40LDEwLjlMMjIuNCwxMC45eiBNMTcuNSwxMC4zTDE3LjUsMTAuM2wtMC4zLDAuNmMwLjEsMCwwLjEsMCwwLjEsMC4xDQoJYzAuMSwwLjEsMC4xLDAuMSwwLjEsMC4ybDAsMGMwLDAuMS0wLjEsMC4yLTAuMSwwLjJzLTAuMSwwLjEtMC4yLDAuMWwwLjQsMS4zbDEuMS0xLjFMMTcuNSwxMC4zeiBNMjIuOSwxMS40bC0wLjEsMC4xbDAsMGwxLjMsMS4yDQoJbDEuMS0xLjFMMjIuOSwxMS40eiBNMjIuNSwxMS42bC0wLjEsMS43bDEuNi0wLjVMMjIuNSwxMS42TDIyLjUsMTEuNnogTTE3LjgsMTIuOWwxLjgsMC4xYzAtMC4xLDAuMS0wLjEsMC4xLTAuMmwtMC44LTAuOQ0KCUwxNy44LDEyLjl6IE0xOS44LDExLjFsLTAuNywwLjZsMC45LDFsMCwwTDE5LjgsMTEuMUwxOS44LDExLjF6IE0yMC4zLDEwLjVsMS4zLTAuN2MwLDAsMCwwLDAtMC4xbDAsMFY5LjZsLTIuMi0xbDAuNSwxLjcNCglDMjAuMSwxMC40LDIwLjIsMTAuNCwyMC4zLDEwLjVMMjAuMywxMC41eiBNMjAuNSwxMC43TDIwLjUsMTAuN0wyMC41LDEwLjdjMCwwLjIsMCwwLjMtMC4xLDAuM3MtMC4xLDAuMS0wLjIsMC4xbDAuMSwxLjZsMS41LTIuNw0KCUwyMC41LDEwLjd6Ii8+DQo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjIuOCwxNS44bC0yLjEsOC42YzAsMCwwLDAtMC4xLDBjLTAuMywwLTAuNSwwLjEtMC42LDAuNGwtMi0wLjV2LTAuMWMwLTAuMi0wLjEtMC40LTAuMy0wLjVsMi4zLTguNQ0KCWMwLDAsMCwwLDAuMSwwYzAuMywwLDAuNS0wLjEsMC42LTAuNGwxLjcsMC41bDAsMEMyMi40LDE1LjQsMjIuNiwxNS43LDIyLjgsMTUuOHogTTMyLjcsMjFsLTYuNSwxbDAsMGMtMC42LDAuMS0xLjItMC4yLTEuNS0wLjcNCglsLTEuMi0ybC0xLjMsNC45bDUuMSwxLjdjMC41LDAuMiwwLjgsMC41LDEsMWwwLDBsMi42LDcuOGMwLjMsMC44LTAuMiwxLjctMSwxLjljLTAuOCwwLjMtMS43LTAuMi0xLjktMWwtMi4zLTcuMUwxOC40LDI2bC0yLjgsNS42DQoJYy0wLjEsMC4zLTAuNCwwLjUtMC42LDAuNmwtNi43LDQuMWMtMC43LDAuNC0xLjcsMC4yLTIuMS0wLjVTNiwzNC4xLDYuNywzMy43bDYuNC0zLjlsMy02bDIuMS04LjFMMTUuNCwxNmwtMi43LDUuOA0KCWMtMC40LDAuOC0xLjMsMS4xLTIsMC44Yy0wLjgtMC40LTEuMS0xLjMtMC44LTJsMy02LjZjMC4yLTAuNSwwLjctMC45LDEuMy0xbDYuMi0wLjNjLTEuMi0wLjktMi4xLTIuNC0yLjEtNC4xDQoJYzAtMi44LDIuMy01LjEsNS4xLTUuMXM1LjEsMi4zLDUuMSw1LjFzLTIuMiw1LTQuOSw1LjFsMyw1LjFsNS41LTAuOGMwLjgtMC4xLDEuNiwwLjUsMS43LDEuM0MzNC4xLDIwLjEsMzMuNSwyMC44LDMyLjcsMjF6DQoJIE0yNi4zLDguN2MwLDAuNCwwLjMsMC43LDAuNywwLjdzMC43LTAuMywwLjctMC43UzI3LjQsOCwyNyw4UzI2LjMsOC4zLDI2LjMsOC43eiBNMzMuMywxOS4zYzAtMC40LTAuMy0wLjctMC43LTAuNw0KCWMtMC4zLDAtMC42LDAuMy0wLjcsMC42TDI2LjUsMjBjMC0wLjMtMC4zLTAuNi0wLjctMC42aC0wLjFsLTIuMi0zLjljMC4xLTAuMSwwLjItMC4zLDAuMi0wLjVjMC0wLjQtMC4zLTAuNy0wLjctMC43DQoJYy0wLjMsMC0wLjUsMC4yLTAuNiwwLjRsLTEuNy0wLjRjMCwwLDAsMCwwLTAuMWMwLTAuNC0wLjMtMC43LTAuNy0wLjdjLTAuMywwLTAuNiwwLjMtMC43LDAuNmgtNC40Yy0wLjEtMC4yLTAuMy0wLjMtMC42LTAuMw0KCWMtMC40LDAtMC43LDAuMy0wLjcsMC43YzAsMC4yLDAuMSwwLjQsMC4yLDAuNWwtMi40LDUuMWMtMC4xLDAtMC4yLDAtMC4yLDBjLTAuNCwwLTAuNywwLjMtMC43LDAuN3MwLjMsMC43LDAuNywwLjcNCglzMC43LTAuMywwLjctMC43YzAtMC4yLTAuMS0wLjQtMC4yLTAuNWwyLjQtNS4xYzAuMSwwLDAuMiwwLjEsMC4zLDAuMWMwLjQsMCwwLjctMC4zLDAuNy0wLjdjMCwwLDAsMCwwLTAuMWg0LjQNCgljMC4xLDAuMiwwLjIsMC4zLDAuMywwLjRsLTIuMyw4LjVoLTAuMWMtMC40LDAtMC43LDAuMy0wLjcsMC43YzAsMC4yLDAuMSwwLjQsMC4zLDAuNUwxNC42LDMwaC0wLjFjLTAuNCwwLTAuNywwLjMtMC43LDAuNw0KCWMwLDAuMSwwLDAuMiwwLjEsMC40bC01LjQsMy4zQzguNCwzNC4xLDguMiwzNCw4LDM0Yy0wLjQsMC0wLjcsMC4zLTAuNywwLjdzMC4zLDAuNywwLjcsMC43czAuNy0wLjMsMC43LTAuN2MwLTAuMSwwLTAuMi0wLjEtMC4zDQoJbDUuNC0zLjNjMC4xLDAuMSwwLjMsMC4yLDAuNCwwLjJjMC40LDAsMC43LTAuMywwLjctMC43YzAtMC4yLTAuMS0wLjQtMC4zLTAuNmwyLjQtNS40YzAuMSwwLDAuMSwwLDAuMiwwYzAuMiwwLDAuNC0wLjEsMC42LTAuMw0KCWwyLDAuNWMwLDAsMCwwLDAsMC4xYzAsMC40LDAuMywwLjcsMC43LDAuN2MwLjIsMCwwLjQtMC4xLDAuNS0wLjJsNS4xLDEuOHYwLjFjMCwwLjQsMC4zLDAuNywwLjcsMC43aDAuMWwyLjEsNi4zDQoJYy0wLjIsMC4xLTAuNCwwLjMtMC40LDAuNmMwLDAuNCwwLjMsMC43LDAuNywwLjdjMC40LDAsMC43LTAuMywwLjctMC43cy0wLjMtMC43LTAuNy0wLjdjMCwwLDAsMC0wLjEsMEwyNy4yLDI4DQoJYzAuMi0wLjEsMC4zLTAuMywwLjMtMC41YzAtMC40LTAuMy0wLjctMC43LTAuN2MtMC4yLDAtMC40LDAuMS0wLjUsMC4zbC01LTEuOGMwLTAuMSwwLTAuMSwwLTAuMmMwLTAuMy0wLjEtMC41LTAuMy0wLjZsMi4xLTguNg0KCWwwLDBjMC4xLDAsMC4yLDAsMC4yLDBsMi4yLDMuOGMtMC4yLDAuMS0wLjMsMC4zLTAuMywwLjVjMCwwLjQsMC4zLDAuNywwLjcsMC43YzAuMywwLDAuNi0wLjIsMC42LTAuNWw1LjUtMC44DQoJYzAuMSwwLjMsMC4zLDAuNSwwLjYsMC41QzMzLDIwLDMzLjMsMTkuNywzMy4zLDE5LjN6Ii8+DQo8Zz4NCgk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMjAuNCwzNS4zTDIwLjQsMzUuM2MtNS40LDAtOS43LTQuNC05LjctOS43VjE0LjdDMTAuNiw5LjQsMTUsNSwyMC40LDVsMCwwYzUuNCwwLDkuNyw0LjQsOS43LDkuN3YxMC44DQoJCUMzMC4xLDMwLjksMjUuNywzNS4zLDIwLjQsMzUuM3oiLz4NCgk8cGF0aCBjbGFzcz0ic3QzIiBkPSJNMjkuMiwxNi43aC0wLjFWMTVjMC00LjgtMy45LTguNy04LjctOC43cy04LjcsMy45LTguNyw4Ljd2MS43Yy0xLjEsMC4xLTIsMC45LTIuMiwyLjENCgkJYy0wLjEsMS4zLDAuOCwyLjUsMi4xLDIuNmMwLjEsMCwwLjMsMCwwLjQsMGMwLjksMy4yLDMuNSw1LjcsNi44LDYuM2MwLDAuMSwwLDAuMSwwLDAuMnYyYzAsMS4xLDAuOSwyLDIsMnMyLTAuOSwyLTJ2LTINCgkJYzAtMC4xLDAtMC4zLDAtMC40YzMtMC44LDUuMy0zLjIsNi4xLTYuMmMxLjIsMC4xLDIuMy0wLjgsMi41LTIuMUMzMS40LDE4LDMwLjUsMTYuOSwyOS4yLDE2Ljd6Ii8+DQoJPHBhdGggY2xhc3M9InN0MiIgZD0iTTMwLjEsMTUuOGMwLTEtMC4yLTMuMS0wLjUtNC4xYy0xLjMtMy45LTUtNi43LTkuMy02LjdsMCwwYy00LjYsMC04LjUsMy4yLTkuNSw3LjVjLTAuMiwwLjctMC4zLDMuMy0wLjMsNA0KCQljNS42LDAuNywxMS45LTAuNiwxNS4zLTQuN0MyNi40LDE0LjEsMjguNiwxNS42LDMwLjEsMTUuOHoiLz4NCgk8Y2lyY2xlIGNsYXNzPSJzdDQiIGN4PSIxNi4xIiBjeT0iMTkuMiIgcj0iMS4xIi8+DQoJPGNpcmNsZSBjbGFzcz0ic3Q0IiBjeD0iMjQuNSIgY3k9IjE5LjIiIHI9IjEuMSIvPg0KCTxwYXRoIGNsYXNzPSJzdDUiIGQ9Ik0xNy4xLDIyLjFoNi40YzAsMC0xLDEuNS0zLjIsMS41UzE3LjEsMjIuMSwxNy4xLDIyLjF6Ii8+DQoJPGVsbGlwc2UgY2xhc3M9InN0NiIgY3g9IjE1LjEiIGN5PSIyMS45IiByeD0iMS4yIiByeT0iMS4xIi8+DQoJPGVsbGlwc2UgY2xhc3M9InN0NiIgY3g9IjI1LjYiIGN5PSIyMS45IiByeD0iMS4yIiByeT0iMS4xIi8+DQoJPHBhdGggY2xhc3M9InN0NSIgZD0iTTExLDM0SDYuNnYtNS4xYzAtMC41LTAuNC0wLjgtMC44LTAuOGMtMC41LDAtMC44LDAuNC0wLjgsMC44djZjMCwwLjUsMC40LDAuOCwwLjgsMC44SDExDQoJCWMwLjUsMCwwLjgtMC40LDAuOC0wLjhTMTEuNCwzNCwxMSwzNHoiLz4NCgk8cGF0aCBjbGFzcz0ic3Q1IiBkPSJNMTEsNC4zSDUuOEM1LjQsNC4zLDUsNC43LDUsNS4ydjZDNSwxMS43LDUuNCwxMiw1LjgsMTJjMC41LDAsMC44LTAuNCwwLjgtMC44VjZIMTFjMC41LDAsMC44LTAuNCwwLjgtMC44DQoJCVMxMS40LDQuMywxMSw0LjN6Ii8+DQoJPHBhdGggY2xhc3M9InN0NSIgZD0iTTM0LjIsNC4zSDI5Yy0wLjUsMC0wLjgsMC40LTAuOCwwLjhTMjguNiw2LDI5LDZoNC4zdjUuMWMwLDAuNSwwLjQsMC44LDAuOCwwLjhzMC44LTAuNCwwLjgtMC44di02DQoJCUMzNSw0LjcsMzQuNiw0LjMsMzQuMiw0LjN6Ii8+DQoJPHBhdGggY2xhc3M9InN0NSIgZD0iTTM0LjIsMjguMWMtMC41LDAtMC44LDAuNC0wLjgsMC44VjM0SDI5Yy0wLjUsMC0wLjgsMC40LTAuOCwwLjhzMC40LDAuOCwwLjgsMC44aDUuMmMwLjUsMCwwLjgtMC40LDAuOC0wLjgNCgkJdi02QzM1LDI4LjQsMzQuNiwyOC4xLDM0LjIsMjguMXoiLz4NCjwvZz4NCjwvc3ZnPg0K';

const Message = {
    image_classification_model_url: {
        'ja': '画像分類モデルURL[URL]',
        'ja-Hira': 'がぞうぶんるいモデル[URL]',
        'en': 'image classification model URL [URL]',
        'ko': '이미지 분류 모델 URL [URL]',
        'zh-cn': '图片分类模型网址 [URL]',
        'de': 'URL des Bildklassifizierungsmodells [URL]',
        'es': 'URL del modelo de clasificación de imágenes [URL]',
        'ru': 'URL модели классификации изображений [URL]',
        'sr': 'URL modela modela klasifikacije slika [URL]'
    },
    sound_classification_model_url: {
        'ja': '音声分類モデルURL[URL]',
        'ja-Hira': 'おんせいぶんるいモデル[URL]',
        'en': 'sound classification model URL [URL]',
        'ko': '사운드 분류 모델 URL [URL]',
        'zh-cn': '声音分类模型URL [URL]',
        'de': 'URL des Soundklassifizierungsmodells [URL]',
        'es': 'URL del modelo de clasificación de sonido [URL]',
        'ru': 'URL модели классификации звука [URL]',
        'sr': 'URL modela zvučne klasifikacije [URL]'
    },
    classify_image: {
        'ja': '画像を分類する',
        'ja-Hira': 'がぞうをぶんるいする',
        'en': 'classify image',
        'ko': '이미지 분류',
        'zh-cn': '分类图像',
        'de': 'Bild klassifizieren',
        'es': 'clasificar imagen',
        'ru': 'классифицировать изображение',
        'sr': 'klasificirati sliku'
    },
    image_label: {
        'ja': '画像ラベル',
        'ja-Hira': 'がぞうラベル',
        'en': 'image label',
        'ko': '이미지 레이블',
        'zh-cn': '图片标签',
        'de': 'Bildetikett',
        'es': 'etiqueta de imagen',
        'ru': 'метка изображения',
        'sr': 'oznaka slike'
    },
    sound_label: {
        'ja': '音声ラベル',
        'ja-Hira': 'おんせいラベル',
        'en': 'sound label',
        'ko': '사운드 레이블',
        'zh-cn': '声音标签',
        'de': 'Sound Label',
        'es': 'etiqueta de sonido',
        'ru': 'звуковой лейбл',
        'sr': 'zvučna etiketa'
    },
    when_received_block: {
        'ja': '画像ラベル[LABEL]を受け取ったとき',
        'ja-Hira': 'がぞうラベル[LABEL]をうけとったとき',
        'en': 'when received image label:[LABEL]',
        'zh-cn': '收到图像标签时:[LABEL]',
        'ko': '수신된 이미지 레이블:[LABEL]',
        'de': 'bei Erhalt Bildetikett:[LABEL]',
        'es': 'cuando se recibe la etiqueta de imagen:[LABEL]',
        'ru': 'при получении метка изображения:[LABEL]',
        'sr': 'kada je primljena oznaka slike:[LABEL]'
    },
    is_image_label_detected: {
        'ja': '[LABEL]の画像が見つかった',
        'ja-Hira': '[LABEL]のがぞうがみつかった',
        'en': 'image [LABEL] detected',
        'ko': '[LABEL] 이미지 감지',
        'zh-cn': '检测到图像 [LABEL]',
        'de': 'Bild [LABEL] erkannt',
        'es': 'imagen [LABEL] detectada',
        'ru': 'изображение [LABEL] обнаружено',
        'sr': 'otkrivena slika [LABEL]'
    },
    is_sound_label_detected: {
        'ja': '[LABEL]の音声が聞こえた',
        'ja-Hira': '[LABEL]のおんせいがきこえた',
        'en': 'sound [LABEL] detected',
        'ko': '[LABEL] 사운드 감지',
        'zh-cn': '检测到声音 [LABEL]',
        'de': 'Ton [LABEL] erkannt',
        'es': 'sonido [LABEL] detectado',
        'ru': 'звук [LABEL] обнаружен',
        'sr': 'otkriven zvuk [LABEL]'
    },
    image_label_confidence: {
        'ja': '画像ラベル[LABEL]の確度',
        'ja-Hira': 'がぞうラベル[LABEL]のかくど',
        'en': 'confidence of image [LABEL]',
        'ko': '이미지의 신뢰도 [LABEL]',
        'zh-cn': '图像的置信度 [LABEL]',
        'de': 'Vertrauen des Bildes [LABEL]',
        'es': 'confianza en la imagen [LABEL]',
        'ru': 'уверенность в изображении [LABEL]',
        'sr': 'povjerenje u sliku [LABEL]'
    },
    sound_label_confidence: {
        'ja': '音声ラベル[LABEL]の確度',
        'ja-Hira': 'おんせいラベル[LABEL]のかくど',
        'en': 'confidence of sound [LABEL]',
        'ko': '사운드의 신뢰도 [LABEL]',
        'zh-cn': '声音的信心 [LABEL]',
        'de': 'Vertrauen in den Klang [LABEL]',
        'es': 'confianza en el sonido [LABEL]',
        'ru': 'уверенность в звуке [LABEL]',
        'sr': 'pouzdanost zvuka [LABEL]'
    },
    when_received_sound_label_block: {
        'ja': '音声ラベル[LABEL]を受け取ったとき',
        'ja-Hira': '音声ラベル[LABEL]をうけとったとき',
        'en': 'when received sound label:[LABEL]',
        'zh-cn': '收到声音标签时 [LABEL]',
        'ko': '수신된 사운드 레이블:[LABEL]',
        'de': 'bei Empfang Sound Label[LABEL]',
        'es': 'cuando se recibe etiqueta de sonido:[LABEL]',
        'ru': 'при получении звуковой ярлык:[LABEL]',
        'sr': 'kada je primljena zvučna etiketa:[LABEL]'
    },
    label_block: {
        'ja': 'ラベル',
        'ja-Hira': 'ラベル',
        'en': 'label',
        'zh-cn': '标签',
        'ko': 'label',
        'de': 'label',
        'es': 'label',
        'ru': 'label',
        'sr': 'label'
    },
    any: {
        'ja': 'のどれか',
        'ja-Hira': 'のどれか',
        'en': 'any',
        'zh-cn': '任何',
        'ko': 'any',
        'de': 'any',
        'es': 'any',
        'ru': 'any',
        'sr': 'any'
    },
    any_without_of: {
      'ja': 'どれか',
      'ja-Hira': 'どれか',
      'en': 'any',
      'zh-cn': '任何',
      'ko': 'any',
      'de': 'any',
      'es': 'any',
      'ru': 'any',
      'sr': 'any'
    },
    all: {
        'ja': 'の全て',
        'ja-Hira': 'のすべて',
        'en': 'all',
        'zh-cn': '所有',
        'ko': 'all',
        'de': 'all',
        'es': 'all',
        'ru': 'all',
        'sr': 'all'
    },
    toggle_classification: {
        'ja': 'ラベル付けを[CLASSIFICATION_STATE]にする',
        'ja-Hira': 'ラベルづけを[CLASSIFICATION_STATE]にする',
        'en': 'turn classification [CLASSIFICATION_STATE]',
        'zh-cn': '打开分类 [CLASSIFICATION_STATE]',
        'ko': '분류 [CLASSIFICATION_STATE]',
        'de': 'Klassifizierung einschalten [CLASSIFICATION_STATE]',
        'es': 'activar clasificación [CLASSIFICATION_STATE]',
        'ru': 'включить классификацию [CLASSIFICATION_STATE]',
        'sr': 'uključiti klasifikaciju [CLASSIFICATION_STATE]'
    },
    set_confidence_threshold: {
        'ja': '確度のしきい値を[CONFIDENCE_THRESHOLD]にする',
        'ja-Hira': 'かくどのしきいちを[CONFIDENCE_THRESHOLD]にする',
        'en': 'set confidence threshold [CONFIDENCE_THRESHOLD]',
        'ko': '신뢰 임계값 설정 [CONFIDENCE_THRESHOLD]',
        'zh-cn': '设定置信度阈值 [CONFIDENCE_THRESHOLD]',
        'de': 'Vertrauensschwelle einstellen [CONFIDENCE_THRESHOLD]',
        'es': 'establecer umbral de confianza [CONFIDENCE_THRESHOLD]',
        'ru': 'установить порог достоверности [CONFIDENCE_THRESHOLD]',
        'sr': 'postavite prag pouzdanosti [CONFIDENCE_THRESHOLD]'
    },
    get_confidence_threshold: {
        'ja': '確度のしきい値',
        'ja-Hira': 'かくどのしきいち',
        'en': 'confidence threshold',
        'ko': '신뢰 임계값',
        'zh-cn': '置信度阈值',
        'de': 'Vertrauensschwelle',
        'es': 'umbral de confianza',
        'ru': 'порог уверенности',
        'rs': 'prag povjerenja'
    },
    set_classification_interval: {
        'ja': 'ラベル付けを[CLASSIFICATION_INTERVAL]秒間に1回行う',
        'ja-Hira': 'ラベルづけを[CLASSIFICATION_INTERVAL]びょうかんに1かいおこなう',
        'en': 'Label once every [CLASSIFICATION_INTERVAL] seconds',
        'zh-cn': '每隔[CLASSIFICATION_INTERVAL]秒标记一次',
        'ko': '[CLASSIFICATION_INTERVAL] 초마다 한 번씩 분류',
        'de': 'Beschriften Sie einmal alle [CLASSIFICATION_INTERVAL] Sekunden',
        'ru': 'Ярлык один раз каждые [CLASSIFICATION_INTERVAL] секунды',
        'sr': 'Označi jednom u [CLASSIFICATION_INTERVAL] sekunde'
    },
    video_toggle: {
        'ja': 'ビデオを[VIDEO_STATE]にする',
        'ja-Hira': 'ビデオを[VIDEO_STATE]にする',
        'en': 'turn video [VIDEO_STATE]',
        'zh-cn': '打开视频 [VIDEO_STATE]',
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
        'zh-cn': '开启',
        'ko': '켜기',
        'de': 'ein',
        'es': 'encender',
        'ru': 'включить',
        'sr': 'uključiti'
    },
    off: {
        'ja': '切',
        'ja-Hira': 'きり',
        'en': 'off',
        'zh-cn': '关闭',
        'ko': '끄기',
        'de': 'aus',
        'es': 'apagar',
        'ru': 'выключить',
        'sr': 'isključiti'
    },
    video_on_flipped: {
        'ja': '左右反転',
        'ja-Hira': 'さゆうはんてん',
        'en': 'on flipped',
        'zh-cn': '镜像开启',
        'ko': '뒤집힌 상태로 켜기',
        'de': 'auf gespiegelt',
        'es': 'invertir',
        'ru': 'включить в обратную',
        'sr': 'измени укљученост'
    }
};

const AvailableLocales = ['en', 'ja', 'ja-Hira', 'zh-cn', 'ko', 'de', 'es', 'ru', 'sr'];

class Scratch3TM2ScratchBlocks {
    constructor (runtime) {
        this.runtime = runtime;
        this.locale = this.setLocale();

        this.video = document.createElement('video');
        this.video.width = 480;
        this.video.height = 360;
        this.video.autoplay = true;
        this.video.style.display = 'none';

        this.interval = 1000;
        this.minInterval = 100;

        const media = navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });

        media.then(stream => {
            this.video.srcObject = stream;
        });

        this.timer = setInterval(() => {
            this.classifyVideoImage();
        }, this.minInterval);

        this.imageModelUrl = null;
        this.imageMetadata = null;
        this.imageClassifier = null;
        this.initImageProbableLabels();
        this.confidenceThreshold = 0.5;

        this.soundModelUrl = null;
        this.soundMetadata = null;
        this.soundClassifier = null;
        this.soundClassifierEnabled = false;
        this.initSoundProbableLabels();

        this.runtime.ioDevices.video.enableVideo();
    }

    /**
     * Initialize the result of image classification.
     */
    initImageProbableLabels () {
        this.imageProbableLabels = [];
    }

    initSoundProbableLabels () {
        this.soundProbableLabels = [];
    }

    getInfo () {
        this.locale = this.setLocale();

        return {
            id: 'tm2scratch',
            name: 'Teachable Machine Image/Sound',
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'whenReceived',
                    text: Message.when_received_block[this.locale],
                    blockType: BlockType.HAT,
                    arguments: {
                        LABEL: {
                            type: ArgumentType.STRING,
                            menu: 'received_menu',
                            defaultValue: Message.any[this.locale]
                        }
                    }
                },
                {
                    opcode: 'isImageLabelDetected',
                    text: Message.is_image_label_detected[this.locale],
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        LABEL: {
                            type: ArgumentType.STRING,
                            menu: 'image_labels_menu',
                            defaultValue: Message.any_without_of[this.locale]
                        }
                    }
                },
                {
                    opcode: 'imageLabelConfidence',
                    text: Message.image_label_confidence[this.locale],
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    arguments: {
                        LABEL: {
                            type: ArgumentType.STRING,
                            menu: 'image_labels_without_any_menu',
                            defaultValue: ''
                        }
                    }
                },
                {
                    opcode: 'setImageClassificationModelURL',
                    text: Message.image_classification_model_url[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: '' // https://teachablemachine.withgoogle.com/models/0rX_3hoH/
                        }
                    }
                },
                {
                    opcode: 'classifyVideoImageBlock',
                    text: Message.classify_image[this.locale],
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'getImageLabel',
                    text: Message.image_label[this.locale],
                    blockType: BlockType.REPORTER
                },
                '---',
                {
                    opcode: 'whenReceivedSoundLabel',
                    text: Message.when_received_sound_label_block[this.locale],
                    blockType: BlockType.HAT,
                    arguments: {
                        LABEL: {
                            type: ArgumentType.STRING,
                            menu: 'received_sound_label_menu',
                            defaultValue: Message.any[this.locale]
                        }
                    }
                },
                {
                    opcode: 'isSoundLabelDetected',
                    text: Message.is_sound_label_detected[this.locale],
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        LABEL: {
                            type: ArgumentType.STRING,
                            menu: 'sound_labels_menu',
                            defaultValue: Message.any_without_of[this.locale]
                        }
                    }
                },
                {
                    opcode: 'soundLabelConfidence',
                    text: Message.sound_label_confidence[this.locale],
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    arguments: {
                        LABEL: {
                            type: ArgumentType.STRING,
                            menu: 'sound_labels_without_any_menu',
                            defaultValue: ''
                        }
                    }
                },
                {
                    opcode: 'setSoundClassificationModelURL',
                    text: Message.sound_classification_model_url[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: '' //https://teachablemachine.withgoogle.com/models/xP0spGSB/
                        }
                    }
                },
                {
                    opcode: 'getSoundLabel',
                    text: Message.sound_label[this.locale],
                    blockType: BlockType.REPORTER
                },
                '---',
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
                    opcode: 'setConfidenceThreshold',
                    text: Message.set_confidence_threshold[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CONFIDENCE_THRESHOLD: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.5
                        }
                    }
                },
                {
                    opcode: 'getConfidenceThreshold',
                    text: Message.get_confidence_threshold[this.locale],
                    blockType: BlockType.REPORTER,
                    disableMonitor: true
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
                received_menu: {
                    acceptReporters: true,
                    items: 'getLabelsMenu'
                },
                image_labels_menu: {
                    acceptReporters: true,
                    items: 'getLabelsWithAnyWithoutOfMenu'
                },
                image_labels_without_any_menu: {
                    acceptReporters: true,
                    items: 'getLabelsWithoutAnyMenu'
                },
                received_sound_label_menu: {
                    acceptReporters: true,
                    items: 'getSoundLabelsWithoutBackgroundMenu'
                },
                sound_labels_menu: {
                    acceptReporters: true,
                    items: 'getSoundLabelsWithoutBackgroundWithAnyWithoutOfMenu'
                },
                sound_labels_without_any_menu: {
                    acceptReporters: true,
                    items: 'getSoundLabelsWithoutAnyMenu'
                },
                video_menu: this.getVideoMenu(),
                classification_interval_menu: this.getClassificationIntervalMenu(),
                classification_menu: this.getClassificationMenu()
            }
        };
    }

    /**
     * Detect change of the selected image label is the most probable one or not.
     * @param {object} args - The block's arguments.
     * @property {string} LABEL - The label to detect.
     * @return {boolean} - Whether the label is most probable or not.
     */
    whenReceived (args) {
        const label = this.getImageLabel();
        if (args.LABEL === Message.any[this.locale]) {
            return label !== '';
        }
        return label === args.LABEL;
    }

    /**
     * Detect change of the selected sound label is the most probable one or not.
     * @param {object} args - The block's arguments.
     * @property {string} LABEL - The label to detect.
     * @return {boolean} - Whether the label is most probable or not.
     */
    whenReceivedSoundLabel (args) {
        if (!this.soundClassifierEnabled) {
            return;
        }

        const label = this.getSoundLabel();
        if (args.LABEL === Message.any[this.locale]) {
            return label !== '';
        }
        return label === args.LABEL;
    }

    /**
     * Return whether the most probable image label is the selected one or not.
     * @param {object} args - The block's arguments.
     * @property {string} LABEL - The label to detect.
     * @return {boolean} - Whether the label is most probable or not.
     */
    isImageLabelDetected (args) {
        const label = this.getImageLabel();
        if (args.LABEL === Message.any[this.locale]) {
            return label !== '';
        }
        return label === args.LABEL;
    }

    /**
     * Return whether the most probable sound label is the selected one or not.
     * @param {object} args - The block's arguments.
     * @property {string} LABEL - The label to detect.
     * @return {boolean} - Whether the label is most probable or not.
     */
    isSoundLabelDetected (args) {
        const label = this.getSoundLabel();
        if (args.LABEL === Message.any[this.locale]) {
            return label !== '';
        }
        return label === args.LABEL;
    }

    /**
     * Return confidence of the image label.
     * @param {object} args - The block's arguments.
     * @property {string} LABEL - Selected label.
     * @return {number} - Confidence of the label.
     */
    imageLabelConfidence (args) {
        if (args.LABEL === '') {
            return 0;
        }
        const entry = this.imageProbableLabels.find(element => element.label === args.LABEL);
        return (entry ? entry.confidence : 0);
    }

    /**
     * Return confidence of the sound label.
     * @param {object} args - The block's arguments.
     * @property {string} LABEL - Selected label.
     * @return {number} - Confidence of the label.
     */
    soundLabelConfidence (args) {
        if (!this.soundProbableLabels || this.soundProbableLabels.length === 0) return 0;

        if (args.LABEL === '') {
            return 0;
        }
        const entry = this.soundProbableLabels.find(element => element.label === args.LABEL);
        return (entry ? entry.confidence : 0);
    }

    /**
     * Set a model for image classification from URL.
     * @param {object} args - the block's arguments.
     * @property {string} URL - URL of model to be loaded.
     * @return {Promise} - A Promise that resolve after loaded.
     */
    setImageClassificationModelURL (args) {
        return this.loadImageClassificationModelFromURL(args.URL);
    }

    /**
     * Set a model for sound classification from URL.
     * @param {object} args - the block's arguments.
     * @property {string} URL - URL of model to be loaded.
     * @return {Promise} - A Promise that resolve after loaded.
     */
    setSoundClassificationModelURL (args) {
        return this.loadSoundClassificationModelFromURL(args.URL);
    }

    /**
     * Load a model from URL for image classification.
     * @param {string} url - URL of model to be loaded.
     * @return {Promise} - A Promise that resolves after loaded.
     */
    loadImageClassificationModelFromURL (url) {
        return new Promise(resolve => {
            fetch(`${url}metadata.json`)
                .then(res => res.json())
                .then(metadata => {
                    if (url === this.imageModelUrl &&
                        (new Date(metadata.timeStamp).getTime() === new Date(this.imageMetadata.timeStamp).getTime())) {
                        log.info(`image model already loaded: ${url}`);
                        resolve();
                    } else {
                        ml5.imageClassifier(`${url}model.json`)
                            .then(classifier => {
                                this.imageModelUrl = url;
                                this.imageMetadata = metadata;
                                this.imageClassifier = classifier;
                                this.initImageProbableLabels();
                                log.info(`image model loaded from: ${url}`);
                            })
                            .catch(error => {
                                log.warn(error);
                            })
                            .finally(() => resolve());
                    }
                })
                .catch(error => {
                    log.warn(error);
                    resolve();
                });
        });
    }

    /**
     * Load a model from URL for sound classification.
     * @param {string} url - URL of model to be loaded.
     * @return {Promise} - A Promise that resolves after loaded.
     */
    loadSoundClassificationModelFromURL (url) {
        return new Promise(resolve => {
            fetch(`${url}metadata.json`)
                .then(res => res.json())
                .then(metadata => {
                    if (url === this.soundModelUrl &&
                        (new Date(metadata.timeStamp).getTime() === new Date(this.soundMetadata.timeStamp).getTime())) {
                        log.info(`sound model already loaded: ${url}`);
                        resolve();
                    } else {
                        ml5.soundClassifier(`${url}model.json`)
                            .then(classifier => {
                                this.soundModelUrl = url;
                                this.soundMetadata = metadata;
                                this.soundClassifier = classifier;
                                this.initSoundProbableLabels();
                                this.soundClassifierEnabled = true;
                                this.classifySound();
                                log.info(`sound model loaded from: ${url}`);
                            })
                            .catch(error => {
                                log.warn(error);
                            })
                            .finally(() => resolve());
                    }
                })
                .catch(error => {
                    log.warn(error);
                    resolve();
                });
        });
    }

    /**
     * Return menu items to detect label in the image.
     * @return {Array} - Menu items with 'any'.
     */
    getLabelsMenu () {
        let items = [Message.any[this.locale]];
        if (!this.imageMetadata) return items;
        items = items.concat(this.imageMetadata.labels);
        return items;
    }

    /**
     * Return menu items to detect label in the image.
     * @return {Array} - Menu items with 'any without of'.
     */
    getLabelsWithAnyWithoutOfMenu () {
        let items = [Message.any_without_of[this.locale]];
        if (!this.imageMetadata) return items;
        items = items.concat(this.imageMetadata.labels);
        return items;
    }

    /**
     * Return menu items to detect label in the image.
     * @return {Array} - Menu items with 'any'.
     */
    getSoundLabelsMenu () {
        let items = [Message.any[this.locale]];
        if (!this.soundMetadata) return items;
        items = items.concat(this.soundMetadata.wordLabels);
        return items;
    }

    /**
     * Return menu itmes to get properties of the image label.
     * @return {Array} - Menu items with ''.
     */
    getLabelsWithoutAnyMenu () {
        let items = [''];
        if (this.imageMetadata) {
            items = items.concat(this.imageMetadata.labels);
        }
        return items;
    }

    /**
     * Return menu itmes to get properties of the sound label.
     * @return {Array} - Menu items with ''.
     */
    getSoundLabelsWithoutAnyMenu () {
        let items = [''];
        if (this.soundMetadata) {
            items = items.concat(this.soundMetadata.wordLabels);
        }
        return items;
    }

    /**
     * Return menu itmes to get properties of the sound label.
     * @return {Array} - Menu items without '_background_noise_'.
     */
    getSoundLabelsWithoutBackgroundMenu () {
        let items = [Message.any[this.locale]];
        if (!this.soundMetadata) return items;
        items = items.concat(this.soundMetadata.wordLabels.slice(1));
        return items;
    }

    /**
     * Return menu itmes to get properties of the sound label.
     * @return {Array} - Menu items without '_background_noise_' and with 'any without of'.
     */
    getSoundLabelsWithoutBackgroundWithAnyWithoutOfMenu () {
      let items = [Message.any_without_of[this.locale]];
      if (!this.soundMetadata) return items;
      items = items.concat(this.soundMetadata.wordLabels.slice(1));
      return items;
    }

    /**
     * Pick a probability which has highest confidence.
     * @param {Array} probabilities - An Array of probabilities.
     * @property {number} probabilities.confidence - Probability of the label.
     * @return {object} - One of the highest confidence probability.
     */
    getMostProbableOne (probabilities) {
        if (probabilities.length === 0) return null;
        let mostOne = probabilities[0];
        probabilities.forEach(clss => {
            if (clss.confidence > mostOne.confidence) {
                mostOne = clss;
            }
        });
        return mostOne;
    }

    /**
     * Classify image from the video input.
     * Call stack will wait until the previous classification was done.
     *
     * @param {object} _args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @return {Promise} - a Promise that resolves after classification.
     */
    classifyVideoImageBlock (_args, util) {
        if (this._isImageClassifying) {
            if (util) util.yield();
            return;
        }
        return new Promise(resolve => {
            this.classifyImage(this.video)
                .then(result => {
                    resolve(JSON.stringify(result));
                });
        });
    }

    /**
     * Classyfy image from input data source.
     *
     * @param {HTMLImageElement | ImageData | HTMLCanvasElement | HTMLVideoElement} input
     *  - Data source for classification.
     * @return {Promise} - A Promise that resolves the result of classification.
     *  The result will be empty when the imageClassifier was not set.
     */
    classifyImage (input) {
        if (!this.imageMetadata || !this.imageClassifier) {
            this._isImageClassifying = false;
            return Promise.resolve([]);
        }
        this._isImageClassifying = true;
        return this.imageClassifier.classify(input)
            .then(result => {
                this.imageProbableLabels = result.slice();
                this.imageProbableLabelsUpdated = true;
                return result;
            })
            .finally(() => {
                setTimeout(() => {
                    // Initialize probabilities to reset whenReceived blocks.
                    this.initImageProbableLabels();
                    this._isImageClassifying = false;
                }, this.interval);
            });
    }

    /**
     * Classify sound.
     */
    classifySound () {
        this.soundClassifier.classify((err, result) => {
            if (this.soundClassifierEnabled && result) {
                this.soundProbableLabels = result.slice();
                setTimeout(() => {
                    // Initialize probabilities to reset whenReceivedSoundLabel blocks.
                    this.initSoundProbableLabels();
                }, this.interval);
            }
            if (err) {
                console.error(err);
            }
        });
    }

    /**
     * Get the most probable label in the image.
     * Retrun the last classification result or '' when the first classification was not done.
     * @return {string} label
    */
    getImageLabel () {
        if (!this.imageProbableLabels || this.imageProbableLabels.length === 0) return '';
        const mostOne = this.getMostProbableOne(this.imageProbableLabels);
        return (mostOne.confidence >= this.confidenceThreshold) ? mostOne.label : '';
    }

    /**
     * Get the most probable label in the sound.
     * Retrun the last classification result or '' when the first classification was not done.
     * @return {string} label
    */
    getSoundLabel () {
        if (!this.soundProbableLabels || this.soundProbableLabels.length === 0) return '';
        const mostOne = this.getMostProbableOne(this.soundProbableLabels);
        return (mostOne.confidence >= this.confidenceThreshold) ? mostOne.label : '';
    }

    /**
     * Set confidence threshold which should be over for detected label.
     * @param {object} args - the block's arguments.
     * @property {number} CONFIDENCE_THRESHOLD - Value of confidence threshold.
     */
    setConfidenceThreshold (args) {
        let threshold = Cast.toNumber(args.CONFIDENCE_THRESHOLD);
        threshold = MathUtil.clamp(threshold, 0, 1);
        this.confidenceThreshold = threshold;
    }

    /**
     * Get confidence threshold which should be over for detected label.
     * @param {object} args - the block's arguments.
     * @return {number} - Value of confidence threshold.
     */
    getConfidenceThreshold () {
        return this.confidenceThreshold;
    }

    /**
     * Set state of the continuous classification.
     * @param {object} args - the block's arguments.
     * @property {string} CLASSIFICATION_STATE - State to be ['on'|'off'].
     */
    toggleClassification (args) {
        const state = args.CLASSIFICATION_STATE;
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.soundClassifierEnabled = false;
        if (state === 'on') {
            this.timer = setInterval(() => {
                this.classifyVideoImage();
            }, this.minInterval);
            this.soundClassifierEnabled = true;
        }
    }

    /**
     * Set interval time of the continuous classification.
     * @param {object} args - the block's arguments.
     * @property {number} CLASSIFICATION_INTERVAL - Interval time (seconds).
     */
    setClassificationInterval (args) {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.interval = args.CLASSIFICATION_INTERVAL * 1000;
        this.timer = setInterval(() => {
            this.classifyVideoImage();
        }, this.minInterval);
    }

    /**
     * Show video image on the stage or not.
     * @param {object} args - the block's arguments.
     * @property {string} VIDEO_STATE - Show or not ['on'|'off'].
     */
    videoToggle (args) {
        const state = args.VIDEO_STATE;
        if (state === 'off') {
            this.runtime.ioDevices.video.disableVideo();
        } else {
            this.runtime.ioDevices.video.enableVideo();
            this.runtime.ioDevices.video.mirror = state === 'on';
        }
    }

    /**
     * Classify video image.
     * @return {Promise} - A Promise that resolves the result of classification.
     *  The result will be empty when another classification was under going.
     */
    classifyVideoImage () {
        if (this._isImageClassifying) return Promise.resolve([]);
        return this.classifyImage(this.video);
    }

    /**
     * Return menu for video showing state.
     * @return {Array} - Menu items.
     */
    getVideoMenu () {
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
        ];
    }

    /**
     * Return menu for classification interval setting.
     * @return {object} - Menu.
     */
    getClassificationIntervalMenu () {
        return {
            acceptReporters: true,
            items: [
                {
                    text: '1',
                    value: '1'
                },
                {
                    text: '0.5',
                    value: '0.5'
                },
                {
                    text: '0.2',
                    value: '0.2'
                },
                {
                    text: '0.1',
                    value: '0.1'
                }
            ]
        };
    }

    /**
     * Return menu for continuous classification state.
     * @return {Array} - Menu items.
     */
    getClassificationMenu () {
        return [
            {
                text: Message.off[this.locale],
                value: 'off'
            },
            {
                text: Message.on[this.locale],
                value: 'on'
            }
        ];
    }

    /**
     * Get locale for message text.
     * @return {string} - Locale of this editor.
     */
    setLocale () {
        const locale = formatMessage.setup().locale;
        if (AvailableLocales.includes(locale)) {
            return locale;
        }
        return 'en';

    }
}

module.exports = Scratch3TM2ScratchBlocks;
