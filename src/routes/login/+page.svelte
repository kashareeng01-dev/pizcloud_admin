<script lang="ts">
    import { createApi } from "$lib/api";
    import { goto } from "$app/navigation";

    let email = "";
    let password = "";
    let loading = false;
    let error = "";

    const api = createApi(fetch);

    async function handleLogin(event: SubmitEvent) {
        event.preventDefault();
        loading = true;
        error = "";

        try {
            await api.adminLogin({ email, password });
            console.log('OK')
            await goto("/admin/referrals");
        } catch (err: any) {
            error = err.message || "Login failed";
        } finally {
            loading = false;
        }
    }
</script>

<div class="min-h-screen flex items-center justify-center bg-slate-100 px-4">
    <div
        class="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-5"
    >
        <h1 class="text-xl font-semibold text-slate-900">Admin Login</h1>

        {#if error}
            <div
                class="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2"
            >
                {error}
            </div>
        {/if}

        <form class="space-y-4" on:submit|preventDefault={handleLogin}>
            <div class="space-y-1">
                <label
                    for="email"
                    class="text-xs font-medium text-slate-700"
                    >Email</label
                >
                <input
                    id="email"
                    class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                    type="email"
                    required
                    bind:value={email}
                />
            </div>

            <div class="space-y-1">
                <label
                    for="password"
                    class="text-xs font-medium text-slate-700"
                    >Password</label
                >
                <input
                    id="password"
                    class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                    type="password"
                    required
                    bind:value={password}
                />
            </div>

            <button
                type="submit"
                class="w-full px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium disabled:opacity-60"
                disabled={loading}
            >
                {#if loading}
                    Logging in...
                {:else}
                    Login
                {/if}
            </button>
        </form>
    </div>
</div>
