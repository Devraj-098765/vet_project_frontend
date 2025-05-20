import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../src/api/axios";
import SideBarVeterinarian from './SideBarVeterinarian/SideBarVeterinarian';
import { Search, Edit, Trash2, X, Check, PlusCircle, Filter, BookOpen, ThumbsUp, ThumbsDown } from 'lucide-react';

const Button = ({ children, variant, onClick, className }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md flex items-center justify-center transition-all ${
      variant === 'success' ? 'bg-teal-600 text-white hover:bg-teal-700' :
      variant === 'danger' ? 'bg-red-500 text-white hover:bg-red-600' :
      'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
    } ${className}`}
  >
    {children}
  </button>
);

const Input = ({ placeholder, value, onChange, icon, className }) => (
  <div className={`relative ${className}`}>
    {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500">{icon}</span>}
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full p-3 pl-10 border border-teal-100 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white ${className}`}
    />
  </div>
);

const Textarea = ({ placeholder, value, onChange, className }) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full p-3 border border-teal-100 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white ${className}`}
    rows="6"
  />
);

const Badge = ({ children, variant }) => (
  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
    variant === 'success' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-800'
  }`}>
    {children}
  </span>
);

const VetBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const navigate = useNavigate();

  const categories = [
    "Pet Nutrition", "Preventive Care", "Common Diseases", 
    "Surgery", "Emergency Care", "Animal Behavior", "Pet Wellness"
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axiosInstance.get('/blogs/my-blogs');
      // Note: If you need author.name in this component, update the backend /blogs/my-blogs route to populate('author', 'name')
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handlePost = async () => {
    if (!title.trim() || !content.trim() || !category) {
      alert('Please fill in all fields');
      return;
    }

    try {
      if (editing) {
        await axiosInstance.put(`/blogs/${editing._id}`, { title, content, category });
      } else {
        await axiosInstance.post('/blogs', { title, content, category });
      }
      fetchBlogs();
      resetForm();
      setIsFormExpanded(false);
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  const handleEdit = (blog) => {
    setTitle(blog.title);
    setContent(blog.content);
    setCategory(blog.category);
    setEditing(blog);
    setIsFormExpanded(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await axiosInstance.delete(`/blogs/${id}`);
        fetchBlogs();
        if (editing && editing._id === id) resetForm();
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('');
    setEditing(null);
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const blogStats = {
    total: blogs.length,
    categories: [...new Set(blogs.map(blog => blog.category))].length,
    likes: blogs.reduce((total, blog) => total + (blog.likesCount || 0), 0)
  };

  const formatContent = (content) => {
    return content.split('\n').map((paragraph, index) => 
      paragraph ? <p key={index} className="mb-3 text-gray-700">{paragraph}</p> : <br key={index} />
    );
  };

  const toggleForm = () => {
    setIsFormExpanded(!isFormExpanded);
    if (isFormExpanded) resetForm();
  };

  return (
    <div className="flex">
      <SideBarVeterinarian />
      <div className="flex-1 bg-gradient-to-br from-blue-50/40 to-teal-50/40 min-h-screen">
        <div className="max-w-5xl mx-auto p-6">
          <div className="text-center mb-10 pt-8">
            <div className="inline-block bg-gradient-to-r from-teal-600 to-teal-400 text-black px-6 py-2 rounded-full mb-4">
              <h1 className="text-xl font-semibold">Veterinary Knowledge Hub</h1>
            </div>
            <p className="text-teal-800">Share your expertise and insights with the pet care community</p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-md shadow-sm p-4 border-t-4 border-teal-400">
              <div className="flex flex-col items-center">
                <div className="bg-teal-100 p-3 rounded-full mb-2">
                  <BookOpen size={20} className="text-teal-600" />
                </div>
                <p className="text-sm text-teal-600 font-medium">Total Posts</p>
                <p className="text-2xl font-semibold text-teal-800">{blogStats.total}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-md shadow-sm p-4 border-t-4 border-blue-400">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-2">
                  <Filter size={20} className="text-blue-600" />
                </div>
                <p className="text-sm text-blue-600 font-medium">Categories</p>
                <p className="text-2xl font-semibold text-blue-800">{blogStats.categories}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-md shadow-sm p-4 border-t-4 border-green-400">
              <div className="flex flex-col items-center">
                <div className="bg-green-100 p-3 rounded-full mb-2">
                  <ThumbsUp size={20} className="text-green-600" />
                </div>
                <p className="text-sm text-green-600 font-medium">Total Likes</p>
                <p className="text-2xl font-semibold text-green-800">{blogStats.likes}</p>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Button onClick={toggleForm} variant="success" className="py-2 px-5 shadow-md">
              <PlusCircle size={18} className="mr-2" />
              {isFormExpanded ? "Cancel" : "New Blog Post"}
            </Button>
            
            <div className="flex-1 flex items-center gap-4">
              <Input
                placeholder="Search your blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} />}
                className="w-full shadow-sm"
              />
              <div className="hidden md:flex items-center bg-white rounded-md border border-teal-100 px-3 py-2 text-teal-700 shadow-sm">
                <Filter size={18} className="mr-2 text-teal-500" />
                <span>{filteredBlogs.length} posts</span>
              </div>
            </div>
          </div>

          {/* Post creation/edit form */}
          {isFormExpanded && (
            <div className="bg-white rounded-md shadow-md mb-8 p-6 border-l-4 border-teal-500">
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-teal-800 pb-2 border-b border-teal-100">
                  {editing ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h2>
                
                <Input
                  placeholder="Enter an engaging title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                
                <Textarea
                  placeholder="Share your veterinary knowledge and insights..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border border-teal-100 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                
                <div className="flex gap-3 pt-3 border-t border-teal-100">
                  <Button onClick={handlePost} variant="success" className="py-2 shadow-sm">
                    <Check size={18} className="mr-2" />
                    {editing ? 'Update Post' : 'Publish Post'}
                  </Button>
                  <Button onClick={resetForm} className="py-2 shadow-sm">
                    <X size={18} className="mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Empty state or blog posts */}
          {filteredBlogs.length === 0 ? (
            <div className="bg-white rounded-md shadow-md p-8 border border-teal-100">
              <div className="text-center">
                <div className="bg-gradient-to-r from-teal-100 to-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={28} className="text-teal-600" />
                </div>
                <h3 className="text-lg font-medium text-teal-800 mb-1">No Blog Posts Yet</h3>
                <p className="text-teal-600 mb-0 max-w-md mx-auto">
                  Share your veterinary knowledge by creating your first post!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBlogs.map((blog) => (
                <div key={blog._id} className="bg-white rounded-md shadow-md overflow-hidden border border-teal-100">
                  <div className="h-1 bg-gradient-to-r from-teal-400 to-blue-400"></div>
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="flex justify-between items-start">
                        <h2 className="text-xl font-medium text-teal-800">{blog.title}</h2>
                        <Badge variant="success">{blog.category}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-teal-600 mt-2">
                        <span>{new Date(blog.createdAt).toLocaleString()}</span>
                        {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                          <span className="text-xs text-teal-500 italic">
                            • Updated: {new Date(blog.updatedAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-4 rounded-md mb-4 border border-teal-100">
                      {formatContent(blog.content)}
                    </div>
                    
                    <div className="flex flex-wrap justify-between items-center pt-3 border-t border-teal-100 gap-4">
                      <div className="flex gap-2">
                        <Button onClick={() => handleEdit(blog)} className="py-1 px-3 shadow-sm">
                          <Edit size={16} className="mr-1" />
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(blog._id)} className="py-1 px-3 shadow-sm">
                          <Trash2 size={16} className="mr-1" />
                          Delete
                        </Button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-green-600">
                          <ThumbsUp size={16} />
                          <span>{blog.likesCount || 0}</span>
                        </span>
                        <span className="flex items-center gap-1 text-red-400">
                          <ThumbsDown size={16} />
                          <span>{blog.dislikesCount || 0}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VetBlogPage;