<?php

namespace App\Console\Commands;

use App\Models\Blog;
use App\Models\Certificate;
use App\Models\Store;
use App\Services\CloudinaryUploadService;
use Illuminate\Console\Command;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;

class MigrateToCloudinary extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:migrate-to-cloudinary 
                            {--force : Force migration even if already a URL}
                            {--dry-run : Only show which images would be uploaded without actually doing it}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate local images from Blogs, Certificates, and Stores to Cloudinary';

    public function __construct(private CloudinaryUploadService $uploadService)
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if ($this->option('dry-run')) {
            $this->warn('!!! RUNNING IN DRY-RUN MODE - NO CHANGES WILL BE MADE !!!');
        }

        $this->info('Starting migration to Cloudinary...');

        $this->migrateBlogs();
        $this->migrateCertificates();
        $this->migrateStores();

        $this->info('Migration process finished!');
    }

    private function migrateBlogs()
    {
        $blogs = Blog::all();
        $this->info("Checking " . $blogs->count() . " blogs...");

        foreach ($blogs as $blog) {
            $image = $blog->featured_image;
            if (!$image) continue;

            if ($this->shouldMigrate($image)) {
                if ($this->option('dry-run')) {
                    $this->line(" [DRY-RUN] Would migrate blog image: {$image}");
                    continue;
                }

                $this->comment("Migrating blog image: {$image}");
                $url = $this->uploadToCloudinary($image, 'vgl/blogs');
                if ($url) {
                    $blog->update(['featured_image' => $url]);
                    $this->info("Successfully migrated blog ID: {$blog->id}");
                } else {
                    $this->error("Failed to migrate blog ID: {$blog->id}");
                }
            }
        }
    }

    private function migrateCertificates()
    {
        $certificates = Certificate::all();
        $this->info("Checking " . $certificates->count() . " certificates...");

        foreach ($certificates as $certificate) {
            $image = $certificate->image;
            if (!$image) continue;

            if ($this->shouldMigrate($image)) {
                if ($this->option('dry-run')) {
                    $this->line(" [DRY-RUN] Would migrate certificate image: {$image}");
                    continue;
                }

                $this->comment("Migrating certificate image: {$image}");
                $url = $this->uploadToCloudinary($image, 'vgl/certificates');
                if ($url) {
                    $certificate->update(['image' => $url]);
                    $this->info("Successfully migrated certificate ID: {$certificate->id}");
                } else {
                    $this->error("Failed to migrate certificate ID: {$certificate->id}");
                }
            }
        }
    }

    private function migrateStores()
    {
        $stores = Store::all();
        $this->info("Checking " . $stores->count() . " stores...");

        foreach ($stores as $store) {
            $image = $store->template_image;
            if (!$image) continue;

            if ($this->shouldMigrate($image)) {
                if ($this->option('dry-run')) {
                    $this->line(" [DRY-RUN] Would migrate store template: {$image}");
                    continue;
                }

                $this->comment("Migrating store template: {$image}");
                $url = $this->uploadToCloudinary($image, 'vgl/stores');
                if ($url) {
                    $store->update(['template_image' => $url]);
                    $this->info("Successfully migrated store ID: {$store->id}");
                } else {
                    $this->error("Failed to migrate store ID: {$store->id}");
                }
            }
        }
    }

    private function shouldMigrate(string $path): bool
    {
        if ($this->option('force')) return true;

        // If it already looks like a URL, don't migrate
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return false;
        }

        return true;
    }

    private static $discoveredPaths = [];

    private function uploadToCloudinary(string $path, string $folder): ?string
    {
        $cleanPath = ltrim($path, '/');
        $filename = basename($cleanPath);
        $decodedFilename = urldecode($filename);
        
        // Scout the structure once to help debugging
        if (empty(self::$discoveredPaths)) {
            $this->comment("Scouting project structure...");
            $roots = [base_path(), base_path('../public_html'), base_path('../www')];
            foreach ($roots as $root) {
                if (File::exists($root)) {
                    $this->line("Listing top 10 files in: {$root}");
                    try {
                        $files = array_slice(File::files($root), 0, 10);
                        foreach ($files as $f) $this->line(" - " . $f->getFilename());
                        
                        if (File::exists($root . '/uploads')) {
                            $this->line("Found 'uploads' folder, listing contents...");
                            $uploads = array_slice(File::directories($root . '/uploads'), 0, 5);
                            foreach ($uploads as $d) $this->line(" + " . basename($d));
                        }
                    } catch (\Exception $e) {}
                }
            }
            self::$discoveredPaths['checked'] = true;
        }

        $potentialPaths = [
            public_path($cleanPath),
            base_path('../public_html/' . $cleanPath),
            storage_path('app/public/' . $cleanPath),
        ];

        $fullPath = null;
        foreach ($potentialPaths as $p) {
            if (File::exists($p)) { $fullPath = $p; break; }
            if (File::exists(urldecode($p))) { $fullPath = urldecode($p); break; }
        }

        // System Find Fallback (Fastest and most reliable on Linux)
        if (!$fullPath) {
            $this->comment("Attempting system find for: {$filename}");
            $searchRoot = base_path('../');
            $cmd = "find " . escapeshellarg($searchRoot) . " -name " . escapeshellarg($filename) . " -type f 2>/dev/null | head -n 1";
            $output = [];
            exec($cmd, $output);
            if (!empty($output) && !empty($output[0])) {
                $fullPath = trim($output[0]);
            } else {
                // Try with decoded filename
                $cmd = "find " . escapeshellarg($searchRoot) . " -name " . escapeshellarg($decodedFilename) . " -type f 2>/dev/null | head -n 1";
                exec($cmd, $output);
                if (!empty($output) && !empty($output[0])) {
                    $fullPath = trim($output[0]);
                }
            }
        }

        if (!$fullPath) {
            $this->warn("File not found: {$filename}");
            return null;
        }

        $this->info("Found file at: {$fullPath}");

        $file = new UploadedFile(
            $fullPath,
            File::name($fullPath),
            File::mimeType($fullPath),
            null,
            true
        );

        $result = $this->uploadService->uploadFile($file, $folder);

        return $result['url'] ?? null;
    }
}
