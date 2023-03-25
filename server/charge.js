const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cookie = require('cookie');

exports.handler = async (event, context) => {

  const name = event.body.split("name=")[1].split("&email=")[0].replaceAll('+', ' ');
  const email = decodeURIComponent(event.body.split("email=")[1].split("&stripeToken=")[0]);
  const stripeToken = event.body.split("stripeToken=")[1];
  const myCookie = cookie.serialize('emailHash', email);

  try {
    const token = stripeToken;

    const charge = await stripe.charges.create(
      {
        amount: 5,
        currency: "usd",
        description: "bobado - Become a member and get 6 free drinks",
        source: token,
      }
    );

    return {
      statusCode: 302,
      headers: {
        "Location": "https://accently.ai/thank-you-early-access",
        'Set-Cookie': myCookie
      },
      body: "Success",
    };

  } catch (err) {

    return {
      statusCode: 400,
      body: err,
    };

  }
};