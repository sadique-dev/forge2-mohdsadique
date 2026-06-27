<?php

namespace Database\Seeders;

use App\Models\Organisation;
use App\Models\User;
use App\Models\Ticket;
use App\Models\TicketTag;
use App\Models\Conversation;
use App\Models\SlaPolicy;
use App\Models\TicketSla;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create organisations
        $orgA = Organisation::create([
            'name' => 'Acme Corp',
            'slug' => 'acme',
            'plan' => 'enterprise',
        ]);

        $orgB = Organisation::create([
            'name' => 'Globex Corp',
            'slug' => 'globex',
            'plan' => 'free',
        ]);

        // 2. Create users for Org A (Acme Corp)
        $adminA = User::create([
            'organisation_id' => $orgA->id,
            'name' => 'Acme Admin',
            'email' => 'admin@orga.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $agentA1 = User::create([
            'organisation_id' => $orgA->id,
            'name' => 'Acme Agent 1',
            'email' => 'agent1@orga.test',
            'password' => Hash::make('password'),
            'role' => 'agent',
        ]);

        $agentA2 = User::create([
            'organisation_id' => $orgA->id,
            'name' => 'Acme Agent 2',
            'email' => 'agent2@orga.test',
            'password' => Hash::make('password'),
            'role' => 'agent',
        ]);

        $customerA1 = User::create([
            'organisation_id' => $orgA->id,
            'name' => 'Acme Customer 1',
            'email' => 'customer1@orga.test',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);

        $customerA2 = User::create([
            'organisation_id' => $orgA->id,
            'name' => 'Acme Customer 2',
            'email' => 'customer2@orga.test',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);

        // Create users for Org B (Globex Corp)
        $adminB = User::create([
            'organisation_id' => $orgB->id,
            'name' => 'Globex Admin',
            'email' => 'admin@orgb.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $agentB1 = User::create([
            'organisation_id' => $orgB->id,
            'name' => 'Globex Agent 1',
            'email' => 'agent1@orgb.test',
            'password' => Hash::make('password'),
            'role' => 'agent',
        ]);

        $agentB2 = User::create([
            'organisation_id' => $orgB->id,
            'name' => 'Globex Agent 2',
            'email' => 'agent2@orgb.test',
            'password' => Hash::make('password'),
            'role' => 'agent',
        ]);

        $customerB1 = User::create([
            'organisation_id' => $orgB->id,
            'name' => 'Globex Customer 1',
            'email' => 'customer1@orgb.test',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);

        $customerB2 = User::create([
            'organisation_id' => $orgB->id,
            'name' => 'Globex Customer 2',
            'email' => 'customer2@orgb.test',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);

        // 3. Create SLA Policies
        $slaA = SlaPolicy::create([
            'organisation_id' => $orgA->id,
            'name' => 'Acme Standard SLA',
            'first_response_hours' => 24,
            'resolution_hours' => 72,
        ]);

        $slaB = SlaPolicy::create([
            'organisation_id' => $orgB->id,
            'name' => 'Globex Fast SLA',
            'first_response_hours' => 4,
            'resolution_hours' => 12,
        ]);

        // 4. Seed ~12 tickets for Org A (Acme Corp)
        $ticketDataA = [
            ['subject' => 'Cannot access billing portal', 'priority' => 'high', 'status' => 'open', 'tags' => ['billing', 'portal'], 'cust' => $customerA1, 'agent' => $agentA1],
            ['subject' => 'Page load times are very slow', 'priority' => 'medium', 'status' => 'pending', 'tags' => ['performance', 'speed'], 'cust' => $customerA2, 'agent' => $agentA2],
            ['subject' => 'Password reset link not working', 'priority' => 'urgent', 'status' => 'open', 'tags' => ['auth', 'login'], 'cust' => $customerA1, 'agent' => $agentA1],
            ['subject' => 'API documentation request', 'priority' => 'low', 'status' => 'resolved', 'tags' => ['documentation', 'api'], 'cust' => $customerA2, 'agent' => null],
            ['subject' => 'Integrations fail on webhooks', 'priority' => 'high', 'status' => 'closed', 'tags' => ['webhooks', 'integration'], 'cust' => $customerA1, 'agent' => $agentA2],
            ['subject' => 'Invoicing details are incorrect', 'priority' => 'medium', 'status' => 'open', 'tags' => ['billing', 'invoice'], 'cust' => $customerA2, 'agent' => null],
            ['subject' => 'How do I add team members?', 'priority' => 'low', 'status' => 'resolved', 'tags' => ['team', 'members'], 'cust' => $customerA1, 'agent' => $agentA1],
            ['subject' => 'Security review questionnaire', 'priority' => 'medium', 'status' => 'open', 'tags' => ['security', 'audit'], 'cust' => $customerA2, 'agent' => $agentA2],
            ['subject' => 'Mobile app crashes on start', 'priority' => 'urgent', 'status' => 'open', 'tags' => ['mobile', 'bug'], 'cust' => $customerA1, 'agent' => null],
            ['subject' => 'Feature request: export custom CSV', 'priority' => 'low', 'status' => 'pending', 'tags' => ['export', 'csv'], 'cust' => $customerA2, 'agent' => $agentA1],
            ['subject' => 'Incorrect currency in settings', 'priority' => 'medium', 'status' => 'resolved', 'tags' => ['billing', 'settings'], 'cust' => $customerA1, 'agent' => $agentA2],
            ['subject' => 'Database connection timeout', 'priority' => 'urgent', 'status' => 'open', 'tags' => ['database', 'bug'], 'cust' => $customerA2, 'agent' => $agentA1],
        ];

        foreach ($ticketDataA as $idx => $t) {
            $createdTicket = Ticket::create([
                'organisation_id' => $orgA->id,
                'subject' => $t['subject'],
                'description' => 'Detailed description of: ' . $t['subject'] . '. Please assist as soon as possible.',
                'status' => $t['status'],
                'priority' => $t['priority'],
                'requester_id' => $t['cust']->id,
                'assignee_id' => $t['agent'] ? $t['agent']->id : null,
                'resolved_at' => $t['status'] === 'resolved' || $t['status'] === 'closed' ? Carbon::now()->subDays(2) : null,
                'created_at' => Carbon::now()->subDays(3 - ($idx * 0.2)),
            ]);

            // Add Tags
            foreach ($t['tags'] as $tagStr) {
                TicketTag::create([
                    'ticket_id' => $createdTicket->id,
                    'tag' => $tagStr,
                ]);
            }

            // Add SLA details
            TicketSla::create([
                'ticket_id' => $createdTicket->id,
                'sla_policy_id' => $slaA->id,
                'first_response_due_at' => $createdTicket->created_at->addHours($slaA->first_response_hours),
                'resolution_due_at' => $createdTicket->created_at->addHours($slaA->resolution_hours),
                // Simulate some breached tickets
                'breached' => $t['status'] === 'open' && $createdTicket->created_at->addHours($slaA->resolution_hours)->isPast(),
            ]);

            // Add Threaded Conversations
            Conversation::create([
                'ticket_id' => $createdTicket->id,
                'user_id' => $t['cust']->id,
                'body' => 'Hello team, I am experiencing this issue. Let me know what information you need.',
                'type' => 'reply',
                'created_at' => $createdTicket->created_at->addMinutes(5),
            ]);

            if ($t['agent']) {
                Conversation::create([
                    'ticket_id' => $createdTicket->id,
                    'user_id' => $t['agent']->id,
                    'body' => 'I am looking into this issue right now. I will keep you posted.',
                    'type' => 'reply',
                    'created_at' => $createdTicket->created_at->addHours(1),
                ]);

                Conversation::create([
                    'ticket_id' => $createdTicket->id,
                    'user_id' => $t['agent']->id,
                    'body' => 'INTERNAL NOTE: This seems related to server overload or bad indices. Checking server health logs.',
                    'type' => 'note',
                    'created_at' => $createdTicket->created_at->addHours(1)->addMinutes(10),
                ]);
            }
        }

        // 5. Seed ~12 tickets for Org B (Globex Corp)
        $ticketDataB = [
            ['subject' => 'SSO integration not working', 'priority' => 'urgent', 'status' => 'open', 'tags' => ['sso', 'auth'], 'cust' => $customerB1, 'agent' => $agentB1],
            ['subject' => 'UI alignment bug on Chrome', 'priority' => 'low', 'status' => 'pending', 'tags' => ['ui', 'bug'], 'cust' => $customerB2, 'agent' => $agentB2],
            ['subject' => 'Reset 2FA token request', 'priority' => 'high', 'status' => 'open', 'tags' => ['2fa', 'security'], 'cust' => $customerB1, 'agent' => $agentB1],
            ['subject' => 'API rate limits query', 'priority' => 'medium', 'status' => 'resolved', 'tags' => ['api', 'limits'], 'cust' => $customerB2, 'agent' => null],
            ['subject' => 'White screen on dashboard loading', 'priority' => 'urgent', 'status' => 'closed', 'tags' => ['bug', 'dashboard'], 'cust' => $customerB1, 'agent' => $agentB2],
            ['subject' => 'Update card details help', 'priority' => 'low', 'status' => 'open', 'tags' => ['billing', 'card'], 'cust' => $customerB2, 'agent' => null],
            ['subject' => 'Custom reports not loading data', 'priority' => 'medium', 'status' => 'open', 'tags' => ['reports', 'data'], 'cust' => $customerB1, 'agent' => $agentB1],
            ['subject' => 'Request copy of security audit', 'priority' => 'low', 'status' => 'resolved', 'tags' => ['security', 'compliance'], 'cust' => $customerB2, 'agent' => $agentB2],
            ['subject' => 'Email notifications not arriving', 'priority' => 'medium', 'status' => 'open', 'tags' => ['email', 'notifications'], 'cust' => $customerB1, 'agent' => null],
            ['subject' => 'Bulk upload users fails', 'priority' => 'high', 'status' => 'pending', 'tags' => ['upload', 'bulk'], 'cust' => $customerB2, 'agent' => $agentB1],
            ['subject' => 'Subscription pricing plan change', 'priority' => 'low', 'status' => 'resolved', 'tags' => ['billing', 'pricing'], 'cust' => $customerB1, 'agent' => $agentB2],
            ['subject' => 'Error 500 on webhooks panel', 'priority' => 'urgent', 'status' => 'open', 'tags' => ['webhooks', 'error'], 'cust' => $customerB2, 'agent' => $agentB1],
        ];

        foreach ($ticketDataB as $idx => $t) {
            $createdTicket = Ticket::create([
                'organisation_id' => $orgB->id,
                'subject' => $t['subject'],
                'description' => 'Detailed description of: ' . $t['subject'] . '. Please assist as soon as possible.',
                'status' => $t['status'],
                'priority' => $t['priority'],
                'requester_id' => $t['cust']->id,
                'assignee_id' => $t['agent'] ? $t['agent']->id : null,
                'resolved_at' => $t['status'] === 'resolved' || $t['status'] === 'closed' ? Carbon::now()->subDays(2) : null,
                'created_at' => Carbon::now()->subDays(1 - ($idx * 0.05)),
            ]);

            // Add Tags
            foreach ($t['tags'] as $tagStr) {
                TicketTag::create([
                    'ticket_id' => $createdTicket->id,
                    'tag' => $tagStr,
                ]);
            }

            // Add SLA details
            TicketSla::create([
                'ticket_id' => $createdTicket->id,
                'sla_policy_id' => $slaB->id,
                'first_response_due_at' => $createdTicket->created_at->addHours($slaB->first_response_hours),
                'resolution_due_at' => $createdTicket->created_at->addHours($slaB->resolution_hours),
                // Simulate some breached tickets
                'breached' => $t['status'] === 'open' && $createdTicket->created_at->addHours($slaB->resolution_hours)->isPast(),
            ]);

            // Add Threaded Conversations
            Conversation::create([
                'ticket_id' => $createdTicket->id,
                'user_id' => $t['cust']->id,
                'body' => 'I have an issue with: ' . $t['subject'] . '. Please check this.',
                'type' => 'reply',
                'created_at' => $createdTicket->created_at->addMinutes(2),
            ]);

            if ($t['agent']) {
                Conversation::create([
                    'ticket_id' => $createdTicket->id,
                    'user_id' => $t['agent']->id,
                    'body' => 'Looking into this. Will update shortly.',
                    'type' => 'reply',
                    'created_at' => $createdTicket->created_at->addHours(1),
                ]);

                Conversation::create([
                    'ticket_id' => $createdTicket->id,
                    'user_id' => $t['agent']->id,
                    'body' => 'INTERNAL NOTE: Re-indexing auth tokens / check DB locks. Might need SSO config update.',
                    'type' => 'note',
                    'created_at' => $createdTicket->created_at->addHours(1)->addMinutes(5),
                ]);
            }
        }
    }
}
