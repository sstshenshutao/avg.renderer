import {Resource} from "resource-loader";
import {AVGNativePath} from "../../engine/core/native-modules/avg-native-path";
import {GameResource} from "../../engine/core/resource";
import unzip from "../unzip/loadPakFile";
import LoaderResource = PIXI.LoaderResource;
import Texture = PIXI.Texture;
import * as PIXI from "pixi.js";
import {LabelJSMO, PathJSOM} from "./path-manager";

export class JsmoResourceCenter {
  private static _instance: JsmoResourceCenter;
  public resourceLoader = PIXI.Loader.shared;
  public buffer = {};

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  //this class used to initial the pak File
  private static fakeResource(url, imgData) {
    let retResource = new Resource(url, url, {
      crossOrigin: ""
    });
    let img = new Image();
    img.src = `data:image/png;base64,${imgData}`;
    retResource['data'] = img;
    retResource['texture'] = Texture.fromLoader(retResource.data,
      retResource.url,
      retResource.name
    );
    return <LoaderResource><unknown>retResource;
  }

  /**
   * return promise
   * @param url
   * @param loadOptions
   */
  public promiseLoadPak(url: string, loadOptions: any) {
    return new Promise(resolve => {
      this.loadPak(url, resolve, loadOptions);
    })
  }

  /**
   * use the absolute url, like: "jsmoData/MO1/bg/bg.pak"
   * @param url
   * @param callback
   * @param loadOptions
   */
  public loadPak(url: string, callback: any, loadOptions?: any) {
    let loadPakOptions = loadOptions || {
      loadType: "arraybuffer",
      xhrType: "arraybuffer",
      crossOrigin: "*"
    };
    const pakURL = url;
    const resource = this.resourceLoader.resources[pakURL];

    if (!resource) {
      console.log("PakFile cache is not in resources, load it now!");
      this.resourceLoader.add(pakURL, pakURL, loadPakOptions);

      this.resourceLoader.load((loader, resources) => {
        // console.log("resources", resources);
        let data = new Uint8Array(resources[pakURL].data);
        // console.log("datatype:", typeof data);
        // console.log("data:", data);
        let fileObj = unzip.getAllFiles(data, unzip.base64ArrayBuffer);
        console.log("PakFile load successfully, callback!");
        callback(fileObj)
      });
    } else {
      console.log("PakFile cache existed, do Nothing!");
    }
  }

  /**
   * fake the resources buffer, so that all pak pictures can be loaded from cache.
   * @param fileObj
   * @param label
   */
  public setResourcesbuffer(fileObj, label: LabelJSMO) {
    //add for each to resources
    let keys = Object.keys(fileObj);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      this.resourceLoader.resources[AVGNativePath.join(GameResource.getAssetsRoot(), `${this.labelToPath(label)}${key}`)] = JsmoResourceCenter.fakeResource(key, fileObj[key]);
    }
  }

  private labelToPath(label: LabelJSMO) {
    return PathJSOM.labelToPath(label);
  }

  /**
   * the callback buffer function. convention: label:'se' 'bg' 'bgm'...
   * @param label
   * @param fileObj
   */
  public bufferSome(label: LabelJSMO, fileObj) {
    //add for each to resources

    let o = this.buffer[this.labelToPath(label)] || (this.buffer[this.labelToPath(label)] = {});
    let keys = Object.keys(fileObj);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      o[key] = fileObj[key];
    }
  }

  /**
   * get method for bufferSome.
   * @param label
   */
  public getBuffer(label: LabelJSMO) {
    return this.buffer[this.labelToPath(label)];
  }

  /**
   * return the `data:audio/wav;base64,${base64 URI}` can directly set to audio.src
   * @param name
   */
  public getMusic(name) {
    // todo: 看一下音乐目录的规定
    // let ret = this.buffer['se'][name] || this.buffer['voice'][name];
    // if (ret) {
    //   //append header
    //   return `data:audio/wav;base64,${ret}`;
    // }
    return name;
  }
}
