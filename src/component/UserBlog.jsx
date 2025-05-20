import React, { useState, useEffect } from 'react';
import Footer from './Footer/Footer';
import axiosInstance from '../api/axios';
import { Calendar, Search, Tag, ArrowLeft, ThumbsUp, ThumbsDown } from 'lucide-react';
import NavBar from './Header/NavBar';
import { useNavigate, useParams } from 'react-router-dom';

const Card = ({ children, className }) => (
  <div className={`bg-green-50 border border-green-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>{children}</div>
);

const CardContent = ({ children, className }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Input = ({ placeholder, value, onChange, icon, className }) => (
  <div className={`relative ${className}`}>
    {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600">{icon}</span>}
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full p-3 pl-10 border-2 border-green-300 bg-green-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${className}`}
    />
  </div>
);

const Badge = ({ children, variant }) => (
  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
    variant === 'success' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'
  }`}>
    {children}
  </span>
);

// BlogDetail component to show a single blog post with comments
const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [reactionStatus, setReactionStatus] = useState({
    userLiked: false,
    userDisliked: false,
    likesCount: 0,
    dislikesCount: 0
  });
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("vetapp-token") || localStorage.getItem("token");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/blogs/${id}`);
        setBlog(response.data);
        setReactionStatus({
          userLiked: response.data.userLiked || false,
          userDisliked: response.data.userDisliked || false,
          likesCount: response.data.likesCount || 0,
          dislikesCount: response.data.dislikesCount || 0
        });
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  const formatContent = (content) => {
    return content.split('\n').map((paragraph, index) => 
      paragraph ? <p key={index} className="mb-3 text-green-900">{paragraph}</p> : <br key={index} />
    );
  };

  const goBack = () => {
    navigate('/blogs');
  };

  const redirectToLogin = () => {
    if (window.confirm("You need to log in to like or dislike blogs. Would you like to log in now?")) {
      navigate('/login');
    }
  };

  const handleLike = async () => {
    if (!isLoggedIn) {
      redirectToLogin();
      return;
    }

    try {
      const response = await axiosInstance.post(`/blogs/${id}/like`);
      console.log('Like response:', response.data);
      
      setReactionStatus({
        userLiked: response.data.userLiked,
        userDisliked: response.data.userDisliked,
        likesCount: response.data.likes,
        dislikesCount: response.data.dislikes
      });
    } catch (error) {
      console.error('Error liking blog:', error);
      if (error.response && error.response.status === 401) {
        redirectToLogin();
      } else {
        alert('There was an error processing your like. Please try again.');
      }
    }
  };

  const handleDislike = async () => {
    if (!isLoggedIn) {
      redirectToLogin();
      return;
    }

    try {
      const response = await axiosInstance.post(`/blogs/${id}/dislike`);
      console.log('Dislike response:', response.data);
      
      setReactionStatus({
        userLiked: response.data.userLiked,
        userDisliked: response.data.userDisliked,
        likesCount: response.data.likes,
        dislikesCount: response.data.dislikes
      });
    } catch (error) {
      console.error('Error disliking blog:', error);
      if (error.response && error.response.status === 401) {
        redirectToLogin();
      } else {
        alert('There was an error processing your dislike. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-50 flex justify-center items-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-50">
        <div className="flex justify-center items-center bg-green-800 bg-opacity-10 backdrop-blur-sm sticky top-0 z-10">
          <NavBar />
        </div>
        <div className="max-w-4xl mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600">Blog post not found</h1>
          <button 
            onClick={goBack}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={16} />
            Back to Blog List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-50">
      <div className="flex justify-center items-center bg-green-800 bg-opacity-10 backdrop-blur-sm sticky top-0 z-10">
        <NavBar />
      </div>
      
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <button 
          onClick={goBack}
          className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          Back to Blog List
        </button>

        <div className="bg-green-50 border border-green-200 rounded-xl shadow-sm">
          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-3xl font-semibold text-green-800 mb-2">{blog.title}</h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-green-700 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar size={16} className="text-green-600" />
                  {new Date(blog.createdAt).toLocaleString()}
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-200 text-green-800">
                  {blog.category}
                </span>
                <span className="flex items-center gap-1">
                  <Tag size={16} className="text-green-600" />
                  Dr. {blog.author?.name || 'Unknown Author'}
                </span>
              </div>
              <div className="h-px w-full bg-green-200 my-3"></div>
            </div>
            <div className="prose prose-green max-w-none text-green-800">
              {formatContent(blog.content)}
            </div>
            
            {/* Reactions Section */}
            <div className="flex items-center space-x-8 pt-4 mt-4 border-t border-green-200">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition ${
                  reactionStatus.userLiked 
                    ? 'bg-green-500 text-white'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                <ThumbsUp size={18} /> 
                <span>{reactionStatus.likesCount}</span>
              </button>
              <button 
                onClick={handleDislike}
                className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition ${
                  reactionStatus.userDisliked 
                    ? 'bg-red-500 text-white'
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                <ThumbsDown size={18} /> 
                <span>{reactionStatus.dislikesCount}</span>
              </button>
            </div>
            
            {blog.updatedAt && (
              <p className="text-xs text-green-600 italic mt-4">
                Last updated: {new Date(blog.updatedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const UserBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("vetapp-token") || localStorage.getItem("token");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get('/blogs');
        console.log('Blogs API Response:', response.data);
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatContent = (content) => {
    // Truncate content for preview
    const maxLength = 200;
    const truncated = content.length > maxLength 
      ? content.substring(0, maxLength) + '...' 
      : content;
      
    return truncated.split('\n').map((paragraph, index) => 
      paragraph ? <p key={index} className="mb-3 text-green-900">{paragraph}</p> : <br key={index} />
    );
  };

  const viewBlogDetails = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  const redirectToLogin = () => {
    if (window.confirm("You need to log in to like or dislike blogs. Would you like to log in now?")) {
      navigate('/login');
    }
  };

  const handleLike = async (e, blogId) => {
    // Stop event propagation to prevent navigation when clicking like button
    e.stopPropagation();
    
    if (!isLoggedIn) {
      redirectToLogin();
      return;
    }

    try {
      const response = await axiosInstance.post(`/blogs/${blogId}/like`);
      console.log('Like response:', response.data);
      
      // Update the blogs state with the new like count
      setBlogs(prevBlogs => 
        prevBlogs.map(blog => 
          blog._id === blogId ? {
            ...blog,
            likesCount: response.data.likes,
            dislikesCount: response.data.dislikes,
            userLiked: response.data.userLiked,
            userDisliked: response.data.userDisliked
          } : blog
        )
      );
    } catch (error) {
      console.error('Error liking blog:', error);
      if (error.response && error.response.status === 401) {
        redirectToLogin();
      } else {
        alert('There was an error processing your like. Please try again.');
      }
    }
  };

  const handleDislike = async (e, blogId) => {
    // Stop event propagation to prevent navigation when clicking dislike button
    e.stopPropagation();
    
    if (!isLoggedIn) {
      redirectToLogin();
      return;
    }

    try {
      const response = await axiosInstance.post(`/blogs/${blogId}/dislike`);
      console.log('Dislike response:', response.data);
      
      // Update the blogs state with the new dislike count
      setBlogs(prevBlogs => 
        prevBlogs.map(blog => 
          blog._id === blogId ? {
            ...blog,
            likesCount: response.data.likes,
            dislikesCount: response.data.dislikes,
            userLiked: response.data.userLiked,
            userDisliked: response.data.userDisliked
          } : blog
        )
      );
    } catch (error) {
      console.error('Error disliking blog:', error);
      if (error.response && error.response.status === 401) {
        redirectToLogin();
      } else {
        alert('There was an error processing your dislike. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-50">
      <div className="flex justify-center items-center bg-green-800 bg-opacity-10 backdrop-blur-sm sticky top-0 z-10">
        <NavBar />
      </div>
      
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-3">Pet Care Blog</h1>
          <div className="h-1 w-24 bg-green-600 mx-auto rounded-full"></div>
        </div>
        
        <Input
          placeholder="Search blogs by title, content or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-green-50"
          icon={<Search size={18} />}
        />

        <div className="space-y-6">
          {filteredBlogs.length === 0 ? (
            <Card>
              <CardContent>
                <div className="py-16 text-center">
                  <p className="text-green-700 font-medium">
                    {blogs.length === 0 
                      ? "No blog posts available yet." 
                      : "No matching blog posts found."}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredBlogs.map((blog) => (
              <Card key={blog._id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div onClick={() => viewBlogDetails(blog._id)}>
                    <h2 className="text-2xl font-semibold text-green-800 mb-2">{blog.title}</h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-green-700 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} className="text-green-600" />
                        {new Date(blog.createdAt).toLocaleString()}
                      </span>
                      <Badge variant="success">{blog.category}</Badge>
                      <span className="flex items-center gap-1">
                        <Tag size={16} className="text-green-600" />
                        Dr. {blog.author?.name || 'Unknown Author'}
                      </span>
                    </div>
                    <div className="h-px w-full bg-green-200 my-3"></div>
                  </div>
                  <div className="prose prose-green max-w-none text-green-800" onClick={() => viewBlogDetails(blog._id)}>
                    {formatContent(blog.content)}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={(e) => handleLike(e, blog._id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded ${
                          blog.userLiked 
                            ? 'bg-green-500 text-white' 
                            : 'text-green-700 hover:bg-green-100'
                        }`}
                      >
                        <ThumbsUp size={16} /> {blog.likesCount || 0}
                      </button>
                      <button 
                        onClick={(e) => handleDislike(e, blog._id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded ${
                          blog.userDisliked 
                            ? 'bg-red-500 text-white' 
                            : 'text-red-700 hover:bg-red-100'
                        }`}
                      >
                        <ThumbsDown size={16} /> {blog.dislikesCount || 0}
                      </button>
                    </div>
                    <button 
                      onClick={() => viewBlogDetails(blog._id)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Read More →
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export { UserBlogPage, BlogDetail };