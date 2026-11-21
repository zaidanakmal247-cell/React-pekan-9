import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AppLayout from '../../../../../resources/js/layouts/app-layout';

type BukuData = {
    id: number;
    judul: string;
    penulis: string;
    penerbit: string;
    tahun_terbit: number;
    stok: number;
};
type FormData = {
    judul: string;
    penulis: string;
    penerbit: string;
    tahun_terbit: string | number;
    stok: string | number;
};
type Props = { buku: BukuData | null; action: string; method: 'post' | 'put' };

export default function BukuForm({ buku, action, method }: Props) {
    const form = useForm<FormData>({
        judul: buku?.judul ?? '',
        penulis: buku?.penulis ?? '',
        penerbit: buku?.penerbit ?? '',
        tahun_terbit: buku?.tahun_terbit ?? '',
        stok: buku?.stok ?? 0,
    });

    function submit(event: FormEvent) {
        event.preventDefault();
        if (method === 'put') form.put(action);
        else form.post(action);
    }

    return (
        <AppLayout>
            <div className="page-heading"><div><p className="eyebrow">KATALOG</p><h1>{buku ? 'Ubah Buku' : 'Tambah Buku'}</h1></div></div>
            <form className="card form-grid" onSubmit={submit}>
                {([
                    ['judul', 'Judul', 'text'],
                    ['penulis', 'Penulis', 'text'],
                    ['penerbit', 'Penerbit', 'text'],
                    ['tahun_terbit', 'Tahun terbit', 'number'],
                    ['stok', 'Stok', 'number'],
                ] as const).map(([field, label, type]) => (
                    <div className="field" key={field}>
                        <label htmlFor={field}>{label}</label>
                        <input
                            id={field}
                            type={type}
                            min={field === 'tahun_terbit' ? 1000 : field === 'stok' ? 0 : undefined}
                            max={field === 'tahun_terbit' ? 2100 : undefined}
                            value={form.data[field]}
                            onChange={(event) => form.setData(field, event.target.value)}
                        />
                        {form.errors[field] && <small className="error">{form.errors[field]}</small>}
                    </div>
                ))}
                <div className="form-actions">
                    <button className="button" type="submit" disabled={form.processing}>{form.processing ? 'Menyimpan...' : 'Simpan'}</button>
                    <Link className="button quiet" href="/buku">Batal</Link>
                </div>
            </form>
        </AppLayout>
    );
}
