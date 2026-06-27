<?php

namespace Tests\Feature;

use App\Models\Organisation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->org = Organisation::create([
            'name' => 'Acme Corp',
            'slug' => 'acme',
        ]);

        $this->user = User::create([
            'organisation_id' => $this->org->id,
            'name' => 'Acme User',
            'email' => 'user@acme.test',
            'password' => bcrypt('password'),
            'role' => 'agent',
        ]);
    }

    public function test_user_can_login_with_correct_credentials()
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'user@acme.test',
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'access_token',
                'token_type',
                'user' => ['id', 'name', 'email', 'role', 'organisation']
            ]);
    }

    public function test_user_cannot_login_with_incorrect_credentials()
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'user@acme.test',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJsonFragment([
                'message' => 'The provided credentials are incorrect.'
            ]);
    }

    public function test_authenticated_user_can_retrieve_profile()
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/auth/me');

        $response->assertStatus(200)
            ->assertJsonFragment([
                'email' => 'user@acme.test',
                'name' => 'Acme User',
            ]);
    }

    public function test_authenticated_user_can_logout()
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/auth/logout');

        $response->assertStatus(200)
            ->assertJsonFragment([
                'message' => 'Logged out successfully.'
            ]);
    }
}
