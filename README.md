<img src="structure.jpg" width="300">

### A simple schema/attributes library built on top of modern JavaScript
---
Structure provides a simple interface which allows you to add schemas to your ES6 classes.

## Getting started 

`npm install structure`

## Usage

```js
import { attributes } from 'structure';

const User = attributes({})(class User {});
```
