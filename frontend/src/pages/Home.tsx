// import React, { useState, useEffect, useRef } from "react";
// import {
//   Search,
//   Sparkles,
//   Shield,
//   Award,
//   Check,
//   BookOpen,
//   Calendar,
//   User,
// } from "lucide-react";

// interface HomeProps {
//   onAdminClick: () => void;
//   onCertificateFound: (certificateNumber: string) => void;
// }

// const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

// export const Home: React.FC<HomeProps> = ({
//   onAdminClick,
//   onCertificateFound,
// }) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searching, setSearching] = useState(false);
//   const [notFound, setNotFound] = useState(false);

//   // const handleSearch = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setSearching(true);
//   //   setNotFound(false);

//   //   const query = searchQuery.trim().toLowerCase();

//   //   if (query === import.meta.env.VITE_ADMIN_ACCESS_KEY.toLowerCase()) {
//   //     onAdminClick();
//   //     setSearching(false);
//   //     return;
//   //   }

//   //   try {
//   //     const res = await axios.get(`${API_BASE_URL}/api/certificates`);
//   //     const found = res.data.find((cert: any) => cert.certificate_number === searchQuery.trim());
//   //     if (found) {
//   //       onCertificateFound(searchQuery.trim());
//   //     } else {
//   //       setNotFound(true);
//   //     }
//   //   } catch {
//   //     setNotFound(true);
//   //   }
//   //   setSearching(false);
//   // };

//   const [isScrolled, setIsScrolled] = useState(false);
//   const [blogSuggestions, setBlogSuggestions] = useState<any[]>([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [loadingSuggestions, setLoadingSuggestions] = useState(false);
//   const searchRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Close suggestions when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         searchRef.current &&
//         !searchRef.current.contains(event.target as Node)
//       ) {
//         setShowSuggestions(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Fetch blog suggestions as user types
//   useEffect(() => {
//     const fetchBlogSuggestions = async () => {
//       const query = searchQuery.trim().toLowerCase();

//       if (query.length < 2) {
//         setBlogSuggestions([]);
//         setShowSuggestions(false);
//         return;
//       }

//       setLoadingSuggestions(true);
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/blogs`);
//         if (response.ok) {
//           const blogs = await response.json();
//           const filtered = blogs
//             .filter((blog: any) => {
//               const title = (blog.title || "").toLowerCase();
//               const excerpt = (blog.excerpt || "").toLowerCase();
//               return title.includes(query) || excerpt.includes(query);
//             })
//             .slice(0, 5); // Show max 5 suggestions

//           setBlogSuggestions(filtered);
//           setShowSuggestions(filtered.length > 0);
//         }
//       } catch (error) {
//         console.error("Error fetching blog suggestions:", error);
//       } finally {
//         setLoadingSuggestions(false);
//       }
//     };

//     const debounce = setTimeout(fetchBlogSuggestions, 300);
//     return () => clearTimeout(debounce);
//   }, [searchQuery]);

//   const handleBlogClick = (blog: any) => {
//     window.location.href = `/blogs/${blog.slug}`;
//     setShowSuggestions(false);
//   };

//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSearching(true);
//     setNotFound(false);

//     // Also perform a client-side blog search (by title, slug or id).
//     // If a matching blog is found, navigate to its page and stop further certificate search.
//     const normalized = searchQuery.trim().toLowerCase();
//     try {
//       const blogsRes = await fetch(`${API_BASE_URL}/api/blogs`);
//       if (blogsRes.ok) {
//         const blogs = await blogsRes.json();
//         const foundBlog = blogs.find((b: any) => {
//           const title = (b.title || "").toString().toLowerCase();
//           const slug = (b.slug || "").toString().toLowerCase();
//           const id = (b.id || "").toString().toLowerCase();
//           return (
//             title.includes(normalized) ||
//             slug === normalized ||
//             id === normalized
//           );
//         });
//         if (foundBlog) {
//           // Navigate to blog detail page (fallback to id when slug is missing)
//           window.location.href = `/blogs/${foundBlog.slug || foundBlog.id}`;
//           setSearching(false);
//           return;
//         }
//       }
//     } catch {
//       // Ignore blog fetch errors and continue with certificate search
//     }
//     const query = searchQuery.trim().toLowerCase();
//     // Check if user typed "admin login"
//     if (query === import.meta.env.VITE_ADMIN_ACCESS_KEY.toLowerCase()) {
//       onAdminClick();
//       setSearching(false);
//       return;
//     }
//     // Otherwise, continue normal certificate search
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/certificates`);
//       const data = await res.json();
//       const found = data.find(
//         (cert: any) => cert.certificate_number.toLowerCase() === query
//       );
//       if (found) {
//         onCertificateFound(found.certificate_number);
//       } else {
//         setNotFound(true);
//       }
//     } catch {
//       setNotFound(true);
//     }
//     setSearching(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
//       {/* Elegant Navigation */}
//       <nav
//         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
//           isScrolled
//             ? "bg-white/95 backdrop-blur-xl shadow-sm py-4"
//             : "bg-transparent py-6"
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-6 lg:px-12">
//           <div className="flex justify-between items-center">
//             <div
//               className="flex items-center space-x-4 group cursor-pointer"
//               role="button"
//               tabIndex={0}
//               onClick={() => (window.location.href = "/")}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") window.location.href = "/";
//               }}
//             >
//               <div className="relative">
//                 <img
//                   src={`${API_BASE_URL}/images/VGL-LOGO.png`}
//                   alt="VGL Logo"
//                   className="w-20 h-20  rounded-full shadow-lg object-cover group-hover:shadow-xl transition-all duration-300"
//                 />
//                 <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white to-white opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-xl font-light  text-slate-900">
//                   Veritas Gem Laboratory
//                 </span>
//                 <span className="text-[9px] font-medium tracking-[0.2em] text-slate-500 uppercase">
//                   {/* Veritas Gem Laboratory */}
//                 </span>
//               </div>
//             </div>

