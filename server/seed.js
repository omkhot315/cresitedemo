import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { Business } from "./models/Business.js";
import { User } from "./models/User.js";
import { SEED_BUSINESSES } from "../src/data/seedBusinesses.js";

/**
 * Seed the database.
 *
 * Creates exactly ONE super admin (env-configurable) who provisions every other
 * account, plus an example admin + owner so each role can be tried out, and the
 * five demo businesses (owned by the demo admin).
 *
 * Public sign-up creates owner accounts; run this to bootstrap the elevated
 * super-admin/admin accounts and the demo websites.
 *
 *   npm run seed
 */
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cresite";

/* The single, env-configurable platform super admin. */
const SUPER_ADMIN = {
  name: process.env.SUPER_ADMIN_NAME || "Super Admin",
  email: (process.env.SUPER_ADMIN_EMAIL || "superadmin@cresite.in").toLowerCase(),
  password: process.env.SUPER_ADMIN_PASSWORD || "super123",
  role: "superadmin",
};

/* Example accounts the super admin might create (handy for demos). */
const EXAMPLE_STAFF = [
  { name: "Platform Admin", email: "admin@cresite.in", password: "admin123", role: "admin" },
  { name: "Demo Owner", email: "owner@cresite.in", password: "owner123", role: "owner" },
];

/** Create the user if missing; keep the super admin role intact if it exists. */
async function ensureUser({ name, email, password, role }) {
  let user = await User.findOne({ email });
  if (user) {
    if (user.role !== role && role === "superadmin") {
      user.role = "superadmin"; // never let a re-seed demote the super admin
      await user.save();
    }
    console.log(`[seed]  exists   ${role.padEnd(10)}  ${email}`);
    return user;
  }
  user = await User.create({ name, email, password, role });
  console.log(`[seed]  created  ${role.padEnd(10)}  ${email}  (password: ${password})`);
  return user;
}

async function run() {
  console.log(`[seed] connecting to ${MONGO_URI} …`);
  await connectDB(MONGO_URI);

  console.log("[seed] accounts:");
  const superAdmin = await ensureUser(SUPER_ADMIN);
  const demoAdmin = await ensureUser(EXAMPLE_STAFF[0]);
  await ensureUser(EXAMPLE_STAFF[1]);

  /* Safety: if a database somehow has no super admin, promote the seeded one. */
  const superCount = await User.countDocuments({ role: "superadmin" });
  if (superCount === 0) {
    superAdmin.role = "superadmin";
    await superAdmin.save();
    console.log("[seed]  promoted a super admin (none existed).");
  }

  console.log("[seed] businesses:");
  let created = 0;
  let updated = 0;
  /* Demo websites get a live 1-year subscription so they stay publicly visible. */
  const demoTerm = {
    subscriptionStatus: "active",
    subscriptionStart: new Date(),
    subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    subscriptionRenewals: 1,
  };
  for (const business of SEED_BUSINESSES) {
    const exists = await Business.findOne({ slug: business.slug });
    await Business.findOneAndUpdate(
      { slug: business.slug },
      {
        $set: {
          ...business,
          ...demoTerm,
          owner: demoAdmin._id,
          ownerName: demoAdmin.name,
          ownerEmail: demoAdmin.email,
          createdBy: demoAdmin._id,
          createdByName: demoAdmin.name,
          createdByEmail: demoAdmin.email,
          createdByRole: demoAdmin.role,
        },
      },
      { upsert: true, returnDocument: "after" }
    );
    if (exists) updated += 1;
    else created += 1;
    console.log(`[seed]  ${exists ? "updated" : "created"}  /${business.slug}  (${business.name})`);
  }

  const totals = { users: await User.countDocuments(), businesses: await Business.countDocuments() };
  console.log(`[seed] done — ${created} created, ${updated} refreshed.`);
  console.log(`[seed] database now holds ${totals.users} accounts and ${totals.businesses} businesses.`);
  console.log("[seed]");
  console.log(`[seed] SUPER ADMIN → ${SUPER_ADMIN.email} / ${SUPER_ADMIN.password}   (provisions admins)`);
  console.log(`[seed] admin        → admin@cresite.in / admin123`);
  console.log(`[seed] owner        → owner@cresite.in / owner123`);
  console.log("[seed] Public sign-up creates owner accounts; elevated roles are provisioned here.");
  console.log("[seed] Set SUPER_ADMIN_EMAIL / SUPER_ADMIN_PASSWORD before deploying.");

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(`[seed] failed: ${err.message}`);
  console.error("[seed] is MongoDB running?  →  mongod  (or set MONGO_URI in .env)");
  process.exit(1);
});
