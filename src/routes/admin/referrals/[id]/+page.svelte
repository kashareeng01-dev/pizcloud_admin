<script lang="ts">
    import type { PageData } from "./$types";
    import Card from "$lib/components/Card.svelte";
    import Table from "$lib/components/Table.svelte";
    import { createApi } from "$lib/api";
    import type { Commission } from "$lib/types";

    export let data: PageData;
    let detail = data.detail;

    const api = createApi(fetch);

    // Form manual commission
    let amount = "";
    let note = "";
    let refereeId = "";
    let commissionMonth = "";
    let status: "pending" | "paid" | "cancelled" = "pending";

    let loadingManual = false;
    let errorManual = "";
    let successManual = "";

    const referrerId = detail.referrer._id;

    function formatMonthText(ym: unknown) {
        const str = typeof ym === "string" ? ym : String(ym ?? "");
        if (!str) return "-";
        const [y, m] = str.split("-").map((x) => Number(x));
        const d = new Date(y, m - 1, 1);
        return d.toLocaleDateString(undefined, {
            month: "short",
            year: "numeric",
        });
    }

    function formatDateTime(value: unknown) {
        if (!value) return "-";
        const date = new Date(value as any);
        return isNaN(date.getTime()) ? "-" : date.toLocaleString();
    }

    async function handleCreateManual(e: SubmitEvent) {
        e.preventDefault();
        loadingManual = true;
        errorManual = "";
        successManual = "";

        try {
            const payload = {
                referrerId,
                amount: Number(amount),
                commissionMonth,
                note: note || undefined,
                refereeId: refereeId || undefined,
                status,
            };

            const created = (await api.createManualCommission(
                payload,
            )) as Commission;
            detail = {
                ...detail,
                commissions: [created, ...detail.commissions],
            };
            successManual = "Manual commission created";
            amount = "";
            note = "";
            commissionMonth = "";
            refereeId = "";
            status = "pending";
        } catch (err: any) {
            errorManual = err.message || "Error creating manual commission";
        } finally {
            loadingManual = false;
        }
    }

    async function deleteCommission(id: string) {
        if (!confirm("Delete this manual commission?")) return;
        try {
            await api.deleteManualCommission(id);
            detail = {
                ...detail,
                commissions: detail.commissions.filter((c) => c._id !== id),
            };
        } catch {
            alert("Failed to delete commission");
        }
    }
</script>

