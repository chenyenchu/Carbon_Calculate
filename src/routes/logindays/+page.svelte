<script lang="ts">
    import { type User, onAuthStateChanged } from "firebase/auth";
    import { onMount } from "svelte";
    import { firebaseConfig, auth, db } from "../../lib/firebaseConfig";
    import { collection, doc, getDocs, query, setDoc, where, getDoc } from "firebase/firestore";
    import DataTable from './Table.svelte';

    export let menu = 1;

    const today = new Date();
    let currentMonth = today.getMonth()+1;
    let currentYear = today.getFullYear();
    let user: User | null;

    var hasCreateAt = []; //有紀錄的時間
    onMount(async () => {
        auth;
        onAuthStateChanged(auth, (newUser) => {
            user = newUser;
            if(user) {
                const recordedMonth = query(collection(db, 'record'), where('userId', '==', user.uid));
                hasCreateAt = [];
                getDocs(recordedMonth).then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                            const data = doc.data();
                            let createAt = Math.floor(data.createAt.seconds/1000)*1000*1000; //後三位是時間，所以把它歸零以免只是同天不同時間
                            let i = 0;
                            do{
                                if(hasCreateAt[i]!=createAt){ //若日期一樣就不加入陣列
                                    hasCreateAt = [...hasCreateAt, createAt];
                                }
                                i++;
                            }while (hasCreateAt.length<i);
                        });
                    console.log(hasCreateAt.length);
                    console.log(hasCreateAt);
                });
                readFriendsValues();
            }
        });
    });
    function countThisMonth(hasCreateAt){ //這個月有登入並記錄的時間
        var  monthlyCount = 0;
        for(var countM=0; countM<hasCreateAt.length; countM++){
            let record = new Date(hasCreateAt[countM]);
            let createY =  record.getUTCFullYear();
            let createM =  record.getMonth() + 1;
            if((createY==currentYear) && (createM==currentMonth)){
                monthlyCount++;
                console.log("month: "+monthlyCount);
            }
        }
        addUserDataInMonth(monthlyCount)
        return monthlyCount;
    }

    function countThisYear(hasCreateAt){ //今年有登入並記錄的時間
        var  yearlyCount = 0;
        for(var countY=0; countY<hasCreateAt.length; countY++){
            let record = new Date(hasCreateAt[countY]);
            let createY =  record.getUTCFullYear();
            if((createY==currentYear)){
                yearlyCount++;
                console.log("year:"+yearlyCount);
            }
        }
        addUserDataInYear(yearlyCount);
        return yearlyCount;
    }

    async function addUserDataInMonth(monthlyCount) { //將這個月有登入並記錄的次數加入資料庫
        if (user){
            let yearAndMonth = currentYear+'-'+currentMonth;
            const userRef = await setDoc(doc(db,"loginDays",yearAndMonth+'-'+user.uid),
                {
                    userId: user.uid,
                    yearAndMonth:  currentYear + '/' + currentMonth,
                    loginAndRecordTimes: monthlyCount
                },
                {merge: true });
            // console.log('Data added:', userRef.id);
        }
    }

    async function addUserDataInYear(yearlyCount) { //將今年有登入並記錄的次數加入資料庫
        if (user){
            const userRef = await setDoc(doc(db,"loginDays",currentYear+'-'+user.uid),
                {
                    userId: user.uid,
                    year:  currentYear,
                    loginAndRecordTimes: yearlyCount
                },
                {merge: true });
            // console.log('Data added:', userRef.id);
        }
    }

