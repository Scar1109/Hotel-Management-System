import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Table } from "antd";

function ManageEmployees() {
    // States to manage different aspects of the component
    const [employees, setEmployees] = useState([]); // Stores the list of employees
    const [searchTerm, setSearchTerm] = useState(""); // Stores the current search term
    const [showAddPopup, setShowAddPopup] = useState(false); // Controls visibility of the add employee popup
    const [showEditPopup, setShowEditPopup] = useState(null); // Controls visibility of the edit employee popup
    const [showDeletePopup, setShowDeletePopup] = useState(null); // Controls visibility of the delete confirmation popup
    const [loading, setLoading] = useState(true); // Tracks if the data is still loading
    const [filteredEmployees, setFilteredEmployees] = useState([]); // Stores the filtered list of employees based on the search term

    // Fetch employees when the component first mounts
    useEffect(() => {
        fetchEmployees();
    }, []);

    // Function to fetch employees from the server
    const fetchEmployees = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/employee/getEmployees");
            const emp = response.data || [];
            setEmployees(emp);
        } catch (error) {
            message.error("Failed to fetch employees"); // Show error message if fetching fails
        } finally {
            setLoading(false); // Set loading to false after fetching is complete
        }
    };

    // Apply search filter when searchTerm or employees list changes
    useEffect(() => {
        let tempList = employees;

        // Filter employees based on the search term
        if (searchTerm !== "") {
            tempList = tempList.filter(
                (item) =>
                    item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredEmployees(tempList); // Update the filtered list of employees
    }, [searchTerm, employees]);

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

    // Function to add a new employee
    const handleAddEmployee = async (newEmployee) => {
        try {
            await axios.post("http://localhost:5000/api/employee/addEmployee", newEmployee);
            message.success("Employee added successfully");
            fetchEmployees(); // Refresh the employee list after adding
            setShowAddPopup(false); // Close the add popup
        } catch (error) {
            message.error(error.response.data || "Failed to add employee"); // Show error message if adding fails
        }
    };

    // Function to edit an existing employee
    const handleEditEmployee = async (updatedEmployee) => {
        try {
            await axios.post("http://localhost:5000/api/employee/updateEmployee", updatedEmployee);
            message.success("Employee updated successfully");
            fetchEmployees(); // Refresh the employee list after updating
            setShowEditPopup(null); // Close the edit popup
        } catch (error) {
            message.error(error.response?.data || "Failed to update employee"); // Show error message if updating fails
        }
    };

    // Function to delete an employee
    const handleDeleteEmployee = async (employeeId) => {
        try {
            await axios.post("http://localhost:5000/api/employee/deleteEmployee", { employeeId });
            message.success("Employee deleted successfully");
            fetchEmployees(); // Refresh the employee list after deleting
            setShowDeletePopup(null); // Close the delete confirmation popup
        } catch (error) {
            message.error("Failed to delete employee"); // Show error message if deleting fails
        }
    };

    // Define columns for the employee table
    const columns = [
        {
            title: 'ID',
            dataIndex: 'employeeId',
            key: 'employeeId',
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, employee) => (
                <>
                    <button className="edit-btn-1234" onClick={() => setShowEditPopup(employee)}>Edit</button>
                    <button className="delete-btn-1234" onClick={() => setShowDeletePopup(employee)}>Delete</button>
                </>
            ),
        },
    ];

    return (
        <div className="manage-employees-1234">
            {loading ? (
                <p>Loading employees...</p> // Show loading message while employees are being fetched
            ) : (
                <>
                    <div className="header-1234">
                        <h2>Existing Employees</h2>
                        <div className="search-and-add-1234">
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input-1234"
                                disabled={showEditPopup || showDeletePopup || showAddPopup} // Disable search input when any popup is open
                            />
                            <button className="add-btn-1234" onClick={() => setShowAddPopup(true)}>Add New</button>
                        </div>
                    </div>

                    <Table
                        dataSource={filteredEmployees} // Data to display in the table
                        columns={columns} // Table columns
                        pagination={filteredEmployees.length > 10 ? pagination : false} // Enable pagination if more than 10 employees
                        onChange={handleTableChange} // Handle table change (e.g., pagination)
                    />

                    {showAddPopup && (
                        <AddEditPopup
                            onSave={handleAddEmployee} // Save new employee
                            onClose={() => setShowAddPopup(false)} // Close add popup
                        />
                    )}
                    {showEditPopup && (
                        <AddEditPopup
                            employee={showEditPopup} // Pass the employee to edit
                            onSave={handleEditEmployee} // Save updated employee
                            onClose={() => setShowEditPopup(null)} // Close edit popup
                        />
                    )}
                    {showDeletePopup && (
                        <DeleteConfirmationPopup
                            employee={showDeletePopup} // Pass the employee to delete
                            onDelete={handleDeleteEmployee} // Confirm deletion
                            onClose={() => setShowDeletePopup(null)} // Close delete confirmation popup
                        />
                    )}
                </>
            )}
        </div>
    );
}

function AddEditPopup({ employee, onSave, onClose }) {
    // State to manage form data
    const [formData, setFormData] = useState({
        firstName: employee?.firstName || "", // Pre-fill form with employee data if editing
        lastName: employee?.lastName || "",
        email: employee?.email || "",
        username: employee?.username || ""
    });

    // Handle changes in form inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = () => {
        onSave(formData); // Save the employee data (add or edit)
    };

    return (
        <div className="popup-overlay-1234">
            <div className="popup-1234">
                <h3>{employee ? "Edit Employee" : "Add New Employee"}</h3> {/* Change title based on add or edit */}
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                />
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    disabled={!!employee} // Disable email field if editing an employee
                />
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                />
                <div className="actions-1234">
                    <button onClick={handleSubmit}>Save</button> {/* Save button */}
                    <button onClick={onClose}>Cancel</button> {/* Cancel button */}
                </div>
            </div>
        </div>
    );
}

function DeleteConfirmationPopup({ employee, onDelete, onClose }) {
    // Handle deletion of employee
    const handleDelete = () => {
        onDelete(employee.employeeId); // Pass the employee ID to delete
    };

    return (
        <div className="popup-overlay-1234">
            <div className="popup-1234">
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete {employee.firstName} {employee.lastName}?</p> {/* Confirmation message */}
                <div className="actions-1234">
                    <button onClick={handleDelete}>Delete</button> {/* Confirm delete button */}
                    <button onClick={onClose}>Cancel</button> {/* Cancel delete button */}
                </div>
            </div>
        </div>
    );
}

export default ManageEmployees;
