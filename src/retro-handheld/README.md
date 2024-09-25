# Luna Retro Handheld

Retro emulator with controls ui.

## Demo

https://luna.liriliri.io/?path=/story/retro-handheld

## Install

Add the following script and style to your page.

```html
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/luna-menu/luna-menu.css" />
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/luna-retro-emulator/luna-retro-emulator.css" />
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/luna-retro-handheld/luna-retro-handheld.css" />
<script src="//cdn.jsdelivr.net/npm/luna-menu/luna-menu.js"></script>
<script src="//cdn.jsdelivr.net/npm/luna-retro-emulator/luna-retro-emulator.js"></script>
<script src="//cdn.jsdelivr.net/npm/luna-retro-handheld/luna-retro-handheld.js"></script>
```

You can also get it on npm.

```bash
npm install luna-retro-handheld luna-retro-emulator luna-menu --save
```

```javascript
import 'luna-menu/luna-menu.css'
import 'luna-retro-emulator/luna-retro-emulator.css'
import 'luna-retro-handheld/luna-retro-handheld.css'
import LunaRetroHandheld from 'luna-retro-handheld'
```

## Usage

```javascript
const retroHandheld = new RetroHandheld(container, {
  core: 'https://luna.liriliri.io/fceumm_libretro.js',
  browserFS: 'https://luna.liriliri.io/browserfs.min.js',
})
retroEmulator.load('https://luna.liriliri.io/Contra.nes')
```

## Configuration

* browserFS(string): BrowserFS url.
* config(string): RetroArch config.
* controller(PlainObj<string>): Controller mapping.
* core(string): Libretro core url.
* coreConfig(string): RetroArch core options.

## Api

### load(url: string): void

Load rom from url.
