<script lang="ts">
    export let title: string | undefined = undefined;
</script>

<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-5">
    {#if title}
        <div class="mb-3 flex items-center justify-between gap-2">
            <h2 class="text-sm font-semibold text-slate-700">{title}</h2>
            <slot name="actions" />
        </div>
    {/if}
    <slot />
</div>
