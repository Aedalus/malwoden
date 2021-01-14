import { Vector } from "../math";
import { PreciseShadowcasting } from "./precise";

describe("Shadowcasting", () => {
  it("Will set returnAll to false by default", () => {
    const a = new PreciseShadowcasting({
      lightPasses: () => true,
      topology: "four",
      returnAll: true,
    });

    const b = new PreciseShadowcasting({
      lightPasses: () => true,
      topology: "four",
    });

    expect(a["returnAll"]).toBeTruthy();
    expect(b["returnAll"]).toBeFalsy();
  });

  it("Will return all tiles if returnAll is set", () => {
    const a = new PreciseShadowcasting({
      lightPasses: () => false,
      topology: "four",
      returnAll: true,
    });

    const results = a.calculateArray({ x: 0, y: 0 }, 2);
    expect(results).toHaveLength(13);
    for (let r of results) {
      if (r.r === 0 || r.r === 1) {
        expect(r.visibility).toEqual(1);
      } else {
        expect(r.visibility).toEqual(0);
      }
    }
  });

  it("will calculate for empty tiles", () => {
    const s = new PreciseShadowcasting({
      lightPasses: () => true,
      topology: "four",
    });
    const tiles = s.calculateArray({ x: 1, y: 1 }, 0);
    expect(tiles).toEqual([
      {
        pos: {
          x: 1,
          y: 1,
        },
        r: 0,
        visibility: 1,
      },
    ]);

    const tiles2 = s.calculateArray({ x: 0, y: 0 }, 1);
    expect(tiles2).toHaveLength(5);
    expect(tiles2).toEqual([
      {
        pos: { x: 0, y: 0 },
        visibility: 1,
        r: 0,
      },
      {
        pos: { x: 1, y: 0 },
        visibility: 1,
        r: 1,
      },
      {
        pos: { x: 0, y: -1 },
        visibility: 1,
        r: 1,
      },
      {
        pos: { x: -1, y: 0 },
        visibility: 1,
        r: 1,
      },
      {
        pos: { x: 0, y: 1 },
        visibility: 1,
        r: 1,
      },
    ]);
  });

  // ToDo - Currently doesn't return if not visible at all?
  // Keep this or not?
  it("will calculate with blocked tiles", () => {
    const s = new PreciseShadowcasting({
      lightPasses: (pos) => (pos.x == 1 && pos.y == 0) === false,
      topology: "eight",
    });
    const spaces = s.calculateArray({ x: 0, y: 0 }, 2);
    expect(spaces).toEqual([
      // Ring 0
      {
        r: 0,
        visibility: 1,
        pos: {
          x: 0,
          y: 0,
        },
      },
      // Ring 1
      {
        r: 1,
        visibility: 1,
        pos: {
          x: 1,
          y: 0,
        },
      },
      {
        r: 1,
        visibility: 1,
        pos: {
          x: 1,
          y: -1,
        },
      },
      {
        r: 1,
        visibility: 1,
        pos: {
          x: 0,
          y: -1,
        },
      },
      {
        r: 1,
        visibility: 1,
        pos: {
          x: -1,
          y: -1,
        },
      },
      {
        r: 1,
        visibility: 1,
        pos: {
          x: -1,
          y: 0,
        },
      },
      {
        r: 1,
        visibility: 1,
        pos: {
          x: -1,
          y: 1,
        },
      },
      {
        r: 1,
        visibility: 1,
        pos: {
          x: 0,
          y: 1,
        },
      },
      {
        r: 1,
        visibility: 1,
        pos: {
          x: 1,
          y: 1,
        },
      },

      // Ring 2
      // { Doesn't return since not visible
      //   r: 2,
      //   visibility: 0,
      //   pos: {
      //     x: 2,
      //     y: 0,
      //   }
      // },
      {
        r: 2,
        visibility: 0.5,
        pos: {
          x: 2,
          y: -1,
        },
      },
      {
        r: 2,
        visibility: 1,
        pos: {
          x: 2,
          y: -2,
        },
      },
      {
        r: 2,
        visibility: 1,
        pos: {
          x: 1,
          y: -2,
        },
      },
      {
        r: 2,
        visibility: 1,
        pos: {
          x: 0,
          y: -2,
        },
      },
      {
        r: 2,
        visibility: 1,
        pos: {
          x: -1,
          y: -2,
        },
      },
      {
        r: 2,
        visibility: 1,
        pos: {
          x: -2,
          y: -2,
        },
      },
      {
        r: 2,
        visibility: 1,
        pos: {
          x: -2,
          y: -1,
        },
      },
      {
        r: 2,
        visibility: 1,
        pos: {
          x: -2,
          y: 0,
        },
      },
      {
        r: 2,
        visibility: 1,
        pos: {
          x: -2,
          y: 1,
        },
      },
      {
        r: 2,
        visibility: 1,
        pos: {
          x: -2,
          y: 2,
        },
      },
      {
        r: 2,
        visibility: 1,
        pos: {
          x: -1,
          y: 2,
        },
      },
      {
        r: 2,
        visibility: 1,
        pos: {
          x: 0,
          y: 2,
        },
      },
      {
        r: 2,
        visibility: 1,
        pos: {
          x: 1,
          y: 2,
        },
      },
      {
        r: 2,
        visibility: 1,
        pos: {
          x: 2,
          y: 2,
        },
      },
      {
        r: 2,
        visibility: 0.5,
        pos: {
          x: 2,
          y: 1,
        },
      },
    ]);
  });

  it("Will show immediately adjacent even if no light passes", () => {
    const s = new PreciseShadowcasting({
      lightPasses: () => false,
      topology: "four",
    });

    expect(s.calculateArray({ x: 0, y: 0 }, 2)).toEqual([
      { r: 0, visibility: 1, pos: { x: 0, y: 0 } },
      { r: 1, visibility: 1, pos: { x: 1, y: 0 } },
      { r: 1, visibility: 1, pos: { x: 0, y: -1 } },
      { r: 1, visibility: 1, pos: { x: -1, y: 0 } },
      { r: 1, visibility: 1, pos: { x: 0, y: 1 } },
    ]);
  });

  it("Won't merge ranges if the checked block is non-blocking", () => {
    const s = new PreciseShadowcasting({
      lightPasses: () => false,
      topology: "four",
    });

    expect(
      s["checkVisibility"]([5, 8], [7, 8], false, [
        [0, 1],
        [5, 8],
        [7, 8],
        [8, 8],
      ])
    ).toEqual(1);
  });

  it("Can calculate if a shadow overlaps", () => {
    const s = new PreciseShadowcasting({
      lightPasses: (pos) =>
        !Vector.areEqual(pos, { x: 1, y: 0 }) &&
        !Vector.areEqual(pos, { x: 1, y: -1 }) &&
        !Vector.areEqual(pos, { x: 1, y: 1 }) &&
        !Vector.areEqual(pos, { x: 2, y: 0 }),
      topology: "eight",
    });

    const spaces = s.calculateArray({ x: 0, y: 0 }, 2);

    const blocked_a = spaces.find((s) =>
      Vector.areEqual(s.pos, { x: 1, y: 0 })
    );
    const blocked_b = spaces.find((s) =>
      Vector.areEqual(s.pos, { x: 2, y: 0 })
    );
    expect(blocked_a).toEqual({
      r: 1,
      visibility: 1,
      pos: { x: 1, y: 0 },
    });
    expect(blocked_b).toBeUndefined();
  });

  it("Can calculate if a shadow is equivalent", () => {
    const s = new PreciseShadowcasting({
      lightPasses: () => true,
      topology: "eight",
    });

    expect(s["checkShadowVisibility"](5, 5, true, false)).toEqual(false);
    expect(s["checkShadowVisibility"](6, 7, true, true)).toEqual(false);
    expect(s["checkShadowVisibility"](7, 6, true, false)).toEqual(false);
  });
});
