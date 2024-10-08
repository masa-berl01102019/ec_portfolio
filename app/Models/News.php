<?php

namespace App\Models;

use App\Traits\AccessorNameTrait;
use App\Traits\FilterTagScopeTrait;
use App\Traits\AccessorPublishTrait;
use App\Traits\FilterBrandScopeTrait;
use App\Traits\GetPublishedScopeTrait;
use App\Traits\FilterKeywordScopeTrait;
use Illuminate\Database\Eloquent\Model;
use App\Traits\CustomPaginateScopeTrait;
use App\Traits\FilterDateFromScopeTrait;
use App\Traits\FilterDateToScopeTrait;
use App\Traits\OrderByPostedAtScopeTrait;
use App\Traits\AccessorGenderCategoryTrait;
use App\Traits\FilterIsPublishedScopeTrait;
use App\Traits\OrderByModifiedAtScopeTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\FilterGenderCategoryScopeTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class News extends Model
{
    use HasFactory;
    use SoftDeletes;
    use AccessorNameTrait;
    use AccessorPublishTrait;
    use AccessorGenderCategoryTrait;
    use OrderByPostedAtScopeTrait;
    use OrderByModifiedAtScopeTrait;
    use FilterKeywordScopeTrait;
    use FilterDateFromScopeTrait;
    use FilterDateToScopeTrait;
    use FilterIsPublishedScopeTrait;
    use FilterTagScopeTrait;
    use FilterBrandScopeTrait;
    use FilterGenderCategoryScopeTrait;
    use GetPublishedScopeTrait;
    use CustomPaginateScopeTrait;

    // An error will occur when inserting data in case that isn't defined timestamps() in migration files
    public $timestamps = false;

    // Setting allowing Mass Assignment  * except columns in the array the below
    protected $guarded = [
        'id'
    ];

    /** Serializing */

    // Setting the date format
    protected $casts = [
        'posted_at' => 'date:Y/m/d H:i',
        'modified_at' => 'date:Y/m/d H:i',
    ];

    // Your own attributes (column names) which you want to include
    protected $appends = ['full_name', 'full_name_kana', 'is_published_text', 'gender_category_text'];

    /** Relationships */

    public function brand()
    {
        return $this->belongsTo('App\Models\Brand');
    }

    public function admin()
    {
        return $this->belongsTo('App\Models\Admin');
    }

    public function tags()
    {
        return $this->belongsToMany('App\Models\Tag');
    }

    public function category()
    {
        return $this->belongsTo('App\Models\Category');
    }
}
