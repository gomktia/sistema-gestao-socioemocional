const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
dotenv.config();

const prisma = new PrismaClient();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function debugAuth() {
    console.log('--- DEBUGGING AUTH ---');

    try {
        // 1. Check DB Status
        console.log('\n1. Checking Database Records (auth.users)...');
        const users = await prisma.$queryRaw`
            SELECT id, email, email_confirmed_at, encrypted_password, role, instance_id 
            FROM auth.users 
            WHERE email IN ('admin@escola.com', 'psi@escola.com')
        `;
        console.table(users);

        // 2. Try Login via Client
        console.log('\n2. Testing Client Login...');

        const testEmails = ['admin@escola.com', 'psi@escola.com'];
        for (const email of testEmails) {
            console.log(`\nAttempting login for: ${email}`);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password: '123456'
            });

            if (error) {
                console.error(`FAILED: ${error.message}`);
            } else {
                console.log(`SUCCESS! User ID: ${data.user.id}`);
                console.log(`Session Access Token (first 20 chars): ${data.session.access_token.substring(0, 20)}...`);
            }
        }

    } catch (e) {
        console.error('Debug script error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

debugAuth();
