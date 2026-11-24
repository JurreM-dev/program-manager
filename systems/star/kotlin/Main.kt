import kotlin.js.JsAny
import kotlin.js.JsExport

import help.call

import lexer.tokenize

@JsExport
fun star(output: JsAny): String {
    tokenize(output)
    return "test"
}