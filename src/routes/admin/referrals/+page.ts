// src/routes/admin/referrals/+page.ts
import type { PageLoad } from './$types';
import { createApi } from '$lib/api';

export const load: PageLoad = async ({ url, fetch }) => {
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '20');
    const search = url.searchParams.get('search') ?? undefined;

    const api = createApi(fetch);
    const overview = await api.getOverview({ page, limit, search });

    return { overview, page, limit, search };
};
