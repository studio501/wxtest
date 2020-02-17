var cclog = console.log;
var eval_expression = {};
class Stack{
	constructor(){
		this.dataStore = [];//一个存东西的栈
		this.top = 0;//计数
	}
	push(data){
		this.dataStore[this.top++] = data;
	}
	pop(){
		return this.dataStore[--this.top];
	}
	//返回栈顶元素嗯
	peek(){
		return this.dataStore[this.top-1];
	}
	class(){
		this.top = 0;
	}
	length(){
		return this.top;
	}
	empty(){
		return this.length() == 0;
	}
}
function operation(element1,element2,operator){
	var temp = 0;
	var element1 = Number(element1);
	cclog("element1",element1,"element2",element2);
	var element2 = Number(element2);
	switch(operator){
			case "*":
				temp = element2 * element1;
				break;
			case "/":
				temp = element2 / element1;
				break;
			case "+":
				temp = element2 + element1;
				break;
			case "-":
				temp = element2 - element1;
				break;
			default:
				break;	
		}
		return temp;
}
function expression_Evaluation(data){
	var warehouseStack = new Stack();//元素栈
	var operatorStack = new Stack();//运算符栈
	var operator = "";
	var arry = [];
	var temp1 = 0;
	var temp2 = 0;
	var temp = 0;
	var temporary = 0;
	for(var i=0;i<data.length;i++){
		if(whetherIsoperand(data[i]) > -1){
			operator = data[i];
			temp1 = warehouseStack.peek();
			warehouseStack.pop();
			temp2 = warehouseStack.peek();
			warehouseStack.pop();
			//cclog("temp2",temp2);
			temp = operation(temp1,temp2,operator);
			warehouseStack.push(temp);
		}else{
			warehouseStack.push(data[i]);
		}
	}
	return warehouseStack.peek();
}
function whetherIsoperand(element){
	var data = ["(",")","+","-","*","/"];
	var temp = data.indexOf(element);
	//cclog(temp);
	return temp;
}
//过滤空格
function filtration(expression){
	var temp = [];
	for(var i = 0; i<expression.length;i++){
		if(expression[i]!=" "){
			temp.push(expression[i]);
		}
	}
	return temp;
}
//将中缀表达式转换为后缀表达式
function formula(expression){
	var in_str = [];
		in_str = parse_expression(expression);
		in_str = filtration(in_str);
	var temp = [];
	var element = new Stack();//元素栈
	var operand = new Stack();//运算符栈
	var transition = new Stack();//转换
	for(var j = 0; j < in_str.length; j++){
			switch (in_str[j]){
				case "*"://乘法什么都不做直接入栈
					transition.push(in_str[j]);
					break;
				case "/"://除法什么都不做直接入栈
					transition.push(in_str[j]);
					//cclog(transition.length());
					break;
				case "("://左括号什么都不做直接入栈
					transition.push(in_str[j]);
					break;
				case "+"://加法判断前面运算符的优先级在做什么
					if(transition.length() == 0){
						transition.push(in_str[j]);
					}
					else if(transition.peek()=="*"||
						transition.peek()=="/"||
						transition.peek()=="-"||
						transition.peek()=="+"){
						var temp1 = transition.length();
						for(var q = 0; q <= temp1; q++){
							if(transition.peek()=='('||transition.length()==0){
								transition.push(in_str[j]);
									break;
							}else{
								temp.push(transition.pop());
							}
						}	
					}else{
						transition.push(in_str[j]);
					}
					break;
				case "-"://减法判断前面运算符的优先级在做什么
					if(transition.length() == 0){
						transition.push(in_str[j]);
					}
					else if(transition.peek()=="*"||
						transition.peek()=="/"||
						transition.peek()=="+"||
						transition.peek()=="-"){
						var temp2 = transition.length();
						for(var q1 = 0; q1 <= temp2; q1++){
							if(transition.peek()=='('||transition.length()==0){
								transition.push(in_str[j]);
								break;
							}else {
								temp.push(transition.pop());
							}
						}	
					}else{
							transition.push(in_str[j]);
						}
						break;
				case ")"://遇到右括号就把栈里面的运算符pop到左括号
					var temp3 = transition.length();
					for(var q2 = 0; q2 < temp3; q2++){
						if(transition.peek() == "("){
							transition.pop();
							break;
						}
						else{
							temp.push(transition.pop());
						}
					}					
					break;
				default:
						temp.push(in_str[j]);
					break;
			}				
	}
		
	while(transition.length()>0){
		temp.push(transition.pop());
	}
	return expression_Evaluation(temp);
}
function parse_expression(in_str) {
	var res = [];
	var temp = '';
  	for(let i=0;i<in_str.length;i++){
  		//不是数字
  			switch(in_str[i]){
  				case ".":
  					temp+= in_str[i];
  					break;
  				case "(":
  					if(temp!=''){
  				 		res.push(temp);
  				 		temp = '';
  				 	}
  					res.push(in_str[i]);
  					break;
  				case ")":
  					if(temp!=''){
  				 		res.push(temp);
  				 		temp = '';
  				 	}
  					res.push(in_str[i]);
  					break;
  				case "+":
  					if(temp!=''){
  				 		res.push(temp);
  				 		temp = '';
  				 	}
  					res.push(in_str[i]);
  					break;
  				case "-":
  					if(temp!=''){
  				 		res.push(temp);
  				 		temp = '';
  				 	}
  				 	if(res.length==0||res.length-1=='('){
  				 		temp+=in_str[i];
  				 		break;
  				 	}else{
  						res.push(in_str[i]);
  				}
  					break;
  				case "*":
  					if(temp!=''){
  				 		res.push(temp);
  				 		temp = '';
  				 	}
  					res.push(in_str[i]);
  					break;
  				case "/":
  					if(temp!=''){
  				 		res.push(temp);
  				 		temp = '';
  				 	}
  					res.push(in_str[i]);
  					break;
  				default:
		  			temp += in_str[i];
		  		 	if(i == in_str.length -1){
		  		 		res.push(temp);
		  		 	}
  					break;
  			}
  	}
  	cclog("res=",res);
  	return res;
}
// 注释
eval_expression.formula = formula;
module.exports = eval_expression;