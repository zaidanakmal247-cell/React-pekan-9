import { Link, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

export default function Form({ kategori, storeUrl, updateUrl, indexUrl }) {
    const editing = Boolean(kategori);
    const form = useForm({
        nama_kategori: kategori?.nama_kategori ?? '',
        deskripsi: kategori?.deskripsi ?? '',
    });

    function submit(event) {
        event.preventDefault();
        if (editing) {
            form.put(updateUrl);
        } else {
            form.post(storeUrl);
        }
    }

    return (
        <AppLayout title={editing ? 'Edit Kategori' : 'Tambah Kategori'}>
            <div className="mb-4">
                <h1 className="h3">{editing ? 'Edit' : 'Tambah'} Kategori Parkir</h1>
                <p className="text-muted">Perubahan disimpan melalui Inertia.</p>
            </div>
            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <form onSubmit={submit}>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="nama_kategori">Nama kategori</label>
                            <input
                                className={`form-control${form.errors.nama_kategori ? ' is-invalid' : ''}`}
                                id="nama_kategori"
                                maxLength="100"
                                required
                                value={form.data.nama_kategori}
                                onChange={(event) => form.setData('nama_kategori', event.target.value)}
                            />
                            {form.errors.nama_kategori && <div className="invalid-feedback">{form.errors.nama_kategori}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="deskripsi">Deskripsi</label>
                            <textarea
                                className={`form-control${form.errors.deskripsi ? ' is-invalid' : ''}`}
                                id="deskripsi"
                                maxLength="1000"
                                rows="4"
                                value={form.data.deskripsi}
                                onChange={(event) => form.setData('deskripsi', event.target.value)}
                            />
                            {form.errors.deskripsi && <div className="invalid-feedback">{form.errors.deskripsi}</div>}
                        </div>
                        <button className="btn btn-primary" disabled={form.processing} type="submit">
                            {form.processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <Link className="btn btn-outline-secondary ms-2" href={indexUrl}>Batal</Link>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
