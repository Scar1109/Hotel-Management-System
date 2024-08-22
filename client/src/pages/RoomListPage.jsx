import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RoomListPage() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('/api/room/getRooms');
        setRooms(response.data.rooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  const handleMoreInfo = (id) => {
    navigate(`/rooms/${id}`);
  };

  return (
    <div>
      <h1>Our Rooms</h1>
      <hr />
      <div className="room-list">
        <div className="search-bar">
          <input type="date" placeholder="Check-In" />
          <input type="date" placeholder="Check-Out" />
          <select>
            <option>1 Adult</option>
            <option>2 Adults</option>
          </select>
          <select>
            <option>0 Kids</option>
            <option>1 Kid</option>
          </select>
          <button>Search</button>
        </div>
        {rooms
          .filter((room) => room.status === 'Activate') // Filter rooms by status
          .map((room) => (
            <div className="room" key={room._id}>
              <img src={room.imageUrl} alt={room.roomType} />
              <div className="room-details">
                <h2>{room.roomType}</h2>
                <p>Size: {room.size} Person</p>
                <p>Beds: {room.bedType}</p>
                <div className="room-icons">
                  {(Array.isArray(room.facilities) ? room.facilities : []).map((icon, index) => (
                    <span key={index}>{icon}</span>
                  ))}
                </div>
              </div>
              <div className="room-price">
                <p>From</p>
                <p>Rs: {room.price}</p>
                <button onClick={() => handleMoreInfo(room._id)}>More Info</button>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
}

export default RoomListPage;
