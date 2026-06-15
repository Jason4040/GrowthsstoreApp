import nodemailer from "nodemailer";

const testSend = async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "jaygrowth01@gmail.com",
        pass: "spcw gaxj pvyq dpuz",
      },
    });

    const info = await transporter.sendMail({
      from: '"Growth Shop Test" <jaygrowth01@gmail.com>',
      to: "jaygrowth01@gmail.com",
      subject: "Test Email from Backend",
      text: "This is a test to verify if email sending actually works.",
    });

    console.log("Email sent successfully: %s", info.messageId);
    process.exit(0);
  } catch (err) {
    console.error("Failed to send email:", err);
    process.exit(1);
  }
};

testSend();
