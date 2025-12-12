// src/lib/api.ts
import { PUBLIC_PIZCLOUD_SERVER_API_URL } from '$env/static/public';
import type {
    AdminOverviewResponse,
    AdminReferrerDetailResponse,
    AdminMe,
    ReferralWithdrawalAdminListResponse,
    ReferralWithdrawalDetailResponse
} from './types';

export function createApi(fetchFn: typeof fetch) {
    const base =
        (PUBLIC_PIZCLOUD_SERVER_API_URL || '').replace(/\/+$/, '') || '';

    async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
        const url = `${base}${path}`;
        const res = await fetchFn(url, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(init.headers || {})
            },
            ...init
        });

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(text || `API error (${res.status})`);
        }

        return (await res.json()) as T;
    }

    return {
        // ===== AUTH ADMIN =====
        adminLogin(payload: { email: string; password: string }) {
            return request<AdminMe>('/auth/admin/login', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        },

        adminLogout() {
            return request<{ success: boolean }>('/auth/admin/logout', {
                method: 'POST'
            });
        },

        getAdminMe() {
            return request<AdminMe>('/auth/admin/me');
        },

        // ===== REFERRAL ADMIN =====
        getOverview(params: { page?: number; limit?: number; search?: string }) {
            const q = new URLSearchParams();
            if (params.page) q.set('page', String(params.page));
            if (params.limit) q.set('limit', String(params.limit));
            if (params.search) q.set('search', params.search);

            const qs = q.toString();
            return request<AdminOverviewResponse>(
                `/admin/referral/overview${qs ? `?${qs}` : ''}`
            );
        },

        getReferrerDetail(id: string) {
            return request<AdminReferrerDetailResponse>(
                `/admin/referral/referrers/${id}`
            );
        },

        createManualCommission(payload: {
            referrerId: string;
            refereeId?: string;
            amount: number;
            commissionMonth: string;
            note?: string;
            status?: 'pending' | 'paid' | 'cancelled';
        }) {
            return request('/admin/referral/commissions/manual', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        },

        updateManualCommission(
            id: string,
            payload: {
                amount?: number;
                note?: string;
                status?: 'pending' | 'paid' | 'cancelled';
            }
        ) {
            return request(`/admin/referral/commissions/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });
        },

        deleteManualCommission(id: string) {
            return request(`/admin/referral/commissions/${id}`, {
                method: 'DELETE'
            });
        },

        getAdminWithdrawals(params: {
            page?: number;
            limit?: number;
            status?: string;
            search?: string;
        }) {
            const q = new URLSearchParams();
            if (params.page) q.set('page', String(params.page));
            if (params.limit) q.set('limit', String(params.limit));
            if (params.status && params.status !== 'all') q.set('status', params.status);
            if (params.search) q.set('search', params.search);

            const qs = q.toString();
            return request<ReferralWithdrawalAdminListResponse>(
                `/admin/referral/withdrawals${qs ? `?${qs}` : ''}`
            );
        },

        geAdminWithdrawalDetail(id: string) {
            return request<ReferralWithdrawalDetailResponse>(
                `/admin/referral/withdrawals/${id}`
            );
        },

        updateReferralWithdrawalStatus(
            id: string,
            payload: {
                status: 'pending' | 'approved' | 'rejected' | 'paid';
                adminNote?: string;
            }
        ) {
            return request<ReferralWithdrawalDetailResponse>(
                `/admin/referral/withdrawals/${id}`,
                {
                    method: 'PATCH',
                    body: JSON.stringify(payload)
                }
            );
        }
    };
}
