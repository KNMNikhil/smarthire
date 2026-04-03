const { Client } = require('pg');

const checkDatabase = async () => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'nikhil@2005',
    database: 'smarthire_db'
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL database: smarthire_db');

    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('\n📋 Available Tables:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // Count records in each table
    const tables = ['Students', 'Companies', 'Admins', 'Alumni'];
    
    console.log('\n📊 Record Counts:');
    for (const table of tables) {
      try {
        const result = await client.query(`SELECT COUNT(*) FROM "${table}"`);
        console.log(`  - ${table}: ${result.rows[0].count} records`);
      } catch (error) {
        console.log(`  - ${table}: Table not found`);
      }
    }

    // Show sample data from Students table
    try {
      const studentsResult = await client.query('SELECT id, name, email, "rollNo", department FROM "Students" LIMIT 5');
      if (studentsResult.rows.length > 0) {
        console.log('\n👥 Sample Students:');
        studentsResult.rows.forEach(student => {
          console.log(`  - ${student.name} (${student.rollNo}) - ${student.email} - ${student.department}`);
        });
      }
    } catch (error) {
      console.log('\n❌ Students table not accessible');
    }

    // Show sample data from Companies table
    try {
      const companiesResult = await client.query('SELECT id, name, "jobRole", package FROM "Companies" LIMIT 5');
      if (companiesResult.rows.length > 0) {
        console.log('\n🏢 Sample Companies:');
        companiesResult.rows.forEach(company => {
          console.log(`  - ${company.name} - ${company.jobRole} - ${company.package}`);
        });
      }
    } catch (error) {
      console.log('\n❌ Companies table not accessible');
    }

    await client.end();
    console.log('\n✅ Database check completed successfully!');

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Verify the password: nikhil@2005');
    console.log('3. Check if database "smarthire_db" exists');
    console.log('4. Run the initialization script first');
  }
};

checkDatabase();