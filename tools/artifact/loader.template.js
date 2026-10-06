<script>(function(){var M=@@MANIFEST@@,loaded={},orig=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,"src"),oset=Element.prototype.setAttribute;
function key(v){var m=typeof v==="string"&&v.match(/images\/(stock_[^\/]+)\.jpg$/);return m&&m[1]in M?m[1]:null}
function load(k){var b=M[k];if(!loaded[b])loaded[b]=fetch("images/s"+("0"+b).slice(-2)+".json").then(function(r){return r.json()});return loaded[b].then(function(j){return j[k]})}
function put(img,k,setter){load(k).then(function(u){if(img.__want===k)setter(u)})}
Object.defineProperty(HTMLImageElement.prototype,"src",{get:orig.get,set:function(v){var k=key(v);if(k){this.__want=k;var t=this;put(t,k,function(u){orig.set.call(t,u)})}else{this.__want=null;orig.set.call(this,v)}},configurable:true});
Element.prototype.setAttribute=function(a,v){if(this instanceof HTMLImageElement&&a==="src"){var k=key(v);if(k){this.__want=k;var t=this;put(t,k,function(u){oset.call(t,"src",u)});return}this.__want=null}return oset.call(this,a,v)};
})();</script>