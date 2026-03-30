import crypto from 'crypto';
import razorpay from '../config/razorpay.js';
import supabase from '../config/supabase.js';

// Plan prices in paise (INR) — 100 paise = ₹1
const PLANS = {
  monthly: { amount: 49900, period: 'monthly' },  // ₹499
  yearly:  { amount: 399900, period: 'yearly' }   // ₹3999
};

// POST /api/subscriptions/create-order
export const createOrder = async (req, res) => {
  const { plan } = req.body;

  if (!PLANS[plan]) {
    return res.status(400).json({ message: 'Invalid plan' });
  }

  try {
    const order = await razorpay.orders.create({
      amount:   PLANS[plan].amount,
      currency: 'INR',
      receipt:  `receipt_${req.userId}_${Date.now()}`,
      notes: {
        user_id: req.userId,
        plan
      }
    });

    res.json({
      order_id:  order.id,
      amount:    order.amount,
      currency:  order.currency,
      key_id:    process.env.RAZORPAY_KEY_ID,
      plan
    });

  } catch (err) {
    res.status(500).json({ message: 'Could not create order' });
  }
};

// POST /api/subscriptions/verify-payment
export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

  try {
    // Verify signature
    const body      = razorpay_order_id + '|' + razorpay_payment_id;
    const expected  = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Calculate renewal date
    const renewalDate = new Date();
    if (plan === 'monthly') {
      renewalDate.setMonth(renewalDate.getMonth() + 1);
    } else {
      renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    }

    // Check if subscription already exists
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', req.userId)
      .single();

    if (existing) {
      // Update existing subscription
      await supabase
        .from('subscriptions')
        .update({
          plan,
          status:       'active',
          renewal_date: renewalDate,
          razorpay_payment_id,
          razorpay_order_id
        })
        .eq('user_id', req.userId);
    } else {
      // Create new subscription
      await supabase
        .from('subscriptions')
        .insert({
          user_id:             req.userId,
          plan,
          status:              'active',
          renewal_date:        renewalDate,
          razorpay_payment_id,
          razorpay_order_id
        });
    }

    res.json({ message: 'Payment verified, subscription activated' });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/subscriptions/status
export const getSubscriptionStatus = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', req.userId)
      .single();

    if (error || !data) {
      return res.json({ subscribed: false });
    }

    res.json({
      subscribed:   data.status === 'active',
      plan:         data.plan,
      status:       data.status,
      renewal_date: data.renewal_date
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/subscriptions/cancel
export const cancelSubscription = async (req, res) => {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('user_id', req.userId);

    if (error) return res.status(400).json({ message: error.message });

    res.json({ message: 'Subscription cancelled' });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};