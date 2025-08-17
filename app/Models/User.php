<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasRoles, Notifiable {
        HasRoles::hasRole as protected spatieHasRole;
        HasRoles::hasAnyRole as protected spatieHasAnyRole;
        HasRoles::hasAllRoles as protected spatieHasAllRoles;
        HasRoles::hasPermissionTo as protected spatieHasPermissionTo;
        HasRoles::hasAnyPermission as protected spatieHasAnyPermission;
        HasRoles::hasAllPermissions as protected spatieHasAllPermissions;
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
        ];
    }

    // --- Admin bypass for Spatie permission/role checks ---
    public function hasRole($roles, ?string $guard = null): bool
    {
        return (bool) $this->is_admin || $this->spatieHasRole($roles, $guard);
    }

    public function hasAnyRole(...$roles): bool
    {
        return (bool) $this->is_admin || $this->spatieHasAnyRole(...$roles);
    }

    public function hasAllRoles(...$roles): bool
    {
        return (bool) $this->is_admin || $this->spatieHasAllRoles(...$roles);
    }

    public function hasPermissionTo($permission, $guardName = null): bool
    {
        return (bool) $this->is_admin || $this->spatieHasPermissionTo($permission, $guardName);
    }

    public function hasAnyPermission(...$permissions): bool
    {
        return (bool) $this->is_admin || $this->spatieHasAnyPermission(...$permissions);
    }

    public function hasAllPermissions(...$permissions): bool
    {
        return (bool) $this->is_admin || $this->spatieHasAllPermissions(...$permissions);
    }
}
