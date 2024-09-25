import stripIndent from 'licia/stripIndent'
import $ from 'licia/$'
import openFile from 'licia/openFile'
import createUrl from 'licia/createUrl'
import fullscreen from 'licia/fullscreen'
import keyCode from 'licia/keyCode'
import some from 'licia/some'
import escapeJsStr from 'licia/escapeJsStr'
import Component, { IComponentOptions } from '../share/Component'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bootstrap = require('!raw-loader!./bootstrap').default
// eslint-disable-next-line @typescript-eslint/no-var-requires
const trigger = require('licia/trigger')

/** IOptions */
export interface IOptions extends IComponentOptions {
  /** Libretro core url. */
  core: string
  /** BrowserFS url. */
  browserFS: string
  /** RetroArch config. */
  config?: string
  /** RetroArch core options. */
  coreConfig?: string
  /** Show controls. */
  controls?: boolean
}

/**
 * Retro emulator using libretro.
 *
 * @example
 * const retroEmulator = new RetroEmulator(container, {
 *   core: 'https://luna.liriliri.io/fceumm_libretro.js',
 *   browserFS: 'https://luna.liriliri.io/browserfs.min.js',
 * })
 * retroEmulator.load('https://luna.liriliri.io/Contra.nes')
 */
export default class RetroEmulator extends Component<IOptions> {
  private $controller: $.$
  private $iframeContainer: $.$
  private $play: $.$
  private $volume: $.$
  private iframe: HTMLIFrameElement
  private autoHideTimer: any = 0
  private isPaused = true
  private isMuted = false
  constructor(container: HTMLElement, options: IOptions) {
    super(container, { compName: 'retro-emulator' })

    this.initOptions(options, {
      config: '',
      coreConfig: '',
      controls: true,
    })

    this.initTpl()
    this.$controller = this.find('.controller')
    this.$play = this.find('.play')
    this.$volume = this.find('.volume')
    this.$iframeContainer = this.find('.iframe-container')

    if (!this.options.controls) {
      this.$controller.hide()
    }

    this.bindEvent()
  }
  /** Open file and load rom. */
  open = async () => {
    const [file] = await openFile()

    this.load(createUrl(file))
  }
  /** Load rom from url. */
  load(url: string) {
    const { browserFS, core, config, coreConfig } = this.options
    const { $iframeContainer } = this
    if (this.iframe) {
      this.$iframeContainer.html('')
    }
    const iframe = document.createElement('iframe')
    $iframeContainer.append(iframe)

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        html, body {
          overflow: hidden;
          padding: 0;
          margin: 0;
        }
        .webplayer-container {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background-color: black;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        #loading {
          width: 100%;
          height: 100%;
          color: #fff;
          text-align: center;
          position: absolute;
          left: 0;
          top: 0;
          background: #000;
          display: table;
          font-size: 18px;
          font-family: Menlo, Consolas, Lucida Console, Courier New, monospace;
        }
        #loading span {
          display: table-cell;
          vertical-align: middle;
        }
        #canvas {
          width: auto !important;
          height: 100% !important;
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
      </style>
      <script src="${browserFS}"></script>
    </head>
    <body>
      <div class="webplayer-container">
        <div id="loading"><span>LOADING...</span></div>
        <canvas id="canvas"></canvas>
      </div>
      <script>
        var gameUrl = '${url}';
        var retroarchCfg = '${escapeJsStr(config)}';
        var retroarchCoreOptionsCfg = '${escapeJsStr(coreConfig)}';
        ${bootstrap}
      </script>
      <script src="${core}"></script>
    </body>
    </html>
    `
    const iframeDocument = iframe.contentWindow?.document as Document
    iframeDocument.open()
    iframeDocument.write(html)
    iframeDocument.close()

    this.iframe = iframe

    this.isPaused = false
    this.isMuted = false
    this.renderPlay()
    this.renderVolume()
  }
  destroy() {
    document.removeEventListener('keydown', this.onKeydown)
    document.removeEventListener('keyup', this.onKeyup)
    document.removeEventListener('keypress', this.onKeypress)
    this.$container.off('mousemove', this.onMouseMove)
    super.destroy()
  }
  /** Press key. */
  pressKey(code: string) {
    const event = {
      code,
    }
    this.triggerEvent('keydown', new KeyboardEvent('keydown', event))
  }
  /** Release key. */
  releaseKey(code: string) {
    const event = {
      code,
    }
    this.triggerEvent('keyup', new KeyboardEvent('keyup', event))
  }
  private input(code: string) {
    this.pressKey(code)
    setTimeout(() => {
      this.releaseKey(code)
    }, 60)
  }
  private triggerEvent(type: string, e: any) {
    if (!this.iframe) {
      return
    }
    const iframeDocument = this.iframe.contentWindow?.document as any
    if (iframeDocument) {
      trigger(iframeDocument, type, e)
    }
  }
  /** Reset game. */
  reset = () => {
    this.input('KeyH')
  }
  /** Toggle fullscreen. */
  toggleFullscreen = () => {
    fullscreen.toggle(this.container)
  }
  private bindEvent() {
    const { c } = this

    this.$container.on('mousemove', this.onMouseMove)

    this.$controller
      .on('click', c('.icon-file'), this.open)
      .on('click', c('.icon-fullscreen'), this.toggleFullscreen)
      .on('click', c('.reset'), this.reset)
      .on('click', c('.play'), this.togglePlay)
      .on('click', c('.fast-forward'), this.fastForward)
      .on('click', c('.volume'), this.toggleVolume)

    document.addEventListener('keydown', this.onKeydown)
    document.addEventListener('keyup', this.onKeyup)
    document.addEventListener('keypress', this.onKeypress)
  }
  private fastForward = () => {
    this.input('Space')
  }
  private toggleVolume = () => {
    if (!this.iframe) {
      return
    }
    this.isMuted = !this.isMuted
    this.input('F9')
    this.renderVolume()
  }
  private renderVolume = () => {
    const { c, $volume } = this

    if (this.isMuted) {
      $volume.html(c('<span class="icon icon-volume-off"></span>'))
    } else {
      $volume.html(c('<span class="icon icon-volume"></span>'))
    }
  }
  private togglePlay = () => {
    if (!this.iframe) {
      return
    }
    this.isPaused = !this.isPaused
    this.input('KeyP')
    this.renderPlay()
  }
  private renderPlay() {
    const { c, $controller, $play } = this
    if (this.isPaused) {
      $controller.addClass(c('active'))
      $play.html(c('<span class="icon icon-play"></span>'))
    } else {
      $controller.rmClass(c('active'))
      $play.html(c('<span class="icon icon-pause"></span>'))
    }
  }
  private onMouseMove = () => {
    const { c, $container } = this

    $container.rmClass(c('controller-hidden'))
    clearTimeout(this.autoHideTimer)
    this.autoHideTimer = setTimeout(() => {
      $container.addClass(c('controller-hidden'))
    }, 3000)
  }
  private onKeypress = (e: any) => {
    if (this.isHotkey(e)) {
      return
    }
    this.triggerEvent('keypress', e)
  }
  private onKeydown = (e: any) => {
    if (this.isHotkey(e)) {
      return
    }
    this.triggerEvent('keydown', e)
  }
  private onKeyup = (e: any) => {
    if (this.isHotkey(e)) {
      return
    }
    this.triggerEvent('keyup', e)
  }
  private isHotkey = (e: any) => {
    return some(
      ['h', 'H', 'p', 'P', 'space'],
      (val) => keyCode(val) === e.keyCode
    )
  }
  private initTpl() {
    this.$container.html(
      this.c(stripIndent`
      <div class="iframe-container"></div>
      <div class="iframe-mask"></div>
      <div class="controller active">
        <div class="controller-mask"></div>
        <div class="controller-left">
          <div class="reset">
            <span class="icon icon-step-backward"></span>
          </div>
          <div class="play">
            <span class="icon icon-play"></span>
          </div>
          <div class="fast-forward">
            <span class="icon icon-step-forward"></span>
          </div>
          <div class="volume">
            <span class="icon icon-volume"></span>
          </div>
        </div>
        <div class="controller-right">
          <span class="icon icon-file"></span>
          <span class="icon icon-fullscreen"></span>
        </div>
      </div>
      `)
    )
  }
}

module.exports = RetroEmulator
module.exports.default = RetroEmulator
