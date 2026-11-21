import { Link, router, usePage } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import AppLayout from '../../../../../resources/js/layouts/app-layout';

type Book = {
    id: number;
    judul: string;
    penulis: string;
    penerbit: string;
    tahun_terbit: number;
    stok: number;
};
type PageLink = { url: string | null; label: string; active: boolean };
type Props = {
    auth: { user: { role: 'admin' | 'user' } };
    bukus: { data: Book[]; links: PageLink[] };
    filters: { search: string };
};

export default function BukuIndex({ bukus, filters }: Props) {
    const { auth } = usePage<Props>().props;
    const [search, setSearch] = useState(filters.search);
    const isAdmin = auth.user.role === 'admin';

    function submitSearch(event: FormEvent) {
        event.preventDefault();
        router.get('/buku', { search }, { preserveState: true, replace: true });
    }

    return (
        <AppLayout>
            <div className="page-heading">
                <div><p className="eyebrow">KATALOG</p><h1>Daftar Buku</h1><p className="muted">Cari dan lihat koleksi perpustakaan.</p></div>
                {isAdmin && <Link className="button" href="/buku/create">Tambah buku</Link>}
            </div>
            <form className="search" onSubmit={submitSearch}>
                <label className="sr-only" htmlFor="search">Cari buku</label>
                <input id="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari judul, penulis, atau penerbit" />
                <button className="button secondary" type="submit">Cari</button>
                {filters.search && <button className="button quiet" type="button" onClick={() => { setSearch(''); router.get('/buku'); }}>Hapus pencarian</button>}
            </form>
            <div className="table-wrap">
                <table>
                    <thead><tr><th>Judul</th><th>Penulis</th><th>Penerbit</th><th>Tahun</th><th>Stok</th>{isAdmin && <th>Aksi</th>}</tr></thead>
                    <tbody>
                        {bukus.data.length === 0 ? (
                            <tr><td className="empty" colSpan={isAdmin ? 6 : 5}>Tidak ada buku yang sesuai.</td></tr>
                        ) : bukus.data.map((buku) => (
                            <tr key={buku.id}>
                                <td><strong>{buku.judul}</strong></td><td>{buku.penulis}</td><td>{buku.penerbit}</td><td>{buku.tahun_terbit}</td><td>{buku.stok}</td>
                                {isAdmin && <td className="actions">
                                    <Link href={`/buku/${buku.id}/edit`}>Ubah</Link>
                                    <button className="link-button danger-text" type="button" onClick={() => {
                                        if (window.confirm('Hapus buku ini?')) router.delete(`/buku/${buku.id}`);
                                    }}>Hapus</button>
                                </td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <nav className="pagination" aria-label="Pagination">
                {bukus.links.map((link, index) => {
                    const label = link.label.replace(/&laquo;|&raquo;/g, '').trim();
                    if (!link.url) return <span key={index} aria-disabled="true">{label}</span>;
                    return <Link key={index} className={link.active ? 'active' : ''} href={link.url} preserveScroll>{label}</Link>;
                })}
            </nav>
        </AppLayout>
    );
}
