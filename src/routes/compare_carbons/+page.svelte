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

    var friendsIHave = []; //存取自己及朋友ID
    async function readFriendsValues() { //讀取朋友ID
        if(user){
            friendsIHave = [];
            const docRef = doc(db, 'users', user.uid);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                const friends = data.friends;//不要理紅線
                friendsIHave = [user.uid] //自己的ID加進去才可以有自己和朋友的數據，方便後續做排名
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
            console.log("朋友陣列長度",friendsIHave)
            const friendSearch = query(collection(db, 'users'), where('userId', '==', friendsIHave[i]));
            getDocs(friendSearch).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    friendName = [...friendName, data.name];

                    console.log("第",i,"次加入了",data.name);
                    console.log("friendName: " + friendName);

                })
            })
        }
        return friendName[0];
    }

    var friendCarbonMonth = []; //自己與朋友的減碳量
    function friendsLogindaysMonth(friendsIHave) { //讀取自己及朋友的月登入天數
        console.log("ArrayInSveltelo: "+friendsIHave.length);
        friendCarbonMonth = [];
        //去Statistic下面找所有朋友的userId的詳細資訊
        for (var i = 0; i < friendsIHave.length; i++) {
            const friendSearch = query(collection(db, 'statistic'), where('userId', '==', friendsIHave[i]), where('yearAndMonth', '==', currentMonth + '-' + currentYear));
            console.log()
            console.log("友直嗎",friendSearch)
            getDocs(friendSearch).then((querySnapshot) => {
                console.log("這甚麼?",querySnapshot)
                if(querySnapshot.empty===true){
                    friendCarbonMonth  = [...friendCarbonMonth,0];
                    console.log("這三小",friendCarbonMonth)
                }
                else{
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        friendCarbonMonth  = [...friendCarbonMonth,data.sum_monthly_decrease];
                        console.log("just check" );
                        console.log("friendCarbonMonth: " + friendCarbonMonth );
                    })
                }
                console.log("friendCarbonMonth: " + friendCarbonMonth );
            })
        }
        return friendCarbonMonth;
    }

    var friendCarbonYear= []; //存取自己及朋友的月登入天數
    function friendsLogindaysYear(friendsIHave) { //讀取自己及朋友的月登入天數
        console.log("ArrayInSveltelo: "+friendsIHave.length);
        friendCarbonYear = [];
        for (var i = 0; i < friendsIHave.length; i++) {
            const friendSearch = query(collection(db, 'loginDays'), where('userId', '==', friendsIHave[i]), where('year', '==', currentYear));

            getDocs(friendSearch).then((querySnapshot) => {
                if(querySnapshot.empty===true){
                    friendCarbonYear  = [...friendCarbonYear , 0];
                }
                else{
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        friendCarbonYear  = [...friendCarbonYear , data.loginAndRecordTimes];
                        console.log("just check" );
                        console.log("friendCarbonMonth: " + friendCarbonYear );
                    })
                }
                console.log("friendCarbonMonth: " + friendCarbonMonth );
            })
        }
        return friendCarbonMonth;
    }

    const columns = [{
        header: '姓名',
        accessor: 'name'
    }, {
        header: 'userID',
        accessor: 'id'
    },
        {
            header: currentMonth + "月碳排放量比較",
            accessor: 'carbonMonthly'
        }];

    let data = []; //存放剛剛取得的資訊

    $: {
        // Reactive statement to update data whenever the arrays change
        data = friendsIHave.map((friend, index) => ({
            name: friendName[index],
            id: friend,
            carbonMonthly: Math.abs(friendCarbonMonth[index])
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
            header: currentYear + "年碳排放量比較",
            accessor: 'carbonYearly'
        }];

    let data2 = []; //存放剛剛取得的資訊

    $: {
        // Reactive statement to update data whenever the arrays change
        data2 = friendsIHave.map((friend, index) => ({
            name: friendName[index],
            id: friend,
            carbonYearly: Math.abs(friendCarbonYear[index])
        }));
    }
</script>

<div class="container-fluid page-header py-3 mb-5 wow fadeIn" data-wow-delay="0.1s" style="
background: linear-gradient(rgba(15, 66, 41, .6), rgba(15, 66, 41, .6)), url('/img/ranking.jpg') center center no-repeat;
background-size: cover;">
    <div class="container text-center py-5">
        {#if user}
            <h1 class="display-3 text-white mb-4 animated slideInDown">嗨噗~{user.email}!</h1>
            <h1 class="display-3 text-white mb-4 animated slideInDown">一起來打敗好友吧</h1>
            <p class="text-white"></p>
            <p class="text-white"></p>
        {:else}
            <p class="text-white">You are not logged in.</p>
        {/if}

        <nav aria-label="breadcrumb animated slideInDown">
            <ol class="breadcrumb justify-content-center mb-0">
                <li class="breadcrumb-item"><a href="/">首頁</a></li>
                {#if user}
                    <li class="breadcrumb-item"><a href="#">社群</a></li>
                {/if}
                <li class="breadcrumb-item active" aria-current="">相對減少量排行</li>
            </ol>
        </nav>
    </div>
</div>

<!-- Page Header End -->
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
                                <DataTable title='本月減碳數量好友排名' columns={columns} data={data} />
                            {:else if menu === 2}
                                <DataTable title='今年減碳數量好友排名' columns={columns2} data={data2} />
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