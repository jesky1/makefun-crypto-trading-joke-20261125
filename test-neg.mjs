// Negative tests: the screen must reject invalid or off-topic lines.
// Run: node --test test.mjs test-neg.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { screenEntry, ENTRY } from "./main.ts";

const cases = [
  ["201 characters rejected", "x".repeat(201), "length"],
  ["200 characters exactly accepted", "Crypto dip buys daily " + "trade ".repeat(29) + "dips", null],
  ["whitespace-only rejected", "   ", "whitespace"],
  ["empty rejected", "", "length"],
  ["multi-line rejected", "I bought the dip\nthen it dumped.", "single line"],
  ["trailing whitespace rejected", "I bought the dip. ", "whitespace"],
  ["control character rejected", "I bought the dip.\x07", "control"],
  ["invisible character rejected", "I bought\u200bthe dip.", "invisible"],
  ["no letters rejected", "12345 !!!", "letters"],
  ["fewer than 5 words rejected", "Bought the dip.", "5 words"],
  ["off-topic rejected", "The cat slept all afternoon on the warm windowsill.", "crypto and trading"],
  ["link rejected", "I bought the dip daily see https://example.com for proof.", "links"],
  ["repeated-character spam rejected", "I bought the diiiiip daily.", "spam"],
  ["original entry accepted", ENTRY, null],
];

for (const [name, input, want] of cases) {
  test(name, () => {
    const problem = screenEntry(input);
    if (want === null) assert.equal(problem, null);
    else assert.ok(problem && problem.includes(want), `got: ${problem}`);
  });
}
