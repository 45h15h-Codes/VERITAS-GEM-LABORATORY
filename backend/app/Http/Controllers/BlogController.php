<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Services\CloudinaryUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    public function __construct(private CloudinaryUploadService $uploadService)
    {
    }

    /*
     * Display a listing of blogs (Admin)
     */
    public function index()
    {
        $blogs = Blog::orderBy('created_at', 'desc')->get();
        return response()->json($blogs);
    }

    /*
     * Display published blogs (Public)
     */
    public function publicIndex()
    {
        $blogs = Blog::where('status', 'published')
            ->whereNotNull('published_at')
            ->orderBy('published_at', 'desc')
            ->get();
        return response()->json($blogs);
    }

    /*
     * Store a newly created blog
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'required|string|max:500',
            'featured_image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'author' => 'nullable|string|max:255',
            'status' => 'required|in:draft,published',
        ]); 

        $slug = Str::slug($validated['title']);

        // Handle duplicate slugs
        $originalSlug = $slug;
        $counter = 1;
        while (Blog::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        $validated['slug'] = $slug;

        // Handle image upload
        if ($request->hasFile('featured_image')) {
            $uploadedImage = $this->uploadService->uploadFile($request->file('featured_image'), 'vgl/blogs');
            if ($uploadedImage === null) {
                return response()->json([
                    'errors' => ['featured_image' => ['Failed to upload image to Cloudinary.']]
                ], 422);
            }
            $validated['featured_image'] = $uploadedImage['url'];
        }

        // Set published_at if status is published
        if ($validated['status'] === 'published' && !$request->has('published_at')) {
            $validated['published_at'] = now();
        }

        $blog = Blog::create($validated);

        return response()->json([
            'message' => 'Blog created successfully',
            'blog' => $blog
        ], 201);
    }

    /**
     * Display the specified blog
     */
    public function show($id)
    {
        $blog = Blog::findOrFail($id);
        return response()->json($blog);
    }

    /**
     * Display blog by slug (Public)
     */
    public function showBySlug($slug)
    {
        $blog = Blog::where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();
        return response()->json($blog);
    }

    /**
     * Update the specified blog
     */
    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'excerpt' => 'nullable|string|max:500',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'author' => 'nullable|string|max:255',
            'status' => 'sometimes|required|in:draft,published',
        ]);

        // Slug gets Update when title changes
        if (isset($validated['title']) && $validated['title'] !== $blog->title) {
            $slug = Str::slug($validated['title']);
            $originalSlug = $slug;
            $counter = 1;
            while (Blog::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }
            $validated['slug'] = $slug;
        }

        // image upload
        if ($request->hasFile('featured_image')) {
            $this->deleteStoredImage($blog->featured_image);

            $uploadedImage = $this->uploadService->uploadFile($request->file('featured_image'), 'vgl/blogs');
            if ($uploadedImage === null) {
                return response()->json([
                    'errors' => ['featured_image' => ['Failed to upload image to Cloudinary.']]
                ], 422);
            }
            $validated['featured_image'] = $uploadedImage['url'];
        }

        // Set published_at if changing to published
        if (isset($validated['status']) && $validated['status'] === 'published' && $blog->status !== 'published') {
            $validated['published_at'] = now();
        }

        $blog->update($validated);

        return response()->json([
            'message' => 'Blog updated successfully',
            'blog' => $blog
        ]);
    }

    /**
     * Remove the specified blog
     */
    public function destroy($id)
    {
        $blog = Blog::findOrFail($id);

        $this->deleteStoredImage($blog->featured_image);

        $blog->delete();

        return response()->json([
            'message' => 'Blog deleted successfully'
        ]);
    }

    private function deleteStoredImage(?string $image): void
    {
        if (!$image) {
            return;
        }

        if (str_contains($image, 'cloudinary.com')) {
            $this->uploadService->deleteByUrl($image);
            return;
        }

        $path = public_path($image);
        if (is_file($path)) {
            unlink($path);
        }
    }
}
