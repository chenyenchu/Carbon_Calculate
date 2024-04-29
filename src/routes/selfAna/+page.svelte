<script>
    import YearAna from "./YearAna.svelte";
    import MonthAna from "./MonthAna.svelte";
    export let menu = 1;
</script>
<!-- Page Header Start -->
<div class="container-fluid page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s" style="background: linear-gradient(rgba(15, 66, 41, .6), rgba(15, 66, 41, .6)), url('/img/selfA2.jpeg') center center no-repeat;
background-size: cover;">
    <div class="container text-center py-5">
        <h1 class="display-3 text-white mb-4 animated slideInDown">自我分析</h1>
        <nav aria-label="breadcrumb animated slideInDown">
            <ol class="breadcrumb justify-content-center mb-0">
                <li class="breadcrumb-item"><a href="/">首頁</a></li>
                <li class="breadcrumb-item"><a href="#">總結</a></li>
                <li class="breadcrumb-item active" aria-current="page">自我分析</li>
            </ol>
        </nav>
    </div>
</div>
<!-- Page Header End -->
<style>
    ul#menu li{
        display : inline;
    }
</style>
<ul id="menu" style="font-size: x-large;">
    <li><a href="/" on:click|preventDefault={() => (menu = 1)}>月</a></li> |
    <li><a href="/" on:click|preventDefault={() => (menu = 2)}>年</a></li>
</ul>
{#if menu === 1}
    <MonthAna />
{:else if menu === 2}
    <YearAna />
{:else}
    <h1>
        Page Not Found
    </h1>
{/if}
<!-- About Start -->

