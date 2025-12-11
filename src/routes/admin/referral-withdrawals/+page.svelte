<!-- src/routes/admin/referral-withdrawals/+page.svelte  -->
<script lang="ts">
    import type { PageData } from "./$types";
    import Card from "$lib/components/Card.svelte";
    import Table from "$lib/components/Table.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import type {
        ReferralWithdrawalAdminItem,
        ReferralWithdrawalAdminListResponse,
    } from "$lib/types";

    export let data: PageData;

    let withdrawals: ReferralWithdrawalAdminListResponse = data.withdrawals;
    let page: number = data.page;
    let limit: number = data.limit;
    let statusParam: string | undefined = data.statusParam;
    let search: string | undefined = data.search;
    let items: ReferralWithdrawalAdminItem[] = data.withdrawals.items ?? [];

    $: withdrawals = data.withdrawals;
    $: page = data.page;
    $: limit = data.limit;
    $: statusParam = data.statusParam;
    $: search = data.search;
    $: items = (withdrawals.items ?? []) as ReferralWithdrawalAdminItem[];

    function formatDateTime(value: unknown) {
        if (!value) return "-";
        const date = new Date(value as any);
        if (isNaN(date.getTime())) return "-";
        return date.toLocaleString();
    }

    function formatStatus(status: string) {
        return status.toUpperCase();
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
</script>

<div class="space-y-6">
    <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
    >
        <h2 class="text-lg font-semibold text-slate-800">
            Withdrawal Request Information
        </h2>

        <form
            class="flex flex-col md:flex-row gap-2 items-stretch"
            method="GET"
        >
            <input
                class="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                type="text"
                name="search"
                placeholder="Search by email / note..."
                value={search ?? ""}
            />
            <select
                class="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                name="status"
                value={statusParam ?? "all"}
            >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="paid">Paid</option>
            </select>
            <input type="hidden" name="page" value="1" />
            <button
                type="submit"
                class="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
            >
                Filter
            </button>
        </form>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Pending Amount">
            <p class="text-2xl font-semibold text-amber-700">
                ${withdrawals.summary.totalPending.toFixed(2)}
            </p>
            <p class="text-xs text-slate-500 mt-1">
                pending + waiting approval
            </p>
        </Card>

        <Card title="Approved (Not Paid)">
            <p class="text-2xl font-semibold text-blue-700">
                ${withdrawals.summary.totalApproved.toFixed(2)}
            </p>
            <p class="text-xs text-slate-500 mt-1">
                approved but not marked as paid
            </p>
        </Card>

        <Card title="Total Paid">
            <p class="text-2xl font-semibold text-emerald-700">
                ${withdrawals.summary.totalPaid.toFixed(2)}
            </p>
            <p class="text-xs text-slate-500 mt-1">already paid to users</p>
        </Card>

        <Card title="Total Rejected">
            <p class="text-2xl font-semibold text-red-700">
                ${withdrawals.summary.totalRejected.toFixed(2)}
            </p>
            <p class="text-xs text-slate-500 mt-1">rejected requests</p>
        </Card>
    </div>

    <Card title="Withdrawal Requests">
        <Table
            {items}
            columns={[
                { key: "user", label: "User", class: "w-64" },
                { key: "amount", label: "Amount" },
                { key: "method", label: "Method" },
                { key: "status", label: "Status" },
                { key: "createdAt", label: "Requested at" },
                { key: "processedAt", label: "Processed at" },
                { key: "actions", label: "" },
            ]}
        >
            <svelte:fragment slot="cell" let:item let:col>
                {#if col.key === "user"}
                    <div class="flex flex-col">
                        <span class="text-sm font-medium text-slate-800">
                            {item.email}
                        </span>
                    </div>
                {:else if col.key === "amount"}
                    <span class="text-sm font-semibold text-slate-900">
                        {item.currency}
                        {item.amount.toFixed(2)}
                    </span>
                {:else if col.key === "method"}
                    <span class="text-xs uppercase">
                        {item.method}
                    </span>
                {:else if col.key === "status"}
                    <span
                        class={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${statusClass(
                            item.status,
                        )}`}
                    >
                        {formatStatus(item.status)}
                    </span>
                {:else if col.key === "createdAt"}
                    <span class="text-xs text-slate-600">
                        {formatDateTime(item.createdAt)}
                    </span>
                {:else if col.key === "processedAt"}
                    <span class="text-xs text-slate-600">
                        {formatDateTime(item.processedAt)}
                    </span>
                {:else if col.key === "actions"}
                    <a
                        href={`/admin/referral-withdrawals/${item._id}`}
                        class="inline-flex items-center text-xs font-medium text-slate-700 hover:text-slate-900 underline"
                    >
                        View detail
                    </a>
                {/if}
            </svelte:fragment>
        </Table>

        <Pagination {page} {limit} total={withdrawals.pagination.total} />
    </Card>
</div>
