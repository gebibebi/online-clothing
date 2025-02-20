import React, { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/orders`)
      .then(response => setOrders(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.order_id}>Order ID: {order.order_id} - Total: ${order.total_price}</li>
        ))}
      </ul>
    </div>
  );
}

export default Orders;
