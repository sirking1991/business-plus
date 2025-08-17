<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Roles\RoleStoreRequest;
use App\Http\Requests\Roles\RoleUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Role::class, 'role');
    }

    public function index(): Response
    {
        $search = request('search');

        $roles = Role::query()
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('guard_name', 'like', "%{$search}%");
                });
            })
            ->latest('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Role $role) => [
                'id' => $role->id,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
                'permissions_count' => $role->permissions()->count(),
                'created_at' => $role->created_at?->toDateTimeString(),
            ]);

        return Inertia::render('roles/index', [
            'roles' => $roles,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        $permissions = Permission::all()->map(fn (Permission $permission) => [
            'id' => $permission->id,
            'name' => $permission->name,
            'guard_name' => $permission->guard_name,
        ]);

        return Inertia::render('roles/create', [
            'permissions' => $permissions,
        ]);
    }

    public function store(RoleStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        
        $role = Role::create([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);

        if (!empty($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return redirect()->route('admin.roles.edit', $role)->with('success', 'Role created.');
    }

    public function show(Role $role): Response
    {
        $role->load('permissions');

        return Inertia::render('roles/show', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
                'permissions' => $role->permissions->map(fn (Permission $permission) => [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'guard_name' => $permission->guard_name,
                ]),
                'created_at' => $role->created_at?->toDateTimeString(),
                'updated_at' => $role->updated_at?->toDateTimeString(),
            ],
        ]);
    }

    public function edit(Role $role): Response
    {
        $role->load('permissions');
        
        $permissions = Permission::all()->map(fn (Permission $permission) => [
            'id' => $permission->id,
            'name' => $permission->name,
            'guard_name' => $permission->guard_name,
        ]);

        return Inertia::render('roles/edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
                'permissions' => $role->permissions->pluck('name')->toArray(),
            ],
            'permissions' => $permissions,
        ]);
    }

    public function update(RoleUpdateRequest $request, Role $role): RedirectResponse
    {
        $data = $request->validated();
        
        $role->update([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);

        if (isset($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return redirect()->route('admin.roles.edit', $role)->with('success', 'Role updated.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        Log::info('RolesController::destroy called', [
            'role_id' => $role->id,
            'role_name' => $role->name,
            'auth_user_id' => auth()->id(),
            'auth_user_email' => auth()->user()?->email,
            'request_method' => request()->method(),
            'request_url' => request()->fullUrl(),
        ]);

        $role->delete();

        Log::info('Role deleted successfully', ['deleted_role_id' => $role->id]);

        return redirect()->route('admin.roles.index')->with('success', 'Role deleted.');
    }
}
