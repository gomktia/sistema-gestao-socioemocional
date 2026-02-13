const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
    'https://terwfdltjoiodcdzyctk.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlcndmZGx0am9pb2RjZHp5Y3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MjY2OTMsImV4cCI6MjA4NjQwMjY5M30.lZQ1RFqUfLJumiTTnEUdrUK06bPj8Hn2FbhmhIu774E'
);

async function main() {
    console.log('Testing general API access...');
    const { data, error } = await supabase.from('users').select('email').limit(1);
    if (error) {
        console.log('✗ API Error:', error.message);
    } else {
        console.log('✓ API OK:', data);
    }
}
main();
