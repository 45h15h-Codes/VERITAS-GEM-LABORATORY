// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';

// interface Blog {
//     id: number;
//     title: string;
//     slug: string;
//     excerpt: string;
//     featured_image: string | null;
//     author: string;
//     published_at: string;
// }

// const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

// export const PublicBlogs: React.FC = () => {
//     const [blogs, setBlogs] = useState<Blog[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [isScrolled, setIsScrolled] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchBlogs();
//     }, []);

//     useEffect(() => {
//         const handleScroll = () => setIsScrolled(window.scrollY > 20);
//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);

//     const fetchBlogs = async () => {
//         try {
//             const response = await axios.get(`${API_BASE_URL}/api/blogs`);
//             setBlogs(response.data);
//         } catch (error) {
//             console.error('Error fetching blogs:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const formatDate = (dateString: string) => {
//         return new Date(dateString).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//         });
//     };

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
//                 <div className="text-slate-600 font-light">Loading articles...</div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">

//             {/* Elegant Navigation */}
//             <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm py-4' : 'bg-transparent py-6'
//                 }`}>
//                 <div className="max-w-7xl mx-auto px-6 lg:px-12">
//                     <div className="flex justify-between items-center">
//                         <div
//                             className="flex items-center space-x-4 group cursor-pointer"
//                             role="button"
//                             tabIndex={0}
//                             onClick={() => (window.location.href = '/')}
//                             onKeyDown={(e) => { if (e.key === 'Enter') (window.location.href = '/'); }}
//                         >
//                             <div className="relative">
//                                 <img
//                                     src={`${API_BASE_URL}/images/VGL-LOGO.png`}
//                                     alt="VGL Logo"
//                                     className="w-20 h-20  rounded-full shadow-lg object-cover group-hover:shadow-xl transition-all duration-300"
//                                 />
//                                 <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white to-white opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
//                             </div>
//                             <div className="flex flex-col">
//                                 <span className="text-xl font-light  text-slate-900">VGL</span>
//                                 <span className="text-[9px] font-medium tracking-[0.2em] text-slate-500 uppercase">Veritas Gem Laboratory</span>
//                             </div>
//                         </div>

//                         <div className="hidden md:flex items-center space-x-8">
//                             <button
//                                 onClick={() => navigate('/')}
//                                 className="text-sm font-light tracking-wide text-slate-600 hover:text-slate-900 transition-colors duration-300 relative group"
//                             >
//                                 Home
//                                 <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-[#465B5D] to-[#9CA56A] group-hover:w-full transition-all duration-300"></span>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </nav>

//             {/* Hero Section */}
//             <div className="relative pt-32 pb-20 px-6 lg:px-12 overflow-hidden">
//                 <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-amber-50 via-transparent to-transparent rounded-full blur-3xl opacity-30 -z-10"></div>
//                 <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-50 via-transparent to-transparent rounded-full blur-3xl opacity-20 -z-10"></div>

//                 <div className="max-w-6xl mx-auto text-center">
//                     <h1 className="text-4xl md:text-7xl font-extralight tracking-tight text-slate-900 mb-8 leading-[1.1]">
//                         VGL
//                         <span className="block mt-2 bg-gradient-to-r from-[#465B5D] via-[#9CA56A] to-[#465B5D] bg-clip-text text-transparent font-light">
//                             Journal
//                         </span>
//                     </h1>

//                     <p className="text-lg font-light text-slate-600 mb-16 max-w-3xl mx-auto leading-relaxed">
//                         Insights, stories, and expert knowledge from the world of gemology
//                     </p>
//                 </div>
//             </div>