var friendsIHave = []; //存取自己及朋友ID
    async function readFriendsValues() { //讀取朋友ID
        if(user){
            const docRef = doc(db, 'users', user.uid);
            const docSnapshot = await getDoc(docRef);
            friendsIHave = [user.uid] //自己的ID加進去才可以有自己和朋友的數據，方便後續做排名
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                const friends = data.friends;//不要理紅線
                console.log('User:', docSnapshot.id);
                console.log('friends:');
                friends.forEach((friends) => {
                    friendsIHave = [...friendsIHave, friends]
                    console.log('- ' + friends);
                    console.log("ArrayInSvelte: "+friendsIHave);
                });
                console.log('---------------');
                console.log(friendsIHave.length+"我要瘋ㄌ");
            } else {
                console.log('Document does not exist.');
            }
            friendsInfo(friendsIHave);
            friendsLogindaysMonth(friendsIHave)
            friendsLogindaysYear(friendsIHave)
            return friendsIHave;
        }
        }


    var friendName = []; //存取自己及朋友的名字
    function friendsInfo(friendsIHave) { //讀取自己和朋友的名字
        console.log("ArrayInSvelte: "+friendsIHave.length);
        friendName = [];
        for (var i = 0; i < friendsIHave.length; i++) {
            const friendSearch = query(collection(db, 'users'), where('userId', '==', friendsIHave[i]));
            getDocs(friendSearch).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    friendName = [...friendName, data.name];

                    console.log(data.name);
                    console.log("friendName: " + friendName);

                })
            })
        }
        return friendName[0];
    }

    var friendLoginDaysArrayMonth = []; //存取自己及朋友的月登入天數
    function friendsLogindaysMonth(friendsIHave) { //讀取自己及朋友的月登入天數
        console.log("ArrayInSveltelo: "+friendsIHave.length);
        friendLoginDaysArrayMonth = [];
        for (var i = 0; i < friendsIHave.length; i++) {
            const friendSearch = query(collection(db, 'loginDays'), where('userId', '==', friendsIHave[i]), where('yearAndMonth', '==', currentYear + '/' + currentMonth));

            getDocs(friendSearch).then((querySnapshot) => {
                if(querySnapshot.empty===true){
                    friendLoginDaysArrayMonth  = [...friendLoginDaysArrayMonth , 0];
                }
                else{
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        friendLoginDaysArrayMonth  = [...friendLoginDaysArrayMonth , data.loginAndRecordTimes];
                        console.log("just check" );
                        console.log("friendLoginDaysArrayMonth: " + friendLoginDaysArrayMonth );
                    })
                }
                console.log("friendLoginDaysArrayMonth: " + friendLoginDaysArrayMonth );
            })
        }
        return friendLoginDaysArrayMonth;
    }

    var friendLoginDaysArrayYear = []; //存取自己及朋友的月登入天數
    function friendsLogindaysYear(friendsIHave) { //讀取自己及朋友的月登入天數
        console.log("ArrayInSveltelo: "+friendsIHave.length);
        friendLoginDaysArrayMonth = [];
        for (var i = 0; i < friendsIHave.length; i++) {
            const friendSearch = query(collection(db, 'loginDays'), where('userId', '==', friendsIHave[i]), where('year', '==', currentYear));

            getDocs(friendSearch).then((querySnapshot) => {
                if(querySnapshot.empty===true){
                    friendLoginDaysArrayYear  = [...friendLoginDaysArrayYear , 0];
                }
                else{
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        friendLoginDaysArrayYear  = [...friendLoginDaysArrayYear , data.loginAndRecordTimes];
                        console.log("just check" );
                        console.log("friendLoginDaysArrayMonth: " + friendLoginDaysArrayYear );
                    })
                }
                console.log("friendLoginDaysArrayMonth: " + friendLoginDaysArrayMonth );
            })
        }
        return friendLoginDaysArrayMonth;
    }

    const columns = [{
        header: '姓名',
        accessor: 'name'
    }, {
        header: 'userID',
        accessor: 'id'
    },
        {
            header: '登入天數 - ' +　currentMonth + "月",
            accessor: 'days'
        }];

    let data = []; //存放剛剛取得的資訊

    $: {
        // Reactive statement to update data whenever the arrays change
        data = friendsIHave.map((friend, index) => ({
            name: friendName[index],
            id: friend,
            days: friendLoginDaysArrayMonth[index]
        }));
    }

    const columns2 = [{
        header: '姓名',
        accessor: 'name'
    }, {
        header: 'userID',
        accessor: 'id'
    },
        {
            header: '登入天數 - ' +　currentYear + "年",
            accessor: 'days'
        }];

    let data2 = []; //存放剛剛取得的資訊

    $: {
        // Reactive statement to update data whenever the arrays change
        data2 = friendsIHave.map((friend, index) => ({
            name: friendName[index],
            id: friend,
            days: friendLoginDaysArrayYear[index]
        }));
    }
