const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const ml5 = require('ml5');
const formatMessage = require('format-message');
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4yIiBiYXNlUHJvZmlsZT0idGlueSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiDQoJIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDBweCIgaGVpZ2h0PSI0MHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggZGlzcGxheT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiIgZD0iTTYuNCwxMS42djE2TDIwLDM0VjE3LjJMNi40LDExLjZ6IE0xNy40LDMwLjVsLTEuOC0wLjhsMC4yLTcuNWwwLDBsLTIuNCw2LjVMMTIuMSwyOGwtMi04LjYNCglsMCwwTDkuOSwyN0w4LDI2LjJsMC4zLTExLjFsMi40LDEuMWwyLjEsOS4ybDAsMGwyLjUtNy4xbDIuNCwxLjFMMTcuNCwzMC41eiBNMjAsMTcuMlYzNGwxMy42LTYuNHYtMTZMMjAsMTcuMnogTTI0LjIsMjkuM2wwLTExDQoJbDItMC45bDAsOS4zbDQuNC0ybDAsMS43TDI0LjIsMjkuM3ogTTE3LDEwLjJDMTcsMTAuMiwxNy4xLDEwLjIsMTcsMTAuMmMwLjEsMC4xLDAuMSwwLjEsMC4xLDAuMUwxNywxMC45Yy0wLjEsMC0wLjIsMC0wLjIsMC4xDQoJYzAsMCwwLDAsMCwwbC0xLjctMC41TDE3LDEwLjJ6IE0xNy40LDkuOEwxNy40LDkuOEwxNy40LDkuOGMwLjEsMCwwLjEsMCwwLjEsMGwxLjQtMS4ybC0yLjUsMC41bDAuOSwwLjcNCglDMTcuMyw5LjgsMTcuNCw5LjgsMTcuNCw5Ljh6IE0xNy44LDEwLjJsMS4yLDEuM2wwLjYtMC42bDAsMGMtMC4xLTAuMS0wLjItMC4xLTAuMi0wLjJjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBMMTcuOCwxMC4yeg0KCSBNMTYuNiwxMS4yQzE2LjYsMTEuMiwxNi42LDExLjIsMTYuNiwxMS4yQzE2LjYsMTEuMiwxNi42LDExLjIsMTYuNiwxMS4ybC0xLjgtMC41bDAuMiwwLjlsMS4zLDAuM2wwLjQtMC41DQoJQzE2LjYsMTEuMywxNi42LDExLjMsMTYuNiwxMS4yeiBNMTcsOS45bC0wLjktMC43bC0xLjIsMS4ybDItMC40QzE3LDEwLDE3LDkuOSwxNyw5Ljl6IE0yMi4xLDEwLjlMMjIsMTAuMWwtMS40LDIuNGwxLjMtMS4xDQoJYzAtMC4xLTAuMS0wLjEtMC4xLTAuMmMwLDAsMCwwLDAsMGMwLTAuMSwwLjEtMC4yLDAuMi0wLjNDMjIsMTAuOSwyMi4xLDEwLjksMjIuMSwxMC45eiBNMjIuNSw5LjhsMi43LDEuNWwtMC42LTEuNUwyMi41LDkuOA0KCUMyMi41LDkuOCwyMi41LDkuOCwyMi41LDkuOHogTTIyLjUsOS42bDEuNywwbC0xLjctMC45bC0wLjIsMC43YzAsMCwwLjEsMCwwLjEsMEMyMi40LDkuNiwyMi41LDkuNiwyMi41LDkuNnogTTE2LjksMTEuNUwxNi41LDEyDQoJbDAuOCwwLjdMMTYuOSwxMS41QzE2LjksMTEuNSwxNi45LDExLjUsMTYuOSwxMS41eiBNMTcuOCwxMEMxNy44LDEwLDE3LjgsMTAsMTcuOCwxMEMxNy44LDEwLjEsMTcuOCwxMC4xLDE3LjgsMTBsMS42LDAuNQ0KCWMwLDAsMCwwLDAuMS0wLjFjMCwwLDAuMS0wLjEsMC4yLTAuMWMtMC4yLTAuNi0wLjMtMS4yLTAuNS0xLjhsLTEuNCwxLjJDMTcuOCw5LjksMTcuOCwxMCwxNy44LDEweiBNMjIuMSw5LjRsMC4zLTAuOGwtMi42LTAuMQ0KCWwyLjEsMUMyMS45LDkuNSwyMiw5LjUsMjIuMSw5LjR6IE0zMy42LDExLjZMMjAsMTcuMkw2LjQsMTEuNkwyMCw2TDMzLjYsMTEuNnogTTI0LjIsMTNjMC41LTAuNCwwLjktMC45LDEuNC0xLjMNCgljLTAuMy0wLjctMC41LTEuMy0wLjgtMmwwLDBsMCwwbDAsMGwtMi4xLTEuMWwtMy4zLTAuMmwtMC4xLDBDMTguMSw4LjYsMTcuMSw4LjgsMTYsOWMtMC41LDAuNS0xLDEtMS41LDEuNQ0KCWMwLjEsMC40LDAuMiwwLjgsMC4zLDEuMmwxLjUsMC40bDEuMiwxbDIuMiwwLjFjMCwwLjEsMC4xLDAuMSwwLjEsMC4xYzAuMSwwLjEsMC4yLDAuMSwwLjQsMC4xYzAsMCwwLDAsMCwwYzAuMSwwLDAuMSwwLDAuMiwwDQoJbDEuNywxLjNsMC4yLDAuMmwwLTEuM0wyNC4yLDEzeiBNMjAuNiwxMy4zbDEuNCwxLjFsMC0wLjhMMjAuNiwxMy4zQzIwLjYsMTMuMywyMC42LDEzLjMsMjAuNiwxMy4zeiBNMjAuNiwxMi44DQoJYzAuMSwwLjEsMC4xLDAuMSwwLjEsMC4yYzAsMCwwLDAsMCwwYzAsMCwwLDAsMCwwLjFsMS4zLDAuMmwwLjEtMS44YzAsMCwwLDAtMC4xLDBMMjAuNiwxMi44eiBNMjIuNCwxMC45YzAuMSwwLDAuMywwLDAuNCwwLjENCgljMC4xLDAuMSwwLjIsMC4yLDAuMiwwLjN2MGwyLDAuMkwyMi4zLDEwYzAsMCwwLDAsMCwwTDIyLjQsMTAuOUwyMi40LDEwLjl6IE0xNy41LDEwLjNDMTcuNSwxMC4zLDE3LjUsMTAuMywxNy41LDEwLjNsLTAuMywwLjYNCgljMC4xLDAsMC4xLDAsMC4xLDAuMWMwLjEsMC4xLDAuMSwwLjEsMC4xLDAuMmMwLDAsMCwwLDAsMGMwLDAuMS0wLjEsMC4yLTAuMSwwLjJjMCwwLTAuMSwwLjEtMC4yLDAuMWwwLjQsMS4zbDEuMS0xLjFMMTcuNSwxMC4zeg0KCSBNMjIuOSwxMS40YzAsMC0wLjEsMC4xLTAuMSwwLjFsMCwwbDEuMywxLjJsMS4xLTEuMUwyMi45LDExLjR6IE0yMi41LDExLjZsLTAuMSwxLjdsMS42LTAuNUwyMi41LDExLjYNCglDMjIuNSwxMS42LDIyLjUsMTEuNiwyMi41LDExLjZ6IE0xNy44LDEyLjlsMS44LDAuMWMwLTAuMSwwLjEtMC4xLDAuMS0wLjJsLTAuOC0wLjlMMTcuOCwxMi45eiBNMTkuOCwxMS4xbC0wLjcsMC42bDAuOSwxbDAsMA0KCUwxOS44LDExLjFDMTkuOCwxMS4xLDE5LjgsMTEuMSwxOS44LDExLjF6IE0yMC4zLDEwLjVsMS4zLTAuN2MwLDAsMCwwLDAtMC4xYzAsMCwwLDAsMCwwYzAsMCwwLTAuMSwwLTAuMWwtMi4yLTFsMC41LDEuNw0KCUMyMC4xLDEwLjQsMjAuMiwxMC40LDIwLjMsMTAuNUMyMC4zLDEwLjUsMjAuMywxMC41LDIwLjMsMTAuNXogTTIwLjUsMTAuN0MyMC41LDEwLjcsMjAuNSwxMC43LDIwLjUsMTAuNw0KCUMyMC41LDEwLjcsMjAuNSwxMC43LDIwLjUsMTAuN2MwLDAuMiwwLDAuMy0wLjEsMC4zYy0wLjEsMC0wLjEsMC4xLTAuMiwwLjFsMC4xLDEuNmwxLjUtMi43TDIwLjUsMTAuN3oiLz4NCjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iI0ZGRkZGRiIgZD0iTTIyLjgsMTUuOGwtMi4xLDguNmMwLDAsMCwwLTAuMSwwYy0wLjMsMC0wLjUsMC4xLTAuNiwwLjRsLTItMC41YzAsMCwwLTAuMSwwLTAuMQ0KCWMwLTAuMi0wLjEtMC40LTAuMy0wLjVsMi4zLTguNWMwLDAsMCwwLDAuMSwwYzAuMywwLDAuNS0wLjEsMC42LTAuNGwxLjcsMC41YzAsMCwwLDAsMCwwQzIyLjQsMTUuNCwyMi42LDE1LjcsMjIuOCwxNS44eiBNMzIuNywyMQ0KCWwtNi41LDFsMCwwYy0wLjYsMC4xLTEuMi0wLjItMS41LTAuN2wtMS4yLTJsLTEuMyw0LjlsNS4xLDEuN2MwLjUsMC4yLDAuOCwwLjUsMSwxbDAsMGwyLjYsNy44YzAuMywwLjgtMC4yLDEuNy0xLDEuOQ0KCWMtMC44LDAuMy0xLjctMC4yLTEuOS0xbC0yLjMtNy4xTDE4LjQsMjZsLTIuOCw1LjZjLTAuMSwwLjMtMC40LDAuNS0wLjYsMC42bC02LjcsNC4xYy0wLjcsMC40LTEuNywwLjItMi4xLTAuNQ0KCWMtMC40LTAuNy0wLjItMS43LDAuNS0yLjFsNi40LTMuOWwzLTZsMi4xLTguMUwxNS40LDE2bC0yLjcsNS44Yy0wLjQsMC44LTEuMywxLjEtMiwwLjhjLTAuOC0wLjQtMS4xLTEuMy0wLjgtMmwzLTYuNg0KCWMwLjItMC41LDAuNy0wLjksMS4zLTFsNi4yLTAuM2MtMS4yLTAuOS0yLjEtMi40LTIuMS00LjFjMC0yLjgsMi4zLTUuMSw1LjEtNS4xczUuMSwyLjMsNS4xLDUuMWMwLDIuOC0yLjIsNS00LjksNS4xbDMsNS4xbDUuNS0wLjgNCgljMC44LTAuMSwxLjYsMC41LDEuNywxLjNDMzQuMSwyMC4xLDMzLjUsMjAuOCwzMi43LDIxeiBNMjYuMyw4LjdjMCwwLjQsMC4zLDAuNywwLjcsMC43czAuNy0wLjMsMC43LTAuN1MyNy40LDgsMjcsOA0KCVMyNi4zLDguMywyNi4zLDguN3ogTTMzLjMsMTkuM2MwLTAuNC0wLjMtMC43LTAuNy0wLjdjLTAuMywwLTAuNiwwLjMtMC43LDAuNmwtNS40LDAuOGMwLTAuMy0wLjMtMC42LTAuNy0wLjZjMCwwLTAuMSwwLTAuMSwwDQoJbC0yLjItMy45YzAuMS0wLjEsMC4yLTAuMywwLjItMC41YzAtMC40LTAuMy0wLjctMC43LTAuN2MtMC4zLDAtMC41LDAuMi0wLjYsMC40bC0xLjctMC40YzAsMCwwLDAsMC0wLjFjMC0wLjQtMC4zLTAuNy0wLjctMC43DQoJYy0wLjMsMC0wLjYsMC4zLTAuNywwLjZsLTQuNCwwYy0wLjEtMC4yLTAuMy0wLjMtMC42LTAuM2MtMC40LDAtMC43LDAuMy0wLjcsMC43YzAsMC4yLDAuMSwwLjQsMC4yLDAuNWwtMi40LDUuMQ0KCWMtMC4xLDAtMC4yLDAtMC4yLDBjLTAuNCwwLTAuNywwLjMtMC43LDAuN3MwLjMsMC43LDAuNywwLjdjMC40LDAsMC43LTAuMywwLjctMC43YzAtMC4yLTAuMS0wLjQtMC4yLTAuNWwyLjQtNS4xDQoJYzAuMSwwLDAuMiwwLjEsMC4zLDAuMWMwLjQsMCwwLjctMC4zLDAuNy0wLjdjMCwwLDAsMCwwLTAuMWw0LjQsMGMwLjEsMC4yLDAuMiwwLjMsMC4zLDAuNGwtMi4zLDguNWMwLDAtMC4xLDAtMC4xLDANCgljLTAuNCwwLTAuNywwLjMtMC43LDAuN2MwLDAuMiwwLjEsMC40LDAuMywwLjVMMTQuNiwzMGMwLDAtMC4xLDAtMC4xLDBjLTAuNCwwLTAuNywwLjMtMC43LDAuN2MwLDAuMSwwLDAuMiwwLjEsMC40bC01LjQsMy4zDQoJQzguNCwzNC4xLDguMiwzNCw4LDM0Yy0wLjQsMC0wLjcsMC4zLTAuNywwLjdzMC4zLDAuNywwLjcsMC43YzAuNCwwLDAuNy0wLjMsMC43LTAuN2MwLTAuMSwwLTAuMi0wLjEtMC4zbDUuNC0zLjMNCgljMC4xLDAuMSwwLjMsMC4yLDAuNCwwLjJjMC40LDAsMC43LTAuMywwLjctMC43YzAtMC4yLTAuMS0wLjQtMC4zLTAuNmwyLjQtNS40YzAuMSwwLDAuMSwwLDAuMiwwYzAuMiwwLDAuNC0wLjEsMC42LTAuM2wyLDAuNQ0KCWMwLDAsMCwwLDAsMC4xYzAsMC40LDAuMywwLjcsMC43LDAuN2MwLjIsMCwwLjQtMC4xLDAuNS0wLjJsNS4xLDEuOGMwLDAsMCwwLjEsMCwwLjFjMCwwLjQsMC4zLDAuNywwLjcsMC43YzAsMCwwLjEsMCwwLjEsMA0KCWwyLjEsNi4zYy0wLjIsMC4xLTAuNCwwLjMtMC40LDAuNmMwLDAuNCwwLjMsMC43LDAuNywwLjdjMC40LDAsMC43LTAuMywwLjctMC43cy0wLjMtMC43LTAuNy0wLjdjMCwwLDAsMC0wLjEsMEwyNy4yLDI4DQoJYzAuMi0wLjEsMC4zLTAuMywwLjMtMC41YzAtMC40LTAuMy0wLjctMC43LTAuN2MtMC4yLDAtMC40LDAuMS0wLjUsMC4zbC01LTEuOGMwLTAuMSwwLTAuMSwwLTAuMmMwLTAuMy0wLjEtMC41LTAuMy0wLjZsMi4xLTguNg0KCWMwLDAsMCwwLDAsMGMwLjEsMCwwLjIsMCwwLjIsMGwyLjIsMy44Yy0wLjIsMC4xLTAuMywwLjMtMC4zLDAuNWMwLDAuNCwwLjMsMC43LDAuNywwLjdjMC4zLDAsMC42LTAuMiwwLjYtMC41bDUuNS0wLjgNCgljMC4xLDAuMywwLjMsMC41LDAuNiwwLjVDMzMsMjAsMzMuMywxOS43LDMzLjMsMTkuM3oiLz4NCjwvc3ZnPg0K';

