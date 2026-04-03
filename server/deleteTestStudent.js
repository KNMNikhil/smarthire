const { sequelize, Student } = require('./models');

const deleteTestStudent = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const result = await Student.destroy({
            where: {
                email: 'nikhil@test.com'
            }
        });

        if (result > 0) {
            console.log('Test student (nikhil@test.com) deleted successfully.');
        } else {
            console.log('Test student not found.');
        }

    } catch (error) {
        console.error('Error deleting student:', error);
    } finally {
        await sequelize.close();
    }
};

deleteTestStudent();
