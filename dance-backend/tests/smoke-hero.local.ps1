$ErrorActionPreference = 'Stop'
$pw = (Select-String -Path "$PSScriptRoot\..\.env" -Pattern '^DEFAULT_ADMIN_PASSWORD=(.*)').Matches[0].Groups[1].Value
$b = 'http://localhost:5000/api'
$tok = (Invoke-RestMethod -Method Post -Uri "$b/auth/login" -ContentType application/json -Body (@{ email = 'admin@dance-academy.com'; password = $pw } | ConvertTo-Json)).token
$h = @{ Authorization = "Bearer $tok" }
$imgs = "$PSScriptRoot\..\..\dance-react\public\images"
$files = 'DanceCompanyGroupPic20162017.jpg', 'Bre2014.jpg' | ForEach-Object { Join-Path $imgs $_ }
$r = curl.exe -s -X POST -H "Authorization: Bearer $tok" -F "images=@$($files[0])" -F "images=@$($files[1])" "$b/upload/images" | ConvertFrom-Json
"uploaded: $($r.paths -join ', ')"
$i = 0
foreach ($p in $r.paths) { Invoke-RestMethod -Method Post -Uri "$b/hero-slides" -Headers $h -ContentType application/json -Body (@{ image = $p; order = $i } | ConvertTo-Json) | Out-Null; $i++ }
$s = Invoke-RestMethod "$b/hero-slides"
"public slides: $($s.Count) order: $(($s | ForEach-Object { $_.order }) -join ',')"
Invoke-RestMethod -Method Put -Uri "$b/hero-slides/$($s[0]._id)" -Headers $h -ContentType application/json -Body (@{ order = 1 } | ConvertTo-Json) | Out-Null
Invoke-RestMethod -Method Put -Uri "$b/hero-slides/$($s[1]._id)" -Headers $h -ContentType application/json -Body (@{ order = 0 } | ConvertTo-Json) | Out-Null
$s2 = Invoke-RestMethod "$b/hero-slides"
"after reorder first is former second: $($s2[0]._id -eq $s[1]._id)"
"unauth create: " + $(try { Invoke-RestMethod -Method Post -Uri "$b/hero-slides" -ContentType application/json -Body '{"image":"/x"}' } catch { $_.Exception.Response.StatusCode.value__ })
