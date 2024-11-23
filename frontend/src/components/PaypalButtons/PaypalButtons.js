// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { useCart } from '../../hooks/useCart';
// import { useLoading } from '../../hooks/useLoading';
// import { pay } from '../../services/orderService';

// export default function FakePayment() {
//   const { clearCart } = useCart();
//   const navigate = useNavigate();
//   const { showLoading, hideLoading } = useLoading();
//   const [amount, setAmount] = useState('');
//   const [currency, setCurrency] = useState('INR');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     setIsLoading(true);
//     showLoading();

//     try {
//       // Simulate a delay as if processing the payment
//       await new Promise((resolve) => setTimeout(resolve, 1000));
      
//       // Fake payment ID
//       const fakePaymentId = 'fake-payment-id-12345';
      
//       // Simulate saving the payment
//       await pay(fakePaymentId);

//       clearCart();
//       toast.success('Payment Saved Successfully', 'Success');
//       navigate('/track/fake-order-id');
//     } catch (error) {
//       toast.error('Payment Save Failed', 'Error');
//     } finally {
//       setIsLoading(false);
//       hideLoading();
//     }
//   };

//   return (
//     <div>
//       <h2>Fake Payment Simulation</h2>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Amount:
//           <input
//             type="text"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             required
//           />
//         </label>
//         <br />
//         <label>
//           Currency:
//           <select
//             value={currency}
//             onChange={(e) => setCurrency(e.target.value)}
//             required
//           >
//             <option value="INR">INR</option>
//             <option value="USD">USD</option>
//             {/* Add more currencies as needed */}
//           </select>
//         </label>
//         <br />
//         <button type="submit" disabled={isLoading}>
//           {isLoading ? 'Processing…' : 'Pay'}
//         </button>
//       </form>
//     </div>
//   );
// }
