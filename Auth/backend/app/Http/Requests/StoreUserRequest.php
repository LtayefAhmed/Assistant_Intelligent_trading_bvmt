<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'phone' => 'required|string|max:20',
        ];



        return $rules;
    }
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom est obligatoire',
            'prenom.required' => 'Le prénom est obligatoire',
            'email.required' => 'L\'email est obligatoire',
            'email.unique' => 'Cet email est déjà utilisé',
            'password.required' => 'Le mot de passe est obligatoire',
            'password.min' => 'Le mot de passe doit contenir au moins 6 caractères',
            'phone.required' => 'Le téléphone est obligatoire',
            'role.required' => 'Le rôle est obligatoire',
            'cin.required' => 'Le CIN est obligatoire pour les chercheurs d\'emploi',
            'resume.required' => 'Le CV est obligatoire pour les chercheurs d\'emploi',
            'company.required' => 'Le nom de l\'entreprise est obligatoire pour les recruteurs',
            'position.required' => 'Le poste est obligatoire pour les recruteurs',
            'industry.required' => 'Le secteur d\'activité est obligatoire pour les recruteurs',
        ];
    }
}
