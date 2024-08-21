import React from "react";
import roomimg from "../assets/Images/roomimg.jpg";

const RoomViewPage = () => {
    return (
        <div className="room-details-page">
            <div className="room-image">
                <img src={roomimg} alt="Suite Room" /> 
            </div>
            <div className="room-info">
                <h1>Suite <span>45 m<sup>2</sup></span></h1>
                <ul className="room-description">
                    <li>1 queen size bed, private kitchen, bathroom, and living spaces.</li>
                    <li>Includes light breakfast, coffee, or tea with rolls and jam.</li>
                    <li>Sea View</li>
                    <li>Sunlight in the mornings</li>
                </ul>
                <h3>Bed Type</h3>
                <p>Queen Size Bed, comfy for 2 people</p>

                <h3>Room Amenities</h3>
                <ul className="room-amenities">
                    <li>🚿 Shower</li>
                    <li>💼 Safe</li>
                    <li>🧳 Luggage</li>
                    <li>🌐 24/7 Service</li>
                    <li>🚪 Concierge</li>
                </ul>

                <h3>Cancellation Rules</h3>
                <p className="cancellation-rules">Free cancellation until <strong>22 July</strong>. <br />
                   After <strong>26 July</strong>: <span>50% refund.</span></p>

                <div className="pricing">
                    <div className="pricing-option">
                        <p>Booking.com</p>
                        <p className="price">USD 964 <span>/ 3 Nights</span></p>
                    </div>
                    <div className="pricing-option">
                        <p>HotelStore</p>
                        <p className="price">USD 872 <span>/ 3 Nights</span></p>
                    </div>
                    <div className="total-save">
                        <p>Total Savings</p>
                        <p>USD 92</p>
                    </div>
                    <button className="choose-button">Choose</button>
                    <button className="wishlist-button">Save to Wishlist</button>
                </div>
            </div>
        </div>
    );
};

export default RoomViewPage;
