<link href="css/walk.css" rel="stylesheet" />
<script lang="ts">
    // import { initializeApp, getApps, getApp } from "firebase/app";
    import { getFirestore, collection, onSnapshot, doc, addDoc, deleteDoc } from "firebase/firestore";
    import { firebaseConfig, app, db, auth } from "../../lib/firebaseConfig";
    // import {DateInput} from 'date-picker-svelte';

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
    });

    let createAt = new Date();

    //讀取資料
    let records = [];
    const colRef = collection(db, "record");
    const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
        let fbRecords = [];
        querySnapshot.forEach((doc) => {
            let record = {...doc.data(), id: doc.id};
            fbRecords = [record, ...fbRecords];
        });
        records = fbRecords;
    });

    let error = "";
    let foodtype = "";
    let result = "";
    let number = "";

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

    //計算碳排
    function getValue(foodtype, number) {
        switch (foodtype) {
            case '葉菜類':
                return 0.05;
            case '根莖類':
                return 0.03;
            case '水果':
                return 0.07;
            case '穀物':
                return 0.4;
            case '堅果':
                return 0.006;
            case '養殖蝦':
                return 1.32;
            case '養殖魚':
                return 0.561;
            case '家禽':
                return 0.671;
            case '豬肉':
                return 0.792;
            case '家牛':
                return 6.6;
            case '羊肉':
                return 2.75;
            default:
                return 0;
        }
    }

    function calculate(foodtype, number) {
        result = getValue(foodtype, number) * number;
    }

    //寫入資料
    const addRecord = async () => {
        if(user) {
            const id = user.uid;
            if ((foodtype !== "") && (number !== "") && (result !== "") && (date !== "")) {
                const dateObj = new Date(date);
                const docRef = await addDoc(collection(db, "record"), {
                    foodtype: foodtype,
                    date: date,
                    i_emission: result,
                    number: number,
                    type: "food",
                    userId: id,
                    createAt: createAt,
                    ietrue: true,
                    yyyy: dateObj.getFullYear(),
                    mm: dateObj.getMonth() + 1,
                    dd: dateObj.getDate(),
                });
            }
            else {
                alert(`資料沒輸入完整啦`);
            }
        }
        foodtype = "";
        number = "";
        date = "";
        result = "";
        yyyy = 0;
        mm = 0;
        dd = 0;
    };

    //重置
    function clear() {
        // date = "";
        foodtype = "";
        number = "";
        result = "";
    }

    //刪除
    const deleteRecord = async (id) => {
        await deleteDoc(doc(db, "record", id));
    };

</script>

<div class="container-fluid page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s" style="background: linear-gradient(rgba(15, 66, 41, .6), rgba(15, 66, 41, .6)), url('/img/food_bg.jpg') center center no-repeat;
background-size: cover;">
    <div class="container text-center py-5">
        <h1 class="display-3 text-white mb-4 animated slideInDown">食物</h1>
        <nav aria-label="breadcrumb animated slideInDown">
            <ol class="breadcrumb justify-content-center mb-0">
                <li class="breadcrumb-item"><a href="#">首頁</a></li>
                <li class="breadcrumb-item"><a href="#">食物</a></li>
            </ol>
        </nav>
    </div>
