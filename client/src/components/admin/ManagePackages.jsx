import React, { useState, useEffect } from "react";
import { Space, Table, Modal, Input, message, Form, InputNumber } from "antd";
import { Icon } from "@iconify/react";
import axios from "axios";

function ManagePackages() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [packages, setPackages] = useState([]);
  const [editingPackage, setEditingPackage] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [form] = Form.useForm(); // Form instance for adding a package
  const [updateForm] = Form.useForm(); // Form instance for updating a package

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const showUpdateModal = (packageData) => {
    setEditingPackage(packageData);
    setIsUpdateModalOpen(true);
    updateForm.setFieldsValue(packageData);
  };

  const handleUpdateCancel = () => {
    setIsUpdateModalOpen(false);
    updateForm.resetFields();
    setEditingPackage(null);
  };

  // Fetch packages
  const fetchPackages = async () => {
    try {
      const response = await axios.get("/api/package/getPackages");
      setPackages(response.data.packages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Add new package
  const addPackage = async () => {
    try {
      const values = await form.validateFields();
      await axios.post("/api/package/addPackage", values);
      setIsModalOpen(false);
      message.success("Package added successfully");
      fetchPackages();
      form.resetFields();
    } catch (err) {
      console.log(err);
      message.error(err.response?.data?.message || "Failed to add package");
    }
  };

  // Update package
  const handleUpdate = async () => {
    try {
      const values = await updateForm.validateFields();
      await axios.put(`/api/package/updatePackage/${editingPackage._id}`, values);
      setIsUpdateModalOpen(false);
      message.success("Package updated successfully");
      fetchPackages();
      updateForm.resetFields();
    } catch (err) {
      console.log(err);
      message.error(err.response?.data?.message || "Failed to update package");
    }
  };

  // Delete package
  const deletePackage = async (id) => {
    try {
      await axios.delete(`/api/package/deletePackage/${id}`);
      message.success("Package deleted successfully");
      fetchPackages(); // Refresh the list of packages after deletion
    } catch (err) {
      console.log(err);
      message.error("Failed to delete package");
    }
  };

  // Filter packages based on search input
  const filteredPackages = packages.filter((pkg) => {
    return (
      pkg.packageName.toLowerCase().includes(searchText.toLowerCase()) ||  // Filter by package name
      pkg.description.toLowerCase().includes(searchText.toLowerCase()) || // Filter by description
      pkg.price.toString().includes(searchText) // Filter by price
    );
  });

  // Table columns
  const columns = [
    {
      title: "Package Name",
      dataIndex: "packageName",
      key: "packageName",
      sorter: (a, b) => a.packageName.localeCompare(b.packageName),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (text) => `RS: ${text}`,
    },
    {
      title: "Date Added",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt), // Sort by createdAt in descending order
      render: (text) => new Date(text).toLocaleDateString(), // Format date
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Icon onClick={() => showUpdateModal(record)} icon="akar-icons:edit" width="24" height="24" />
          <Icon onClick={() => deletePackage(record._id)} icon="material-symbols:delete" width="24" height="24" />
        </Space>
      ),
    },
  ];

  return (
    <div className="manage_packages">
      <div className="manage_packages_content">
        <div className="manage_packages_header">
          <h1>Manage Packages</h1>
          <div className="search-container-122313">
          <div className="search-bar">
          <Input
            placeholder="Search packages"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300, marginLeft: 20 }}
          />                   
                              </div>
          <button className="add_new_package" onClick={showModal}>
            Add Package
          </button>
          </div>
          <Modal title="Add Package" open={isModalOpen} onOk={addPackage} onCancel={handleCancel}>
            <Form form={form} layout="vertical">
              <Form.Item
                label="Package Name"
                name="packageName"
                rules={[{ required: true, message: "Please enter the package name" }]}
              >
                <Input placeholder="Enter package name" />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: "Please enter the package description" }]}
              >
                <Input placeholder="Enter package description" />
              </Form.Item>
              <Form.Item
                label="Price"
                name="price"
                rules={[
                  { 
                    required: true, 
                    message: "Please enter the package price" 
                  },
                  { 
                    type: 'number',
                    min: 0,
                    message: 'Price must be a positive number'
                  }
                ]}
              >
                <InputNumber placeholder="Enter package price" style={{ width: "100%" }} />
              </Form.Item>
            </Form>
          </Modal>
        </div>
        <div className="managepackages_table">
        <Table
            columns={columns}
            dataSource={filteredPackages} // Use the filtered data
            pagination={{ pageSize: 6 }} // Pagination with 6 rows per page
            rowKey="_id" // Ensure each row has a unique key
          />
        </div>
        <Modal title="Update Package" open={isUpdateModalOpen} onOk={handleUpdate} onCancel={handleUpdateCancel}>
          <Form form={updateForm} layout="vertical">
            <Form.Item
              label="Package Name"
              name="packageName"
              rules={[{ required: true, message: "Please enter the package name" }]}
            >
              <Input placeholder="Enter package name" />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please enter the package description" }]}
            >
              <Input placeholder="Enter package description" />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[
                { 
                  required: true, 
                  message: "Please enter the package price" 
                },
                { 
                  type: 'number',
                  min: 0,
                  message: 'Price must be a positive number'
                }
              ]}
            >
              <InputNumber placeholder="Enter package price" style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default ManagePackages;
