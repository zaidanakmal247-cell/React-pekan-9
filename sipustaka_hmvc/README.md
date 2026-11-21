# SiPustaka HMVC React

SiPustaka is a Laravel 12 campus library application built with `nwidart/laravel-modules`, Fortify, Inertia, and React. Authentication lives in the main Laravel app; catalog, loans, and user administration are separate HMVC modules.

## Setup

Requirements: PHP 8.2+, Composer, MySQL, and Node.js/npm if building frontend assets.

1. Create a MySQL database:

   ```sql
   CREATE DATABASE db_sipustaka CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. Install and configure:

   ```powershell
   composer install
   Copy-Item .env.example .env
   php artisan key:generate
   npm install
   ```

   Set `DB_HOST`, `DB_PORT`, `DB_USERNAME`, and `DB_PASSWORD` in `.env` for the local MySQL server. The example config uses `db_sipustaka`.

3. Run migrations, sample data, storage link, and server:

   ```powershell
   php artisan migrate --seed
   php artisan storage:link
   npm run build
   php artisan serve
   ```

4. Visit `http://127.0.0.1:8000`.

Seeded login accounts (change their passwords before deployment):

| Role | Email | Password |
|---|---|---|
| Admin | `admin@sipustaka.test` | `password` |
| User | `user@sipustaka.test` | `password` |

Newly registered accounts are always assigned the `user` role.

## Features

- **Buku** (`/buku`): authenticated Inertia/React catalog with search and pagination; administrators use React `useForm()` to create and edit records, and members have read-only access.
- **Peminjaman** (`/peminjaman`): authenticated AJAX create, read, update, and delete for both roles. Evidence files accept JPG, PNG, or PDF up to 2 MB; uploaded paths are stored in `peminjamans.bukti_path` and files live under `storage/app/public/bukti-peminjaman`.
- **Manajemen User** (`/manajemen-user`): admin-only synchronous user CRUD. Admins cannot remove or downgrade their own account.
- **Authentication**: register, login, and logout are handled by Laravel Fortify. New registrations are always assigned `user`, regardless of submitted fields.
- **Authorization**: `role:admin` middleware is registered in `bootstrap/app.php`; React sidebar links are driven by shared Inertia auth props. All data-management routes also require authentication.

## Evidence checklist

1. Sign in as the seeded user and open `/manajemen-user`; Laravel returns HTTP 403. Capture this response as the authorization screenshot. The user can open `/buku` but cannot access admin-only book forms.
2. Open DevTools → **Network** → **Fetch/XHR**, then create, edit, or delete a loan. Capture the requests without a document reload: `GET /peminjaman/data`, `POST /peminjaman`, `POST /peminjaman/{id}` with `_method=PUT`, and `DELETE /peminjaman/{id}`. A validation failure returns HTTP 422 with per-field errors.
3. Upload a valid proof, then capture the contents of `storage/app/public/bukti-peminjaman`. In phpMyAdmin select `db_sipustaka.peminjamans`; `bukti_path` contains a relative value such as `bukti-peminjaman/<generated-name>.pdf`. To locate uploaded records, run `SELECT bukti_path FROM peminjamans WHERE bukti_path IS NOT NULL;`.

## Tests

```powershell
php artisan test
```
