package parser

import kotlin.js.JsAny
import kotlin.js.JsExport

import help.call

typealias itemArray = MutableList<MutableMap<String, Any?>>
typealias item = MutableMap<String, Any?>

private class ParseFailure : RunTimeException()

fun parse(tokens: itemArray): itemArray? {
    var i = 0
    var running = true

    fun eat(expectedType: String): Boolean {
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
                eat("IDENTIEFIER")
                println("reveal found")
            }
        }
           i++
        }
        tokens
    } catch (_: ParseFailure) {
        null
    }
    
}