<script lang="ts">
    type Column = { key: string; label: string; class?: string };

    export let columns: Column[] = [];
    export let items: any[] = [];

    const getValue = (row: unknown, key: string) =>
        String((row as any)?.[key] ?? "");
</script>

<div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-slate-200 text-sm">
        <thead class="bg-slate-50">
            <tr>
                {#each columns as col}
                    <th
                        class={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500 ${col.class ?? ""}`}
                    >
                        {col.label}
                    </th>
                {/each}
            </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 bg-white">
            {#if items.length === 0}
                <tr>
                    <td
                        class="px-3 py-4 text-center text-slate-400 text-xs"
                        colspan={columns.length}
                    >
                        No data
                    </td>
                </tr>
            {:else}
                {#each items as item}
                    <tr class="hover:bg-slate-50">
                        {#each columns as col}
                            <td
                                class={`px-3 py-2 align-top ${col.class ?? ""}`}
                            >
                                <slot name="cell" {item} {col}>
                                    {getValue(item, col.key)}
                                </slot>
                            </td>
                        {/each}
                    </tr>
                {/each}
            {/if}
        </tbody>
    </table>
</div>
