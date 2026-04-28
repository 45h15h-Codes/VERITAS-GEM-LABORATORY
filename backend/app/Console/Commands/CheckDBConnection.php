<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CheckDBConnection extends Command
{
    protected $signature = 'db:check';
    protected $description = 'Check if database connection works';

    public function handle()
    {
        try {
            DB::connection()->getPdo();
            $this->info('✅ Ho Gaya Bhai Database Connect!');
        } catch (\Exception $e) {
            $this->error('❌ Database connection failed: ' . $e->getMessage());
        }
    }
}