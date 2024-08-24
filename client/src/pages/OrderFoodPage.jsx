import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import MealImg1 from '../assets/Images/meal1.png';
import MealImg2 from '../assets/Images/meal2.jpeg';

// Image mapping based on meal names or IDs
const mealImages = {
  'Meal 1': MealImg1,
  'Meal 2': MealImg2,
  // Add more mappings as needed
};

function MealOrderPage() {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerID, setCustomerID] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get('/api/catering/getItems');
        const mealsData = response.data || [];
        setMeals(mealsData);
        setFilteredMeals(mealsData);
      } catch (error) {
        console.error('Error fetching meals:', error);
        setMeals([]);
        setFilteredMeals([]);
      }
    };

    fetchMeals();
  }, []);

  const handleFilter = (filter) => {
    const filtered = meals.filter(meal => meal.type === filter);
    setFilteredMeals(filtered);
  };

  const handleSelectMeal = (meal) => {
    setSelectedMeals([...selectedMeals, meal]);
    setTotalAmount(totalAmount + meal.price);
  };

  const handleRemoveMeal = (index) => {
    const updatedMeals = [...selectedMeals];
    const removedMeal = updatedMeals.splice(index, 1)[0];
    setSelectedMeals(updatedMeals);
    setTotalAmount(totalAmount - removedMeal.price);
  };

  const handlePlaceOrder = async () => {
    if (!customerName || !customerID || !roomNumber || selectedMeals.length === 0) {
      alert('Please fill in all details, including room number, and select at least one meal.');
      return;
    }

    const orderData = {
      purchaseDate: new Date().toLocaleDateString(),
      customerName,
      customerID,
      roomNumber,
      amount: totalAmount,
      meals: selectedMeals.map(meal => meal.name),
    };

    try {
      const response = await axios.post('/api/order/addOrder', orderData);
      alert('Order placed successfully!');
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="order-container">
      <h1>Order Your Meal for Room</h1>
      <hr />
      <div className="filter-bar">
        <button onClick={() => handleFilter('Vegetarian')}>Vegetarian</button>
        <button onClick={() => handleFilter('Non-Vegetarian')}>Non-Vegetarian</button>
        <button onClick={() => setFilteredMeals(meals)}>All</button>
      </div>
      <div className="meal-list">
        {filteredMeals.map((meal, index) => (
          <div className="meal-card" key={index}>
            <img src={mealImages[meal.name] || MealImg1} alt={meal.name} className="meal-image" />
            <div className="meal-details">
              <h2>{meal.name}</h2>
              <p>{meal.description}</p>
              <p>Price: Rs. {meal.price}</p>
              <button className="order-button" onClick={() => handleSelectMeal(meal)}>Add to Order</button>
            </div>
          </div>
        ))}
      </div>
      <hr />
      <div className="order-summary">
        <h2>Your Order</h2>
        {selectedMeals.map((meal, index) => (
          <div className="order-item" key={index}>
            <p>{meal.name} - Rs. {meal.price}</p>
            <button className="remove-button" onClick={() => handleRemoveMeal(index)}>Remove</button>
          </div>
        ))}
        <h3>Total: Rs. {totalAmount}</h3>
        <div className="customer-details">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Customer ID"
            value={customerID}
            onChange={(e) => setCustomerID(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Room Number"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            className="input-field"
          />
        </div>
        <button className="place-order-button" onClick={handlePlaceOrder}>Place Order</button>
      </div>
    </div>
  );
}

export default MealOrderPage;