</div>
<div class="container-xxl py-5">
    <div class="container">
        <div class="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style="max-width: 500px;">
            <p class="fs-5 fw-bold text-primary">食物</p>
            <h1 class="display-5 mb-5">每日食物攝取份量</h1>
        </div>
        <div class="row">
            <div class="col-lg-12 order-2 order-lg-1 wow fadeInUp" data-wow-delay="0.3s">
                <div class="block">
                    <div class="row service-parts text-center rounded" style="box-shadow: 0 0 45px rgba(0,0,0,.08);">
                        <div class="col-md-4"><br><br>
                            <div class="btn-square bg-light rounded-circle mx-auto mb-4" style="width: 70px; height: 70px;">
                                <div class="btn-square rounded-circle mx-auto mb-1">
                                    <img class="img-fluid" src="img/icon/hand1.png" alt="Icon">
                                </div>
                            </div>
                            <h5 class="mb-0">蔬果類、穀物<br>一份約為一個拳頭大小</h5>
                            <p class="mb-4">正常人一天需攝取蔬菜3~5份<br>水果2~4份，穀物1.5~4份<br>一份約為0.07~0.1公斤</p>
                        </div>
                        <div class="col-md-4"><br><br>
                            <div class="btn-square bg-light rounded-circle mx-auto mb-4" style="width: 70px; height: 70px;">
                                <div class="btn-square rounded-circle mx-auto mb-1">
                                    <img class="img-fluid" src="img/icon/hand2.png" alt="Icon">
                                </div>
                            </div>
                            <h5 class="mb-0">蛋豆魚肉類<br>一份約為一個手掌大小</h5>
                            <p class="mb-4">正常人一天需攝取3~8份<br>一份約為0.085~0.11公斤</p><br>
                        </div>
                        <div class="col-md-4"><br><br>
                            <div class="btn-square bg-light rounded-circle mx-auto mb-4" style="width: 70px; height: 70px;">
                                <div class="btn-square rounded-circle mx-auto mb-1">
                                    <img class="img-fluid" src="img/icon/hand3.png" alt="Icon">
                                </div>
                            </div>
                            <h5 class="mb-0">堅果類<br>一份約為一個指節大小</h5>
                            <p class="mb-4">正常人一天需攝取1份<br>一份約為0.02公斤</p><br>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <br>
        <div class="row g-4">
            <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                <div class="service-item rounded d-inline-flex h-100">
                    <div class="service-text rounded p-5">
                        <div class="btn-square rounded-circle mx-auto mb-3">
                            <img class="img-fluid" src="img/icon/apple.png" alt="Icon">
                        </div>
                        <h4 class="mb-3">低碳排食物</h4>
                        <p class="mb-4"><b>蔬菜、水果、穀物、堅果</b><br>大部份的植物性食物皆為低碳排放，每公斤生產碳排放約0.3~4公斤，比動物性食物低 10 倍至 50 倍。<br>※注意植物性食物中也有高碳排的食物喔！</p>
                        <p><b>選擇食物</b></p>
                        <select id="foodype" name="select" class="mnya-select" bind:value={foodtype}>
                            <option value="葉菜類">葉菜類</option>
                            <option value="根莖類">根莖類</option>
                            <option value="水果">水果</option>
                            <option value="穀物">穀物</option>
                            <option value="堅果">堅果</option>
                        </select>
<!--                        <input type="number" placeholder="份數" id="food-quantity" name="number" class="num" min="1" bind:value = {numberlow} />-->
<!--                        <button class="title" on:click={() => calculatelow(foodtype, numberlow)}><b>計算</b></button>-->
<!--                        <input type="number" placeholder="份數" id="food-quantity" name="number" class="num" min="1" bind:value = {number} />-->
<!--                        <button class="title" on:click={() => calculate(foodtype, number)}><b>計算</b></button>-->
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
                <div class="service-item rounded d-flex h-100">
                    <div class="service-text rounded p-5">
                        <div class="btn-square rounded-circle mx-auto mb-3">
                            <img class="img-fluid" src="img/icon/fish.png" alt="Icon">
                        </div>
                        <h4 class="mb-3">中碳排食物</h4>
                        <p class="mb-4"><b>養殖魚、蝦、家禽、豬肉</b><br>養殖魚類的碳排放較低，約生產每公斤有5公斤碳排放。豬肉及家禽類，每公斤碳排放分別是7公斤及6公斤。但牠們並非反芻動物，因此碳排放量較低。 </p>
                        <p><b>選擇食物</b></p>
                        <select id="fish-select" name="select" class="mnya-select" bind:value={foodtype}>
                            <option value="養殖魚">養殖魚</option>
                            <option value="養殖蝦">養殖蝦</option>
                            <option value="家禽">家禽</option>
                            <option value="豬肉">豬肉</option>
                        </select>
