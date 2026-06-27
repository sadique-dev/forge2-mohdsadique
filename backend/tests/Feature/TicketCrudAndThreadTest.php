<?php

namespace Tests\Feature;

use App\Models\Organisation;
use App\Models\User;
use App\Models\Ticket;
use App\Models\Conversation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketCrudAndThreadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->org = Organisation::create(['name' => 'Acme Corp', 'slug' => 'acme']);
        
        $this->agent = User::create([
            'organisation_id' => $this->org->id,
            'name' => 'Acme Agent',
            'email' => 'agent@acme.test',
            'password' => bcrypt('password'),
            'role' => 'agent',
        ]);

        $this->customer = User::create([
            'organisation_id' => $this->org->id,
            'name' => 'Acme Customer',
            'email' => 'customer@acme.test',
            'password' => bcrypt('password'),
            'role' => 'customer',
        ]);
    }

    public function test_customer_can_create_ticket()
    {
        $response = $this->actingAs($this->customer, 'sanctum')
            ->postJson('/api/v1/tickets', [
                'subject' => 'Help with login',
                'description' => 'Cannot log in using SSO.',
                'priority' => 'high',
                'tags' => ['sso', 'login'],
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('subject', 'Help with login')
            ->assertJsonPath('requester_id', $this->customer->id);

        $this->assertDatabaseHas('tickets', ['subject' => 'Help with login']);
        $this->assertDatabaseHas('ticket_tags', ['tag' => 'sso']);
    }

    public function test_agent_can_post_public_replies_and_internal_notes()
    {
        $ticket = Ticket::create([
            'organisation_id' => $this->org->id,
            'subject' => 'Billing issue',
            'description' => 'Charge failed.',
            'requester_id' => $this->customer->id,
        ]);

        // Post a public reply
        $responseReply = $this->actingAs($this->agent, 'sanctum')
            ->postJson("/api/v1/tickets/{$ticket->id}/conversations", [
                'body' => 'I am looking into this.',
                'type' => 'reply'
            ]);
        $responseReply->assertStatus(201);

        // Post an internal note
        $responseNote = $this->actingAs($this->agent, 'sanctum')
            ->postJson("/api/v1/tickets/{$ticket->id}/conversations", [
                'body' => 'Database indicates account suspended.',
                'type' => 'note'
            ]);
        $responseNote->assertStatus(201);
    }

    public function test_customer_cannot_view_internal_notes()
    {
        $ticket = Ticket::create([
            'organisation_id' => $this->org->id,
            'subject' => 'Server lag',
            'description' => 'Lagging since morning.',
            'requester_id' => $this->customer->id,
        ]);

        // Create a public reply
        Conversation::create([
            'ticket_id' => $ticket->id,
            'user_id' => $this->agent->id,
            'body' => 'Checking logs.',
            'type' => 'reply'
        ]);

        // Create an internal note
        Conversation::create([
            'ticket_id' => $ticket->id,
            'user_id' => $this->agent->id,
            'body' => 'Database CPU is at 99%.',
            'type' => 'note'
        ]);

        // Read thread as agent - should see both
        $responseAgent = $this->actingAs($this->agent, 'sanctum')
            ->getJson("/api/v1/tickets/{$ticket->id}/conversations");
        $responseAgent->assertStatus(200)
            ->assertJsonCount(2);

        // Read thread as customer - should ONLY see public reply
        $responseCustomer = $this->actingAs($this->customer, 'sanctum')
            ->getJson("/api/v1/tickets/{$ticket->id}/conversations");
        $responseCustomer->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment([
                'body' => 'Checking logs.',
                'type' => 'reply'
            ])
            ->assertJsonMissing([
                'body' => 'Database CPU is at 99%.',
                'type' => 'note'
            ]);
    }
}
