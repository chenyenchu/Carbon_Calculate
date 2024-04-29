<link href="css/walk.css" rel="stylesheet" />
<script lang="ts">
let id;
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

    import {firebaseConfig,auth} from "../../lib/firebaseConfig";

    //登入
    import {onMount} from "svelte";

    import {onAuthStateChanged, type User} from "firebase/auth";
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

    });


    let date = new Date()
// 將日期轉換成真的可以看得
    function convertTimestamp(timestamp) {
        let date = timestamp.toDate();
        let mm = date.getMonth()+1;
        let dd = date.getDate();
        let yyyy = date.getFullYear();

        date = yyyy + '-' + mm + '-' + dd ;
        return date;
    }



    const items = [
        { label: "南港", pos: 0.0},
        { label: "台北", pos: 0.30},
        { label: "板橋", pos: 0.53},
        { label: "桃園", pos: 1.46},
        { label: "新竹", pos: 2.42},
        { label: "苗栗", pos: 3.47},
        { label: "台中", pos: 5.42},
        { label: "彰化", pos: 6.32},
        { label: "雲林", pos: 7.11},
        { label: "嘉義", pos: 8.18},
        {label: "台南", pos: 10.17},
        {label: "左營", pos: 11.18}
    ]


    console.log(items)
    let hsr_start;
    let hsr_end;
    let selected_station = undefined;
    // function  getCarbon1(){
    //     let carbon;
    //     if (hsr_start !== null ){
    //         if (hsr_end !== null) {
    //             if (hsr_start > hsr_end) {
    //                 carbon = (hsr_start.pos) - (hsr_end.pos)
    //             }
    //             else {
    //                 carbon = (hsr_end.pos) - (hsr_start.pos)
    //             }
    //             return carbon;
    //         }
    //     }
    // }

    // 每一次for迴圈會把items由0到最後一個編號的東西丟到fromKey
    function getCarbon() {


            if (hsr_start !== undefined && hsr_end !== undefined) {
                if (hsr_start !== null && hsr_end !== null) {
                    return Math.abs(hsr_end.pos - hsr_start.pos);
                }
                else {
                    console.log("One or both of the station of hsr_start and hsr_end is NULL");
                }
            }
            else {
                console.log("One or both of the station of hsr_start and hsr_end is undefined")
            }

    }

    function handleSelect(event) {
        selected_station = event.detail;
        // hsr_start=selected_station;

    }

    function handleClear() {
        selected_station = undefined;
        hsr_start = undefined;
        hsr_end = undefined;

        }
    let fakecarbon;
    function decrease_carbon(carbon){
            let hsrkm = (carbon*1000)/48
        fakecarbon = carbon-0.173*hsrkm
        return(fakecarbon)


    }

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
    let createAt = new Date();

    //增加紀錄
    const addhsr = async () => {
        if(user) {
            const id = user.uid;
            if (hsr_start !== null && hsr_end !== null) {
                const docRef = await addDoc(collection(db, "record"), {
                    userId: id,
                    d_emission: fakecarbon,
                    real_emission:  getCarbon(),
                    hsr_Start: hsr_start,
                    hsr_end: hsr_end,
                    type: "thsr",
                    date: date,
                    createAt: createAt,
                    detrue: true,
                    yyyy: date.getFullYear(),
                    mm: date.getMonth()+1,
                    dd: date.getDate(),
                });
            }
            hsr_start = hsr_end = undefined;
        }
    };

    // 刪除紀錄
    const deleteTodo = async  (id) => {
        await deleteDoc(doc(db,"record",id))
    }


</script>

