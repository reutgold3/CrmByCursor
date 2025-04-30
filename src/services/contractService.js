const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');
const handlebars = require('handlebars');

class ContractService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async generateContract(templateName, data) {
    try {
      const templatePath = path.join(__dirname, `../templates/${templateName}.hbs`);
      const templateContent = await fs.readFile(templatePath, 'utf8');
      const template = handlebars.compile(templateContent);
      return template(data);
    } catch (error) {
      console.error('Error generating contract:', error);
      throw new Error('Failed to generate contract');
    }
  }

  async sendContract(email, subject, htmlContent, attachments = []) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject,
        html: htmlContent,
        attachments
      });
      return true;
    } catch (error) {
      console.error('Error sending contract:', error);
      throw new Error('Failed to send contract');
    }
  }

  async generateAndSendContract(templateName, data, email, subject) {
    const htmlContent = await this.generateContract(templateName, data);
    return this.sendContract(email, subject, htmlContent);
  }
}

module.exports = new ContractService(); 