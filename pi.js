function powmod( base, exp, mod ){
  if (exp == 0) return 1;
  if (exp % 2 == 0){
    return Math.pow( powmod( base, (exp / 2), mod), 2) % mod;
  }
  else {
    return (base * powmod( base, (exp - 1), mod)) % mod;
  }
}

/**
   Bailey-Borwein-Plouffe digit-extraction algorithm for pi 
    <https://en.wikipedia.org/wiki/Bailey%E2%80%93Borwein%E2%80%93Plouffe_formula#BBP_digit-extraction_algorithm_for_.CF.80>
*/

function pi(n) {
    var partial = function(d, c) {
        var sum = 0;

        var k;
        for (k = 0; k <= d - 1; k++) {
            sum += (powmod(16, (d - 1 - k), (8 * k + c))) / (8 * k + c);
        }

        var prev;
        for(k = d; sum !== prev; k++) {
            prev = sum;
            sum += Math.pow(16, d - 1 - k) / (8 * k + c);
        }

        return sum;
    };

    var mod1 = function(x) {
        return x < 0 ? 1 - (-x % 1) : x % 1;
    };

    var s = 0;
    s +=  4 * partial(n, 1);
    s += -2 * partial(n, 4);
    s += -1 * partial(n, 5);
    s += -1 * partial(n, 6);

    s = mod1(s);
    return Math.floor(s * 16);
}