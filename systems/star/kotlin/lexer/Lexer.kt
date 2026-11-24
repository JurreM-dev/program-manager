package lexer

import kotlin.js.JsAny
import kotlin.js.JsExport

import help.call

fun tokenize(output: JsAny) {
    call(output, "tokenizer runs")
}