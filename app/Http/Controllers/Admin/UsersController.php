<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\UserStoreRequest;
use App\Http\Requests\Users\UserUpdateRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UsersController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(User::class, 'user');
    }

    public function index(): Response
    {
        $search = request('search');

        $users = User::query()
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'created_at' => $u->created_at?->toDateTimeString(),
            ]);

        return Inertia::render('users/index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('users/create');
    }

    public function store(UserStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        return redirect()->route('admin.users.edit', $user)->with('success', 'User created.');
    }

    public function show(User $user): Response
    {
        return Inertia::render('users/show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at?->toDateTimeString(),
                'updated_at' => $user->updated_at?->toDateTimeString(),
            ],
        ]);
    }

    public function edit(User $user): Response
    {
        $user->load('roles');
        
        $roles = Role::all()->map(fn (Role $role) => [
            'id' => $role->id,
            'name' => $role->name,
        ]);

        return Inertia::render('users/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name')->toArray(),
            ],
            'roles' => $roles,
        ]);
    }

    public function update(UserUpdateRequest $request, User $user): RedirectResponse
    {
        $data = $request->validated();
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        // Handle role assignment
        if (isset($data['roles'])) {
            $user->syncRoles($data['roles']);
        }

        return redirect()->route('admin.users.edit', $user)->with('success', 'User updated.');
    }

    public function destroy(User $user): RedirectResponse
    {
        Log::info('UsersController::destroy called', [
            'user_id' => $user->id,
            'user_email' => $user->email,
            'auth_user_id' => auth()->id(),
            'auth_user_email' => auth()->user()?->email,
            'request_method' => request()->method(),
            'request_url' => request()->fullUrl(),
        ]);

        $user->delete();

        Log::info('User deleted successfully', ['deleted_user_id' => $user->id]);

        return redirect()->route('admin.users.index')->with('success', 'User deleted.');
    }
}