<!-- Page Header Start -->
<div class="container-fluid page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s" style="background: linear-gradient(rgba(15, 66, 41, .6), rgba(15, 66, 41, .6)), url('/img/hsr_bg.jpg') center center no-repeat;
background-size: cover;">
    <div class="container text-center py-5">
        <h1 class="display-3 text-white mb-4 animated slideInDown">高鐵</h1>
        <nav aria-label="breadcrumb animated slideInDown">
            <ol class="breadcrumb justify-content-center mb-0">
                <li class="breadcrumb-item"><a href="#">大眾運輸</a></li>
                <li class="breadcrumb-item"><a href="#">高鐵</a></li>

            </ol>
        </nav>
    </div>
</div>
<!-- Page Header End -->


<!-- Service Start -->

<div class="container-xxl py-5">
    <div class="container">
        <div class="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style="max-width: 500px;">
            <p class="fs-5 fw-bold text-primary">高鐵計算</p>
            <h1 class="display-5 mb-5">高鐵從哪裡坐到哪裡?</h1>
        </div>
        <div class="container p-5 my-5 border row">
            <h1>日期</h1>
            <p>請先選擇紀錄的日期</p>
            <DateInput bind:value={date}/>
        </div>
        <div class="container p-5 my-5 border row">
            <!--            紀錄表格開始-->
            <h1>選取站數</h1>
            <p>請先選擇線再選出發站跟抵達站</p>
            <!--            輸入式的表單填寫-->
            <div class="mb-3 mt-3 col">
                <label class="form-label">起始站</label>
                <!--選擇式的表單-->
                <form>
                    <Select id="hsr_start" {items} on:select={handleSelect} on:clear={handleClear}
                        bind:value={hsr_start}></Select>
                </form>
                <!--            <input class="form-control" type="text" placeholder="輸入起始站" bind:value={hsr_start}  />-->
            </div>
            <div class="mb-3 mt-3 col">
                <label class="form-label">終點站</label>
                <form>
                    <Select id="hsr_end" {items} on:select={handleSelect} on:clear={handleClear}
                        bind:value={hsr_end}></Select>
                </form>
                <!--            <input class="form-control" type="text" placeholder="輸入終點站" bind:value={hsr_end} />-->
            </div>
            <!--            按鈕開始-->
            <div style="text-align:right">
<!--                <button type="button" class="btn btn-info">重置</button>-->
            </div>
        </div>

