import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

type RegisterData = { name: string; email: string; password: string; password_confirmation: string };

export default function Register() {
    const form = useForm<RegisterData>({ name: '', email: '', password: '', password_confirmation: '' });

    function submit(event: FormEvent) {
        event.preventDefault();
        form.post('/register');
    }

    return (
        <div className="auth-shell">
            <form className="card auth-card" onSubmit={submit}>
                <p className="eyebrow">SIPUSTAKA</p><h1>Buat akun anggota</h1><p className="muted">Akun yang didaftarkan akan memiliki role user.</p>
                <div className="field"><label htmlFor="name">Nama</label><input id="name" value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} autoComplete="name" required />{form.errors.name && <small className="error">{form.errors.name}</small>}</div>
                <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} autoComplete="email" required />{form.errors.email && <small className="error">{form.errors.email}</small>}</div>
                <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" value={form.data.password} onChange={(event) => form.setData('password', event.target.value)} autoComplete="new-password" required />{form.errors.password && <small className="error">{form.errors.password}</small>}</div>
                <div className="field"><label htmlFor="password_confirmation">Konfirmasi password</label><input id="password_confirmation" type="password" value={form.data.password_confirmation} onChange={(event) => form.setData('password_confirmation', event.target.value)} autoComplete="new-password" required /></div>
                <button className="button" type="submit" disabled={form.processing}>Daftar</button>
                <p className="auth-footer">Sudah punya akun? <Link href="/login">Masuk</Link></p>
            </form>
        </div>
    );
}
