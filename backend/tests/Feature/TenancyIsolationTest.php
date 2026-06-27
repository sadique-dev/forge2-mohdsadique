<?php

namespace Tests\Feature;

use App\Models\Organisation;
use App\Models\User;
use App\Models\Ticket;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TenancyIsolationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Org A
        $this->orgA = Organisation::create(['name' => 'Acme Corp', 'slug' => 'acme']);
        $this->userA = User::create([
            'organisation_id' => $this->orgA->id,
            'name' => 'User A',
            'email' => 'user@acme.test',
            'password' => bcrypt('password'),
            'role' => 'agent',
        ]);
        
        // Org B
        $this->orgB = Organisation::create(['name' => 'Globex Corp', 'slug' => 'globex']);
        $this->userB = User::create([
            'organisation_id' => $this->orgB->id,
            'name' => 'User B',
            'email' => 'user@globex.test',
            'password' => bcrypt('password'),
            'role' => 'agent',
        ]);

        // Ticket belonging to Org B
        $this->ticketB = Ticket::create([
            'organisation_id' => $this->orgB->id,
            'subject' => 'Globex Secret Issue',
            'description' => 'Confidential Globex data.',
            'status' => 'open',
            'priority' => 'high',
            'requester_id' => $this->userB->id,
        ]);
    }

    public function test_user_a_cannot_access_ticket_b()
    {
        $response = $this->actingAs($this->userA, 'sanctum')
            ->getJson("/api/v1/tickets/{$this->ticketB->id}");

        // Assert 403 Forbidden is returned, preventing cross-tenant information leaks
        $response->assertStatus(403)
            ->assertJsonFragment([
                'error' => 'Forbidden. Cross-tenant access denied.'
            ]);
    }

    public function test_user_a_ticket_list_never_includes_org_b_tickets()
    {
        // Create an Org A ticket
        $ticketA = Ticket::create([
            'organisation_id' => $this->orgA->id,
            'subject' => 'Acme Ticket',
            'description' => 'Visible to Acme only.',
            'status' => 'open',
            'priority' => 'low',
            'requester_id' => $this->userA->id,
        ]);

        $response = $this->actingAs($this->userA, 'sanctum')
            ->getJson('/api/v1/tickets');

        $response->assertStatus(200);
        
        // Extract array items depending on pagination format
        $data = $response->json('data') ?? $response->json();
        
        $this->assertCount(1, $data);
        $this->assertEquals('Acme Ticket', $data[0]['subject']);
    }
}
