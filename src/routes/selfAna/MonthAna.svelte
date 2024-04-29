<script lang="ts">
    import {onMount} from "svelte";
    import {onAuthStateChanged, type User} from "firebase/auth";
    import { firebaseConfig, auth, db}  from "../../lib/firebaseConfig";
    import { collection,getDocs, where, query } from "firebase/firestore";
    firebaseConfig;
    let user: User | null;
    const today = new Date();
    let currentMonth = today.getMonth()+1;
    let currentYear = today.getFullYear();
    onMount(async () => {
        auth;
        onAuthStateChanged(auth, (newUser) => {
            user = newUser;
            if (user) {
                readLastMonthData();
                readLast2MonthData();
                readThisMonthData();
            }
        });
    });
    let lastMonthDecrease;
    let lastMonthIncrease;
    function readLastMonthData() { //去年碳排放值
        if(user) {
            const refYear = query(collection(db, 'statistic'), where('userId', '==', user.uid), where('yearAndMonth', '==', currentMonth-1+'-'+currentYear));
            lastMonthIncrease;
            lastMonthDecrease;
            getDocs(refYear).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    lastMonthIncrease = data.sum_monthly_increase;
                    lastMonthDecrease = data.sum_monthly_decrease;
                    console.log("DE:"+lastMonthDecrease+"\nIN:"+lastMonthIncrease)
                    console.log(data)
                });
            });
        }
    }

    let last2MonthDecrease;
    let last2MonthIncrease;
    function readLast2MonthData() { //去年碳排放值
        if(user) {
            const ref2Year = query(collection(db, 'statistic'), where('userId', '==', user.uid), where('yearAndMonth', '==', currentMonth-2+'-'+currentYear));
            last2MonthDecrease;
            last2MonthIncrease;
            getDocs(ref2Year).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    last2MonthIncrease = data.sum_monthly_increase;
                    last2MonthDecrease = data.sum_monthly_decrease;
                    console.log("DE:"+last2MonthIncrease+"\nIN:"+last2MonthIncrease)
                    console.log(data)
                });
            });
        }
    }

    let ThisMonthDecrease;
    let ThisMonthIncrease;
    function readThisMonthData() { //去年碳排放值
        if(user) {
            const refYear = query(collection(db, 'statistic'), where('userId', '==', user.uid), where('yearAndMonth', '==', currentMonth+'-'+currentYear));
            ThisMonthIncrease;
            ThisMonthDecrease;
            getDocs(refYear).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    ThisMonthIncrease = data.sum_monthly_increase;
                    ThisMonthDecrease = data.sum_monthly_decrease;
                    console.log("DE:"+ThisMonthDecrease+"\nIN:"+ThisMonthIncrease)
                    console.log(data)
                });
            });
        }
    }
