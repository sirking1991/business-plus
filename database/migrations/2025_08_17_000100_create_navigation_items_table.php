<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('navigation_items', function (Blueprint $table) {
            $table->id();
            $table->string('section')->default('Platform'); // e.g., Platform, Administration
            $table->string('title');
            $table->string('href');
            $table->string('icon')->nullable(); // lucide-react icon name, e.g., 'LayoutGrid'
            $table->string('permission')->nullable(); // e.g., 'user.browse'
            $table->integer('sort')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Seed initial navigation items
        $items = [
            [
                'section' => 'Administration',
                'title' => 'Users',
                'href' => '/admin/users',
                'icon' => 'Users',
                'permission' => 'user.browse',
                'sort' => 0,
                'is_active' => true,
            ],
            [
                'section' => 'Administration',
                'title' => 'Navigation',
                'href' => '/admin/navigation-items',
                'icon' => 'Navigation',
                'permission' => 'navigation_item.browse',
                'sort' => 10,
                'is_active' => true,
            ],
        ];

        foreach ($items as $data) {
            DB::table('navigation_items')->updateOrInsert(
                ['href' => $data['href']],
                $data,
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('navigation_items');
    }
};
