// ==========================================
// 1. THE LEXER (Scans characters -> Tokens)
// ==========================================
export function tokenize(input, errorLogging) {
  let cursor = 0;
  const tokens = [];

  while (cursor < input.length) {
    let char = input[cursor];

    if (/\s/.test(char)) { cursor++; continue; }

    if (/[a-zA-Z_]/.test(char)) {
      let value = "";
      while (cursor < input.length && /[a-zA-Z0-9_]/.test(input[cursor])) {
        value += input[cursor];
        cursor++;
      }
      tokens.push({ type: "IDENTIFIER", value: value });
      continue;
    }

    if (/\d/.test(char)) {
        let value = "";
        while (cursor < input.length && /\d/.test(input[cursor])) {
            value += input[cursor];
            cursor++;
        }
        tokens.push({ type: "NUM", value: Number(value) });
        continue;
    }

    if (/\"/.test(char)) {
      let value = "";
      cursor++;
      while (cursor < input.length && !/\"/.test(input[cursor])) {
        value += input[cursor];
        cursor++;
      }
      cursor++;
      tokens.push({ type: "STRING", value: value });
      continue;
    }

    if (char === "(") { tokens.push({ type: "LPARA", value: "(" }); cursor++; continue; }
    if (char === ")") { tokens.push({ type: "RPARA", value: ")" }); cursor++; continue; }
    if (char === ":") { tokens.push({ type: "COLON", value: ":" }); cursor++; continue; }
    if (char === "=") { tokens.push({ type: "EQUALS", value: "=" }); cursor++; continue; }
    if (char === "+") { tokens.push({ type: "PLUS", value: "+"}); cursor++; continue; }
    if (char === "-") { tokens.push({ type: "MINUS", value: "-"}); cursor++; continue; }
    if (char === "*") { tokens.push({ type: "TIMES", value: "*" }); cursor++; continue;}
    if (char === "/") { tokens.push({ type: "DIVIDE", value: "/"}); cursor++; continue;}

    errorLogging(`Unexpected character: ${char} at index ${cursor}`);
  }

  return tokens;
}

