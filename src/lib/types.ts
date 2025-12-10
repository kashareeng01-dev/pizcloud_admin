// src/lib/types.ts
export interface ReferrerSummary {
    _id: string;
    email: string;
    name?: string;
    referralCode?: string;
    totalCommissionUsd: number;
    totalReferees: number;
}

export interface TopReferrerByReferees {
    email: string;
    name?: string;
    referralCode?: string;
    totalReferees: number;
}

export interface TopReferrerByCommission {
    referrerId: string;
    email: string;
    name?: string;
    referralCode?: string;
    totalCommissionUsd: number;
}

export interface AdminOverviewResponse {
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
    totalReferrers: number;
    list: ReferrerSummary[];
    topByReferees: TopReferrerByReferees[];
    topByCommission: TopReferrerByCommission[];
}

export interface UserLite {
    _id: string;
    email: string;
    name?: string;
    createdAt?: string;
    referralCode?: string | null;
}

export interface MonthlyCommission {
    commissionMonth: string; // 'YYYY-MM'
    total: number;
}

export interface Commission {
    _id: string;
    referrer: string;
    referee?: UserLite | string;
    payment?: {
        _id: string;
        planId?: string | null;
        amount: number;
        finalAmount: number;
        status: string;
        billingPeriod?: string;
    } | null;
    commissionAmount: number;
    commissionMonth: string;
    status: 'pending' | 'paid' | 'cancelled';
    isManual?: boolean;
    note?: string | null;
    createdAt: string;
}

export interface AdminReferrerDetailResponse {
    referrer: UserLite;
    referees: UserLite[];
    monthlyCommissions: MonthlyCommission[];
    commissions: Commission[];
}

export interface AdminMe {
    sub: string;
    email: string;
    isAdmin: boolean;
}

export type ReferralWithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'paid';

export interface ReferralWithdrawalAdminItem {
    _id: string;
    email: string;
    amount: number;
    currency: string;
    status: ReferralWithdrawalStatus;
    method: 'bank' | 'paypal';
    note?: string;
    adminNote?: string;
    bankName?: string;
    bankAccountNumber?: string;
    bankAccountHolderName?: string;
    paypalEmail?: string;
    paypalFullName?: string;
    createdAt?: string;
    updatedAt?: string;
    processedAt?: string;
}

// New: response list
export interface ReferralWithdrawalAdminListResponse { // New
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
    items: ReferralWithdrawalAdminItem[];
    summary: {
        totalPending: number;
        totalApproved: number;
        totalRejected: number;
        totalPaid: number;
    };
}

export interface ReferralBalanceSummary {
    referralCode: string | null;
    totalReferredUsers: number;
    totalCommission: number;
    totalCommissionPaid: number;
    monthlyStats: MonthlyCommission[];
    currency: string;
    referrer?: any;

    totalRequestedWithdrawal: number;
    totalPaidWithdrawal: number;
    totalRejectedWithdrawal: number;
    pendingWithdrawalAmount: number;
    availableBalance: number;
}

export interface ReferralWithdrawalDetailResponse {
    withdrawal: ReferralWithdrawalAdminItem;
    summary: ReferralBalanceSummary;
}