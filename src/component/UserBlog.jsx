import React, { useState, useEffect } from 'react';
import NavBar from './Header/NavBar';
import Footer from './Footer/Footer';
import axiosInstance from '../api/axios';
import { Calendar, Search, Tag } from 'lucide-react';

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
      paragraph ? <p key={index} className="mb-3 text-green-900">{paragraph}</p> : <br key={index} />
    );
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
              <Card key={blog._id}>
                <CardContent className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-green-800 mb-2">{blog.title}</h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-green-700 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} className="text-green-600" />
                        {new Date(blog.createdAt).toLocaleString()}
                      </span>
                      <Badge variant="success">{blog.category}</Badge>
                      <span className="flex items-center gap-1">
                        <Tag size={16} className="text-green-600" />
                        Dr. {blog.author.name}
                      </span>
                    </div>
                    <div className="h-px w-full bg-green-200 my-3"></div>
                  </div>
                  <div className="prose prose-green max-w-none text-green-800">
                    {formatContent(blog.content)}
                  </div>
                  {blog.updatedAt && (
                    <p className="text-xs text-green-600 italic mt-4">
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