//             <div className="hidden md:flex items-center space-x-8">
//               <button
//                 onClick={() => (window.location.href = "/blogs")}
//                 className="text-sm font-light tracking-wide text-slate-600 hover:text-slate-900 transition-colors duration-300 relative group"
//               >
//                 Blogs
//                 <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-amber-400 to-amber-500 group-hover:w-full transition-all duration-300"></span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <div className="relative pt-32 pb-24 px-6 lg:px-12 overflow-visible">
//         {/* Subtle Background Elements */}
//         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-amber-50 via-transparent to-transparent rounded-full blur-3xl opacity-30 -z-10"></div>
//         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-50 via-transparent to-transparent rounded-full blur-3xl opacity-20 -z-10"></div>

//         <div className="max-w-6xl mx-auto text-center">
//           {/* Premium Badge */}
//           <div className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-sm mb-10 group hover:shadow-md transition-all duration-300">
//             <Shield className="w-3.5 h-3.5 text-[#465B5D]" />
//             <span className="text-xs font-medium tracking-wider text-slate-700 uppercase">
//               One of the World's Largest Independent Grading Services
//             </span>
//           </div>

//           {/* Elegant Headline */}
//           <h1 className="text-4xl md:text-7xl font-extralight tracking-tight text-slate-900 mb-8 leading-[1.1]">
//             Excellence You Can See
//             <span className="block mt-2 bg-gradient-to-r from-[#465B5D] via-[#9CA56A] to-[#465B5D] bg-clip-text text-transparent font-light">
//               Trust You Can Feel
//             </span>
//           </h1>
//           <p className="text-lg font-light text-slate-600 mb-16 mt-2 max-w-3xl mx-auto leading-relaxed">
//             VGL's supreme position in the gemological world is no coincidence.
//             It is the result of continuous research, support, and synergy with
//             professionals and gemological institutes worldwide.
//           </p>

