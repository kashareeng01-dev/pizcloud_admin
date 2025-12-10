<!-- src/routes/admin/referral-withdrawals/[id]/+page.svelte -->
<script lang="ts">
    import type { PageData } from "./$types";
    import Card from "$lib/components/Card.svelte";
    import { createApi } from "$lib/api";
    import type {
        ReferralWithdrawalDetailResponse,
        ReferralWithdrawalStatus,
    } from "$lib/types";

    export let data: PageData;
    let detail: ReferralWithdrawalDetailResponse = data.detail;

    const api = createApi(fetch);

    let status: ReferralWithdrawalStatus = detail.withdrawal.status;
    let adminNote: string = detail.withdrawal.adminNote ?? "";

    let saving = false;
    let errorMsg = "";
    let successMsg = "";

    function formatDateTime(value: unknown) {
        if (!value) return "-";
        const date = new Date(value as any);
        if (isNaN(date.getTime())) return "-";
        return date.toLocaleString();
    }

    function statusClass(status: string) {
        switch (status) {
            case "pending":
                return "bg-amber-50 text-amber-700 border border-amber-200";
            case "approved":
                return "bg-blue-50 text-blue-700 border border-blue-200";
            case "rejected":
                return "bg-red-50 text-red-700 border border-red-200";
            case "paid":
                return "bg-emerald-50 text-emerald-700 border border-emerald-200";
            default:
                return "bg-slate-50 text-slate-600 border border-slate-200";
        }
    }

    async function handleUpdateStatus(e: SubmitEvent) {
        e.preventDefault();
        saving = true;
        errorMsg = "";
        successMsg = "";

        try {
            const updated = (await api.updateReferralWithdrawalStatus(
                detail.withdrawal._id,
                {
                    status,
                    adminNote: adminNote || undefined,
                },
            )) as ReferralWithdrawalDetailResponse;

            detail = updated;
            status = detail.withdrawal.status;
            adminNote = detail.withdrawal.adminNote ?? "";
            successMsg = "Status updated successfully";
        } catch (err: any) {
            errorMsg = err?.message || "Failed to update status";
        } finally {
            saving = false;
        }
    }
</script>

