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
    import {onMount} from "svelte";
    import {onAuthStateChanged, type User} from "firebase/auth";

    firebaseConfig;
    let user: User | null;
    let id;
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

    let createAt = new Date()
    let date = new Date()

    // 將日期轉換成真的可以看得
    function convertTimestamp(timestamp) {
        let date = timestamp.toDate();
        let mm = date.getMonth() + 1;
        let dd = date.getDate();
        let yyyy = date.getFullYear();

        date = yyyy + '-' + mm + '-' + dd;
        return date;
    }

    // console.log(items)
    let time_input = false;
    let bus_start;
    let bus_end;
    let selected_station = undefined;
    let minute = undefined;
    let carbon = -1;

    function checkTimeInput(){
        time_input = true;
        getCarbon();
    }

    let fakecarbon;
    function carbon_emission(carbon){
        fakecarbon = carbon - 0.173 * bus_km
        return fakecarbon
    }

    let bus_km;
    // 每一次for迴圈會把items由0到最後一個編號的東西丟到fromKey
    function getCarbon() {
        if (time_input){
            if (minute !== undefined) {
                if (minute !== null) {
                    bus_km =  (minute / 60) * 40;
                    carbon = bus_km * (21 / 1000);
                }
                else {
                    alert(`資料沒輸入完整啦`);
                    minute = undefined;
                    time_input = false;
                    console.log("One or both of the station of bus_start and bus_end is NULL");
                }
            }
            else {
                alert(`資料沒輸入完整啦`);
                minute = undefined;
                time_input = false;
                console.log("One or both of the station of bus_start and bus_end is undefined")
            }
            return carbon;
        }
    }

/*
    function handleSelect(event) {
        selected_station = event.detail;
        // bus_start=selected_station;

    }

    function handleClear() {
        selected_station = undefined;
        bus_start = undefined;
        bus_end = undefined;

    }*/


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

    //增加紀錄
    const addbus = async () => {
        if (user) {
            const id = user.uid;
            if (minute !== null) {
                const docRef = await addDoc(collection(db, "record"), {
                    userId: id,
                    real_emission: getCarbon(),
                    d_emission: fakecarbon,
                    minute: minute,
                    type: "bus",
                    date: date,
                    createAt: createAt,
                    detrue: detrue,
                    yyyy: date.getFullYear(),
                    mm: date.getMonth()+1,
                    dd: date.getDate(),
                });
            }
            bus_start = bus_end = minute = undefined;
            time_input = false;
        }
    };

    //重置
    function clear() {
        minute = "";
        time_input = false;
    }

    // 刪除紀錄
    const deleteTodo = async (id) => {
        await deleteDoc(doc(db, "record", id))
    }


</script>

<!-- Page Header Start -->
<div class="container-fluid page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s" style="background: linear-gradient(rgba(15, 66, 41, .6), rgba(15, 66, 41, .6)), url('/img/bus_bg.jpg') center center no-repeat;
background-size: cover;">
    <div class="container text-center py-5">
        <h1 class="display-3 text-white mb-4 animated slideInDown">公車</h1>
        <nav aria-label="breadcrumb animated slideInDown">
            <ol class="breadcrumb justify-content-center mb-0">
                <li class="breadcrumb-item"><a href="#">大眾運輸</a></li>
                <li class="breadcrumb-item"><a href="#">公車</a></li>

            </ol>
        </nav>
    </div>
</div>
<!-- Page Header End -->


<!-- Service Start -->

<div class="container-xxl py-5">
    <div class="container">
        <div class="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style="max-width: 500px;">
            <p class="fs-5 fw-bold text-primary">公車計算</p>
            <h1 class="display-5 mb-5">公車坐多久?</h1>
        </div>

        <div class="container p-5 my-5 border row">
            <h1>日期</h1>
            <p>請先選擇紀錄的日期</p>
            <DateInput bind:value={date}/>
        </div>
        <div class="container p-5 my-5 border row">
            <h1>輸入乘車時間(分鐘)</h1>
            <p>請輸入你今天搭乘公車的時間(分鐘)</p>
            <!--                        輸入式的表單填寫-->
            <label class="form-label">乘車時間(分鐘)</label>
            <input class="form-control" type="number" min="0" placeholder="輸入公車乘車時間" bind:value={minute}/>
            <div style="text-align:right"><br>
                <button type="button" class="btn btn-info" on:click={clear}>重置</button>
                <button type="button" class="btn btn-secondary" on:click={checkTimeInput}>計算</button>
            </div>
        </div>


