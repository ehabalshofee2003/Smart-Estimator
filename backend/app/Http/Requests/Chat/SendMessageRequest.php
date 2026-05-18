<?php
namespace App\Http\Requests\Chat;

use Illuminate\Foundation\Http\FormRequest;

class SendMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // السماح للجميع (المصادقة تتم عبر Sanctum Middleware)
    }

    public function rules(): array
    {
        return [
            'session_id' => 'required|integer|exists:chat_sessions,id',
            'message' => 'required|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'session_id.exists' => 'جلسة المحادثة غير موجودة.',
            'message.required' => 'الرجاء إدخال رسالة.',
        ];
    }
}