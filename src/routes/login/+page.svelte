<script lang="ts">
    // Import the functions you need from the SDKs you need
    import { getAuth, signInWithEmailAndPassword, signOut, type User, onAuthStateChanged } from "firebase/auth";
    import { onMount } from "svelte";
    import { firebaseConfig, app, auth }  from "../../lib/firebaseConfig";

    let email = "";
    let password = "";
    export let user: User | null;
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    firebaseConfig;

    /*const login = () => {
        const auth = getAuth(app);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode,errorMessage)
            });

    };
     */
    let message='';
    const login = () => {
        auth;
        signInWithEmailAndPassword(auth, email, password).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode,errorMessage)
            switch (error.code) {
                case "auth/invalid-email":
                    message = "電子郵件格式錯誤，叫你輸郵件，阿你是輸了甚麼?";
                    break;
                case "auth/user-not-found":
                    message = "帳號不存在，你484腦霧?";
                    break;
                case "auth/wrong-password":
                    message = "密碼都可以忘記，那你會不會忘記吃飯?";
                    break;
                case "auth/missing-password":
                    message = "密碼沒輸入是要怎麼登入?";
                    break;
                default:
                    message = "系統錯誤:" + error.code;
            }
            window.alert(message);
        });
    };
    const logout = async () => {
        auth;
        signOut(auth);
    };
    onMount(async () => {
        auth;
        onAuthStateChanged(auth, (newUser) => {
            user = newUser;
        });
    });
</script>

<style>
    /*
    :global(body){
        background-image: url("/img/eco2.jpeg");
        background-size: cover;
    }
    /*slot{
        background-image: url(/nature.jpeg);
        max-width: 100%;
        height: auto;
        background-size: cover;
    }
    .back{
        background-image: url(/nature.jpeg);
        max-width: 100%;
        height: auto;
        background-size: cover;
    }*/
</style>
{#if user}
     <script>location.href="/";</script>
{:else }
    <!-- Quote Start -->
    <div class="h-screen w-full" style=" background-image: url('/nature.jpeg'); margin-bottom: -30px">
    <div class="container-fluid py-5 back">
        <div class="container">
            <div class="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style="max-width: 500px;">
                <h1 class="fs-5 fw-bold text-primary">歡迎回到 記錄我的碳排</h1>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-7">
                    <div class="bg-light rounded p-4 p-sm-5 wow fadeInUp" data-wow-delay="0.1s">
                        <h1 align="center" class="display-5 mb-5">Login</h1>
                        <form>
                            <div class="row g-3">
                                <div class="col-sm-15">
                                    <div class="form-floating">
                                        <input type="email" class="form-control border-0" id="email" placeholder="Your Email" bind:value={email}/>
                                        <label for="email">電子郵件: </label>
                                    </div>
                                </div>
                                <div class="col-sm-15">
                                    <div class="form-floating">
                                        <input type="password" class="form-control border-0" id="password" placeholder="Your Password" bind:value={password}/>
                                        <label for="password">密碼: </label>
                                    </div>
                                </div>

                                <div class="col-12 text-center">
                                    <button class="btn btn-primary py-2 px-5" on:click={login}>登錄</button>



                                </div>
                                <div>
                                    <div align="right" >
                                        <a href="forget_password" >忘記密碼?&emsp;</a>
                                        <a href="register">尚未註冊?</a>

                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    </div>
        <p>&nbsp</p>
        <p>&nbsp</p>
    </div>
    <!-- Quote End -->
{/if}