{#if time_input}
    <div class="container p-5 my-5 border ">
        <h1>計算結果</h1>
        <p>已計算出相對減少碳排量</p>
<!--        <div class="mb-3 mt-3 col">-->

<!--            <h3>{bus_start}</h3>-->
<!--            <span style="font-size: xxx-large">↓</span>-->
<!--            <br><br>-->
<!--            <h3>{bus_end}</h3>-->

<!--        </div>-->
        <div class="mb-3 mt-3 col">
            <label class="form-label">真實碳排量:</label>
            <h3>{carbon}kg</h3>
        </div>
        <div class="mb-3 mt-3 col">
            <label class="form-label">相對汽車減少碳排量:</label>
            <h3>{carbon_emission(getCarbon())}kg</h3>
        </div>
        {#if (user)}
        <div style="text-align:right">
            <!--               按下去會紀錄資料到firebase-->
            <button type="button" class="btn btn-secondary" on:click={addbus}>儲存</button>
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
<!--                    <div class="flex w-full items-center mb-7">-->
<!--                        <button class="inline-flex mr-3 items-center h-8 pl-2.5 pr-2 rounded-md shadow text-gray-700 dark:text-gray-400 dark:border-gray-800 border border-gray-200 leading-none py-0">-->
<!--                            <svg viewBox="0 0 24 24" class="w-4 mr-2 text-gray-400 dark:text-gray-600" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">-->
<!--                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>-->
<!--                                <line x1="16" y1="2" x2="16" y2="6"></line>-->
<!--                                <line x1="8" y1="2" x2="8" y2="6"></line>-->
<!--                                <line x1="3" y1="10" x2="21" y2="10"></line>-->
<!--                            </svg>-->
<!--                            過去 30 日-->
<!--                            <svg viewBox="0 0 24 24" class="w-4 ml-1.5 text-gray-400 dark:text-gray-600" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">-->
<!--                                <polyline points="6 9 12 15 18 9"></polyline>-->
<!--                            </svg>-->
<!--                        </button>-->
<!--                        <button class="inline-flex items-center h-8 pl-2.5 pr-2 rounded-md shadow text-gray-700 dark:text-gray-400 dark:border-gray-800 border border-gray-200 leading-none py-0" id="rangeDate">-->
<!--                            選擇日期範圍-->
<!--                            <svg viewBox="0 0 24 24" class="w-4 ml-1.5 text-gray-400 dark:text-gray-600" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" id="rangeDate" >-->
<!--                                <polyline points="6 9 12 15 18 9"></polyline>-->
<!--                            </svg>-->
<!--                        </button>-->
<!--                        <div class="ml-auto text-gray-500 text-xs sm:inline-flex hidden items-center">-->
<!--                            <span class="mr-3">Page 1 of 1</span>-->
<!--                            <button class="inline-flex mr-2 items-center h-8 w-8 justify-center text-gray-400 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none py-0">-->
<!--                                <svg class="w-4" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">-->
<!--                                    <polyline points="15 18 9 12 15 6"></polyline>-->
<!--                                </svg>-->
<!--                            </button>-->
<!--                            <button class="inline-flex items-center h-8 w-8 justify-center text-gray-400 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none py-0">-->
<!--                                <svg class="w-4" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">-->
<!--                                    <polyline points="9 18 15 12 9 6"></polyline>-->
<!--                                </svg>-->
<!--                            </button>-->
<!--                        </div>-->
<!--                    </div>-->
                    <table class="w-full text-left">
                        <thead>
                        <tr class="text-gray-400">
                            <th class="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">年/月/日</th>
                            <th class="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">搭乘時間</th>
                            <th class="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 hidden md:table-cell">碳排量(公斤)</th>
                            <th class="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">相對減少碳排量(公斤)</th>
                        </tr>
                        </thead>
                        <tbody class="text-gray-600 dark:text-gray-100">
                        {#each todos.filter(todos => todos.type === "bus" && todos.userId === id) as records, i}
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
<!--                                <th scope="col">公車乘車時間</th>-->
<!--                                <th scope="col">真實碳排放量(公斤)</th>-->
<!--                                <th scope="col">相對汽車減少碳排放量(公斤)</th>-->
<!--                            </tr>-->
<!--                            </thead>-->
<!--                            <tbody>-->
<!--                            {#each todos.filter(todos => todos.type === "bus"&& todos.userId === id) as records, i}-->
<!--                                <tr>-->
<!--                                    <td>{i}</td>-->

<!--                                    <td>{convertTimestamp(records.date)}</td>-->
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