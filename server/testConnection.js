const { Client } = require('pg');

const testConnections = async () => {
  const passwords = ['', 'postgres', 'password', '123456'];
  
  for (const password of passwords) {
    console.log(`\nTesting with password: "${password}"`);
    
    const client = new Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: password,
      database: 'postgres'
    });

    try {
      await client.connect();
      console.log('✅ Connection successful!');
      
      // Try to create database
      try {
        await client.query('CREATE DATABASE smarthire_db');
        console.log('✅ Database created successfully');
      } catch (error) {
        if (error.code === '42P04') {
          console.log('✅ Database already exists');
        } else {
          console.log('❌ Database creation failed:', error.message);
        }
      }
      
      await client.end();
      
      // Update .env file with working password
      const fs = require('fs');
      const path = require('path');
      const envPath = path.join(__dirname, '.env');
      let envContent = fs.readFileSync(envPath, 'utf8');
      envContent = envContent.replace(/DB_PASSWORD=.*/, `DB_PASSWORD=${password}`);
      fs.writeFileSync(envPath, envContent);
      console.log('✅ Updated .env file with working password');
      
      return true;
    } catch (error) {
      console.log('❌ Connection failed:', error.message);
    }
  }
  
  return false;
};

testConnections().then(success => {
  if (success) {
    console.log('\n🎉 PostgreSQL connection established successfully!');
  } else {
    console.log('\n❌ Could not establish PostgreSQL connection with any password.');
    console.log('Please check your PostgreSQL installation and configuration.');
  }
});