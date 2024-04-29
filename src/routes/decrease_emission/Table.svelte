<script lang="ts">
    import { type User, onAuthStateChanged } from "firebase/auth";
    export let title;
    export let columns;
    export let data;
    let user: User | null;
    let id ='';
    const today = new Date();
    let currentMonth = today.getMonth()+1;
    let currentYear = today.getFullYear();

    const SORT_DEFAULT = 0; //預設 SORT_DESCENDING，從大到小排
    const SORT_ASCENDING = 1;
    const SORT_DESCENDING = -1; //預設 SORT_DESCENDING，從大到小排

    import { onMount } from 'svelte';
    import {auth} from "../../lib/firebaseConfig";

    onMount(async () => {
        columns = columns.map((c) => {
            c.sorting = 0;
            return c;
        })
        onAuthStateChanged(auth, (newUser) => {
            user = newUser;
            if(user){
                id = user.uid;
                console.log(id)
            }
        });
        console.log(user)
    });

    function sort(index, mode) {
        console.log(index, mode)
        columns = columns.map((c, i) => {
            if (i === index) {
                c.sorting = mode
            } else c.sorting = SORT_DEFAULT;
            return c;
        })
        sortData();
    }

    function sortData() {
        const column = columns.find(c => c.sorting !== SORT_DEFAULT);

        if (!column) return false;

        data = data.sort((a, b) => {
            if (column.sorting === SORT_DEFAULT) {
                return 0;
            }

            if (column.sorting === SORT_ASCENDING) {
                console.log('asc sort')
                if (a[column.accessor] < b[column.accessor]) return -1;
            }

            if (column.sorting === SORT_DESCENDING) {
                console.log('desc sort')
                if (b[column.accessor] < a[column.accessor]) return -1;
            }
        });

        console.log(data[0])
    }

</script>

<h1>
    { title }
</h1>
<p>&nbsp;</p>
<div>
    <table>
        <thead>
        <tr>
            <td width="15%">
                排名
            </td>
            {#each columns as column, i}
                {#if column.header=="userID"}
                    <td width="40%">
                        {column.header}
                    </td>
                {:else}
                    <td width="22.5%">
                        {column.header}
                        {#if (column.header==='減少碳排量（公斤） - ' +　currentMonth + "月" )||(column.header==='減少碳排量（公斤） - ' +　currentYear + "年")}
                            <i on:click={() => sort(i, SORT_DESCENDING)} />
                            <i on:click={() => sort(i, SORT_ASCENDING)} />
                        {/if}
                    </td>
                {/if}
            {/each}
        </tr>
        </thead>

        {#each data as row, i}
            {#if (row.id === id)}
                <tr style="font-weight: bold; color: mediumseagreen; ">
                    <td width="15%">
                        {i+1}
                    </td>
                    {#each columns as column}
                        {#if column.header === "userID"}
                            <td width="40%">
                                {row[column.accessor]}
                            </td>
                        {:else }
                            <td width="22.5%">
                                {#if (column.header==='減少碳排量 - ' +　currentMonth + "月" )||(column.header==='減少碳排量（公斤） - ' +　currentYear + "年")}
                                    {row[column.accessor]} 公斤
                                {:else }
                                    {row[column.accessor]}
                                {/if}
                            </td>
                        {/if}
                    {/each}
                </tr>
            {:else }
                <tr>
                    <td width="15%">
                        {i+1}
                    </td>
                    {#each columns as column}
                        {#if column.header === "userID"}
                            <td width="40%">
                                {row[column.accessor]}
                            </td>
                        {:else }
                            <td width="22.5%">
                                {#if (column.header==='減少碳排量 - ' +　currentMonth + "月" )||(column.header==='減少碳排量（公斤） - ' +　currentYear + "年")}
                                    {row[column.accessor]} 公斤
                                {:else }
                                    {row[column.accessor]}
                                {/if}
                            </td>
                        {/if}
                    {/each}
                </tr>
                {/if}
            {/each}
    </table>
</div>

<style>
    h1 {
        text-align: center;
    }

    div {
        padding: 0 10px;
    }

    table {
        display: flex;
        flex-direction: column;
        width: 100%;
        font-size: 17px;
        border: 1px gray;
        border-radius: 5px;
        overflow-x: auto;
        /*自動斷行*/
        table-layout: fixed;
        word-break: break-all;
    }

    tr {
        display: flex;
        width: 100%;
    }

    thead > tr, tr:not(:last-child) {
        border-bottom: 1px solid gray;
    }

    /*
    tr:nth-of-type(even) {
        background: lightgray;
    }
*/

    td 	{
        padding: 10px;
        text-align: center;
        position: relative;

        word-wrap: break-word;
    }


    i {
        cursor: pointer;
        position: absolute;
        right: 25px;

        border: solid green;
        border-width: 0 3px 3px 0;
        display: inline-block;
        padding: 2px;
        font-size: 50px;
    }

    td > i:first-of-type {
        top: 14px;
        transform: rotate(-135deg);
        -webkit-transform: rotate(-135deg);
    }

    td > i:last-of-type {
        bottom: 14px;
        transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
    }
</style>