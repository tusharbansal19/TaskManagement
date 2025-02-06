import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import Navbar from '../Components/Navbar';
import Loader from '../Components/Loader';
import PostCard from '../Components/PostCard ';
import Footer from '../Components/Footer';



const HomePage = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false); // For search-specific loader
  const [postDataArray, setPostDataArray] = useState([]); // New array to store post data
  const [suggestions, setSuggestions] = useState([]); // For recommendations dropdown

  // Fetch all posts from API on mount
  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://react-postcard-1.onrender.com/api/posts'); // Replace with your API
      const posts = response.data;

      // Store necessary data in the new state
      const newPostDataArray = posts.map((post) => ({
        id: post._id,
        title: post.title,
        author: post.author,
      }));
      setPostDataArray(newPostDataArray);

      setAllPosts(posts);
      setFilteredPosts(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Show suggestions based on input
    if (value.trim()) {
      const matchingSuggestions = postDataArray.filter(
        (post) =>
          post.title.toLowerCase().includes(value.toLowerCase()) ||
          post.author.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(matchingSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Handle search button click
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // If search query is empty, fetch all posts
      fetchAllPosts();
      return;
    }

    // Filter post IDs based on search query (by title or author)
    const matchingPostIds = postDataArray
      .filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((post) => post.id);

    if (matchingPostIds.length === 0) {
      setFilteredPosts([]);
      return;
    }

    setSearching(true);
    try {
      // Fetch posts for matching IDs
      const promises = matchingPostIds.map((id) =>
        axios.get(`https://react-postcard-1.onrender.com/api/posts/${id}`)
      );
      const responses = await Promise.all(promises);

      const matchingPosts = responses.map((res) => res.data);
      setFilteredPosts(matchingPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setFilteredPosts([]);
    } finally {
      setSearching(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title); // Populate input with selected suggestion
    setSuggestions([]); // Close suggestions dropdown
  };

  return (
    <>
      <div className="mt-20 ml-[0px] sm:ml-[10%]">
        {/* Search Bar */}
        <div className="p-4 flex relative w-full justify-center">
          <div className="relative w-full">
            <input
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by Post Name or Author"
              className="bg-black text-white w-[60%] p-3 rounded-l-2xl border-2 border-black"
            />
            <button
              onClick={handleSearch}
              className="searchButton border-2 border-black rounded-r-3xl p-3 hover:bg-black hover:text-white"
            >
              Search
            </button>
            {/* Recommendations Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute bg-white border border-black rounded-lg mt-1 z-10 w-[60%]">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {suggestion.title} - <span className="text-gray-500">{suggestion.author}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Posts Display */}
        <div className=" grid  grid-cols-1 gap-10 pr-10 sm:pr-32">
          {loading || searching ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-red-500"></div>
            </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <div className="p-32 w-full flex items-center justify-center text-red-700 text-[40px] bold">
              <h1>NOT FOUND</h1>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
