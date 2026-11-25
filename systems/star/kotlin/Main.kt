import kotlin.js.JsAny
import kotlin.js.JsExport

import help.call

import lexer.tokenize
import parser.parse

typealias itemArray = MutableList<MutableMap<String, Any?>>
typealias item = MutableMap<String, Any?>

@JsExport
fun star(output: JsAny, source: String): String {
    val contents = tokenize(output, source)
    val ast = parse(contents)
    println(ast)
    return "test"
}