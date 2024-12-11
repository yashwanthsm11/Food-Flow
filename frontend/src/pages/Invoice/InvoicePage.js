import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { trackOrderById } from '../../services/orderService';
import NotFound from '../../components/NotFound/NotFound';
import classes from './invoicePage.module.css';
import DateTime from '../../components/DateTime/DateTime';
import Title from '../../components/Title/Title';

export default function InvoicePage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState();
  const [addressText, setAddressText] = useState('Loading address...');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch order details
    if (orderId) {
      trackOrderById(orderId).then(order => {
        setOrder(order);
        if (order.addressLatLng) {
          // Convert latitude and longitude to text address
          fetchAddress(order.addressLatLng);
        }
      });
    }
  }, [orderId]);

  // Function to fetch address from latitude and longitude
  const fetchAddress = async ({ lat, lng }) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=enter your opencage geocoding api key here`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setAddressText(data.results[0].formatted); // Set the formatted address
      } else {
        setAddressText('Unable to fetch address');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddressText('Error fetching address');
    }
  };

  const handlePrint = () => {
    if (!order) return;

    const orderDetails = order.items
      .map(
        item => `
        <p>${item.food.name} = ${item.quantity} -   ${item.price}</p>
      `
      )
      .join('');

    const totalAmount = order.items.reduce(
      (total, item) => total + item.price, 0
    );

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              line-height: 1.6;
            }
            .container {
              max-width: 100%;
            }
            .invoiceHeader {
              border-bottom: 1px solid #ddd;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="invoiceHeader">
              <h1>Invoice</h1>
              <div class="orderInfo">
                <h2>Order #${order.id}</h2>
                <p><strong>Date:</strong> <span>${new Date(order.createdAt).toLocaleDateString()}</span></p>
                <p><strong>Name:</strong> ${order.name}</p>
                <p><strong>Address:</strong> ${order.address}</p>
                <p><strong>Payment Status:</strong> PAID</p>
                ${
                  order.paymentId
                    ? `<p><strong>Payment ID:</strong> ${order.paymentId}</p>`
                    : ''
                }
              </div>
            </div>
            <h2>Order Details</h2>
            <div>${orderDetails}</div>
            <h3><strong>Total Amount: ${totalAmount}</strong></h3>
            <h2>Your Location</h2>
            <p>${addressText}</p>
            <div class="footer">
              <p>Thank you for your purchase!</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const navigateToOrders = () => {
    navigate('/orders'); // Navigate to the orders page
  };

  if (!orderId)
    return <NotFound message="Order Not Found" linkText="Go To Home Page" />;

  if (!order)
    return <div>Loading...</div>; // Add a loading state for better user experience

  // Calculate total amount (add only the item.price)
  const totalAmount = order?.items.reduce(
    (total, item) => total + item.price, 0
  );

  return (
    order && (
      <div className={classes.container}>
        <div className={classes.invoiceHeader}>
          <h1>Invoice</h1>
          <div className={classes.orderInfo}>
            <h2>Order #{order.id}</h2>
            <p><strong>Date:</strong> <DateTime date={order.createdAt} /></p>
            <p><strong>Name:</strong> {order.name}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>Payment Status:</strong> PAID</p>
            {order.paymentId && (
              <p><strong>Payment ID:</strong> {order.paymentId}</p>
            )}
          </div>
        </div>

        <Title title="Order Details" fontSize="1.4rem" />
        {order.items.map(item => (
          <p key={item.food.id}>
            {item.food.name} = {item.quantity}  -  {item.price}
          </p>
        ))}

        <h3><strong>Total Amount: {totalAmount}</strong></h3>

        <div className={classes.mapSection}>
          <Title title="Delivery Location" fontSize="1.6rem" />
          <p>{addressText}</p>
        </div>

        <div className={classes.footer}>
          <p>Thank you for your purchase!</p>
        </div>

        <div className={classes.buttonContainer}>
          <button onClick={handlePrint} className={classes.printButton}>
            Print Invoice
          </button>
          <button onClick={navigateToOrders} className={classes.navigateButton}>
            Go to Orders
          </button>
        </div>
      </div>
    )
  );
}




