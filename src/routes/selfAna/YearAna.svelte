<script lang="ts">
    import {onMount} from "svelte";
    import {onAuthStateChanged, type User} from "firebase/auth";
    import { firebaseConfig, auth, db}  from "../../lib/firebaseConfig";
    import { collection,getDocs, where, query } from "firebase/firestore";
    firebaseConfig;
    let user: User | null;

    const today = new Date();
    let currentYear = today.getFullYear();

    onMount(async () => {
        auth;
        onAuthStateChanged(auth, (newUser) => {
            user = newUser;
            if(user){
                readLastYearData();
                readLast2YearData();
                readThisYearData();
            }
        });

    });

    let lastYearDecrease;
    let lastYearIncrease;
    function readLastYearData() { //去年碳排放值
        if(user) {
            const refYear = query(collection(db, 'statistic'), where('userId', '==', user.uid), where('year', '==', currentYear-1));
            lastYearIncrease;
            lastYearDecrease;
            getDocs(refYear).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    lastYearIncrease = data.sum_yearly_increase;
                    lastYearDecrease = data.sum_yearly_decrease;
                    console.log("DE:"+lastYearDecrease+"\nIN:"+lastYearIncrease)
                    console.log(data)
                });
            });
        }
    }

    let last2YearDecrease;
    let last2YearIncrease;
    function readLast2YearData() { //去年碳排放值
        if(user) {
            const ref2Year = query(collection(db, 'statistic'), where('userId', '==', user.uid), where('year', '==', currentYear-2));
            last2YearDecrease;
            last2YearIncrease;
            getDocs(ref2Year).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    last2YearIncrease = data.sum_yearly_increase;
                    last2YearDecrease = data.sum_yearly_decrease;
                    console.log("DE:"+last2YearIncrease+"\nIN:"+last2YearIncrease)
                    console.log(data)
                });
            });
        }
    }

    let ThisYearDecrease;
    let ThisYearIncrease;
    function readThisYearData() { //去年碳排放值
        if(user) {
            const refYear = query(collection(db, 'statistic'), where('userId', '==', user.uid), where('year', '==', currentYear));
            ThisYearIncrease;
            ThisYearDecrease;
            getDocs(refYear).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    ThisYearIncrease = data.sum_yearly_increase;
                    ThisYearDecrease = data.sum_yearly_decrease;
                    console.log("DE:"+ThisYearDecrease+"\nIN:"+ThisYearIncrease)
                    console.log(data)
                });
            });
        }
    }