<div class="space-y-6">
    <a
        href="/admin/referral-withdrawals"
        class="inline-flex items-center text-xs text-slate-500 hover:text-slate-700"
    >
        ← Back to withdrawals
    </a>

    <Card>
        <div
            class="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
        >
            <div>
                <div class="text-xs text-slate-500">User</div>
                <div class="text-lg font-semibold text-slate-900">
                    {detail.withdrawal.email}
                </div>
                <div class="text-xs text-slate-500">
                    Requested at: {formatDateTime(detail.withdrawal.createdAt)}
                </div>
                {#if detail.withdrawal.processedAt}
                    <div class="text-xs text-slate-500">
                        Processed at: {formatDateTime(
                            detail.withdrawal.processedAt,
                        )}
                    </div>
                {/if}
            </div>

            <div class="flex flex-col items-start md:items-end gap-1 text-sm">
                <div>
                    <span class="text-slate-500 mr-2">Amount:</span>
                    <span class="font-semibold text-slate-900">
                        {detail.withdrawal.currency}
                        {" "}
                        {detail.withdrawal.amount.toFixed(2)}
                    </span>
                </div>
                <div>
                    <span class="text-slate-500 mr-2">Method:</span>
                    <span class="uppercase text-xs">
                        {detail.withdrawal.method}
                    </span>
                </div>
                <div>
                    <span class="text-slate-500 mr-2">Status:</span>
                    <span
                        class={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${statusClass(
                            detail.withdrawal.status,
                        )}`}
                    >
                        {detail.withdrawal.status.toUpperCase()}
                    </span>
                </div>
            </div>
        </div>
    </Card>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Payout Information">
            {#if detail.withdrawal.method === "bank"}
                <div class="space-y-1 text-sm">
                    <div>
                        <span class="text-slate-500 text-xs">Bank name:</span>
                        <div class="text-slate-800">
                            {detail.withdrawal.bankName || "-"}
                        </div>
                    </div>
                    <div>
                        <span class="text-slate-500 text-xs"
                            >Account number:</span
                        >
                        <div class="text-slate-800">
                            {detail.withdrawal.bankAccountNumber || "-"}
                        </div>
                    </div>
                    <div>
                        <span class="text-slate-500 text-xs"
                            >Account holder:</span
                        >
                        <div class="text-slate-800">
                            {detail.withdrawal.bankAccountHolderName || "-"}
                        </div>
                    </div>
                </div>
            {:else}
                <div class="space-y-1 text-sm">
                    <div>
                        <span class="text-slate-500 text-xs">Paypal email:</span
                        >
                        <div class="text-slate-800">
                            {detail.withdrawal.paypalEmail || "-"}
                        </div>
                    </div>
                    <div>
                        <span class="text-slate-500 text-xs">Paypal name:</span>
                        <div class="text-slate-800">
                            {detail.withdrawal.paypalFullName || "-"}
                        </div>
                    </div>
                </div>
            {/if}

            <div class="mt-4 space-y-1 text-sm">
                <div>
                    <span class="text-slate-500 text-xs">User note:</span>
                    <div class="text-slate-800 whitespace-pre-wrap">
                        {detail.withdrawal.note || "-"}
                    </div>
                </div>
                <div>
                    <span class="text-slate-500 text-xs">Admin note:</span>
                    <div class="text-slate-800 whitespace-pre-wrap">
                        {detail.withdrawal.adminNote || "-"}
                    </div>
                </div>
            </div>
        </Card>

        <Card title="Referral Balance">
            <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                    <span class="text-slate-500 text-xs">
                        Total lifetime commission:
                    </span>
                    <span class="font-semibold text-emerald-700">
                        {detail.summary.currency}
                        {" "}
                        {detail.summary.totalCommission.toFixed(2)}
                    </span>
                </div>

                <div class="flex justify-between">
                    <span class="text-slate-500 text-xs">
                        Total paid commission (withdrawable base):
                    </span>
                    <span class="font-semibold text-emerald-700">
                        {detail.summary.currency}
                        {" "}
                        {(detail.summary.totalCommissionPaid ?? 0).toFixed(2)}
                    </span>
                </div>

                <div class="flex justify-between">
                    <span class="text-slate-500 text-xs">
                        Total requested (non-rejected):
                    </span>
                    <span class="font-semibold text-slate-900">
                        {detail.summary.currency}
                        {" "}
                        {detail.summary.totalRequestedWithdrawal.toFixed(2)}
                    </span>
                </div>

                <div class="flex justify-between">
                    <span class="text-slate-500 text-xs">Total paid out:</span>
                    <span class="font-semibold text-slate-900">
                        {detail.summary.currency}
                        {" "}
                        {detail.summary.totalPaidWithdrawal.toFixed(2)}
                    </span>
                </div>

                <div class="flex justify-between">
                    <span class="text-slate-500 text-xs">Pending amount:</span>
                    <span class="font-semibold text-amber-700">
                        {detail.summary.currency}
                        {" "}
                        {detail.summary.pendingWithdrawalAmount.toFixed(2)}
                    </span>
                </div>

                <div
                    class="flex justify-between border-t border-dashed pt-2 mt-2"
                >
                    <span class="text-slate-500 text-xs"
                        >Available balance:</span
                    >
                    <span class="font-semibold text-emerald-700">
                        {detail.summary.currency}
                        {" "}
                        {detail.summary.availableBalance.toFixed(2)}
                    </span>
                </div>
            </div>
        </Card>
    </div>

    <Card title="Update Status">
        <form
            class="space-y-3 text-sm"
            on:submit|preventDefault={handleUpdateStatus}
        >
            {#if errorMsg}
                <div
                    class="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-2 py-1.5"
                >
                    {errorMsg}
                </div>
            {/if}
            {#if successMsg}
                <div
                    class="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-1.5"
                >
                    {successMsg}
                </div>
            {/if}

            <div>
                <label for="status" class="block text-xs text-slate-600 mb-1"
                    >Status</label
                >
                <select
                    id="status"
                    class="w-full px-3 py-2 rounded-md border border-slate-300 text-sm"
                    bind:value={status}
                >
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                    <option value="rejected">rejected</option>
                    <option value="paid">paid</option>
                </select>
            </div>

            <div>
                <label for="adminNote" class="block text-xs text-slate-600 mb-1"
                    >Admin note</label
                >
                <textarea
                    id="adminNote"
                    class="w-full px-3 py-2 rounded-md border border-slate-300 text-sm resize-none"
                    rows="4"
                    bind:value={adminNote}
                />
            </div>

            <button
                class="px-3 py-2 rounded-md bg-slate-900 text-white text-sm font-medium disabled:opacity-60"
                type="submit"
                disabled={saving}
            >
                {#if saving}
                    Saving...
                {:else}
                    Save changes
                {/if}
            </button>
        </form>
    </Card>
</div>
