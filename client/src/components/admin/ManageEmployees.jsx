import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Table } from "antd";

function ManageEmployees() {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filteredEmployees, setFilteredEmployees] = useState([]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/employee/getEmployees");
            const emp = response.data || [];
            console.log(emp);
            setEmployees(emp);
        } catch (error) {
            message.error("Failed to fetch employees");
        } finally {
            setLoading(false);
        }
    };

    //search filter
    useEffect(() => {
        let tempList = employees;

        console.log(employees);

        if (searchTerm !== "") {
            tempList = tempList.filter(
                (item) =>
                    item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredEmployees(tempList);
    }, [searchTerm, employees]);

    const [pagination, setPagination] = useState({
        pageSize: 10,
        current: 1,
        position: ["bottomCenter"],
    });

    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(pagination);
    };

    const handleAddEmployee = async (newEmployee) => {
        try {
            await axios.post("http://localhost:5000/api/employee/addEmployee", newEmployee);
            message.success("Employee added successfully");
            fetchEmployees();
            setShowAddPopup(false);
        } catch (error) {
            message.error(error.response.data || "Failed to add employee");
        }
    };

    const handleEditEmployee = async (updatedEmployee) => {
        try {
            await axios.post("http://localhost:5000/api/employee/updateEmployee", updatedEmployee);
            message.success("Employee updated successfully");
            fetchEmployees();
            setShowEditPopup(null);
        } catch (error) {
            message.error(error.response?.data || "Failed to update employee");
        }
    };

    const handleDeleteEmployee = async (employeeId) => {
        try {
            await axios.post("http://localhost:5000/api/employee/deleteEmployee", { employeeId });
            message.success("Employee deleted successfully");
            fetchEmployees();
            setShowDeletePopup(null);
        } catch (error) {
            message.error("Failed to delete employee");
        }
    };

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
                <p>Loading employees...</p>
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
                                disabled={showEditPopup || showDeletePopup || showAddPopup}
                            />
                            <button className="add-btn-1234" onClick={() => setShowAddPopup(true)}>Add New</button>
                        </div>
                    </div>

                    <Table
                        dataSource={filteredEmployees}
                        columns={columns}
                        pagination={filteredEmployees.length > 10 ? pagination : false}
                        onChange={handleTableChange}
                    />

                    {showAddPopup && (
                        <AddEditPopup
                            onSave={handleAddEmployee}
                            onClose={() => setShowAddPopup(false)}
                        />
                    )}
                    {showEditPopup && (
                        <AddEditPopup
                            employee={showEditPopup}
                            onSave={handleEditEmployee}
                            onClose={() => setShowEditPopup(null)}
                        />
                    )}
                    {showDeletePopup && (
                        <DeleteConfirmationPopup
                            employee={showDeletePopup}
                            onDelete={handleDeleteEmployee}
                            onClose={() => setShowDeletePopup(null)}
                        />
                    )}
                </>
            )}
        </div>
    );
}

function AddEditPopup({ employee, onSave, onClose }) {
    const [formData, setFormData] = useState({
        firstName: employee?.firstName || "",
        lastName: employee?.lastName || "",
        email: employee?.email || "",
        username: employee?.username || ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    return (
        <div className="popup-overlay-1234">
            <div className="popup-1234">
                <h3>{employee ? "Edit Employee" : "Add New Employee"}</h3>
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
                    disabled={!!employee} // Disable email if editing (employee is present)
                />
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                />
                <div className="actions-1234">
                    <button onClick={handleSubmit}>Save</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

function DeleteConfirmationPopup({ employee, onDelete, onClose }) {
    const handleDelete = () => {
        onDelete(employee.employeeId);
    };

    return (
        <div className="popup-overlay-1234">
            <div className="popup-1234">
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete {employee.firstName} {employee.lastName}?</p>
                <div className="actions-1234">
                    <button onClick={handleDelete}>Delete</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default ManageEmployees;
