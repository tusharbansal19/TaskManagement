import React, { useState } from "react";
import { FaStar, FaTags, FaUser, FaFileAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners"; // Spinner loader component

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState("");

  const styleSettings = useSelector((state) => state.style);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPost = {
      title,
      content,
      ratings: rating,
      author,
     
      link,
    };

    setLoading(true);

    try {
      await axios.post("https://react-postcard-1.onrender.com/api/posts", newPost, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Post created successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Clear the form
      setTitle("");
      setContent("");
      setRating(0);
      setAuthor("");
      setTags("");
      setLink("");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create post. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="flex flex-col sm:flex-row min-h-full w-[100vw] justify-end to-gray-900 "
      style={{
        background: styleSettings.bgGradient || styleSettings.bgColor,
        color: styleSettings.textColor || "black",
      }}
    >
      <ToastContainer />
      <h2
        className="text-3xl  font-semibold mb-6 mx-auto mt-[20%] text-white"
        style={{
          backgroundColor: styleSettings.bgColor,
          color: styleSettings.textColor || "black",
        }}
      >
        <div className="flex justify-center items-center">
          <FaUser
            className="text-5xl text-purple-500"
            style={{ color: styleSettings.iconColor || "black" }}
          />
          <span className="text-xl ml-2">Author</span>
        </div>
        Create a New Post
      </h2>

      <div className="p-6 pr-20 py-32 bg-white mt-7 w-[50%] text-gray-800 shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105 rounded-r-3xl">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl">
          <div className="flex flex-col">
            <label
              htmlFor="title"
              className="text-lg font-semibold flex items-center space-x-2"
            >
              <FaFileAlt className="text-purple-500" />
              <span>Post Title</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              className="p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="content"
              className="text-lg font-semibold flex items-center space-x-2"
            >
              <FaFileAlt className="text-brown-500" />
              <span>Post Content</span>
            </label>
            <textarea
              id="content"
              maxLength={500}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter post content"
              className="p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
              rows="6"
              required
            ></textarea>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <span className="text-lg font-semibold">LINK of(img):</span>
            <input
              type="text"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="border-2 w-[80%] p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-500"
            />
          </div>

          <div className="flex flex-col mt-6">
            <label
              htmlFor="author"
              className="text-lg font-semibold flex items-center space-x-2"
            >
              <FaUser className="text-purple-500" />
              <span>Author</span>
            </label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author's name"
              className="p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-purple-400 text-white py-2 px-6 rounded-md hover:shadow-lg hover:scale-105 transition duration-300 flex items-center"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
