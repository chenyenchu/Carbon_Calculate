<script lang="ts">

    import { initializeApp,getApp, getApps } from "firebase/app";
    import {collection, addDoc, onSnapshot, query, where, getDocs, setDoc, doc, updateDoc} from "firebase/firestore";
    import { getFirestore} from "firebase/firestore";

    import { firebaseConfig, db, auth } from "../../lib/firebaseConfig.js";
    import {Timestamp} from "firebase/firestore";
    // import {query, where} from "firebase/firestore";
    // import { browser} from "$app/environment";
    import {onMount} from "svelte";
    import {onAuthStateChanged, type User} from "firebase/auth";
    import * as querystring from "querystring";
    firebaseConfig;
    let user: User | null;
    let id;

    let yearlyDeSum = 0;
    let yearlyInSum = 0;
    let dailyInSum = 0;
    let dailyDeSum = 0;
    let monthlyInSum = 0;
    let monthlyDeSum = 0;
    let allInMonthSum = 0;
    let allDeMonthSum = 0;
    let allInYearSum = 0;
    let allDeYearSum = 0;
    let i_emission;
    let d_emission;
    let sum_yearly_increase;
    let sum_yearly_decrease;
    let month_average_in=0;
    let month_average_de=0;
    let year_average_in=0;
    let year_average_de=0;
    let countMonthin;
    let countMonthde;
    let countYearin;
    let countYearde;
    let count = 0;


    // const currentDate = new Date();
    // const currentYear = currentDate.getFullYear(); // 取得當前年份//
    // const currentMonth = currentDate.getMonth(); // 取得當前月份（從零開始的索引）
    // const currentSeconds = Math.floor(currentDate.getTime() / 1000); // 轉換為秒數形式
    // console.log(currentMonth);
    // console.log(currentYear);
    // console.log(currentSeconds);

    // const startOfMonth = new Date(currentYear, currentMonth, 1); // 當月的開始日期
    // const endOfMonth = new Date(currentYear, currentMonth + 1, 0); // 當月的結束日期


    const currentDate = new Date(); // 取得當前日期和時間
    console.log(currentDate);
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // 取得當月的第一天
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // 取得當月的最後一天
    // console.log(firstDayOfMonth);
    // console.log(lastDayOfMonth);
    // let startOfMonth = new Date();
    // startOfMonth.setDate(1); // 設置為當月的第一天
    // startOfMonth.setHours(0, 0, 0, 0); // 設置時、分、秒、毫秒為 0
    // let endOfMonth = new Date();
    // endOfMonth.setMonth(endOfMonth.getMonth() + 1); // 設置為下個月
    // endOfMonth.setDate(0); // 設置為當月的最後一天
    // endOfMonth.setHours(23, 59, 59, 999); // 設置時、分、秒、毫秒為最後時間

    const currentDayOfMonth = currentDate.getDate();
    const currentMonth = currentDate.getMonth(); // Be careful! January is 0, not 1
    const currentYear = currentDate.getFullYear();
    console.log(currentYear);
    console.log(currentMonth+1);
    console.log(currentDayOfMonth);
    const firstDay = firstDayOfMonth.getDate();
    const firstmonth = firstDayOfMonth.getMonth(); // Be careful! January is 0, not 1
    const firstyear = firstDayOfMonth.getFullYear();
    console.log(firstDay);
    const firstString = firstDay + "-" +(firstmonth+1) + "-"+ firstyear;
    const EndDay = lastDayOfMonth.getDate();
    const Endmonth = lastDayOfMonth.getMonth(); // Be careful! January is 0, not 1
    const Endyear = lastDayOfMonth.getFullYear();
    console.log(EndDay);
    const lastString = EndDay + "-" +(Endmonth+1) + "-"+ Endyear;


    const dateString = currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear;
    const monthString = (currentMonth + 1) + "-" + currentYear;

    console.log(dateString);
    console.log(firstString);
    console.log(lastString);
    // const timeFirst = firstDay.getTime();






    //
    // console.log(startOfMonth);
    // console.log(endOfMonth);
    //     const current_timestamp = Timestamp.fromDate(new Date());
    //     const first_timestamp = Timestamp.fromDate(startOfMonth);
    //     const end_timestamp = Timestamp.fromDate(endOfMonth);
    //     console.log(current_timestamp);
    //     console.log(first_timestamp);
    //     console.log(end_timestamp);

    // const firstDaySeconds = Math.floor(startOfMonth.getTime() / 1000); // 第一天轉換為秒數形式
    // const lastDaySeconds = Math.floor(endOfMonth.getTime() / 1000); // 最後一天轉換為秒數形式
    // console.log(firstDaySeconds);
    // console.log(lastDaySeconds);



    // console.log(date);
    // const date = new Date();
    // let day = date.getDate();
    // let month = date.getMonth() + 1;
    // let year = date.getFullYear();
    // // This arrangement can be altered based on how we want the date's format to appear.
    // let currentDate = `${year}-${month}-${day}`;
    // console.log(currentDate);
    // console.log(date);
    let records = [];
    onMount(async () => {
        auth;
        onAuthStateChanged(auth, (newUser) => {
            user = newUser;
            const readRecord = async () => {
                if(user) {
                    const id = user.uid;

                    /*這裡是自己的加入程式碼*/
                    const record = query(collection(db, 'record'), where('userId', '==', id),where('dd','==',currentDayOfMonth));
                    getDocs(record).then((querySnapshot) => {
                        let item = [];
                        querySnapshot.forEach((doc) => {
                            let record = {...doc.data(), id: doc.id};
                            item = [record, ...item];
                        });
                        records = item;
                        console.table(item);

                    }).catch((error) => {
                        console.log('Error getting documents: ', error);
                    })

                }
                else {
                    console.log('User is not logged in');
                }
            }
            readRecord();
        });
        return records;
        console.log(records);
    });
    onMount(async () => {
        auth;
        onAuthStateChanged(auth, (newUser) => {
            user = newUser;
            const countDailyInSum = async () => {
                if(user) {
                    const id = user.uid;

                    /*這裡是自己的加入程式碼*/
                    const allInQuery = query(collection(db, 'record'), where('userId', '==', id), where('ietrue','==',true),where('dd','==',currentDayOfMonth));
                    getDocs(allInQuery).then((querySnapshot) => {
                        let item = [];
                        querySnapshot.forEach((doc) => {
                                let data = doc.data();
                                i_emission = data.i_emission;
                                item = [...item, i_emission]

                            }

                        );
                        for(var i=0; i<item.length;i++){
                            dailyInSum += item[i];
                            console.log(item[i], item);
                            console.log(dailyInSum);
                        }
                        return dailyInSum;

                    }).catch((error) => {
                        console.log('Error getting documents: ', error);
                    })





                }
                else {
                    console.log('User is not logged in');
                }
            }
            countDailyInSum();







            const countDailyDeSum = async () => {
                if(user) {
                    const id = user.uid;

                    /*這裡是自己的加入程式碼*/
                    const allInQuery = query(collection(db, 'record'), where('userId', '==', id), where('detrue','==',true),where('dd','==',currentDayOfMonth));
                    getDocs(allInQuery).then((querySnapshot) => {
                        let deSum = [];
                        querySnapshot.forEach((doc) => {
                                let data = doc.data();

                                d_emission = data.d_emission;
                                deSum = [...deSum, d_emission]
                            }

                        );

                        for(var i=0; i<deSum.length;i++){
                            dailyDeSum += deSum[i];
                            console.log(deSum[i], deSum);
                            console.log(dailyDeSum);
                        }
                        return dailyDeSum;


                    }).catch((error) => {
                        console.log('Error getting documents: ', error);
                    })





                }
                else {
                    console.log('User is not logged in');
                }
            }
            countDailyDeSum();





            const countMonthlyInSum = async () => {
                if(user) {
                    const id = user.uid;

                    /*這裡是自己的加入程式碼*/
                    const MonthInQuery = query(collection(db, 'record'), where('userId', '==', id), where('ietrue','==',true),where('mm','==',currentMonth+1));
                    getDocs(MonthInQuery).then((querySnapshot) => {

                        let inMonthAdd = [];
                        querySnapshot.forEach((doc) => {

                                let data = doc.data();

                                i_emission = data.i_emission;
                                inMonthAdd = [...inMonthAdd, i_emission]

                            }

                        );


                        for(var i=0; i<inMonthAdd.length;i++){
                            monthlyInSum += inMonthAdd[i];
                            console.log(inMonthAdd[i], inMonthAdd);
                            console.log(monthlyInSum);
                        }


                    }).catch((error) => {
                        console.log('Error getting documents: ', error);
                    })

                }
                else {
                    console.log('User is not logged in');
                }
            }
            countMonthlyInSum();


            const countMonthlyDeSum = async () => {
                if(user) {
                    const id = user.uid;

                    /*這裡是自己的加入程式碼*/
                    const MonthDeQuery = query(collection(db, 'record'), where('userId', '==', id), where('detrue','==',true),where('mm','==',currentMonth+1));
                    getDocs(MonthDeQuery).then((querySnapshot) => {

                        let deMonthAdd = [];
                        querySnapshot.forEach((doc) => {

                                let data = doc.data();

                                d_emission = data.d_emission;
                                deMonthAdd = [...deMonthAdd, d_emission]

                            }

                        );


                        for(var i=0; i<deMonthAdd.length;i++){
                            monthlyDeSum += deMonthAdd[i];
                            console.log(deMonthAdd[i], deMonthAdd);
                            console.log(monthlyDeSum);
                        }
                        // return monthlyDeSum;

                        // addUserData(monthlyDeSum,monthlyInSum);

                        // async function addUserData(monthlyDeSum,monthlyInSum) {
                        //     const userRef = await setDoc(doc(db,"users",id),
                        //         {
                        //             // acc:user,
                        //
                        //             sum_monthly_decrease: monthlyDeSum,
                        //             sum_monthly_increase:monthlyInSum,
                        //
                        //             userId:id,
                        //             month:currentMonth+1,
                        //             year: currentYear,
                        //
                        //         },
                        //         {merge:true});
                        //     // console.log('Data added:', userRef.id);
                        // }


                    }).catch((error) => {
                        console.log('Error getting documents: ', error);
                    })

                }
                else {
                    console.log('User is not logged in');
                }
            }
            countMonthlyDeSum();




            const countYearlyInSum = async () => {
                if(user) {
                    const id = user.uid;

                    /*這裡是自己的加入程式碼*/
                    const YearInQuery = query(collection(db, 'record'), where('userId', '==', id), where('ietrue','==',true),where('yyyy','==',currentYear));
                    getDocs(YearInQuery).then((querySnapshot) => {

                        let inYearAdd = [];
                        querySnapshot.forEach((doc) => {

                                let data = doc.data();
                                i_emission = data.i_emission;
                                inYearAdd = [...inYearAdd, i_emission]

                            }

                        );


                        for(var i=0; i<inYearAdd.length;i++){
                            yearlyInSum += inYearAdd[i];
                            console.log(inYearAdd[i], inYearAdd);
                            console.log(yearlyInSum);
                        }

                    }).catch((error) => {
                        console.log('Error getting documents: ', error);
                    })

                }
                else {
                    console.log('User is not logged in');
                }
            }
            countYearlyInSum();


            const countYearlyDeSum = async () => {
                if(user) {
                    const id = user.uid;

                    /*這裡是自己的加入程式碼*/
                    const YearDeQuery = query(collection(db, 'record'), where('userId', '==', id), where('detrue','==',true),where('yyyy','==',currentYear));
                    getDocs(YearDeQuery).then((querySnapshot) => {

                        let deYearAdd = [];
                        querySnapshot.forEach((doc) => {

                                let data = doc.data();

                                d_emission = data.d_emission;
                                deYearAdd = [...deYearAdd, d_emission]

                            }

                        );


                        for(var i=0; i<deYearAdd.length;i++){
                            yearlyDeSum += deYearAdd[i];
                            console.log(deYearAdd[i], deYearAdd);
                            console.log(yearlyDeSum);
                        }

                        addUserData(yearlyDeSum,yearlyInSum);
                        addUserData2(monthlyDeSum,monthlyInSum);

                        async function addUserData(yearlyDeSum,yearlyInSum) {


                            const statistic = await setDoc(doc(db,"statistic",currentYear+'-'+id),
                                {
                                    // acc:user,
                                    userId:id,
                                    sum_yearly_decrease: yearlyDeSum,
                                    sum_yearly_increase:yearlyInSum,
                                    year: currentYear,

                                    yearly_data:true
                                },
                                {merge:true});

                        }
                        async function addUserData2(monthlyDeSum,monthlyInSum) {

                            const statistic = await setDoc(doc(db,"statistic",monthString+'-'+id),
                                {
                                    // acc:user,
                                    userId:id,
                                    yearAndMonth:monthString,

                                    sum_monthly_decrease:monthlyDeSum,
                                    sum_monthly_increase:monthlyInSum,

                                    yearly_data:true
                                },
                                {merge:true});

                        }



                    }).catch((error) => {
                        console.log('Error getting documents: ', error);
                    })

                }
                else {
                    console.log('User is not logged in');
                }
            }
            countYearlyDeSum();


        });
    });





    const allSumMonthQuery = query(collection(db, 'record'), where('mm','==',currentMonth+1),where('yyyy','==',currentYear),where('ietrue','==',true));
    getDocs(allSumMonthQuery).then((querySnapshot) => {

        let allMonthAdd = [];
        querySnapshot.forEach((doc) => {

                let data = doc.data();
                i_emission = data.i_emission;
                allMonthAdd= [...allMonthAdd, i_emission]
                console.log(allMonthAdd)
                // console.table(data)

            }

        );


        for(var i=0; i<allMonthAdd.length;i++){
            allInMonthSum += allMonthAdd[i];
            console.log(allMonthAdd[i], allMonthAdd);

            console.log(allInMonthSum);

        }
        countMonthin = allInMonthSum / allMonthAdd.length;
        month_average_in = countMonthin.toFixed(2);
        console.log("Average: ", month_average_in.toFixed(2));

    }).catch((error) => {
        console.log('Error getting documents: ', error);
    })








    const allSumMonthQueryForDe = query(collection(db, 'record'), where('mm','==',currentMonth+1),where('yyyy','==',currentYear),where('detrue','==',true));
    getDocs(allSumMonthQueryForDe).then((querySnapshot) => {

        let allMonthDe = [];
        querySnapshot.forEach((doc) => {

                let data = doc.data();
                d_emission = data.d_emission;
                allMonthDe= [...allMonthDe, d_emission]
                console.log(data)
                // console.table(data)

            }

        );


        for(var i=0; i<allMonthDe.length;i++){
            allDeMonthSum += allMonthDe[i];
            console.log(allMonthDe[i], allMonthDe);
            console.log(allDeMonthSum);
        }
        countMonthde = allDeMonthSum / allMonthDe.length;
        console.log(countMonthde);
        month_average_de = Math.round(countMonthde*100)/100;
        console.log("Average: ", month_average_de);


        addUserData3(allInMonthSum,allDeMonthSum,month_average_de,month_average_in);
        addUserData4(allInYearSum,allDeYearSum,year_average_de,year_average_in);
        async function addUserData3(allInMonthSum,allDeMonthSum,month_average_de,month_average_in) {
            const userRef1 = await addDoc(collection(db,"sum_all_statistics"),
                {
                    // acc:user,

                    allInMonthSum: allInMonthSum,
                    allDeMonthSum:allDeMonthSum,
                    month_average_de:month_average_de,
                    month_average_in:month_average_in,

                    yearAndMonth:monthString

                },
                {merge:true});



        }
        async function addUserData4(allInYearSum,allDeYearSum,year_average_de,year_average_in) {
            const userRef2 = await addDoc(collection(db,"sum_all_statistics"),
                {
                    // acc:user,
                    allInYearSum:allInYearSum,
                    allDeYearSum:allDeYearSum,
                    year_average_de:year_average_de,
                    year_average_in:year_average_in,

                    year:currentYear

                },
                {merge:true});

        }

    }).catch((error) => {
        console.log('Error getting documents: ', error);
    })




    const allSumYearQuery = query(collection(db, 'record'),where('yyyy','==',currentYear),where('ietrue','==',true));
    getDocs(allSumYearQuery).then((querySnapshot) => {

        let allYearAdd = [];
        querySnapshot.forEach((doc) => {

                let data = doc.data();
                i_emission = data.i_emission;
                allYearAdd= [...allYearAdd, i_emission]
                console.log(data)
                // console.table(data)

            }

        );


        for(var i=0; i<allYearAdd.length;i++){
            allInYearSum += allYearAdd[i];
            console.log(allYearAdd[i], allYearAdd);

            console.log(allInYearSum);

        }
        countYearin = allInYearSum / allYearAdd.length;
        year_average_in = countMonthin.toFixed(2);
        console.log("Average: ", year_average_in.toFixed(2));

    }).catch((error) => {
        console.log('Error getting documents: ', error);
    })








    const allSumYearQueryForDe = query(collection(db, 'record'), where('yyyy','==',currentYear),where('detrue','==',true));
    getDocs(allSumYearQueryForDe).then((querySnapshot) => {

        let allYearDe = [];
        querySnapshot.forEach((doc) => {

                let data = doc.data();
                d_emission = data.d_emission;
                allYearDe= [...allYearDe, d_emission]
                console.log(data)
                // console.table(data)

            }

        );


        for(var i=0; i<allYearDe.length;i++){
            allDeYearSum += allYearDe[i];
            console.log(allYearDe[i], allYearDe);
            console.log(allDeYearSum);
        }
        countYearde = allDeYearSum / allYearDe.length;
        console.log(countYearde);
        year_average_de = countYearde.toFixed(2);
        console.log("Average: ", year_average_de);

    }).catch((error) => {
        console.log('Error getting documents: ', error);
    })





