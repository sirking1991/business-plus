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
        // Create role permissions
        $rolePermissions = [
            'role.browse',
            'role.read',
            'role.edit',
            'role.add',
            'role.delete',
        ];

        foreach ($rolePermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create a sample admin role with all permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        // Create navigation item for roles
        NavigationItem::firstOrCreate([
            'section' => 'Administration',
            'title' => 'Roles',
            'href' => '/admin/roles',
            'icon' => 'Shield',
            'permission' => 'role.browse',
            'sort' => 30,
            'is_active' => true,
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove role permissions
        $rolePermissions = [
            'role.browse',
            'role.read',
            'role.edit',
            'role.add',
            'role.delete',
        ];

        foreach ($rolePermissions as $permission) {
            Permission::where('name', $permission)->delete();
        }

        // Remove sample roles
        Role::where('name', 'admin')->delete();

        // Remove navigation item for roles
        NavigationItem::where('href', '/admin/roles')->delete();
    }
};
