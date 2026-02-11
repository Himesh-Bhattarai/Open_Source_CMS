export default {
  testEnvironment: "node",
  testMatch: ["**/advTest/**/*.adv.test.js"], // only run advTest files
  transform: {},                               // no transform needed for JS
  verbose: true,
  globals: {},
  testMatch: [
    "<rootDir>/tests/**/*.test.js",
    "<rootDir>/advTest/**/*.adv.test.js"
  ],
  setupFiles: ["<rootDir>/tests/setup/env.js"],
  clearMocks: true,
  restoreMocks: true,
  resetMocks: false,
 
};
