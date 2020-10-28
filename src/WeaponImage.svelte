<script>
    export let step = 0;
    let width = 50;
    let path = '';
    let desc = '';
    $: width = 50 + (step * 4);
    $: ((step) => {
        path = './' + ((step < 11)? step : 11) + '.png';
        switch (step) {
            case 0:
                desc = '단검';
                break;
            case 1:
                desc = '단도';
                break;
            case 2:
                desc = '검';
                break;
            case 3:
                desc = '시퍼런 검';
                break;
            case 4:
                desc = '용사의 검';
                break;
            case 5:
                desc = '이터널 러브';
                break;
            case 6:
                desc = '아이스 소드'
                break;
            case 7:
                desc = '에메랄드 소드'
                break;
            case 8:
                desc = '지옥의 검'
                break;
            case 9:
                desc = '레드 세이버'
                break;
            case 10:
                desc = '그린 세이버'
                break;
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
            case 16:
            case 17:
            case 18:
            case 19:
            case 20:
                desc = '블루 세이버'
                break;
        }
    })(step);

</script>
<style>
    div {
        display: inline-block;
        vertical-align: middle;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
    }
</style>

<div>
<img src={path} width={width} alt={desc} />
</div>
<br>
{#if step === 0}
<h5>{desc}</h5>
{:else}
<h5><b>+{step}</b> {desc}</h5>
{/if}
