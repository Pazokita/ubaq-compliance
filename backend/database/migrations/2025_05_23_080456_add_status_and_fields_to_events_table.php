<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->enum('status', [
                'pending',
                'first_validation',
                'second_validation',
                'to_modify',
                'in_submission',
                'in_progress',
                'rejected',
            ])->default('pending')->after('laboratory_id');

            $table->string('type')->nullable()->after('location');
            $table->text('description')->nullable()->after('type');
            $table->string('document_url')->nullable()->after('description');
            $table->text('validation_comment')->nullable()->after('document_url');
            $table->unsignedBigInteger('validated_by')->nullable()->after('validation_comment');
            $table->timestamp('validated_at')->nullable()->after('validated_by');

            $table->foreign('validated_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropForeign(['validated_by']);
            $table->dropColumn([
                'status', 'type', 'description', 'document_url',
                'validation_comment', 'validated_by', 'validated_at',
            ]);
        });
    }
};
