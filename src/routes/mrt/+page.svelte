<link href="css/walk.css" rel="stylesheet" />
<script lang="ts">
    // 日期選擇器的套件
    import {DateInput} from 'date-picker-svelte'
    //表單的套件
    import Select from 'svelte-select';
    //連到firebase
    import {initializeApp} from "firebase/app";
    import {
        getFirestore,
        collection,
        onSnapshot,
        doc,
        updateDoc,
        deleteDoc,
        addDoc,
        Timestamp
    } from "firebase/firestore";

    import {firebaseConfig, auth} from "../../lib/firebaseConfig";
    //登入
    import {afterUpdate, onMount} from "svelte";
    import {onAuthStateChanged, type User} from "firebase/auth";

    let id;
    firebaseConfig;
    let user: User | null;
    onMount(async () => {
        auth;
        onAuthStateChanged(auth, (newUser) => {
            user = newUser;
            if(user){
                id = user.uid;
                console.log(id)
            }
        });
        console.log(user)
    });

    let date = new Date()
    let time_input = false

    // 將日期轉換成真的可以看得
    function convertTimestamp(timestamp) {
        let date = timestamp.toDate();
        let mm = date.getMonth() + 1;
        let dd = date.getDate();
        let yyyy = date.getFullYear();

        date = yyyy + '-' + mm + '-' + dd;
        return date;
    }

    function checkTimeInput(){
        time_input = true;
        getCarbon();
    }
    let mrt_start;
    let mrt_end;
    let selected_station = undefined;
    let minute = undefined;
    let carbon = -1;
    let mrt_km;

    let fakecarbon;
    function carbon_emission(carbon){
        fakecarbon = carbon - 0.173 * mrt_km
        return fakecarbon
    }

    // 每一次for迴圈會把items由0到最後一個編號的東西丟到fromKey
    function getCarbon() {
        console.log(minute);
        if(time_input === true) {
            if (mrt_start !== undefined && mrt_end !== undefined && minute !== undefined) {
                if (mrt_start !== null && mrt_end !== null && minute !== null) {
                    mrt_km =  (minute / 60) * 80;
                    carbon = mrt_km * (41 / 1000);
                }
                else {
                    alert(`資料沒輸入完整啦`);
                    mrt_start = mrt_end = minute = undefined;
                    time_input = false;
                    console.log("One or both of the station of mrt_start and mrt_end is NULL");
                }
            }
            else {
                alert(`資料沒輸入完整啦`);
                mrt_start = mrt_end = minute = undefined;
                time_input = false;
                console.log("One or both of the station of mrt_start and mrt_end is undefined")
            }
        }
        return carbon;
    }
    afterUpdate(() => {
    });
    //
    // function handleSelect(event) {
    //     selected_station = event.detail;
    //     // mrt_start=selected_station;
    //
    // }

    // function handleClear() {
    //     selected_station = undefined;
    //     mrt_start = undefined;
    //     mrt_end = undefined;
    //
    // }


    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    // Initialize Cloud Firestore and get a reference to the service
    const db = getFirestore();
    //參考的是集合下的哪個doc
    const colRef = collection(db, "record")


    //讀取紀錄
    let todos = [];
    const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
        let fbTodos = [];
        querySnapshot.forEach((doc) => {
            let todo = {...doc.data(), id: doc.id}
            fbTodos = [todo, ...fbTodos];
        });
        todos = fbTodos;
        console.log(fbTodos)
        console.log(todos)
    });


    let error = " ";
    let detrue = true;
    let createAt = new Date();

    //增加紀錄
    const addmrt = async () => {
        if (user) {
            const id = user.uid;
            if ((mrt_start !== null) && (mrt_end !== null) && (minute !== null)) {
                const docRef = await addDoc(collection(db, "record"), {
                    userId: id,
                    real_emission: getCarbon(),
                    d_emission: fakecarbon,
                    minute: minute,
                    mrt_Start: mrt_start,
                    mrt_end: mrt_end,
                    type: "mrt",
                    date: date,
                    createAt: createAt,
                    detrue: detrue,
                    yyyy: date.getFullYear(),
                    mm: date.getMonth()+1,
                    dd: date.getDate(),
                });
            }
            mrt_start = mrt_end = minute = undefined;
            time_input = false;
        }
        // mrt_start = undefined;
        // mrt_end = undefined;
        // minute = undefined;
        //
    };

    function clear() {
        mrt_start = undefined;
        mrt_end = undefined;
        minute = undefined;
        time_input = false;
    }

    // 刪除紀錄
    const deleteTodo = async (id) => {
        await deleteDoc(doc(db, "record", id))
    }

</script>

