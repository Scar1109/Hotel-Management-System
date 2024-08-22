import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import moment from "moment"; // Import moment library to work with dates
import roomimg from "../assets/Images/roomimg.jpg"; // Use default image if no image is provided


function RoomViewPage() {
  const { id } = useParams(); // Get the room ID from the URL
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(`/api/room/getRoom/${id}`);
        setRoom(response.data.room);
      } catch (error) {
        console.error('Error fetching room:', error);
      }
    };

    fetchRoom();
  }, [id]);

  // Calculate the partial refund date
  const fullRefundDate = moment().add(2, 'days').format("MMM Do YYYY");
  const partialRefundDate = moment().add(3, 'days').format("MMM Do YYYY");

  if (!room) return <p>Loading...</p>;

  return (
    <div className="room-details-page">
      <div className="room-image">
      <img src={room.imageUrl || roomimg} alt={room.roomType} /> 
      </div>
      <div className="room-info">
        <h1>{room.roomType} <span>{room.size} Person</span></h1>
        <ul className="room-description">
          <li>{room.facilities}</li>
          <li>{room.viewInformation || 'No view information available'}</li>
        </ul>
        <h3>Bed Type</h3>
        <p>{room.bedType || 'No bed type information available'}</p>

        <h3>Room Amenities</h3>
        <ul className="room-amenities">
          {(Array.isArray(room.amenities) ? room.amenities : []).map((amenity, index) => (
            <li key={index}>{amenity}</li>
          ))}
        </ul>

        <h3>Cancellation Rules</h3>
      <p className="cancellation-rules">
        Free cancellation until <strong>{fullRefundDate}</strong>. <br />
        After <strong>{partialRefundDate}</strong>: <span>50% refund.</span>
      </p>

        <div className="pricing">
          {(Array.isArray(room.pricing) ? room.pricing : []).map((option, index) => (
            <div className="pricing-option" key={index}>
              <p>{option.source || 'No source information available'}</p>
              <p className="price">
                {option.price || 'No price information available'} <span>/ {option.nights || 'No nights information available'}</span>
              </p>
            </div>
          ))}
          <div className="total-save">
            <p>Total Cost</p>
            <p>Rs: {room.price || 'No savings information available'}</p>
          </div>
          <button className="choose-button">Reserve</button>
        </div>
      </div>
    </div>
  );
}

export default RoomViewPage;
