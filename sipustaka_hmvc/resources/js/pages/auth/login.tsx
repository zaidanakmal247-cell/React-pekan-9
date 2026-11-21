import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

type LoginData = { email: string; password: string; remember: boolean };

export default function Login() {
    const form = useForm<LoginData>({ email: '', password: '', remember: false });

    function submit(event: FormEvent) {
        event.preventDefault();
        form.post('/login');
    }

    return (
        <div className="auth-shell">
            <form className="card auth-card" onSubmit={submit}>
                <p className="eyebrow">SIPUSTAKA</p><h1>Masuk</h1><p className="muted">Masuk untuk mengakses layanan perpustakaan.</p>
                <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} autoComplete="email" required />{form.errors.email && <small className="error">{form.errors.email}</small>}</div>
                <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" value={form.data.password} onChange={(event) => form.setData('password', event.target.value)} autoComplete="current-password" required />{form.errors.password && <small className="error">{form.errors.password}</small>}</div>
                <label><input type="checkbox" checked={form.data.remember} onChange={(event) => form.setData('remember', event.target.checked)} /> Ingat saya</label>
                <button className="button" type="submit" disabled={form.processing}>Masuk</button>
                <p className="auth-footer">Belum punya akun? <Link href="/register">Daftar</Link></p>
            </form>
        </div>
    );
}
