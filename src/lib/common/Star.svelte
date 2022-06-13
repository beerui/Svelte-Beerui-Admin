<div class="text-center flex items-end justify-center mb-5">
    <div class="star-mask-1 mask mask-star-2 bg-green-500 p-2 scale-65"></div>
    <div class="star-mask-2 mask mask-star-2 bg-green-500 p-2"></div>
    <div class="star-mask-3 mask mask-star-2 bg-green-500 p-2 scale-65"></div>
</div>
<style>
    .star-mask-1 {animation: star infinite 2.3s;}
    .star-mask-2 {animation: starMain infinite 1.6s;}
    .star-mask-3 {animation: star infinite 2.4s;}
    @keyframes star {
        0% {transform: translateY(5px);}
        50% {transform: translateY(0);}
        100% {transform: translateY(5px);}
    }
    @keyframes starMain {
        0% {transform: translateY(2px);}
        50% {transform: translateY(0);}
        100% {transform: translateY(2px);}
    }
</style>
