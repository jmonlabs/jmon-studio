function ji(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
var lt = { exports: {} }, ir = {}, De = {}, Ge = {}, or = {}, sr = {}, ar = {}, qr;
function Yt() {
  return qr || (qr = 1, (function(o) {
    Object.defineProperty(o, "__esModule", { value: !0 }), o.regexpCode = o.getEsmExportName = o.getProperty = o.safeStringify = o.stringify = o.strConcat = o.addCodeArg = o.str = o._ = o.nil = o._Code = o.Name = o.IDENTIFIER = o._CodeOrName = void 0;
    class e {
    }
    o._CodeOrName = e, o.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class t extends e {
      constructor(u) {
        if (super(), !o.IDENTIFIER.test(u))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = u;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return !1;
      }
      get names() {
        return { [this.str]: 1 };
      }
    }
    o.Name = t;
    class r extends e {
      constructor(u) {
        super(), this._items = typeof u == "string" ? [u] : u;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return !1;
        const u = this._items[0];
        return u === "" || u === '""';
      }
      get str() {
        var u;
        return (u = this._str) !== null && u !== void 0 ? u : this._str = this._items.reduce((f, w) => `${f}${w}`, "");
      }
      get names() {
        var u;
        return (u = this._names) !== null && u !== void 0 ? u : this._names = this._items.reduce((f, w) => (w instanceof t && (f[w.str] = (f[w.str] || 0) + 1), f), {});
      }
    }
    o._Code = r, o.nil = new r("");
    function n(p, ...u) {
      const f = [p[0]];
      let w = 0;
      for (; w < u.length; )
        a(f, u[w]), f.push(p[++w]);
      return new r(f);
    }
    o._ = n;
    const i = new r("+");
    function s(p, ...u) {
      const f = [b(p[0])];
      let w = 0;
      for (; w < u.length; )
        f.push(i), a(f, u[w]), f.push(i, b(p[++w]));
      return c(f), new r(f);
    }
    o.str = s;
    function a(p, u) {
      u instanceof r ? p.push(...u._items) : u instanceof t ? p.push(u) : p.push(g(u));
    }
    o.addCodeArg = a;
    function c(p) {
      let u = 1;
      for (; u < p.length - 1; ) {
        if (p[u] === i) {
          const f = l(p[u - 1], p[u + 1]);
          if (f !== void 0) {
            p.splice(u - 1, 3, f);
            continue;
          }
          p[u++] = "+";
        }
        u++;
      }
    }
    function l(p, u) {
      if (u === '""')
        return p;
      if (p === '""')
        return u;
      if (typeof p == "string")
        return u instanceof t || p[p.length - 1] !== '"' ? void 0 : typeof u != "string" ? `${p.slice(0, -1)}${u}"` : u[0] === '"' ? p.slice(0, -1) + u.slice(1) : void 0;
      if (typeof u == "string" && u[0] === '"' && !(p instanceof t))
        return `"${p}${u.slice(1)}`;
    }
    function d(p, u) {
      return u.emptyStr() ? p : p.emptyStr() ? u : s`${p}${u}`;
    }
    o.strConcat = d;
    function g(p) {
      return typeof p == "number" || typeof p == "boolean" || p === null ? p : b(Array.isArray(p) ? p.join(",") : p);
    }
    function _(p) {
      return new r(b(p));
    }
    o.stringify = _;
    function b(p) {
      return JSON.stringify(p).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    o.safeStringify = b;
    function $(p) {
      return typeof p == "string" && o.IDENTIFIER.test(p) ? new r(`.${p}`) : n`[${p}]`;
    }
    o.getProperty = $;
    function m(p) {
      if (typeof p == "string" && o.IDENTIFIER.test(p))
        return new r(`${p}`);
      throw new Error(`CodeGen: invalid export name: ${p}, use explicit $id name mapping`);
    }
    o.getEsmExportName = m;
    function h(p) {
      return new r(p.toString());
    }
    o.regexpCode = h;
  })(ar)), ar;
}
var cr = {}, Dr;
function Lr() {
  return Dr || (Dr = 1, (function(o) {
    Object.defineProperty(o, "__esModule", { value: !0 }), o.ValueScope = o.ValueScopeName = o.Scope = o.varKinds = o.UsedValueState = void 0;
    const e = Yt();
    class t extends Error {
      constructor(l) {
        super(`CodeGen: "code" for ${l} not defined`), this.value = l.value;
      }
    }
    var r;
    (function(c) {
      c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
    })(r || (o.UsedValueState = r = {})), o.varKinds = {
      const: new e.Name("const"),
      let: new e.Name("let"),
      var: new e.Name("var")
    };
    class n {
      constructor({ prefixes: l, parent: d } = {}) {
        this._names = {}, this._prefixes = l, this._parent = d;
      }
      toName(l) {
        return l instanceof e.Name ? l : this.name(l);
      }
      name(l) {
        return new e.Name(this._newName(l));
      }
      _newName(l) {
        const d = this._names[l] || this._nameGroup(l);
        return `${l}${d.index++}`;
      }
      _nameGroup(l) {
        var d, g;
        if (!((g = (d = this._parent) === null || d === void 0 ? void 0 : d._prefixes) === null || g === void 0) && g.has(l) || this._prefixes && !this._prefixes.has(l))
          throw new Error(`CodeGen: prefix "${l}" is not allowed in this scope`);
        return this._names[l] = { prefix: l, index: 0 };
      }
    }
    o.Scope = n;
    class i extends e.Name {
      constructor(l, d) {
        super(d), this.prefix = l;
      }
      setValue(l, { property: d, itemIndex: g }) {
        this.value = l, this.scopePath = (0, e._)`.${new e.Name(d)}[${g}]`;
      }
    }
    o.ValueScopeName = i;
    const s = (0, e._)`\n`;
    class a extends n {
      constructor(l) {
        super(l), this._values = {}, this._scope = l.scope, this.opts = { ...l, _n: l.lines ? s : e.nil };
      }
      get() {
        return this._scope;
      }
      name(l) {
        return new i(l, this._newName(l));
      }
      value(l, d) {
        var g;
        if (d.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const _ = this.toName(l), { prefix: b } = _, $ = (g = d.key) !== null && g !== void 0 ? g : d.ref;
        let m = this._values[b];
        if (m) {
          const u = m.get($);
          if (u)
            return u;
        } else
          m = this._values[b] = /* @__PURE__ */ new Map();
        m.set($, _);
        const h = this._scope[b] || (this._scope[b] = []), p = h.length;
        return h[p] = d.ref, _.setValue(d, { property: b, itemIndex: p }), _;
      }
      getValue(l, d) {
        const g = this._values[l];
        if (g)
          return g.get(d);
      }
      scopeRefs(l, d = this._values) {
        return this._reduceValues(d, (g) => {
          if (g.scopePath === void 0)
            throw new Error(`CodeGen: name "${g}" has no value`);
          return (0, e._)`${l}${g.scopePath}`;
        });
      }
      scopeCode(l = this._values, d, g) {
        return this._reduceValues(l, (_) => {
          if (_.value === void 0)
            throw new Error(`CodeGen: name "${_}" has no value`);
          return _.value.code;
        }, d, g);
      }
      _reduceValues(l, d, g = {}, _) {
        let b = e.nil;
        for (const $ in l) {
          const m = l[$];
          if (!m)
            continue;
          const h = g[$] = g[$] || /* @__PURE__ */ new Map();
          m.forEach((p) => {
            if (h.has(p))
              return;
            h.set(p, r.Started);
            let u = d(p);
            if (u) {
              const f = this.opts.es5 ? o.varKinds.var : o.varKinds.const;
              b = (0, e._)`${b}${f} ${p} = ${u};${this.opts._n}`;
            } else if (u = _?.(p))
              b = (0, e._)`${b}${u}${this.opts._n}`;
            else
              throw new t(p);
            h.set(p, r.Completed);
          });
        }
        return b;
      }
    }
    o.ValueScope = a;
  })(cr)), cr;
}
var zr;
function ne() {
  return zr || (zr = 1, (function(o) {
    Object.defineProperty(o, "__esModule", { value: !0 }), o.or = o.and = o.not = o.CodeGen = o.operators = o.varKinds = o.ValueScopeName = o.ValueScope = o.Scope = o.Name = o.regexpCode = o.stringify = o.getProperty = o.nil = o.strConcat = o.str = o._ = void 0;
    const e = Yt(), t = Lr();
    var r = Yt();
    Object.defineProperty(o, "_", { enumerable: !0, get: function() {
      return r._;
    } }), Object.defineProperty(o, "str", { enumerable: !0, get: function() {
      return r.str;
    } }), Object.defineProperty(o, "strConcat", { enumerable: !0, get: function() {
      return r.strConcat;
    } }), Object.defineProperty(o, "nil", { enumerable: !0, get: function() {
      return r.nil;
    } }), Object.defineProperty(o, "getProperty", { enumerable: !0, get: function() {
      return r.getProperty;
    } }), Object.defineProperty(o, "stringify", { enumerable: !0, get: function() {
      return r.stringify;
    } }), Object.defineProperty(o, "regexpCode", { enumerable: !0, get: function() {
      return r.regexpCode;
    } }), Object.defineProperty(o, "Name", { enumerable: !0, get: function() {
      return r.Name;
    } });
    var n = Lr();
    Object.defineProperty(o, "Scope", { enumerable: !0, get: function() {
      return n.Scope;
    } }), Object.defineProperty(o, "ValueScope", { enumerable: !0, get: function() {
      return n.ValueScope;
    } }), Object.defineProperty(o, "ValueScopeName", { enumerable: !0, get: function() {
      return n.ValueScopeName;
    } }), Object.defineProperty(o, "varKinds", { enumerable: !0, get: function() {
      return n.varKinds;
    } }), o.operators = {
      GT: new e._Code(">"),
      GTE: new e._Code(">="),
      LT: new e._Code("<"),
      LTE: new e._Code("<="),
      EQ: new e._Code("==="),
      NEQ: new e._Code("!=="),
      NOT: new e._Code("!"),
      OR: new e._Code("||"),
      AND: new e._Code("&&"),
      ADD: new e._Code("+")
    };
    class i {
      optimizeNodes() {
        return this;
      }
      optimizeNames(y, E) {
        return this;
      }
    }
    class s extends i {
      constructor(y, E, R) {
        super(), this.varKind = y, this.name = E, this.rhs = R;
      }
      render({ es5: y, _n: E }) {
        const R = y ? t.varKinds.var : this.varKind, G = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${R} ${this.name}${G};` + E;
      }
      optimizeNames(y, E) {
        if (y[this.name.str])
          return this.rhs && (this.rhs = F(this.rhs, y, E)), this;
      }
      get names() {
        return this.rhs instanceof e._CodeOrName ? this.rhs.names : {};
      }
    }
    class a extends i {
      constructor(y, E, R) {
        super(), this.lhs = y, this.rhs = E, this.sideEffects = R;
      }
      render({ _n: y }) {
        return `${this.lhs} = ${this.rhs};` + y;
      }
      optimizeNames(y, E) {
        if (!(this.lhs instanceof e.Name && !y[this.lhs.str] && !this.sideEffects))
          return this.rhs = F(this.rhs, y, E), this;
      }
      get names() {
        const y = this.lhs instanceof e.Name ? {} : { ...this.lhs.names };
        return L(y, this.rhs);
      }
    }
    class c extends a {
      constructor(y, E, R, G) {
        super(y, R, G), this.op = E;
      }
      render({ _n: y }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + y;
      }
    }
    class l extends i {
      constructor(y) {
        super(), this.label = y, this.names = {};
      }
      render({ _n: y }) {
        return `${this.label}:` + y;
      }
    }
    class d extends i {
      constructor(y) {
        super(), this.label = y, this.names = {};
      }
      render({ _n: y }) {
        return `break${this.label ? ` ${this.label}` : ""};` + y;
      }
    }
    class g extends i {
      constructor(y) {
        super(), this.error = y;
      }
      render({ _n: y }) {
        return `throw ${this.error};` + y;
      }
      get names() {
        return this.error.names;
      }
    }
    class _ extends i {
      constructor(y) {
        super(), this.code = y;
      }
      render({ _n: y }) {
        return `${this.code};` + y;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(y, E) {
        return this.code = F(this.code, y, E), this;
      }
      get names() {
        return this.code instanceof e._CodeOrName ? this.code.names : {};
      }
    }
    class b extends i {
      constructor(y = []) {
        super(), this.nodes = y;
      }
      render(y) {
        return this.nodes.reduce((E, R) => E + R.render(y), "");
      }
      optimizeNodes() {
        const { nodes: y } = this;
        let E = y.length;
        for (; E--; ) {
          const R = y[E].optimizeNodes();
          Array.isArray(R) ? y.splice(E, 1, ...R) : R ? y[E] = R : y.splice(E, 1);
        }
        return y.length > 0 ? this : void 0;
      }
      optimizeNames(y, E) {
        const { nodes: R } = this;
        let G = R.length;
        for (; G--; ) {
          const k = R[G];
          k.optimizeNames(y, E) || (Y(y, k.names), R.splice(G, 1));
        }
        return R.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((y, E) => V(y, E.names), {});
      }
    }
    class $ extends b {
      render(y) {
        return "{" + y._n + super.render(y) + "}" + y._n;
      }
    }
    class m extends b {
    }
    class h extends $ {
    }
    h.kind = "else";
    class p extends $ {
      constructor(y, E) {
        super(E), this.condition = y;
      }
      render(y) {
        let E = `if(${this.condition})` + super.render(y);
        return this.else && (E += "else " + this.else.render(y)), E;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const y = this.condition;
        if (y === !0)
          return this.nodes;
        let E = this.else;
        if (E) {
          const R = E.optimizeNodes();
          E = this.else = Array.isArray(R) ? new h(R) : R;
        }
        if (E)
          return y === !1 ? E instanceof p ? E : E.nodes : this.nodes.length ? this : new p(de(y), E instanceof p ? [E] : E.nodes);
        if (!(y === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(y, E) {
        var R;
        if (this.else = (R = this.else) === null || R === void 0 ? void 0 : R.optimizeNames(y, E), !!(super.optimizeNames(y, E) || this.else))
          return this.condition = F(this.condition, y, E), this;
      }
      get names() {
        const y = super.names;
        return L(y, this.condition), this.else && V(y, this.else.names), y;
      }
    }
    p.kind = "if";
    class u extends $ {
    }
    u.kind = "for";
    class f extends u {
      constructor(y) {
        super(), this.iteration = y;
      }
      render(y) {
        return `for(${this.iteration})` + super.render(y);
      }
      optimizeNames(y, E) {
        if (super.optimizeNames(y, E))
          return this.iteration = F(this.iteration, y, E), this;
      }
      get names() {
        return V(super.names, this.iteration.names);
      }
    }
    class w extends u {
      constructor(y, E, R, G) {
        super(), this.varKind = y, this.name = E, this.from = R, this.to = G;
      }
      render(y) {
        const E = y.es5 ? t.varKinds.var : this.varKind, { name: R, from: G, to: k } = this;
        return `for(${E} ${R}=${G}; ${R}<${k}; ${R}++)` + super.render(y);
      }
      get names() {
        const y = L(super.names, this.from);
        return L(y, this.to);
      }
    }
    class v extends u {
      constructor(y, E, R, G) {
        super(), this.loop = y, this.varKind = E, this.name = R, this.iterable = G;
      }
      render(y) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(y);
      }
      optimizeNames(y, E) {
        if (super.optimizeNames(y, E))
          return this.iterable = F(this.iterable, y, E), this;
      }
      get names() {
        return V(super.names, this.iterable.names);
      }
    }
    class S extends $ {
      constructor(y, E, R) {
        super(), this.name = y, this.args = E, this.async = R;
      }
      render(y) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(y);
      }
    }
    S.kind = "func";
    class P extends b {
      render(y) {
        return "return " + super.render(y);
      }
    }
    P.kind = "return";
    class A extends $ {
      render(y) {
        let E = "try" + super.render(y);
        return this.catch && (E += this.catch.render(y)), this.finally && (E += this.finally.render(y)), E;
      }
      optimizeNodes() {
        var y, E;
        return super.optimizeNodes(), (y = this.catch) === null || y === void 0 || y.optimizeNodes(), (E = this.finally) === null || E === void 0 || E.optimizeNodes(), this;
      }
      optimizeNames(y, E) {
        var R, G;
        return super.optimizeNames(y, E), (R = this.catch) === null || R === void 0 || R.optimizeNames(y, E), (G = this.finally) === null || G === void 0 || G.optimizeNames(y, E), this;
      }
      get names() {
        const y = super.names;
        return this.catch && V(y, this.catch.names), this.finally && V(y, this.finally.names), y;
      }
    }
    class C extends $ {
      constructor(y) {
        super(), this.error = y;
      }
      render(y) {
        return `catch(${this.error})` + super.render(y);
      }
    }
    C.kind = "catch";
    class O extends $ {
      render(y) {
        return "finally" + super.render(y);
      }
    }
    O.kind = "finally";
    class D {
      constructor(y, E = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...E, _n: E.lines ? `
` : "" }, this._extScope = y, this._scope = new t.Scope({ parent: y }), this._nodes = [new m()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(y) {
        return this._scope.name(y);
      }
      // reserves unique name in the external scope
      scopeName(y) {
        return this._extScope.name(y);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(y, E) {
        const R = this._extScope.value(y, E);
        return (this._values[R.prefix] || (this._values[R.prefix] = /* @__PURE__ */ new Set())).add(R), R;
      }
      getScopeValue(y, E) {
        return this._extScope.getValue(y, E);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(y) {
        return this._extScope.scopeRefs(y, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(y, E, R, G) {
        const k = this._scope.toName(E);
        return R !== void 0 && G && (this._constants[k.str] = R), this._leafNode(new s(y, k, R)), k;
      }
      // `const` declaration (`var` in es5 mode)
      const(y, E, R) {
        return this._def(t.varKinds.const, y, E, R);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(y, E, R) {
        return this._def(t.varKinds.let, y, E, R);
      }
      // `var` declaration with optional assignment
      var(y, E, R) {
        return this._def(t.varKinds.var, y, E, R);
      }
      // assignment code
      assign(y, E, R) {
        return this._leafNode(new a(y, E, R));
      }
      // `+=` code
      add(y, E) {
        return this._leafNode(new c(y, o.operators.ADD, E));
      }
      // appends passed SafeExpr to code or executes Block
      code(y) {
        return typeof y == "function" ? y() : y !== e.nil && this._leafNode(new _(y)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...y) {
        const E = ["{"];
        for (const [R, G] of y)
          E.length > 1 && E.push(","), E.push(R), (R !== G || this.opts.es5) && (E.push(":"), (0, e.addCodeArg)(E, G));
        return E.push("}"), new e._Code(E);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(y, E, R) {
        if (this._blockNode(new p(y)), E && R)
          this.code(E).else().code(R).endIf();
        else if (E)
          this.code(E).endIf();
        else if (R)
          throw new Error('CodeGen: "else" body without "then" body');
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(y) {
        return this._elseNode(new p(y));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new h());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(p, h);
      }
      _for(y, E) {
        return this._blockNode(y), E && this.code(E).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(y, E) {
        return this._for(new f(y), E);
      }
      // `for` statement for a range of values
      forRange(y, E, R, G, k = this.opts.es5 ? t.varKinds.var : t.varKinds.let) {
        const Q = this._scope.toName(y);
        return this._for(new w(k, Q, E, R), () => G(Q));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(y, E, R, G = t.varKinds.const) {
        const k = this._scope.toName(y);
        if (this.opts.es5) {
          const Q = E instanceof e.Name ? E : this.var("_arr", E);
          return this.forRange("_i", 0, (0, e._)`${Q}.length`, (X) => {
            this.var(k, (0, e._)`${Q}[${X}]`), R(k);
          });
        }
        return this._for(new v("of", G, k, E), () => R(k));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(y, E, R, G = this.opts.es5 ? t.varKinds.var : t.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(y, (0, e._)`Object.keys(${E})`, R);
        const k = this._scope.toName(y);
        return this._for(new v("in", G, k, E), () => R(k));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(u);
      }
      // `label` statement
      label(y) {
        return this._leafNode(new l(y));
      }
      // `break` statement
      break(y) {
        return this._leafNode(new d(y));
      }
      // `return` statement
      return(y) {
        const E = new P();
        if (this._blockNode(E), this.code(y), E.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(P);
      }
      // `try` statement
      try(y, E, R) {
        if (!E && !R)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const G = new A();
        if (this._blockNode(G), this.code(y), E) {
          const k = this.name("e");
          this._currNode = G.catch = new C(k), E(k);
        }
        return R && (this._currNode = G.finally = new O(), this.code(R)), this._endBlockNode(C, O);
      }
      // `throw` statement
      throw(y) {
        return this._leafNode(new g(y));
      }
      // start self-balancing block
      block(y, E) {
        return this._blockStarts.push(this._nodes.length), y && this.code(y).endBlock(E), this;
      }
      // end the current self-balancing block
      endBlock(y) {
        const E = this._blockStarts.pop();
        if (E === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const R = this._nodes.length - E;
        if (R < 0 || y !== void 0 && R !== y)
          throw new Error(`CodeGen: wrong number of nodes: ${R} vs ${y} expected`);
        return this._nodes.length = E, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(y, E = e.nil, R, G) {
        return this._blockNode(new S(y, E, R)), G && this.code(G).endFunc(), this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(S);
      }
      optimize(y = 1) {
        for (; y-- > 0; )
          this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
      }
      _leafNode(y) {
        return this._currNode.nodes.push(y), this;
      }
      _blockNode(y) {
        this._currNode.nodes.push(y), this._nodes.push(y);
      }
      _endBlockNode(y, E) {
        const R = this._currNode;
        if (R instanceof y || E && R instanceof E)
          return this._nodes.pop(), this;
        throw new Error(`CodeGen: not in block "${E ? `${y.kind}/${E.kind}` : y.kind}"`);
      }
      _elseNode(y) {
        const E = this._currNode;
        if (!(E instanceof p))
          throw new Error('CodeGen: "else" without "if"');
        return this._currNode = E.else = y, this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const y = this._nodes;
        return y[y.length - 1];
      }
      set _currNode(y) {
        const E = this._nodes;
        E[E.length - 1] = y;
      }
    }
    o.CodeGen = D;
    function V(N, y) {
      for (const E in y)
        N[E] = (N[E] || 0) + (y[E] || 0);
      return N;
    }
    function L(N, y) {
      return y instanceof e._CodeOrName ? V(N, y.names) : N;
    }
    function F(N, y, E) {
      if (N instanceof e.Name)
        return R(N);
      if (!G(N))
        return N;
      return new e._Code(N._items.reduce((k, Q) => (Q instanceof e.Name && (Q = R(Q)), Q instanceof e._Code ? k.push(...Q._items) : k.push(Q), k), []));
      function R(k) {
        const Q = E[k.str];
        return Q === void 0 || y[k.str] !== 1 ? k : (delete y[k.str], Q);
      }
      function G(k) {
        return k instanceof e._Code && k._items.some((Q) => Q instanceof e.Name && y[Q.str] === 1 && E[Q.str] !== void 0);
      }
    }
    function Y(N, y) {
      for (const E in y)
        N[E] = (N[E] || 0) - (y[E] || 0);
    }
    function de(N) {
      return typeof N == "boolean" || typeof N == "number" || N === null ? !N : (0, e._)`!${I(N)}`;
    }
    o.not = de;
    const oe = M(o.operators.AND);
    function re(...N) {
      return N.reduce(oe);
    }
    o.and = re;
    const se = M(o.operators.OR);
    function q(...N) {
      return N.reduce(se);
    }
    o.or = q;
    function M(N) {
      return (y, E) => y === e.nil ? E : E === e.nil ? y : (0, e._)`${I(y)} ${N} ${I(E)}`;
    }
    function I(N) {
      return N instanceof e.Name ? N : (0, e._)`(${N})`;
    }
  })(sr)), sr;
}
var te = {}, Vr;
function ae() {
  if (Vr) return te;
  Vr = 1, Object.defineProperty(te, "__esModule", { value: !0 }), te.checkStrictMode = te.getErrorPath = te.Type = te.useFunc = te.setEvaluated = te.evaluatedPropsToName = te.mergeEvaluated = te.eachItem = te.unescapeJsonPointer = te.escapeJsonPointer = te.escapeFragment = te.unescapeFragment = te.schemaRefOrVal = te.schemaHasRulesButRef = te.schemaHasRules = te.checkUnknownRules = te.alwaysValidSchema = te.toHash = void 0;
  const o = ne(), e = Yt();
  function t(v) {
    const S = {};
    for (const P of v)
      S[P] = !0;
    return S;
  }
  te.toHash = t;
  function r(v, S) {
    return typeof S == "boolean" ? S : Object.keys(S).length === 0 ? !0 : (n(v, S), !i(S, v.self.RULES.all));
  }
  te.alwaysValidSchema = r;
  function n(v, S = v.schema) {
    const { opts: P, self: A } = v;
    if (!P.strictSchema || typeof S == "boolean")
      return;
    const C = A.RULES.keywords;
    for (const O in S)
      C[O] || w(v, `unknown keyword: "${O}"`);
  }
  te.checkUnknownRules = n;
  function i(v, S) {
    if (typeof v == "boolean")
      return !v;
    for (const P in v)
      if (S[P])
        return !0;
    return !1;
  }
  te.schemaHasRules = i;
  function s(v, S) {
    if (typeof v == "boolean")
      return !v;
    for (const P in v)
      if (P !== "$ref" && S.all[P])
        return !0;
    return !1;
  }
  te.schemaHasRulesButRef = s;
  function a({ topSchemaRef: v, schemaPath: S }, P, A, C) {
    if (!C) {
      if (typeof P == "number" || typeof P == "boolean")
        return P;
      if (typeof P == "string")
        return (0, o._)`${P}`;
    }
    return (0, o._)`${v}${S}${(0, o.getProperty)(A)}`;
  }
  te.schemaRefOrVal = a;
  function c(v) {
    return g(decodeURIComponent(v));
  }
  te.unescapeFragment = c;
  function l(v) {
    return encodeURIComponent(d(v));
  }
  te.escapeFragment = l;
  function d(v) {
    return typeof v == "number" ? `${v}` : v.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  te.escapeJsonPointer = d;
  function g(v) {
    return v.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  te.unescapeJsonPointer = g;
  function _(v, S) {
    if (Array.isArray(v))
      for (const P of v)
        S(P);
    else
      S(v);
  }
  te.eachItem = _;
  function b({ mergeNames: v, mergeToName: S, mergeValues: P, resultToName: A }) {
    return (C, O, D, V) => {
      const L = D === void 0 ? O : D instanceof o.Name ? (O instanceof o.Name ? v(C, O, D) : S(C, O, D), D) : O instanceof o.Name ? (S(C, D, O), O) : P(O, D);
      return V === o.Name && !(L instanceof o.Name) ? A(C, L) : L;
    };
  }
  te.mergeEvaluated = {
    props: b({
      mergeNames: (v, S, P) => v.if((0, o._)`${P} !== true && ${S} !== undefined`, () => {
        v.if((0, o._)`${S} === true`, () => v.assign(P, !0), () => v.assign(P, (0, o._)`${P} || {}`).code((0, o._)`Object.assign(${P}, ${S})`));
      }),
      mergeToName: (v, S, P) => v.if((0, o._)`${P} !== true`, () => {
        S === !0 ? v.assign(P, !0) : (v.assign(P, (0, o._)`${P} || {}`), m(v, P, S));
      }),
      mergeValues: (v, S) => v === !0 ? !0 : { ...v, ...S },
      resultToName: $
    }),
    items: b({
      mergeNames: (v, S, P) => v.if((0, o._)`${P} !== true && ${S} !== undefined`, () => v.assign(P, (0, o._)`${S} === true ? true : ${P} > ${S} ? ${P} : ${S}`)),
      mergeToName: (v, S, P) => v.if((0, o._)`${P} !== true`, () => v.assign(P, S === !0 ? !0 : (0, o._)`${P} > ${S} ? ${P} : ${S}`)),
      mergeValues: (v, S) => v === !0 ? !0 : Math.max(v, S),
      resultToName: (v, S) => v.var("items", S)
    })
  };
  function $(v, S) {
    if (S === !0)
      return v.var("props", !0);
    const P = v.var("props", (0, o._)`{}`);
    return S !== void 0 && m(v, P, S), P;
  }
  te.evaluatedPropsToName = $;
  function m(v, S, P) {
    Object.keys(P).forEach((A) => v.assign((0, o._)`${S}${(0, o.getProperty)(A)}`, !0));
  }
  te.setEvaluated = m;
  const h = {};
  function p(v, S) {
    return v.scopeValue("func", {
      ref: S,
      code: h[S.code] || (h[S.code] = new e._Code(S.code))
    });
  }
  te.useFunc = p;
  var u;
  (function(v) {
    v[v.Num = 0] = "Num", v[v.Str = 1] = "Str";
  })(u || (te.Type = u = {}));
  function f(v, S, P) {
    if (v instanceof o.Name) {
      const A = S === u.Num;
      return P ? A ? (0, o._)`"[" + ${v} + "]"` : (0, o._)`"['" + ${v} + "']"` : A ? (0, o._)`"/" + ${v}` : (0, o._)`"/" + ${v}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return P ? (0, o.getProperty)(v).toString() : "/" + d(v);
  }
  te.getErrorPath = f;
  function w(v, S, P = v.opts.strictSchema) {
    if (P) {
      if (S = `strict mode: ${S}`, P === !0)
        throw new Error(S);
      v.self.logger.warn(S);
    }
  }
  return te.checkStrictMode = w, te;
}
var ut = {}, Fr;
function Fe() {
  if (Fr) return ut;
  Fr = 1, Object.defineProperty(ut, "__esModule", { value: !0 });
  const o = ne(), e = {
    // validation function arguments
    data: new o.Name("data"),
    // data passed to validation function
    // args passed from referencing schema
    valCxt: new o.Name("valCxt"),
    // validation/data context - should not be used directly, it is destructured to the names below
    instancePath: new o.Name("instancePath"),
    parentData: new o.Name("parentData"),
    parentDataProperty: new o.Name("parentDataProperty"),
    rootData: new o.Name("rootData"),
    // root data - same as the data passed to the first/top validation function
    dynamicAnchors: new o.Name("dynamicAnchors"),
    // used to support recursiveRef and dynamicRef
    // function scoped variables
    vErrors: new o.Name("vErrors"),
    // null or array of validation errors
    errors: new o.Name("errors"),
    // counter of validation errors
    this: new o.Name("this"),
    // "globals"
    self: new o.Name("self"),
    scope: new o.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new o.Name("json"),
    jsonPos: new o.Name("jsonPos"),
    jsonLen: new o.Name("jsonLen"),
    jsonPart: new o.Name("jsonPart")
  };
  return ut.default = e, ut;
}
var Gr;
function Xt() {
  return Gr || (Gr = 1, (function(o) {
    Object.defineProperty(o, "__esModule", { value: !0 }), o.extendErrors = o.resetErrorsCount = o.reportExtraError = o.reportError = o.keyword$DataError = o.keywordError = void 0;
    const e = ne(), t = ae(), r = Fe();
    o.keywordError = {
      message: ({ keyword: h }) => (0, e.str)`must pass "${h}" keyword validation`
    }, o.keyword$DataError = {
      message: ({ keyword: h, schemaType: p }) => p ? (0, e.str)`"${h}" keyword must be ${p} ($data)` : (0, e.str)`"${h}" keyword is invalid ($data)`
    };
    function n(h, p = o.keywordError, u, f) {
      const { it: w } = h, { gen: v, compositeRule: S, allErrors: P } = w, A = g(h, p, u);
      f ?? (S || P) ? c(v, A) : l(w, (0, e._)`[${A}]`);
    }
    o.reportError = n;
    function i(h, p = o.keywordError, u) {
      const { it: f } = h, { gen: w, compositeRule: v, allErrors: S } = f, P = g(h, p, u);
      c(w, P), v || S || l(f, r.default.vErrors);
    }
    o.reportExtraError = i;
    function s(h, p) {
      h.assign(r.default.errors, p), h.if((0, e._)`${r.default.vErrors} !== null`, () => h.if(p, () => h.assign((0, e._)`${r.default.vErrors}.length`, p), () => h.assign(r.default.vErrors, null)));
    }
    o.resetErrorsCount = s;
    function a({ gen: h, keyword: p, schemaValue: u, data: f, errsCount: w, it: v }) {
      if (w === void 0)
        throw new Error("ajv implementation error");
      const S = h.name("err");
      h.forRange("i", w, r.default.errors, (P) => {
        h.const(S, (0, e._)`${r.default.vErrors}[${P}]`), h.if((0, e._)`${S}.instancePath === undefined`, () => h.assign((0, e._)`${S}.instancePath`, (0, e.strConcat)(r.default.instancePath, v.errorPath))), h.assign((0, e._)`${S}.schemaPath`, (0, e.str)`${v.errSchemaPath}/${p}`), v.opts.verbose && (h.assign((0, e._)`${S}.schema`, u), h.assign((0, e._)`${S}.data`, f));
      });
    }
    o.extendErrors = a;
    function c(h, p) {
      const u = h.const("err", p);
      h.if((0, e._)`${r.default.vErrors} === null`, () => h.assign(r.default.vErrors, (0, e._)`[${u}]`), (0, e._)`${r.default.vErrors}.push(${u})`), h.code((0, e._)`${r.default.errors}++`);
    }
    function l(h, p) {
      const { gen: u, validateName: f, schemaEnv: w } = h;
      w.$async ? u.throw((0, e._)`new ${h.ValidationError}(${p})`) : (u.assign((0, e._)`${f}.errors`, p), u.return(!1));
    }
    const d = {
      keyword: new e.Name("keyword"),
      schemaPath: new e.Name("schemaPath"),
      // also used in JTD errors
      params: new e.Name("params"),
      propertyName: new e.Name("propertyName"),
      message: new e.Name("message"),
      schema: new e.Name("schema"),
      parentSchema: new e.Name("parentSchema")
    };
    function g(h, p, u) {
      const { createErrors: f } = h.it;
      return f === !1 ? (0, e._)`{}` : _(h, p, u);
    }
    function _(h, p, u = {}) {
      const { gen: f, it: w } = h, v = [
        b(w, u),
        $(h, u)
      ];
      return m(h, p, v), f.object(...v);
    }
    function b({ errorPath: h }, { instancePath: p }) {
      const u = p ? (0, e.str)`${h}${(0, t.getErrorPath)(p, t.Type.Str)}` : h;
      return [r.default.instancePath, (0, e.strConcat)(r.default.instancePath, u)];
    }
    function $({ keyword: h, it: { errSchemaPath: p } }, { schemaPath: u, parentSchema: f }) {
      let w = f ? p : (0, e.str)`${p}/${h}`;
      return u && (w = (0, e.str)`${w}${(0, t.getErrorPath)(u, t.Type.Str)}`), [d.schemaPath, w];
    }
    function m(h, { params: p, message: u }, f) {
      const { keyword: w, data: v, schemaValue: S, it: P } = h, { opts: A, propertyName: C, topSchemaRef: O, schemaPath: D } = P;
      f.push([d.keyword, w], [d.params, typeof p == "function" ? p(h) : p || (0, e._)`{}`]), A.messages && f.push([d.message, typeof u == "function" ? u(h) : u]), A.verbose && f.push([d.schema, S], [d.parentSchema, (0, e._)`${O}${D}`], [r.default.data, v]), C && f.push([d.propertyName, C]);
    }
  })(or)), or;
}
var Br;
function Ii() {
  if (Br) return Ge;
  Br = 1, Object.defineProperty(Ge, "__esModule", { value: !0 }), Ge.boolOrEmptySchema = Ge.topBoolOrEmptySchema = void 0;
  const o = Xt(), e = ne(), t = Fe(), r = {
    message: "boolean schema is false"
  };
  function n(a) {
    const { gen: c, schema: l, validateName: d } = a;
    l === !1 ? s(a, !1) : typeof l == "object" && l.$async === !0 ? c.return(t.default.data) : (c.assign((0, e._)`${d}.errors`, null), c.return(!0));
  }
  Ge.topBoolOrEmptySchema = n;
  function i(a, c) {
    const { gen: l, schema: d } = a;
    d === !1 ? (l.var(c, !1), s(a)) : l.var(c, !0);
  }
  Ge.boolOrEmptySchema = i;
  function s(a, c) {
    const { gen: l, data: d } = a, g = {
      gen: l,
      keyword: "false schema",
      data: d,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: a
    };
    (0, o.reportError)(g, r, void 0, c);
  }
  return Ge;
}
var _e = {}, Be = {}, Ur;
function ti() {
  if (Ur) return Be;
  Ur = 1, Object.defineProperty(Be, "__esModule", { value: !0 }), Be.getRules = Be.isJSONType = void 0;
  const o = ["string", "number", "integer", "boolean", "null", "object", "array"], e = new Set(o);
  function t(n) {
    return typeof n == "string" && e.has(n);
  }
  Be.isJSONType = t;
  function r() {
    const n = {
      number: { type: "number", rules: [] },
      string: { type: "string", rules: [] },
      array: { type: "array", rules: [] },
      object: { type: "object", rules: [] }
    };
    return {
      types: { ...n, integer: !0, boolean: !0, null: !0 },
      rules: [{ rules: [] }, n.number, n.string, n.array, n.object],
      post: { rules: [] },
      all: {},
      keywords: {}
    };
  }
  return Be.getRules = r, Be;
}
var Le = {}, Kr;
function ri() {
  if (Kr) return Le;
  Kr = 1, Object.defineProperty(Le, "__esModule", { value: !0 }), Le.shouldUseRule = Le.shouldUseGroup = Le.schemaHasRulesForType = void 0;
  function o({ schema: r, self: n }, i) {
    const s = n.RULES.types[i];
    return s && s !== !0 && e(r, s);
  }
  Le.schemaHasRulesForType = o;
  function e(r, n) {
    return n.rules.some((i) => t(r, i));
  }
  Le.shouldUseGroup = e;
  function t(r, n) {
    var i;
    return r[n.keyword] !== void 0 || ((i = n.definition.implements) === null || i === void 0 ? void 0 : i.some((s) => r[s] !== void 0));
  }
  return Le.shouldUseRule = t, Le;
}
var Jr;
function Wt() {
  if (Jr) return _e;
  Jr = 1, Object.defineProperty(_e, "__esModule", { value: !0 }), _e.reportTypeError = _e.checkDataTypes = _e.checkDataType = _e.coerceAndCheckDataType = _e.getJSONTypes = _e.getSchemaTypes = _e.DataType = void 0;
  const o = ti(), e = ri(), t = Xt(), r = ne(), n = ae();
  var i;
  (function(u) {
    u[u.Correct = 0] = "Correct", u[u.Wrong = 1] = "Wrong";
  })(i || (_e.DataType = i = {}));
  function s(u) {
    const f = a(u.type);
    if (f.includes("null")) {
      if (u.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!f.length && u.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      u.nullable === !0 && f.push("null");
    }
    return f;
  }
  _e.getSchemaTypes = s;
  function a(u) {
    const f = Array.isArray(u) ? u : u ? [u] : [];
    if (f.every(o.isJSONType))
      return f;
    throw new Error("type must be JSONType or JSONType[]: " + f.join(","));
  }
  _e.getJSONTypes = a;
  function c(u, f) {
    const { gen: w, data: v, opts: S } = u, P = d(f, S.coerceTypes), A = f.length > 0 && !(P.length === 0 && f.length === 1 && (0, e.schemaHasRulesForType)(u, f[0]));
    if (A) {
      const C = $(f, v, S.strictNumbers, i.Wrong);
      w.if(C, () => {
        P.length ? g(u, f, P) : h(u);
      });
    }
    return A;
  }
  _e.coerceAndCheckDataType = c;
  const l = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function d(u, f) {
    return f ? u.filter((w) => l.has(w) || f === "array" && w === "array") : [];
  }
  function g(u, f, w) {
    const { gen: v, data: S, opts: P } = u, A = v.let("dataType", (0, r._)`typeof ${S}`), C = v.let("coerced", (0, r._)`undefined`);
    P.coerceTypes === "array" && v.if((0, r._)`${A} == 'object' && Array.isArray(${S}) && ${S}.length == 1`, () => v.assign(S, (0, r._)`${S}[0]`).assign(A, (0, r._)`typeof ${S}`).if($(f, S, P.strictNumbers), () => v.assign(C, S))), v.if((0, r._)`${C} !== undefined`);
    for (const D of w)
      (l.has(D) || D === "array" && P.coerceTypes === "array") && O(D);
    v.else(), h(u), v.endIf(), v.if((0, r._)`${C} !== undefined`, () => {
      v.assign(S, C), _(u, C);
    });
    function O(D) {
      switch (D) {
        case "string":
          v.elseIf((0, r._)`${A} == "number" || ${A} == "boolean"`).assign(C, (0, r._)`"" + ${S}`).elseIf((0, r._)`${S} === null`).assign(C, (0, r._)`""`);
          return;
        case "number":
          v.elseIf((0, r._)`${A} == "boolean" || ${S} === null
              || (${A} == "string" && ${S} && ${S} == +${S})`).assign(C, (0, r._)`+${S}`);
          return;
        case "integer":
          v.elseIf((0, r._)`${A} === "boolean" || ${S} === null
              || (${A} === "string" && ${S} && ${S} == +${S} && !(${S} % 1))`).assign(C, (0, r._)`+${S}`);
          return;
        case "boolean":
          v.elseIf((0, r._)`${S} === "false" || ${S} === 0 || ${S} === null`).assign(C, !1).elseIf((0, r._)`${S} === "true" || ${S} === 1`).assign(C, !0);
          return;
        case "null":
          v.elseIf((0, r._)`${S} === "" || ${S} === 0 || ${S} === false`), v.assign(C, null);
          return;
        case "array":
          v.elseIf((0, r._)`${A} === "string" || ${A} === "number"
              || ${A} === "boolean" || ${S} === null`).assign(C, (0, r._)`[${S}]`);
      }
    }
  }
  function _({ gen: u, parentData: f, parentDataProperty: w }, v) {
    u.if((0, r._)`${f} !== undefined`, () => u.assign((0, r._)`${f}[${w}]`, v));
  }
  function b(u, f, w, v = i.Correct) {
    const S = v === i.Correct ? r.operators.EQ : r.operators.NEQ;
    let P;
    switch (u) {
      case "null":
        return (0, r._)`${f} ${S} null`;
      case "array":
        P = (0, r._)`Array.isArray(${f})`;
        break;
      case "object":
        P = (0, r._)`${f} && typeof ${f} == "object" && !Array.isArray(${f})`;
        break;
      case "integer":
        P = A((0, r._)`!(${f} % 1) && !isNaN(${f})`);
        break;
      case "number":
        P = A();
        break;
      default:
        return (0, r._)`typeof ${f} ${S} ${u}`;
    }
    return v === i.Correct ? P : (0, r.not)(P);
    function A(C = r.nil) {
      return (0, r.and)((0, r._)`typeof ${f} == "number"`, C, w ? (0, r._)`isFinite(${f})` : r.nil);
    }
  }
  _e.checkDataType = b;
  function $(u, f, w, v) {
    if (u.length === 1)
      return b(u[0], f, w, v);
    let S;
    const P = (0, n.toHash)(u);
    if (P.array && P.object) {
      const A = (0, r._)`typeof ${f} != "object"`;
      S = P.null ? A : (0, r._)`!${f} || ${A}`, delete P.null, delete P.array, delete P.object;
    } else
      S = r.nil;
    P.number && delete P.integer;
    for (const A in P)
      S = (0, r.and)(S, b(A, f, w, v));
    return S;
  }
  _e.checkDataTypes = $;
  const m = {
    message: ({ schema: u }) => `must be ${u}`,
    params: ({ schema: u, schemaValue: f }) => typeof u == "string" ? (0, r._)`{type: ${u}}` : (0, r._)`{type: ${f}}`
  };
  function h(u) {
    const f = p(u);
    (0, t.reportError)(f, m);
  }
  _e.reportTypeError = h;
  function p(u) {
    const { gen: f, data: w, schema: v } = u, S = (0, n.schemaRefOrVal)(u, v, "type");
    return {
      gen: f,
      keyword: "type",
      data: w,
      schema: v.type,
      schemaCode: S,
      schemaValue: S,
      parentSchema: v,
      params: {},
      it: u
    };
  }
  return _e;
}
var et = {}, Hr;
function Oi() {
  if (Hr) return et;
  Hr = 1, Object.defineProperty(et, "__esModule", { value: !0 }), et.assignDefaults = void 0;
  const o = ne(), e = ae();
  function t(n, i) {
    const { properties: s, items: a } = n.schema;
    if (i === "object" && s)
      for (const c in s)
        r(n, c, s[c].default);
    else i === "array" && Array.isArray(a) && a.forEach((c, l) => r(n, l, c.default));
  }
  et.assignDefaults = t;
  function r(n, i, s) {
    const { gen: a, compositeRule: c, data: l, opts: d } = n;
    if (s === void 0)
      return;
    const g = (0, o._)`${l}${(0, o.getProperty)(i)}`;
    if (c) {
      (0, e.checkStrictMode)(n, `default is ignored for: ${g}`);
      return;
    }
    let _ = (0, o._)`${g} === undefined`;
    d.useDefaults === "empty" && (_ = (0, o._)`${_} || ${g} === null || ${g} === ""`), a.if(_, (0, o._)`${g} = ${(0, o.stringify)(s)}`);
  }
  return et;
}
var Ne = {}, ue = {}, Yr;
function Re() {
  if (Yr) return ue;
  Yr = 1, Object.defineProperty(ue, "__esModule", { value: !0 }), ue.validateUnion = ue.validateArray = ue.usePattern = ue.callValidateCode = ue.schemaProperties = ue.allSchemaProperties = ue.noPropertyInData = ue.propertyInData = ue.isOwnProperty = ue.hasPropFunc = ue.reportMissingProp = ue.checkMissingProp = ue.checkReportMissingProp = void 0;
  const o = ne(), e = ae(), t = Fe(), r = ae();
  function n(u, f) {
    const { gen: w, data: v, it: S } = u;
    w.if(d(w, v, f, S.opts.ownProperties), () => {
      u.setParams({ missingProperty: (0, o._)`${f}` }, !0), u.error();
    });
  }
  ue.checkReportMissingProp = n;
  function i({ gen: u, data: f, it: { opts: w } }, v, S) {
    return (0, o.or)(...v.map((P) => (0, o.and)(d(u, f, P, w.ownProperties), (0, o._)`${S} = ${P}`)));
  }
  ue.checkMissingProp = i;
  function s(u, f) {
    u.setParams({ missingProperty: f }, !0), u.error();
  }
  ue.reportMissingProp = s;
  function a(u) {
    return u.scopeValue("func", {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ref: Object.prototype.hasOwnProperty,
      code: (0, o._)`Object.prototype.hasOwnProperty`
    });
  }
  ue.hasPropFunc = a;
  function c(u, f, w) {
    return (0, o._)`${a(u)}.call(${f}, ${w})`;
  }
  ue.isOwnProperty = c;
  function l(u, f, w, v) {
    const S = (0, o._)`${f}${(0, o.getProperty)(w)} !== undefined`;
    return v ? (0, o._)`${S} && ${c(u, f, w)}` : S;
  }
  ue.propertyInData = l;
  function d(u, f, w, v) {
    const S = (0, o._)`${f}${(0, o.getProperty)(w)} === undefined`;
    return v ? (0, o.or)(S, (0, o.not)(c(u, f, w))) : S;
  }
  ue.noPropertyInData = d;
  function g(u) {
    return u ? Object.keys(u).filter((f) => f !== "__proto__") : [];
  }
  ue.allSchemaProperties = g;
  function _(u, f) {
    return g(f).filter((w) => !(0, e.alwaysValidSchema)(u, f[w]));
  }
  ue.schemaProperties = _;
  function b({ schemaCode: u, data: f, it: { gen: w, topSchemaRef: v, schemaPath: S, errorPath: P }, it: A }, C, O, D) {
    const V = D ? (0, o._)`${u}, ${f}, ${v}${S}` : f, L = [
      [t.default.instancePath, (0, o.strConcat)(t.default.instancePath, P)],
      [t.default.parentData, A.parentData],
      [t.default.parentDataProperty, A.parentDataProperty],
      [t.default.rootData, t.default.rootData]
    ];
    A.opts.dynamicRef && L.push([t.default.dynamicAnchors, t.default.dynamicAnchors]);
    const F = (0, o._)`${V}, ${w.object(...L)}`;
    return O !== o.nil ? (0, o._)`${C}.call(${O}, ${F})` : (0, o._)`${C}(${F})`;
  }
  ue.callValidateCode = b;
  const $ = (0, o._)`new RegExp`;
  function m({ gen: u, it: { opts: f } }, w) {
    const v = f.unicodeRegExp ? "u" : "", { regExp: S } = f.code, P = S(w, v);
    return u.scopeValue("pattern", {
      key: P.toString(),
      ref: P,
      code: (0, o._)`${S.code === "new RegExp" ? $ : (0, r.useFunc)(u, S)}(${w}, ${v})`
    });
  }
  ue.usePattern = m;
  function h(u) {
    const { gen: f, data: w, keyword: v, it: S } = u, P = f.name("valid");
    if (S.allErrors) {
      const C = f.let("valid", !0);
      return A(() => f.assign(C, !1)), C;
    }
    return f.var(P, !0), A(() => f.break()), P;
    function A(C) {
      const O = f.const("len", (0, o._)`${w}.length`);
      f.forRange("i", 0, O, (D) => {
        u.subschema({
          keyword: v,
          dataProp: D,
          dataPropType: e.Type.Num
        }, P), f.if((0, o.not)(P), C);
      });
    }
  }
  ue.validateArray = h;
  function p(u) {
    const { gen: f, schema: w, keyword: v, it: S } = u;
    if (!Array.isArray(w))
      throw new Error("ajv implementation error");
    if (w.some((O) => (0, e.alwaysValidSchema)(S, O)) && !S.opts.unevaluated)
      return;
    const A = f.let("valid", !1), C = f.name("_valid");
    f.block(() => w.forEach((O, D) => {
      const V = u.subschema({
        keyword: v,
        schemaProp: D,
        compositeRule: !0
      }, C);
      f.assign(A, (0, o._)`${A} || ${C}`), u.mergeValidEvaluated(V, C) || f.if((0, o.not)(A));
    })), u.result(A, () => u.reset(), () => u.error(!0));
  }
  return ue.validateUnion = p, ue;
}
var Wr;
function qi() {
  if (Wr) return Ne;
  Wr = 1, Object.defineProperty(Ne, "__esModule", { value: !0 }), Ne.validateKeywordUsage = Ne.validSchemaType = Ne.funcKeywordCode = Ne.macroKeywordCode = void 0;
  const o = ne(), e = Fe(), t = Re(), r = Xt();
  function n(_, b) {
    const { gen: $, keyword: m, schema: h, parentSchema: p, it: u } = _, f = b.macro.call(u.self, h, p, u), w = l($, m, f);
    u.opts.validateSchema !== !1 && u.self.validateSchema(f, !0);
    const v = $.name("valid");
    _.subschema({
      schema: f,
      schemaPath: o.nil,
      errSchemaPath: `${u.errSchemaPath}/${m}`,
      topSchemaRef: w,
      compositeRule: !0
    }, v), _.pass(v, () => _.error(!0));
  }
  Ne.macroKeywordCode = n;
  function i(_, b) {
    var $;
    const { gen: m, keyword: h, schema: p, parentSchema: u, $data: f, it: w } = _;
    c(w, b);
    const v = !f && b.compile ? b.compile.call(w.self, p, u, w) : b.validate, S = l(m, h, v), P = m.let("valid");
    _.block$data(P, A), _.ok(($ = b.valid) !== null && $ !== void 0 ? $ : P);
    function A() {
      if (b.errors === !1)
        D(), b.modifying && s(_), V(() => _.error());
      else {
        const L = b.async ? C() : O();
        b.modifying && s(_), V(() => a(_, L));
      }
    }
    function C() {
      const L = m.let("ruleErrs", null);
      return m.try(() => D((0, o._)`await `), (F) => m.assign(P, !1).if((0, o._)`${F} instanceof ${w.ValidationError}`, () => m.assign(L, (0, o._)`${F}.errors`), () => m.throw(F))), L;
    }
    function O() {
      const L = (0, o._)`${S}.errors`;
      return m.assign(L, null), D(o.nil), L;
    }
    function D(L = b.async ? (0, o._)`await ` : o.nil) {
      const F = w.opts.passContext ? e.default.this : e.default.self, Y = !("compile" in b && !f || b.schema === !1);
      m.assign(P, (0, o._)`${L}${(0, t.callValidateCode)(_, S, F, Y)}`, b.modifying);
    }
    function V(L) {
      var F;
      m.if((0, o.not)((F = b.valid) !== null && F !== void 0 ? F : P), L);
    }
  }
  Ne.funcKeywordCode = i;
  function s(_) {
    const { gen: b, data: $, it: m } = _;
    b.if(m.parentData, () => b.assign($, (0, o._)`${m.parentData}[${m.parentDataProperty}]`));
  }
  function a(_, b) {
    const { gen: $ } = _;
    $.if((0, o._)`Array.isArray(${b})`, () => {
      $.assign(e.default.vErrors, (0, o._)`${e.default.vErrors} === null ? ${b} : ${e.default.vErrors}.concat(${b})`).assign(e.default.errors, (0, o._)`${e.default.vErrors}.length`), (0, r.extendErrors)(_);
    }, () => _.error());
  }
  function c({ schemaEnv: _ }, b) {
    if (b.async && !_.$async)
      throw new Error("async keyword in sync schema");
  }
  function l(_, b, $) {
    if ($ === void 0)
      throw new Error(`keyword "${b}" failed to compile`);
    return _.scopeValue("keyword", typeof $ == "function" ? { ref: $ } : { ref: $, code: (0, o.stringify)($) });
  }
  function d(_, b, $ = !1) {
    return !b.length || b.some((m) => m === "array" ? Array.isArray(_) : m === "object" ? _ && typeof _ == "object" && !Array.isArray(_) : typeof _ == m || $ && typeof _ > "u");
  }
  Ne.validSchemaType = d;
  function g({ schema: _, opts: b, self: $, errSchemaPath: m }, h, p) {
    if (Array.isArray(h.keyword) ? !h.keyword.includes(p) : h.keyword !== p)
      throw new Error("ajv implementation error");
    const u = h.dependencies;
    if (u?.some((f) => !Object.prototype.hasOwnProperty.call(_, f)))
      throw new Error(`parent schema must have dependencies of ${p}: ${u.join(",")}`);
    if (h.validateSchema && !h.validateSchema(_[p])) {
      const w = `keyword "${p}" value is invalid at path "${m}": ` + $.errorsText(h.validateSchema.errors);
      if (b.validateSchema === "log")
        $.logger.error(w);
      else
        throw new Error(w);
    }
  }
  return Ne.validateKeywordUsage = g, Ne;
}
var ze = {}, Qr;
function Di() {
  if (Qr) return ze;
  Qr = 1, Object.defineProperty(ze, "__esModule", { value: !0 }), ze.extendSubschemaMode = ze.extendSubschemaData = ze.getSubschema = void 0;
  const o = ne(), e = ae();
  function t(i, { keyword: s, schemaProp: a, schema: c, schemaPath: l, errSchemaPath: d, topSchemaRef: g }) {
    if (s !== void 0 && c !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (s !== void 0) {
      const _ = i.schema[s];
      return a === void 0 ? {
        schema: _,
        schemaPath: (0, o._)`${i.schemaPath}${(0, o.getProperty)(s)}`,
        errSchemaPath: `${i.errSchemaPath}/${s}`
      } : {
        schema: _[a],
        schemaPath: (0, o._)`${i.schemaPath}${(0, o.getProperty)(s)}${(0, o.getProperty)(a)}`,
        errSchemaPath: `${i.errSchemaPath}/${s}/${(0, e.escapeFragment)(a)}`
      };
    }
    if (c !== void 0) {
      if (l === void 0 || d === void 0 || g === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: c,
        schemaPath: l,
        topSchemaRef: g,
        errSchemaPath: d
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  ze.getSubschema = t;
  function r(i, s, { dataProp: a, dataPropType: c, data: l, dataTypes: d, propertyName: g }) {
    if (l !== void 0 && a !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: _ } = s;
    if (a !== void 0) {
      const { errorPath: $, dataPathArr: m, opts: h } = s, p = _.let("data", (0, o._)`${s.data}${(0, o.getProperty)(a)}`, !0);
      b(p), i.errorPath = (0, o.str)`${$}${(0, e.getErrorPath)(a, c, h.jsPropertySyntax)}`, i.parentDataProperty = (0, o._)`${a}`, i.dataPathArr = [...m, i.parentDataProperty];
    }
    if (l !== void 0) {
      const $ = l instanceof o.Name ? l : _.let("data", l, !0);
      b($), g !== void 0 && (i.propertyName = g);
    }
    d && (i.dataTypes = d);
    function b($) {
      i.data = $, i.dataLevel = s.dataLevel + 1, i.dataTypes = [], s.definedProperties = /* @__PURE__ */ new Set(), i.parentData = s.data, i.dataNames = [...s.dataNames, $];
    }
  }
  ze.extendSubschemaData = r;
  function n(i, { jtdDiscriminator: s, jtdMetadata: a, compositeRule: c, createErrors: l, allErrors: d }) {
    c !== void 0 && (i.compositeRule = c), l !== void 0 && (i.createErrors = l), d !== void 0 && (i.allErrors = d), i.jtdDiscriminator = s, i.jtdMetadata = a;
  }
  return ze.extendSubschemaMode = n, ze;
}
var Ee = {}, lr, Xr;
function ni() {
  return Xr || (Xr = 1, lr = function o(e, t) {
    if (e === t) return !0;
    if (e && t && typeof e == "object" && typeof t == "object") {
      if (e.constructor !== t.constructor) return !1;
      var r, n, i;
      if (Array.isArray(e)) {
        if (r = e.length, r != t.length) return !1;
        for (n = r; n-- !== 0; )
          if (!o(e[n], t[n])) return !1;
        return !0;
      }
      if (e.constructor === RegExp) return e.source === t.source && e.flags === t.flags;
      if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === t.valueOf();
      if (e.toString !== Object.prototype.toString) return e.toString() === t.toString();
      if (i = Object.keys(e), r = i.length, r !== Object.keys(t).length) return !1;
      for (n = r; n-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(t, i[n])) return !1;
      for (n = r; n-- !== 0; ) {
        var s = i[n];
        if (!o(e[s], t[s])) return !1;
      }
      return !0;
    }
    return e !== e && t !== t;
  }), lr;
}
var ur = { exports: {} }, Zr;
function Li() {
  if (Zr) return ur.exports;
  Zr = 1;
  var o = ur.exports = function(r, n, i) {
    typeof n == "function" && (i = n, n = {}), i = n.cb || i;
    var s = typeof i == "function" ? i : i.pre || function() {
    }, a = i.post || function() {
    };
    e(n, s, a, r, "", r);
  };
  o.keywords = {
    additionalItems: !0,
    items: !0,
    contains: !0,
    additionalProperties: !0,
    propertyNames: !0,
    not: !0,
    if: !0,
    then: !0,
    else: !0
  }, o.arrayKeywords = {
    items: !0,
    allOf: !0,
    anyOf: !0,
    oneOf: !0
  }, o.propsKeywords = {
    $defs: !0,
    definitions: !0,
    properties: !0,
    patternProperties: !0,
    dependencies: !0
  }, o.skipKeywords = {
    default: !0,
    enum: !0,
    const: !0,
    required: !0,
    maximum: !0,
    minimum: !0,
    exclusiveMaximum: !0,
    exclusiveMinimum: !0,
    multipleOf: !0,
    maxLength: !0,
    minLength: !0,
    pattern: !0,
    format: !0,
    maxItems: !0,
    minItems: !0,
    uniqueItems: !0,
    maxProperties: !0,
    minProperties: !0
  };
  function e(r, n, i, s, a, c, l, d, g, _) {
    if (s && typeof s == "object" && !Array.isArray(s)) {
      n(s, a, c, l, d, g, _);
      for (var b in s) {
        var $ = s[b];
        if (Array.isArray($)) {
          if (b in o.arrayKeywords)
            for (var m = 0; m < $.length; m++)
              e(r, n, i, $[m], a + "/" + b + "/" + m, c, a, b, s, m);
        } else if (b in o.propsKeywords) {
          if ($ && typeof $ == "object")
            for (var h in $)
              e(r, n, i, $[h], a + "/" + b + "/" + t(h), c, a, b, s, h);
        } else (b in o.keywords || r.allKeys && !(b in o.skipKeywords)) && e(r, n, i, $, a + "/" + b, c, a, b, s);
      }
      i(s, a, c, l, d, g, _);
    }
  }
  function t(r) {
    return r.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return ur.exports;
}
var en;
function Zt() {
  if (en) return Ee;
  en = 1, Object.defineProperty(Ee, "__esModule", { value: !0 }), Ee.getSchemaRefs = Ee.resolveUrl = Ee.normalizeId = Ee._getFullPath = Ee.getFullPath = Ee.inlineRef = void 0;
  const o = ae(), e = ni(), t = Li(), r = /* @__PURE__ */ new Set([
    "type",
    "format",
    "pattern",
    "maxLength",
    "minLength",
    "maxProperties",
    "minProperties",
    "maxItems",
    "minItems",
    "maximum",
    "minimum",
    "uniqueItems",
    "multipleOf",
    "required",
    "enum",
    "const"
  ]);
  function n(m, h = !0) {
    return typeof m == "boolean" ? !0 : h === !0 ? !s(m) : h ? a(m) <= h : !1;
  }
  Ee.inlineRef = n;
  const i = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function s(m) {
    for (const h in m) {
      if (i.has(h))
        return !0;
      const p = m[h];
      if (Array.isArray(p) && p.some(s) || typeof p == "object" && s(p))
        return !0;
    }
    return !1;
  }
  function a(m) {
    let h = 0;
    for (const p in m) {
      if (p === "$ref")
        return 1 / 0;
      if (h++, !r.has(p) && (typeof m[p] == "object" && (0, o.eachItem)(m[p], (u) => h += a(u)), h === 1 / 0))
        return 1 / 0;
    }
    return h;
  }
  function c(m, h = "", p) {
    p !== !1 && (h = g(h));
    const u = m.parse(h);
    return l(m, u);
  }
  Ee.getFullPath = c;
  function l(m, h) {
    return m.serialize(h).split("#")[0] + "#";
  }
  Ee._getFullPath = l;
  const d = /#\/?$/;
  function g(m) {
    return m ? m.replace(d, "") : "";
  }
  Ee.normalizeId = g;
  function _(m, h, p) {
    return p = g(p), m.resolve(h, p);
  }
  Ee.resolveUrl = _;
  const b = /^[a-z_][-a-z0-9._]*$/i;
  function $(m, h) {
    if (typeof m == "boolean")
      return {};
    const { schemaId: p, uriResolver: u } = this.opts, f = g(m[p] || h), w = { "": f }, v = c(u, f, !1), S = {}, P = /* @__PURE__ */ new Set();
    return t(m, { allKeys: !0 }, (O, D, V, L) => {
      if (L === void 0)
        return;
      const F = v + D;
      let Y = w[L];
      typeof O[p] == "string" && (Y = de.call(this, O[p])), oe.call(this, O.$anchor), oe.call(this, O.$dynamicAnchor), w[D] = Y;
      function de(re) {
        const se = this.opts.uriResolver.resolve;
        if (re = g(Y ? se(Y, re) : re), P.has(re))
          throw C(re);
        P.add(re);
        let q = this.refs[re];
        return typeof q == "string" && (q = this.refs[q]), typeof q == "object" ? A(O, q.schema, re) : re !== g(F) && (re[0] === "#" ? (A(O, S[re], re), S[re] = O) : this.refs[re] = F), re;
      }
      function oe(re) {
        if (typeof re == "string") {
          if (!b.test(re))
            throw new Error(`invalid anchor "${re}"`);
          de.call(this, `#${re}`);
        }
      }
    }), S;
    function A(O, D, V) {
      if (D !== void 0 && !e(O, D))
        throw C(V);
    }
    function C(O) {
      return new Error(`reference "${O}" resolves to more than one schema`);
    }
  }
  return Ee.getSchemaRefs = $, Ee;
}
var tn;
function er() {
  if (tn) return De;
  tn = 1, Object.defineProperty(De, "__esModule", { value: !0 }), De.getData = De.KeywordCxt = De.validateFunctionCode = void 0;
  const o = Ii(), e = Wt(), t = ri(), r = Wt(), n = Oi(), i = qi(), s = Di(), a = ne(), c = Fe(), l = Zt(), d = ae(), g = Xt();
  function _(T) {
    if (v(T) && (P(T), w(T))) {
      h(T);
      return;
    }
    b(T, () => (0, o.topBoolOrEmptySchema)(T));
  }
  De.validateFunctionCode = _;
  function b({ gen: T, validateName: x, schema: j, schemaEnv: z, opts: U }, Z) {
    U.code.es5 ? T.func(x, (0, a._)`${c.default.data}, ${c.default.valCxt}`, z.$async, () => {
      T.code((0, a._)`"use strict"; ${u(j, U)}`), m(T, U), T.code(Z);
    }) : T.func(x, (0, a._)`${c.default.data}, ${$(U)}`, z.$async, () => T.code(u(j, U)).code(Z));
  }
  function $(T) {
    return (0, a._)`{${c.default.instancePath}="", ${c.default.parentData}, ${c.default.parentDataProperty}, ${c.default.rootData}=${c.default.data}${T.dynamicRef ? (0, a._)`, ${c.default.dynamicAnchors}={}` : a.nil}}={}`;
  }
  function m(T, x) {
    T.if(c.default.valCxt, () => {
      T.var(c.default.instancePath, (0, a._)`${c.default.valCxt}.${c.default.instancePath}`), T.var(c.default.parentData, (0, a._)`${c.default.valCxt}.${c.default.parentData}`), T.var(c.default.parentDataProperty, (0, a._)`${c.default.valCxt}.${c.default.parentDataProperty}`), T.var(c.default.rootData, (0, a._)`${c.default.valCxt}.${c.default.rootData}`), x.dynamicRef && T.var(c.default.dynamicAnchors, (0, a._)`${c.default.valCxt}.${c.default.dynamicAnchors}`);
    }, () => {
      T.var(c.default.instancePath, (0, a._)`""`), T.var(c.default.parentData, (0, a._)`undefined`), T.var(c.default.parentDataProperty, (0, a._)`undefined`), T.var(c.default.rootData, c.default.data), x.dynamicRef && T.var(c.default.dynamicAnchors, (0, a._)`{}`);
    });
  }
  function h(T) {
    const { schema: x, opts: j, gen: z } = T;
    b(T, () => {
      j.$comment && x.$comment && L(T), O(T), z.let(c.default.vErrors, null), z.let(c.default.errors, 0), j.unevaluated && p(T), A(T), F(T);
    });
  }
  function p(T) {
    const { gen: x, validateName: j } = T;
    T.evaluated = x.const("evaluated", (0, a._)`${j}.evaluated`), x.if((0, a._)`${T.evaluated}.dynamicProps`, () => x.assign((0, a._)`${T.evaluated}.props`, (0, a._)`undefined`)), x.if((0, a._)`${T.evaluated}.dynamicItems`, () => x.assign((0, a._)`${T.evaluated}.items`, (0, a._)`undefined`));
  }
  function u(T, x) {
    const j = typeof T == "object" && T[x.schemaId];
    return j && (x.code.source || x.code.process) ? (0, a._)`/*# sourceURL=${j} */` : a.nil;
  }
  function f(T, x) {
    if (v(T) && (P(T), w(T))) {
      S(T, x);
      return;
    }
    (0, o.boolOrEmptySchema)(T, x);
  }
  function w({ schema: T, self: x }) {
    if (typeof T == "boolean")
      return !T;
    for (const j in T)
      if (x.RULES.all[j])
        return !0;
    return !1;
  }
  function v(T) {
    return typeof T.schema != "boolean";
  }
  function S(T, x) {
    const { schema: j, gen: z, opts: U } = T;
    U.$comment && j.$comment && L(T), D(T), V(T);
    const Z = z.const("_errs", c.default.errors);
    A(T, Z), z.var(x, (0, a._)`${Z} === ${c.default.errors}`);
  }
  function P(T) {
    (0, d.checkUnknownRules)(T), C(T);
  }
  function A(T, x) {
    if (T.opts.jtd)
      return de(T, [], !1, x);
    const j = (0, e.getSchemaTypes)(T.schema), z = (0, e.coerceAndCheckDataType)(T, j);
    de(T, j, !z, x);
  }
  function C(T) {
    const { schema: x, errSchemaPath: j, opts: z, self: U } = T;
    x.$ref && z.ignoreKeywordsWithRef && (0, d.schemaHasRulesButRef)(x, U.RULES) && U.logger.warn(`$ref: keywords ignored in schema at path "${j}"`);
  }
  function O(T) {
    const { schema: x, opts: j } = T;
    x.default !== void 0 && j.useDefaults && j.strictSchema && (0, d.checkStrictMode)(T, "default is ignored in the schema root");
  }
  function D(T) {
    const x = T.schema[T.opts.schemaId];
    x && (T.baseId = (0, l.resolveUrl)(T.opts.uriResolver, T.baseId, x));
  }
  function V(T) {
    if (T.schema.$async && !T.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function L({ gen: T, schemaEnv: x, schema: j, errSchemaPath: z, opts: U }) {
    const Z = j.$comment;
    if (U.$comment === !0)
      T.code((0, a._)`${c.default.self}.logger.log(${Z})`);
    else if (typeof U.$comment == "function") {
      const he = (0, a.str)`${z}/$comment`, Te = T.scopeValue("root", { ref: x.root });
      T.code((0, a._)`${c.default.self}.opts.$comment(${Z}, ${he}, ${Te}.schema)`);
    }
  }
  function F(T) {
    const { gen: x, schemaEnv: j, validateName: z, ValidationError: U, opts: Z } = T;
    j.$async ? x.if((0, a._)`${c.default.errors} === 0`, () => x.return(c.default.data), () => x.throw((0, a._)`new ${U}(${c.default.vErrors})`)) : (x.assign((0, a._)`${z}.errors`, c.default.vErrors), Z.unevaluated && Y(T), x.return((0, a._)`${c.default.errors} === 0`));
  }
  function Y({ gen: T, evaluated: x, props: j, items: z }) {
    j instanceof a.Name && T.assign((0, a._)`${x}.props`, j), z instanceof a.Name && T.assign((0, a._)`${x}.items`, z);
  }
  function de(T, x, j, z) {
    const { gen: U, schema: Z, data: he, allErrors: Te, opts: me, self: ve } = T, { RULES: ge } = ve;
    if (Z.$ref && (me.ignoreKeywordsWithRef || !(0, d.schemaHasRulesButRef)(Z, ge))) {
      U.block(() => G(T, "$ref", ge.all.$ref.definition));
      return;
    }
    me.jtd || re(T, x), U.block(() => {
      for (const Pe of ge.rules)
        Oe(Pe);
      Oe(ge.post);
    });
    function Oe(Pe) {
      (0, t.shouldUseGroup)(Z, Pe) && (Pe.type ? (U.if((0, r.checkDataType)(Pe.type, he, me.strictNumbers)), oe(T, Pe), x.length === 1 && x[0] === Pe.type && j && (U.else(), (0, r.reportTypeError)(T)), U.endIf()) : oe(T, Pe), Te || U.if((0, a._)`${c.default.errors} === ${z || 0}`));
    }
  }
  function oe(T, x) {
    const { gen: j, schema: z, opts: { useDefaults: U } } = T;
    U && (0, n.assignDefaults)(T, x.type), j.block(() => {
      for (const Z of x.rules)
        (0, t.shouldUseRule)(z, Z) && G(T, Z.keyword, Z.definition, x.type);
    });
  }
  function re(T, x) {
    T.schemaEnv.meta || !T.opts.strictTypes || (se(T, x), T.opts.allowUnionTypes || q(T, x), M(T, T.dataTypes));
  }
  function se(T, x) {
    if (x.length) {
      if (!T.dataTypes.length) {
        T.dataTypes = x;
        return;
      }
      x.forEach((j) => {
        N(T.dataTypes, j) || E(T, `type "${j}" not allowed by context "${T.dataTypes.join(",")}"`);
      }), y(T, x);
    }
  }
  function q(T, x) {
    x.length > 1 && !(x.length === 2 && x.includes("null")) && E(T, "use allowUnionTypes to allow union type keyword");
  }
  function M(T, x) {
    const j = T.self.RULES.all;
    for (const z in j) {
      const U = j[z];
      if (typeof U == "object" && (0, t.shouldUseRule)(T.schema, U)) {
        const { type: Z } = U.definition;
        Z.length && !Z.some((he) => I(x, he)) && E(T, `missing type "${Z.join(",")}" for keyword "${z}"`);
      }
    }
  }
  function I(T, x) {
    return T.includes(x) || x === "number" && T.includes("integer");
  }
  function N(T, x) {
    return T.includes(x) || x === "integer" && T.includes("number");
  }
  function y(T, x) {
    const j = [];
    for (const z of T.dataTypes)
      N(x, z) ? j.push(z) : x.includes("integer") && z === "number" && j.push("integer");
    T.dataTypes = j;
  }
  function E(T, x) {
    const j = T.schemaEnv.baseId + T.errSchemaPath;
    x += ` at "${j}" (strictTypes)`, (0, d.checkStrictMode)(T, x, T.opts.strictTypes);
  }
  class R {
    constructor(x, j, z) {
      if ((0, i.validateKeywordUsage)(x, j, z), this.gen = x.gen, this.allErrors = x.allErrors, this.keyword = z, this.data = x.data, this.schema = x.schema[z], this.$data = j.$data && x.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, d.schemaRefOrVal)(x, this.schema, z, this.$data), this.schemaType = j.schemaType, this.parentSchema = x.schema, this.params = {}, this.it = x, this.def = j, this.$data)
        this.schemaCode = x.gen.const("vSchema", X(this.$data, x));
      else if (this.schemaCode = this.schemaValue, !(0, i.validSchemaType)(this.schema, j.schemaType, j.allowUndefined))
        throw new Error(`${z} value must be ${JSON.stringify(j.schemaType)}`);
      ("code" in j ? j.trackErrors : j.errors !== !1) && (this.errsCount = x.gen.const("_errs", c.default.errors));
    }
    result(x, j, z) {
      this.failResult((0, a.not)(x), j, z);
    }
    failResult(x, j, z) {
      this.gen.if(x), z ? z() : this.error(), j ? (this.gen.else(), j(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(x, j) {
      this.failResult((0, a.not)(x), void 0, j);
    }
    fail(x) {
      if (x === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(x), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(x) {
      if (!this.$data)
        return this.fail(x);
      const { schemaCode: j } = this;
      this.fail((0, a._)`${j} !== undefined && (${(0, a.or)(this.invalid$data(), x)})`);
    }
    error(x, j, z) {
      if (j) {
        this.setParams(j), this._error(x, z), this.setParams({});
        return;
      }
      this._error(x, z);
    }
    _error(x, j) {
      (x ? g.reportExtraError : g.reportError)(this, this.def.error, j);
    }
    $dataError() {
      (0, g.reportError)(this, this.def.$dataError || g.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, g.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(x) {
      this.allErrors || this.gen.if(x);
    }
    setParams(x, j) {
      j ? Object.assign(this.params, x) : this.params = x;
    }
    block$data(x, j, z = a.nil) {
      this.gen.block(() => {
        this.check$data(x, z), j();
      });
    }
    check$data(x = a.nil, j = a.nil) {
      if (!this.$data)
        return;
      const { gen: z, schemaCode: U, schemaType: Z, def: he } = this;
      z.if((0, a.or)((0, a._)`${U} === undefined`, j)), x !== a.nil && z.assign(x, !0), (Z.length || he.validateSchema) && (z.elseIf(this.invalid$data()), this.$dataError(), x !== a.nil && z.assign(x, !1)), z.else();
    }
    invalid$data() {
      const { gen: x, schemaCode: j, schemaType: z, def: U, it: Z } = this;
      return (0, a.or)(he(), Te());
      function he() {
        if (z.length) {
          if (!(j instanceof a.Name))
            throw new Error("ajv implementation error");
          const me = Array.isArray(z) ? z : [z];
          return (0, a._)`${(0, r.checkDataTypes)(me, j, Z.opts.strictNumbers, r.DataType.Wrong)}`;
        }
        return a.nil;
      }
      function Te() {
        if (U.validateSchema) {
          const me = x.scopeValue("validate$data", { ref: U.validateSchema });
          return (0, a._)`!${me}(${j})`;
        }
        return a.nil;
      }
    }
    subschema(x, j) {
      const z = (0, s.getSubschema)(this.it, x);
      (0, s.extendSubschemaData)(z, this.it, x), (0, s.extendSubschemaMode)(z, x);
      const U = { ...this.it, ...z, items: void 0, props: void 0 };
      return f(U, j), U;
    }
    mergeEvaluated(x, j) {
      const { it: z, gen: U } = this;
      z.opts.unevaluated && (z.props !== !0 && x.props !== void 0 && (z.props = d.mergeEvaluated.props(U, x.props, z.props, j)), z.items !== !0 && x.items !== void 0 && (z.items = d.mergeEvaluated.items(U, x.items, z.items, j)));
    }
    mergeValidEvaluated(x, j) {
      const { it: z, gen: U } = this;
      if (z.opts.unevaluated && (z.props !== !0 || z.items !== !0))
        return U.if(j, () => this.mergeEvaluated(x, a.Name)), !0;
    }
  }
  De.KeywordCxt = R;
  function G(T, x, j, z) {
    const U = new R(T, j, x);
    "code" in j ? j.code(U, z) : U.$data && j.validate ? (0, i.funcKeywordCode)(U, j) : "macro" in j ? (0, i.macroKeywordCode)(U, j) : (j.compile || j.validate) && (0, i.funcKeywordCode)(U, j);
  }
  const k = /^\/(?:[^~]|~0|~1)*$/, Q = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function X(T, { dataLevel: x, dataNames: j, dataPathArr: z }) {
    let U, Z;
    if (T === "")
      return c.default.rootData;
    if (T[0] === "/") {
      if (!k.test(T))
        throw new Error(`Invalid JSON-pointer: ${T}`);
      U = T, Z = c.default.rootData;
    } else {
      const ve = Q.exec(T);
      if (!ve)
        throw new Error(`Invalid JSON-pointer: ${T}`);
      const ge = +ve[1];
      if (U = ve[2], U === "#") {
        if (ge >= x)
          throw new Error(me("property/index", ge));
        return z[x - ge];
      }
      if (ge > x)
        throw new Error(me("data", ge));
      if (Z = j[x - ge], !U)
        return Z;
    }
    let he = Z;
    const Te = U.split("/");
    for (const ve of Te)
      ve && (Z = (0, a._)`${Z}${(0, a.getProperty)((0, d.unescapeJsonPointer)(ve))}`, he = (0, a._)`${he} && ${Z}`);
    return he;
    function me(ve, ge) {
      return `Cannot access ${ve} ${ge} levels up, current level is ${x}`;
    }
  }
  return De.getData = X, De;
}
var dt = {}, rn;
function $r() {
  if (rn) return dt;
  rn = 1, Object.defineProperty(dt, "__esModule", { value: !0 });
  class o extends Error {
    constructor(t) {
      super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
    }
  }
  return dt.default = o, dt;
}
var ht = {}, nn;
function tr() {
  if (nn) return ht;
  nn = 1, Object.defineProperty(ht, "__esModule", { value: !0 });
  const o = Zt();
  class e extends Error {
    constructor(r, n, i, s) {
      super(s || `can't resolve reference ${i} from id ${n}`), this.missingRef = (0, o.resolveUrl)(r, n, i), this.missingSchema = (0, o.normalizeId)((0, o.getFullPath)(r, this.missingRef));
    }
  }
  return ht.default = e, ht;
}
var Me = {}, on;
function Sr() {
  if (on) return Me;
  on = 1, Object.defineProperty(Me, "__esModule", { value: !0 }), Me.resolveSchema = Me.getCompilingSchema = Me.resolveRef = Me.compileSchema = Me.SchemaEnv = void 0;
  const o = ne(), e = $r(), t = Fe(), r = Zt(), n = ae(), i = er();
  class s {
    constructor(p) {
      var u;
      this.refs = {}, this.dynamicAnchors = {};
      let f;
      typeof p.schema == "object" && (f = p.schema), this.schema = p.schema, this.schemaId = p.schemaId, this.root = p.root || this, this.baseId = (u = p.baseId) !== null && u !== void 0 ? u : (0, r.normalizeId)(f?.[p.schemaId || "$id"]), this.schemaPath = p.schemaPath, this.localRefs = p.localRefs, this.meta = p.meta, this.$async = f?.$async, this.refs = {};
    }
  }
  Me.SchemaEnv = s;
  function a(h) {
    const p = d.call(this, h);
    if (p)
      return p;
    const u = (0, r.getFullPath)(this.opts.uriResolver, h.root.baseId), { es5: f, lines: w } = this.opts.code, { ownProperties: v } = this.opts, S = new o.CodeGen(this.scope, { es5: f, lines: w, ownProperties: v });
    let P;
    h.$async && (P = S.scopeValue("Error", {
      ref: e.default,
      code: (0, o._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const A = S.scopeName("validate");
    h.validateName = A;
    const C = {
      gen: S,
      allErrors: this.opts.allErrors,
      data: t.default.data,
      parentData: t.default.parentData,
      parentDataProperty: t.default.parentDataProperty,
      dataNames: [t.default.data],
      dataPathArr: [o.nil],
      // TODO can its length be used as dataLevel if nil is removed?
      dataLevel: 0,
      dataTypes: [],
      definedProperties: /* @__PURE__ */ new Set(),
      topSchemaRef: S.scopeValue("schema", this.opts.code.source === !0 ? { ref: h.schema, code: (0, o.stringify)(h.schema) } : { ref: h.schema }),
      validateName: A,
      ValidationError: P,
      schema: h.schema,
      schemaEnv: h,
      rootId: u,
      baseId: h.baseId || u,
      schemaPath: o.nil,
      errSchemaPath: h.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, o._)`""`,
      opts: this.opts,
      self: this
    };
    let O;
    try {
      this._compilations.add(h), (0, i.validateFunctionCode)(C), S.optimize(this.opts.code.optimize);
      const D = S.toString();
      O = `${S.scopeRefs(t.default.scope)}return ${D}`, this.opts.code.process && (O = this.opts.code.process(O, h));
      const L = new Function(`${t.default.self}`, `${t.default.scope}`, O)(this, this.scope.get());
      if (this.scope.value(A, { ref: L }), L.errors = null, L.schema = h.schema, L.schemaEnv = h, h.$async && (L.$async = !0), this.opts.code.source === !0 && (L.source = { validateName: A, validateCode: D, scopeValues: S._values }), this.opts.unevaluated) {
        const { props: F, items: Y } = C;
        L.evaluated = {
          props: F instanceof o.Name ? void 0 : F,
          items: Y instanceof o.Name ? void 0 : Y,
          dynamicProps: F instanceof o.Name,
          dynamicItems: Y instanceof o.Name
        }, L.source && (L.source.evaluated = (0, o.stringify)(L.evaluated));
      }
      return h.validate = L, h;
    } catch (D) {
      throw delete h.validate, delete h.validateName, O && this.logger.error("Error compiling schema, function code:", O), D;
    } finally {
      this._compilations.delete(h);
    }
  }
  Me.compileSchema = a;
  function c(h, p, u) {
    var f;
    u = (0, r.resolveUrl)(this.opts.uriResolver, p, u);
    const w = h.refs[u];
    if (w)
      return w;
    let v = _.call(this, h, u);
    if (v === void 0) {
      const S = (f = h.localRefs) === null || f === void 0 ? void 0 : f[u], { schemaId: P } = this.opts;
      S && (v = new s({ schema: S, schemaId: P, root: h, baseId: p }));
    }
    if (v !== void 0)
      return h.refs[u] = l.call(this, v);
  }
  Me.resolveRef = c;
  function l(h) {
    return (0, r.inlineRef)(h.schema, this.opts.inlineRefs) ? h.schema : h.validate ? h : a.call(this, h);
  }
  function d(h) {
    for (const p of this._compilations)
      if (g(p, h))
        return p;
  }
  Me.getCompilingSchema = d;
  function g(h, p) {
    return h.schema === p.schema && h.root === p.root && h.baseId === p.baseId;
  }
  function _(h, p) {
    let u;
    for (; typeof (u = this.refs[p]) == "string"; )
      p = u;
    return u || this.schemas[p] || b.call(this, h, p);
  }
  function b(h, p) {
    const u = this.opts.uriResolver.parse(p), f = (0, r._getFullPath)(this.opts.uriResolver, u);
    let w = (0, r.getFullPath)(this.opts.uriResolver, h.baseId, void 0);
    if (Object.keys(h.schema).length > 0 && f === w)
      return m.call(this, u, h);
    const v = (0, r.normalizeId)(f), S = this.refs[v] || this.schemas[v];
    if (typeof S == "string") {
      const P = b.call(this, h, S);
      return typeof P?.schema != "object" ? void 0 : m.call(this, u, P);
    }
    if (typeof S?.schema == "object") {
      if (S.validate || a.call(this, S), v === (0, r.normalizeId)(p)) {
        const { schema: P } = S, { schemaId: A } = this.opts, C = P[A];
        return C && (w = (0, r.resolveUrl)(this.opts.uriResolver, w, C)), new s({ schema: P, schemaId: A, root: h, baseId: w });
      }
      return m.call(this, u, S);
    }
  }
  Me.resolveSchema = b;
  const $ = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function m(h, { baseId: p, schema: u, root: f }) {
    var w;
    if (((w = h.fragment) === null || w === void 0 ? void 0 : w[0]) !== "/")
      return;
    for (const P of h.fragment.slice(1).split("/")) {
      if (typeof u == "boolean")
        return;
      const A = u[(0, n.unescapeFragment)(P)];
      if (A === void 0)
        return;
      u = A;
      const C = typeof u == "object" && u[this.opts.schemaId];
      !$.has(P) && C && (p = (0, r.resolveUrl)(this.opts.uriResolver, p, C));
    }
    let v;
    if (typeof u != "boolean" && u.$ref && !(0, n.schemaHasRulesButRef)(u, this.RULES)) {
      const P = (0, r.resolveUrl)(this.opts.uriResolver, p, u.$ref);
      v = b.call(this, f, P);
    }
    const { schemaId: S } = this.opts;
    if (v = v || new s({ schema: u, schemaId: S, root: f, baseId: p }), v.schema !== v.root.schema)
      return v;
  }
  return Me;
}
const zi = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Vi = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Fi = "object", Gi = ["$data"], Bi = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, Ui = !1, Ki = {
  $id: zi,
  description: Vi,
  type: Fi,
  required: Gi,
  properties: Bi,
  additionalProperties: Ui
};
var ft = {}, tt = { exports: {} }, dr, sn;
function Ji() {
  return sn || (sn = 1, dr = {
    HEX: {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      a: 10,
      A: 10,
      b: 11,
      B: 11,
      c: 12,
      C: 12,
      d: 13,
      D: 13,
      e: 14,
      E: 14,
      f: 15,
      F: 15
    }
  }), dr;
}
var hr, an;
function Hi() {
  if (an) return hr;
  an = 1;
  const { HEX: o } = Ji(), e = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u;
  function t(m) {
    if (a(m, ".") < 3)
      return { host: m, isIPV4: !1 };
    const h = m.match(e) || [], [p] = h;
    return p ? { host: s(p, "."), isIPV4: !0 } : { host: m, isIPV4: !1 };
  }
  function r(m, h = !1) {
    let p = "", u = !0;
    for (const f of m) {
      if (o[f] === void 0) return;
      f !== "0" && u === !0 && (u = !1), u || (p += f);
    }
    return h && p.length === 0 && (p = "0"), p;
  }
  function n(m) {
    let h = 0;
    const p = { error: !1, address: "", zone: "" }, u = [], f = [];
    let w = !1, v = !1, S = !1;
    function P() {
      if (f.length) {
        if (w === !1) {
          const A = r(f);
          if (A !== void 0)
            u.push(A);
          else
            return p.error = !0, !1;
        }
        f.length = 0;
      }
      return !0;
    }
    for (let A = 0; A < m.length; A++) {
      const C = m[A];
      if (!(C === "[" || C === "]"))
        if (C === ":") {
          if (v === !0 && (S = !0), !P())
            break;
          if (h++, u.push(":"), h > 7) {
            p.error = !0;
            break;
          }
          A - 1 >= 0 && m[A - 1] === ":" && (v = !0);
          continue;
        } else if (C === "%") {
          if (!P())
            break;
          w = !0;
        } else {
          f.push(C);
          continue;
        }
    }
    return f.length && (w ? p.zone = f.join("") : S ? u.push(f.join("")) : u.push(r(f))), p.address = u.join(""), p;
  }
  function i(m) {
    if (a(m, ":") < 2)
      return { host: m, isIPV6: !1 };
    const h = n(m);
    if (h.error)
      return { host: m, isIPV6: !1 };
    {
      let p = h.address, u = h.address;
      return h.zone && (p += "%" + h.zone, u += "%25" + h.zone), { host: p, escapedHost: u, isIPV6: !0 };
    }
  }
  function s(m, h) {
    let p = "", u = !0;
    const f = m.length;
    for (let w = 0; w < f; w++) {
      const v = m[w];
      v === "0" && u ? (w + 1 <= f && m[w + 1] === h || w + 1 === f) && (p += v, u = !1) : (v === h ? u = !0 : u = !1, p += v);
    }
    return p;
  }
  function a(m, h) {
    let p = 0;
    for (let u = 0; u < m.length; u++)
      m[u] === h && p++;
    return p;
  }
  const c = /^\.\.?\//u, l = /^\/\.(?:\/|$)/u, d = /^\/\.\.(?:\/|$)/u, g = /^\/?(?:.|\n)*?(?=\/|$)/u;
  function _(m) {
    const h = [];
    for (; m.length; )
      if (m.match(c))
        m = m.replace(c, "");
      else if (m.match(l))
        m = m.replace(l, "/");
      else if (m.match(d))
        m = m.replace(d, "/"), h.pop();
      else if (m === "." || m === "..")
        m = "";
      else {
        const p = m.match(g);
        if (p) {
          const u = p[0];
          m = m.slice(u.length), h.push(u);
        } else
          throw new Error("Unexpected dot segment condition");
      }
    return h.join("");
  }
  function b(m, h) {
    const p = h !== !0 ? escape : unescape;
    return m.scheme !== void 0 && (m.scheme = p(m.scheme)), m.userinfo !== void 0 && (m.userinfo = p(m.userinfo)), m.host !== void 0 && (m.host = p(m.host)), m.path !== void 0 && (m.path = p(m.path)), m.query !== void 0 && (m.query = p(m.query)), m.fragment !== void 0 && (m.fragment = p(m.fragment)), m;
  }
  function $(m) {
    const h = [];
    if (m.userinfo !== void 0 && (h.push(m.userinfo), h.push("@")), m.host !== void 0) {
      let p = unescape(m.host);
      const u = t(p);
      if (u.isIPV4)
        p = u.host;
      else {
        const f = i(u.host);
        f.isIPV6 === !0 ? p = `[${f.escapedHost}]` : p = m.host;
      }
      h.push(p);
    }
    return (typeof m.port == "number" || typeof m.port == "string") && (h.push(":"), h.push(String(m.port))), h.length ? h.join("") : void 0;
  }
  return hr = {
    recomposeAuthority: $,
    normalizeComponentEncoding: b,
    removeDotSegments: _,
    normalizeIPv4: t,
    normalizeIPv6: i,
    stringArrayToHexStripped: r
  }, hr;
}
var fr, cn;
function Yi() {
  if (cn) return fr;
  cn = 1;
  const o = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu, e = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
  function t(u) {
    return typeof u.secure == "boolean" ? u.secure : String(u.scheme).toLowerCase() === "wss";
  }
  function r(u) {
    return u.host || (u.error = u.error || "HTTP URIs must have a host."), u;
  }
  function n(u) {
    const f = String(u.scheme).toLowerCase() === "https";
    return (u.port === (f ? 443 : 80) || u.port === "") && (u.port = void 0), u.path || (u.path = "/"), u;
  }
  function i(u) {
    return u.secure = t(u), u.resourceName = (u.path || "/") + (u.query ? "?" + u.query : ""), u.path = void 0, u.query = void 0, u;
  }
  function s(u) {
    if ((u.port === (t(u) ? 443 : 80) || u.port === "") && (u.port = void 0), typeof u.secure == "boolean" && (u.scheme = u.secure ? "wss" : "ws", u.secure = void 0), u.resourceName) {
      const [f, w] = u.resourceName.split("?");
      u.path = f && f !== "/" ? f : void 0, u.query = w, u.resourceName = void 0;
    }
    return u.fragment = void 0, u;
  }
  function a(u, f) {
    if (!u.path)
      return u.error = "URN can not be parsed", u;
    const w = u.path.match(e);
    if (w) {
      const v = f.scheme || u.scheme || "urn";
      u.nid = w[1].toLowerCase(), u.nss = w[2];
      const S = `${v}:${f.nid || u.nid}`, P = p[S];
      u.path = void 0, P && (u = P.parse(u, f));
    } else
      u.error = u.error || "URN can not be parsed.";
    return u;
  }
  function c(u, f) {
    const w = f.scheme || u.scheme || "urn", v = u.nid.toLowerCase(), S = `${w}:${f.nid || v}`, P = p[S];
    P && (u = P.serialize(u, f));
    const A = u, C = u.nss;
    return A.path = `${v || f.nid}:${C}`, f.skipEscape = !0, A;
  }
  function l(u, f) {
    const w = u;
    return w.uuid = w.nss, w.nss = void 0, !f.tolerant && (!w.uuid || !o.test(w.uuid)) && (w.error = w.error || "UUID is not valid."), w;
  }
  function d(u) {
    const f = u;
    return f.nss = (u.uuid || "").toLowerCase(), f;
  }
  const g = {
    scheme: "http",
    domainHost: !0,
    parse: r,
    serialize: n
  }, _ = {
    scheme: "https",
    domainHost: g.domainHost,
    parse: r,
    serialize: n
  }, b = {
    scheme: "ws",
    domainHost: !0,
    parse: i,
    serialize: s
  }, $ = {
    scheme: "wss",
    domainHost: b.domainHost,
    parse: b.parse,
    serialize: b.serialize
  }, p = {
    http: g,
    https: _,
    ws: b,
    wss: $,
    urn: {
      scheme: "urn",
      parse: a,
      serialize: c,
      skipNormalize: !0
    },
    "urn:uuid": {
      scheme: "urn:uuid",
      parse: l,
      serialize: d,
      skipNormalize: !0
    }
  };
  return fr = p, fr;
}
var ln;
function Wi() {
  if (ln) return tt.exports;
  ln = 1;
  const { normalizeIPv6: o, normalizeIPv4: e, removeDotSegments: t, recomposeAuthority: r, normalizeComponentEncoding: n } = Hi(), i = Yi();
  function s(h, p) {
    return typeof h == "string" ? h = d($(h, p), p) : typeof h == "object" && (h = $(d(h, p), p)), h;
  }
  function a(h, p, u) {
    const f = Object.assign({ scheme: "null" }, u), w = c($(h, f), $(p, f), f, !0);
    return d(w, { ...f, skipEscape: !0 });
  }
  function c(h, p, u, f) {
    const w = {};
    return f || (h = $(d(h, u), u), p = $(d(p, u), u)), u = u || {}, !u.tolerant && p.scheme ? (w.scheme = p.scheme, w.userinfo = p.userinfo, w.host = p.host, w.port = p.port, w.path = t(p.path || ""), w.query = p.query) : (p.userinfo !== void 0 || p.host !== void 0 || p.port !== void 0 ? (w.userinfo = p.userinfo, w.host = p.host, w.port = p.port, w.path = t(p.path || ""), w.query = p.query) : (p.path ? (p.path.charAt(0) === "/" ? w.path = t(p.path) : ((h.userinfo !== void 0 || h.host !== void 0 || h.port !== void 0) && !h.path ? w.path = "/" + p.path : h.path ? w.path = h.path.slice(0, h.path.lastIndexOf("/") + 1) + p.path : w.path = p.path, w.path = t(w.path)), w.query = p.query) : (w.path = h.path, p.query !== void 0 ? w.query = p.query : w.query = h.query), w.userinfo = h.userinfo, w.host = h.host, w.port = h.port), w.scheme = h.scheme), w.fragment = p.fragment, w;
  }
  function l(h, p, u) {
    return typeof h == "string" ? (h = unescape(h), h = d(n($(h, u), !0), { ...u, skipEscape: !0 })) : typeof h == "object" && (h = d(n(h, !0), { ...u, skipEscape: !0 })), typeof p == "string" ? (p = unescape(p), p = d(n($(p, u), !0), { ...u, skipEscape: !0 })) : typeof p == "object" && (p = d(n(p, !0), { ...u, skipEscape: !0 })), h.toLowerCase() === p.toLowerCase();
  }
  function d(h, p) {
    const u = {
      host: h.host,
      scheme: h.scheme,
      userinfo: h.userinfo,
      port: h.port,
      path: h.path,
      query: h.query,
      nid: h.nid,
      nss: h.nss,
      uuid: h.uuid,
      fragment: h.fragment,
      reference: h.reference,
      resourceName: h.resourceName,
      secure: h.secure,
      error: ""
    }, f = Object.assign({}, p), w = [], v = i[(f.scheme || u.scheme || "").toLowerCase()];
    v && v.serialize && v.serialize(u, f), u.path !== void 0 && (f.skipEscape ? u.path = unescape(u.path) : (u.path = escape(u.path), u.scheme !== void 0 && (u.path = u.path.split("%3A").join(":")))), f.reference !== "suffix" && u.scheme && w.push(u.scheme, ":");
    const S = r(u);
    if (S !== void 0 && (f.reference !== "suffix" && w.push("//"), w.push(S), u.path && u.path.charAt(0) !== "/" && w.push("/")), u.path !== void 0) {
      let P = u.path;
      !f.absolutePath && (!v || !v.absolutePath) && (P = t(P)), S === void 0 && (P = P.replace(/^\/\//u, "/%2F")), w.push(P);
    }
    return u.query !== void 0 && w.push("?", u.query), u.fragment !== void 0 && w.push("#", u.fragment), w.join("");
  }
  const g = Array.from({ length: 127 }, (h, p) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(p)));
  function _(h) {
    let p = 0;
    for (let u = 0, f = h.length; u < f; ++u)
      if (p = h.charCodeAt(u), p > 126 || g[p])
        return !0;
    return !1;
  }
  const b = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
  function $(h, p) {
    const u = Object.assign({}, p), f = {
      scheme: void 0,
      userinfo: void 0,
      host: "",
      port: void 0,
      path: "",
      query: void 0,
      fragment: void 0
    }, w = h.indexOf("%") !== -1;
    let v = !1;
    u.reference === "suffix" && (h = (u.scheme ? u.scheme + ":" : "") + "//" + h);
    const S = h.match(b);
    if (S) {
      if (f.scheme = S[1], f.userinfo = S[3], f.host = S[4], f.port = parseInt(S[5], 10), f.path = S[6] || "", f.query = S[7], f.fragment = S[8], isNaN(f.port) && (f.port = S[5]), f.host) {
        const A = e(f.host);
        if (A.isIPV4 === !1) {
          const C = o(A.host);
          f.host = C.host.toLowerCase(), v = C.isIPV6;
        } else
          f.host = A.host, v = !0;
      }
      f.scheme === void 0 && f.userinfo === void 0 && f.host === void 0 && f.port === void 0 && f.query === void 0 && !f.path ? f.reference = "same-document" : f.scheme === void 0 ? f.reference = "relative" : f.fragment === void 0 ? f.reference = "absolute" : f.reference = "uri", u.reference && u.reference !== "suffix" && u.reference !== f.reference && (f.error = f.error || "URI is not a " + u.reference + " reference.");
      const P = i[(u.scheme || f.scheme || "").toLowerCase()];
      if (!u.unicodeSupport && (!P || !P.unicodeSupport) && f.host && (u.domainHost || P && P.domainHost) && v === !1 && _(f.host))
        try {
          f.host = URL.domainToASCII(f.host.toLowerCase());
        } catch (A) {
          f.error = f.error || "Host's domain name can not be converted to ASCII: " + A;
        }
      (!P || P && !P.skipNormalize) && (w && f.scheme !== void 0 && (f.scheme = unescape(f.scheme)), w && f.host !== void 0 && (f.host = unescape(f.host)), f.path && (f.path = escape(unescape(f.path))), f.fragment && (f.fragment = encodeURI(decodeURIComponent(f.fragment)))), P && P.parse && P.parse(f, u);
    } else
      f.error = f.error || "URI can not be parsed.";
    return f;
  }
  const m = {
    SCHEMES: i,
    normalize: s,
    resolve: a,
    resolveComponents: c,
    equal: l,
    serialize: d,
    parse: $
  };
  return tt.exports = m, tt.exports.default = m, tt.exports.fastUri = m, tt.exports;
}
var un;
function Qi() {
  if (un) return ft;
  un = 1, Object.defineProperty(ft, "__esModule", { value: !0 });
  const o = Wi();
  return o.code = 'require("ajv/dist/runtime/uri").default', ft.default = o, ft;
}
var dn;
function Xi() {
  return dn || (dn = 1, (function(o) {
    Object.defineProperty(o, "__esModule", { value: !0 }), o.CodeGen = o.Name = o.nil = o.stringify = o.str = o._ = o.KeywordCxt = void 0;
    var e = er();
    Object.defineProperty(o, "KeywordCxt", { enumerable: !0, get: function() {
      return e.KeywordCxt;
    } });
    var t = ne();
    Object.defineProperty(o, "_", { enumerable: !0, get: function() {
      return t._;
    } }), Object.defineProperty(o, "str", { enumerable: !0, get: function() {
      return t.str;
    } }), Object.defineProperty(o, "stringify", { enumerable: !0, get: function() {
      return t.stringify;
    } }), Object.defineProperty(o, "nil", { enumerable: !0, get: function() {
      return t.nil;
    } }), Object.defineProperty(o, "Name", { enumerable: !0, get: function() {
      return t.Name;
    } }), Object.defineProperty(o, "CodeGen", { enumerable: !0, get: function() {
      return t.CodeGen;
    } });
    const r = $r(), n = tr(), i = ti(), s = Sr(), a = ne(), c = Zt(), l = Wt(), d = ae(), g = Ki, _ = Qi(), b = (q, M) => new RegExp(q, M);
    b.code = "new RegExp";
    const $ = ["removeAdditional", "useDefaults", "coerceTypes"], m = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]), h = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    }, p = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    }, u = 200;
    function f(q) {
      var M, I, N, y, E, R, G, k, Q, X, T, x, j, z, U, Z, he, Te, me, ve, ge, Oe, Pe, Ke, Je;
      const B = q.strict, K = (M = q.code) === null || M === void 0 ? void 0 : M.optimize, J = K === !0 || K === void 0 ? 1 : K || 0, W = (N = (I = q.code) === null || I === void 0 ? void 0 : I.regExp) !== null && N !== void 0 ? N : b, ie = (y = q.uriResolver) !== null && y !== void 0 ? y : _.default;
      return {
        strictSchema: (R = (E = q.strictSchema) !== null && E !== void 0 ? E : B) !== null && R !== void 0 ? R : !0,
        strictNumbers: (k = (G = q.strictNumbers) !== null && G !== void 0 ? G : B) !== null && k !== void 0 ? k : !0,
        strictTypes: (X = (Q = q.strictTypes) !== null && Q !== void 0 ? Q : B) !== null && X !== void 0 ? X : "log",
        strictTuples: (x = (T = q.strictTuples) !== null && T !== void 0 ? T : B) !== null && x !== void 0 ? x : "log",
        strictRequired: (z = (j = q.strictRequired) !== null && j !== void 0 ? j : B) !== null && z !== void 0 ? z : !1,
        code: q.code ? { ...q.code, optimize: J, regExp: W } : { optimize: J, regExp: W },
        loopRequired: (U = q.loopRequired) !== null && U !== void 0 ? U : u,
        loopEnum: (Z = q.loopEnum) !== null && Z !== void 0 ? Z : u,
        meta: (he = q.meta) !== null && he !== void 0 ? he : !0,
        messages: (Te = q.messages) !== null && Te !== void 0 ? Te : !0,
        inlineRefs: (me = q.inlineRefs) !== null && me !== void 0 ? me : !0,
        schemaId: (ve = q.schemaId) !== null && ve !== void 0 ? ve : "$id",
        addUsedSchema: (ge = q.addUsedSchema) !== null && ge !== void 0 ? ge : !0,
        validateSchema: (Oe = q.validateSchema) !== null && Oe !== void 0 ? Oe : !0,
        validateFormats: (Pe = q.validateFormats) !== null && Pe !== void 0 ? Pe : !0,
        unicodeRegExp: (Ke = q.unicodeRegExp) !== null && Ke !== void 0 ? Ke : !0,
        int32range: (Je = q.int32range) !== null && Je !== void 0 ? Je : !0,
        uriResolver: ie
      };
    }
    class w {
      constructor(M = {}) {
        this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), M = this.opts = { ...M, ...f(M) };
        const { es5: I, lines: N } = this.opts.code;
        this.scope = new a.ValueScope({ scope: {}, prefixes: m, es5: I, lines: N }), this.logger = V(M.logger);
        const y = M.validateFormats;
        M.validateFormats = !1, this.RULES = (0, i.getRules)(), v.call(this, h, M, "NOT SUPPORTED"), v.call(this, p, M, "DEPRECATED", "warn"), this._metaOpts = O.call(this), M.formats && A.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), M.keywords && C.call(this, M.keywords), typeof M.meta == "object" && this.addMetaSchema(M.meta), P.call(this), M.validateFormats = y;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: M, meta: I, schemaId: N } = this.opts;
        let y = g;
        N === "id" && (y = { ...g }, y.id = y.$id, delete y.$id), I && M && this.addMetaSchema(y, y[N], !1);
      }
      defaultMeta() {
        const { meta: M, schemaId: I } = this.opts;
        return this.opts.defaultMeta = typeof M == "object" ? M[I] || M : void 0;
      }
      validate(M, I) {
        let N;
        if (typeof M == "string") {
          if (N = this.getSchema(M), !N)
            throw new Error(`no schema with key or ref "${M}"`);
        } else
          N = this.compile(M);
        const y = N(I);
        return "$async" in N || (this.errors = N.errors), y;
      }
      compile(M, I) {
        const N = this._addSchema(M, I);
        return N.validate || this._compileSchemaEnv(N);
      }
      compileAsync(M, I) {
        if (typeof this.opts.loadSchema != "function")
          throw new Error("options.loadSchema should be a function");
        const { loadSchema: N } = this.opts;
        return y.call(this, M, I);
        async function y(X, T) {
          await E.call(this, X.$schema);
          const x = this._addSchema(X, T);
          return x.validate || R.call(this, x);
        }
        async function E(X) {
          X && !this.getSchema(X) && await y.call(this, { $ref: X }, !0);
        }
        async function R(X) {
          try {
            return this._compileSchemaEnv(X);
          } catch (T) {
            if (!(T instanceof n.default))
              throw T;
            return G.call(this, T), await k.call(this, T.missingSchema), R.call(this, X);
          }
        }
        function G({ missingSchema: X, missingRef: T }) {
          if (this.refs[X])
            throw new Error(`AnySchema ${X} is loaded but ${T} cannot be resolved`);
        }
        async function k(X) {
          const T = await Q.call(this, X);
          this.refs[X] || await E.call(this, T.$schema), this.refs[X] || this.addSchema(T, X, I);
        }
        async function Q(X) {
          const T = this._loading[X];
          if (T)
            return T;
          try {
            return await (this._loading[X] = N(X));
          } finally {
            delete this._loading[X];
          }
        }
      }
      // Adds schema to the instance
      addSchema(M, I, N, y = this.opts.validateSchema) {
        if (Array.isArray(M)) {
          for (const R of M)
            this.addSchema(R, void 0, N, y);
          return this;
        }
        let E;
        if (typeof M == "object") {
          const { schemaId: R } = this.opts;
          if (E = M[R], E !== void 0 && typeof E != "string")
            throw new Error(`schema ${R} must be string`);
        }
        return I = (0, c.normalizeId)(I || E), this._checkUnique(I), this.schemas[I] = this._addSchema(M, N, I, y, !0), this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(M, I, N = this.opts.validateSchema) {
        return this.addSchema(M, I, !0, N), this;
      }
      //  Validate schema against its meta-schema
      validateSchema(M, I) {
        if (typeof M == "boolean")
          return !0;
        let N;
        if (N = M.$schema, N !== void 0 && typeof N != "string")
          throw new Error("$schema must be a string");
        if (N = N || this.opts.defaultMeta || this.defaultMeta(), !N)
          return this.logger.warn("meta-schema not available"), this.errors = null, !0;
        const y = this.validate(N, M);
        if (!y && I) {
          const E = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(E);
          else
            throw new Error(E);
        }
        return y;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(M) {
        let I;
        for (; typeof (I = S.call(this, M)) == "string"; )
          M = I;
        if (I === void 0) {
          const { schemaId: N } = this.opts, y = new s.SchemaEnv({ schema: {}, schemaId: N });
          if (I = s.resolveSchema.call(this, y, M), !I)
            return;
          this.refs[M] = I;
        }
        return I.validate || this._compileSchemaEnv(I);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(M) {
        if (M instanceof RegExp)
          return this._removeAllSchemas(this.schemas, M), this._removeAllSchemas(this.refs, M), this;
        switch (typeof M) {
          case "undefined":
            return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
          case "string": {
            const I = S.call(this, M);
            return typeof I == "object" && this._cache.delete(I.schema), delete this.schemas[M], delete this.refs[M], this;
          }
          case "object": {
            const I = M;
            this._cache.delete(I);
            let N = M[this.opts.schemaId];
            return N && (N = (0, c.normalizeId)(N), delete this.schemas[N], delete this.refs[N]), this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(M) {
        for (const I of M)
          this.addKeyword(I);
        return this;
      }
      addKeyword(M, I) {
        let N;
        if (typeof M == "string")
          N = M, typeof I == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), I.keyword = N);
        else if (typeof M == "object" && I === void 0) {
          if (I = M, N = I.keyword, Array.isArray(N) && !N.length)
            throw new Error("addKeywords: keyword must be string or non-empty array");
        } else
          throw new Error("invalid addKeywords parameters");
        if (F.call(this, N, I), !I)
          return (0, d.eachItem)(N, (E) => Y.call(this, E)), this;
        oe.call(this, I);
        const y = {
          ...I,
          type: (0, l.getJSONTypes)(I.type),
          schemaType: (0, l.getJSONTypes)(I.schemaType)
        };
        return (0, d.eachItem)(N, y.type.length === 0 ? (E) => Y.call(this, E, y) : (E) => y.type.forEach((R) => Y.call(this, E, y, R))), this;
      }
      getKeyword(M) {
        const I = this.RULES.all[M];
        return typeof I == "object" ? I.definition : !!I;
      }
      // Remove keyword
      removeKeyword(M) {
        const { RULES: I } = this;
        delete I.keywords[M], delete I.all[M];
        for (const N of I.rules) {
          const y = N.rules.findIndex((E) => E.keyword === M);
          y >= 0 && N.rules.splice(y, 1);
        }
        return this;
      }
      // Add format
      addFormat(M, I) {
        return typeof I == "string" && (I = new RegExp(I)), this.formats[M] = I, this;
      }
      errorsText(M = this.errors, { separator: I = ", ", dataVar: N = "data" } = {}) {
        return !M || M.length === 0 ? "No errors" : M.map((y) => `${N}${y.instancePath} ${y.message}`).reduce((y, E) => y + I + E);
      }
      $dataMetaSchema(M, I) {
        const N = this.RULES.all;
        M = JSON.parse(JSON.stringify(M));
        for (const y of I) {
          const E = y.split("/").slice(1);
          let R = M;
          for (const G of E)
            R = R[G];
          for (const G in N) {
            const k = N[G];
            if (typeof k != "object")
              continue;
            const { $data: Q } = k.definition, X = R[G];
            Q && X && (R[G] = se(X));
          }
        }
        return M;
      }
      _removeAllSchemas(M, I) {
        for (const N in M) {
          const y = M[N];
          (!I || I.test(N)) && (typeof y == "string" ? delete M[N] : y && !y.meta && (this._cache.delete(y.schema), delete M[N]));
        }
      }
      _addSchema(M, I, N, y = this.opts.validateSchema, E = this.opts.addUsedSchema) {
        let R;
        const { schemaId: G } = this.opts;
        if (typeof M == "object")
          R = M[G];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof M != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let k = this._cache.get(M);
        if (k !== void 0)
          return k;
        N = (0, c.normalizeId)(R || N);
        const Q = c.getSchemaRefs.call(this, M, N);
        return k = new s.SchemaEnv({ schema: M, schemaId: G, meta: I, baseId: N, localRefs: Q }), this._cache.set(k.schema, k), E && !N.startsWith("#") && (N && this._checkUnique(N), this.refs[N] = k), y && this.validateSchema(M, !0), k;
      }
      _checkUnique(M) {
        if (this.schemas[M] || this.refs[M])
          throw new Error(`schema with key or id "${M}" already exists`);
      }
      _compileSchemaEnv(M) {
        if (M.meta ? this._compileMetaSchema(M) : s.compileSchema.call(this, M), !M.validate)
          throw new Error("ajv implementation error");
        return M.validate;
      }
      _compileMetaSchema(M) {
        const I = this.opts;
        this.opts = this._metaOpts;
        try {
          s.compileSchema.call(this, M);
        } finally {
          this.opts = I;
        }
      }
    }
    w.ValidationError = r.default, w.MissingRefError = n.default, o.default = w;
    function v(q, M, I, N = "error") {
      for (const y in q) {
        const E = y;
        E in M && this.logger[N](`${I}: option ${y}. ${q[E]}`);
      }
    }
    function S(q) {
      return q = (0, c.normalizeId)(q), this.schemas[q] || this.refs[q];
    }
    function P() {
      const q = this.opts.schemas;
      if (q)
        if (Array.isArray(q))
          this.addSchema(q);
        else
          for (const M in q)
            this.addSchema(q[M], M);
    }
    function A() {
      for (const q in this.opts.formats) {
        const M = this.opts.formats[q];
        M && this.addFormat(q, M);
      }
    }
    function C(q) {
      if (Array.isArray(q)) {
        this.addVocabulary(q);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const M in q) {
        const I = q[M];
        I.keyword || (I.keyword = M), this.addKeyword(I);
      }
    }
    function O() {
      const q = { ...this.opts };
      for (const M of $)
        delete q[M];
      return q;
    }
    const D = { log() {
    }, warn() {
    }, error() {
    } };
    function V(q) {
      if (q === !1)
        return D;
      if (q === void 0)
        return console;
      if (q.log && q.warn && q.error)
        return q;
      throw new Error("logger must implement log, warn and error methods");
    }
    const L = /^[a-z_$][a-z0-9_$:-]*$/i;
    function F(q, M) {
      const { RULES: I } = this;
      if ((0, d.eachItem)(q, (N) => {
        if (I.keywords[N])
          throw new Error(`Keyword ${N} is already defined`);
        if (!L.test(N))
          throw new Error(`Keyword ${N} has invalid name`);
      }), !!M && M.$data && !("code" in M || "validate" in M))
        throw new Error('$data keyword must have "code" or "validate" function');
    }
    function Y(q, M, I) {
      var N;
      const y = M?.post;
      if (I && y)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES: E } = this;
      let R = y ? E.post : E.rules.find(({ type: k }) => k === I);
      if (R || (R = { type: I, rules: [] }, E.rules.push(R)), E.keywords[q] = !0, !M)
        return;
      const G = {
        keyword: q,
        definition: {
          ...M,
          type: (0, l.getJSONTypes)(M.type),
          schemaType: (0, l.getJSONTypes)(M.schemaType)
        }
      };
      M.before ? de.call(this, R, G, M.before) : R.rules.push(G), E.all[q] = G, (N = M.implements) === null || N === void 0 || N.forEach((k) => this.addKeyword(k));
    }
    function de(q, M, I) {
      const N = q.rules.findIndex((y) => y.keyword === I);
      N >= 0 ? q.rules.splice(N, 0, M) : (q.rules.push(M), this.logger.warn(`rule ${I} is not defined`));
    }
    function oe(q) {
      let { metaSchema: M } = q;
      M !== void 0 && (q.$data && this.opts.$data && (M = se(M)), q.validateSchema = this.compile(M, !0));
    }
    const re = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function se(q) {
      return { anyOf: [q, re] };
    }
  })(ir)), ir;
}
var pt = {}, mt = {}, gt = {}, hn;
function Zi() {
  if (hn) return gt;
  hn = 1, Object.defineProperty(gt, "__esModule", { value: !0 });
  const o = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return gt.default = o, gt;
}
var Ve = {}, fn;
function eo() {
  if (fn) return Ve;
  fn = 1, Object.defineProperty(Ve, "__esModule", { value: !0 }), Ve.callRef = Ve.getValidate = void 0;
  const o = tr(), e = Re(), t = ne(), r = Fe(), n = Sr(), i = ae(), s = {
    keyword: "$ref",
    schemaType: "string",
    code(l) {
      const { gen: d, schema: g, it: _ } = l, { baseId: b, schemaEnv: $, validateName: m, opts: h, self: p } = _, { root: u } = $;
      if ((g === "#" || g === "#/") && b === u.baseId)
        return w();
      const f = n.resolveRef.call(p, u, b, g);
      if (f === void 0)
        throw new o.default(_.opts.uriResolver, b, g);
      if (f instanceof n.SchemaEnv)
        return v(f);
      return S(f);
      function w() {
        if ($ === u)
          return c(l, m, $, $.$async);
        const P = d.scopeValue("root", { ref: u });
        return c(l, (0, t._)`${P}.validate`, u, u.$async);
      }
      function v(P) {
        const A = a(l, P);
        c(l, A, P, P.$async);
      }
      function S(P) {
        const A = d.scopeValue("schema", h.code.source === !0 ? { ref: P, code: (0, t.stringify)(P) } : { ref: P }), C = d.name("valid"), O = l.subschema({
          schema: P,
          dataTypes: [],
          schemaPath: t.nil,
          topSchemaRef: A,
          errSchemaPath: g
        }, C);
        l.mergeEvaluated(O), l.ok(C);
      }
    }
  };
  function a(l, d) {
    const { gen: g } = l;
    return d.validate ? g.scopeValue("validate", { ref: d.validate }) : (0, t._)`${g.scopeValue("wrapper", { ref: d })}.validate`;
  }
  Ve.getValidate = a;
  function c(l, d, g, _) {
    const { gen: b, it: $ } = l, { allErrors: m, schemaEnv: h, opts: p } = $, u = p.passContext ? r.default.this : t.nil;
    _ ? f() : w();
    function f() {
      if (!h.$async)
        throw new Error("async schema referenced by sync schema");
      const P = b.let("valid");
      b.try(() => {
        b.code((0, t._)`await ${(0, e.callValidateCode)(l, d, u)}`), S(d), m || b.assign(P, !0);
      }, (A) => {
        b.if((0, t._)`!(${A} instanceof ${$.ValidationError})`, () => b.throw(A)), v(A), m || b.assign(P, !1);
      }), l.ok(P);
    }
    function w() {
      l.result((0, e.callValidateCode)(l, d, u), () => S(d), () => v(d));
    }
    function v(P) {
      const A = (0, t._)`${P}.errors`;
      b.assign(r.default.vErrors, (0, t._)`${r.default.vErrors} === null ? ${A} : ${r.default.vErrors}.concat(${A})`), b.assign(r.default.errors, (0, t._)`${r.default.vErrors}.length`);
    }
    function S(P) {
      var A;
      if (!$.opts.unevaluated)
        return;
      const C = (A = g?.validate) === null || A === void 0 ? void 0 : A.evaluated;
      if ($.props !== !0)
        if (C && !C.dynamicProps)
          C.props !== void 0 && ($.props = i.mergeEvaluated.props(b, C.props, $.props));
        else {
          const O = b.var("props", (0, t._)`${P}.evaluated.props`);
          $.props = i.mergeEvaluated.props(b, O, $.props, t.Name);
        }
      if ($.items !== !0)
        if (C && !C.dynamicItems)
          C.items !== void 0 && ($.items = i.mergeEvaluated.items(b, C.items, $.items));
        else {
          const O = b.var("items", (0, t._)`${P}.evaluated.items`);
          $.items = i.mergeEvaluated.items(b, O, $.items, t.Name);
        }
    }
  }
  return Ve.callRef = c, Ve.default = s, Ve;
}
var pn;
function to() {
  if (pn) return mt;
  pn = 1, Object.defineProperty(mt, "__esModule", { value: !0 });
  const o = Zi(), e = eo(), t = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    o.default,
    e.default
  ];
  return mt.default = t, mt;
}
var yt = {}, vt = {}, mn;
function ro() {
  if (mn) return vt;
  mn = 1, Object.defineProperty(vt, "__esModule", { value: !0 });
  const o = ne(), e = o.operators, t = {
    maximum: { okStr: "<=", ok: e.LTE, fail: e.GT },
    minimum: { okStr: ">=", ok: e.GTE, fail: e.LT },
    exclusiveMaximum: { okStr: "<", ok: e.LT, fail: e.GTE },
    exclusiveMinimum: { okStr: ">", ok: e.GT, fail: e.LTE }
  }, r = {
    message: ({ keyword: i, schemaCode: s }) => (0, o.str)`must be ${t[i].okStr} ${s}`,
    params: ({ keyword: i, schemaCode: s }) => (0, o._)`{comparison: ${t[i].okStr}, limit: ${s}}`
  }, n = {
    keyword: Object.keys(t),
    type: "number",
    schemaType: "number",
    $data: !0,
    error: r,
    code(i) {
      const { keyword: s, data: a, schemaCode: c } = i;
      i.fail$data((0, o._)`${a} ${t[s].fail} ${c} || isNaN(${a})`);
    }
  };
  return vt.default = n, vt;
}
var bt = {}, gn;
function no() {
  if (gn) return bt;
  gn = 1, Object.defineProperty(bt, "__esModule", { value: !0 });
  const o = ne(), t = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: !0,
    error: {
      message: ({ schemaCode: r }) => (0, o.str)`must be multiple of ${r}`,
      params: ({ schemaCode: r }) => (0, o._)`{multipleOf: ${r}}`
    },
    code(r) {
      const { gen: n, data: i, schemaCode: s, it: a } = r, c = a.opts.multipleOfPrecision, l = n.let("res"), d = c ? (0, o._)`Math.abs(Math.round(${l}) - ${l}) > 1e-${c}` : (0, o._)`${l} !== parseInt(${l})`;
      r.fail$data((0, o._)`(${s} === 0 || (${l} = ${i}/${s}, ${d}))`);
    }
  };
  return bt.default = t, bt;
}
var wt = {}, _t = {}, yn;
function io() {
  if (yn) return _t;
  yn = 1, Object.defineProperty(_t, "__esModule", { value: !0 });
  function o(e) {
    const t = e.length;
    let r = 0, n = 0, i;
    for (; n < t; )
      r++, i = e.charCodeAt(n++), i >= 55296 && i <= 56319 && n < t && (i = e.charCodeAt(n), (i & 64512) === 56320 && n++);
    return r;
  }
  return _t.default = o, o.code = 'require("ajv/dist/runtime/ucs2length").default', _t;
}
var vn;
function oo() {
  if (vn) return wt;
  vn = 1, Object.defineProperty(wt, "__esModule", { value: !0 });
  const o = ne(), e = ae(), t = io(), n = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: i, schemaCode: s }) {
        const a = i === "maxLength" ? "more" : "fewer";
        return (0, o.str)`must NOT have ${a} than ${s} characters`;
      },
      params: ({ schemaCode: i }) => (0, o._)`{limit: ${i}}`
    },
    code(i) {
      const { keyword: s, data: a, schemaCode: c, it: l } = i, d = s === "maxLength" ? o.operators.GT : o.operators.LT, g = l.opts.unicode === !1 ? (0, o._)`${a}.length` : (0, o._)`${(0, e.useFunc)(i.gen, t.default)}(${a})`;
      i.fail$data((0, o._)`${g} ${d} ${c}`);
    }
  };
  return wt.default = n, wt;
}
var $t = {}, bn;
function so() {
  if (bn) return $t;
  bn = 1, Object.defineProperty($t, "__esModule", { value: !0 });
  const o = Re(), e = ne(), r = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: n }) => (0, e.str)`must match pattern "${n}"`,
      params: ({ schemaCode: n }) => (0, e._)`{pattern: ${n}}`
    },
    code(n) {
      const { data: i, $data: s, schema: a, schemaCode: c, it: l } = n, d = l.opts.unicodeRegExp ? "u" : "", g = s ? (0, e._)`(new RegExp(${c}, ${d}))` : (0, o.usePattern)(n, a);
      n.fail$data((0, e._)`!${g}.test(${i})`);
    }
  };
  return $t.default = r, $t;
}
var St = {}, wn;
function ao() {
  if (wn) return St;
  wn = 1, Object.defineProperty(St, "__esModule", { value: !0 });
  const o = ne(), t = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: r, schemaCode: n }) {
        const i = r === "maxProperties" ? "more" : "fewer";
        return (0, o.str)`must NOT have ${i} than ${n} properties`;
      },
      params: ({ schemaCode: r }) => (0, o._)`{limit: ${r}}`
    },
    code(r) {
      const { keyword: n, data: i, schemaCode: s } = r, a = n === "maxProperties" ? o.operators.GT : o.operators.LT;
      r.fail$data((0, o._)`Object.keys(${i}).length ${a} ${s}`);
    }
  };
  return St.default = t, St;
}
var Pt = {}, _n;
function co() {
  if (_n) return Pt;
  _n = 1, Object.defineProperty(Pt, "__esModule", { value: !0 });
  const o = Re(), e = ne(), t = ae(), n = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: i } }) => (0, e.str)`must have required property '${i}'`,
      params: ({ params: { missingProperty: i } }) => (0, e._)`{missingProperty: ${i}}`
    },
    code(i) {
      const { gen: s, schema: a, schemaCode: c, data: l, $data: d, it: g } = i, { opts: _ } = g;
      if (!d && a.length === 0)
        return;
      const b = a.length >= _.loopRequired;
      if (g.allErrors ? $() : m(), _.strictRequired) {
        const u = i.parentSchema.properties, { definedProperties: f } = i.it;
        for (const w of a)
          if (u?.[w] === void 0 && !f.has(w)) {
            const v = g.schemaEnv.baseId + g.errSchemaPath, S = `required property "${w}" is not defined at "${v}" (strictRequired)`;
            (0, t.checkStrictMode)(g, S, g.opts.strictRequired);
          }
      }
      function $() {
        if (b || d)
          i.block$data(e.nil, h);
        else
          for (const u of a)
            (0, o.checkReportMissingProp)(i, u);
      }
      function m() {
        const u = s.let("missing");
        if (b || d) {
          const f = s.let("valid", !0);
          i.block$data(f, () => p(u, f)), i.ok(f);
        } else
          s.if((0, o.checkMissingProp)(i, a, u)), (0, o.reportMissingProp)(i, u), s.else();
      }
      function h() {
        s.forOf("prop", c, (u) => {
          i.setParams({ missingProperty: u }), s.if((0, o.noPropertyInData)(s, l, u, _.ownProperties), () => i.error());
        });
      }
      function p(u, f) {
        i.setParams({ missingProperty: u }), s.forOf(u, c, () => {
          s.assign(f, (0, o.propertyInData)(s, l, u, _.ownProperties)), s.if((0, e.not)(f), () => {
            i.error(), s.break();
          });
        }, e.nil);
      }
    }
  };
  return Pt.default = n, Pt;
}
var Et = {}, $n;
function lo() {
  if ($n) return Et;
  $n = 1, Object.defineProperty(Et, "__esModule", { value: !0 });
  const o = ne(), t = {
    keyword: ["maxItems", "minItems"],
    type: "array",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: r, schemaCode: n }) {
        const i = r === "maxItems" ? "more" : "fewer";
        return (0, o.str)`must NOT have ${i} than ${n} items`;
      },
      params: ({ schemaCode: r }) => (0, o._)`{limit: ${r}}`
    },
    code(r) {
      const { keyword: n, data: i, schemaCode: s } = r, a = n === "maxItems" ? o.operators.GT : o.operators.LT;
      r.fail$data((0, o._)`${i}.length ${a} ${s}`);
    }
  };
  return Et.default = t, Et;
}
var Tt = {}, Mt = {}, Sn;
function Pr() {
  if (Sn) return Mt;
  Sn = 1, Object.defineProperty(Mt, "__esModule", { value: !0 });
  const o = ni();
  return o.code = 'require("ajv/dist/runtime/equal").default', Mt.default = o, Mt;
}
var Pn;
function uo() {
  if (Pn) return Tt;
  Pn = 1, Object.defineProperty(Tt, "__esModule", { value: !0 });
  const o = Wt(), e = ne(), t = ae(), r = Pr(), i = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i: s, j: a } }) => (0, e.str)`must NOT have duplicate items (items ## ${a} and ${s} are identical)`,
      params: ({ params: { i: s, j: a } }) => (0, e._)`{i: ${s}, j: ${a}}`
    },
    code(s) {
      const { gen: a, data: c, $data: l, schema: d, parentSchema: g, schemaCode: _, it: b } = s;
      if (!l && !d)
        return;
      const $ = a.let("valid"), m = g.items ? (0, o.getSchemaTypes)(g.items) : [];
      s.block$data($, h, (0, e._)`${_} === false`), s.ok($);
      function h() {
        const w = a.let("i", (0, e._)`${c}.length`), v = a.let("j");
        s.setParams({ i: w, j: v }), a.assign($, !0), a.if((0, e._)`${w} > 1`, () => (p() ? u : f)(w, v));
      }
      function p() {
        return m.length > 0 && !m.some((w) => w === "object" || w === "array");
      }
      function u(w, v) {
        const S = a.name("item"), P = (0, o.checkDataTypes)(m, S, b.opts.strictNumbers, o.DataType.Wrong), A = a.const("indices", (0, e._)`{}`);
        a.for((0, e._)`;${w}--;`, () => {
          a.let(S, (0, e._)`${c}[${w}]`), a.if(P, (0, e._)`continue`), m.length > 1 && a.if((0, e._)`typeof ${S} == "string"`, (0, e._)`${S} += "_"`), a.if((0, e._)`typeof ${A}[${S}] == "number"`, () => {
            a.assign(v, (0, e._)`${A}[${S}]`), s.error(), a.assign($, !1).break();
          }).code((0, e._)`${A}[${S}] = ${w}`);
        });
      }
      function f(w, v) {
        const S = (0, t.useFunc)(a, r.default), P = a.name("outer");
        a.label(P).for((0, e._)`;${w}--;`, () => a.for((0, e._)`${v} = ${w}; ${v}--;`, () => a.if((0, e._)`${S}(${c}[${w}], ${c}[${v}])`, () => {
          s.error(), a.assign($, !1).break(P);
        })));
      }
    }
  };
  return Tt.default = i, Tt;
}
var kt = {}, En;
function ho() {
  if (En) return kt;
  En = 1, Object.defineProperty(kt, "__esModule", { value: !0 });
  const o = ne(), e = ae(), t = Pr(), n = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({ schemaCode: i }) => (0, o._)`{allowedValue: ${i}}`
    },
    code(i) {
      const { gen: s, data: a, $data: c, schemaCode: l, schema: d } = i;
      c || d && typeof d == "object" ? i.fail$data((0, o._)`!${(0, e.useFunc)(s, t.default)}(${a}, ${l})`) : i.fail((0, o._)`${d} !== ${a}`);
    }
  };
  return kt.default = n, kt;
}
var xt = {}, Tn;
function fo() {
  if (Tn) return xt;
  Tn = 1, Object.defineProperty(xt, "__esModule", { value: !0 });
  const o = ne(), e = ae(), t = Pr(), n = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: i }) => (0, o._)`{allowedValues: ${i}}`
    },
    code(i) {
      const { gen: s, data: a, $data: c, schema: l, schemaCode: d, it: g } = i;
      if (!c && l.length === 0)
        throw new Error("enum must have non-empty array");
      const _ = l.length >= g.opts.loopEnum;
      let b;
      const $ = () => b ?? (b = (0, e.useFunc)(s, t.default));
      let m;
      if (_ || c)
        m = s.let("valid"), i.block$data(m, h);
      else {
        if (!Array.isArray(l))
          throw new Error("ajv implementation error");
        const u = s.const("vSchema", d);
        m = (0, o.or)(...l.map((f, w) => p(u, w)));
      }
      i.pass(m);
      function h() {
        s.assign(m, !1), s.forOf("v", d, (u) => s.if((0, o._)`${$()}(${a}, ${u})`, () => s.assign(m, !0).break()));
      }
      function p(u, f) {
        const w = l[f];
        return typeof w == "object" && w !== null ? (0, o._)`${$()}(${a}, ${u}[${f}])` : (0, o._)`${a} === ${w}`;
      }
    }
  };
  return xt.default = n, xt;
}
var Mn;
function po() {
  if (Mn) return yt;
  Mn = 1, Object.defineProperty(yt, "__esModule", { value: !0 });
  const o = ro(), e = no(), t = oo(), r = so(), n = ao(), i = co(), s = lo(), a = uo(), c = ho(), l = fo(), d = [
    // number
    o.default,
    e.default,
    // string
    t.default,
    r.default,
    // object
    n.default,
    i.default,
    // array
    s.default,
    a.default,
    // any
    { keyword: "type", schemaType: ["string", "array"] },
    { keyword: "nullable", schemaType: "boolean" },
    c.default,
    l.default
  ];
  return yt.default = d, yt;
}
var At = {}, He = {}, kn;
function ii() {
  if (kn) return He;
  kn = 1, Object.defineProperty(He, "__esModule", { value: !0 }), He.validateAdditionalItems = void 0;
  const o = ne(), e = ae(), r = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: i } }) => (0, o.str)`must NOT have more than ${i} items`,
      params: ({ params: { len: i } }) => (0, o._)`{limit: ${i}}`
    },
    code(i) {
      const { parentSchema: s, it: a } = i, { items: c } = s;
      if (!Array.isArray(c)) {
        (0, e.checkStrictMode)(a, '"additionalItems" is ignored when "items" is not an array of schemas');
        return;
      }
      n(i, c);
    }
  };
  function n(i, s) {
    const { gen: a, schema: c, data: l, keyword: d, it: g } = i;
    g.items = !0;
    const _ = a.const("len", (0, o._)`${l}.length`);
    if (c === !1)
      i.setParams({ len: s.length }), i.pass((0, o._)`${_} <= ${s.length}`);
    else if (typeof c == "object" && !(0, e.alwaysValidSchema)(g, c)) {
      const $ = a.var("valid", (0, o._)`${_} <= ${s.length}`);
      a.if((0, o.not)($), () => b($)), i.ok($);
    }
    function b($) {
      a.forRange("i", s.length, _, (m) => {
        i.subschema({ keyword: d, dataProp: m, dataPropType: e.Type.Num }, $), g.allErrors || a.if((0, o.not)($), () => a.break());
      });
    }
  }
  return He.validateAdditionalItems = n, He.default = r, He;
}
var Nt = {}, Ye = {}, xn;
function oi() {
  if (xn) return Ye;
  xn = 1, Object.defineProperty(Ye, "__esModule", { value: !0 }), Ye.validateTuple = void 0;
  const o = ne(), e = ae(), t = Re(), r = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(i) {
      const { schema: s, it: a } = i;
      if (Array.isArray(s))
        return n(i, "additionalItems", s);
      a.items = !0, !(0, e.alwaysValidSchema)(a, s) && i.ok((0, t.validateArray)(i));
    }
  };
  function n(i, s, a = i.schema) {
    const { gen: c, parentSchema: l, data: d, keyword: g, it: _ } = i;
    m(l), _.opts.unevaluated && a.length && _.items !== !0 && (_.items = e.mergeEvaluated.items(c, a.length, _.items));
    const b = c.name("valid"), $ = c.const("len", (0, o._)`${d}.length`);
    a.forEach((h, p) => {
      (0, e.alwaysValidSchema)(_, h) || (c.if((0, o._)`${$} > ${p}`, () => i.subschema({
        keyword: g,
        schemaProp: p,
        dataProp: p
      }, b)), i.ok(b));
    });
    function m(h) {
      const { opts: p, errSchemaPath: u } = _, f = a.length, w = f === h.minItems && (f === h.maxItems || h[s] === !1);
      if (p.strictTuples && !w) {
        const v = `"${g}" is ${f}-tuple, but minItems or maxItems/${s} are not specified or different at path "${u}"`;
        (0, e.checkStrictMode)(_, v, p.strictTuples);
      }
    }
  }
  return Ye.validateTuple = n, Ye.default = r, Ye;
}
var An;
function mo() {
  if (An) return Nt;
  An = 1, Object.defineProperty(Nt, "__esModule", { value: !0 });
  const o = oi(), e = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (t) => (0, o.validateTuple)(t, "items")
  };
  return Nt.default = e, Nt;
}
var Rt = {}, Nn;
function go() {
  if (Nn) return Rt;
  Nn = 1, Object.defineProperty(Rt, "__esModule", { value: !0 });
  const o = ne(), e = ae(), t = Re(), r = ii(), i = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: s } }) => (0, o.str)`must NOT have more than ${s} items`,
      params: ({ params: { len: s } }) => (0, o._)`{limit: ${s}}`
    },
    code(s) {
      const { schema: a, parentSchema: c, it: l } = s, { prefixItems: d } = c;
      l.items = !0, !(0, e.alwaysValidSchema)(l, a) && (d ? (0, r.validateAdditionalItems)(s, d) : s.ok((0, t.validateArray)(s)));
    }
  };
  return Rt.default = i, Rt;
}
var Ct = {}, Rn;
function yo() {
  if (Rn) return Ct;
  Rn = 1, Object.defineProperty(Ct, "__esModule", { value: !0 });
  const o = ne(), e = ae(), r = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: !0,
    error: {
      message: ({ params: { min: n, max: i } }) => i === void 0 ? (0, o.str)`must contain at least ${n} valid item(s)` : (0, o.str)`must contain at least ${n} and no more than ${i} valid item(s)`,
      params: ({ params: { min: n, max: i } }) => i === void 0 ? (0, o._)`{minContains: ${n}}` : (0, o._)`{minContains: ${n}, maxContains: ${i}}`
    },
    code(n) {
      const { gen: i, schema: s, parentSchema: a, data: c, it: l } = n;
      let d, g;
      const { minContains: _, maxContains: b } = a;
      l.opts.next ? (d = _ === void 0 ? 1 : _, g = b) : d = 1;
      const $ = i.const("len", (0, o._)`${c}.length`);
      if (n.setParams({ min: d, max: g }), g === void 0 && d === 0) {
        (0, e.checkStrictMode)(l, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (g !== void 0 && d > g) {
        (0, e.checkStrictMode)(l, '"minContains" > "maxContains" is always invalid'), n.fail();
        return;
      }
      if ((0, e.alwaysValidSchema)(l, s)) {
        let f = (0, o._)`${$} >= ${d}`;
        g !== void 0 && (f = (0, o._)`${f} && ${$} <= ${g}`), n.pass(f);
        return;
      }
      l.items = !0;
      const m = i.name("valid");
      g === void 0 && d === 1 ? p(m, () => i.if(m, () => i.break())) : d === 0 ? (i.let(m, !0), g !== void 0 && i.if((0, o._)`${c}.length > 0`, h)) : (i.let(m, !1), h()), n.result(m, () => n.reset());
      function h() {
        const f = i.name("_valid"), w = i.let("count", 0);
        p(f, () => i.if(f, () => u(w)));
      }
      function p(f, w) {
        i.forRange("i", 0, $, (v) => {
          n.subschema({
            keyword: "contains",
            dataProp: v,
            dataPropType: e.Type.Num,
            compositeRule: !0
          }, f), w();
        });
      }
      function u(f) {
        i.code((0, o._)`${f}++`), g === void 0 ? i.if((0, o._)`${f} >= ${d}`, () => i.assign(m, !0).break()) : (i.if((0, o._)`${f} > ${g}`, () => i.assign(m, !1).break()), d === 1 ? i.assign(m, !0) : i.if((0, o._)`${f} >= ${d}`, () => i.assign(m, !0)));
      }
    }
  };
  return Ct.default = r, Ct;
}
var pr = {}, Cn;
function vo() {
  return Cn || (Cn = 1, (function(o) {
    Object.defineProperty(o, "__esModule", { value: !0 }), o.validateSchemaDeps = o.validatePropertyDeps = o.error = void 0;
    const e = ne(), t = ae(), r = Re();
    o.error = {
      message: ({ params: { property: c, depsCount: l, deps: d } }) => {
        const g = l === 1 ? "property" : "properties";
        return (0, e.str)`must have ${g} ${d} when property ${c} is present`;
      },
      params: ({ params: { property: c, depsCount: l, deps: d, missingProperty: g } }) => (0, e._)`{property: ${c},
    missingProperty: ${g},
    depsCount: ${l},
    deps: ${d}}`
      // TODO change to reference
    };
    const n = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: o.error,
      code(c) {
        const [l, d] = i(c);
        s(c, l), a(c, d);
      }
    };
    function i({ schema: c }) {
      const l = {}, d = {};
      for (const g in c) {
        if (g === "__proto__")
          continue;
        const _ = Array.isArray(c[g]) ? l : d;
        _[g] = c[g];
      }
      return [l, d];
    }
    function s(c, l = c.schema) {
      const { gen: d, data: g, it: _ } = c;
      if (Object.keys(l).length === 0)
        return;
      const b = d.let("missing");
      for (const $ in l) {
        const m = l[$];
        if (m.length === 0)
          continue;
        const h = (0, r.propertyInData)(d, g, $, _.opts.ownProperties);
        c.setParams({
          property: $,
          depsCount: m.length,
          deps: m.join(", ")
        }), _.allErrors ? d.if(h, () => {
          for (const p of m)
            (0, r.checkReportMissingProp)(c, p);
        }) : (d.if((0, e._)`${h} && (${(0, r.checkMissingProp)(c, m, b)})`), (0, r.reportMissingProp)(c, b), d.else());
      }
    }
    o.validatePropertyDeps = s;
    function a(c, l = c.schema) {
      const { gen: d, data: g, keyword: _, it: b } = c, $ = d.name("valid");
      for (const m in l)
        (0, t.alwaysValidSchema)(b, l[m]) || (d.if(
          (0, r.propertyInData)(d, g, m, b.opts.ownProperties),
          () => {
            const h = c.subschema({ keyword: _, schemaProp: m }, $);
            c.mergeValidEvaluated(h, $);
          },
          () => d.var($, !0)
          // TODO var
        ), c.ok($));
    }
    o.validateSchemaDeps = a, o.default = n;
  })(pr)), pr;
}
var jt = {}, jn;
function bo() {
  if (jn) return jt;
  jn = 1, Object.defineProperty(jt, "__esModule", { value: !0 });
  const o = ne(), e = ae(), r = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error: {
      message: "property name must be valid",
      params: ({ params: n }) => (0, o._)`{propertyName: ${n.propertyName}}`
    },
    code(n) {
      const { gen: i, schema: s, data: a, it: c } = n;
      if ((0, e.alwaysValidSchema)(c, s))
        return;
      const l = i.name("valid");
      i.forIn("key", a, (d) => {
        n.setParams({ propertyName: d }), n.subschema({
          keyword: "propertyNames",
          data: d,
          dataTypes: ["string"],
          propertyName: d,
          compositeRule: !0
        }, l), i.if((0, o.not)(l), () => {
          n.error(!0), c.allErrors || i.break();
        });
      }), n.ok(l);
    }
  };
  return jt.default = r, jt;
}
var It = {}, In;
function si() {
  if (In) return It;
  In = 1, Object.defineProperty(It, "__esModule", { value: !0 });
  const o = Re(), e = ne(), t = Fe(), r = ae(), i = {
    keyword: "additionalProperties",
    type: ["object"],
    schemaType: ["boolean", "object"],
    allowUndefined: !0,
    trackErrors: !0,
    error: {
      message: "must NOT have additional properties",
      params: ({ params: s }) => (0, e._)`{additionalProperty: ${s.additionalProperty}}`
    },
    code(s) {
      const { gen: a, schema: c, parentSchema: l, data: d, errsCount: g, it: _ } = s;
      if (!g)
        throw new Error("ajv implementation error");
      const { allErrors: b, opts: $ } = _;
      if (_.props = !0, $.removeAdditional !== "all" && (0, r.alwaysValidSchema)(_, c))
        return;
      const m = (0, o.allSchemaProperties)(l.properties), h = (0, o.allSchemaProperties)(l.patternProperties);
      p(), s.ok((0, e._)`${g} === ${t.default.errors}`);
      function p() {
        a.forIn("key", d, (S) => {
          !m.length && !h.length ? w(S) : a.if(u(S), () => w(S));
        });
      }
      function u(S) {
        let P;
        if (m.length > 8) {
          const A = (0, r.schemaRefOrVal)(_, l.properties, "properties");
          P = (0, o.isOwnProperty)(a, A, S);
        } else m.length ? P = (0, e.or)(...m.map((A) => (0, e._)`${S} === ${A}`)) : P = e.nil;
        return h.length && (P = (0, e.or)(P, ...h.map((A) => (0, e._)`${(0, o.usePattern)(s, A)}.test(${S})`))), (0, e.not)(P);
      }
      function f(S) {
        a.code((0, e._)`delete ${d}[${S}]`);
      }
      function w(S) {
        if ($.removeAdditional === "all" || $.removeAdditional && c === !1) {
          f(S);
          return;
        }
        if (c === !1) {
          s.setParams({ additionalProperty: S }), s.error(), b || a.break();
          return;
        }
        if (typeof c == "object" && !(0, r.alwaysValidSchema)(_, c)) {
          const P = a.name("valid");
          $.removeAdditional === "failing" ? (v(S, P, !1), a.if((0, e.not)(P), () => {
            s.reset(), f(S);
          })) : (v(S, P), b || a.if((0, e.not)(P), () => a.break()));
        }
      }
      function v(S, P, A) {
        const C = {
          keyword: "additionalProperties",
          dataProp: S,
          dataPropType: r.Type.Str
        };
        A === !1 && Object.assign(C, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), s.subschema(C, P);
      }
    }
  };
  return It.default = i, It;
}
var Ot = {}, On;
function wo() {
  if (On) return Ot;
  On = 1, Object.defineProperty(Ot, "__esModule", { value: !0 });
  const o = er(), e = Re(), t = ae(), r = si(), n = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(i) {
      const { gen: s, schema: a, parentSchema: c, data: l, it: d } = i;
      d.opts.removeAdditional === "all" && c.additionalProperties === void 0 && r.default.code(new o.KeywordCxt(d, r.default, "additionalProperties"));
      const g = (0, e.allSchemaProperties)(a);
      for (const h of g)
        d.definedProperties.add(h);
      d.opts.unevaluated && g.length && d.props !== !0 && (d.props = t.mergeEvaluated.props(s, (0, t.toHash)(g), d.props));
      const _ = g.filter((h) => !(0, t.alwaysValidSchema)(d, a[h]));
      if (_.length === 0)
        return;
      const b = s.name("valid");
      for (const h of _)
        $(h) ? m(h) : (s.if((0, e.propertyInData)(s, l, h, d.opts.ownProperties)), m(h), d.allErrors || s.else().var(b, !0), s.endIf()), i.it.definedProperties.add(h), i.ok(b);
      function $(h) {
        return d.opts.useDefaults && !d.compositeRule && a[h].default !== void 0;
      }
      function m(h) {
        i.subschema({
          keyword: "properties",
          schemaProp: h,
          dataProp: h
        }, b);
      }
    }
  };
  return Ot.default = n, Ot;
}
var qt = {}, qn;
function _o() {
  if (qn) return qt;
  qn = 1, Object.defineProperty(qt, "__esModule", { value: !0 });
  const o = Re(), e = ne(), t = ae(), r = ae(), n = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(i) {
      const { gen: s, schema: a, data: c, parentSchema: l, it: d } = i, { opts: g } = d, _ = (0, o.allSchemaProperties)(a), b = _.filter((w) => (0, t.alwaysValidSchema)(d, a[w]));
      if (_.length === 0 || b.length === _.length && (!d.opts.unevaluated || d.props === !0))
        return;
      const $ = g.strictSchema && !g.allowMatchingProperties && l.properties, m = s.name("valid");
      d.props !== !0 && !(d.props instanceof e.Name) && (d.props = (0, r.evaluatedPropsToName)(s, d.props));
      const { props: h } = d;
      p();
      function p() {
        for (const w of _)
          $ && u(w), d.allErrors ? f(w) : (s.var(m, !0), f(w), s.if(m));
      }
      function u(w) {
        for (const v in $)
          new RegExp(w).test(v) && (0, t.checkStrictMode)(d, `property ${v} matches pattern ${w} (use allowMatchingProperties)`);
      }
      function f(w) {
        s.forIn("key", c, (v) => {
          s.if((0, e._)`${(0, o.usePattern)(i, w)}.test(${v})`, () => {
            const S = b.includes(w);
            S || i.subschema({
              keyword: "patternProperties",
              schemaProp: w,
              dataProp: v,
              dataPropType: r.Type.Str
            }, m), d.opts.unevaluated && h !== !0 ? s.assign((0, e._)`${h}[${v}]`, !0) : !S && !d.allErrors && s.if((0, e.not)(m), () => s.break());
          });
        });
      }
    }
  };
  return qt.default = n, qt;
}
var Dt = {}, Dn;
function $o() {
  if (Dn) return Dt;
  Dn = 1, Object.defineProperty(Dt, "__esModule", { value: !0 });
  const o = ae(), e = {
    keyword: "not",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    code(t) {
      const { gen: r, schema: n, it: i } = t;
      if ((0, o.alwaysValidSchema)(i, n)) {
        t.fail();
        return;
      }
      const s = r.name("valid");
      t.subschema({
        keyword: "not",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, s), t.failResult(s, () => t.reset(), () => t.error());
    },
    error: { message: "must NOT be valid" }
  };
  return Dt.default = e, Dt;
}
var Lt = {}, Ln;
function So() {
  if (Ln) return Lt;
  Ln = 1, Object.defineProperty(Lt, "__esModule", { value: !0 });
  const e = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: Re().validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return Lt.default = e, Lt;
}
var zt = {}, zn;
function Po() {
  if (zn) return zt;
  zn = 1, Object.defineProperty(zt, "__esModule", { value: !0 });
  const o = ne(), e = ae(), r = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: !0,
    error: {
      message: "must match exactly one schema in oneOf",
      params: ({ params: n }) => (0, o._)`{passingSchemas: ${n.passing}}`
    },
    code(n) {
      const { gen: i, schema: s, parentSchema: a, it: c } = n;
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      if (c.opts.discriminator && a.discriminator)
        return;
      const l = s, d = i.let("valid", !1), g = i.let("passing", null), _ = i.name("_valid");
      n.setParams({ passing: g }), i.block(b), n.result(d, () => n.reset(), () => n.error(!0));
      function b() {
        l.forEach(($, m) => {
          let h;
          (0, e.alwaysValidSchema)(c, $) ? i.var(_, !0) : h = n.subschema({
            keyword: "oneOf",
            schemaProp: m,
            compositeRule: !0
          }, _), m > 0 && i.if((0, o._)`${_} && ${d}`).assign(d, !1).assign(g, (0, o._)`[${g}, ${m}]`).else(), i.if(_, () => {
            i.assign(d, !0), i.assign(g, m), h && n.mergeEvaluated(h, o.Name);
          });
        });
      }
    }
  };
  return zt.default = r, zt;
}
var Vt = {}, Vn;
function Eo() {
  if (Vn) return Vt;
  Vn = 1, Object.defineProperty(Vt, "__esModule", { value: !0 });
  const o = ae(), e = {
    keyword: "allOf",
    schemaType: "array",
    code(t) {
      const { gen: r, schema: n, it: i } = t;
      if (!Array.isArray(n))
        throw new Error("ajv implementation error");
      const s = r.name("valid");
      n.forEach((a, c) => {
        if ((0, o.alwaysValidSchema)(i, a))
          return;
        const l = t.subschema({ keyword: "allOf", schemaProp: c }, s);
        t.ok(s), t.mergeEvaluated(l);
      });
    }
  };
  return Vt.default = e, Vt;
}
var Ft = {}, Fn;
function To() {
  if (Fn) return Ft;
  Fn = 1, Object.defineProperty(Ft, "__esModule", { value: !0 });
  const o = ne(), e = ae(), r = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    error: {
      message: ({ params: i }) => (0, o.str)`must match "${i.ifClause}" schema`,
      params: ({ params: i }) => (0, o._)`{failingKeyword: ${i.ifClause}}`
    },
    code(i) {
      const { gen: s, parentSchema: a, it: c } = i;
      a.then === void 0 && a.else === void 0 && (0, e.checkStrictMode)(c, '"if" without "then" and "else" is ignored');
      const l = n(c, "then"), d = n(c, "else");
      if (!l && !d)
        return;
      const g = s.let("valid", !0), _ = s.name("_valid");
      if (b(), i.reset(), l && d) {
        const m = s.let("ifClause");
        i.setParams({ ifClause: m }), s.if(_, $("then", m), $("else", m));
      } else l ? s.if(_, $("then")) : s.if((0, o.not)(_), $("else"));
      i.pass(g, () => i.error(!0));
      function b() {
        const m = i.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, _);
        i.mergeEvaluated(m);
      }
      function $(m, h) {
        return () => {
          const p = i.subschema({ keyword: m }, _);
          s.assign(g, _), i.mergeValidEvaluated(p, g), h ? s.assign(h, (0, o._)`${m}`) : i.setParams({ ifClause: m });
        };
      }
    }
  };
  function n(i, s) {
    const a = i.schema[s];
    return a !== void 0 && !(0, e.alwaysValidSchema)(i, a);
  }
  return Ft.default = r, Ft;
}
var Gt = {}, Gn;
function Mo() {
  if (Gn) return Gt;
  Gn = 1, Object.defineProperty(Gt, "__esModule", { value: !0 });
  const o = ae(), e = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: t, parentSchema: r, it: n }) {
      r.if === void 0 && (0, o.checkStrictMode)(n, `"${t}" without "if" is ignored`);
    }
  };
  return Gt.default = e, Gt;
}
var Bn;
function ko() {
  if (Bn) return At;
  Bn = 1, Object.defineProperty(At, "__esModule", { value: !0 });
  const o = ii(), e = mo(), t = oi(), r = go(), n = yo(), i = vo(), s = bo(), a = si(), c = wo(), l = _o(), d = $o(), g = So(), _ = Po(), b = Eo(), $ = To(), m = Mo();
  function h(p = !1) {
    const u = [
      // any
      d.default,
      g.default,
      _.default,
      b.default,
      $.default,
      m.default,
      // object
      s.default,
      a.default,
      i.default,
      c.default,
      l.default
    ];
    return p ? u.push(e.default, r.default) : u.push(o.default, t.default), u.push(n.default), u;
  }
  return At.default = h, At;
}
var Bt = {}, Ut = {}, Un;
function xo() {
  if (Un) return Ut;
  Un = 1, Object.defineProperty(Ut, "__esModule", { value: !0 });
  const o = ne(), t = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: r }) => (0, o.str)`must match format "${r}"`,
      params: ({ schemaCode: r }) => (0, o._)`{format: ${r}}`
    },
    code(r, n) {
      const { gen: i, data: s, $data: a, schema: c, schemaCode: l, it: d } = r, { opts: g, errSchemaPath: _, schemaEnv: b, self: $ } = d;
      if (!g.validateFormats)
        return;
      a ? m() : h();
      function m() {
        const p = i.scopeValue("formats", {
          ref: $.formats,
          code: g.code.formats
        }), u = i.const("fDef", (0, o._)`${p}[${l}]`), f = i.let("fType"), w = i.let("format");
        i.if((0, o._)`typeof ${u} == "object" && !(${u} instanceof RegExp)`, () => i.assign(f, (0, o._)`${u}.type || "string"`).assign(w, (0, o._)`${u}.validate`), () => i.assign(f, (0, o._)`"string"`).assign(w, u)), r.fail$data((0, o.or)(v(), S()));
        function v() {
          return g.strictSchema === !1 ? o.nil : (0, o._)`${l} && !${w}`;
        }
        function S() {
          const P = b.$async ? (0, o._)`(${u}.async ? await ${w}(${s}) : ${w}(${s}))` : (0, o._)`${w}(${s})`, A = (0, o._)`(typeof ${w} == "function" ? ${P} : ${w}.test(${s}))`;
          return (0, o._)`${w} && ${w} !== true && ${f} === ${n} && !${A}`;
        }
      }
      function h() {
        const p = $.formats[c];
        if (!p) {
          v();
          return;
        }
        if (p === !0)
          return;
        const [u, f, w] = S(p);
        u === n && r.pass(P());
        function v() {
          if (g.strictSchema === !1) {
            $.logger.warn(A());
            return;
          }
          throw new Error(A());
          function A() {
            return `unknown format "${c}" ignored in schema at path "${_}"`;
          }
        }
        function S(A) {
          const C = A instanceof RegExp ? (0, o.regexpCode)(A) : g.code.formats ? (0, o._)`${g.code.formats}${(0, o.getProperty)(c)}` : void 0, O = i.scopeValue("formats", { key: c, ref: A, code: C });
          return typeof A == "object" && !(A instanceof RegExp) ? [A.type || "string", A.validate, (0, o._)`${O}.validate`] : ["string", A, O];
        }
        function P() {
          if (typeof p == "object" && !(p instanceof RegExp) && p.async) {
            if (!b.$async)
              throw new Error("async format in sync schema");
            return (0, o._)`await ${w}(${s})`;
          }
          return typeof f == "function" ? (0, o._)`${w}(${s})` : (0, o._)`${w}.test(${s})`;
        }
      }
    }
  };
  return Ut.default = t, Ut;
}
var Kn;
function Ao() {
  if (Kn) return Bt;
  Kn = 1, Object.defineProperty(Bt, "__esModule", { value: !0 });
  const e = [xo().default];
  return Bt.default = e, Bt;
}
var Ue = {}, Jn;
function No() {
  return Jn || (Jn = 1, Object.defineProperty(Ue, "__esModule", { value: !0 }), Ue.contentVocabulary = Ue.metadataVocabulary = void 0, Ue.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples"
  ], Ue.contentVocabulary = [
    "contentMediaType",
    "contentEncoding",
    "contentSchema"
  ]), Ue;
}
var Hn;
function Ro() {
  if (Hn) return pt;
  Hn = 1, Object.defineProperty(pt, "__esModule", { value: !0 });
  const o = to(), e = po(), t = ko(), r = Ao(), n = No(), i = [
    o.default,
    e.default,
    (0, t.default)(),
    r.default,
    n.metadataVocabulary,
    n.contentVocabulary
  ];
  return pt.default = i, pt;
}
var Kt = {}, rt = {}, Yn;
function Co() {
  if (Yn) return rt;
  Yn = 1, Object.defineProperty(rt, "__esModule", { value: !0 }), rt.DiscrError = void 0;
  var o;
  return (function(e) {
    e.Tag = "tag", e.Mapping = "mapping";
  })(o || (rt.DiscrError = o = {})), rt;
}
var Wn;
function jo() {
  if (Wn) return Kt;
  Wn = 1, Object.defineProperty(Kt, "__esModule", { value: !0 });
  const o = ne(), e = Co(), t = Sr(), r = tr(), n = ae(), s = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: a, tagName: c } }) => a === e.DiscrError.Tag ? `tag "${c}" must be string` : `value of tag "${c}" must be in oneOf`,
      params: ({ params: { discrError: a, tag: c, tagName: l } }) => (0, o._)`{error: ${a}, tag: ${l}, tagValue: ${c}}`
    },
    code(a) {
      const { gen: c, data: l, schema: d, parentSchema: g, it: _ } = a, { oneOf: b } = g;
      if (!_.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const $ = d.propertyName;
      if (typeof $ != "string")
        throw new Error("discriminator: requires propertyName");
      if (d.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!b)
        throw new Error("discriminator: requires oneOf keyword");
      const m = c.let("valid", !1), h = c.const("tag", (0, o._)`${l}${(0, o.getProperty)($)}`);
      c.if((0, o._)`typeof ${h} == "string"`, () => p(), () => a.error(!1, { discrError: e.DiscrError.Tag, tag: h, tagName: $ })), a.ok(m);
      function p() {
        const w = f();
        c.if(!1);
        for (const v in w)
          c.elseIf((0, o._)`${h} === ${v}`), c.assign(m, u(w[v]));
        c.else(), a.error(!1, { discrError: e.DiscrError.Mapping, tag: h, tagName: $ }), c.endIf();
      }
      function u(w) {
        const v = c.name("valid"), S = a.subschema({ keyword: "oneOf", schemaProp: w }, v);
        return a.mergeEvaluated(S, o.Name), v;
      }
      function f() {
        var w;
        const v = {}, S = A(g);
        let P = !0;
        for (let D = 0; D < b.length; D++) {
          let V = b[D];
          if (V?.$ref && !(0, n.schemaHasRulesButRef)(V, _.self.RULES)) {
            const F = V.$ref;
            if (V = t.resolveRef.call(_.self, _.schemaEnv.root, _.baseId, F), V instanceof t.SchemaEnv && (V = V.schema), V === void 0)
              throw new r.default(_.opts.uriResolver, _.baseId, F);
          }
          const L = (w = V?.properties) === null || w === void 0 ? void 0 : w[$];
          if (typeof L != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${$}"`);
          P = P && (S || A(V)), C(L, D);
        }
        if (!P)
          throw new Error(`discriminator: "${$}" must be required`);
        return v;
        function A({ required: D }) {
          return Array.isArray(D) && D.includes($);
        }
        function C(D, V) {
          if (D.const)
            O(D.const, V);
          else if (D.enum)
            for (const L of D.enum)
              O(L, V);
          else
            throw new Error(`discriminator: "properties/${$}" must have "const" or "enum"`);
        }
        function O(D, V) {
          if (typeof D != "string" || D in v)
            throw new Error(`discriminator: "${$}" values must be unique strings`);
          v[D] = V;
        }
      }
    }
  };
  return Kt.default = s, Kt;
}
const Io = "http://json-schema.org/draft-07/schema#", Oo = "http://json-schema.org/draft-07/schema#", qo = "Core schema meta-schema", Do = { schemaArray: { type: "array", minItems: 1, items: { $ref: "#" } }, nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }] }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, Lo = ["object", "boolean"], zo = { $id: { type: "string", format: "uri-reference" }, $schema: { type: "string", format: "uri" }, $ref: { type: "string", format: "uri-reference" }, $comment: { type: "string" }, title: { type: "string" }, description: { type: "string" }, default: !0, readOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/definitions/nonNegativeInteger" }, minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, additionalItems: { $ref: "#" }, items: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }], default: !0 }, maxItems: { $ref: "#/definitions/nonNegativeInteger" }, minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, contains: { $ref: "#" }, maxProperties: { $ref: "#/definitions/nonNegativeInteger" }, minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, required: { $ref: "#/definitions/stringArray" }, additionalProperties: { $ref: "#" }, definitions: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, properties: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $ref: "#" }, propertyNames: { format: "regex" }, default: {} }, dependencies: { type: "object", additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] } }, propertyNames: { $ref: "#" }, const: !0, enum: { type: "array", items: !0, minItems: 1, uniqueItems: !0 }, type: { anyOf: [{ $ref: "#/definitions/simpleTypes" }, { type: "array", items: { $ref: "#/definitions/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, format: { type: "string" }, contentMediaType: { type: "string" }, contentEncoding: { type: "string" }, if: { $ref: "#" }, then: { $ref: "#" }, else: { $ref: "#" }, allOf: { $ref: "#/definitions/schemaArray" }, anyOf: { $ref: "#/definitions/schemaArray" }, oneOf: { $ref: "#/definitions/schemaArray" }, not: { $ref: "#" } }, Vo = {
  $schema: Io,
  $id: Oo,
  title: qo,
  definitions: Do,
  type: Lo,
  properties: zo,
  default: !0
};
var Qn;
function Fo() {
  return Qn || (Qn = 1, (function(o, e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv = void 0;
    const t = Xi(), r = Ro(), n = jo(), i = Vo, s = ["/properties"], a = "http://json-schema.org/draft-07/schema";
    class c extends t.default {
      _addVocabularies() {
        super._addVocabularies(), r.default.forEach(($) => this.addVocabulary($)), this.opts.discriminator && this.addKeyword(n.default);
      }
      _addDefaultMetaSchema() {
        if (super._addDefaultMetaSchema(), !this.opts.meta)
          return;
        const $ = this.opts.$data ? this.$dataMetaSchema(i, s) : i;
        this.addMetaSchema($, a, !1), this.refs["http://json-schema.org/schema"] = a;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(a) ? a : void 0);
      }
    }
    e.Ajv = c, o.exports = e = c, o.exports.Ajv = c, Object.defineProperty(e, "__esModule", { value: !0 }), e.default = c;
    var l = er();
    Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
      return l.KeywordCxt;
    } });
    var d = ne();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return d._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return d.str;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return d.stringify;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return d.nil;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return d.Name;
    } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
      return d.CodeGen;
    } });
    var g = $r();
    Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
      return g.default;
    } });
    var _ = tr();
    Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
      return _.default;
    } });
  })(lt, lt.exports)), lt.exports;
}
var Go = Fo();
const Bo = /* @__PURE__ */ ji(Go), Uo = "http://json-schema.org/draft-07/schema#", Ko = "JSON Music Object Notation (JMON) Schema", Jo = "A human-readable, western-ish declarative music format based on JSON.", Ho = "object", Yo = ["format", "version", "tempo", "tracks"], Wo = /* @__PURE__ */ JSON.parse(`{"format":{"type":"string","const":"jmon","description":"The format identifier for the JMON schema."},"version":{"type":"string","description":"JMON schema version."},"tempo":{"type":"number","minimum":20,"maximum":400,"description":"Tempo in beats per minute (BPM)."},"keySignature":{"type":"string","pattern":"^[A-G](#|b)?m?$","description":"Key signature (e.g., 'C', 'Am', 'F#')."},"keySignatureMap":{"type":"array","description":"Map of key signature changes over time.","items":{"type":"object","required":["time","keySignature"],"properties":{"time":{"oneOf":[{"type":"number","description":"Time in quarter notes (e.g., 8.0 for beat 1 of bar 3 in 4/4 time)."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '2:0:0')."}],"description":"Time of the key signature change."},"keySignature":{"type":"string","pattern":"^[A-G](#|b)?m?$","description":"New key signature at this time."}},"additionalProperties":false}},"timeSignature":{"type":"string","pattern":"^\\\\d+/\\\\d+$","description":"Time signature for the composition (e.g., '4/4')."},"tempoMap":{"type":"array","description":"Map of tempo changes over time.","items":{"type":"object","required":["time","tempo"],"properties":{"time":{"oneOf":[{"type":"number","description":"Time in quarter notes (e.g., 16.0 for beat 1 of bar 5 in 4/4 time)."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '4:0:0')."}],"description":"The time point for the tempo change."},"tempo":{"type":"number","minimum":20,"maximum":400,"description":"Tempo in beats per minute at this time point."}},"additionalProperties":false}},"transport":{"type":"object","description":"Settings controlling global playback and looping.","properties":{"startOffset":{"oneOf":[{"type":"number","description":"Offset in quarter notes for when playback should start (e.g., 2.0 for beat 3)."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '0:2:0')."}],"description":"Offset for when playback should start."},"globalLoop":{"type":"boolean","description":"Whether the entire project should loop."},"globalLoopEnd":{"oneOf":[{"type":"number","description":"End time in quarter notes where the global loop should end (e.g., 32.0 for bar 9 in 4/4)."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '8:0:0')."}],"description":"Where the global loop should end."},"swing":{"type":"number","minimum":0,"maximum":1,"description":"Swing amount (0-1)."}},"additionalProperties":false},"metadata":{"type":"object","description":"Metadata for the composition, allowing arbitrary fields.","properties":{"title":{"type":"string","description":"Title of the composition."},"composer":{"type":"string","description":"Composer of the music."},"description":{"type":"string","description":"Description of the composition."}},"additionalProperties":true},"customPresets":{"type":"array","description":"Array of custom user-defined presets for synths or effects.","items":{"type":"object","required":["id","type","options"],"properties":{"id":{"type":"string","description":"Unique identifier for this preset."},"type":{"type":"string","description":"Type of preset (e.g., 'Synth', 'Effect', 'Sampler')."},"options":{"type":"object","description":"Preset options."}},"additionalProperties":false}},"audioGraph":{"type":"array","description":"Audio node graph for synthesis. If not provided, a default synth->master setup will be created automatically.","default":[{"id":"synth","type":"Synth","options":{}},{"id":"master","type":"Destination","options":{}}],"items":{"type":"object","required":["id","type","options"],"properties":{"id":{"type":"string","description":"Unique identifier for this node."},"type":{"type":"string","enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth","Sampler","Filter","AutoFilter","Reverb","FeedbackDelay","PingPongDelay","Delay","Chorus","Phaser","Tremolo","Vibrato","AutoWah","Distortion","Chebyshev","BitCrusher","Compressor","Limiter","Gate","FrequencyShifter","PitchShift","JCReverb","Freeverb","StereoWidener","MidSideCompressor","Destination"],"description":"Type of audio node (Synth, Sampler, Effect, etc.)."},"options":{"type":"object","description":"Options for this node. Content varies by node type."},"target":{"type":"string","description":"Target node for audio routing."},"presetRef":{"type":"string","description":"Reference to a custom preset."}},"allOf":[{"if":{"properties":{"type":{"const":"Sampler"}}},"then":{"properties":{"options":{"type":"object","properties":{"urls":{"type":"object","description":"Sample URLs for Sampler nodes (note -> file path mapping)","patternProperties":{"^[A-G](#|b)?[0-8]$":{"type":"string","description":"File path to sample for this note"}}},"envelope":{"type":"object","description":"Automatic envelope for Samplers to smooth attack/release","properties":{"enabled":{"type":"boolean","default":true,"description":"Whether to apply automatic envelope"},"attack":{"type":"number","minimum":0,"maximum":2,"default":0.02,"description":"Attack time in seconds"},"decay":{"type":"number","minimum":0,"maximum":2,"default":0.1,"description":"Decay time in seconds"},"sustain":{"type":"number","minimum":0,"maximum":1,"default":0.8,"description":"Sustain level (0-1)"},"release":{"type":"number","minimum":0,"maximum":5,"default":0.3,"description":"Release time in seconds"}},"additionalProperties":false}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth"]}}},"then":{"properties":{"options":{"type":"object","properties":{"oscillator":{"type":"object","description":"Oscillator settings for synths"},"envelope":{"type":"object","description":"ADSR envelope settings for synths"},"filter":{"type":"object","description":"Filter settings for synths"}},"additionalProperties":true}}}},{"if":{"properties":{"type":{"enum":["Reverb","JCReverb","Freeverb"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"roomSize":{"type":"number","minimum":0,"maximum":1,"default":0.7,"description":"Room size for reverb effects"},"dampening":{"type":"number","minimum":0,"maximum":1,"default":0.3,"description":"Dampening for reverb effects"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Delay","FeedbackDelay","PingPongDelay"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"delayTime":{"type":"string","default":"8n","description":"Delay time (note values like '8n' or seconds)"},"feedback":{"type":"number","minimum":0,"maximum":0.95,"default":0.4,"description":"Feedback amount for delay effects"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Filter","AutoFilter"]}}},"then":{"properties":{"options":{"type":"object","properties":{"frequency":{"type":"number","minimum":20,"maximum":20000,"default":1000,"description":"Filter frequency"},"Q":{"type":"number","minimum":0.1,"maximum":50,"default":1,"description":"Filter Q/resonance"},"type":{"type":"string","enum":["lowpass","highpass","bandpass","notch"],"default":"lowpass","description":"Filter type"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Chorus","Phaser"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"depth":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Modulation depth"},"rate":{"type":"string","default":"4n","description":"Modulation rate (note values or Hz)"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Compressor","Limiter","Gate"]}}},"then":{"properties":{"options":{"type":"object","properties":{"threshold":{"type":"number","minimum":-60,"maximum":0,"default":-24,"description":"Threshold in dB"},"ratio":{"type":"number","minimum":1,"maximum":20,"default":4,"description":"Compression ratio"},"attack":{"type":"number","minimum":0,"maximum":1,"default":0.003,"description":"Attack time for compressor/gate"},"release":{"type":"number","minimum":0,"maximum":1,"default":0.1,"description":"Release time for compressor/gate"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"enum":["Distortion","Chebyshev"]}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"distortion":{"type":"number","minimum":0,"maximum":1,"default":0.4,"description":"Distortion amount"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"const":"BitCrusher"}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Wet/dry mix (0=dry, 1=wet)"},"bits":{"type":"number","minimum":1,"maximum":16,"default":4,"description":"Bit depth for BitCrusher"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"const":"Tremolo"}}},"then":{"properties":{"options":{"type":"object","properties":{"wet":{"type":"number","minimum":0,"maximum":1,"default":1,"description":"Wet/dry mix (0=dry, 1=wet)"},"frequency":{"type":"number","minimum":0.1,"maximum":20,"default":4,"description":"Tremolo frequency in Hz"},"depth":{"type":"number","minimum":0,"maximum":1,"default":0.5,"description":"Tremolo depth"}},"additionalProperties":false}}}},{"if":{"properties":{"type":{"const":"Destination"}}},"then":{"properties":{"options":{"type":"object","properties":{},"additionalProperties":false}}}}],"additionalProperties":false}},"connections":{"type":"array","description":"Array of audio graph connections. Each is a two-element array [source, target]. If not provided, default connections will be created automatically.","default":[["synth","master"]],"items":{"type":"array","minItems":2,"maxItems":2,"items":{"type":"string"}}},"tracks":{"type":"array","description":"Musical tracks (sequences or parts).","items":{"type":"object","required":["label","notes"],"properties":{"label":{"type":"string","description":"Label for this sequence (e.g., 'lead', 'bass', etc.)."},"midiChannel":{"type":"integer","minimum":0,"maximum":15,"description":"Default MIDI channel for this sequence (0-15)."},"synth":{"type":"object","required":["type"],"properties":{"type":{"type":"string","enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth","Sampler"],"description":"Type of synthesizer (Synth, Sampler, AMSynth, FMSynth, etc.)."},"options":{"type":"object","description":"Synthesizer options."},"presetRef":{"type":"string","description":"Reference to a custom preset."},"modulationTarget":{"type":"string","enum":["vibrato","tremolo","glissando","filter"],"description":"Target for modulation wheel (CC1) control. Determines how modulation wheel affects the synth."}},"additionalProperties":false,"description":"Synthesizer definition for this sequence."},"synthRef":{"type":"string","description":"Reference to an audioGraph node to use as the synth."},"notes":{"type":"array","description":"Array of note events.","items":{"type":"object","required":["pitch","time","duration"],"properties":{"pitch":{"oneOf":[{"type":"number","description":"MIDI note number (preferred)."},{"type":"string","description":"Note name (e.g., 'C4', 'G#3')."},{"type":"array","description":"Chord (array of MIDI numbers or note names).","items":{"oneOf":[{"type":"number"},{"type":"string"}]}}]},"time":{"oneOf":[{"type":"number","description":"Time in quarter notes (e.g., 4.5 for beat 1.5 of bar 2 in 4/4). Primary format for MIDI compatibility."},{"type":"string","pattern":"^(\\\\d+n|\\\\d+t)$","description":"Tone.js note values (e.g., '4n', '8t') for relative timing."},{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Optional: Musical time in bars:beats:ticks format for display (e.g., '0:2:0', '1:3.5:240')."}]},"duration":{"oneOf":[{"type":"string","pattern":"^(\\\\d+n|\\\\d+t|\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+)$","description":"Musical duration using Tone.js note values (e.g., '4n', '8n', '2t') or bars:beats:ticks format (e.g., '1:0:0')."},{"type":"number","description":"Legacy: Duration in seconds (deprecated, use note values instead)."}]},"velocity":{"type":"number","minimum":0,"maximum":1,"description":"Note velocity (0-1)."},"articulation":{"type":"string","enum":["staccato","accent","tenuto","legato","marcato"],"description":"Performance instruction that affects how a note is played (e.g., 'staccato', 'accent')."},"ornaments":{"type":"array","description":"Array of melodic ornaments to apply to this note","items":{"type":"object","required":["type"],"properties":{"type":{"type":"string","enum":["grace_note","trill","mordent","turn","arpeggio"],"description":"Type of ornament"},"parameters":{"type":"object","description":"Parameters specific to this ornament type","oneOf":[{"if":{"properties":{"type":{"const":"grace_note"}}},"then":{"properties":{"graceNoteType":{"type":"string","enum":["acciaccatura","appoggiatura"],"description":"Type of grace note"},"gracePitches":{"type":"array","items":{"oneOf":[{"type":"number","description":"MIDI note number"},{"type":"string","description":"Note name (e.g., 'C4')"}]},"description":"Optional specific pitches for the grace note(s)"}},"required":["graceNoteType"]}},{"if":{"properties":{"type":{"const":"trill"}}},"then":{"properties":{"by":{"type":"number","default":1,"description":"Interval for the trill (in scale steps)"},"trillRate":{"type":"number","default":0.125,"description":"Duration of each note in the trill"}}}},{"if":{"properties":{"type":{"const":"mordent"}}},"then":{"properties":{"by":{"type":"number","default":1,"description":"Interval for the mordent (in scale steps)"}}}},{"if":{"properties":{"type":{"const":"turn"}}},"then":{"properties":{"scale":{"type":"string","description":"Optional scale context for the turn"}}}},{"if":{"properties":{"type":{"const":"arpeggio"}}},"then":{"properties":{"arpeggioDegrees":{"type":"array","items":{"type":"number"},"description":"Scale degrees for the arpeggio"},"direction":{"type":"string","enum":["up","down","both"],"default":"up","description":"Direction of the arpeggio"}},"required":["arpeggioDegrees"]}}]}},"additionalProperties":false}},"microtuning":{"type":"number","description":"Microtuning adjustment in semitones."},"channel":{"type":"integer","minimum":0,"maximum":15,"description":"Override sequence MIDI channel for this note (0-15)."},"modulations":{"type":"array","description":"Per-note modulation events (CC, pitch bend, aftertouch).","items":{"type":"object","required":["type","value","time"],"properties":{"type":{"type":"string","enum":["cc","pitchBend","aftertouch"],"description":"Type of MIDI modulation event."},"controller":{"type":"integer","description":"MIDI CC number (required for type: 'cc')."},"value":{"type":"number","description":"Value for this modulation: 0-127 for CC, -8192 to +8192 for pitchBend (14-bit, maps to ±2 semitones), 0-127 for aftertouch."},"time":{"oneOf":[{"type":"string","pattern":"^(\\\\d+n|\\\\d+t|\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+)$","description":"Relative time using note values (e.g., '8n') or bars:beats:ticks (e.g., '0:0:240')."},{"type":"number","description":"Legacy: Relative time in seconds (deprecated)."}],"description":"When this modulation event happens (relative to note start)."}},"additionalProperties":false}}},"additionalProperties":false}},"loop":{"oneOf":[{"type":"boolean"},{"type":"string"}],"description":"Whether this sequence loops, or string for musical duration."},"loopEnd":{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format to end the loop (e.g., '4:0:0')."},"effects":{"type":"array","description":"Sequence-level effects.","items":{"type":"object","required":["type"],"properties":{"type":{"type":"string","description":"Type of effect (e.g., 'Reverb', 'Delay')."},"options":{"type":"object","description":"Options for this effect."},"presetRef":{"type":"string","description":"Reference to a custom preset."}},"additionalProperties":false}},"automation":{"type":"array","description":"Sequence-level automation channels affecting only this sequence.","items":{"$ref":"#/definitions/automationChannel"}}},"additionalProperties":false}},"automation":{"type":"object","description":"Multi-level automation system with interpolation support.","properties":{"enabled":{"type":"boolean","default":true,"description":"Whether automation is enabled globally."},"global":{"type":"array","description":"Global automation channels affecting the entire composition.","items":{"$ref":"#/definitions/automationChannel"}},"tracks":{"type":"object","description":"Sequence-level automation channels organized by sequence ID.","patternProperties":{".*":{"type":"array","description":"Automation channels for this sequence.","items":{"$ref":"#/definitions/automationChannel"}}},"additionalProperties":false},"events":{"type":"array","description":"Legacy automation events (deprecated, use channels instead).","items":{"type":"object","required":["target","time","value"],"properties":{"target":{"type":"string","description":"Parameter to automate, e.g., 'synth.frequency', 'effect.mix', 'midi.cc1'."},"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}]},"value":{"type":"number","description":"Target value for the parameter."}},"additionalProperties":false}}},"additionalProperties":false},"annotations":{"type":"array","description":"Annotations (e.g., lyrics, rehearsal marks, comments) in the composition.","items":{"type":"object","required":["text","time"],"properties":{"text":{"type":"string","description":"Annotation text (e.g., lyric, instruction, label)."},"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '1:2:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}]},"type":{"type":"string","description":"Type of annotation (e.g., 'lyric', 'marker', 'comment', 'rehearsal')."},"duration":{"oneOf":[{"type":"string","pattern":"^(\\\\d+n|\\\\d+t|\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+)$","description":"Musical duration using note values (e.g., '4n') or bars:beats:ticks (e.g., '1:0:0')."},{"type":"number","description":"Legacy: Duration in seconds (deprecated)."}],"description":"Optional duration for annotation (e.g., for lyrics or extended comments)."}},"additionalProperties":false}},"timeSignatureMap":{"type":"array","description":"Map of time signature changes over time.","items":{"type":"object","required":["time","timeSignature"],"properties":{"time":{"oneOf":[{"type":"string","pattern":"^\\\\d+:\\\\d+(\\\\.\\\\d+)?:\\\\d+$","description":"Musical time in bars:beats:ticks format (e.g., '8:0:0')."},{"type":"number","description":"Legacy: Time in beats (deprecated)."}],"description":"Time of the time signature change."},"timeSignature":{"type":"string","pattern":"^\\\\d+/\\\\d+$","description":"New time signature at this time."}},"additionalProperties":false}},"synthConfig":{"type":"object","description":"Global synthesizer configuration that applies to all tracks unless overridden.","properties":{"type":{"type":"string","enum":["Synth","PolySynth","MonoSynth","AMSynth","FMSynth","DuoSynth","PluckSynth","NoiseSynth","Sampler"],"description":"Default synthesizer type (Synth, Sampler, AMSynth, FMSynth, etc.)."},"modulationTarget":{"type":"string","enum":["vibrato","tremolo","glissando","filter"],"description":"Default target for modulation wheel (CC1) control across all tracks."},"options":{"type":"object","description":"Default synthesizer options applied globally.","properties":{"envelope":{"type":"object","description":"Automatic envelope settings for Samplers to avoid abrupt cuts","properties":{"enabled":{"type":"boolean","default":true,"description":"Whether to apply automatic envelope to Samplers"},"attack":{"type":"number","minimum":0,"maximum":2,"default":0.02,"description":"Attack time in seconds"},"decay":{"type":"number","minimum":0,"maximum":2,"default":0.1,"description":"Decay time in seconds"},"sustain":{"type":"number","minimum":0,"maximum":1,"default":0.8,"description":"Sustain level (0-1)"},"release":{"type":"number","minimum":0,"maximum":5,"default":0.3,"description":"Release time in seconds"}},"additionalProperties":false}}}},"additionalProperties":false},"converterHints":{"type":"object","description":"Optional hints to guide specific converters.","properties":{"tone":{"type":"object","description":"Hints for jmon-tone.js converter.","patternProperties":{"^cc[0-9]+$":{"type":"object","description":"Hint configuration for a MIDI CC controller mapping.","properties":{"target":{"type":"string","description":"Target for this CC mapping - can be legacy target (filter, vibrato, tremolo, glissando) or specific effect node ID from audioGraph."},"parameter":{"type":"string","description":"Parameter name to control on the target effect (e.g., 'frequency', 'depth', 'Q')."},"frequency":{"type":"number","description":"Modulation rate in Hz (for vibrato/tremolo)."},"depthRange":{"type":"array","description":"Min/max depth or frequency range for the parameter.","items":{"type":"number"},"minItems":2,"maxItems":2}},"required":["target"],"additionalProperties":false}},"additionalProperties":false},"midi":{"type":"object","description":"Hints for jmon-midi.js converter.","properties":{"channel":{"type":"integer","minimum":0,"maximum":15,"description":"Default MIDI channel for outgoing messages."},"port":{"type":"string","description":"MIDI port name or identifier."}},"additionalProperties":false}},"additionalProperties":false}}`), Qo = { automationChannel: { type: "object", description: "Automation channel with interpolation support and anchor points.", required: ["id", "target", "anchorPoints"], properties: { id: { type: "string", description: "Unique identifier for this automation channel." }, name: { type: "string", description: "Human-readable name for this automation channel." }, target: { type: "string", description: "JMON target parameter (e.g., 'synth.frequency', 'midi.cc1', 'effect.mix')." }, level: { type: "string", enum: ["global", "sequence", "note"], default: "global", description: "Automation level: global (entire composition), sequence (per track), or note (per note velocity)." }, sequenceId: { type: "string", description: "Target sequence ID for sequence-level automation." }, range: { type: "array", items: { type: "number" }, minItems: 2, maxItems: 2, default: [0, 127], description: "Value range [min, max] for this automation parameter." }, interpolation: { type: "string", enum: ["linear", "quadratic", "cubic", "daw"], default: "daw", description: "Interpolation type: linear, quadratic (curve), cubic (smoothstep), or daw (Hermite splines)." }, enabled: { type: "boolean", default: !0, description: "Whether this automation channel is enabled." }, anchorPoints: { type: "array", description: "Automation anchor points defining the curve.", items: { type: "object", required: ["time", "value"], properties: { time: { oneOf: [{ type: "string", pattern: "^\\d+:\\d+(\\.\\d+)?:\\d+$", description: "Musical time in bars:beats:ticks format (e.g., '2:1:240')." }, { type: "number", description: "Time in measures (e.g., 2.5 = 2 bars + 2 beats in 4/4)." }] }, value: { type: "number", description: "Automation value at this time point." }, tangent: { type: "number", description: "Optional tangent/slope for Hermite interpolation (DAW mode)." } }, additionalProperties: !1 } } }, additionalProperties: !1 } }, Xo = !1, Zo = {
  $schema: Uo,
  title: Ko,
  description: Jo,
  type: Ho,
  required: Yo,
  properties: Wo,
  definitions: Qo,
  additionalProperties: Xo
};
function es(o) {
  const e = typeof o == "string" ? parseInt(o, 10) : o;
  if (!Number.isFinite(e)) return String(o);
  const r = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][(e % 12 + 12) % 12], n = Math.floor(e / 12) - 1;
  return `${r}${n}`;
}
function ai(o) {
  return !o || !Array.isArray(o.audioGraph) || o.audioGraph.forEach((e) => {
    try {
      if (!e || e.type !== "Sampler") return;
      const t = e.options || {}, r = t.urls;
      if (!r || typeof r != "object") return;
      const n = {};
      Object.keys(r).forEach((i) => {
        const s = String(i);
        let a = s;
        /^\d+$/.test(s) && (a = es(parseInt(s, 10))), n[a] = r[i];
      }), e.options = { ...t, urls: n };
    } catch {
    }
  }), o;
}
class rr {
  constructor(e = Zo) {
    this.ajv = new Bo({ allErrors: !0, useDefaults: !0 }), this.validate = this.ajv.compile(e);
  }
  /**
   * Valide et normalise un objet JMON.
   * @param {Object} jmonObj - L'objet JMON à valider.
   * @returns {Object} { valid, errors, normalized }
   */
  validateAndNormalize(e) {
    const t = JSON.parse(JSON.stringify(e));
    ai(t);
    const r = this.validate(t);
    return {
      valid: r,
      errors: this.validate.errors || null,
      normalized: r ? t : null
    };
  }
  /**
   * Utilitaire pour obtenir une version toujours "propre" (valide ou corrigée)
   * @param {Object} jmonObj
   * @returns {Object} normalized JMON (ou null si non réparable)
   */
  getValidJmon(e) {
    const { valid: t, normalized: r } = this.validateAndNormalize(e);
    return t ? r : null;
  }
}
class be {
  static chromatic_scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  static flat_to_sharp = {
    Bb: "A#",
    Db: "C#",
    Eb: "D#",
    Gb: "F#",
    Ab: "G#",
    "B♭": "A#",
    "D♭": "C#",
    "E♭": "D#",
    "G♭": "F#",
    "A♭": "G#",
    "B-": "A#",
    "D-": "C#",
    "E-": "D#",
    "G-": "F#",
    "A-": "G#"
  };
  static scale_intervals = {
    major: [0, 2, 4, 5, 7, 9, 11],
    // Ionian
    minor: [0, 2, 3, 5, 7, 8, 10],
    // Aeolian
    diminished: [0, 2, 3, 5, 6, 8, 9, 11],
    "major pentatonic": [0, 2, 4, 7, 9],
    "minor pentatonic": [0, 3, 5, 7, 10],
    chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    lydian: [0, 2, 4, 6, 7, 9, 11],
    mixolydian: [0, 2, 4, 5, 7, 9, 10],
    dorian: [0, 2, 3, 5, 7, 9, 10],
    phrygian: [0, 1, 3, 5, 7, 8, 10],
    locrian: [0, 1, 3, 5, 6, 8, 10],
    "harmonic minor": [0, 2, 3, 5, 7, 8, 11],
    "melodic minor ascending": [0, 2, 3, 5, 7, 9, 11],
    "melodic minor descending": [0, 2, 3, 5, 7, 8, 10]
    // same as natural minor
  };
  static intervals = {
    P1: 0,
    m2: 1,
    M2: 2,
    m3: 3,
    M3: 4,
    P4: 5,
    P5: 7,
    m6: 8,
    M6: 9,
    m7: 10,
    M7: 11,
    P8: 12
  };
  /**
   * Convert flat notes to their equivalent sharp notes
   * @param {string} note - The note to convert
   * @returns {string} The converted note or original if no conversion needed
   */
  static convertFlatToSharp(e) {
    return this.flat_to_sharp[e] || e;
  }
  /**
   * Convert note name with octave to MIDI number
   * @param {string} noteName - Note name with octave (e.g. 'C4', 'F#5', 'Bb3')
   * @returns {number} MIDI note number
   */
  static noteNameToMidi(e) {
    const t = e.match(/^([A-G][#b♭-]?)(-?\d+)$/);
    if (!t)
      throw new Error(`Invalid note name format: ${e}`);
    const [, r, n] = t, i = this.convertFlatToSharp(r), s = this.chromatic_scale.indexOf(i);
    if (s === -1)
      throw new Error(`Invalid note name: ${r}`);
    return s + (parseInt(n) + 1) * 12;
  }
  /**
   * Convert MIDI number to note name
   * @param {number} midiNumber - MIDI note number
   * @param {boolean} [preferFlat=false] - Whether to prefer flat notation
   * @returns {string} Note name with octave (e.g. 'C4', 'F#5')
   */
  static midiToNoteName(e, t = !1) {
    const r = Math.floor(e / 12) - 1, n = e % 12;
    return `${this.chromatic_scale[n]}${r}`;
  }
  /**
   * Returns the intervals for a triad based on the given scale intervals
   * @param {Array} scale - Scale intervals
   * @returns {Array} Triad intervals [root, third, fifth]
   */
  static scaleToTriad(e) {
    return [e[0], e[2], e[4]];
  }
}
class ci {
  /**
   * Create a Scale
   * @param {string} tonic - The tonic note of the scale
   * @param {string} mode - The type of scale
   */
  constructor(e, t = "major") {
    const r = be.convertFlatToSharp(e);
    if (!be.chromatic_scale.includes(r))
      throw new Error(`'${e}' is not a valid tonic note. Select one among '${be.chromatic_scale.join(", ")}'.`);
    if (this.tonic = r, !Object.keys(be.scale_intervals).includes(t))
      throw new Error(`'${t}' is not a valid scale. Select one among '${Object.keys(be.scale_intervals).join(", ")}'.`);
    this.mode = t;
  }
  /**
  * Generate a scale with flexible start/end points
  * @param {Object} options - Configuration object
  * @param {number|string} [options.start] - Starting MIDI note number or note name (e.g. 'C4')
  * @param {number|string} [options.end] - Ending MIDI note number or note name
  * @param {number} [options.length] - Number of notes to generate
  * @returns {Array} Array of MIDI note numbers representing the scale
  */
  generate(e = {}) {
    const t = be.scale_intervals[this.mode];
    if (!t)
      return console.warn(`Unknown scale mode: ${this.mode}`), [];
    typeof e.start == "string" && (e.start = be.noteNameToMidi(e.start)), typeof e.end == "string" && (e.end = be.noteNameToMidi(e.end));
    const r = e.start ?? 60;
    if (be.chromatic_scale.indexOf(this.tonic) === -1)
      return console.warn(`Unknown tonic: ${this.tonic}`), [];
    const i = (a, c) => {
      const l = c % t.length, d = Math.floor(c / t.length) * 12, g = t[l];
      return a + g + d;
    }, s = [];
    if (e.end !== void 0)
      for (let a = 0; ; a++) {
        const c = i(r, a);
        if (c > e.end) break;
        s.push(c);
      }
    else if (e.length)
      for (let a = 0; a < e.length; a++)
        s.push(i(r, a));
    else
      return t.map((a) => r + a);
    return s;
  }
  /**
   * Get the note names of the scale
   * @returns {Array} Array of note names in the scale
   */
  getNoteNames() {
    const e = be.scale_intervals[this.mode];
    if (!e) return [];
    const t = be.chromatic_scale.indexOf(this.tonic);
    return t === -1 ? [] : e.map((r) => {
      const n = (t + r) % 12;
      return be.chromatic_scale[n];
    });
  }
  /**
   * Check if a given pitch is in the scale
   * @param {number} pitch - MIDI note number
   * @returns {boolean} True if the pitch class is in the scale
   */
  isInScale(e) {
    const t = e % 12;
    return this.generate().map((n) => n % 12).includes(t);
  }
}
function ts(o) {
  if (typeof o == "object" && !Array.isArray(o))
    return o;
  if (Array.isArray(o)) {
    if (o.length === 0)
      return {};
    if (o.every((t) => Array.isArray(t) && t.length === 3))
      return { "track 1": o };
    const e = {};
    return o.forEach((t, r) => {
      e[`track ${r + 1}`] = t;
    }), e;
  }
  throw new Error("Input must be a list or dict of tracks.");
}
function li(o, e) {
  return e.reduce(
    (t, r) => Math.abs(r - o) < Math.abs(t - o) ? r : t
  );
}
function ui(o) {
  return Math.floor(o / 12) - 1;
}
function rs(o) {
  return {
    "D-": "C#",
    "E-": "D#",
    "G-": "F#",
    "A-": "G#",
    "B-": "A#",
    Db: "C#",
    Eb: "D#",
    Gb: "F#",
    Ab: "G#",
    Bb: "A#"
  }[o] || o;
}
function _r(o, e, t) {
  typeof o == "string" && (o = it(o)), typeof t == "string" && (t = it(t));
  const r = e.indexOf(t);
  if (e.includes(o))
    return e.indexOf(o) - r;
  {
    const n = li(o, e), i = e.indexOf(n), s = i > 0 ? i - 1 : i, a = e[s], c = n - o, l = o - a, d = c + l;
    if (d === 0) return i - r;
    const g = 1 - c / d, _ = 1 - l / d, b = i - r, $ = s - r;
    return b * g + $ * _;
  }
}
function ns(o, e, t) {
  const r = e.indexOf(t), n = Math.round(r + o);
  if (n >= 0 && n < e.length)
    return e[n];
  {
    const i = Math.max(0, Math.min(n, e.length - 1)), s = Math.min(e.length - 1, Math.max(n, 0)), a = e[i], c = e[s], l = s - n, d = n - i, g = l + d;
    if (g === 0)
      return (c + a) / 2;
    const _ = 1 - l / g, b = 1 - d / g;
    return c * _ + a * b;
  }
}
function di(o) {
  o.length > 0 && o[0].length === 2 && (o = o.map((r) => [r[0], r[1], 0]));
  const e = [];
  let t = 0;
  for (const [r, n, i] of o)
    e.push([r, n, t]), t += n;
  return e;
}
function hi(o, e = 0) {
  const t = [...o].sort((i, s) => i[2] - s[2]);
  let r = 0;
  const n = [];
  for (const i of t) {
    const [s, a, c] = i, l = e + c;
    if (l > r) {
      const g = [null, l - r, r - e];
      n.push(g);
    }
    n.push(i), r = Math.max(r, l + a);
  }
  return n;
}
function fi(o) {
  o.sort((e, t) => e[2] - t[2]);
  for (let e = 0; e < o.length - 1; e++) {
    const t = o[e], r = o[e + 1];
    if (t[2] + t[1] > r[2]) {
      const i = r[2] - t[2];
      o[e] = [t[0], i, t[2]];
    }
  }
  return o;
}
function is(o) {
  return fi(hi(o));
}
function it(o) {
  const e = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], t = {
    Db: "C#",
    Eb: "D#",
    Gb: "F#",
    Ab: "G#",
    Bb: "A#",
    Cb: "B"
  };
  let r = 4, n = o;
  if (o.includes("b")) {
    const a = o.slice(0, -1);
    t[a] && (n = t[a] + o.slice(-1));
  }
  let i;
  return n.length > 2 || n.length === 2 && !isNaN(n[1]) ? (i = n.slice(0, -1), r = parseInt(n.slice(-1))) : i = n[0], 12 * (r + 1) + e.indexOf(i);
}
function os(o) {
  const e = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], t = Math.floor(o / 12) - 1, r = o % 12;
  return e[r] + t.toString();
}
function ss(o, e = "offsets") {
  const t = [];
  let r = 0;
  for (const [n, i, s] of o)
    t.push([n, i, r]), r += i;
  return t;
}
function as(o) {
  return o.every((e) => Array.isArray(e)) ? "list of tuples" : o.every((e) => !Array.isArray(e)) ? "list" : "unknown";
}
function cs(o, e, t, r = null, n = null) {
  const i = r !== null ? r : Math.min(...o), s = n !== null ? n : Math.max(...o);
  return i === s ? new Array(o.length).fill((e + t) / 2) : o.map(
    (a) => (a - i) * (t - e) / (s - i) + e
  );
}
function pi(o, e) {
  return o.map(([t, r, n]) => [t, r, n + e]);
}
function ls(o, e, t) {
  const r = [];
  for (const [n, i, s] of o) {
    const a = Math.round(s / t) * t, c = (Math.floor(a / e) + 1) * e;
    let l = Math.round(i / t) * t;
    l = Math.min(l, c - a), l > 0 && r.push([n, l, a]);
  }
  return r;
}
function us(o, e) {
  const r = o.filter(([a, , c]) => a !== null && c !== null).sort((a, c) => a[2] - c[2]), n = Math.max(...r.map(([, , a]) => a)), i = Math.floor(n / e) + 1, s = [];
  for (let a = 0; a < i; a++) {
    const c = a * e;
    let l = null, d = 1 / 0;
    for (const [g, , _] of r) {
      const b = c - _;
      if (b >= 0 && b < d && (d = b, l = g), _ > c) break;
    }
    l !== null && s.push(l);
  }
  return s;
}
function ds(o, e) {
  return e.reduce(
    (t, r) => Math.abs(r - o) < Math.abs(t - o) ? r : t
  );
}
function hs(o, e) {
  return 60 / e * o;
}
function* fs(o = 0, e = 1, t = 0, r = 1) {
  for (; ; )
    yield t + r * o, [o, e] = [e, o + e];
}
function ps(o, e, t) {
  const r = {};
  for (const [n, i] of Object.entries(o)) {
    const s = [];
    for (let a = 0; a < e; a++) {
      const c = a * t, l = pi(i, c);
      s.push(...l);
    }
    r[n] = s;
  }
  return r;
}
const ms = {
  "Acoustic Grand Piano": 0,
  "Bright Acoustic Piano": 1,
  "Electric Grand Piano": 2,
  "Honky-tonk Piano": 3,
  "Electric Piano 1": 4,
  "Electric Piano 2": 5,
  Harpsichord: 6,
  Clavinet: 7,
  // ... (full mapping truncated for brevity, but would include all 128 instruments)
  Gunshot: 127
}, gs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  adjustNoteDurationsToPreventOverlaps: fi,
  cdeToMidi: it,
  checkInput: as,
  fibonacci: fs,
  fillGapsWithRests: hi,
  findClosestPitchAtMeasureStart: us,
  getDegreeFromPitch: _r,
  getOctave: ui,
  getPitchFromDegree: ns,
  getSharp: rs,
  instrumentMapping: ms,
  midiToCde: os,
  noOverlap: ss,
  offsetTrack: pi,
  qlToSeconds: hs,
  quantizeNotes: ls,
  repairNotes: is,
  repeatPolyloops: ps,
  roundToList: li,
  scaleList: cs,
  setOffsetsAccordingToDurations: di,
  tracksToDict: ts,
  tune: ds
}, Symbol.toStringTag, { value: "Module" }));
class ys extends be {
  /**
   * Initialize a Progression object
   * @param {string} tonicPitch - The tonic pitch of the progression (default: 'C4')
   * @param {string} circleOf - The interval to form the circle (default: 'P5')
   * @param {string} type - The type of progression ('chords' or 'pitches')
   * @param {Array} radius - Range for major, minor, and diminished chords [3, 3, 1]
   * @param {Array} weights - Weights for selecting chord types
   */
  constructor(e = "C4", t = "P5", r = "chords", n = [3, 3, 1], i = null) {
    if (super(), this.tonicMidi = it(e), this.circleOf = t, this.type = r, this.radius = n, this.weights = i || n, !Object.keys(this.intervals).includes(this.circleOf))
      throw new Error(`Select a circleOf among ${Object.keys(this.intervals).join(", ")}.`);
    if (!["chords", "pitches"].includes(this.type))
      throw new Error("Type must either be 'pitches' or 'chords'.");
  }
  /**
   * Compute chords based on the circle of fifths, thirds, etc., within the specified radius
   * @returns {Object} Object containing major, minor, and diminished chord roots
   */
  computeCircle() {
    const e = this.intervals[this.circleOf], t = [this.tonicMidi];
    for (let r = 0; r < Math.max(...this.radius); r++) {
      const n = (t[t.length - 1] + e) % 12 + Math.floor(t[t.length - 1] / 12) * 12;
      t.push(n);
    }
    return {
      major: t.slice(0, this.radius[0]),
      minor: t.slice(0, this.radius[1]),
      diminished: t.slice(0, this.radius[2])
    };
  }
  /**
   * Generate a chord based on root MIDI note and chord type
   * @param {number} rootNoteMidi - The root MIDI note of the chord
   * @param {string} chordType - The type of chord ('major', 'minor', 'diminished')
   * @returns {Array} Array of MIDI notes representing the chord
   */
  generateChord(e, t) {
    return ({
      major: [0, 4, 7],
      minor: [0, 3, 7],
      diminished: [0, 3, 6]
    }[t] || [0, 4, 7]).map((s) => e + s).map((s) => s > 127 ? s - 12 : s);
  }
  /**
   * Generate a musical progression
   * @param {number} length - The length of the progression in number of chords (default: 4)
   * @param {number} seed - The seed value for the random number generator
   * @returns {Array} Array of chord arrays representing the progression
   */
  generate(e = 4, t = null) {
    t !== null && (Math.seedrandom = t);
    const { major: r, minor: n, diminished: i } = this.computeCircle(), s = [r, n, i], a = ["major", "minor", "diminished"], c = [];
    for (let l = 0; l < e; l++) {
      const d = this.weightedRandomChoice(this.weights);
      if (s[d].length > 0) {
        const g = s[d][Math.floor(Math.random() * s[d].length)], _ = a[d], b = Array.isArray(g) ? g[0] : g, $ = this.generateChord(b, _);
        c.push($);
      }
    }
    return c;
  }
  /**
   * Weighted random choice helper
   * @param {Array} weights - Array of weights
   * @returns {number} Selected index
   */
  weightedRandomChoice(e) {
    const t = e.reduce((n, i) => n + i, 0);
    let r = Math.random() * t;
    for (let n = 0; n < e.length; n++)
      if (r -= e[n], r <= 0)
        return n;
    return e.length - 1;
  }
}
class vs extends be {
  /**
   * Constructs all the necessary attributes for the voice object
   * @param {string} mode - The type of the scale (default: 'major')
   * @param {string} tonic - The tonic note of the scale (default: 'C')
   * @param {Array} degrees - Relative degrees for chord formation (default: [0, 2, 4])
   */
  constructor(e = "major", t = "C", r = [0, 2, 4]) {
    super(), this.tonic = t, this.scale = new ci(t, e).generate(), this.degrees = r;
  }
  /**
   * Convert a MIDI note to a chord based on the scale using the specified degrees
   * @param {number} pitch - The MIDI note to convert
   * @returns {Array} Array of MIDI notes representing the chord
   */
  pitchToChord(e) {
    const t = ui(e), r = this.tonic + t.toString(), n = it(r), i = this.scale.map((c) => _r(c, this.scale, n)), s = Math.round(_r(e, this.scale, n)), a = [];
    for (const c of this.degrees) {
      const l = s + c, d = i.indexOf(l);
      d !== -1 && a.push(this.scale[d]);
    }
    return a;
  }
  /**
   * Generate chords or arpeggios based on the given notes
   * @param {Array} notes - The notes to generate chords or arpeggios from
   * @param {Array} durations - The durations of each note (optional)
   * @param {boolean} arpeggios - If true, generate arpeggios instead of chords (default: false)
   * @returns {Array} The generated chords or arpeggios
   */
  generate(e, t = null, r = !1) {
    if (!Array.isArray(e) || e.length === 0)
      return [];
    let n = e;
    if (typeof e[0] == "number") {
      t === null && (t = [1]);
      let s = 0, a = 0;
      n = e.map((c) => {
        const l = t[s % t.length], d = [c, l, a];
        return a += l, s++, d;
      });
    }
    const i = n.map(([s, a, c]) => [this.pitchToChord(s), a, c]);
    if (r) {
      const s = [];
      for (const [a, c, l] of i) {
        const d = c / a.length;
        a.forEach((g, _) => {
          s.push([g, d, l + _ * d]);
        });
      }
      return s;
    } else
      return i;
  }
}
const Xn = {
  grace_note: {
    requiredParams: ["graceNoteType"],
    optionalParams: ["gracePitches"],
    conflicts: [],
    description: "Single note before the main note",
    defaultParams: {
      graceNoteType: "acciaccatura"
    },
    validate: (o, e) => ["acciaccatura", "appoggiatura"].includes(e.graceNoteType) ? e.gracePitches && !Array.isArray(e.gracePitches) ? { valid: !1, error: "gracePitches must be an array of pitches" } : { valid: !0 } : { valid: !1, error: "graceNoteType must be either acciaccatura or appoggiatura" }
  },
  trill: {
    requiredParams: [],
    optionalParams: ["by", "trillRate"],
    conflicts: ["mordent"],
    minDuration: "8n",
    description: "Rapid alternation between main note and auxiliary note",
    defaultParams: {
      by: 1,
      trillRate: 0.125
    },
    validate: (o, e) => e.by && typeof e.by != "number" ? { valid: !1, error: "trill step (by) must be a number" } : e.trillRate && typeof e.trillRate != "number" ? { valid: !1, error: "trillRate must be a number" } : { valid: !0 }
  },
  mordent: {
    requiredParams: [],
    optionalParams: ["by"],
    conflicts: ["trill"],
    description: "Quick alternation with note above or below",
    defaultParams: {
      by: 1
    },
    validate: (o, e) => e.by && typeof e.by != "number" ? { valid: !1, error: "mordent step (by) must be a number" } : { valid: !0 }
  },
  turn: {
    requiredParams: [],
    optionalParams: ["scale"],
    conflicts: [],
    description: "Melodic turn around the main note",
    validate: (o, e) => e.scale && typeof e.scale != "string" ? { valid: !1, error: "scale must be a string" } : { valid: !0 }
  },
  arpeggio: {
    requiredParams: ["arpeggioDegrees"],
    optionalParams: ["direction"],
    conflicts: [],
    description: "Notes played in sequence",
    defaultParams: {
      direction: "up"
    },
    validate: (o, e) => Array.isArray(e.arpeggioDegrees) ? e.direction && !["up", "down", "both"].includes(e.direction) ? { valid: !1, error: "direction must be up, down, or both" } : { valid: !0 } : { valid: !1, error: "arpeggioDegrees must be an array" }
  }
};
class Er {
  /**
   * Validate ornament parameters and compatibility
   * @param {Object} note - The note to apply the ornament to
   * @param {string} type - The type of ornament
   * @param {Object} params - Parameters for the ornament
   * @returns {Object} Validation result with success status and any messages
   */
  static validateOrnament(e, t, r = {}) {
    const n = {
      valid: !1,
      warnings: [],
      errors: []
    }, i = Xn[t];
    if (!i)
      return n.errors.push(`Unknown ornament type: ${t}`), n;
    if (i.requiredParams) {
      for (const s of i.requiredParams)
        if (!(s in r))
          return n.errors.push(`Missing required parameter '${s}' for ${t}`), n;
    }
    if (i.minDuration && n.warnings.push(`Duration check not implemented for ${t}`), e.ornaments && i.conflicts) {
      const s = e.ornaments.filter((a) => i.conflicts.includes(a.type)).map((a) => a.type);
      if (s.length > 0)
        return n.errors.push(`${t} conflicts with existing ornaments: ${s.join(", ")}`), n;
    }
    if (i.validate) {
      const s = i.validate(e, r);
      if (!s.valid)
        return n.errors.push(s.error), n;
    }
    return n.valid = !0, n;
  }
  /**
   * Create a new ornament instance with validation
   * @param {Object} options - Ornament configuration
   */
  constructor(e) {
    const t = Xn[e.type];
    if (!t)
      throw new Error(`Unknown ornament type: ${e.type}`);
    this.type = e.type, this.params = {
      ...t.defaultParams,
      ...e.parameters
    }, e.tonic && e.mode ? (this.tonicIndex = be.chromatic_scale.indexOf(e.tonic), this.scale = this.generateScale(e.tonic, e.mode)) : this.scale = null;
  }
  /**
   * Generate a scale for pitch-based ornaments
   */
  generateScale(e, t) {
    const r = be.scale_intervals[t], n = be.chromatic_scale.indexOf(e), i = r.map((a) => (n + a) % 12), s = [];
    for (let a = -1; a < 10; a++)
      for (const c of i) {
        const l = 12 * a + c;
        l >= 0 && l <= 127 && s.push(l);
      }
    return s;
  }
  /**
   * Apply the ornament to notes
   */
  apply(e, t = null) {
    if (!Array.isArray(e) || e.length === 0 || (t === null && (t = Math.floor(Math.random() * e.length)), t < 0 || t >= e.length))
      return e;
    const r = e[t], n = Er.validateOrnament(r, this.type, this.params);
    if (!n.valid)
      return console.warn(`Ornament validation failed: ${n.errors.join(", ")}`), e;
    switch (this.type) {
      case "grace_note":
        return this.addGraceNote(e, t);
      case "trill":
        return this.addTrill(e, t);
      case "mordent":
        return this.addMordent(e, t);
      case "turn":
        return this.addTurn(e, t);
      case "arpeggio":
        return this.addArpeggio(e, t);
      default:
        return e;
    }
  }
  /**
   * Add a grace note
   */
  addGraceNote(e, t) {
    const r = e[t], n = r.pitch, i = r.duration, s = r.time, a = this.params.gracePitches ? this.params.gracePitches[Math.floor(Math.random() * this.params.gracePitches.length)] : n + 1;
    if (this.params.graceNoteType === "acciaccatura") {
      const c = i * 0.125, l = { pitch: n, duration: i, time: s + c };
      return [
        ...e.slice(0, t),
        { pitch: a, duration: c, time: s },
        l,
        ...e.slice(t + 1)
      ];
    } else {
      const c = i / 2, l = { pitch: n, duration: c, time: s + c };
      return [
        ...e.slice(0, t),
        { pitch: a, duration: c, time: s },
        l,
        ...e.slice(t + 1)
      ];
    }
  }
  /**
   * Add a trill
   */
  addTrill(e, t) {
    const r = e[t], n = r.pitch, i = r.duration, s = r.time, a = [];
    let c = s;
    const l = this.params.by || 1, d = this.params.trillRate || 0.125;
    let g;
    if (this.scale && this.scale.includes(n)) {
      const b = (this.scale.indexOf(n) + Math.round(l)) % this.scale.length;
      g = this.scale[b];
    } else
      g = n + l;
    for (; c < s + i; ) {
      const _ = s + i - c, b = Math.min(d, _ / 2);
      if (_ >= b * 2)
        a.push({ pitch: n, duration: b, time: c }), a.push({ pitch: g, duration: b, time: c + b }), c += 2 * b;
      else
        break;
    }
    return [
      ...e.slice(0, t),
      ...a,
      ...e.slice(t + 1)
    ];
  }
  /**
   * Add a mordent
   */
  addMordent(e, t) {
    const r = e[t], n = r.pitch, i = r.duration, s = r.time, a = this.params.by || 1;
    let c;
    if (this.scale && this.scale.includes(n)) {
      const _ = this.scale.indexOf(n) + Math.round(a);
      c = this.scale[_] || n + a;
    } else
      c = n + a;
    const l = i / 3, d = [
      { pitch: n, duration: l, time: s },
      { pitch: c, duration: l, time: s + l },
      { pitch: n, duration: l, time: s + 2 * l }
    ];
    return [
      ...e.slice(0, t),
      ...d,
      ...e.slice(t + 1)
    ];
  }
  /**
   * Add a turn
   */
  addTurn(e, t) {
    const r = e[t], n = r.pitch, i = r.duration, s = r.time, a = i / 4;
    let c, l;
    if (this.scale && this.scale.includes(n)) {
      const g = this.scale.indexOf(n);
      c = this.scale[g + 1] || n + 2, l = this.scale[g - 1] || n - 2;
    } else
      c = n + 2, l = n - 2;
    const d = [
      { pitch: n, duration: a, time: s },
      { pitch: c, duration: a, time: s + a },
      { pitch: n, duration: a, time: s + 2 * a },
      { pitch: l, duration: a, time: s + 3 * a }
    ];
    return [
      ...e.slice(0, t),
      ...d,
      ...e.slice(t + 1)
    ];
  }
  /**
   * Add an arpeggio
   */
  addArpeggio(e, t) {
    const r = e[t], n = r.pitch, i = r.duration, s = r.time, { arpeggioDegrees: a, direction: c = "up" } = this.params;
    if (!a || !Array.isArray(a))
      return e;
    const l = [];
    if (this.scale && this.scale.includes(n)) {
      const _ = this.scale.indexOf(n);
      l.push(...a.map((b) => this.scale[_ + b] || n + b));
    } else
      l.push(...a.map((_) => n + _));
    c === "down" && l.reverse(), c === "both" && l.push(...l.slice(0, -1).reverse());
    const d = i / l.length, g = l.map((_, b) => ({
      pitch: _,
      duration: d,
      time: s + b * d
    }));
    return [
      ...e.slice(0, t),
      ...g,
      ...e.slice(t + 1)
    ];
  }
}
const mr = {
  // Simple articulations
  staccato: {
    complex: !1,
    description: "Shortens note duration to ~50%"
  },
  accent: {
    complex: !1,
    description: "Increases note velocity/emphasis"
  },
  tenuto: {
    complex: !1,
    description: "Holds note for full duration with emphasis"
  },
  legato: {
    complex: !1,
    description: "Smooth connection between notes"
  },
  marcato: {
    complex: !1,
    description: "Strong accent with slight separation"
  },
  // Complex articulations
  glissando: {
    complex: !0,
    requiredParams: ["target"],
    description: "Smooth slide from note to target pitch"
  },
  portamento: {
    complex: !0,
    requiredParams: ["target"],
    optionalParams: ["curve", "speed"],
    description: "Expressive slide between pitches"
  },
  bend: {
    complex: !0,
    requiredParams: ["amount"],
    optionalParams: ["curve", "returnToOriginal"],
    description: "Pitch bend up or down in cents"
  },
  vibrato: {
    complex: !0,
    optionalParams: ["rate", "depth", "delay"],
    description: "Periodic pitch variation"
  },
  tremolo: {
    complex: !0,
    optionalParams: ["rate", "depth"],
    description: "Rapid volume variation"
  },
  crescendo: {
    complex: !0,
    requiredParams: ["endVelocity"],
    optionalParams: ["curve"],
    description: "Gradual volume increase"
  },
  diminuendo: {
    complex: !0,
    requiredParams: ["endVelocity"],
    optionalParams: ["curve"],
    description: "Gradual volume decrease"
  }
};
class nr {
  /**
   * Add articulation to a note in a sequence
   * @param {Array} sequence - The note sequence
   * @param {string} articulationType - Type of articulation
   * @param {number} noteIndex - Index of note to articulate
   * @param {Object} params - Parameters for complex articulations
   * @returns {Object} Result with success status and any warnings
   */
  static addArticulation(e, t, r, n = {}) {
    const i = {
      success: !1,
      warnings: [],
      errors: []
    };
    if (!Array.isArray(e))
      return i.errors.push("Sequence must be an array"), i;
    if (r < 0 || r >= e.length)
      return i.errors.push(`Note index ${r} out of bounds (sequence length: ${e.length})`), i;
    const s = mr[t];
    if (!s)
      return i.errors.push(`Unknown articulation type: ${t}`), i;
    const a = e[r];
    return !a || typeof a != "object" ? (i.errors.push(`Invalid note at index ${r}`), i) : s.complex ? this._addComplexArticulation(a, t, s, n, i) : (a.articulation = t, i.success = !0, i);
  }
  /**
   * Add complex articulation with parameter validation and synchronization
   */
  static _addComplexArticulation(e, t, r, n, i) {
    if (r.requiredParams) {
      for (const s of r.requiredParams)
        if (!(s in n))
          return i.errors.push(`Missing required parameter '${s}' for ${t}`), i;
    }
    switch (t) {
      case "glissando":
      case "portamento":
        return this._applyGlissando(e, t, n, i);
      case "bend":
        return this._applyBend(e, n, i);
      case "vibrato":
        return this._applyVibrato(e, n, i);
      case "tremolo":
        return this._applyTremolo(e, n, i);
      case "crescendo":
      case "diminuendo":
        return this._applyDynamicChange(e, t, n, i);
      default:
        return i.errors.push(`Complex articulation ${t} not implemented`), i;
    }
  }
  /**
   * Apply glissando/portamento articulation
   */
  static _applyGlissando(e, t, r, n) {
    e.articulation = t, e.glissTarget = r.target, e.modulations || (e.modulations = []);
    const i = {
      type: "pitch",
      subtype: t,
      target: r.target,
      curve: r.curve || "linear",
      timing: "note_duration"
    };
    return r.speed !== void 0 && (i.speed = r.speed), e.modulations = e.modulations.filter(
      (s) => !(s.type === "pitch" && s.subtype === t)
    ), e.modulations.push(i), n.success = !0, n.warnings.push(`Added ${t} modulation synchronized with articulation`), n;
  }
  /**
   * Apply pitch bend articulation
   */
  static _applyBend(e, t, r) {
    e.articulation = "bend", e.modulations || (e.modulations = []);
    const n = {
      type: "pitch",
      subtype: "bend",
      amount: t.amount,
      // in cents
      curve: t.curve || "linear",
      timing: t.returnToOriginal ? "note_duration" : "sustain",
      returnToOriginal: t.returnToOriginal ?? !0
    };
    return e.modulations = e.modulations.filter(
      (i) => !(i.type === "pitch" && i.subtype === "bend")
    ), e.modulations.push(n), r.success = !0, r.warnings.push("Added pitch bend modulation synchronized with articulation"), r;
  }
  /**
   * Apply vibrato articulation
   */
  static _applyVibrato(e, t, r) {
    e.articulation = "vibrato", e.modulations || (e.modulations = []);
    const n = {
      type: "pitch",
      subtype: "vibrato",
      rate: t.rate || 5,
      // Hz
      depth: t.depth || 50,
      // cents
      delay: t.delay || 0,
      // seconds
      timing: "note_duration"
    };
    return e.modulations = e.modulations.filter(
      (i) => !(i.type === "pitch" && i.subtype === "vibrato")
    ), e.modulations.push(n), r.success = !0, r.warnings.push("Added vibrato modulation synchronized with articulation"), r;
  }
  /**
   * Apply tremolo articulation
   */
  static _applyTremolo(e, t, r) {
    e.articulation = "tremolo", e.modulations || (e.modulations = []);
    const n = {
      type: "amplitude",
      subtype: "tremolo",
      rate: t.rate || 8,
      // Hz
      depth: t.depth || 0.3,
      // 0-1
      timing: "note_duration"
    };
    return e.modulations = e.modulations.filter(
      (i) => !(i.type === "amplitude" && i.subtype === "tremolo")
    ), e.modulations.push(n), r.success = !0, r.warnings.push("Added tremolo modulation synchronized with articulation"), r;
  }
  /**
   * Apply dynamic change (crescendo/diminuendo)
   */
  static _applyDynamicChange(e, t, r, n) {
    e.articulation = t, e.modulations || (e.modulations = []);
    const i = {
      type: "amplitude",
      subtype: t,
      startVelocity: e.velocity || 0.8,
      endVelocity: r.endVelocity,
      curve: r.curve || "linear",
      timing: "note_duration"
    };
    return e.modulations = e.modulations.filter(
      (s) => !(s.type === "amplitude" && (s.subtype === "crescendo" || s.subtype === "diminuendo"))
    ), e.modulations.push(i), n.success = !0, n.warnings.push(`Added ${t} modulation synchronized with articulation`), n;
  }
  /**
   * Remove articulation from a note
   */
  static removeArticulation(e, t) {
    if (!Array.isArray(e) || t < 0 || t >= e.length)
      return { success: !1, error: "Invalid sequence or note index" };
    const r = e[t];
    if (!r || typeof r != "object")
      return { success: !1, error: "Invalid note" };
    const n = r.articulation;
    if (delete r.articulation, delete r.glissTarget, r.modulations && n) {
      const i = mr[n];
      i && i.complex && (r.modulations = r.modulations.filter((s) => s.subtype !== n), r.modulations.length === 0 && delete r.modulations);
    }
    return {
      success: !0,
      removed: n,
      message: `Removed ${n} articulation and related modulations`
    };
  }
  /**
   * Validate articulation consistency in a sequence
   */
  static validateSequence(e) {
    const t = [];
    return e.forEach((r, n) => {
      if (r.articulation) {
        const i = this.ARTICULATION_TYPES[r.articulation];
        if (!i) {
          t.push({
            type: "unknown_articulation",
            noteIndex: n,
            articulation: r.articulation,
            message: `Unknown articulation type: ${r.articulation}`
          });
          return;
        }
        r.articulation === "glissando" && !r.glissTarget && t.push({
          type: "missing_parameter",
          noteIndex: n,
          articulation: r.articulation,
          message: "Glissando missing glissTarget parameter"
        }), i.complex && r.modulations && (r.modulations.some(
          (a) => a.subtype === r.articulation
        ) || t.push({
          type: "modulation_sync",
          noteIndex: n,
          articulation: r.articulation,
          message: `Complex articulation ${r.articulation} should have corresponding modulation`
        }));
      }
    }), {
      valid: t.length === 0,
      issues: t
    };
  }
  /**
   * Get available articulation types with descriptions
   */
  static getAvailableTypes() {
    return Object.entries(mr).map(([e, t]) => ({
      type: e,
      complex: t.complex,
      description: t.description,
      requiredParams: t.requiredParams || [],
      optionalParams: t.optionalParams || []
    }));
  }
}
function mi(o, e, t, r) {
  return nr.addArticulation(o, e, t, r);
}
function gi(o, e) {
  return nr.removeArticulation(o, e);
}
function bs(o) {
  return nr.validateSequence(o);
}
const ws = mi, _s = gi, $s = {
  Scale: ci,
  Progression: ys,
  Voice: vs,
  Ornament: Er,
  Articulation: nr,
  addArticulation: mi,
  addOrnament: ws,
  // Include the alias
  removeArticulation: gi,
  removeOrnament: _s,
  // Include the alias
  validateArticulations: bs
};
class Ss {
  /**
   * Constructs all the necessary attributes for the Rhythm object
   * @param {number} measureLength - The length of the measure
   * @param {Array} durations - The durations of the notes
   */
  constructor(e, t) {
    this.measureLength = e, this.durations = t;
  }
  /**
   * Generate a random rhythm as a list of (duration, offset) tuples
   * @param {number} seed - Random seed for reproducibility
   * @param {number} restProbability - Probability of a rest (0-1)
   * @param {number} maxIter - Maximum number of iterations
   * @returns {Array} Array of [duration, offset] tuples representing the rhythm
   */
  random(e = null, t = 0, r = 100) {
    e !== null && (Math.seedrandom = e);
    const n = [];
    let i = 0, s = 0;
    for (; i < this.measureLength && s < r; ) {
      const a = this.durations[Math.floor(Math.random() * this.durations.length)];
      if (i + a > this.measureLength) {
        s++;
        continue;
      }
      if (Math.random() < t) {
        s++;
        continue;
      }
      n.push([a, i]), i += a, s++;
    }
    return s >= r && console.warn("Max iterations reached. The sum of the durations may not equal the measure length."), n;
  }
  /**
   * Executes the Darwinian evolution algorithm to generate the best rhythm
   * @param {number} seed - Random seed for reproducibility
   * @param {number} populationSize - Number of rhythms in each generation
   * @param {number} maxGenerations - Maximum number of generations
   * @param {number} mutationRate - Probability of mutation (0-1)
   * @returns {Array} The best rhythm found after evolution
   */
  darwin(e = null, t = 10, r = 50, n = 0.1) {
    return new Ps(
      e,
      t,
      this.measureLength,
      r,
      n,
      this.durations
    ).generate();
  }
}
class Ps {
  constructor(e, t, r, n, i, s) {
    e !== null && (Math.seedrandom = e), this.populationSize = t, this.measureLength = r, this.maxGenerations = n, this.mutationRate = i, this.durations = s, this.population = this.initializePopulation();
  }
  /**
   * Initialize a population of random rhythms
   */
  initializePopulation() {
    const e = [];
    for (let t = 0; t < this.populationSize; t++)
      e.push(this.createRandomRhythm());
    return e;
  }
  /**
   * Create a random rhythm ensuring it respects the measure length
   * @returns {Array} Array of [duration, offset] tuples
   */
  createRandomRhythm() {
    const e = [];
    let t = 0;
    for (; t < this.measureLength; ) {
      const r = this.measureLength - t, n = this.durations[Math.floor(Math.random() * this.durations.length)];
      if (n <= r)
        e.push([n, t]), t += n;
      else
        break;
    }
    return e;
  }
  /**
   * Evaluate the fitness of a rhythm
   * @param {Array} rhythm - The rhythm to evaluate
   * @returns {number} Fitness score (lower is better)
   */
  evaluateFitness(e) {
    const t = e.reduce((r, n) => r + n[0], 0);
    return Math.abs(this.measureLength - t);
  }
  /**
   * Select a parent using simple random selection with fitness bias
   * @returns {Array} Selected parent rhythm
   */
  selectParent() {
    const e = this.population[Math.floor(Math.random() * this.population.length)], t = this.population[Math.floor(Math.random() * this.population.length)];
    return this.evaluateFitness(e) < this.evaluateFitness(t) ? e : t;
  }
  /**
   * Perform crossover between two parents
   * @param {Array} parent1 - First parent rhythm
   * @param {Array} parent2 - Second parent rhythm
   * @returns {Array} Child rhythm
   */
  crossover(e, t) {
    if (e.length === 0 || t.length === 0)
      return e.length > 0 ? [...e] : [...t];
    const r = Math.floor(Math.random() * (e.length - 1)) + 1, n = [...e.slice(0, r), ...t.slice(r)];
    return this.ensureMeasureLength(n);
  }
  /**
   * Ensure rhythm respects measure length
   * @param {Array} rhythm - The rhythm to adjust
   * @returns {Array} Adjusted rhythm
   */
  ensureMeasureLength(e) {
    return e.reduce((r, n) => r + n[0], 0) > this.measureLength && e.length > 0 && e.pop(), e;
  }
  /**
   * Mutate a rhythm with certain probability
   * @param {Array} rhythm - The rhythm to mutate
   * @returns {Array} Mutated rhythm
   */
  mutate(e) {
    if (Math.random() < this.mutationRate && e.length > 1) {
      const t = Math.floor(Math.random() * (e.length - 1)), [r, n] = e[t], s = (t === e.length - 1 ? this.measureLength : e[t + 1][1]) - n, a = this.durations.filter((c) => c <= s);
      if (a.length > 0) {
        const c = a[Math.floor(Math.random() * a.length)];
        e[t] = [c, n];
      }
    }
    return e;
  }
  /**
   * Execute the genetic algorithm
   * @returns {Array} Best rhythm found, sorted by offset
   */
  generate() {
    for (let t = 0; t < this.maxGenerations; t++) {
      const r = [];
      for (let n = 0; n < this.populationSize; n++) {
        const i = this.selectParent(), s = this.selectParent();
        let a = this.crossover(i, s);
        a = this.mutate(a), a.sort((c, l) => c[1] - l[1]), r.push(a);
      }
      this.population = r;
    }
    return this.population.reduce(
      (t, r) => this.evaluateFitness(r) < this.evaluateFitness(t) ? r : t
    ).sort((t, r) => t[1] - r[1]);
  }
}
function je(o, e = 4, t = 480) {
  const r = Math.floor(o / e), n = o - r * e, i = Math.floor(n), s = n - i, a = Math.round(s * t);
  return `${r}:${i}:${a}`;
}
function Qe(o, e = 4, t = 480) {
  if (typeof o == "number") return o;
  if (typeof o != "string") return 0;
  const r = o.split(":").map((a) => parseFloat(a || "0")), [n = 0, i = 0, s = 0] = r;
  return n * e + i + s / t;
}
function yi(o, e = "Untitled Part", t = {}) {
  const r = Tr(o);
  return {
    name: e,
    notes: r,
    ...t
  };
}
function Es(o, e = {}) {
  const t = o.map((n, i) => Array.isArray(n) ? yi(n, `Track ${i + 1}`) : n.name && n.notes ? {
    ...n,
    notes: Tr(n.notes)
  } : n), r = {
    format: "jmon",
    version: "1.0",
    bpm: e.bpm || 120,
    keySignature: e.keySignature || "C",
    timeSignature: e.timeSignature || "4/4",
    tracks: t,
    ...e
  };
  return delete r.metadata?.bpm, delete r.metadata?.keySignature, delete r.metadata?.timeSignature, r;
}
function Tr(o) {
  return Array.isArray(o) ? o.map((e, t) => {
    if (Array.isArray(e)) {
      const [r, n, i = 0] = e;
      return {
        pitch: r,
        duration: n,
        time: je(i)
      };
    }
    if (typeof e == "object" && e !== null) {
      const { pitch: r, duration: n } = e;
      let i = "0:0:0";
      return typeof e.time == "string" ? i = e.time : typeof e.time == "number" ? i = je(e.time) : typeof e.offset == "number" && (i = je(e.offset)), {
        pitch: r,
        duration: n,
        time: i,
        // Preserve other properties
        ...Object.fromEntries(
          Object.entries(e).filter(
            ([s]) => !["time", "offset"].includes(s)
          )
        )
      };
    }
    return console.warn(`Unexpected note format at index ${t}:`, e), {
      pitch: 60,
      // Default to middle C
      duration: 1,
      time: "0:0:0"
    };
  }) : [];
}
function Ts(o) {
  return o.map(([e, t, r = 0]) => ({
    pitch: e,
    duration: t,
    time: je(r)
  }));
}
function Ms(o) {
  return o.map((e) => [
    e.pitch,
    e.duration,
    Qe(e.time)
  ]);
}
function ks(o, e = 1, t = 0) {
  let r = t;
  return o.map((n) => {
    const i = {
      pitch: n,
      duration: e,
      time: je(r)
    };
    return r += e, i;
  });
}
function vi(o, e) {
  return o.map((t) => ({
    ...t,
    time: je(Qe(t.time) + e)
  }));
}
function xs(o) {
  if (o.length === 0) return [];
  const e = [];
  let t = 0;
  for (const r of o) {
    const n = vi(r, t);
    e.push(...n);
    const i = n.map(
      (s) => Qe(s.time) + s.duration
    );
    t = Math.max(...i, t);
  }
  return e;
}
function As(o) {
  return o.flat();
}
function Ns(o) {
  if (o.length === 0) return { start: 0, end: 0, duration: 0 };
  const e = o.map((i) => Qe(i.time)), t = o.map((i) => Qe(i.time) + i.duration), r = Math.min(...e), n = Math.max(...t);
  return {
    start: r,
    end: n,
    duration: n - r,
    startTime: je(r),
    endTime: je(n)
  };
}
const Rs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  beatsToTime: je,
  combineSequences: As,
  concatenateSequences: xs,
  createComposition: Es,
  createPart: yi,
  createScale: ks,
  getTimingInfo: Ns,
  jmonToTuples: Ms,
  normalizeNotes: Tr,
  offsetNotes: vi,
  timeToBeats: Qe,
  tuplesToJmon: Ts
}, Symbol.toStringTag, { value: "Module" }));
function Cs(o, e, t = {}) {
  const r = o.map((l) => Array.isArray(l) || typeof l == "object" && l.length ? l[0] : l), n = js(r.length, e.length), i = [], s = [];
  for (let l = 0; l < n; l++)
    i.push(r[l % r.length]), s.push(e[l % e.length]);
  const a = i.map((l, d) => [l, s[d], 1]), c = di(a);
  return t.legacy ? c : c.map(([l, d, g]) => ({
    pitch: l,
    duration: d,
    time: t.useStringTime ? je(g) : g
  }));
}
function js(o, e) {
  const t = (r, n) => n === 0 ? r : t(n, r % n);
  return Math.abs(o * e) / t(o, e);
}
function Is(o, e) {
  const t = [];
  let r = 0, n = 0;
  for (const i of o) {
    const s = e[n % e.length];
    t.push([i, s, r]), r += s, n++;
  }
  return t;
}
const Os = {
  Rhythm: Ss,
  isorhythm: Cs,
  beatcycle: Is
};
class qs {
  // Dummy implementation, replace with actual logic
  constructor() {
  }
}
class Ce {
  data;
  // rows: number;
  // columns: number;
  constructor(e, t) {
    if (typeof e == "number") {
      if (t === void 0)
        throw new Error("Columns parameter required when creating matrix from dimensions");
      this.rows = e, this.columns = t, this.data = Array(this.rows).fill(0).map(() => Array(this.columns).fill(0));
    } else
      this.data = e.map((r) => [...r]), this.rows = this.data.length, this.columns = this.data[0]?.length || 0;
  }
  static zeros(e, t) {
    return new Ce(e, t);
  }
  static from2DArray(e) {
    return new Ce(e);
  }
  get(e, t) {
    if (e < 0 || e >= this.rows || t < 0 || t >= this.columns)
      throw new Error(`Index out of bounds: (${e}, ${t})`);
    return this.data[e][t];
  }
  set(e, t, r) {
    if (e < 0 || e >= this.rows || t < 0 || t >= this.columns)
      throw new Error(`Index out of bounds: (${e}, ${t})`);
    this.data[e][t] = r;
  }
  getRow(e) {
    if (e < 0 || e >= this.rows)
      throw new Error(`Row index out of bounds: ${e}`);
    return [...this.data[e]];
  }
  getColumn(e) {
    if (e < 0 || e >= this.columns)
      throw new Error(`Column index out of bounds: ${e}`);
    return this.data.map((t) => t[e]);
  }
  transpose() {
    const e = Array(this.columns).fill(0).map(() => Array(this.rows).fill(0));
    for (let t = 0; t < this.rows; t++)
      for (let r = 0; r < this.columns; r++)
        e[r][t] = this.data[t][r];
    return new Ce(e);
  }
  clone() {
    return new Ce(this.data);
  }
  toArray() {
    return this.data.map((e) => [...e]);
  }
}
function gr(o) {
  return Array.isArray(o[0]) ? Ce.from2DArray(o) : Ce.from2DArray([o]);
}
function bi(o) {
  if (o.rows !== o.columns)
    throw new Error("Matrix must be square for Cholesky decomposition");
  const e = o.rows, t = Ce.zeros(e, e);
  for (let r = 0; r < e; r++)
    for (let n = 0; n <= r; n++)
      if (r === n) {
        let i = 0;
        for (let a = 0; a < n; a++)
          i += t.get(n, a) * t.get(n, a);
        const s = o.get(n, n) - i;
        if (s <= 0)
          throw new Error(`Matrix is not positive definite at position (${n}, ${n})`);
        t.set(n, n, Math.sqrt(s));
      } else {
        let i = 0;
        for (let s = 0; s < n; s++)
          i += t.get(r, s) * t.get(n, s);
        t.set(r, n, (o.get(r, n) - i) / t.get(n, n));
      }
  return t;
}
class Ds {
  constructor(e = {}) {
    this.params = { ...e };
  }
  call(e, t) {
    const r = t || e, n = Ce.zeros(e.rows, r.rows);
    for (let i = 0; i < e.rows; i++)
      for (let s = 0; s < r.rows; s++)
        n.set(i, s, this.compute(e.getRow(i), r.getRow(s)));
    return n;
  }
  // compute(x1, x2) { throw new Error('Not implemented'); }
  getParams() {
    return { ...this.params };
  }
  setParams(e) {
    Object.assign(this.params, e);
  }
  euclideanDistance(e, t) {
    let r = 0;
    for (let n = 0; n < e.length; n++)
      r += Math.pow(e[n] - t[n], 2);
    return Math.sqrt(r);
  }
  squaredEuclideanDistance(e, t) {
    let r = 0;
    for (let n = 0; n < e.length; n++)
      r += Math.pow(e[n] - t[n], 2);
    return r;
  }
}
class wi {
  kernel;
  alpha;
  XTrain;
  yTrain;
  L;
  alphaVector;
  constructor(e, t = {}) {
    this.kernel = e, this.alpha = t.alpha || 1e-10;
  }
  fit(e, t) {
    this.XTrain = gr(e), this.yTrain = [...t];
    const r = this.kernel.call(this.XTrain);
    for (let n = 0; n < r.rows; n++)
      r.set(n, n, r.get(n, n) + this.alpha);
    try {
      this.L = bi(r);
    } catch (n) {
      throw new Error(`Failed to compute Cholesky decomposition: ${n instanceof Error ? n.message : "Unknown error"}`);
    }
    this.alphaVector = this.solveCholesky(this.L, this.yTrain);
  }
  predict(e, t = !1) {
    if (!this.XTrain || !this.yTrain || !this.L || !this.alphaVector)
      throw new Error("Model must be fitted before prediction");
    const r = gr(e), n = this.kernel.call(this.XTrain, r), i = new Array(r.rows);
    for (let a = 0; a < r.rows; a++) {
      i[a] = 0;
      for (let c = 0; c < this.XTrain.rows; c++)
        i[a] += n.get(c, a) * this.alphaVector[c];
    }
    const s = { mean: i };
    if (t) {
      const a = this.computeStd(r, n);
      s.std = a;
    }
    return s;
  }
  sampleY(e, t = 1) {
    if (!this.XTrain || !this.yTrain || !this.L || !this.alphaVector)
      throw new Error("Model must be fitted before sampling");
    const r = gr(e), n = this.predict(e, !0);
    if (!n.std)
      throw new Error("Standard deviation computation failed");
    const i = [];
    for (let s = 0; s < t; s++) {
      const a = new Array(r.rows);
      for (let c = 0; c < r.rows; c++) {
        const l = n.mean[c], d = n.std[c];
        a[c] = l + d * this.sampleStandardNormal();
      }
      i.push(a);
    }
    return i;
  }
  logMarginalLikelihood() {
    if (!this.XTrain || !this.yTrain || !this.L || !this.alphaVector)
      throw new Error("Model must be fitted before computing log marginal likelihood");
    let e = 0;
    for (let t = 0; t < this.yTrain.length; t++)
      e -= 0.5 * this.yTrain[t] * this.alphaVector[t];
    for (let t = 0; t < this.L.rows; t++)
      e -= Math.log(this.L.get(t, t));
    return e -= 0.5 * this.yTrain.length * Math.log(2 * Math.PI), e;
  }
  computeStd(e, t) {
    if (!this.L)
      throw new Error("Cholesky decomposition not available");
    const r = new Array(e.rows);
    for (let n = 0; n < e.rows; n++) {
      const i = this.kernel.compute(e.getRow(n), e.getRow(n)), s = t.getColumn(n), a = this.forwardSubstitution(this.L, s);
      let c = 0;
      for (let d = 0; d < a.length; d++)
        c += a[d] * a[d];
      const l = i - c;
      r[n] = Math.sqrt(Math.max(0, l));
    }
    return r;
  }
  solveCholesky(e, t) {
    const r = this.forwardSubstitution(e, t);
    return this.backSubstitution(e, r);
  }
  forwardSubstitution(e, t) {
    const r = e.rows, n = new Array(r);
    for (let i = 0; i < r; i++) {
      n[i] = t[i];
      for (let s = 0; s < i; s++)
        n[i] -= e.get(i, s) * n[s];
      n[i] /= e.get(i, i);
    }
    return n;
  }
  backSubstitution(e, t) {
    const r = e.rows, n = new Array(r);
    for (let i = r - 1; i >= 0; i--) {
      n[i] = t[i];
      for (let s = i + 1; s < r; s++)
        n[i] -= e.get(s, i) * n[s];
      n[i] /= e.get(i, i);
    }
    return n;
  }
  sampleStandardNormal() {
    const e = Math.random(), t = Math.random();
    return Math.sqrt(-2 * Math.log(e)) * Math.cos(2 * Math.PI * t);
  }
}
class Zn extends Ds {
  constructor(e = 1, t = 1) {
    super({ length_scale: e, variance: t }), this.lengthScale = e, this.variance = t;
  }
  compute(e, t) {
    const r = this.euclideanDistance(e, t);
    return this.variance * Math.exp(-0.5 * Math.pow(r / this.lengthScale, 2));
  }
  getParams() {
    return {
      length_scale: this.lengthScale,
      variance: this.variance
    };
  }
}
function Ls(o = 0, e = 1) {
  const t = Math.random(), r = Math.random(), n = Math.sqrt(-2 * Math.log(t)) * Math.cos(2 * Math.PI * r);
  return o + e * n;
}
function zs(o, e) {
  const t = o.length, r = bi(e), n = Array.from({ length: t }, () => Ls()), i = new Array(t);
  for (let s = 0; s < t; s++) {
    i[s] = o[s];
    for (let a = 0; a <= s; a++)
      i[s] += r.get(s, a) * n[a];
  }
  return i;
}
const Ie = {
  timeSignature: [4, 4],
  // 4/4 time
  ticksPerQuarterNote: 480,
  // Standard MIDI resolution
  beatsPerBar: 4
  // Derived from time signature
};
function Ze(o, e = Ie) {
  const { timeSignature: t, ticksPerQuarterNote: r } = e, [n, i] = t, s = n * 4 / i, a = Math.floor(o / s), c = o % s, l = Math.floor(c), d = c - l, g = Math.round(d * r);
  return `${a}:${l}:${g}`;
}
function Mr(o, e = Ie) {
  const { timeSignature: t, ticksPerQuarterNote: r } = e, [n, i] = t, s = o.split(":");
  if (s.length !== 3)
    throw new Error(`Invalid bars:beats:ticks format: ${o}`);
  const a = parseInt(s[0], 10), c = parseFloat(s[1]), l = parseInt(s[2], 10);
  if (isNaN(a) || isNaN(c) || isNaN(l))
    throw new Error(`Invalid numeric values in bars:beats:ticks: ${o}`);
  const d = n * 4 / i;
  return a * d + c + l / r;
}
function Vs(o, e = Ie, t = !0) {
  return o.map((r) => {
    const n = { ...r };
    if (r.offset !== void 0 && (n.time = r.offset, delete n.offset), typeof r.time == "string" && r.time.includes(":") && (n.time = Mr(r.time, e)), typeof r.duration == "number" && !t) {
      const i = r.duration;
      i === 1 ? n.duration = "4n" : i === 0.5 ? n.duration = "8n" : i === 0.25 ? n.duration = "16n" : i === 2 ? n.duration = "2n" : i === 4 && (n.duration = "1n");
    }
    return n;
  });
}
function st(o, e = {}) {
  const {
    label: t = "track",
    midiChannel: r = 0,
    synth: n = { type: "Synth" },
    timingConfig: i = Ie,
    keepNumericDuration: s = !0
    // Default to numeric for MIDI consistency
  } = e, a = Vs(o, i, s);
  return {
    label: t,
    midiChannel: r,
    synth: n,
    notes: a
  };
}
class Fs {
  data;
  lengthScale;
  amplitude;
  noiseLevel;
  walkAround;
  timingConfig;
  isFitted;
  gpr;
  constructor(e = [], t = 1, r = 1, n = 0.1, i = !1, s = Ie) {
    this.data = [...e], this.lengthScale = t, this.amplitude = r, this.noiseLevel = n, this.walkAround = i, this.timingConfig = s, this.isFitted = !1, this.gpr = null;
  }
  generate(e = {}) {
    e.length, e.nsamples;
    const t = e.seed;
    return e.useStringTime, t !== void 0 && (Math.seedrandom = this.seededRandom(t)), this.data.length > 0 && Array.isArray(this.data[0]) ? this.generateFitted(e) : this.generateUnfitted(e);
  }
  /**
   * Generate from unfitted Gaussian Process
   */
  generateUnfitted(e = {}) {
    const t = e.length || 100, r = e.nsamples || 1, n = e.lengthScale || this.lengthScale, i = e.amplitude || this.amplitude, s = e.noiseLevel || this.noiseLevel;
    e.useStringTime;
    const a = [];
    for (let c = 0; c < r; c++) {
      const l = Array.from({ length: t }, (m, h) => [h]), d = new Ce(l), _ = new Zn(n, i).call(d);
      for (let m = 0; m < _.rows; m++)
        _.set(m, m, _.get(m, m) + s);
      let b = new Array(t).fill(this.walkAround || 0);
      this.walkAround && typeof this.walkAround == "number" && (b = new Array(t).fill(this.walkAround));
      const $ = zs(b, _);
      a.push($);
    }
    return r === 1 ? a[0] : a;
  }
  /**
   * Generate from fitted Gaussian Process using training data
   */
  generateFitted(e = {}) {
    const t = e.length || 100, r = e.nsamples || 1, n = e.lengthScale || this.lengthScale, i = e.amplitude || this.amplitude, s = this.data.map((m) => [m[0]]), a = this.data.map((m) => m[1]), c = new Zn(n, i);
    this.gpr = new wi(c);
    try {
      this.gpr.fit(s, a), this.isFitted = !0;
    } catch (m) {
      throw new Error(`Failed to fit Gaussian Process: ${m.message}`);
    }
    const l = Math.min(...this.data.map((m) => m[0])), g = (Math.max(...this.data.map((m) => m[0])) - l) / (t - 1), _ = Array.from({ length: t }, (m, h) => [l + h * g]), b = this.gpr.sampleY(_, r), $ = _.map((m) => m[0]);
    return r === 1 ? [$, b[0]] : [$, b];
  }
  rbfKernel(e, t) {
    let r = 0;
    for (let n = 0; n < e.length; n++)
      r += Math.pow(e[n] - t[n], 2);
    return this.amplitude * Math.exp(-r / (2 * Math.pow(this.lengthScale, 2)));
  }
  setData(e) {
    this.data = [...e];
  }
  getData() {
    return [...this.data];
  }
  setLengthScale(e) {
    this.lengthScale = e;
  }
  setAmplitude(e) {
    this.amplitude = e;
  }
  setNoiseLevel(e) {
    this.noiseLevel = e;
  }
  /**
   * Convert GP samples to JMON notes
   * @param {Array|Array<Array>} samples - GP samples (single array or array of arrays)
   * @param {Array} durations - Duration sequence
   * @param {Array} timePoints - Time points (for fitted GP)
   * @param {Object} options - Conversion options
   * @returns {Array} JMON note objects
   */
  toJmonNotes(e, t = [1], r = null, n = {}) {
    const {
      useStringTime: i = !1,
      mapToScale: s = null,
      scaleRange: a = [60, 72],
      quantize: c = !1
    } = n, l = [];
    let d = 0;
    const g = Array.isArray(e[0]) ? e : [e], _ = r || Array.from({ length: g[0].length }, (b, $) => $);
    for (let b = 0; b < g[0].length; b++) {
      const $ = t[b % t.length], m = r ? _[b] : d, h = g.map((u) => {
        let f = u[b];
        if (s) {
          const w = Math.min(...u), S = Math.max(...u) - w || 1, P = (f - w) / S, A = Math.floor(P * s.length), C = Math.max(0, Math.min(A, s.length - 1));
          f = s[C];
        } else {
          const w = Math.min(...u), S = Math.max(...u) - w || 1, P = (f - w) / S;
          f = a[0] + P * (a[1] - a[0]);
        }
        return c && (f = Math.round(f)), f;
      }), p = h.length === 1 ? h[0] : h;
      l.push({
        pitch: p,
        duration: $,
        time: i ? Ze(m, this.timingConfig) : m
      }), r || (d += $);
    }
    return l;
  }
  /**
   * Generate JMON track directly from GP
   * @param {Object} options - Generation options
   * @param {Object} trackOptions - Track options
   * @returns {Object} JMON track
   */
  generateTrack(e = {}, t = {}) {
    const r = this.generate(e), n = e.durations || [1];
    let i;
    if (this.isFitted || this.data.length > 0 && Array.isArray(this.data[0])) {
      const [s, a] = r;
      i = this.toJmonNotes(a, n, s, e);
    } else
      i = this.toJmonNotes(r, n, null, e);
    return st(i, {
      label: "gaussian-process",
      midiChannel: 0,
      synth: { type: "Synth" },
      ...t
    });
  }
  /**
   * Simple seeded random number generator
   */
  seededRandom(e) {
    return function() {
      return e = (e * 9301 + 49297) % 233280, e / 233280;
    };
  }
}
class Gs {
  /**
   * @param {CellularAutomataOptions} [options={}] - Configuration options
   */
  constructor(e = {}) {
    this.width = e.width || 51, this.ruleNumber = e.ruleNumber || 30, this.initialState = e.initialState || this.generateRandomInitialState(), this.state = [...this.initialState], this.rules = this.loadRules(this.ruleNumber), this.history = [];
  }
  /**
   * Generate cellular automaton evolution
   * @param {number} steps - Number of evolution steps
   * @returns {Matrix2D} Evolution history
   */
  generate(e) {
    this.history = [], this.state = [...this.initialState], this.history.push([...this.state]);
    for (let t = 0; t < e; t++)
      this.updateState(), this.history.push([...this.state]);
    return this.history;
  }
  /**
   * Generate cellular automaton evolution with binary output
   * @param {number} steps - Number of evolution steps
   * @returns {Matrix2D} Binary evolution history
   */
  generate01(e) {
    return this.generate(e).map((r) => r.map((n) => n > 0 ? 1 : 0));
  }
  /**
   * Load rules based on rule number
   * @param {number} ruleNumber - Rule number (0-255)
   * @returns {CellularAutomataRule} Rule mapping
   */
  loadRules(e) {
    const t = e.toString(2).padStart(8, "0"), r = {}, n = ["111", "110", "101", "100", "011", "010", "001", "000"];
    for (let i = 0; i < 8; i++)
      r[n[i]] = parseInt(t[i], 10);
    return r;
  }
  /**
   * Update the current state based on rules
   */
  updateState() {
    const e = new Array(this.width);
    for (let t = 0; t < this.width; t++) {
      const r = this.state[(t - 1 + this.width) % this.width], n = this.state[t], i = this.state[(t + 1) % this.width], s = `${r}${n}${i}`;
      e[t] = this.rules[s] || 0;
    }
    this.state = e;
  }
  /**
   * Validate strips matrix format
   * @param {Matrix2D} strips - Matrix to validate
   * @returns {boolean} Whether the matrix is valid
   */
  validateStrips(e) {
    if (!Array.isArray(e) || e.length === 0)
      return !1;
    const t = e[0]?.length;
    return t ? e.every(
      (r) => Array.isArray(r) && r.length === t && r.every((n) => typeof n == "number" && (n === 0 || n === 1))
    ) : !1;
  }
  /**
   * Validate values array
   * @param {number[]} values - Values to validate
   * @returns {boolean} Whether the values are valid
   */
  validateValues(e) {
    return Array.isArray(e) && e.length === this.width && e.every((t) => typeof t == "number" && (t === 0 || t === 1));
  }
  /**
   * Set initial state
   * @param {number[]} state - New initial state
   */
  setInitialState(e) {
    if (this.validateValues(e))
      this.initialState = [...e], this.state = [...e];
    else
      throw new Error("Invalid initial state");
  }
  /**
   * Set rule number
   * @param {number} ruleNumber - New rule number (0-255)
   */
  setRuleNumber(e) {
    if (e >= 0 && e <= 255)
      this.ruleNumber = e, this.rules = this.loadRules(e);
    else
      throw new Error("Rule number must be between 0 and 255");
  }
  /**
   * Get evolution history
   * @returns {Matrix2D} Copy of evolution history
   */
  getHistory() {
    return this.history.map((e) => [...e]);
  }
  /**
   * Get current state
   * @returns {number[]} Copy of current state
   */
  getCurrentState() {
    return [...this.state];
  }
  /**
   * Generate random initial state with single center cell
   * @returns {number[]} Initial state array
   */
  generateRandomInitialState() {
    const e = new Array(this.width).fill(0);
    return e[Math.floor(this.width / 2)] = 1, e;
  }
  /**
   * Generate completely random state
   * @returns {number[]} Random state array
   */
  generateRandomState() {
    return Array.from({ length: this.width }, () => Math.random() > 0.5 ? 1 : 0);
  }
  /**
   * Get plot data
   * @returns {Object} Plot data with dimensions
   */
  plot() {
    return {
      data: this.getHistory(),
      width: this.width,
      height: this.history.length
    };
  }
  /**
   * Create Observable Plot visualization of CA evolution
   * @param {Object} [options] - Plot options
   * @returns {Object} Observable Plot spec
   */
  async plotEvolution(e) {
    return (await import("./CAVisualizer-CmIzAtiX.js")).CAVisualizer.plotEvolution(this.getHistory(), e);
  }
  /**
   * Create Observable Plot visualization of current generation
   * @param {Object} [options] - Plot options
   * @returns {Object} Observable Plot spec
   */
  async plotGeneration(e) {
    return (await import("./CAVisualizer-CmIzAtiX.js")).CAVisualizer.plotGeneration(this.getCurrentState(), e);
  }
  /**
   * Create Observable Plot density visualization
   * @param {Object} [options] - Plot options
   * @returns {Object} Observable Plot spec
   */
  async plotDensity(e) {
    return (await import("./CAVisualizer-CmIzAtiX.js")).CAVisualizer.plotDensity(this.getHistory(), e);
  }
}
class Qt {
  /**
   * Initializes a Loop object.
   * 
   * @param {Object|Array} loops - Dictionary or array of JMON tracks. Each track has notes: [{pitch, duration, time, velocity}, ...]
   * @param {number} measureLength - The length of a measure in beats. Defaults to 4.
   * @param {boolean} insertRests - Whether to insert rests. Defaults to true.
   */
  constructor(e, t = 4, r = !0) {
    if (!e)
      throw new Error("Loops parameter is required");
    if (typeof t != "number" || t <= 0)
      throw new Error("measureLength must be a positive number");
    if (typeof r != "boolean")
      throw new Error("insertRests must be a boolean");
    if (this.measureLength = t, Array.isArray(e)) {
      if (e.length === 0)
        throw new Error("Loops array cannot be empty");
      const n = {};
      e.forEach((i, s) => {
        const a = i?.label || `Loop ${s + 1}`;
        n[a] = i;
      }), e = n;
    }
    if (typeof e != "object" || Object.keys(e).length === 0)
      throw new Error("Loops must be a non-empty object or array");
    this.loops = {};
    for (const [n, i] of Object.entries(e)) {
      if (!i)
        throw new Error(`Loop data for "${n}" is null or undefined`);
      const s = Array.isArray(i) ? i : i.notes || [];
      if (!Array.isArray(s))
        throw new Error(`Notes for loop "${n}" must be an array`);
      const a = s.map((c, l) => {
        if (!c || typeof c != "object")
          throw new Error(`Note ${l} in loop "${n}" must be an object`);
        if (c.pitch !== null && (typeof c.pitch != "number" || c.pitch < 0 || c.pitch > 127))
          throw new Error(`Note ${l} in loop "${n}" has invalid pitch: ${c.pitch}`);
        if (typeof c.time != "number" || c.time < 0)
          throw new Error(`Note ${l} in loop "${n}" has invalid time: ${c.time}`);
        if (typeof c.duration != "number" || c.duration <= 0)
          throw new Error(`Note ${l} in loop "${n}" has invalid duration: ${c.duration}`);
        return {
          pitch: c.pitch,
          time: c.time,
          duration: c.duration,
          velocity: typeof c.velocity == "number" ? Math.max(0, Math.min(1, c.velocity)) : 0.8
        };
      });
      this.loops[n] = {
        label: i.label || n,
        notes: r ? this.fillGapsWithRests(a) : a,
        synth: i.synth || {
          type: "Synth",
          options: {
            oscillator: { type: "sine" },
            envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.5 }
          }
        }
      };
    }
  }
  /**
   * Fill gaps between notes with rests (JMON format)
   */
  fillGapsWithRests(e) {
    if (e.length === 0) return e;
    const t = [];
    let r = 0;
    const n = [...e].sort((i, s) => i.time - s.time);
    for (const i of n)
      i.time > r && t.push({
        pitch: null,
        // null indicates rest
        duration: i.time - r,
        time: r,
        velocity: 0
      }), t.push({
        pitch: i.pitch,
        duration: i.duration,
        time: i.time,
        velocity: i.velocity || 0.8
      }), r = i.time + i.duration;
    return t;
  }
  /**
   * Create a loop from a single JMON track
   */
  static fromTrack(e, t = 4) {
    if ((e.notes || []).length === 0)
      throw new Error("Track must have notes to create loop");
    return new Qt({ [e.label || "Track"]: e }, t);
  }
  /**
   * Create loop from Euclidean rhythm (JMON format)
   */
  static euclidean(e, t, r = [60], n = null) {
    if (typeof e != "number" || e <= 0 || !Number.isInteger(e))
      throw new Error("beats must be a positive integer");
    if (typeof t != "number" || t < 0 || !Number.isInteger(t))
      throw new Error("pulses must be a non-negative integer");
    if (t > e)
      throw new Error("pulses cannot be greater than beats");
    if (!Array.isArray(r) || r.length === 0)
      throw new Error("pitches must be a non-empty array");
    const i = this.generateEuclideanRhythm(e, t), s = [], a = 1;
    i.forEach((l, d) => {
      if (l) {
        const g = d * a, _ = r[d % r.length];
        s.push({
          pitch: _,
          duration: a * 0.8,
          time: g,
          velocity: 0.8
        });
      }
    });
    const c = {
      label: n || `Euclidean ${t}/${e}`,
      notes: s,
      synth: {
        type: "Synth",
        options: {
          oscillator: { type: "sine" },
          envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.5 }
        }
      }
    };
    return new Qt({ [c.label]: c }, e);
  }
  /**
   * Generate Euclidean rhythm pattern using Bjorklund algorithm
   * This creates the most even distribution of pulses across beats
   */
  static generateEuclideanRhythm(e, t) {
    if (t === 0)
      return Array(e).fill(!1);
    if (t >= e)
      return Array(e).fill(!0);
    let r = [
      { pattern: [1], count: t },
      // Groups with pulses
      { pattern: [0], count: e - t }
      // Groups without pulses
    ];
    for (; r.length > 1; ) {
      const [s, a] = r;
      if (s.count <= a.count) {
        const c = s.count, l = a.count - s.count;
        r = [
          { pattern: [...a.pattern, ...s.pattern], count: c }
        ], l > 0 && r.push({ pattern: a.pattern, count: l });
      } else {
        const c = a.count, l = s.count - a.count;
        r = [
          { pattern: [...s.pattern, ...a.pattern], count: c }
        ], l > 0 && r.push({ pattern: s.pattern, count: l });
      }
    }
    const n = r[0], i = [];
    for (let s = 0; s < n.count; s++)
      i.push(...n.pattern);
    return i.map((s) => s === 1);
  }
  /**
   * Get loops as JMON tracks (already in JMON format)
   */
  toJMonSequences() {
    return Object.values(this.loops);
  }
  /**
   * Simple plotting method matching Python implementation
   */
  async plot(e = 1 / 4, t = null, r = {}) {
    const { LoopVisualizer: n } = await import("./LoopVisualizer-DS22P85c.js");
    return n.plotLoops(
      this.loops,
      this.measureLength,
      e,
      t,
      r
    );
  }
}
class Ht {
  /**
   * Create a musical index analyzer for a sequence
   * @param {Array} sequence - Array of musical values (pitches, durations, etc.)
   */
  constructor(e) {
    this.sequence = e.filter((t) => t != null), this.originalSequence = e;
  }
  /**
   * Calculate Gini coefficient (measure of inequality/diversity)
   * 0 = perfect equality, 1 = maximum inequality
   * @returns {number} Gini coefficient
   */
  gini() {
    if (this.sequence.length === 0) return 0;
    const e = [...this.sequence].sort((i, s) => i - s), t = e.length;
    let r = 0;
    for (let i = 0; i < t; i++)
      r += (2 * (i + 1) - t - 1) * e[i];
    const n = e.reduce((i, s) => i + s, 0);
    return n === 0 ? 0 : r / (t * n);
  }
  /**
   * Calculate balance (measure of how evenly distributed values are around the mean)
   * Lower values indicate better balance around the center
   * @returns {number} Balance metric
   */
  balance() {
    if (this.sequence.length === 0) return 0;
    const e = this.sequence.reduce((r, n) => r + n, 0) / this.sequence.length, t = this.sequence.reduce((r, n) => r + Math.pow(n - e, 2), 0) / this.sequence.length;
    return e === 0 ? 0 : Math.sqrt(t) / Math.abs(e);
  }
  /**
   * Calculate motif strength (measure of repetitive patterns)
   * Higher values indicate stronger motif presence
   * @param {number} maxMotifLength - Maximum motif length to consider
   * @returns {number} Motif strength
   */
  motif(e = 4) {
    if (this.sequence.length < 2) return 0;
    const t = /* @__PURE__ */ new Map();
    let r = 0;
    for (let i = 2; i <= Math.min(e, this.sequence.length); i++)
      for (let s = 0; s <= this.sequence.length - i; s++) {
        const a = this.sequence.slice(s, s + i).join(",");
        t.set(a, (t.get(a) || 0) + 1), r++;
      }
    let n = 0;
    for (const i of t.values())
      i > 1 && (n += i * i);
    return r === 0 ? 0 : n / r;
  }
  /**
   * Calculate dissonance relative to a musical scale
   * 0 = all notes in scale, higher values = more dissonance
   * @param {Array} scale - Array of pitches considered consonant
   * @returns {number} Dissonance level
   */
  dissonance(e) {
    if (!e || e.length === 0 || this.sequence.length === 0) return 0;
    const t = new Set(e.map((n) => n % 12));
    let r = 0;
    for (const n of this.sequence)
      if (n != null) {
        const i = n % 12;
        t.has(i) || r++;
      }
    return r / this.sequence.length;
  }
  /**
   * Calculate rhythmic fitness (how well durations fit within measure boundaries)
   * 1 = perfect fit, lower values = poor rhythmic alignment
   * @param {number} measureLength - Length of a measure in beats
   * @returns {number} Rhythmic fitness
   */
  rhythmic(e = 4) {
    if (this.sequence.length === 0) return 0;
    let t = 0, r = 0;
    const n = this.sequence.reduce(
      (i, s) => i + s,
      0
    );
    for (const i of this.sequence) {
      const s = t + i, a = Math.floor(t / e), c = Math.floor(s / e);
      if (a !== c) {
        const l = e - t % e;
        l < i && l > 0 && (r += Math.min(
          l,
          i - l
        ));
      }
      t = s;
    }
    return n === 0 ? 0 : 1 - r / n;
  }
  /**
   * Calculate proportion of rests in the sequence
   * @returns {number} Proportion of rests (0-1)
   */
  restProportion() {
    return this.originalSequence.length === 0 ? 0 : this.originalSequence.filter((t) => t == null).length / this.originalSequence.length;
  }
  /**
   * Calculate all metrics at once for efficiency
   * @param {Array} scale - Musical scale for dissonance calculation
   * @param {number} measureLength - Measure length for rhythmic analysis
   * @returns {Object} All calculated metrics
   */
  calculateAll(e = null, t = 4) {
    return {
      gini: this.gini(),
      balance: this.balance(),
      motif: this.motif(),
      dissonance: e ? this.dissonance(e) : 0,
      rhythmic: this.rhythmic(t),
      rest: this.restProportion()
    };
  }
  /**
   * Calculate statistical properties of the sequence
   * @returns {Object} Statistical properties
   */
  getStats() {
    if (this.sequence.length === 0)
      return { mean: 0, std: 0, min: 0, max: 0, range: 0 };
    const e = this.sequence.reduce((s, a) => s + a, 0) / this.sequence.length, t = this.sequence.reduce((s, a) => s + Math.pow(a - e, 2), 0) / this.sequence.length, r = Math.sqrt(t), n = Math.min(...this.sequence), i = Math.max(...this.sequence);
    return {
      mean: e,
      std: r,
      min: n,
      max: i,
      range: i - n
    };
  }
  /**
   * Compare two sequences and return similarity score
   * @param {MusicalIndex} other - Another MusicalIndex to compare with
   * @param {Array} scale - Scale for dissonance comparison
   * @param {number} measureLength - Measure length for rhythmic comparison
   * @returns {number} Similarity score (0-1, higher is more similar)
   */
  similarity(e, t = null, r = 4) {
    const n = this.calculateAll(t, r), i = e.calculateAll(t, r);
    let s = 0, a = 0;
    for (const [c, l] of Object.entries(n)) {
      const d = i[c];
      if (typeof l == "number" && typeof d == "number") {
        const g = Math.max(Math.abs(l), Math.abs(d), 1), _ = 1 - Math.abs(l - d) / g;
        s += _, a++;
      }
    }
    return a === 0 ? 0 : s / a;
  }
}
class Bs {
  /**
   * Initialize the Darwin genetic algorithm
   * @param {Object} config - Configuration object
   */
  constructor(e = {}) {
    const {
      initialPhrases: t = [],
      mutationRate: r = 0.05,
      populationSize: n = 50,
      mutationProbabilities: i = null,
      scale: s = null,
      measureLength: a = 4,
      timeResolution: c = [0.125, 4],
      weights: l = null,
      targets: d = null,
      seed: g = null
    } = e;
    this.initialPhrases = t, this.mutationRate = r, this.populationSize = n, this.scale = s, this.measureLength = a, this.timeResolution = c, g !== null ? (this.seed = g, this.randomState = this.createSeededRandom(g)) : this.randomState = Math;
    const _ = [0.125, 0.25, 0.5, 1, 2, 3, 4, 8];
    this.possibleDurations = _.filter(
      (b) => b >= c[0] && b <= Math.min(c[1], a)
    ), this.mutationProbabilities = i || {
      pitch: () => Math.max(0, Math.min(127, Math.floor(this.gaussianRandom(60, 5)))),
      duration: () => {
        const b = this.possibleDurations.map(($, m) => Math.pow(2, -m));
        return this.weightedChoice(this.possibleDurations, b);
      },
      rest: () => this.randomState.random() < 0.02 ? null : 1
    }, this.weights = l || {
      gini: [1, 1, 0],
      // [pitch, duration, offset]
      balance: [1, 1, 0],
      motif: [10, 1, 0],
      dissonance: [1, 0, 0],
      rhythmic: [0, 10, 0],
      rest: [1, 0, 0]
    }, this.targets = d || {
      gini: [0.05, 0.5, 0],
      balance: [0.1, 0.1, 0],
      motif: [1, 1, 0],
      dissonance: [0, 0, 0],
      rhythmic: [0, 1, 0],
      rest: [0, 0, 0]
    }, this.population = this.initializePopulation(), this.bestIndividuals = [], this.bestScores = [], this.generationCount = 0;
  }
  /**
   * Create a seeded random number generator
   * @param {number} seed - Random seed
   * @returns {Object} Random number generator with seeded methods
   */
  createSeededRandom(e) {
    let t = e;
    const r = () => (t = (t * 9301 + 49297) % 233280, t / 233280);
    return {
      random: r,
      choice: (n) => n[Math.floor(r() * n.length)],
      sample: (n, i) => [...n].sort(() => r() - 0.5).slice(0, i)
    };
  }
  /**
   * Generate Gaussian random number using Box-Muller transform
   * @param {number} mean - Mean of distribution
   * @param {number} stdDev - Standard deviation
   * @returns {number} Gaussian random number
   */
  gaussianRandom(e = 0, t = 1) {
    if (this.gaussianSpare !== void 0) {
      const s = this.gaussianSpare;
      return this.gaussianSpare = void 0, e + t * s;
    }
    const r = this.randomState.random(), n = this.randomState.random(), i = t * Math.sqrt(-2 * Math.log(r));
    return this.gaussianSpare = i * Math.cos(2 * Math.PI * n), e + i * Math.sin(2 * Math.PI * n);
  }
  /**
   * Choose random element from array with weights
   * @param {Array} choices - Array of choices
   * @param {Array} weights - Array of weights
   * @returns {*} Weighted random choice
   */
  weightedChoice(e, t) {
    const r = t.reduce((i, s) => i + s, 0);
    let n = this.randomState.random() * r;
    for (let i = 0; i < e.length; i++)
      if (n -= t[i], n <= 0)
        return e[i];
    return e[e.length - 1];
  }
  /**
   * Initialize population by mutating initial phrases
   * @returns {Array} Initial population
   */
  initializePopulation() {
    const e = [], t = Math.floor(this.populationSize / this.initialPhrases.length);
    for (const r of this.initialPhrases)
      for (let n = 0; n < t; n++)
        e.push(this.mutate(r, 0));
    for (; e.length < this.populationSize; ) {
      const r = this.randomState.choice(this.initialPhrases);
      e.push(this.mutate(r, 0));
    }
    return e;
  }
  /**
   * Calculate fitness components for a musical phrase
   * @param {Array} phrase - Musical phrase as [pitch, duration, offset] tuples
   * @returns {Object} Fitness components
   */
  calculateFitnessComponents(e) {
    if (e.length === 0) return {};
    const t = e.map((a) => a[0]), r = e.map((a) => a[1]), n = e.map((a) => a[2]), i = {};
    if (t.length > 0) {
      const a = new Ht(t);
      i.gini_pitch = a.gini(), i.balance_pitch = a.balance(), i.motif_pitch = a.motif(), this.scale && (i.dissonance_pitch = a.dissonance(this.scale));
    }
    if (r.length > 0) {
      const a = new Ht(r);
      i.gini_duration = a.gini(), i.balance_duration = a.balance(), i.motif_duration = a.motif(), i.rhythmic = a.rhythmic(this.measureLength);
    }
    if (n.length > 0) {
      const a = new Ht(n);
      i.gini_offset = a.gini(), i.balance_offset = a.balance(), i.motif_offset = a.motif();
    }
    const s = t.filter((a) => a == null).length / t.length;
    return i.rest = s, i;
  }
  /**
   * Calculate fitness score for a musical phrase
   * @param {Array} phrase - Musical phrase
   * @returns {number} Fitness score
   */
  fitness(e) {
    const t = this.calculateFitnessComponents(e);
    let r = 0;
    for (const [n, i] of Object.entries(this.targets)) {
      const s = this.weights[n];
      for (let a = 0; a < 3; a++) {
        const c = a === 0 ? `${n}_pitch` : a === 1 ? `${n}_duration` : `${n}_offset`, l = t[c] || 0, d = i[a], g = s[a];
        if (g > 0 && d !== void 0) {
          const _ = Math.max(Math.abs(d), 1), b = 1 - Math.abs(l - d) / _;
          r += Math.max(0, b) * g;
        }
      }
    }
    if (this.weights.rest[0] > 0) {
      const n = t.rest || 0, i = this.targets.rest[0], s = 1 - Math.abs(n - i) / Math.max(i, 1);
      r += Math.max(0, s) * this.weights.rest[0];
    }
    return r;
  }
  /**
   * Mutate a musical phrase
   * @param {Array} phrase - Original phrase
   * @param {number} rate - Mutation rate (null to use default)
   * @returns {Array} Mutated phrase
   */
  mutate(e, t = null) {
    t === null && (t = this.mutationRate);
    const r = [];
    let n = 0;
    for (const i of e) {
      let [s, a, c] = i;
      this.randomState.random() < t && (s = this.mutationProbabilities.pitch()), this.randomState.random() < t && (a = this.mutationProbabilities.duration()), this.randomState.random() < t && this.mutationProbabilities.rest() === null && (s = null);
      const l = n;
      n += a, r.push([s, a, l]);
    }
    return r;
  }
  /**
   * Select top performers from population
   * @param {number} k - Number of individuals to select
   * @returns {Array} Selected phrases
   */
  select(e = 25) {
    const t = this.population.map((r) => ({
      phrase: r,
      fitness: this.fitness(r)
    }));
    return t.sort((r, n) => n.fitness - r.fitness), t.slice(0, e).map((r) => r.phrase);
  }
  /**
   * Crossover (breed) two parent phrases
   * @param {Array} parent1 - First parent phrase
   * @param {Array} parent2 - Second parent phrase
   * @returns {Array} Child phrase
   */
  crossover(e, t) {
    if (e.length === 0 || t.length === 0)
      return e.length > 0 ? [...e] : [...t];
    const r = Math.min(e.length, t.length), n = Math.floor(this.randomState.random() * r), i = Math.floor(this.randomState.random() * r), [s, a] = [Math.min(n, i), Math.max(n, i)], c = [];
    for (let d = 0; d < s; d++)
      d < e.length && c.push([...e[d]]);
    for (let d = s; d < a; d++)
      d < t.length && c.push([...t[d]]);
    for (let d = a; d < Math.max(e.length, t.length); d++)
      d < e.length ? c.push([...e[d]]) : d < t.length && c.push([...t[d]]);
    let l = 0;
    for (let d = 0; d < c.length; d++)
      c[d][2] = l, l += c[d][1];
    return c;
  }
  /**
   * Evolve the population for one generation
   * @param {number} k - Number of parents to select
   * @param {number} restRate - Rate for introducing rests (unused, kept for compatibility)
   * @returns {Object} Evolution statistics
   */
  evolve(e = 25) {
    const t = this.select(e), r = this.fitness(t[0]);
    this.bestIndividuals.push([...t[0]]), this.bestScores.push(r);
    const n = [];
    for (; n.length < this.populationSize; ) {
      const i = this.randomState.choice(t), s = this.randomState.choice(t), a = this.crossover([...i], [...s]), c = this.mutate(a);
      n.push(c);
    }
    return this.population = n, this.generationCount++, {
      generation: this.generationCount,
      bestFitness: r,
      averageFitness: t.reduce((i, s) => i + this.fitness(s), 0) / t.length,
      populationSize: this.populationSize
    };
  }
  /**
   * Evolve for multiple generations
   * @param {number} generations - Number of generations to evolve
   * @param {number} k - Number of parents per generation
   * @param {Function} callback - Optional callback for progress updates
   * @returns {Array} Array of evolution statistics
   */
  evolveGenerations(e, t = 25, r = null) {
    const n = [];
    for (let i = 0; i < e; i++) {
      const s = this.evolve(t);
      n.push(s), r && r(s, i, e);
    }
    return n;
  }
  /**
   * Get the current best individual
   * @returns {Array} Best musical phrase
   */
  getBestIndividual() {
    return this.bestIndividuals.length > 0 ? [...this.bestIndividuals[this.bestIndividuals.length - 1]] : null;
  }
  /**
   * Get evolution history
   * @returns {Object} Evolution history with individuals and scores
   */
  getEvolutionHistory() {
    return {
      individuals: this.bestIndividuals.map((e) => [...e]),
      scores: [...this.bestScores],
      generations: this.generationCount
    };
  }
  /**
   * Reset the evolution state
   */
  reset() {
    this.population = this.initializePopulation(), this.bestIndividuals = [], this.bestScores = [], this.generationCount = 0;
  }
  /**
   * Get population statistics
   * @returns {Object} Population statistics
   */
  getPopulationStats() {
    const e = this.population.map((n) => this.fitness(n)), t = e.reduce((n, i) => n + i, 0) / e.length, r = e.reduce((n, i) => n + Math.pow(i - t, 2), 0) / e.length;
    return {
      populationSize: this.population.length,
      meanFitness: t,
      standardDeviation: Math.sqrt(r),
      minFitness: Math.min(...e),
      maxFitness: Math.max(...e),
      generation: this.generationCount
    };
  }
}
class Us {
  options;
  walkers;
  history;
  constructor(e = {}) {
    this.options = {
      length: e.length || 100,
      dimensions: e.dimensions || 1,
      stepSize: e.stepSize || 1,
      bounds: e.bounds || [-100, 100],
      branchProbability: e.branchProbability || 0.05,
      mergeProbability: e.mergeProbability || 0.02,
      attractorStrength: e.attractorStrength || 0,
      attractorPosition: e.attractorPosition || Array(e.dimensions || 1).fill(0)
    }, this.walkers = [], this.history = [];
  }
  /**
   * Generate random walk sequence
   */
  generate(e) {
    this.initialize(e), this.history = [];
    for (let t = 0; t < this.options.length; t++)
      this.updateWalkers(), this.recordState(), this.handleBranching(), this.handleMerging();
    return this.history;
  }
  /**
   * Initialize walker(s)
   */
  initialize(e) {
    const t = e || Array(this.options.dimensions).fill(0);
    this.walkers = [{
      position: [...t],
      velocity: Array(this.options.dimensions).fill(0),
      branches: [],
      age: 0,
      active: !0
    }];
  }
  /**
   * Update all active walkers
   */
  updateWalkers() {
    for (const e of this.walkers)
      if (e.active) {
        for (let t = 0; t < this.options.dimensions; t++) {
          const r = (Math.random() - 0.5) * 2 * this.options.stepSize;
          let n = 0;
          if (this.options.attractorStrength > 0) {
            const i = e.position[t] - this.options.attractorPosition[t];
            n = -this.options.attractorStrength * i;
          }
          e.velocity[t] = e.velocity[t] * 0.9 + r + n, e.position[t] += e.velocity[t], e.position[t] < this.options.bounds[0] ? (e.position[t] = this.options.bounds[0], e.velocity[t] *= -0.5) : e.position[t] > this.options.bounds[1] && (e.position[t] = this.options.bounds[1], e.velocity[t] *= -0.5);
        }
        e.age++;
      }
  }
  /**
   * Record current state of all walkers
   */
  recordState() {
    const e = this.walkers.filter((t) => t.active);
    if (e.length > 0) {
      const t = Array(this.options.dimensions).fill(0);
      for (const r of e)
        for (let n = 0; n < this.options.dimensions; n++)
          t[n] += r.position[n];
      for (let r = 0; r < this.options.dimensions; r++)
        t[r] /= e.length;
      this.history.push([...t]);
    }
  }
  /**
   * Handle branching (walker splitting)
   */
  handleBranching() {
    const e = [];
    for (const t of this.walkers)
      if (t.active && Math.random() < this.options.branchProbability) {
        const r = {
          position: [...t.position],
          velocity: t.velocity.map((n) => n + (Math.random() - 0.5) * this.options.stepSize),
          branches: [],
          age: 0,
          active: !0
        };
        e.push(r), t.branches.push(r);
      }
    this.walkers.push(...e);
  }
  /**
   * Handle merging (walker combining)
   */
  handleMerging() {
    if (this.walkers.length <= 1) return;
    const e = this.walkers.filter((r) => r.active), t = this.options.stepSize * 2;
    for (let r = 0; r < e.length; r++)
      for (let n = r + 1; n < e.length; n++)
        if (Math.random() < this.options.mergeProbability && this.calculateDistance(e[r].position, e[n].position) < t) {
          for (let s = 0; s < this.options.dimensions; s++)
            e[r].position[s] = (e[r].position[s] + e[n].position[s]) / 2, e[r].velocity[s] = (e[r].velocity[s] + e[n].velocity[s]) / 2;
          e[n].active = !1;
        }
    this.walkers = this.walkers.filter((r) => r.active);
  }
  /**
   * Calculate Euclidean distance between two positions
   */
  calculateDistance(e, t) {
    let r = 0;
    for (let n = 0; n < e.length; n++)
      r += Math.pow(e[n] - t[n], 2);
    return Math.sqrt(r);
  }
  /**
   * Get 1D projection of multi-dimensional walk
   */
  getProjection(e = 0) {
    return this.history.map((t) => t[e] || 0);
  }
  /**
   * Map walk to musical scale
   */
  mapToScale(e = 0, t = [0, 2, 4, 5, 7, 9, 11], r = 3) {
    const n = this.getProjection(e);
    if (n.length === 0) return [];
    const i = Math.min(...n), a = Math.max(...n) - i || 1;
    return n.map((c) => {
      const l = (c - i) / a, d = Math.floor(l * t.length * r), g = Math.floor(d / t.length), _ = d % t.length;
      return 60 + g * 12 + t[_];
    });
  }
  /**
   * Map walk to rhythmic durations
   */
  mapToRhythm(e = 0, t = [0.25, 0.5, 1, 2]) {
    const r = this.getProjection(e);
    if (r.length === 0) return [];
    const n = Math.min(...r), s = Math.max(...r) - n || 1;
    return r.map((a) => {
      const c = (a - n) / s, l = Math.floor(c * t.length), d = Math.max(0, Math.min(l, t.length - 1));
      return t[d];
    });
  }
  /**
   * Map walk to velocities
   */
  mapToVelocity(e = 0, t = 0.3, r = 1) {
    const n = this.getProjection(e);
    if (n.length === 0) return [];
    const i = Math.min(...n), a = Math.max(...n) - i || 1;
    return n.map((c) => {
      const l = (c - i) / a;
      return t + l * (r - t);
    });
  }
  /**
   * Generate correlated walk (walk that follows another walk with some correlation)
   */
  generateCorrelated(e, t = 0.5, r = 0) {
    if (e.length === 0) return [];
    const n = [];
    let i = 0;
    for (let s = 0; s < e.length; s++) {
      const a = (Math.random() - 0.5) * 2 * this.options.stepSize, c = t * (e[s] - i);
      i += a + c, i = Math.max(this.options.bounds[0], Math.min(this.options.bounds[1], i)), n.push(i);
    }
    return n;
  }
  /**
   * Analyze walk properties
   */
  analyze() {
    if (this.history.length < 2)
      return {
        meanDisplacement: 0,
        meanSquaredDisplacement: 0,
        totalDistance: 0,
        fractalDimension: 0
      };
    const e = this.getProjection(0), t = e[0], r = e[e.length - 1], n = Math.abs(r - t), i = e.map((l) => Math.pow(l - t, 2)), s = i.reduce((l, d) => l + d, 0) / i.length;
    let a = 0;
    for (let l = 1; l < e.length; l++)
      a += Math.abs(e[l] - e[l - 1]);
    const c = a > 0 ? Math.log(a) / Math.log(e.length) : 0;
    return {
      meanDisplacement: n,
      meanSquaredDisplacement: s,
      totalDistance: a,
      fractalDimension: c
    };
  }
  /**
   * Get current walker states
   */
  getWalkerStates() {
    return this.walkers.map((e) => ({ ...e }));
  }
  /**
   * Reset the walk generator
   */
  reset() {
    this.walkers = [], this.history = [];
  }
  /**
   * Convert walk to JMON notes
   * @param {Array} durations - Duration sequence
   * @param {Object} options - Conversion options
   * @returns {Array} JMON note objects
   */
  toJmonNotes(e = [1], t = {}) {
    const {
      useStringTime: r = !1,
      timingConfig: n = Ie,
      dimension: i = 0,
      mapToScale: s = null,
      scaleRange: a = [60, 72]
    } = t, c = this.getProjection(i), l = [];
    let d = 0;
    for (let g = 0; g < c.length; g++) {
      const _ = e[g % e.length];
      let b = c[g];
      if (s) {
        const $ = Math.min(...c), h = Math.max(...c) - $ || 1, p = (b - $) / h, u = Math.floor(p * s.length), f = Math.max(0, Math.min(u, s.length - 1));
        b = s[f];
      } else
        b = this.mapToScale([c], s || [60, 62, 64, 65, 67, 69, 71])[0][g];
      l.push({
        pitch: b,
        duration: _,
        time: r ? Ze(d, n) : d
      }), d += _;
    }
    return l;
  }
  /**
   * Generate JMON track directly from walk
   * @param {Array} startPosition - Starting position
   * @param {Array} durations - Duration sequence
   * @param {Object} options - Generation and conversion options
   * @param {Object} trackOptions - Track options
   * @returns {Object} JMON track
   */
  generateTrack(e, t = [1], r = {}, n = {}) {
    this.generate(e);
    const i = this.toJmonNotes(t, r);
    return st(i, {
      label: "random-walk",
      midiChannel: 0,
      synth: { type: "Synth" },
      ...n
    });
  }
}
class Ks {
  walkRange;
  walkStart;
  walkProbability;
  roundTo;
  branchingProbability;
  mergingProbability;
  timingConfig;
  constructor(e = {}) {
    this.walkRange = e.walkRange || null, this.walkStart = e.walkStart !== void 0 ? e.walkStart : this.walkRange ? Math.floor((this.walkRange[1] - this.walkRange[0]) / 2) + this.walkRange[0] : 0, this.walkProbability = e.walkProbability || [-1, 0, 1], this.roundTo = e.roundTo !== void 0 ? e.roundTo : null, this.branchingProbability = e.branchingProbability || 0, this.mergingProbability = e.mergingProbability || 0, this.timingConfig = e.timingConfig || Ie;
  }
  /**
   * Generate random walk sequence(s) with branching and merging
   * @param {number} length - Length of the walk
   * @param {number} seed - Random seed for reproducibility
   * @returns {Array<Array>} Array of walk sequences (branches)
   */
  generate(e, t) {
    let r = Math.random;
    t !== void 0 && (r = this.createSeededRandom(t));
    const n = [this.initializeWalk(e)];
    let i = [this.walkStart];
    for (let s = 1; s < e; s++) {
      const a = [...i], c = [];
      for (let l = 0; l < i.length; l++) {
        const d = n[l], g = i[l];
        if (g === null) {
          d && (d[s] = null);
          continue;
        }
        const _ = this.generateStep(r);
        let b = g + _;
        if (isNaN(b) && (b = g), this.walkRange !== null && (b < this.walkRange[0] ? b = this.walkRange[0] : b > this.walkRange[1] && (b = this.walkRange[1])), isNaN(b) && (b = this.walkStart), d && (d[s] = b), a[l] = b, r() < this.branchingProbability) {
          const $ = this.createBranch(n[l], s), m = this.generateStep(r);
          let h = g + m;
          isNaN(h) && (h = g), this.walkRange !== null && (h < this.walkRange[0] ? h = this.walkRange[0] : h > this.walkRange[1] && (h = this.walkRange[1])), isNaN(h) && (h = this.walkStart), $[s] = h, c.push($), a.push(h);
        }
      }
      n.push(...c), i = a, i = this.handleMerging(n, i, s, r);
    }
    return n;
  }
  /**
   * Generate a single step according to the probability distribution
   */
  generateStep(e = Math.random) {
    if (Array.isArray(this.walkProbability))
      return this.walkProbability[Math.floor(e() * this.walkProbability.length)];
    if (typeof this.walkProbability == "object" && this.walkProbability.mean !== void 0 && this.walkProbability.std !== void 0) {
      let t = this.generateNormal(this.walkProbability.mean, this.walkProbability.std, e);
      return this.roundTo !== null && (t = parseFloat(t.toFixed(this.roundTo))), t;
    }
    return [-1, 0, 1][Math.floor(e() * 3)];
  }
  /**
   * Generate a sample from normal distribution
   */
  generateNormal(e, t, r = Math.random) {
    let n, i;
    do
      n = r();
    while (n === 0);
    i = r();
    const s = Math.sqrt(-2 * Math.log(n)) * Math.cos(2 * Math.PI * i), a = e + t * s;
    return isNaN(a) ? e : a;
  }
  /**
   * Initialize a new walk with null values
   */
  initializeWalk(e) {
    const t = new Array(e);
    t[0] = this.walkStart;
    for (let r = 1; r < e; r++)
      t[r] = null;
    return t;
  }
  /**
   * Create a branch from an existing walk
   */
  createBranch(e, t) {
    const r = new Array(e.length);
    for (let n = 0; n < t; n++)
      r[n] = null;
    for (let n = t; n < r.length; n++)
      r[n] = null;
    return r;
  }
  /**
   * Handle merging of walks that collide
   */
  handleMerging(e, t, r, n = Math.random) {
    const i = [...t];
    for (let s = 0; s < t.length; s++)
      if (t[s] !== null)
        for (let a = s + 1; a < t.length; a++) {
          if (t[a] === null) continue;
          const c = this.roundTo !== null ? this.roundTo : 1e-3;
          if (Math.abs(t[s] - t[a]) <= c && n() < this.mergingProbability && (i[a] = null, e[a]))
            for (let l = r; l < e[a].length; l++)
              e[a][l] = null;
        }
    return i;
  }
  /**
   * Convert walk sequences to JMON notes
   * @param {Array<Array>} walks - Walk sequences
   * @param {Array} durations - Duration sequence to map to
   * @param {Object} options - Conversion options
   * @returns {Array} JMON note objects
   */
  toJmonNotes(e, t = [1], r = {}) {
    const n = r.useStringTime || !1, i = [];
    let s = 0, a = 0;
    const c = Math.max(...e.map((l) => l.length));
    for (let l = 0; l < c; l++) {
      const d = e.map((g) => g[l]).filter((g) => g !== null);
      if (d.length > 0) {
        const g = t[a % t.length], _ = d.length === 1 ? d[0] : d;
        i.push({
          pitch: _,
          duration: g,
          time: n ? Ze(s, this.timingConfig) : s
        }), s += g, a++;
      }
    }
    return i;
  }
  /**
   * Generate a JMON track directly from walk
   * @param {number} length - Walk length
   * @param {Array} durations - Duration sequence
   * @param {Object} trackOptions - Track options
   * @returns {Object} JMON track
   */
  generateTrack(e, t = [1], r = {}) {
    const n = this.generate(e, r.seed), i = this.toJmonNotes(n, t, r);
    return st(i, {
      label: "random-walk",
      midiChannel: 0,
      synth: { type: "Synth" },
      ...r
    });
  }
  /**
   * Map walk values to a musical scale
   * @param {Array<Array>} walks - Walk sequences  
   * @param {Array} scale - Scale to map to
   * @returns {Array<Array>} Walks mapped to scale
   */
  mapToScale(e, t = [60, 62, 64, 65, 67, 69, 71]) {
    return e.map((r) => r.map((n) => {
      if (n === null) return null;
      const i = this.walkRange[0], a = this.walkRange[1] - i, c = (n - i) / a, l = Math.floor(c * t.length), d = Math.max(0, Math.min(l, t.length - 1));
      return t[d];
    }));
  }
  /**
   * Create a seeded random number generator
   */
  createSeededRandom(e) {
    let t = Math.abs(e) || 1;
    return function() {
      t = (t * 9301 + 49297) % 233280;
      const r = t / 233280;
      return Math.max(1e-7, Math.min(0.9999999, r));
    };
  }
}
class We {
  distance;
  frequency;
  phase;
  subPhasors;
  center;
  constructor(e = 1, t = 1, r = 0, n = []) {
    this.distance = e, this.frequency = t, this.phase = r, this.subPhasors = n || [], this.center = { x: 0, y: 0 };
  }
  /**
   * Add a sub-phasor to this phasor (like epicycles)
   */
  addSubPhasor(e) {
    this.subPhasors.push(e);
  }
  /**
   * Calculate position at given time
   */
  getPosition(e) {
    const t = this.frequency * e + this.phase, r = this.center.x + this.distance * Math.cos(t), n = this.center.y + this.distance * Math.sin(t);
    return { x: r, y: n, angle: t, distance: this.distance };
  }
  /**
   * Calculate distance from origin
   */
  getDistanceFromOrigin(e) {
    const t = this.getPosition(e);
    return Math.sqrt(t.x * t.x + t.y * t.y);
  }
  /**
   * Calculate angle from origin in degrees
   */
  getAngleFromOrigin(e) {
    const t = this.getPosition(e);
    let r = Math.atan2(t.y, t.x) * 180 / Math.PI;
    return r < 0 && (r += 360), r;
  }
  /**
   * Simulate this phasor and all its sub-phasors
   */
  simulate(e, t = { x: 0, y: 0 }) {
    this.center = t;
    const r = [];
    for (const n of e) {
      const i = this.getPosition(n), s = this.getDistanceFromOrigin(n), a = this.getAngleFromOrigin(n);
      r.push({
        time: n,
        position: i,
        distance: s,
        angle: a,
        phasor: this
      });
      for (const c of this.subPhasors) {
        c.center = i;
        const l = c.simulate([n], i);
        r.push(...l);
      }
    }
    return r;
  }
}
class kr {
  phasors;
  timingConfig;
  constructor(e = Ie) {
    this.phasors = [], this.timingConfig = e;
  }
  /**
   * Add a phasor to the system
   */
  addPhasor(e) {
    this.phasors.push(e);
  }
  /**
   * Simulate all phasors and sub-phasors in the system
   */
  simulate(e) {
    const t = [];
    for (const r of this.phasors) {
      const n = r.simulate(e);
      t.push(n);
    }
    return t;
  }
  /**
   * Get a flattened list of all phasors (primary + sub-phasors)
   */
  getAllPhasors() {
    const e = [];
    for (const t of this.phasors)
      e.push(t), this.collectSubPhasors(t, e);
    return e;
  }
  /**
   * Recursively collect all sub-phasors
   */
  collectSubPhasors(e, t) {
    for (const r of e.subPhasors)
      t.push(r), this.collectSubPhasors(r, t);
  }
  /**
   * Map phasor motion to musical parameters
   */
  mapToMusic(e, t = {}) {
    const r = this.simulate(e), n = [];
    for (let i = 0; i < r.length; i++) {
      const s = r[i], a = this.createMusicalTrack(s, i, t);
      n.push(a);
    }
    return n;
  }
  /**
   * Create a musical track from phasor motion
   */
  createMusicalTrack(e, t, r = {}) {
    const {
      pitchRange: n = [40, 80],
      durationRange: i = [0.25, 2],
      useDistance: s = !0,
      useAngle: a = !1,
      quantizeToScale: c = null,
      timingConfig: l = this.timingConfig,
      useStringTime: d = !1
    } = r, g = [];
    for (const _ of e) {
      let b, $;
      if (s) {
        const m = Math.max(0, Math.min(1, _.distance / 10));
        b = n[0] + m * (n[1] - n[0]);
      } else
        b = n[0] + _.angle / 360 * (n[1] - n[0]);
      if (a)
        $ = i[0] + _.angle / 360 * (i[1] - i[0]);
      else {
        const m = Math.max(0, Math.min(1, _.distance / 10));
        $ = i[1] - m * (i[1] - i[0]);
      }
      if (c) {
        const m = Math.floor((b - n[0]) / (n[1] - n[0]) * c.length), h = Math.max(0, Math.min(m, c.length - 1));
        b = c[h];
      } else
        b = Math.round(b);
      g.push({
        pitch: b,
        duration: $,
        time: d ? Ze(_.time, l) : _.time,
        phasorData: {
          distance: _.distance,
          angle: _.angle,
          position: _.position
        }
      });
    }
    return g;
  }
  /**
   * Generate JMON tracks directly from phasor motion
   */
  generateTracks(e, t = {}, r = {}) {
    const n = this.mapToMusic(e, t), i = [];
    return n.forEach((s, a) => {
      const c = st(s, {
        label: `phasor-${a + 1}`,
        midiChannel: a % 16,
        synth: { type: "Synth" },
        ...r
      });
      i.push(c);
    }), i;
  }
  /**
   * Create complex harmonic patterns with sub-phasors (epicycles)
   */
  static createComplexSystem() {
    const e = new kr(), t = new We(0.2, 5, 0), r = new We(0.3, 3, Math.PI / 2), n = new We(0.1, 8, Math.PI);
    t.addSubPhasor(n);
    const i = new We(2, 1, 0, [t, r]), s = new We(3.5, 0.6, Math.PI / 3);
    return e.addPhasor(i), e.addPhasor(s), e;
  }
  /**
   * Generate time array with linear spacing
   */
  static generateTimeArray(e = 0, t = 10, r = 100) {
    const n = [], i = (t - e) / (r - 1);
    for (let s = 0; s < r; s++)
      n.push(e + s * i);
    return n;
  }
}
class Js {
  /**
   * @param {MandelbrotOptions} [options={}] - Configuration options
   */
  constructor(e = {}) {
    this.width = e.width || 100, this.height = e.height || 100, this.maxIterations = e.maxIterations || 100, this.xMin = e.xMin || -2.5, this.xMax = e.xMax || 1.5, this.yMin = e.yMin || -2, this.yMax = e.yMax || 2;
  }
  /**
   * Generate Mandelbrot set data
   * @returns {number[][]} 2D array of iteration counts
   */
  generate() {
    const e = [];
    for (let t = 0; t < this.height; t++) {
      const r = [];
      for (let n = 0; n < this.width; n++) {
        const i = this.xMin + n / this.width * (this.xMax - this.xMin), s = this.yMin + t / this.height * (this.yMax - this.yMin), a = this.mandelbrotIterations({ real: i, imaginary: s });
        r.push(a);
      }
      e.push(r);
    }
    return e;
  }
  /**
   * Extract sequence from Mandelbrot data using various methods
   * @param {'diagonal'|'border'|'spiral'|'column'|'row'} [method='diagonal'] - Extraction method
   * @param {number} [index=0] - Index for column/row extraction
   * @returns {number[]} Extracted sequence
   */
  extractSequence(e = "diagonal", t = 0) {
    const r = this.generate();
    switch (e) {
      case "diagonal":
        return this.extractDiagonal(r);
      case "border":
        return this.extractBorder(r);
      case "spiral":
        return this.extractSpiral(r);
      case "column":
        return this.extractColumn(r, t);
      case "row":
        return this.extractRow(r, t);
      default:
        return this.extractDiagonal(r);
    }
  }
  /**
   * Calculate Mandelbrot iterations for a complex point
   * @param {ComplexPoint} c - Complex point to test
   * @returns {number} Number of iterations before escape
   */
  mandelbrotIterations(e) {
    let t = { real: 0, imaginary: 0 };
    for (let r = 0; r < this.maxIterations; r++) {
      const n = t.real * t.real - t.imaginary * t.imaginary + e.real, i = 2 * t.real * t.imaginary + e.imaginary;
      if (t.real = n, t.imaginary = i, t.real * t.real + t.imaginary * t.imaginary > 4)
        return r;
    }
    return this.maxIterations;
  }
  /**
   * Extract diagonal sequence
   * @param {number[][]} data - 2D fractal data
   * @returns {number[]} Diagonal sequence
   */
  extractDiagonal(e) {
    const t = [], r = Math.min(e.length, e[0]?.length || 0);
    for (let n = 0; n < r; n++)
      t.push(e[n][n]);
    return t;
  }
  /**
   * Extract border sequence (clockwise)
   * @param {number[][]} data - 2D fractal data
   * @returns {number[]} Border sequence
   */
  extractBorder(e) {
    const t = [], r = e.length, n = e[0]?.length || 0;
    if (r === 0 || n === 0) return t;
    for (let i = 0; i < n; i++)
      t.push(e[0][i]);
    for (let i = 1; i < r; i++)
      t.push(e[i][n - 1]);
    if (r > 1)
      for (let i = n - 2; i >= 0; i--)
        t.push(e[r - 1][i]);
    if (n > 1)
      for (let i = r - 2; i > 0; i--)
        t.push(e[i][0]);
    return t;
  }
  /**
   * Extract spiral sequence (from outside to inside)
   * @param {number[][]} data - 2D fractal data
   * @returns {number[]} Spiral sequence
   */
  extractSpiral(e) {
    const t = [], r = e.length, n = e[0]?.length || 0;
    if (r === 0 || n === 0) return t;
    let i = 0, s = r - 1, a = 0, c = n - 1;
    for (; i <= s && a <= c; ) {
      for (let l = a; l <= c; l++)
        t.push(e[i][l]);
      i++;
      for (let l = i; l <= s; l++)
        t.push(e[l][c]);
      if (c--, i <= s) {
        for (let l = c; l >= a; l--)
          t.push(e[s][l]);
        s--;
      }
      if (a <= c) {
        for (let l = s; l >= i; l--)
          t.push(e[l][a]);
        a++;
      }
    }
    return t;
  }
  /**
   * Extract specific column
   * @param {number[][]} data - 2D fractal data
   * @param {number} columnIndex - Column index to extract
   * @returns {number[]} Column sequence
   */
  extractColumn(e, t) {
    const r = [], n = e[0]?.length || 0, i = Math.max(0, Math.min(t, n - 1));
    for (const s of e)
      s[i] !== void 0 && r.push(s[i]);
    return r;
  }
  /**
   * Extract specific row
   * @param {number[][]} data - 2D fractal data
   * @param {number} rowIndex - Row index to extract
   * @returns {number[]} Row sequence
   */
  extractRow(e, t) {
    const r = Math.max(0, Math.min(t, e.length - 1));
    return e[r] ? [...e[r]] : [];
  }
  /**
   * Map fractal values to musical scale
   * @param {number[]} sequence - Fractal sequence
   * @param {number[]} [scale=[0, 2, 4, 5, 7, 9, 11]] - Musical scale intervals
   * @param {number} [octaveRange=3] - Number of octaves to span
   * @returns {number[]} MIDI note sequence
   */
  mapToScale(e, t = [0, 2, 4, 5, 7, 9, 11], r = 3) {
    if (e.length === 0) return [];
    const n = Math.min(...e), s = Math.max(...e) - n || 1;
    return e.map((a) => {
      const c = (a - n) / s, l = Math.floor(c * t.length * r), d = Math.floor(l / t.length), g = l % t.length;
      return 60 + d * 12 + t[g];
    });
  }
  /**
   * Generate rhythmic pattern from fractal data
   * @param {number[]} sequence - Fractal sequence
   * @param {number[]} [subdivisions=[1, 2, 4, 8, 16]] - Rhythmic subdivisions
   * @returns {number[]} Rhythmic durations
   */
  mapToRhythm(e, t = [1, 2, 4, 8, 16]) {
    if (e.length === 0) return [];
    const r = Math.min(...e), i = Math.max(...e) - r || 1;
    return e.map((s) => {
      const a = (s - r) / i, c = Math.floor(a * t.length), l = Math.max(0, Math.min(c, t.length - 1));
      return 1 / t[l];
    });
  }
}
class Hs {
  /**
   * @param {LogisticMapOptions} [options={}] - Configuration options
   */
  constructor(e = {}) {
    this.r = e.r || 3.8, this.x0 = e.x0 || 0.5, this.iterations = e.iterations || 1e3, this.skipTransient = e.skipTransient || 100;
  }
  /**
   * Generate logistic map sequence
   * @returns {number[]} Generated sequence
   */
  generate() {
    const e = [];
    let t = this.x0;
    for (let r = 0; r < this.iterations + this.skipTransient; r++)
      t = this.r * t * (1 - t), r >= this.skipTransient && e.push(t);
    return e;
  }
  /**
   * Generate bifurcation data for different r values
   * @param {number} [rMin=2.5] - Minimum r value
   * @param {number} [rMax=4.0] - Maximum r value
   * @param {number} [rSteps=1000] - Number of r steps
   * @returns {Object} Bifurcation data with r and x arrays
   */
  bifurcationDiagram(e = 2.5, t = 4, r = 1e3) {
    const n = [], i = [], s = (t - e) / r;
    for (let a = 0; a < r; a++) {
      const c = e + a * s, l = this.r;
      this.r = c;
      const d = this.generate();
      this.r = l;
      const g = d.slice(-50);
      for (const _ of g)
        n.push(c), i.push(_);
    }
    return { r: n, x: i };
  }
  /**
   * Map chaotic values to musical scale
   * @param {number[]} sequence - Chaotic sequence
   * @param {number[]} [scale=[0, 2, 4, 5, 7, 9, 11]] - Musical scale intervals
   * @param {number} [octaveRange=3] - Number of octaves to span
   * @returns {number[]} MIDI note sequence
   */
  mapToScale(e, t = [0, 2, 4, 5, 7, 9, 11], r = 3) {
    return e.length === 0 ? [] : e.map((n) => {
      const i = Math.floor(n * t.length * r), s = Math.floor(i / t.length), a = i % t.length;
      return 60 + s * 12 + t[a];
    });
  }
  /**
   * Map to rhythmic durations
   * @param {number[]} sequence - Chaotic sequence
   * @param {number[]} [durations=[0.25, 0.5, 1, 2]] - Duration values
   * @returns {number[]} Rhythm sequence
   */
  mapToRhythm(e, t = [0.25, 0.5, 1, 2]) {
    return e.length === 0 ? [] : e.map((r) => {
      const n = Math.floor(r * t.length), i = Math.max(0, Math.min(n, t.length - 1));
      return t[i];
    });
  }
  /**
   * Map to velocities
   * @param {number[]} sequence - Chaotic sequence
   * @param {number} [minVel=0.3] - Minimum velocity
   * @param {number} [maxVel=1.0] - Maximum velocity
   * @returns {number[]} Velocity sequence
   */
  mapToVelocity(e, t = 0.3, r = 1) {
    if (e.length === 0) return [];
    const n = r - t;
    return e.map((i) => t + i * n);
  }
  /**
   * Detect periodic cycles in the sequence
   * @param {number[]} sequence - Sequence to analyze
   * @param {number} [tolerance=0.01] - Tolerance for cycle detection
   * @returns {number[]} Detected cycle periods
   */
  detectCycles(e, t = 0.01) {
    const r = [];
    for (let n = 1; n <= Math.floor(e.length / 2); n++) {
      let i = !0;
      for (let s = n; s < Math.min(e.length, n * 3); s++)
        if (Math.abs(e[s] - e[s - n]) > t) {
          i = !1;
          break;
        }
      i && r.push(n);
    }
    return r;
  }
  /**
   * Calculate Lyapunov exponent (measure of chaos)
   * @param {number} [iterations=10000] - Number of iterations for calculation
   * @returns {number} Lyapunov exponent
   */
  lyapunovExponent(e = 1e4) {
    let t = this.x0, r = 0;
    for (let n = 0; n < e; n++) {
      const i = this.r * (1 - 2 * t);
      r += Math.log(Math.abs(i)), t = this.r * t * (1 - t);
    }
    return r / e;
  }
  /**
   * Generate multiple correlated sequences
   * @param {number} [numSequences=2] - Number of sequences to generate
   * @param {number} [coupling=0.1] - Coupling strength between sequences
   * @returns {number[][]} Array of coupled sequences
   */
  generateCoupled(e = 2, t = 0.1) {
    const r = Array(e).fill(null).map(() => []), n = Array(e).fill(this.x0);
    for (let i = 0; i < this.iterations + this.skipTransient; i++) {
      const s = [...n];
      for (let a = 0; a < e; a++) {
        let c = 0;
        for (let l = 0; l < e; l++)
          l !== a && (c += t * (n[l] - n[a]));
        s[a] = this.r * n[a] * (1 - n[a]) + c, s[a] = Math.max(0, Math.min(1, s[a]));
      }
      if (n.splice(0, e, ...s), i >= this.skipTransient)
        for (let a = 0; a < e; a++)
          r[a].push(n[a]);
    }
    return r;
  }
  /**
   * Apply different chaotic regimes
   * @param {'periodic'|'chaotic'|'edge'|'custom'} regime - Regime type
   * @param {number} [customR] - Custom r value for 'custom' regime
   */
  setRegime(e, t) {
    switch (e) {
      case "periodic":
        this.r = 3.2;
        break;
      case "chaotic":
        this.r = 3.9;
        break;
      case "edge":
        this.r = 3.57;
        break;
      case "custom":
        t !== void 0 && (this.r = Math.max(0, Math.min(4, t)));
        break;
    }
  }
  /**
   * Get current parameters
   * @returns {LogisticMapOptions} Current configuration
   */
  getParameters() {
    return {
      r: this.r,
      x0: this.x0,
      iterations: this.iterations,
      skipTransient: this.skipTransient
    };
  }
}
class Ys {
  operation;
  direction;
  repetition;
  timingConfig;
  sequence = [];
  constructor(e) {
    const { operation: t, direction: r, repetition: n, timingConfig: i = Ie } = e;
    if (!["additive", "subtractive"].includes(t))
      throw new Error("Invalid operation. Choose 'additive' or 'subtractive'.");
    if (!["forward", "backward", "inward", "outward"].includes(r))
      throw new Error("Invalid direction. Choose 'forward', 'backward', 'inward' or 'outward'.");
    if (n < 0 || !Number.isInteger(n))
      throw new Error("Invalid repetition value. Must be an integer greater than or equal to 0.");
    this.operation = t, this.direction = r, this.repetition = n, this.timingConfig = i;
  }
  /**
   * Generate processed sequence based on operation and direction
   * Accepts either:
   * - JMON note objects: { pitch, duration, time }
   * - Legacy objects: { pitch, duration, offset }
   * - Legacy tuples: [pitch, duration, offset]
   * Returns: JMON note objects with numeric time (quarter notes)
   */
  generate(e) {
    this.sequence = this.normalizeInput(e);
    let t;
    if (this.operation === "additive" && this.direction === "forward")
      t = this.additiveForward();
    else if (this.operation === "additive" && this.direction === "backward")
      t = this.additiveBackward();
    else if (this.operation === "additive" && this.direction === "inward")
      t = this.additiveInward();
    else if (this.operation === "additive" && this.direction === "outward")
      t = this.additiveOutward();
    else if (this.operation === "subtractive" && this.direction === "forward")
      t = this.subtractiveForward();
    else if (this.operation === "subtractive" && this.direction === "backward")
      t = this.subtractiveBackward();
    else if (this.operation === "subtractive" && this.direction === "inward")
      t = this.subtractiveInward();
    else if (this.operation === "subtractive" && this.direction === "outward")
      t = this.subtractiveOutward();
    else
      throw new Error("Invalid operation/direction combination");
    const r = this.adjustOffsets(t);
    return this.toJmonNotes(r, !1);
  }
  additiveForward() {
    const e = [];
    for (let t = 0; t < this.sequence.length; t++) {
      const r = this.sequence.slice(0, t + 1);
      for (let n = 0; n <= this.repetition; n++)
        e.push(...r);
    }
    return e;
  }
  additiveBackward() {
    const e = [];
    for (let t = this.sequence.length; t > 0; t--) {
      const r = this.sequence.slice(t - 1);
      for (let n = 0; n <= this.repetition; n++)
        e.push(...r);
    }
    return e;
  }
  additiveInward() {
    const e = [], t = this.sequence.length;
    for (let r = 0; r < Math.ceil(t / 2); r++) {
      let n;
      if (r < t - r - 1) {
        const i = this.sequence.slice(0, r + 1), s = this.sequence.slice(t - r - 1);
        n = [...i, ...s];
      } else
        n = [...this.sequence];
      for (let i = 0; i <= this.repetition; i++)
        e.push(...n);
    }
    return e;
  }
  additiveOutward() {
    const e = [], t = this.sequence.length;
    if (t % 2 === 0) {
      const r = Math.floor(t / 2) - 1, n = Math.floor(t / 2);
      for (let i = 0; i < t / 2; i++) {
        const s = this.sequence.slice(r - i, n + i + 1);
        for (let a = 0; a <= this.repetition; a++)
          e.push(...s);
      }
    } else {
      const r = Math.floor(t / 2);
      for (let n = 0; n <= r; n++) {
        const i = this.sequence.slice(r - n, r + n + 1);
        for (let s = 0; s <= this.repetition; s++)
          e.push(...i);
      }
    }
    return e;
  }
  subtractiveForward() {
    const e = [];
    for (let t = 0; t < this.sequence.length; t++) {
      const r = this.sequence.slice(t);
      for (let n = 0; n <= this.repetition; n++)
        e.push(...r);
    }
    return e;
  }
  subtractiveBackward() {
    const e = [];
    for (let t = this.sequence.length; t > 0; t--) {
      const r = this.sequence.slice(0, t);
      for (let n = 0; n <= this.repetition; n++)
        e.push(...r);
    }
    return e;
  }
  subtractiveInward() {
    const e = [], t = this.sequence.length, r = Math.floor(t / 2);
    for (let n = 0; n <= this.repetition; n++)
      e.push(...this.sequence);
    for (let n = 1; n <= r; n++) {
      const i = this.sequence.slice(n, t - n);
      if (i.length > 0)
        for (let s = 0; s <= this.repetition; s++)
          e.push(...i);
    }
    return e;
  }
  subtractiveOutward() {
    const e = [];
    let t = [...this.sequence];
    for (let r = 0; r <= this.repetition; r++)
      e.push(...t);
    for (; t.length > 2; ) {
      t = t.slice(1, -1);
      for (let r = 0; r <= this.repetition; r++)
        e.push(...t);
    }
    return e;
  }
  // Normalize heterogenous inputs into objects with pitch, duration, offset (beats)
  normalizeInput(e) {
    return Array.isArray(e) ? Array.isArray(e[0]) ? e.map(([t, r, n = 0]) => ({ pitch: t, duration: r, offset: n })) : e.map((t) => {
      const r = t.pitch, n = t.duration;
      let i = 0;
      return typeof t.offset == "number" ? i = t.offset : typeof t.time == "number" ? i = t.time : typeof t.time == "string" && (i = this.timeToBeats(t.time)), { ...t, pitch: r, duration: n, offset: i };
    }) : [];
  }
  // Convert beats to bars:beats:ticks using centralized utility
  beatsToTime(e) {
    return Ze(e, this.timingConfig);
  }
  // Convert bars:beats:ticks to beats using centralized utility
  timeToBeats(e) {
    return typeof e != "string" ? Number(e) || 0 : Mr(e, this.timingConfig);
  }
  // After process, recalc offsets sequentially in beats
  adjustOffsets(e) {
    let t = 0;
    return e.map((r) => {
      const n = {
        ...r,
        offset: t
      };
      return t += r.duration, n;
    });
  }
  // Produce JMON notes: { pitch, duration, time }
  // Always use numeric time in quarter notes (like pitch: 60, time: 4.5)
  toJmonNotes(e, t = !1) {
    return e.map(({ pitch: r, duration: n, offset: i, ...s }) => {
      const { time: a, ...c } = s;
      return {
        pitch: r,
        duration: n,
        time: t ? this.beatsToTime(i) : i,
        ...c
      };
    });
  }
  /**
   * Generate and convert to JMON track format
   * @param {Array} sequence - Input sequence
   * @param {Object} trackOptions - Track configuration options
   * @param {boolean} trackOptions.useStringTime - Use bars:beats:ticks strings for display (default: numeric)
   * @returns {Object} JMON track object
   */
  generateTrack(e, t = {}) {
    const r = this.generate(e);
    return st(r, {
      timingConfig: this.timingConfig,
      ...t
    });
  }
}
class Ws {
  tChord;
  direction;
  rank;
  isAlternate;
  currentDirection;
  timingConfig;
  constructor(e, t = "down", r = 0, n = Ie) {
    if (!["up", "down", "any", "alternate"].includes(t))
      throw new Error("Invalid direction. Choose 'up', 'down', 'any' or 'alternate'.");
    if (this.tChord = e, this.isAlternate = t === "alternate", this.currentDirection = this.isAlternate ? "up" : t, this.direction = t, this.timingConfig = n, !Number.isInteger(r) || r < 0)
      throw new Error("Rank must be a non-negative integer.");
    this.rank = Math.min(r, e.length - 1), this.rank >= e.length && console.warn("Rank exceeds the length of the t-chord. Using last note of the t-chord.");
  }
  /**
   * Generate t-voice from m-voice sequence
   * Accepts: JMON notes, legacy objects, or tuples
   * Returns: JMON notes with numeric time (quarter notes)
   * @param {Array} sequence - Input sequence
   * @param {boolean} useStringTime - Whether to use bars:beats:ticks strings for display (default: false)
   */
  generate(e, t = !1) {
    const r = this.normalizeInput(e), n = [];
    for (const i of r) {
      if (i.pitch === void 0) {
        const { offset: $, time: m, ...h } = i;
        n.push({
          ...h,
          pitch: void 0,
          time: t ? this.beatsToTime($) : $
        });
        continue;
      }
      const s = i.pitch, c = this.tChord.map(($) => $ - s).map(($, m) => ({ index: m, value: $ })).sort(($, m) => Math.abs($.value) - Math.abs(m.value));
      let l = this.rank, d;
      if (this.currentDirection === "up" || this.currentDirection === "down") {
        const $ = c.filter(
          ({ value: m }) => this.currentDirection === "up" ? m >= 0 : m <= 0
        );
        if ($.length === 0)
          d = this.currentDirection === "up" ? Math.max(...this.tChord) : Math.min(...this.tChord);
        else {
          l >= $.length && (l = $.length - 1);
          const m = $[l].index;
          d = this.tChord[m];
        }
      } else {
        l >= c.length && (l = c.length - 1);
        const $ = c[l].index;
        d = this.tChord[$];
      }
      this.isAlternate && (this.currentDirection = this.currentDirection === "up" ? "down" : "up");
      const { offset: g, time: _, ...b } = i;
      n.push({
        ...b,
        pitch: d,
        time: t ? this.beatsToTime(g) : g
      });
    }
    return n;
  }
  // Normalize input like MinimalismProcess
  normalizeInput(e) {
    return Array.isArray(e) ? Array.isArray(e[0]) ? e.map(([t, r, n = 0]) => ({ pitch: t, duration: r, offset: n })) : e.map((t) => {
      const r = t.pitch, n = t.duration;
      let i = 0;
      return typeof t.offset == "number" ? i = t.offset : typeof t.time == "number" ? i = t.time : typeof t.time == "string" && (i = this.timeToBeats(t.time)), { ...t, pitch: r, duration: n, offset: i };
    }) : [];
  }
  // Convert beats to bars:beats:ticks using centralized utility
  beatsToTime(e) {
    return Ze(e, this.timingConfig);
  }
  // Convert bars:beats:ticks to beats using centralized utility
  timeToBeats(e) {
    return typeof e != "string" ? Number(e) || 0 : Mr(e, this.timingConfig);
  }
}
class Qs {
  /**
   * Calculate Gini coefficient for inequality measurement
   * @param {number[]} values - Values to analyze
   * @param {number[]} [weights] - Optional weights
   * @returns {number} Gini coefficient (0-1)
   */
  static gini(e, t) {
    if (e.length === 0) return 0;
    const r = e.length, n = t || Array(r).fill(1), i = e.map((g, _) => ({ value: g, weight: n[_] })).sort((g, _) => g.value - _.value), s = i.map((g) => g.value), a = i.map((g) => g.weight), c = a.reduce((g, _) => g + _, 0);
    let l = 0, d = 0;
    for (let g = 0; g < r; g++) {
      const _ = a.slice(0, g + 1).reduce(
        (b, $) => b + $,
        0
      );
      l += a[g] * (2 * _ - a[g] - c) * s[g], d += a[g] * s[g] * c;
    }
    return d === 0 ? 0 : l / d;
  }
  /**
   * Calculate center of mass (balance point) of a sequence
   * @param {number[]} values - Values to analyze
   * @param {number[]} [weights] - Optional weights
   * @returns {number} Balance point
   */
  static balance(e, t) {
    if (e.length === 0) return 0;
    const r = t || Array(e.length).fill(1), n = e.reduce((s, a, c) => s + a * r[c], 0), i = r.reduce((s, a) => s + a, 0);
    return i === 0 ? 0 : n / i;
  }
  /**
   * Calculate autocorrelation for pattern detection
   * @param {number[]} values - Values to analyze
   * @param {number} [maxLag] - Maximum lag to calculate
   * @returns {number[]} Autocorrelation array
   */
  static autocorrelation(e, t) {
    const r = e.length, n = t || Math.floor(r / 2), i = [], s = e.reduce((c, l) => c + l, 0) / r, a = e.reduce((c, l) => c + Math.pow(l - s, 2), 0) / r;
    for (let c = 0; c <= n; c++) {
      let l = 0;
      for (let d = 0; d < r - c; d++)
        l += (e[d] - s) * (e[d + c] - s);
      l /= r - c, i.push(a === 0 ? 0 : l / a);
    }
    return i;
  }
  /**
   * Detect and score musical motifs
   * @param {number[]} values - Values to analyze
   * @param {number} [patternLength=3] - Length of patterns to detect
   * @returns {number} Motif score
   */
  static motif(e, t = 3) {
    if (e.length < t * 2) return 0;
    const r = /* @__PURE__ */ new Map();
    for (let s = 0; s <= e.length - t; s++) {
      const a = e.slice(s, s + t).join(",");
      r.set(a, (r.get(a) || 0) + 1);
    }
    const n = Math.max(...r.values()), i = r.size;
    return i === 0 ? 0 : n / i;
  }
  /**
   * Calculate dissonance/scale conformity
   * @param {number[]} pitches - MIDI pitch values
   * @param {number[]} [scale=[0, 2, 4, 5, 7, 9, 11]] - Scale to check against
   * @returns {number} Dissonance score (0-1)
   */
  static dissonance(e, t = [0, 2, 4, 5, 7, 9, 11]) {
    if (e.length === 0) return 0;
    let r = 0;
    for (const n of e) {
      const i = (n % 12 + 12) % 12;
      t.includes(i) && r++;
    }
    return 1 - r / e.length;
  }
  /**
   * Calculate rhythmic fit to a grid
   * @param {number[]} onsets - Onset times
   * @param {number} [gridDivision=16] - Grid division
   * @returns {number} Rhythmic alignment score
   */
  static rhythmic(e, t = 16) {
    if (e.length === 0) return 0;
    let r = 0;
    const n = 0.1;
    for (const i of e) {
      const s = i * t, a = Math.round(s);
      Math.abs(s - a) <= n && r++;
    }
    return r / e.length;
  }
  /**
   * Calculate Fibonacci/golden ratio index
   * @param {number[]} values - Values to analyze
   * @returns {number} Fibonacci index
   */
  static fibonacciIndex(e) {
    if (e.length < 2) return 0;
    const t = (1 + Math.sqrt(5)) / 2;
    let r = 0;
    for (let n = 1; n < e.length; n++)
      if (e[n - 1] !== 0) {
        const i = e[n] / e[n - 1], s = Math.abs(i - t);
        r += 1 / (1 + s);
      }
    return r / (e.length - 1);
  }
  /**
   * Calculate syncopation (off-beat emphasis)
   * @param {number[]} onsets - Onset times
   * @param {number} [beatDivision=4] - Beat division
   * @returns {number} Syncopation score
   */
  static syncopation(e, t = 4) {
    if (e.length === 0) return 0;
    let r = 0;
    for (const n of e) {
      const i = n * t % 1;
      i > 0.2 && i < 0.8 && Math.abs(i - 0.5) > 0.2 && r++;
    }
    return r / e.length;
  }
  /**
   * Calculate contour entropy (melodic direction randomness)
   * @param {number[]} pitches - Pitch values
   * @returns {number} Contour entropy
   */
  static contourEntropy(e) {
    if (e.length < 2) return 0;
    const t = [];
    for (let s = 1; s < e.length; s++) {
      const a = e[s] - e[s - 1];
      a > 0 ? t.push(1) : a < 0 ? t.push(-1) : t.push(0);
    }
    const r = { up: 0, down: 0, same: 0 };
    for (const s of t)
      s > 0 ? r.up++ : s < 0 ? r.down++ : r.same++;
    const n = t.length;
    return -[
      r.up / n,
      r.down / n,
      r.same / n
    ].filter((s) => s > 0).reduce((s, a) => s + a * Math.log2(a), 0);
  }
  /**
   * Calculate interval variance (pitch stability)
   * @param {number[]} pitches - Pitch values
   * @returns {number} Interval variance
   */
  static intervalVariance(e) {
    if (e.length < 2) return 0;
    const t = [];
    for (let i = 1; i < e.length; i++)
      t.push(Math.abs(e[i] - e[i - 1]));
    const r = t.reduce((i, s) => i + s, 0) / t.length;
    return t.reduce(
      (i, s) => i + Math.pow(s - r, 2),
      0
    ) / t.length;
  }
  /**
   * Calculate note density (notes per unit time)
   * @param {JMonNote[]} notes - Array of notes
   * @param {number} [timeWindow=1] - Time window for density calculation
   * @returns {number} Note density
   */
  static density(e, t = 1) {
    if (e.length === 0) return 0;
    const r = e.map((a) => typeof a.time == "string" ? parseFloat(a.time) || 0 : a.time || 0), n = Math.min(...r), s = Math.max(...r) - n || 1;
    return e.length / (s / t);
  }
  /**
   * Calculate gap variance (timing consistency)
   * @param {number[]} onsets - Onset times
   * @returns {number} Gap variance
   */
  static gapVariance(e) {
    if (e.length < 2) return 0;
    const t = [];
    for (let i = 1; i < e.length; i++)
      t.push(e[i] - e[i - 1]);
    const r = t.reduce((i, s) => i + s, 0) / t.length;
    return t.reduce((i, s) => i + Math.pow(s - r, 2), 0) / t.length;
  }
  /**
   * Comprehensive analysis of a musical sequence
   * @param {JMonNote[]} notes - Array of notes to analyze
   * @param {AnalysisOptions} [options={}] - Analysis options
   * @returns {AnalysisResult} Analysis results
   */
  static analyze(e, t = {}) {
    const { scale: r = [0, 2, 4, 5, 7, 9, 11] } = t, n = e.map((s) => typeof s.note == "number" ? s.note : typeof s.note == "string" ? 60 : Array.isArray(s.note) ? s.note[0] : 60), i = e.map((s) => typeof s.time == "number" ? s.time : parseFloat(s.time) || 0);
    return {
      gini: this.gini(n),
      balance: this.balance(n),
      motif: this.motif(n),
      dissonance: this.dissonance(n, r),
      rhythmic: this.rhythmic(i),
      fibonacciIndex: this.fibonacciIndex(n),
      syncopation: this.syncopation(i),
      contourEntropy: this.contourEntropy(n),
      intervalVariance: this.intervalVariance(n),
      density: this.density(e),
      gapVariance: this.gapVariance(i)
    };
  }
}
const Xs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MusicalAnalysis: Qs,
  MusicalIndex: Ht
}, Symbol.toStringTag, { value: "Module" })), Zs = {
  harmony: $s,
  rhythm: Os,
  motifs: {
    MotifBank: qs
  }
}, ea = {
  theory: be
}, ta = {
  gaussian: {
    Regressor: wi,
    Kernel: Fs
  },
  automata: {
    Cellular: Gs
  },
  loops: Qt,
  genetic: {
    Darwin: Bs
  },
  walks: {
    Random: Us,
    Chain: Ks,
    Phasor: {
      Vector: We,
      System: kr
    }
  },
  fractals: {
    Mandelbrot: Js,
    LogisticMap: Hs
  },
  minimalism: {
    Process: Ys,
    Tintinnabuli: Ws
  }
}, ra = {
  ...Xs
}, na = {
  ...gs
}, nt = {
  theory: Zs,
  constants: ea,
  generative: ta,
  analysis: ra,
  utils: na
};
class yr {
  constructor(e = {}) {
    this.options = e;
  }
  // Parse bars:beats:ticks -> beats (supports fractional beats)
  static parseBBTToBeats(e, t = 4, r = 480) {
    if (typeof e == "number") return e;
    if (typeof e != "string") return 0;
    const n = e.match(/^(\d+):(\d+(?:\.\d+)?):(\d+)$/);
    if (!n) return 0;
    const i = parseInt(n[1], 10), s = parseFloat(n[2]), a = parseInt(n[3], 10);
    return i * t + s + a / r;
  }
  // Parse note value (e.g., 4n, 8n, 8t) or BBT to beats
  static parseDurationToBeats(e, t = 4, r = 480) {
    if (typeof e == "number") return e;
    if (typeof e != "string") return 0;
    if (/^\d+:\d+(?:\.\d+)?:\d+$/.test(e))
      return this.parseBBTToBeats(e, t, r);
    const n = e.match(/^(\d+)(n|t)$/);
    if (n) {
      const i = parseInt(n[1], 10), s = n[2];
      if (s === "n")
        return 4 / i;
      if (s === "t")
        return 4 / i * (2 / 3);
    }
    return 0;
  }
  convert(e) {
    return (e.tracks || []).map((r) => ({
      label: r.label,
      type: "PolySynth",
      // Default type for the current player
      part: (r.notes || []).map((n) => ({
        time: n.time,
        pitch: n.pitch,
        duration: n.duration,
        velocity: n.velocity || 0.8
      }))
    }));
  }
}
function _i(o, e = {}) {
  try {
    ai(o);
  } catch {
  }
  const n = new yr(e).convert(o).map((_, b) => ({
    originalTrackIndex: b,
    voiceIndex: 0,
    totalVoices: 1,
    trackInfo: { label: _.label },
    synthConfig: { type: _.type || "PolySynth" },
    partEvents: _.part || []
  })), i = o.tempo || o.metadata?.tempo || o.bpm || 120, [s, a] = (o.timeSignature || "4/4").split("/").map((_) => parseInt(_, 10)), c = isFinite(s) ? s : 4;
  let l = 0;
  n.forEach((_) => {
    _.partEvents && _.partEvents.length > 0 && _.partEvents.forEach((b) => {
      const $ = yr.parseBBTToBeats(b.time, c), m = yr.parseDurationToBeats(b.duration, c), h = $ + m;
      h > l && (l = h);
    });
  });
  const d = 60 / i, g = l * d;
  return console.log(`[TONEJS] Duration calc: totalBeats=${l.toFixed(2)} beats = ${g.toFixed(2)}s - loop ends exactly when last note finishes`), {
    tracks: n,
    metadata: {
      totalDuration: g,
      // Use total duration - loop should end when last note finishes
      tempo: i
    }
  };
}
const Xe = {
  // Piano Family
  0: { name: "Acoustic Grand Piano", folder: "acoustic_grand_piano-mp3" },
  1: { name: "Bright Acoustic Piano", folder: "bright_acoustic_piano-mp3" },
  2: { name: "Electric Grand Piano", folder: "electric_grand_piano-mp3" },
  3: { name: "Honky-tonk Piano", folder: "honkytonk_piano-mp3" },
  4: { name: "Electric Piano 1", folder: "electric_piano_1-mp3" },
  5: { name: "Electric Piano 2", folder: "electric_piano_2-mp3" },
  6: { name: "Harpsichord", folder: "harpsichord-mp3" },
  7: { name: "Clavinet", folder: "clavinet-mp3" },
  // Chromatic Percussion
  8: { name: "Celesta", folder: "celesta-mp3" },
  9: { name: "Glockenspiel", folder: "glockenspiel-mp3" },
  10: { name: "Music Box", folder: "music_box-mp3" },
  11: { name: "Vibraphone", folder: "vibraphone-mp3" },
  12: { name: "Marimba", folder: "marimba-mp3" },
  13: { name: "Xylophone", folder: "xylophone-mp3" },
  14: { name: "Tubular Bells", folder: "tubular_bells-mp3" },
  15: { name: "Dulcimer", folder: "dulcimer-mp3" },
  // Organ
  16: { name: "Drawbar Organ", folder: "drawbar_organ-mp3" },
  17: { name: "Percussive Organ", folder: "percussive_organ-mp3" },
  18: { name: "Rock Organ", folder: "rock_organ-mp3" },
  19: { name: "Church Organ", folder: "church_organ-mp3" },
  20: { name: "Reed Organ", folder: "reed_organ-mp3" },
  21: { name: "Accordion", folder: "accordion-mp3" },
  22: { name: "Harmonica", folder: "harmonica-mp3" },
  23: { name: "Tango Accordion", folder: "tango_accordion-mp3" },
  // Guitar
  24: { name: "Acoustic Guitar (nylon)", folder: "acoustic_guitar_nylon-mp3" },
  25: { name: "Acoustic Guitar (steel)", folder: "acoustic_guitar_steel-mp3" },
  26: { name: "Electric Guitar (jazz)", folder: "electric_guitar_jazz-mp3" },
  27: { name: "Electric Guitar (clean)", folder: "electric_guitar_clean-mp3" },
  28: { name: "Electric Guitar (muted)", folder: "electric_guitar_muted-mp3" },
  29: { name: "Overdriven Guitar", folder: "overdriven_guitar-mp3" },
  30: { name: "Distortion Guitar", folder: "distortion_guitar-mp3" },
  31: { name: "Guitar Harmonics", folder: "guitar_harmonics-mp3" },
  // Bass
  32: { name: "Acoustic Bass", folder: "acoustic_bass-mp3" },
  33: { name: "Electric Bass (finger)", folder: "electric_bass_finger-mp3" },
  34: { name: "Electric Bass (pick)", folder: "electric_bass_pick-mp3" },
  35: { name: "Fretless Bass", folder: "fretless_bass-mp3" },
  36: { name: "Slap Bass 1", folder: "slap_bass_1-mp3" },
  37: { name: "Slap Bass 2", folder: "slap_bass_2-mp3" },
  38: { name: "Synth Bass 1", folder: "synth_bass_1-mp3" },
  39: { name: "Synth Bass 2", folder: "synth_bass_2-mp3" },
  // Strings
  40: { name: "Violin", folder: "violin-mp3" },
  41: { name: "Viola", folder: "viola-mp3" },
  42: { name: "Cello", folder: "cello-mp3" },
  43: { name: "Contrabass", folder: "contrabass-mp3" },
  44: { name: "Tremolo Strings", folder: "tremolo_strings-mp3" },
  45: { name: "Pizzicato Strings", folder: "pizzicato_strings-mp3" },
  46: { name: "Orchestral Harp", folder: "orchestral_harp-mp3" },
  47: { name: "Timpani", folder: "timpani-mp3" },
  // Popular selections for common use
  48: { name: "String Ensemble 1", folder: "string_ensemble_1-mp3" },
  49: { name: "String Ensemble 2", folder: "string_ensemble_2-mp3" },
  56: { name: "Trumpet", folder: "trumpet-mp3" },
  57: { name: "Trombone", folder: "trombone-mp3" },
  58: { name: "Tuba", folder: "tuba-mp3" },
  64: { name: "Soprano Sax", folder: "soprano_sax-mp3" },
  65: { name: "Alto Sax", folder: "alto_sax-mp3" },
  66: { name: "Tenor Sax", folder: "tenor_sax-mp3" },
  67: { name: "Baritone Sax", folder: "baritone_sax-mp3" },
  68: { name: "Oboe", folder: "oboe-mp3" },
  69: { name: "English Horn", folder: "english_horn-mp3" },
  70: { name: "Bassoon", folder: "bassoon-mp3" },
  71: { name: "Clarinet", folder: "clarinet-mp3" },
  72: { name: "Piccolo", folder: "piccolo-mp3" },
  73: { name: "Flute", folder: "flute-mp3" },
  74: { name: "Recorder", folder: "recorder-mp3" }
}, xr = [
  "https://raw.githubusercontent.com/jmonlabs/midi-js-soundfonts/gh-pages/FluidR3_GM",
  "https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@gh-pages/FluidR3_GM"
];
function ot(o, e = xr[0], t = [21, 108], r = "complete") {
  const n = Xe[o];
  if (!n)
    return console.warn(
      `GM program ${o} not found, using Acoustic Grand Piano`
    ), ot(0, e, t);
  const i = {}, [s, a] = t;
  let c = [];
  switch (r) {
    case "minimal":
      for (let l = s; l <= a; l += 12)
        c.push(l);
      c.push(60);
      break;
    case "balanced":
      for (let l = s; l <= a; l += 4)
        c.push(l);
      [60, 64, 67].forEach((l) => {
        l >= s && l <= a && !c.includes(l) && c.push(l);
      });
      break;
    case "quality":
      for (let l = s; l <= a; l += 3)
        c.push(l);
      break;
    case "complete":
      for (let l = s; l <= a; l++)
        c.push(l);
      break;
    default:
      return console.warn(`Unknown sampling strategy '${r}', using 'balanced'`), ot(o, e, t, "balanced");
  }
  c = [...new Set(c)].sort((l, d) => l - d);
  for (const l of c) {
    const d = oa(l);
    i[d] = ia(n.folder, d, e);
  }
  return console.log(
    `[GM INSTRUMENT] Generated ${Object.keys(i).length} sample URLs for ${n.name} (${r} strategy)`
  ), i;
}
function ia(o, e, t) {
  return `${t}/${o}/${e}.mp3`;
}
function oa(o) {
  const e = [
    "C",
    "Db",
    "D",
    "Eb",
    "E",
    "F",
    "Gb",
    "G",
    "Ab",
    "A",
    "Bb",
    "B"
  ], t = Math.floor(o / 12) - 1, r = o % 12;
  return `${e[r]}${t}`;
}
function $i(o) {
  const e = o.toLowerCase().trim();
  for (const [t, r] of Object.entries(Xe))
    if (r.name.toLowerCase() === e)
      return parseInt(t, 10);
  for (const [t, r] of Object.entries(Xe)) {
    const n = r.name.toLowerCase();
    if (n.includes(e) || e.includes(n.split(" ")[0]))
      return parseInt(t, 10);
  }
  return null;
}
function sa(o, e, t = {}, r = "destination") {
  let n;
  if (typeof e == "string") {
    if (n = $i(e), n === null) {
      console.warn(`GM instrument "${e}" not found. Available instruments:`);
      const d = Object.values(Xe).map((g) => g.name).slice(0, 10);
      console.warn(`Examples: ${d.join(", ")}...`), console.warn("Using Acoustic Grand Piano as fallback"), n = 0;
    }
  } else
    n = e;
  if (!Xe[n]) return null;
  const {
    baseUrl: s = xr[0],
    noteRange: a = [21, 108],
    // Complete MIDI range for maximum quality
    envelope: c = { attack: 0.1, release: 1 },
    strategy: l = "complete"
    // Use complete sampling by default
  } = t;
  return {
    id: o,
    type: "Sampler",
    options: {
      urls: ot(n, s, a, l),
      baseUrl: "",
      // URLs are already complete
      envelope: {
        enabled: !0,
        attack: c.attack,
        release: c.release
      }
    },
    target: r
  };
}
function Si() {
  return [
    // Piano & Keys
    { program: 0, name: "Acoustic Grand Piano", category: "Piano" },
    { program: 1, name: "Bright Acoustic Piano", category: "Piano" },
    { program: 4, name: "Electric Piano 1", category: "Piano" },
    { program: 6, name: "Harpsichord", category: "Piano" },
    // Strings
    { program: 40, name: "Violin", category: "Strings" },
    { program: 42, name: "Cello", category: "Strings" },
    { program: 48, name: "String Ensemble 1", category: "Strings" },
    // Brass
    { program: 56, name: "Trumpet", category: "Brass" },
    { program: 57, name: "Trombone", category: "Brass" },
    // Woodwinds
    { program: 65, name: "Alto Sax", category: "Woodwinds" },
    { program: 71, name: "Clarinet", category: "Woodwinds" },
    { program: 73, name: "Flute", category: "Woodwinds" },
    // Guitar & Bass
    { program: 24, name: "Acoustic Guitar (nylon)", category: "Guitar" },
    { program: 25, name: "Acoustic Guitar (steel)", category: "Guitar" },
    { program: 33, name: "Electric Bass (finger)", category: "Bass" },
    // Organ & Accordion
    { program: 16, name: "Drawbar Organ", category: "Organ" },
    { program: 21, name: "Accordion", category: "Organ" }
  ];
}
const aa = [
  "Reverb",
  "JCReverb",
  "Freeverb"
], ca = [
  "Delay",
  "FeedbackDelay",
  "PingPongDelay"
], la = [
  "Chorus",
  "Phaser",
  "Tremolo",
  "Vibrato",
  "AutoWah"
], ua = [
  "Distortion",
  "Chebyshev",
  "BitCrusher"
], da = [
  "Compressor",
  "Limiter",
  "Gate",
  "MidSideCompressor"
], ha = [
  "Filter",
  "AutoFilter"
], fa = [
  "FrequencyShifter",
  "PitchShift",
  "StereoWidener"
], pa = [
  ...aa,
  ...ca,
  ...la,
  ...ua,
  ...da,
  ...ha,
  ...fa
], ma = [
  "Synth",
  "PolySynth",
  "MonoSynth",
  "AMSynth",
  "FMSynth",
  "DuoSynth",
  "PluckSynth",
  "NoiseSynth"
], ei = {
  MAX_WIDTH: 800,
  MIN_WIDTH: 0
}, vr = {
  MARGIN: "8px 0",
  GAP: 12,
  UPDATE_INTERVAL: 100
  // ms between timeline updates
}, ga = {}, ya = {
  DEFAULT_TEMPO: 120
}, br = {
  INVALID_COMPOSITION: "Composition must be a valid JMON object",
  NO_SEQUENCES_OR_TRACKS: "Composition must have sequences or tracks",
  TRACKS_MUST_BE_ARRAY: "Tracks/sequences must be an array"
}, wr = {
  PLAYER: "[PLAYER]"
};
function Ar(o, e = {}) {
  if (!o || typeof o != "object")
    throw console.error(`${wr.PLAYER} Invalid composition:`, o), new Error(br.INVALID_COMPOSITION);
  const {
    autoplay: t = !1,
    showDebug: r = !1,
    customInstruments: n = {},
    autoMultivoice: i = !0,
    maxVoices: s = 4,
    Tone: a = null
  } = e;
  if (!o.sequences && !o.tracks)
    throw console.error(
      `${wr.PLAYER} No sequences or tracks found in composition:`,
      o
    ), new Error(br.NO_SEQUENCES_OR_TRACKS);
  const c = o.tracks || o.sequences || [];
  if (!Array.isArray(c))
    throw console.error(`${wr.PLAYER} Tracks/sequences must be an array:`, c), new Error(br.TRACKS_MUST_BE_ARRAY);
  const l = o.tempo || o.bpm || ya.DEFAULT_TEMPO, g = _i(o, { autoMultivoice: i, maxVoices: s, showDebug: r }), { tracks: _, metadata: b } = g;
  let $ = b.totalDuration;
  const m = ga, h = document.createElement("div");
  h.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        background-color: ${m.background};
        color: ${m.text};
        padding: 16px 16px 8px 16px;
        border-radius: 12px;
        width: 100%;
        max-width: ${ei.MAX_WIDTH}px;
        min-width: ${ei.MIN_WIDTH};
        border: 1px solid ${m.border};
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
    `;
  const p = document.createElement("style");
  p.textContent = `
        /* iOS audio improvements */
        .jmon-music-player-container {
            -webkit-user-select: none;
            -webkit-touch-callout: none;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
        }
        .jmon-music-player-play {
            -webkit-user-select: none;
            -webkit-touch-callout: none;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
        }
        
        /* Button hover effects */
        .jmon-music-player-btn-vertical:hover {
            background-color: #555555 !important;
            transform: translateY(-1px);
        }
        .jmon-music-player-btn-vertical:active {
            transform: translateY(0px);
        }
        
        /* Large screens: Show vertical downloads, hide horizontal ones, horizontal track layout */
        @media (min-width: 600px) {
            .jmon-music-player-downloads {
                display: none !important;
            }
            .jmon-music-player-vertical-downloads {
                display: flex !important;
            }
            .jmon-music-player-top {
                gap: 32px !important;
            }
            .jmon-music-player-right {
                min-width: 140px !important;
                max-width: 160px !important;
            }
            .jmon-track-selector {
                flex-direction: row !important;
                align-items: center !important;
                gap: 16px !important;
            }
            .jmon-track-selector label {
                min-width: 120px !important;
                margin-bottom: 0 !important;
                flex-shrink: 0 !important;
            }
            .jmon-track-selector select {
                flex: 1 !important;
            }
        }
        
        /* Medium screens: Compact layout with horizontal track selectors */
        @media (min-width: 481px) and (max-width: 799px) {
            .jmon-music-player-downloads {
                display: none !important;
            }
            .jmon-music-player-vertical-downloads {
                display: flex !important;
            }
            .jmon-music-player-top {
                gap: 20px !important;
            }
            .jmon-music-player-right {
                min-width: 120px !important;
                max-width: 140px !important;
            }
            .jmon-track-selector {
                flex-direction: row !important;
                align-items: center !important;
                gap: 12px !important;
            }
            .jmon-track-selector label {
                min-width: 100px !important;
                margin-bottom: 0 !important;
                flex-shrink: 0 !important;
                font-size: 14px !important;
            }
            .jmon-track-selector select {
                flex: 1 !important;
            }
        }
        
        /* Small screens: Mobile layout */
        @media (max-width: 480px) {
            .jmon-music-player-downloads {
                display: flex !important;
            }
            .jmon-music-player-vertical-downloads {
                display: none !important;
            }
            .jmon-music-player-container {
                padding: 8px !important;
                border-radius: 8px !important;
                max-width: 100vw !important;
                min-width: 0 !important;
                box-shadow: none !important;
            }
            .jmon-music-player-top {
                flex-direction: column !important;
                gap: 12px !important;
                align-items: stretch !important;
            }
            .jmon-music-player-left, .jmon-music-player-right {
                width: 100% !important;
                min-width: 0 !important;
                max-width: none !important;
                flex: none !important;
            }
            .jmon-music-player-right {
                gap: 12px !important;
            }
            .jmon-track-selector {
                flex-direction: column !important;
                align-items: stretch !important;
                gap: 8px !important;
            }
            .jmon-track-selector label {
                min-width: auto !important;
                margin-bottom: 0 !important;
            }
            .jmon-track-selector select {
                flex: none !important;
            }
            .jmon-music-player-timeline {
                gap: 8px !important;
                margin: 6px 0 !important;
            }
            .jmon-music-player-downloads {
                flex-direction: column !important;
                gap: 8px !important;
                margin-top: 6px !important;
            }
            .jmon-music-player-btn {
                min-height: 40px !important;
                font-size: 14px !important;
                padding: 10px 0 !important;
            }
            .jmon-music-player-play {
                width: 40px !important;
                height: 40px !important;
                min-width: 40px !important;
                max-width: 40px !important;
                padding: 8px !important;
                margin: 0 4px !important;
                border-radius: 50% !important;
                flex-shrink: 0 !important;
            }
            .jmon-music-player-stop {
                width: 40px !important;
                height: 40px !important;
                min-width: 40px !important;
                max-width: 40px !important;
                padding: 8px !important;
                margin: 0 4px !important;
                flex-shrink: 0 !important;
            }
        }
    `, document.head.appendChild(p), h.classList.add("jmon-music-player-container");
  const u = document.createElement("div");
  u.style.cssText = `
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto auto;
        gap: 12px;
        margin-bottom: 0px;
        font-family: 'PT Sans', sans-serif;
    `, u.classList.add("jmon-music-player-main");
  const f = document.createElement("div");
  f.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        font-family: 'PT Sans', sans-serif;
        gap: 24px;
        flex-wrap: wrap;
    `, f.classList.add("jmon-music-player-top");
  const w = document.createElement("div");
  w.style.cssText = `
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
        box-sizing: border-box;
    `, w.classList.add("jmon-music-player-left");
  const v = document.createElement("div");
  v.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 6px;
    `;
  const S = Si(), P = o.tracks || [], A = [];
  P.forEach((B, K) => {
    const J = _.find(
      (pe) => pe.originalTrackIndex === K
    )?.analysis;
    J?.hasGlissando && console.warn(
      `Track ${B.label || B.name || K + 1} contient un glissando : la polyphonie sera désactivée pour cette piste.`
    );
    const W = document.createElement("div");
    W.style.cssText = `
            margin-bottom: 8px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        `, W.classList.add("jmon-track-selector");
    const ie = document.createElement("label");
    ie.textContent = B.label || `Track ${K + 1}`, ie.style.cssText = `
            font-family: 'PT Sans', sans-serif;
            font-size: 16px;
            color: ${m.text};
            display: block;
            margin-bottom: 0;
            font-weight: normal;
            flex-shrink: 0;
        `;
    const le = document.createElement("select");
    le.style.cssText = `
            padding: 4px;
            border: 1px solid ${m.secondary};
            border-radius: 4px;
            background-color: ${m.background};
            color: ${m.text};
            font-size: 12px;
            width: 100%;
            height: 28px;
            box-sizing: border-box;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            margin: 0;
            outline: none;
        `;
    const $e = document.createElement("optgroup");
    $e.label = "Synthesizers";
    const we = [
      "PolySynth",
      "Synth",
      "AMSynth",
      "DuoSynth",
      "FMSynth",
      "MembraneSynth",
      "MetalSynth",
      "MonoSynth",
      "PluckSynth"
    ], xe = o.audioGraph || [];
    if (Array.isArray(xe) && xe.length > 0) {
      const pe = o.tracks?.[K]?.synthRef;
      xe.forEach((ee) => {
        if (ee.id && ee.type && ee.type !== "Destination") {
          const Se = document.createElement("option");
          Se.value = `AudioGraph: ${ee.id}`, Se.textContent = ee.id, pe === ee.id && (Se.selected = !0), $e.appendChild(Se);
        }
      });
    }
    we.forEach((pe) => {
      const ee = document.createElement("option");
      ee.value = pe, ee.textContent = pe, (J?.hasGlissando && pe === "Synth" || !J?.hasGlissando && !o.tracks?.[K]?.synthRef && pe === "PolySynth") && (ee.selected = !0), J?.hasGlissando && (pe === "PolySynth" || pe === "DuoSynth") && (ee.disabled = !0, ee.textContent += " (mono only for glissando)"), $e.appendChild(ee);
    }), le.appendChild($e);
    const qe = document.createElement("optgroup");
    qe.label = "Sampled Instruments";
    const ke = {};
    S.forEach((pe) => {
      ke[pe.category] || (ke[pe.category] = []), ke[pe.category].push(pe);
    }), Object.keys(ke).sort().forEach((pe) => {
      const ee = document.createElement("optgroup");
      ee.label = pe, ke[pe].forEach((Se) => {
        const ce = document.createElement("option");
        ce.value = `GM: ${Se.name}`, ce.textContent = Se.name, J?.hasGlissando && (ce.disabled = !0, ce.textContent += " (not suitable for glissando)"), ee.appendChild(ce);
      }), le.appendChild(ee);
    }), A.push(le), W.append(ie, le), v.appendChild(W);
  }), w.appendChild(v);
  const C = document.createElement("div");
  C.style.cssText = `
        display: flex;
        flex-direction: column;
        min-width: 120px;
        max-width: 150px;
        box-sizing: border-box;
        gap: 16px;
    `, C.classList.add("jmon-music-player-right");
  const O = document.createElement("div");
  O.style.cssText = `
        display: flex;
        flex-direction: column;
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
    `;
  const D = document.createElement("label");
  D.textContent = "Tempo", D.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        font-size: 16px;
        font-weight: normal;
        margin-bottom: 8px;
        color: ${m.text};
    `;
  const V = document.createElement("input");
  V.type = "number", V.min = 60, V.max = 240, V.value = l, V.style.cssText = `
        padding: 4px;
        border: 1px solid ${m.secondary};
        border-radius: 4px;
        background-color: ${m.background};
        color: ${m.text};
        font-size: 12px;
        text-align: center;
        width: 100%;
        height: 28px;
        box-sizing: border-box;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        margin: 0;
        outline: none;
    `, O.append(D, V);
  const L = document.createElement("div");
  L.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 8px;
    `, L.classList.add("jmon-music-player-vertical-downloads");
  const F = document.createElement("button");
  F.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music" style="margin-right: 8px;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg><span>MIDI</span>', F.style.cssText = `
        padding: 12px 16px;
        border: none;
        border-radius: 8px;
        background-color: #333333;
        color: white;
        font-family: 'PT Sans', sans-serif;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        box-sizing: border-box;
    `, F.classList.add("jmon-music-player-btn-vertical");
  const Y = document.createElement("button");
  Y.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-audio-lines" style="margin-right: 8px;"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg><span>WAV</span>', Y.style.cssText = `
        padding: 12px 16px;
        border: none;
        border-radius: 8px;
        background-color: #333333;
        color: white;
        font-family: 'PT Sans', sans-serif;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        box-sizing: border-box;
    `, Y.classList.add("jmon-music-player-btn-vertical"), L.append(F, Y), L.style.display = "none", C.append(O, L);
  const de = document.createElement("div");
  de.style.cssText = `
        position: relative;
        width: 100%;
        margin: ${vr.MARGIN};
        display: flex;
        align-items: center;
        gap: ${vr.GAP}px;
        min-width: 0;
        box-sizing: border-box;
    `, de.classList.add("jmon-music-player-timeline");
  const oe = document.createElement("div");
  oe.textContent = "0:00", oe.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        font-size: 14px;
        color: ${m.text};
        min-width: 40px;
        text-align: center;
    `;
  const re = document.createElement("div");
  re.textContent = "0:00", re.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        font-size: 14px;
        color: ${m.text};
        min-width: 40px;
        text-align: center;
    `;
  const se = document.createElement("input");
  se.type = "range", se.min = 0, se.max = 100, se.value = 0, se.style.cssText = `
        flex-grow: 1;
        -webkit-appearance: none;
        background: ${m.secondary};
        outline: none;
        border-radius: 15px;
        overflow: visible;
        height: 8px;
    `;
  const q = document.createElement("style");
  q.textContent = `
        input[type="range"].jmon-timeline-slider {
            background: ${m.secondary} !important;
            border: 1px solid ${m.border} !important;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.1) !important;
        }
        input[type="range"].jmon-timeline-slider::-webkit-slider-track {
            background: ${m.secondary} !important;
            height: 8px !important;
            border-radius: 15px !important;
            border: 1px solid ${m.border} !important;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.1) !important;
        }
        input[type="range"].jmon-timeline-slider::-moz-range-track {
            background: ${m.secondary} !important;
            height: 8px !important;
            border-radius: 15px !important;
            border: 1px solid ${m.border} !important;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.1) !important;
        }
        input[type="range"].jmon-timeline-slider::-webkit-slider-thumb {
            -webkit-appearance: none !important;
            appearance: none !important;
            height: 20px !important;
            width: 20px !important;
            border-radius: 50% !important;
            background: ${m.primary} !important;
            cursor: pointer !important;
            border: 2px solid ${m.background} !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important;
        }
        input[type="range"].jmon-timeline-slider::-moz-range-thumb {
            height: 20px !important;
            width: 20px !important;
            border-radius: 50% !important;
            background: ${m.primary} !important;
            cursor: pointer !important;
            border: 2px solid ${m.background} !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important;
        }
    `, document.head.appendChild(q), se.classList.add("jmon-timeline-slider");
  const M = document.createElement("button");
  M.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>', M.style.cssText = `
        width: 40px;
        height: 40px;
        min-width: 40px;
        max-width: 40px;
        padding: 8px;
        border: none;
        border-radius: 50%;
        background-color: ${m.primary};
        color: ${m.background};
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0px 5px 0px 10px;
        box-sizing: border-box;
        flex-shrink: 0;
    `, M.classList.add("jmon-music-player-play");
  const I = document.createElement("button");
  I.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>', I.style.cssText = `
        width: 40px;
        height: 40px;
        min-width: 40px;
        max-width: 40px;
        padding: 8px;
        border: none;
        border-radius: 8px;
        background-color: ${m.secondary};
        color: ${m.text};
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0px 5px 0px 0px;
        box-sizing: border-box;
        flex-shrink: 0;
    `, I.classList.add("jmon-music-player-stop");
  const N = document.createElement("div");
  N.style.cssText = `
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: ${m.lightText};
        margin: 0px 0px 0px 10px;
    `;
  const y = document.createElement("div");
  y.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0px;
    `, y.append(M, I), de.append(oe, se, re, y);
  const E = document.createElement("div");
  E.style.cssText = `
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        gap: 10px;
        min-width: 0;
        box-sizing: border-box;
    `, E.classList.add("jmon-music-player-downloads");
  const R = document.createElement("button");
  R.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music" style="margin-right: 5px;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg><span>MIDI</span>', R.style.cssText = `
        padding: 15px 30px;
        margin: 0 5px;
        border: none;
        border-radius: 8px;
        background-color: #333333;
        color: white;
        font-family: 'PT Sans', sans-serif;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.3s ease;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 50px;
        min-width: 0;
        box-sizing: border-box;
    `, R.classList.add("jmon-music-player-btn");
  const G = document.createElement("button");
  G.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-audio-lines" style="margin-right: 5px;"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg><span>WAV</span>', G.style.cssText = `
        padding: 15px 30px;
        margin: 0 5px;
        border: none;
        border-radius: 8px;
        background-color: #333333;
        color: white;
        font-family: 'PT Sans', sans-serif;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.3s ease;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 50px;
        min-width: 0;
        box-sizing: border-box;
    `, G.classList.add("jmon-music-player-btn"), E.append(R, G), f.append(w, C), u.appendChild(f), u.appendChild(de), h.append(
    u,
    E
  );
  let k, Q = !1, X = [], T = [], x = [], j = null;
  const z = o.tracks || [], U = () => {
    if (!k || !o.audioGraph || !Array.isArray(o.audioGraph))
      return null;
    const B = {}, K = (J) => {
      const W = {};
      return Object.entries(J || {}).forEach(([ie, le]) => {
        let $e = ie;
        if (typeof ie == "number" || /^\d+$/.test(String(ie)))
          try {
            $e = k.Frequency(parseInt(ie, 10), "midi").toNote();
          } catch {
          }
        W[$e] = le;
      }), W;
    };
    try {
      return o.audioGraph.forEach((J) => {
        const { id: W, type: ie, options: le = {}, target: $e } = J;
        if (!W || !ie) return;
        let we = null;
        if (ie === "Sampler") {
          const xe = K(le.urls);
          let qe, ke;
          const pe = new Promise((Se, ce) => {
            qe = Se, ke = ce;
          }), ee = {
            urls: xe,
            onload: () => qe && qe(),
            onerror: (Se) => {
              console.error(`[PLAYER] Sampler load error for ${W}:`, Se), ke && ke(Se);
            }
          };
          le.baseUrl && (ee.baseUrl = le.baseUrl);
          try {
            console.log(
              `[PLAYER] Building Sampler ${W} with urls:`,
              xe,
              "baseUrl:",
              ee.baseUrl || "(none)"
            ), we = new k.Sampler(ee);
          } catch (Se) {
            console.error("[PLAYER] Failed to create Sampler:", Se), we = null;
          }
          x.push(pe), we && le.envelope && le.envelope.enabled && (typeof le.envelope.attack == "number" && (we.attack = le.envelope.attack), typeof le.envelope.release == "number" && (we.release = le.envelope.release));
        } else if (ma.includes(ie))
          try {
            we = new k[ie](le);
          } catch (xe) {
            console.warn(
              `[PLAYER] Failed to create ${ie} from audioGraph, using PolySynth:`,
              xe
            ), we = new k.PolySynth();
          }
        else if (pa.includes(ie))
          try {
            we = new k[ie](le), console.log(`[PLAYER] Created effect ${W} (${ie}) with options:`, le);
          } catch (xe) {
            console.warn(`[PLAYER] Failed to create ${ie} effect:`, xe), we = null;
          }
        else ie === "Destination" && (B[W] = k.Destination);
        we && (B[W] = we);
      }), Object.keys(B).length > 0 && o.audioGraph.forEach((J) => {
        const { id: W, target: ie } = J;
        if (!W || !B[W]) return;
        const le = B[W];
        if (le !== k.Destination)
          if (ie && B[ie])
            try {
              B[ie] === k.Destination ? (le.toDestination(), console.log(`[PLAYER] Connected ${W} -> Destination`)) : (le.connect(B[ie]), console.log(`[PLAYER] Connected ${W} -> ${ie}`));
            } catch ($e) {
              console.warn(`[PLAYER] Failed to connect ${W} -> ${ie}:`, $e), le.toDestination();
            }
          else
            le.toDestination(), console.log(`[PLAYER] Connected ${W} -> Destination (no target specified)`);
      }), B;
    } catch (J) {
      return console.error("[PLAYER] Failed building audioGraph instruments:", J), null;
    }
  }, Z = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1, he = (B) => `${Math.floor(B / 60)}:${Math.floor(B % 60).toString().padStart(2, "0")}`;
  re.textContent = he($);
  const Te = async () => {
    if (typeof window < "u") {
      const B = a || window.Tone || (typeof k < "u" ? k : null);
      if (B)
        console.log(
          "[PLAYER] Using existing Tone.js, version:",
          B.version || "unknown"
        ), window.Tone = B;
      else
        try {
          if (typeof require < "u") {
            console.log("[PLAYER] Loading Tone.js via require()...");
            const J = await require("tone@14.8.49/build/Tone.js");
            window.Tone = J.default || J.Tone || J;
          } else {
            console.log("[PLAYER] Loading Tone.js via import()...");
            const J = await import("https://esm.sh/tone@14.8.49");
            window.Tone = J.default || J.Tone || J;
          }
          if (!window.Tone || typeof window.Tone != "object" || !window.Tone.PolySynth) {
            console.warn(
              "[PLAYER] First load attempt failed, trying alternative CDN..."
            );
            try {
              const J = await import("https://cdn.skypack.dev/tone@14.8.49");
              if (window.Tone = J.default || J.Tone || J, !window.Tone || !window.Tone.PolySynth)
                throw new Error("Alternative CDN also failed");
            } catch {
              console.warn(
                "[PLAYER] Alternative CDN failed, trying jsdelivr..."
              );
              try {
                const W = await import("https://cdn.jsdelivr.net/npm/tone@14.8.49/build/Tone.js");
                if (window.Tone = W.default || W.Tone || W, !window.Tone || !window.Tone.PolySynth)
                  throw new Error("All CDN attempts failed");
              } catch {
                throw new Error(
                  "Loaded Tone.js but got invalid object from all CDNs"
                );
              }
            }
          }
          console.log(
            "[PLAYER] Tone.js loaded successfully, version:",
            window.Tone.version || "unknown"
          );
        } catch (J) {
          return console.warn("Could not auto-load Tone.js:", J.message), console.log(
            "To use the player, load Tone.js manually first using one of these methods:"
          ), console.log(
            'Method 1: Tone = await require("tone@14.8.49/build/Tone.js")'
          ), console.log(
            'Method 2: Tone = await import("https://esm.sh/tone@14.8.49").then(m => m.default)'
          ), console.log(
            'Method 3: Tone = await import("https://cdn.skypack.dev/tone@14.8.49").then(m => m.default)'
          ), !1;
        }
      const K = window.Tone || B;
      if (K)
        return k = K, console.log("[PLAYER] Available Tone constructors:", {
          PolySynth: typeof k.PolySynth,
          Synth: typeof k.Synth,
          Part: typeof k.Part,
          Transport: typeof k.Transport,
          start: typeof k.start,
          context: !!k.context
        }), console.log(
          "[PLAYER] Tone.js initialized, context state:",
          k.context ? k.context.state : "no context"
        ), Z() && console.log("[PLAYER] iOS device detected - audio context will start on user interaction"), !0;
    }
    return console.warn("Tone.js not available"), !1;
  }, me = () => {
    if (!k) {
      console.warn("[PLAYER] Tone.js not available, cannot setup audio");
      return;
    }
    const B = [];
    if (k.PolySynth || B.push("PolySynth"), k.Synth || B.push("Synth"), k.Part || B.push("Part"), k.Transport || B.push("Transport"), B.length > 0) {
      console.error(
        "[PLAYER] Tone.js is missing required constructors:",
        B
      ), console.error(
        "[PLAYER] Available Tone properties:",
        Object.keys(k).filter((K) => typeof k[K] == "function").slice(
          0,
          20
        )
      ), console.error("[PLAYER] Tone object:", k), console.error(
        "[PLAYER] This usually means Tone.js did not load correctly. Try refreshing the page or loading Tone.js manually."
      );
      return;
    }
    if (k.Transport.bpm.value = b.tempo, console.log(
      `[PLAYER] Set Transport BPM to ${b.tempo} before building instruments`
    ), !j && (j = U(), j)) {
      const K = Object.keys(j).filter(
        (J) => j[J] && j[J].name === "Sampler"
      );
      K.length > 0 && console.log(
        "[PLAYER] Using audioGraph Samplers for tracks with synthRef:",
        K
      );
    }
    console.log("[PLAYER] Cleaning up existing audio...", {
      synths: X.length,
      parts: T.length
    }), k.Transport.stop(), k.Transport.position = 0, T.forEach((K, J) => {
      try {
        K.stop();
      } catch (W) {
        console.warn(`[PLAYER] Failed to stop part ${J}:`, W);
      }
    }), T.forEach((K, J) => {
      try {
        K.dispose();
      } catch (W) {
        console.warn(`[PLAYER] Failed to dispose part ${J}:`, W);
      }
    }), X.forEach((K, J) => {
      if (!j || !Object.values(j).includes(K))
        try {
          K.disconnect && typeof K.disconnect == "function" && K.disconnect(), K.dispose();
        } catch (W) {
          console.warn(`[PLAYER] Failed to dispose synth ${J}:`, W);
        }
    }), X = [], T = [], console.log("[PLAYER] Audio cleanup completed"), console.log("[PLAYER] Converted tracks:", _.length), _.forEach((K) => {
      const {
        originalTrackIndex: J,
        voiceIndex: W,
        totalVoices: ie,
        trackInfo: le,
        synthConfig: $e,
        partEvents: we
      } = K, qe = (z[J] || {}).synthRef, ke = 60 / b.tempo, pe = (we || []).map((ce) => {
        const H = typeof ce.time == "number" ? ce.time * ke : ce.time, fe = typeof ce.duration == "number" ? ce.duration * ke : ce.duration;
        return { ...ce, time: H, duration: fe };
      });
      let ee = null;
      if (qe && j && j[qe])
        ee = j[qe];
      else {
        const ce = A[J] ? A[J].value : $e.type;
        try {
          if (ce.startsWith("AudioGraph: ")) {
            const H = ce.substring(12);
            if (j && j[H])
              ee = j[H], console.log(
                `[PLAYER] Using audioGraph instrument: ${H}`
              );
            else
              throw new Error(
                `AudioGraph instrument ${H} not found`
              );
          } else if (ce.startsWith("GM: ")) {
            const H = ce.substring(4), fe = S.find(
              (ye) => ye.name === H
            );
            if (fe) {
              console.log(`[PLAYER] Loading GM instrument: ${H}`);
              const ye = ot(
                fe.program,
                xr[0],
                [36, 84],
                "balanced"
              );
              console.log(
                `[PLAYER] Loading GM instrument ${H} with ${Object.keys(ye).length} samples`
              ), console.log(
                "[PLAYER] Sample notes:",
                Object.keys(ye).sort()
              ), ee = new k.Sampler({
                urls: ye,
                onload: () => console.log(
                  `[PLAYER] GM instrument ${H} loaded successfully`
                ),
                onerror: (Ae) => {
                  console.error(
                    `[PLAYER] Failed to load GM instrument ${H}:`,
                    Ae
                  );
                }
              }).toDestination();
            } else
              throw new Error(`GM instrument ${H} not found`);
          } else {
            const H = $e.reason === "glissando_compatibility" ? $e.type : ce;
            if (!k[H] || typeof k[H] != "function")
              throw new Error(`Tone.${H} is not a constructor`);
            ee = new k[H]().toDestination(), $e.reason === "glissando_compatibility" && W === 0 && console.warn(
              `[MULTIVOICE] Using ${H} instead of ${$e.original} for glissando in ${le.label}`
            );
          }
        } catch (H) {
          console.warn(
            `Failed to create ${ce}, using PolySynth:`,
            H
          );
          try {
            if (!k.PolySynth || typeof k.PolySynth != "function")
              throw new Error("Tone.PolySynth is not available");
            ee = new k.PolySynth().toDestination();
          } catch (fe) {
            console.error(
              "Fatal: Cannot create any synth, Tone.js may not be properly loaded:",
              fe
            );
            return;
          }
        }
      }
      X.push(ee), ie > 1 && console.log(
        `[MULTIVOICE] Track "${le.label}" voice ${W + 1}: ${we.length} notes`
      );
      const Se = new k.Part((ce, H) => {
        if (Array.isArray(H.pitch))
          H.pitch.forEach((fe) => {
            let ye = "C4";
            typeof fe == "number" ? ye = k.Frequency(fe, "midi").toNote() : typeof fe == "string" ? ye = fe : Array.isArray(fe) && typeof fe[0] == "string" && (ye = fe[0]), ee.triggerAttackRelease(ye, H.duration, ce);
          });
        else if (H.articulation === "glissando" && H.glissTarget !== void 0) {
          let fe = typeof H.pitch == "number" ? k.Frequency(H.pitch, "midi").toNote() : H.pitch, ye = typeof H.glissTarget == "number" ? k.Frequency(H.glissTarget, "midi").toNote() : H.glissTarget;
          console.log("[PLAYER] Glissando", {
            fromNote: fe,
            toNote: ye,
            duration: H.duration,
            time: ce
          }), console.log(
            "[PLAYER] Glissando effect starting from",
            fe,
            "to",
            ye
          ), ee.triggerAttack(fe, ce, H.velocity || 0.8);
          const Ae = k.Frequency(fe).toFrequency(), jr = k.Frequency(ye).toFrequency(), Ir = 1200 * Math.log2(jr / Ae);
          if (ee.detune && ee.detune.setValueAtTime && ee.detune.linearRampToValueAtTime)
            ee.detune.setValueAtTime(0, ce), ee.detune.linearRampToValueAtTime(
              Ir,
              ce + H.duration
            ), console.log(
              "[PLAYER] Applied detune glissando:",
              Ir,
              "cents over",
              H.duration,
              "beats"
            );
          else {
            const ki = k.Frequency(fe).toMidi(), xi = k.Frequency(ye).toMidi(), at = Math.max(3, Math.abs(xi - ki)), Or = H.duration / at;
            for (let ct = 1; ct < at; ct++) {
              const Ai = ct / (at - 1), Ni = Ae * Math.pow(jr / Ae, Ai), Ri = k.Frequency(Ni).toNote(), Ci = ce + ct * Or;
              ee.triggerAttackRelease(
                Ri,
                Or * 0.8,
                Ci,
                (H.velocity || 0.8) * 0.7
              );
            }
            console.log(
              "[PLAYER] Applied chromatic glissando with",
              at,
              "steps"
            );
          }
          ee.triggerRelease(ce + H.duration);
        } else {
          let fe = "C4";
          typeof H.pitch == "number" ? fe = k.Frequency(H.pitch, "midi").toNote() : typeof H.pitch == "string" ? fe = H.pitch : Array.isArray(H.pitch) && typeof H.pitch[0] == "string" && (fe = H.pitch[0]);
          let ye = H.duration, Ae = H.velocity || 0.8;
          H.articulation === "staccato" && (ye = H.duration * 0.5), H.articulation === "accent" && (Ae = Math.min(Ae * 2, 1)), H.articulation === "tenuto" && (ye = H.duration * 1.5, Ae = Math.min(Ae * 1.3, 1)), ee.triggerAttackRelease(
            fe,
            ye,
            ce,
            Ae
          );
        }
      }, pe);
      T.push(Se);
    }), k.Transport.loopEnd = $, k.Transport.loop = !0, k.Transport.stop(), k.Transport.position = 0, re.textContent = he($);
  };
  let ve = 0;
  const ge = vr.UPDATE_INTERVAL, Oe = () => {
    const B = performance.now(), K = B - ve >= ge;
    if (k && Q) {
      const J = typeof k.Transport.loopEnd == "number" ? k.Transport.loopEnd : k.Time(k.Transport.loopEnd).toSeconds();
      if (K) {
        const W = k.Transport.seconds % J, ie = W / J * 100;
        se.value = Math.min(ie, 100), oe.textContent = he(W), re.textContent = he(J), ve = B;
      }
      if (k.Transport.state === "started" && Q)
        requestAnimationFrame(Oe);
      else if (k.Transport.state === "stopped" || k.Transport.state === "paused") {
        if (K) {
          const W = k.Transport.seconds % J, ie = W / J * 100;
          se.value = Math.min(ie, 100), oe.textContent = he(W), ve = B;
        }
        k.Transport.state === "stopped" && (k.Transport.seconds = 0, se.value = 0, oe.textContent = he(0), Q = !1, M.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>');
      }
    }
  };
  M.addEventListener("click", async () => {
    if (!k)
      if (await Te())
        me();
      else {
        console.error("[PLAYER] Failed to initialize Tone.js");
        return;
      }
    if (Q)
      console.log("[PLAYER] Pausing playback..."), k.Transport.pause(), Q = !1, M.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>', console.log("[PLAYER] Playback paused");
    else {
      if (!k.context || k.context.state !== "running")
        try {
          await k.start(), console.log(
            "[PLAYER] Audio context started:",
            k.context ? k.context.state : "unknown"
          ), k.context && typeof k.context.resume == "function" && (await k.context.resume(), console.log("[PLAYER] Audio context resumed for iOS compatibility"));
        } catch (B) {
          console.error("[PLAYER] Failed to start audio context:", B);
          let K = "Failed to start audio. ";
          Z() ? K += "On iOS, please ensure your device isn't in silent mode and try again." : K += "Please check your audio settings and try again.", alert(K);
          return;
        }
      if (X.length === 0 && (console.log("[PLAYER] No synths found, setting up audio..."), me()), k.Transport.state !== "paused" ? (k.Transport.stop(), k.Transport.position = 0, console.log("[PLAYER] Starting from beginning")) : console.log("[PLAYER] Resuming from paused position"), console.log(
        "[PLAYER] Transport state before start:",
        k.Transport.state
      ), console.log(
        "[PLAYER] Transport position reset to:",
        k.Transport.position
      ), console.log(
        "[PLAYER] Audio context state:",
        k.context ? k.context.state : "unknown"
      ), console.log("[PLAYER] Parts count:", T.length), console.log("[PLAYER] Synths count:", X.length), j) {
        const B = Object.values(j).filter(
          (K) => K && K.name === "Sampler"
        );
        if (B.length > 0 && x.length > 0) {
          console.log(
            `[PLAYER] Waiting for ${B.length} sampler(s) to load...`
          );
          try {
            await Promise.all(x), console.log("[PLAYER] All samplers loaded.");
          } catch (K) {
            console.warn("[PLAYER] Sampler load wait error:", K);
            return;
          }
        }
      }
      if (T.length === 0) {
        console.error(
          "[PLAYER] No parts available to start. This usually means setupAudio() failed."
        ), console.error(
          "[PLAYER] Try refreshing the page or check if Tone.js is properly loaded."
        );
        return;
      }
      k.Transport.state !== "paused" && T.forEach((B, K) => {
        if (!B || typeof B.start != "function") {
          console.error(`[PLAYER] Part ${K} is invalid:`, B);
          return;
        }
        try {
          B.start(0);
        } catch (J) {
          console.error(`[PLAYER] Failed to start part ${K}:`, J);
        }
      }), k.Transport.start(), Q = !0, M.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-pause"><circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/></svg>', Oe();
    }
  }), I.addEventListener("click", async () => {
    k && (console.log("[PLAYER] Stopping playback completely..."), k.Transport.stop(), k.Transport.cancel(), k.Transport.position = 0, T.forEach((B, K) => {
      try {
        B.stop();
      } catch (J) {
        console.warn(
          `[PLAYER] Failed to stop part ${K} during complete stop:`,
          J
        );
      }
    }), Q = !1, se.value = 0, oe.textContent = he(0), M.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>', console.log("[PLAYER] Playback stopped completely"));
  }), se.addEventListener("input", () => {
    if (k && $ > 0) {
      const B = se.value / 100 * $, K = Q;
      K && k.Transport.pause(), k.Transport.seconds = B, oe.textContent = he(B), K && setTimeout(() => {
        k.Transport.start();
      }, 50);
    }
  }), V.addEventListener("change", () => {
    const B = parseInt(V.value);
    k && B >= 60 && B <= 240 ? (console.log(`[PLAYER] Tempo changed to ${B} BPM`), k.Transport.bpm.value = B, console.log(`[PLAYER] Tempo changed to ${B} BPM`)) : V.value = k ? k.Transport.bpm.value : l;
  }), A.forEach((B) => {
    B.addEventListener("change", () => {
      if (k && X.length > 0) {
        console.log(
          "[PLAYER] Synthesizer selection changed, reinitializing audio..."
        );
        const K = Q;
        Q && (k.Transport.stop(), Q = !1), me(), K ? setTimeout(() => {
          k.Transport.start(), Q = !0, M.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-pause"><circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/></svg>';
        }, 100) : M.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>';
      }
    });
  });
  const Pe = () => {
    console.log("MIDI download - requires MIDI converter implementation");
  }, Ke = () => {
    console.log("WAV download - requires WAV generator implementation");
  };
  R.addEventListener("click", Pe), G.addEventListener("click", Ke), F.addEventListener("click", Pe), Y.addEventListener("click", Ke);
  const Je = typeof window < "u" && window.Tone || (typeof k < "u" ? k : null);
  if (Je && Te().then(() => {
    me(), t && setTimeout(() => {
      M.click();
    }, 500);
  }), t && !Je) {
    const B = setInterval(() => {
      (typeof window < "u" && window.Tone || (typeof k < "u" ? k : null)) && (clearInterval(B), setTimeout(() => {
        M.click();
      }, 500));
    }, 100);
    setTimeout(() => {
      clearInterval(B);
    }, 1e4);
  }
  return h;
}
function Nr(o, e = 0.25, t = "nearest") {
  if (typeof o != "number" || !isFinite(o)) return o;
  const r = o / e;
  let n;
  switch (t) {
    case "floor":
      n = Math.floor(r);
      break;
    case "ceil":
      n = Math.ceil(r);
      break;
    case "nearest":
    default:
      n = Math.round(r);
  }
  return n * e;
}
function Pi(o, { grid: e = 0.25, fields: t = ["time", "duration"], mode: r = "nearest" } = {}) {
  return Array.isArray(o) ? o.map((n) => {
    const i = { ...n };
    return t.forEach((s) => {
      typeof i[s] == "number" && (i[s] = Nr(i[s], e, r));
    }), i;
  }) : o;
}
function Ei(o, { grid: e = 0.25, mode: t = "nearest" } = {}) {
  return !o || !Array.isArray(o.notes) ? o : {
    ...o,
    notes: Pi(o.notes, { grid: e, fields: ["time", "duration"], mode: t })
  };
}
function va(o, { grid: e = 0.25, mode: t = "nearest" } = {}) {
  return !o || !Array.isArray(o.tracks) ? o : {
    ...o,
    tracks: o.tracks.map((r) => Ei(r, { grid: e, mode: t }))
  };
}
function Ti(o, e = 0.25) {
  const t = Math.round(1 / e), r = Math.round(o / e);
  return r <= 0 || r === t ? "" : r % t === 0 ? String(r / t) : `${r}/${t}`;
}
const Jt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  encodeAbcDuration: Ti,
  quantize: Nr,
  quantizeComposition: va,
  quantizeEvents: Pi,
  quantizeTrack: Ei
}, Symbol.toStringTag, { value: "Module" }));
class ba {
  /**
   * Convertit un objet JMON en ABC après validation/normalisation
   * @param {Object} composition - objet JMON
   * @returns {string} ABC notation string
   */
  static fromValidatedJmon(e) {
    const t = new rr(), { valid: r, normalized: n, errors: i } = t.validateAndNormalize(
      e
    );
    if (!r)
      throw console.warn("JMON non valide pour conversion ABC:", i), new Error("JMON non valide");
    return this.convertToAbc(n);
  }
  /**
   * Helper function to parse time strings with fallback
   * @param {string|number} timeString - time value
   * @param {number} bpm - beats per minute
   * @returns {number} parsed time in seconds
   */
  static parseTimeString(e, t) {
    if (typeof e == "number") return e;
    if (typeof e != "string") return 0;
    try {
      if (jmonTone && jmonTone._parseTimeString)
        return jmonTone._parseTimeString(e, t);
    } catch {
    }
    if (e.includes(":")) {
      const r = e.split(":").map(parseFloat), n = r[0] || 0, i = r[1] || 0, s = r[2] || 0, a = 60 / t, c = a * 4, l = a / 480;
      return n * c + i * a + s * l;
    }
    if (e.match(/^\d+[nthq]$/)) {
      const r = parseInt(e), n = e.slice(-1), i = 60 / t;
      switch (n) {
        case "n":
          return i * (4 / r);
        case "t":
          return i * (4 / r) * (2 / 3);
        case "h":
          return i * 2;
        case "q":
          return i;
        default:
          return i;
      }
    }
    return parseFloat(e) || 0;
  }
  static convertToAbc(e, t = {}) {
    let r = `X:1
`;
    r += `T:${e.metadata?.title || e.metadata?.name || e.meta?.title || e.meta?.name || e.label || "Untitled"}
`;
    const n = e.metadata?.composer || e.metadata?.author || e.meta?.composer || e.meta?.author;
    n && (r += `C:${n}
`), r += `M:${e.timeSignature || "4/4"}
`;
    const i = Array.isArray(e.tracks) ? e.tracks : Object.values(e.tracks || {});
    if (i.length === 0) return r;
    const s = [];
    i.forEach((O) => {
      const D = O.notes || O;
      Array.isArray(D) && D.forEach((V) => {
        typeof V.duration == "number" && s.push(V.duration);
      });
    });
    const a = [1 / 8, 1 / 4, 1 / 2];
    let c = 1 / 4, l = 1 / 0;
    for (const O of a) {
      let D = 0;
      for (const V of s) {
        const L = V / O;
        Math.abs(L - Math.round(L)) > 1e-3 && D++;
      }
      D < l && (l = D, c = O);
    }
    const d = c === 1 / 8 ? "1/8" : c === 1 / 4 ? "1/4" : "1/2";
    r += `L:${d}
`;
    const g = c === 1 / 8 ? "1/8" : c === 1 / 4 ? "1/4" : "1/2", _ = (e.tempo || e.bpm || 120) * (c / (1 / 4));
    r += `Q:${g}=${Math.round(_)}
`, r += `K:${e.keySignature || "C"}
`;
    const b = e.timeSignature || "4/4", [$, m] = b.split("/").map(Number), h = $ * (4 / m), p = c, u = t.measuresPerLine || 4, f = t.lineBreaks || [], w = t.renderMode || "merged", v = t.trackIndex || 0, S = !!t.hideRests, P = t.showArticulations !== !1, A = (() => {
      let O = 0;
      return i.forEach((D) => {
        const V = D.notes || D;
        Array.isArray(V) && V.forEach((L) => {
          const F = typeof L.time == "number" ? L.time : 0, Y = typeof L.duration == "number" ? L.duration : 1, de = F + Y;
          de > O && (O = de);
        });
      }), O;
    })(), C = Math.max(
      1,
      Math.ceil(A / h)
    );
    if (w === "tracks" && i.length > 1)
      r += "%%score {", i.forEach((O, D) => {
        D > 0 && (r += " | "), r += `${D + 1}`;
      }), r += `}
`, i.forEach((O, D) => {
        const V = O.notes || O;
        if (V.length === 0) return;
        const L = D + 1, F = O.label || `Track ${D + 1}`, Y = F.length > 12 ? F.substring(0, 10) + ".." : F, de = O.instrument ? ` [${O.instrument}]` : "";
        r += `V:${L} name="${F}${de}" snm="${Y}"
`;
        const oe = V.filter((se) => se.pitch !== void 0).sort((se, q) => (se.time || 0) - (q.time || 0)), { abcNotesStr: re } = this.convertNotesToAbc(
          oe,
          h,
          u,
          f,
          {
            hideRests: S,
            showArticulations: P,
            padMeasures: i.length > 1 ? C : 0
          },
          p
        );
        re.trim() && (r += re + `
`);
      });
    else if (w === "drums") {
      r += `V:1 clef=perc name="Drum Set" snm="Drums"
`;
      const O = t.percussionMap || {
        kick: "C,,",
        snare: "D,",
        hat: "F",
        "hi-hat": "F",
        hihat: "F"
      }, D = (Y) => {
        const de = (Y || "").toLowerCase();
        for (const oe of Object.keys(O))
          if (de.includes(oe)) return O[oe];
        return "E";
      }, V = [];
      i.forEach((Y) => {
        const de = Y.notes || Y, oe = Y.label || "", re = D(oe);
        (de || []).forEach((se) => {
          se.pitch !== void 0 && V.push({
            time: typeof se.time == "number" ? se.time : 0,
            duration: typeof se.duration == "number" ? se.duration : 1,
            // Use mapped ABC pitch string directly in converter
            pitch: re,
            articulation: se.articulation
          });
        });
      });
      const L = V.sort((Y, de) => (Y.time || 0) - (de.time || 0)), { abcNotesStr: F } = this.convertNotesToAbc(
        L,
        h,
        u,
        f,
        {
          hideRests: S,
          showArticulations: P,
          padMeasures: i.length > 1 ? C : 0
        },
        p
      );
      F.trim() && (r += F + `
`);
    } else if (w === "single") {
      const O = i[v];
      if (O) {
        const V = (O.notes || O).filter((F) => F.pitch !== void 0).sort((F, Y) => (F.time || 0) - (Y.time || 0)), { abcNotesStr: L } = this.convertNotesToAbc(
          V,
          h,
          u,
          f,
          {
            hideRests: S,
            showArticulations: P,
            padMeasures: i.length > 1 ? C : 0
          },
          p
        );
        L.trim() && (r += L + `
`);
      }
    } else {
      const O = [];
      i.forEach((L) => {
        (L.notes || L).forEach((Y) => {
          Y.pitch !== void 0 && O.push(Y);
        });
      });
      const D = O.sort(
        (L, F) => (L.time || 0) - (F.time || 0)
      ), { abcNotesStr: V } = this.convertNotesToAbc(
        D,
        h,
        u,
        f,
        {
          hideRests: S,
          showArticulations: P,
          padMeasures: i.length > 1 ? C : 0
        },
        p
      );
      V.trim() && (r += V + `
`);
    }
    return r;
  }
  /**
   * Convert notes to ABC notation string
   */
  static convertNotesToAbc(e, t, r, n, i = {}, s = 1 / 4) {
    let a = "", c = 0, l = 0, d = 0, g = 0;
    const _ = i?.quantizeBeats || 0.25, b = 1e-6, $ = (v) => Nr(v, _, "nearest"), m = (v) => Ti(v / s, _ / s), h = (v) => {
      a += v + " ";
    }, p = () => {
      for (; c >= t - b; )
        h("|"), c -= t, l++, d++, (n.includes(l) || d >= r) && (a += `
`, d = 0);
    }, u = (v, { forceVisible: S = !1 } = {}) => {
      let P = v;
      for (; P > b; ) {
        const A = $(t - c), C = $(Math.min(P, A));
        if (C > b) {
          let O = i.hideRests && !S ? "x" : "z";
          O += m(C), h(O), c = $(c + C), P = $(P - C);
        }
        p();
      }
    };
    for (const v of e) {
      const S = typeof v.time == "number" ? $(v.time) : 0, P = typeof v.duration == "number" ? $(v.duration) : 1, A = $(S - g);
      A > b && u(A);
      let C = "z";
      if (Array.isArray(v.pitch)) {
        const V = (L) => {
          const F = [
            "C",
            "C#",
            "D",
            "D#",
            "E",
            "F",
            "F#",
            "G",
            "G#",
            "A",
            "A#",
            "B"
          ], Y = Math.floor(L / 12) - 1, de = L % 12;
          let oe = F[de].replace("#", "^");
          return Y >= 4 ? (oe = oe.toLowerCase(), Y > 4 && (oe += "'".repeat(Y - 4))) : Y < 4 && (oe = oe.toUpperCase(), Y < 3 && (oe += ",".repeat(3 - Y))), oe;
        };
        C = "[" + v.pitch.map(V).join("") + "]";
      } else if (typeof v.pitch == "number") {
        const V = v.pitch, L = [
          "C",
          "C#",
          "D",
          "D#",
          "E",
          "F",
          "F#",
          "G",
          "G#",
          "A",
          "A#",
          "B"
        ], F = Math.floor(V / 12) - 1, Y = V % 12;
        C = L[Y].replace("#", "^"), F >= 4 ? (C = C.toLowerCase(), F > 4 && (C += "'".repeat(F - 4))) : F < 4 && (C = C.toUpperCase(), F < 3 && (C += ",".repeat(3 - F)));
      } else typeof v.pitch == "string" ? C = v.pitch : v.pitch === null && (C = i.hideRests ? "x" : "z");
      let O = P, D = !0;
      for (; O > b; ) {
        const V = $(t - c), L = $(Math.min(O, V));
        if (L > b) {
          let F = C;
          F += m(L), D && i.showArticulations && (v.articulation === "staccato" && (F += "."), v.articulation === "accent" && (F += ">"), v.articulation === "tenuto" && (F += "-"), v.articulation === "marcato" && (F += "^")), O > L + b && (F += "-"), h(F), c = $(c + L), O = $(O - L), D = !1;
        }
        p();
      }
      g = $(S + P);
    }
    const f = i.padMeasures || 0;
    for (; l < f; ) {
      const v = $(t - c);
      v > b && u(v, { forceVisible: !0 }), h("|"), c = 0, l++;
    }
    if (c > b) {
      const v = $(t - c);
      v > b && u(v, { forceVisible: !0 });
    }
    const w = a.trim();
    return w && !w.endsWith("|") && (a += "|"), { abcNotesStr: a };
  }
}
function Mi(o, e = {}) {
  return ba.convertToAbc(o, e);
}
class Rr {
  static midiToNoteName(e) {
    const t = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], r = Math.floor(e / 12) - 1, n = e % 12;
    return t[n] + r;
  }
  static convert(e) {
    const t = e.tempo || e.bpm || 120, r = e.tracks || [];
    return {
      header: {
        bpm: t,
        timeSignature: e.timeSignature || "4/4"
      },
      tracks: r.map((n) => ({
        label: n.label,
        notes: n.notes.map((i) => ({
          pitch: i.pitch,
          noteName: typeof i.pitch == "number" ? Rr.midiToNoteName(i.pitch) : i.pitch,
          time: i.time,
          duration: i.duration,
          velocity: i.velocity || 0.8,
          articulation: i.articulation || null
        }))
      }))
    };
  }
}
function wa(o) {
  return Rr.convert(o);
}
class Cr {
  constructor(e = {}) {
    this.options = {
      Tone: null,
      trackNaming: "auto",
      // 'auto', 'numbered', 'channel', 'instrument'
      mergeDrums: !0,
      quantize: null,
      // e.g., 0.25 for 16th note quantization
      includeModulations: !0,
      includeTempo: !0,
      includeKeySignature: !0,
      ...e
    };
  }
  /**
   * Static conversion method
   * @param {ArrayBuffer|Uint8Array} midiData - MIDI file data
   * @param {Object} options - Conversion options
   * @returns {Promise<Object>} JMON composition
   */
  static async convert(e, t = {}) {
    return await new Cr(t).convertToJmon(e);
  }
  /**
   * Main conversion method
   * @param {ArrayBuffer|Uint8Array} midiData - MIDI file data
   * @returns {Promise<Object>} JMON composition
   */
  async convertToJmon(e) {
    const t = await this.initializeTone();
    let r;
    try {
      r = new t.Midi(e);
    } catch (l) {
      throw new Error(`Failed to parse MIDI file: ${l.message}`);
    }
    const n = this.buildJmonComposition(r, t), i = new rr(), { valid: s, normalized: a, errors: c } = i.validateAndNormalize(
      n
    );
    return s || console.warn("Generated JMON failed validation:", c), s ? a : n;
  }
  /**
   * Initialize Tone.js instance following music-player.js pattern
   * @returns {Promise<Object>} Tone.js instance
   */
  async initializeTone() {
    const e = this.options.Tone;
    if (typeof window < "u") {
      const t = e || window.Tone || (typeof Tone < "u" ? Tone : null);
      if (t)
        return t;
      try {
        const r = await import("tone");
        return r.default || r;
      } catch {
        throw new Error(
          "Tone.js not found. Please provide Tone instance or load Tone.js"
        );
      }
    } else {
      if (e)
        return e;
      throw new Error("Tone instance required in Node.js environment");
    }
  }
  /**
   * Build JMON composition from parsed MIDI
   * @param {Object} parsed - Parsed MIDI from Tone.js
   * @param {Object} Tone - Tone.js instance
   * @returns {Object} JMON composition
   */
  buildJmonComposition(e, t) {
    const r = {
      format: "jmon",
      version: "1.0",
      tempo: this.extractTempo(e),
      tracks: this.convertTracks(e.tracks, t, e)
    }, n = this.extractTimeSignature(e);
    n && (r.timeSignature = n);
    const i = this.extractKeySignature(e);
    i && (r.keySignature = i);
    const s = this.extractMetadata(e);
    return Object.keys(s).length > 0 && (r.metadata = s), this.options.includeTempo && this.hasTempoChanges(e) && (r.tempoMap = this.extractTempoMap(e)), this.hasTimeSignatureChanges(e) && (r.timeSignatureMap = this.extractTimeSignatureMap(e)), r;
  }
  /**
   * Convert MIDI tracks to JMON tracks
   * @param {Array} tracks - MIDI tracks from Tone.js
   * @param {Object} Tone - Tone.js instance
   * @param {Object} parsed - Full parsed MIDI data
   * @returns {Array} JMON tracks
   */
  convertTracks(e, t, r) {
    const n = [];
    let i = 0;
    for (const s of e) {
      if (!s.notes || s.notes.length === 0)
        continue;
      const a = this.generateTrackName(s, i, r), c = this.isDrumTrack(s), l = s.notes.map(
        (_) => this.convertNote(_, t, s)
      ), d = this.options.quantize ? this.quantizeNotes(l, this.options.quantize) : l, g = {
        label: a,
        notes: d
      };
      if (s.channel !== void 0 && (g.midiChannel = s.channel), s.instrument && (g.synth = {
        type: c ? "Sampler" : "PolySynth",
        options: this.getInstrumentOptions(s.instrument, c)
      }), this.options.includeModulations && s.controlChanges) {
        const _ = this.extractModulations(s.controlChanges);
        _.length > 0 && this.applyModulationsToTrack(g, _);
      }
      n.push(g), i++;
    }
    return n;
  }
  /**
   * Convert MIDI note to JMON note
   * @param {Object} note - MIDI note from Tone.js
   * @param {Object} Tone - Tone.js instance
   * @param {Object} track - Parent track for context
   * @returns {Object} JMON note
   */
  convertNote(e, t, r) {
    const n = {
      pitch: e.midi,
      // Use MIDI number as primary format
      time: e.time,
      // Tone.js already converts to seconds, we'll convert to quarters
      duration: this.convertDurationToNoteValue(e.duration),
      velocity: e.velocity
    }, i = e.tempo || 120;
    if (n.time = this.convertSecondsToQuarterNotes(e.time, i), this.options.includeModulations && e.controlChanges) {
      const s = this.convertNoteModulations(e.controlChanges);
      s.length > 0 && (n.modulations = s);
    }
    return n;
  }
  /**
   * Generate track name based on naming strategy
   * @param {Object} track - MIDI track
   * @param {number} index - Track index
   * @param {Object} parsed - Full parsed MIDI
   * @returns {string} Track name
   */
  generateTrackName(e, t, r) {
    switch (this.options.trackNaming) {
      case "numbered":
        return `Track ${t + 1}`;
      case "channel":
        return `Channel ${(e.channel || 0) + 1}`;
      case "instrument":
        return e.instrument ? e.instrument.name || `Instrument ${e.instrument.number}` : `Track ${t + 1}`;
      case "auto":
      default:
        return e.name && e.name.trim() ? e.name.trim() : this.isDrumTrack(e) ? "Drums" : e.instrument && e.instrument.name ? e.instrument.name : e.channel !== void 0 ? e.channel === 9 ? "Drums" : `Channel ${e.channel + 1}` : `Track ${t + 1}`;
    }
  }
  /**
   * Check if track is a drum track (channel 10/9 in MIDI)
   * @param {Object} track - MIDI track
   * @returns {boolean} True if drum track
   */
  isDrumTrack(e) {
    return e.channel === 9;
  }
  /**
   * Get instrument options for synth configuration
   * @param {Object} instrument - MIDI instrument info
   * @param {boolean} isDrum - Whether this is a drum track
   * @returns {Object} Synth options
   */
  getInstrumentOptions(e, t) {
    return t ? {
      envelope: {
        enabled: !0,
        attack: 0.02,
        decay: 0.1,
        sustain: 0.8,
        release: 0.3
      }
    } : {
      oscillator: { type: "triangle" },
      envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.7,
        release: 1
      }
    };
  }
  /**
   * Extract tempo from MIDI
   * @param {Object} parsed - Parsed MIDI
   * @returns {number} BPM
   */
  extractTempo(e) {
    if (e.header && e.header.tempos && e.header.tempos.length > 0)
      return Math.round(e.header.tempos[0].bpm);
    for (const t of e.tracks)
      if (t.tempoEvents && t.tempoEvents.length > 0)
        return Math.round(t.tempoEvents[0].bpm);
    return 120;
  }
  /**
   * Extract time signature from MIDI
   * @param {Object} parsed - Parsed MIDI
   * @returns {string|null} Time signature like "4/4"
   */
  extractTimeSignature(e) {
    if (e.header && e.header.timeSignatures && e.header.timeSignatures.length > 0) {
      const t = e.header.timeSignatures[0];
      return `${t.numerator}/${t.denominator}`;
    }
    for (const t of e.tracks)
      if (t.timeSignatureEvents && t.timeSignatureEvents.length > 0) {
        const r = t.timeSignatureEvents[0];
        return `${r.numerator}/${r.denominator}`;
      }
    return null;
  }
  /**
   * Extract key signature from MIDI
   * @param {Object} parsed - Parsed MIDI
   * @returns {string|null} Key signature like "C", "G", "Dm"
   */
  extractKeySignature(e) {
    return null;
  }
  /**
   * Extract metadata from MIDI
   * @param {Object} parsed - Parsed MIDI
   * @returns {Object} Metadata object
   */
  extractMetadata(e) {
    const t = {};
    for (const r of e.tracks)
      if (r.meta)
        for (const n of r.meta)
          switch (n.type) {
            case "trackName":
            case "text":
              !t.title && n.text && n.text.trim() && (t.title = n.text.trim());
              break;
            case "copyright":
              n.text && n.text.trim() && (t.copyright = n.text.trim());
              break;
            case "composer":
              n.text && n.text.trim() && (t.composer = n.text.trim());
              break;
          }
    return t;
  }
  /**
   * Check if MIDI has tempo changes
   * @param {Object} parsed - Parsed MIDI
   * @returns {boolean} True if has tempo changes
   */
  hasTempoChanges(e) {
    if (e.header && e.header.tempos && e.header.tempos.length > 1)
      return !0;
    for (const t of e.tracks)
      if (t.tempoEvents && t.tempoEvents.length > 1)
        return !0;
    return !1;
  }
  /**
   * Extract tempo map for tempo changes
   * @param {Object} parsed - Parsed MIDI
   * @returns {Array} Tempo map events
   */
  extractTempoMap(e) {
    const t = [], r = [];
    e.header && e.header.tempos && r.push(...e.header.tempos.map((n) => ({
      time: n.time,
      tempo: Math.round(n.bpm)
    })));
    for (const n of e.tracks)
      n.tempoEvents && r.push(...n.tempoEvents.map((i) => ({
        time: i.time,
        tempo: Math.round(i.bpm)
      })));
    r.sort((n, i) => n.time - i.time);
    for (const n of r)
      t.push({
        time: this.convertSecondsToQuarterNotes(n.time, n.tempo),
        tempo: n.tempo
      });
    return t;
  }
  /**
   * Check if MIDI has time signature changes
   * @param {Object} parsed - Parsed MIDI
   * @returns {boolean} True if has time signature changes
   */
  hasTimeSignatureChanges(e) {
    if (e.header && e.header.timeSignatures && e.header.timeSignatures.length > 1)
      return !0;
    for (const t of e.tracks)
      if (t.timeSignatureEvents && t.timeSignatureEvents.length > 1)
        return !0;
    return !1;
  }
  /**
   * Extract time signature map for time signature changes
   * @param {Object} parsed - Parsed MIDI
   * @returns {Array} Time signature map events
   */
  extractTimeSignatureMap(e) {
    const t = [], r = [];
    e.header && e.header.timeSignatures && r.push(...e.header.timeSignatures);
    for (const n of e.tracks)
      n.timeSignatureEvents && r.push(...n.timeSignatureEvents);
    r.sort((n, i) => n.time - i.time);
    for (const n of r)
      t.push({
        time: this.convertSecondsToQuarterNotes(n.time, 120),
        // Use default tempo for conversion
        timeSignature: `${n.numerator}/${n.denominator}`
      });
    return t;
  }
  /**
   * Convert seconds to quarter notes
   * @param {number} seconds - Time in seconds
   * @param {number} bpm - Beats per minute
   * @returns {number} Time in quarter notes
   */
  convertSecondsToQuarterNotes(e, t) {
    const r = 60 / t;
    return e / r;
  }
  /**
   * Convert duration to note value string
   * @param {number} duration - Duration in seconds
   * @returns {string} Note value like "4n", "8n"
   */
  convertDurationToNoteValue(e) {
    const r = e / 0.5;
    return r >= 3.5 ? "1n" : r >= 1.75 ? "2n" : r >= 0.875 ? "4n" : r >= 0.4375 ? "8n" : r >= 0.21875 ? "16n" : r >= 0.109375 ? "32n" : "16n";
  }
  /**
   * Extract modulations from MIDI control changes
   * @param {Object} controlChanges - MIDI CC events
   * @returns {Array} Modulation events
   */
  extractModulations(e) {
    const t = [];
    for (const [r, n] of Object.entries(e)) {
      const i = parseInt(r);
      for (const s of n) {
        const a = {
          type: "cc",
          controller: i,
          value: s.value,
          time: this.convertSecondsToQuarterNotes(s.time, 120)
        };
        t.push(a);
      }
    }
    return t;
  }
  /**
   * Convert note-level modulations
   * @param {Object} controlChanges - Note-level CC events
   * @returns {Array} Note modulation events
   */
  convertNoteModulations(e) {
    return this.extractModulations(e);
  }
  /**
   * Apply modulations to track
   * @param {Object} track - JMON track
   * @param {Array} modulations - Modulation events
   */
  applyModulationsToTrack(e, t) {
    t.length > 0 && (e.automation = [{
      id: "midi_cc",
      target: "midi.cc1",
      // Default to modulation wheel
      anchorPoints: t.map((r) => ({
        time: r.time,
        value: r.value
      }))
    }]);
  }
  /**
   * Quantize notes to grid
   * @param {Array} notes - Notes to quantize
   * @param {number} grid - Grid size in quarter notes
   * @returns {Array} Quantized notes
   */
  quantizeNotes(e, t) {
    return e.map((r) => ({
      ...r,
      time: Math.round(r.time / t) * t
    }));
  }
}
async function _a(o, e = {}) {
  return await Cr.convert(o, e);
}
function $a(o, e = {}) {
  return {
    sampleRate: e.sampleRate || 44100,
    duration: e.duration || 10,
    channels: e.channels || 1,
    tempo: o.tempo || o.bpm || 120,
    notes: o.tracks?.flatMap((t) => t.notes) || []
  };
}
class Sa {
  static convert(e) {
    let r = `// SuperCollider script generated from JMON
// Title: ${e.metadata?.name || "Untitled"}
`;
    return (e.tracks?.[0]?.notes || []).forEach((i) => {
      r += `Synth("default", ["freq", ${i.pitch}, "dur", ${i.duration}]);
`;
    }), r;
  }
}
function Pa(o) {
  return Sa.convert(o);
}
function Ea(o) {
  return new rr().validateAndNormalize(o);
}
function Ta(o, e = {}) {
  if (!o || typeof o != "object")
    throw console.error("[RENDER] Invalid JMON object:", o), new Error("render() requires a valid JMON object");
  return !o.sequences && !o.tracks && !o.format && console.warn(
    "[RENDER] Object does not appear to be JMON format, attempting normalization"
  ), Ar(o, e);
}
function Ma(o, e = {}) {
  const t = { autoplay: !1, ...e };
  return Ar(o, t);
}
async function ka(o, e = {}) {
  const {
    scale: t = 0.9,
    staffwidth: r,
    showAbc: n = !0,
    responsive: i = "resize",
    abcOptions: s = {},
    ABCJS: a = null,
    abcjs: c = null,
    // Support lowercase alias
    autoload: l = !0
  } = e, d = Mi(o, s), g = document.createElement("div");
  g.style.cssText = `
		margin: 15px 0;
		font-family: sans-serif;
	`;
  const _ = document.createElement("div");
  if (_.id = `rendered-score-${Date.now()}`, _.style.cssText = `
		width: 100%;
		overflow-x: auto;
		margin: 10px 0;
	`, g.appendChild(_), n) {
    const $ = document.createElement("details");
    $.style.marginTop = "15px";
    const m = document.createElement("summary");
    m.textContent = "ABC Notation (click to expand)", m.style.cursor = "pointer", $.appendChild(m);
    const h = document.createElement("pre");
    h.textContent = d, h.style.cssText = `
			background: #f5f5f5;
			padding: 10px;
			border-radius: 4px;
			overflow-x: auto;
			font-size: 12px;
		`, $.appendChild(h), g.appendChild($);
  }
  let b = a || c || typeof window < "u" && window.ABCJS || (typeof ABCJS < "u" ? ABCJS : null);
  if (!b && l)
    try {
      if (typeof require < "u")
        console.log("[SCORE] Loading ABCJS via require()..."), b = await require("abcjs");
      else {
        console.log("[SCORE] Loading ABCJS via import()...");
        const $ = await import("https://cdn.skypack.dev/abcjs");
        b = $.default || $;
      }
      if (!b || !b.renderAbc) {
        console.warn(
          "[SCORE] First load attempt failed, trying alternative CDN..."
        );
        try {
          const $ = await import("https://cdn.jsdelivr.net/npm/abcjs@6.4.0/dist/abcjs-basic-min.js");
          if (b = $.default || $.ABCJS || typeof window < "u" && window.ABCJS, !b || !b.renderAbc)
            throw new Error("Alternative CDN also failed");
        } catch ($) {
          console.warn("[SCORE] Could not auto-load ABCJS:", $.message), b = null;
        }
      }
      b && (console.log(
        "[SCORE] ABCJS loaded successfully, version:",
        b.version || "unknown"
      ), typeof window < "u" && (window.ABCJS = b));
    } catch ($) {
      console.warn("[SCORE] Could not auto-load ABCJS:", $.message), console.log("[SCORE] To use score rendering, load ABCJS manually first:"), console.log('Method 1: ABCJS = await require("abcjs")'), console.log(
        'Method 2: ABCJS = await import("https://cdn.skypack.dev/abcjs").then(m => m.default)'
      ), b = null;
    }
  if (b && b.renderAbc)
    try {
      const $ = r || null, m = { responsive: i, scale: t };
      $ && (m.staffwidth = $), b.renderAbc(_, d, m), setTimeout(() => {
        if (_.children.length === 0 || _.innerHTML.trim() === "")
          try {
            b.renderAbc(_, d), _.children.length === 0 && (_.innerHTML = '<p style="color: red;">ABCJS rendering failed - no content generated</p><pre>' + d + "</pre>");
          } catch {
            _.innerHTML = "<p>Error with alternative rendering</p><pre>" + d + "</pre>";
          }
      }, 200);
    } catch ($) {
      console.error("[SCORE] Error rendering with ABCJS:", $), _.innerHTML = "<p>Error rendering notation</p><pre>" + d + "</pre>";
    }
  else {
    const $ = l ? "ABCJS not available and auto-loading failed - showing text notation only" : "ABCJS not provided and auto-loading disabled - showing text notation only";
    _.innerHTML = `<p>${$}</p><pre>` + d + "</pre>", !b && l && (console.log("[SCORE] To use visual score rendering, try:"), console.log(
      'ABCJS = await require("abcjs"), then jm.score(composition, { ABCJS })'
    ));
  }
  return g;
}
const xa = {
  // Core functionality
  render: Ta,
  play: Ma,
  score: ka,
  validate: Ea,
  // Core formats and players
  createPlayer: Ar,
  // Converters
  converters: {
    abc: Mi,
    midi: wa,
    midiToJmon: _a,
    tonejs: _i,
    wav: $a,
    supercollider: Pa
  },
  // Theory and algorithms
  theory: nt.theory,
  generative: nt.generative,
  analysis: nt.analysis,
  constants: nt.constants,
  // Utils
  utils: {
    ...nt.utils,
    JmonValidator: rr,
    // Expose utility helpers
    quantize: (o, e, t) => Promise.resolve().then(() => Jt).then((r) => r.quantize(o, e, t)),
    quantizeEvents: async (o, e) => (await Promise.resolve().then(() => Jt)).quantizeEvents(o, e),
    quantizeTrack: async (o, e) => (await Promise.resolve().then(() => Jt)).quantizeTrack(o, e),
    quantizeComposition: async (o, e) => (await Promise.resolve().then(() => Jt)).quantizeComposition(o, e),
    // JMON utilities - official format helpers
    jmon: Rs
  },
  // GM Instruments
  instruments: {
    GM_INSTRUMENTS: Xe,
    generateSamplerUrls: ot,
    createGMInstrumentNode: sa,
    findGMProgramByName: $i,
    getPopularInstruments: Si
  },
  VERSION: "1.0.0"
}, Aa = {
  loops: {
    async plotLoops(o, e = 4, t = 1 / 4, r = null, n = {}) {
      const { LoopVisualizer: i } = await import("./LoopVisualizer-DS22P85c.js");
      return i.plotLoops(
        o,
        e,
        t,
        r,
        n
      );
    }
  }
};
xa.visualization = Aa;
export {
  xa as default,
  xa as jm
};
