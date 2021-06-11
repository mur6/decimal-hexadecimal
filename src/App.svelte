<script>
    let decimal_value = 0;
    let hex_value = 0;

    function convToHex(a) {
        let b = parseInt(a);
        return b.toString(16);
    }
function convToDecimal(val) {
    const hextable = new Array("1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");
    let s = val.toString().toLowerCase();
    let ret = 0;
    let charLength = s.length;

  for (let i=0; i < charLength; i++) {
	let c = s.charAt(charLength - i -1);
	for (let j=0; j < 16; j++) {
	  if ( c == hextable[j] ) {
		ret += (j+1) * Math.pow(16, i);
	  	break;
	  }
	}
  }
  return ret;
}

$: hex_converted = convToHex(decimal_value);
$: decimal_converted = convToDecimal(hex_value)

</script>


<h1>10進数・16進数変換ツール</h1>

<div>
<p>10=>16 変換</p>
<p>10進数<input bind:value={decimal_value} placeholder="0"><p>
<p>16進数: {hex_converted}</p>
</div>
<hr>
<div>
<p>16=>10 変換</p>
<p>16進数:<input bind:value={hex_value} placeholder="0"></p>
<p>10進数:{decimal_converted}</p>
</div>
