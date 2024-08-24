import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Table } from "antd";

function ManageOrders() {
    // States to manage different aspects of the component
    const [orders, setOrders] = useState([]); // Stores the list of orders
    const [searchTerm, setSearchTerm] = useState(""); // Stores the current search term
    const [showAddPopup, setShowAddPopup] = useState(false); // Controls visibility of the add order popup
    const [showEditPopup, setShowEditPopup] = useState(null); // Controls visibility of the edit order popup
    const [showDeletePopup, setShowDeletePopup] = useState(null); // Controls visibility of the delete confirmation popup
    const [loading, setLoading] = useState(true); // Tracks if the data is still loading
    const [filteredOrders, setFilteredOrders] = useState([]); // Stores the filtered list of orders based on the search term

    // Fetch orders when the component first mounts
    useEffect(() => {
        fetchOrders();
    }, []);

    // Function to fetch orders from the server
    const fetchOrders = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/order/getOrders");
            const ord = response.data || [];
            console.log(ord);
            setOrders(ord);
        } catch (error) {
            message.error("Failed to fetch orders"); // Show error message if fetching fails
        } finally {
            setLoading(false); // Set loading to false after fetching is complete
        }
    };

    // Apply search filter when searchTerm or orders list changes
    useEffect(() => {
        let tempList = orders;

        console.log(orders);

        // Filter orders based on the search term
        if (searchTerm !== "") {
            tempList = tempList.filter(
                (item) =>
                    item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.orderId.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredOrders(tempList); // Update the filtered list of orders
    }, [searchTerm, orders]);

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

    // Function to add a new order
    const handleAddOrder = async (newOrder) => {
        try {
            await axios.post("http://localhost:5000/api/order/addOrder", newOrder);
            message.success("Order added successfully");
            fetchOrders(); // Refresh the order list after adding
            setShowAddPopup(false); // Close the add popup
        } catch (error) {
            message.error(error.response.data || "Failed to add order"); // Show error message if adding fails
        }
    };

    // Function to edit an existing order
    const handleEditOrder = async (updatedOrder) => {
        try {
            console.log("Updating order with data:", updatedOrder); // Log to verify the data being sent
            await axios.post("http://localhost:5000/api/order/updateItem", updatedOrder);
            message.success("Order updated successfully");
            fetchOrders(); // Refresh the order list after updating
            setShowEditPopup(null); // Close the edit popup
        } catch (error) {
            console.error("Update error:", error.response?.data || error.message);
            message.error(error.response?.data || "Failed to update order"); // Show error message if updating fails
        }
    };
    

    // Function to delete an order
    const handleDeleteOrder = async (orderId) => {
        try {
            console.log("Deleting order with ID:", orderId); // Log the orderId to ensure it's correct
            await axios.post("http://localhost:5000/api/order/deleteItem", { orderId });
            message.success("Order deleted successfully");
            fetchOrders(); // Refresh the order list after deleting
            setShowDeletePopup(null); // Close the delete confirmation popup
        } catch (error) {
            console.error("Delete error:", error.response?.data || error.message);
            message.error("Failed to delete order"); // Show error message if deleting fails
        }
    };
    

    // Define columns for the order table
    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId',
        },
        {
            title: 'Purchase Date',
            dataIndex: 'purchaseDate',
            key: 'purchaseDate',
        },
        {
            title: 'Customer Name',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, order) => (
                <>
                    <button className="edit-btn" onClick={() => setShowEditPopup(order)}>Edit</button>
                    <button className="delete-btn" onClick={() => setShowDeletePopup(order)}>Delete</button>
                </>
            ),
        },
    ];

    return (
        <div className="manage-orders">
            {loading ? (
                <p>Loading orders...</p> // Show loading message while orders are being fetched
            ) : (
                <>
                    <div className="header">
                        <h2>Manage Orders</h2>
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
                        dataSource={filteredOrders} // Data to display in the table
                        columns={columns} // Table columns
                        pagination={filteredOrders.length > 10 ? pagination : false} // Enable pagination if more than 10 orders
                        onChange={handleTableChange} // Handle table change (e.g., pagination)
                    />

                    {showAddPopup && (
                        <AddEditPopup
                            onSave={handleAddOrder} // Save new order
                            onClose={() => setShowAddPopup(false)} // Close add popup
                        />
                    )}
                    {showEditPopup && (
                        <AddEditPopup
                            order={showEditPopup} // Pass the order to edit
                            onSave={handleEditOrder} // Save updated order
                            onClose={() => setShowEditPopup(null)} // Close edit popup
                        />
                    )}
                    {showDeletePopup && (
                        <DeleteConfirmationPopup
                            order={showDeletePopup} // Pass the order to delete
                            onDelete={handleDeleteOrder} // Confirm deletion
                            onClose={() => setShowDeletePopup(null)} // Close delete confirmation popup
                        />
                    )}
                </>
            )}
        </div>
    );
}

function AddEditPopup({ order, onSave, onClose }) {
    // State to manage form data
    const [formData, setFormData] = useState({
        purchaseDate: order?.purchaseDate || "",
        customerName: order?.customerName || "",
        customerID: order?.customerID || "",
        amount: order?.amount || "",
        meals: order?.meals || []
    });

    // Handle changes in form inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = () => {
        onSave(formData); // Save the order data (add or edit)
    };

    return (
        <div className="popup-overlay">
            <div className="popup">
                <h3>{order ? "Edit Order" : "Add New Order"}</h3> {/* Change title based on add or edit */}
                <input
                    type="text"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    placeholder="Purchase Date"
                />
                <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Customer Name"
                />
                <input
                    type="text"
                    name="customerID"
                    value={formData.customerID}
                    onChange={handleChange}
                    placeholder="Customer ID"
                />
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Amount"
                />
                <textarea
                    name="meals"
                    value={formData.meals.join(", ")} // Display meals as a comma-separated string
                    onChange={(e) => setFormData({ ...formData, meals: e.target.value.split(", ") })} // Update meals from string
                    placeholder="Meals (comma-separated)"
                />
                <div className="actions">
                    <button onClick={handleSubmit}>Save</button> {/* Save button */}
                    <button onClick={onClose}>Cancel</button> {/* Cancel button */}
                </div>
            </div>
        </div>
    );
}

function DeleteConfirmationPopup({ order, onDelete, onClose }) {
    // Handle deletion of order
    const handleDelete = () => {
        onDelete(order.orderId); // Pass the order ID to delete
    };

    return (
        <div className="popup-overlay">
            <div className="popup">
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete order ID {order.orderId}?</p> {/* Confirmation message */}
                <div className="actions">
                    <button onClick={handleDelete}>Delete</button> {/* Confirm delete button */}
                    <button onClick={onClose}>Cancel</button> {/* Cancel delete button */}
                </div>
            </div>
        </div>
    );
}

export default ManageOrders;
