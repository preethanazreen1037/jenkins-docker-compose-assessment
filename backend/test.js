const assert = require("assert");

function healthCheck() {
  return {
    status: "UP",
    service: "backend"
  };
}

const result = healthCheck();

assert.strictEqual(result.status, "UP");
assert.strictEqual(result.service, "backend");

console.log("All backend tests passed successfully.");
