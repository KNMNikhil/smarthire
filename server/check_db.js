const { sequelize, Student, Admin, Company } = require('./models');

const checkCounts = async () => {
    try {
        await sequelize.authenticate();
        const students = await Student.count();
        const admins = await Admin.count();
        const companies = await Company.count();

        console.log(`Students: ${students}`);
        console.log(`Admins: ${admins}`);
        console.log(`Companies: ${companies}`);
    } catch (error) {
        console.error('DB Error:', error);
    } finally {
        await sequelize.close();
    }
};

checkCounts();
