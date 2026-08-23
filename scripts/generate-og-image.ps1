# Generates public/og-image.png (1200x630) for social sharing previews.
# Pure .NET System.Drawing - no external dependencies.
Add-Type -AssemblyName System.Drawing

$W = 1200
$H = 630
$bmp = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

function New-Rgb([int]$r, [int]$gr, [int]$b, [int]$a = 255) {
  return [System.Drawing.Color]::FromArgb($a, $r, $gr, $b)
}

# --- base ------------------------------------------------------------------
$g.Clear((New-Rgb 4 5 10))

# --- radial glows (PathGradientBrush = true radial falloff) ----------------
function Add-Glow([int]$cx, [int]$cy, [int]$radius, $color, [int]$alpha) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddEllipse(($cx - $radius), ($cy - $radius), ($radius * 2), ($radius * 2))
  $br = New-Object System.Drawing.Drawing2D.PathGradientBrush($path)
  $br.CenterColor = [System.Drawing.Color]::FromArgb($alpha, $color.R, $color.G, $color.B)
  $br.SurroundColors = @([System.Drawing.Color]::FromArgb(0, $color.R, $color.G, $color.B))
  $g.FillPath($br, $path)
  $br.Dispose(); $path.Dispose()
}
Add-Glow -60 -40 620 (New-Rgb 56 189 248) 92     # volt, top-left
Add-Glow 1290 250 560 (New-Rgb 34 197 94) 74     # titan, right
Add-Glow 140 700 520 (New-Rgb 239 68 68) 58      # rage, bottom-left

# --- faint steel grid ------------------------------------------------------
$grid = New-Object System.Drawing.Pen((New-Rgb 199 208 222 16), 1)
for ($x = 0; $x -le $W; $x += 48) { $g.DrawLine($grid, $x, 0, $x, $H) }
for ($y = 0; $y -le $H; $y += 48) { $g.DrawLine($grid, 0, $y, $W, $y) }
$grid.Dispose()

# --- vignette so the copy pops --------------------------------------------
$vig = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  (New-Object System.Drawing.Point(0, 0)),
  (New-Object System.Drawing.Point(0, $H)),
  (New-Rgb 4 5 10 0), (New-Rgb 4 5 10 200))
$g.FillRectangle($vig, 0, 0, $W, $H)
$vig.Dispose()

# --- fonts -----------------------------------------------------------------
# Impact is the display fallback declared in tailwind.config.js, so the OG card
# matches the site's heading voice on machines without Oswald.
$fBrand = New-Object System.Drawing.Font('Impact', 104, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$fHead  = New-Object System.Drawing.Font('Segoe UI Semibold', 46, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fSub   = New-Object System.Drawing.Font('Segoe UI', 27, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$fEye   = New-Object System.Drawing.Font('Segoe UI Semibold', 22, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)

$bVolt   = New-Object System.Drawing.SolidBrush((New-Rgb 56 189 248))
$bTitan  = New-Object System.Drawing.SolidBrush((New-Rgb 74 222 128))
$bSilver = New-Object System.Drawing.SolidBrush((New-Rgb 244 247 251))
$bMuted  = New-Object System.Drawing.SolidBrush((New-Rgb 148 163 184))
$bEye    = New-Object System.Drawing.SolidBrush((New-Rgb 125 211 252))

$fmt = New-Object System.Drawing.StringFormat
$fmt.FormatFlags = [System.Drawing.StringFormatFlags]::NoWrap

$PAD = 84

# Built from char codes on purpose: PowerShell 5.1 reads a BOM-less .ps1 as
# ANSI, so literal UTF-8 punctuation in the source would render as mojibake.
$BULLET = [char]0x2022   # •
$MIDDOT = [char]0x00B7   # ·

# --- eyebrow pill ----------------------------------------------------------
$eyeText = "STRENGTH  $BULLET  CONDITIONING  $BULLET  COACHING"
$eyeSize = $g.MeasureString($eyeText, $fEye, 2000, $fmt)
$pillW = [int]$eyeSize.Width + 44
$pillH = 48
$pillY = 96
$pillPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$r = 24
$pillPath.AddArc($PAD, $pillY, ($r * 2), $pillH, 90, 180)
$pillPath.AddArc(($PAD + $pillW - ($r * 2)), $pillY, ($r * 2), $pillH, 270, 180)
$pillPath.CloseFigure()
$pillFill = New-Object System.Drawing.SolidBrush((New-Rgb 56 189 248 30))
$pillPen = New-Object System.Drawing.Pen((New-Rgb 56 189 248 120), 2)
$g.FillPath($pillFill, $pillPath)
$g.DrawPath($pillPen, $pillPath)
$g.DrawString($eyeText, $fEye, $bEye, ($PAD + 22), ($pillY + 12), $fmt)
$pillFill.Dispose(); $pillPen.Dispose(); $pillPath.Dispose()

# --- brand wordmark --------------------------------------------------------
$y = 172
$t1 = 'BAGGA'
$t2 = 'FITNESS'
$w1 = $g.MeasureString($t1, $fBrand, 2000, $fmt).Width
$g.DrawString($t1, $fBrand, $bVolt, $PAD, $y, $fmt)
$g.DrawString($t2, $fBrand, $bTitan, ($PAD + $w1 - 6), $y, $fmt)

# --- headline + details ----------------------------------------------------
$g.DrawString('Build Your Best Body', $fHead, $bSilver, $PAD, 320, $fmt)
$g.DrawString("Prahladpur, Uttar Pradesh 221112  $MIDDOT  +91 7510054999", $fSub, $bMuted, $PAD, 392, $fmt)
$g.DrawString("BMI & ideal-weight calculator  $MIDDOT  7-day workout plans  $MIDDOT  protein guide", $fSub, $bMuted, $PAD, 436, $fmt)

# --- accent rule at the bottom --------------------------------------------
$rule = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  (New-Object System.Drawing.Point($PAD, 0)),
  (New-Object System.Drawing.Point(($W - $PAD), 0)),
  (New-Rgb 56 189 248), (New-Rgb 74 222 128))
$g.FillRectangle($rule, $PAD, 528, ($W - ($PAD * 2)), 5)
$rule.Dispose()
$g.DrawString('bagga-fitness.vercel.app', $fSub, $bMuted, $PAD, 548, $fmt)

# --- save ------------------------------------------------------------------
# Script lives in scripts/, the image belongs in the project's public/ folder.
$out = Join-Path (Split-Path $PSScriptRoot -Parent) 'public\og-image.png'
New-Item -ItemType Directory -Force -Path (Split-Path $out) | Out-Null
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Output "written: $out"
Write-Output ("size: {0} bytes" -f (Get-Item $out).Length)
