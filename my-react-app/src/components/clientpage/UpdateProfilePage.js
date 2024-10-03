import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useState , useEffect } from 'react';
const UpdateProfile = () => {
  
  const [profile, setProfile] = useState(null);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const [passwordVisibility, setPasswordVisibility] = useState({
  //   oldPasswordVisible: false,
  //   newPasswordVisible: false,
  //   confirmPasswordVisible: false,
  // });

  // const togglePasswordVisibility = (field) => {
  //   setPasswordVisibility((prevState) => ({
  //     ...prevState,
  //     [field]: !prevState[field],
  //   }));
  // };


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get('http://127.0.0.1:8000/api/user/client/manage/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile data.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfile((prevProfile) => ({
      ...prevProfile,
      profile_picture: file,
    }));
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      profile_picture: file,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      for (const key in updatedProfile) {
          formData.append(key, updatedProfile[key]);
        }

      const token = localStorage.getItem('access');

      await axios.patch('http://127.0.0.1:8000/api/user/client/manage/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Fetch the updated profile data from the server
      const response = await axios.get('http://127.0.0.1:8000/api/user/client/manage/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the profile state with the new data
      setProfile(response.data);
      setUpdatedProfile(response.data); // Optionally clear updatedProfile state

      alert('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className="max-w-lg mx-auto p-6 mt-8">
      <h2 className="text-3xl font-thin text-brand-dark-blue mb-6 text-center">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Email Address */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-lg font-normal text-brand-blue mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

          {/* Contact Person */}
          <div className="mb-4">
          <label htmlFor="contactPerson" className="block text-lg font-normal text-brand-blue mb-2">
            Contact Person
          </label>
          <input
            type="text"
            id="contactPerson"
            name="contact_person"
            value={profile.contact_person}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Old Password
        <div className="mb-4 relative">
          <label htmlFor="oldPassword" className="block text-lg font-normal text-brand-blue mb-2">
            Old Password
          </label>
          <input
            type={passwordVisibility.oldPasswordVisible ? "text" : "password"}
            id="oldPassword"
            name="oldPassword"
            value={profile.oldPassword}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <span
            className="absolute right-3 top-10 text-gray-600 hover:text-gray-800 cursor-pointer"
            onClick={() => togglePasswordVisibility('oldPasswordVisible')}
          >
            {passwordVisibility.oldPasswordVisible ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

      
        <div className="mb-4 relative">
          <label htmlFor="newPassword" className="block text-lg font-normal text-brand-blue mb-2">
            New Password
          </label>
          <input
            type={passwordVisibility.newPasswordVisible ? "text" : "password"}
            id="newPassword"
            name="newPassword"
            value={profile.newPassword}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <span
            className="absolute right-3 top-10 text-gray-600 hover:text-gray-800 cursor-pointer"
            onClick={() => togglePasswordVisibility('newPasswordVisible')}
          >
            {passwordVisibility.newPasswordVisible ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        
        <div className="mb-4 relative">
          <label htmlFor="confirmPassword" className="block text-lg font-normal text-brand-blue mb-2">
            Confirm New Password
          </label>
          <input
            type={passwordVisibility.confirmPasswordVisible ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={profile.confirmPassword}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div> */}

        {/* Company Name */}
        <div className="mb-4">
          <label htmlFor="companyName" className="block text-lg font-normal text-brand-blue mb-2">
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            name="company_name"
            value={profile.company_name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label htmlFor="address" className="block text-lg font-normal text-brand-blue mb-2">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={profile.address}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

      
        
        {/* Profile Picture */}
        <div className="mb-4">
          <label htmlFor="profile_picture" className="block text-lg font-normal text-brand-blue mb-2">
            Profile Picture
          </label>
          <input
            type="file"
            id="profile_picture"
            name="profile_picture"
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            accept="image/*"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-brand-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
