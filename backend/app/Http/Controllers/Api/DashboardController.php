<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function stats()
    {
        $userId = Auth::id();

        $totalProjects = Project::where('user_id', $userId)->count();
        $totalCost = Project::where('user_id', $userId)->sum('estimated_cost');
        $avgCost = Project::where('user_id', $userId)->avg('estimated_cost') ?? 0;
        
        $recentProjects = Project::where('user_id', $userId)
                                 ->orderBy('created_at', 'desc')
                                 ->take(5)
                                 ->get(['id', 'name', 'complexity_level', 'estimated_cost', 'created_at']);

        return response()->json([
            'totalProjects' => $totalProjects,
            'totalCost' => round($totalCost, 2),
            'avgCost' => round($avgCost, 2),
            'recentProjects' => $recentProjects
        ]);
    }
}