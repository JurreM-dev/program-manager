package lexer

import kotlin.js.JsAny
import kotlin.js.JsExport

import help.call

typealias itemArray = MutableList<MutableMap<String, Any?>>
typealias item = MutableMap<String, Any?>

var whiteRegex = "\\s".toRegex()
var letterRegex = "[a-zA-Z]".toRegex()
val quote = "\""

fun tokenize(output: JsAny, source: String): itemArray {
    val tokens = mutableListOf<MutableMap<String, Any?>>()
    val chars: List<String> = source.chunked(1) 
    var current = 0
    while(current < chars.size) {
        val currentChar = chars[current]
        when {
            currentChar.matches(whiteRegex) -> {
                // Ignore whitespace
            }
            currentChar.matches(letterRegex) -> {
                var idString: String = ""
                idString += currentChar
                var nextIndex = current + 1
                while(nextIndex < chars.size && chars[nextIndex].matches(letterRegex)) {
                    idString += chars[nextIndex]
                    current++
                    nextIndex++ 
                }
                val token = mutableMapOf<String, Any?>(
                    "type" to "IDENTIFIER",
                    "value" to idString
                )
                tokens.add(token)
            }
            currentChar == quote -> {
                var string: String = ""
                var nextIndex = current + 1
                while(nextIndex < chars.size && chars[nextIndex] != quote) {
                    string += chars[nextIndex]
                    current++
                    nextIndex++ 
                }
                val token = mutableMapOf<String, Any?>(
                    "type" to "STRING",
                    "value" to string
                )
                current++
                tokens.add(token)
            }
            currentChar == "(" -> {
                val token = mutableMapOf<String, Any?>(
                    "type" to "LPAREN",
                    "value" to currentChar
                )
                tokens.add(token)
            }
            currentChar == ")" -> {
                val token = mutableMapOf<String, Any?>(
                    "type" to "RPAREN",
                    "value" to currentChar
                )
                tokens.add(token)
            }
            else -> {
                val token = mutableMapOf<String, Any?>(
                    "type" to "UNKNOWN",
                    "value" to currentChar
                )
                tokens.add(token)
            }
        }
        current++
    }
    return tokens
}