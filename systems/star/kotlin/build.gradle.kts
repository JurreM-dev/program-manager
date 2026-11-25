plugins {
    kotlin("multiplatform") version "2.4.21"
}

repositories {
    mavenCentral()
}

kotlin {
    @OptIn(
        org.jetbrains.kotlin.gradle.ExperimentalWasmDsl::class,
        org.jetbrains.kotlin.gradle.targets.js.dsl.ExperimentalDistributionDsl::class
    )
    wasmJs {
        browser()
        binaries.executable()
    }
    sourceSets {
        val wasmJsMain by getting {
            kotlin.srcDir(".")
            kotlin.include("*.kt", "lexer/**/*.kt", "parser/**/*.kt")
            languageSettings.optIn("kotlin.js.ExperimentalJsExport")
        }
    }
}

tasks.register<Copy>("copyWasmModule") {
    dependsOn("wasmJsProductionExecutableCompileSync")
    from(layout.buildDirectory.dir("compileSync/wasmJs/main/productionExecutable/kotlin"))
    into(layout.buildDirectory)
    include("starCompiler.*")
}