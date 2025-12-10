<script lang="ts">
    import { createApi } from "$lib/api";
    import { goto } from "$app/navigation";

    export let title: string = "Admin";
    export let me: { email: string } | null = null;

    const api = createApi(fetch);

    let loggingOut = false;

    async function handleLogout() {
        loggingOut = true;
        try {
            await api.adminLogout();
        } catch (e) {
            console.error("Logout failed", e);
        } finally {
            loggingOut = false;
            goto("/login");
        }
    }
</script>

<div class="min-h-screen flex bg-slate-100">
    <aside class="w-64 bg-slate-900 text-slate-100 flex flex-col">
        <div class="px-6 py-4 text-lg font-semibold border-b border-slate-700">
            Admin Panel
        </div>
        <nav class="flex-1 px-4 py-4 space-y-2 text-sm">
            <a
                href="/admin/referrals"
                class="block rounded-lg px-3 py-2 hover:bg-slate-800"
            >
                Referral Program
            </a>
            <a
                href="/admin/referral-withdrawals"
                class="block rounded-lg px-3 py-2 hover:bg-slate-800"
            >
                Referral Withdrawals
            </a>
        </nav>
        <div
            class="px-4 py-4 border-t border-slate-700 text-xs text-slate-400 space-y-1"
        >
            {#if me}
                <div class="truncate">
                    Logged in as <span class="font-medium">{me.email}</span>
                </div>
            {/if}
            <div>&copy; {new Date().getFullYear()}</div>
        </div>
    </aside>

    <main class="flex-1 flex flex-col">
        <header
            class="px-8 py-4 border-b bg-white flex items-center justify-between"
        >
            <h1 class="text-xl font-semibold text-slate-800">{title}</h1>

            {#if me}
                <div class="flex items-center gap-3 text-sm">
                    <span class="text-slate-600 truncate max-w-[200px]">
                        {me.email}
                    </span>
                    <button
                        type="button"
                        on:click={handleLogout}
                        class="px-3 py-1.5 rounded-md border border-slate-300 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-60"
                        disabled={loggingOut}
                    >
                        {#if loggingOut}
                            Logging out...
                        {:else}
                            Logout
                        {/if}
                    </button>
                </div>
            {/if}
        </header>
        <section class="flex-1 px-8 py-6">
            <slot />
        </section>
    </main>
</div>
