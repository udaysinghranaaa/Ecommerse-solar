"use client";

import React, { useEffect, useState, useRef } from "react";
import API from "../../services/api";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus, FiGrid, FiShoppingBag, FiStar, FiSettings, FiLogOut,
  FiImage, FiType, FiFileText, FiDollarSign, FiPercent, FiBox,
  FiTag, FiTrash2, FiEdit3, FiEye, FiChevronRight, FiUploadCloud,
  FiSearch, FiBell, FiUser, FiX, FiCheck, FiFolderPlus, FiTrendingUp, FiHeart,
  FiMapPin, FiVideo, FiUserCheck, FiExternalLink, FiFilter, FiCamera
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
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  // ✅ FIX 1: BASE_URL safety
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://ecommerse-solar.onrender.com";

  const [activeTab, setActiveTab] = useState("ADD_PRODUCT" );
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ SEARCH STATE

  // ✅ EDIT MODE STATE
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

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

  // ✅ FIX 3: (VERY IMPORTANT) - Initial state changed to empty array
  const [technicalSpecs, setTechnicalSpecs] = useState([
    { key: "", value: "" }
  ]);
  // 🔥 NEW ADD
  const [customerReviews, setCustomerReviews] = useState([
    { name: "", rating: "", comment: "" }
  ]);

  const [videos, setVideos] = useState([]);

  const [faqs, setFaqs] = useState([
    { question: "", answer: "" },
  ]);

  const [qa, setQa] = useState([
    { question: "", answer: "" },
  ]);

  const fileInputRef = useRef(null);
  const categoryImageInputRef = useRef(null);
  const storyImageInputRef = useRef(null);
  const reviewImageInputRef = useRef(null);
  const bannerImageInputRef = useRef(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      // ❌ token नहीं → login
      if (!token) {
        setIsAuthChecked(false);
        router.replace("/admin/login");
        return;
      }

      try {
        // 🔐 backend से verify
        // ✅ NEW (FINAL FIX) - Updated endpoint and removed redundant headers
        await API.get("/auth/admin-check");

        // ✅ valid token → data load
        fetchProducts();
        fetchCategories();
        fetchReviews();
        fetchStories();
        fetchBanners();
        setIsAuthChecked(true);

      } catch (err) {
        // ❌ invalid / expired token
        localStorage.removeItem("token");
        setIsAuthChecked(false);
        router.replace("/admin/login");
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      // ✅ FIX 2: Standardize data format
      const fetchedProducts = res.data.products || res.data || [];
      setProducts(fetchedProducts);
    } catch (err) {
      // ✅ FIX 4: Better console error
      console.error(err.response?.data || err.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/category");
      // ✅ FIX 2: Standardize data format
      setCategories(res.data.categories || res.data || []);
    } catch (err) {
      // ✅ FIX 4: Better console error
      console.error(err.response?.data || err.message);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await API.get("/reviews");
      // ✅ FIX 2: Standardize data format
      setReviews(res.data.reviews || res.data || []);
    } catch (err) {
      // ✅ FIX 4: Better console error
      console.error(err.response?.data || err.message);
    }
  };

  const fetchStories = async () => {
    try {
      const res = await API.get("/stories");
      // ✅ FIX 2: Standardize data format
      setStories(res.data.stories || res.data || []);
    } catch (err) {
      // ✅ FIX 4: Better console error
      console.error(err.response?.data || err.message);
    }
  };

  // 🔥 FETCH BANNERS
  const fetchBanners = async () => {
    try {
      const res = await API.get("/banners");
      // ✅ FIX 2: Standardize data format
      setBanners(res.data.banners || res.data || []);
    } catch (err) {
      // ✅ FIX 4: Better console error
      console.error(err.response?.data || err.message);
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
      const formData = new FormData();
      formData.append("name", categoryName);
      if (categoryImage) formData.append("image", categoryImage);

      await API.post("/category", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
      });
      alert("✅ Category Created Successfully");
      setCategoryName("");
      setCategoryImage(null);
      setCategoryImagePreview(null);
      fetchCategories();
    } catch (err) {
      // ✅ FIX 3: Improved error handling
      alert(err.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const createReview = async () => {
    if (!reviewForm.name || !reviewForm.message) return alert("Please fill required fields");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", reviewForm.name);
      formData.append("message", reviewForm.message);
      formData.append("rating", reviewForm.rating);
      if (reviewForm.image) formData.append("image", reviewForm.image);

      await API.post("/reviews", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ Review Added");
      setReviewForm({ name: "", message: "", rating: 5, image: null });
      setReviewPreview(null);
      fetchReviews();
    } catch (err) {
      // ✅ FIX 3: Improved error handling
      alert(err.response?.data?.message || "Failed to create review");
    } finally {
      setLoading(false);
    }
  };

  const createStory = async () => {
    if (!storyForm.name || !storyForm.title || !storyForm.description || !storyForm.location) return alert("Please fill all required fields");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", storyForm.name);
      formData.append("title", storyForm.title);
      formData.append("description", storyForm.description);
      formData.append("location", storyForm.location);
      if (storyForm.video) formData.append("video", storyForm.video);
      if (storyForm.image) formData.append("image", storyForm.image);

      await API.post("/stories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ Story Saved");
      setStoryForm({ name: "", title: "", description: "", location: "", video: "", image: null });
      setStoryPreview(null);
      fetchStories();
    } catch (err) {
      // ✅ FIX 3: Improved error handling
      alert(err.response?.data?.message || "Failed to save story");
    } finally {
      setLoading(false);
    }
  };

  const createBanner = async () => {
    if (!bannerForm.title || !bannerForm.subtitle || !bannerForm.link || !bannerForm.image) return alert("Please fill all banner fields and upload an image");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", bannerForm.title);
      formData.append("subtitle", bannerForm.subtitle);
      formData.append("link", bannerForm.link);
      formData.append("image", bannerForm.image);

      await API.post("/banners", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ Banner Published");
      setBannerForm({ title: "", subtitle: "", link: "", image: null });
      setBannerPreview(null);
      fetchBanners();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to publish banner");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async () => {
  if (!form.title || !form.description || !form.mrpPrice || !form.discountPrice || !form.stock || !form.category || form.images.length === 0) {
    return alert("Please fill all product fields and upload at least one image.");
  }

  setLoading(true);

  try {
    const formData = new FormData();

    // ✅ BASIC FIELDS (SAFE)
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("mrpPrice", Number(form.mrpPrice));
    formData.append("discountPrice", Number(form.discountPrice));
    formData.append("gst", Number(form.gst || 18));
    formData.append("stock", Number(form.stock));
    formData.append("category", form.category);

    // ✅ FLAGS (FIXED)
    formData.append("isTrending", form.isTrending ? "true" : "false");
    formData.append("isFeatured", form.isFeatured ? "true" : "false");
    formData.append("isSubsidy", form.isSubsidy ? "true" : "false");

    // ✅ IMAGES
    form.images.forEach((image) => {
      formData.append("images", image);
    });

    // ✅ VIDEOS (SAFE FIX)
    if (videos && videos.length > 0) {
      Array.from(videos).forEach((video) => {
        formData.append("videos", video);
      });
    }

    // ✅ SPECS
    const filteredSpecs = technicalSpecs.filter(
      (s) => s.key.trim() !== "" && s.value.trim() !== ""
    );
    formData.append("technicalSpecs", JSON.stringify(filteredSpecs));

    // ✅ REVIEWS
    const cleanedReviews = customerReviews
      .filter((r) => r.name && r.comment)
      .map((r) => ({
        name: r.name,
        rating: Number(r.rating) || 0,
        comment: r.comment,
      }));
    formData.append("customerReviews", JSON.stringify(cleanedReviews));

    // ✅ FAQ + QA
    const safeFaqs = faqs.filter(f => f.question && f.answer);
    const safeQa = qa.filter(q => q.question && q.answer);

    formData.append("faqs", JSON.stringify(safeFaqs));
    formData.append("qa", JSON.stringify(safeQa));

    await API.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    alert("✅ Product Added Successfully");

  } catch (err) {
    console.error(err.response?.data || err.message); // 🔥 ADD THIS
    alert(err.response?.data?.message || "Failed to add product");
  } finally {
    setLoading(false);
  }
};

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
    setForm({ ...form, images: files });
  };

  const removeImage = (index) => {
    const newImages = form.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setForm({ ...form, images: newImages });
    setImagePreviews(newPreviews);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (product) => {
    setEditMode(true);
    setEditId(product._id);
    setForm({
      title: product.title,
      description: product.description,
      mrpPrice: product.mrpPrice,
      discountPrice: product.discountPrice,
      gst: product.gst,
      stock: product.stock,
      category: product.category._id || product.category,
      images: [], // Images are handled separately, not pre-filled for edit
      isTrending: product.isTrending,
      isFeatured: product.isFeatured,
      isSubsidy: product.isSubsidy,
    });
    setTechnicalSpecs(product.technicalSpecs || []);
    setCustomerReviews(product.customerReviews || [{ name: "", rating: "", comment: "" }]);
    setImagePreviews(product.images.map(img => typeof img === 'string' ? img.startsWith('http' ) ? img : `${BASE_URL}/${img.replace(/\\/g, '/')}` : img.url ? `${BASE_URL}/${img.url}` : ''));
  };

  const updateProduct = async () => {
  if (!form.title || !form.description || !form.mrpPrice || !form.discountPrice || !form.stock || !form.category) {
    return alert("Please fill all product fields.");
  }

  setLoading(true);

  try {
    const formData = new FormData();

    // ✅ BASIC FIELDS
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("mrpPrice", Number(form.mrpPrice));
    formData.append("discountPrice", Number(form.discountPrice));
    formData.append("gst", Number(form.gst || 18));
    formData.append("stock", Number(form.stock));
    formData.append("category", form.category);

    // ✅ 🔥 FIXED FLAGS (IMPORTANT)
    formData.append("isTrending", form.isTrending ? "true" : "false");
    formData.append("isFeatured", form.isFeatured ? "true" : "false");
    formData.append("isSubsidy", form.isSubsidy ? "true" : "false");

    // ✅ IMAGES
    form.images.forEach((image) => {
      formData.append("images", image);
    });

    // ✅ TECH SPECS
    const filteredSpecs = technicalSpecs.filter(
      (s) => s.key.trim() !== "" && s.value.trim() !== ""
    );
    formData.append("technicalSpecs", JSON.stringify(filteredSpecs));

    // ✅ REVIEWS
    const cleanedReviews = customerReviews
      .filter((r) => r.name && r.comment)
      .map((r) => ({
        name: r.name,
        rating: Number(r.rating) || 0,
        comment: r.comment,
      }));
    formData.append("customerReviews", JSON.stringify(cleanedReviews));

    // ✅ VIDEOS (SAFE FIX)
    if (videos && videos.length > 0) {
      Array.from(videos).forEach((video) => {
        formData.append("videos", video);
      });
    }

    // ✅ FAQ + QA
    const safeFaqs = faqs.filter(f => f.question && f.answer);
    const safeQa = qa.filter(q => q.question && q.answer);

    formData.append("faqs", JSON.stringify(safeFaqs));
    formData.append("qa", JSON.stringify(safeQa));

    await API.put(`/products/${editId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    alert("✅ Product Updated Successfully");

    setEditMode(false);
    setEditId(null);

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
      isSubsidy: false,
    });

    setImagePreviews([]);
    setTechnicalSpecs([]);
    setCustomerReviews([{ name: "", rating: "", comment: "" }]);
    setVideos([]);

    fetchProducts();
    setActiveTab("PRODUCT_LIST");

  } catch (err) {
    console.error(err.response?.data || err.message);
    alert(err.response?.data?.message || "Failed to update product");
  } finally {
    setLoading(false);
  }
};

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      alert("✅ Product Deleted");
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await API.delete(`/category/${id}`);
      fetchCategories();
    } catch (err) {
      alert("Failed to delete category");
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await API.delete(`/reviews/${id}`);
      fetchReviews();
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  const deleteStory = async (id) => {
    if (!window.confirm("Delete this story?")) return;
    try {
      await API.delete(`/stories/${id}`);
      fetchStories();
    } catch (err) {
      alert("Failed to delete story");
    }
  };

  const deleteBanner = async (id) => {
    if (!window.confirm("Delete this banner?")) return;

    try {
      console.log("🗑️ DELETE ID:", id);

      const res = await API.delete(`/banners/${id}`);
      console.log("✅ SUCCESS:", res.data);

      alert("Banner Deleted ✅");
      fetchBanners();

    } catch (err) {
      console.error("❌ DELETE ERROR:", err.response?.data || err.message);

      alert(
        err.response?.data?.message || "Failed to delete banner"
      );
    }
  };

  // ✅ HELPER: GET CATEGORY NAME (FIXES UNCATEGORIZED)
  const getCategoryName = (product) => {
    if (typeof product.category === "object" && product.category?.name) {
      return product.category.name;
    }
    const cat = categories.find(c => c._id === product.category);
    return cat ? cat.name : "Uncategorized";
  };

  // ✅ SEARCH FILTER LOGIC
  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCategoryName(p).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-bold animate-pulse">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen hidden lg:flex">
        <div className="p-8 border-b border-slate-50">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <FiShoppingBag size={20} />
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">SOLAR<span className="text-blue-600">ADMIN</span></h1>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Store Management v2.0</p>
        </div>

        <nav className="flex-grow p-6 space-y-2 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 ml-4">Main Menu</p>
          <SidebarItem icon={FiPlus} label="Add Product" active={activeTab === "ADD_PRODUCT"} onClick={() => setActiveTab("ADD_PRODUCT")} />
          <SidebarItem icon={FiGrid} label="All Products" active={activeTab === "PRODUCT_LIST"} onClick={() => setActiveTab("PRODUCT_LIST")} />
          <SidebarItem icon={FiTag} label="Categories" active={activeTab === "CATEGORIES"} onClick={() => setActiveTab("CATEGORIES")} />

          <div className="my-6 h-[1px] bg-slate-50"></div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 ml-4">Content</p>
          <SidebarItem icon={FiStar} label="Reviews" active={activeTab === "REVIEWS"} onClick={() => setActiveTab("REVIEWS")} />
          <SidebarItem icon={FiFolderPlus} label="Stories" active={activeTab === "STORIES"} onClick={() => setActiveTab("STORIES")} />
          <SidebarItem icon={FiImage} label="Banners" active={activeTab === "BANNERS"} onClick={() => setActiveTab("BANNERS")} />
        </nav>

        <div className="p-6 border-t border-slate-50">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all font-semibold text-sm">
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 lg:p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {activeTab.replace("_", " ")}
            </h2>
            <p className="text-sm text-slate-500 font-medium">Manage your store's inventory and content</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all relative">
              <FiBell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="h-10 w-[1px] bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-3 pl-1">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">Admin User</p>
                <p className="text-[10px] font-bold text-green-600 uppercase">Online</p>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                <img src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff" alt="Admin" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "ADD_PRODUCT" && (
            <motion.div
              key="add-product"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 xl:col-span-12 gap-8"
            >
              <div className="xl:col-span-8 space-y-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <FiType className="text-blue-600" /> Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput label="Product Title" name="title" value={form.title} onChange={handleChange} placeholder="e.g. 5kW Hybrid Solar Inverter" icon={FiType} />
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1">Category</label>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                            <FiTag size={16} />
                          </div>
                          <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-600 outline-none transition-all appearance-none"
                          >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                              <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <FormTextarea label="Description" name="description" value={form.description} onChange={handleChange} rows="4" placeholder="Detailed product description..." icon={FiFileText} />
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <FiDollarSign className="text-blue-600" /> Pricing & Inventory
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormInput label="MRP Price" name="mrpPrice" type="number" value={form.mrpPrice} onChange={handleChange} icon={FiDollarSign} />
                      <FormInput label="Discount Price" name="discountPrice" type="number" value={form.discountPrice} onChange={handleChange} icon={FiPercent} />
                      <FormInput label="Stock Quantity" name="stock" type="number" value={form.stock} onChange={handleChange} icon={FiBox} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <FiImage className="text-blue-600" /> Product Media
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="aspect-square rounded-xl overflow-hidden border border-slate-200 relative group">
                          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                          <button onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => fileInputRef.current.click()}
                        className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:bg-slate-50 hover:border-blue-400 hover:text-blue-600 transition-all"
                      >
                        <FiUploadCloud size={24} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                      </button>
                    </div>
                    <input type="file" ref={fileInputRef} multiple onChange={handleImageChange} className="hidden" accept="image/*" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormCheckbox label="Trending" name="isTrending" checked={form.isTrending} onChange={handleChange} icon={FiTrendingUp} />
                    <FormCheckbox label="Featured" name="isFeatured" checked={form.isFeatured} onChange={handleChange} icon={FiHeart} />
                    <FormCheckbox label="Subsidy" name="isSubsidy" checked={form.isSubsidy} onChange={handleChange} icon={FiDollarSign} />
                  </div>

                  {/* ✅ TECHNICAL SPECS UI */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <FiSettings className="text-blue-600" /> Technical Specifications
                    </h3>
                    {technicalSpecs.map((spec, i) => (
                      <div key={i} className="flex gap-4 mb-2">
                        <input
                          type="text"
                          placeholder="Spec Key (e.g. Battery)"
                          value={spec.key}
                          onChange={(e) => {
                            const updated = [...technicalSpecs];
                            updated[i].key = e.target.value;
                            setTechnicalSpecs(updated);
                          }}
                          className="w-1/2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-600 outline-none transition-all"
                        />
                        <input
                          type="text"
                          placeholder="Value (e.g. 5000mAh)"
                          value={spec.value}
                          onChange={(e) => {
                            const updated = [...technicalSpecs];
                            updated[i].value = e.target.value;
                            setTechnicalSpecs(updated);
                          }}
                          className="w-1/2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-600 outline-none transition-all"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setTechnicalSpecs([...technicalSpecs, { key: "", value: "" }])}
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
                    >
                      <FiPlus size={16} /> Add Spec
                    </button>
                  </div>

                  {/* ✅ CUSTOMER REVIEWS UI */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <FiStar className="text-blue-600" /> Customer Reviews
                    </h3>
                    {customerReviews.map((rev, i) => (
                      <div key={i} className="flex gap-4 mb-2">
                        <input
                          type="text"
                          placeholder="Name"
                          value={rev.name}
                          onChange={(e) => {
                            const updated = [...customerReviews];
                            updated[i].name = e.target.value;
                            setCustomerReviews(updated);
                          }}
                          className="w-1/3 px-3 py-2 border rounded"
                        />
                        <input
                          type="number"
                          placeholder="Rating (1-5)"
                          value={rev.rating}
                          onChange={(e) => {
                            const updated = [...customerReviews];
                            updated[i].rating = Number(e.target.value); // ✅ FIX
                            setCustomerReviews(updated);
                          }}
                          className="w-1/4 px-3 py-2 border rounded"
                        />
                        <input
                          type="text"
                          placeholder="Comment"
                          value={rev.comment}
                          onChange={(e) => {
                            const updated = [...customerReviews];
                            updated[i].comment = e.target.value;
                            setCustomerReviews(updated);
                          }}
                          className="w-1/2 px-3 py-2 border rounded"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setCustomerReviews([
                          ...customerReviews,
                          { name: "", rating: "", comment: "" }
                        ])
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      + Add Review
                    </button>
                  </div>

                  {/* ✅ VIDEO UPLOAD UI */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <FiVideo className="text-blue-600" /> Product Videos
                    </h3>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setVideos(Array.from(e.target.files))}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>

                  <button onClick={editMode ? updateProduct : addProduct} disabled={loading} className="w-full py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-100 hover:bg-green-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (editMode ? "Update Product" : "Publish Product")}
                  </button>
                </div>
              </div>

              <div className="xl:col-span-4">
                <div className="sticky top-28 space-y-8">
                  {/* Category Card */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <FiTag className="text-blue-600" /> Quick Category
                    </h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Category Name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-600 transition-all"
                      />
                      <div
                        onClick={() => categoryImageInputRef.current.click()}
                        className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1 text-slate-400 cursor-pointer hover:bg-slate-50 transition-all overflow-hidden"
                      >
                        {categoryImagePreview ? (
                          <img src={categoryImagePreview} className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <FiImage size={20} />
                            <span className="text-[10px] font-bold uppercase">Icon</span>
                          </>
                        )}
                      </div>
                      <input type="file" ref={categoryImageInputRef} className="hidden" onChange={handleCategoryImageChange} />
                      <button onClick={createCategory} disabled={loading} className="w-full py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all">
                        Create Category
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "PRODUCT_LIST" && (
            <motion.div
              key="product-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative w-full md:w-96">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:border-blue-600 outline-none transition-all"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                    <FiFilter size={16} />
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stock</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredProducts.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                                <img
                                  src={p.images?.[0]?.url ? `${BASE_URL}/${p.images[0].url}` : (typeof p.images?.[0] === 'string' ? (p.images[0].startsWith('http' ) ? p.images[0] : `${BASE_URL}/${p.images[0].replace(/\\/g, '/')}`) : "https://via.placeholder.com/150" )}
                                  alt={p.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900 line-clamp-1">{p.title}</p>
                                <div className="flex gap-2 mt-1">
                                  {p.isTrending && <span className="text-[8px] font-black bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded uppercase">Trending</span>}
                                  {p.isFeatured && <span className="text-[8px] font-black bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded uppercase">Loved</span>}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                              {getCategoryName(p)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-900">₹{p.discountPrice}</span>
                              <span className="text-[10px] text-slate-400 line-through font-medium">₹{p.mrpPrice}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${p.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <span className="text-sm font-bold text-slate-700">{p.stock}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                              <button onClick={() => { handleEdit(p); setActiveTab("ADD_PRODUCT"); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                <FiEdit3 size={16} />
                              </button>
                              <button onClick={() => deleteProduct(p._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "CATEGORIES" && (
            <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map(cat => (
                <div key={cat._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm group relative overflow-hidden">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                    {cat.image ? (
                      <img src={cat.image.startsWith('http' ) ? cat.image : `${BASE_URL}/${cat.image.replace(/\\/g, '/')}`} className="w-full h-full object-cover" />
                    ) : (
                      <FiTag size={24} className="text-slate-300" />
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">{cat.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</p>
                  <button onClick={() => deleteCategory(cat._id)} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "REVIEWS" && (
            <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm max-w-2xl">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Add Global Review</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Customer Name" value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} icon={FiUser} />
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1">Rating</label>
                      <select
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-600 transition-all"
                      >
                        {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                      </select>
                    </div>
                  </div>
                  <FormTextarea label="Review Message" value={reviewForm.message} onChange={(e) => setReviewForm({ ...reviewForm, message: e.target.value })} icon={FiFileText} />
                  <div className="flex items-center gap-4">
                    <div onClick={() => reviewImageInputRef.current.click()} className="w-20 h-20 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 overflow-hidden">
                      {reviewPreview ? <img src={reviewPreview} className="w-full h-full object-cover" /> : <FiCamera size={20} />}
                    </div>
                    <input type="file" ref={reviewImageInputRef} className="hidden" onChange={handleReviewImage} />
                    <button onClick={createReview} disabled={loading} className="flex-grow py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                      Submit Review
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map(r => (
                  <div key={r._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
                        <img src={r.image ? (r.image.startsWith('http' ) ? r.image : `${BASE_URL}/${r.image.replace(/\\/g, '/')}`) : `https://ui-avatars.com/api/?name=${r.name}`} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{r.name}</h4>
                        <div className="flex text-yellow-400 gap-0.5">
                          {[...Array(r.rating)].map((_, i) => <FiStar key={i} size={10} fill="currentColor" />)}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed italic">"{r.message}"</p>
                    <button onClick={() => deleteReview(r._id)} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "STORIES" && (
            <motion.div key="stories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm max-w-4xl">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Create Success Story</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <FormInput label="Customer Name" value={storyForm.name} onChange={(e) => setStoryForm({ ...storyForm, name: e.target.value })} icon={FiUser} />
                    <FormInput label="Story Title" value={storyForm.title} onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })} icon={FiType} />
                    <FormInput label="Location" value={storyForm.location} onChange={(e) => setStoryForm({ ...storyForm, location: e.target.value })} icon={FiMapPin} />
                    <FormInput label="Video URL (Optional)" value={storyForm.video} onChange={(e) => setStoryForm({ ...storyForm, video: e.target.value })} icon={FiVideo} />
                  </div>
                  <div className="space-y-4">
                    <FormTextarea label="Story Description" value={storyForm.description} onChange={(e) => setStoryForm({ ...storyForm, description: e.target.value })} rows="5" icon={FiFileText} />
                    <div onClick={() => storyImageInputRef.current.click()} className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 cursor-pointer hover:bg-slate-50 overflow-hidden">
                      {storyPreview ? <img src={storyPreview} className="w-full h-full object-cover" /> : <><FiImage size={24} /> <span className="text-[10px] font-bold uppercase">Cover Image</span></>}
                    </div>
                    <input type="file" ref={storyImageInputRef} className="hidden" onChange={handleStoryImage} />
                  </div>
                </div>
                <button onClick={createStory} disabled={loading} className="px-12 py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
                  SAVE STORY
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map(s => (
                  <div key={s._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group relative">
                    <div className="aspect-video bg-slate-100 relative">
                      <img src={s.image ? (s.image.startsWith('http' ) ? s.image : `${BASE_URL}/${s.image.replace(/\\/g, '/')}`) : ""} className="w-full h-full object-cover" />
                      <button onClick={() => deleteStory(s._id)} className="absolute top-4 right-4 p-2 bg-white/90 text-red-500 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-blue-600 mb-3">
                        <FiMapPin size={12} />
                        <span className="text-[10px] font-black uppercase tracking-wider">{s.location}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 mb-2">{s.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-3 mb-4">{s.description}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <FiUserCheck size={12} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700">{s.name}</span>
                      </div>
                    </div>
                  </div>
                 ))}
              </div>
            </motion.div>
          )}
          {activeTab === "BANNERS" && (
            <motion.div key="banners" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm max-w-4xl">
                <h3 className="text-lg font-bold text-slate-900 mb-6">New Hero Banner</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <FormInput label="Banner Title" value={bannerForm.title} onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })} icon={FiType} />
                    <FormInput label="Subtitle" value={bannerForm.subtitle} onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })} icon={FiFileText} />
                    <FormInput label="Button Link" value={bannerForm.link} onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })} placeholder="/products" icon={FiExternalLink} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-500 ml-1">Banner Image (1920x600 recommended)</label>
                    <div
                      onClick={() => bannerImageInputRef.current.click()}
                      className="aspect-video border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 text-slate-400 cursor-pointer hover:bg-slate-50 transition-all overflow-hidden relative"
                    >
                      {bannerPreview ? (
                        <img src={bannerPreview} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <FiUploadCloud size={32} />
                          <span className="text-xs font-bold uppercase tracking-widest">Click to upload banner</span>
                        </>
                      )}
                    </div>
                    <input type="file" ref={bannerImageInputRef} className="hidden" onChange={handleBannerImage} accept="image/*" />
                  </div>
                </div>
                <button onClick={createBanner} disabled={loading} className="px-12 py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
                  PUBLISH BANNER
                </button>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {banners.map(b => (
                  <div key={b._id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm group relative overflow-hidden">
                    <div className="aspect-[21/9] rounded-xl overflow-hidden bg-slate-100 relative">
                      <img
                        src={b.image ? (b.image.startsWith('http' ) ? b.image : `${BASE_URL}/${b.image.replace(/\\/g, '/')}`) : ""}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-12 text-white">
                        <p className="text-blue-400 font-black text-xs uppercase tracking-[0.2em] mb-2">{b.subtitle}</p>
                        <h4 className="text-3xl font-black max-w-md leading-tight mb-6">{b.title}</h4>
                        <div className="w-fit px-6 py-2 bg-white text-black text-[10px] font-black uppercase rounded-full">Shop Now</div>
                      </div>
                      <button onClick={() => deleteBanner(b._id)} className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600">
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
