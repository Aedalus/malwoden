import { PreciseShadowcasting, diffRationalNums } from "./precise";

describe("diffRationamNum", () => {
  it("can get the difference between rational numbers", () => {
    const tests: [[number, number], [number, number], number][] = [
      [[2, 1], [2, 1], 0],
      [[2, 1], [3, 1], -1],
      [[2, 4], [1, 2], 0],
    ];

    for (let [a, b, d] of tests) {
      expect(diffRationalNums(a, b)).toEqual(d);
    }
  });
});

// describe("Shadowcasting", () => {
//   it("will calculate for empty tiles", () => {
//     const s = new PreciseShadowcasting((x, y) => true);
//     const tiles = s.calculateVectors(1, 1, 0);
//     expect(tiles).toEqual([
//       {
//         x: 1,
//         y: 1,
//         r: 0,
//         visibility: 1,
//       },
//     ]);

//     const tiles2 = s.calculateVectors(0, 0, 1);
//     expect(tiles2).toHaveLength(5);
//     expect(tiles2).toEqual([
//       {
//         x: 0,
//         y: 0,
//         visibility: 1,
//         r: 0,
//       },
//       {
//         x: 1,
//         y: 0,
//         visibility: 1,
//         r: 1,
//       },
//       {
//         x: 0,
//         y: 1,
//         visibility: 1,
//         r: 1,
//       },
//       {
//         x: -1,
//         y: 0,
//         visibility: 1,
//         r: 1,
//       },
//       {
//         x: 0,
//         y: -1,
//         visibility: 1,
//         r: 1,
//       },
//     ]);
//   });

//   it("will calculate with blocked tiles", () => {
//     const s = new PreciseShadowcasting((x, y) => (x == 1 && y == 0) === false);
//     const spaces = s.calculateVectors(0, 0, 2);
//     expect(spaces).toEqual([]);
//   });
// });
