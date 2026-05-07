import React from 'react';
import { FileText, Pen, Trash, Eye } from 'lucide-react';
import Swal from 'sweetalert2';

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

interface BlogListProps {
    blogs: Blog[];
    onView: (blog: Blog) => void;
    onEdit: (blog: Blog) => void;
    onDelete: (id: number) => void;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

export const BlogList: React.FC<BlogListProps> = ({ blogs, onView, onEdit, onDelete }) => {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Not published';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (blogs.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No blogs yet</h3>
                <p className="text-gray-600">Get started by creating your first blog post</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-amber-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Blog Post
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Author
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Published
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {blogs.map((blog) => (
                            <tr key={blog.id} className="hover:bg-amber-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        {blog.featured_image ? (
                                            <img
                                                src={`${API_BASE_URL}/api/media/${blog.featured_image}`}
                                                alt={blog.title}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <FileText className="w-8 h-8 text-gray-400" />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{blog.title}</h3>
                                            <p className="text-sm text-gray-500 line-clamp-1">
                                                {blog.excerpt || 'No excerpt'}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-gray-700">{blog.author}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${blog.status === 'published'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-amber-100 text-amber-800'
                                            }`}
                                    >
                                        {blog.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-600">{formatDate(blog.published_at)}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onView(blog)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="View"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onEdit(blog)}
                                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Pen className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                Swal.fire({
                                                    title: 'Delete Blog?',
                                                    text: 'Are you sure you want to delete this blog post?',
                                                    icon: 'warning',
                                                    showCancelButton: true,
                                                    confirmButtonColor: '#f59e0b',
                                                    cancelButtonColor: '#d1d5db',
                                                    confirmButtonText: 'Yes, delete it!',
                                                    background: '#fff8e1',
                                                    customClass: {
                                                        popup: 'rounded-2xl shadow-xl',
                                                        confirmButton: 'font-bold',
                                                        cancelButton: 'font-bold'
                                                    }
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        onDelete(blog.id);
                                                    }
                                                });
                                            }}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};