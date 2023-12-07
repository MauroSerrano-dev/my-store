const nodemailer = require('nodemailer')

function getEmailTemplate(language, orderId) {
  if (language === 'es') {
    return {
      subject: 'Confirmación de Compra',
      title: '¡Gracias por su compra!',
      track_link: `Puede <a href="${process.env.NEXT_PUBLIC_URL}/track-order/${orderId}">seguir su pedido aquí</a>.`,
      order_id: `Su ID de pedido es: ${orderId}`,
      not_reply: 'Este es un mensaje automatizado. Por favor, no responda a este correo electrónico.',
      contact_us: `Si tiene alguna pregunta, <a href="${process.env.NEXT_PUBLIC_URL}/contact">contáctenos</a>.`,
    }
  }
  if (language === 'pt-BR') {
    return {
      subject: 'Confirmação de Compra',
      title: 'Obrigado pela sua compra!',
      track_link: `Você pode <a href="${process.env.NEXT_PUBLIC_URL}/track-order/${orderId}">acompanhar seu pedido aqui</a>.`,
      order_id: `O ID do seu pedido é: ${orderId}`,
      not_reply: 'Esta é uma mensagem automática. Por favor, não responda a este e-mail.',
      contact_us: `Se tiver alguma dúvida, <a href="${process.env.NEXT_PUBLIC_URL}/contact">entre em contato</a>.`,
    }
  }
  if (language === 'pt') {
    return {
      subject: 'Confirmação de Compra',
      title: 'Obrigado pela sua compra!',
      track_link: `Pode <a href="${process.env.NEXT_PUBLIC_URL}/track-order/${orderId}">acompanhar o seu pedido aqui</a>.`,
      order_id: `O seu ID de pedido é: ${orderId}`,
      not_reply: 'Esta é uma mensagem automática. Por favor, não responda a este e-mail.',
      contact_us: `Se tiver alguma questão, <a href="${process.env.NEXT_PUBLIC_URL}/contact">entre em contato connosco</a>.`,
    }
  }
  return {
    subject: 'Purchase Confirmation',
    title: 'Thank you for your purchase!',
    track_link: `You can <a href="${process.env.NEXT_PUBLIC_URL}/track-order/${orderId}">track your order here</a>.`,
    order_id: `Your order ID is: ${orderId}`,
    not_reply: 'This is an automated message. Please do not reply to this email.',
    contact_us: `If you have any questions, <a href="${process.env.NEXT_PUBLIC_URL}/contact">contact us</a>.`,
  }
}

/**
 * Sends a purchase confirmation email to the customer.
 * @param {string} customer_email - Customer email.
 * @param {string} orderId - The order ID.
 * @returns {object} Object indicating the status of the email sending process.
 */
async function sendPurchaseConfirmationEmail(customer_email, orderId, user_language) {

  try {
    if (!customer_email)
      return { status: 'error', message: 'Error sending the purchase email, email not provided.' }

    // SMTP transport configuration
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_TRANSPORTER_HOST,
      port: process.env.EMAIL_TRANSPORTER_PORT,
      secure: true,
      auth: {
        user: process.env.ORDERS_EMAIL,
        pass: process.env.ORDERS_EMAIL_PASSWORD,
      },
    });

    const template = getEmailTemplate(user_language, orderId)

    // Email details
    const mailOptions = {
      from: process.env.ORDERS_EMAIL,
      to: customer_email,
      subject: template.subject,
      html: `<html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 80%;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          .logo {
            margin-bottom: 20px;
          }
          h1 {
            color: #1189c4;
            margin-bottom: 10px;
          }
          p {
            margin-bottom: 8px;
          }
          a {
            color: #1189c4;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .footer {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            text-align: left;
          }
        </style>
      </head>
      <body>
        <div class='container'>
          <a href=${process.env.NEXT_PUBLIC_URL} class="logo">
            <img src="https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/logo_email.png?alt=media&token=4c96e37c-5ad8-4ccf-9cfa-bf650ee8e1d4" alt="Logo" style='width: 200px'>
          </a>
          <h1>${template.title}</h1>
          <p>${template.track_link}</p>
          <p>${template.order_id}</p>
          <div class='footer'>
            <p>${template.not_reply}</p>
            <p>${template.contact_us}</p>
          </div>
        </div>
      </body>
    </html>`,
    };

    // Sending the email
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.response)
    return { status: 'success', message: `Purchase confirmation email sent to ${customer_email} successfully!` }
  } catch (error) {
    throw new Error(`Error sending purchase confirmation email: ${error}`);
  }
}

export {
  sendPurchaseConfirmationEmail,
}