import fnv, { fnv1, fnv1a, fnv1a32, fnv132 } from "../src";

test("fnv132", () => {
  expect(fnv132("the quick brown fox jumped over the lazy dog")).toEqual(0x19d97436);
});

test("fnv132BigInt", () => {
  expect(fnv1("the quick brown fox jumped over the lazy dog", 32)).toEqual(
    BigInt("0x19d97436")
  );
});

test("fnv164", () => {
  expect(fnv1("the quick brown fox jumped over the lazy dog", 64)).toEqual(
    BigInt("0xef207c40551d25f6")
  );
});

test("fnv1a32", () => {
  expect(fnv1a32("the quick brown fox jumped over the lazy dog")).toEqual(0x406d1fd8);
});

test("fnv1a32BigInt", () => {
  expect(fnv1a("the quick brown fox jumped over the lazy dog", 32)).toEqual(
    BigInt("0x406d1fd8")
  );
});

test("fnv1a64", () => {
  expect(fnv1a("the quick brown fox jumped over the lazy dog", 64)).toEqual(
    BigInt("0x4fb124b03ec8f8f8")
  );
});

test("fnv-1-32", () => {
  expect(fnv("the quick brown fox jumped over the lazy dog", "fnv1", 32)).toEqual(
    BigInt("0x19d97436")
  );
});

test("fnv-1a-32", () => {
  expect(fnv("the quick brown fox jumped over the lazy dog", "fnv1a", 32)).toEqual(
    BigInt("0x406d1fd8")
  );
});

test("fnv-1a-64", () => {
  expect(fnv("the quick brown fox jumped over the lazy dog", "fnv1a", 64)).toEqual(
    BigInt("0x4fb124b03ec8f8f8")
  );
});
