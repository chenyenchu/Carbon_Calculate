<link href="css/walk.css" rel="stylesheet" />
<script lang="ts">
    import { initializeApp, getApp, getApps } from 'firebase/app';
    // Import the functions you need from the SDKs you need
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    import { getFirestore, collection, onSnapshot, doc,getDocs ,addDoc, deleteDoc, Timestamp } from "firebase/firestore";
    import {firebaseConfig, auth, app ,db} from "../../lib/firebaseConfig";
    import {DateInput} from 'date-picker-svelte';
    // Initialize Firebase
    // const app = initializeApp(firebaseConfig); //一個
    // const app = (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp());//多個
    // const db = getFirestore();


    //定義
    let steps = "";  //輸入走路步數
    let distance = ""; //輸入走路距離
    let d_emission = 0;
    let type = "walk";
    // let error = "";
    let id;
    let createAt = new Date();


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


    //換算走路碳排
    function calculate() {
        if (steps >= 0 && distance >= 0) {
            d_emission = steps * 0.0007 * 0.23 + distance * 0.23;  //一步的平均距離約0.0007公里，每走一公里減少約0.23公斤的碳排放量
        } else if (distance >= 0) {
            d_emission = distance * 0.23;
        } else if (steps >= 0) {
            d_emission = steps * 0.0007 * 0.23;
        }
    }



    //重置
    function clear() {
        steps = "";
        distance = "";
        d_emission = 0;
        localStorage.removeItem("d_emission");
    }

    //讀取資料
    let records = [];
    const colRef = collection(db, "record");
    const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
        let item = [];
        querySnapshot.forEach((doc) => {
            let todo = {...doc.data(), id: doc.id};
            item = [todo, ...item];
        });
        records = item;
        console.table(item);
    });
    console.log({ app, db });


    //刪除資料
    const deleteRecord = async  (id) => {
        await deleteDoc(doc(db, "record", id));
    };


    //日期分開存
    let date = "";
    let yyyy = 0;
    let mm = 0;
    let dd = 0;
    function splitDate() {
        let dateObj = new Date(date);
        yyyy = dateObj.getFullYear();
        mm = dateObj.getMonth() + 1;
        dd = dateObj.getDate();
    }
    $: {
        splitDate();
    }



    //加入資料
    const addRecord = async () => {
        if (user) {
            const id = user.uid;//ps.別管報錯

            if ((steps !== "" || distance !== "") && date !== "") {
                if (d_emission === 0){
                    alert("請先計算碳排量");
                } else {
                    const dateObj = new Date(date);
                    const docRef = await addDoc(collection(db, "record"), {
                        date: date, // 將使用者選擇的日期值代入 date 屬性
                        type: "walk",
                        steps: steps,
                        distance: distance,
                        d_emission: d_emission,
                        detrue: true,
                        userId: id,
                        createAt: createAt,
                        yyyy: dateObj.getFullYear(),
                        mm: dateObj.getMonth() + 1,
                        dd: dateObj.getDate(),
                    });
                }
                // error = "";
            } else {
                    alert(`資料沒輸入完整啦`);
                }
            date = "";
            steps = "";
            distance = "";
            d_emission = 0;
            yyyy = 0;
            mm = 0;
            dd = 0;
        }
    }


    //空的不能儲存
    const keyIsPressed = (event) => {
        if (event.key === "Enter") {
            addRecord();
        }
        console.log(event);
     }
</script>

<!-- Page Header Start -->
<div class="container-fluid page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s" style="background: linear-gradient(rgba(15, 66, 41, .6), rgba(15, 66, 41, .6)), url('/img/walk.png') center center no-repeat;
background-size: cover;">
    <div class="container text-center py-5">
        <h1 class="display-3 text-white mb-4 animated slideInDown">走路</h1>
        <nav aria-label="breadcrumb animated slideInDown">
            <ol class="breadcrumb justify-content-center mb-0">
                <li class="breadcrumb-item"><a href="index.html">首頁</a></li>
                <li class="breadcrumb-item"><a href="personal_transport">個人運輸</a></li>
                <li class="breadcrumb-item active" aria-current="page">走路</li>
            </ol>
        </nav>
    </div>
</div>
<!-- Page Header End -->
<!-- Compute Walk Start -->
<div class="container-fluid py-5" >
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-7">
                <div class="bg-light rounded p-4 p-sm-5 wow fadeInUp" data-wow-delay="0.1s">
                    <h1 align="center" class="display-5 mb-5">計算走路碳排量</h1>
                    <form>
                        <div class="row g-3" >
                            <div class="col-sm-15">
                                <div class="form-floating magin">