{#if hsr_start && hsr_end}
    <div class="container p-5 my-5 border ">
        <h1>計算結果</h1>
        <p>已計算出相對減少碳排量</p>
        <div class="mb-3 mt-3 col">
            <h3>{hsr_start.label}</h3>
            <span style="font-size: xxx-large">↓</span>
            <br><br>
            <h3>{hsr_end.label}</h3>
        </div>
        <div class="mb-3 mt-3 col">
            <label class="form-label">真實碳排量:</label>
            <h3>{getCarbon().toFixed(2)}kg</h3>
        </div>
        <div class="mb-3 mt-3 col">
            <label class="form-label">相對減少碳排量:</label>
            <h3>{decrease_carbon(getCarbon()).toFixed(2)}kg</h3>
        </div>
        {#if (user)}
            <div style="text-align:right">
                <!--               按下去會紀錄資料到firebase-->
                <button type="button" class="btn btn-secondary" on:click={addhsr}>儲存</button>
            </div>
        {/if}
    </div>
{/if}
        <!--{#if hsr_start && hsr_end}-->
        <!--    <div class="container p-5 my-5 border ">-->
        <!--        <h1>計算結果</h1>-->
        <!--        <p>已計算出相對減少碳碳排量</p>-->
        <!--        <div class="mb-3 mt-3 col">-->

        <!--            <h3>{hsr_start.label}</h3>-->
        <!--            <span style="font-size: xxx-large">↓</span>-->
        <!--            <br><br>-->
        <!--            <h3>{hsr_end.label}</h3>-->

        <!--        </div>-->
        <!--        <div class="mb-3 mt-3 col">-->
        <!--            <label class="form-label">真實碳排量:</label>-->
        <!--            <h3>{getCarbon()}kg</h3>-->
        <!--        </div>-->
        <!--        <div class="mb-3 mt-3 col">-->
        <!--            <label class="form-label">相對減少碳排量:</label>-->
        <!--            <h3>{decrease_carbon(getCarbon())}kg</h3>-->
        <!--        </div>-->
        <!--        {#if (user)}-->
        <!--        <div style="text-align:right">-->
        <!--            &lt;!&ndash;               按下去會紀錄資料到firebase&ndash;&gt;-->
        <!--            <button type="button" class="btn btn-secondary" on:click={addhsr}>紀錄</button>-->
        <!--        </div>-->
        <!--    {/if}-->
        <!--    </div>-->
        <!--{/if}-->
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
                            <th class="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 hidden md:table-cell">碳排量(公斤)</th>
                            <th class="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">相對減少碳排量(公斤)</th>
                        </tr>
                        </thead>
                        <tbody class="text-gray-600 dark:text-gray-100">
                        {#each todos.filter(todos => todos.type === "thsr" && todos.userId === id) as records, i}
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
                                            {records.hsr_Start.label}
                                        </div>
                                    </div>
                                </td>
                                <td class="sm:p-3 py-2 px-3 border-b border-gray-200 dark:border-gray-800">
                                    <div class="flex items-center">
                                        <div class="sm:flex hidden flex-col">
                                            {records.hsr_end.label}
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
<!--        <div class="container-fluid py-5 bg-light">-->
<!--            <div class="container">-->
<!--                <div class="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style="max-width: 500px;">-->
<!--                    <h1 class="display-5 mb-5">歷史紀錄</h1>-->
<!--                </div>-->
<!--                <div class="row justify-content-center">-->
<!--                    <div class="col-lg-8">-->
<!--                        <div class="bg-light rounded p-4 p-sm-5 wow fadeInUp" data-wow-delay="0.1s">&lt;!&ndash;歷史紀錄底色&ndash;&gt;-->
<!--                            <table class="table">-->
<!--                                <thead>-->
<!--                                <tr>-->
<!--                                    <th scope="col">#</th>-->

<!--                                    <th scope="col">紀錄日期</th>-->
<!--                                    <th scope="col">高鐵起始站</th>-->
<!--                                    <th scope="col">高鐵終點站</th>-->
<!--                                    <th scope="col">真實碳排放量(公斤)</th>-->
<!--                                    <th scope="col">相對汽車減少碳排放量(公斤)</th>-->
<!--                                </tr>-->
<!--                                </thead>-->
<!--                                <tbody>-->
<!--                                {#each todos.filter(todos => todos.type === "thsr" && todos.userId === id) as records, i}-->
<!--                                    <tr>-->
<!--                                        <td>{i}</td>-->

<!--                                        <td>{convertTimestamp(records.date)}</td>-->
<!--                                        <td>{records.hsr_Start.label}</td>-->
<!--                                        <td>{records.hsr_end.label}</td>-->
<!--                                        <td>{records.real_emission}kg</td>-->
<!--                                        <td>{records.d_emission}kg</td>-->
<!--                                        <td>-->
<!--                                            <button class="delete-button" on:click={() => deleteTodo(records.id)} >x</button>-->
<!--                                        </td>-->
<!--                                    </tr>-->
<!--                                {:else}-->
<!--                                    <p>Not found</p>-->
<!--                                {/each}-->
<!--                                <p class="error">{error}</p>-->
<!--                                </tbody>-->
<!--                            </table>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
<!--    {/if}-->

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

    /* .delete-button {*/
    /*     background-color: red;*/
    /*     color: white;*/
    /*     padding: 0.5em;*/
    /*     border: none;*/
    /*     border-radius: 0.25em;*/
    /*     transition: background-color 0.2s ease-in-out;*/
    /* }*/

    /*.delete-button:hover {*/
    /*    background-color: darkred;*/
    /*}*/
</style>