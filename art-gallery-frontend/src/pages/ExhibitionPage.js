// frontend/src/pages/ExhibitionPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ExhibitionPage = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [selectedExhibition, setSelectedExhibition] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/exhibitions"
        );
        setExhibitions(response.data.exhibitions);
      } catch (error) {
        console.error("Failed to fetch exhibitions:", error);
      }
    };
    fetchExhibitions();
  }, []);

  const handleExhibitionClick = (exhibition) => {
    setSelectedExhibition(exhibition);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleBuyTicket = (exhibitionId) => {
    navigate(`/tickets/${exhibitionId}`);
  };

  return (
    <div>
      <h1>Exhibitions</h1>
      <div className="exhibition-list">
        {exhibitions.map((exhibition) => (
          <div
            key={exhibition.id}
            className="exhibition-item"
            onClick={() => handleExhibitionClick(exhibition)}
          >
            <h2>{exhibition.name}</h2>
            <p>Start Date: {exhibition.start_date}</p>
            <p>End Date: {exhibition.end_date}</p>
            <p>Location: {exhibition.location}</p>
            <Button
              variant="primary"
              onClick={() => handleBuyTicket(exhibition.id)}
            >
              Buy Ticket
            </Button>
          </div>
        ))}
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedExhibition?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Start Date: {selectedExhibition?.start_date}</p>
          <p>End Date: {selectedExhibition?.end_date}</p>
          <p>Location: {selectedExhibition?.location}</p>
          <p>Description: {selectedExhibition?.description}</p>
          {/* Add more details as needed */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => handleBuyTicket(selectedExhibition?.id)}
          >
            Buy Ticket
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ExhibitionPage;
