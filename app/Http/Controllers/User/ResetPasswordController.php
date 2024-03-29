<?php

namespace App\Http\Controllers\User;

use Throwable;
use Carbon\Carbon;
use App\Models\User;
use Illuminate\Support\Str;
use App\Models\PasswordReset;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\User\UserResetPasswordMail;
use App\Mail\User\UserChangePasswordMail;
use App\Http\Requests\user\ResetPasswordRequest;
use App\Http\Requests\user\ChangePasswordRequest;

class ResetPasswordController extends Controller
{
    private $form_items = ['email', 'password', 'uuid'];

    public function send(ResetPasswordRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            // log out if user has been logged in
            if (Auth::guard('user')->check()) {
                Auth::guard('user')->logout();
                $request->session()->regenerate();
            }
            $user = User::where('email', $data['email'])->first();
            // checking user existence
            if (!$user) {
                return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.user.reset_passwords.send_err')], 400);
            }
            $password_reset = PasswordReset::create([
                'user_id' => $user->id,
                'uuid' => Str::uuid(),
                'email' => $data['email'],
                'expired_at' => Carbon::now()->addHours(1)
            ]);
            Mail::to($user->email)->send(new UserResetPasswordMail($password_reset, $user->full_name));
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.user.reset_passwords.send_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.user.reset_passwords.send_err2')], 500);
        }
    }

    public function change(ChangePasswordRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            $password_reset = PasswordReset::where('uuid', $data['uuid'])->first();
            // checking record existence
            if (!$password_reset) {
                return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.user.reset_passwords.change_err')], 400);
            }
            $now = Carbon::now();
            $expired_at = Carbon::parse($password_reset->expired_at);
            // checking expired_at
            if ($now->gt($expired_at)) {
                return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.user.reset_passwords.change_err2')], 400);
            }
            $user = User::find($password_reset->user_id);
            // checking user existence
            if (!$user) {
                return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.user.reset_passwords.change_err3')], 400);
            }
            $user->fill([
                'password' => Hash::make($data['password'])
            ])->save();
            Mail::to($user->email)->send(new UserChangePasswordMail($user->full_name));
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.user.reset_passwords.change_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.user.reset_passwords.change_err4')], 500);
        }
    }
}
