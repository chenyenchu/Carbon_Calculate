<link href="css/walk.css" rel="stylesheet" />
<script lang="ts">
    let id;
    import { collection, onSnapshot, doc,getDocs ,addDoc, deleteDoc, query, where } from "firebase/firestore";
    import { firebaseConfig, app, db, auth} from "../../lib/firebaseConfig";
    //import {DateInput} from "date-picker-svelte";

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
                const userQuery = query(collection(db, 'users'), where('userId', '==', user.uid));
                getDocs(userQuery).then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        (window as any).prechooseOil = data.gas;
                        console.log(doc.data());
                        console.log(data.gas);
                        console.log(globalThis.prechooseOil);
                    });
                }).catch((error) => {
                    console.log('Error getting documents: ', error);
                });
            } else {
                console.log('User is not logged in');
            }
        });
    });


    //定義
    let type = "";
    let number;
    let i_emission = 0;
    // let error = "";
    let createAt = new Date();

    //汽油柴油換算
    let fuelType;//選擇油的種類
    let fuelLiters;//輸入油量

    function calculate() {
        if (fuelType === "汽油") {//選擇汽油
            i_emission = fuelLiters * 2.36; // 假設每公升汽油會排放2.36公斤二氧化碳
            type = "gasoline";

        } else if (fuelType === "柴油") {//選擇柴油
            i_emission = fuelLiters * 2.77; // 假設每公升柴油會排放2.77公斤二氧化碳
            type = "diesel";
        }

    }

   // function save() {
     //   localStorage.setItem("i_emission", i_emission);
   // }

    function clear() {
        fuelLiters = "";
        i_emission = 0;
        fuelType = "";
        localStorage.removeItem("i_emission");
    }
    //汽油柴油換算結束

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
        //console.table(item);
    });
    //console.log({ app, db });

    //刪除資料
    const deleteRecord = async  (id) => {
        await deleteDoc(doc(db, "record", id));
    };

    // 日期
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
            if (i_emission === 0) {
                alert("請先計算碳排量")
            }
            if (date !== "" && fuelLiters !== "") {
                const dateObj = new Date(date);
                const docRef = await addDoc(collection(db, "record"), {
                    date: date, // 將使用者選擇的日期值代入 date 屬性
                    type: type,
                    fuelType: fuelType,
                    transportationType: "car",
                    number: fuelLiters,
                    i_emission: i_emission,
                    ieture: true,
                    userId: id,
                    createAt: createAt,
                    yyyy: dateObj.getFullYear(),
                    mm: dateObj.getMonth() + 1,
                    dd: dateObj.getDate(),
                });
                // error = "";
            }
            // else{
            // error = "請確實填寫日期及油類";
            // }
            date = "";
            fuelType = "";
            fuelLiters ="";
            i_emission = 0;
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
console.log(id)
</script>


<!-- Page Header Start -->

<div class="container-fluid page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s" style="background: linear-gradient(rgba(15, 66, 41, .6), rgba(15, 66, 41, .6)), url('/img/car_bg.jpg') center center no-repeat;
background-size: cover;">
    <div class="container text-center py-5">
        <h1 class="display-3 text-white mb-4 animated slideInDown">汽車</h1>
        <nav aria-label="breadcrumb animated slideInDown">
            <ol class="breadcrumb justify-content-center mb-0">
                <li class="breadcrumb-item"><a href="index.html">首頁</a></li>
                <li class="breadcrumb-item"><a href="personal_transport">個人運輸</a></li>
                <li class="breadcrumb-item active" aria-current="page">汽車</li>
            </ol>
        </nav>
    </div>
</div>
<!-- Page Header End -->

<!-- Compute Car Start -->
<div class="container-fluid py-5" >
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-7">
                <div class="bg-light rounded p-4 p-sm-5 wow fadeInUp" data-wow-delay="0.1s">
                    <h1 align="center" class="display-5 mb-5">計算汽車碳排量</h1>
                    <form>
                        <div class="row g-3" >
                            <div class="col-sm-15">
                                <div class="form-floating magin">
                                    <!--                                    <DateInput bind:value={date}/>-->
                                    <input type="date" class="form-control border-0"  bind:value={date}
                                           placeholder="date" data-input required>
                                    <label id="date" >日期：</label>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="form-floating">
                                    {#if globalThis.prechooseOil === "gasoline"}
                                        <select class="form-select border-0" id="fuel-type-gasoline" type="text" bind:value={fuelType} on:change={() => { fuelLiters = 0; i_emission = 0; }} required><!--當更改油的種類時，輸入的公升數及結果皆會歸零-->
                                            <option disabled>請選擇加油類型</option>
                                            <option class="fs-5 fw-bold text-primary" value="gasoline" selected = "selected">無鉛汽油</option>
                                            <option class="fs-5 fw-bold text-primary" value="diesel">柴油</option>
                                        </select>
                                        <label for="fuel-type">加油類型</label>
                                    {:else if  globalThis.prechooseOil === "diesel"}
                                        <select class="form-select border-0" id="fuel-type-diesel" type="text" bind:value={fuelType} on:change={() => { fuelLiters = 0; i_emission = 0; }} required><!--當更改油的種類時，輸入的公升數及結果皆會歸零-->
                                            <option disabled>請選擇加油類型</option>
                                            <option class="fs-5 fw-bold text-primary" value="汽油">無鉛汽油</option>
                                            <option class="fs-5 fw-bold text-primary" value="柴油" selected = "selected">柴油</option>
                                        </select>
                                        <label for="fuel-type">加油類型</label>
                                    {:else }
                                        <select class="form-select border-0" id="fuel-type" type="text" bind:value={fuelType} on:change={() => { fuelLiters = 0; i_emission = 0; }} required><!--當更改油的種類時，輸入的公升數及結果皆會歸零-->
                                            <option disabled>請選擇加油類型</option>
                                            <option class="fs-5 fw-bold text-primary" value="汽油">無鉛汽油</option>
                                            <option class="fs-5 fw-bold text-primary" value="柴油">柴油</option>
                                        </select>
                                        <label for="fuel-type">加油類型</label>
                                    {/if}

                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="form-floating">
                                    <input type="number" class="form-control border-0" placeholder="油量（公升）" min="1"  id="fuelLiters"  bind:value={fuelLiters} required />
                                    <label for="fuelLiters">油量（公升數）</label>
                                </div>
                            </div>
                            <div class="col-12 text-left">
                                <div class="form-floating">
                                    {#if i_emission > 0}
                                        <input type="text" class="form-control border-0" id="" placeholder="Result" disabled>
                                        <label>增加的碳排量為 {i_emission.toFixed(2)} 公斤二氧化碳</label>
                                    {:else}
                                        <input type="text" class="form-control border-0" id="result" placeholder="Result" disabled >
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
<!-- Compute Car End -->

<!-- Record Car Start -->
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
                            <th class="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">加油類型</th>
                            <th class="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 hidden md:table-cell">油量（公升數）</th>
                            <th class="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">增加碳排量（公斤）</th>
                        </tr>
                        </thead>


                        <tbody class="text-gray-600 dark:text-gray-100">
                        {#each records.filter(item => (item.type === 'gasoline' || item.type === 'diesel') && item.transportationType === 'car' && item.userId === user.uid ) as item, i}
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
                                            {item.fuelType}
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
                                            {item.i_emission}
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
<!-- Record Car End -->