</script>









<!-- Page Header Start -->
<div class="container-fluid page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s" style="background: linear-gradient(rgba(15, 66, 41, .6), rgba(15, 66, 41, .6)), url('/img/records_bg.jpg') center center no-repeat;background-size: cover;">
    <div class="container text-center py-5">
        <h1 class="display-3 text-white mb-4 animated slideInDown">結算數據</h1>
        <nav aria-label="breadcrumb animated slideInDown">
            <ol class="breadcrumb justify-content-center mb-0">
                <li class="breadcrumb-item"><a href="#">Home</a></li>
                <li class="breadcrumb-item"><a href="#">Pages</a></li>
                <li class="breadcrumb-item active" aria-current="page">Final Result</li>
            </ol>
        </nav>
    </div>
</div>
<!-- Page Header End -->

<div class="container-fluid py-5">
    <div class="container">
        <div class="row gx-0">
            <div class="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
                <div class="bg-white shadow d-flex align-items-center h-100 px-5" style="min-height: 500px;">
                    <div class="d-flex">
                        <div class="flex-shrink-0 btn-lg-square rounded-circle bg-light">
                            <i class="fa fa-times text-primary"></i>
                        </div>
                        <div class="ps-3">
                            <h4>當日減少碳排</h4>
                            <span>總結今日碳排紀錄&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</span>

                            <br>
                            <br>&nbsp
                            <!--{#if (user)}-->

                            <h5>大眾運輸</h5>
                            <div class="row">
                                <div class="col-lg-8">
                                    {#each records.filter(item => item.type === 'bus'  ) as item}
                                        <span>公車</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span>{item.d_emission.toFixed(2)}kg</span>
                                    {/each}
                                    <br>
                                    {#each records.filter(item => item.type === 'mrt' ) as item}
                                        <span>捷運</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span>{item.d_emission.toFixed(2)}kg</span>
                                    {/each}
                                    <br>
                                    {#each records.filter(item => item.type === 'train' ) as item}
                                        <span>火車</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span>{item.d_emission.toFixed(2)}kg</span>
                                    {/each}
                                    <br>
                                    {#each records.filter(item => item.type === 'thsr' ) as item}
                                        <span>高鐵</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span>{item.d_emission.toFixed(2)}kg</span>
                                    {/each}
                                    <br>
                                    {#each records.filter(item => item.type === 'bike' ) as item}
                                        <span>腳踏車</span>&nbsp&nbsp&nbsp&nbsp<span>{item.d_emission.toFixed(2)}kg</span>
                                    {/each}
                                    <br>
                                    {#each records.filter(item => item.type === 'walk') as item}
                                        <span>走路</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span>{item.d_emission.toFixed(2)}kg</span>
                                    {/each}
                                </div>
                                <br><br><br><br><br><br><br><br><br><br><br><br>
                            </div>
                            <!--{:else}-->
                            <!--    <p>請登入取得資料</p>-->
                            <!--    {/if}-->


                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 wow fadeIn" data-wow-delay="0.3s">
                <div class="bg-white shadow d-flex align-items-center h-100 px-5" style="min-height: 200px;">
                    <div class="d-flex">
                        <div class="flex-shrink-0 btn-lg-square rounded-circle bg-light">
                            <i class="fa fa-users text-primary"></i>
                        </div>
                        <div class="ps-3">
                            <h4>當日增加碳排</h4>
                            <span>總結今日碳排紀錄&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</span>
                            <br>
                            <br>
                            <!--{#if (user)}-->
                            <div class="row">
                                <div class="col-lg-6">
                                    <h5>飲食－高碳排</h5>
                                    <div class="row">
                                        <div class="col-lg-10">
                                            {#each records.filter(item => item.foodtype === '家牛') as item}
                                                <span>牛肉</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span>{item.i_emission.toFixed(2)}kg</span>
                                            {/each}
                                            <br>
                                            {#each records.filter(item => item.foodtype === '羊肉') as item}
                                                <span>羊肉</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span>{item.i_emission.toFixed(2)}kg</span>
                                            {/each}
                                        </div>

                                    </div>
                                    <br>
                                    <h5>飲食－中碳排</h5>
                                    <div class="row">
                                        <div class="col-lg-10">
                                            {#each records.filter(item => item.foodtype === '養殖魚' ) as item}
                                                <span>養殖魚</span>&nbsp&nbsp&nbsp&nbsp<span>{item.i_emission.toFixed(2)}kg</span>
                                            {/each}
                                            <br>
                                            {#each records.filter(item => item.foodtype === '養殖蝦') as item}
                                                <span>養殖蝦</span>&nbsp&nbsp&nbsp&nbsp<span>{item.i_emission.toFixed(2)}kg</span>
                                            {/each}
                                            <br>
                                            {#each records.filter(item => item.foodtype === '豬肉') as item}
                                                <span>豬肉</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span>{item.i_emission.toFixed(2)}kg</span>
                                            {/each}
                                            <br>
                                            {#each records.filter(item => item.foodtype === '家禽') as item}
                                                <span>家禽</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span>{item.i_emission.toFixed(2)}kg</span>
                                            {/each}
                                        </div>

                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <h5>飲食—低碳排</h5>
                                    <div class="row">
                                        <div class="col-lg-10">
                                            {#each records.filter(item => item.foodtype === '根莖類' ) as item}
                                                <span>根莖</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span>{item.i_emission.toFixed(2)}kg</span>
                                            {/each}
                                            <br>
                                            {#each records.filter(item => item.foodtype === '葉菜類' ) as item}
                                                <span>蔬菜</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span>{item.i_emission.toFixed(2)}kg</span>
                                            {/each}
                                            <br>
                                            {#each records.filter(item => item.foodtype === '水果' ) as item}
                                                <span>水果</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span>{item.i_emission.toFixed(2)}kg</span>
                                            {/each}
                                            <br>
                                            {#each records.filter(item => item.foodtype === '穀物') as item}
                                                <span>穀物</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span>{item.i_emission.toFixed(2)}kg</span>
                                            {/each}
                                            <br>
                                            {#each records.filter(item => item.foodtype === '堅果' ) as item}
                                                <span>堅果</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span>{item.i_emission.toFixed(2)}kg</span>
                                            {/each}
                                            <br>
                                            <!--{#each records.filter(item => item.foodtype === 'coffee' ) as item}-->
                                            <!--    <span>咖啡</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span>{item.i_emission}kg</span>-->
                                            <!--{/each}-->
                                            <!--<br>-->
                                            <!--{#each records.filter(item => item.foodtype === 'choco' && item.userId === id ) as item}-->
                                            <!--    <span>巧克力</span>&nbsp&nbsp&nbsp&nbsp<span>{item.i_emission}kg</span>-->
                                            <!--{/each}-->
                                        </div>

                                    </div>
                                    <br>
                                    <h5>交通－加油量</h5>
                                    <div class="row">
                                        <div class="col-lg-10">
                                            {#each records.filter(item => item.type === 'gasoline')  as item}
                                                <span>汽油</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span>{item.i_emission}kg</span>
                                            {/each}
                                            <br>
                                            {#each records.filter(item => item.type === 'diesel' ) as item}
                                                <span>柴油</span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span>{item.i_emission}kg</span>
                                            {/each}
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <!--{:else}-->
                            <!--    <p>請登入取得資料</p>-->

                            <br>
                            <!--{/if}-->

                        </div>
                    </div>
                </div>
            </div>
            <!--            <div class="col-lg-4 wow fadeIn" data-wow-delay="0.5s">-->
            <!--                <div class="bg-white shadow d-flex align-items-center h-100 px-5" style="min-height: 160px;">-->
            <!--                    <div class="d-flex">-->
            <!--                        <div class="flex-shrink-0 btn-lg-square rounded-circle bg-light">-->
            <!--                            <i class="fa fa-phone text-primary"></i>-->
            <!--                        </div>-->
            <!--                        <div class="ps-3">-->
            <!--                            <h4>24/7 Available</h4>-->
            <!--                            <span>Clita erat ipsum lorem sit sed stet duo justo</span>-->
            <!--                        </div>-->
            <!--                    </div>-->
            <!--                </div>-->
            <!--            </div>-->
        </div>
    </div>
</div>
<!-- Feature End -->


<!-- Facts Start -->
<div class="container-fluid facts my-5 py-5" data-parallax="scroll" data-image-src="img/nature.jpeg">
    <div class="container py-5">
        <div class="row g-5">
                        <div class="col-sm-6 col-lg-4 text-center wow fadeIn" data-wow-delay="0.1s">

                            <h1 class="display-4 text-white" data-toggle="counter-up">{Math.round(dailyInSum*100)/100}</h1>
                            <span class="fs-5 fw-semi-bold text-light" align="center">個人當日總碳排累積</span>
                        </div>
                        <div class="col-sm-6 col-lg-4 text-center wow fadeIn" data-wow-delay="0.1s">
                            <h1 class="display-4 text-white" data-toggle="counter-up">{Math.round(dailyDeSum*100)/100}</h1>
                            <span class="fs-5 fw-semi-bold text-light" align="center">個人當日總碳排減少</span>

                        </div>
            <div class="col-sm-6 col-lg-4 text-center wow fadeIn" data-wow-delay="0.1s">

                <h1 class="display-4 text-white" data-toggle="counter-up">{Math.round(monthlyInSum*100)/100}</h1>
                <span class="fs-5 fw-semi-bold text-light" align="center">個人當月碳排累積</span>
            </div>
            <div class="col-sm-6 col-lg-4 text-center wow fadeIn" data-wow-delay="0.1s">

                <h1 class="display-4 text-white" data-toggle="counter-up">{Math.round(monthlyDeSum*100)/100}</h1>
                <span class="fs-5 fw-semi-bold text-light" align="center">個人當月碳排減少</span>
            </div>

            <div class="col-sm-6 col-lg-4 text-center wow fadeIn" data-wow-delay="0.1s">

                <h1 class="display-4 text-white" data-toggle="counter-up">{Math.round(yearlyInSum*100)/100}</h1>
                <span class="fs-5 fw-semi-bold text-light" align="center">個人年碳排增加</span>
            </div>
            <div class="col-sm-6 col-lg-4 text-center wow fadeIn" data-wow-delay="0.1s">

                <h1 class="display-4 text-white" data-toggle="counter-up">{Math.round(yearlyDeSum*100)/100}</h1>
                <span class="fs-5 fw-semi-bold text-light" align="center">個人年碳排減少</span>
            </div>
            <div class="col-sm-6 col-lg-4 text-center wow fadeIn" data-wow-delay="0.1s">

                <h1 class="display-4 text-white" data-toggle="counter-up">{Math.round(allInMonthSum*100)/100}</h1>
                <span class="fs-5 fw-semi-bold text-light" align="center">所有當月增加資料</span>
            </div>
            <div class="col-sm-6 col-lg-4 text-center wow fadeIn" data-wow-delay="0.1s">

                <h1 class="display-4 text-white" data-toggle="counter-up">{Math.round(allDeMonthSum*100)/100}</h1>
                <span class="fs-5 fw-semi-bold text-light" align="center">所有當月減少資料</span>
            </div>
            <div class="col-sm-6 col-lg-4 text-center wow fadeIn" data-wow-delay="0.1s">

                <h1 class="display-4 text-white" data-toggle="counter-up">{Math.round(allInYearSum*100)/100}</h1>
                <span class="fs-5 fw-semi-bold text-light" align="center">所有當年增加資料</span>
            </div>
            <div class="col-sm-6 col-lg-4 text-center wow fadeIn" data-wow-delay="0.1s">

                <h1 class="display-4 text-white" data-toggle="counter-up">{Math.round(allDeYearSum*100)/100}</h1>
                <span class="fs-5 fw-semi-bold text-light" align="center">所有當年減少資料</span>
            </div>
            <!--            <div class="col-sm-6 col-lg-4 text-center wow fadeIn" data-wow-delay="0.1s">-->

            <!--                <h1 class="display-4 text-white" data-toggle="counter-up">{month_average_in}</h1>-->
            <!--                <span class="fs-5 fw-semi-bold text-light" align="center">增加資料的平均</span>-->
            <!--            </div>-->
            <div class="col-sm-6 col-lg-4 text-center wow fadeIn" data-wow-delay="0.1s">

                <h1 class="display-4 text-white" data-toggle="counter-up">{month_average_de}</h1>
                <span class="fs-5 fw-semi-bold text-light" align="center">減少資料的平均</span>
            </div>

        </div>
    </div>
</div>
<!-- Facts End -->