import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import axios from "axios";
import PageLoader from '../Components/PageLoader';

const SelfDiary = () => {
  const [keyInput, setKeyInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [diaryEntry, setDiaryEntry] = useState("");
  const [previousEntries, setPreviousEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showPrevious, setShowPrevious] = useState(false);

  // Fetch previous entries from the server
  useEffect(() => {
    if (isAuthenticated) {
      axios
        .get("/api/getPreviousEntries")
        .then((response) => {
          setPreviousEntries(response.data);
        })
        .catch((error) => {
          console.error("Error fetching previous entries:", error);
        });
    }
  }, [isAuthenticated]);

  // Handle key submission
  const handleKeySubmit = () => {
    const correctKey = "12345"; // Replace with your secure method
    if (keyInput === correctKey) {
      setIsAuthenticated(true);
      setShowPopup(false);
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  // Handle diary entry submission
  const handleDiarySubmit = () => {
    if (!diaryEntry.trim()) {
      alert("Please write something before submitting.");
      return;
    }
  console.log("Diary entry")
    setIsLoading(true);
    axios
      .post(
        "http://localhost:8000/diary/saveDiaryEntry",
        { entry: diaryEntry }, // Request body
        {
          headers: { accessKey: keyInput }, // Include accessKey in headers
        }
      )
      .then(() => {
        alert("Diary entry saved successfully!");
        setDiaryEntry("");
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error saving diary entry:", error);
        setIsLoading(false);
      });
  };
  

  return (
    <div className="min-h-screen bg-green-900 text-white flex items-center justify-center bg-opacity-90">
      {/* Key Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-green bg-opacity-70 flex items-center justify-center">
          <div className="bg-green-800 p-6 rounded shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">Enter Access Key</h2>
            <input
              type="text"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Enter key"
              className="border p-2 rounded w-full mb-2 bg-gray-200 text-green"
            />
            {showError && <p className="text-red-500 text-sm">Invalid key. Please try again.</p>}
            <button
              onClick={handleKeySubmit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {isAuthenticated && (
        <div className="max-w-3xl w-full bg-green-900 p-6 rounded shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6">Self Diary</h1>

          {/* Diary Entry Section */}
          <textarea
            value={diaryEntry}
            onChange={(e) => setDiaryEntry(e.target.value)}
            placeholder="Write your thoughts here..."
            className="w-full h-40 p-4 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-800 text-white rounded-3xl"
          ></textarea>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleDiarySubmit}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <PageLoader 
                  isLoading={isLoading} 
                  loadingMessage="Saving Entry..."
                  dynamicMessages={[
                    'Saving your thoughts...',
                    'Processing entry...',
                    'Almost done...'
                  ]}
                />
              ) : (
                "Submit"
              )}
            </button>
          </div>

          {/* Show Previous Entries Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowPrevious(!showPrevious)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              {showPrevious ? "Hide Previous Entries" : "Show Previous Entries"}
            </button>
          </div>

          {/* Previous Entries Section */}
          {showPrevious && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Previous Entries</h2>
              <ul className="space-y-4">
                {previousEntries.map((entry, index) => (
                  <li
                    key={index}
                    className="bg-gray-800 p-4 rounded shadow hover:shadow-lg hover:scale-105 transition transform flex justify-between items-center"
                  >
                    <p className="text-gray-200">{entry}</p>
                    <div className="flex space-x-3">
                      <FaEdit className="text-blue-400 cursor-pointer hover:text-blue-500" />
                      <FaTrash className="text-red-400 cursor-pointer hover:text-red-500" />
                      <FaEye className="text-green-400 cursor-pointer hover:text-green-500" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelfDiary;
