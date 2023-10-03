import { commentss } from "../src/commentss";
import { DEFAULT_CONFIG } from "../src/config";
import { describe, expect, test } from "@jest/globals";
import { CSSOutputType } from "../src/css/data";
describe("simple", () => {
  test("check if simple.(css|scss) exits", async () => {
    const result: CSSOutputType[] | undefined = await commentss({
      ...DEFAULT_CONFIG,
      test: true,
    });
    expect(result).not.toBeUndefined();
  });
});
