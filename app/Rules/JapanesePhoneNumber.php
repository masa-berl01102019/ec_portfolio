<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

/**
 * Check if it's Japanese phone number including cell phone
 */
class JapanesePhoneNumber implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        return preg_match("/[0-9]{2,4}-[0-9]{2,4}-[0-9]{3,4}/", $value);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return trans('validation.japanese_phone_number');
    }
}
