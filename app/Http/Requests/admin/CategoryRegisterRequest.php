<?php

namespace App\Http\Requests\admin;

use Illuminate\Foundation\Http\FormRequest;

class CategoryRegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'category_name' => 'required|string|max:50',
            'parent_id' => 'required|integer',
        ];
    }

    public function attributes()
    {
        return [
            'category_name' => 'カテゴリー名',
            'parent_id' => '親カテゴリーID',
        ];
    }
}
