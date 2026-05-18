<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'name', 'description', 'business_domain', 'client_type', 
        'expected_users', 'team_size', 'technologies', 'complexity_level', 
        'estimated_effort_hours', 'estimated_duration_months', 'estimated_cost'
    ];

    public function user() { return $this->belongsTo(User::class); }
    public function chatSessions() { return $this->hasMany(ChatSession::class); }
    public function fpEstimation() { return $this->hasOne(FpEstimation::class); }
    public function ucpEstimation() { return $this->hasOne(UcpEstimation::class); }
}