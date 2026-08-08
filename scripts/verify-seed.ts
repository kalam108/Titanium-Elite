import "dotenv/config";
import { db } from "../db/index";
import { sql } from "drizzle-orm";

async function main() {
  const guide = await db.execute(sql`
    select g.id, p.full_name, g.trust_score, g.verification_status, g.verified_at
    from guides g join profiles p on p.id = g.profile_id
    where p.full_name = 'Pasang Sherpa'
  `);
  console.log("demo guide:", JSON.stringify(guide, null, 2));

  const stats = await db.execute(sql`
    select
      (select count(*) from guides) guides,
      (select count(*) from guides where verification_status = 'verified') verified,
      (select count(*) from listings) listings,
      (select count(*) from bookings) bookings,
      (select count(*) from bookings where status = 'completed') completed_bookings,
      (select count(*) from reviews) reviews,
      (select count(*) from availability) availability,
      (select count(*) from messages) messages,
      (select count(*) from payments) payments,
      (select count(*) from safety_reports) safety_reports,
      (select count(*) from regions) regions,
      (select count(*) from guide_documents) docs
  `);
  console.log("stats:", JSON.stringify(stats, null, 2));

  const top = await db.execute(sql`
    select p.full_name, g.trust_score, g.response_hours
    from guides g join profiles p on p.id = g.profile_id
    where g.verification_status = 'verified'
    order by g.trust_score desc
    limit 5
  `);
  console.log("top trust:", JSON.stringify(top, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
