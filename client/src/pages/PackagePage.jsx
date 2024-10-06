import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PackagePage = () => {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('/api/package/getPackages');
        setPackages(response.data.packages);
      } catch (error) {
        console.error('Failed to fetch packages', error);
      }
    };

    fetchPackages();
  }, []);

  const handleMoreInfoClick = (id) => {
    // Increment popularity score when viewing details
    axios.post(`/api/package/updatePopularity/${id}`);
    navigate(`/packages/${id}`);
  };

  return (
    <div className="pkg_container">
      {packages.map(pkg => (
        <div key={pkg.packageId} className="pkg_card">
          <img className="pkg_image" src={pkg.packageImage} alt={pkg.packageName} />
          <div className="pkg_info">
            <h2 className="pkg_title">{pkg.packageName}</h2>
            <p className="pkg_size">Size: {pkg.size} Person</p>
          </div>
          <div className="pkg_pricing">
            {pkg.currentDiscount > 0 && (
              <div className="pkg_original_price">
                Original Price: <strike>Rs {pkg.originalPrice}</strike>
              </div>
            )}
            <div className="pkg_discounted_price">
              <span className="pkg_price">Rs {pkg.price}</span>
              {pkg.currentDiscount > 0 && (
                <span className="pkg_discount_badge">{pkg.currentDiscount}% OFF</span>
              )}
            </div>
          </div>
          <div className="pkg_footer">
            <button
              className="pkg_button"
              onClick={() => handleMoreInfoClick(pkg._id)}
            >
              More Info
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PackagePage;