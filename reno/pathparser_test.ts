import { assertEquals, assertMatch, assertStrictEquals } from "../deps.ts";
import parsePath from "./pathparser.ts";

function assertNotMatch(actual: string, regExp: RegExp) {
  assertStrictEquals(
    regExp.test(actual),
    false,
    `actual: "${actual}" expected not to match: "${regExp}"`,
  );
}

Deno.test({
  name: "parsePath should convert a human-friendly path spec into a RegExp",
  fn() {
    const path = "/api/foo/*/bar/*/*/baz";
    const regExp = parsePath(path);

    assertMatch("/api/foo/lol/bar/qux/kek/baz", regExp);
    assertMatch("/api/foo/lol/bar/qux/kek/baz/", regExp);
    assertNotMatch("/api/foo/lol/bar", regExp);

    assertEquals(
      ["lol", "qux", "kek"],
      ("/api/foo/lol/bar/qux/kek/baz/".match(regExp) || []).slice(1),
    );
  },
});

Deno.test({
  name: "parsePath should treat the last wildcard as optional",
  fn() {
    const path = "/api/foo/*";
    const regExp = parsePath(path);

    assertMatch("/api/foo/lol", regExp);
    assertMatch("/api/foo/", regExp);
    assertMatch("/api/foo", regExp);
  },
});

Deno.test({
  name: "parsePath should return the input parameter if it`s a RegExp",
  fn() {
    const path = /\/api\/foo\/.*/;
    const regExp = parsePath(path);

    assertStrictEquals(regExp, path);
  },
});