//             {/* Blog Grid */}
//             <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-32">
//                 {blogs.length === 0 ? (
//                     <div className="text-center py-32">
//                         <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
//                             <BookOpen className="w-10 h-10 text-slate-400" />
//                         </div>
//                         <h3 className="text-2xl font-light text-slate-900 mb-3">No articles published yet</h3>
//                         <p className="text-slate-600 font-light">Check back soon for new insights</p>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                         {blogs.map((blog) => (
//                             <article
//                                 key={blog.id}
//                                 onClick={() => navigate(`/blogs/${blog.slug}`)}
//                                 className="group cursor-pointer"
//                             >
//                                 <div className="relative bg-white rounded-2xl overflow-hidden border border-slate-200/50 hover:border-slate-300/50 hover:shadow-xl transition-all duration-500">
//                                     {/* Featured Image */}
//                                     {blog.featured_image ? (
//                                         <div className="h-56 overflow-hidden">
//                                             <img
//                                                 src={`${API_BASE_URL}/${blog.featured_image}`}
//                                                 alt={blog.title}
//                                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                                             />
//                                         </div>
//                                     ) : (
//                                         <div className="h-56 bg-gradient-to-br from-slate-100 via-slate-50 to-white flex items-center justify-center relative overflow-hidden">
//                                             <div className="absolute inset-0 bg-gradient-to-br from-[#465B5D]/5 to-[#9CA56A]/5"></div>
//                                             <BookOpen className="w-16 h-16 text-slate-300" />
//                                         </div>
//                                     )}

//                                     {/* Content */}
//                                     <div className="p-8">
//                                         {/* Meta Info */}
//                                         <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 font-light">
//                                             <div className="flex items-center gap-1.5">
//                                                 <Calendar className="w-3.5 h-3.5" />
//                                                 <span>{formatDate(blog.published_at)}</span>
//                                             </div>
//                                             <div className="flex items-center gap-1.5">
//                                                 <User className="w-3.5 h-3.5" />
//                                                 <span>{`${blog.author.slice(0, 15)}…` || blog.author}</span>
//                                             </div>
//                                         </div>

//                                         {/* Title */}
//                                         <h2 className="text-xl font-light tracking-wide text-slate-900 mb-3 group-hover:text-[#465B5D] transition-colors duration-300 line-clamp-2">
//                                             {`${blog.title.slice(0, 20)}…` || blog.title}
//                                         </h2>

//                                         {/* Excerpt */}
//                                         <p className="text-sm font-light text-slate-600 mb-6 line-clamp-3 leading-relaxed">
//                                             {`${blog.excerpt.slice(0, 89)}…` || blog.excerpt}
//                                         </p>

//                                         {/* Read More */}
//                                         <div className="flex items-center gap-2 text-[#465B5D] text-sm font-medium group-hover:gap-3 transition-all duration-300">
//                                             Read Article
//                                             <ArrowRight className="w-4 h-4" />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </article>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Footer */}
//             <footer className="relative py-16 px-6 lg:px-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
//                 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzIxMjEyMSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
//                 <div className="relative max-w-7xl mx-auto text-center">
//                     <p className="text-white/70 text-sm font-light tracking-wide">
//                         © 2025 VGL Gemological Institute. All rights reserved.
//                     </p>
//                 </div>
//             </footer>
//         </div>
//     );
// };

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowRight, BookOpen, Menu, X } from 'lucide-react';

