import { useEffect, useRef, useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';

const emptyFields = {
    kategori_id: '',
    nama_pengguna: '',
    nomor_plat: '',
    tanggal_reservasi: '',
    durasi_jam: '',
    status: 'pending',
    denda_nominal: '',
    denda_keterangan: '',
};

export default function Index({ kategoris, isPetugas, dataUrl, storeUrl, updateBaseUrl }) {
    const formRef = useRef(null);
    const [items, setItems] = useState([]);
    const [fields, setFields] = useState(emptyFields);
    const [editing, setEditing] = useState(null);
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    async function request(url, options = {}) {
        const response = await fetch(url, {
            ...options,
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
                'X-Requested-With': 'XMLHttpRequest',
                ...options.headers,
            },
        });
        const body = await response.json().catch(() => null);
        if (!response.ok) {
            const errors = body?.errors ? Object.values(body.errors).flat().join(' ') : body?.message;
            throw new Error(errors || `Permintaan gagal (HTTP ${response.status}).`);
        }
        if (!body) {
            throw new Error('Server mengirim respons yang tidak dapat dibaca.');
        }
        return body;
    }

    async function loadItems() {
        const result = await request(dataUrl);
        setItems(result.data);
    }

    useEffect(() => {
        loadItems()
            .catch((error) => setNotice({ message: error.message, type: 'danger' }))
            .finally(() => setLoading(false));
    }, []);

    function setField(name, value) {
        setFields((current) => ({ ...current, [name]: value }));
    }

    function beginEdit(item) {
        setEditing(item.id);
        setNotice(null);
        if (isPetugas) {
            setFields({
                ...emptyFields,
                status: item.status,
                denda_nominal: item.denda_nominal ?? '',
                denda_keterangan: item.denda_keterangan ?? '',
            });
        } else {
            setFields({
                ...emptyFields,
                kategori_id: String(item.kategori_id),
                nama_pengguna: item.nama_pengguna,
                nomor_plat: item.nomor_plat,
                tanggal_reservasi: item.tanggal_reservasi,
                durasi_jam: String(item.durasi_jam),
            });
        }
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function resetForm() {
        setEditing(null);
        setFields(emptyFields);
        formRef.current?.reset();
    }

    async function submit(event) {
        event.preventDefault();
        setSaving(true);
        setNotice(null);
        try {
            const body = new FormData(event.currentTarget);
            if (editing) body.append('_method', 'PUT');
            const result = await request(
                editing ? `${updateBaseUrl}/${editing}` : storeUrl,
                { method: 'POST', body },
            );
            setNotice({ message: result.message, type: 'success' });
            resetForm();
            await loadItems();
        } catch (error) {
            setNotice({ message: error.message, type: 'danger' });
        } finally {
            setSaving(false);
        }
    }

    async function remove(item) {
        if (!window.confirm('Hapus reservasi ini?')) return;

        setNotice(null);
        try {
            const result = await request(`${updateBaseUrl}/${item.id}`, { method: 'DELETE' });
            if (editing === item.id) resetForm();
            setNotice({ message: result.message, type: 'success' });
            await loadItems();
        } catch (error) {
            setNotice({ message: error.message, type: 'danger' });
        }
    }

    const columnCount = isPetugas ? 9 : 7;

    return (
        <AppLayout title="Reservasi Parkir">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1">Reservasi Parkir</h1>
                    <p className="text-muted mb-0">
                        {isPetugas
                            ? 'Perbarui status reservasi dan catat denda.'
                            : 'Buat dan ubah reservasi milik Anda.'}
                    </p>
                </div>
                <span className="badge text-bg-info">CRUD AJAX</span>
            </div>

            {notice && <div className={`alert alert-${notice.type}`} role="alert">{notice.message}</div>}

            {(!isPetugas || editing) && (
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white fw-semibold">
                        {isPetugas
                            ? `Perbarui status dan denda — ${editing ? items.find((item) => item.id === editing)?.nama_pengguna ?? '' : ''}`
                            : editing ? 'Edit reservasi' : 'Buat reservasi'}
                    </div>
                    <div className="card-body">
                        <form ref={formRef} onSubmit={submit} encType="multipart/form-data">
                            {isPetugas ? (
                                <div className="row g-3">
                                    <div className="col-md-3">
                                        <label className="form-label" htmlFor="status">Status</label>
                                        <select className="form-select" id="status" name="status" required value={fields.status} onChange={(event) => setField('status', event.target.value)}>
                                            <option value="pending">Pending</option>
                                            <option value="disetujui">Disetujui</option>
                                            <option value="selesai">Selesai</option>
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label" htmlFor="denda_nominal">Denda (Rp)</label>
                                        <input className="form-control" id="denda_nominal" name="denda_nominal" type="number" min="0" step="1000" value={fields.denda_nominal} onChange={(event) => setField('denda_nominal', event.target.value)} />
                                        <div className="form-text">Kosongkan jika tidak ada denda.</div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor="denda_keterangan">Keterangan denda</label>
                                        <input className="form-control" id="denda_keterangan" name="denda_keterangan" maxLength="2000" value={fields.denda_keterangan} onChange={(event) => setField('denda_keterangan', event.target.value)} />
                                    </div>
                                </div>
                            ) : (
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor="nama_pengguna">Nama pengguna</label>
                                        <input className="form-control" id="nama_pengguna" name="nama_pengguna" maxLength="255" required value={fields.nama_pengguna} onChange={(event) => setField('nama_pengguna', event.target.value)} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor="nomor_plat">Nomor plat</label>
                                        <input className="form-control" id="nomor_plat" name="nomor_plat" maxLength="20" required value={fields.nomor_plat} onChange={(event) => setField('nomor_plat', event.target.value)} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label" htmlFor="kategori_id">Kategori</label>
                                        <select className="form-select" id="kategori_id" name="kategori_id" required value={fields.kategori_id} onChange={(event) => setField('kategori_id', event.target.value)}>
                                            <option value="">Pilih kategori</option>
                                            {kategoris.map((kategori) => <option key={kategori.id} value={kategori.id}>{kategori.nama_kategori}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label" htmlFor="tanggal_reservasi">Tanggal reservasi</label>
                                        <input className="form-control" id="tanggal_reservasi" name="tanggal_reservasi" type="date" required value={fields.tanggal_reservasi} onChange={(event) => setField('tanggal_reservasi', event.target.value)} />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label" htmlFor="durasi_jam">Durasi (jam)</label>
                                        <input className="form-control" id="durasi_jam" name="durasi_jam" type="number" min="1" max="24" required value={fields.durasi_jam} onChange={(event) => setField('durasi_jam', event.target.value)} />
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-label" htmlFor="file_stnk">Berkas STNK (JPG, PNG, PDF; maksimal 4 MB)</label>
                                        <input className="form-control" id="file_stnk" name="file_stnk" type="file" accept=".jpg,.jpeg,.png,.pdf" />
                                        <div className="form-text">
                                            {editing
                                                ? 'Berkas saat ini dapat dibuka dari daftar. Pilih berkas baru jika ingin menggantinya.'
                                                : 'Opsional untuk reservasi baru.'}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="mt-3">
                                <button className="btn btn-primary" disabled={saving} type="submit">
                                    {saving ? 'Menyimpan...' : editing ? 'Simpan perubahan' : 'Simpan reservasi'}
                                </button>
                                {editing && <button className="btn btn-outline-secondary ms-2" onClick={resetForm} type="button">Batal</button>}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="card border-0 shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                {isPetugas && <th>Pemilik</th>}
                                <th>Nama / Plat</th><th>Kategori</th><th>Tanggal</th><th>Durasi</th>
                                <th>Status</th><th>STNK</th>{isPetugas && <th>Denda</th>}<th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td className="text-center text-muted py-4" colSpan={columnCount}>Memuat data...</td></tr>
                            ) : items.length ? items.map((item) => (
                                <tr key={item.id}>
                                    {isPetugas && <td>{item.pemilik}</td>}
                                    <td className="fw-semibold">{item.nama_pengguna} — {item.nomor_plat}</td>
                                    <td>{item.kategori}</td>
                                    <td>{item.tanggal_reservasi}</td>
                                    <td>{item.durasi_jam} jam</td>
                                    <td>{item.status}</td>
                                    <td>{item.file_url
                                        ? <a href={item.file_url} target="_blank" rel="noopener noreferrer">Buka STNK</a>
                                        : '—'}</td>
                                    {isPetugas && <td>{item.denda_nominal
                                        ? `Rp ${Number(item.denda_nominal).toLocaleString('id-ID')}`
                                        : '—'}</td>}
                                    <td>
                                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => beginEdit(item)}>
                                            {isPetugas ? 'Status / denda' : 'Edit'}
                                        </button>
                                        {!isPetugas && (
                                            <button className="btn btn-sm btn-outline-danger ms-2" type="button" onClick={() => remove(item)}>
                                                Hapus
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td className="text-center text-muted py-4" colSpan={columnCount}>Belum ada reservasi.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
