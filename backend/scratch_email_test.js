import nodemailer from "nodemailer";

const testEmail = async () => {
  try {
    console.log("Testing SMTP connection for jaygrowth01@gmail.com...");
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "jaygrowth01@gmail.com",
        pass: "spcw gaxj pvyq dpuz",
      },
      // Adding debug options
      logger: true,
      debug: true
    });

    await transporter.verify();
    console.log("Email SMTP Authentication successful!");
    process.exit(0);
  } catch (err) {
    console.error("Email SMTP Error:", err);
    process.exit(1);
  }
};

testEmail();
