<?php
namespace App\Policies;
use App\Models\User;
use Illuminate\Auth\Access\Response;
class UserPolicy
{
/**
 * Determina si el usuario puede actualizar a otro usuario (o a sí mismo).
 */
 public function update(User $currentUser): bool
 {
 // El usuario actual debe tener rol de Super Admin para editar usuarios
 if (!$currentUser->hasRole('super-admin')) {
 return false;
 }
 // Si se aprueba lo anterior, permitimos la edición general.

 return true;
 }
 /**
 * Determina si el usuario puede eliminar a otro usuario.
 */
 public function delete(User $currentUser, User $targetUser): bool
 {
 // REGLA CRÍTICA: Nadie puede eliminarse a sí mismo
 if ($currentUser->id === $targetUser->id) {
 return false;
 }
 // Solo un Super Admin puede eliminar otros usuarios
 return $currentUser->hasRole('super-admin');
 }
}