<!--                                    <DateInput bind:value={date}/>-->
                                    <input type="date" class="form-control border-0" bind:value={date}
                                           placeholder="date" data-input required>
                                    <label id="date" >日期：</label>
                                </div>
                            </div>
                            <label>輸入走路步數或距離</label>
                            <div class="col-sm-6">
                                <div class="form-floating">
                                    <input class="form-control border-0" bind:value={steps} placeholder="走路步數" type="number" min="1" step="100" />
                                    <label>走路步數</label>
                                </div>

                            </div>
                            <div class="col-sm-6">
                                <div class="form-floating">
                                    <input class="form-control border-0" bind:value={distance} placeholder="走路距離（公里）" type="number" min="1" step="2" />
                                    <label>走路距離</label>
                                </div>
                            </div>
                            <div class="col-12 text-left">
                                <div class="form-floating">
                                    {#if d_emission > 0}
                                        <input type="text" class="form-control border-0" id=""  placeholder="Result" disabled>
                                        <label for="result">減少的碳排量為 {d_emission.toFixed(2)} 公斤二氧化碳</label>
                                    {:else}
                                        <input type="text" class="form-control border-0" id="result"  placeholder="Result" disabled>
                                        <label for="result">換算結果</label>
                                    {/if}
                                </div>
                            </div>
                            <div class="col-12 text-center">
                                &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
                                <div>
                                    <button on:click={clear} class="btn btn-primary py-2 px-4">重置</button>
                                    <button on:click={calculate} class="btn btn-primary py-2 px-4">計算</button>
                                    {#if user}
                                        <button on:click={addRecord} class="btn btn-primary py-2 px-4">儲存</button>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </div>

    </div>

</div>
{#if user}
{:else }
    <p class="text-center"><a href="login">登入查看歷史紀錄</a></p>
{/if}
<!-- Compute Walk End -->

<!-- Record Start-->
{#if user}
<div class="container-fluid py-5">
    <div class="container">
        <div class="flex-grow bg-white dark:bg-gray-900 overflow-y-auto">
            <div class="sm:px-7 sm:pt-7 px-4 pt-4 flex flex-col w-full border-b border-gray-200 bg-white dark:bg-gray-900 dark:text-white dark:border-gray-800 sticky top-0">
                <div class="flex w-full items-center">
                    <div class="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style="max-width: 500px;">
                        <h1 class="display-5 mb-5">歷史紀錄</h1>
                    </div>
                </div>
            </div>
            <div class="sm:p-7 p-4 bg-light">
                <div class="flex w-full items-center mb-7">

                </div>
                <table class="w-full text-left">
                    <thead>
                    <tr class="text-gray-400">
                        <th class="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">年/月/日</th>
                        <th class="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">步數</th>
                        <th class="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 hidden md:table-cell">距離（公里）</th>
                        <th class="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">減少碳排量（公斤）</th>
                    </tr>
                    </thead>

                    <tbody class="text-gray-600 dark:text-gray-100">
                    {#each records.filter(item => item.type === 'walk'  && item.userId === id )  as item,i}
                        <tr>
                            <td class="sm:p-3 py-2 px-3 border-b border-gray-200 dark:border-gray-800">
                                <div class="flex items-center">
                                    <div class="sm:flex hidden flex-col">
                                        <!--{convertTimestamp(item.date)}-->
                                        {item.date}
                                    </div>
                                </div>
                            </td>
                            <td class="sm:p-3 py-2 px-3 border-b border-gray-200 dark:border-gray-800">
                                <div class="flex items-center">
                                    <div class="sm:flex hidden flex-col">
                                        {item.steps}
                                    </div>
                                </div>
                            </td>
                            <td class="sm:p-3 py-2 px-3 border-b border-gray-200 dark:border-gray-800">
                                <div class="flex items-center">
                                    <div class="sm:flex hidden flex-col">
                                        {item.distance}
                                    </div>
                                </div>
                            </td>
                            <td class="sm:p-3 py-2 px-3 border-b border-gray-200 dark:border-gray-800">
                                <div class="flex items-center">
                                    <div class="sm:flex hidden flex-col">
                                        -{item.d_emission}
                                    </div>
                                </div>
                            </td>
                            <td>
                                <button class="delete-button" on:click={() => deleteRecord(item.id)}>
                                    <a class="btn btn-sm rounded-circle mx-2" ><i class="fa fa-trash"></i></a>
                                </button>
                            </td>
                        </tr>
                    {:else}
                        <p>Not found</p>
                    {/each}
<!--                    <p class="error">{error}</p>-->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
{/if}
<!-- Record End-->
