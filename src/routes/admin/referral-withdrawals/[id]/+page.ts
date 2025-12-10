// src/routes/admin/referral-withdrawals/[id]/+page.ts
import type { PageLoad } from './$types';
import { createApi } from '$lib/api';

export const load: PageLoad = async ({ params, fetch }) => {
    const api = createApi(fetch);
    const detail = await api.getReferralWithdrawalDetail(params.id);

    return { detail };
};
