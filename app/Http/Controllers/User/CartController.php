<?php

namespace App\Http\Controllers\User;

use Throwable;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\user\CartEditRequest;
use App\Http\Requests\user\CartRegisterRequest;

class CartController extends Controller
{
    private $form_items = ['sku_id', 'quantity'];

    public function __construct()
    {
        $this->middleware('auth:user');
    }

    public function index(Request $request)
    {
        try {
            $search_cart = Cart::query();
            $search_cart = $search_cart->where('user_id', Auth::guard('user')->user()->id)
                ->join('skus', 'carts.sku_id', '=', 'skus.id')
                ->join('items', function ($join) {
                    $join->on('items.id', '=', 'skus.item_id')->where('is_published', config('define.is_published.open'))->where('items.deleted_at', null);
                })
                ->join('brands', 'items.brand_id', '=', 'brands.id')
                ->select('carts.id', 'carts.quantity', 'carts.updated_at', 'carts.sku_id', 'skus.item_id', 'skus.size_id', 'skus.color_id', 'items.item_name', 'items.price', 'items.brand_id', 'brands.brand_name')
                ->get();
            // I need pass foreign key at select func when I use join func so that I can call model which has relation at API Resources 
            // I can use Accessor (ex $this->price_text) at API Resources as long as I pass price at select func
            return (CartResource::collection($search_cart))->additional([
                'user' => new UserResource(Auth::guard('user')->user())
            ]);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.user.carts.get_err')], 500);
        }
    }

    public function store(CartRegisterRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            Cart::create([
                'user_id' => Auth::guard('user')->user()->id,
                'sku_id' => $data['sku_id'],
                'quantity' => 1,
            ]);
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.user.carts.create_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.user.carts.create_err')], 500);
        }
    }

    public function update(CartEditRequest $request, Cart $cart)
    {
        DB::beginTransaction();
        try {
            $data = $request->only($this->form_items);
            $cart->fill([
                'quantity' => $data['quantity']
            ])->save();
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.user.carts.update_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.user.carts.update_err')], 500);
        }
    }

    public function destroy(Cart $cart)
    {
        DB::beginTransaction();
        try {
            $cart->delete();
            DB::commit();
            return response()->json(['status' => config('define.api_status.success'), 'message' => trans('api.user.carts.delete_msg')], 200);
        } catch (Throwable $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json(['status' => config('define.api_status.error'), 'message' => trans('api.user.carts.delete_err')], 500);
        }
    }
}
