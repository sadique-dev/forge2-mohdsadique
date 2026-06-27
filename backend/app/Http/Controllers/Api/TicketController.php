<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketTag;
use App\Models\SlaPolicy;
use App\Models\TicketSla;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Carbon\Carbon;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Ticket::with(['requester', 'assignee', 'tags', 'sla.slaPolicy']);

        // Role-based scoping: Customers can only see their own tickets
        if ($user->isCustomer()) {
            $query->where('requester_id', $user->id);
        }

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Priority filter
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        // Assignee filter
        if ($request->filled('assignee_id')) {
            if ($request->assignee_id === 'unassigned') {
                $query->whereNull('assignee_id');
            } else {
                $query->where('assignee_id', $request->assignee_id);
            }
        }

        // Return latest paginated results
        return response()->json($query->latest()->paginate(15));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'requester_id' => 'nullable|exists:users,id',
        ]);

        // A customer can only create tickets for themselves
        $requesterId = $user->isCustomer() ? $user->id : ($request->requester_id ?? $user->id);

        $ticket = Ticket::create([
            'subject' => $request->subject,
            'description' => $request->description,
            'priority' => $request->priority ?? 'medium',
            'status' => 'open',
            'requester_id' => $requesterId,
            'assignee_id' => $request->assignee_id ?? null,
        ]);

        // Save tags
        if ($request->filled('tags')) {
            foreach ($request->tags as $tagStr) {
                TicketTag::create([
                    'ticket_id' => $ticket->id,
                    'tag' => $tagStr,
                ]);
            }
        }

        // Attach default SLA Policy if exists for this organisation
        $slaPolicy = SlaPolicy::first(); // Scoped to organization automatically
        if ($slaPolicy) {
            TicketSla::create([
                'ticket_id' => $ticket->id,
                'sla_policy_id' => $slaPolicy->id,
                'first_response_due_at' => Carbon::now()->addHours($slaPolicy->first_response_hours),
                'resolution_due_at' => Carbon::now()->addHours($slaPolicy->resolution_hours),
                'breached' => false,
            ]);
        }

        return response()->json($ticket->load(['requester', 'assignee', 'tags', 'sla.slaPolicy']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $ticket = Ticket::with(['requester', 'assignee', 'tags', 'sla.slaPolicy'])->findOrFail($id);

        // Policy authorization check
        if (Gate::denies('view', $ticket)) {
            return response()->json(['error' => 'Forbidden. Cross-tenant or unauthorized access.'], 403);
        }

        return response()->json($ticket);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $ticket = Ticket::findOrFail($id);

        // Policy authorization check
        if (Gate::denies('update', $ticket)) {
            return response()->json(['error' => 'Forbidden. Cross-tenant or unauthorized access.'], 403);
        }

        $request->validate([
            'subject' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|string|in:open,pending,resolved,closed',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
            'assignee_id' => 'nullable|exists:users,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        $user = $request->user();

        // Update fields
        if ($request->filled('subject')) $ticket->subject = $request->subject;
        if ($request->filled('description')) $ticket->description = $request->description;
        if ($request->filled('priority')) $ticket->priority = $request->priority;
        
        if ($request->filled('status')) {
            $oldStatus = $ticket->status;
            $newStatus = $request->status;
            $ticket->status = $newStatus;

            // Handle resolved timestamp
            if (($newStatus === 'resolved' || $newStatus === 'closed') && $oldStatus !== 'resolved' && $oldStatus !== 'closed') {
                $ticket->resolved_at = Carbon::now();
            } elseif (($newStatus === 'open' || $newStatus === 'pending') && ($oldStatus === 'resolved' || $oldStatus === 'closed')) {
                $ticket->resolved_at = null;
            }
        }

        // Only agent/admin can assign ticket
        if ($request->has('assignee_id') && ($user->isAdmin() || $user->isAgent())) {
            $ticket->assignee_id = $request->assignee_id;
        }

        $ticket->save();

        // Re-sync tags if provided
        if ($request->has('tags')) {
            // Delete old tags
            $ticket->tags()->delete();
            // Insert new tags
            foreach ($request->tags as $tagStr) {
                TicketTag::create([
                    'ticket_id' => $ticket->id,
                    'tag' => $tagStr,
                ]);
            }
        }

        return response()->json($ticket->load(['requester', 'assignee', 'tags', 'sla.slaPolicy']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $ticket = Ticket::findOrFail($id);

        // Policy authorization check
        if (Gate::denies('delete', $ticket)) {
            return response()->json(['error' => 'Forbidden. Only administrators can delete tickets.'], 403);
        }

        $ticket->delete();

        return response()->json([
            'message' => 'Ticket soft-deleted successfully.'
        ]);
    }
}
