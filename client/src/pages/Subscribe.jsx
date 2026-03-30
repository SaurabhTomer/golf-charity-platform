import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder, verifyPayment } from '../services/subscriptionService.js';
import Navbar from '../components/common/Navbar.jsx';

const PLANS = [
  { id: 'monthly', label: 'Monthly', price: '₹499 / month',  description: 'Billed every month' },
  { id: 'yearly',  label: 'Yearly',  price: '₹3,999 / year', description: 'Save ₹2,000 annually' }
];

const Subscribe = () => {
  const navigate                    = useNavigate();
  const [selected, setSelected]     = useState('monthly');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  const handleSubscribe = async () => {
    setError('');
    setLoading(true);

    try {
      // Create Razorpay order
      const orderRes = await createOrder(selected);
      const { order_id, amount, currency, key_id } = orderRes.data;

      // Open Razorpay checkout
      const options = {
        key:      key_id,
        amount,
        currency,
        name:     'GolfCharity',
        description: `${selected} subscription`,
        order_id,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              plan:                selected
            });
            navigate('/dashboard');
          } catch (err) {
            setError('Payment verification failed');
          }
        },
        prefill: { name: '', email: '' },
        theme:   { color: '#000000' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Load Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

      <Navbar />
      <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 16px' }}>
        <h2>Choose Your Plan</h2>
        <p style={{ color: 'gray' }}>Subscribe to enter monthly draws and support your chosen charity.</p>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '16px', margin: '32px 0' }}>
          {PLANS.map(plan => (
            <div
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              style={{
                flex:         1,
                border:       selected === plan.id ? '2px solid #000' : '1px solid #ddd',
                borderRadius: '8px',
                padding:      '24px',
                cursor:       'pointer',
                background:   selected === plan.id ? '#f9f9f9' : '#fff'
              }}
            >
              <h3 style={{ margin: '0 0 8px' }}>{plan.label}</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px' }}>{plan.price}</p>
              <p style={{ color: 'gray', margin: 0, fontSize: '14px' }}>{plan.description}</p>
              {selected === plan.id && (
                <p style={{ color: 'green', marginTop: '8px', fontWeight: 'bold' }}>✓ Selected</p>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          style={{
            width: '100%', padding: '14px',
            background: '#000', color: '#fff',
            border: 'none', borderRadius: '8px',
            fontSize: '16px', cursor: 'pointer'
          }}
        >
          {loading ? 'Processing...' : `Subscribe — ${selected === 'monthly' ? '₹499' : '₹3,999'}`}
        </button>
      </div>
    </>
  );
};

export default Subscribe;