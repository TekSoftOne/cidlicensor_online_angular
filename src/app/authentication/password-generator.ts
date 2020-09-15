export function randPass(lettersLength, numbersLength): string {
  let result = '';
  let x = '';
  let j;
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  for (let i = 0; i < lettersLength; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  for (let i = 0; i < numbersLength; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  const resultArr = result.split('');
  for (let i = result.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = result[i];
    resultArr[i] = resultArr[j];
    resultArr[j] = x;
  }
  result = resultArr.join('');
  return result;
}
