import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Table } from "antd";

function ManageCateringFoods() {
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [pagination, setPagination] = useState({
    pageSize: 6,
    current: 1,
    position: ["bottomCenter"],
  });

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/catering/getItems"
      );
      const foodData = response.data || [];
      setFoods(foodData);
      console.log(foodData);
    } catch (error) {
      message.error("Failed to fetch foods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let tempList = foods;

    if (searchTerm !== "") {
      tempList = tempList.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.itemId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFoods(tempList);
  }, [searchTerm, foods]);

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
  };

  const handleAddFood = async (newFood) => {
    try {
      await axios.post("http://localhost:5000/api/catering/addItem", newFood);
      message.success("Food item added successfully");
      fetchFoods();
      setShowAddPopup(false);
    } catch (error) {
      message.error("Failed to add food item");
    }
  };

  const handleEditFood = async (updatedFood) => {
    try {
      await axios.post(
        "http://localhost:5000/api/catering/updateItem",
        updatedFood
      );
      message.success("Food item updated successfully");
      fetchFoods();
      setShowEditPopup(null);
    } catch (error) {
      message.error("Failed to update food item");
    }
  };

  const handleDeleteFood = async (itemId) => {
    try {
      await axios.post("http://localhost:5000/api/catering/deleteItem", {
        itemId,
      });
      message.success("Food item deleted successfully");
      fetchFoods();
      setShowDeletePopup(null);
    } catch (error) {
      message.error("Failed to delete food item");
    }
  };

  const columns = [
    
      {
        title: "Image",
        dataIndex: "imageUrl",
        key: "imageUrl",
        render: (text) => (
          <img
            src={text} // Ensure `text` correctly references the imageUrl
            alt="food"
            style={{ width: "100px", height: "auto" }}
          />
        ),
      },
    {
      title: "Item ID",
      dataIndex: "itemId",
      key: "itemId",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category"
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type"
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, food) => (
        <>
          <button className="edit-btn" onClick={() => setShowEditPopup(food)}>
            Edit
          </button>
          <button
            className="delete-btn"
            onClick={() => setShowDeletePopup(food)}
          >
            Delete
          </button>
        </>
      ),
    },
  ];
  

  return (
    <div className="manage-catering-foods">
      {loading ? (
        <p>Loading food items...</p>
      ) : (
        <>
          <div className="header">
            <h2>Manage Catering Foods</h2>
            <div className="search-and-add">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                disabled={showEditPopup || showDeletePopup || showAddPopup}
              />
              <button className="add-btn" onClick={() => setShowAddPopup(true)}>
                Add New
              </button>
            </div>
          </div>

          <Table
            dataSource={filteredFoods}
            columns={columns}
            pagination={filteredFoods.length > 6 ? pagination : false}
            onChange={handleTableChange}
          />

          {showAddPopup && (
            <AddEditFoodPopup
              onSave={handleAddFood}
              onClose={() => setShowAddPopup(false)}
            />
          )}
          {showEditPopup && (
            <AddEditFoodPopup
              food={showEditPopup}
              onSave={handleEditFood}
              onClose={() => setShowEditPopup(null)}
            />
          )}
          {showDeletePopup && (
            <DeleteConfirmationPopup
              food={showDeletePopup}
              onDelete={handleDeleteFood}
              onClose={() => setShowDeletePopup(null)}
            />
          )}
        </>
      )}
    </div>
  );
}

function AddEditFoodPopup({ food, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: food?.name || "",
    description: food?.description || "",
    price: food?.price || "",
    category: food?.category || "",
    type: food?.type || "vegi", // Default to "vegi"
    imageUrl: food?.imageUrl || "", // Ensure imageUrl is included

  });

  // Handle input change for text fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle select change for the "type" field
  const handleSelectChange = (value) => {
    setFormData({ ...formData, type: value });
  };

  // Handle form submission
  const handleSubmit = () => {
    const dataToSave = food ? { ...food, ...formData } : formData;
    onSave(dataToSave);
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h3>{food ? "Edit Food Item" : "Add New Food Item"}</h3>

        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="Image URL"
        />
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Food Name"
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
        />
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
        />
        
        <select
          name="type"
          value={formData.type}
          onChange={(e) => handleSelectChange(e.target.value)}
          style={{
            width: "200px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#f8f8f8",
            fontSize: "16px",
            color: "#333",
            cursor: "pointer",
            transition: "all 0.3s ease",
            outline: "none",
          }}
        >
          <option value="vegi">Veg</option>
          <option value="non vegi">Non-Veg</option>
        </select>

        <div className="actions">
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmationPopup({ food, onDelete, onClose }) {
  const handleDelete = () => {
    onDelete(food.itemId);
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h3>Delete Food Item</h3>
        <p>Are you sure you want to delete {food.name}?</p>
        <div className="actions">
          <button onClick={handleDelete}>Delete</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ManageCateringFoods;
