// src/routes/admin/+layout.ts
import type { LayoutLoad } from './$types';
import { createApi } from '$lib/api';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

export const ssr = false;

export const load: LayoutLoad = async ({ fetch }) => {
    const api = createApi(fetch);

    try {
        const me = await api.getAdminMe();
        if (!me.isAdmin && browser) {
            goto('/login');
        }
        return { me };
    } catch (e) {
        if (browser) {
            goto('/login');
        }
        return { me: null };
    }
};
