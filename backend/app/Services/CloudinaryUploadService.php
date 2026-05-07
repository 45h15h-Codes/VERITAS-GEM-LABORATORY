<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class CloudinaryUploadService
{
    private ?Cloudinary $cloudinary = null;

    private function client(): Cloudinary
    {
        if ($this->cloudinary === null) {
            $this->cloudinary = new Cloudinary([
                'cloud' => [
                    'cloud_name' => config('cloudinary.cloud_name'),
                    'api_key' => config('cloudinary.api_key'),
                    'api_secret' => config('cloudinary.api_secret'),
                ],
                'url' => [
                    'secure' => true,
                ],
            ]);
        }

        return $this->cloudinary;
    }

    public function uploadFromRequest(Request $request, string $field, string $folder, int $maxFiles = 10): array
    {
        if (!$request->hasFile($field)) {
            return [];
        }

        $files = $request->file($field);
        $files = is_array($files) ? $files : [$files];
        $uploadedFiles = [];

        foreach ($files as $index => $file) {
            if ($index >= $maxFiles) {
                break;
            }

            $result = $this->uploadFile($file, $folder);
            if ($result !== null) {
                $uploadedFiles[] = $result;
            }
        }

        return $uploadedFiles;
    }

    public function uploadFile(UploadedFile $file, string $folder): ?array
    {
        try {
            if (!$file->isValid()) {
                return null;
            }

            $originalName = $file->getClientOriginalName();
            $publicId = $folder . '/' . time() . '_' . uniqid();

            $result = $this->client()->uploadApi()->upload($file->getRealPath(), [
                'public_id' => $publicId,
                'folder' => $folder,
                'resource_type' => 'image',
                'transformation' => [
                    'quality' => 'auto:good',
                    'fetch_format' => 'auto',
                ],
            ]);

            return [
                'url' => $result['secure_url'],
                'public_id' => $result['public_id'],
                'name' => $originalName,
                'original_name' => $originalName,
                'format' => $result['format'] ?? $file->getClientOriginalExtension(),
                'size' => $file->getSize(),
                'resource_type' => $result['resource_type'] ?? 'image',
                'uploaded_at' => now()->toDateTimeString(),
            ];
        } catch (\Throwable $e) {
            Log::error('Cloudinary upload failed', [
                'file' => $file->getClientOriginalName(),
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    public function delete(string $publicId, string $resourceType = 'image'): bool
    {
        try {
            $this->client()->uploadApi()->destroy($publicId, ['resource_type' => $resourceType]);

            return true;
        } catch (\Throwable $e) {
            Log::error('Cloudinary delete failed', [
                'public_id' => $publicId,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    public function extractPublicId(string $url): ?string
    {
        if (!str_contains($url, 'cloudinary.com')) {
            return null;
        }

        if (preg_match('/\/upload\/(?:[^\/]+\/)*(?:v\d+\/)?(.+?)(?:\.[^.\/]+)?$/', $url, $matches)) {
            return $matches[1];
        }

        return null;
    }

    public function deleteByUrl(string $url, string $resourceType = 'image'): bool
    {
        $publicId = $this->extractPublicId($url);

        return $publicId ? $this->delete($publicId, $resourceType) : false;
    }
}
