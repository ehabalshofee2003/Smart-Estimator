<?php
namespace App\Services\Chatbot;

use App\Models\ChatSession;
use App\Repositories\ProjectRepository;
use App\Services\AI\OpenRouterService;
use App\Services\Estimation\FPCalculationService;
use App\Services\Estimation\UCPCalculationService;

class ChatFlowService
{
    private FPCalculationService $fpService;
    private UCPCalculationService $ucpService;
    private ProjectRepository $projectRepo;
    private OpenRouterService $aiService;

    public function __construct(
        FPCalculationService $fpService, 
        UCPCalculationService $ucpService,
        ProjectRepository $projectRepo, 
        OpenRouterService $aiService
    ) {
        $this->fpService = $fpService;
        $this->ucpService = $ucpService;
        $this->projectRepo = $projectRepo;
        $this->aiService = $aiService;
    }

    const STEPS = [
        'ask_name' => [
            'next' => 'ask_general_info', 
            'question' => 'ما هو اسم المشروع الذي تعمل عليه؟', 
            'expected' => 'JSON يحتوي على name (نص)'
        ],
        'ask_general_info' => [
            'next' => 'ask_fpa_ei', 
            'question' => 'صف لي المشروع باختصار: ما مجاله؟ وكم عدد المستخدمين المتوقع؟ وحجم فريق التطوير؟', 
            'expected' => 'JSON يحتوي على domain (نص)، users (رقم)، team_size (رقم)'
        ],
        'ask_fpa_ei' => [
            'next' => 'ask_fpa_eo', 
            'question' => 'لنبدأ بتحليل نقاط الوظائف (FPA). كم عدد المدخلات الخارجية (EI)؟ (اذكر الأعداد كالتالي: منخفض، متوسط، عالي. مثال: 2 منخفض، 1 متوسط، 0 عالي)', 
            'expected' => 'JSON يحتوي على ei_low (رقم)، ei_avg (رقم)، ei_high (رقم)'
        ],
        'ask_fpa_eo' => [
            'next' => 'ask_fpa_eq', 
            'question' => 'وماذا عن المخرجات الخارجية (EO) والتقارير؟ (منخفض، متوسط، عالي)', 
            'expected' => 'JSON يحتوي على eo_low (رقم)، eo_avg (رقم)، eo_high (رقم)'
        ],
        'ask_fpa_eq' => [
            'next' => 'ask_fpa_ilf', 
            'question' => 'كم عدد الاستعلامات الخارجية (EQ) - مثل عمليات البحث والفلترة؟ (منخفض، متوسط، عالي)', 
            'expected' => 'JSON يحتوي على eq_low (رقم)، eq_avg (رقم)، eq_high (رقم)'
        ],
        'ask_fpa_ilf' => [
            'next' => 'ask_fpa_eif', 
            'question' => 'كم عدد الملفات المنطقية الداخلية (ILF) - مثل جداول قاعدة البيانات الأساسية؟ (منخفض، متوسط، عالي)', 
            'expected' => 'JSON يحتوي على ilf_low (رقم)، ilf_avg (رقم)، ilf_high (رقم)'
        ],
        'ask_fpa_eif' => [
            'next' => 'ask_ucp_actors', 
            'question' => 'وأخيراً في الـ FPA، كم عدد الملفات المرجعية الخارجية (EIF) - مثل الـ APIs الخارجية؟ (منخفض، متوسط، عالي)', 
            'expected' => 'JSON يحتوي على eif_low (رقم)، eif_avg (رقم)، eif_high (رقم)'
        ],
        'ask_ucp_actors' => [
            'next' => 'ask_ucp_use_cases', 
            'question' => 'لننتقل لتحليل حالات الاستخدام (UCP). كم عدد الممثلين (Actors) في النظام؟ (بسيط، متوسط، معقد)', 
            'expected' => 'JSON يحتوي على actors_simple (رقم)، actors_avg (رقم)، actors_complex (رقم)'
        ],
        'ask_ucp_use_cases' => [
            'next' => 'ask_tec_env_factors', 
            'question' => 'كم عدد حالات الاستخدام (Use Cases) الرئيسية؟ (بسيط، متوسط، معقد)', 
            'expected' => 'JSON يحتوي على uc_simple (رقم)، uc_avg (رقم)، uc_complex (رقم)'
        ],
        'ask_tec_env_factors' => [
            'next' => 'ready_to_calculate', 
            'question' => 'صف لي البيئة التقنية باختصار: هل النظام موزع؟ يتطلب أداءً عالياً؟ أمان قوي؟ وكم خبرة فريقك؟', 
            'expected' => 'JSON يحتوي على tcf (رقم من 0 لـ 5)، ecf (رقم من 0 لـ 5)، gsc (رقم من 0 لـ 5)'
        ],
        'ready_to_calculate' => [
            'next' => 'done', 
            'question' => 'ممتاز! لقد جمعت بيانات كافية. يرجى الضغط على زر "احسب التقدير" الأخضر في الأعلى للحصول على النتائج التفصيلية.'
        ],
    ];

