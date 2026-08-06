
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

    if (char === ">") {
      if(input[cursor + 1] === "=") {
        tokens.push({ type: "COMPBIGGEREQUAL", value: ">="});
        cursor+= 2;
      } else {
        tokens.push({ type: "COMPBIGGER", value: ">"});
        cursor++;
      }
      continue;
    }
    if (char === "<") {
      if(input[cursor + 1] === "=") {
        tokens.push({ type: "COMPLITTLEEQUAL", value: "<="});
        cursor+= 2;
      } else {
        tokens.push({ type: "COMPLITTLE", value: "<"});
        cursor++;
      }
      continue;
    }
      
    if (char === "=") {
      if(input[cursor + 1] === "=") {
        tokens.push({ type: "CHECKEQUAL", value: "=="});
        cursor+= 2;
      } else {
        tokens.push({ type: "EQUALS", value: "="});
        cursor++;
      }
      continue;
    }

    if (char === "(") { tokens.push({ type: "LPARA", value: "(" }); cursor++; continue; }
    if (char === ")") { tokens.push({ type: "RPARA", value: ")" }); cursor++; continue; }
    if (char === "{") { tokens.push({ type: "LBRACE", value: "{" }); cursor++; continue; }
    if (char === "}") { tokens.push({ type: "RBRACE", value: "}" }); cursor++; continue; }
    if (char === ":") { tokens.push({ type: "COLON", value: ":" }); cursor++; continue; }
    if (char === "+") { tokens.push({ type: "PLUS", value: "+"}); cursor++; continue; }
    if (char === "-") { tokens.push({ type: "MINUS", value: "-"}); cursor++; continue; }
    if (char === "*") { tokens.push({ type: "TIMES", value: "*" }); cursor++; continue;}
    if (char === "/") { tokens.push({ type: "DIVIDE", value: "/"}); cursor++; continue;}
    if (char === ",") { tokens.push({ type: "COMMA", value: ","}); cursor++; continue;}

    errorLogging(`Unexpected character: ${char} at index ${cursor}`);
    cursor++;
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

    // =======================================================
    // Catch 'sky' variable declarations
    // =======================================================
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

    //===================================================================
    // Catch 'say()' print statements
    //===================================================================
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

    //=================================================================
    // asking stuff from the user 
    //=================================================================
    if(token.type === "IDENTIFIER" && (token.value === "addKnowledge" || token.value === "learn")) {
      eat("IDENTIFIER");
      eat("LPARA");
      const promptToken = eat("STRING");
      eat("RPARA"); 
      const intoToken = eat("IDENTIFIER");
      if(intoToken.value !== "into") {
        errorLogging(`okay so... MOST PEOPLE, when they ${token.value} they don't ${intoToken.value} the new info, just saying. (hint: try into instead of ${intoToken.value})`);
        throw new Error("you did it wrong");
      }
      const variableToken = eat("IDENTIFIER");
      ast.push({
        type: "AskStatement",
        prompt: promptToken.value,
        varName: variableToken.value
      })
      continue;
    }

    //=================================================================
    // Catch 'experiment()' statements
    //=================================================================
    if (token.type === "IDENTIFIER" && token.value === "experiment") {
      eat("IDENTIFIER");
      eat("LPARA");
      let leftSide;
      let leftKind;
      if(tokens[index].type === "NUM") {
        leftSide = eat("NUM")
        leftKind = "number"
      } else if(tokens[index].type === "IDENTIFIER") {
        leftSide = eat("IDENTIFIER")
        leftKind = "variable"
      } else if(tokens[index].type === "STRING") {
        leftSide = eat("STRING")
        leftKind = "string"
      }  else {
        errorLogging(`you cannot compare ${tokens[index].value} at ${index}`)
        throw new Error("syntax error")
      }
      
      let op;
      if(tokens[index].value === ">=" || tokens[index].value === ">" || tokens[index].value === "==" || tokens[index].value === "<" || tokens[index].value === "<=") {
        op = tokens[index].value;
      } else {
        errorLogging(`you cannot compare ${tokens[index].value} at ${index}`)
        throw new Error("syntax error")
      }
      index++;

      let rightSide;
      let rightKind;
      if(tokens[index].type === "NUM") {
        rightSide = eat("NUM")
        rightKind = "number";
      } else if(tokens[index].type === "IDENTIFIER") {
        rightSide = eat("IDENTIFIER")
        rightKind = "variable";
      } else if(tokens[index].type === "STRING") {
        rightSide = eat("STRING")
        rightKind = "string";
      }  else {
        errorLogging(`you cannot compare ${tokens[index].value} at ${index}`)
        throw new Error("syntax error")
      }

      eat("RPARA");
      eat("COLON");
      eat("LBRACE");
      let braceCount = 1;
      let bodyTokens = [];
      while(braceCount > 0) {
        if(tokens[index].type === "LBRACE") {
          braceCount++;
        } else if(tokens[index].type === "RBRACE") {
          braceCount--;
        } else {
          bodyTokens.push(tokens[index]);
        }
        index++;
      }
      ast.push({
        type: "ExperimentStatement",
        left: {
          kind: leftKind,
          value: leftSide.value
        },
        operator: op,
        right: {
          kind: rightKind,
          value: rightSide.value
        },
        body: bodyTokens
      });
      continue;
    }

  // ==========================================
  // rituals
  // ==========================================
  if(token.type === "IDENTIFIER" && token.value === "ritual") {
    eat("IDENTIFIER");
    const ritualNameToken = eat("IDENTIFIER");
    eat("LPARA");
    const parameterList = [];
    while (tokens[index].type !== "RPARA") {
      if (tokens[index].type === "IDENTIFIER") {
        const paramToken = eat("IDENTIFIER");
        parameterList.push(paramToken.value);
      } else if (tokens[index].type === "COMMA") {
        eat("COMMA");
      } else {
        errorLogging(`Unexpected token '${tokens[index].value}' in parameter list at index ${index}`);
        throw new Error(`Unexpected token '${tokens[index].value}' in parameter list at index ${index}`);
      }
    }
    eat("RPARA");
    eat("COLON");
    eat("LBRACE");
    let braceCount = 1;
    let bodyTokens = [];
    while(braceCount > 0) {
      if(tokens[index].type === "LBRACE") {
        braceCount++;
        bodyTokens.push(tokens[index]);
      } else if(tokens[index].type === "RBRACE") {
        braceCount--;
        if (braceCount > 0) {
          bodyTokens.push(tokens[index]);
        } 
      } else {
        bodyTokens.push(tokens[index]);
      }
      index++;
    }
    ast.push({
      type: "RitualDeclaration",
      name: ritualNameToken.value,
      parameters: parameterList,
      body: bodyTokens
    })
    continue;
  }

  // ==========================================
  // ritual invocation
  // ==========================================
  if(token.type === "IDENTIFIER" && token.value === "summon") {
    eat("IDENTIFIER");
    const ritualNameToken = eat("IDENTIFIER");
    eat("LPARA");
    const args = [];
    while (tokens[index].type !== "RPARA") {
      if (tokens[index].type === "IDENTIFIER") {
        const argToken = eat("IDENTIFIER");
        args.push(argToken.value);
      } else if (tokens[index].type === "COMMA") {
        eat("COMMA");
      } else {
        errorLogging(`Unexpected token '${tokens[index].value}' in argument list at index ${index}`);
        throw new Error(`Unexpected token '${tokens[index].value}' in argument list at index ${index}`);
      }
    }
    eat("RPARA");
    ast.push({
      type: "RitualInvocation",
      ritualName: ritualNameToken.value,
      arguments: args
    });
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
export async function evaluate(ast, output, errorLogging, askFunction, memory = {}) {

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
            usedLeft = Number(memory[node.left])
          }
          if(typeof node.right === "number") {
            usedRight = node.right;
          } else if(typeof node.right === "string") {
            usedRight = Number(memory[node.right])
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

      case "AskStatement":
        memory[node.varName] = await askFunction(node.prompt);
        break;

      case "ExperimentStatement":
        let leftValue;
        if(node.left.kind === "number") {
          leftValue = node.left.value;
        } else if(node.left.kind === "variable") {
          leftValue = memory[node.left.value];
        } else if(node.left.kind === "string") {
          leftValue = node.left.value;
        }
        let rightValue;
        if(node.right.kind === "number") {
          rightValue = node.right.value;
        } else if(node.right.kind === "variable") {
          rightValue = memory[node.right.value];
        } else if(node.right.kind === "string") {
          rightValue = node.right.value;
        }
        if(node.operator === ">=") {
          if(leftValue >= rightValue) {
            const bodyAst = parse(node.body, errorLogging);
            await evaluate(bodyAst, output, errorLogging, askFunction, memory);;
          }
        } else if(node.operator === ">") {
          if(leftValue > rightValue) {
            const bodyAst = parse(node.body, errorLogging);
            await evaluate(bodyAst, output, errorLogging, askFunction, memory);
          }
        } else if(node.operator === "==") {
          if(leftValue === rightValue) {
            const bodyAst = parse(node.body, errorLogging);
            await evaluate(bodyAst, output, errorLogging, askFunction, memory); 
            }
          } else if(node.operator === "<") {
            if(leftValue < rightValue) {
              const bodyAst = parse(node.body, errorLogging);
              await evaluate(bodyAst, output, errorLogging, askFunction, memory);
            }
          } else if(node.operator === "<=") {
            if(leftValue <= rightValue) {
              const bodyAst = parse(node.body, errorLogging);
              await evaluate(bodyAst, output, errorLogging, askFunction, memory);
            }
          }
        break;

      case "RitualDeclaration":
        // Store the ritual in memory
        memory[node.name] = {
          parameters: node.parameters,
          body: node.body
        };
        break;

      case "RitualInvocation":
        if (node.ritualName in memory) {
          const ritual = memory[node.ritualName];
          if (ritual.parameters.length !== node.arguments.length) {
            errorLogging(`Ritual '${node.ritualName}' expects ${ritual.parameters.length} arguments, but got ${node.arguments.length}`);
            break;
          }
          // Create a new scope for the ritual invocation
          const ritualScope = { ...memory };
          for (let i = 0; i < ritual.parameters.length; i++) {
            ritualScope[ritual.parameters[i]] = node.arguments[i];
          }
          const bodyAst = parse(ritual.body, errorLogging);
          await evaluate(bodyAst, output, errorLogging, askFunction, ritualScope);
        } else {
          errorLogging(`Ritual '${node.ritualName}' is not defined!`);
        }
        break;

      default:
        errorLogging(`Unknown node type: ${node.type}`);
    }
  }
}