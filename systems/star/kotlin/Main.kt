import kotlin.js.JsAny
import kotlin.js.JsExport

import help.call

import lexer.tokenize

typealias itemArray = MutableList<MutableMap<String, Any?>>
typealias item = MutableMap<String, Any?>

@JsExport
fun star(output: JsAny, source: String): String {
    tokenize(output, source)
    return "test"
}