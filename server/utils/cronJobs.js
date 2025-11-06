const cron = require('node-cron');
const { Company, Student, Registration } = require('../models');
const { sendBulkEmails } = require('./emailService');
const { Op } = require('sequelize');

const startReminderJobs = () => {
  // Run every hour to check for reminders
  cron.schedule('0 * * * *', async () => {
    console.log('Running reminder job...');
    
    try {
      const now = new Date();
      const twoDaysFromNow = new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000));
      const oneDayFromNow = new Date(now.getTime() + (24 * 60 * 60 * 1000));
      const oneHourFromNow = new Date(now.getTime() + (60 * 60 * 1000));

      // Get companies with upcoming visits
      const upcomingCompanies = await Company.findAll({
        where: {
          status: 'Active',
          visitDate: {
            [Op.between]: [now, twoDaysFromNow]
          }
        }
      });

      for (const company of upcomingCompanies) {
        const visitDate = new Date(company.visitDate);
        const timeDiff = visitDate.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const hoursDiff = Math.ceil(timeDiff / (1000 * 60 * 60));

        // Get registered students for this company
        const registrations = await Registration.findAll({
          where: {
            companyId: company.id,
            status: 'Registered'
          },
          include: [Student]
        });

        let reminderType = '';
        let subject = '';

        if (daysDiff === 2) {
          reminderType = '2 days';
          subject = `Reminder: ${company.name} drive in 2 days`;
        } else if (daysDiff === 1) {
          reminderType = '1 day';
          subject = `Reminder: ${company.name} drive tomorrow`;
        } else if (daysDiff === 0 && hoursDiff > 1) {
          reminderType = 'same day';
          subject = `Reminder: ${company.name} drive today`;
        } else if (hoursDiff === 1) {
          reminderType = '1 hour';
          subject = `Final Reminder: ${company.name} drive in 1 hour`;
        }

        if (reminderType && registrations.length > 0) {
          const emails = registrations.map(reg => ({
            to: reg.Student.email,
            subject,
            html: `
              <h2>Placement Drive Reminder</h2>
              <p>Dear ${reg.Student.name},</p>
              <p>This is a reminder for the upcoming placement drive:</p>
              <p><strong>Company:</strong> ${company.name}</p>
              <p><strong>Job Role:</strong> ${company.jobRole}</p>
              <p><strong>Visit Date:</strong> ${visitDate.toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${visitDate.toLocaleTimeString()}</p>
              <p>Please be prepared and arrive on time.</p>
              <p>Best of luck!</p>
            `
          }));

          await sendBulkEmails(emails);
          console.log(`Sent ${reminderType} reminders for ${company.name} to ${emails.length} students`);
        }
      }
    } catch (error) {
      console.error('Error in reminder job:', error);
    }
  });

  // Daily cleanup job at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily cleanup job...');
    
    try {
      // Move expired companies to completed status
      const expiredCompanies = await Company.findAll({
        where: {
          status: 'Active',
          registrationDeadline: {
            [Op.lt]: new Date()
          }
        }
      });

      for (const company of expiredCompanies) {
        await company.update({ status: 'Completed' });
        console.log(`Moved company ${company.name} to completed status`);
      }
    } catch (error) {
      console.error('Error in cleanup job:', error);
    }
  });

  console.log('Cron jobs started successfully');
};

module.exports = {
  startReminderJobs
};