    public function getInitialMessage(): array
    {
        $greeting = "مرحباً بك! 👋 أنا مساعدك الذكي لتقدير المشاريع البرمجية. سأقوم بطرح بعض الأسئلة المتسلسلة لأقدم لك تقديراً دقيقاً للجهد والتكلفة باستخدام معايير FPA و UCP.\n\n" . self::STEPS['ask_name']['question'];
        
        return [
            'role' => 'bot',
            'content' => $greeting,
            'step' => 'ask_name'
        ];
    }

    public function processUserMessage(ChatSession $session, string $userInput): array
    {
        $currentStep = $session->current_step;
        $collectedData = $session->collected_data ?? [];

        $expectedFormat = self::STEPS[$currentStep]['expected'] ?? 'نص';
        
        // 1. استخدام AI لاستخراج البيانات بدقة (هنا يتم تعريف المتغير)
        $extractedValue = $this->aiService->extractData($userInput, $currentStep, $expectedFormat);

        // إذا فشل الـ AI في الفهم، نطلب من المستخدم التوضيح
        if (!$extractedValue) {
            return [
                'role' => 'bot',
                'content' => "عذراً، لم أفهم قصدك جيداً. هل يمكنك توضيح إجابتك؟ " . self::STEPS[$currentStep]['question'],
                'step' => $currentStep // نبقى في نفس الخطوة
            ];
        }

        // 2. حفظ القيمة المستخرجة
        if (is_array($extractedValue)) {
            $collectedData = array_merge($collectedData, $extractedValue);
        } else {
            $collectedData[$currentStep] = $extractedValue;
        }

        // 3. تحديث عنوان الجلسة إذا كنا في خطوة اسم المشروع
        if ($currentStep === 'ask_name' && $extractedValue) {
            $session->update(['title' => is_array($extractedValue) ? ($extractedValue['name'] ?? 'محادثة جديدة') : $extractedValue]);
        }

        // 4. الانتقال للخطوة التالية
        $nextStep = self::STEPS[$currentStep]['next'] ?? 'done';

        $session->update([
            'current_step' => $nextStep,
            'collected_data' => $collectedData
        ]);

        // 5. استخدام AI لتوليد رد طبيعي ودود
        $nextQuestion = self::STEPS[$nextStep]['question'] ?? 'هل تريد إجراء تقدير آخر؟';
        $botResponse = $this->aiService->generateResponse($userInput, $nextQuestion);

        return [
            'role' => 'bot',
            'content' => $botResponse,
            'step' => $nextStep
        ];
    }

