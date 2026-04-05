"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiPlus, FiGrid, FiShoppingBag, FiStar, FiSettings, FiLogOut, 
  FiImage, FiType, FiFileText, FiDollarSign, FiPercent, FiBox, 
  FiTag, FiTrash2, FiEdit3, FiEye, FiChevronRight, FiUploadCloud,
  FiSearch, FiBell, FiUser, FiX, FiCheck, FiFolderPlus, FiTrendingUp, FiHeart,
  FiMapPin, FiVideo, FiUserCheck, FiExternalLink
} from "react-icons/fi";

// --- Reusable UI Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 rounded-xl ${
      active 
        ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
        : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
    }`}
  >
    <Icon size={18} />
    <span className="text-sm font-semibold">{label}</span>
  </button>
);

const FormInput = ({ label, icon: Icon, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-slate-500 ml-1">{label}</label>
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
          <Icon size={16} />
        </div>
      )}
      <input
        {...props}
        className={`w-full ${Icon ? 'pl-11' : 'px-4'} pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all`}
      />
    </div>
  </div>
);

const FormTextarea = ({ label, icon: Icon, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-slate-500 ml-1">{label}</label>
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors">
          <Icon size={16} />
        </div>
      )}
      <textarea
        {...props}
        className={`w-full ${Icon ? 'pl-11' : 'px-4'} pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all resize-none`}
      />
    </div>
  </div>
);

const FormCheckbox = ({ label, icon: Icon, name, checked, onChange }) => (
  <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-white hover:border-blue-600 transition-all group">
    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${checked ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
      {checked && <FiCheck size={14} className="text-white" />}
    </div>
    <input 
      type="checkbox" 
      name={name} 
      checked={checked} 
      onChange={onChange} 
      className="hidden" 
    />
    <div className="flex items-center gap-2">
      {Icon && <Icon size={16} className={checked ? 'text-blue-600' : 'text-slate-400'} />}
      <span className={`text-sm font-semibold ${checked ? 'text-slate-900' : 'text-slate-500'}`}>{label}</span>
    </div>
  </label>
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("ADD_PRODUCT");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  // Category State
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);

  // Review State
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    message: "",
    rating: 5,
    image: null
  });
  const [reviewPreview, setReviewPreview] = useState(null);

  // Stories State
  const [stories, setStories] = useState([]);
  const [storyForm, setStoryForm] = useState({
    name: "",
    title: "",
    description: "",
    location: "",
    video: "",
    image: null
  });
  const [storyPreview, setStoryPreview] = useState(null);

  // 🔥 BANNER STATE
  const [banners, setBanners] = useState([]);
  const [bannerForm, setBannerForm] = useState({
    title: "",
    subtitle: "",
    link: "",
    image: null
  });
  const [bannerPreview, setBannerPreview] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    mrpPrice: "",
    discountPrice: "",
    gst: "18",
    stock: "",
    category: "",
    images: [],
    isTrending: false,
    isFeatured: false,
    isSubsidy: false, // 🔥 ADDED
  });

  const fileInputRef = useRef(null);
  const categoryImageInputRef = useRef(null);
  const storyImageInputRef = useRef(null);
  const reviewImageInputRef = useRef(null);
  const bannerImageInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchReviews();
    fetchStories();
    fetchBanners(); // 🔥 ADD
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      const fetchedProducts = res.data.products || (Array.isArray(res.data) ? res.data : []);
      setProducts(fetchedProducts);
    } catch (err) {
      console.error("Fetch Products Error:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/category");
      setCategories(res.data.categories || (Array.isArray(res.data) ? res.data : []));
    } catch (err) {
      console.error("Fetch Categories Error:", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reviews");
      setReviews(res.data);
    } catch (err) {
      console.error("Review Fetch Error:", err);
    }
  };

  const fetchStories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stories");
      setStories(res.data);
    } catch (err) {
      console.error("Story Fetch Error:", err);
    }
  };

  // 🔥 FETCH BANNERS
  const fetchBanners = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/banners");
      setBanners(res.data);
    } catch (err) {
      console.error("Banner Fetch Error:", err);
    }
  };

  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
      setCategoryImagePreview(URL.createObjectURL(file));
    }
  };

  const handleReviewImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReviewForm({ ...reviewForm, image: file });
      setReviewPreview(URL.createObjectURL(file));
    }
  };

  const handleStoryImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStoryForm({ ...storyForm, image: file });
      setStoryPreview(URL.createObjectURL(file));
    }
  };

  // 🔥 HANDLE BANNER IMAGE
  const handleBannerImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerForm({ ...bannerForm, image: file });
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const createCategory = async () => {
    if (!categoryName) return alert("Please enter a category name");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", categoryName);
      if (categoryImage) formData.append("image", categoryImage);

      await axios.post("http://localhost:5000/api/category", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });
      alert("✅ Category Created Successfully");
      setCategoryName("");
      setCategoryImage(null);
      setCategoryImagePreview(null);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const createReview = async () => {
    if (!reviewForm.name || !reviewForm.message) return alert("Please fill required fields");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", reviewForm.name);
      formData.append("message", reviewForm.message);
      formData.append("rating", reviewForm.rating);
      if (reviewForm.image) formData.append("image", reviewForm.image);

      await axios.post("http://localhost:5000/api/reviews", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ Review Added");
      setReviewForm({ name: "", message: "", rating: 5, image: null });
      setReviewPreview(null);
      fetchReviews();
    } catch (err) {
      alert("Failed to create review");
    } finally {
      setLoading(false);
    }
  };

  const createStory = async () => {
    if (!storyForm.name || !storyForm.title || !storyForm.description) return alert("Please fill required fields");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", storyForm.name);
      formData.append("title", storyForm.title);
      formData.append("description", storyForm.description);
      formData.append("location", storyForm.location);
      formData.append("video", storyForm.video);
      if (storyForm.image) formData.append("image", storyForm.image);

      await axios.post("http://localhost:5000/api/stories", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ Story Added");
      setStoryForm({ name: "", title: "", description: "", location: "", video: "", image: null });
      setStoryPreview(null);
      fetchStories();
    } catch (err) {
      alert("Failed to create story");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 CREATE BANNER
  const createBanner = async () => {
    if (!bannerForm.title || !bannerForm.image) return alert("Please fill required fields (Title & Image)");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", bannerForm.title);
      formData.append("subtitle", bannerForm.subtitle);
      formData.append("link", bannerForm.link);
      if (bannerForm.image) formData.append("image", bannerForm.image);

      await axios.post("http://localhost:5000/api/banners", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ Banner Added");
      setBannerForm({ title: "", subtitle: "", link: "", image: null });
      setBannerPreview(null);
      fetchBanners();
    } catch (err) {
      console.error("Banner Error:", err);
      alert("Failed to create banner");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, images: [...form.images, ...files] });
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  const removeImage = (index) => {
    const newImages = [...form.images];
    newImages.splice(index, 1);
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setForm({ ...form, images: newImages });
    setImagePreviews(newPreviews);
  };

  const addProduct = async () => {
    const { title, mrpPrice, discountPrice, stock } = form;
    if (!title || !mrpPrice || !discountPrice || !stock) return alert("Please fill required fields");
    const token = localStorage.getItem("token");
    if (!token) return alert("Login first - Token not found");
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === "images") {
          form.images.forEach(img => formData.append("images", img));
        } else {
          formData.append(key, form[key]);
        }
      });
      await axios.post("http://localhost:5000/api/products", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      alert("✅ Product Added Successfully");
      setForm({ 
        title: "", 
        description: "", 
        mrpPrice: "", 
        discountPrice: "", 
        gst: "18", 
        stock: "", 
        category: "", 
        images: [], 
        isTrending: false, 
        isFeatured: false,
        isSubsidy: false // 🔥 RESET ADDED
      });
      setImagePreviews([]);
      fetchProducts();
    } catch (err) {
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReviews();
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  const deleteStory = async (id) => {
    if (!window.confirm("Delete this story?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/stories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStories();
    } catch (err) {
      alert("Failed to delete story");
    }
  };

  const deleteBanner = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/banners/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBanners();
    } catch (err) {
      alert("Failed to delete banner");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <FiGrid size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Admin Panel</h1>
        </div>
        
        <nav className="flex-grow px-4 space-y-2">
          <SidebarItem icon={FiPlus} label="Add Product" active={activeTab === "ADD_PRODUCT"} onClick={() => setActiveTab("ADD_PRODUCT")} />
          <SidebarItem icon={FiShoppingBag} label="Products" active={activeTab === "PRODUCT_LIST"} onClick={() => setActiveTab("PRODUCT_LIST")} />
          <SidebarItem icon={FiTag} label="Categories" active={activeTab === "CATEGORIES"} onClick={() => setActiveTab("CATEGORIES")} />
          <SidebarItem icon={FiStar} label="Reviews" active={activeTab === "REVIEWS"} onClick={() => setActiveTab("REVIEWS")} />
          <SidebarItem icon={FiFolderPlus} label="Stories" active={activeTab === "STORIES"} onClick={() => setActiveTab("STORIES")} />
          <SidebarItem icon={FiImage} label="Banners" active={activeTab === "BANNERS"} onClick={() => setActiveTab("BANNERS")} />
        </nav>

        <div className="p-6 border-t border-slate-50">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 transition-colors font-semibold text-sm">
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {activeTab.replace("_", " ")}
            </h2>
            <p className="text-slate-400 font-medium mt-1">Manage your store operations efficiently</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
              <FiBell size={20} />
            </button>
            <div className="h-10 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-xl border border-slate-100 shadow-sm">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                <FiUser size={18} />
              </div>
              <span className="text-sm font-bold">Admin</span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "ADD_PRODUCT" && (
            <motion.div 
              key="add-product"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 xl:grid-cols-12 gap-8"
            >
              <div className="xl:col-span-8 space-y-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <FiFileText className="text-blue-600" /> Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput label="Product Title" name="title" value={form.title} onChange={handleChange} placeholder="Enter product name" icon={FiType} />
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1">Category</label>
                        <select name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-600 outline-none transition-all">
                          <option value="">Select Category</option>
                          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <FormTextarea label="Description" name="description" value={form.description} onChange={handleChange} placeholder="Write product details..." rows={4} icon={FiFileText} />
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <FiDollarSign className="text-blue-600" /> Pricing & Inventory
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                      <FormInput label="MRP Price" name="mrpPrice" type="number" value={form.mrpPrice} onChange={handleChange} placeholder="0.00" icon={FiDollarSign} />
                      <FormInput label="Discount Price" name="discountPrice" type="number" value={form.discountPrice} onChange={handleChange} placeholder="0.00" icon={FiPercent} />
                      <FormInput label="GST (%)" name="gst" type="number" value={form.gst} onChange={handleChange} placeholder="18" icon={FiBox} />
                      <FormInput label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="0" icon={FiBox} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 ml-1">Product Flags</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormCheckbox label="🔥 Trending" name="isTrending" checked={form.isTrending} onChange={handleChange} icon={FiTrendingUp} />
                      <FormCheckbox label="❤️ Most Loved" name="isFeatured" checked={form.isFeatured} onChange={handleChange} icon={FiHeart} />
                      <FormCheckbox label="🟢 Govt Subsidy" name="isSubsidy" checked={form.isSubsidy} onChange={handleChange} icon={FiCheck} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 ml-1">Product Images</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {imagePreviews.map((src, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group">
                          <img src={src} alt="Preview" className="w-full h-full object-cover" />
                          <button onClick={() => removeImage(i)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <FiX size={14} />
                          </button>
                        </div>
                      ))}
                      <button onClick={() => fileInputRef.current.click()} className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
                        <FiUploadCloud size={20} />
                        <span className="text-[10px] font-bold uppercase">Upload</span>
                      </button>
                    </div>
                    <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleImageChange} accept="image/*" />
                  </div>

                  <button onClick={addProduct} disabled={loading} className="w-full py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-100 hover:bg-green-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiCheck size={18} /> Create Product</>}
                  </button>
                </div>
              </div>

              <div className="xl:col-span-4">
                <div className="sticky top-28 space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-2">Live Preview</h3>
                  <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-lg shadow-slate-100">
                    <div className="aspect-square bg-slate-50 flex items-center justify-center p-6">
                      {imagePreviews.length > 0 ? <img src={imagePreviews[0]} alt="Preview" className="max-h-full object-contain" /> : <div className="flex flex-col items-center gap-2 text-slate-300"><FiImage size={48} /><span className="text-[10px] font-bold uppercase">No Image</span></div>}
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">{categories.find(c => c._id === form.category)?.name || "Category"}</span>
                          <h4 className="text-lg font-bold text-slate-900 mt-2 line-clamp-1">{form.title || "Product Name"}</h4>
                        </div>
                        <div className="flex gap-1">
                          {form.isTrending && <span title="Trending" className="text-orange-500"><FiTrendingUp size={16} /></span>}
                          {form.isFeatured && <span title="Most Loved" className="text-red-500"><FiHeart size={16} /></span>}
                          {form.isSubsidy && <span title="Govt Subsidy" className="text-green-500"><FiCheck size={16} /></span>}
                        </div>
                      </div>
                      <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Stock: {form.stock || "0"}</span>
                        <span className="text-[10px] font-bold text-green-600 uppercase">GST {form.gst}% Inc.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "CATEGORIES" && (
            <motion.div key="categories" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl mx-auto space-y-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-slate-900">Create New Category</h3>
                <div className="space-y-4">
                  <FormInput label="Category Name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="e.g. Solar Panels, Inverters" icon={FiTag} />
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">Category Image</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden">
                        {categoryImagePreview ? <img src={categoryImagePreview} alt="Category Preview" className="w-full h-full object-cover" /> : <FiImage size={24} className="text-slate-300" />}
                      </div>
                      <button onClick={() => categoryImageInputRef.current.click()} className="px-4 py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all text-xs font-bold flex items-center gap-2">
                        <FiUploadCloud size={16} /> Upload Image
                      </button>
                      <input type="file" ref={categoryImageInputRef} className="hidden" onChange={handleCategoryImageChange} accept="image/*" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={createCategory} disabled={loading} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98] h-[46px]">
                      {loading ? "..." : "Create Category"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-slate-900">Existing Categories</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map(cat => (
                    <div key={cat._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 overflow-hidden">
                          {cat.image ? <img src={`http://localhost:5000/${cat.image}`} alt={cat.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300"><FiImage size={16} /></div>}
                        </div>
                        <span className="font-semibold text-slate-700">{cat.name}</span>
                      </div>
                      <button className="text-slate-400 hover:text-red-500 transition-colors"><FiTrash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "REVIEWS" && (
            <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2"><FiStar className="text-yellow-500" /> Add Customer Review</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="Customer Name" value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} placeholder="John Doe" icon={FiUser} />
                  <FormInput label="Rating (1-5)" type="number" min="1" max="5" value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })} icon={FiStar} />
                </div>
                <FormTextarea label="Review Message" value={reviewForm.message} onChange={(e) => setReviewForm({ ...reviewForm, message: e.target.value })} placeholder="What did the customer say?" rows={4} icon={FiFileText} />
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">Customer Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden">
                      {reviewPreview ? <img src={reviewPreview} alt="Review" className="w-full h-full object-cover" /> : <FiUser size={24} className="text-slate-300" />}
                    </div>
                    <button onClick={() => reviewImageInputRef.current.click()} className="px-4 py-2 border border-slate-200 rounded-xl text-slate-500 hover:border-blue-600 hover:text-blue-600 transition-all text-xs font-bold">
                      Choose Photo
                    </button>
                    <input type="file" ref={reviewImageInputRef} className="hidden" onChange={handleReviewImage} accept="image/*" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button onClick={createReview} disabled={loading} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                    {loading ? "..." : "Post Review"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map(rev => (
                  <div key={rev._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative group">
                    <button onClick={() => deleteReview(rev._id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><FiTrash2 size={16} /></button>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100">
                        {rev.image ? <img src={`http://localhost:5000/${rev.image}`} alt={rev.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><FiUser size={20} /></div>}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{rev.name}</h4>
                        <div className="flex text-yellow-400">
                          {[...Array(Number(rev.rating))].map((_, i) => <FiStar key={i} size={12} fill="currentColor" />)}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed italic">"{rev.message}"</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "STORIES" && (
            <motion.div key="stories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2"><FiFolderPlus className="text-purple-500" /> Add Success Story</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="Customer Name" value={storyForm.name} onChange={(e) => setStoryForm({ ...storyForm, name: e.target.value })} placeholder="Farmer Ramesh" icon={FiUser} />
                  <FormInput label="Story Title" value={storyForm.title} onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })} placeholder="Solar Pump Installation" icon={FiType} />
                  <FormInput label="Location" value={storyForm.location} onChange={(e) => setStoryForm({ ...storyForm, location: e.target.value })} placeholder="Nagpur, Maharashtra" icon={FiMapPin} />
                  <FormInput label="Video URL (Optional)" value={storyForm.video} onChange={(e) => setStoryForm({ ...storyForm, video: e.target.value })} placeholder="YouTube Link" icon={FiVideo} />
                </div>
                <FormTextarea label="Success Description" value={storyForm.description} onChange={(e) => setStoryForm({ ...storyForm, description: e.target.value })} placeholder="Describe the impact..." rows={4} icon={FiFileText} />
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">Success Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-16 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden">
                      {storyPreview ? <img src={storyPreview} alt="Story" className="w-full h-full object-cover" /> : <FiImage size={24} className="text-slate-300" />}
                    </div>
                    <button onClick={() => storyImageInputRef.current.click()} className="px-4 py-2 border border-slate-200 rounded-xl text-slate-500 hover:border-blue-600 hover:text-blue-600 transition-all text-xs font-bold">
                      Upload Image
                    </button>
                    <input type="file" ref={storyImageInputRef} className="hidden" onChange={handleStoryImage} accept="image/*" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button onClick={createStory} disabled={loading} className="px-8 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all">
                    {loading ? "..." : "Save Story"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stories.map(story => (
                  <div key={story._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group relative">
                    <button onClick={() => deleteStory(story._id)} className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all"><FiTrash2 size={14} /></button>
                    <div className="aspect-video bg-slate-100 relative">
                      {story.image ? <img src={`http://localhost:5000/${story.image}`} alt={story.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><FiImage size={32} /></div>}
                      <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur text-white text-[10px] font-bold rounded flex items-center gap-1"><FiMapPin size={10} /> {story.location}</div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><FiUserCheck size={12} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{story.name}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 mb-2">{story.title}</h4>
                      <p className="text-slate-500 text-sm line-clamp-2 mb-4">{story.description}</p>
                      {story.video && <a href={story.video} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline"><FiExternalLink size={12} /> Watch Video</a>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "BANNERS" && (
            <motion.div key="banners" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2"><FiImage className="text-blue-500" /> Add Homepage Banner</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="Banner Title" value={bannerForm.title} onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })} placeholder="Summer Sale 2024" icon={FiType} />
                  <FormInput label="Subtitle" value={bannerForm.subtitle} onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })} placeholder="Up to 40% Off" icon={FiFileText} />
                  <FormInput label="Target Link" value={bannerForm.link} onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })} placeholder="/shop/solar" icon={FiExternalLink} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">Banner Image (Wide Recommended)</label>
                  <div className="flex items-center gap-4">
                    <div className="flex-grow h-32 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden">
                      {bannerPreview ? <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" /> : <FiImage size={32} className="text-slate-300" />}
                    </div>
                    <button onClick={() => bannerImageInputRef.current.click()} className="px-6 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all text-sm font-bold flex items-center gap-2">
                      <FiUploadCloud size={18} /> Upload
                    </button>
                    <input type="file" ref={bannerImageInputRef} className="hidden" onChange={handleBannerImage} accept="image/*" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button onClick={createBanner} disabled={loading} className="px-10 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                    {loading ? "..." : "Publish Banner"}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-2">Active Banners</h3>
                <div className="grid grid-cols-1 gap-6">
                  {banners.map(banner => (
                    <div key={banner._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group relative flex flex-col md:flex-row">
                      <div className="md:w-1/3 aspect-video md:aspect-auto bg-slate-100">
                        {banner.image ? <img src={`http://localhost:5000/${banner.image}`} alt={banner.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><FiImage size={32} /></div>}
                      </div>
                      <div className="p-6 flex-grow flex flex-col justify-center">
                        <h4 className="text-xl font-bold text-slate-900 mb-1">{banner.title}</h4>
                        <p className="text-slate-500 font-medium mb-4">{banner.subtitle}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{banner.link}</span>
                          <button onClick={() => deleteBanner(banner._id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><FiTrash2 size={18} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "PRODUCT_LIST" && (
            <motion.div key="product-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <div className="relative w-72">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600 transition-all" />
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">Export CSV</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {products.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-100">
                              {p.images && p.images[0] ? <img src={`http://localhost:5000/${p.images[0]}`} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><FiImage size={16} /></div>}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{p.title}</div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">ID: {p._id.slice(-6)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{categories.find(c => c._id === p.category)?.name || "Uncategorized"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-slate-900">₹{p.discountPrice}</div>
                          <div className="text-[10px] text-slate-400 line-through">₹{p.mrpPrice}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`text-xs font-bold ${p.stock < 10 ? 'text-red-500' : 'text-slate-600'}`}>{p.stock} Units</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1">
                            {p.isTrending && <span title="Trending" className="w-6 h-6 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center"><FiTrendingUp size={12} /></span>}
                            {p.isFeatured && <span title="Featured" className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center"><FiHeart size={12} /></span>}
                            {p.isSubsidy && <span title="Subsidy" className="w-6 h-6 rounded-full bg-green-50 text-green-500 flex items-center justify-center"><FiCheck size={12} /></span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><FiEdit3 size={16} /></button>
                            <button onClick={() => deleteProduct(p._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><FiTrash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
