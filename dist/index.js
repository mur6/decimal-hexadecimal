var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};

// build/_snowpack/env.js
var env_exports = {};
__export(env_exports, {
  MODE: () => MODE,
  NODE_ENV: () => NODE_ENV,
  SSR: () => SSR
});
var MODE = "production";
var NODE_ENV = "production";
var SSR = false;

// build/_snowpack/pkg/svelte/internal.js
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function append(target, node) {
  target.appendChild(node);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  node.parentNode.removeChild(node);
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.wholeText !== data)
    text2.data = data;
}
function set_input_value(input, value) {
  input.value = value == null ? "" : value;
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
var dirty_components = [];
var binding_callbacks = [];
var render_callbacks = [];
var flush_callbacks = [];
var resolved_promise = Promise.resolve();
var update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
var flushing = false;
var seen_callbacks = new Set();
function flush() {
  if (flushing)
    return;
  flushing = true;
  do {
    for (let i = 0; i < dirty_components.length; i += 1) {
      const component = dirty_components[i];
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  flushing = false;
  seen_callbacks.clear();
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
var outroing = new Set();
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function mount_component(component, target, anchor, customElement) {
  const {fragment, on_mount, on_destroy: on_destroy2, after_update} = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = on_mount.map(run).filter(is_function);
      if (on_destroy2) {
        on_destroy2.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal2, props, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: null,
    props,
    update: noop,
    not_equal: not_equal2,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(parent_component ? parent_component.$$.context : options.context || []),
    callbacks: blank_object(),
    dirty,
    skip_bound: false
  };
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal2($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    flush();
  }
  set_current_component(parent_component);
}
var SvelteComponent = class {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
};

// build/dist/App.svelte.js
function create_fragment(ctx) {
  let h1;
  let t1;
  let div0;
  let p0;
  let t3;
  let p1;
  let t4;
  let input0;
  let p2;
  let p3;
  let t5;
  let t6;
  let t7;
  let hr;
  let t8;
  let div1;
  let p4;
  let t10;
  let p5;
  let t11;
  let input1;
  let t12;
  let p6;
  let t13;
  let t14;
  let mounted;
  let dispose;
  return {
    c() {
      h1 = element("h1");
      h1.textContent = "10進数・16進数変換ツール";
      t1 = space();
      div0 = element("div");
      p0 = element("p");
      p0.textContent = "10=>16 変換";
      t3 = space();
      p1 = element("p");
      t4 = text("10進数");
      input0 = element("input");
      p2 = element("p");
      p3 = element("p");
      t5 = text("16進数: ");
      t6 = text(ctx[2]);
      t7 = space();
      hr = element("hr");
      t8 = space();
      div1 = element("div");
      p4 = element("p");
      p4.textContent = "16=>10 変換";
      t10 = space();
      p5 = element("p");
      t11 = text("16進数:");
      input1 = element("input");
      t12 = space();
      p6 = element("p");
      t13 = text("10進数:");
      t14 = text(ctx[3]);
      attr(input0, "placeholder", "0");
      attr(input1, "placeholder", "0");
    },
    m(target, anchor) {
      insert(target, h1, anchor);
      insert(target, t1, anchor);
      insert(target, div0, anchor);
      append(div0, p0);
      append(div0, t3);
      append(div0, p1);
      append(p1, t4);
      append(p1, input0);
      set_input_value(input0, ctx[0]);
      append(div0, p2);
      append(div0, p3);
      append(p3, t5);
      append(p3, t6);
      insert(target, t7, anchor);
      insert(target, hr, anchor);
      insert(target, t8, anchor);
      insert(target, div1, anchor);
      append(div1, p4);
      append(div1, t10);
      append(div1, p5);
      append(p5, t11);
      append(p5, input1);
      set_input_value(input1, ctx[1]);
      append(div1, t12);
      append(div1, p6);
      append(p6, t13);
      append(p6, t14);
      if (!mounted) {
        dispose = [
          listen(input0, "input", ctx[4]),
          listen(input1, "input", ctx[5])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 1 && input0.value !== ctx2[0]) {
        set_input_value(input0, ctx2[0]);
      }
      if (dirty & 4)
        set_data(t6, ctx2[2]);
      if (dirty & 2 && input1.value !== ctx2[1]) {
        set_input_value(input1, ctx2[1]);
      }
      if (dirty & 8)
        set_data(t14, ctx2[3]);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(h1);
      if (detaching)
        detach(t1);
      if (detaching)
        detach(div0);
      if (detaching)
        detach(t7);
      if (detaching)
        detach(hr);
      if (detaching)
        detach(t8);
      if (detaching)
        detach(div1);
      mounted = false;
      run_all(dispose);
    }
  };
}
function convToHex(a) {
  let b = parseInt(a);
  return b.toString(16);
}
function convToDecimal(val) {
  const hextable = new Array("1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
  let s = val.toString().toLowerCase();
  let ret = 0;
  let charLength = s.length;
  for (let i = 0; i < charLength; i++) {
    let c = s.charAt(charLength - i - 1);
    for (let j = 0; j < 16; j++) {
      if (c == hextable[j]) {
        ret += (j + 1) * Math.pow(16, i);
        break;
      }
    }
  }
  return ret;
}
function instance($$self, $$props, $$invalidate) {
  let hex_converted;
  let decimal_converted;
  let decimal_value = 0;
  let hex_value = 0;
  function input0_input_handler() {
    decimal_value = this.value;
    $$invalidate(0, decimal_value);
  }
  function input1_input_handler() {
    hex_value = this.value;
    $$invalidate(1, hex_value);
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 1) {
      $:
        $$invalidate(2, hex_converted = convToHex(decimal_value));
    }
    if ($$self.$$.dirty & 2) {
      $:
        $$invalidate(3, decimal_converted = convToDecimal(hex_value));
    }
  };
  return [
    decimal_value,
    hex_value,
    hex_converted,
    decimal_converted,
    input0_input_handler,
    input1_input_handler
  ];
}
var App = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
};
var App_svelte_default = App;

// build/dist/index.js
import.meta.env = env_exports;
var app = new App_svelte_default({
  target: document.body
});
var dist_default = app;
if (void 0) {
  (void 0).accept();
  (void 0).dispose(() => {
    app.$destroy();
  });
}
export {
  dist_default as default
};
//# sourceMappingURL=index.js.map
