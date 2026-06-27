<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;

class ScopeTenant
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check()) {
            $user = auth()->user();

            // Intercept cross-tenant ticket access and return 403
            if ($ticketId = $request->route('ticket')) {
                $id = is_numeric($ticketId) ? $ticketId : (isset($ticketId->id) ? $ticketId->id : null);
                if ($id) {
                    $belongsToOther = DB::table('tickets')
                        ->where('id', $id)
                        ->where('organisation_id', '!=', $user->organisation_id)
                        ->exists();

                    if ($belongsToOther) {
                        return response()->json(['error' => 'Forbidden. Cross-tenant access denied.'], 403);
                    }
                }
            }

            // Intercept cross-tenant user access and return 403
            if ($userId = $request->route('user')) {
                $id = is_numeric($userId) ? $userId : (isset($userId->id) ? $userId->id : null);
                if ($id) {
                    $belongsToOther = DB::table('users')
                        ->where('id', $id)
                        ->where('organisation_id', '!=', $user->organisation_id)
                        ->exists();

                    if ($belongsToOther) {
                        return response()->json(['error' => 'Forbidden. Cross-tenant access denied.'], 403);
                    }
                }
            }
        }

        return $next($request);
    }
}
