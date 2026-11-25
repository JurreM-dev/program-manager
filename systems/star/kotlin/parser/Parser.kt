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
                val printToken = eat("STRING")
                eat("RPAREN")
                val printString = printToken.get("value")
            }
            else -> {
                i++
            }
            }
        }
        tokens
    } catch (_: ParseFailure) {
        null
    }
    
}