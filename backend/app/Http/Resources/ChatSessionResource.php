<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatSessionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'current_step' => $this->current_step,
            'status' => $this->status,
            'messages' => ChatMessageResource::collection($this->whenLoaded('messages')),
        ];
    }
}
