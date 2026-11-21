import { Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

export default function Index({ kategoris }) {
    return (
        <AppLayout title="Kategori Parkir">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1">Kategori Parkir</h1>
                    <p className="text-muted mb-0">Kelola area dan jenis parkir menggunakan CRUD Inertia.</p>
                </div>
                <Link className="btn btn-primary" href="/kategori/create">Tambah kategori</Link>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Nama kategori</th>
                                <th>Deskripsi</th>
                                <th className="text-end">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {kategoris.length ? kategoris.map((kategori) => (
                                <tr key={kategori.id}>
                                    <td className="fw-semibold">{kategori.nama_kategori}</td>
                                    <td>{kategori.deskripsi || '—'}</td>
                                    <td className="text-end text-nowrap">
                                        <Link className="btn btn-sm btn-outline-primary me-2" href={`/kategori/${kategori.id}/edit`}>Edit</Link>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            type="button"
                                            onClick={() => {
                                                if (window.confirm('Hapus kategori ini?')) {
                                                    router.delete(`/kategori/${kategori.id}`);
                                                }
                                            }}
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td className="text-center text-muted py-4" colSpan="3">Belum ada kategori.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
