import {GameResource, ResourcePath} from "../../engine/core/resource";

export class PathJSOM {
  public static BG = 'jsmoData/MO1/bg/bg.pak';
  public static CHARA = 'jsmoData/MO1/chara/chara.pak';
  public static SE = 'jsmoData/MO1/se/se.pak';
  public static VOICE = 'jsmoData/MO1/voice/voice.pak';
  public static BGM = 'jsmoData/MO1/bgm/bgm.pak';


  /**
   * reflect the JSOM label to (the absolute path in AVG.renderer)
   * @param label
   */
  public static labelToPath(label: LabelJSMO) {
    switch (label) {
      case LabelJSMO.BG:
        return GameResource.getPath(ResourcePath.Backgrounds);
      case LabelJSMO.BGM:
        return GameResource.getPath(ResourcePath.BGM);
      case LabelJSMO.CHARA:
        return GameResource.getPath(ResourcePath.Characters);
      case LabelJSMO.SE:
        return GameResource.getPath(ResourcePath.SE);
      case LabelJSMO.VOICE:
        return GameResource.getPath(ResourcePath.Voice);
      default:
        return './'
    }
  }
}

export enum LabelJSMO {
  BG, CHARA, SE, VOICE, BGM
}
