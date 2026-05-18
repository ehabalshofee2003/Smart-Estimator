<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FpEstimation extends Model
{
    protected $fillable = [
        'project_id', 'components', 'gsc_scores', 'ufp', 'vaf', 'afp'
    ];

    protected $casts = [
        'components' => 'array',
        'gsc_scores' => 'array',
    ];

    public function project() { return $this->belongsTo(Project::class); }
}