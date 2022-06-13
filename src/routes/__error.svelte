<script context="module">
    export const load = ({ error, status }) => {
        return {
            props: {
                error, status
            }
        }
    }
</script>
<script>
    import Waves from "$lib/common/Waves.svelte";
    import StarSetting from "$lib/common/StarSetting.svelte";

    export let error
    export let status
</script>
<Waves/>
<h2 class="text-3xl -mt-64 pb-5 text-center">{error.name} {status}</h2>
<StarSetting/>
<div class="container mx-auto">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div class="font-medium leading-7 text-center space-y-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 sm:space-y-0">
            <div class="text-teal-900 bg-teal-200 py-3 px-6 rounded">
                <p>Sorry About This! 👋</p>
            </div>
        </div>
    </div>
</div>
