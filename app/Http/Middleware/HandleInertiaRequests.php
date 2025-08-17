<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use App\Models\NavigationItem;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $aclReady = Schema::hasTable('permissions') && Schema::hasTable('roles');
        $navReady = Schema::hasTable('navigation_items');

        $navigation = [];
        if ($navReady) {
            $items = NavigationItem::query()
                ->where('is_active', true)
                ->orderBy('section')
                ->orderBy('sort')
                ->orderBy('title')
                ->get(['section', 'title', 'href', 'icon', 'permission']);

            $filtered = $items->filter(function ($item) use ($request, $aclReady) {
                if (! $item->permission) {
                    return true;
                }
                return $aclReady ? (bool) $request->user()?->can($item->permission) : false;
            });

            $navigation = $filtered->groupBy('section')->map(function ($group, $section) {
                return [
                    'title' => $section,
                    'items' => $group->map(function ($i) {
                        return [
                            'title' => $i->title,
                            'href' => $i->href,
                            'icon' => $i->icon,
                        ];
                    })->values()->all(),
                ];
            })->values()->all();
        } else {
            // Fallback minimal navigation if table not yet migrated
            $navigation = [
                [
                    'title' => 'Platform',
                    'items' => [
                        ['title' => 'Dashboard', 'href' => '/dashboard', 'icon' => 'LayoutGrid'],
                    ],
                ],
            ];
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            // Flat list of permission names, e.g. ["user.browse", "user.add", ...]
            'permissions' => $aclReady && $request->user()
                ? $request->user()->getAllPermissions()->pluck('name')->toArray()
                : [],
            // Table-driven navigation grouped by section, already filtered by ACL
            'navigation' => $navigation,
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
