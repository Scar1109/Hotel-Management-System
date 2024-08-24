import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Table } from "antd";

function ManageCateringFoods() {
    const [foods, setFoods] = useState([]); // Stores the list of foods
    const [searchTerm, setSearchTerm] = useState(""); // Stores the current search term
    const [showAddPopup, setShowAddPopup] = useState(false); // Controls visibility of the add food popup
    const [showEditPopup, setShowEditPopup] = useState(null); // Controls visibility of the edit food popup
    const [showDeletePopup, setShowDeletePopup] = useState(null); // Controls visibility of the delete confirmation popup
    const [loading, setLoading] = useState(true); // Tracks if the data is still loading
    const [filteredFoods, setFilteredFoods] = useState([]); // Stores the filtered list of foods based on the search term

    // Fetch foods when the component first mounts
    useEffect(() => {
        fetchFoods();
    }, []);

    // Function to fetch foods from the server
    const fetchFoods = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/catering/getItems");
            const foodData = response.data || [];
            console.log(foodData);
            setFoods(foodData);
        } catch (error) {
            message.error("Failed to fetch foods"); // Show error message if fetching fails
        } finally {
            setLoading(false); // Set loading to false after fetching is complete
        }
    };

    // Apply search filter when searchTerm or foods list changes
    useEffect(() => {
        let tempList = foods;

        console.log(foods);

        // Filter foods based on the search term
        if (searchTerm !== "") {
            tempList = tempList.filter(
                (item) =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.itemId.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredFoods(tempList); // Update the filtered list of foods
    }, [searchTerm, foods]);

    // State to manage table pagination
    const [pagination, setPagination] = useState({
        pageSize: 10,
        current: 1,
        position: ["bottomCenter"],
    });

    // Handle changes to the table (e.g., pagination)
    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(pagination);
    };

    // Function to add a new food item
    const handleAddFood = async (newFood) => {
        try {
            const response = await axios.post("http://localhost:5000/api/catering/addItem", newFood);
            message.success("Food item added successfully");
            fetchFoods(); // Refresh the food list after adding
            setShowAddPopup(false); // Close the add popup
        } catch (error) {
            message.error(error.response?.data || "Failed to add food item"); // Show error message if adding fails
        }
    };

    // Function to edit an existing food item
    const handleEditFood = async (updatedFood) => {
        try {
            console.log("Updating food with data:", updatedFood); // Log to verify the data being sent
            const response = await axios.post("http://localhost:5000/api/catering/updateItem", updatedFood);
            message.success("Food item updated successfully");
            fetchFoods(); // Refresh the food list after updating
            setShowEditPopup(null); // Close the edit popup
        } catch (error) {
            console.error("Update error:", error.response?.data || error.message);
            message.error(error.response?.data || "Failed to update food item"); // Show error message if updating fails
        }
    };

    // Function to delete a food item
    const handleDeleteFood = async (itemId) => {
        try {
            console.log("Deleting food item with ID:", itemId); // Log the itemId to ensure it's correct
            const response = await axios.post("http://localhost:5000/api/catering/deleteItem", { itemId });
            message.success("Food item deleted successfully");
            fetchFoods(); // Refresh the food list after deleting
            setShowDeletePopup(null); // Close the delete confirmation popup
        } catch (error) {
            console.error("Delete error:", error.response?.data || error.message);
            message.error("Failed to delete food item"); // Show error message if deleting fails
        }
    };

    // Define columns for the food table
    const columns = [
        {
            title: 'Item ID',
            dataIndex: 'itemId',
            key: 'itemId',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, food) => (
                <>
                    <button className="edit-btn" onClick={() => setShowEditPopup(food)}>Edit</button>
                    <button className="delete-btn" onClick={() => setShowDeletePopup(food)}>Delete</button>
                </>
            ),
        },
    ];

    return (
        <div className="manage-catering-foods">
            {loading ? (
                <p>Loading food items...</p> // Show loading message while foods are being fetched
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
                                disabled={showEditPopup || showDeletePopup || showAddPopup} // Disable search input when any popup is open
                            />
                            <button className="add-btn" onClick={() => setShowAddPopup(true)}>Add New</button>
                        </div>
                    </div>

                    <Table
                        dataSource={filteredFoods} // Data to display in the table
                        columns={columns} // Table columns
                        pagination={filteredFoods.length > 10 ? pagination : false} // Enable pagination if more than 10 foods
                        onChange={handleTableChange} // Handle table change (e.g., pagination)
                    />

                    {showAddPopup && (
                        <AddEditFoodPopup
                            onSave={handleAddFood} // Save new food item
                            onClose={() => setShowAddPopup(false)} // Close add popup
                        />
                    )}
                    {showEditPopup && (
                        <AddEditFoodPopup
                            food={showEditPopup} // Pass the food item to edit
                            onSave={handleEditFood} // Save updated food item
                            onClose={() => setShowEditPopup(null)} // Close edit popup
                        />
                    )}
                    {showDeletePopup && (
                        <DeleteConfirmationPopup
                            food={showDeletePopup} // Pass the food item to delete
                            onDelete={handleDeleteFood} // Confirm deletion
                            onClose={() => setShowDeletePopup(null)} // Close delete confirmation popup
                        />
                    )}
                </>
            )}
        </div>
    );
}

// Popup component for adding and editing food items
function AddEditFoodPopup({ food, onSave, onClose }) {
    // State to manage form data
    const [formData, setFormData] = useState({
        name: food?.name || "",
        description: food?.description || "",
        price: food?.price || "",
        category: food?.category || "",
    });

    // Handle changes in form inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = () => {
        const dataToSave = food ? { ...food, ...formData } : formData;
        onSave(dataToSave); // Save the food data (add or edit)
    };


    return (
        <div className="popup-overlay">
            <div className="popup">
                <h3>{food ? "Edit Food Item" : "Add New Food Item"}</h3> {/* Change title based on add or edit */}
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
                <div className="actions">
                    <button onClick={handleSubmit}>Save</button> {/* Save button */}
                    <button onClick={onClose}>Cancel</button> {/* Cancel button */}
                </div>
            </div>
        </div>
    );
}

// Popup component for confirming deletion
function DeleteConfirmationPopup({ food, onDelete, onClose }) {
    // Handle deletion confirmation
    const handleDelete = () => {
        onDelete(food.itemId); // Delete the food item
    };

    return (
        <div className="popup-overlay">
            <div className="popup">
                <h3>Delete Food Item</h3>
                <p>Are you sure you want to delete {food.name}?</p> {/* Show food name in confirmation */}
                <div className="actions">
                    <button onClick={handleDelete}>Delete</button> {/* Delete button */}
                    <button onClick={onClose}>Cancel</button> {/* Cancel button */}
                </div>
            </div>
        </div>
    );
}

export default ManageCateringFoods;
