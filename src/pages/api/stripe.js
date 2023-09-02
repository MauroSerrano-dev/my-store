const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {

    const customer = await stripe.customers.create({
      metadata: {
        userId: req.body.userId,
        cart: JSON.stringify(req.body.cartItems),
      },
    })
    
    const line_items = req.body.cartItems.map((item) => {

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            images: [item.image],
            description: item.desc,
            metadata: {
              id: item.id,
            },
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      }
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "KE", "PT", "BR", "GB"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            display_name: "Free shipping",
            // Delivers between 5-7 business days
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "usd",
            },
            display_name: "Next day air",
            // Delivers in exactly 1 business day
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      line_items,
      mode: "payment",
      customer: customer.id,
      success_url: `http://localhost:3000/checkout-success`,
      cancel_url: `http://localhost:3000/cart`,
    });

    // res.redirect(303, session.url);
    res.send({ url: session.url });
  }
}

const createOrder = async (customer, data) => {
  const Items = JSON.parse(customer.metadata.cart);

  const products = Items.map((item) => {
    return {
      productId: item.id,
      quantity: item.cartQuantity,
    }
  })

  const newOrder = new Order({
    userId: customer.metadata.userId,
    customerId: data.customer,
    paymentIntentId: data.payment_intent,
    products,
    subtotal: data.amount_subtotal,
    total: data.amount_total,
    shipping: data.customer_details,
    payment_status: data.payment_status,
  })

  try {
    const savedOrder = await newOrder.save();
    console.log("Processed Order:", savedOrder);
  } catch (err) {
    console.log(err);
  }
}