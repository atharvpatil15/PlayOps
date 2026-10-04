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

if (!supabaseUrl || !serviceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const email = "atharwapatil1@gmail.com";
  const password = "Admin@123";
  const fullName = "Atharwa Patil";

  console.log(`Checking if user ${email} exists in auth.users...`);
  const { data: userList, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) {
    console.error("Failed to list users:", listErr);
    process.exit(1);
  }

  let user = userList.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  if (!user) {
    console.log(`Creating auth user: ${email}...`);
    const { data: createData, error: createErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role: "admin" },
    });

    if (createErr) {
      console.error("Failed to create auth user:", createErr);
      process.exit(1);
    }
    user = createData.user;
    console.log(`Created auth user with id: ${user.id}`);
  } else {
    console.log(`User ${email} already exists (${user.id}). Updating password and metadata...`);
    const { data: updateData, error: updateErr } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName, role: "admin" },
      }
    );
    if (updateErr) {
      console.error("Failed to update auth user:", updateErr);
      process.exit(1);
    }
    user = updateData.user;
    console.log(`Updated user ${email} successfully.`);
  }

  // Ensure record exists in public.users
  console.log(`Ensuring record in public.users for ${email}...`);
  const { data: profile, error: profErr } = await supabase
    .from("users")
    .upsert(
      {
        id: user.id,
        email: email.toLowerCase(),
        full_name: fullName,
        role: "admin",
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (profErr) {
    console.error("Failed to upsert in public.users:", profErr);
    process.exit(1);
  }

  console.log(`Upserted public.users record successfully:`, profile);

  // Verify sign-in
  console.log("Verifying sign-in with password...");
  const anonKey = env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];
  const client = createClient(supabaseUrl, anonKey);
  const { data: authResult, error: authErr } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (authErr) {
    console.error("Sign in verification failed:", authErr);
    process.exit(1);
  }

  console.log("Sign-in verification successful! User session obtained for:", authResult.user.email);
}

main().catch(console.error);
