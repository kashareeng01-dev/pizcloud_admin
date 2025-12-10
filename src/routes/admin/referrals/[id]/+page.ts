// src/routes/admin/referrals/[id]/+page.ts
import type { PageLoad } from './$types';
import { createApi } from '$lib/api';

export const load: PageLoad = async ({ params, fetch }) => {
    const api = createApi(fetch);
    const detail = await api.getReferrerDetail(params.id);

    return { detail };
};
