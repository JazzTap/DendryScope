# DendryScope - Skein for Dendry Games

Run a demo of DendryScope in your browser: https://jazztap.github.io/DendryScope/

For convenience, the webpack build is included in this repository. It can be run using:
~~~sh
python -m http.server
~~~

If you want to build DendryScope from source, please reach out. To get started, try:
~~~sh
npm install
npx webpack build
python -m http.server
~~~

A self-hosted build with both clingo-wasm and the Observable Runtime is available thanks to the following discussions:

https://github.com/domoritz/clingo-wasm/issues/287  
https://talk.observablehq.com/t/file-attachments/2499/19  

A fully self-contained build was not realized within time constraints.