<!--                        <input type="number" placeholder="份數" id="fish-quantity" name="number" class="num" min="1" bind:value={numbermiddle} />-->
<!--                        <button class="title" on:click={() => calculatemiddle(foodtype, numbermiddle)}><b>計算</b></button>-->
<!--                        <input type="number" placeholder="份數" id="fish-quantity" name="number" class="num" min="1" bind:value={number} />-->
<!--                        <button class="title" on:click={() => calculate(foodtype, number)}><b>計算</b></button>-->
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
                <div class="service-item rounded d-flex h-100">
                    <div class="service-text rounded p-5">
                        <div class="btn-square rounded-circle mx-auto mb-3">
                            <img class="img-fluid" src="img/icon/cow.png" alt="Icon">
                        </div>
                        <h4 class="mb-3">高碳排食物</h4>
                        <p class="mb-4"><b>牛肉、羊肉</b><br>牛肉每公斤的碳排放為60公斤，而羊肉為24公斤 ! 牛、羊皆為反芻動物，會產生甲烷，因此牛羊碳排放較多。巧克力雖為植物性食物，但是碳排放量高為17公斤喔 ! </p>
                        <p><b>選擇食物</b></p>
                        <select id="meat-select" name="select" class="mnya-select" bind:value={foodtype}>
                            <option value="家牛">家牛</option>
                            <option value="羊肉">羊肉</option>
                        </select>
<!--                        <input type="number" placeholder="份數" id="meat-quantity" name="number" class="num" min="1" bind:value={numberhigh} />-->
<!--                        <button class="title" on:click={() => calculatehigh(foodtype, numberhigh)}><b>計算</b></button>-->
<!--                        <input type="number" placeholder="份數" id="meat-quantity" name="number" class="num" min="1" bind:value={number} />-->
<!--                        <button class="title" on:click={() => calculate(foodtype, number)}><b>計算</b></button>-->
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="text-center mx-auto wow fadeInUp" data-wow-delay="0.5s" style="max-width: 500px;">
                    <h1 class="display-5 mb-5"><br>換算結果</h1>
                </div>
                <div class="col-lg-12 order-2 order-lg-2 wow fadeInUp" data-wow-delay="0.3s">
                    <div class="block">
                        <div class="row service-parts text-center rounded">
<!--                            <div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">-->
<!--                                <div class="position-relative w-100">-->
<!--                                    <input class="form-control bg-light border-light w-100 py-3 ps-4 pe-8" type="date" placeholder="輸入日期" bind:value={date}>-->
<!--                                    &lt;!&ndash;                <DateInput bind:value={date} />&ndash;&gt;-->
<!--                                </div>-->
<!--                            </div>-->
                            <div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                                <div class="text_title">
                                    <b>日期</b>
                                    <a class="position-relative w-100">
