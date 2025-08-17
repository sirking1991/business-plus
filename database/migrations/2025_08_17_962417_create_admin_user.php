<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $email = 'admin@example.com';

        // Create admin user if not exists
        if (!DB::table('users')->where('email', $email)->exists()) {
            $userId = DB::table('users')->insertGetId([
                'name' => 'Administrator',
                'email' => $email,
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'is_admin' => true,
                'remember_token' => Str::random(10),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Only proceed if roles table exists
            if (Schema::hasTable('roles')) {
                // Create roles and permissions
                if (!DB::table('roles')->where('name', 'admin')->exists()) {
                    DB::table('roles')->insert([
                        'name' => 'admin',
                        'guard_name' => 'web',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                // Get all permissions for users dynamically
                $permissions = DB::table('permissions')->pluck('name')->toArray();

                // If no permissions found, fallback to default user permissions
                if (empty($permissions)) {
                    $permissions = [
                        'user.browse',
                        'user.read',
                        'user.add',
                        'user.edit',
                        'user.delete',
                    ];
                }

                foreach ($permissions as $permission) {
                    if (!DB::table('permissions')->where('name', $permission)->exists()) {
                        DB::table('permissions')->insert([
                            'name' => $permission,
                            'guard_name' => 'web',
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }

                // Assign permissions to role
                $roleId = DB::table('roles')->where('name', 'admin')->value('id');

                foreach ($permissions as $permission) {
                    $permissionId = DB::table('permissions')->where('name', $permission)->value('id');

                    if (!DB::table('role_has_permissions')->where('role_id', $roleId)->where('permission_id', $permissionId)->exists()) {
                        DB::table('role_has_permissions')->insert([
                            'role_id' => $roleId,
                            'permission_id' => $permissionId,
                        ]);
                    }
                }

                // Assign role to user
                if (!DB::table('model_has_roles')->where('model_id', $userId)->where('role_id', $roleId)->exists()) {
                    DB::table('model_has_roles')->insert([
                        'role_id' => $roleId,
                        'model_type' => 'App\\Models\\User',
                        'model_id' => $userId,
                    ]);
                }
            }
        } else {
            // Ensure existing admin email has is_admin flag set
            DB::table('users')->where('email', $email)->update(['is_admin' => true, 'updated_at' => now()]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('users')->where('email', 'admin@example.com')->delete();
    }
};
