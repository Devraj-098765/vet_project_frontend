// UserBlogPage.jsx
import React, { useState, useEffect } from 'react';
import NavBar from './Header/NavBar';
import Footer from './Footer/Footer';
import axiosInstance from '../api/axios';
import { Calendar, Search } from 'lucide-react';

const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
);

const CardContent = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
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

const Badge = ({ children, variant }) => (
  <span className={`px-2 py-1 text-xs rounded-full ${
    variant === 'success' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }`}>
    {children}
  </span>
);

const UserBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get('/blogs');
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
    return content.split('\n').map((paragraph, index) => 
      paragraph ? <p key={index} className="mb-2">{paragraph}</p> : <br key={index} />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="flex justify-center items-center">
        <NavBar />
      </div>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-green-800 text-center">Pet Care Blog</h1>
        
        <Input
          placeholder="Search blogs by title, content or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white"
          icon={<Search size={18} />}
        />

        <div className="space-y-4">
          {filteredBlogs.length === 0 ? (
            <Card>
              <CardContent>
                <div className="py-12 text-center">
                  <p className="text-gray-500">
                    {blogs.length === 0 
                      ? "No blog posts available yet." 
                      : "No matching blog posts found."}
                  </p>
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
                      <span>By Dr. {blog.author.name}</span>
                    </div>
                  </div>
                  <div className="prose prose-green max-w-none">
                    {formatContent(blog.content)}
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
      <Footer />
    </div>
  );
};

export default UserBlogPage;