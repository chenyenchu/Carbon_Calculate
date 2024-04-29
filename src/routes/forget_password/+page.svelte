<script lang="ts">
    // Import the functions you need from the SDKs you need
    import {sendPasswordResetEmail} from "firebase/auth";
    import { auth }  from "../../lib/firebaseConfig";

    let email = "";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    auth.useDeviceLanguage();

    let message='';

    const forgetP = async () => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log('PasswordFunction Reset Email Sent Successfully!');
                window.alert('重設密碼郵件成功傳送，請查收');

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                switch (error.code) {
                    case "auth/missing-email":
                        message = "你沒輸入email我要怎麼送郵件?";
                        break;
                    case "auth/user-not-found":
                        message = "帳號不存在，你484腦霧?";
                        break;
                    default:
                        message = "系統錯誤:" + error.code;
                }
                    window.alert(message);
            });
    }
    async function turnPage() {
        location.href = "/";
    }
</script>

    <div class="h-screen w-full" >
        <div class="container-fluid py-5 back" style=" background-image: url('/nature.jpeg'); margin-bottom: -30px;">
            <div class="container">
                <div class="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style="max-width: 500px;">
                    <h1 class="fs-5 fw-bold text-primary">歡迎回到 記錄我的碳排</h1>
                </div>
                <div class="row justify-content-center" style="vertical-align: center">
                    <div class="col-lg-7">
                        <div class="bg-light rounded p-4 p-sm-5 wow fadeInUp" data-wow-delay="0.1s">
                            <h1 align="center" class="display6 mb-6">忘記密碼</h1>
                            <div class="fs-8 text-primary" align="center" style="line-height: 40px">輸入所註冊的電子郵件，以發送重設密碼連結</div>
                            <p style="line-height: 0px">&nbsp;</p>
                            <form >
                                <div class="row g-3" >
                                    <div class="col-sm-15">
                                        <div class="form-floating" >
                                            <input type="email" class="form-control border-0" id="email" placeholder="Your Email" bind:value={email}/>
                                            <label for="email">電子郵件: </label>
                                        </div>
                                    </div>
                                    <div class="col-15 text-center" style="line-height: 50px">
                                        <button class="btn btn-primary py-2 px-5" on:click={forgetP}>送出</button>
                                    </div>
                                    <div>
                                        <div align="right" style="line-height: 15px">
                                            <a href="login">登入頁面</a>

                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <p>&nbsp</p>
            <p>&nbsp</p>
            <p>&nbsp</p>
        </div>
    </div>


