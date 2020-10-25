<script>
    export let step = 0;
    let width = 50;
    let path = '';
    let desc = '';
    $: width = 50 + (step * 5);
    $: ((step) => {
        switch (step) {
            case 0:
            case 1:
                path = './12.png';
                break;
            case 2:
            case 3:
                path = './34.png';
                break;
            case 4:
            case 5:
                path = './56.png';
                break;
            case 6:
            case 7:
                path = './78.png';
                break;
            case 8:
            case 9:
            case 10:
                path = './90.png';
                break;
        }
        switch (step) {
            case 0:
                desc = '흔한 검';
                break;
            case 1:
                desc = '덜 흔한 검';
                break;
            case 2:
                desc = '익숙해진 검';
                break;
            case 3:
                desc = '검';
                break;
            case 4:
                desc = '일반 검';
                break;
            case 5:
                desc = '괜찮은 검';
                break;
            case 6:
                desc = '좋은 검'
                break;
            case 7:
                desc = '명검'
                break;
            case 8:
                desc = '기적의 검'
                break;
            case 9:
                desc = '전설의 검'
                break;
            case 10:
                desc = '세계관 최강의 검'
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
