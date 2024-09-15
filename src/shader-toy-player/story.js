import 'luna-shader-toy-player.css'
import ShaderToyPlayer from 'luna-shader-toy-player.js'
import readme from './README.md'
import story from '../share/story'
import $ from 'licia/$'
import shaders, { cube } from './shaders'
import LunaShaderToyPlayer from './vue'
import { defineComponent, h } from 'vue'
import { text, optionsKnob, button } from '@storybook/addon-knobs'

const def = story(
  'shader-toy-player',
  (container) => {
    $(container).css({
      maxWidth: 640,
      width: '100%',
      margin: '0 auto',
      minHeight: 150,
      aspectRatio: '1280/720',
    })

    const example = optionsKnob(
      'Example',
      {
        'Star Nest': 'star',
        Seascape: 'sea',
        'Protean clouds': 'cloud',
      },
      'star',
      {
        display: 'select',
      }
    )

    const userImage = text('Image', cube.image)
    const userSound = text('Sound', cube.sound)

    button('Compile', function () {
      loadShader(userImage, userSound)
      return false
    })

    const shaderToyPlayer = new ShaderToyPlayer(container)

    function loadShader(code, sound) {
      const pass = [
        {
          inputs: [],
          outputs: [],
          code,
          name: 'Image',
          description: '',
          type: 'image',
        },
      ]

      if (sound) {
        pass.push({
          inputs: [],
          outputs: [],
          code: sound,
          name: 'Sound',
          description: '',
          type: 'sound',
        })
      }

      shaderToyPlayer.load(pass)
    }

    loadShader(shaders[example])

    return shaderToyPlayer
  },
  {
    readme,
    source: __STORY__,
    VueComponent({ theme }) {
      return defineComponent({
        components: {
          LunaShaderToyPlayer,
        },
        render() {
          return h(LunaShaderToyPlayer, {
            theme,
            style: {
              maxWidth: '640px',
              width: '100%',
              margin: '0 auto',
              minHeight: '150px',
              aspectRatio: '1280/720',
            },
          })
        },
      })
    },
  }
)

export default def

export const { shaderToyPlayer: html, vue } = def