const Message = {
  x: {
    'ja': 'のx座標',
    'ja-Hira': 'のxざひょう',
    'en': ' x',
    'ko': ' x'
  },
  y: {
    'ja': 'のy座標',
    'ja-Hira': 'のyざひょう',
    'en': ' y',
    'ko': ' y'
  },
  peopleCount: {
    'ja': '人数',
    'ja-Hira': 'にんずう',
    'en': 'people count',
    'ko': 'people count'
  },
  nose: {
    'ja': '鼻',
    'ja-Hira': 'はな',
    'en': 'nose',
    'ko': 'nose'
  },
  leftEye: {
    'ja': '左目',
    'ja-Hira': 'ひだりめ',
    'en': 'left eye',
    'ko': 'left eye'
  },
  rightEye: {
    'ja': '右目',
    'ja-Hira': 'みぎめ',
    'en': 'right eye',
    'ko': 'right eye'
  },
  leftEar: {
    'ja': '左耳',
    'ja-Hira': 'ひだりみみ',
    'en': 'left ear',
    'ko': 'left ear'
  },
  rightEar: {
    'ja': '右耳',
    'ja-Hira': 'みぎみみ',
    'en': 'right ear',
    'ko': 'right ear'
  },
  leftShoulder: {
    'ja': '左肩',
    'ja-Hira': 'ひだりかた',
    'en': 'left shoulder',
    'ko': 'left shoulder'
  },
  rightShoulder: {
    'ja': '右肩',
    'ja-Hira': 'みぎかた',
    'en': 'right shoulder',
    'ko': 'right shoulder'
  },
  leftElbow: {
    'ja': '左ひじ',
    'ja-Hira': 'ひだりひじ',
    'en': 'left elbow',
    'ko': 'left elbow'
  },
  rightElbow: {
    'ja': '右ひじ',
    'ja-Hira': 'みぎひじ',
    'en': 'right elbow',
    'ko': 'right elbow'
  },
  leftWrist: {
    'ja': '左手首',
    'ja-Hira': 'ひだりてくび',
    'en': 'left wrist',
    'ko': 'left wrist'
  },
  rightWrist: {
    'ja': '右手首',
    'ja-Hira': 'みぎてくび',
    'en': 'right wrist',
    'ko': 'right wrist'
  },
  leftHip: {
    'ja': '左腰',
    'ja-Hira': 'ひだりこし',
    'en': 'left hip',
    'ko': 'left hip'
  },
  rightHip: {
    'ja': '右腰',
    'ja-Hira': 'みぎこし',
    'en': 'right hip',
    'ko': 'right hip'
  },
  leftKnee: {
    'ja': '左ひざ',
    'ja-Hira': 'ひだりひざ',
    'en': 'left knee',
    'ko': 'left knee'
  },
  rightKnee: {
    'ja': '右ひざ',
    'ja-Hira': 'みぎひざ',
    'en': 'right knee',
    'ko': 'right knee'
  },
  leftAnkle: {
    'ja': '左足首',
    'ja-Hira': 'ひだりあしくび',
    'en': 'left ankle',
    'ko': 'left ankle'
  },
  rightAnkle: {
    'ja': '右足首',
    'ja-Hira': 'みぎあしくび',
    'en': 'right ankle',
    'ko': 'right ankle'
  },
  getX: {
    'ja': '[PERSON_NUMBER] 人目の [PART] のx座標',
    'ja-Hira': '[PERSON_NUMBER] にんめの [PART] のxざひょう',
    'en': '[PART] x of person no. [PERSON_NUMBER]',
    'ko': '[PART] x of person no. [PERSON_NUMBER]'
  },
  getY: {
    'ja': '[PERSON_NUMBER] 人目の [PART] のy座標',
    'ja-Hira': '[PERSON_NUMBER] にんめの [PART] のyざひょう',
    'en': '[PART] y of person no. [PERSON_NUMBER]',
    'ko': '[PART] y of person no. [PERSON_NUMBER]'
  },
  videoToggle: {
    'ja': 'ビデオを[VIDEO_STATE]にする',
    'ja-Hira': 'ビデオを[VIDEO_STATE]にする',
    'en': 'turn video [VIDEO_STATE]',
    'ko': 'turn video [VIDEO_STATE]'
  },
  on: {
    'ja': '入',
    'ja-Hira': 'いり',
    'en': 'on',
    'ko': 'on'
  },
  off: {
    'ja': '切',
    'ja-Hira': 'きり',
    'en': 'off',
    'ko': 'off'
  },
  video_on_flipped: {
    'ja': '左右反転',
    'ja-Hira': 'さゆうはんてん',
    'en': 'on flipped',
    'ko': 'on flipped'
  },
}
const AvailableLocales = ['en', 'ja', 'ja-Hira', 'ko'];

