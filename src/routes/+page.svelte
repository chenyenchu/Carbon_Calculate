<script lang="ts">
    import { onMount } from "svelte";
    import { onAuthStateChanged, type User } from "firebase/auth";
    import {firebaseConfig, auth, db} from "../lib/firebaseConfig";
    import {collection, getDocs, onSnapshot, query, where} from "firebase/firestore";
    firebaseConfig;
    let user: User | null;

    onMount(async () => {
        auth;
        onAuthStateChanged(auth, (newUser) => {
            user = newUser;
            /*
             if (user) {
                 const id = user.uid;
                 const userQuery = query(collection(db, 'users'), where('userId', '==', user.uid));
                 getDocs(userQuery).then((querySnapshot) => {
                     querySnapshot.forEach((doc) => {
                         const data = doc.data();
                         (window as any).acc = data.acc;
                         (window as any).name = data.name;
                         console.log(doc.data());
                     });
                 }).catch((error) => {
                     console.log('Error getting documents: ', error);
                 });
             } else {
                 console.log('User is not logged in');
             }
             */
        });
    });
    let records = [];
    const colRef = collection(db, "article");
    const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
        let fbRecords = [];
        querySnapshot.forEach((doc) => {
            let record = {...doc.data(), id: doc.id};
            fbRecords = [record, ...fbRecords];
        });
        records = fbRecords;
    });

