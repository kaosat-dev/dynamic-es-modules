const source = `
import {foo} from './foo.js';
import culu from '/zborg/other.js';

foo()
foo()
console.log('Hi, i am a dynamic module');
import('/zborg/other.js')
  .then(x=> console.log('ssdf', x))
`
// this does not work as eval creates SCRIPTS, not MODULES, so no import/Export
// const moduleEvaled = eval(source)

// this does not work as it is just creating a function in the middle of the current module, no go!
// import('xxx').then(...) works though
// const f = new Function(source)
// const moduleFned = f()