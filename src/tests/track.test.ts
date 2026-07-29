import { describe, expect, it } from "vitest";
import { outboundLabel } from "../lib/track";

// jsdom serves these tests from http://localhost:3000, which is what
// outboundLabel compares against when deciding whether a link leaves the site.
describe("outboundLabel", () => {
  it("ignores links that stay on the site", () => {
    expect(outboundLabel("/resume")).toBeUndefined();
    expect(outboundLabel("http://localhost:3000/projects")).toBeUndefined();
  });

  it("labels an external link with host and path", () => {
    expect(outboundLabel("https://github.com/ErsinMehmed")).toBe("github.com/ErsinMehmed");
  });

  it("drops the www prefix and a trailing slash", () => {
    expect(outboundLabel("https://www.linkedin.com/in/ersin/")).toBe("linkedin.com/in/ersin");
  });

  it("collapses contact links to the protocol", () => {
    expect(outboundLabel("mailto:ersin99mehmed@gmail.com")).toBe("mailto");
    expect(outboundLabel("tel:+359888123456")).toBe("tel");
  });

  it("ignores anything that is not a link out", () => {
    expect(outboundLabel("#top")).toBeUndefined();
    expect(outboundLabel("javascript:void(0)")).toBeUndefined();
    expect(outboundLabel("")).toBeUndefined();
  });
});
