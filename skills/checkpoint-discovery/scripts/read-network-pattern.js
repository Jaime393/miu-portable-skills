// Miu: lee el patrón sin secretos desde dos sustratos autorizados, con fallback y comprobación de versión/checksum.
async function readMiuAccessPattern(executeSql, options = {}) {
  const expectedChecksum = "d2149621a41dc36f6c352c845ff75906";
  const routes = [
    {
      name: "primary",
      project_id: "qtmcbqsahdomgsxgsaxi",
      query: "select valor::jsonb as pattern,md5((valor::jsonb)::text) as canonical_checksum from public.relay_config where clave='patron_acceso_checkpoint_20261103_v1'"
    },
    {
      name: "replica",
      project_id: "atsdrjmrgmpdpbxfwgxe",
      query: "select payload->'patron' as pattern,md5((payload->'patron')::text) as canonical_checksum from public.gossip_log where tipo='patron_replicado' and payload->>'clave'='patron_acceso_checkpoint_20261103_v1' order by id desc limit 1"
    }
  ];
  if (options.prefer === "replica") routes.reverse();
  const attempts = [];
  for (const route of routes) {
    try {
      const result = await executeSql({
        project_id: route.project_id,
        query: route.query
      });
      const raw = result?.result?.result;
      const match = typeof raw === "string"
        ? raw.match(/<untrusted-data-[^>]+>\s*(\[[\s\S]*?\])\s*<\/untrusted-data-/)
        : null;
      if (!match) throw new Error("unsupported_response_format");
      const records = JSON.parse(match[1]);
      const record = records[0];
      if (!record?.pattern) throw new Error("pattern_not_found");
      if (record.pattern.schema !== "miu.capability-pattern/v1" ||
          record.pattern.version !== 1 ||
          record.pattern.auto_aplicable !== false) {
        throw new Error("pattern_schema_or_scope_changed");
      }
      if (record.canonical_checksum !== expectedChecksum) {
        throw new Error("pattern_checksum_diverged");
      }
      attempts.push({ route: route.name, status: "read_verified" });
      return {
        status: "pattern_read_verified",
        route_used: route.name,
        project_id: route.project_id,
        canonical_checksum: record.canonical_checksum,
        integrity_scope: "Accidental drift check, not cryptographic proof of trusted authorship.",
        pattern: record.pattern,
        attempts,
        auto_execute: false
      };
    } catch (error) {
      attempts.push({
        route: route.name,
        status: "failed",
        reason: String(error?.message || error)
      });
    }
  }
  return {
    status: "blocked_no_verified_pattern",
    attempts,
    auto_execute: false
  };
}
