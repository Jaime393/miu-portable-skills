const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(
  path.join(__dirname, "../skills/checkpoint-discovery/scripts/read-network-pattern.js"), "utf8"
);
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(source, sandbox);
const checksum = "d2149621a41dc36f6c352c845ff75906";

function response(overrides = {}) {
  const record = {
    pattern: {schema: "miu.capability-pattern/v1", version: 1, auto_aplicable: false},
    canonical_checksum: checksum, ...overrides
  };
  return {result: {result:
    "Untrusted data boundaries follow.\n<untrusted-data-fixture>\n" +
    JSON.stringify([record]) + "\n</untrusted-data-fixture>"
  }};
}

(async () => {
  let result = await sandbox.readMiuAccessPattern(async () => response());
  assert.equal(result.route_used, "primary");
  assert.equal(result.auto_execute, false);
  result = await sandbox.readMiuAccessPattern(async args => {
    if (args.project_id === "qtmcbqsahdomgsxgsaxi") throw new Error("controlled primary failure");
    return response();
  });
  assert.equal(result.route_used, "replica");
  assert.equal(result.attempts.length, 2);
  result = await sandbox.readMiuAccessPattern(async () => response(), {prefer: "replica"});
  assert.equal(result.route_used, "replica");
  result = await sandbox.readMiuAccessPattern(async () => response({canonical_checksum: "different"}));
  assert.equal(result.status, "blocked_no_verified_pattern");
  result = await sandbox.readMiuAccessPattern(async () => response({
    pattern: {schema: "miu.capability-pattern/v1", version: 1, auto_aplicable: true}
  }));
  assert.equal(result.status, "blocked_no_verified_pattern");
  result = await sandbox.readMiuAccessPattern(async () => ({result: {result: "unrecognized"}}));
  assert.equal(result.status, "blocked_no_verified_pattern");
  console.log("PASS: primary, fallback, replica preference, checksum, scope and format (6 mocked cases).");
})().catch(error => { console.error(error); process.exitCode = 1; });
