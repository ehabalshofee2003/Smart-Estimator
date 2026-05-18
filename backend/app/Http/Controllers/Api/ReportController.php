<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    
    public function generatePdf($projectId)
    {
        $project = Project::where('id', $projectId)
                          ->where('user_id', Auth::id())
                          ->with('fpEstimation')
                          ->firstOrFail();

        $pdf = Pdf::loadView('reports.estimation', compact('project'));
        
        // إعدادات مهمة لقراءة الملفات المحلية (الخطوط)
        $pdf->setOption('isHtml5ParserEnabled', true);
        $pdf->setOption('isRemoteEnabled', true);
        $pdf->setOption('chroot', public_path()); // السماح بقراءة الملفات من مجلد public
        $pdf->setOption('enable_font_subsetting', true);

        return $pdf->download('estimation-report-' . $project->name . '.pdf');
    }
}