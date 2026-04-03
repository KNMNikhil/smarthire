const { sequelize, Student } = require('./models');
const bcrypt = require('bcryptjs');

const resetPassword = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const email = '220701120@rajalakshmi.edu.in';
        const newPassword = 'Nikhil@2005';
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        const [updatedRows] = await Student.update(
            { password: hashedPassword },
            { where: { email: email } }
        );

        if (updatedRows > 0) {
            console.log(`Password for ${email} reset to ${newPassword}`);
        } else {
            console.log(`Student with email ${email} not found.`);
        }

    } catch (error) {
        console.error('Error resetting password:', error);
    } finally {
        await sequelize.close();
    }
};

resetPassword();
