<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Navigation\NavigationItemStoreRequest;
use App\Http\Requests\Navigation\NavigationItemUpdateRequest;
use App\Models\NavigationItem;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class NavigationItemsController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(NavigationItem::class, 'navigation_item');
    }

    public function index(): Response
    {
        $search = request('search');

        $items = NavigationItem::query()
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('title', 'like', "%{$search}%")
                        ->orWhere('section', 'like', "%{$search}%")
                        ->orWhere('href', 'like', "%{$search}%")
                        ->orWhere('permission', 'like', "%{$search}%");
                });
            })
            ->orderBy('section')
            ->orderBy('sort')
            ->orderBy('title')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (NavigationItem $i) => [
                'id' => $i->id,
                'section' => $i->section,
                'title' => $i->title,
                'href' => $i->href,
                'icon' => $i->icon,
                'permission' => $i->permission,
                'sort' => $i->sort,
                'is_active' => (bool) $i->is_active,
                'updated_at' => $i->updated_at?->toDateTimeString(),
            ]);

        return Inertia::render('navigation-items/index', [
            'items' => $items,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('navigation-items/create');
    }

    public function store(NavigationItemStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['is_active'] = (bool) ($data['is_active'] ?? false);

        $item = NavigationItem::create($data);

        return redirect()->route('admin.navigation-items.edit', $item)->with('success', 'Navigation item created.');
    }

    public function edit(NavigationItem $navigation_item): Response
    {
        return Inertia::render('navigation-items/edit', [
            'item' => [
                'id' => $navigation_item->id,
                'section' => $navigation_item->section,
                'title' => $navigation_item->title,
                'href' => $navigation_item->href,
                'icon' => $navigation_item->icon,
                'permission' => $navigation_item->permission,
                'sort' => $navigation_item->sort,
                'is_active' => (bool) $navigation_item->is_active,
            ],
        ]);
    }

    public function update(NavigationItemUpdateRequest $request, NavigationItem $navigation_item): RedirectResponse
    {
        $data = $request->validated();
        $data['is_active'] = (bool) ($data['is_active'] ?? false);

        $navigation_item->update($data);

        return redirect()->route('admin.navigation-items.edit', $navigation_item)->with('success', 'Navigation item updated.');
    }

    public function destroy(NavigationItem $navigation_item): RedirectResponse
    {
        $navigation_item->delete();

        return redirect()->route('admin.navigation-items.index')->with('success', 'Navigation item deleted.');
    }
}
