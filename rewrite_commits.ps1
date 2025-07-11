# PowerShell script to rewrite git commit messages
$commits = git log --format="%H" --reverse
$count = 1

foreach ($commit in $commits) {
    $newMessage = "第${count}次提交"
    git filter-branch -f --msg-filter "echo '$newMessage'" $commit..$commit
    $count++
}

Write-Host "All commits have been rewritten!"
