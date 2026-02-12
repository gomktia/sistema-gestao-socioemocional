const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function createTestUsers() {
    // Only retry the failed ones
    const users = [
        { email: 'admin@escola.com', password: '123456' },
        { email: 'professor@escola.com', password: '123456' },
        { email: 'aluno@escola.com', password: '123456' }
    ];

    console.log(`Retrying creation of ${users.length} Test Users in Supabase Auth...`);

    for (const u of users) {
        console.log(`Creating Auth User: ${u.email}`);

        // Add delay to avoid rate limits
        await sleep(2000);

        const { data, error } = await supabase.auth.signUp({
            email: u.email,
            password: u.password,
        });

        if (error) {
            if (error.message.includes('already registered')) {
                console.log(`User ${u.email} already exists in Supabase Auth.`);
            } else {
                console.error(`Error creating user ${u.email}:`, error.message);
            }
        } else {
            console.log(`User ${u.email} created successfully:`, data.user?.id);
        }
    }
}

createTestUsers();
