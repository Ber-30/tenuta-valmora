// Vercel Serverless Function - Crea transazione Stripe Test reale
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_51UcT3aDodjpmDiIwVz4Lvu0m1yprxZ4PNMDJBaoh0uzYP6E6bTDpPQ7DuA3liDdL12LpkIlSI51zWxHbXPsIDOau00P6EVephz';

  try {
    const { amount, description, customerEmail, customerName } = req.body;
    const amountCents = Math.round(parseFloat(amount || 35.90) * 100);

    const stripeParams = new URLSearchParams({
      amount: amountCents.toString(),
      currency: 'eur',
      description: `${description || 'Ordine Tenuta Valmora'} (${customerName || 'Cliente'} - ${customerEmail || ''})`,
      payment_method: 'pm_card_visa',
      confirm: 'true',
      return_url: 'https://tenuta-valmora.vercel.app/ordine-confermato.html',
      receipt_email: customerEmail || 'test@example.com'
    });

    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: stripeParams.toString()
    });

    const stripeData = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ success: false, error: stripeData.error });
    }

    return res.status(200).json({
      success: true,
      paymentIntentId: stripeData.id,
      status: stripeData.status,
      amount: stripeData.amount / 100
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
