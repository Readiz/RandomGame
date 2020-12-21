<script>
    export let step = 0;
    let width = 50;
    let path = '';
    let desc = '';
    $: width = 13 + (step * 0.5);
    $: ((step) => {
        path = './' + ((step < 11)? step : 11) + '.png';
    })(step);
</script>
<style>

</style>

<!-- Image source: https://www.gdunlimited.net/resources/cat/rpg-maker-xp/icons/2/comments/desc/96 -->
<img src={path} width={width} alt={desc} />