//           {/* Premium Search */}
//           <div className="max-w-3xl mx-auto relative z-10" ref={searchRef}>
//             <div className="relative group">
//               <div className="absolute inset-0 bg-gradient-to-r from-[#465B5D] via-[#9CA56A] to-[#465B5D] rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
//               <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200/50 p-2 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
//                 <div className="flex items-center">
//                   <div className="pl-6 pr-4 flex items-center">
//                     <Search className="w-5 h-5 text-slate-400" />
//                   </div>
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => {
//                       setSearchQuery(e.target.value);
//                       setNotFound(false);
//                     }}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         e.preventDefault();
//                         handleSearch(e);
//                       }
//                     }}
//                     placeholder="Search certificates by number (e.g., VGL123456) or find blogs"
//                     className="flex-1 py-5 text-base font-light text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
//                   />
//                   <button
//                     onClick={handleSearch}
//                     disabled={searching || !searchQuery.trim()}
//                     className="px-8 py-4 rounded-xl bg-[#465B5D] hover:bg-[#3B4D4F] text-white font-medium text-sm tracking-wide hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 whitespace-nowrap"
//                   >
//                     {searching ? "Verifying..." : "Verify Certificate"}
//                   </button>
//                 </div>
//               </div>

//               {/* Blog Suggestions Dropdown */}
//               {showSuggestions && blogSuggestions.length > 0 && (
//                 <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
//                   <div className="p-3 bg-slate-50 border-b border-slate-200">
//                     <div className="flex items-center gap-2 text-xs font-medium text-slate-600 uppercase tracking-wider">
//                       <BookOpen className="w-4 h-4" />
//                       <span>Blog Suggestions</span>
//                     </div>
//                   </div>
//                   <div className="max-h-96 overflow-y-auto">
//                     {blogSuggestions.map((blog) => (
//                       <button
//                         key={blog.id}
//                         onClick={() => handleBlogClick(blog)}
//                         className="w-full text-left p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 group"
//                       >
//                         <div className="flex items-start gap-4">
//                           {blog.featured_image ? (
//                             <img
//                               src={`${API_BASE_URL}/${blog.featured_image}`}
//                               alt={blog.title}
//                               className="w-16 h-16 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
//                             />
//                           ) : (
//                             <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
//                               <BookOpen className="w-6 h-6 text-slate-400" />
//                             </div>
//                           )}
//                           <div className="flex-1 min-w-0">
//                             <h4 className="font-medium text-slate-900 group-hover:text-[#465B5D] transition-colors line-clamp-1 mb-1">
//                               {blog.title}
//                             </h4>
//                             {blog.excerpt && (
//                               <p className="text-sm text-slate-600 line-clamp-2 mb-2">
//                                 {blog.excerpt}
//                               </p>
//                             )}
//                             <div className="flex items-center gap-4 text-xs text-slate-500">
//                               <div className="flex items-center gap-1">
//                                 <User className="w-3 h-3" />
//                                 <span>{blog.author}</span>
//                               </div>
//                               <div className="flex items-center gap-1">
//                                 <Calendar className="w-3 h-3" />
//                                 <span>
//                                   {new Date(
//                                     blog.published_at
//                                   ).toLocaleDateString()}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                   {loadingSuggestions && (
//                     <div className="p-4 text-center text-sm text-slate-500">
//                       Loading suggestions...
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//             {notFound && (
//               <div className="mt-6 p-5 bg-red-50/50 backdrop-blur-sm border border-red-100 rounded-xl">
//                 <p className="text-sm font-medium text-red-800 mb-1">
//                   Certificate not found
//                 </p>
//                 <p className="text-sm font-light text-red-700">
//                   No certificate found with number "{searchQuery}". Please
//                   verify the number and try again.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Services Section */}
//       <div className="py-32 px-6 lg:px-12 bg-white">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-20">
//             <h2 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900 mb-6">
//               Our Reports
//             </h2>
//             <p className="text-lg font-light text-slate-600 max-w-2xl mx-auto">
//               Rely on our insights on essential facts in the global diamond, gem
//               and jewelry market, covering the complete value-chain
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {[
//               {
//                 icon: Shield,
//                 title: "Verified Authenticity",
//                 description:
//                   "Each certificate undergoes rigorous verification processes by certified gemologists",
//                 gradient: "from-[#465B5D] via-[#465B5D] to-[#465B5D]",
//               },
//               {
//                 icon: Sparkles,
//                 title: "Premium Quality",
//                 description:
//                   "Detailed reports on cut, clarity, color and carat weight of the finest gemstones",
//                 gradient: "from-[#465B5D] via-[#465B5D] to-[#465B5D]",
//               },
//               {
//                 icon: Check,
//                 title: "Instant Access",
//                 description:
//                   "View, download and share your certificates instantly from anywhere",
//                 gradient: "from-[#465B5D] via-[#465B5D] to-[#465B5D]",
//               },
//               {
//                 icon: Award,
//                 title: "Physical Copies",
//                 description:
//                   "Order beautifully printed certificates with secure packaging and delivery",
//                 gradient: "from-[#465B5D] via-[#465B5D] to-[#465B5D]",
//               },
//             ].map((item, idx) => (
//               <div
//                 key={idx}
//                 className="group relative bg-gradient-to-b from-slate-50 to-white rounded-2xl p-8 border border-slate-200/50 hover:border-slate-300/50 hover:shadow-xl transition-all duration-500"
//               >
//                 <div className="relative mb-6">
//                   <div
//                     className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
//                   >
//                     <item.icon className="w-7 h-7 text-white" />
//                   </div>
//                   <div
//                     className={`absolute inset-0 rounded-xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`}
//                   ></div>
//                 </div>
//                 <h3 className="text-xl font-light tracking-wide text-slate-900 mb-3">
//                   {item.title}
//                 </h3>
//                 <p className="text-sm font-light text-slate-600 leading-relaxed">
//                   {item.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Trust Banner */}
//       <div className="relative py-20 px-6 lg:px-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
//         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzIxMjEyMSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-20">
//           <div className="relative max-w-5xl mx-auto text-center">
//             <p className="text-white/90 text-lg font-light tracking-wide mb-8">
//               Trusted by luxury jewelry boutiques and gemological institutes
//               worldwide
//             </p>
//             <div className="flex flex-wrap justify-center items-center gap-12">
//               {[
//                 { label: "Since 2005", sublabel: "Legacy" },
//                 { label: "5000+", sublabel: "Certificates" },
//                 { label: "Global", sublabel: "Standards" },
//               ].map((stat, idx) => (
//                 <div key={idx} className="text-center">
//                   <div className="text-3xl font-light text-white mb-1 tracking-wide">
//                     {stat.label}
//                   </div>
//                   <div className="text-xs font-light text-white/60 tracking-[0.2em] uppercase">
//                     {stat.sublabel}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

/* ----------------------------------------------------------------------------------------------------------------------------------------------------------------- */

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Shield,
  Award,
  Check,
  BookOpen,
  Calendar,
  User,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

interface HomeProps {
  onAdminClick: () => void;
  onCertificateFound: (certificateNumber: string) => void;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

export const Home: React.FC<HomeProps> = ({
  onAdminClick,
  onCertificateFound,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [blogSuggestions, setBlogSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchBlogSuggestions = async () => {
      const query = searchQuery.trim().toLowerCase();

      if (query.length < 2) {
        setBlogSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setLoadingSuggestions(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/blogs`);
        if (response.ok) {
          const blogs = await response.json();
          const filtered = blogs
            .filter((blog: any) => {
              const title = (blog.title || "").toLowerCase();
              const excerpt = (blog.excerpt || "").toLowerCase();
              return title.includes(query) || excerpt.includes(query);
            })
            .slice(0, 5);

          setBlogSuggestions(filtered);
          setShowSuggestions(filtered.length > 0);
        }
      } catch (error) {
        console.error("Error fetching blog suggestions:", error);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const debounce = setTimeout(fetchBlogSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleBlogClick = (blog: any) => {
    window.location.href = `/blogs/${blog.slug}`;
    setShowSuggestions(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setNotFound(false);

    const normalized = searchQuery.trim().toLowerCase();
    try {
      const blogsRes = await fetch(`${API_BASE_URL}/api/blogs`);
      if (blogsRes.ok) {
        const blogs = await blogsRes.json();
        const foundBlog = blogs.find((b: any) => {
          const title = (b.title || "").toString().toLowerCase();
          const slug = (b.slug || "").toString().toLowerCase();
          const id = (b.id || "").toString().toLowerCase();
          return (
            title.includes(normalized) ||
            slug === normalized ||
            id === normalized
          );
        });
        if (foundBlog) {
          window.location.href = `/blogs/${foundBlog.slug || foundBlog.id}`;
          setSearching(false);
          return;
        }
      }
    } catch { }

    const query = searchQuery.trim().toLowerCase();
    if (query === import.meta.env.VITE_ADMIN_ACCESS_KEY.toLowerCase()) {
      onAdminClick();
      setSearching(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/certificates`);
      const data = await res.json();
      const found = data.find(
        (cert: any) => cert.certificate_number.toLowerCase() === query
      );
      if (found) {
        onCertificateFound(found.certificate_number);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    }
    setSearching(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Mobile-First Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-sm py-3 md:py-4"
            : "bg-transparent py-4 md:py-6"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex justify-between items-center">
            {/* Logo - Responsive sizing */}
            <div
              className="flex items-center space-x-2 sm:space-x-4 group cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => (window.location.href = "/")}
              onKeyDown={(e) => {
                if (e.key === "Enter") window.location.href = "/";
              }}
            >
              <div className="relative">
                <img
                  src={`${API_BASE_URL}/images/VGL-LOGO.svg`}
                  alt="VGL Logo"
                  className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full shadow-lg object-cover group-hover:shadow-xl transition-all duration-300"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg md:text-xl font-light text-slate-900">
                  Veritas Gem Laboratory
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => (window.location.href = "/blogs")}
                className="text-sm font-light tracking-wide text-slate-600 hover:text-slate-900 transition-colors duration-300 relative group"
              >
                Blogs
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-amber-400 to-amber-500 group-hover:w-full transition-all duration-300"></span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-slate-200">
              <div className="pt-4 space-y-3">
                <button
                  onClick={() => {
                    window.location.href = "/blogs";
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm font-light text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Blogs
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Mobile First */}
      <div className="relative pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 lg:px-12 overflow-visible">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] bg-gradient-to-bl from-amber-50 via-transparent to-transparent rounded-full blur-3xl opacity-30 -z-10"></div>

        <div className="max-w-6xl mx-auto text-center">
          {/* Premium Badge - Responsive */}
          <div className="inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-sm mb-6 sm:mb-8 md:mb-10 group hover:shadow-md transition-all duration-300">
            <Shield className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#465B5D]" />
            <span className="text-[10px] sm:text-xs font-medium tracking-wider text-slate-700 uppercase">
              World's Largest Independent Grading
            </span>
          </div>

          {/* Headline - Responsive Typography */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extralight tracking-tight text-slate-900 mb-4 sm:mb-6 md:mb-8 leading-[1.1]">
            Excellence You Can See
            <span className="block mt-2 bg-gradient-to-r from-[#465B5D] via-[#9CA56A] to-[#465B5D] bg-clip-text text-transparent font-light">
              Trust You Can Feel
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg font-light text-slate-600 mb-8 sm:mb-12 md:mb-16 max-w-3xl mx-auto leading-relaxed px-4">
            VGL's supreme position in the gemological world is no coincidence.
            It is the result of continuous research, support, and synergy with
            professionals worldwide.
          </p>

          {/* Search Bar - Mobile First */}
          <div className="max-w-3xl mx-auto relative z-10" ref={searchRef}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#465B5D] via-[#9CA56A] to-[#465B5D] rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-xl border border-slate-200/50 p-2 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                {/* Mobile: Stacked Layout */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                  <div className="flex items-center flex-1">
                    <div className="pl-4 sm:pl-6 pr-3 sm:pr-4 flex items-center">
                      <Search className="w-4 sm:w-5 h-4 sm:h-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setNotFound(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSearch(e);
                        }
                      }}
                      placeholder="Search certificates or blogs"
                      className="flex-1 py-3 sm:py-4 md:py-5 text-sm sm:text-base font-light text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={searching || !searchQuery.trim()}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-[#465B5D] hover:bg-[#3B4D4F] text-white font-medium text-sm tracking-wide hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 whitespace-nowrap"
                  >
                    {searching ? "Verifying..." : "Verify Certificate"}
                  </button>
                </div>
              </div>

              {/* Blog Suggestions - Mobile Optimized */}
              {showSuggestions && blogSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200/50 overflow-hidden z-50">
                  <div className="p-3 bg-slate-50 border-b border-slate-200">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600 uppercase tracking-wider">
                      <BookOpen className="w-4 h-4" />
                      <span>Blog Suggestions</span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {blogSuggestions.map((blog) => (
                      <button
                        key={blog.id}
                        onClick={() => handleBlogClick(blog)}
                        className="w-full text-left p-3 sm:p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 group"
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          {blog.featured_image ? (
                            <img
                              src={`${API_BASE_URL}/${blog.featured_image}`}
                              alt={blog.title}
                              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              <BookOpen className="w-5 sm:w-6 h-5 sm:h-6 text-slate-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm sm:text-base text-slate-900 group-hover:text-[#465B5D] transition-colors line-clamp-1 mb-1">
                              {blog.title}
                            </h4>
                            {blog.excerpt && (
                              <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-2">
                                {blog.excerpt}
                              </p>
                            )}
                            <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-slate-500">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span className="truncate">{blog.author}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>
                                  {new Date(
                                    blog.published_at
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Error Message - Mobile Optimized */}
            {notFound && (
              <div className="mt-4 sm:mt-6 p-4 sm:p-5 bg-red-50/50 backdrop-blur-sm border border-red-100 rounded-xl">
                <p className="text-sm font-medium text-red-800 mb-1">
                  Certificate not found
                </p>
                <p className="text-xs sm:text-sm font-light text-red-700">
                  No certificate found with number "{searchQuery}". Please
                  verify and try again.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Services Section - Responsive Grid */}
      <div className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-slate-900 mb-4 sm:mb-6">
              Our Reports
            </h2>
            <p className="text-base sm:text-lg font-light text-slate-600 max-w-2xl mx-auto px-4">
              Rely on our insights covering the complete value-chain
            </p>
          </div>

          {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: Shield,
                title: "Verified Authenticity",
                description:
                  "Each certificate undergoes rigorous verification processes by certified gemologists",
                gradient: "from-[#465B5D] via-[#465B5D] to-[#465B5D]",
              },
              {
                icon: Sparkles,
                title: "Premium Quality",
                description:
                  "Detailed reports on cut, clarity, color and carat weight of the finest gemstones",
                gradient: "from-[#465B5D] via-[#465B5D] to-[#465B5D]",
              },
              {
                icon: Check,
                title: "Instant Access",
                description:
                  "View, download and share your certificates instantly from anywhere",
                gradient: "from-[#465B5D] via-[#465B5D] to-[#465B5D]",
              },
              {
                icon: Award,
                title: "Physical Copies",
                description:
                  "Order beautifully printed certificates with secure packaging and delivery",
                gradient: "from-[#465B5D] via-[#465B5D] to-[#465B5D]",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group relative bg-gradient-to-b from-slate-50 to-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-slate-200/50 hover:border-slate-300/50 hover:shadow-xl transition-all duration-500"
              >
                <div className="relative mb-4 sm:mb-6">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  >
                    <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-light tracking-wide text-slate-900 mb-2 sm:mb-3">
                  {item.title}
                </h3>
                <p className="text-sm font-light text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Banner - Responsive */}
      <div className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzIxMjEyMSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <p className="text-white/90 text-sm sm:text-base md:text-lg font-light tracking-wide mb-6 sm:mb-8">
            Trusted by luxury jewelry boutiques worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
            {[
              { label: "Since 2005", sublabel: "Legacy" },
              { label: "5000+", sublabel: "Certificates" },
              { label: "Global", sublabel: "Standards" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-2xl sm:text-3xl font-light text-white mb-1 tracking-wide">
                  {stat.label}
                </div>
                <div className="text-xs font-light text-white/60 tracking-[0.2em] uppercase">
                  {stat.sublabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};