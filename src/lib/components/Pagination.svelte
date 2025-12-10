<script lang="ts">
    export let page = 1;
    export let limit = 20;
    export let total = 0;

    const totalPages = Math.max(1, Math.ceil(total / limit));
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
</script>

{#if totalPages > 1}
    <div class="mt-4 flex items-center justify-between text-sm text-slate-600">
        <div>
            Page {page} / {totalPages} &middot; Total {total}
        </div>
        <div class="inline-flex gap-1">
            {#each pages as p}
                <a
                    href={`?page=${p}&limit=${limit}`}
                    class={`px-2.5 py-1 rounded-md border text-xs ${
                        p === page
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                >
                    {p}
                </a>
            {/each}
        </div>
    </div>
{/if}
