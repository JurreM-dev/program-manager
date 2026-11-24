fun main() {
    println("star initialized");
}

@OptIn(kotlin.js.ExperimentalJsExport::class)
@JsExport
fun test(): String {
    return "test"
}