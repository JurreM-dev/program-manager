package compiler

import kotlin.js.JsAny
import kotlin.js.JsExport

import help.call

typealias itemArray = MutableList<MutableMap<String, Any?>>
typealias item = MutableMap<String, Any?>

fun compile(AST: itemArray, output: JsAny): MutableList<String> {

    /* 
        different registers and what to use them for:
        A - pointers while loading/storing
        B - temporary storage for loading/storing
        H - no reference string outputs
    */

    val compiledParticle = mutableListOf<String>()
    var pointerCounter = 0
    val variablePointers = mutableListOf<MutableMap<String, Any>>()

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
                } else if(type == "reference") {
                    val varName = node.get("value")
                    val keyExists = variablePointers.any { it["name"] == varName }
                    var varType: String
                    if(!keyExists) {
                        call(output, "cannot reveal a variable that does not exist")
                        continue
                    }
                    val pointerData = variablePointers.find { it["name"] == varName }
                    if (pointerData == null) {
                        call(output, "cannot reveal a variable that does not exist")
                        continue
                    }
                    val pointerType = pointerData["type"]
                    if(pointerType == "integer") {
                        val pointer = pointerData["memoryPointer"]
                        val setStr = "SET A $pointer"
                        compiledParticle.add(setStr)
                        val getStr = "LOAD B A"
                        val outStr = "OUT B"
                        compiledParticle.add(getStr)
                        compiledParticle.add(outStr)
                    }
                }
            }
            "intDecleration" -> {
                val name = node.get("name") as String
                val value = node.get("value") as Int

                val createStr = "SET B $value"
                compiledParticle.add(createStr)
                val pointer = pointerCounter
                val pointStr = "SET A $pointer"
                compiledParticle.add(pointStr)
                val storeStr = "STORE B A"
                compiledParticle.add(storeStr)

                val pointerData = mutableMapOf<String, Any>(
                    "name" to name,
                    "memoryPointer" to pointerCounter,
                    "size" to 2,
                    "type" to "integer"
                )
                println(pointerData)
                pointerCounter += 2
                variablePointers.add(pointerData)
            }
            else -> {
                call(output, "unknown ast node")
            }
        }
    }
    compiledParticle.add("HLT")
    return compiledParticle;
}