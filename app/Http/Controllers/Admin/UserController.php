<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\admin\UserEditRequest;
use App\Http\Requests\admin\UserRegisterRequest;

class UserController extends Controller
{
    private $form_items = [
        'last_name', 'first_name', 'last_name_kana', 'first_name_kana', 'gender', 'birthday', 'post_code', 'prefecture', 'municipality', 'street_name', 'street_number', 'building',
        'delivery_post_code', 'delivery_prefecture', 'delivery_municipality', 'delivery_street_name', 'delivery_street_number', 'delivery_building', 'tel', 'email', 'password', 'is_received'
    ];

    public function __construct()
    {
        $this->middleware('auth:admin');
    }

    public function index(Request $request)
    {
        try {
            $search_user = User::query();
            $search_user->filterKeyword($request, ['last_name', 'first_name', 'last_name_kana', 'first_name_kana']);
            $search_user->filterGender($request);
            $search_user->filterIsReceived($request);
            $search_user->filterDateRange($request);
            // last_name > birthday > created_at > updated_at
            $search_user->orderByName($request);
            $search_user->orderByBirthday($request);
            $search_user->orderByCreatedAt($request);
            $search_user->orderByUpdatedAt($request);
            $users = $search_user->customPaginate($request);
            return UserResource::collection($users);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => '会員の取得に失敗しました'], 500);
        }
    }

    public function store(UserRegisterRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            User::create([
                'last_name' => $data['last_name'],
                'first_name' => $data['first_name'],
                'last_name_kana' => $data['last_name_kana'],
                'first_name_kana' => $data['first_name_kana'],
                'gender' => $data['gender'],
                'birthday' => $data['birthday'],
                'post_code' => $data['post_code'],
                'prefecture' => $data['prefecture'],
                'municipality' => $data['municipality'],
                'street_name' => $data['street_name'],
                'street_number' => $data['street_number'],
                'building' => $data['building'],
                'delivery_post_code' => $data['delivery_post_code'],
                'delivery_prefecture' => $data['delivery_prefecture'],
                'delivery_municipality' => $data['delivery_municipality'],
                'delivery_street_name' => $data['delivery_street_name'],
                'delivery_street_number' => $data['delivery_street_number'],
                'delivery_building' => $data['delivery_building'],
                'tel' => $data['tel'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'is_received' => $data['is_received'],
            ]);
            DB::commit();
            return response()->json(['status' => 1, 'message' => '会員の登録を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => '会員の登録に失敗しました'], 500);
        }
    }

    public function edit(User $user)
    {
        try {
            return new UserResource($user);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => '会員の取得に失敗しました'], 500);
        }
    }

    public function update(UserEditRequest $request, User $user)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            $user->fill($data)->save();
            DB::commit();
            return response()->json(['status' => 1, 'message' => '会員の編集を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => '会員の編集に失敗しました'], 500);
        }
    }

    public function destroy(Request $request)
    {
        DB::beginTransaction();
        try {
            $users = $request->all();
            foreach ($users as $user) {
                $user = User::find($user);
                $user->delete();
            }
            DB::commit();
            return response()->json(['status' => 1, 'message' => '会員の削除を完了しました'], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => 9, 'message' => '会員の削除に失敗しました'], 500);
        }
    }

    public function csvExport(Request $request)
    {
        try {
            $id = $request->all();
            $users = User::whereIn('id', $id)->cursor();
            $csv_body = [];
            $num = 1;
            foreach ($users as $user) {
                $csv_body[] = [
                    $num,
                    $user->id,
                    $user->full_name,
                    $user->full_name_kana,
                    $user->gender_text,
                    $user->birthday->format('Y/m/d'),
                    $user->post_code_text,
                    $user->full_address,
                    $user->delivery_post_code_text,
                    $user->full_delivery_address,
                    $user->tel,
                    $user->email,
                    $user->is_received_text,
                    $user->created_at,
                    $user->updated_at
                ];
                $num++;
            }
            $csv_header = ['No', 'ID', '氏名', '氏名（カナ）', '性別', '生年月日', '郵便番号', '住所', '配送先-郵便番号', '配送先-住所', '電話番号', 'メールアドレス', 'DM登録', '作成日時', '更新日時'];
            return csvExport($csv_body, $csv_header, '会員情報.csv');
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 9, 'message' => '会員情報CSVの出力に失敗しました'], 500);
        }
    }
}
