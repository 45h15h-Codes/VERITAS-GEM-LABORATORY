<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Admin::updateOrCreate(
            ['email' => 'admin@certificate.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('admin123'),
            ]
        );
    }
}
