import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import Course from '../models/Course.js';
import User from '../models/user.js';

export const generateCertificate = async (req, res) => {
  console.log("Certificate generation request received:", req.params);
  try {
    const { studentId, courseId } = req.params;

    // Fetch student and course details from your database
    const student = await User.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) {
      return res.status(404).json({ message: 'Student or Course not found.' });
    }

    const studentName = student.username;
    const courseTitle = course.title;
    const completionDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Read the HTML template
    const templatePath = path.join(process.cwd(), 'templates', 'certificate.html');
    let htmlContent = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholders with actual data
    htmlContent = htmlContent.replace(/{{studentName}}/g, studentName);
    htmlContent = htmlContent.replace(/{{courseTitle}}/g, courseTitle);
    htmlContent = htmlContent.replace(/{{completionDate}}/g, completionDate);

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${studentName.replace(/ /g, '_')}-${courseTitle.replace(/ /g, '_')}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ message: 'Error generating certificate.' });
  }
};