// ==========================================
// 2. THE PARSER (Tokens -> AST Nodes)
// ==========================================
export function parse(tokens, errorLogging) {
  let index = 0;
  const ast = [];

// EAT
  function eat(expectedType) {
  const token = tokens[index];
  if (!token || token.type !== expectedType) {
    const errorMsg = `Expected ${expectedType} but got ${token ? token.type : 'EOF'} at index ${index}`;
    errorLogging(errorMsg); 
    throw new Error(errorMsg); 
  }

  index++;
  return token;
}

// ACTUAL LOOP
  while (index < tokens.length) {
    let token = tokens[index];

    // Catch 'sky' variable declarations
    if (token.type === "IDENTIFIER" && token.value === "sky") {
      eat("IDENTIFIER");
      const nameToken = eat("IDENTIFIER");
      eat("COLON");
      const typeToken = eat("IDENTIFIER");
      eat("EQUALS");
      
      let valueToken;
      // ===================================================
      // STRINGS
      // ===================================================
      if(typeToken.value === "str") {
        valueToken = eat("STRING");
        ast.push({
          type: "VariableDeclaration",
          name: nameToken.value,
          varType: typeToken.value,
          value: valueToken.value
        });
        // ===================================================
        // NUMBERS
        // ===================================================
      } else if (typeToken.value === "num") {
        let leftNum;
        if(tokens[index].type === "NUM") {
           leftNum = eat("NUM")
        } else if (tokens[index].type === "IDENTIFIER") {
           leftNum = eat("IDENTIFIER")
        }
          if(tokens[index] && (tokens[index].type === "PLUS" || tokens[index].type === "MINUS" || tokens[index].type === "TIMES" || tokens[index].type === "DIVIDE")) {
            const op = tokens[index].value;
            index++;
            let rightNum;
            if(tokens[index].type === "NUM") {
              rightNum = eat("NUM");
            } else if(tokens[index].type === "IDENTIFIER") {
              rightNum = eat("IDENTIFIER")
            }
            ast.push({
              type: "VariableDeclaration",
              kind: "expression",
              name: nameToken.value,
              left: leftNum.value,
              operator: op,
              right: rightNum.value
           })
          }else {
            ast.push({
              type: "VariableDeclaration",
              name: nameToken.value,
              varType: typeToken.value,
              value: leftNum.value
            });
          }
        // ===================================================
        // BOOLEANS
        // ===================================================
      } else if (typeToken.value === "boolean" || typeToken.value === "bool") {
        valueToken = eat("IDENTIFIER");
        ast.push({
          type: "VariableDeclaration",
          kind: "boolean",
          name: nameToken.value,
          varType: typeToken.value,
          value: valueToken.value
        })
      }
      continue;
    }

    // Catch 'say()' print statements
    if (token.type === "IDENTIFIER" && token.value === "say") {
      eat("IDENTIFIER");
      eat("LPARA");

      if (tokens[index].type === "IDENTIFIER") {
        const nameVariable = eat("IDENTIFIER");
        ast.push({
          type: "print",
          kind: "variable",
          varName: nameVariable.value
        });
      } else if (tokens[index].type === "STRING") {
        const stringToken = eat("STRING");
        ast.push({
          type: "print",
          kind: "string",
          value: stringToken.value
        });
      } else if (tokens[index].type === "NUM") {
        const leftNum = eat("NUM");
        if(tokens[index] && (tokens[index].type === "PLUS" || tokens[index].type === "MINUS" || tokens[index].type === "TIMES" || tokens[index].type === "DIVIDE")) {
          const op = tokens[index].value;
          index++; 
          const rightNum = eat("NUM");
          ast.push({
            type: "print",
            kind: "expression",
            left: leftNum.value,
            operator: op,
            right: rightNum.value
          })
        } else {
          ast.push({
            type: "print",
            kind: "number",
            value: leftNum.value
        })
        }
      }

      eat("RPARA");
      continue;
    }
    const unhandledMsg = `Unexpected token '${token.value}' at index ${index}`;
    errorLogging(unhandledMsg);
    index++;
    throw new Error(unhandledMsg);
  }

  return ast;
}

// ==========================================
// 3. THE INTERPRETER (Executes the AST)
// ==========================================
export function evaluate(ast, output, errorLogging) {
  const memory = {};

  for (const node of ast) {
    switch (node.type) {

      case "VariableDeclaration":
        // Save to variable storage
        if(node.kind === "expression") {
          let usedLeft;
          let usedRight;
          if(typeof node.left === "number") {
            usedLeft = node.left;
          } else if(typeof node.left === "string") {
            usedLeft = memory[node.left]
          }
          if(typeof node.right === "number") {
            usedRight = node.right;
          } else if(typeof node.right === "string") {
            usedRight = memory[node.right]
          }
          if(node.operator === "+") memory[node.name] = usedLeft + usedRight;
          if(node.operator === "-") memory[node.name] = usedLeft - usedRight;
          if(node.operator === "*") memory[node.name] = usedLeft * usedRight;
          if(node.operator === "/") memory[node.name] = usedLeft / usedRight;
        } else if (node.kind === "boolean") {
          if(node.value === "dead") {
            memory[node.name] = false;
          } else if(node.value === "alive") {
            memory[node.name] = true;
          } else {
            errorLogging(`error, the boolean ${node.value} doesn't exist, it has to be either dead or alive, there is no inbetween`)
          }
        } else {
          memory[node.name] = node.value;
        }
        break;

      case "print":
        if (node.kind === "string") {
          output(node.value);
        } else if (node.kind === "number") {
            output(node.value)
        } else if (node.kind === "variable") {
          if (node.varName in memory) {
            output(memory[node.varName]);
          } else {
            errorLogging(`Variable '${node.varName}' does not exist!`);
          }
        } else if (node.kind === "expression") {
          if(node.operator === "+") output(node.left + node.right)
          if(node.operator === "-") output(node.left - node.right)
          if(node.operator === "*") output(node.left * node.right)
          if(node.operator === "/") output(node.left / node.right)
        }
        break;

      default:
        errorLogging(`Unknown node type: ${node.type}`);
    }
  }
