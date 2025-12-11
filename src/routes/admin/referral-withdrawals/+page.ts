// src/routes/admin/referral-withdrawals/+page.ts
import type { PageLoad } from './$types';
import { createApi } from '$lib/api';

export const load: PageLoad = async ({ url, fetch }) => {
    const api = createApi(fetch);

    const rawPage = Number(url.searchParams.get('page') ?? '1');
    const rawLimit = Number(url.searchParams.get('limit') ?? '20');
    const search = url.searchParams.get('search') ?? undefined;
    const statusParam = url.searchParams.get('status') ?? 'all';

    const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
    const limit =
        Number.isFinite(rawLimit) && rawLimit > 0 && rawLimit <= 200
            ? rawLimit
            : 20;

    const withdrawals = await api.getAdminWithdrawals({
        page,
        limit,
        status: statusParam === 'all' ? undefined : statusParam,
        search,
    });

    return {
        withdrawals,
        page,
        limit,
        statusParam, 
        search,
    };
};