<!-- Page Header Start -->
<div class="container-fluid page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s" style="background: linear-gradient(rgba(15, 66, 41, .6), rgba(15, 66, 41, .6)), url('/img/mrt_bg.jpg') center center no-repeat;
background-size: cover;">
    <div class="container text-center py-5">
        <h1 class="display-3 text-white mb-4 animated slideInDown">捷運</h1>
        <nav aria-label="breadcrumb animated slideInDown">
            <ol class="breadcrumb justify-content-center mb-0">
                <li class="breadcrumb-item"><a href="#">大眾運輸</a></li>
                <li class="breadcrumb-item"><a href="#">捷運</a></li>
            </ol>
        </nav>
    </div>
</div>
<!-- Page Header End -->


<!-- Service Start -->

<div class="container-xxl py-5">
    <div class="container">
        <div class="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style="max-width: 500px;">
            <p class="fs-5 fw-bold text-primary">捷運計算</p>
            <h1 class="display-5 mb-5">捷運從哪裡坐到哪裡?</h1>
        </div>
        <div class="container p-5 my-5 border row">
            <h1>日期</h1>
            <p>請先選擇紀錄的日期</p>
            <DateInput bind:value={date}/>
        </div>
        <div class="container p-5 my-5 border row">
            <!--            紀錄表格開始-->
            <h1>輸入站名</h1>
            <p>請輸入你今天搭乘的起始站與終點站</p>
            <!--            輸入式的表單填寫-->
            <div class="mb-3 mt-3 col">
                <label class="form-label">起始站</label>
                <input class="form-control" type="text" placeholder="輸入起始站" bind:value={mrt_start}/>
            </div>
            <div class="mb-3 mt-3 col">
                <label class="form-label">終點站</label>
                <input class="form-control" type="text" placeholder="輸入終點站" bind:value={mrt_end}/>
            </div>

        </div>
        <div class="container p-5 my-5 border row">
            <h1>輸入乘車時間(分鐘)</h1>
            <p>請輸入你今天搭乘捷運的時間(分鐘)</p>
            <!--                        輸入式的表單填寫-->
            <label class="form-label">乘車時間(分鐘)</label>
            <input class="form-control" type="number" min="0" placeholder="輸入捷運乘車時間" bind:value={minute}/>
            <div style="text-align:right"><br>
                <button type="button" class="btn btn-info" on:click={clear}>重置</button>
                <button type="button" class="btn btn-secondary" on:click={checkTimeInput}>計算</button>
            </div>
        </div>
        <!--按鈕開始-->
<!--        <div style="text-align:right">-->
            <!--button type="button" class="btn btn-info">重置</button>-->
<!--        </div>-->


