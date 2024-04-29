<script lang="ts">
    let id;
    let name;
    let addyourself;
    //複製要的東西

    //連到firebase
    import {initializeApp} from "firebase/app";
    import {
        arrayUnion,
        arrayRemove,
        setDoc,
        getFirestore,
        collection,
        onSnapshot,
        doc,
        updateDoc,
        deleteDoc,
        addDoc,
        Timestamp, getDoc
    } from "firebase/firestore";

    import {firebaseConfig, auth} from "../../lib/firebaseConfig";
    //引入通知套件

    //登入
    import {onMount} from "svelte";

    import {onAuthStateChanged, type User} from "firebase/auth";

    firebaseConfig;
    let user: User | null;

    onMount(async () => {
        auth;
        onAuthStateChanged(auth, (newUser) => {
            user = newUser;
            if (user) {
                id = user.uid;
                console.log(id)
            }
        });

    });
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    // Initialize Cloud Firestore and get a reference to the service
    const db = getFirestore();
    //參考的是集合下的哪個doc
    const colRef = collection(db, "users")


    //讀取使用者這個集合的紀錄
    let usersCollection = [];
    const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
        let fbTodos = [];
        querySnapshot.forEach((doc) => {
            let todo = {...doc.data(), id: doc.id}
            fbTodos = [todo, ...fbTodos];
        });
        usersCollection = fbTodos;

    });
    //讀取invitations裡面有沒有值，如果有那展示交友邀請，並且如果選擇接受交友邀請，那把要加入的user新增至friends且刪除invitations，如果拒絕交友邀請，會單純刪除invitations
    let invitations = [];

    //等待invitations有值後在進入invitationsDisplay
    async function invitationsDisplayWrapper() {
        while (invitations.length === 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // 等待 1 秒
        }

        invitationsDisplay();
    }

    invitationsDisplayWrapper();
    const invitationsInformation = [];
    let invitationsFlag = 0;

    //下面的迴圈把蒐集到的陣列裡面的變數放進去跑資料庫找出對應文件下的資訊
    function invitationsDisplay() {

        if (invitations.length > 0) {
            for (let k = 0; k < invitations.length; k++) {

                const invitationsId = invitations[k];

                const invitationsRef = doc(db, "users", invitationsId)

                getDoc(invitationsRef)
                    .then((docSnap) => {
                        if (docSnap.exists()) {
                            invitationsInformation.push(docSnap.data());
                            invitationsFlag += 1
                            // 文件存在，印出內容

                        } else {
                            // 文件不存在
                            console.log('找不到文件！');
                        }
                    })
                    .catch((error) => {
                        console.log('讀取文件時發生錯誤:', error);
                    });
            }
        }
    }

    //讀取使用者這個集合的紀錄


    //加userId到邀請陣列
    //id是自己的userId，name是你找的那個人。現在這個函數是在你發送交友邀請後先讀取你要加的人的文件，然後在他的那個文件下更新invitations的陣列，把你自己的userId加入到陣列裡。
    function addInvArray() {
        return new Promise((resolve, reject) => {

            const userRef = doc(db, "users", name);

            updateDoc(userRef, {
                invitations: arrayUnion(addyourself)
            }).then(() => {

                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    }
    //匿名函式 () =>
    async function readPersonalInformationWrapper() {
        while (user===undefined) {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // 等待 1 秒
        }

        readPersonalInformation();
    }
    readPersonalInformationWrapper()

    const friendsArray = [];
    let friends = [];
    function readPersonalInformation(){
    //朋友陣列
    //參考的是集合下的哪個doc
        if(id){
            // const userId = id;
            const docRef = doc(db, "users", id)

            //這個friendsArray變數是在找登入使用者自己的好友名單
            getDoc(docRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {

                        friendsArray.push(docSnap.data());
                        friends = friendsArray[0].friends;
                        addyourself = friendsArray[0].userId;
                        invitations = friendsArray[0].invitations;
                        // 文件存在，印出內容


                    } else {
                        // 文件不存在
                        console.log('找不到文件！');
                    }
                })
                .catch((error) => {
                    console.log('讀取文件時發生錯誤:', error);
                });
        }

    }

    //應該沒問題了
    async function invitation() {

        //如果他最一開始沒有加過任何好友，那麼他就不會有朋友表，這邊幫他創一個
        if (friends === undefined) {
            await addInvArray()
            const message = "已送出交友邀請~ 希望不會被拒絕"
            window.alert(message);
            reload()
        }
        else {
            for (let k = 0; k < friends.length; k++) {
                if (name === friends[k]) {
                    //跳出已經加過好友的訊息
                    const message = "你們已經是好友囉~"
                    window.alert(message);

                    reload()
                  return
                }
            }

                    await addInvArray()
                    const message = "已送出交友邀請~ 希望不會被拒絕"
                    window.alert(message);

            reload();
        }
    }

    let flag = false;

    function search() {
        flag = true
    }
    //刪除交友邀請
    async function deleteInvitation(invitationId){
        const userRef = doc(db, "users", id);

        await updateDoc(userRef, {
            invitations: arrayRemove(invitationId)
        });
        const message = "已經拒絕囉~"
        window.alert(message);
        reload()
        // location.reload();
        // window.location.reload();
    }

    //接受婊子交友邀請
    async function acceptInvitation(invitationId) {
        const userRef = doc(db, "users", id);
        const otherSideRef = doc(db, "users", invitationId);


        await Promise.all([
            updateDoc(userRef, {
                invitations: arrayRemove(invitationId),
                friends: arrayUnion(invitationId)
            }),
            updateDoc(otherSideRef, {
                invitations: arrayRemove(id),
                friends: arrayUnion(id)
            })
        ]);

        const message = "恭喜你們成為好朋友^^ ";
        window.alert(message);

        reload()
    }

    function reload() {
        window.location.reload();
    }


</script>
<!-- Page Header Start -->


<div class="container-fluid page-header py-3 mb-5 wow fadeIn" data-wow-delay="0.1s" style="
background: linear-gradient(rgba(15, 66, 41, .6), rgba(15, 66, 41, .6)), url('/img/hq_friends.jpg') center center no-repeat;
background-size: cover;">
    <div class="container text-center py-5">
        <h1 class="display-3 text-white mb-4 animated slideInDown">社群</h1>
        <nav aria-label="breadcrumb animated slideInDown">
            <ol class="breadcrumb justify-content-center mb-0">
                <li class="breadcrumb-item"><a href="#">社群</a></li>
                <li class="breadcrumb-item"><a href="#">加好友與減碳排名</a></li>

            </ol>
        </nav>
    </div>
</div>
<!-- Page Header End -->
{#if user}
<div class="container-xxl py-5">
    <div class="container">
        {#if invitationsFlag}
        {#if invitationsFlag === invitations.length}
            <div class="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style="max-width: 500px;">
                <p class="fs-5 fw-bold text-primary">好友邀請</p>
                <h1 class="display-5 mb-5">您收到好友邀請了!</h1>
            </div>

            <div class="container p-5 my-5 border row">
                <table class="table">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">加您的使用者姓名</th>
                        <th scope="col">加您的使用者ID</th>
                        <th scope="col">加您的使用者email</th>
                        <th scope="col"></th>
                        <th scope="col"></th>

                    </tr>
                    </thead>
                    <tbody>
                    {#each invitationsInformation as records, i}
                        <tr>
                            <td>{i}</td>
                            <td>{records.name}</td>
                            <td>{records.userId}</td>
                            <td>{records.email}</td>
                            <td>
                                <button type="button" class="btn btn-info" on:click={() => acceptInvitation(records.userId)}>接受</button>
                            </td>
                            <td>
                                <button type="button" class="btn btn-danger" on:click={() => deleteInvitation(records.userId)}>拒絕</button>
                            </td>
                        </tr>
                    {:else}
                        <p>沒有收到好友邀請</p>
                    {/each}
                    <!--                                <p class="error">{error}</p>-->
                    </tbody>

                </table>
            </div>
        {/if}
        {/if}
    </div>
<!--展示自己的userID-->
    <div class="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style="max-width: 500px;">
        <p class="fs-5 fw-bold text-primary">加朋友</p>
        <h1 class="display-5 mb-5">您個人的UserID</h1>
    </div>

    <div class="container p-5 my-5 border row">
        您的UserID:
        <div class="alert alert-primary" role="alert">
             {id}
        </div>
    </div>

<!--    查詢-->
    <div class="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style="max-width: 500px;">
        <p class="fs-5 fw-bold text-primary">加朋友</p>
        <h1 class="display-5 mb-5">請輸入想要加入好友的UserID</h1>
    </div>

    <div class="container p-5 my-5 border row">
        <div class="row">
            <div class="col">
                <div class="mb-3">
                    <label for="exampleFormControlInput1" class="form-label">輸入你想找的人的ID</label>
                    <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="輸入好友ID"
                           bind:value={name}>
                </div>
            </div>

            <div class="col  align-self-center">
                <button type="button" class="btn btn-primary" on:click={search}>尋找</button>
            </div>
        </div>


        {#if flag}
            <div class="container-fluid py-5 bg-light">
                <div class="container">
                    <div class="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style="max-width: 500px;">
                        <h1 class="display-5 mb-5">找你想邀請的朋友</h1>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-lg-8">
                            <div class="bg-light rounded p-4 p-sm-5 wow fadeInUp" data-wow-delay="0.1s"><!--歷史紀錄底色-->
                                <table class="table">
                                    <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">你要找的的名字</th>
                                        <th scope="col">你要找的Id</th>
                                        <th scope="col">發送交友邀請</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {#each usersCollection.filter(usersCollection => usersCollection.userId === name) as records, i}
                                        <tr>
                                            <td>{i}</td>
                                            <td>{records.name}</td>
                                            <td>{records.userId}</td>
                                            <td>
                                                <button type="button" class="btn btn-info"
                                                        on:click={() => invitation()}>送出交友邀請
                                                </button>
                                            </td>

                                            <!--                                        <td>-->
                                            <!--                                            <button class="delete-button" on:click={() => deleteTodo(records.id)} >x</button>-->
                                            <!--                                        </td>-->
                                        </tr>
                                    {:else}
                                        <p>沒有這個人</p>
                                    {/each}
                                    <!--                                <p class="error">{error}</p>-->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>

</div>
{:else }
    <div class="container row ">

        <h3 style="color: #5aa96f" ><b>請先登入</b></h3>
        <div class="d-grid gap-2 d-md-block ">
            <button type="button" class="btn btn-primary py-2 btn-sm" onclick="location.href='login'">登入</button>
        </div>
        <br><br><br>
        <h3 style="color: #5aa96f" ><b>沒有帳號嗎? 還是先去註冊</b></h3>
        <div class="d-grid gap-2 d-md-block">
        <button type="button" class="btn btn-primary py-2 btn-sm" onclick="location.href='register'">註冊</button>
        </div>
        </div>
{/if}