<!-- Navbar Start -->
<script lang="ts">
    import {onMount} from "svelte";
    import {signOut, onAuthStateChanged, type User} from "firebase/auth";
    import { firebaseConfig, app, auth }  from "../lib/firebaseConfig";

    firebaseConfig;
    let user: User | null;

    onMount(async () => {
        auth;
        onAuthStateChanged(auth, (newUser) => {
            user = newUser;
        });
    });
    const logout = async () => {
        auth;
        signOut(auth);
        location.href="/";
    };
</script>

<nav class="navbar navbar-expand-lg bg-white navbar-light sticky-top p-0">
        <a href="/" class="navbar-brand d-flex align-items-center px-4 px-lg-5">
            <h1 class="m-0">探碳</h1>
        </a>
        <button type="button" class="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span class="navbar-toggler-icon"></span>
        </button>
        <br>
        <div class="collapse navbar-collapse" id="navbarCollapse">
            <div class="navbar-nav ms-auto p-4 p-lg-0">
                <a href="/" class="nav-item nav-link">首頁</a>
                <a href="food" class="nav-item nav-link">食物</a>
                <div class="nav-item dropdown">
                    <a href="transportation" class="nav-item nav-link dropdown-toggle dropdown-toggle-split"
                       data-bs-toggle="dropdown" >大眾運輸</a>
                    <div class="dropdown-menu bg-light m-0">
                        <a href="transportation" class="dropdown-item">大眾運輸</a>
                        <hr class="dropdown-divider">
                        <a href="hsr" class="dropdown-item">高鐵</a>
                        <a href="train" class="dropdown-item">火車</a>
                        <a href="mrt" class="dropdown-item">捷運</a>
                        <a href="bus" class="dropdown-item">公車</a>
                    </div>
                </div>

                <div class="nav-item dropdown">
                    <a href="personal_transport" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">個人運輸工具</a>
                    <div class="dropdown-menu bg-light m-0">
                        <a href="personal_transport" class="dropdown-item">個人運輸工具</a>
                        <hr class="dropdown-divider">
                        <a href="car" class="dropdown-item ">汽車</a>
                        <a href="motor" class="dropdown-item">機車</a>
                        <a href="bike" class="dropdown-item">腳踏車</a>
                        <a href="walk" class="dropdown-item">走路</a>
                    </div>
                </div>

                <div class="nav-item dropdown">
                    <a href="finalDataPre" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">總結</a>
                    <div class="dropdown-menu bg-light m-0">
                        {#if user}
                        <a href="finalDataPre" class="dropdown-item ">結算數據</a>
                        <a href="selfAna" class="dropdown-item ">自我分析</a>
                        {/if}
                        <a href="fun_tran" class="dropdown-item">猜猜換算</a>
                    </div>
                </div>

                <!--
                <a href="finalDataPre" class="nav-item nav-link">總結</a>
                  -->
                {#if user}
                <div class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown">社群</a>
                    <div class="dropdown-menu bg-light m-0">
                        <a href="add_friends" class="dropdown-item">加入好友</a>
                        <a href="logindays" class="dropdown-item ">登入天數排行</a>
                        <a href="compare_carbons" class="dropdown-item">相對減少量排行</a>
                    </div>
                </div>
                {/if}

            <!--
                <a href="login" class="btn btn-primary py-4 px-lg-4 rounded-0 d-none d-lg-block">登入<i
                        class="fa fa-arrow-right ms-3"></i></a>
            -->
          {#if user}
              <a on:click={logout} class="btn btn-primary py-4 px-lg-4 rounded-0 d-none d-lg-block">登出<i
                      class="fa fa-arrow-right ms-3"></i></a>
          {:else}
              <a href="login" class="btn btn-primary py-4 px-lg-4 rounded-0 d-none d-lg-block">登入<i
                  class="fa fa-arrow-right ms-3"></i></a>
          {/if}
            </div>
       </div>
</nav>
   <!-- Navbar End -->
<slot />

<!-- Footer Start -->
<div class="container-fluid bg-dark text-light footer mt-5 py-4 wow fadeIn" data-wow-delay="0.1s">
    <div class="container py-4">
        <div class="row g-5">
            <div class="col-lg-3 col-md-6">
                <h4 class="text-white mb-4">我們的資訊</h4>
                <p class="mb-2"><i class="fa fa-map-marker-alt me-3"></i>開心市快樂區爆肝路995號</p>
                <p class="mb-2"><i class="fa fa-phone-alt me-3"></i>(66)7708-8555</p>
                <p class="mb-2"><i class="fa fa-envelope me-3"></i>sooo_tired55@mail.com</p>
                <div class="d-flex pt-2">
                    <a class="btn btn-square btn-outline-light rounded-circle me-2" href=""><i class="fab fa-twitter"></i></a>
                    <a class="btn btn-square btn-outline-light rounded-circle me-2" href=""><i class="fab fa-facebook-f"></i></a>
                    <a class="btn btn-square btn-outline-light rounded-circle me-2" href=""><i class="fab fa-youtube"></i></a>
                    <a class="btn btn-square btn-outline-light rounded-circle me-2" href=""><i class="fab fa-linkedin-in"></i></a>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <h4 class="text-white mb-4">服務</h4>
                <a class="btn btn-link" href="food">食物碳排計算</a>
                <a class="btn btn-link" href="transportation">大眾運輸碳排計算</a>
                <a class="btn btn-link" href="">個人運輸工具碳排計算</a>
                <a class="btn btn-link" href="">社群</a>
            </div>
            <div class="col-lg-3 col-md-6">
                <h4 class="text-white mb-4">相對減少的碳排放量</h4>
                <a class="btn btn-link" href="hsr">高鐵</a>
                <a class="btn btn-link" href="train">火車</a>
                <a class="btn btn-link" href="mrt">捷運</a>
                <a class="btn btn-link" href="bus">公車</a>
                <a class="btn btn-link" href="bike">腳踏車</a>
                <a class="btn btn-link" href="walk">走路</a>
            </div>
            <div class="col-lg-3 col-md-6">
                <h4 class="text-white mb-4">還沒註冊嗎? <p>給我趕快去註冊!</p></h4>
                <div class="position-relative w-100">
                    <button type="button" class="btn btn-primary py-2 position-absolute center" onclick="location.href='register'">註冊</button>
                </div>
                <p>&nbsp;</p><p>&nbsp;</p>
                {#if (user)}
                    <h4 class="text-white mb-4">要登出嗎? <p>按下面登出!</p></h4>
                    <div class="position-relative w-100">
                        <button type="button" class="btn btn-primary py-2 position-absolute center" on:click={logout}>登出</button>
                    </div>
                    {:else }
                    <h4 class="text-white mb-4">還沒登入嗎? <p>給我趕快去登入!</p></h4>
                    <div class="position-relative w-100">
                        <button type="button" class="btn btn-primary py-2 position-absolute center" onclick="location.href='login'">登入</button>
                    </div>
                    {/if}

            </div>
        </div>
    </div>
</div>
<!-- Footer End -->


<!-- Copyright Start -->
<div class="container-fluid copyright py-1">
    <div class="container">
        <div class="row">
            <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
                &copy; <a class="border-bottom" href="/">紀錄我的碳排</a>, All Right Reserved.
            </div>
            <div class="col-md-6 text-center text-md-end">
                <!--/*** This template is free as long as you keep the footer author’s credit link/attribution link/backlink. If you'd like to use the template without the footer author’s credit link/attribution link/backlink, you can purchase the Credit Removal License from "https://htmlcodex.com/credit-removal". Thank you for your support. ***/-->
                Designed By <a class="border-bottom" href="https://htmlcodex.com">HTML Codex</a> Distributed By <a href="https://themewagon.com">ThemeWagon</a>
            </div>
        </div>
    </div>
</div>
<!-- Copyright End -->


<!-- Back to Top -->
<a href="#" class="btn btn-lg btn-primary btn-lg-square rounded-circle back-to-top"><i class="bi bi-arrow-up"></i></a>