<?php
namespace App\Services\Estimation;

class UCPCalculationService
{
    // أوزان الممثلين (Actors)
    const ACTOR_WEIGHTS = ['simple' => 1, 'average' => 2, 'complex' => 3];
    // أوزان حالات الاستخدام (Use Cases)
    const UC_WEIGHTS = ['simple' => 5, 'average' => 10, 'complex' => 15];
    
    // أوزان العوامل التقنية (T1-T12)
    const TF_WEIGHTS = [2.0, 1.0, 1.0, 1.0, 1.0, 0.5, 0.5, 2.0, 1.0, 1.0, 1.0, 1.0];
    // أوزان العوامل البيئية (E1-E8)
    const EF_WEIGHTS = [1.5, 0.5, 1.0, 0.5, 1.0, 2.0, -1.0, -1.0];

    public function calculateUAW(array $actors): float
    {
        $uaw = 0;
        foreach (self::ACTOR_WEIGHTS as $type => $weight) {
            $uaw += ($actors[$type] ?? 0) * $weight;
        }
        return $uaw;
    }

    public function calculateUUCW(array $useCases): float
    {
        $uucw = 0;
        foreach (self::UC_WEIGHTS as $type => $weight) {
            $uucw += ($useCases[$type] ?? 0) * $weight;
        }
        return $uucw;
    }

    public function calculateUUCP(float $uaw, float $uucw): float
    {
        return $uaw + $uucw;
    }

    public function calculateTCF(array $tfScores): float
    {
        $tfactor = 0;
        foreach (self::TF_WEIGHTS as $i => $weight) {
            $tfactor += ($tfScores[$i] ?? 0) * $weight;
        }
        return 0.6 + (0.01 * $tfactor);
    }

    public function calculateECF(array $efScores): float
    {
        $efactor = 0;
        foreach (self::EF_WEIGHTS as $i => $weight) {
            $efactor += ($efScores[$i] ?? 0) * $weight;
        }
        return 1.4 + (-0.03 * $efactor);
    }

    public function calculateUCP(float $uucp, float $tcf, float $ecf): float
    {
        return $uucp * $tcf * $ecf;
    }

    public function estimateEffort(float $ucp, float $hourlyRate, float $hoursPerUCP = 20): array
    {
        $totalHours = $ucp * $hoursPerUCP;
        $cost = $totalHours * $hourlyRate;
        $persons = $totalHours / 152;
        $durationMonths = ceil(2.5 * pow($persons, 0.38));

        return [
            'effort_hours' => round($totalHours, 2),
            'duration_months' => $durationMonths,
            'cost' => round($cost, 2),
            'complexity' => $this->determineComplexity($ucp)
        ];
    }

    private function determineComplexity($ucp): string
    {
        if ($ucp <= 20) return 'small';
        if ($ucp <= 50) return 'medium';
        if ($ucp <= 100) return 'large';
        return 'enterprise';
    }
}