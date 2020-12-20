const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const ml5 = require('ml5');
const formatMessage = require('format-message');

const HAT_TIMEOUT = 100;

const blockIconURI = 'data:image/png;base64,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';

const Message = {
  train_label_1: {
    'ja': 'ラベル1を学習する',
    'ja-Hira': 'ラベル1をがくしゅうする',
    'en': 'train label 1',
    'zh-cn': '培训标签1',
    'ko': '트레이닝 레이블 1',
    'de': 'Trainingsetikett 1',
    'es': 'Etiqueta de formación 1',
    'ru': 'Этикетка обучения 1',
    'sr': 'Oznaka treninga 1'
  },
  train_label_2: {
    'ja': 'ラベル2を学習する',
    'ja-Hira': 'ラベル2をがくしゅうする',
    'en': 'train label 2',
    'zh-cn': '培训标签2',
    'ko': '트레이닝 레이블 2',
    'de': 'Trainingsetikett 2',
    'es': 'Etiqueta de formación 2',
    'ru': 'Этикетка обучения 2',
    'sr': 'Oznaka treninga 2'
  },
  train_label_3: {
    'ja': 'ラベル3を学習する',
    'ja-Hira': 'ラベル3をがくしゅうする',
    'en': 'train label 3',
    'zh-cn': '培训标签3',
    'ko': '트레이닝 레이블 3',
    'de': 'Trainingsetikett 3',
    'es': 'Etiqueta de formación 3',
    'ru': 'Этикетка обучения 3',
    'sr': 'Oznaka treninga 3'
  },
  train: {
    'ja': 'ラベル[LABEL]を学習する',
    'ja-Hira': 'ラベル[LABEL]をがくしゅうする',
    'en': 'train label [LABEL]',
    'zh-cn': '培训标签[LABEL]',
    'ko': '트레이닝 레이블 [LABEL]',
    'de': 'Trainingsetikett [LABEL]',
    'es': 'Etiqueta de formación [LABEL]',
    'ru': 'Этикетка обучения [LABEL]',
    'sr': 'Oznaka treninga [LABEL]'
  },
  when_received_block: {
    'ja': 'ラベル[LABEL]を受け取ったとき',
    'ja-Hira': 'ラベル[LABEL]をうけとったとき',
    'en': 'when received label:[LABEL]',
    'zh-cn': '收到标签时[LABEL]时',
    'ko': '수신된 레이블:[LABEL]',
    'de': 'bei Erhalt Etikett [LABEL]',
    'es': 'cuando recibe la etiqueta [LABEL]',
    'ru': 'при получении ярлык [LABEL]',
    'sr': 'kada je primljena etiketa [LABEL]'
  },
  label_block: {
    'ja': 'ラベル',
    'ja-Hira': 'ラベル',
    'en': 'label',
    'zh-cn': '标签',
    'ko': '레이블',
    'de': 'Etikette',
    'es': 'etiqueta',
    'ru': 'этикетка',
    'sr': 'oznaka'
  },
  counts_label_1: {
    'ja': 'ラベル1の枚数',
    'ja-Hira': 'ラベル1のまいすう',
    'en': 'counts of label 1',
    'zh-cn': '标签1的计数',
    'ko': '레이블 1의 개수',
    'de': 'Anzahl der Etiketten 1',
    'es': 'recuentos de etiqueta 1',
    'ru': 'количество метки 1',
    'sr': 'brojevi oznake 1'
  },
  counts_label_2: {
    'ja': 'ラベル2の枚数',
    'ja-Hira': 'ラベル2のまいすう',
    'en': 'counts of label 2',
    'zh-cn': '标签2的计数',
    'ko': '레이블 2의 개수',
    'de': 'Anzahl der Etiketten 2',
    'es': 'recuentos de etiqueta 2',
    'ru': 'количество метки 2',
    'sr': 'brojevi oznake 2'
  },
  counts_label_3: {
    'ja': 'ラベル3の枚数',
    'ja-Hira': 'ラベル3のまいすう',
    'en': 'counts of label 3',
    'zh-cn': '标签3的计数',
    'ko': '레이블 3의 개수',
    'de': 'Anzahl der Etiketten 3',
    'es': 'recuentos de etiqueta 3',
    'ru': 'количество метки 3',
    'sr': 'brojevi oznake 3'
  },
  counts_label_4: {
    'ja': 'ラベル4の枚数',
    'ja-Hira': 'ラベル4のまいすう',
    'en': 'counts of label 4',
    'zh-cn': '标签4的计数',
    'ko': '레이블 4의 개수',
    'de': 'Anzahl der Etiketten 4',
    'es': 'recuentos de etiqueta 4',
    'ru': 'количество метки 4',
    'sr': 'brojevi oznake 4'
  },
  counts_label_5: {
    'ja': 'ラベル5の枚数',
    'ja-Hira': 'ラベル5のまいすう',
    'en': 'counts of label 5',
    'zh-cn': '标签5的计数',
    'ko': '레이블 5의 개수',
    'de': 'Anzahl der Etiketten 5',
    'es': 'recuentos de etiqueta 5',
    'ru': 'количество метки 5',
    'sr': 'brojevi oznake 5'
  },
  counts_label_6: {
    'ja': 'ラベル6の枚数',
    'ja-Hira': 'ラベル6のまいすう',
    'en': 'counts of label 6',
    'zh-cn': '标签6的计数',
    'ko': '레이블 6의 개수',
    'de': 'Anzahl der Etiketten 6',
    'es': 'recuentos de etiqueta 6',
    'ru': 'количество метки 6',
    'sr': 'brojevi oznake 6'
  },
  counts_label_7: {
    'ja': 'ラベル7の枚数',
    'ja-Hira': 'ラベル7のまいすう',
    'en': 'counts of label 7',
    'zh-cn': '标签7的计数',
    'ko': '레이블 7의 개수',
    'de': 'Anzahl der Etiketten 7',
    'es': 'recuentos de etiqueta 7',
    'ru': 'количество метки 7',
    'sr': 'brojevi oznake 7'
  },
  counts_label_8: {
    'ja': 'ラベル8の枚数',
    'ja-Hira': 'ラベル8のまいすう',
    'en': 'counts of label 8',
    'zh-cn': '标签8的计数',
    'ko': '레이블 8의 개수',
    'de': 'Anzahl der Etiketten 8',
    'es': 'recuentos de etiqueta 8',
    'ru': 'количество метки 8',
    'sr': 'brojevi oznake 8'
  },
  counts_label_9: {
    'ja': 'ラベル9の枚数',
    'ja-Hira': 'ラベル9のまいすう',
    'en': 'counts of label 9',
    'zh-cn': '标签9的计数',
    'ko': '레이블 9의 개수',
    'de': 'Anzahl der Etiketten 9',
    'es': 'recuentos de etiqueta 9',
    'ru': 'количество метки 9',
    'sr': 'brojevi oznake 9'
  },
  counts_label_10: {
    'ja': 'ラベル10の枚数',
    'ja-Hira': 'ラベル10のまいすう',
    'en': 'counts of label 10',
    'zh-cn': '标签10的计数',
    'ko': '레이블 10의 개수',
    'de': 'Anzahl der Etiketten 10',
    'es': 'recuentos de etiqueta 10',
    'ru': 'количество метки 10',
    'sr': 'brojevi oznake 10'
  },
  counts_label: {
    'ja': 'ラベル[LABEL]の枚数',
    'ja-Hira': 'ラベル[LABEL]のまいすう',
    'en': 'counts of label [LABEL]',
    'zh-cn': '标签[LABEL]的计数',
    'ko': '레이블 [LABEL]의 개수',
    'de': 'Anzahl der Etiketten [LABEL]',
    'es': 'recuentos de etiqueta [LABEL]',
    'ru': 'количество метки [LABEL]',
    'sr': 'brojevi oznake [LABEL]'
  },
  any: {
    'ja': 'のどれか',
    'ja-Hira': 'のどれか',
    'en': 'any',
    'zh-cn': '任何',
    'ko': '임의',
    'de': 'beliebig',
    'es': 'cualquiera',
    'ru': 'любой',
    'sr': 'bilo koja'
  },
  all: {
    'ja': 'の全て',
    'ja-Hira': 'のすべて',
    'en': 'all',
    'zh-cn': '全部',
    'ko': '모두',
    'de': 'alle',
    'es': 'todos',
    'ru': 'все',
    'sr': 'sve'
  },
  reset: {
    'ja': 'ラベル[LABEL]の学習をリセット',
    'ja-Hira': 'ラベル[LABEL]のがくしゅうをリセット',
    'en': 'reset label:[LABEL]',
    'zh-cn': '重置标签[LABEL]',
    'ko': '리셋 레이블:[LABEL]',
    'de': 'Etikett zurücksetzen:[LABEL]',
    'es': 'reiniciar etiqueta:[LABEL]',
    'ru': 'метка сброса:[LABEL]',
    'sr': 'reset oznaka:[LABEL]'
  },
  download_learning_data: {
    'ja': '学習データをダウンロード',
    'ja-Hira': 'がくしゅうデータをダウンロード',
    'en': 'download learning data',
    'zh-cn': '下载学习资料',
    'ko': '학습 데이터 다운로드',
    'de': 'Lerndaten herunterladen',
    'es': 'descargar datos de aprendizaje',
    'ru': 'скачать данные обучения',
    'sr': 'preuzmite podatke o učenju'
  },
  upload_learning_data: {
    'ja': '学習データをアップロード',
    'ja-Hira': 'がくしゅうデータをアップロード',
    'en': 'upload learning data',
    'zh-cn': '上传学习数据',
    'ko': '학습 데이터 업로드',
    'de': 'Lerndaten hochladen',
    'es': 'cargar datos de aprendizaje',
    'ru': 'загрузить данные обучения',
    'sr': 'učitavanje podataka o učenju'
  },
  upload: {
    'ja': 'アップロード',
    'ja-Hira': 'アップロード',
    'en': 'upload',
    'zh-cn': '上传',
    'ko': 'upload',
    'de': 'upload',
    'es': 'upload',
    'ru': 'upload',
    'sr': 'upload'
  },
  uploaded: {
    'ja': 'アップロードが完了しました。',
    'ja-Hira': 'アップロードがかんりょうしました。',
    'en': 'The upload is complete.',
    'zh-cn': '上传完成。',
    'ko': 'The upload is complete.',
    'de': 'The upload is complete.',
    'es': 'The upload is complete.',
    'ru': 'The upload is complete.',
    'sr': 'The upload is complete.'
  },
  upload_instruction: {
    'ja': 'ファイルを選び、アップロードボタンをクリックして下さい。',
    'ja-Hira': 'ファイルをえらび、アップロードボタンをクリックしてください。',
    'en': 'Select a file and click the upload button.',
    'zh-cn': '选择一个文件，然后单击上传按钮。',
    'ko': 'Select a file and click the upload button.',
    'de': 'Select a file and click the upload button.',
    'es': 'Select a file and click the upload button.',
    'ru': 'Select a file and click the upload button.',
    'sr': 'Select a file and click the upload button.'
  },
  confirm_reset: {
    'ja': '本当にリセットしてもよろしいですか？',
    'ja-Hira': 'ほんとうにリセットしてもよろしいですか？',
    'en': 'Are you sure to reset?',
    'zh-cn': '你确定要重置吗？',
    'ko': '재설정하시겠습니까?',
    'de': 'Are you sure to reset?',
    'es': 'Are you sure to reset?',
    'ru': 'Are you sure to reset?',
    'sr': 'Are you sure to reset?'
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
  set_classification_interval: {
    'ja': 'ラベル付けを[CLASSIFICATION_INTERVAL]秒間に1回行う',
    'ja-Hira': 'ラベルづけを[CLASSIFICATION_INTERVAL]びょうかんに1かいおこなう',
    'en': 'Label once every [CLASSIFICATION_INTERVAL] seconds',
    'zh-cn': '每[CLASSIFICATION_INTERVAL]秒标签一次',
    'ko': '[CLASSIFICATION_INTERVAL] 초마다 한 번씩 분류',
    'de': 'Beschriften Sie einmal alle [CLASSIFICATION_INTERVAL] Sekunden',
    'es': 'Etiquetar una vez cada [CLASSIFICATION_INTERVAL] segundos',
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
  set_input: {
    'ja': '[INPUT]の画像を学習/判定する',
    'ja-Hira': '[INPUT]のがぞうをがくしゅう/はんていする',
    'en': 'Learn/Classify [INPUT] image',
    'zh-cn': '学习/分类 [INPUT] 图像',
    'ko': '이미지 학습/분류 [INPUT]',
    'de': 'Bild lernen / klassifizieren [INPUT]',
    'es': 'Aprender / clasificar [INPUT] imagen',
    'ru': 'Изучение / классификация [INPUT] изображение',
    'sr': 'Nauči / klasificiraj sliku [INPUT]'
  },
  on: {
    'ja': '入',
    'ja-Hira': 'いり',
    'en': 'on',
    'zh-cn': '打开',
    'ko': '켜기',
    'de': 'ein',
    'es': 'activar',
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
    'es': 'desactivar',
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
  },
  webcam: {
    'ja': 'カメラ',
    'ja-Hira': 'カメラ',
    'en': 'webcam',
    'zh-cn': '网络摄像头',
    'ko': '웹캠',
    'de': 'Webcam',
    'es': 'cámara web',
    'ru': 'веб-камера',
    'sr': 'web kamera'
  },
  stage: {
    'ja': 'ステージ',
    'ja-Hira': 'ステージ',
    'en': 'stage',
    'zh-cn': '舞台',
    'ko': '스테이지',
    'de': 'Bühne',
    'es': 'escenario',
    'ru': 'сцена',
    'sr': 'pozornica'
  },
  first_training_warning: {
    'ja': '最初の学習にはしばらく時間がかかるので、何度もクリックしないで下さい。',
    'ja-Hira': 'さいしょのがくしゅうにはしばらくじかんがかかるので、なんどもクリックしないでください。',
    'en': 'The first training will take a while, so do not click again and again.',
    'zh-cn': '第一项研究需要一段时间，所以不要一次又一次地点击。',
    'ko': '첫 번째 훈련에는 시간이 좀 걸리므로 계속해서 클릭하지 마십시오.',
    'de': 'The first training will take a while, so do not click again and again.',
    'es': 'The first training will take a while, so do not click again and again.',
    'ru': 'The first training will take a while, so do not click again and again.',
    'sr': 'The first training will take a while, so do not click again and again.'
  }
}

const AvailableLocales = ['en', 'ja', 'ja-Hira', 'zh-cn', 'ko', 'de', 'es', 'ru', 'sr'];

class Scratch3ML2ScratchBlocks {
  constructor (runtime) {
    this.runtime = runtime;
    this.when_received = false;
    this.when_received_arr = Array(8).fill(false);
    this.label = null;
    this.locale = this.setLocale();

    this.video = document.createElement("video");
    this.video.width = 480;
    this.video.height = 360;
    this.video.autoplay = true;
    this.video.style.display = "none";

    this.blockClickedAt = null;

    this.counts = null;
    this.firstTraining = true;

    this.interval = 1000;

    let media = navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });

    media.then((stream) => {
      this.video.srcObject = stream;
    });

    this.canvas = document.querySelector('canvas');

    this.input =  this.video;

    this.knnClassifier = ml5.KNNClassifier();
    this.featureExtractor = ml5.featureExtractor('MobileNet', () => {
      // console.log('[featureExtractor] Model Loaded!');
      this.timer = setInterval(() => {
        this.classify();
      }, this.interval);
    });

    this.runtime.ioDevices.video.enableVideo();
  }

  getInfo() {
    this.locale = this.setLocale();

    return {
      id: 'ml2scratch',
      name: 'Cubroid Machine Learning',
      blockIconURI: blockIconURI,
      blocks: [
        {
          opcode: 'addExample1',
          blockType: BlockType.COMMAND,
          text: Message.train_label_1[this.locale]
        },
        {
          opcode: 'addExample2',
          blockType: BlockType.COMMAND,
          text: Message.train_label_2[this.locale]
        },
        {
          opcode: 'addExample3',
          blockType: BlockType.COMMAND,
          text: Message.train_label_3[this.locale]
        },
        {
          opcode: 'train',
          text: Message.train[this.locale],
          blockType: BlockType.COMMAND,
          arguments: {
            LABEL: {
              type: ArgumentType.STRING,
              menu: 'train_menu',
              defaultValue: '4'
            }
          }
        },
        {
          opcode: 'trainAny',
          text: Message.train[this.locale],
          blockType: BlockType.COMMAND,
          arguments: {
            LABEL: {
              type: ArgumentType.STRING,
              defaultValue: '11'
            }
          }
        },
        {
          opcode: 'getLabel',
          text: Message.label_block[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'whenReceived',
          text: Message.when_received_block[this.locale],
          blockType: BlockType.HAT,
          arguments: {
            LABEL: {
              type: ArgumentType.STRING,
              menu: 'received_menu',
              defaultValue: 'any'
            }
          }
        },
        {
          opcode: 'whenReceivedAny',
          text: Message.when_received_block[this.locale],
          blockType: BlockType.HAT,
          arguments: {
            LABEL: {
              type: ArgumentType.STRING,
              defaultValue: '11'
            }
          }
        },
        {
          opcode: 'getCountByLabel1',
          text: Message.counts_label_1[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel2',
          text: Message.counts_label_2[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel3',
          text: Message.counts_label_3[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel4',
          text: Message.counts_label_4[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel5',
          text: Message.counts_label_5[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel6',
          text: Message.counts_label_6[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel7',
          text: Message.counts_label_7[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel8',
          text: Message.counts_label_8[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel9',
          text: Message.counts_label_9[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel10',
          text: Message.counts_label_10[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel',
          text: Message.counts_label[this.locale],
          blockType: BlockType.REPORTER,
          arguments: {
            LABEL: {
              type: ArgumentType.STRING,
              defaultValue: '11'
            }
          }
        },
        {
          opcode: 'reset',
          blockType: BlockType.COMMAND,
          text: Message.reset[this.locale],
          arguments: {
            LABEL: {
              type: ArgumentType.STRING,
              menu: 'reset_menu',
              defaultValue: 'all'
            }
          }
        },
        {
          opcode: 'resetAny',
          blockType: BlockType.COMMAND,
          text: Message.reset[this.locale],
          arguments: {
            LABEL: {
              type: ArgumentType.STRING,
              defaultValue: '11'
            }
          }
        },
        {
          opcode: 'download',
          text: Message.download_learning_data[this.locale],
          blockType: BlockType.COMMAND
        },
        {
          opcode: 'upload',
          text: Message.upload_learning_data[this.locale],
          blockType: BlockType.COMMAND
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
        },
        {
          opcode: 'setInput',
          text: Message.set_input[this.locale],
          blockType: BlockType.COMMAND,
          arguments: {
            INPUT: {
              type: ArgumentType.STRING,
              menu: 'input_menu',
              defaultValue: 'webcam'
            }
          }
        }

      ],
      menus: {
        received_menu: {
          items: this.getMenu('received')
        },
        reset_menu: {
          items: this.getMenu('reset')
        },
        train_menu: {
          items: this.getTrainMenu()
        },
        count_menu: {
          items: this.getTrainMenu()
        },
        video_menu: this.getVideoMenu(),
        classification_interval_menu: {
          acceptReporters: true,
          items: this.getClassificationIntervalMenu()
        },
        classification_menu: this.getClassificationMenu(),
        input_menu: this.getInputMenu()
      }
    };
  }

  addExample1() {
    this.firstTrainingWarning();
    let features = this.featureExtractor.infer(this.input);
    this.knnClassifier.addExample(features, '1');
    this.updateCounts();
  }

  addExample2() {
    this.firstTrainingWarning();
    let features = this.featureExtractor.infer(this.input);
    this.knnClassifier.addExample(features, '2');
    this.updateCounts();
  }

  addExample3() {
    this.firstTrainingWarning();
    let features = this.featureExtractor.infer(this.input);
    this.knnClassifier.addExample(features, '3');
    this.updateCounts();
  }

  train(args) {
    this.firstTrainingWarning();
    let features = this.featureExtractor.infer(this.input);
    this.knnClassifier.addExample(features, args.LABEL);
    this.updateCounts();
  }

  trainAny(args) {
    this.train(args);
  }

  getLabel() {
    return this.label;
  }

  whenReceived(args) {
    if (args.LABEL === 'any') {
      if (this.when_received) {
        setTimeout(() => {
            this.when_received = false;
        }, HAT_TIMEOUT);
        return true;
      }
      return false;
    } else {
      if (this.when_received_arr[args.LABEL]) {
        setTimeout(() => {
          this.when_received_arr[args.LABEL] = false;
        }, HAT_TIMEOUT);
        return true;
      }
      return false;
    }
  }

  whenReceivedAny(args) {
    return this.whenReceived(args);
  }

  getCountByLabel1() {
    if (this.counts) {
      return this.counts['1'];
    } else {
      return 0;
    }
  }

  getCountByLabel2() {
    if (this.counts) {
      return this.counts['2'];
    } else {
      return 0;
    }
  }

  getCountByLabel3() {
    if (this.counts) {
      return this.counts['3'];
    } else {
      return 0;
    }
  }

  getCountByLabel4() {
    if (this.counts) {
      return this.counts['4'];
    } else {
      return 0;
    }
  }

  getCountByLabel5() {
    if (this.counts) {
      return this.counts['5'];
    } else {
      return 0;
    }
  }

  getCountByLabel6() {
    if (this.counts) {
      return this.counts['6'];
    } else {
      return 0;
    }
  }

  getCountByLabel7() {
    if (this.counts) {
      return this.counts['7'];
    } else {
      return 0;
    }
  }

  getCountByLabel8() {
    if (this.counts) {
      return this.counts['8'];
    } else {
      return 0;
    }
  }

  getCountByLabel9() {
    if (this.counts) {
      return this.counts['9'];
    } else {
      return 0;
    }
  }

  getCountByLabel10() {
    if (this.counts) {
      return this.counts['10'];
    } else {
      return 0;
    }
  }

  getCountByLabel(args) {
    if (this.counts[args.LABEL]) {
      return this.counts[args.LABEL];
    } else {
      return 0;
    }
  }

  reset(args) {
    if (this.actionRepeated()) { return };

    setTimeout(() => {
      let result = confirm(Message.confirm_reset[this.locale]);
      if (result) {
        if (args.LABEL == 'all') {
          this.knnClassifier.clearAllLabels();
          for (let label in this.counts) {
            this.counts[label] = 0;
          }
        } else {
          if (this.counts[args.LABEL] > 0) {
            this.knnClassifier.clearLabel(args.LABEL);
            this.counts[args.LABEL] = 0;
          }
        }
      }
    }, 1000);
  }

  resetAny(args) {
    this.reset(args);
  }

  download() {
    if (this.actionRepeated()) { return };
    let fileName = String(Date.now());
    this.knnClassifier.save(fileName);
  }

  upload() {
    if (this.actionRepeated()) { return };
    let width = 480;
    let height = 200;
    let left = window.innerWidth / 2;
    let top = window.innerHeight / 2;
    let x = left - (width / 2);
    let y = top - (height / 2);
    uploadWindow = window.open('', null, 'top=' + y + ',left=' + x + ',width=' + width + ',height=' + height);
    uploadWindow.document.open();
    uploadWindow.document.write('<html><head><title>' + Message.upload_learning_data[this.locale] + '</title></head><body>');
    uploadWindow.document.write('<p>' + Message.upload_instruction[this.locale] + '</p>');
    uploadWindow.document.write('<input type="file" id="upload-files">');
    uploadWindow.document.write('<input type="button" value="' + Message.upload[this.locale] + '" id="upload-button">');
    uploadWindow.document.write('</body></html>');
    uploadWindow.document.close();

    uploadWindow.document.getElementById("upload-button").onclick = () =>{
      this.uploadButtonClicked(uploadWindow);
    }
  }

  toggleClassification (args) {
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
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.interval = args.CLASSIFICATION_INTERVAL * 1000;
    this.timer = setInterval(() => {
      this.classify();
    }, this.interval);
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

  setInput (args) {
    let input = args.INPUT;
    if (input === 'webcam') {
      this.input = this.video;
    } else {
      this.input = this.canvas;
    }
  }

  uploadButtonClicked(uploadWindow) {
    let files = uploadWindow.document.getElementById('upload-files').files;

    if (files.length <= 0) {
      alert('Please select JSON file.');
      return false;
    }

    let fr = new FileReader();

    fr.onload = (e) => {
      let data = JSON.parse(e.target.result);
      this.knnClassifier.load(data, () => {
        // console.log('uploaded!');

        this.updateCounts();
        alert(Message.uploaded[this.locale]);
      });
    }

    fr.onloadend = (e) => {
      uploadWindow.document.getElementById('upload-files').value = "";
    }

    fr.readAsText(files.item(0));
    uploadWindow.close();
  }

  classify() {
    let numLabels = this.knnClassifier.getNumLabels();
    if (numLabels == 0) return;

    let features = this.featureExtractor.infer(this.input);
    this.knnClassifier.classify(features, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        this.label = this.getTopConfidenceLabel(result.confidencesByLabel);
        this.when_received = true;
        this.when_received_arr[this.label] = true
      }
    });
  }

  getTopConfidenceLabel(confidences) {
    let topConfidenceLabel;
    let topConfidence = 0;

    for (let label in confidences) {
      if (confidences[label] > topConfidence) {
        topConfidenceLabel = label;
      }
    }

    return topConfidenceLabel;
  }

  updateCounts() {
    this.counts = this.knnClassifier.getCountByLabel();
    console.debug(this.counts);
  }

  actionRepeated() {
    let currentTime = Date.now();
    if (this.blockClickedAt && (this.blockClickedAt + 250) > currentTime) {
      // console.log('Please do not repeat trigerring this block.');
      this.blockClickedAt = currentTime;
      return true;
    } else {
      this.blockClickedAt = currentTime;
      return false;
    }
  }

  getMenu(name) {
    let arr = [];
    let defaultValue = 'any';
    let text = Message.any[this.locale];
    if (name == 'reset') {
      defaultValue = 'all';
      text = Message.all[this.locale];
    }
    arr.push({text: text, value: defaultValue});
    for(let i = 1; i <= 10; i++) {
      let obj = {};
      obj.text = i.toString(10);
      obj.value = i.toString(10);
      arr.push(obj);
    };
    return arr;
  }

  getTrainMenu() {
    let arr = [];
    for(let i = 4; i <= 10; i++) {
      let obj = {};
      obj.text = i.toString(10);
      obj.value = i.toString(10);
      arr.push(obj);
    };
    return arr;
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

  getInputMenu() {
    return [
      {
        text: Message.webcam[this.locale],
        value: 'webcam'
      },
      {
        text: Message.stage[this.locale],
        value: 'stage'
      }
    ]
  }

  getClassificationIntervalMenu() {
    return [
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

  firstTrainingWarning() {
    if (this.firstTraining) {
      alert(Message.first_training_warning[this.locale]);
      this.firstTraining = false;
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

module.exports = Scratch3ML2ScratchBlocks;