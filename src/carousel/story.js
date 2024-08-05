import 'luna-carousel.css'
import Carousel from 'luna-carousel.js'
import $ from 'licia/$'
import story from '../share/story'
import readme from './README.md'
import { number, button } from '@storybook/addon-knobs'

const def = story(
  'carousel',
  (container) => {
    $(container).css({
      width: '100%',
      maxWidth: 640,
      height: 360,
      margin: '0 auto',
    })

    const interval = number('Interval', 5000, {
      range: true,
      min: 0,
      max: 100000,
      step: 1000,
    })

    const carousel = new Carousel(container, { interval })

    const commonStyle =
      'position:relative;height:100%;width:100%;background-size:contain;background-repeat:no-repeat;background-position:center;'

    carousel.append(
      `<div style="${commonStyle};background-image:url(/pic1.png);"></div>`
    )
    carousel.append(
      `<div style="${commonStyle};background-image:url(/pic2.png);"></div>`
    )
    carousel.append(
      `<div style="${commonStyle};background-image:url(/pic3.png);"></div>`
    )
    carousel.append(
      `<div style="${commonStyle};background-image:url(/pic4.png);"></div>`
    )

    button('Clear', () => {
      carousel.clear()
      return false
    })

    return carousel
  },
  {
    readme,
    source: __STORY__,
  }
)

export default def

export const { carousel } = def
