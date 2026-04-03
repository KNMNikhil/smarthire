const { sequelize, Student } = require('./models');

const listStudents = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const students = await Student.findAll({
            attributes: ['id', 'name', 'email', 'department']
        });

        console.log('\n--- Existing Students ---');
        students.forEach(s => {
            console.log(`ID: ${s.id}, Name: ${s.name}, Email: ${s.email}, Dept: ${s.department}`);
        });
        console.log('-------------------------\n');

    } catch (error) {
        console.error('Error listing students:', error);
    } finally {
        await sequelize.close();
    }
};

listStudents();
