<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\BelongsToOrganisation;

class SlaPolicy extends Model
{
    use HasFactory, BelongsToOrganisation;

    protected $fillable = [
        'organisation_id',
        'name',
        'first_response_hours',
        'resolution_hours',
    ];

    public function tickets(): HasMany
    {
        return $this->hasMany(TicketSla::class);
    }
}