    public function calculateEstimation(ChatSession $session): array
    {
        $data = $session->collected_data;
        $hourlyRate = \Illuminate\Support\Facades\Cache::get('hourly_rate', 50);        // 1. حساب FPA
        $components = [
            'ei' => ['low' => (int) ($data['ei_low'] ?? 0), 'avg' => (int) ($data['ei_avg'] ?? 0), 'high' => (int) ($data['ei_high'] ?? 0)],
            'eo' => ['low' => (int) ($data['eo_low'] ?? 0), 'avg' => (int) ($data['eo_avg'] ?? 0), 'high' => (int) ($data['eo_high'] ?? 0)],
            'eq' => ['low' => (int) ($data['eq_low'] ?? 0), 'avg' => (int) ($data['eq_avg'] ?? 0), 'high' => (int) ($data['eq_high'] ?? 0)],
            'ilf' => ['low' => (int) ($data['ilf_low'] ?? 0), 'avg' => (int) ($data['ilf_avg'] ?? 0), 'high' => (int) ($data['ilf_high'] ?? 0)],
            'eif' => ['low' => (int) ($data['eif_low'] ?? 0), 'avg' => (int) ($data['eif_avg'] ?? 0), 'high' => (int) ($data['eif_high'] ?? 0)],
        ];

        $ufp = $this->fpService->calculateUFP($components);
        $gscScore = (float) ($data['gsc'] ?? 3) * 14; // تقريب بناءً على تقييم المستخدم
        $vaf = $this->fpService->calculateVAF(range(0, 5, $gscScore/14)); 
        $afp = $this->fpService->calculateAFP($ufp, $vaf);
        $fpEstimates = $this->fpService->estimateEffort($afp, $hourlyRate);

        // 2. حساب UCP
        $actors = [
            'simple' => (int) ($data['actors_simple'] ?? 0),
            'average' => (int) ($data['actors_avg'] ?? 0),
            'complex' => (int) ($data['actors_complex'] ?? 0)
        ];
        $useCases = [
            'simple' => (int) ($data['uc_simple'] ?? 0),
            'average' => (int) ($data['uc_avg'] ?? 0),
            'complex' => (int) ($data['uc_complex'] ?? 0)
        ];

        $uaw = $this->ucpService->calculateUAW($actors);
        $uucw = $this->ucpService->calculateUUCW($useCases);
        $uucp = $this->ucpService->calculateUUCP($uaw, $uucw);
        
        $tcfFactor = (float) ($data['tcf'] ?? 2.5);
        $ecfFactor = (float) ($data['ecf'] ?? 2.5);
        
        $tcf = 0.6 + (0.01 * $tcfFactor * 12); // تقريب مبسط للعوامل التقنية
        $ecf = 1.4 + (-0.03 * $ecfFactor * 8);  // تقريب مبسط للعوامل البيئية
        
        $ucp = $this->ucpService->calculateUCP($uucp, $tcf, $ecf);
        $ucpEstimates = $this->ucpService->estimateEffort($ucp, $hourlyRate);

        // 3. حساب المتوسط المرجح للطريقتين
        $finalCost = ($fpEstimates['cost'] + $ucpEstimates['cost']) / 2;
        $finalHours = ($fpEstimates['effort_hours'] + $ucpEstimates['effort_hours']) / 2;
        $finalDuration = ceil(($fpEstimates['duration_months'] + $ucpEstimates['duration_months']) / 2);
        $complexity = $fpEstimates['complexity']; // نعتمد تعقيد الـ FPA كمرجع

        $projectName = $data['name'] ?? 'المشروع';

        // 4. حفظ البيانات في قاعدة البيانات
        $project = $this->projectRepo->createProjectFromChat(
            $session->user_id, 
            $data, 
            [
                'complexity' => $complexity,
                'effort_hours' => $finalHours,
                'duration_months' => $finalDuration,
                'cost' => $finalCost,
                'ufp' => $ufp, 'vaf' => $vaf, 'afp' => $afp,
                'ucp' => $ucp
            ]
        );

        $session->update(['project_id' => $project->id, 'status' => 'completed']);

        return [
            'role' => 'bot',
            'content' => "🎉 تم حساب التقدير الشامل باستخدام FPA و UCP!\n\n" .
                         "▪️ اسم المشروع: {$projectName}\n" .
                         "▪️ مستوى التعقيد: {$complexity}\n\n" .
                         "📊 نتائج FPA:\n- الحجم (AFP): {$afp} نقطة\n- التكلفة: {$fpEstimates['cost']} $\n\n" .
                         "📊 نتائج UCP:\n- الحجم (UCP): {$ucp} نقطة\n- التكلفة: {$ucpEstimates['cost']} $\n\n" .
                         "💡 المتوسط المرجح المقترح:\n" .
                         "⏱ الجهد: {$finalHours} ساعة عمل\n" .
                         "📅 المدة: {$finalDuration} شهر\n" .
                         "💰 التكلفة التقديرية: {$finalCost} $\n\n" .
                         "تم حفظ المشروع في صفحة 'المشاريع' بنجاح!",
            'step' => 'done'
        ];
    }
}