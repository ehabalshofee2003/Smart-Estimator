<?php
namespace App\Repositories;

use App\Models\ChatMessage;
use App\Models\ChatSession;

class ChatRepository
{
    public function createSession(int $userId): ChatSession
    {
        return ChatSession::create([
            'user_id' => $userId,
            'current_step' => 'init',
            'collected_data' => []
        ]);
    }

    public function addMessage(int $sessionId, string $role, string $content, ?array $metadata = null): ChatMessage
    {
        return ChatMessage::create([
            'session_id' => $sessionId,
            'role' => $role,
            'content' => $content,
            'metadata' => $metadata
        ]);
    }

    public function updateSessionData(ChatSession $session, string $step, array $collectedData): void
    {
        $session->update([
            'current_step' => $step,
            'collected_data' => $collectedData
        ]);
    }

    public function getSessionWithMessages(int $sessionId, int $userId)
    {
        // استخدام first() بدلاً من firstOrFail() لتجنب خطأ 500
        $session = ChatSession::where('id', $sessionId)
            ->where('user_id', $userId)
            ->with('messages')
            ->first();

        return $session; // سيرجع null إذا لم يجد الجلسة
    }
}