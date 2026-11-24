# Local-only smoke test for admin CRUD. Usage: pwsh tests/smoke-admin.local.ps1  (backend on :5000, local DB only)
$ErrorActionPreference = 'Stop'
$pw = (Select-String -Path "$PSScriptRoot\..\.env" -Pattern '^DEFAULT_ADMIN_PASSWORD=(.*)').Matches[0].Groups[1].Value
$b = 'http://localhost:5000/api'

function Call($method, $path, $body, $token) {
  $h = @{}
  if ($token) { $h.Authorization = "Bearer $token" }
  $args2 = @{ Method = $method; Uri = "$b$path"; Headers = $h; ContentType = 'application/json' }
  if ($body) { $args2.Body = ($body | ConvertTo-Json -Depth 6) }
  try { Invoke-RestMethod @args2 } catch { "ERR $method $path -> $($_.Exception.Response.StatusCode.value__)" }
}

"unauth POST /content (expect 401):"; Call POST /content @{ title = 'x'; description = 'y' }
$tok = (Call POST /auth/login @{ email = 'admin@dance-academy.com'; password = $pw }).token
"login token: $([bool]$tok)"

"--- news"
$n = Call POST /content @{ title = 'Test post'; description = 'Hello body' } $tok
$n | Select-Object _id, title, description, date | Format-List
(Call PUT "/content/$($n._id)" @{ title = 'Test post v2'; description = 'Edited' } $tok) | Select-Object title, description | Format-List
"public news count: $(@(Call GET /content).Count)"

"--- staff without img/bio"
$s = Call POST /staff @{ name = 'Test Teacher'; title = 'Instructor'; styles = @('Jazz'); bio = @(); img = '' } $tok
$s | Select-Object _id, name, active | Format-List
"public staff count: $(@(Call GET /staff).Count)"

"--- program update keeps order (expect 3)"
$p = Call POST /programs @{ name = 'P1'; age = '5-7'; bucket = 'Ages 5-13'; style = 'Jazz'; schedule = 'Mon 4pm'; order = 3 } $tok
(Call PUT "/programs/$($p._id)" @{ name = 'P1b' } $tok).order
"public programs count: $(@(Call GET /programs).Count)"

"--- schedule with items"
$sc = Call POST /schedule @{ day = 'Monday'; order = 0; items = @(@{ title = 'Ballet'; time = '4:00pm'; studio = 'A'; age = 'Ages 5-13' }) } $tok
"items saved: $($sc.items.Count)"
"public schedule count: $(@(Call GET /schedule).Count)"

"--- cleanup"
Call DELETE "/content/$($n._id)" $null $tok
Call DELETE "/staff/$($s._id)" $null $tok
Call DELETE "/programs/$($p._id)" $null $tok
Call DELETE "/schedule/$($sc._id)" $null $tok

