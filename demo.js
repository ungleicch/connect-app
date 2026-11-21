require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function runDemo() {
    const tag = Date.now().toString().slice(-4); // Prevents duplicate username errors on re-runs

    console.log('--- 1. SAVING USERS TO SUPABASE ---');
    const { data: users, error: userErr } = await supabase
        .from('users')
        .insert([
            { username: `user_us_${tag}`, password_hash: 'hashed_pw_1', country_code: 'US' },
            { username: `user_jp_${tag}`, password_hash: 'hashed_pw_2', country_code: 'JP' }
        ])
        .select();

    if (userErr) return console.error('User Insert Error:', userErr);
    console.log('Saved Users:', users);

    const [userA, userB] = users;

    console.log('\n--- 2. SAVING USER PROFILES ---');
    const { data: profiles, error: profErr } = await supabase
        .from('user_profiles')
        .insert([
            {
                user_id: userA.user_id,
                avatar_preset_id: 'avatar_owl',
                favorite_book: 'Dune',
                favorite_song: 'Nights',
                favorite_movie: 'Interstellar'
            },
            {
                user_id: userB.user_id,
                avatar_preset_id: 'avatar_fox',
                favorite_book: 'Kafka on the Shore',
                favorite_song: 'Plastic Love',
                favorite_movie: 'Spirited Away'
            }
        ])
        .select();

    if (profErr) return console.error('Profile Insert Error:', profErr);
    console.log('Saved Profiles:', profiles);

    console.log('\n--- 3. CREATING A 24-HOUR MATCH SESSION ---');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const { data: session, error: sessErr } = await supabase
        .from('match_sessions')
        .insert({
            user_a_id: userA.user_id,
            user_b_id: userB.user_id,
            expires_at: expiresAt,
            is_theme_match: false,
            status: 'active'
        })
        .select()
        .single();

    if (sessErr) return console.error('Session Insert Error:', sessErr);
    console.log('Created Match Session:', session);

    console.log('\n--- 4. SAVING A CHAT MESSAGE ---');
    const { data: message, error: msgErr } = await supabase
        .from('messages')
        .insert({
            session_id: session.session_id,
            sender_id: userA.user_id,
            original_text: 'Hey! Nice to meet you from California!',
            translated_text: 'こんにちは！カリフォルニアからよろしく！'
        })
        .select()
        .single();

    if (msgErr) return console.error('Message Insert Error:', msgErr);
    console.log('Saved Message:', message);

    console.log('\n--- 5. RETRIEVING DATA FROM CENTRAL DATABASE ---');
    const { data: fetchedSession, error: fetchErr } = await supabase
        .from('match_sessions')
        .select(`
      session_id,
      status,
      expires_at,
      messages (
        message_id,
        sender_id,
        original_text,
        translated_text,
        sent_at
      )
    `)
        .eq('session_id', session.session_id)
        .single();

    if (fetchErr) return console.error('Fetch Error:', fetchErr);
    console.log('Retrieved Session + Messages:');
    console.dir(fetchedSession, { depth: null });
}

runDemo();