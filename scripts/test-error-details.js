const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
    'https://terwfdltjoiodcdzyctk.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlcndmZGx0am9pb2RjZHp5Y3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MjY2OTMsImV4cCI6MjA4NjQwMjY5M30.lZQ1RFqUfLJumiTTnEUdrUK06bPj8Hn2FbhmhIu774E'
);

async function main() {
    const email = 'admin@escola.com';
    const password = 'WRONG_PASSWORD';

    console.log(`Testing login for ${email} with WRONG password...`);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.log('Error Code:', error.code);
        console.log('Error Status:', error.status);
        console.log('Error Message:', error.message);
    } else {
        console.log('✓ Login (unexpectedly) OK!');
    }
}
main();
