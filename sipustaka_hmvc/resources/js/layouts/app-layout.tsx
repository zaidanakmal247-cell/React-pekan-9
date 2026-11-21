import { Link, router, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

type SharedProps = {
    auth: {
        user: { name: string; role: 'admin' | 'user' } | null;
    };
    flash: { success?: string | null };
};

export default function AppLayout({ children }: PropsWithChildren) {
    const { auth, flash } = usePage<SharedProps>().props;

    return (
        <div className="app-shell">
            <aside className="sidebar" aria-label="Navigasi utama">
                <Link className="brand" href={auth.user ? '/buku' : '/login'}>SiPustaka</Link>
                {auth.user && (
                    <>
                        <div className="identity">{auth.user.name}<br />{auth.user.role === 'admin' ? 'Admin' : 'Anggota'}</div>
                        <nav className="sidebar-nav">
                            <Link href="/buku">Buku</Link>
                            <a href="/peminjaman">Peminjaman</a>
                            {auth.user.role === 'admin' && <a href="/manajemen-user">Manajemen User</a>}
                        </nav>
                        <button className="logout" type="button" onClick={() => router.post('/logout')}>Keluar</button>
                    </>
                )}
            </aside>
            <main className="main-content">
                {flash.success && <div className="notice success" role="status">{flash.success}</div>}
                {children}
            </main>
        </div>
    );
}
