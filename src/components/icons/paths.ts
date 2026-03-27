import { h } from "vue";

export const path = (
  d: string,
  opts?: { fillRule?: "evenodd"; clipRule?: "evenodd" }
) =>
  h("path", {
    d,
    fill: "currentColor",
    ...(opts?.fillRule && { fillRule: opts.fillRule }),
    ...(opts?.clipRule && { clipRule: opts.clipRule }),
  });

export const strokePath = (d: string, opacity?: number) =>
  h("path", {
    d,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ...(opacity && { opacity }),
  });