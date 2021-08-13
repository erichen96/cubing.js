// Stub file for testing.
// Feel free to add code here if you need a quick place to run some code, but avoid committing any changes.

import { Alg } from "../../../../cubing/alg";
import { TwistyPlayerV2 } from "../../../../cubing/twisty/dom/twisty-player-model/controllers/TwistyPlayerV2";
import { setupToLocations } from "../../../../cubing/twisty/dom/TwistyPlayerConfig";

// Note: this file needs to contain code to avoid a Snowpack error.
// So we put a `console.log` here for now.
console.log("Loading stub file.");

(async () => {
  const twistyPlayer = document.body.appendChild(
    new TwistyPlayerV2({ puzzle: "gigaminx" }),
  );

  const alg =
    "(BL2 B2' DL2' B' BL' B' DL2' BL2 B' BL2' B2 BL DL2 B' DL BL B' BL2 DR2 U' (F2 FR2' D2 FR L2' 1-4BR 1-4R2' U)5 F2 FR2' D2 FR L2' 1-4BR 1-4R2' U2 2DR2 u2' 1-3R2 1-3BR' l2 fr' d2' fr2 f2' (u' 1-3R2 1-3BR' l2 fr' d2' fr2 f2')5 u dr2' bl2' b bl' dl' b dl2' bl' b2' bl2 b bl2' dl2 b bl b dl2 b2 bl2')";
  twistyPlayer.alg = alg;

  const table = document.body.appendChild(document.createElement("table"));

  const algOptions: [string, string, Alg][] = [
    ["alg", "alg", Alg.fromString(alg)],
    ["setup", "setup", Alg.fromString("")],
  ];

  for (const [propName, attrName, alg] of algOptions) {
    const tr = table.appendChild(document.createElement("tr"));

    const td1 = tr.appendChild(document.createElement("td"));
    td1.appendChild(document.createElement("code")).textContent = attrName;

    const td2 = tr.appendChild(document.createElement("td"));
    const input = td2.appendChild(document.createElement("input"));
    input.value = alg.toString();
    input.placeholder = "(none)";
    const update = () => {
      (twistyPlayer as any)[propName] = Alg.fromString(input.value);
    };
    input.addEventListener("change", update);
    input.addEventListener("keyup", update);
    update();
  }

  const enumOptions: [string, string, Record<string, any>][] = [
    ["anchor", "anchor", setupToLocations],
    // ["puzzle", "puzzle", puzzleIDs],
    // ["visualization", "visualization", visualizationFormats],
    // ["hintFacelets", "hint-facelets", hintFaceletStyles],
    // [
    //   "experimentalStickering",
    //   "experimental-stickering",
    //   experimentalStickerings,
    // ],

    // ["background", "background", backgroundThemes],
    // ["controlPanel", "control-panel", controlsLocations],

    // ["backView", "back-view", backViewLayouts],
    // [
    //   "experimentalCameraLatitudeLimits",
    //   "experimental-camera-latitude-limits",
    //   cameraLatitudeLimits,
    // ],

    // ["viewerLink", "viewer-link", viewerLinkPages],
  ];

  for (const [propName, attrName, valueMap] of enumOptions) {
    const tr = table.appendChild(document.createElement("tr"));

    const td1 = tr.appendChild(document.createElement("td"));
    td1.appendChild(document.createElement("code")).textContent = attrName;

    const td2 = tr.appendChild(document.createElement("td"));
    const select = document.createElement("select");
    td2.appendChild(select);

    for (const value in valueMap) {
      const optionElem = select.appendChild(document.createElement("option"));
      optionElem.textContent = value;
      optionElem.value = value;
    }
    select.addEventListener("change", () => {
      console.log(attrName, select.value);
      (twistyPlayer as any)[propName] = select.value as any;
    });
    document.body.append(document.createElement("br"));
  }

  const numberOptions: [string, string, number][] = [
    // ["experimentalCameraLatitude", "experimental-camera-latitude", 0],
    // ["experimentalCameraLongitude", "experimental-camera-longitude", 0],
  ];

  for (const [propName, attrName, alg] of numberOptions) {
    const tr = table.appendChild(document.createElement("tr"));

    const td1 = tr.appendChild(document.createElement("td"));
    td1.appendChild(document.createElement("code")).textContent = attrName;

    const td2 = tr.appendChild(document.createElement("td"));
    const input = td2.appendChild(document.createElement("input"));
    input.value = alg.toString();
    input.type = "number";
    input.placeholder = "(no value)";
    input.value = "";
    const update = () => {
      if (input.value === "") {
        return;
      }
      (twistyPlayer as any)[propName] = input.value;
    };
    input.addEventListener("input", update);
    // input.addEventListener("change", update);
    input.addEventListener("keyup", update);
  }
})();
