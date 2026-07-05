# 拆分 lessons.ts 为按分类的独立文件
# 用法: .\scripts\split-lessons.ps1

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path $MyInvocation.MyCommand.Path | Split-Path

Write-Host "读取 lessons.ts ..." -ForegroundColor Cyan
$lines = Get-Content (Join-Path $projectRoot "src\data\lessons.ts") -Encoding UTF8

# 找到 lessons 数组的范围
$foundLessonsStart = $false
$lessonsStartLine = -1
$lessonsEndLine = -1
$braceCount = 0

for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "export const lessons:\s*Lesson\[\]\s*=\s*\[") {
        $foundLessonsStart = $true
        $lessonsStartLine = $i
        # 从这一行开始计算大括号
        $braceCount = ($lines[$i] -split '{').Count - 1  # 这一行中的 {
        $braceCount -= ($lines[$i] -split '}').Count - 1  # 这一行中的 }
        continue
    }
    if ($foundLessonsStart) {
        $braceCount += ($lines[$i] -split '{').Count - 1
        $braceCount -= ($lines[$i] -split '}').Count - 1
        if ($braceCount -eq 0) {
            $lessonsEndLine = $i
            break
        }
    }
}

Write-Host "lessons 数组: 行 $($lessonsStartLine+1) 到 $($lessonsEndLine+1)" -ForegroundColor Green

# 提取 lessons 数组内容（不含首尾行）
$lessonsContent = $lines[($lessonsStartLine+1)..($lessonsEndLine-1)]

# 按分类分组课程
$categories = @{}
$currentLesson = @()
$lessonBraceCount = 0

foreach ($line in $lessonsContent) {
    if ($line -match "^\s*\{\s*$") {
        # 可能是一门新课程开始
        if ($lessonBraceCount -eq 0 -and $currentLesson.Count -eq 0) {
            $currentLesson += $line
            $lessonBraceCount = 1
            continue
        }
    }

    if ($currentLesson.Count -gt 0) {
        $currentLesson += $line
        $lessonBraceCount += ($line -split '{').Count - 1
        $lessonBraceCount -= ($line -split '}').Count - 1

        if ($lessonBraceCount -eq 0) {
            # 一门课程结束
            $lessonStr = $currentLesson -join "`n"

            # 提取 path 来确定分类
            $pathMatch = [regex]::Match($lessonStr, "path:\s*'([^']+)'")
            if ($pathMatch.Success) {
                $path = $pathMatch.Groups[1].Value
                $catId = ($path -split '/')[1]

                if (-not $categories.ContainsKey($catId)) {
                    $categories[$catId] = @()
                }
                $categories[$catId] += $lessonStr
            }

            $currentLesson = @()
        }
    }
}

Write-Host "`n分类统计:" -ForegroundColor Cyan
foreach ($kv in $categories.GetEnumerator() | Sort-Object Name) {
    Write-Host "  $($kv.Key): $($kv.Value.Count) 门" -ForegroundColor Green
}

# 确保输出目录存在
$dataDir = Join-Path $projectRoot "src\data\lessons-by-cat"
New-Item -ItemType Directory -Force -Path $dataDir | Out-Null

# 为每个分类生成文件
foreach ($catId in $categories.Keys) {
    $lessons = $categories[$catId]

    # 生成 demo 导入语句（从变量名推断）
    $demoImports = @()
    foreach ($lessonStr in $lessons) {
        $demoMatch = [regex]::Match($lessonStr, "demo:\s*(\w+)")
        if ($demoMatch.Success) {
            $demoName = $demoMatch.Groups[1].Value
            if ($demoName -notin $demoImports) {
                $demoImports += $demoName
            }
        }
        $codeMatch = [regex]::Match($lessonStr, "code:\s*(\w+)")
        if ($codeMatch.Success) {
            $codeName = $codeMatch.Groups[1].Value
            if ($codeName -notin $demoImports) {
                $demoImports += $codeName
            }
        }
    }

    $importStr = "import type { Lesson } from '../lesson-types'`n"
    if ($demoImports.Count -gt 0) {
        $importStr += "import {`n"
        foreach ($imp in $demoImports) {
            $importStr += "  $imp,`n"
        }
        $importStr += "} from '../lesson-demos/$catId'`n"
    }

    $content = "// $catId 课程分类数据`n"
    $content += $importStr + "`n"
    $content += "export const lessons: Lesson[] = [`n"
    $content += ($lessons -join ",`n`n") + "`n"
    $content += "] as const`n`n"
    $content += "export const lessonIdMap = new Map(lessons.map((l: Lesson) => [l.id, l]))`n"
    $content += "export const lessonPathMap = new Map(lessons.map((l: Lesson) => [l.path, l]))`n"

    $outPath = Join-Path $dataDir "$catId.ts"
    Set-Content -Path $outPath -Value $content -Encoding UTF8
    Write-Host "已写入: $outPath ($($lessons.Count) 门)" -ForegroundColor Yellow
}

Write-Host "`n完成！" -ForegroundColor Cyan