interface Blog {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featured_image: string | null;
    author: string;
    published_at: string;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

export const PublicBlogs: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlogs();
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/blogs`);
            setBlogs(response.data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 px-4">
                <div className="text-slate-600 font-light text-sm sm:text-base">Loading articles...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
            {/* Mobile-First Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm py-3 md:py-4' : 'bg-transparent py-4 md:py-6'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                    <div className="flex justify-between items-center">
                        <div
                            className="flex items-center space-x-2 sm:space-x-4 group cursor-pointer"
                            role="button"
                            tabIndex={0}
                            onClick={() => (window.location.href = '/')}
                            onKeyDown={(e) => { if (e.key === 'Enter') (window.location.href = '/'); }}
                        >
                            <div className="relative">
                                <img
                                    src={`${API_BASE_URL}/images/VGL-LOGO.svg`}
                                    alt="VGL Logo"
                                    className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full shadow-lg object-cover group-hover:shadow-xl transition-all duration-300"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-base sm:text-lg md:text-xl font-light text-slate-900">VGL</span>
                                <span className="text-[8px] sm:text-[9px] font-medium tracking-[0.2em] text-slate-500 uppercase hidden sm:block">
                                    Veritas Gem Laboratory
                                </span>
                            </div>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center space-x-8">
                            <button
                                onClick={() => navigate('/')}
                                className="text-sm font-light tracking-wide text-slate-600 hover:text-slate-900 transition-colors duration-300 relative group"
                            >
                                Home
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-[#465B5D] to-[#9CA56A] group-hover:w-full transition-all duration-300"></span>
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-4 pb-4 border-t border-slate-200">
                            <button
                                onClick={() => {
                                    navigate('/');
                                    setMobileMenuOpen(false);
                                }}
                                className="flex items-center w-full text-left px-4 py-3 text-sm font-light text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors mt-2"
                            >
                                Home
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section - Responsive */}
            <div className="relative pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-12 overflow-hidden">
                <div className="absolute top-0 right-0 w-[300px] sm:w-[600px] md:w-[800px] h-[300px] sm:h-[600px] md:h-[800px] bg-gradient-to-bl from-amber-50 via-transparent to-transparent rounded-full blur-3xl opacity-30 -z-10"></div>

                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extralight tracking-tight text-slate-900 mb-6 sm:mb-8 leading-[1.1]">
                        VGL
                        <span className="block mt-2 bg-gradient-to-r from-[#465B5D] via-[#9CA56A] to-[#465B5D] bg-clip-text text-transparent font-light">
                            Journal
                        </span>
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg font-light text-slate-600 mb-8 sm:mb-12 md:mb-16 max-w-3xl mx-auto leading-relaxed px-4">
                        Insights, stories, and expert knowledge from the world of gemology
                    </p>
                </div>
            </div>

            {/* Blog Grid - Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-16 sm:pb-24 md:pb-32">
                {blogs.length === 0 ? (
                    <div className="text-center py-16 sm:py-24 md:py-32">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-light text-slate-900 mb-2 sm:mb-3">No articles published yet</h3>
                        <p className="text-sm sm:text-base text-slate-600 font-light">Check back soon for new insights</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {blogs.map((blog) => (
                            <article
                                key={blog.id}
                                onClick={() => navigate(`/blogs/${blog.slug}`)}
                                className="group cursor-pointer"
                            >
                                <div className="relative bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/50 hover:border-slate-300/50 hover:shadow-xl transition-all duration-500">
                                    {/* Featured Image */}
                                    {blog.featured_image ? (
                                        <div className="h-48 sm:h-56 overflow-hidden">
                                            <img
                                                src={`${API_BASE_URL}/api/media/${blog.featured_image}`}
                                                alt={blog.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-48 sm:h-56 bg-gradient-to-br from-slate-100 via-slate-50 to-white flex items-center justify-center relative overflow-hidden">
                                            <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300" />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="p-5 sm:p-6 md:p-8">
                                        {/* Meta Info */}
                                        <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-slate-500 mb-3 sm:mb-4 font-light">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                                                <span className="truncate">{formatDate(blog.published_at)}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <User className="w-3 sm:w-3.5 h-3 sm:h-3.5 flex-shrink-0" />
                                                <span className="truncate">{blog.author}</span>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h2 className="text-lg sm:text-xl font-light tracking-wide text-slate-900 mb-2 sm:mb-3 group-hover:text-[#465B5D] transition-colors duration-300 line-clamp-2">
                                            {blog.title}
                                        </h2>

                                        {/* Excerpt */}
                                        <p className="text-xs sm:text-sm font-light text-slate-600 mb-4 sm:mb-6 line-clamp-3 leading-relaxed">
                                            {blog.excerpt}
                                        </p>

                                        {/* Read More */}
                                        <div className="flex items-center gap-2 text-[#465B5D] text-xs sm:text-sm font-medium group-hover:gap-3 transition-all duration-300">
                                            Read Article
                                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer - Responsive */}
            <footer className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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