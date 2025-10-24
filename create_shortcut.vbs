Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Get the current directory path
strCurrentDir = objFSO.GetParentFolderName(WScript.ScriptFullName)

' Create the shortcut on the desktop
strDesktop = objShell.SpecialFolders("Desktop")
Set objShortcut = objShell.CreateShortcut(strDesktop & "\Animal Hide Agent.lnk")

' Set the shortcut properties
objShortcut.TargetPath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
objShortcut.Arguments = "--new-window --app=file:///" & Replace(strCurrentDir, "\", "/") & "/index.html"
objShortcut.WorkingDirectory = strCurrentDir
objShortcut.Description = "Animal Hide Agent - Opens in browser"
objShortcut.IconLocation = "C:\Program Files\Google\Chrome\Application\chrome.exe,0"

' Save the shortcut
objShortcut.Save

WScript.Echo "Desktop shortcut created successfully!"