class Scratch3Posenet2ScratchBlocks {
    get PERSON_NUMBERS_MENU () {
      return [
          {
              text: '1',
              value: '1'
          },
          {
              text: '2',
              value: '2'
          },
          {
              text: '3',
              value: '3'
          },
          {
              text: '4',
              value: '4'
          },
          {
              text: '5',
              value: '5'
          },
          {
              text: '6',
              value: '6'
          },
          {
              text: '7',
              value: '7'
          },
          {
              text: '8',
              value: '8'
          },
          {
              text: '9',
              value: '9'
          },
          {
              text: '10',
              value: '10'
          }
      ]
    }

    get PARTS_MENU () {
      return [
          {
              text: Message.nose[this._locale],
              value: '0'
          },
          {
              text: Message.leftEye[this._locale],
              value: '1'
          },
          {
              text: Message.rightEye[this._locale],
              value: '2'
          },
          {
              text: Message.leftEar[this._locale],
              value: '3'
          },
          {
              text: Message.rightEar[this._locale],
              value: '4'
          },
          {
              text: Message.leftShoulder[this._locale],
              value: '5'
          },
          {
              text: Message.rightShoulder[this._locale],
              value: '6'
          },
          {
              text: Message.leftElbow[this._locale],
              value: '7'
          },
          {
              text: Message.rightElbow[this._locale],
              value: '8'
          },
          {
              text: Message.leftWrist[this._locale],
              value: '9'
          },
          {
              text: Message.rightWrist[this._locale],
              value: '10'
          },
          {
              text: Message.leftHip[this._locale],
              value: '11'
          },
          {
              text: Message.rightHip[this._locale],
              value: '12'
          },
          {
              text: Message.leftKnee[this._locale],
              value: '13'
          },
          {
              text: Message.rightKnee[this._locale],
              value: '14'
          },
          {
              text: Message.leftAnkle[this._locale],
              value: '15'
          },
          {
              text: Message.rightAnkle[this._locale],
              value: '16'
          }
      ]
    }

