import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Table, Select } from "antd";

const { Option } = Select;

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
    position: ["bottomCenter"],
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/order/getOrders");
      const ord = Array.isArray(response.data.data) ? response.data.data : [];
      setOrders(ord);
    } catch (error) {
      message.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let tempList = orders;

    if (searchTerm !== "") {
      tempList = tempList.filter(
        (item) =>
          item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.orderId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(tempList);
  }, [searchTerm, orders]);

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
  };

  const handleAddOrder = async (newOrder) => {
    try {
      await axios.post("http://localhost:5000/api/order/addOrder", newOrder);
      message.success("Order added successfully");
      fetchOrders();
      setShowAddPopup(false);
    } catch (error) {
      message.error(error.response.data || "Failed to add order");
    }
  };

  const handleEditOrder = async (updatedOrder) => {
    try {
      await axios.post("http://localhost:5000/api/order/updateItem", updatedOrder);
      message.success("Order updated successfully");
      fetchOrders();
      setShowEditPopup(null);
    } catch (error) {
      message.error(error.response?.data || "Failed to update order");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.post("http://localhost:5000/api/order/deleteItem", { orderId });
      message.success("Order deleted successfully");
      fetchOrders();
      setShowDeletePopup(null);
    } catch (error) {
      message.error("Failed to delete order");
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Purchase Date",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Meal Types",
      dataIndex: "meals",
      key: "meals",
      render: (meals) => meals.join(", "),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, order) => (
        <>
          <button className="edit-btn" onClick={() => setShowEditPopup(order)}>
            Edit
          </button>
          <button
            className="delete-btn"
            onClick={() => setShowDeletePopup(order)}
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="manage-orders">
      {loading ? (
        <p>Loading orders...</p>
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
                disabled={showEditPopup || showDeletePopup || showAddPopup}
              />
              <button className="add-btn" onClick={() => setShowAddPopup(true)}>
                Add New
              </button>
            </div>
          </div>

          <Table
            dataSource={Array.isArray(filteredOrders) ? filteredOrders : []}
            columns={columns}
            pagination={filteredOrders.length > 10 ? pagination : false}
            onChange={handleTableChange}
          />

          {showAddPopup && (
            <AddEditPopup
              onSave={handleAddOrder}
              onClose={() => setShowAddPopup(false)}
            />
          )}
          {showEditPopup && (
            <AddEditPopup
              order={showEditPopup}
              onSave={handleEditOrder}
              onClose={() => setShowEditPopup(null)}
            />
          )}
          {showDeletePopup && (
            <DeleteConfirmationPopup
              order={showDeletePopup}
              onDelete={handleDeleteOrder}
              onClose={() => setShowDeletePopup(null)}
            />
          )}
        </>
      )}
    </div>
  );
}

function AddEditPopup({ order, onSave, onClose }) {
  const [formData, setFormData] = useState({
    purchaseDate: order?.purchaseDate || "",
    customerName: order?.customerName || "",
    customerID: order?.customerID || "",
    amount: order?.amount || "",
    meals: order?.meals || [],
    type: order?.type || "", // Include type field
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (value) => {
    setFormData({ ...formData, type: value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h3>{order ? "Edit Order" : "Add New Order"}</h3>
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
        <Select
          name="type"
          value={formData.type}
          onChange={handleTypeChange}
          placeholder="Select Type"
        >
          <Option value="Vegetarian">Vegetarian</Option>
          <Option value="Non-Vegetarian">Non-Vegetarian</Option>
        </Select>
        <textarea
          name="meals"
          value={formData.meals.join(", ")}
          onChange={(e) =>
            setFormData({ ...formData, meals: e.target.value.split(", ") })
          }
          placeholder="Meals (comma-separated)"
        />
        <div className="actions">
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmationPopup({ order, onDelete, onClose }) {
  const handleDelete = () => {
    onDelete(order.orderId);
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete order ID {order.orderId}?</p>
        <div className="actions">
          <button onClick={handleDelete}>Delete</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ManageOrders;
