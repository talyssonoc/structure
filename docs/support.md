# Support and compatibility

Structure is built on top of modern JavaScript, using new features like [Proxy](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy), [Reflect](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Reflect) and [Symbol](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol). That being so, there are some things regarding compatibility you should consider when using Structure.

## Node

Node has only implemented all the used features at version 10, so for using Structure for a backend application you'll need Node 10 or later.

## Browser

We have a UMD version for usage in browsers. Right now the tests are ran both in Node (using the original code) and in Electron (using the UMD version) and the whole test suite passes for both cases. Since we use modern JavaScript features inside the lib (like [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)), older browsers may not support it. Polyfilling them may be an option but it's not oficially supported.
