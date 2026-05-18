<?php
namespace App\Services\Estimation;

class FPCalculationService
{
    // أوزان المكونات حسب تعقدها (Low, Average, High)
    const WEIGHTS = [
        'ei' => ['low' => 3, 'avg' => 4, 'high' => 6],
        'eo' => ['low' => 4, 'avg' => 5, 'high' => 7],
        'eq' => ['low' => 3, 'avg' => 4, 'high' => 6],
        'ilf' => ['low' => 7, 'avg' => 10, 'high' => 15],
        'eif' => ['low' => 5, 'avg' => 7, 'high' => 10],
    ];

    // حساب نقاط الوظائف غير المعدلة (UFP)
    public function calculateUFP(array $components): float
    {
        $ufp = 0;
        foreach (self::WEIGHTS as $type => $weights) {
            $ufp += ($components[$type]['low'] ?? 0) * $weights['low'];
            $ufp += ($components[$type]['avg'] ?? 0) * $weights['avg'];
            $ufp += ($components[$type]['high'] ?? 0) * $weights['high'];
        }
        return $ufp;
    }

    // حساب عامل تعديل القيمة (VAF) بناءً على الـ 14 خاصية (GSC)
    public function calculateVAF(array $gscScores): float
    {
        $totalDegreeOfInfluence = array_sum($gscScores); // المجموع من 0 إلى 70
        return 0.65 + (0.01 * $totalDegreeOfInfluence);
    }

    // حساب نقاط الوظائف المعدلة (AFP)
    public function calculateAFP(float $ufp, float $vaf): float
    {
        return $ufp * $vaf;
    }

    // تقدير الجهد والتكلفة والمدة بناءً على AFP
    public function estimateEffort(float $afp, float $hourlyRate, float $hoursPerFP = 15): array
    {
        $totalHours = $afp * $hoursPerFP;
        $cost = $totalHours * $hourlyRate;
        
        // معادلة COCOMO المبسطة لتقدير المدة بالأشهر (افتراض 152 ساعة عمل/شهر)
        $persons = $totalHours / 152;
        $durationMonths = ceil(2.5 * pow($persons, 0.38)); 
        
        return [
            'effort_hours' => round($totalHours, 2),
            'duration_months' => $durationMonths,
            'cost' => round($cost, 2),
            'complexity' => $this->determineComplexity($afp)
        ];
    }

    private function determineComplexity($afp): string
    {
        if ($afp <= 50) return 'small';
        if ($afp <= 150) return 'medium';
        if ($afp <= 300) return 'large';
        return 'enterprise';
    }
}