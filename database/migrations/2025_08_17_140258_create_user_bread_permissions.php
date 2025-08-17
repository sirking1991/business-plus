<?php

use App\Models\NavigationItem;
use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create user BREAD permissions
        $userPermissions = [
            'user.browse',
            'user.read',
            'user.edit',
            'user.add',
            'user.delete',
        ];

        foreach ($userPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Give admin role all user permissions
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $adminRole->givePermissionTo($userPermissions);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove user permissions
        $userPermissions = [
            'user.browse',
            'user.read',
            'user.edit',
            'user.add',
            'user.delete',
        ];

        foreach ($userPermissions as $permission) {
            Permission::where('name', $permission)->delete();
        }

        // Remove navigation item for users
        NavigationItem::where('href', '/admin/users')->delete();
    }
};
