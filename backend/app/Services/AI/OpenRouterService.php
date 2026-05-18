<?php
namespace App\Services\AI;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenRouterService
{
    private $apiKey;
    private $apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    private $model;

    public function __construct()
    {
        $this->apiKey = env('OPENROUTER_API_KEY');
        $this->model = env('OPENROUTER_MODEL', 'openai/gpt-3.5-turbo');
    }

     // 1. استخراج البيانات مع التعامل مع الردود الغامضة
    public function extractData(string $userInput, string $currentStep, string $expectedFormat): mixed
    {
        $systemPrompt = "أنت مساعد ذكي لجمع بيانات المشاريع البرمجية. نحن في مرحلة: {$currentStep}. 
        المستخدم أجاب: '{$userInput}'. 
        الصيغة المطلوبة: {$expectedFormat}.
        قواعد هامة جداً:
        - إذا كانت الصيغة المطلوبة JSON، أعد كائن JSON صالح فقط (بدون أي نص إضافي).
        - إذا لم يجد المستخدم أرقاماً، أعد القيم كـ 0 في الـ JSON.
        - إذا كانت الإجابة غير مفهومة تماماً، أعد null.";

        $response = $this->sendRequest($systemPrompt, $userInput);

        if (!$response) return null;

        // محاولة تحويل الرد إلى JSON
        $cleaned = str_replace(['```json', '```'], '', $response);
        $decoded = json_decode(trim($cleaned), true);
        
        // إذا كان JSON صالحاً، أرجعه كمصفوفة
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $decoded;
        }

        // إذا لم يكن JSON (مثلاً نص عادي)، أرجع النص بعد التنظيف
        $cleaned = str_replace('"', '', $cleaned);
        return trim($cleaned) === 'null' ? null : trim($cleaned);
    }

    // 2. توليد ردود طبيعية، ودية، ومرنة
    public function generateResponse(string $userInput, string $nextQuestion): string
    {
        $systemPrompt = "أنت بوت تقدير مشاريع احترافي، ودود، وتتحدث بشكل طبيعي جداً كما يتحدث البشر.
        المستخدم قال للتو: '{$userInput}'.
        المطلوب منك الآن أن ترد عليه باختصار (اشكره أو علق على إجابته بكلمة طيبة)، ثم تطرح عليه السؤال التالي بسلاسة وبدون تصنع.
        السؤال التالي الذي يجب أن تطرحه هو: '{$nextQuestion}'.
        مثال للرد المطلوب: 'ممتاز! إذاً سننتقل لخطوة أخرى. [السؤال التالي]'";

        return $this->sendRequest($systemPrompt, $userInput) ?? $nextQuestion;
    }

    private function sendRequest(string $systemPrompt, string $userPrompt): ?string
    {
        if (!$this->apiKey) {
            Log::error('OpenRouter API Key is missing!');
            return null;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'HTTP-Referer' => env('APP_URL'),
            ])->post($this->apiUrl, [
                'model' => $this->model,
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $userPrompt]
                ],
                'temperature' => 0.5, // توازن بين الإبداع والدقة
            ]);

            if ($response->successful()) {
                return $response->json('choices.0.message.content');
            }
            
            Log::error('OpenRouter Error: ' . $response->body());
            return null;
        } catch (\Exception $e) {
            Log::error('OpenRouter Exception: ' . $e->getMessage());
            return null;
        }
    }
}