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
function expression_Evaluation(data){
	var warehouse = new Stack();
	var temp1 = 0;
	var temp2 = 0;
	var temp = 0;
	for(var i=0;i<data.length;i++){
		if(data[i]=="*"){
			temp1 = 0;
			temp2 = 0;
			temp1 = warehouse.peek();
			warehouse.pop();
			temp2 = warehouse.peek();
			temp = parseInt(temp2)*parseInt(temp1);
			warehouse.pop();
			warehouse.push(temp);
		}else if(data[i]=="/"){
			temp1 = 0;
			temp2 = 0;
			temp1 = warehouse.peek();
			warehouse.pop();
			temp2 = warehouse.peek();
			temp = parseInt(temp2)/parseInt(temp1);
			warehouse.pop();
			warehouse.push(temp);
		}else if(data[i]=="+"){
			temp1 = 0;
			temp2 = 0;
			temp1 = warehouse.peek();
			warehouse.pop();
			temp2 = warehouse.peek();
			temp = parseInt(temp2)+parseInt(temp1);
			warehouse.pop();
			warehouse.push(temp);
		}else if(data[i]=="-"){
			temp1 = 0;
			temp2 = 0;
			temp1 = warehouse.peek();
			warehouse.pop();
			temp2 = warehouse.peek();
			temp = parseInt(temp2)-parseInt(temp1);
			warehouse.pop();
			warehouse.push(temp);
		}else{
			var j = data[i];
			warehouse.push(j);
		}
	}
	return warehouse.peek();
}
function whetherIsoperand(element){
	var data = ["(",")","+","-","*","/"];
	var temp = data.indexOf(element);
	//cclog(temp);
	return temp;
}
//过滤空格
function filtration(expression){
	var temp = "";
	for(var i = 0; i<expression.length;i++){
		if(expression[i]!=" "){
			temp += expression[i];
		}
	}
	return temp;
}
//将中缀表达式转换为后缀表达式
function formula(expression){
	expression = filtration(expression);
	var temp = "";
	var element = new Stack();//元素栈
	var operand = new Stack();//运算符栈
	var transition = new Stack();//转换
	for(var i=0;i<expression.length;i++){
		if( whetherIsoperand(expression[i]) > -1){
			operand.push(expression[i]);
			//cclog("运算符",operand.peek());
		}else{
			element.push(expression[i]);
			//cclog("元素",element.peek());
		}
	}
	//"2*(9+6/3-5)+4"  "4/2+(2+3)-4" 2+(4*2+3)+4 
	for(var j = 0; j < expression.length; j++){
			switch (expression[j]){
				case "*"://乘法什么都不做直接入栈
					transition.push(expression[j]);
					break;
				case "/"://除法什么都不做直接入栈
					transition.push(expression[j]);
					//cclog(transition.length());
					break;
				case "("://左括号什么都不做直接入栈
					transition.push(expression[j]);
					break;
				case "+"://加法判断前面运算符的优先级在做什么
					if(transition.length() == 0){
						transition.push(expression[j]);
					}
					else if(transition.peek()=="*"||
						transition.peek()=="/"||
						transition.peek()=="-"||
						transition.peek()=="+"){
						var temp1 = transition.length();
						for(var q = 0; q < temp1; q++){
							if(transition.peek()=='('||transition.length()==0){
								transition.push(expression[j]);
									break;
							}else{
								temp += String(transition.pop());
								//"2+(4*2+3)+4"
								//242*    +(+
							}
						}	
					}else{
						transition.push(expression[j]);
					}
					break;
				case "-"://减法判断前面运算符的优先级在做什么
					if(transition.length() == 0){
						transition.push(expression[j]);
					}
					else if(transition.peek()=="*"||
						transition.peek()=="/"||
						transition.peek()=="+"||
						transition.peek()=="-"){
						var temp2 = transition.length();
						for(var q1 = 0; q1 <= temp2; q1++){
							if(transition.peek()=='('||transition.length()==0){
								transition.push(expression[j]);
								break;
							}else {
								temp += String(transition.pop());
							}
						}	
					}else{
							transition.push(expression[j]);
						}
						break;
				case ")"://遇到右括号就把栈里面的运算符pop到左括号
					var temp3 = transition.length();
					for(var q2 = 0; q2 < temp3; q2++){
						if(transition.peek() == "("){
							transition.pop();
							//break;
						}
						else{
							temp += String(transition.pop());
						}
					}					
					break;
				default:
						temp +=String(expression[j]);
						cclog(temp);
					break;
			}				
	}
	if(transition.length()>0){
		temp += String(transition.pop());
	}else{
		return;
	}

	//"242*3++4+"
	//
	return expression_Evaluation(temp);
	//cclog(temp);
}
eval_expression.formula = formula;
module.exports = eval_expression;