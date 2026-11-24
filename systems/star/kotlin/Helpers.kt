package help

import kotlin.js.JsAny
import kotlin.js.JsExport

fun call(fn: JsAny, output: String): Unit = js("fn(output)")