<!--                                        <input type="date" bind:value={dateObj}/>-->
                                         <input type="date" placeholder="日期" name="date" class="form-control bg-light border-light w-100 py-4 ps-4 pe-8" bind:value={date} />
                                    </a>
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                                <div class="text_title">
                                    <b>你選擇的食物</b>
                                </div>
                                <div class="position-relative w-100" >
                                    <div class="form-control bg-light border-light w-100 py-4 ps-4 pe-8" style="height: 73px">
                                        {foodtype}
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                                <div class="text_title">
                                    <b>份數</b>
                                </div>
                                <a class="position-relative w-100">
                                    <input type="number" placeholder="份數" name="number" class="form-control bg-light border-light w-100 py-4 ps-4 pe-8" min="1" bind:value = {number} />
                                </a>
                            </div>
                            <div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                                <div class="text_title">
                                    <b>碳排放量(公斤)</b>
                                </div>
                                <div class="position-relative w-100">
                                    <div id="result" class="form-control bg-light border-light w-100 py-4 ps-4 pe-8" style="height: 73px">
                                        {result}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br>
                        <div align="center">
                        <a class="col-lg-10 col-md-6 wow fadeInUp text-center" data-wow-delay="0.1s">
                            <button class="text" type="submit" on:click={clear}><b>重置</b></button>
                        </a>
                        <a class="col-lg-10 col-md-6 wow fadeInUp text-center" data-wow-delay="0.1s">
                            <button class="text" type="submit" on:click={() => calculate(foodtype, number)}><b>計算</b></button>
                        </a>
                            {#if (user)}
                        <a class="col-lg-12 col-md-6 wow fadeInUp text-center" data-wow-delay="0.1s">
                            <button on:click={addRecord} type="submit" class="text" id="food_save"><b>儲存</b></button>
                        </a>
                            {/if}
                        </div>
                        <br>
                        <p class="error" align="center" style="color: red">{error}</p>
                    </div>
                </div>
            </div>
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
                                        <th class="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">食物種類</th>
                                        <th class="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 hidden md:table-cell">份數</th>
                                        <th class="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">碳排量（公斤）</th>
                                    </tr>
                                    </thead>
                                    <tbody class="text-gray-600 dark:text-gray-100">
                                    {#each records.filter(records => records.type === 'food' && records.userId === id) as item, i}
                                        <tr>
                                            <td class="sm:p-3 py-2 px-3 border-b border-gray-200 dark:border-gray-800">
                                                <div class="flex items-center">
                                                    <div class="sm:flex hidden flex-col">
                                                        {item.date}
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="sm:p-3 py-2 px-3 border-b border-gray-200 dark:border-gray-800">
                                                <div class="flex items-center">
                                                    <div class="sm:flex hidden flex-col">
                                                        {item.foodtype}
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="sm:p-3 py-2 px-3 border-b border-gray-200 dark:border-gray-800">
                                                <div class="flex items-center">
                                                    <div class="sm:flex hidden flex-col">
                                                        {item.number}
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="sm:p-3 py-2 px-3 border-b border-gray-200 dark:border-gray-800">
                                                <div class="flex items-center">
                                                    <div class="sm:flex hidden flex-col">
                                                        {item.i_emission.toFixed(2)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <button class="delete-button" on:click={() => deleteRecord(item.id)}>
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
</div>

<style type="text/css">
    .text {
        font-family: "Cooper Std Black";
        font-size: 15px;
        color:#32752a;
        width:60px;
        height:40px;
        background-color:#c6fac8;
        border-style:none;
        border-radius:5px;
    }

    /*.overtext {*/
    /*    font-family: "Cooper Std Black";*/
    /*    font-size: 15px;*/
    /*    color:#082b10;*/
    /*    width:60px;*/
    /*    height:40px;*/
    /*    background-color:#c6fac8;*/
    /*    border-style:none;*/
    /*    border-radius:5px;*/
    /*}*/
    /*.title {*/
    /*    font-family: "Cooper Std Black";*/
    /*    color:#32752a;*/
    /*    width:60px;*/
    /*    height:40px;*/
    /*    font-size:15px;*/
    /*    background-color:#c6fac8;*/
    /*    border-style:none;*/
    /*    border-radius:5px;*/
    /*    position:absolute;*/
    /*    top:88%;*/
    /*    left:42%;*/
    /*}*/
    /*.overtitle {*/
    /*    font-family: "Cooper Std Black";*/
    /*    color:#082b10;*/
    /*    width:60px;*/
    /*    height:40px;*/
    /*    font-size: 15px;*/
    /*    background-color:#c6fac8;*/
    /*    border-style:none;*/
    /*    border-radius:5px;*/
    /*    position:absolute;*/
    /*    top:88%;*/
    /*    left:42%;*/
    /*}*/
    .text_title {
        font-family: "Cooper Std Black";
        font-size: 20px;
        color:#32752a;
    }
    .mnya-select {
        font-size: 20px;
        color: #32752a;
        height: 30px;
        width: 100px;
        border-style:none;
        border-radius:5px;
        background-color: #c6fac8;
        /*placeholder: "請選擇";*/
    }
    /*.num {*/
    /*    font-size: 20px;*/
    /*    height: 30px;*/
    /*    width: 70px;*/
    /*    color: #32752a;*/
    /*    border-style: none;*/
    /*    border-radius: 5px;*/
    /*    background-color: #c6fac8;*/
    /*}*/
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
