const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { randomUUID } = require('crypto');

async function forceRecreateUsersWithIdentities() {
  console.log('--- Force Recreating Users + Identities (Fixing Broken Logins) ---');

  try {
    // 1. Get template user (psi@escola.com)
    const templateEmail = 'psi@escola.com';
    const templates = await prisma.$queryRaw`
      SELECT * FROM auth.users WHERE email = ${templateEmail} LIMIT 1
    `;

    if (!templates || templates.length === 0) {
      console.error(`CRITICAL: Template user ${templateEmail} not found!`);
      return;
    }
    const template = templates[0];
    console.log(`Template found (${templateEmail}). Using as source.`);

    // 2. Users to fix
    const usersToFix = [
      'admin@escola.com',
      'professor@escola.com',
      'aluno@escola.com',
      'geisonhoehr@gmail.com'
    ];

    for (const email of usersToFix) {
      console.log(`\nProcessing ${email}...`);

      // A. Delete existing record (Cascade should delete identities)
      await prisma.$executeRaw`DELETE FROM auth.users WHERE email = ${email}`;
      console.log(`  - Deleted existing record.`);

      // B. Create New User
      const newId = randomUUID();
      const now = new Date().toISOString();

      await prisma.$executeRaw`
        INSERT INTO auth.users (
          instance_id,
          id,
          aud,
          role,
          email,
          encrypted_password,
          email_confirmed_at,
          invited_at,
          confirmation_token,
          confirmation_sent_at,
          recovery_token,
          recovery_sent_at,
          email_change_token_new,
          email_change,
          email_change_sent_at,
          last_sign_in_at,
          raw_app_meta_data,
          raw_user_meta_data,
          is_super_admin,
          created_at,
          updated_at,
          phone,
          phone_confirmed_at,
          phone_change,
          phone_change_token,
          phone_change_sent_at,
          email_change_token_current,
          email_change_confirm_status,
          banned_until,
          reauthentication_token,
          reauthentication_sent_at,
          is_sso_user,
          deleted_at
        ) VALUES (
          ${template.instance_id}::uuid,
          ${newId}::uuid,
          ${template.aud},
          ${template.role},
          ${email},
          ${template.encrypted_password},
          ${now}::timestamptz,
          NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
          NULL,
          ${template.raw_app_meta_data}::jsonb,
          ${template.raw_user_meta_data}::jsonb,
          ${template.is_super_admin},
          ${now}::timestamptz,
          ${now}::timestamptz,
          NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, ${template.is_sso_user}, NULL
        )
      `;
      console.log(`  - Created User Record: ${newId}`);

      // C. Create Identity Record (Fixed: removed email column as it is generated)
      const identityId = randomUUID();
      const identityData = {
        sub: newId,
        email: email,
        email_verified: false,
        phone_verified: false,
      };

      await prisma.$executeRaw`
        INSERT INTO auth.identities (
          id,
          user_id,
          identity_data,
          provider,
          provider_id,
          last_sign_in_at,
          created_at,
          updated_at
        ) VALUES (
          ${identityId}::uuid,
          ${newId}::uuid,
          ${JSON.stringify(identityData)}::jsonb,
          'email',
          ${newId}, -- Provider ID for email is the User ID in this setup
          ${now}::timestamptz,
          ${now}::timestamptz,
          ${now}::timestamptz
        )
      `;
      console.log(`  - Created Identity Record: ${identityId}`);
    }

    console.log('\n--- Recreation with Identities Complete ---');

  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

forceRecreateUsersWithIdentities();
