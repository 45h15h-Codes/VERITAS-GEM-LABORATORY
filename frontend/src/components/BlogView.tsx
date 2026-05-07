import React from 'react';
import { X, Calendar, User, Clock, Tag } from 'lucide-react';

interface Blog {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featured_image: string | null;
    author: string;
    status: 'draft' | 'published';
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

interface BlogViewProps {
    blog: Blog;
    onClose: () => void;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

export const BlogView: React.FC<BlogViewProps> = ({ blog, onClose }) => {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Not published';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const calculateReadTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes;
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200 px-8 py-6 rounded-t-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            blog.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-amber-100 text-amber-800'
                        }`}>
                            {blog.status}
                        </span>
                        <h2 className="text-xl font-bold text-gray-900">Blog Preview</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-amber-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 max-h-[calc(100vh-12rem)] overflow-y-auto">
                    {/* Featured Image */}
                    {blog.featured_image && (
                        <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                            <img
                                src={`${API_BASE_URL}/api/media/${blog.featured_image}`}
                                alt={blog.title}
                                className="w-full h-full object-cover overflow-hidden"
                            />
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        {blog.title}
                    </h1>

                    {/* Excerpt */}
                    {blog.excerpt && (
                        <p className="text-xl text-gray-600 mb-6 leading-relaxed font-light">
                            {blog.excerpt}
                        </p>
                    )}

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-6 py-4 mb-8 border-y border-gray-200">
                        <div className="flex items-center gap-2 text-gray-600">
                            <User className="w-4 h-4" />
                            <span className="text-sm font-medium">{blog.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{formatDate(blog.published_at || blog.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{calculateReadTime(blog.content)} min read</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Tag className="w-4 h-4" />
                            <span className="text-sm font-mono text-gray-500">{blog.slug}</span>
                        </div>
                    </div>

                    {/* Blog Content */}
                    <div 
                        className="prose prose-lg prose-slate max-w-none
                            prose-headings:font-bold prose-headings:text-gray-900
                            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                            prose-p:text-gray-700 prose-p:leading-relaxed
                            prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-gray-900 prose-strong:font-semibold
                            prose-ul:list-disc prose-ol:list-decimal
                            prose-li:text-gray-700
                            prose-blockquote:border-l-4 prose-blockquote:border-amber-500 prose-blockquote:bg-amber-50 prose-blockquote:py-2 prose-blockquote:px-4
                            prose-code:text-amber-600 prose-code:bg-amber-50 prose-code:px-2 prose-code:py-1 prose-code:rounded
                            prose-pre:bg-gray-900 prose-pre:text-gray-100
                            prose-img:rounded-xl prose-img:shadow-lg"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-8 py-4 rounded-b-2xl flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Last updated: {formatDate(blog.updated_at)}
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
                    >
                        Close Preview
                    </button>
                </div>
            </div>
        </div>
    );
};