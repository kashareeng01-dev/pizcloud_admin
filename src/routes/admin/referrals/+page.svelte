<script lang="ts">
    import type { PageData } from "./$types";
    import type { ReferrerSummary } from "$lib/types";
    import Card from "$lib/components/Card.svelte";
    import Table from "$lib/components/Table.svelte";
    import Pagination from "$lib/components/Pagination.svelte";

    export let data: PageData;
    const { overview, page, limit, search } = data;

    const items: ReferrerSummary[] = overview.list;
</script>

<div class="space-y-6">
    <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
    >
        <h2 class="text-lg font-semibold text-slate-800">Referral Overview</h2>
        <!-- <form class="flex gap-2" method="GET">
            <input
                class="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                type="text"
                name="search"
                placeholder="Search by email / name..."
                value={search ?? ""}
            />
            <input type="hidden" name="page" value="1" />
            <button
                type="submit"
                class="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
            >
                Search
            </button>
        </form> -->
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Total Referrers">
            <p class="text-2xl font-semibold text-slate-900">
                {overview.totalReferrers}
            </p>
        </Card>

        <Card title="Top by Referees">
            {#if overview.topByReferees.length === 0}
                <p class="text-xs text-slate-400">No data</p>
            {:else}
                <ul class="space-y-1 text-sm">
                    {#each overview.topByReferees as t}
                        <li class="flex items-center justify-between">
                            <span>{t.name || t.email}</span>
                            <span class="text-xs text-slate-500">
                                {t.totalReferees} referees
                            </span>
                        </li>
                    {/each}
                </ul>
            {/if}
        </Card>

        <Card title="Top by Commission">
            {#if overview.topByCommission.length === 0}
                <p class="text-xs text-slate-400">No data</p>
            {:else}
                <ul class="space-y-1 text-sm">
                    {#each overview.topByCommission as t}
                        <li class="flex items-center justify-between">
                            <span>{t.name || t.email}</span>
                            <span
                                class="text-xs text-emerald-600 font-semibold"
                            >
                                ${t.totalCommissionUsd.toFixed(2)}
                            </span>
                        </li>
                    {/each}
                </ul>
            {/if}
        </Card>
    </div>

    <Card title="Referrers">
        <Table
            {items}
            columns={[
                { key: "user", label: "User", class: "w-64" },
                { key: "referralCode", label: "Referral Code" },
                { key: "totalReferees", label: "# Referees" },
                { key: "totalCommissionUsd", label: "Total Commission (USD)" },
                { key: "actions", label: "" },
            ]}
        >
            <svelte:fragment slot="cell" let:item let:col>
                {#if col.key === "user"}
                    <div class="flex flex-col">
                        <span class="text-sm font-medium text-slate-800">
                            {item.name || item.email}
                        </span>
                        <span class="text-xs text-slate-500">{item.email}</span>
                    </div>
                {:else if col.key === "referralCode"}
                    <span
                        class="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded"
                    >
                        {item.referralCode || "-"}
                    </span>
                {:else if col.key === "totalReferees"}
                    <span class="text-sm">{item.totalReferees}</span>
                {:else if col.key === "totalCommissionUsd"}
                    <span class="text-sm text-emerald-700 font-semibold">
                        ${(item.totalCommissionUsd ?? 0).toFixed(2)}
                    </span>
                {:else if col.key === "actions"}
                    <a
                        href={`/admin/referrals/${item._id}`}
                        class="inline-flex items-center text-xs font-medium text-slate-700 hover:text-slate-900 underline"
                    >
                        View detail
                    </a>
                {/if}
            </svelte:fragment>
        </Table>

        <Pagination {page} {limit} total={overview.pagination.total} />
    </Card>
</div>
