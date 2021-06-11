<script>
	let count = 1;

    function convToHex(a) {
        let b = parseInt(a);
        return b.toString(16);
    }
function convToDecimal(val) {  // 16進→10進
    let s = val.toLowerCase();
    let ret = 0;
    let count = s.length;

  for (i=0; i < count; i++) {
	n = s.charAt(L - i -1);
	for (j=0; j < 16; j++) {
	  if ( c == ar[j] ) {
		ret += (j+1) * Math.pow(16, i);
	  	break;
	  }
	}
  }
  return ret;
}


	// the `$:` means 're-run whenever these values change'
	$: doubled = count * 2;
	$: hex_val = convToHex(count);

	function handleClick() {
		count += 1;
	}
</script>


<h1>10進数・16進数変換ツール</h1>
<button on:click={handleClick}>
	Count: {count}
</button>

<p>{count} * 2 = {doubled}</p>
<p>{hex_val}</p>
