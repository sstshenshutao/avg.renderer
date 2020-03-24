import { AVGEngineError } from "../core/engine-errors";

import { AVGNativeFS } from "../core/native-modules/avg-native-fs";
import { Sandbox } from "../core/sandbox";
import { Transpiler } from "./transpiler";
import { AVGGame } from "engine/core/game";
import { i18n } from "engine/core/i18n";
import { EngineUtils } from "engine/core/engine-utils";

export class AVGStory {
  private static sandbox: Sandbox = new Sandbox();

  // private _scriptUnits: Array<AVGScriptUnit> = [];
  // private _cursor: number = 0;
  private _code: string;
  private _compiled: string;
  public static TracingScriptFile: string;

  // private static _scriptingEvalInContext = null;
  constructor() {}

  public async loadFromFile(filename: string) {
    AVGStory.TracingScriptFile = filename;

    const response = await AVGNativeFS.readFileSync(filename);

    this.loadFromString(response);
  }

  public async loadFromString(code: string) {
    this._code = code;
    this.compile();
  }

  private compile() {
    this._compiled = Transpiler.transpileFromCode(this._code);
    // console.log("debug:: compiled-code",this._compiled)
  }

  public static UnsafeTerminate() {
    // AVGStory.sanbox._shouldForceTerminate = true;
    // AVGStory._scriptingEvalInContext.call(AVGStory.sanbox);
    // AVGStory._scriptingResolver();
  }

  public async stop() {}

  public async run() {
    return new Promise(resolve => {
      try {
        // AVGStory._scriptingResolver = resolve;

        try {
          AVGStory.sandbox.game = AVGGame.getInstance();
          AVGStory.sandbox.done = global["done"] = () => {
            console.log("script execute done.");

            if (resolve) {
              resolve();
            }
          };

          const context = {
            ...AVGStory.sandbox
          };
          console.log("debug content::",context);
// don't MISS here! compiled code in this._compiled.
// this function just run the compiled code, but need to know why
// the code like (await text.show) can run correctly.
          EngineUtils.evalInContext(this._compiled, context);
        } catch (err) {
          throw err;
        }

        // Run in Node.js
        // let script = new vm.Script(this._compiled);
        // script.runInNewContext(vm.createContext(AVGStory.sanbox), {
        //   displayErrors: true
        // });
      } catch (err) {
        AVGEngineError.emit(i18n.lang.SCRIPTING_AVS_RUNTIME_EXCEPTION, err, {});
      }
    });
  }
}
