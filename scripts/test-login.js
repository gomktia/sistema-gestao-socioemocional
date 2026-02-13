const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://terwfdltjoiodcdzyctk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlcndmZGx0am9pb2RjZHp5Y3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MjY2OTMsImV4cCI6MjA4NjQwMjY5M30.lZQ1RFqUfLJumiTTnEUdrUK06bPj8Hn2FbhmhIu774E'
);

const emails = ['geisonhoehr@gmail.com', 'admin@escola.com', 'psi@escola.com', 'professor@escola.com', 'aluno@escola.com'];

async function main() {
  console.log('Testando login para todos os usuários (senha: 123456)\n');
  for (const email of emails) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: '123456' });
    console.log(error ? `✗ ${email}: ${error.message}` : `✓ ${email}: OK`);
    if (data?.user) await supabase.auth.signOut();
  }
}
main();
