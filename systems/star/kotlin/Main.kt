import kotlin.js.JsAny
import kotlin.js.JsExport

import help.call

import lexer.tokenize
import parser.parse
import compiler.compile

typealias itemArray = MutableList<MutableMap<String, Any?>>
typealias item = MutableMap<String, Any?>

@JsExport
fun star(output: JsAny, source: String): String {
    val contents = tokenize(output, source)
    val ast = parse(contents)
    println(ast)
    if(ast.isNullOrEmpty()) {
        return ""
    }
    val particleCode = compile(ast, output)
    val particleString = particleCode.joinToString("\n")
    return particleString
}