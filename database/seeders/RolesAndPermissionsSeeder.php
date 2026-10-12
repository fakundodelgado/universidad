<?php
namespace Database\Seeders;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
class RolesAndPermissionsSeeder extends Seeder
{
 /**
 * Run the database seeds.
 */
 public function run(): void
 {
 //Limpiar la caché de los permisos de Spatie

app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
 // Crear Permisos
 Permission::create(['name' => 'listar carreras']);
 Permission::create(['name' => 'crear carreras']);
 Permission::create(['name' => 'ver carreras']);
 Permission::create(['name' => 'editar carreras']);
 Permission::create(['name' => 'eliminar carreras']);
 Permission::create(['name' => 'descargar reportes']);

 // Crear Roles
 $roleSuperAdmin = Role::create(['name' => 'super-admin']);
 $roleAdmin = Role::create(['name' => 'admin']);
 $roleUser = Role::create(['name' => 'user']);
 $roleGuest = Role::create(['name' => 'guest']);
 // Asignar Permisos a Roles
 $roleSuperAdmin->givePermissionTo(Permission::all());
 $roleAdmin->givePermissionTo(['listar carreras', 'crear carreras', 'editar carreras']);
 $roleUser->givePermissionTo(['listar carreras', 'descargar reportes']);
 $roleGuest->givePermissionTo(['listar carreras']);
 //Crear usuarios de prueba y asignarles roles
 // SUPER-ADMINs
 User::firstOrCreate(
 ['email' => 'superadmin@example.com'],
 [
 'name' => 'Super Admin',
 'password' => bcrypt('password'),
 ]
 )->assignRole('super-admin');
 $superAdminUser = User::firstOrCreate(
 ['email' => 'miusuario@mimail.com'],
 [
 'name' => 'Super Administrador',
 'password' => bcrypt('1234'),
 ]
 );
 $superAdminUser->assignRole($roleSuperAdmin);
 // ADMIN
 $adminUser = User::firstOrCreate(
 ['email' => 'admin@example.com'],
 [
 'name' => 'Admin',
 'password' => bcrypt('1234'),
 ]
 );
 $adminUser->assignRole($roleAdmin);
 // USER
 $normalUser = User::firstOrCreate(
 ['email' => 'user@example.com'],
 [
 'name' => 'Juan Pérez',
 'password' => bcrypt('1234'),
 ]
 );
 $normalUser->assignRole($roleUser);
 // GUEST
 $guestUser = User::firstOrCreate(
 ['email' => 'guest@example.com'],
 [
 'name' => 'Usuario Invitado',
 'password' => bcrypt('1234'),
 ]
 );
 $guestUser->assignRole($roleGuest);
 }
}