<div class="space-y-6">
    <a
        href="/admin/referrals"
        class="inline-flex items-center text-xs text-slate-500 hover:text-slate-700"
    >
        ← Back to overview
    </a>

    <Card>
        <div
            class="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
        >
            <div>
                <div class="text-xs text-slate-500">Referrer</div>
                <div class="text-lg font-semibold text-slate-900">
                    {detail.referrer.name || detail.referrer.email}
                </div>
                <div class="text-xs text-slate-500">
                    {detail.referrer.email}
                </div>
            </div>

            <div class="flex flex-col items-start md:items-end gap-1 text-sm">
                <div>
                    <span class="text-slate-500 mr-2">Referral Code:</span>
                    <span
                        class="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded"
                    >
                        {detail.referrer.referralCode || "-"}
                    </span>
                </div>
                <div>
                    <span class="text-slate-500 mr-2">Total referees:</span>
                    <span class="font-semibold">{detail.referees.length}</span>
                </div>
            </div>
        </div>
    </Card>

    <Card title="Monthly Commission">
        {#if detail.monthlyCommissions.length === 0}
            <p class="text-xs text-slate-400 mt-2">No commission data.</p>
        {:else}
            <div class="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                {#each detail.monthlyCommissions as m}
                    <div
                        class="bg-slate-50 border border-slate-200 rounded-lg p-3"
                    >
                        <div class="text-xs text-slate-500">
                            {formatMonthText(m.commissionMonth)}
                        </div>
                        <div class="text-lg font-semibold text-emerald-700">
                            ${m.total.toFixed(2)}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </Card>

    <Card title="Referees">
        <Table
            items={detail.referees}
            columns={[
                { key: "user", label: "User", class: "w-64" },
                { key: "createdAt", label: "Joined at" },
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
                {:else if col.key === "createdAt"}
                    <span class="text-xs text-slate-600">
                        {formatDateTime(item.createdAt)}
                    </span>
                {/if}
            </svelte:fragment>
        </Table>
    </Card>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Form manual -->
        <Card title="Manual Commission">
            <form
                class="space-y-3 text-sm"
                on:submit|preventDefault={handleCreateManual}
            >
                {#if errorManual}
                    <div
                        class="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-2 py-1.5"
                    >
                        {errorManual}
                    </div>
                {/if}
                {#if successManual}
                    <div
                        class="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-1.5"
                    >
                        {successManual}
                    </div>
                {/if}

                <div>
                    <label
                        for="amount"
                        class="block text-xs text-slate-600 mb-1"
                        >Amount (USD)</label
                    >
                    <input
                        id="amount"
                        required
                        min="0"
                        step="0.01"
                        class="w-full px-3 py-2 rounded-md border border-slate-300 text-sm"
                        type="number"
                        bind:value={amount}
                    />
                </div>

                <div>
                    <label
                        for="commissionMonth"
                        class="block text-xs text-slate-600 mb-1"
                        >Commission Month</label
                    >
                    <input
                        id="commissionMonth"
                        required
                        class="w-full px-3 py-2 rounded-md border border-slate-300 text-sm"
                        type="month"
                        bind:value={commissionMonth}
                    />
                </div>

                <div>
                    <label
                        for="referee"
                        class="block text-xs text-slate-600 mb-1"
                        >Referee (optional)</label
                    >
                    <select
                        id="referee"
                        class="w-full px-3 py-2 rounded-md border border-slate-300 text-sm"
                        bind:value={refereeId}
                    >
                        <option value="">-- None --</option>
                        {#each detail.referees as r}
                            <option value={r._id}>
                                {r.name || r.email} ({r.email})
                            </option>
                        {/each}
                    </select>
                </div>

                <div>
                    <label
                        for="status"
                        class="block text-xs text-slate-600 mb-1"
                        >Status</label
                    >
                    <select
                        id="status"
                        class="w-full px-3 py-2 rounded-md border border-slate-300 text-sm"
                        bind:value={status}
                    >
                        <option value="pending">pending</option>
                        <option value="paid">paid</option>
                        <option value="cancelled">cancelled</option>
                    </select>
                </div>

                <div>
                    <label
                        for="note"
                        class="block text-xs text-slate-600 mb-1"
                        >Note</label
                    >
                    <textarea
                        id="note"
                        class="w-full px-3 py-2 rounded-md border border-slate-300 text-sm resize-none"
                        rows="3"
                        bind:value={note}
                    />
                </div>

                <button
                    class="w-full px-3 py-2 rounded-md bg-slate-900 text-white text-sm font-medium disabled:opacity-60"
                    type="submit"
                    disabled={loadingManual}
                >
                    {#if loadingManual}
                        Saving...
                    {:else}
                        Add manual commission
                    {/if}
                </button>
            </form>
        </Card>

        <!-- List commissions -->
        <div class="md:col-span-2">
            <Card title="Last 100 Commissions">
                <Table
                    items={detail.commissions}
                    columns={[
                        { key: "commissionMonth", label: "Month" },
                        { key: "commissionAmount", label: "Amount (USD)" },
                        { key: "status", label: "Status" },
                        { key: "source", label: "Source" },
                        { key: "note", label: "Note" },
                        { key: "actions", label: "" },
                    ]}
                >
                    <svelte:fragment slot="cell" let:item let:col>
                        {#if col.key === "commissionMonth"}
                            <span class="text-xs text-slate-600">
                                {formatMonthText(item.commissionMonth)}
                            </span>
                        {:else if col.key === "commissionAmount"}
                            <span class="text-sm font-semibold text-emerald-700">
                                ${(item.commissionAmount ?? 0).toFixed(2)}
                            </span>
                        {:else if col.key === "status"}
                            <span class="text-xs uppercase">{item.status}</span>
                        {:else if col.key === "source"}
                            <span
                                class={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                                    item.isManual
                                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                                        : "bg-slate-50 text-slate-600 border border-slate-200"
                                }`}
                            >
                                {item.isManual ? "Manual" : "Auto"}
                            </span>
                        {:else if col.key === "note"}
                            <span class="text-xs text-slate-600"
                                >{item.note || "-"}</span
                            >
                        {:else if col.key === "actions"}
                            {#if item.isManual}
                                <button
                                    class="text-xs text-red-600 hover:text-red-700 underline"
                                    type="button"
                                    on:click={() => deleteCommission(item._id)}
                                >
                                    Delete
                                </button>
                            {/if}
                        {/if}
                    </svelte:fragment>
                </Table>
            </Card>
        </div>
    </div>
</div>
