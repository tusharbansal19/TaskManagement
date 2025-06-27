import React, { useState } from 'react';
import { User, Mail, Briefcase, Edit, Save, X, Camera, Sun, Moon } from 'lucide-react';

// Reusable Button component (copied for self-containment)
const Button = ({ children, onClick, className = '', variant = 'primary', disabled = false, icon: Icon = null }) => {
  const baseStyle = "px-4 py-2 rounded-full font-semibold transition-all duration-300 transform-gpu active:scale-95 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-400",
    outline: "border-2 border-gray-300 text-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 focus:ring-gray-500",
    ghost: "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus:ring-transparent",
    link: "text-blue-600 hover:underline dark:text-blue-400",
  };
  const disabledStyle = "opacity-50 cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className} ${disabled ? disabledStyle : 'hover:scale-105'}`}
      disabled={disabled}
    >
      {Icon && <Icon size={20} className={children ? "mr-2" : ""} />}
      {children}
    </button>
  );
};

// Reusable Modal component (copied for self-containment)
const Modal = ({ isOpen, onClose, title, children, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className={`
        bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform scale-95 animate-scale-in
        ${isDarkMode ? 'dark:bg-gray-900 dark:text-gray-100 border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'}
      `}>
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{title}</h3>
          <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-red-500">
            <X size={28} />
          </Button>
        </div>
        <div className="text-gray-700 dark:text-gray-200 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};


const ProfileSection = ({ isDarkMode, toggleDarkMode }) => {
  const [profile, setProfile] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    bio: 'Passionate UI/UX Designer with a knack for creating intuitive and engaging user experiences. Always learning and exploring new design trends.',
    role: 'UI/UX Designer',
    avatar: 'https://placehold.co/100x100/A78BFA/ffffff?text=JD', // Placeholder image
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditClick = () => {
    setEditedProfile({ ...profile }); // Reset editedProfile to current profile
    setShowEditModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setProfile({ ...editedProfile });
    setShowEditModal(false);
    // In a real application, you would send editedProfile to a backend API here
    console.log('Profile saved:', editedProfile);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    // In a real application, handle image upload
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`min-h-screen p-6 md:p-10 flex flex-col items-center justify-center
      ${isDarkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}
      font-sans antialiased transition-colors duration-500`}>

      <div className={`
        relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 md:p-12
        transform transition-all duration-700 ease-in-out hover:scale-[1.01]
        ${isDarkMode ? 'dark:bg-gray-800 dark:shadow-xl border border-gray-700' : 'border border-gray-100'}
      `}>
        {/* Dark Mode Toggle - positioned top right */}
        <div className="absolute top-6 right-6">
          <Button onClick={toggleDarkMode} variant="ghost" className="p-2">
            {isDarkMode ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} className="text-gray-600" />}
          </Button>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left mb-8">
          <div className="relative mb-6 md:mb-0 md:mr-8 group">
            <img
              src={profile.avatar}
              alt="Profile Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 dark:border-blue-400 shadow-lg
                transition-all duration-300 transform group-hover:scale-105 group-hover:rotate-3"
            />
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all duration-300">
              <Camera size={30} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2 animate-fade-in-up">
              {profile.name}
            </h2>
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center justify-center md:justify-start">
              <Briefcase size={20} className="mr-2 text-gray-500 dark:text-gray-400" />
              {profile.role}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg">
              {profile.bio}
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
              <Mail size={24} className="text-blue-500 dark:text-blue-400 mr-4" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
              <User size={24} className="text-purple-500 dark:text-purple-400 mr-4" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">janedoe_design</p> {/* Mock data */}
              </div>
            </div>
            {/* Add more contact details if needed */}
          </div>
        </div>

        {/* Edit Button */}
        <div className="mt-10 text-center">
          <Button
            variant="primary"
            onClick={handleEditClick}
            icon={Edit}
            className="px-8 py-3 text-lg shadow-xl hover:shadow-2xl"
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Profile" isDarkMode={isDarkMode}>
        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 rounded-full group cursor-pointer overflow-hidden">
              <img
                src={editedProfile.avatar}
                alt="Avatar Preview"
                className="w-full h-full object-cover rounded-full border-2 border-blue-400"
              />
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleAvatarChange}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera size={28} className="text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Click to change avatar</p>
          </div>

          {/* Name Input */}
          <div className="relative group">
            <label htmlFor="editName" className={`absolute -top-3 left-3 px-1 text-xs font-semibold transition-all duration-200
              ${isDarkMode ? 'bg-gray-900 text-gray-400 group-focus-within:text-blue-400' : 'bg-white text-gray-500 group-focus-within:text-blue-600'}
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent
              pointer-events-none z-10
            `}>Full Name</label>
            <input
              id="editName"
              type="text"
              name="name"
              value={editedProfile.name}
              onChange={handleChange}
              className={`
                peer border-2 p-3 rounded-xl w-full focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300
                ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-transparent' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-transparent'}
                shadow-sm hover:shadow-md dark:shadow-lg dark:hover:shadow-xl
              `}
              placeholder=" "
              required
            />
          </div>

          {/* Email Input */}
          <div className="relative group">
            <label htmlFor="editEmail" className={`absolute -top-3 left-3 px-1 text-xs font-semibold transition-all duration-200
              ${isDarkMode ? 'bg-gray-900 text-gray-400 group-focus-within:text-blue-400' : 'bg-white text-gray-500 group-focus-within:text-blue-600'}
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent
              pointer-events-none z-10
            `}>Email Address</label>
            <input
              id="editEmail"
              type="email"
              name="email"
              value={editedProfile.email}
              onChange={handleChange}
              className={`
                peer border-2 p-3 rounded-xl w-full focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300
                ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-transparent' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-transparent'}
                shadow-sm hover:shadow-md dark:shadow-lg dark:hover:shadow-xl
              `}
              placeholder=" "
              required
            />
          </div>

          {/* Role Input */}
          <div className="relative group">
            <label htmlFor="editRole" className={`absolute -top-3 left-3 px-1 text-xs font-semibold transition-all duration-200
              ${isDarkMode ? 'bg-gray-900 text-gray-400 group-focus-within:text-blue-400' : 'bg-white text-gray-500 group-focus-within:text-blue-600'}
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent
              pointer-events-none z-10
            `}>Role</label>
            <input
              id="editRole"
              type="text"
              name="role"
              value={editedProfile.role}
              onChange={handleChange}
              className={`
                peer border-2 p-3 rounded-xl w-full focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300
                ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-transparent' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-transparent'}
                shadow-sm hover:shadow-md dark:shadow-lg dark:hover:shadow-xl
              `}
              placeholder=" "
              required
            />
          </div>

          {/* Bio Textarea */}
          <div className="relative group">
            <label htmlFor="editBio" className={`absolute -top-3 left-3 px-1 text-xs font-semibold transition-all duration-200
              ${isDarkMode ? 'bg-gray-900 text-gray-400 group-focus-within:text-blue-400' : 'bg-white text-gray-500 group-focus-within:text-blue-600'}
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent
              pointer-events-none z-10
            `}>Biography</label>
            <textarea
              id="editBio"
              name="bio"
              value={editedProfile.bio}
              onChange={handleChange}
              rows="4"
              className={`
                peer border-2 p-3 rounded-xl w-full focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-y
                ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-transparent' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-transparent'}
                shadow-sm hover:shadow-md dark:shadow-lg dark:hover:shadow-xl
              `}
              placeholder=" "
              required
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowEditModal(false)}
              className="hover:scale-105"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Save}
              className="hover:scale-105"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfileSection;