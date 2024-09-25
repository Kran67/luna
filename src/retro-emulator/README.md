# Luna Retro Emulator

Retro emulator using libretro.

## Demo

https://luna.liriliri.io/?path=/story/retro-emulator

## Install

Add the following script and style to your page.

```html
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/luna-retro-emulator/luna-retro-emulator.css" />
<script src="//cdn.jsdelivr.net/npm/luna-retro-emulator/luna-retro-emulator.js"></script>
```

You can also get it on npm.

```bash
npm install luna-retro-emulator --save
```

```javascript
import 'luna-retro-emulator/luna-retro-emulator.css'
import LunaRetroEmulator from 'luna-retro-emulator'
```

## Usage

```javascript
const retroEmulator = new RetroEmulator(container, {
  core: 'https://luna.liriliri.io/fceumm_libretro.js',
  browserFS: 'https://luna.liriliri.io/browserfs.min.js',
})
retroEmulator.load('https://luna.liriliri.io/Contra.nes')
```

## Configuration

* browserFS(string): BrowserFS url.
* config(string): RetroArch config.
* controls(boolean): Show controls.
* core(string): Libretro core url.
* coreConfig(string): RetroArch core options.

## Api

### load(url: string): void

Load rom from url.

### open(): Promise<void>

Open file and load rom.

### pressKey(code: string): void

Press key.

### releaseKey(code: string): void

Release key.

### reset(): void

Reset game.

### toggleFullscreen(): void

Toggle fullscreen.
