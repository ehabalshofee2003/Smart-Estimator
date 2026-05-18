<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatSession extends Model
{
    protected $fillable = ['user_id', 'project_id', 'title', 'current_step', 'status', 'collected_data'];
    protected $casts = [
        'collected_data' => 'array', // تحويل JSON إلى Array تلقائياً
    ];

    public function user() { return $this->belongsTo(User::class); }
    public function project() { return $this->belongsTo(Project::class); }
    public function messages()
    {
        // أضف 'session_id' كمعامل ثاني لنخبر لارافيل باسم العمود الصحيح
        return $this->hasMany(ChatMessage::class, 'session_id');
    }}