export const welcomeEmail = (userName) => {
  const emailString = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Our Platform</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          text-align: center;
        }
    
        .container {
          max-width: 600px;
          margin: 50px auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
    
        h1 {
          color: #3498db;
        }
    
        p {
          color: #333333;
        }
    
        a {
          color: #e74c3c;
          text-decoration: none;
          font-weight: bold;
        }
    
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to Our Platform!</h1>
        <p>Dear ${userName},</p>
        <p>Thank you for signing up and becoming a part of our ${process.env.SITE_TITLE} community. We're excited to have you on board!</p>
        <p>Feel free to explore the features and services we offer. If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
        <p>Once again, welcome, and we hope you have a fantastic experience!</p>
        <p>Best regards,<br>Your Platform Name Team</p>
        <p>If you haven't signed up yet, you can <a href="${process.env.FRONTEND_BASE_URL}/sign-up">Create an account here</a>.</p>
      </div>
    </body>
    </html>
    `
  return emailString
}
