<script lang="ts">
    import AdminLayout from "$lib/components/AdminLayout.svelte";
    export let data;
</script>

<AdminLayout title="Piz Cloud" me={data.me}>
    <slot />
</AdminLayout>
