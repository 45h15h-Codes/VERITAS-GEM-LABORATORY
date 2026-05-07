// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import { Calendar, User, ArrowLeft, Clock, Radius } from "lucide-react";

// interface Blog {
//   id: number;
//   title: string;
//   slug: string;
//   content: string;
//   excerpt: string;
//   featured_image: string | null;
//   author: string;
//   published_at: string;
// }

// const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

// export const BlogDetail: React.FC = () => {
//   const { slug } = useParams<{ slug: string }>();
//   const [blog, setBlog] = useState<Blog | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchBlog();
//   }, [slug]);

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const fetchBlog = async () => {
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/api/blogs/slug/${slug}`
//       );
//       setBlog(response.data);
//     } catch (error) {
//       console.error("Error fetching blog:", error);
//       setError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const calculateReadTime = (content: string) => {
//     const wordsPerMinute = 200;
//     const words = content.split(/\s+/).length;
//     const minutes = Math.ceil(words / wordsPerMinute);
//     return `${minutes} min read`;
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
//         <div className="text-slate-600 font-light">Loading article...</div>
//       </div>
//     );
//   }

//   if (error || !blog) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
//         <div className="text-center">
//           <h2 className="text-2xl font-light text-slate-900 mb-4">
//             Article not found
//           </h2>
//           <button
//             onClick={() => navigate("/blogs")}
//             className="text-[#465B5D] hover:text-[#3B4D4F] font-light flex items-center gap-2 mx-auto transition-colors duration-300"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back to Journal
//           </button>
//         </div>
//       </div>
//     );
//   }

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
//                   src={`${API_BASE_URL}/api/media/images/VGL-LOGO.png`}
//                   alt="VGL Logo"
//                   className="w-20 h-20  rounded-full shadow-lg object-cover group-hover:shadow-xl transition-all duration-300"
//                 />
//                 <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white to-white opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-xl font-light  text-slate-900">VGL</span>
//                 <span className="text-[9px] font-medium tracking-[0.2em] text-slate-500 uppercase">
//                   Veritas Gem Laboratory
//                 </span>
//               </div>
//             </div>

//             <div className="hidden md:flex items-center space-x-8">
//               <button
//                 onClick={() => navigate("/")}
//                 className="text-sm font-light tracking-wide text-slate-600 hover:text-slate-900 transition-colors duration-300 relative group"
//               >
//                 Home
//                 <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-[#465B5D] to-[#9CA56A] group-hover:w-full transition-all duration-300"></span>
//               </button>
//               <button className="text-sm font-medium tracking-wide text-slate-900 relative">
//                 Blog
//                 <span className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-[#465B5D] to-[#9CA56A]"></span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Article */}
//       <article className="max-w-4xl mx-auto px-6 lg:px-12 pt-32 pb-24">
//         {/* Back Button */}
//         <button
//           onClick={() => navigate("/blogs")}
//           className="flex items-center gap-2 text-[#465B5D] hover:text-[#3B4D4F] font-light text-sm mb-12 group transition-colors duration-300"
//         >
//           <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
//           Back to Journal
//         </button>

//         {/* Featured Image */}
//         {blog.featured_image && (
//           <div className="mb-16 rounded-2xl overflow-hidden shadow-2xl border border-slate-200/50">
//             <img
//               src={`${API_BASE_URL}/${blog.featured_image}`}
//               alt={blog.title}
//               className="w-full h-[500px] object-cover"
//             />
//           </div>
//         )}

//         {/* Header */}
//         <header className="mb-12">
//           <h1 className="text-4xl md:text-6xl font-extralight tracking-tight text-slate-900 mb-8 leading-[1.1]">
//             {blog.title}
//           </h1>

//           {/* Meta Info */}
//           <div className="flex items-center gap-6 text-sm text-slate-600 font-light">
//             <div className="flex items-center gap-2">
//               <User className="w-4 h-4" />
//               <span>{blog.author}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Calendar className="w-4 h-4" />
//               <span>{formatDate(blog.published_at)}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Clock className="w-4 h-4" />
//               <span>{calculateReadTime(blog.content)}</span>
//             </div>
//           </div>
//         </header>

//         {/* Excerpt */}
//         {blog.excerpt && (
//           <div
//             className="mb-12 p-8 bg-gradient-to-r from-slate-50 to-white border-l-2 border-[#465B5D] rounded-r-2xl"
//             style={{ borderRadius: "10px" }}
//           >
//             <p className="text-lg font-light text-slate-700 italic leading-relaxed">
//               {blog.excerpt}
//             </p>
//           </div>
//         )}

//         {/* Content */}
//         <div
//           className="mb-12 p-8 bg-gradient-to-r from-slate-50 to-white border-l-2 border-[#465B5D] rounded-r-2xl"
//           style={{ borderRadius: "10px" }}
//           dangerouslySetInnerHTML={{ __html: blog.content }}
//         />
//       </article>

//       {/* Footer */}
//       <footer className="relative py-16 px-6 lg:px-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 mt-24">
//         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzIxMjEyMSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
//         <div className="relative max-w-7xl mx-auto text-center">
//           <p className="text-white/70 text-sm font-light tracking-wide">
//             © 2025 VGL Gemological Institute. All rights reserved.
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// };


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, User, ArrowLeft, Clock, Menu, X } from "lucide-react";
interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  author: string;
  published_at: string;
}
const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";
export const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchBlog();
  }, [slug]);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [slug]);
  const fetchBlog = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/blogs/slug/${slug}`
      );
      setBlog(response.data);
    } catch (error) {
      console.error("Error fetching blog:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 px-4">
        <div className="text-slate-600 font-light text-sm sm:text-base">
          Loading article...
        </div>
      </div>
    );
  }
  if (error || !blog) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 px-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-light text-slate-900 mb-4">
            Article not found
          </h2>
          <button
            onClick={() => navigate("/blogs")}
            className="text-[#465B5D] hover:text-[#3B4D4F] font-light flex items-center gap-2 mx-auto transition-colors duration-300 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Journal
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Responsive Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-sm py-3 sm:py-4"
            : "bg-transparent py-4 sm:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex justify-between items-center">
            {/* Logo */}
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
                  src={`${API_BASE_URL}/api/media/images/VGL-LOGO.svg`}
                  alt="VGL Logo"
                  className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full shadow-lg object-cover group-hover:shadow-xl transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white to-white opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg lg:text-xl font-light text-slate-900">
                  VGL
                </span>
                <span className="text-[7px] sm:text-[8px] lg:text-[9px] font-medium tracking-[0.15em] sm:tracking-[0.2em] text-slate-500 uppercase">
                  Veritas Gem Laboratory
                </span>
              </div>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <button
                onClick={() => navigate("/")}
                className="text-sm font-light tracking-wide text-slate-600 hover:text-slate-900 transition-colors duration-300 relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-[#465B5D] to-[#9CA56A] group-hover:w-full transition-all duration-300"></span>
              </button>
              <button className="text-sm font-medium tracking-wide text-slate-900 relative">
                Blog
                <span className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-[#465B5D] to-[#9CA56A]"></span>
              </button>
            </div>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-lg border-t border-slate-200/50">
              <div className="px-4 py-6 space-y-4">
                <button
                  onClick={() => {
                    navigate("/");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm font-light tracking-wide text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors duration-300"
                >
                  Home
                </button>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left px-4 py-2 text-sm font-medium tracking-wide text-slate-900 bg-slate-50 rounded-lg"
                >
                  Blog
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24">
        {/* Back Button */}
        <button
          onClick={() => navigate("/blogs")}
          className="flex items-center gap-2 text-[#465B5D] hover:text-[#3B4D4F] font-light text-xs sm:text-sm mb-8 sm:mb-10 lg:mb-12 group transition-colors duration-300"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Journal
        </button>
        {/* Featured Image */}
        {blog.featured_image && (
          <div className="mb-10 sm:mb-12 lg:mb-16 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl border border-slate-200/50">
            <img
              src={`${API_BASE_URL}/api/media/${blog.featured_image}`}
              alt={blog.title}
              className="w-full h-48 sm:h-64 md:h-80 lg:h-[500px] object-cover"
            />
          </div>
        )}
        {/* Header */}
        <header className="mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extralight tracking-tight text-slate-900 mb-6 sm:mb-7 lg:mb-8 leading-tight sm:leading-tight lg:leading-[1.1]">
            {blog.title}
          </h1>
          {/* Meta Info - Responsive Grid */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-slate-600 font-light">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate max-w-[120px] sm:max-w-none">
                {blog.author}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">
                {formatDate(blog.published_at)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">
                {calculateReadTime(blog.content)}
              </span>
            </div>
          </div>
        </header>
        {/* Excerpt */}
        {blog.excerpt && (
          <div className="mb-8 sm:mb-10 lg:mb-12 p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-slate-50 to-white border-l-2 border-[#465B5D] rounded-r-xl sm:rounded-r-2xl rounded-2xl">
            <p className="text-sm sm:text-base lg:text-lg font-light text-slate-700 italic leading-relaxed">
              {blog.excerpt}
            </p>
          </div>
        )}
        {/* Content */}
        <div
          className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-8 sm:mb-10 lg:mb-12 p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-slate-50 to-white border-l-2 border-[#465B5D] rounded-r-xl sm:rounded-r-2xl prose-headings:font-light prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-[#465B5D] prose-a:no-underline hover:prose-a:text-[#3B4D4F] prose-strong:text-slate-900 prose-strong:font-semibold prose-img:rounded-lg prose-img:shadow-md rounded-2xl"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
      {/* Footer */}
      <footer className="relative py-12 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 mt-16 sm:mt-20 lg:mt-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzIxMjEyMSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <p className="text-white/70 text-xs sm:text-sm font-light tracking-wide">
            © 2025 VGL Gemological Institute. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};