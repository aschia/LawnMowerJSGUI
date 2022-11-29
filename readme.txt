if you get an SSL error run this in the terminal
$env:NODE_OPTIONS="--openssl-legacy-provider"

[1] Error: error:0308010C:digital envelope routines::unsupported
[1]     at new Hash (node:internal/crypto/hash:71:19)
[1]     at Object.createHash (node:crypto:133:10)
[1]     at module.exports (C:\Projects\react\react-express-fileupload-master\client\node_modules\webpack\lib\util\createHash.js:135:53)

to start, use 'npm run dev' in a terminal window
to break out, use ctrl c twice

