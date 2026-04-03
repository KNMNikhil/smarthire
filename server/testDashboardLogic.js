const { Student, Company, Query, Registration, sequelize } = require('./models');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');

async function testDashboard() {
    try {
        await sequelize.authenticate();
        console.log('DB Connected');

        // Test 1: Count Students
        console.log('--- Test 1: Total Students ---');
        const totalStudents = await Student.count();
        console.log('Total Students:', totalStudents);

        // Test 2: Placed Students
        console.log('--- Test 2: Placed Students ---');
        const placedStudents = await Student.count({
            where: {
                placedStatus: {
                    [Op.in]: ['Placed - General', 'Placed - Dream', 'Placed - Super Dream']
                }
            }
        });
        console.log('Placed Students:', placedStudents);

        // Test 3: Average CGPA
        console.log('--- Test 3: AVG CGPA ---');
        const avgCgpaResult = await Student.findOne({
            attributes: [
                [Sequelize.fn('AVG', Sequelize.col('cgpa')), 'avgCgpa']
            ],
            where: { cgpa: { [Op.ne]: null } }
        });
        console.log('AVG Result:', avgCgpaResult?.dataValues);

        // Test 4: Active Companies
        console.log('--- Test 4: Active Companies ---');
        const activeCompanies = await Company.count({
            where: { status: 'Active' }
        });
        console.log('Active Companies:', activeCompanies);

        // Test 5: Pending Queries
        console.log('--- Test 5: Pending Queries ---');
        const pendingQueries = await Query.count({
            where: { status: 'Pending' }
        });
        console.log('Pending Queries:', pendingQueries);

        // Test 6: Arrears
        console.log('--- Test 6: Arrears ---');
        const studentsWithArrears = await Student.count({
            where: { arrears: { [Op.gt]: 0 } }
        });
        console.log('Students with Arrears:', studentsWithArrears);

        console.log('✅ ALL TESTS PASSED SUCCESSFULLY');

    } catch (error) {
        console.error('❌ CRASH DETECTED:', error);
        if (error.sql) {
            console.error('SQL:', error.sql);
        }
    } finally {
        await sequelize.close();
    }
}

testDashboard();
