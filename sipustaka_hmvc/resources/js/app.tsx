import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import type { ResolvedComponent } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

const pages = import.meta.glob<{ default: ResolvedComponent }>('./pages/**/*.tsx');
const modulePages = import.meta.glob<{ default: ResolvedComponent }>('../../Modules/*/resources/js/pages/**/*.tsx');

type SetupOptions = Parameters<
    NonNullable<NonNullable<Parameters<typeof createInertiaApp>[0]>['setup']>
>[0];

createInertiaApp({
    resolve: async (name) => {
        const [module, ...pagePath] = name.split('/');
        const page = pages[`./pages/${name}.tsx`]
            ?? modulePages[`../../Modules/${module}/resources/js/pages/${pagePath.join('/')}.tsx`];
        if (!page) {
            throw new Error(`Unknown Inertia page: ${name}`);
        }

        return (await page()).default;
    },
    setup({ el, App, props }: SetupOptions) {
        if (!el) {
            throw new Error('Inertia root element was not found.');
        }

        createRoot(el).render(<App {...props} />);
    },
    progress: { color: '#315bd6' },
});
