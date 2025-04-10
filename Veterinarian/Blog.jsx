// VetBlogPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../src/api/axios"
import SideBarVeterinarian from './SideBarVeterinarian/SideBarVeterinarian';
import { Calendar, Search, Edit, Trash2, X, Check } from 'lucide-react';

const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
);

const CardContent = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const Button = ({ children, variant, onClick, className }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded ${
      variant === 'success' ? 'bg-green-600 text-white' :
      variant === 'danger' ? 'bg-red-600 text-white' :
      'bg-gray-200 text-gray-800'
    } ${className}`}
  >
    {children}
  </button>
);

const Input = ({ placeholder, value, onChange, icon, className }) => (
  <div className={`relative ${className}`}>
    {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full p-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
    />
  </div>
);

const Textarea = ({ placeholder, value, onChange, className }) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
    rows="4"
  />
);

const Badge = ({ children, variant }) => (
  <span className={`px-2 py-1 text-xs rounded-full ${
    variant === 'success' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
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
    categories: [...new Set(blogs.map(blog => blog.category))].length
  };

  const formatContent = (content) => {
    return content.split('\n').map((paragraph, index) => 
      paragraph ? <p key={index} className="mb-2">{paragraph}</p> : <br key={index} />
    );
  };

  const toggleForm = () => {
    setIsFormExpanded(!isFormExpanded);
    if (isFormExpanded) resetForm();
  };

  return (
    <div className="flex">
      <SideBarVeterinarian />
      <div className="flex-1 bg-green-50 min-h-screen">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <h1 className="text-3xl font-bold text-green-800 text-center">Veterinarian Blog Dashboard</h1>

          <div className="flex justify-between items-center">
            <div className="space-x-4">
              <span className="text-sm text-gray-600">Total Posts: {blogStats.total}</span>
              <span className="text-sm text-gray-600">Categories: {blogStats.categories}</span>
            </div>
            <Button onClick={toggleForm} variant="success">
              {isFormExpanded ? 'Close Form' : 'New Blog Post'}
            </Button>
          </div>

          {isFormExpanded && (
            <Card>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Blog Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Write your blog content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <Button onClick={handlePost} variant="success">
                    <Check size={18} className="mr-2" />
                    {editing ? 'Update' : 'Post'}
                  </Button>
                  <Button onClick={resetForm}>Clear</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Input
            placeholder="Search your blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
            className="bg-white"
          />

          <div className="space-y-4">
            {filteredBlogs.length === 0 ? (
              <Card>
                <CardContent>
                  <div className="py-12 text-center">
                    <p className="text-gray-500">No blog posts yet. Create your first post!</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredBlogs.map((blog) => (
                <Card key={blog._id}>
                  <CardContent className="space-y-3">
                    <div>
                      <h2 className="text-xl font-semibold text-green-800">{blog.title}</h2>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(blog.createdAt).toLocaleString()}
                        </span>
                        <Badge variant="success">{blog.category}</Badge>
                      </div>
                    </div>
                    <div className="prose prose-green max-w-none">
                      {formatContent(blog.content)}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleEdit(blog)}>
                        <Edit size={18} className="mr-2" />
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(blog._id)}>
                        <Trash2 size={18} className="mr-2" />
                        Delete
                      </Button>
                    </div>
                    {blog.updatedAt && (
                      <p className="text-xs text-gray-500 italic">
                        Last updated: {new Date(blog.updatedAt).toLocaleString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VetBlogPage;