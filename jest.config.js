/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "^db/(.*)$": "<rootDir>/src/db/$1",
    "^config/(.*)$": "<rootDir>/src/config/$1",
    "^types/(.*)$": "<rootDir>/src/types/$1",
    "^service/(.*)$": "<rootDir>/src/service/$1",
    "^model/(.*)$": "<rootDir>/src/model/$1",
    "^route/(.*)$": "<rootDir>/src/route/$1",
    "^utils/(.*)$": "<rootDir>/src/utils/$1",
    "^middleware/(.*)$": "<rootDir>/src/middleware/$1",
    "^validators/(.*)$": "<rootDir>/src/validators/$1",
    "^tests/(.*)$": "<rootDir>/src/tests/$1",
  },
};
