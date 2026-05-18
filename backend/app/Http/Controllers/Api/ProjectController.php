<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function index()
    {
        // جلب مشاريع المستخدم الحالي مع بيانات الـ FPA المرتبطة
        $projects = Project::where('user_id', Auth::id())
                           ->with('fpEstimation')
                           ->latest()
                           ->get(['id', 'name', 'complexity_level', 'estimated_cost', 'estimated_duration_months', 'created_at']);
        return response()->json(['projects' => $projects]);
    }
        public function destroy($projectId)
    {
        $project = Project::where('id', $projectId)->where('user_id', Auth::id())->firstOrFail();
        
        // حذف السجلات المرتبطة أولاً
        if ($project->fpEstimation) $project->fpEstimation->delete();
        
        $project->delete();
        return response()->json(['message' => 'تم حذف المشروع بنجاح']);
    }
}