<script lang="ts">
    import DataTable from './Table.svelte';

    export let menu = 1;

    const today = new Date();
    let currentMonth = today.getMonth()+1;
    let currentYear = today.getFullYear();


    let id;
    let name;
    //連到firebase
    import {initializeApp} from "firebase/app";
    import {
        getFirestore,
        getDocFromCache,
        collection,
        query,
        where,
        getDoc,
        onSnapshot,
        doc,
        updateDoc,
        deleteDoc,
        addDoc,
        Timestamp, getDocs
    } from "firebase/firestore";

    import {firebaseConfig, auth} from "../../lib/firebaseConfig";

    //登入
    import {onMount} from "svelte";

    import {onAuthStateChanged, type User} from "firebase/auth";
    import Thead from "../Thead/+page.svelte";

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

    //讀取資料
    let dataArray = [];
    const colRef = collection(db, "statistic");
    let unsubscribe = onSnapshot(colRef, (querySnapshot) => {
        let item = [];
        querySnapshot.forEach((doc) => {
            let todo = {...doc.data(), id: doc.id};
            item = [todo, ...item];
        });
        dataArray = item;
        console.table(item);
    });
    console.log({ app, db });


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
                for(var i=0; i<friendsIHave.length; i++){
                    const data = [
                        {
                            name: friendName[i],
                            id: friendsIHave[i],
                            sum_monthly_decrease: friendLoginDaysArrayMonth[i]
                        }
                    ]
                }
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
            const friendSearch = query(collection(db, 'users'));
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
            const friendSearch = query(collection(db, 'statistic'), where('yearAndMonth', '==', currentYear + '/' + currentMonth));

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
            const friendSearch = query(collection(db, 'statistic'), where('year', '==', currentYear));

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

    let data = []; //存放剛剛取得的資訊
    $: {
        // Reactive statement to update data whenever the arrays change
        data = friendsIHave.map((friend, index) => ({
            name: friendName[index],
            id: friend,
            sum_monthly_decrease: friendLoginDaysArrayMonth[index]
        }));
    }

    //
    // var friendsIHave = []; //存取自己及朋友ID
    // async function readFriendsValues() { //讀取朋友ID
    //     if(user){
    //         friendsIHave = [];
    //         const docRef = doc(db, 'users', user.uid);
    //         const docSnapshot = await getDoc(docRef);
    //         if (docSnapshot.exists()) {
    //             const data = docSnapshot.data();
    //             const friends = data.friends;//不要理紅線
    //             friendsIHave = [user.uid] //自己的ID加進去才可以有自己和朋友的數據，方便後續做排名
    //             console.log('User:', docSnapshot.id);
    //             console.log('friends:');
    //             friends.forEach((friends) => {
    //                 friendsIHave = [...friendsIHave, friends]
    //                 console.log('- ' + friends);
    //                 console.log("ArrayInSvelte: "+friendsIHave);
    //             });
    //             console.log('---------------');
    //             console.log(friendsIHave.length+"我要瘋ㄌ");
    //             for(var i=0; i<friendsIHave.length; i++){
    //                 const data = [
    //                     {
    //                         name: friendName[i],
    //                         id: friendsIHave[i],
    //                         sum_monthly_decrease: friendLoginDaysArrayMonth[i]
    //                     }
    //                 ]
    //             }
    //         } else {
    //             console.log('Document does not exist.');
    //         }
    //         friendsInfo(friendsIHave);
    //         friendsLogindaysMonth(friendsIHave)
    //         friendsLogindaysYear(friendsIHave)
    //         return friendsIHave;
    //     }
    // }
    //
    //
    // var friendName = []; //存取自己及朋友的名字
    // function friendsInfo(friendsIHave) { //讀取自己和朋友的名字
    //     console.log("ArrayInSvelte: "+friendsIHave.length);
    //     friendName = [];
    //     for (var i = 0; i < friendsIHave.length; i++) {
    //         const friendSearch = query(collection(db, 'users'));
    //         getDocs(friendSearch).then((querySnapshot) => {
    //             querySnapshot.forEach((doc) => {
    //                 const data = doc.data();
    //                 friendName = [...friendName, data.name];
    //
    //                 console.log(data.name);
    //                 console.log("friendName: " + friendName);
    //
    //             })
    //         })
    //     }
    //     return friendName[0];
    // }
    // var friendLoginDaysArrayMonth = []; //存取自己及朋友的月登入天數
    // function friendsLogindaysMonth(friendsIHave) { //讀取自己及朋友的月登入天數
    //     console.log("ArrayInSveltelo: "+friendsIHave.length);
    //     friendLoginDaysArrayMonth = [];
    //     for (var i = 0; i < friendsIHave.length; i++) {
    //         const friendSearch = query(collection(db, 'statistic'), where('yearAndMonth', '==', currentYear + '/' + currentMonth));
    //
    //         getDocs(friendSearch).then((querySnapshot) => {
    //             if(querySnapshot.empty===true){
    //                 friendLoginDaysArrayMonth  = [...friendLoginDaysArrayMonth , 0];
    //             }
    //             else{
    //                 querySnapshot.forEach((doc) => {
    //                     const data = doc.data();
    //                     friendLoginDaysArrayMonth  = [...friendLoginDaysArrayMonth , data.loginAndRecordTimes];
    //                     console.log("just check" );
    //                     console.log("friendLoginDaysArrayMonth: " + friendLoginDaysArrayMonth );
    //                 })
    //             }
    //             console.log("friendLoginDaysArrayMonth: " + friendLoginDaysArrayMonth );
    //         })
    //     }
    //     return friendLoginDaysArrayMonth;
    // }
    //
    // var friendLoginDaysArrayYear = []; //存取自己及朋友的月登入天數
    // function friendsLogindaysYear(friendsIHave) { //讀取自己及朋友的月登入天數
    //     console.log("ArrayInSveltelo: "+friendsIHave.length);
    //     friendLoginDaysArrayMonth = [];
    //     for (var i = 0; i < friendsIHave.length; i++) {
    //         const friendSearch = query(collection(db, 'statistic'), where('year', '==', currentYear));
    //
    //         getDocs(friendSearch).then((querySnapshot) => {
    //             if(querySnapshot.empty===true){
    //                 friendLoginDaysArrayYear  = [...friendLoginDaysArrayYear , 0];
    //             }
    //             else{
    //                 querySnapshot.forEach((doc) => {
    //                     const data = doc.data();
    //                     friendLoginDaysArrayYear  = [...friendLoginDaysArrayYear , data.loginAndRecordTimes];
    //                     console.log("just check" );
    //                     console.log("friendLoginDaysArrayMonth: " + friendLoginDaysArrayYear );
    //                 })
    //             }
    //             console.log("friendLoginDaysArrayMonth: " + friendLoginDaysArrayMonth );
    //         })
    //     }
    //     return friendLoginDaysArrayMonth;
    // }
    //
    // let data = []; //存放剛剛取得的資訊
    // $: {
    //     // Reactive statement to update data whenever the arrays change
    //     data = friendsIHave.map((friend, index) => ({
    //         name: friendName[index],
    //         id: friend,
    //         sum_monthly_decrease: friendLoginDaysArrayMonth[index]
    //     }));
    // }

    const columns = [{
        header: '姓名',
        accessor: 'name'
    }, {
        header: 'userID',
        accessor: 'id'
    },
        {
            header: '減少碳排量 - ' +　currentMonth + "月",
            accessor: 'sum_monthly_decrease'
        }];


    const columns2 = [{
        header: '姓名',
        accessor: 'name'
    }, {
        header: 'userID',
        accessor: 'id'
    },
        {
            header: '減少碳排量 - ' +　currentMonth + "月",
            accessor: 'sum_yearly_decrease'
        }];

    let data2 = []; //存放剛剛取得的資訊

    $: {
        // Reactive statement to update data whenever the arrays change
        data2 = friendsIHave.map((friend, index) => ({
            name: friendName[index],
            id: friend,
            sum_yearly_decrease: friendLoginDaysArrayYear[index]
        }));
    }
</script>

<!-- Page Header Start -->
<div class="container-fluid page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s">
    <div class="container text-center py-5">
        <h1 class="display-3 text-white mb-4 animated slideInDown">社群</h1>
        <nav aria-label="breadcrumb animated slideInDown">
            <ol class="breadcrumb justify-content-center mb-0">
                <li class="breadcrumb-item"><a href="#">社群</a></li>
                <li class="breadcrumb-item"><a href="#">減碳排名</a></li>

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
                                <DataTable title='本月減少碳排量排名' columns={columns} data={data} />
                            {:else if menu === 2}
                                <DataTable title='今年減少碳排量排名' columns={columns2} data={data2} />
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