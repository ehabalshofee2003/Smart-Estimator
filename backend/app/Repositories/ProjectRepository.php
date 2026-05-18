<?php
namespace App\Repositories;

use App\Models\FpEstimation;
use App\Models\Project;
use App\Models\UcpEstimation;

class ProjectRepository
{
    public function createProjectFromChat(int $userId, array $collectedData, array $fpResult): Project
    {
        // إنشاء المشروع
        $project = Project::create([
            'user_id' => $userId,
            'name' => $collectedData['name'] ?? $collectedData['ask_name'] ?? 'مشروع بدون اسم',
            'complexity_level' => $fpResult['complexity'],
            'estimated_effort_hours' => $fpResult['effort_hours'],
            'estimated_duration_months' => $fpResult['duration_months'],
            'estimated_cost' => $fpResult['cost'],
        ]);

        // إنشاء سجل الـ FPA المرتبط بالمشروع
        FpEstimation::create([
            'project_id' => $project->id,
            'components' => [
                'ei' => [
                    'low' => (int) ($collectedData['ask_ei_low'] ?? 0),
                    'avg' => (int) ($collectedData['ask_ei_avg'] ?? 0),
                    'high' => (int) ($collectedData['ask_ei_high'] ?? 0),
                ],
                // باقي المكونات صفر حالياً
                'eo' => ['low' => 0, 'avg' => 0, 'high' => 0],
                'eq' => ['low' => 0, 'avg' => 0, 'high' => 0],
                'ilf' => ['low' => 0, 'avg' => 0, 'high' => 0],
                'eif' => ['low' => 0, 'avg' => 0, 'high' => 0],
            ],
            'ufp' => $fpResult['ufp'] ?? 0,
            'vaf' => $fpResult['vaf'] ?? 0.65,
            'afp' => $fpResult['afp'] ?? 0,
        ]);

        return $project;
    }
}