module.exports = {
  "__version": "5.3.0",
  "Example project: browser": {
    "Should fetch all necessary files and print out a script result to the console.": {
      "http requests": [
        "http://localhost:3000/",
        "http://localhost:3000/index.css",
        "http://localhost:3000/index.ts",
        "http://localhost:3000/__reload__",
        "http://localhost:3000/bundled_node_modules/left-pad.js",
        "http://localhost:3000/greeting.ts",
        "http://localhost:3000/spacing/index.ts",
        "http://localhost:3000/spacing/spacing.ts",
        "http://localhost:3000/utils/toNumber.ts"
      ],
      "script result": [
        "Hello  Hello"
      ]
    }
  }
}
