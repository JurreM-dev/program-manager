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
                val type = node.get("specifier")
                if(type == "noRefString") {
                    var prevCode: Int = -1
                    for(ch in node.get("value") as String) {
                        val code = ch.code
                        if(code != prevCode) {
                            prevCode = code
                            val setStr = "SET H $code"
                            compiledParticle.add(setStr)
                        }
                        compiledParticle.add("OUTC H")
                    }
                }
            }
        }
    }
    compiledParticle.add("HLT")
    return compiledParticle;
}