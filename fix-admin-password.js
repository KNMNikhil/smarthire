const { Client } = require('pg');

const connectionString = 'postgresql://smarthire_user:kO1GJj5fCv7ZbisucIiIYZ2TslyFERY4@dpg-d77orm94tr6s73d4iivg-a.oregon-postgres.render.com/smarthire_db_2kvp';

async function fixAdminPassword() {
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Update admin password with correct hash
    const correctHash = '$2a$12$4I064zdPKqSlVylBDNoeb.gPMaQBhQq8otQDpeh3PlzcoJAMsZ4va';
    
    const result = await client.query(`
      UPDATE "Admins" 
      SET password = $1, "updatedAt" = NOW()
      WHERE username = 'admin'
      RETURNING id, username, email
    `, [correctHash]);

    if (result.rows.length > 0) {
      console.log('✅ Admin password updated successfully!');
      console.log('   Username:', result.rows[0].username);
      console.log('   Email:', result.rows[0].email);
      console.log('\n═══════════════════════════════════════');
      console.log('You can now login with:');
      console.log('Username: admin');
      console.log('Password: admin123');
      console.log('═══════════════════════════════════════\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

fixAdminPassword();
