<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    /**
     * 適用する「データ」ラッパー
     *
     * @var string
     */
    public static $wrap = 'notification';

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // URLにeditが含まれるか判定
        $str = strstr($request->url(), 'edit');
        // editかどうかで条件分岐
        if($str === 'edit') {
            return [
                'title' => $this->title,
                'body' => $this->body,
                'is_published' => $this->is_published,
                'expired_at' => $this->expired_at,
            ];
        } else {
            return [
                'id' => $this->id,
                'is_published_text' => $this->is_published_text,
                'title' => $this->title,
                'body' => $this->body,
                'full_name' => optional($this->admin)->full_name,
                'full_name_kana' => optional($this->admin)->full_name_kana,
                'posted_at' => $this->posted_at !== null ? $this->posted_at->format('Y/m/d H:i') : null,
                'modified_at' => $this->modified_at !== null ? $this->modified_at->format('Y/m/d H:i') : null,
                'expired_at' => $this->expired_at !== null ? $this->expired_at->format('Y/m/d H:i') : null
            ];
        }

    } 
    
}