</script>
<!-- Carousel Start -->
<div class="container-fluid p-0 wow fadeIn" data-wow-delay="0.1s">
    <div id="header-carousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
            <div class="carousel-item active">
                <img class="w-100" src="img/nature3.jpg" alt="Image">
                <div class="carousel-caption">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-lg-7">
                                {#if user}
                                    <h3 class="display-1 text-white mb-5 animated slideInDown" style="font-family: '微軟正黑體'; font-size: xxx-large">歡迎 {user.email} 回到探碳</h3>
                                {:else }
                                    <h3 class="display-1 text-white mb-5 animated slideInDown" style="font-family: '微軟正黑體'; font-size: xxx-large">快來加入紀錄碳排的行列吧!</h3>
                                {/if}
                                <a href="" class="btn btn-primary py-sm-3 px-sm-4" style="font-family: '微軟正黑體';">詳細資訊</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="carousel-item">
                <img class="w-100" src='img/nature.jpg' alt="Image">
                <div class="carousel-caption">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-lg-8">
                                <h1 class="display-1 text-white mb-5 animated slideInDown" style="font-family: '微軟正黑體'; font-size: xxx-large">保護綠色搖籃，你行，我能! <p>讓綠色的旋律環繞每一個生命!</p></h1>
                                <a href="" class="btn btn-primary py-sm-3 px-sm-4" style="font-family: '微軟正黑體';">詳細資訊</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#header-carousel"
                data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#header-carousel"
                data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>
</div>
<!-- Carousel End -->


<!-- Top Feature Start -->
<div class="container-fluid top-feature py-5 pt-lg-0">
    <div class="container py-5 pt-lg-0">
        <div class="row gx-0">
            <div class="col-lg-4 wow fadeIn" data-wow-delay="0.1s">
                <div class="bg-white shadow d-flex align-items-center h-100 px-5" style="min-height: 160px;">
                    <div class="d-flex">
                        <div class="flex-shrink-0 btn-lg-square rounded-circle bg-light">
                            <i class="fa fa-check text-primary"></i>
                        </div>
                        <div class="ps-3">
                            <h4>有趣&不無聊</h4>
                            <span>將數據以有趣的方式呈現給您</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 wow fadeIn" data-wow-delay="0.3s">
                <div class="bg-white shadow d-flex align-items-center h-100 px-5" style="min-height: 160px;">
                    <div class="d-flex">
                        <div class="flex-shrink-0 btn-lg-square rounded-circle bg-light">
                            <i class="fa fa-book text-primary"></i>
                        </div>
                        <div class="ps-3">
                            <h4>持續記錄</h4>
                            <span>一個能讓您記錄每天碳排量的系統</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 wow fadeIn" data-wow-delay="0.5s">
                <div class="bg-white shadow d-flex align-items-center h-100 px-5" style="min-height: 160px;">
                    <div class="d-flex">
                        <div class="flex-shrink-0 btn-lg-square rounded-circle bg-light">
                            <i class="fa fa-users text-primary"></i>
                        </div>
                        <div class="ps-3">
                            <h4>比較數據</h4>
                            <span>和自己及其他使用者比較數據</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Top Feature End -->
<div class="container-xxl py-5">
    <div class="container">
        <div class="row g-5">
            <div class="col-lg-8 wow fadeInUp" data-wow-delay="0.1s">
                <p class="fs-5 fw-bold text-primary">碳排小知識</p>
                {#each records.filter(records => records.type === 'intro') as item}
                    <h1 class="display-5 mb-5">{item.title}</h1>
                    <p class="mb-4">{item.content}</p>
                {/each}
            </div>
            <div class="col-lg-4 wow fadeInUp" data-wow-delay="0.5s">
                <div class="testimonial-item">
                    <img class="img-fluid rounded" data-wow-delay="0.1s" src="img/carbon.png" style="background-size: cover;border-radius: 10px;">
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Testimonial End -->
<div class="container-xxl py-5">
    <div class="container">
        <div class="row g-5 wow fadeInUp" data-wow-delay="0.5s">
            <h2 class="display-5 mb-5">我們可以做什麼？</h2>
        </div>
        <div class="row g-4">
            <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                <div class="service-item rounded d-flex h-100">
                    <div class="service-text rounded p-5">
                        <div class="btn-square rounded-circle mx-auto mb-3">
                            <img class="img-fluid" src="img/busicon.jpg" alt="Icon">
                        </div>
                        {#each records.filter(records => records.type === 'tran') as item}
                            <h4 class="mb-3">{item.title}</h4>
                            <p class="mb-4">{item.content}</p>
                        {/each}
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
                <div class="service-item rounded d-flex h-100">
                    <div class="service-text rounded p-5">
                        <div class="btn-square rounded-circle mx-auto mb-3">
                            <img class="img-fluid" src="img/apple.jpg" alt="Icon">
                        </div>
                        {#each records.filter(records => records.type === 'vege') as item}
                            <h4 class="mb-3">{item.title}</h4>
                            <p class="mb-4">{item.content}</p>
                        {/each}
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
                <div class="service-item rounded d-flex h-100">
                    <div class="service-text rounded p-5">
                        <div class="btn-square rounded-circle mx-auto mb-3">
                            <img class="img-fluid" src="img/person.jpg" alt="Icon">
                        </div>
                        {#each records.filter(records => records.type === 'walk') as item}
                            <h4 class="mb-3">{item.title}</h4>
                            <p class="mb-4">{item.content}</p>
                        {/each}
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                <div class="service-item rounded d-flex h-100">
                    <div class="service-text rounded p-5">
                        <div class="btn-square rounded-circle mx-auto mb-3">
                            <img class="img-fluid" src="img/bag.jpg" alt="Icon">
                        </div>
                        {#each records.filter(records => records.type === 'plas') as item}
                            <h4 class="mb-3">{item.title}</h4>
                            <p class="mb-4">{item.content}</p>
                        {/each}
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
                <div class="service-item rounded d-flex h-100">
                    <div class="service-text rounded p-5">
                        <div class="btn-square rounded-circle mx-auto mb-3">
                            <img class="img-fluid" src="img/ice.jpg" alt="Icon">
                        </div>
                        {#each records.filter(records => records.type === 'app') as item}
                            <h4 class="mb-3">{item.title}</h4>
                            <p class="mb-4">{item.content}</p>
                        {/each}
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
                <div class="service-item rounded d-flex h-100">
                    <div class="service-text rounded p-5">
                        <div class="btn-square rounded-circle mx-auto mb-3">
                            <img class="img-fluid" src="img/global.png" alt="Icon">
                        </div>
                        {#each records.filter(records => records.type === 'care') as item}
                            <h4 class="mb-3">{item.title}</h4>
                            <p class="mb-4">{item.content}</p>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="container-md py-5 wow fadeInUp" data-wow-delay="0.5s">
    <div class="container">
        <div style="font-size:1px">
            文章出處：<br>
            <a href="https://reurl.cc/Rz6AM6">1. 對抗氣候變遷：生活中可以做到的 9 個節能減碳方法 作者： Greenpeace 綠色和平</a><br>
            <a href="https://reurl.cc/K0xZan">2. 什麼是碳排放？和空污有什麼不同？為什麼您我需要減少碳排？ 作者： Greenpeace 綠色和平</a>
        </div>
    </div>
</div>