</script>

<div class="container-fluid page-header py-3 mb-5 wow fadeIn" data-wow-delay="0.1s" style="
background: linear-gradient(rgba(15, 66, 41, .6), rgba(15, 66, 41, .6)), url('/img/loginDays.jpg') center center no-repeat;
background-size: cover;">
    <div class="container text-center py-5">
        {#if user}
            <h1 class="display-3 text-white mb-4 animated slideInDown">嗨噗~{user.email}!</h1>
            <h1 class="display-3 text-white mb-4 animated slideInDown">自註冊以來你已經紀錄了 {hasCreateAt.length} 天</h1>
            <p class="text-white"></p>
            <p class="text-white"></p>
        {:else}
            <p class="text-white">You are not logged in.</p>
        {/if}

        <nav aria-label="breadcrumb animated slideInDown">
            <ol class="breadcrumb justify-content-center mb-0">
                <li class="breadcrumb-item"><a href="/">首頁</a></li>
                {#if user}
                <li class="breadcrumb-item"><a href="#">結算數據</a></li>
                {/if}
                <li class="breadcrumb-item active" aria-current="">猜猜換算</li>
            </ol>
        </nav>
    </div>
</div>

<!-- Page Header End -->

<div class="container-fluid py-5">
    <div class="container">
        <div class="row gx-0">
            <div class="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
                <div class="bg-white shadow d-flex align-items-center h-75 px-5" style="min-height: 400px;">
                    <div class="d-flex">
                        <div class="flex-shrink-0 btn-lg-square rounded-circle bg-light">
                            <i class="fa fa-times text-primary"></i>
                        </div>
                        <div class="ps-3">
                            <h4>月登入天數</h4>
                            <span>總結當月登入及使用系統天數&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</span>

                            <br>
                            <br>&nbsp
                            <h5><h1 align="center"> {countThisMonth(hasCreateAt)} 天</h1>是你 <a style="color: palevioletred"> {currentMonth}月 </a>登入並記錄碳排放量的天數喔!</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 wow fadeIn" data-wow-delay="0.3s">
                <div class="bg-white shadow d-flex align-items-center h-75 px-5" style="min-height: 400px;">
                    <div class="d-flex">
                        <div class="flex-shrink-0 btn-lg-square rounded-circle bg-light">
                            <i class="fa fa-users text-primary"></i>
                        </div>
                        <div class="ps-3">
                            <h4>年登入天數</h4>
                            <span>總結當年登入及使用系統天數&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</span>
                            <br>
                            <br>&nbsp
                            <h5><h1 align="center">{countThisYear(hasCreateAt)} 天 </h1> 是你 <a style="color: palevioletred"> {currentYear}年 </a>登入並記錄碳排放量的天數ㄛ! </h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="container-xxl py-5">
    <div class="container">
            <div class="container-fluid py-5 bg-light">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-lg-11">
                            <div class="bg-light rounded p-8 p-sm-8 wow fadeInUp" data-wow-delay="0.1s"><!--歷史紀錄底色-->
                                <ul id="menu" style="font-size: x-large;">
                                    <li><a href="/" on:click|preventDefault={() => (menu = 1)}>本月</a></li> |
                                    <li><a href="/" on:click|preventDefault={() => (menu = 2)}>今年</a></li>
                                </ul>
                                {#if menu === 1}
                                    <DataTable title='本月登入天數好友排名' columns={columns} data={data} />
                                {:else if menu === 2}
                                    <DataTable title='今年登入天數好友排名' columns={columns2} data={data2} />
                                {:else}
                                    <h1>
                                        Page Not Found
                                    </h1>
                                {/if}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
</div>
<style>
    ul#menu li{
        display : inline;
    }
</style>