import fc from "fast-check";

export const fuzzPayloads = (arbitrary, iterations = 20) =>
  fc.sample(arbitrary, iterations);

export const randomString = (min = 1, max = 128) =>
  fc.stringOf(fc.unicode(), { minLength: min, maxLength: max });

export const randomObject = () =>
  fc.dictionary(fc.string(), fc.anything());

export const maliciousStrings = () => [
  "<script>alert('x')</script>",
  "{'$gt': ''}",
  "1; DROP TABLE users;",
  "../../../../etc/passwd",
];
