<?php

namespace Modules\Buku\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Buku\Http\Requests\SaveBukuRequest;
use Modules\Buku\Models\Buku;

class BukuController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search'));
        $bukus = Buku::query()
            ->when($search !== '', fn ($query) => $query->where(function ($query) use ($search) {
                $query->where('judul', 'like', "%{$search}%")
                    ->orWhere('penulis', 'like', "%{$search}%")
                    ->orWhere('penerbit', 'like', "%{$search}%");
            }))
            ->orderBy('judul')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Buku/index', [
            'bukus' => $bukus,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Buku/form', [
            'buku' => null,
            'action' => route('buku.store'),
            'method' => 'post',
        ]);
    }

    public function store(SaveBukuRequest $request): RedirectResponse
    {
        Buku::create($request->validated());

        return redirect()->route('buku.index')->with('success', 'Buku berhasil ditambahkan.');
    }

    public function edit(Buku $buku): Response
    {
        return Inertia::render('Buku/form', [
            'buku' => $buku,
            'action' => route('buku.update', $buku),
            'method' => 'put',
        ]);
    }

    public function update(SaveBukuRequest $request, Buku $buku): RedirectResponse
    {
        $buku->update($request->validated());

        return redirect()->route('buku.index')->with('success', 'Buku berhasil diperbarui.');
    }

    public function destroy(Buku $buku): RedirectResponse
    {
        $buku->delete();

        return redirect()->route('buku.index')->with('success', 'Buku berhasil dihapus.');
    }
}
