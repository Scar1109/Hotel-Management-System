import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { message, Radio } from 'antd';

function MealOrderPage() {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerID, setCustomerID] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderType, setOrderType] = useState('delivery');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
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

    const storedCustomer = localStorage.getItem('currentUser');
    if (storedCustomer) {
      const userObject = JSON.parse(storedCustomer);
      setCustomerID(userObject.userID);
      console.log(userObject.userID);
    }
  }, []);

  const handleFilter = (filter) => {
    if (filter === 'All') {
      setFilteredMeals(meals);
    } else {
      const filtered = meals.filter(meal => meal.type === filter);
      setFilteredMeals(filtered);
    }
  };

  const handleSelectMeal = (meal) => {
    setSelectedMeals([...selectedMeals, meal]);
    setTotalAmount(totalAmount + Number(meal.price));
  };

  const handleRemoveMeal = (index) => {
    const updatedMeals = [...selectedMeals];
    const removedMeal = updatedMeals.splice(index, 1)[0];
    setSelectedMeals(updatedMeals);
    setTotalAmount(totalAmount - Number(removedMeal.price));
  };

  const handlePlaceOrder = async () => {
    if (!customerName || !customerID || selectedMeals.length === 0 || !phoneNumber) {
      message.error('Please provide all required details and select meals to place an order.');
      return;
    }

    if (orderType === 'delivery' && !address) {
      message.error('Please provide delivery address.');
      return;
    }

    const orderData = {
      purchaseDate: new Date().toLocaleDateString(),
      customerName,
      customerID,
      phoneNumber,
      address: orderType === 'delivery' ? address : 'Take-away',
      amount: totalAmount,
      meals: selectedMeals.map((meal) => meal.name),
      orderType,
    };

    try {
      const response = await axios.post('/api/order/addOrder', orderData);
      message.success('Order placed successfully!');
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Error placing order:', error);
      message.error('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="order-container">
      <h1>Order Your Meal</h1>
      <hr />
      <div className="filter-bar">
        <button onClick={() => handleFilter('vegi')}>Vegetarian</button>
        <button onClick={() => handleFilter('non vegi')}>Non-Vegetarian</button>
        <button onClick={() => handleFilter('All')}>All</button>
      </div>
      <div className="meal-list">
        {filteredMeals.map((meal, index) => (
          <div className="meal-card" key={index}>
            <img src={meal.imageUrl} alt={meal.name} className="meal-image" />
            <div className="meal-details">
              <h2>{meal.name}</h2>
              <p>{meal.description}</p>
              <p>Type: {meal.type}</p>
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
            <p>{meal.name} - Rs. {meal.price} ({meal.type})</p>
            <button className="remove-button" onClick={() => handleRemoveMeal(index)}>Remove</button>
          </div>
        ))}
        <h3>Total: Rs. {totalAmount}</h3>
        <div className="order-type">
          <Radio.Group onChange={(e) => setOrderType(e.target.value)} value={orderType}>
            <Radio value="delivery">Delivery</Radio>
            <Radio value="takeaway">Take-away</Radio>
          </Radio.Group>
        </div>
        <div className="customer-details">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="input-field"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Address"
            className="input-field"
            readOnly
            style={{ marginTop: 10 }}
          />
          <input
            type="text"
            placeholder="Customer ID"
            value={customerID}
            onChange={(e) => setCustomerID(e.target.value)}
            className="input-field"
            disabled
            style={{ marginTop: 10 }}
          />
        </div>
        <button className="place-order-button" onClick={handlePlaceOrder}>Place Order</button>
      </div>
    </div>
  );
}

export default MealOrderPage;