const { sequelize } = require('./models');

const fixEnumConstraint = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // 1. Drop default constraint
    console.log('Dropping default value...');
    await sequelize.query(`
      ALTER TABLE "Students" 
      ALTER COLUMN "placedStatus" DROP DEFAULT;
    `);

    // 2. Change column to temporary type (VARCHAR)
    console.log('Changing column type to VARCHAR...');
    await sequelize.query(`
      ALTER TABLE "Students" 
      ALTER COLUMN "placedStatus" TYPE VARCHAR(50);
    `);

    // 3. Drop the old ENUM type
    console.log('Dropping old ENUM type...');
    await sequelize.query(`
      DROP TYPE IF EXISTS "enum_Students_placedStatus";
    `);

    // 4. Create new ENUM type with correct values
    console.log('Creating new ENUM type...');
    await sequelize.query(`
      CREATE TYPE "enum_Students_placedStatus" AS ENUM (
        'Not Placed', 
        'Placed - General', 
        'Placed - Dream', 
        'Placed - Super Dream', 
        'Higher Studies'
      );
    `);

    // 5. Convert column back to ENUM using explicit cast
    console.log('Converting column back to ENUM...');
    // Note: If existing data doesn't match new ENUM values, this will fail.
    // Ensure data is compatible or clean it first if needed.
    // For now assuming 'Not Placed' and others match or are close.
    // If we had 'General' instead of 'Placed - General', we might need an intermediate UPDATE.

    // Safety: update old values to new values if they exist as strings
    await sequelize.query(`UPDATE "Students" SET "placedStatus" = 'Placed - General' WHERE "placedStatus" = 'General'`);
    await sequelize.query(`UPDATE "Students" SET "placedStatus" = 'Placed - Dream' WHERE "placedStatus" = 'Dream'`);
    await sequelize.query(`UPDATE "Students" SET "placedStatus" = 'Placed - Super Dream' WHERE "placedStatus" = 'Super Dream'`);

    await sequelize.query(`
      ALTER TABLE "Students" 
      ALTER COLUMN "placedStatus" TYPE "enum_Students_placedStatus" 
      USING "placedStatus"::"enum_Students_placedStatus";
    `);

    // 6. Restore default value
    console.log('Restoring default value...');
    await sequelize.query(`
      ALTER TABLE "Students" 
      ALTER COLUMN "placedStatus" SET DEFAULT 'Not Placed';
    `);

    console.log('Enum constraint fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing enum constraint:', error);
    process.exit(1);
  }
};

fixEnumConstraint();