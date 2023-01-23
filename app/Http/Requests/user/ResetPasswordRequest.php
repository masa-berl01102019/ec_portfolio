<?php

namespace App\Http\Requests\user;

use Illuminate\Foundation\Http\FormRequest;


class ResetPasswordRequest extends FormRequest
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
            'email' => 'required|email:strict,dns,spoof|max:100'
        ];
    }

    public function attributes()
    {
        return [
            'email' => 'メールアドレス'
        ];
    }
}