</script>
<div class="container-xxl py-2" >
    <div class="container" >
        <div class="row g-5 align-items-end">
            <div class="col-lg-3 col-md-5 wow fadeInUp" data-wow-delay="0.1s">
                <img class="img-fluid rounded" data-wow-delay="0.1s" src="img/compare.jpg" style="background-size: cover;border-radius: 5px;">
                <p>&nbsp;</p>
                <p>&nbsp;</p>
            </div>
            <div class="col-lg-6 col-md-2 wow fadeInUp" data-wow-delay="0.3s" >
                <h1 class="display-5 mb-0">前兩月數據比較 </h1>
                <h1 class="display-5 mb-0">{currentMonth-2}月 vs {currentMonth-1}月</h1>
                <p>&nbsp;</p>
                <table width="100%">
                    <tr>
                        <td>
                            {#if (Math.abs(lastMonthDecrease)-Math.abs(last2MonthDecrease))<0}
                                <p class="text-primary mb-2" style="font-size: x-large">你超爛! </p>
                                <p class="text-primary mb-2">你上個月比前兩個月<a style="color: red; font-size: x-large">少減少</a>了</p>
                                <h1 class="display-1 text-primary mb-0">{Math.round(Math.abs(lastMonthDecrease-last2MonthDecrease)*1000)/1000} <a class="text-primary mb-2" style="font-size: large; text-align: right;">kg</a></h1>

                            {:else if (Math.abs(lastMonthDecrease)-Math.abs(last2MonthDecrease))>0}
                                <p class="text-primary mb-2" style="font-size: x-large">你敲ㄅㄧㄤˋ! </p>
                                <p class="text-primary mb-2">你上個月比前兩個月<a style="color: red; font-size: x-large">多減少</a>了</p>
                                <h1 class="display-1 text-primary mb-0">{Math.round(Math.abs(lastMonthDecrease-last2MonthDecrease)*1000)/1000}<a class="text-primary mb-2" style="font-size: large; text-align: right;">kg</a></h1>
                            {:else if (Math.abs(lastMonthDecrease)-Math.abs(last2MonthDecrease))===0}
                                <a class="text-primary mb-2">你的數據<a style="color: red; font-size: x-large">持平</a></a>
                                <h1 class="display-1 text-primary mb-0">{lastMonthIncrease-last2MonthIncrease}<a class="text-primary mb-2" style="font-size: large; text-align: right;">kg</a></h1>
                                {:else}
                                <a class="text-primary mb-2">你沒有相關數據<p style="color: red; font-size: x-large">連續紀錄兩個月就有了喔</p></a>
                            {/if}
                        </td>
                        <td>
                            {#if (lastMonthIncrease-last2MonthIncrease)<0}
                                <p class="text-primary mb-2" style="font-size: x-large">你敲ㄅㄧㄤˋ! </p>
                                <p class="text-primary mb-2">你上個月比前兩個月<a style="color: red; font-size: x-large">少增加</a>了</p>
                                <h1 class="display-1 text-primary mb-0">{Math.abs(lastMonthIncrease-last2MonthIncrease)}<a class="text-primary mb-2" style="font-size: large; text-align: right;">kg</a></h1>
                            {:else if (lastMonthIncrease-last2MonthIncrease)>0}
                                <p class="text-primary mb-2" style="font-size: x-large">你超爛! </p>
                                <p class="text-primary mb-2">你上個月比前兩個月<a style="color: red; font-size: x-large">多增加</a>了</p>
                                <h1 class="display-1 text-primary mb-0">{lastMonthIncrease-last2MonthIncrease}<a class="text-primary mb-2" style="font-size: large; text-align: right;">kg</a></h1>
                            {:else if (lastMonthIncrease-last2MonthIncrease)===0}
                                <a class="text-primary mb-2">你的數據<a style="color: red; font-size: x-large">持平</a></a>
                                <h1 class="display-1 text-primary mb-0">{lastMonthIncrease-last2MonthIncrease}<a class="text-primary mb-2" style="font-size: large; text-align: right;">kg</a></h1>
                                {:else }
                                <a class="text-primary mb-2">你沒有相關數據<p style="color: red; font-size: x-large">連續紀錄兩個月就有了喔</p></a>
                            {/if}</td>
                    </tr>
                </table>
                <p>&nbsp;</p>
                <a class="btn btn-primary py-3 px-4" href="finalDataPre">查看總結</a>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
            </div>
            <div class="col-lg-3 col-md-12 wow fadeInUp" data-wow-delay="0.5s">
                <div class="row g-5">
                    <div class="col-12 col-sm-6 col-lg-12">
                        <div class="border-start ps-4">
                            <i class="fa fa-leaf fa-3x text-primary mb-3"></i>
                            <h4 class="mb-3">相對減少的碳排放量</h4>
                            <span>
                                <p>本月 ({currentMonth}月)目前 : <a style="color: #2f8032; font-size: large;"> {Math.abs(ThisMonthDecrease)} kg</a></p>
                                {#if lastMonthDecrease!==undefined}
                                <p>上月 ({currentMonth-1}月) :  <a style="color: #2f8032; font-size: large;"> {Math.abs(lastMonthDecrease)} kg</a></p>
                                    {:else }
                                     <p>上月 ({currentMonth-1}月) : <a style="color: #2f8032; font-size: large;"> 你還沒有相關數據!</a></p>
                                    {/if}
                                {#if lastMonthDecrease!==undefined}
                                <p>上上月 ({currentMonth-2}月) : <a style="color: #2f8032; font-size: large;"> {Math.abs(last2MonthDecrease)} kg</a></p>
                            {:else }
                                    <p>上上月 ({currentMonth-2}月) : <a style="color: #2f8032; font-size: large;"> 你還沒有相關數據!</a></p>
                                {/if}

                        </span>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6 col-lg-12">
                        <div class="border-start ps-4">
                            <i class="fa fa-frown fa-3x text-primary mb-3"></i>
                            <h4 class="mb-3">增加的碳排放量</h4>
                            <span>
                                <p>本月 ({currentMonth}月)目前 : <a style="color: #2f8032; font-size: large;"> {ThisMonthIncrease} kg</a></p>

                                <p>上月 ({currentMonth-1}月) :
                                    {#if lastMonthIncrease!==undefined}
                                    <a style="color: #2f8032; font-size: large;"> {lastMonthIncrease} kg</a>
                                    {:else }
                                        <a style="color: #2f8032; font-size: large;"> 你還沒有相關數據!</a>
                                    {/if}
                                </p>

                                <p>上上月 ({currentMonth-2}月) :
                                    {#if last2MonthIncrease!==undefined}
                                    <a style="color: #2f8032; font-size: large;"> {last2MonthIncrease} kg</a>
                                        {:else }
                                        <a style="color: #2f8032; font-size: large;"> 你還沒有相關數據!</a>
                                    {/if}
                                </p>

                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- About End -->