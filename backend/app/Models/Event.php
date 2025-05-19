<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'date',
        'location',
        'budget_allocated',
        'budget_used',
        'doctor_id',
        'laboratory_id',
    ];

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function laboratory()
    {
        return $this->belongsTo(Laboratory::class);
    }
}
