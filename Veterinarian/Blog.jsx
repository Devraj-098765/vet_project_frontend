import React, { useState, useEffect } from "react";
import SideBarVeterinarian from "./SideBarVeterinarian/SideBarVeterinarian";
import { Calendar, Search, Edit, Trash2, X, Check } from "lucide-react";

// UI Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md transition-shadow hover:shadow-lg ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const baseClasses = "py-2 px-4 rounded-md transition-colors font-medium flex items-center justify-center gap-2";
  const variantClasses = {
    primary: "bg-green-700 text-white hover:bg-green-800 focus:ring-green-500",
    secondary: "bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-300",
    danger: "bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-400",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-300"
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", icon, ...props }) => (
  <div className="relative">
    {icon && <span className="absolute left-3 top-2.5 text-gray-500">{icon}</span>}
    <input
      className={`w-full p-2 ${icon ? "pl-10" : "px-4"} border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent ${className}`}
      {...props}
    />
  </div>
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent ${className}`}
    {...props}
  />
);

const Badge = ({ children, variant = "default" }) => {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
  };
  
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

const VetBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  const categories = [
    "Pet Nutrition", 
    "Preventive Care", 
    "Common Diseases", 
    "Surgery", 
    "Emergency Care",
    "Animal Behavior", 
    "Pet Wellness"
  ];

  // Load blogs from localStorage on component mount
  useEffect(() => {
    const savedBlogs = localStorage.getItem("vetBlogs");
    if (savedBlogs) {
      setBlogs(JSON.parse(savedBlogs));
    }
  }, []);

  // Save blogs to localStorage whenever blogs change
  useEffect(() => {
    localStorage.setItem("vetBlogs", JSON.stringify(blogs));
  }, [blogs]);

  const handlePost = () => {
    if (!title.trim() || !content.trim() || !category) {
      alert("Please fill in all fields including category");
      return;
    }

    if (editing) {
      // Update existing blog
      const updatedBlogs = blogs.map(blog => 
        blog.id === editing.id 
          ? { 
              ...blog, 
              title, 
              content, 
              category,
              edited: true,
              lastEditDate: new Date().toLocaleString() 
            } 
          : blog
      );
      setBlogs(updatedBlogs);
      setEditing(null);
    } else {
      // Create new blog
      const newBlog = {
        id: Date.now(),
        title,
        content,
        category,
        date: new Date().toLocaleString(),
        edited: false,
        lastEditDate: null
      };
      setBlogs([newBlog, ...blogs]);
    }

    // Reset form
    resetForm();
    setIsFormExpanded(false);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory("");
    setEditing(null);
  };

  const handleEdit = (blog) => {
    setTitle(blog.title);
    setContent(blog.content);
    setCategory(blog.category || "");
    setEditing(blog);
    setIsFormExpanded(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      setBlogs(blogs.filter(blog => blog.id !== id));
      if (editing && editing.id === id) {
        resetForm();
      }
    }
  };

  const cancelEdit = () => {
    resetForm();
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (blog.category && blog.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate blog stats
  const blogStats = {
    total: blogs.length,
    byCategory: blogs.reduce((acc, blog) => {
      const cat = blog.category || "Uncategorized";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {})
  };

  const formatContent = (content) => {
    // Split content by paragraphs and render them separately
    return content.split('\n').map((paragraph, index) => 
      paragraph ? <p key={index} className="mb-2">{paragraph}</p> : <br key={index} />
    );
  };

  const toggleForm = () => {
    setIsFormExpanded(!isFormExpanded);
    if (!isFormExpanded && editing) {
      resetForm();
    }
  };

  return (
    <div className="flex">
      <SideBarVeterinarian />
      <div className="flex-1 bg-green-50 min-h-screen">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-green-800">Veterinarian Blog</h1>
            <Button 
              onClick={toggleForm} 
              variant={isFormExpanded ? "secondary" : "primary"}
              className="flex items-center gap-2"
            >
              {isFormExpanded ? (
                <>
                  <X size={18} />
                  Close Editor
                </>
              ) : (
                <>
                  <Edit size={18} />
                  {editing ? "Continue Editing" : "Write New Post"}
                </>
              )}
            </Button>
          </div>
          
          {/* Blog Stats Card */}
          <Card className="bg-green-50 border border-green-100">
            <CardContent>
              <div className="flex flex-wrap justify-between">
                <div>
                  <h3 className="text-lg font-medium text-green-800">Blog Statistics</h3>
                  <p className="text-green-700">Total Posts: {blogStats.total}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(blogStats.byCategory).map(([cat, count]) => (
                    <Badge key={cat} variant="success">
                      {cat}: {count}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Blog Editor */}
          {isFormExpanded && (
            <Card className="border-t-4 border-green-600">
              <CardContent className="space-y-4">
                <h2 className="text-xl font-semibold mb-4 text-green-800">
                  {editing ? "Edit Blog Post" : "Create New Blog Post"}
                </h2>
                <Input
                  placeholder="Blog Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <Textarea
                    placeholder="Write your blog content here..."
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button className="w-full" onClick={handlePost}>
                    {editing ? (
                      <>
                        <Check size={18} />
                        Update Post
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        Publish Blog
                      </>
                    )}
                  </Button>
                  {editing && (
                    <Button 
                      variant="ghost" 
                      onClick={cancelEdit}
                    >
                      <X size={18} />
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search Box */}
          <div className="mb-4">
            <Input
              placeholder="Search blogs by title, content or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white"
              icon={<Search size={18} />}
            />
          </div>

          {/* Blog List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-green-800">
                {searchTerm ? "Search Results" : "Recent Posts"}
              </h2>
              {searchTerm && (
                <p className="text-sm text-gray-600">
                  Found {filteredBlogs.length} {filteredBlogs.length === 1 ? "post" : "posts"}
                </p>
              )}
            </div>
            
            {filteredBlogs.length === 0 ? (
              <Card>
                <CardContent>
                  <div className="py-12 text-center">
                    <p className="text-gray-500 mb-4">
                      {blogs.length === 0 
                        ? "No blog posts yet. Create your first one!" 
                        : "No matching blog posts found."}
                    </p>
                    {blogs.length > 0 && searchTerm && (
                      <Button 
                        variant="secondary" 
                        className="mx-auto"
                        onClick={() => setSearchTerm("")}
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredBlogs.map((blog) => (
                <Card key={blog.id} className="hover:border-green-200 transition-colors border border-transparent">
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-green-800">{blog.title}</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {blog.date}
                          </span>
                          {blog.category && (
                            <Badge variant="success">{blog.category}</Badge>
                          )}
                          {blog.edited && (
                            <Badge variant="default">Edited</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          className="p-2"
                          onClick={() => handleEdit(blog)}
                        >
                          <Edit size={18} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="p-2 text-red-600"
                          onClick={() => handleDelete(blog.id)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                    <div className="prose prose-green max-w-none pt-2">
                      {formatContent(blog.content)}
                    </div>
                    {blog.lastEditDate && (
                      <p className="text-xs text-gray-500 italic">
                        Last edited: {blog.lastEditDate}
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