<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UcpEstimation extends Model
{
    protected $fillable = [
        'project_id', 'actors', 'use_cases', 'technical_factors', 
        'environmental_factors', 'uaw', 'uucw', 'uucp', 'tcf', 'ecf', 'ucp'
    ];

    protected $casts = [
        'actors' => 'array',
        'use_cases' => 'array',
        'technical_factors' => 'array',
        'environmental_factors' => 'array',
    ];

    public function project() { return $this->belongsTo(Project::class); }
}