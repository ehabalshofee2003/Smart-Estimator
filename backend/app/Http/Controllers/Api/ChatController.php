<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Chat\SendMessageRequest;
use App\Repositories\ChatRepository;
use App\Services\Chatbot\ChatFlowService;
use Illuminate\Support\Facades\Auth;
use App\Models\ChatSession;

class ChatController extends Controller
{
    private ChatRepository $chatRepo;
    private ChatFlowService $chatFlowService;

    public function __construct(ChatRepository $chatRepo, ChatFlowService $chatFlowService) 
    {
        $this->chatRepo = $chatRepo;
        $this->chatFlowService = $chatFlowService;
    }

    public function startSession()
    {
        $user = Auth::user();
        $session = $this->chatRepo->createSession($user->id);
        
        // الحصول على أول سؤال من الـ State Machine
        $initMessage = $this->chatFlowService->getInitialMessage();
        
        $this->chatRepo->addMessage($session->id, 'bot', $initMessage['content']);
        
        // تحديث الجلسة لتكون في الخطوة الأولى
        $session->update(['current_step' => $initMessage['step']]);

        return response()->json([
            'session' => [
                'id' => $session->id,
                'current_step' => $initMessage['step']
            ],
            'bot_message' => [
                'content' => $initMessage['content']
            ]
        ], 201);
    }

        // جلب كل جلسات المحادثة للمستخدم
    public function getSessions()
    {
        $sessions = ChatSession::where('user_id', Auth::id())
                               ->orderBy('updated_at', 'desc')
                               ->get(['id', 'title', 'status', 'created_at']);

        return response()->json(['sessions' => $sessions]);
    }

    // جلب رسائل جلسة معينة
    public function getSessionMessages($sessionId)
    {
        $session = ChatSession::where('id', $sessionId)
                              ->where('user_id', Auth::id())
                              ->with('messages')
                              ->firstOrFail();

        return response()->json([
            'session' => $session,
            'messages' => $session->messages
        ]);
    }
        // إضافة دالة الحذف
    public function destroySession($sessionId)
    {
        $session = ChatSession::where('id', $sessionId)->where('user_id', Auth::id())->firstOrFail();
        $session->messages()->delete(); // حذف الرسائل أولاً
        $session->delete(); // ثم حذف الجلسة
        return response()->json(['message' => 'تم الحذف بنجاح']);
    }

    // تعديل دالة sendMessage لإرجع بيانات الجلسة المحدثة
    public function sendMessage(SendMessageRequest $request)
    {
        $user = Auth::user();
        $sessionId = $request->session_id;
        $userMessage = $request->message;
        
        $session = $this->chatRepo->getSessionWithMessages($sessionId, $user->id);
        if (!$session) {
            return response()->json(['bot_message' => ['content' => 'الجلسة غير صالحة.']], 404);
        }

        $this->chatRepo->addMessage($sessionId, 'user', $userMessage);

        if ($userMessage === 'CALCULATE_ESTIMATION') {
            $botResponse = $this->chatFlowService->calculateEstimation($session);
        } else {
            $botResponse = $this->chatFlowService->processUserMessage($session, $userMessage);
        }

        $this->chatRepo->addMessage($sessionId, 'bot', $botResponse['content']);

        // جلب بيانات الجلسة بعد تحديث الاسم (الذي حدث في processUserMessage)
        $session->refresh(); 

        return response()->json([
            'bot_message' => ['content' => $botResponse['content']],
            'session' => $session // إرجع الجلسة لتحديث الاسم في الفرونت
        ]);
    }
}