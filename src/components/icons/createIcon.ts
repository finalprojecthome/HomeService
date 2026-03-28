import { h, type VNode, type Component } from "vue";

export function createIcon(paths: any): Component {
  return {
    name: "Icon",
    props: {
      size: { type: [Number, String], default: 24 },
    },
    render(): VNode {
      return h(
        "svg",
        {
          viewBox: "0 0 24 24",
          width: this.size,
          height: this.size,
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        typeof paths === "function" ? paths() : Array.isArray(paths) ? paths : [paths]
      );
    },
  };
}