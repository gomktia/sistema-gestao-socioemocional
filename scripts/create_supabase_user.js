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

async function createAdminUser() {
    const email = 'geisonhoehr@gmail.com';
    const password = '123456';

    console.log(`Creating Auth User: ${email}`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        if (error.message.includes('already registered')) {
            console.log('User already exists in Supabase Auth.');
        } else {
            console.error('Error creating user:', error.message);
        }
    } else {
        console.log('User created successfully:', data.user?.id);
        if (data.user && !data.user.email_confirmed_at && data.session === null) {
            console.warn('WARNING: User created but email confirmation might be required. Check Supabase dashboard.');
        }
    }
}

createAdminUser();
