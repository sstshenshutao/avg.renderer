![Demo1](https://user-images.githubusercontent.com/1910783/39823101-d7e1fd22-53de-11e8-9bb2-b4db1ad04292.png)

---

Languages: [[English](./README.md)] [[简体中文](./docs/README.zh-cn.md)]

**AVGPlus** is an cross-platform engine that aims to AVG/ADV, Galgame, Audiobooks, etc. It provides a way to quickly build games for Windows, Linux and macOS, completely in JavaScript. You will get many simple APIs to build power game that had better performance from the engine.

## NOTICE: At an early stage of development

For now, the engine project's accomplishments are not bad, but it's still at an early stage of development, and it's **not recommended** for any new formal game due to the scripting system bring many new features each day and changing quickly.

## Getting Started

Get renderer source and run the following command in `avg.renderer` folder:

```shell
git clone https://github.com/avg-plus/avg.renderer
cd avg.renderer
yarn
```

## Setup game project
During you can launch game, you should setup a project of game. The assets folder provide Scripts, Graphics, Audio resources for your game.

### 1. Create game project folder
- Create a directory to your local disk, eg: `D:\GameProjects\hello-avg`.
- Create JSON file: `D:\GameProjects\hello-avg\game.json`, and write the basic game config:
```json
{
  "screen": {
    "width": 1280,
    "height": 720,
    "fullscreen": false
  },
  "game": {
    "text_speed": 80,
    "auto_play": false,
    "sound": { 
      "bgm": 100,
      "bgs": 100, 
      "se": 100,
      "voice": 100
    }
  }
}
```
The above config is the default config for your game, your could change the configuration fields if you want.

- Create folders on the project root: `audio`, `graphics`, `scripts`. 
- Create `start.avs` inside `scripts` and put the story script as follows:

```javascript
text.show("Hello my first AVG ...");
```

* To see more story script API, please visit documentation http://docs.avg-engine.com

Finally your structure should be:
```
D:\GameProjects\hello-avg
  ├── audio
  ├── fonts
  ├── graphics
  ├── scripts
      ├── start.avs
  └── game.json
```

### 2. Modify `env.avd` on `avg.renderer`
Open `env.avd` file you can see:
```json
{
  "game_assets_root": "http://127.0.0.1:2335",
  "engine_bundle_root": "data"
}
```

This file is used for config & pointing to your game project root.

`game_assets_root`: The root folder of game project, it can be assign an URL or a path relative to local. 
`engine_bundle_root`: The data root of engine package, recommended to keep the default.

* To deploy your game to the user on the browser, you should provide an URL that points to your HTTP server.
* To deploy your game to desktop over PC, you should provide an URL that points to your local folder.

Example config for browser:
```json
{
  "game_assets_root": "http://your-game-domain.com/example-game",
  "engine_bundle_root": "data"
}
```

Example config for PC (You can also use a relative path):
```json
{
  "game_assets_root": "D:\GameProjects\hello-avg",
  "engine_bundle_root": "data"
}
```

### 3. Build the engine bundles
Open a terminal session to run the following command in `avg.renderer`:

```shell
yarn dev
```

This command is used for building engine bundles and keep the development in watching mode, you could open `dist` directory to see the outputs.

### 4. Run the game
Open another terminal session to launch game window:

```shell
yarn game
```

If your game assets folder is addressable, you can see a game window launched and your story script will present to you.


## Features & Todo

- [x] Text & Characters
- [x] Input Handle & Variables
- [x] Backgrounds
- [x] Image Widgets & Text Widgets (Subtitle)
- [x] Sounds (BGM, BGS, SE, Voice)
- [x] Game Flow Control & Clock Handle
- [x] Scripting
- [x] Advanced Animations
- [x] Plugins & Rendering Extensions
- [x] Archive
- [x] Camera Effects & Particle Effects
- [x] WebGL Support
- [ ] Save & Load
- [ ] UI Designer
- [ ] Packaging Tools
