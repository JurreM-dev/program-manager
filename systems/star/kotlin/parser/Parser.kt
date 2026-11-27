package parser

import kotlin.js.JsAny
import kotlin.js.JsExport

import help.call

typealias itemArray = MutableList<MutableMap<String, Any?>>
typealias item = MutableMap<String, Any?>

private class ParseFailure : RuntimeException()

fun parse(tokens: itemArray): itemArray? {
    var i = 0
    var running = true
    val AST = mutableListOf<MutableMap<String, Any?>>()

    fun eat(expectedType: String): item {
        val token = tokens.getOrNull(i) ?: throw ParseFailure()
        if(token?.get("type") != expectedType) throw ParseFailure()
        i++
        return token
    }
    return try {
        while(i < tokens.size && running) {
        var curToken = tokens[i]
        var curVal = curToken["value"]
        var curType = curToken["type"]
        when {
            curType == "IDENTIFIER" && curVal == "reveal" -> {
                eat("IDENTIFIER")
                eat("LPAREN")
                val nextToken = tokens[i]
                val nextType = nextToken.get("type")
                when(nextType) {
                    "STRING" -> {
                        val printToken = eat("STRING")
                        eat("RPAREN")
                        val printString = printToken.get("value")
                        val node = mutableMapOf<String, Any?>(
                            "type" to "print",
                            "specifier" to "noRefString",
                            "value" to printString
                        )
                        AST.add(node)
                    }
                    "IDENTIFIER" -> {
                        val variableToken = eat("IDENTIFIER")
                        eat("RPAREN")
                        val printName = variableToken.get("value")
                        val node = mutableMapOf<String, Any?>(
                            "type" to "print",
                            "specifier" to "reference",
                            "value" to printName
                        )
                        AST.add(node)
                    }
                    "INTEGER" -> {
                        val printToken = eat("INTEGER")
                        eat("RPAREN")
                        val printNum = printToken.get("value") as? Int ?: throw ParseFailure()
                        if(printNum < 0 || printNum > 0xFFFF) {
                            throw ParseFailure()
                        }
                        val node = mutableMapOf<String, Any?>(
                            "type" to "print",
                            "specifier" to "noRefInt",
                            "value" to printNum
                        )
                        AST.add(node)
                    }
                }
                
            }
                curType == "IDENTIFIER" && curVal == "int" -> {
                    eat("IDENTIFIER")
                    val nameToken = eat("IDENTIFIER")
                    eat("EQUALS")
                    val valueToken = eat("INTEGER")
                    val integer = valueToken["value"] as? Int ?: throw ParseFailure()
                    if(integer < 0 || integer > 0xFFFF) {
                        throw ParseFailure()
                    }
                    val name = nameToken.get("value")
                    val node = mutableMapOf<String, Any?>(
                        "type" to "intDecleration",
                        "name" to name,
                        "value" to integer
                    )
                    AST.add(node)
                }
            else -> {
                i++
            }
            }
        }
        AST
    } catch (_: ParseFailure) {
        null
    }
    
}