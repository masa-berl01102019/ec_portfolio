<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
{
    use SoftDeletes; //　論理削除

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

    public function categories() {
        return $this->belongsToMany('App\Models\Category');
    }

    public function blogs() {
        return $this->belongsToMany('App\Models\Blog');
    }

    public function images() {
        return $this->hasMany('App\Models\Image');
    }

    public function skus() {
        return $this->hasMany('App\Models\Sku');
    }

    public function measurements() {
        return $this->hasMany('App\Models\Measurement');
    }
}
