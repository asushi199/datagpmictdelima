import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./globals.css", import.meta.url), "utf8");

describe("global CSS print styles", () => {
  it("restores the bottom border for the final print table row", () => {
    const globalLastRowRuleIndex = css.indexOf("tr:last-child td");
    const printLastRowRuleIndex = css.indexOf(".print-table tbody tr:last-child td");

    expect(printLastRowRuleIndex).toBeGreaterThan(globalLastRowRuleIndex);
    expect(css.slice(printLastRowRuleIndex)).toContain(
      "border-bottom: 1px solid #9ca3af;",
    );
  });
});
