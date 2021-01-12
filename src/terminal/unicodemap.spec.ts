import { unicodeMap } from "./unicodemap";

describe("unicodemap", () => {
  it("Should have unicode values", () => {
    expect(unicodeMap).toMatchSnapshot();
  });
});
