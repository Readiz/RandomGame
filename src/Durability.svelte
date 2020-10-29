<script>
    export let durability = 3;
    let durabilityText = '';
    $: ((durability) => {
        let text ='';
        for (let i = 0; i < durability; i++) {
            text += '■';
        }
        durabilityText = text;
        if (durability === 0) {
            text = '없음';
        }
    })(durability);
</script>

<small>
<b>HP</b> {durabilityText}
</small>
