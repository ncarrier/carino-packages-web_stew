#!/bin/luajit

o = print
o "Content-type: text/html"
o ""
io.flush()

dir = os.getenv "REQUEST_URI"
if not dir then
	print "invalid request"
	os.exit(1)
end

o "<html>"
o "  <head>"
o "    <title>Choose your destiny</title>"
o "  </head>"
o "  <body>"
o "    <h1>Get the client for your platform</h1>"
o "    <ul>"
f = assert(io.popen("ls /var/www/" .. dir))
while true do
	local line = f:read()
	if line == nil then
		break
	end
	o('      <li><a href="/clients/' .. line .. '">' .. line .. '</li>')
end
f.close()
o "    </ul>"
o "  </body>"
o "</html>" 