{#if mrt_start && mrt_end && time_input}
    <div class="container p-5 my-5 border ">
        <h1>計算結果</h1>
        <p>已計算出相對減少碳排量</p>
        <div class="mb-3 mt-3 col">
            <h3>{mrt_start}</h3>
            <span style="font-size: xxx-large">↓</span>
            <br><br>
            <h3>{mrt_end}</h3>
        </div>
        <div class="mb-3 mt-3 col">
            <label class="form-label">真實碳排量:</label>
            <h3>{carbon}kg</h3>
        </div>
        <div class="mb-3 mt-3 col">
            <label class="form-label">相對減少碳排量:</label>
            <h3>{carbon_emission(getCarbon())}kg</h3>
        </div>
        {#if (user)}
        <div style="text-align:right">
            <!--               按下去會紀錄資料到firebase-->
            <button type="button" class="btn btn-secondary" on:click={addmrt}>儲存</button>
        </div>
            {/if}
    </div>
{/if}

{#if user}
    <div class="flex-grow bg-white dark:bg-gray-900 overflow-y-auto">
        <div class="sm:px-7 sm:pt-7 px-4 pt-4 flex flex-col w-full border-b border-gray-200 bg-white dark:bg-gray-900 dark:text-white dark:border-gray-800 sticky top-0">
            <div class="flex w-full items-center">
                <div class="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style="max-width: 500px;">
                    <h1 class="display-5 mb-5">歷史紀錄</h1>
                </div>
            </div>
        </div>
        <div class="row justify-content-center">
            <div class="bg-light rounded p-4 p-sm-5 wow fadeInUp" data-wow-delay="0.1s" id="food-records">
                <div class="sm:p-7 p-4">
                    <table class="w-full text-left">
                        <thead>
                        <tr class="text-gray-400">
                            <th class="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">年/月/日</th>
                            <th class="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">起始站</th>
                            <th class="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">終點站</th>
                            <th class="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">搭乘時間</th>
                            <th class="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 hidden md:table-cell">碳排量(公斤)</th>
                            <th class="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">相對減少碳排量(公斤)</th>
                        </tr>
                        </thead>
                        <tbody class="text-gray-600 dark:text-gray-100">
                        {#each todos.filter(todos => todos.type === "mrt" && todos.userId === id) as records, i}
                            <tr>
                                <td class="sm:p-3 py-2 px-3 border-b border-gray-200 dark:border-gray-800">
                                    <div class="flex items-center">
                                        <div class="sm:flex hidden flex-col">
                                            {convertTimestamp(records.date)}
                                        </div>
                                    </div>
                                </td>
                                <td class="sm:p-3 py-2 px-3 border-b border-gray-200 dark:border-gray-800">
                                    <div class="flex items-center">
                                        <div class="sm:flex hidden flex-col">
                                            {records.mrt_Start}
                                        </div>
                                    </div>
                                </td>
                                <td class="sm:p-3 py-2 px-3 border-b border-gray-200 dark:border-gray-800">
                                    <div class="flex items-center">
                                        <div class="sm:flex hidden flex-col">
                                            {records.mrt_end}
                                        </div>
                                    </div>
                                </td>
                                <td class="sm:p-3 py-2 px-3 border-b border-gray-200 dark:border-gray-800">
                                    <div class="flex items-center">
                                        <div class="sm:flex hidden flex-col">
                                            {records.minute}
                                        </div>
                                    </div>
                                </td>
                                <td class="sm:p-3 py-2 px-3 border-b border-gray-200 dark:border-gray-800">
                                    <div class="flex items-center">
                                        <div class="sm:flex hidden flex-col">
                                            {records.real_emission.toFixed(2)}
                                        </div>
                                    </div>
                                </td>
                                <td class="sm:p-3 py-2 px-3 border-b border-gray-200 dark:border-gray-800">
                                    <div class="flex items-center">
                                        <div class="sm:flex hidden flex-col">
                                            {records.d_emission.toFixed(2)}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <button class="delete-button" on:click={() => deleteTodo(records.id)}>
                                        <a class="btn btn-sm rounded-circle mx-2" href=""><i class="fa fa-trash"></i></a>
                                    </button>
                                </td>
                            </tr>
                        {:else}
                            <p>Not found</p>
                        {/each}
                        <p class="error">{error}</p>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
{:else}
    <p align="center" style="color: red" class="wow fadeInUp" data-wow-delay="0.1s">登入再看歷史紀錄啦!</p>
{/if}
    </div>
</div>
<!--{#if (user)}-->
<!--    <div class="container-fluid py-5 bg-light">-->
<!--        <div class="container">-->
<!--            <div class="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style="max-width: 500px;">-->
<!--                <h1 class="display-5 mb-5">歷史紀錄</h1>-->
<!--            </div>-->
<!--            <div class="row justify-content-center">-->
<!--                <div class="col-lg-8">-->
<!--                    <div class="bg-light rounded p-4 p-sm-5 wow fadeInUp" data-wow-delay="0.1s">&lt;!&ndash;歷史紀錄底色&ndash;&gt;-->
<!--                        <table class="table">-->
<!--                            <thead>-->
<!--                            <tr>-->
<!--                                <th scope="col">#</th>-->

<!--                                <th scope="col">紀錄日期</th>-->
<!--                                <th scope="col">捷運起始站</th>-->
<!--                                <th scope="col">捷運終點站</th>-->
<!--                                <th scope="col">乘車時間</th>-->
<!--                                <th scope="col">真實碳排放量(公斤)</th>-->
<!--                                <th scope="col">相對汽車減少碳排放量(公斤)</th>-->
<!--                            </tr>-->
<!--                            </thead>-->
<!--                            <tbody>-->
<!--                            {#each todos.filter(todos => todos.type === "mrt" && todos.userId === id) as records, i}-->
<!--                                <tr>-->
<!--                                    <td>{i}</td>-->

<!--                                    <td>{convertTimestamp(records.date)}</td>-->
<!--                                    <td>{records.mrt_Start}</td>-->
<!--                                    <td>{records.mrt_end}</td>-->
<!--                                    <td>{records.minute}</td>-->
<!--                                    <td>{records.real_emission}kg</td>-->
<!--                                    <td>{records.d_emission}kg</td>-->
<!--                                    <td>-->
<!--                                        <button class="delete-button" on:click={() => deleteTodo(records.id)}>x</button>-->
<!--                                    </td>-->
<!--                                </tr>-->
<!--                            {:else}-->
<!--                                <p>Not found</p>-->
<!--                            {/each}-->
<!--                            <p class="error">{error}</p>-->
<!--                            </tbody>-->
<!--                        </table>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
<!--    </div>-->
<!--{/if}-->

<style>
    form {
        max-width: 400px;
        background: #f4f4f4;
        padding: 20px;
        border-radius: 4px;
    }

    label {
        margin: 0 0 10px;
    }

    /*.delete-button {*/
    /*    background-color: red;*/
    /*    color: white;*/
    /*    padding: 0.5em;*/
    /*    border: none;*/
    /*    border-radius: 0.25em;*/
    /*    transition: background-color 0.2s ease-in-out;*/
    /*}*/

    /*.delete-button:hover {*/
    /*    background-color: darkred;*/
    /*}*/
</style>