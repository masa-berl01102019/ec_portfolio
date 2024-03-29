<?php

namespace App\Http\Resources;

use App\Models\Bookmark;
use App\Models\Sku;
use App\Models\Cart;
use App\Models\Size;
use App\Models\Color;
use App\Models\Image;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    /**
     *
     * @var string
     */
    public static $wrap = 'item';

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // Check if received request correspond with named route
        if (
            $request->routeIs('user.home.index') ||
            $request->routeIs('user.items.index') ||
            $request->routeIs('user.items.rank') ||
            $request->routeIs('user.items.recommend') ||
            $request->routeIs('user.items.new') ||
            $request->routeIs('user.blogs.show')
        ) {
            return [
                'id' => $this->id,
                'item_name' => $this->item_name,
                'included_tax_price_text' => $this->included_tax_price_text,
                'top_image' => !$this->topImage->isEmpty() ? $this->topImage->first()->image : null,
                'brand_name' => optional($this->brand)->brand_name
            ];
        } else if ($request->routeIs('user.items.show')) {
            // Get color ID related with item as array
            $item_colors = uniqueArray($this->skus->pluck('color_id')->toArray());
            $arr = [];
            for ($i = 0; $i < count($item_colors); $i++) {
                $arr[$i]['color_name'] = Color::find($item_colors[$i])->color_name;
                $arr[$i]['img'] = optional(Image::where('item_id', $this->id)->where('color_id', $item_colors[$i])->first())->image;
                $arr[$i]['sizes'] = Sku::where('item_id', $this->id)->where('color_id', $item_colors[$i])->orderBy('size_id')->select('quantity', 'size_id', 'id')->get()->toArray();
            }
            $user_id = optional(Auth::guard('user')->user())->id;
            // Get array which include sku ID registered at cart
            $cart_item_arr = Cart::getUserCart($user_id);
            // Get array which include sku ID registered at bookmark
            $bookmark_item_arr = Bookmark::getUserBookmark($user_id);
            return [
                'id' => $this->id,
                'product_number' => $this->product_number,
                'item_name' => $this->item_name,
                'included_tax_price_text' => $this->included_tax_price_text,
                'made_in' => $this->made_in,
                'mixture_ratio' => $this->mixture_ratio,
                'description' => $this->description,
                'brand' => new BrandResource($this->brand),
                'measurements' => MeasurementResource::collection($this->measurements),
                'color_variation' => Color::whereIn('id', uniqueArray($this->skus->pluck('color_id')->toArray()))->pluck('color_name'),
                'size_variation' => Size::whereIn('id', uniqueArray($this->skus->pluck('size_id')->toArray()))->pluck('size_name'),
                'gender_category' => !$this->genderCategory->isEmpty() ? $this->genderCategory->first()->category_name : null,
                'main_category' => !$this->mainCategory->isEmpty() ? $this->mainCategory->first()->category_name : null,
                'sub_category' => !$this->subCategory->isEmpty() ? $this->subCategory->first()->category_name : null,
                'top_image' => !$this->topImage->isEmpty() ? $this->topImage->first()->image : null,
                'images' => ImageResource::collection($this->images),
                'skus' => $arr, // For display modal (bookmark/cart)
                'cart_items' =>  $cart_item_arr, // Is it in cart ?
                'bookmark_items' => $bookmark_item_arr, // Is it in bookmark ?
                'publishedBlogs' => !$this->publishedBlogs->isEmpty() ? BlogResource::collection($this->publishedBlogs) : null, // Blog related with Item
            ];
        } else if ($request->routeIs('admin.items.edit')) {
            return [
                'product_number' => $this->product_number,
                'item_name' => $this->item_name,
                'price' => $this->price,
                'cost' => $this->cost,
                'made_in' => $this->made_in,
                'mixture_ratio' => $this->mixture_ratio,
                'description' => $this->description,
                'is_published' => $this->is_published,
                'brand_id' => $this->brand_id,
                'gender_category' => !$this->genderCategory->isEmpty() ? $this->genderCategory->first()->id : null,
                'main_category' => !$this->mainCategory->isEmpty() ? $this->mainCategory->first()->id : null,
                'sub_category' => !$this->subCategory->isEmpty() ? $this->subCategory->first()->id : null,
                'tags_id' => $this->tags->pluck('id'),
                'images' => ImageResource::collection($this->images),
                'measurements' => MeasurementResource::collection($this->measurements),
                'skus' => SkuResource::collection($this->skus)
            ];
        } else {
            return [
                'id' => $this->id,
                'is_published_text' => $this->is_published_text,
                'product_number' => $this->product_number,
                'item_name' => $this->item_name,
                'price_text' => $this->price_text,
                'cost_text' => $this->cost_text,
                'color_variation' => Color::whereIn('id', uniqueArray($this->skus->pluck('color_id')->toArray()))->pluck('color_name'),
                'size_variation' => Size::whereIn('id', uniqueArray($this->skus->pluck('size_id')->toArray()))->pluck('size_name'),
                'made_in' => $this->made_in,
                'mixture_ratio' => $this->mixture_ratio,
                'brand_name' => optional($this->brand)->brand_name,
                'gender_category' => !$this->genderCategory->isEmpty() ? $this->genderCategory->first()->category_name : null,
                'main_category' => !$this->mainCategory->isEmpty() ? $this->mainCategory->first()->category_name : null,
                'sub_category' => !$this->subCategory->isEmpty() ? $this->subCategory->first()->category_name : null,
                'tags' => $this->tags->pluck('tag_name'),
                'full_name' => optional($this->admin)->full_name,
                'full_name_kana' => optional($this->admin)->full_name_kana,
                'posted_at' => $this->posted_at !== null ? $this->posted_at->format('Y/m/d H:i') : null,
                'modified_at' => $this->modified_at !== null ? $this->modified_at->format('Y/m/d H:i') : null
            ];
        }
    }
}
