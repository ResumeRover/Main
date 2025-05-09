require("dotenv").config();
const { MongoClient } = require("mongodb");
const nodemailer = require("nodemailer");

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

async function sendEmails() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("parsed_resumes");

    const unnotifiedApplicants = await collection.find({ notified: false }).toArray();
    console.log(`Found ${unnotifiedApplicants.length} unnotified applicants.`);

    for (const applicant of unnotifiedApplicants) {
      const { email, name, status } = applicant;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      let subject = "";
      let htmlBody = "";
      const logoUrl = "https://cse.mrt.ac.lk/assets/logo/cse_logo.png";

      if (status === "accepted") {
        subject = "🎉 You're Shortlisted!";
        htmlBody = `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <img src="${logoUrl}" alt="Resume Rover Logo" style="width: 120px; margin-bottom: 20px;" />
            <h2>Hello ${name},</h2>
            <p>🎉 Congratulations! Your resume has been <strong>shortlisted</strong> for the next phase of our hiring process.</p>
            <p>We will contact you shortly with the next steps.</p>
            <p style="margin-top: 20px;">Best regards,<br><strong>Resume Rover Team</strong></p>
          </div>
        `;
      } else if (status === "rejected") {
        subject = "Regarding Your Resume Submission";
        htmlBody = `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <img src="${logoUrl}" alt="Resume Rover Logo" style="width: 120px; margin-bottom: 20px;" />
            <h2>Hello ${name},</h2>
            <p>Thank you for submitting your resume.</p>
            <p>After careful review, we regret to inform you that you were not selected at this time.</p>
            <p>We appreciate your interest and encourage you to apply again in the future.</p>
            <p style="margin-top: 20px;">Best wishes,<br><strong>Resume Rover Team</strong></p>
          </div>
        `;
      } else if (status === "in progress" || status === "saved") {
        subject = "Resume Status: Under Review";
        htmlBody = `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <img src="${logoUrl}" alt="Resume Rover Logo" style="width: 120px; margin-bottom: 20px;" />
            <h2>Hello ${name},</h2>
            <p>Your resume is currently under review by our recruitment team.</p>
            <p>We will notify you once the evaluation is complete.</p>
            <p style="margin-top: 20px;">Thanks for your patience!<br><strong>Resume Rover Team</strong></p>
          </div>
        `;
      } else {
        subject = "Resume Update";
        htmlBody = `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <img src="${logoUrl}" alt="Resume Rover Logo" style="width: 120px; margin-bottom: 20px;" />
            <h2>Hello ${name},</h2>
            <p>This is an update on your resume status: <strong>${status}</strong>.</p>
            <p>We will keep you informed about further progress.</p>
            <p style="margin-top: 20px;">Regards,<br><strong>Resume Rover Team</strong></p>
          </div>
        `;
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: htmlBody,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${email}`);

        await collection.updateOne(
          { _id: applicant._id },
          { $set: { notified: true } }
        );
      } catch (emailError) {
        console.error(`❌ Failed to email ${email}:`, emailError.message);
      }
    }
  } catch (err) {
    console.error("MongoDB Error:", err);
  } finally {
    await client.close();
  }
}

sendEmails();
