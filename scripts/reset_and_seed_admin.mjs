import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Load .env.local manually
const envContent = fs.readFileSync(".env.local", "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const idx = trimmed.indexOf("=");
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      env[key] = val;
    }
  }
});

const supabaseUrl = env["NEXT_PUBLIC_SUPABASE_URL"];
const serviceKey = env["SUPABASE_SERVICE_ROLE_KEY"];
const anonKey = env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];

if (!supabaseUrl || !serviceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function clearTable(tableName) {
  console.log(`Clearing table '${tableName}'...`);
  const { error } = await supabase.from(tableName).delete().not("id", "is", null);
  if (error) {
    console.error(`Error clearing ${tableName}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log("=== PLAYOPS DATABASE RESET & ADMIN PROVISIONING ===");
  console.log("Target Admin: admin123@gmail.com / admin@123\n");

  // Step 1: Delete relational operational data in dependent order
  const tablesToClear = [
    "certificates",
    "player_performance",
    "match_events",
    "matches",
    "points_table",
    "tournament_registrations",
    "team_players",
    "teams",
    "tournaments",
    "players",
    "notifications",
    "reports",
    "users",
  ];

  for (const table of tablesToClear) {
    await clearTable(table);
  }
  console.log("✓ All operational tables, certificates, tournaments, athletes, and users cleared.\n");

  // Step 2: Delete all users from Supabase Auth (auth.users)
  console.log("Listing all auth users...");
  const { data: userList, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) {
    console.error("Failed to list users:", listErr);
    process.exit(1);
  }

  console.log(`Found ${userList.users.length} existing auth user(s). Removing all...`);
  for (const u of userList.users) {
    console.log(`Deleting auth user: ${u.email} (${u.id})`);
    const { error: delErr } = await supabase.auth.admin.deleteUser(u.id);
    if (delErr) {
      console.error(`Failed to delete auth user ${u.email}:`, delErr.message);
    }
  }
  console.log("✓ All previous auth users deleted from Supabase Auth.\n");

  // Step 3: Create the single Admin user
  const adminEmail = "admin123@gmail.com";
  const adminPassword = "admin@123";
  const adminFullName = "Sports Administrator";

  console.log(`Creating new Admin Auth user: ${adminEmail}...`);
  const { data: createData, error: createErr } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: {
      full_name: adminFullName,
      role: "admin",
    },
  });

  if (createErr) {
    console.error("Failed to create admin user:", createErr);
    process.exit(1);
  }

  const newAdmin = createData.user;
  console.log(`✓ Created Auth user: ${newAdmin.email} with ID: ${newAdmin.id}`);

  // Step 4: Insert admin record into public.users
  console.log("Inserting record into public.users...");
  const { data: profile, error: profErr } = await supabase
    .from("users")
    .insert({
      id: newAdmin.id,
      email: adminEmail.toLowerCase(),
      full_name: adminFullName,
      role: "admin",
    })
    .select()
    .single();

  if (profErr) {
    console.error("Failed to insert into public.users:", profErr);
    process.exit(1);
  }
  console.log("✓ Inserted into public.users:", profile);

  // Step 5: Verify login via anon client
  console.log("\nVerifying admin login with credentials...");
  const anonClient = createClient(supabaseUrl, anonKey);
  const { data: authResult, error: authErr } = await anonClient.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });

  if (authErr) {
    console.error("Sign-in verification failed:", authErr);
    process.exit(1);
  }

  console.log(`✓ Sign-in test successful! Token generated for ${authResult.user.email}`);

  // Step 6: Final Database State Verification
  console.log("\n=== FINAL DATABASE AUDIT ===");
  const allTables = [
    "users",
    "players",
    "tournaments",
    "certificates",
    "teams",
    "matches",
    "sports",
    "venues",
  ];

  for (const t of allTables) {
    const { count, error } = await supabase.from(t).select("*", { count: "exact", head: true });
    console.log(`Table '${t}': ${count} row(s) ${error ? `(Error: ${error.message})` : ""}`);
  }

  const { data: finalAuthList } = await supabase.auth.admin.listUsers();
  console.log(`Auth.users count: ${finalAuthList.users.length}`);
  finalAuthList.users.forEach((u) => {
    console.log(` - ${u.email} [${u.user_metadata?.role || "no-role"}]`);
  });

  console.log("\n=== SUCCESS: Database reset complete. Only admin123@gmail.com exists! ===");
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
