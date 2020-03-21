/*
 资源管理器提供三种加载方式：
  - 按需加载：需要用到资源的时候再从硬盘/网络上进行资源的加载，可能会造成卡顿
  - 手动预加载：可以在任意时机指定预加载的资源，并缓存
  - 自动预加载：由引擎来推测需要预加载的资源
*/
// import * as Loader from "resource-loader";
import * as PIXI from "pixi.js";
import {getExtension} from "./utils";
import unzip from "../../jsmo/unzip/loadPakFile.js";
import {AVGNativePath} from "./native-modules/avg-native-path";
import Texture = PIXI.Texture;
import {Resource} from 'resource-loader'
import LoaderResource = PIXI.LoaderResource;
import ImageResource =PIXI.resources.ImageResource;
import {GameResource} from "./resource";

enum LoadingTaskStatus {
  Pending,
  Loading,
  Finished
}

type LoadingTask = {
  name: string;
  url: string;
  onCompleted: (resource: PIXI.LoaderResource) => void;
  status: LoadingTaskStatus;
};

/**
 * 用于管理资源的加载
 *
 * @export
 * @class ResourceManager
 */
class GameResourceManager {
  private loadingTasks: Map<string, LoadingTask> = new Map<string, LoadingTask>();
  public resourceLoader = PIXI.Loader.shared;
  private bufferBlock = false;

  constructor() {
    this.resourceLoader.concurrency = 10;
  }

  private fakeResource(url: string, imgData:any) {
    let retResource = new Resource(url, url, {
      crossOrigin: ""
    });
    let img = new Image();
    img.src = `data:image/png;base64,${imgData}`;
    retResource['data'] = img;
    retResource['texture'] =Texture.fromLoader( retResource.data,
      retResource.url,
      retResource.name
    );
    return <LoaderResource><unknown>retResource;
  }

  /**
   * 添加一项资源加载任务，会堵塞帧
   *
   * @param {string} name
   * @param {string} url
   * @memberof GameResourceManager
   */
  public addLoading(url: string, onCompleted?: (resource: PIXI.LoaderResource) => void) {
    // 这里用 URL 作为 key，便于检索资源缓存
    const resource = this.resourceLoader.resources[url];

    // 资源存在则直接返回
    if (resource) {
      console.log("Resource load from cached: ", url);

      if (onCompleted) {
        onCompleted(resource);
      }
      return;
    }

    const task: LoadingTask = {
      name: url,
      url,
      onCompleted,
      status: LoadingTaskStatus.Pending
    };

    this.loadingTasks.set(url, task);
  }

// this method will always be looped, even if the script is finished!
  public update() {
    let self = this;
    if (this.resourceLoader.loading) {
      return;
    }

    const pendingTasks = [];
    this.loadingTasks.forEach(v => {
      if (v.status === LoadingTaskStatus.Pending) {
        pendingTasks.push(v);
      }
    });
    let loadPakOptions = {
      loadType: "arraybuffer",
      xhrType: "arraybuffer",
      crossOrigin: "*"
    };
    const bgPakURL = AVGNativePath.join(GameResource.getAssetsRoot(), "jsmoData/MO1/bg/bg.pak");
    // console.log("debugBgPakURL:::",bgPakURL);
    const resource = self.resourceLoader.resources[bgPakURL];
    if (!resource) {
      // console.log("Add !!BgPakURL!! task ");
      self.resourceLoader.add(bgPakURL, bgPakURL, loadPakOptions);

      self.resourceLoader.load((loader, resources) => {
        // console.log("resources", resources);
        let data = new Uint8Array(resources[bgPakURL].data);
        // console.log("datatype:", typeof data);
        // console.log("data:", data);
        let fileObj = unzip.getAllFiles(data, unzip.base64ArrayBuffer);
        //add for each to resources
        let keys = Object.keys(fileObj);
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];
          self.resourceLoader.resources[AVGNativePath.join(GameResource.getAssetsRoot(), `graphics/backgrounds/${key}`)] = self.fakeResource(key,fileObj[key]);
        }
        //callback loadResource
        loadResource()
      });
    } else {
      // console.log("!!BgPakURL!! load from cached");
      loadResource()
    }


    // if (self.bufferBlock) {
    //   loadResource();
    // } else {
    //   //read the file from disk
    //   // change settimeout to readpak
    //
    //   self.bufferBlock = true;
    //   unzip.loadPakFile(bgPakURL).then(fileObj => {
    //     console.log("loadPakFile::ret:", fileObj);
    //     //add for each to resources
    //     let keys = Object.keys(fileObj);
    //     for (let i = 0; i < keys.length; i++) {
    //       let key = keys[i];
    //       self.resourceLoader.resources[AVGNativePath.join(GameResource.getAssetsRoot(), `graphics/backgrounds/${key}`)] = self.fakeResource(key,fileObj[key]);
    //     }
    //     //callback loadResource
    //     loadResource()
    //   })
    // }
    function loadResource() {
      if (pendingTasks && pendingTasks.length > 0) {
        for (let task of pendingTasks) {
          let loadOptions = {};
          const extension = getExtension(task.url);
          if (extension === "gif") {
            loadOptions = {
              loadType: "arraybuffer",
              xhrType: "arraybuffer",
              crossOrigin: "*"
            };
          }

          // 这里用 URL 作为 key，便于检索资源缓存
          const resource = self.resourceLoader.resources[task.url];
          if (!resource) {
            console.log("Add pending download task: ", task);
            self.resourceLoader.add(task.url, task.url, loadOptions);
          } else {
            console.log("Resource load from cached: ", task);
          }

          task.status = LoadingTaskStatus.Loading;

        }

        self.resourceLoader.load((loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>) => {
          console.log("Loading process: ", loader);
          // this.resourceLoader.reset();

          // 通知进度变更
          self.loadingTasks.forEach((value, key) => {
            console.log("debug::value:", value);
            const url = value.url;
            const resource: PIXI.LoaderResource = resources[url];
            if (value && value.onCompleted && resource) {
              value.onCompleted(resource);
            }
          });

          // 资源加载完成
          if (loader.progress === 100) {
            console.log("Resources all loaded: ", loader);

            pendingTasks.forEach((task: LoadingTask) => {
              self.loadingTasks.delete(task.name);
            });
          }
        });
      }
    }

  }
}

export const ResourceManager = new GameResourceManager();
