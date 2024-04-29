<script>
    import { setDoc, doc} from "firebase/firestore"
    import { createUserWithEmailAndPassword } from "firebase/auth";
    import { firebaseConfig, auth, db }  from "$lib/firebaseConfig.js";

    let name = "";
    let acc = "";
    let email = "";
    let password = "";
    let gas = "";
    let user = "";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    firebaseConfig;

    // Initialize Firebase

    let message = "";//清除前次訊息

    const signup = () => {
        auth;
        createUserWithEmailAndPassword(auth,email,password)
            .then((userCredential) => {
                const user = userCredential.user;
                async function addUserData(callB1) {
                    const userRef = await setDoc(doc(db,"users",user.uid),
                        {
                            name: name,
                            acc: acc,
                            email: email,
                            gas: gas,
                            userId: user.uid
                        });
                    callB1();
                }
                async function turnPage() {
                    location.href = "/";
                }
                addUserData(turnPage); //為確保執行順序(先addUserData再轉址)，寫callback fuction確保順序，我試過ㄌ，如果不這樣寫資料寫不進去
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                switch (error.code) {
                    case "auth/email-already-in-use":
                        message = "這個電子信箱註冊過了，給我換另一個!";
                        break;
                    case "auth/weak-password":
                        message = "密碼沒超過6個字元，4想被盜膩?";
                        break;
                    case "auth/invalid-email":
                        message = "電子郵件格式錯誤，叫你輸郵件，阿你是輸了甚麼?";
                        break;
                    case "auth/missing-password":
                        message = "沒輸入密碼是要怎麼幫你註冊?";
                        break;
                    default:
                        message = "系統錯誤:" + error.code;
                }
                window.alert(message);
                console.log(errorCode,errorMessage);
                console.log(message);
        });
    };

    /*
     const login = () => {
        const auth = getAuth(app);
        signInWithEmailAndPassword(auth, email, password).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode,errorMessage)
        });
    };
     */
</script>
<style>
    /*
    :global(body){
        background-image: url("/img/eco2.jpeg");
        background-size: cover;
    }
    /*
    .back{
        background-image: url(/nature.jpeg);
        max-width:100%; 不使用width:100% 是因避免圖片解析度不好，隨父元素被放大時會糊掉
        height:auto;
        background-repeat:no-repeat;
        background-attachment: scroll;
    }
    */
</style>

<!-- Quote Start -->
<div class="h-screen w-full" style="background-image: url('/nature.jpeg'); ">
<div class="container-fluid py-5">
    <div class="container">
        <div class="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style="max-width: 500px;">
            <h1 class="fs-5 fw-bold text-primary">歡迎加入 紀錄我的碳排</h1>
        </div>
        <div class="row justify-content-center">
            <div class="col-lg-7">
                <div class="bg-light rounded p-4 p-sm-5 wow fadeInUp" data-wow-delay="0.1s">
                    <h3 align="center" class="display-6 mb-4">註冊</h3>
                    <form>
                        <div class="row g-3">
                            <div class="col-sm-15">
                                <div class="form-floating">
                                    <input type="text" class="form-control border-0" id="name" placeholder="Your Name" bind:value={name}/>
                                    <label for="name">姓名: </label>
                                </div>
                            </div>
                            <div class="col-sm-15">
                                <div class="form-floating">
                                    <input type="text" class="form-control border-0" id="acc" placeholder="Your Account" bind:value={acc}/>
                                    <label for="acc">帳號: </label>
                                </div>
                            </div>
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

                            <div class="col-sm-15">
                                <div class="form-floating">
                                    <select id="gas" name="select" class="form-control border-0" style="background: #FFFFFF" bind:value={gas}>
                                        <option value="">若有開車請選擇慣用汽車油種</option>
                                        <optgroup label="有開車">
                                        <option value="gasoline">汽油</option>
                                        <option value="diesel">柴油</option>
                                    </select>
                                    <label for="gas">汽油油種: </label>
                                </div>
                            </div>

                            <div class="col-12 text-center">
                                <button class="btn btn-primary py-2 px-5" type="submit"  on:click={signup}>註冊</button>
                                <div align="right">
                                    <a href="login">
                                    已有帳號?
                                    </a>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Quote End -->