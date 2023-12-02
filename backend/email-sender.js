const nodemailer = require('nodemailer')

/**
 * Sends a purchase confirmation email to the customer.
 * @param {string} customer_details - The infos of the customer.
 * @param {object} products - Products purchased.
 * @param {string} amount_details - Details of the purchase.
 * @returns {object} Object indicating the status of the email sending process.
 */
async function sendPurchaseConfirmationEmail(customer_details, products, amount_details) {
    try {
        if (!customer_details?.email)
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

        // Email details
        const mailOptions = {
            from: 'orders@mrfstyles.com',
            to: customer_details.email,
            subject: 'Purchase Confirmation',
            html: `<html>
            <head>
              <style>
                /* Estilos CSS */
                /* ... Adicione os estilos que desejar */
              </style>
            </head>
            <body>
              <p>Thank you for your purchase!</p>
              <h3>Order Details</h3>
              <table style="border-collapse: collapse; width: 100%;">
                <thead style="background-color: #f2f2f2;">
                  <tr>
                    <th style="border: 1px solid #ddd; padding: 8px;">Product Image</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Substitua os dados dos produtos aqui -->
                  ${products.map(product => `
                    <tr>
                      <td style="border: 1px solid #ddd; padding: 8px;">
                        <img src="${product.image.src}" alt="${product.title}" style="width: 50px; height: 50px;">
                      </td>
                      <td style="border: 1px solid #ddd; padding: 8px;">
                        <strong>${product.title}</strong>
                        <p>${product.description}</p> <!-- Include description here -->
                      </td>
                      <td style="border: 1px solid #ddd; padding: 8px;">${product.price}</td>
                      <td style="border: 1px solid #ddd; padding: 8px;">${product.quantity}</td>
                      <td style="border: 1px solid #ddd; padding: 8px;">${product.price * product.quantity}</td>
                    </tr>
                  `).join('')}
                  <!-- Fim dos dados dos produtos -->
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;">
                            Order Subtotal:
                        </td>
                        <td style="border: 1px solid #ddd; padding: 8px;">
                            ${amount_details.amount_subtotal}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;">
                            Shipping & Taxes:
                        </td>
                        <td style="border: 1px solid #ddd; padding: 8px;">
                            ${amount_details.amount_shipping}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;">
                            Order Total:
                        </td>
                        <td style="border: 1px solid #ddd; padding: 8px;">
                            ${amount_details.amount_total}
                        </td>
                    </tr>
                </tfoot>
              </table>
            </body>
          </html>`,
        };

        // Sending the email
        const info = await transporter.sendMail(mailOptions)
        console.log('Email sent:', info.response)
        return { status: 'success', message: `Purchase confirmation email sent to ${customer_details.email} successfully!` }
    } catch (error) {
        console.error('Error sending email:', error)
        return { status: 'error', message: 'Error sending the purchase confirmation email.' }
    }
}

export {
    sendPurchaseConfirmationEmail,
}