import { CharCode } from "./char-code";

describe("CharCode", () => {
  it("Should have all CharCodes listed", () => {
    expect(CharCode).toMatchSnapshot();
  });
});
