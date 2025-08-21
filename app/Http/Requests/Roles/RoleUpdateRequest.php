<?php

namespace App\Http\Requests\Roles;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RoleUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('role.edit') ?? false;
    }

    public function rules(): array
    {
        $roleId = $this->route('role')?->id;
        $guard = $this->input('guard_name', 'web');

        return [
            'name' => ['required', 'string', 'max:255', 'unique:roles,name,'.$roleId],
            'guard_name' => ['nullable', 'string', 'max:255'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => [
                'string',
                Rule::exists('permissions', 'name')->where(fn ($q) => $q->where('guard_name', $guard)),
            ],
        ];
    }

    public function messages(): array
    {
        $guard = $this->input('guard_name', 'web');

        return [
            'permissions.*.exists' => 'The selected permission does not exist for the "'.$guard.'" guard.',
        ];
    }
}
