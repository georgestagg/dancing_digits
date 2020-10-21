/*jshint esversion: 6 */
class RationalFraction {
    constructor(numerator, denominator, base=10) {
        if(typeof numerator != 'bigint' || typeof denominator != 'bigint') {
            numerator = BigInt(numerator)
            denominator = BigInt(denominator)
        }
        this.wholePart = numerator/denominator;
        this.fractionDigits = [];
        this.repeatingAt = -1;
        this.numerator = numerator;
        this.denominator = denominator;
        this.base = base;
        var rem = (numerator%denominator)*BigInt(base);
        var remainders=[];
        while (rem > 0 && this.repeatingAt == -1) {
            remainders.push(rem);
            var digit = rem/denominator;
            rem = (rem % denominator) * BigInt(base);
            this.fractionDigits.push(Number(digit));
            this.repeatingAt = remainders.indexOf(rem);
        }
    }

    digit(n){
        if(n >= this.repeatingAt){
            var repeatingN = this.fractionDigits.length-this.repeatingAt;
            return this.fractionDigits[this.repeatingAt+(n-this.repeatingAt)%repeatingN];
        }
        return this.fractionDigits[n];
    }

    toString(){
        var result = this.numerator.toString(this.base) + '/' + this.denominator.toString(this.base);
        result += ' = '+this.wholePart.toString(this.base) + ".";
        var repeatingAt = this.repeatingAt;
        var base = this.base;
        this.fractionDigits.forEach(function (digit, idx) {
            if (idx == repeatingAt) {
                result += "{";
            }
            result += digit.toString(base);
        });
        if (repeatingAt != -1) {
            result += "}";
        }
        return result;
    }
}