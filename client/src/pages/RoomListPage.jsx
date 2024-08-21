import React from "react";

const rooms = [
      {
            id: 1,
            name: "Junior Suite",
            size: "260 sq ft",
            beds: "2 Double(s)",
            price: "$250",
            image: "junior-suite.jpg", // replace with actual image path
            icons: ["❄️", "📺", "💻", "📶", "🚿", "🍷", "🍽️", "📞", "🛏️", "🧹"],
      },
      {
            id: 2,
            name: "Standard Room",
            size: "230 sq ft",
            beds: "1 Double(s)",
            price: "$150",
            image: "standard-room.jpg", // replace with actual image path
            icons: ["❄️", "📺", "💻", "📶", "🚿", "🍷", "🍽️", "📞", "🛏️", "🧹"],
      },
      {
            id: 3,
            name: "Superior Room",
            size: "280 sq ft",
            beds: "1 King(s)",
            price: "$350",
            image: "superior-room.jpg", // replace with actual image path
            icons: ["❄️", "📺", "💻", "📶", "🚿", "🍷", "🍽️", "📞", "🛏️", "🧹"],
      },
];

function RoomListPage() {
      return (
        <div>
            <h1>Our Rooms</h1>
            <hr></hr>
            <div className="room-list">
                  <div className="search-bar">
                        <input type="date" placeholder="Check-In" />
                        <input type="date" placeholder="Check-Out" />
                        <select>
                              <option>1 Adults</option>
                              <option>2 Adults</option>
                        </select>
                        <select>
                              <option>0 Kids</option>
                              <option>1 Kid</option>
                        </select>
                        <button>Search</button>
                  </div>
                  {rooms.map((room) => (
                        <div className="room" key={room.id}>
                              <img src={room.image} alt={room.name} />
                              <div className="room-details">
                                    <h2>{room.name}</h2>
                                    <p>Size: {room.size}</p>
                                    <p>Beds: {room.beds}</p>
                                    <div className="room-icons">
                                          {room.icons.map((icon, index) => (
                                                <span key={index}>{icon}</span>
                                          ))}
                                    </div>
                              </div>
                              <div className="room-price">
                                    <p>From</p>
                                    <p>{room.price}</p>
                                    <button>More Info</button>
                              </div>
                        </div>
                  ))}
            </div>
            </div>
      );
}

export default RoomListPage;
