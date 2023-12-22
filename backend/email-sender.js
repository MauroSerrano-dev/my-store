import Error from 'next/error'
const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid')

const PRIMARY_COLOR = '#1189c4'

function getPurchaseEmailTemplate(language, orderId) {
  if (language === 'es') {
    return {
      subject: 'Confirmación de Compra',
      title: '¡Gracias por su compra!',
      track_link: `Puede <a href="${process.env.NEXT_PUBLIC_URL}/order-status?id=${orderId}">seguir su pedido aquí</a>.`,
      order_id: `Su ID de pedido es: ${orderId}`,
      not_reply: 'Este es un mensaje automatizado. Por favor, no responda a este correo electrónico.',
      contact_us: `Si tiene alguna pregunta, <a href="${process.env.NEXT_PUBLIC_URL}/contact">contáctenos</a>.`,
    }
  }
  if (language === 'pt-BR') {
    return {
      subject: 'Confirmação de Compra',
      title: 'Obrigado pela sua compra!',
      track_link: `Você pode <a href="${process.env.NEXT_PUBLIC_URL}/order-status?id=${orderId}">acompanhar seu pedido aqui</a>.`,
      order_id: `O ID do seu pedido é: ${orderId}`,
      not_reply: 'Esta é uma mensagem automática. Por favor, não responda a este e-mail.',
      contact_us: `Se tiver alguma dúvida, <a href="${process.env.NEXT_PUBLIC_URL}/contact">entre em contato</a>.`,
    }
  }
  if (language === 'pt') {
    return {
      subject: 'Confirmação de Compra',
      title: 'Obrigado pela sua compra!',
      track_link: `Pode <a href="${process.env.NEXT_PUBLIC_URL}/order-status?id=${orderId}">acompanhar o seu pedido aqui</a>.`,
      order_id: `O seu ID da encomenda é: ${orderId}`,
      not_reply: 'Esta é uma mensagem automática. Por favor, não responda a este e-mail.',
      contact_us: `Se tiver alguma questão, <a href="${process.env.NEXT_PUBLIC_URL}/contact">entre em contato connosco</a>.`,
    }
  }
  return {
    subject: 'Purchase Confirmation',
    title: 'Thank you for your purchase!',
    track_link: `You can <a href="${process.env.NEXT_PUBLIC_URL}/order-status?id=${orderId}">track your order here</a>.`,
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

    const template = getPurchaseEmailTemplate(user_language, orderId)

    // Email details
    const mailOptions = {
      from: process.env.ORDERS_EMAIL,
      to: customer_email,
      subject: template.subject,
      html: `<html>
      <head>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
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
          }
          .header {
            border-bottom: 2px solid ${PRIMARY_COLOR};
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .logo {
            margin-bottom: 20px;
          }
          h1 {
            color: ${PRIMARY_COLOR};
            margin-bottom: 10px;
          }
          p {
            margin-bottom: 8px;
          }
          a {
            color: ${PRIMARY_COLOR};
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
          <div class='header'>
            <a href=${process.env.NEXT_PUBLIC_URL} class="logo">
              <img src=${process.env.EMAIL_LOGO} alt="Logo" style='width: 150px'>
            </a>
          </div>
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
    console.log('Order Email Sent:', info.response)
    return { status: 'success', message: `Purchase confirmation email sent to ${customer_email} successfully!` }
  } catch (error) {
    throw new Error(`Error sending purchase confirmation email: ${error}`);
  }
}

function getSupportEmailTemplate(language, customer_problem_description, order_id) {
  if (language === 'es') {
    return {
      title: 'Confirmación de Recepción de su Solicitud de Soporte',
      awaiting_response: 'Nuestro equipo de soporte está analizando su solicitud y se pondrá en contacto con usted en un plazo de 72 horas.',
      problem_description: `Descripción del problema enviado: "${customer_problem_description}"`,
      signature: `Atentamente,<br>Equipo de Soporte ${process.env.STORE_FULL_NAME}`,
      order_info: `ID del pedido: ${order_id}`
    };
  }
  if (language === 'pt-BR') {
    return {
      title: 'Confirmação de Recebimento do seu Pedido de Suporte',
      awaiting_response: 'Nossa equipe de suporte está analisando sua solicitação e entrará em contato dentro de 72 horas.',
      problem_description: `Descrição do problema enviado: "${customer_problem_description}"`,
      signature: `Atenciosamente,<br>Equipe de Suporte ${process.env.STORE_FULL_NAME}`,
      order_info: `ID do pedido: ${order_id}`
    };
  }
  if (language === 'pt') {
    return {
      title: 'Confirmação de Receção do seu Pedido de Suporte',
      awaiting_response: 'A nossa equipa de suporte está a analisar a sua solicitação e entrará em contacto dentro de 72 horas.',
      problem_description: `Descrição do problema enviado: "${customer_problem_description}"`,
      signature: `Com os melhores cumprimentos,<br>Equipa de Suporte ${process.env.STORE_FULL_NAME}`,
      order_info: `ID da encomenda: ${order_id}`
    };
  }
  return {
    title: 'Confirmation of Your Support Request Receipt',
    awaiting_response: 'Our support team is reviewing your request and will get in touch with you within 72 hours.',
    problem_description: `Problem description submitted: "${customer_problem_description}"`,
    signature: `Regards,<br>${process.env.STORE_FULL_NAME} Support Team`,
    order_info: `Order ID: ${order_id}`
  };
}

function getSubject(subject, language, ticket_id, custom_subject) {
  let options = {
    order_problem: `Technical Assistance: Order Problem - Ticket ID: ${ticket_id} `,
    account_problem: `Technical Assistance: Account Problem - Ticket ID: ${ticket_id} `,
    other: `Technical Assistance: ${custom_subject} - Ticket ID: ${ticket_id} `,
  };

  if (language === 'es') {
    options = {
      order_problem: `Asistencia Técnica: Problema con un pedido - ID de Ticket: ${ticket_id} `,
      account_problem: `Asistencia Técnica: Problema con mi cuenta - ID de Ticket: ${ticket_id} `,
      other: `Asistencia Técnica: ${custom_subject} - ID de Ticket: ${ticket_id} `,
    };
  }

  if (language === 'pt-BR') {
    options = {
      order_problem: `Assistência Técnica: Problema com um pedido - ID do Ticket: ${ticket_id}`,
      account_problem: `Assistência Técnica: Problema com minha conta - ID do Ticket: ${ticket_id}`,
      other: `Assistência Técnica: ${custom_subject} - ID do Ticket: ${ticket_id}`,
    };
  }

  if (language === 'pt') {
    options = {
      order_problem: `Assistência Técnica: Problema com uma encomenda - ID do Bilhete: ${ticket_id}`,
      account_problem: `Assistência Técnica: Problema com a minha conta - ID do Bilhete: ${ticket_id}`,
      other: `Assistência Técnica: ${custom_subject} - ID do Bilhete: ${ticket_id}`,
    };
  }

  return options[subject];
}

/**
 * Sends a support email to the customer.
 * @param {string} customer_email - Customer email.
 * @param {string} customer_problem_description - User problem description.
 * @param {string} user_language - The language of the user.
 * @returns {object} Object indicating the status of the email sending process.
 */
async function sendSupportEmail(props) {
  const {
    customer_email,
    subject,
    customer_problem_description,
    user_language,
    custom_subject,
    order_id,
  } = props
  try {
    if (!customer_email)
      return { status: 'error', message: 'Error sending the support email, email not provided.' };
    if (!subject)
      return { status: 'error', message: 'Error sending the support email, subject not provided.' };
    if (!customer_problem_description)
      return { status: 'error', message: 'Error sending the support email, problem description not provided.' };

    const ticketId = uuidv4()

    // SMTP transport configuration
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_TRANSPORTER_HOST,
      port: process.env.EMAIL_TRANSPORTER_PORT,
      secure: true,
      auth: {
        user: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
        pass: process.env.SUPPORT_EMAIL_PASSWORD,
      },
    });

    const template = getSupportEmailTemplate(user_language, customer_problem_description, order_id);

    // Email details
    const mailOptions = {
      from: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
      to: customer_email,
      subject: getSubject(subject, user_language, ticketId, custom_subject),
      html: `<html>
      <head>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: left;
          }
          .header {
            border-bottom: 2px solid ${PRIMARY_COLOR};
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          h1 {
            color: ${PRIMARY_COLOR};
            font-size: 18px;
            margin-bottom: 10px;
          }
          p {
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 10px;
          }
          .signature {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            font-size: 14px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class='container'>
          <div class='header'>
            <a href=${process.env.NEXT_PUBLIC_URL} class="logo">
              <img src=${process.env.EMAIL_LOGO} alt="Logo" style='width: 150px'>
            </a>
          </div>
          <h1>${template.title}</h1>
          ${order_id ? `<p>${template.order_info}</p>` : ''}
          <p>${template.problem_description}</p>
          <p>${template.awaiting_response}</p>
          <div class='signature'>
            <p>${template.signature}</p>
          </div>
        </div>
      </body>
    </html>`,
    };

    // Sending the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Support Email Sent:', info.response);
    return { status: 'success', message: `Support email sent to ${customer_email} successfully!` };
  } catch (error) {
    throw new Error(`Error sending support email: ${error} `);
  }
}

export {
  sendSupportEmail,
  sendPurchaseConfirmationEmail,
}