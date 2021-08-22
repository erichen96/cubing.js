import type { HintFaceletStyle } from "../../old/dom/TwistyPlayerConfig";
import { SimpleTwistyPropSource } from "../TwistyProp";

export type HintFaceletStyleWithAuto = HintFaceletStyle | "auto";

export class HintFaceletProp extends SimpleTwistyPropSource<HintFaceletStyleWithAuto> {
  name = "hint facelets";

  getDefaultValue(): HintFaceletStyleWithAuto {
    return "auto";
  }
}
