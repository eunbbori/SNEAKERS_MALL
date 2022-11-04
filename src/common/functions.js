class CommonFunction {
  alphabets() {
    return new Array(26).fill().map((_, i) => String.fromCharCode(i + 97)).join("");
  }
}

const commonFunction = new CommonFunction();

export { commonFunction };
