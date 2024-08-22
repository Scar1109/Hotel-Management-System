import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd"; // Import Antd message component

function UserProfilePage() {

    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: ''
    });

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            setUser(currentUser);
            setFormData({
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                email: currentUser.email,
                username: currentUser.username
            });
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/user/updateUser', {
                userID: user.userID,
                ...formData
            });

            const updatedUser = response.data.user;
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setIsEditing(false);

            // Show success message
            message.success('Profile updated successfully');
        } catch (error) {
            console.error('Failed to update user', error);

            // Show error message
            message.error('Failed to update profile. Please try again.');
        }
    };

    return (
        <div className={`user-profile-page-1234`}>
            <div className={`profile-card-1234`}>
                <div className={`profile-header-1234`}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/1200px-Windows_10_Default_Profile_Picture.svg.png" alt="Profile" />
                    <div className={`profile-info-1234`}>
                        <h3>{user.firstName} {user.lastName}</h3>
                        <p>{user.userType}</p>
                    </div>
                </div>
                <div className={`profile-details-1234`}>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                </div>
                <button className={`edit-button-1234`} onClick={handleEdit}>Edit Profile</button>
            </div>

            {isEditing && (
                <div className={`edit-modal-1234`}>
                    <div className={`modal-content-1234`}>
                        <h3>Edit Profile</h3>
                        <label>
                            First Name:
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                        </label>
                        <label>
                            Last Name:
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                        </label>
                        <label>
                            Email:
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
                        </label>
                        <label>
                            Username:
                            <input type="text" name="username" value={formData.username} onChange={handleInputChange} />
                        </label>
                        <div className={`modal-buttons-1234`}>
                            <button className={`save-button-1234`} onClick={handleSave}>Save</button>
                            <button className={`cancel-button-1234`} onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserProfilePage;
