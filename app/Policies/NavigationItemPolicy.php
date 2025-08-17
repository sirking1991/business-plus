<?php

namespace App\Policies;

use App\Models\NavigationItem;
use App\Models\User;

class NavigationItemPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('navigation_item.browse');
    }

    public function view(User $user, NavigationItem $item): bool
    {
        return $user->can('navigation_item.read');
    }

    public function create(User $user): bool
    {
        return $user->can('navigation_item.add');
    }

    public function update(User $user, NavigationItem $item): bool
    {
        return $user->can('navigation_item.edit');
    }

    public function delete(User $user, NavigationItem $item): bool
    {
        return $user->can('navigation_item.delete');
    }
}
