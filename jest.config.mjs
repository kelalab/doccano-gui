export default {
    testMatch: [
        "**/?(*.)test.?js"
    ],
    testEnvironment: 'node',
    transform: {},
    testPathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/node_modules/"],
    moduleFileExtensions: ["js", "jsx", "mjs"]
}