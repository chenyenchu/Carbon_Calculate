<script lang="ts">
    import {onMount} from "svelte";
    import {onAuthStateChanged, signOut, type User} from "firebase/auth";
    import { firebaseConfig, auth, db}  from "../../lib/firebaseConfig";
    import { collection,getDocs, where, query } from "firebase/firestore";
    import { Dialog } from 'svelte-materialify';
    firebaseConfig;
    let user: User | null;

    const today = new Date();
    let currentMonth = today.getMonth()+1;
    let currentYear = today.getFullYear();
    //使用者在各Dialog輸入的值
    let user_input_v, user_input_m, user_input_pt, user_input_bt, user_input_b, user_input_t,
        user_input_ac, user_input_game, user_input_concert, user_input_shoe, user_input_cup, user_input_cloth;

    //用總碳排換算的彈出框
    let video_active, movie_active, plant_tree_active, burn_tree_active, beer_active, tissue_active,
        ac_active, game_active, concert_active, shoe_active, cup_active, cloth_active;

    //用輸入計算的彈出框
    let video_input, movie_input, plant_tree_input, burn_tree_input, beer_input, tissue_input,
        ac_input, game_input, concert_input, shoe_input, cup_input, cloth_input;

    onMount(async () => {
        auth;
        onAuthStateChanged(auth, (newUser) => {
            user = newUser;
            if (user) {
                const userQuery = query(collection(db, 'statistic'), where('userId', '==', user.uid), where('year', '==', currentYear));
                getDocs(userQuery).then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        (window as any).sum_increase = data.sum_yearly_increase;
                        (window as any).sum_decrease = data.sum_yearly_decrease;
                        console.log(doc.data());
                    });
                }).catch((error) => {
                    console.log('Error getting documents: ', error);
                });
            } else {
                console.log('User is not logged in');
            }
        });
    });

/*          const readDoc = async() => {
            const userRef = doc(db, "users", id);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                console.log("Document data:", userSnap.data());
            } else {
                // userSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        };
        readDoc();
    */

</script>

<!-- Page Header Start -->
<div class="container-fluid page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s" style="
background: linear-gradient(rgba(15, 66, 41, .6), rgba(15, 66, 41, .6)), url('/img/fun_trans1.jpg') center center no-repeat;
background-size: cover;">
    <div class="container text-center py-5">
        <h1 class="display-3 text-white mb-4 animated slideInDown">猜猜換算</h1>
        <nav aria-label="breadcrumb animated slideInDown">
            <ol class="breadcrumb justify-content-center mb-0">
                <li class="breadcrumb-item"><a href="/">首頁</a></li>
                <li class="breadcrumb-item"><a href="#">結算數據</a></li>
                <li class="breadcrumb-item active" aria-current="">猜猜換算</li>
            </ol>
        </nav>
    </div>
</div>
<!-- Page Header End -->

