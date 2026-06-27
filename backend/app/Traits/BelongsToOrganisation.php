<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use App\Models\Organisation;

trait BelongsToOrganisation
{
    /**
     * Boot the trait to add the global organization scope and automatically set organisation_id on creation.
     */
    public static function bootBelongsToOrganisation(): void
    {
        static::creating(function (Model $model) {
            if (auth()->check() && !$model->organisation_id) {
                $model->organisation_id = auth()->user()->organisation_id;
            }
        });

        static::addGlobalScope('organisation_scope', function (Builder $builder) {
            if (auth()->check()) {
                $builder->where($builder->getModel()->getTable() . '.organisation_id', auth()->user()->organisation_id);
            }
        });
    }

    /**
     * Get the organization that owns this entity.
     */
    public function organisation()
    {
        return $this->belongsTo(Organisation::class);
    }
}