    get VIDEO_MENU () {
      return [
          {
            text: Message.off[this._locale],
            value: 'off'
          },
          {
            text: Message.on[this._locale],
            value: 'on'
          },
          {
            text: Message.video_on_flipped[this._locale],
            value: 'on-flipped'
          }
      ]
    }

    constructor (runtime) {
        this.runtime = runtime;

        this.poses = [];
        this.keypoints = [];

        let video = document.createElement("video");
        video.width = 480;
        video.height = 360;
        video.autoplay = true;
        video.style.display = "none";

        let media = navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });

        media.then((stream) => {
            video.srcObject = stream;
        });

        let poseNet = ml5.poseNet(video, ()=>{
            console.log('Model Loaded!');
        });

        poseNet.on('pose', (poses)=>{
            if (poses.length > 0) {
                this.poses = poses;
                this.keypoints = poses[0].pose.keypoints;
            } else {
                this.poses = [];
                this.keypoints = [];
            }
        });

        this.runtime.ioDevices.video.enableVideo();
    }

    getInfo () {
        this._locale = this.setLocale();
        return {
            id: 'posenet2scratch',
            name: 'Posenet2Scratch',
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'getX',
                    blockType: BlockType.REPORTER,
                    text: Message.getX[this._locale],
                    arguments: {
                        PERSON_NUMBER: {
                            type: ArgumentType.STRING,
                            menu: 'personNumbers',
                            defaultValue: '1'
                        },
                        PART: {
                            type: ArgumentType.STRING,
                            menu: 'parts',
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'getY',
                    blockType: BlockType.REPORTER,
                    text: Message.getY[this._locale],
                    arguments: {
                        PERSON_NUMBER: {
                            type: ArgumentType.STRING,
                            menu: 'personNumbers',
                            defaultValue: '1'
                        },
                        PART: {
                            type: ArgumentType.STRING,
                            menu: 'parts',
                            defaultValue: '0'
                        }
                    }
                },
                {   opcode: 'getPeopleCount',
                    blockType: BlockType.REPORTER,
                    text: Message.peopleCount[this._locale]
                },
                {
                    opcode: 'getNoseX',
                    blockType: BlockType.REPORTER,
                    text: Message.nose[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getNoseY',
                    blockType: BlockType.REPORTER,
                    text: Message.nose[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getLeftEyeX',
                    blockType: BlockType.REPORTER,
                    text: Message.leftEye[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getLeftEyeY',
                    blockType: BlockType.REPORTER,
                    text: Message.leftEye[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getRightEyeX',
                    blockType: BlockType.REPORTER,
                    text: Message.rightEye[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getRightEyeY',
                    blockType: BlockType.REPORTER,
                    text: Message.rightEye[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getLeftEarX',
                    blockType: BlockType.REPORTER,
                    text: Message.leftEar[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getLeftEarY',
                    blockType: BlockType.REPORTER,
                    text: Message.leftEar[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getRightEarX',
                    blockType: BlockType.REPORTER,
                    text: Message.rightEar[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getRightEarY',
                    blockType: BlockType.REPORTER,
                    text: Message.rightEar[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getLeftShoulderX',
                    blockType: BlockType.REPORTER,
                    text: Message.leftShoulder[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getLeftShoulderY',
                    blockType: BlockType.REPORTER,
                    text: Message.leftShoulder[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getRightShoulderX',
                    blockType: BlockType.REPORTER,
                    text: Message.rightShoulder[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getRightShoulderY',
                    blockType: BlockType.REPORTER,
                    text: Message.rightShoulder[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getLeftElbowX',
                    blockType: BlockType.REPORTER,
                    text: Message.leftElbow[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getLeftElbowY',
                    blockType: BlockType.REPORTER,
                    text: Message.leftElbow[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getRightElbowX',
                    blockType: BlockType.REPORTER,
                    text: Message.rightElbow[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getRightElbowY',
                    blockType: BlockType.REPORTER,
                    text: Message.rightElbow[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getLeftWristX',
                    blockType: BlockType.REPORTER,
                    text: Message.leftWrist[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getLeftWristY',
                    blockType: BlockType.REPORTER,
                    text: Message.leftWrist[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getRightWristX',
                    blockType: BlockType.REPORTER,
                    text: Message.rightWrist[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getRightWristY',
                    blockType: BlockType.REPORTER,
                    text: Message.rightWrist[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getLeftHipX',
                    blockType: BlockType.REPORTER,
                    text: Message.leftHip[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getLeftHipY',
                    blockType: BlockType.REPORTER,
                    text: Message.leftHip[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getRightHipX',
                    blockType: BlockType.REPORTER,
                    text: Message.rightHip[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getRightHipY',
                    blockType: BlockType.REPORTER,
                    text: Message.rightHip[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getLeftKneeX',
                    blockType: BlockType.REPORTER,
                    text: Message.leftKnee[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getLeftKneeY',
                    blockType: BlockType.REPORTER,
                    text: Message.leftKnee[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getRightKneeX',
                    blockType: BlockType.REPORTER,
                    text: Message.rightKnee[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getRightKneeY',
                    blockType: BlockType.REPORTER,
                    text: Message.rightKnee[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getLeftAnkleX',
                    blockType: BlockType.REPORTER,
                    text: Message.leftAnkle[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getLeftAnkleY',
                    blockType: BlockType.REPORTER,
                    text: Message.leftAnkle[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getRightAnkleX',
                    blockType: BlockType.REPORTER,
                    text: Message.rightAnkle[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getRightAnkleY',
                    blockType: BlockType.REPORTER,
                    text: Message.rightAnkle[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'videoToggle',
                    blockType: BlockType.COMMAND,
                    text: Message.videoToggle[this._locale],
                    arguments: {
                        VIDEO_STATE: {
                            type: ArgumentType.STRING,
                            menu: 'videoMenu',
                            defaultValue: 'off'
                        }
                    }
                }
            ],
            menus: {
              personNumbers: {
                acceptReporters: true,
                items: this.PERSON_NUMBERS_MENU
              },
              parts: {
                acceptReporters: true,
                items: this.PARTS_MENU
              },
              videoMenu: {
                acceptReporters: false,
                items: this.VIDEO_MENU
              }
            }
        };
    }

    getX (args) {
      if (this.poses[parseInt(args.PERSON_NUMBER, 10) - 1] && this.poses[parseInt(args.PERSON_NUMBER, 10) - 1].pose.keypoints[parseInt(args.PART, 10)]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.poses[parseInt(args.PERSON_NUMBER, 10) - 1].pose.keypoints[parseInt(args.PART, 10)].position.x);
        } else {
          return 240 - this.poses[parseInt(args.PERSON_NUMBER, 10) - 1].pose.keypoints[parseInt(args.PART, 10)].position.x;
        }
      } else {
        return "";
      }
    }

    getY (args) {
      if (this.poses[parseInt(args.PERSON_NUMBER, 10) - 1] && this.poses[parseInt(args.PERSON_NUMBER, 10) - 1].pose.keypoints[parseInt(args.PART, 10)]) {
        return 180 - this.poses[parseInt(args.PERSON_NUMBER, 10) - 1].pose.keypoints[parseInt(args.PART, 10)].position.y;
      } else {
        return "";
      }
    }

    getPeopleCount () {
      return this.poses.length;
    }

    getNoseX () {
      if (this.keypoints[0]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[0].position.x);
        } else {
          return 240 - this.keypoints[0].position.x;
        }
      } else {
        return "";
      }
    }

    getNoseY () {
      if (this.keypoints[0]) {
        return 180 - this.keypoints[0].position.y;
      } else {
        return "";
      }
    }

    getLeftEyeX () {
      if (this.keypoints[1]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[1].position.x);
        } else {
          return 240 - this.keypoints[1].position.x;
        }
      } else {
        return "";
      }
    }

    getLeftEyeY () {
      if (this.keypoints[1]) {
        return 180 - this.keypoints[1].position.y;
      } else {
        return "";
      }
    }

    getRightEyeX () {
      if (this.keypoints[2]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[2].position.x);
        } else {
          return 240 - this.keypoints[2].position.x;
        }
      } else {
        return "";
      }
    }

    getRightEyeY () {
      if (this.keypoints[2]) {
        return 180 - this.keypoints[2].position.y;
      } else {
        return "";
      }
    }

    getLeftEarX () {
      if (this.keypoints[3]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[3].position.x);
        } else {
          return 240 - this.keypoints[3].position.x;
        }
      } else {
        return "";
      }
    }

    getLeftEarY () {
      if (this.keypoints[3]) {
        return 180 - this.keypoints[3].position.y;
      } else {
        return "";
      }
    }

    getRightEarX () {
      if (this.keypoints[4]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[4].position.x);
        } else {
          return 240 - this.keypoints[4].position.x;
        }
      } else {
        return "";
      }
    }

    getRightEarY () {
      if (this.keypoints[4]) {
        return 180 - this.keypoints[4].position.y;
      } else {
        return "";
      }
    }

    getLeftShoulderX () {
      if (this.keypoints[5]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[5].position.x);
        } else {
          return 240 - this.keypoints[5].position.x;
        }
      } else {
        return "";
      }
    }

    getLeftShoulderY () {
      if (this.keypoints[5]) {
        return 180 - this.keypoints[5].position.y;
      } else {
        return "";
      }
    }

    getRightShoulderX () {
      if (this.keypoints[6]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[6].position.x);
        } else {
          return 240 - this.keypoints[6].position.x;
        }
      } else {
        return "";
      }
    }

    getRightShoulderY () {
      if (this.keypoints[6]) {
        return 180 - this.keypoints[6].position.y;
      } else {
        return "";
      }
    }

    getLeftElbowX () {
      if (this.keypoints[7]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[7].position.x);
        } else {
          return 240 - this.keypoints[7].position.x;
        }
      } else {
        return "";
      }
    }

    getLeftElbowY () {
      if (this.keypoints[7]) {
        return 180 - this.keypoints[7].position.y;
      } else {
        return "";
      }
    }

    getRightElbowX () {
      if (this.keypoints[8]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[8].position.x);
        } else {
          return 240 - this.keypoints[8].position.x;
        }
      } else {
        return "";
      }
    }

    getRightElbowY () {
      if (this.keypoints[8]) {
        return 180 - this.keypoints[8].position.y;
      } else {
        return "";
      }
    }

    getLeftWristX () {
      if (this.keypoints[9]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[9].position.x);
        } else {
          return 240 - this.keypoints[9].position.x;
        }
      } else {
        return "";
      }
    }

    getLeftWristY () {
      if (this.keypoints[9]) {
        return 180 - this.keypoints[9].position.y;
      } else {
        return "";
      }
    }

    getRightWristX () {
      if (this.keypoints[10]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[10].position.x);
        } else {
          return 240 - this.keypoints[10].position.x;
        }
      } else {
        return "";
      }
    }

    getRightWristY () {
      if (this.keypoints[10]) {
        return 180 - this.keypoints[10].position.y;
      } else {
        return "";
      }
    }

    getLeftHipX () {
      if (this.keypoints[11]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[11].position.x);
        } else {
          return 240 - this.keypoints[11].position.x;
        }
      } else {
        return "";
      }
    }

    getLeftHipY () {
      if (this.keypoints[11]) {
        return 180 - this.keypoints[11].position.y;
      } else {
        return "";
      }
    }

    getRightHipX () {
      if (this.keypoints[12]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[12].position.x);
        } else {
          return 240 - this.keypoints[12].position.x;
        }
      } else {
        return "";
      }
    }

    getRightHipY () {
      if (this.keypoints[12]) {
        return 180 - this.keypoints[12].position.y;
      } else {
        return "";
      }
    }

    getLeftKneeX () {
      if (this.keypoints[13]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[13].position.x);
        } else {
          return 240 - this.keypoints[13].position.x;
        }
      } else {
        return "";
      }
    }

    getLeftKneeY () {
      if (this.keypoints[13]) {
        return 180 - this.keypoints[13].position.y;
      } else {
        return "";
      }
    }

    getRightKneeX () {
      if (this.keypoints[14]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[14].position.x);
        } else {
          return 240 - this.keypoints[14].position.x;
        }
      } else {
        return "";
      }
    }

    getRightKneeY () {
      if (this.keypoints[14]) {
        return 180 - this.keypoints[14].position.y;
      } else {
        return "";
      }
    }

    getLeftAnkleX () {
      if (this.keypoints[15]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[15].position.x);
        } else {
          return 240 - this.keypoints[15].position.x;
        }
      } else {
        return "";
      }
    }

    getLeftAnkleY () {
      if (this.keypoints[15]) {
        return 180 - this.keypoints[15].position.y;
      } else {
        return "";
      }
    }

    getRightAnkleX () {
      if (this.keypoints[16]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[16].position.x);
        } else {
          return 240 - this.keypoints[16].position.x;
        }
      } else {
        return "";
      }
    }

    getRightAnkleY () {
      if (this.keypoints[16]) {
        return 180 - this.keypoints[16].position.y;
      } else {
        return "";
      }
    }

    videoToggle (args) {
      let state = args.VIDEO_STATE;
      if (state === 'off') {
        this.runtime.ioDevices.video.disableVideo();
      } else {
        this.runtime.ioDevices.video.enableVideo();
        this.runtime.ioDevices.video.mirror = state === "on";
      }
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

module.exports = Scratch3Posenet2ScratchBlocks;