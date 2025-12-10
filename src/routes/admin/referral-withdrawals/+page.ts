// src/routes/admin/referral-withdrawals/+page.ts
import type { PageLoad } from './$types';
import { createApi } from '$lib/api';

export const load: PageLoad = async ({ url, fetch }) => {
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '20');
    const statusParam = url.searchParams.get('status') ?? 'all';
    const search = url.searchParams.get('search') ?? '';

    const status =
        statusParam === 'all' || !statusParam ? undefined : statusParam;

    const api = createApi(fetch);
    const withdrawals = await api.getReferralWithdrawals({
        page,
        limit,
        status,
        search: search || undefined,
    });

    return { withdrawals, page, limit, statusParam, search };
};
