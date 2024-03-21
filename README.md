# DendryScope - Skein for Dendry Games
Nominated for best artifact at AIIDE 2023.

Run a demo of DendryScope in your browser: https://jazztap.github.io/DendryScope/

Or read the proceedings paper:
https://ojs.aaai.org/index.php/AIIDE/article/view/27527

## Local build options

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
