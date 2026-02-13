const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
    'https://terwfdltjoiodcdzyctk.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlcndmZGx0am9pb2RjZHp5Y3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MjY2OTMsImV4cCI6MjA4NjQwMjY5M30.lZQ1RFqUfLJumiTTnEUdrUK06bPj8Hn2FbhmhIu774E'
);

async function main() {
    const email = `tester${Math.floor(Math.random() * 1000)}@test.com`;
    const password = 'password123';

    console.log(`Testing signup for ${email}...`);
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        console.log('✗ Signup Error:', error.message);
    } else {
        console.log('✓ Signup OK:', data.user ? data.user.id : 'User pending');
    }
}
main();
