export default {
  testEnvironment: "node",
  testMatch: [
    "<rootDir>/tests/**/*.test.js",
    "<rootDir>/advTest/**/*.adv.test.js"
  ],
  setupFiles: ["<rootDir>/tests/setup/env.js"],
  clearMocks: true,
  restoreMocks: true,
  resetMocks: false,
};
