<?php

namespace App\Console\Commands;

use App\Models\TicketSla;
use Illuminate\Console\Command;
use Carbon\Carbon;

class CheckSlaBreaches extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sla:check-breaches';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $signature_description = 'Check all active tickets and flag any SLA breaches.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking SLA breaches...');

        // Find SLAs that are not marked as breached yet
        $ticketSlas = TicketSla::where('breached', false)
            ->with('ticket')
            ->get();

        $breachedCount = 0;

        foreach ($ticketSlas as $sla) {
            $ticket = $sla->ticket;
            if (!$ticket) {
                continue;
            }

            // If ticket is already resolved or closed, we check if it resolved past due date
            if ($ticket->status === 'resolved' || $ticket->status === 'closed') {
                if ($ticket->resolved_at && $ticket->resolved_at->gt($sla->resolution_due_at)) {
                    $sla->breached = true;
                    $sla->save();
                    $breachedCount++;
                }
            } else {
                // If it is still open/pending and current time is past due date, it is breached
                if (Carbon::now()->gt($sla->resolution_due_at)) {
                    $sla->breached = true;
                    $sla->save();
                    $breachedCount++;
                }
            }
        }

        $this->info("Completed. Flagged {$breachedCount} new SLA breaches.");
    }
}
