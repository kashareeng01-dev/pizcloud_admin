<script lang="ts">
    import AdminLayout from "$lib/components/AdminLayout.svelte";
    export let data;
</script>

<AdminLayout title="Referral Program" me={data.me}>
    <slot />
</AdminLayout>
