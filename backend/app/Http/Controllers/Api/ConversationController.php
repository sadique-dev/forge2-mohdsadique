<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ConversationController extends Controller
{
    /**
     * Get the conversation thread for a ticket.
     */
    public function index(Request $request, string $ticketId)
    {
        $ticket = Ticket::findOrFail($ticketId);

        // Authorize if user can view the ticket
        if (Gate::denies('view', $ticket)) {
            return response()->json(['error' => 'Forbidden. Cross-tenant or unauthorized access.'], 403);
        }

        $user = $request->user();
        $query = Conversation::with('user')->where('ticket_id', $ticket->id);

        // Customers can ONLY see public replies, not internal notes
        if ($user->isCustomer()) {
            $query->where('type', 'reply');
        }

        return response()->json($query->oldest()->get());
    }

    /**
     * Post a reply or internal note to a ticket.
     */
    public function store(Request $request, string $ticketId)
    {
        $ticket = Ticket::findOrFail($ticketId);

        // Authorize if user can reply/update the ticket
        if (Gate::denies('update', $ticket)) {
            return response()->json(['error' => 'Forbidden. Cross-tenant or unauthorized access.'], 403);
        }

        $request->validate([
            'body' => 'required|string',
            'type' => 'nullable|string|in:reply,note',
        ]);

        $user = $request->user();
        $type = $request->type ?? 'reply';

        // Customers can ONLY create public replies
        if ($user->isCustomer()) {
            $type = 'reply';
        }

        $conversation = Conversation::create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'body' => $request->body,
            'type' => $type,
        ]);

        // If ticket was closed, re-open it on customer reply
        if ($user->isCustomer() && $ticket->status === 'closed') {
            $ticket->status = 'open';
            $ticket->resolved_at = null;
            $ticket->save();
        }

        return response()->json($conversation->load('user'), 201);
    }
}
