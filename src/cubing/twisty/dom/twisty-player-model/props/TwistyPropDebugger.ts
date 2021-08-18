import {
  CSSSource,
  ManagedCustomElement,
} from "../../element/ManagedCustomElement";
import { customElementsShim } from "../../element/node-custom-element-shims";
import type { TwistyPropParent } from "./TwistyProp";

function splitName(s: string): string {
  let out = "";
  for (const c of s.slice(0, -4)) {
    if (c.toUpperCase() === c && out.slice(-1)[0] !== "3") {
      out += " ";
    }
    out += c.toLowerCase();
  }
  return out;
}

export class TwistyPropDebugger extends ManagedCustomElement {
  constructor(private twistyProp: TwistyPropParent<any>) {
    super();
  }

  valueElem: HTMLElement | null = null;

  connectedCallback(): void {
    const span = document.createElement("span");
    span.textContent = splitName(this.twistyProp.constructor.name);
    this.contentWrapper.append(span);

    this.valueElem = this.contentWrapper.appendChild(
      document.createElement("div"),
    );
    this.twistyProp.addFreshListener(this.onProp.bind(this));

    this.addCSS(
      new CSSSource(`

.wrapper {
  font-family: Ubuntu, sans-serif;
  display: grid;
  grid-template-rows: 1.2em 3.5em;
  max-width: 20em;

  border: 1px solid #000;
  overflow: hidden;
  padding: 0.25em;
  box-sizing: border-box;
}

.wrapper > * {
  border-top: 1px solid #000;
  width: 100%;
  height: 3.5em;
}

.wrapper > span {
  max-width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
}
    `),
    );
  }

  async onProp(value: any): Promise<void> {
    // console.log("onProp", value, this.valueElem, JSON.stringify(value));

    function isAlgIssues(v: any): boolean {
      try {
        return "alg" in v && "issues" in v;
      } catch (e) {
        return false;
      }
    }

    let str: string;
    try {
      if (typeof value === "undefined") {
        str = "(undefined)";
      } else if (isAlgIssues(value)) {
        str = JSON.stringify({
          alg: value.alg.toString(),
          issues: value.issues,
        }).slice(0, 100);
      } else {
        const str1 = JSON.stringify(value);
        if (typeof str1 === "undefined") {
          if (value.name) {
            str = `${value.name} (constructor)`;
          } else {
            str = "(undefined)";
          }
        } else {
          str = str1.slice(0, 100);
        }
      }
    } catch (e) {
      str = "(can't be serialized)";
    }

    if (this.valueElem) {
      this.valueElem.textContent = str;
    }

    this.contentWrapper.animate(
      [
        // keyframes
        { background: "rgba(66, 133, 244, 0.4)" },
        { background: "transparent" },
      ],
      {
        duration: 500,
      },
    );
  }
}

customElementsShim.define("twisty-prop-debugger", TwistyPropDebugger);

const debuggerListElem = document.createElement("div");
debuggerListElem.id = "debuggers";

const DEBUG = true;
export function addDebugger(twistyProp: TwistyPropParent<any>): void {
  if (DEBUG) {
    debuggerListElem.appendChild(new TwistyPropDebugger(twistyProp));
  }
}

window.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(debuggerListElem);
});
