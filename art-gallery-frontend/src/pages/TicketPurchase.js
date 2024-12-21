// frontend/src/pages/TicketPurchase.js
import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

const TicketPurchase = () => {
  const { exhibitionId } = useParams();
  const [amount, setAmount] = useState(1);
  const [paymentId, setPaymentId] = useState("");
  const [paymentMode, setPaymentMode] = useState("credit_card");
  const user = JSON.parse(localStorage.getItem("user"));

  const handlePurchase = async () => {
    const response = await axios.post("http://localhost:5000/api/tickets", {
      exhibition_id: exhibitionId,
      user_id: user.id,
      amount: amount,
      payment_id: paymentId,
      payment_mode: paymentMode,
      payment_status: "pending",
    });
    if (response.data.success) {
      alert("Ticket purchased successfully");
    } else {
      alert("Failed to purchase ticket");
    }
  };

  return (
    <div>
      <h1>Purchase Ticket</h1>
      <Form>
        <Form.Group controlId="amount">
          <Form.Label>Amount of Tickets</Form.Label>
          <Form.Control
            type="number"
            placeholder="Amount of Tickets"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="paymentId">
          <Form.Label>Payment ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Payment ID"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="paymentMode">
          <Form.Label>Payment Mode</Form.Label>
          <Form.Control
            as="select"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
          >
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="paypal">PayPal</option>
          </Form.Control>
        </Form.Group>
        <Button variant="primary" onClick={handlePurchase}>
          Purchase Ticket
        </Button>
      </Form>
    </div>
  );
};

export default TicketPurchase;
