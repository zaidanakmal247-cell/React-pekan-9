import { Head, Link, usePage } from '@inertiajs/react';

export default function AppLayout({ title, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;

    return (
        <>
            <Head title={title} />
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
                <div className="container">
                    <a className="navbar-brand fw-bold" href="/">ParkTrack</a>
                    <div className="navbar-nav ms-auto align-items-lg-center">
                        <a className="nav-link" href="/">Dashboard</a>
                        <Link className="nav-link" href="/reservasi">Reservasi</Link>
                        {user?.role === 'petugas' && (
                            <Link className="nav-link" href="/kategori">Kategori</Link>
                        )}
                        <a className="nav-link" href="/denda">Denda</a>
                        <span className="navbar-text mx-lg-3">{user?.name}</span>
                        <form method="POST" action="/logout">
                            <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.content ?? ''} />
                            <button className="btn btn-outline-light btn-sm" type="submit">Logout</button>
                        </form>
                    </div>
                </div>
            </nav>
            <main className="container my-4">
                {flash.status && <div className="alert alert-success">{flash.status}</div>}
                {flash.error && <div className="alert alert-danger">{flash.error}</div>}
                {children}
            </main>
        </>
    );
}