<!-- Projects Start -->
<div class="container-xxl py-5">
    <div class="container">
        <div class="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style="max-width: 500px;">
            <p class="fs-5 fw-bold text-primary">猜猜換算</p>
            <h1 class="display-5 mb-5">將你的碳放數據<p>以生活中的事物換算</p></h1>
        </div>
        <div class="row wow fadeInUp" data-wow-delay="0.3s">
            <div class="col-12 text-center">
                <ul class="list-inline rounded mb-5" id="portfolio-flters">
                    <li class="mx-2 active" data-filter="*">全部</li>
                    <li class="mx-2" data-filter=".first">事</li>
                    <li class="mx-2" data-filter=".second">物</li>
                </ul>
            </div>
        </div>
        <div class="row g-2 portfolio-container">
            <div class="col-lg-3 col-md-3 portfolio-item first wow fadeInUp" data-wow-delay="0.1s">
                <div class="portfolio-inner rounded">
                    <img class="img-fluid" src="img/video_icon.jpg" alt="">
                    <div class="portfolio-text">
                        <h4 class="text-white mb-4">追劇</h4>
                        <div class="d-flex">
                            <Dialog class="pa-4 text-center bg-white" bind:active={video_active}>
                                <p style="line-height: 5px;">&nbsp;</p>
                                <p>&emsp;追劇一小時的碳排放量約為 <b style="font-size: large"> 0. 0036</b> 公斤</p>
                                <img src="img/icon/video_in_dialog2.gif" style="width: 40%; border-radius: 2px;">
                                <p style="line-height: 3px;">&nbsp;</p>
                                <p>&emsp;您今年目前<b style="color: darkseagreen">製造</b>的總碳排量為 <b style="font-size: large">{globalThis.sum_increase}</b>公斤，</p>
                                <p>&emsp;約相當於追了<b style="font-size: large"> {Math.round(globalThis.sum_increase/0.0036)}</b>小時的劇</p>
                                <p>&emsp;您今年目前<b style="color: darkseagreen">相對減少</b>的總碳排量為 <b style="font-size: large">{globalThis.sum_decrease}</b>公斤，</p>
                                <p>&emsp;約相當於追了<b style="font-size: large"> {Math.round(globalThis.sum_decrease/0.0036)}</b>小時的劇</p>
                            </Dialog>
                            {#if user}
                            <a class="btn btn-lg-square rounded-circle mx-2 popup-btn"><i class="fa fa-eye" on:click={() => (video_active = true)}></i></a>
                            {/if}
                            <Dialog class="pa-4 text-center bg-white" bind:active={video_input}>
                                <p style="line-height: 5px;">&nbsp;</p>
                                <p>&emsp;追劇一小時的碳排放量約為 <b style="font-size: large"> 0. 0036</b> 公斤</p>
                                <img src="img/icon/video_in_dialog2.gif" style="width: 40%; border-radius: 2px;">
                                <p style="line-height: 3px;">&nbsp;</p>
                                <p>如果我看劇 <input id="user_input" type="text" placeholder="你想看幾小時ㄋ?" bind:value={user_input_v}/> 小時</p>
                                <p>&emsp;我<b style="color: darkseagreen">將製造 </b><b style="font-size: large"> { 0.0036*user_input_v } </b>公斤的碳排放量，</p>
                                <p>&emsp;也就是說若你少看 {user_input_v} 小時的劇</p>
                                <p>&emsp;您可以<b style="color: darkseagreen">減少 </b><b style="font-size: large"> { 0.0036*user_input_v } </b>公斤的碳排放量</p>
                            </Dialog>
                            <a class="btn btn-lg-square rounded-circle mx-2"><i class="fa fa-calculator" on:click={() => (video_input = true)}></i></a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-3 portfolio-item first wow fadeInUp" data-wow-delay="0.3s">
                <div class="portfolio-inner rounded">
                    <img class="img-fluid" src="img/movie_icon.jpg" alt="">
                    <div class="portfolio-text">
                        <h4 class="text-white mb-4">製作電影</h4>
                        <div class="d-flex">
                            {#if user}
                            <Dialog class="pa-4 text-center bg-white" bind:active={movie_active}>
                                <p style="line-height: 5px;">&nbsp;</p>
                                <p>&emsp;製作一部主力大片平均會產生 <b style="font-size: large"> 2840000</b> 公斤的碳排放量</p>
                                <img src="img/icon/movie_in_dialog.gif" style="width: 40%; border-radius: 5px">
                                <p style="line-height: 3px;">&nbsp;</p>
                                <p>&emsp;您今年目前<b style="color: darkseagreen">製造</b>的總碳排量為 <b style="font-size: large"> {globalThis.sum_increase} </b> 公斤</p>
                                <p>&emsp;相當於製作 <b style="font-size: large"> {globalThis.sum_increase/284000} </b> 部電影</p>
                                <p>&emsp;您今年目前<b style="color: darkseagreen">相對減少</b>的總碳排量為 <b style="font-size: large"> {globalThis.sum_decrease} </b> 公斤</p>
                                <p>&emsp;相當於製作 <b style="font-size: large"> {globalThis.sum_decrease/284000} </b> 部電影</p>
                            </Dialog>
                            <a class="btn btn-lg-square rounded-circle mx-2" ><i class="fa fa-eye" on:click={() => (movie_active = true)}></i></a>
                            {/if}
                            <Dialog class="pa-4 text-center bg-white" bind:active={movie_input}>
                                <p style="line-height: 5px;">&nbsp;</p>
                                <p>&emsp;製作一部主力大片平均會產生 <b style="font-size: large"> 2840000</b> 公斤的碳排放量</p>
                                <img src="img/icon/movie_in_dialog.gif" style="width: 40%; border-radius: 5px">
                                <p style="line-height: 3px;">&nbsp;</p>
                                <p> <input type="text" placeholder="寫出你想寫的碳排放量" bind:value={user_input_m}/> 公斤的碳排放</p>
                                <p>&emsp;只相當於製作 <b style="font-size: large; color: darkseagreen;"> { user_input_m/2840000 } </b> 部電影</p>
                            </Dialog>
                            <a class="btn btn-lg-square rounded-circle mx-2" ><i class="fa fa-calculator" on:click={() => (movie_input = true)}></i></a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-3 portfolio-item first wow fadeInUp" data-wow-delay="0.1s">
                <div class="portfolio-inner rounded">
                    <img class="img-fluid" src="img/tree.jpg" alt="">
                    <div class="portfolio-text">
                        <h4 class="text-white mb-4">種樹</h4>
                        <div class="d-flex">
                            {#if user}
                            <Dialog class="pa-4 text-center bg-white " bind:active={plant_tree_active}>
                                <p style="line-height: 5px;">&nbsp;</p>
                                <p>&emsp;每棵樹一年約可以吸收<b style="font-size: large"> 5-10</b>公斤的碳排放量</p>
                                <img src="img/icon/plant_tree_in_dialog.gif" style="width: 40%; border-radius: 2px;">
                                <p style="line-height: 3px;">&nbsp;</p>
                                <p>&emsp;您今年目前<b style="color: darkseagreen">製造</b>的總碳排量為 <b style="font-size: large">{globalThis.sum_increase}</b> 公斤，</p>
                                <p>&emsp;約需 <b style="font-size: large">{Math.round(globalThis.sum_increase/9)}</b> 棵樹才能吸收您的碳排放量</p>
                                <p>&emsp;您今年目前<b style="color: darkseagreen">相對減少</b>的總碳排量為 <b style="font-size: large">{globalThis.sum_decrease}</b> 公斤，</p>
                                <p>&emsp;約相當於種了 <b style="font-size: large">{Math.round(globalThis.sum_decrease/9)}</b> 棵樹</p>
                            </Dialog>
                            <a class="btn btn-lg-square rounded-circle mx-2"><i class="fa fa-eye" on:click={() => (plant_tree_active = true)}></i></a>
                            {/if}

                            <Dialog class="pa-4 text-center bg-white " bind:active={plant_tree_input}>
                                <p style="line-height: 5px;">&nbsp;</p>
                                <p>&emsp;每棵樹一年約可以吸收<b style="font-size: large"> 5-10</b>公斤的碳排放量</p>
                                <img src="img/icon/plant_tree_in_dialog.gif" style="width: 40%; border-radius: 2px;">
                                <p style="line-height: 3px;">&nbsp;</p>
                                <p>如果我製造 <input id="user_input_pt" type="text" placeholder="輸入你想寫的碳排放量" bind:value={user_input_pt}/> 公斤的碳排放量</p>
                                <p>&emsp;將需要種 <b style="font-size: large; color: darkseagreen"> { user_input_pt / 9 } </b> 棵樹來吸收</p>
                            </Dialog>
                            <a class="btn btn-lg-square rounded-circle mx-2"><i class="fa fa-calculator" on:click={() => (plant_tree_input = true)}></i></a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-3 portfolio-item first wow fadeInUp" data-wow-delay="0.5s">
                <div class="portfolio-inner rounded">
                    <img class="img-fluid" src="img/tree2.gif" alt="">
                    <div class="portfolio-text">
                        <h4 class="text-white mb-4">燒樹</h4>
                        <div class="d-flex">
                            {#if user}
                            <Dialog class="pa-4 text-center bg-white" bind:active={burn_tree_active}>
                                <p style="line-height: 5px;">&nbsp;</p>
                                <p>&emsp;燒掉一棵樹約會產生 <b style="font-size: large">550.5 </b>公斤的碳排放量</p>
                                <img src="img/icon/burn_tree_in_dialog.gif" style="width: 40%; border-radius: 2px">
                                <p style="line-height: 3px;">&nbsp;</p>
                                <p>&emsp;您今年目前<b style="color: darkseagreen">製造</b>的總碳排量為 <b style="font-size: large">{globalThis.sum_increase}</b> 公斤，</p>
                                <p>&emsp;約等於燒了 <b style="font-size: large">{Math.round(globalThis.sum_increase/550.5*1000)/1000}</b> 棵樹</p>
                                <p>&emsp;您今年目前<b style="color: darkseagreen">相對減少</b>的總碳排量為 <b style="font-size: large">{globalThis.sum_decrease}</b> 公斤，</p>
                                <p>&emsp;約等於救了 <b style="font-size: large">{Math.round(globalThis.sum_decrease/550.5*1000)/1000}</b> 棵樹免於化為灰燼</p>
                            </Dialog>
                            <a class="btn btn-lg-square rounded-circle mx-2"><i class="fa fa-eye" on:click={() => (burn_tree_active = true)}></i></a>
                            {/if}

                            <Dialog class="pa-4 text-center bg-white" bind:active={burn_tree_input}>
                                <p style="line-height: 5px;">&nbsp;</p>
                                <p>&emsp;燒掉一棵樹約會產生 <b style="font-size: large">550.5 </b>公斤的碳排放量</p>
                                <img src="img/icon/burn_tree_in_dialog.gif" style="width: 40%; border-radius: 2px">
                                <p style="line-height: 5px;">&nbsp;</p>
                                <p>製造 <input id="user_input_bt" type="text" placeholder="輸入你想寫的碳排放量" bind:value={user_input_bt}/> 公斤的碳排放量</p>
                                <p>&emsp;相當於燒了 <b style="font-size: large; color: darkseagreen;"> { user_input_bt / 550.5 } </b>棵樹</p>
                                <p>&emsp;也就是說若你少製造 {user_input_bt} 公斤的碳排放量，</p>
                                <p>&emsp;相當於你拯救了 <b style="font-size: large; color: darkseagreen;"> {user_input_bt / 550.5} </b> 棵樹於燃燒殆盡</p>
                            </Dialog>
                            <a class="btn btn-lg-square rounded-circle mx-2"><i class="fa fa-calculator" on:click={() => (burn_tree_input = true)}></i></a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-3 col-md-3 portfolio-item second wow fadeInUp" data-wow-delay="0.5s">
                <div class="portfolio-inner rounded">
                    <img class="img-fluid" src="img/tissue.jpg" alt="">
                    <div class="portfolio-text">
                        <h4 class="text-white mb-4">抽取式衛生紙</h4>
                        <div class="d-flex">
                            {#if user}
                                <Dialog class="pa-4 text-center bg-white" bind:active={tissue_active}>
                                    <p style="line-height: 5px;">&nbsp;</p>
                                    <p>一包抽取式衛生紙約會產生 <b style="font-size: large">0.402 </b>公斤的碳排放量</p>
                                    <img src="img/icon/tissue_in_dialog.gif" style="width: 40%; border-radius: 2px">
                                    <p style="line-height: 3px;">&nbsp;</p>
                                    <p>您今年目前<b style="color: darkseagreen">製造</b>的總碳排量為 <b style="font-size: large">{globalThis.sum_increase}</b> 公斤，</p>
                                    <p>約等於用了 <b style="font-size: large">{Math.round(globalThis.sum_increase/0.215*1000)/1000}</b> 包抽取式衛生紙</p>
                                    <p>您今年目前<b style="color: darkseagreen">相對減少</b>的總碳排量為 <b style="font-size: large">{globalThis.sum_decrease}</b> 公斤， </p>
                                    <p>約等於少用了 <b style="font-size: large">{Math.round(globalThis.sum_decrease/0.215*1000)/1000}</b> 包抽取式衛生紙</p>
                                </Dialog>
                                <a class="btn btn-lg-square rounded-circle mx-2"><i class="fa fa-eye" on:click={() => (tissue_active = true)}></i></a>
                            {/if}

                            <Dialog class="pa-4 text-center bg-white" bind:active={tissue_input}>
                                <p style="line-height: 5px;">&nbsp;</p>
                                <p>一包抽取式衛生紙約會產生 <b style="font-size: large">0.402 </b>公斤的碳排放量</p>
                                <img src="img/icon/tissue_in_dialog.gif" style="width: 40%; border-radius: 2px">
                                <p style="line-height: 3px;">&nbsp;</p>
                                <p>如果你用了 <input id="user_input_t" type="text" placeholder="你想用幾包ㄋ" bind:value={user_input_t}/> 包抽取式衛生紙</p>
                                <p>&emsp;將會排放 <b style="font-size: large; color: darkseagreen;"> { user_input_t * 0.402 } </b>公斤的碳排放量</p>
                                <p>&emsp;也就是說若你少用 {user_input_t} 包抽取式衛生紙，</p>
                                <p>&emsp;將會減少 <b style="font-size: large; color: darkseagreen;"> {user_input_t * 0.402} </b> 公斤的個人碳排放量</p>
                            </Dialog>
                            <a class="btn btn-lg-square rounded-circle mx-2"><i class="fa fa-calculator" on:click={() => (tissue_input = true)}></i></a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-3 col-md-3 portfolio-item second wow fadeInUp" data-wow-delay="0.3s">
                <div class="portfolio-inner rounded">
                    <img class="img-fluid" src="img/beer2.jpg" alt="">
                    <div class="portfolio-text">
                        <h4 class="text-white mb-4">啤酒</h4>
                        <div class="d-flex">
                            {#if user}
                            <Dialog class="pa-4 text-center bg-white" bind:active={beer_active}>
                                <p style="line-height: 5px;">&nbsp;</p>
                                <p>一罐 330ml 的啤酒會產生 <b style="font-size: large">0.215 </b>公斤的碳排放量</p>
                                <img src="img/icon/beer_in_dialog.gif" style="width: 40%; border-radius: 2px">
                                <p style="line-height: 3px;">&nbsp;</p>
                                <p>您今年目前<b style="color: darkseagreen">製造</b>的總碳排量為 <b style="font-size: large">{globalThis.sum_increase}</b> 公斤，約等於喝了 <b style="font-size: large">{Math.round(globalThis.sum_increase/0.215*1000)/1000}</b> 罐啤酒</p>
                                <p>您今年目前<b style="color: darkseagreen">相對減少</b>的總碳排量為 <b style="font-size: large">{globalThis.sum_decrease}</b> 公斤，約等於少喝了 <b style="font-size: large">{Math.round(globalThis.sum_decrease/0.215*1000)/1000}</b> 罐啤酒</p>
                            </Dialog>
                            <a class="btn btn-lg-square rounded-circle mx-2"><i class="fa fa-eye" on:click={() => (beer_active = true)}></i></a>
                            {/if}
                            <Dialog class="pa-4 text-center bg-white" bind:active={beer_input}>
                                <p style="line-height: 5px;">&nbsp;</p>
                                <p>一罐 330ml 的啤酒會產生 <b style="font-size: large">0.215 </b>公斤的碳排放量</p>
                                <img src="img/icon/beer_in_dialog.gif" style="width: 40%; border-radius: 2px">
                                <p style="line-height: 3px;">&nbsp;</p>
                                <p>如果你喝了 <input id="user_input_b" type="text" placeholder="你想喝幾瓶ㄋ" bind:value={user_input_b}/> 瓶啤酒</p>
                                <p>&emsp;將會排放 <b style="font-size: large; color: darkseagreen;"> { user_input_b * 0.215 } </b>公斤的碳排放量</p>
                                <p>&emsp;也就是說若你少喝 {user_input_b} 瓶啤酒，</p>
                                <p>&emsp;將會減少 <b style="font-size: large; color: darkseagreen;"> {user_input_b * 0.215} </b> 公斤的個人碳排放量</p>
                            </Dialog>
                            <a class="btn btn-lg-square rounded-circle mx-2"><i class="fa fa-calculator" on:click={() => (beer_input = true)}></i></a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-3 col-md-3 portfolio-item first wow fadeInUp" data-wow-delay="0.3s">
                <div class="portfolio-inner rounded">
                    <img class="img-fluid" src="img/ac.jpg" alt="">
                    <div class="portfolio-text">
                        <h4 class="text-white mb-4">吹冷氣</h4>
                        <div class="d-flex">
                            {#if user}
                                <Dialog class="pa-4 text-center bg-white" bind:active={ac_active}>
                                    <p style="line-height: 5px;">&nbsp;</p>
                                    <p>吹冷氣一小時約製造 <b style="font-size: large">0.6 </b>公斤的碳排放量</p>
                                    <img src="img/icon/ac_in_dialog.gif" style="width: 40%; border-radius: 2px">
                                    <p style="line-height: 3px;">&nbsp;</p>
                                    <p>您今年目前<b style="color: darkseagreen">製造</b>的總碳排量為 <b style="font-size: large">{globalThis.sum_increase}</b> 公斤，約等於吹了 <b style="font-size: large">{Math.round(globalThis.sum_increase/0.6*1000)/1000}</b> 小時的冷氣</p>
                                    <p>您今年目前<b style="color: darkseagreen">相對減少</b>的總碳排量為 <b style="font-size: large">{globalThis.sum_decrease}</b> 公斤，約等於少吹了 <b style="font-size: large">{Math.round(globalThis.sum_decrease/0.6*1000)/1000}</b> 小時的冷氣</p>
                                </Dialog>
                                <a class="btn btn-lg-square rounded-circle mx-2"><i class="fa fa-eye" on:click={() => (ac_active = true)}></i></a>
                            {/if}
                            <Dialog class="pa-4 text-center bg-white" bind:active={ac_input}>
                                <p style="line-height: 5px;">&nbsp;</p>
                                <p>吹冷氣一小時約製造 <b style="font-size: large">0.6 </b>公斤的碳排放量</p>
                                <img src="img/icon/ac_in_dialog.gif" style="width: 40%; border-radius: 2px">
                                <p style="line-height: 3px;">&nbsp;</p>
                                <p>如果你吹了 <input id="user_input_ac" type="text" placeholder="你想吹幾小時ㄋ" bind:value={user_input_ac}/> 小時冷氣</p>
                                <p>&emsp;將會排放 <b style="font-size: large; color: darkseagreen;"> { user_input_ac * 0.6 } </b>公斤的碳排放量</p>
                                <p>&emsp;也就是說若你少吹 {user_input_ac} 小時冷氣，</p>
                                <p>&emsp;將會減少 <b style="font-size: large; color: darkseagreen;"> {user_input_ac * 0.6} </b> 公斤的個人碳排放量</p>
                            </Dialog>
                            <a class="btn btn-lg-square rounded-circle mx-2"><i class="fa fa-calculator" on:click={() => (ac_input = true)}></i></a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-3 portfolio-item first wow fadeInUp" data-wow-delay="0.5s">
                <div class="portfolio-inner rounded">
                    <img class="img-fluid" src="img/game.jpg" alt="">
                    <div class="portfolio-text">
                        <h4 class="text-white mb-4">打電玩</h4>
                        <div class="d-flex">
                            {#if user}
                                <Dialog class="pa-4 text-center bg-white" bind:active={game_active}>
                                    <p style="line-height: 5px;">&nbsp;</p>
                                    <p>各類型遊戲機體之平均碳排為每小時 <b style="font-size: large">0.025 </b>公斤</p>
                                    <img src="img/icon/game_in_dialog.gif" style="width: 40%; border-radius: 2px">
                                    <p style="line-height: 3px;">&nbsp;</p>
                                    <p>您今年目前<b style="color: darkseagreen">製造</b>的總碳排量為 <b style="font-size: large">{globalThis.sum_increase}</b> 公斤，</p>
                                    <p>約等於玩了 <b style="font-size: large">{Math.round(globalThis.sum_increase/0.025*1000)/1000}</b> 小時電玩</p>
                                    <p>您今年目前<b style="color: darkseagreen">相對減少</b>的總碳排量為 <b style="font-size: large">{globalThis.sum_decrease}</b> 公斤， </p>
                                    <p>約等於少玩了 <b style="font-size: large">{Math.round(globalThis.sum_decrease/0.025*1000)/1000}</b> 小時電玩</p>
                                </Dialog>
                                <a class="btn btn-lg-square rounded-circle mx-2"><i class="fa fa-eye" on:click={() => (game_active = true)}></i></a>
                            {/if}

                            <Dialog class="pa-4 text-center bg-white" bind:active={game_input}>
                                <p style="line-height: 5px;">&nbsp;</p>
                                <p>各類型遊戲機體之平均碳排為每小時 <b style="font-size: large">0.025 </b>公斤</p>
                                <img src="img/icon/game_in_dialog.gif" style="width: 40%; border-radius: 2px">
                                <p style="line-height: 3px;">&nbsp;</p>
                                <p>如果你玩了 <input id="user_input_game" type="text" placeholder="你想玩多久ㄋ" bind:value={user_input_game}/> 小時電玩</p>
                                <p>&emsp;約將會排放 <b style="font-size: large; color: darkseagreen;"> { user_input_game * 0.402 } </b>公斤的碳排放量</p>
                                <p>&emsp;也就是說若你少玩 {user_input_game} 小時電玩，</p>
                                <p>&emsp;約將會減少 <b style="font-size: large; color: darkseagreen;"> {user_input_game * 0.402} </b> 公斤的個人碳排放量</p>
                            </Dialog>
                            <a class="btn btn-lg-square rounded-circle mx-2"><i class="fa fa-calculator" on:click={() => (game_input = true)}></i></a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-3 col-md-3 portfolio-item first wow fadeInUp" data-wow-delay="0.1s">
                <div class="portfolio-inner rounded">
                    <img class="img-fluid" src="img/concert.jpg" alt="">
                    <div class="portfolio-text">
                        <h4 class="text-white mb-4">舉辦演唱會</h4>
                        <div class="d-flex">
                            <Dialog class="pa-4 text-center bg-white" bind:active={concert_active}>
                                <p style="line-height: 5px;">&nbsp;</p>
                                <p>&emsp;一場兩小時的演唱會約會製造 <b style="font-size: large"> 600</b> 公斤的碳排放量</p>
                                <img src="img/icon/concert_in_dialog.gif" style="width: 40%; border-radius: 2px;">
                                <p style="line-height: 3px;">&nbsp;</p>
                                <p>&emsp;您今年目前<b style="color: darkseagreen">製造</b>的總碳排量為 <b style="font-size: large">{globalThis.sum_increase}</b>公斤，</p>
                                <p>&emsp;約相當於舉辦了<b style="font-size: large"> {Math.round(globalThis.sum_increase/600*100000)/100000}</b>場一場兩小時的演唱會</p>
                                <p>&emsp;您今年目前<b style="color: darkseagreen">相對減少</b>的總碳排量為 <b style="font-size: large">{globalThis.sum_decrease}</b>公斤，</p>
                                <p>&emsp;約相當於少追舉辦了<b style="font-size: large"> {Math.round(globalThis.sum_decrease/600*100000)/100000}</b>場一場兩小時的演唱會</p>
                            </Dialog>
                            {#if user}
                                <a class="btn btn-lg-square rounded-circle mx-2 popup-btn"><i class="fa fa-eye" on:click={() => (concert_active = true)}></i></a>
                            {/if}
                            <Dialog class="pa-4 text-center bg-white" bind:active={concert_input}>
                                <p style="line-height: 5px;">&nbsp;</p>
                                <p>&emsp;一場兩小時的演唱會約會製造 <b style="font-size: large"> 600</b> 公斤的碳排放量</p>
                                <img src="img/icon/concert_in_dialog.gif" style="width: 40%; border-radius: 2px;">
                                <p style="line-height: 3px;">&nbsp;</p>
                                <p>如果舉辦 <input id="user_input_concert" type="text" placeholder="你想辦幾場演場會ㄋ?" bind:value={user_input_concert}/> 場一場兩小時的演唱會</p>
                                <p>&emsp;則<b style="color: darkseagreen">將製造 </b><b style="font-size: large"> { Math.round(user_input_concert*600*1000)/1000 } </b>公斤的碳排放量，</p>
                                <p>&emsp;也就是說若少辦 {user_input_concert} 場一場兩小時的演唱會</p>
                                <p>&emsp;可以<b style="color: darkseagreen">減少 </b><b style="font-size: large"> { Math.round(user_input_concert*600*1000)/1000 } </b>公斤的碳排放量</p>
                            </Dialog>
                            <a class="btn btn-lg-square rounded-circle mx-2"><i class="fa fa-calculator" on:click={() => (concert_input = true)}></i></a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-3 portfolio-item second wow fadeInUp" data-wow-delay="0.3s">
                <div class="portfolio-inner rounded">
                    <img class="img-fluid" src="img/shoe.jpg" alt="">
                    <div class="portfolio-text">
                        <h4 class="text-white mb-4">運動鞋</h4>
                        <div class="d-flex">
                            {#if user}
                                <Dialog class="pa-4 text-center bg-white" bind:active={shoe_active}>
                                    <p style="line-height: 5px;">&nbsp;</p>
                                    <p>&emsp;生產一雙運動鞋平均需要 <b style="font-size: large"> 7.6</b> 公斤的碳排放量</p>
                                    <img src="img/icon/shoe_in_dialog.gif" style="width: 40%; border-radius: 5px">
                                    <p style="line-height: 3px;">&nbsp;</p>
                                    <p>&emsp;您今年目前<b style="color: darkseagreen">製造</b>的總碳排量為 <b style="font-size: large"> {globalThis.sum_increase} </b> 公斤</p>
                                    <p>&emsp;相當於生產 <b style="font-size: large"> {Math.round(globalThis.sum_increase/7.6*1000)/1000} </b> 雙鞋子</p>
                                    <p>&emsp;您今年目前<b style="color: darkseagreen">相對減少</b>的總碳排量為 <b style="font-size: large"> {globalThis.sum_decrease} </b> 公斤</p>
                                    <p>&emsp;相當於減少生產 <b style="font-size: large"> {Math.round(globalThis.sum_decrease/7.6*1000)/1000} </b> 雙鞋子</p>
                                </Dialog>
                                <a class="btn btn-lg-square rounded-circle mx-2" ><i class="fa fa-eye" on:click={() => (shoe_active = true)}></i></a>
                            {/if}
                            <Dialog class="pa-4 text-center bg-white" bind:active={shoe_input}>
                                <p style="line-height: 5px;">&nbsp;</p>
                                <p>&emsp;生產一雙運動鞋平均需要 <b style="font-size: large"> 7.6</b> 公斤的碳排放量</p>
                                <img src="img/icon/shoe_in_dialog.gif" style="width: 40%; border-radius: 5px">
                                <p style="line-height: 3px;">&nbsp;</p>
                                <p>如果生產<input id="user_input_shoe" type="text" placeholder="你想辦幾場演場會ㄋ?" bind:value={user_input_shoe}/> 雙運動鞋</p>
                                <p>&emsp;約將<b style="color: darkseagreen">製造 </b><b style="font-size: large"> { Math.round(user_input_shoe*7.6*1000)/1000 } </b>公斤的碳排放量，</p>
                                <p>&emsp;也就是說若少生產 {user_input_shoe} 雙運動鞋</p>
                                <p>&emsp;可以<b style="color: darkseagreen">減少 </b><b style="font-size: large"> { Math.round(user_input_shoe*7.6*1000)/1000 } </b>公斤的碳排放量</p>
                            </Dialog>
                            <a class="btn btn-lg-square rounded-circle mx-2" ><i class="fa fa-calculator" on:click={() => (shoe_input = true)}></i></a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-3 portfolio-item second wow fadeInUp" data-wow-delay="0.1s">
                <div class="portfolio-inner rounded">
                    <img class="img-fluid" src="img/cup.jpg" alt="">
                    <div class="portfolio-text">
                        <h4 class="text-white mb-4">一次性飲料杯</h4>
                        <div class="d-flex">
                            {#if user}
                                <Dialog class="pa-4 text-center bg-white " bind:active={cup_active}>
                                    <p style="line-height: 5px;">&nbsp;</p>
                                    <p>&emsp;一個一次性飲料杯約製造<b style="font-size: large"> 0.15</b>公斤的碳排放量</p>
                                    <img src="img/icon/cup_in_dialog.gif" style="width: 40%; border-radius: 2px;">
                                    <p style="line-height: 3px;">&nbsp;</p>
                                    <p>&emsp;您今年目前<b style="color: darkseagreen">製造</b>的總碳排量為 <b style="font-size: large">{globalThis.sum_increase}</b> 公斤，</p>
                                    <p>&emsp;約等於 <b style="font-size: large">{Math.round(globalThis.sum_increase/0.15)}</b> 個一次性飲料杯製造的碳排放量</p>
                                    <p>&emsp;您今年目前<b style="color: darkseagreen">相對減少</b>的總碳排量為 <b style="font-size: large">{globalThis.sum_decrease}</b> 公斤，</p>
                                    <p>&emsp;約等於 <b style="font-size: large">{Math.round(globalThis.sum_decrease/0.15)}</b> 個一次性飲料杯製造的碳排放量</p>
                                </Dialog>
                                <a class="btn btn-lg-square rounded-circle mx-2"><i class="fa fa-eye" on:click={() => (cup_active = true)}></i></a>
                            {/if}

                            <Dialog class="pa-4 text-center bg-white " bind:active={cup_input}>
                                <p style="line-height: 5px;">&nbsp;</p>
                                <p>&emsp;一個一次性飲料杯約製造<b style="font-size: large"> 0.15</b>公斤的碳排放量</p>
                                <img src="img/icon/cup_in_dialog.gif" style="width: 40%; border-radius: 2px;">
                                <p style="line-height: 3px;">&nbsp;</p>
                                <p>&emsp;製造 <input id="user_input_cup" type="text" placeholder="你想幾個一次性飲料杯ㄋ" bind:value={user_input_cup}/> 個一次性飲料杯</p>
                                <p>&emsp;將會排放 <b style="font-size: large; color: darkseagreen;"> { Math.round(user_input_cup * 0.15*1000)/1000 } </b> 公斤的碳排放量</p>
                                <p>&emsp;也就是說若少製造 {user_input_cup} 個一次性飲料杯，</p>
                                <p>&emsp;相當於減少了排放 <b style="font-size: large; color: darkseagreen;"> { Math.round(user_input_cup * 0.15*1000)/1000} </b> 公斤的碳排放量</p>
                            </Dialog>
                            <a class="btn btn-lg-square rounded-circle mx-2"><i class="fa fa-calculator" on:click={() => (cup_input = true)}></i></a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-3 portfolio-item second wow fadeInUp" data-wow-delay="0.5s">
                <div class="portfolio-inner rounded">
                    <img class="img-fluid" src="img/cloth.jpg" alt="">
                    <div class="portfolio-text">
                        <h4 class="text-white mb-4">衣服</h4>
                        <div class="d-flex">
                            {#if user}
                                <Dialog class="pa-4 text-center bg-white" bind:active={cloth_active}>
                                    <p style="line-height: 5px;">&nbsp;</p>
                                    <p>&emsp;製造一件衣服排放<b style="font-size: large">25.5 </b>公斤的碳排放量</p>
                                    <img src="img/icon/cloth_in_dialog.gif" style="width: 40%; border-radius: 2px">
                                    <p style="line-height: 3px;">&nbsp;</p>
                                    <p>&emsp;您今年目前<b style="color: darkseagreen">製造</b>的總碳排量為 <b style="font-size: large">{globalThis.sum_increase}</b> 公斤，</p>
                                    <p>&emsp;約等於燒了 <b style="font-size: large">{Math.round(globalThis.sum_increase/550.5*1000)/1000}</b> 棵樹</p>
                                    <p>&emsp;您今年目前<b style="color: darkseagreen">相對減少</b>的總碳排量為 <b style="font-size: large">{globalThis.sum_decrease}</b> 公斤，</p>
                                    <p>&emsp;約等於救了 <b style="font-size: large">{Math.round(globalThis.sum_decrease/550.5*1000)/1000}</b> 棵樹免於化為灰燼</p>
                                </Dialog>
                                <a class="btn btn-lg-square rounded-circle mx-2"><i class="fa fa-eye" on:click={() => (cloth_active = true)}></i></a>
                            {/if}

                            <Dialog class="pa-4 text-center bg-white" bind:active={cloth_input}>
                                <p style="line-height: 5px;">&nbsp;</p>
                                <p>&emsp;製造一件衣服排放<b style="font-size: large">25.5 </b>公斤的碳排放量</p>
                                <img src="img/icon/cloth_in_dialog.gif" style="width: 40%; border-radius: 2px">
                                <p style="line-height: 5px;">&nbsp;</p>
                                <p>製造 <input id="user_input_cloth" type="text" placeholder="你想要幾件衣服ㄋ" bind:value={user_input_cloth}/> 件衣服</p>
                                <p>&emsp;將會排放 <b style="font-size: large; color: darkseagreen;"> { user_input_cloth * 25.5 } </b> 公斤的碳排放量</p>
                                <p>&emsp;也就是說若少製造 {user_input_cloth} 件衣服，</p>
                                <p>&emsp;相當於減少了排放 <b style="font-size: large; color: darkseagreen;"> {user_input_cloth * 25.5} </b> 公斤的碳排放量</p>
                            </Dialog>
                            <a class="btn btn-lg-square rounded-circle mx-2"><i class="fa fa-calculator" on:click={() => (cloth_input = true)}></i></a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
<!-- Projects End -->
