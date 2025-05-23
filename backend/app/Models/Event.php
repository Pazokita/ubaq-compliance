<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'date',
        'location',
        'type',
        'description',
        'budget_allocated',
        'budget_used',
        'doctor_id',
        'laboratory_id',
        'status',
        'document_url',
        'validation_comment',
        'validated_by',
        'validated_at',
        'created_by',
    ];

    protected $casts = [
        'date' => 'date',
        'budget_allocated' => 'decimal:2',
        'budget_used' => 'decimal:2',
        'validated_at' => 'datetime',
    ];

    // Constantes pour les statuts
    public const STATUS_PENDING = 'pending';

    public const STATUS_FIRST_VALIDATION = 'first_validation';

    public const STATUS_SECOND_VALIDATION = 'second_validation';

    public const STATUS_TO_MODIFY = 'to_modify';

    public const STATUS_IN_SUBMISSION = 'in_submission';

    public const STATUS_IN_PROGRESS = 'in_progress';

    public const STATUS_REJECTED = 'rejected';

    // Constantes pour les types
    public const TYPE_CONFERENCE = 'conference';

    public const TYPE_WORKSHOP = 'workshop';

    public const TYPE_FORMATION = 'formation';

    public const TYPE_SEMINAR = 'seminar';

    public const TYPE_PRESENTATION = 'presentation';

    // Relations
    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function laboratory()
    {
        return $this->belongsTo(Laboratory::class);
    }

    public function validator()
    {
        return $this->belongsTo(User::class, 'validated_by');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Scopes pour les requêtes GraphQL
    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
                ->orWhere('location', 'like', "%{$search}%")
                ->orWhereHas('doctor', function ($doctorQuery) use ($search) {
                    $doctorQuery->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%");
                })
                ->orWhereHas('laboratory', function ($labQuery) use ($search) {
                    $labQuery->where('name', 'like', "%{$search}%");
                });
        });
    }

    // Méthodes utilitaires
    public function canBeValidated(): bool
    {
        return in_array($this->status, [
            self::STATUS_PENDING,
            self::STATUS_FIRST_VALIDATION,
            self::STATUS_TO_MODIFY,
        ]);
    }

    public function canBeEdited(): bool
    {
        return in_array($this->status, [
            self::STATUS_PENDING,
            self::STATUS_TO_MODIFY,
        ]);
    }

    public function canBeDeleted(): bool
    {
        return ! in_array($this->status, [
            self::STATUS_IN_PROGRESS,
            self::STATUS_SECOND_VALIDATION,
        ]);
    }

    public function exceedsBudgetThreshold(float $threshold = 250.0): bool
    {
        return $this->budget_used > $threshold;
    }

    // Traduction du statut pour l'affichage
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            self::STATUS_PENDING => 'En cours de création',
            self::STATUS_FIRST_VALIDATION => 'Première validation',
            self::STATUS_SECOND_VALIDATION => 'Deuxième validation',
            self::STATUS_TO_MODIFY => 'À modifier',
            self::STATUS_IN_SUBMISSION => 'En cours de soumission',
            self::STATUS_IN_PROGRESS => 'Événement en cours',
            self::STATUS_REJECTED => 'Rejeté',
            default => 'Statut inconnu'
        };
    }

    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            self::TYPE_CONFERENCE => 'Conférence',
            self::TYPE_WORKSHOP => 'Workshop',
            self::TYPE_FORMATION => 'Formation',
            self::TYPE_SEMINAR => 'Séminaire',
            self::TYPE_PRESENTATION => 'Présentation',
            default => ucfirst($this->type)
        };
    }
}
