/**
 * Comprehension:
 * str is a string containing numbers and operators and parenthesis
 * No decimal operations, no rounding
 * 
 * Problem:
 * How do we identify and control the flow of the order of operations?
 *
 * Idea:
 * We could use a placeholder output value set to 0,
 * take care of the parenthesis first, 
 *    - encountering nested parenthesis, we should drill down to the inner most set and solve for those pairs
 *    - treat anything next to a parenthesis without an operator as multiplication
 * 
 * Pseudocode:
 * initialize a queue and a stack as empty arrays
 * initialize an empty operation array
 * initialize a num as an empty string
 * check if str includes parenthesis
 *  - if so, get everything from the indexOf the first opener to its corresponding close
 * 
 * loop over str,
 * if we encounter a number, num += the number,
 * if we encounter a * or \ push num into the stack and push the operator to a parallel stack, clear num
 * if we encounter a + or - push num into the queue and push the operator to a parallel queue, clear num
 * if we encounter a ( what we need to know is the extent of the parenthesis, consider it possibly nested
 *  - 1st, get the string to the last corresponding parenthesis,
 *  - stack = [6, * , 4, /, 2]
 *  - 2nd, recursively in a depth first manner, all to the stack, regardless of operator. 
 * exit loop
 *
 * initialize an num
 * initialize an output value as 0
 * initialize an assigned boolean = false
 * while queue and stack have values,
 *  if assigned === false 
 *    pop off the stack and reassign output, take the operator out and push into the operator queue
 *    reassign assigned to true
 *  if (stack.length > 0) 
 *    num = stack.pop(), 
 *    remove operator and push into operator queue,
 *    using the next operator in the array, perform the operation with output and num
 *  else 
 *    do something similar with the queue until it is empty
 * 
 * return output
 * 
 * Testing Idea, Walkthrough:
 * 
 */

// helper functions on the bottom
function Calculator(str, stack = [], queue = []) {

  let num = "", length = str.length;

  for (let i = 0; i < length; i++) {
    let char = str[i] // ease of use
    if (isNumber(char)) num += char;  // if empty, only a number can be included
    else if (char === '(') {
      if(isNumber(str[i-1])) stack.push(str[i-1]);
      subString = "";
      str = str.split('');
      let input = str.slice(i).join('');
      str = str.join('');
      console.log("input", input)
      // use input to get all the parentheses content, cut off the trailing stuff after the last parenthesis
      let parenthesesContent = getparenthesisContent(input);
      console.log("parenthesesContent", parenthesesContent);
      // get the inner most parenthesis and work our way back out adding to the stack and queue
    }
    else if (char === ')') {

    }
    else if (num !== "" && isOperator(char)) {  // not empty and not a number, make sure before final action
      if (isHigherOrderOperator(char)) {
        stack.push(num);
        stack.push(char);
      }
      if (isLowerOrderOperator(char)) {
        queue.push(num);
        queue.push(char);
      }
      num = ""; // clear out num after pushing to stack or queue
    }

  }


  console.log("stack", stack);
  console.log("queue", queue);

  return str;

}

function getparenthesisContent(string) { // sample input "(6+2(4-2))"
  let subString = "", openCount = 0, length = string.length;
  if (!string.includes('(') && !string.includes(')')) return string // base case
  for (let i = 0; i < length; i++) {

    let char = string[i]; // simplify character case
    // console.log("char", char, "openCount", openCount, "subString", subString)
    if (char === '(') {
      // building on below Idea!, on this line I could implement some replacement logic
      if (isNumber(string[i - 1])) {
        string = string.split('');
        string.splice(i, 0, '*');
        string = string.join('');
        i--;
        length++
        openCount-- // removes the false openCount that will run from us taking a step back
      }
      // for the above if statement, splice in a '*' if the previous value is a Number and not an Operator
      openCount++;  // keep track of how many closes we need
      subString = "" // an open parenthesis means we cannot consider the previous substring now
    }
    else if (char !== '(' && char !== ')') { // case for building subString
      subString += char;
    }
    else if (char === ')') {
      if (isNumber(string[i + 1])) {
        string = string.split('');
        string.splice(i + 1, 0, '*');
        string = string.join('');
      }
      openCount--;   // a found close means we get closer to assessing our subString
    }
    if (openCount === 0 && subString !== "") {
      // action case, we have the inner most parenthesis content sanitized before recursive call
      string = string.split('');
      string.splice(i+1);
      string = string.join('');
      // *** Perhaps I should just push the result to the stack and splice the string?
      // let subStrLength = subString.length;
      // let startIdx = string.indexOf(subString) - 1; // -1 because we want this group's parenthesis
      // string = string.split(''); // make the string an array so we can splice it
      // let snippet = string.splice(startIdx, subStrLength+2, result).join('');  // +2 for the first and second parenthesis
      // string = string.join('');
    }
  }
  return string;

}
// 2+2+3
/**
 * I cannot seem to get this evaluate function to perform properly
 */
function evaluate(string){  // returns a number of a result between 2 numbers 1 operator
  if(!string) return "Invalid String"
  let operator = null, num = "", result = null, length = string.length;
  
  for(let i = 0; i < length; i++){
    let char = string[i];
    console.log(char)
    console.log("i", i, "char", char, "charIsOperator", isOperator(char), "length", length, "result", result, "operator", operator)
    if(isNumber(char)) num += char;
    else if(isOperator(char) && result === null) {
      console.log("Line 154: num", num, "isCharOp", isOperator(char), char);
      result = Number(num);
      num = "";
      operator = char;
    }
    else if(isOperator(char) && result !== null){ 
      operator = char;
      console.log("Line 160: num", num, "result", result);
      result = resolve(result, num);
      operator = null;
      console.log("Line 162: result", result)
      num = "";
    }
    
  }
  
  function resolve(num1, num2){
    let res = null;
    num1 = Number(num1);
    num2 = Number(num2);
    console.log("Line 172: num1", num1, "num2", num2);
    if(operator === '*') res += num1 * num2;
    else if(operator === '/') res += num1 / num2;
    else if(operator === '+') res += num1 + num2;
    else if(operator === '-') res += num1 - num2;
    return res;
  }
  return result;
}

console.log("TEST", evaluate("2+2+3"))

function containsOperators(string) {
  if (!string) return false;
  if (string.includes('*') || string.includes('/') || string.includes('(') || string.includes(')') || string.includes('-') || string.includes('+')) return true;
  return false;
}

function isNumber(char) {
  if (!char) return false;
  if (char === '*' || char === '/' || char === '(' || char === ')' || char === '+' || char === '-') return false;
  return true;
}

function isOperator(char) {
  if (!char) return false;
  if (char === '*' || char === '/' || char === '+' || char === '-') return true;
  return false;
}

function isHigherOrderOperator(char) {
  if (!char) return false;
  if (char === '*' || char === '/') return true;
  return false;
}

function isLowerOrderOperator(char) {
  if (!char) return false;
  if (char === '+' || char === '-') return true;
  return false;
}

// keep this function call here 
console.log(Calculator(readline()));
