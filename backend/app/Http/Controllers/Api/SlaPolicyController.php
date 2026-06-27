<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SlaPolicy;
use Illuminate\Http\Request;

class SlaPolicyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Automatically scoped to organization
        return response()->json(SlaPolicy::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Only admin can configure SLA policies
        if (!$request->user()->isAdmin()) {
            return response()->json(['error' => 'Forbidden. Only administrators can configure SLA policies.'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'first_response_hours' => 'required|integer|min:1',
            'resolution_hours' => 'required|integer|min:1',
        ]);

        $policy = SlaPolicy::create([
            'name' => $request->name,
            'first_response_hours' => $request->first_response_hours,
            'resolution_hours' => $request->resolution_hours,
        ]);

        return response()->json($policy, 201);
    }
}
