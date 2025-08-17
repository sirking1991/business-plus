<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NavigationItemStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('navigation_item.add') ?? false;
    }

    public function rules(): array
    {
        return [
            'section' => ['required', 'string', 'max:100'],
            'title' => ['required', 'string', 'max:150'],
            'href' => ['required', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:100'],
            'permission' => ['nullable', 'string', 'max:150'],
            'sort' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
