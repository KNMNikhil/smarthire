const { Client } = require('pg');

const connectionString = 'postgresql://smarthire_user:kO1GJj5fCv7ZbisucIiIYZ2TslyFERY4@dpg-d77orm94tr6s73d4iivg-a.oregon-postgres.render.com/smarthire_db_2kvp';

async function checkDatabase() {
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Check tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema='public'
      ORDER BY table_name
    `);
    
    console.log('📋 Tables in database:');
    tables.rows.forEach(row => console.log('  -', row.table_name));
    console.log('');

    // Check Admins table
    if (tables.rows.some(r => r.table_name === 'Admins')) {
      const admins = await client.query('SELECT id, username, email FROM "Admins"');
      console.log('👤 Admins:', admins.rows);
    } else {
      console.log('⚠️  Admins table does not exist!');
    }

    // Check Students table
    if (tables.rows.some(r => r.table_name === 'Students')) {
      const students = await client.query('SELECT COUNT(*) as count FROM "Students"');
      console.log('👥 Students count:', students.rows[0].count);
    } else {
      console.log('⚠️  Students table does not exist!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkDatabase();
