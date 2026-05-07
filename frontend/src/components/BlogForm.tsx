import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Image as ImageIcon, Save } from 'lucide-react';
import { Button } from './Button';
import { TiptapEditor } from './TiptapEditor';
import { resolveImageUrl } from '../utils/imageUrl';

interface BlogFormData {
    title: string;
    content: string;
    excerpt: string;
    author: string;
    status: 'draft' | 'published';
    featured_image?: File | null;
}

interface Blog {
    id: number;
    title: string;
    content: string;
    excerpt: string;
    author: string;
    status: 'draft' | 'published';
    featured_image: string | null;
}

interface BlogFormProps {
    blog?: Blog | null;
    onSuccess: () => void;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

export const BlogForm: React.FC<BlogFormProps> = ({ blog, onSuccess }) => {
    const [formData, setFormData] = useState<BlogFormData>({
        title: '',
        content: '',
        excerpt: '',
        author: 'Admin',
        status: 'draft',
        featured_image: null,
    });

    const [existingImage, setExistingImage] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (blog) {
            setFormData({
                title: blog.title,
                content: blog.content,
                excerpt: blog.excerpt || '',
                author: blog.author,
                status: blog.status,
                featured_image: null,
            });
            if (blog.featured_image) {
                setExistingImage(resolveImageUrl(blog.featured_image, API_BASE_URL));
            }
        }
    }, [blog]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2048000) {
                setErrors((prev) => ({ ...prev, featured_image: 'Image size must be less than 2MB' }));
                return;
            }
            setFormData((prev) => ({ ...prev, featured_image: file }));
            setImagePreview(URL.createObjectURL(file));
            setErrors((prev) => ({ ...prev, featured_image: '' }));
        }
    };

    const removeImage = () => {
        setFormData((prev) => ({ ...prev, featured_image: null }));
        setImagePreview(null);
        setExistingImage(null);
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!formData.content.trim()) {
            newErrors.content = 'Content is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const token = localStorage.getItem('jewelry_admin_token');
            const submitData = new FormData();

            submitData.append('title', formData.title);
            submitData.append('content', formData.content);
            submitData.append('excerpt', formData.excerpt);
            submitData.append('author', formData.author);
            submitData.append('status', formData.status);

            if (formData.featured_image) {
                submitData.append('featured_image', formData.featured_image);
            }

            if (blog) {
                await axios.post(`${API_BASE_URL}/api/admin/blogs/${blog.id}`, submitData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await axios.post(`${API_BASE_URL}/api/admin/blogs`, submitData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            onSuccess();
        } catch (error: any) {
            console.error('Error saving blog:', error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert('Failed to save blog');
            }
        } finally {
            setLoading(false);
        }
    };

    const currentImage = imagePreview || existingImage;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Blog Title <span className="text-red-600 ml-1">*</span>
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border ${errors.title ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                    placeholder="Enter blog title"
                />
                {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Excerpt */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Excerpt (Short Description) <span className="text-red-600 ml-1">*</span>
                </label>
                <input
                    type="text"
                    name="excerpt"
                    value={formData.excerpt}
                    required
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Brief description for blog preview"
                    maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.excerpt.length}/500 characters</p>
            </div>

            {/* Featured Image */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Featured Image <span className="text-red-600 ml-1">*</span>
                </label>
                {currentImage ? (
                    <div className="relative inline-block">
                        <img
                            src={currentImage}
                            alt="Preview"
                            className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-500 transition-colors">
                        <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                        <label className="cursor-pointer">
                            <span className="text-amber-600 hover:text-amber-700 font-medium">
                                Choose an image
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 2MB</p>
                    </div>
                )}
                {errors.featured_image && (
                    <p className="text-red-600 text-sm mt-1">{errors.featured_image}</p>
                )}
            </div>

            {/* Content */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Blog Content <span className="text-red-600 ml-1">*</span>
                </label>
                <TiptapEditor
                    content={formData.content}
                    onChange={(content) => {
                        setFormData((prev) => ({ ...prev, content }));
                        if (errors.content) {
                            setErrors((prev) => ({ ...prev, content: '' }));
                        }
                    }}
                />
                {errors.content && <p className="text-red-600 text-sm mt-1">{errors.content}</p>}
            </div>

            {/* Author */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Author</label>
                <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Author name"
                />
            </div>

            {/* Status */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Publication Status
                </label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                    <option value="draft">Draft (Not visible to public)</option>
                    <option value="published">Published (Live on website)</option>
                </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 rounded-2xl">
                <Button type="submit" disabled={loading} className="flex items-center gap-2 rounded-lg">
                    <Save className="w-5 h-5" />
                    {loading ? 'Saving...' : blog ? 'Update Blog' : 'Create Blog'}
                </Button>
            </div>
        </form>
    );
};