</script>
<div class="container-xxl py-2">
    <div class="container">
        <div class="row g-5 align-items-end">
            <div class="col-lg-3 col-md-5 wow fadeInUp" data-wow-delay="0.1s">
                <img class="img-fluid rounded" data-wow-delay="0.1s" src="img/compare.jpg" style="background-size: cover;border-radius: 5px;">
                <p>&nbsp;</p>
                <p>&nbsp;</p>
            </div>
            <div class="col-lg-6 col-md-7 wow fadeInUp" data-wow-delay="0.3s">
                <h1 class="display-5 mb-0">前兩年碳排放量比較</h1>
                <h1 class="display-5 mb-0">{currentYear-2}年 vs {currentYear-1}年</h1>
                <p>&nbsp;</p>
                <table width="100%">
                    <tr>
                        <td>
                            {#if (Math.abs(lastYearDecrease)-Math.abs(last2YearDecrease))<0}
                                <p class="text-primary mb-2" style="font-size: x-large">你超爛! </p>
                                <p>你去年比前年<a style="color: red; font-size: x-large">少減少</a>了</p>
                                <h1 class="display-1 text-primary mb-0">{Math.abs(lastYearDecrease-last2YearDecrease)} <a class="text-primary mb-2" style="font-size: large; text-align: right;">kg</a></h1>

                                {:else if (Math.abs(lastYearDecrease)-Math.abs(last2YearDecrease))>0}
                                <p class="text-primary mb-2" style="font-size: x-large">你敲ㄅㄧㄤˋ! </p>
                                <p>你去年比前年<a style="color: red; font-size: x-large">多減少</a>了</p>
                                <h1 class="display-1 text-primary mb-0">{Math.round(Math.abs(lastYearDecrease-last2YearDecrease)*1000)/1000}<a class="text-primary mb-2" style="font-size: large; text-align: right;">kg</a></h1>
                            {:else if (Math.abs(lastYearDecrease)-Math.abs(last2YearDecrease))===0}
                                <a class="text-primary mb-2">你的數據<a style="color: red">持平</a></a>
                                <h1 class="display-1 text-primary mb-0">{Math.round((lastYearIncrease-last2YearIncrease*1000))/1000}<a class="text-primary mb-2" style="font-size: large; text-align: right;">kg</a></h1>
                            {:else }
                                <a class="text-primary mb-2">你沒有相關數據<p style="color: red; font-size: x-large">連續紀錄兩年就有了喔</p></a>
                            {/if}
                            </td>
                        <td>
                            {#if (lastYearIncrease-last2YearIncrease)<0}
                                <p class="text-primary mb-2" style="font-size: x-large">你敲ㄅㄧㄤˋ! </p>
                                    <p>你去年比前年<a style="color: red; font-size: x-large">少增加</a>了</p>
                            <h1 class="display-1 text-primary mb-0">{Math.round(Math.abs(lastYearIncrease-last2YearIncrease)*1000)/1000}<a class="text-primary mb-2" style="font-size: large; text-align: right;">kg</a></h1>
                        {:else if (lastYearIncrease-last2YearIncrease)>0}
                                <p class="text-primary mb-2" style="font-size: x-large">你超爛! </p>
                                <p>你去年比前年<a style="color: red; font-size: x-large">多增加</a>了</p>
                            <h1 class="display-1 text-primary mb-0">{Math.round((lastYearIncrease-last2YearIncrease)*1000)/1000}<a class="text-primary mb-2" style="font-size: large; text-align: right;">kg</a></h1>
                        {:else if (lastYearIncrease-last2YearIncrease)===0}
                                <a class="text-primary mb-2">你的數據<a style="color: red; font-size: x-large">持平</a></a>
                                <h1 class="display-1 text-primary mb-0">{lastYearIncrease-last2YearIncrease}<a class="text-primary mb-2" style="font-size: large; text-align: right;">kg</a></h1>
                            {:else }
                                <a class="text-primary mb-2">你沒有相關數據<p style="color: red; font-size: x-large">連續紀錄兩年就有了喔</p></a>
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
                                <p>今年 ({currentYear}年)目前 : <a style="color: #2f8032; font-size: large;"> {Math.abs(ThisYearDecrease)} kg</a></p>
                                {#if last2YearIncrease!==undefined}
                                <p>去年 ({currentYear-1}年) : <a style="color: #2f8032; font-size: large;"> {Math.abs(lastYearDecrease)} kg</a></p>
                                     {:else }
                                    <p>去年 ({currentYear-1}年) : <a style="color: #2f8032; font-size: large;"> 你還沒有相關數據!</a></p>
                                    {/if}
                                {#if last2YearIncrease!==undefined}
                                <p>前年 ({currentYear-2}年) : <a style="color: #2f8032; font-size: large;"> {Math.abs(last2YearDecrease)} kg</a></p>
                                     {:else }
                                    <p>前年 ({currentYear-2}年) : <a style="color: #2f8032; font-size: large;"> 你還沒有相關數據!</a></p>
                                    {/if}
                            </span>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6 col-lg-12">
                        <div class="border-start ps-4">
                            <i class="fa fa-frown fa-3x text-primary mb-3"></i>
                            <h4 class="mb-3">增加的碳排放量</h4>
                            <span>
                                <p>今年 ({currentYear}年)目前 : <a style="color: #2f8032; font-size: large;"> {ThisYearIncrease} kg</a></p>
                                {#if lastYearIncrease!==undefined}
                                <p>去年 ({currentYear-1}年) : <a style="color: #2f8032; font-size: large;"> {lastYearIncrease} kg</a></p>
                                    {:else }
                                    <p>去年 ({currentYear-1}年) : <a style="color: #2f8032; font-size: large;"> 你還沒有相關數據!</a></p>
                                    {/if}
                                {#if last2YearIncrease!==undefined}
                                <p>前年 ({currentYear-2}年) : <a style="color: #2f8032; font-size: large;"> {last2YearIncrease} kg</a></p>
                                     {:else }
                                    <p>前年 ({currentYear-2}年) : <a style="color: #2f8032; font-size: large;"> 你還沒有相關數據!</a></p>
                                    {/if}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- About End -->