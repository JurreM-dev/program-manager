package compiler

import kotlin.js.JsAny
import kotlin.js.JsExport

import help.call

typealias itemArray = MutableList<MutableMap<String, Any?>>
typealias item = MutableMap<String, Any?>

fun compile(AST: itemArray): MutableList<String> {
    val compiledParticle = mutableListOf<String>()
    for(node: item in AST) {
        when(node.get("type")) {
            "print" -> {
                println("found print in compilation")
            }
        }
    }
    return compiledParticle;
}