<?php

namespace App\Models;

use App\Traits\NameAccessorTrait;
use App\Traits\FilterTagScopeTrait;
use App\Traits\PublishAccessorTrait;
use App\Traits\FilterBrandScopeTrait;
use App\Traits\FilterKeywordScopeTrait;
use Illuminate\Database\Eloquent\Model;
use App\Traits\FilterDateRangeScopeTrait;
use App\Traits\OrderByPostedAtScopeTrait;
use App\Traits\FilterIsPublishedScopeTrait;
use App\Traits\OrderByModifiedAtScopeTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Blog extends Model
{
    use HasFactory; // laravel8 factory関数使用する為
    use SoftDeletes; // 論理削除
    use NameAccessorTrait;
    use PublishAccessorTrait;
    use OrderByPostedAtScopeTrait;
    use OrderByModifiedAtScopeTrait;
    use FilterKeywordScopeTrait;
    use FilterDateRangeScopeTrait;
    use FilterIsPublishedScopeTrait;
    use FilterTagScopeTrait;
    use FilterBrandScopeTrait;

    // timestamp無効にしないとデータ挿入時にエラーになる
    public $timestamps = false;

    /** シリアライズ */

    // 編集不可カラム
    protected $guarded = [
        'id'
    ];

    // モデルからシリアライズ時の日付形式の設定
    protected $casts = [
        'posted_at' => 'date:Y-m-d',
        'modified_at' => 'date:Y-m-d',
    ];

    /** アクセサ */

    public function getGenderCategoryTextAttribute() {
        return isset($this->category_id) ? config('define.category_id')[$this->category_id]: '';
    }

    // 配列内に含めたい独自の属性(カラム名)を定義
    protected $appends = ['full_name', 'full_name_kana', 'is_published_text', 'gender_category_text'];

    /** スコープ */

    public function scopeFilterGenderCategory($query, $request) {
        $filter = $request->input('f_gender_category');
        $flag = $filter !== null ? true : false;
        $query->when($flag, function($query) use($filter) {         
            // カンマ区切りで配列に変換
            $receiver_arr = explode(',',$filter);
            // 配列内に該当する項目を絞り込み検索
            return $query->whereIn('category_id', $receiver_arr);
        });
    }

    public function scopeFilterItem($query, $request) {
        $filter = $request->input('f_item');
        $flag = $filter !== null ? true : false;
        $query->when($flag, function($query) use($filter) {
            $query->whereHas('items', function ($query) use($filter) {
                // カンマ区切りで配列に変換
                $receiver_arr = explode(',',$filter);
                // 配列内に該当する項目を絞り込み検索
                return $query->whereIn('items.id', $receiver_arr);
            });
        });
    }

    /** リレーション */

    public function brand() {
        return $this->belongsTo('App\Models\Brand');
    }

    public function admin() {
        return $this->belongsTo('App\Models\Admin');
    }

    public function tags() {
        return $this->belongsToMany('App\Models\Tag');
    }

    public function items() {
        return $this->belongsToMany('App\Models\Item');
    }

    public function category() {
        return $this->belongsTo('App\Models\Category');
    }
}
