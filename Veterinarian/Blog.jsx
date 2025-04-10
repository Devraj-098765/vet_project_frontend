import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../src/api/axios"
import SideBarVeterinarian from './SideBarVeterinarian/SideBarVeterinarian';
import { Calendar, Search, Edit, Trash2, X, Check, PlusCircle, Filter, BookOpen } from 'lucide-react';

const Card = ({ children, className }) => (
  <div className={`bg-white rounded-xl shadow-lg border border-green-100 transition-all hover:shadow-xl ${className}`}>{children}</div>
);

const CardContent = ({ children, className }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Button = ({ children, variant, onClick, className }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg flex items-center justify-center transition-all ${
      variant === 'success' ? 'bg-green-700 text-white hover:bg-green-800' :
      variant === 'danger' ? 'bg-red-500 text-white hover:bg-red-600' :
      'bg-green-100 text-green-800 hover:bg-green-200'
    } ${className}`}
  >
    {children}
  </button>
);

const Input = ({ placeholder, value, onChange, icon, className }) => (
  <div className={`relative ${className}`}>
    {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600">{icon}</span>}
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full p-3 pl-10 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50 ${className}`}
    />
  </div>
);

const Textarea = ({ placeholder, value, onChange, className }) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50 ${className}`}
    rows="6"
  />
);

const Badge = ({ children, variant }) => (
  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
    variant === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-800'
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
      <div className="flex-1 bg-gradient-to-br from-green-50 to-green-100 min-h-screen">
        <div className="max-w-5xl mx-auto p-8 space-y-8">
          <div className="flex flex-col items-center mb-12">
            <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mb-4">
              <BookOpen size={28} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-green-800">Veterinary Knowledge Hub</h1>
            <p className="text-green-600 mt-2">Share your expertise with the pet community</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center border-l-4 border-green-600">
            <div className="flex space-x-8">
              <div className="flex flex-col">
                <span className="text-sm text-green-600 font-medium">Total Posts</span>
                <span className="text-2xl font-bold text-green-800">{blogStats.total}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-green-600 font-medium">Categories</span>
                <span className="text-2xl font-bold text-green-800">{blogStats.categories}</span>
              </div>
            </div>
            <Button onClick={toggleForm} variant="success" className="py-3 px-6 font-medium">
              {isFormExpanded ? (
                <>
                  <X size={18} className="mr-2" />
                  Close Form
                </>
              ) : (
                <>
                  <PlusCircle size={18} className="mr-2" />
                  New Blog Post
                </>
              )}
            </Button>
          </div>

          {isFormExpanded && (
            <Card className="border-t-4 border-t-green-600">
              <CardContent className="space-y-5">
                <h2 className="text-xl font-semibold text-green-800 mb-4">
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
                  className="w-full p-3 border border-green-200 rounded-lg bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="flex gap-3 pt-2">
                  <Button onClick={handlePost} variant="success" className="py-3 px-6 font-medium">
                    <Check size={18} className="mr-2" />
                    {editing ? 'Update Post' : 'Publish Post'}
                  </Button>
                  <Button onClick={resetForm} className="py-3 px-6 font-medium">
                    <X size={18} className="mr-2" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center gap-4">
            <Input
              placeholder="Search your blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={18} />}
              className="bg-white flex-grow"
            />
            <div className="flex items-center bg-white rounded-lg border border-green-200 px-3 py-2 text-green-700">
              <Filter size={18} className="mr-2" />
              <span>{filteredBlogs.length} posts</span>
            </div>
          </div>

          <div className="space-y-6">
            {filteredBlogs.length === 0 ? (
              <Card>
                <CardContent>
                  <div className="py-16 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen size={32} className="text-green-700" />
                    </div>
                    <p className="text-gray-500 text-lg">No blog posts yet. Create your first post!</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredBlogs.map((blog) => (
                <Card key={blog._id} className="overflow-hidden">
                  <div className="h-2 bg-green-700"></div>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-start">
                        <h2 className="text-2xl font-semibold text-green-800">{blog.title}</h2>
                        <Badge variant="success">{blog.category}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(blog.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="prose prose-green max-w-none bg-green-50 p-4 rounded-lg border border-green-100 my-2">
                      {formatContent(blog.content)}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-green-100">
                      <div className="flex gap-3">
                        <Button onClick={() => handleEdit(blog)} className="px-5">
                          <Edit size={16} className="mr-2" />
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(blog._id)} className="px-5">
                          <Trash2 size={16} className="mr-2" />
                          Delete
                        </Button>
                      </div>
                      {blog.updatedAt && (
                        <p className="text-xs text-gray-500 italic">
                          Updated: {new Date(blog.updatedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
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