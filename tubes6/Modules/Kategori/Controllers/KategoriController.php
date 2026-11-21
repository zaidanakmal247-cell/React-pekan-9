<?php

namespace Modules\Kategori\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Modules\Kategori\Models\Kategori;

class KategoriController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Kategori/Index', [
            'kategoris' => Kategori::orderBy('nama_kategori')
                ->get(['id', 'nama_kategori', 'deskripsi']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Kategori/Form', [
            'kategori' => null,
            'storeUrl' => route('kategori.store'),
            'indexUrl' => route('kategori.index'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Kategori::create($this->validated($request));

        return redirect()->route('kategori.index')->with('status', 'Kategori berhasil ditambahkan.');
    }

    public function edit(Kategori $kategori): Response
    {
        return Inertia::render('Kategori/Form', [
            'kategori' => $kategori->only('id', 'nama_kategori', 'deskripsi'),
            'storeUrl' => route('kategori.store'),
            'updateUrl' => route('kategori.update', $kategori),
            'indexUrl' => route('kategori.index'),
        ]);
    }

    public function update(Request $request, Kategori $kategori): RedirectResponse
    {
        $kategori->update($this->validated($request, $kategori));

        return redirect()->route('kategori.index')->with('status', 'Kategori berhasil diperbarui.');
    }

    public function destroy(Kategori $kategori): RedirectResponse
    {
        if ($kategori->reservasis()->exists()) {
            return redirect()->route('kategori.index')
                ->with('error', 'Kategori masih digunakan oleh reservasi dan tidak dapat dihapus.');
        }

        $kategori->delete();

        return redirect()->route('kategori.index')->with('status', 'Kategori berhasil dihapus.');
    }

    /**
     * @return array{nama_kategori: string, deskripsi: ?string}
     */
    private function validated(Request $request, ?Kategori $kategori = null): array
    {
        return $request->validate([
            'nama_kategori' => [
                'required',
                'string',
                'max:100',
                Rule::unique('kategori', 'nama_kategori')->ignore($kategori?->id),
            ],
            'deskripsi' => ['nullable', 'string', 'max:1000'],
        ]);
    }
}
