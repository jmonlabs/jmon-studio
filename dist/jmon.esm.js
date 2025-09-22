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
      constructor(l) {
        if (super(), !o.IDENTIFIER.test(l))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = l;
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
      constructor(l) {
        super(), this._items = typeof l == "string" ? [l] : l;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return !1;
        const l = this._items[0];
        return l === "" || l === '""';
      }
      get str() {
        var l;
        return (l = this._str) !== null && l !== void 0 ? l : this._str = this._items.reduce((f, g) => `${f}${g}`, "");
      }
      get names() {
        var l;
        return (l = this._names) !== null && l !== void 0 ? l : this._names = this._items.reduce((f, g) => (g instanceof t && (f[g.str] = (f[g.str] || 0) + 1), f), {});
      }
    }
    o._Code = r, o.nil = new r("");
    function n(p, ...l) {
      const f = [p[0]];
      let g = 0;
      for (; g < l.length; )
        a(f, l[g]), f.push(p[++g]);
      return new r(f);
    }
    o._ = n;
    const i = new r("+");
    function s(p, ...l) {
      const f = [v(p[0])];
      let g = 0;
      for (; g < l.length; )
        f.push(i), a(f, l[g]), f.push(i, v(p[++g]));
      return c(f), new r(f);
    }
    o.str = s;
    function a(p, l) {
      l instanceof r ? p.push(...l._items) : l instanceof t ? p.push(l) : p.push(y(l));
    }
    o.addCodeArg = a;
    function c(p) {
      let l = 1;
      for (; l < p.length - 1; ) {
        if (p[l] === i) {
          const f = u(p[l - 1], p[l + 1]);
          if (f !== void 0) {
            p.splice(l - 1, 3, f);
            continue;
          }
          p[l++] = "+";
        }
        l++;
      }
    }
    function u(p, l) {
      if (l === '""')
        return p;
      if (p === '""')
        return l;
      if (typeof p == "string")
        return l instanceof t || p[p.length - 1] !== '"' ? void 0 : typeof l != "string" ? `${p.slice(0, -1)}${l}"` : l[0] === '"' ? p.slice(0, -1) + l.slice(1) : void 0;
      if (typeof l == "string" && l[0] === '"' && !(p instanceof t))
        return `"${p}${l.slice(1)}`;
    }
    function d(p, l) {
      return l.emptyStr() ? p : p.emptyStr() ? l : s`${p}${l}`;
    }
    o.strConcat = d;
    function y(p) {
      return typeof p == "number" || typeof p == "boolean" || p === null ? p : v(Array.isArray(p) ? p.join(",") : p);
    }
    function _(p) {
      return new r(v(p));
    }
    o.stringify = _;
    function v(p) {
      return JSON.stringify(p).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    o.safeStringify = v;
    function S(p) {
      return typeof p == "string" && o.IDENTIFIER.test(p) ? new r(`.${p}`) : n`[${p}]`;
    }
    o.getProperty = S;
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
      constructor(u) {
        super(`CodeGen: "code" for ${u} not defined`), this.value = u.value;
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
      constructor({ prefixes: u, parent: d } = {}) {
        this._names = {}, this._prefixes = u, this._parent = d;
      }
      toName(u) {
        return u instanceof e.Name ? u : this.name(u);
      }
      name(u) {
        return new e.Name(this._newName(u));
      }
      _newName(u) {
        const d = this._names[u] || this._nameGroup(u);
        return `${u}${d.index++}`;
      }
      _nameGroup(u) {
        var d, y;
        if (!((y = (d = this._parent) === null || d === void 0 ? void 0 : d._prefixes) === null || y === void 0) && y.has(u) || this._prefixes && !this._prefixes.has(u))
          throw new Error(`CodeGen: prefix "${u}" is not allowed in this scope`);
        return this._names[u] = { prefix: u, index: 0 };
      }
    }
    o.Scope = n;
    class i extends e.Name {
      constructor(u, d) {
        super(d), this.prefix = u;
      }
      setValue(u, { property: d, itemIndex: y }) {
        this.value = u, this.scopePath = (0, e._)`.${new e.Name(d)}[${y}]`;
      }
    }
    o.ValueScopeName = i;
    const s = (0, e._)`\n`;
    class a extends n {
      constructor(u) {
        super(u), this._values = {}, this._scope = u.scope, this.opts = { ...u, _n: u.lines ? s : e.nil };
      }
      get() {
        return this._scope;
      }
      name(u) {
        return new i(u, this._newName(u));
      }
      value(u, d) {
        var y;
        if (d.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const _ = this.toName(u), { prefix: v } = _, S = (y = d.key) !== null && y !== void 0 ? y : d.ref;
        let m = this._values[v];
        if (m) {
          const l = m.get(S);
          if (l)
            return l;
        } else
          m = this._values[v] = /* @__PURE__ */ new Map();
        m.set(S, _);
        const h = this._scope[v] || (this._scope[v] = []), p = h.length;
        return h[p] = d.ref, _.setValue(d, { property: v, itemIndex: p }), _;
      }
      getValue(u, d) {
        const y = this._values[u];
        if (y)
          return y.get(d);
      }
      scopeRefs(u, d = this._values) {
        return this._reduceValues(d, (y) => {
          if (y.scopePath === void 0)
            throw new Error(`CodeGen: name "${y}" has no value`);
          return (0, e._)`${u}${y.scopePath}`;
        });
      }
      scopeCode(u = this._values, d, y) {
        return this._reduceValues(u, (_) => {
          if (_.value === void 0)
            throw new Error(`CodeGen: name "${_}" has no value`);
          return _.value.code;
        }, d, y);
      }
      _reduceValues(u, d, y = {}, _) {
        let v = e.nil;
        for (const S in u) {
          const m = u[S];
          if (!m)
            continue;
          const h = y[S] = y[S] || /* @__PURE__ */ new Map();
          m.forEach((p) => {
            if (h.has(p))
              return;
            h.set(p, r.Started);
            let l = d(p);
            if (l) {
              const f = this.opts.es5 ? o.varKinds.var : o.varKinds.const;
              v = (0, e._)`${v}${f} ${p} = ${l};${this.opts._n}`;
            } else if (l = _?.(p))
              v = (0, e._)`${v}${l}${this.opts._n}`;
            else
              throw new t(p);
            h.set(p, r.Completed);
          });
        }
        return v;
      }
    }
    o.ValueScope = a;
  })(cr)), cr;
}
var zr;
function te() {
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
      optimizeNames(b, E) {
        return this;
      }
    }
    class s extends i {
      constructor(b, E, R) {
        super(), this.varKind = b, this.name = E, this.rhs = R;
      }
      render({ es5: b, _n: E }) {
        const R = b ? t.varKinds.var : this.varKind, F = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${R} ${this.name}${F};` + E;
      }
      optimizeNames(b, E) {
        if (b[this.name.str])
          return this.rhs && (this.rhs = H(this.rhs, b, E)), this;
      }
      get names() {
        return this.rhs instanceof e._CodeOrName ? this.rhs.names : {};
      }
    }
    class a extends i {
      constructor(b, E, R) {
        super(), this.lhs = b, this.rhs = E, this.sideEffects = R;
      }
      render({ _n: b }) {
        return `${this.lhs} = ${this.rhs};` + b;
      }
      optimizeNames(b, E) {
        if (!(this.lhs instanceof e.Name && !b[this.lhs.str] && !this.sideEffects))
          return this.rhs = H(this.rhs, b, E), this;
      }
      get names() {
        const b = this.lhs instanceof e.Name ? {} : { ...this.lhs.names };
        return z(b, this.rhs);
      }
    }
    class c extends a {
      constructor(b, E, R, F) {
        super(b, R, F), this.op = E;
      }
      render({ _n: b }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + b;
      }
    }
    class u extends i {
      constructor(b) {
        super(), this.label = b, this.names = {};
      }
      render({ _n: b }) {
        return `${this.label}:` + b;
      }
    }
    class d extends i {
      constructor(b) {
        super(), this.label = b, this.names = {};
      }
      render({ _n: b }) {
        return `break${this.label ? ` ${this.label}` : ""};` + b;
      }
    }
    class y extends i {
      constructor(b) {
        super(), this.error = b;
      }
      render({ _n: b }) {
        return `throw ${this.error};` + b;
      }
      get names() {
        return this.error.names;
      }
    }
    class _ extends i {
      constructor(b) {
        super(), this.code = b;
      }
      render({ _n: b }) {
        return `${this.code};` + b;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(b, E) {
        return this.code = H(this.code, b, E), this;
      }
      get names() {
        return this.code instanceof e._CodeOrName ? this.code.names : {};
      }
    }
    class v extends i {
      constructor(b = []) {
        super(), this.nodes = b;
      }
      render(b) {
        return this.nodes.reduce((E, R) => E + R.render(b), "");
      }
      optimizeNodes() {
        const { nodes: b } = this;
        let E = b.length;
        for (; E--; ) {
          const R = b[E].optimizeNodes();
          Array.isArray(R) ? b.splice(E, 1, ...R) : R ? b[E] = R : b.splice(E, 1);
        }
        return b.length > 0 ? this : void 0;
      }
      optimizeNames(b, E) {
        const { nodes: R } = this;
        let F = R.length;
        for (; F--; ) {
          const x = R[F];
          x.optimizeNames(b, E) || (ce(b, x.names), R.splice(F, 1));
        }
        return R.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((b, E) => V(b, E.names), {});
      }
    }
    class S extends v {
      render(b) {
        return "{" + b._n + super.render(b) + "}" + b._n;
      }
    }
    class m extends v {
    }
    class h extends S {
    }
    h.kind = "else";
    class p extends S {
      constructor(b, E) {
        super(E), this.condition = b;
      }
      render(b) {
        let E = `if(${this.condition})` + super.render(b);
        return this.else && (E += "else " + this.else.render(b)), E;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const b = this.condition;
        if (b === !0)
          return this.nodes;
        let E = this.else;
        if (E) {
          const R = E.optimizeNodes();
          E = this.else = Array.isArray(R) ? new h(R) : R;
        }
        if (E)
          return b === !1 ? E instanceof p ? E : E.nodes : this.nodes.length ? this : new p(de(b), E instanceof p ? [E] : E.nodes);
        if (!(b === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(b, E) {
        var R;
        if (this.else = (R = this.else) === null || R === void 0 ? void 0 : R.optimizeNames(b, E), !!(super.optimizeNames(b, E) || this.else))
          return this.condition = H(this.condition, b, E), this;
      }
      get names() {
        const b = super.names;
        return z(b, this.condition), this.else && V(b, this.else.names), b;
      }
    }
    p.kind = "if";
    class l extends S {
    }
    l.kind = "for";
    class f extends l {
      constructor(b) {
        super(), this.iteration = b;
      }
      render(b) {
        return `for(${this.iteration})` + super.render(b);
      }
      optimizeNames(b, E) {
        if (super.optimizeNames(b, E))
          return this.iteration = H(this.iteration, b, E), this;
      }
      get names() {
        return V(super.names, this.iteration.names);
      }
    }
    class g extends l {
      constructor(b, E, R, F) {
        super(), this.varKind = b, this.name = E, this.from = R, this.to = F;
      }
      render(b) {
        const E = b.es5 ? t.varKinds.var : this.varKind, { name: R, from: F, to: x } = this;
        return `for(${E} ${R}=${F}; ${R}<${x}; ${R}++)` + super.render(b);
      }
      get names() {
        const b = z(super.names, this.from);
        return z(b, this.to);
      }
    }
    class $ extends l {
      constructor(b, E, R, F) {
        super(), this.loop = b, this.varKind = E, this.name = R, this.iterable = F;
      }
      render(b) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(b);
      }
      optimizeNames(b, E) {
        if (super.optimizeNames(b, E))
          return this.iterable = H(this.iterable, b, E), this;
      }
      get names() {
        return V(super.names, this.iterable.names);
      }
    }
    class w extends S {
      constructor(b, E, R) {
        super(), this.name = b, this.args = E, this.async = R;
      }
      render(b) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(b);
      }
    }
    w.kind = "func";
    class P extends v {
      render(b) {
        return "return " + super.render(b);
      }
    }
    P.kind = "return";
    class M extends S {
      render(b) {
        let E = "try" + super.render(b);
        return this.catch && (E += this.catch.render(b)), this.finally && (E += this.finally.render(b)), E;
      }
      optimizeNodes() {
        var b, E;
        return super.optimizeNodes(), (b = this.catch) === null || b === void 0 || b.optimizeNodes(), (E = this.finally) === null || E === void 0 || E.optimizeNodes(), this;
      }
      optimizeNames(b, E) {
        var R, F;
        return super.optimizeNames(b, E), (R = this.catch) === null || R === void 0 || R.optimizeNames(b, E), (F = this.finally) === null || F === void 0 || F.optimizeNames(b, E), this;
      }
      get names() {
        const b = super.names;
        return this.catch && V(b, this.catch.names), this.finally && V(b, this.finally.names), b;
      }
    }
    class j extends S {
      constructor(b) {
        super(), this.error = b;
      }
      render(b) {
        return `catch(${this.error})` + super.render(b);
      }
    }
    j.kind = "catch";
    class L extends S {
      render(b) {
        return "finally" + super.render(b);
      }
    }
    L.kind = "finally";
    class D {
      constructor(b, E = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...E, _n: E.lines ? `
` : "" }, this._extScope = b, this._scope = new t.Scope({ parent: b }), this._nodes = [new m()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(b) {
        return this._scope.name(b);
      }
      // reserves unique name in the external scope
      scopeName(b) {
        return this._extScope.name(b);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(b, E) {
        const R = this._extScope.value(b, E);
        return (this._values[R.prefix] || (this._values[R.prefix] = /* @__PURE__ */ new Set())).add(R), R;
      }
      getScopeValue(b, E) {
        return this._extScope.getValue(b, E);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(b) {
        return this._extScope.scopeRefs(b, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(b, E, R, F) {
        const x = this._scope.toName(E);
        return R !== void 0 && F && (this._constants[x.str] = R), this._leafNode(new s(b, x, R)), x;
      }
      // `const` declaration (`var` in es5 mode)
      const(b, E, R) {
        return this._def(t.varKinds.const, b, E, R);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(b, E, R) {
        return this._def(t.varKinds.let, b, E, R);
      }
      // `var` declaration with optional assignment
      var(b, E, R) {
        return this._def(t.varKinds.var, b, E, R);
      }
      // assignment code
      assign(b, E, R) {
        return this._leafNode(new a(b, E, R));
      }
      // `+=` code
      add(b, E) {
        return this._leafNode(new c(b, o.operators.ADD, E));
      }
      // appends passed SafeExpr to code or executes Block
      code(b) {
        return typeof b == "function" ? b() : b !== e.nil && this._leafNode(new _(b)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...b) {
        const E = ["{"];
        for (const [R, F] of b)
          E.length > 1 && E.push(","), E.push(R), (R !== F || this.opts.es5) && (E.push(":"), (0, e.addCodeArg)(E, F));
        return E.push("}"), new e._Code(E);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(b, E, R) {
        if (this._blockNode(new p(b)), E && R)
          this.code(E).else().code(R).endIf();
        else if (E)
          this.code(E).endIf();
        else if (R)
          throw new Error('CodeGen: "else" body without "then" body');
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(b) {
        return this._elseNode(new p(b));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new h());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(p, h);
      }
      _for(b, E) {
        return this._blockNode(b), E && this.code(E).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(b, E) {
        return this._for(new f(b), E);
      }
      // `for` statement for a range of values
      forRange(b, E, R, F, x = this.opts.es5 ? t.varKinds.var : t.varKinds.let) {
        const W = this._scope.toName(b);
        return this._for(new g(x, W, E, R), () => F(W));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(b, E, R, F = t.varKinds.const) {
        const x = this._scope.toName(b);
        if (this.opts.es5) {
          const W = E instanceof e.Name ? E : this.var("_arr", E);
          return this.forRange("_i", 0, (0, e._)`${W}.length`, (Q) => {
            this.var(x, (0, e._)`${W}[${Q}]`), R(x);
          });
        }
        return this._for(new $("of", F, x, E), () => R(x));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(b, E, R, F = this.opts.es5 ? t.varKinds.var : t.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(b, (0, e._)`Object.keys(${E})`, R);
        const x = this._scope.toName(b);
        return this._for(new $("in", F, x, E), () => R(x));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(l);
      }
      // `label` statement
      label(b) {
        return this._leafNode(new u(b));
      }
      // `break` statement
      break(b) {
        return this._leafNode(new d(b));
      }
      // `return` statement
      return(b) {
        const E = new P();
        if (this._blockNode(E), this.code(b), E.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(P);
      }
      // `try` statement
      try(b, E, R) {
        if (!E && !R)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const F = new M();
        if (this._blockNode(F), this.code(b), E) {
          const x = this.name("e");
          this._currNode = F.catch = new j(x), E(x);
        }
        return R && (this._currNode = F.finally = new L(), this.code(R)), this._endBlockNode(j, L);
      }
      // `throw` statement
      throw(b) {
        return this._leafNode(new y(b));
      }
      // start self-balancing block
      block(b, E) {
        return this._blockStarts.push(this._nodes.length), b && this.code(b).endBlock(E), this;
      }
      // end the current self-balancing block
      endBlock(b) {
        const E = this._blockStarts.pop();
        if (E === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const R = this._nodes.length - E;
        if (R < 0 || b !== void 0 && R !== b)
          throw new Error(`CodeGen: wrong number of nodes: ${R} vs ${b} expected`);
        return this._nodes.length = E, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(b, E = e.nil, R, F) {
        return this._blockNode(new w(b, E, R)), F && this.code(F).endFunc(), this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(w);
      }
      optimize(b = 1) {
        for (; b-- > 0; )
          this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
      }
      _leafNode(b) {
        return this._currNode.nodes.push(b), this;
      }
      _blockNode(b) {
        this._currNode.nodes.push(b), this._nodes.push(b);
      }
      _endBlockNode(b, E) {
        const R = this._currNode;
        if (R instanceof b || E && R instanceof E)
          return this._nodes.pop(), this;
        throw new Error(`CodeGen: not in block "${E ? `${b.kind}/${E.kind}` : b.kind}"`);
      }
      _elseNode(b) {
        const E = this._currNode;
        if (!(E instanceof p))
          throw new Error('CodeGen: "else" without "if"');
        return this._currNode = E.else = b, this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const b = this._nodes;
        return b[b.length - 1];
      }
      set _currNode(b) {
        const E = this._nodes;
        E[E.length - 1] = b;
      }
    }
    o.CodeGen = D;
    function V(N, b) {
      for (const E in b)
        N[E] = (N[E] || 0) + (b[E] || 0);
      return N;
    }
    function z(N, b) {
      return b instanceof e._CodeOrName ? V(N, b.names) : N;
    }
    function H(N, b, E) {
      if (N instanceof e.Name)
        return R(N);
      if (!F(N))
        return N;
      return new e._Code(N._items.reduce((x, W) => (W instanceof e.Name && (W = R(W)), W instanceof e._Code ? x.push(...W._items) : x.push(W), x), []));
      function R(x) {
        const W = E[x.str];
        return W === void 0 || b[x.str] !== 1 ? x : (delete b[x.str], W);
      }
      function F(x) {
        return x instanceof e._Code && x._items.some((W) => W instanceof e.Name && b[W.str] === 1 && E[W.str] !== void 0);
      }
    }
    function ce(N, b) {
      for (const E in b)
        N[E] = (N[E] || 0) - (b[E] || 0);
    }
    function de(N) {
      return typeof N == "boolean" || typeof N == "number" || N === null ? !N : (0, e._)`!${I(N)}`;
    }
    o.not = de;
    const ye = k(o.operators.AND);
    function ne(...N) {
      return N.reduce(ye);
    }
    o.and = ne;
    const he = k(o.operators.OR);
    function O(...N) {
      return N.reduce(he);
    }
    o.or = O;
    function k(N) {
      return (b, E) => b === e.nil ? E : E === e.nil ? b : (0, e._)`${I(b)} ${N} ${I(E)}`;
    }
    function I(N) {
      return N instanceof e.Name ? N : (0, e._)`(${N})`;
    }
  })(sr)), sr;
}
var ee = {}, Vr;
function ie() {
  if (Vr) return ee;
  Vr = 1, Object.defineProperty(ee, "__esModule", { value: !0 }), ee.checkStrictMode = ee.getErrorPath = ee.Type = ee.useFunc = ee.setEvaluated = ee.evaluatedPropsToName = ee.mergeEvaluated = ee.eachItem = ee.unescapeJsonPointer = ee.escapeJsonPointer = ee.escapeFragment = ee.unescapeFragment = ee.schemaRefOrVal = ee.schemaHasRulesButRef = ee.schemaHasRules = ee.checkUnknownRules = ee.alwaysValidSchema = ee.toHash = void 0;
  const o = te(), e = Yt();
  function t($) {
    const w = {};
    for (const P of $)
      w[P] = !0;
    return w;
  }
  ee.toHash = t;
  function r($, w) {
    return typeof w == "boolean" ? w : Object.keys(w).length === 0 ? !0 : (n($, w), !i(w, $.self.RULES.all));
  }
  ee.alwaysValidSchema = r;
  function n($, w = $.schema) {
    const { opts: P, self: M } = $;
    if (!P.strictSchema || typeof w == "boolean")
      return;
    const j = M.RULES.keywords;
    for (const L in w)
      j[L] || g($, `unknown keyword: "${L}"`);
  }
  ee.checkUnknownRules = n;
  function i($, w) {
    if (typeof $ == "boolean")
      return !$;
    for (const P in $)
      if (w[P])
        return !0;
    return !1;
  }
  ee.schemaHasRules = i;
  function s($, w) {
    if (typeof $ == "boolean")
      return !$;
    for (const P in $)
      if (P !== "$ref" && w.all[P])
        return !0;
    return !1;
  }
  ee.schemaHasRulesButRef = s;
  function a({ topSchemaRef: $, schemaPath: w }, P, M, j) {
    if (!j) {
      if (typeof P == "number" || typeof P == "boolean")
        return P;
      if (typeof P == "string")
        return (0, o._)`${P}`;
    }
    return (0, o._)`${$}${w}${(0, o.getProperty)(M)}`;
  }
  ee.schemaRefOrVal = a;
  function c($) {
    return y(decodeURIComponent($));
  }
  ee.unescapeFragment = c;
  function u($) {
    return encodeURIComponent(d($));
  }
  ee.escapeFragment = u;
  function d($) {
    return typeof $ == "number" ? `${$}` : $.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  ee.escapeJsonPointer = d;
  function y($) {
    return $.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  ee.unescapeJsonPointer = y;
  function _($, w) {
    if (Array.isArray($))
      for (const P of $)
        w(P);
    else
      w($);
  }
  ee.eachItem = _;
  function v({ mergeNames: $, mergeToName: w, mergeValues: P, resultToName: M }) {
    return (j, L, D, V) => {
      const z = D === void 0 ? L : D instanceof o.Name ? (L instanceof o.Name ? $(j, L, D) : w(j, L, D), D) : L instanceof o.Name ? (w(j, D, L), L) : P(L, D);
      return V === o.Name && !(z instanceof o.Name) ? M(j, z) : z;
    };
  }
  ee.mergeEvaluated = {
    props: v({
      mergeNames: ($, w, P) => $.if((0, o._)`${P} !== true && ${w} !== undefined`, () => {
        $.if((0, o._)`${w} === true`, () => $.assign(P, !0), () => $.assign(P, (0, o._)`${P} || {}`).code((0, o._)`Object.assign(${P}, ${w})`));
      }),
      mergeToName: ($, w, P) => $.if((0, o._)`${P} !== true`, () => {
        w === !0 ? $.assign(P, !0) : ($.assign(P, (0, o._)`${P} || {}`), m($, P, w));
      }),
      mergeValues: ($, w) => $ === !0 ? !0 : { ...$, ...w },
      resultToName: S
    }),
    items: v({
      mergeNames: ($, w, P) => $.if((0, o._)`${P} !== true && ${w} !== undefined`, () => $.assign(P, (0, o._)`${w} === true ? true : ${P} > ${w} ? ${P} : ${w}`)),
      mergeToName: ($, w, P) => $.if((0, o._)`${P} !== true`, () => $.assign(P, w === !0 ? !0 : (0, o._)`${P} > ${w} ? ${P} : ${w}`)),
      mergeValues: ($, w) => $ === !0 ? !0 : Math.max($, w),
      resultToName: ($, w) => $.var("items", w)
    })
  };
  function S($, w) {
    if (w === !0)
      return $.var("props", !0);
    const P = $.var("props", (0, o._)`{}`);
    return w !== void 0 && m($, P, w), P;
  }
  ee.evaluatedPropsToName = S;
  function m($, w, P) {
    Object.keys(P).forEach((M) => $.assign((0, o._)`${w}${(0, o.getProperty)(M)}`, !0));
  }
  ee.setEvaluated = m;
  const h = {};
  function p($, w) {
    return $.scopeValue("func", {
      ref: w,
      code: h[w.code] || (h[w.code] = new e._Code(w.code))
    });
  }
  ee.useFunc = p;
  var l;
  (function($) {
    $[$.Num = 0] = "Num", $[$.Str = 1] = "Str";
  })(l || (ee.Type = l = {}));
  function f($, w, P) {
    if ($ instanceof o.Name) {
      const M = w === l.Num;
      return P ? M ? (0, o._)`"[" + ${$} + "]"` : (0, o._)`"['" + ${$} + "']"` : M ? (0, o._)`"/" + ${$}` : (0, o._)`"/" + ${$}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return P ? (0, o.getProperty)($).toString() : "/" + d($);
  }
  ee.getErrorPath = f;
  function g($, w, P = $.opts.strictSchema) {
    if (P) {
      if (w = `strict mode: ${w}`, P === !0)
        throw new Error(w);
      $.self.logger.warn(w);
    }
  }
  return ee.checkStrictMode = g, ee;
}
var ut = {}, Fr;
function Fe() {
  if (Fr) return ut;
  Fr = 1, Object.defineProperty(ut, "__esModule", { value: !0 });
  const o = te(), e = {
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
    const e = te(), t = ie(), r = Fe();
    o.keywordError = {
      message: ({ keyword: h }) => (0, e.str)`must pass "${h}" keyword validation`
    }, o.keyword$DataError = {
      message: ({ keyword: h, schemaType: p }) => p ? (0, e.str)`"${h}" keyword must be ${p} ($data)` : (0, e.str)`"${h}" keyword is invalid ($data)`
    };
    function n(h, p = o.keywordError, l, f) {
      const { it: g } = h, { gen: $, compositeRule: w, allErrors: P } = g, M = y(h, p, l);
      f ?? (w || P) ? c($, M) : u(g, (0, e._)`[${M}]`);
    }
    o.reportError = n;
    function i(h, p = o.keywordError, l) {
      const { it: f } = h, { gen: g, compositeRule: $, allErrors: w } = f, P = y(h, p, l);
      c(g, P), $ || w || u(f, r.default.vErrors);
    }
    o.reportExtraError = i;
    function s(h, p) {
      h.assign(r.default.errors, p), h.if((0, e._)`${r.default.vErrors} !== null`, () => h.if(p, () => h.assign((0, e._)`${r.default.vErrors}.length`, p), () => h.assign(r.default.vErrors, null)));
    }
    o.resetErrorsCount = s;
    function a({ gen: h, keyword: p, schemaValue: l, data: f, errsCount: g, it: $ }) {
      if (g === void 0)
        throw new Error("ajv implementation error");
      const w = h.name("err");
      h.forRange("i", g, r.default.errors, (P) => {
        h.const(w, (0, e._)`${r.default.vErrors}[${P}]`), h.if((0, e._)`${w}.instancePath === undefined`, () => h.assign((0, e._)`${w}.instancePath`, (0, e.strConcat)(r.default.instancePath, $.errorPath))), h.assign((0, e._)`${w}.schemaPath`, (0, e.str)`${$.errSchemaPath}/${p}`), $.opts.verbose && (h.assign((0, e._)`${w}.schema`, l), h.assign((0, e._)`${w}.data`, f));
      });
    }
    o.extendErrors = a;
    function c(h, p) {
      const l = h.const("err", p);
      h.if((0, e._)`${r.default.vErrors} === null`, () => h.assign(r.default.vErrors, (0, e._)`[${l}]`), (0, e._)`${r.default.vErrors}.push(${l})`), h.code((0, e._)`${r.default.errors}++`);
    }
    function u(h, p) {
      const { gen: l, validateName: f, schemaEnv: g } = h;
      g.$async ? l.throw((0, e._)`new ${h.ValidationError}(${p})`) : (l.assign((0, e._)`${f}.errors`, p), l.return(!1));
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
    function y(h, p, l) {
      const { createErrors: f } = h.it;
      return f === !1 ? (0, e._)`{}` : _(h, p, l);
    }
    function _(h, p, l = {}) {
      const { gen: f, it: g } = h, $ = [
        v(g, l),
        S(h, l)
      ];
      return m(h, p, $), f.object(...$);
    }
    function v({ errorPath: h }, { instancePath: p }) {
      const l = p ? (0, e.str)`${h}${(0, t.getErrorPath)(p, t.Type.Str)}` : h;
      return [r.default.instancePath, (0, e.strConcat)(r.default.instancePath, l)];
    }
    function S({ keyword: h, it: { errSchemaPath: p } }, { schemaPath: l, parentSchema: f }) {
      let g = f ? p : (0, e.str)`${p}/${h}`;
      return l && (g = (0, e.str)`${g}${(0, t.getErrorPath)(l, t.Type.Str)}`), [d.schemaPath, g];
    }
    function m(h, { params: p, message: l }, f) {
      const { keyword: g, data: $, schemaValue: w, it: P } = h, { opts: M, propertyName: j, topSchemaRef: L, schemaPath: D } = P;
      f.push([d.keyword, g], [d.params, typeof p == "function" ? p(h) : p || (0, e._)`{}`]), M.messages && f.push([d.message, typeof l == "function" ? l(h) : l]), M.verbose && f.push([d.schema, w], [d.parentSchema, (0, e._)`${L}${D}`], [r.default.data, $]), j && f.push([d.propertyName, j]);
    }
  })(or)), or;
}
var Br;
function Ii() {
  if (Br) return Ge;
  Br = 1, Object.defineProperty(Ge, "__esModule", { value: !0 }), Ge.boolOrEmptySchema = Ge.topBoolOrEmptySchema = void 0;
  const o = Xt(), e = te(), t = Fe(), r = {
    message: "boolean schema is false"
  };
  function n(a) {
    const { gen: c, schema: u, validateName: d } = a;
    u === !1 ? s(a, !1) : typeof u == "object" && u.$async === !0 ? c.return(t.default.data) : (c.assign((0, e._)`${d}.errors`, null), c.return(!0));
  }
  Ge.topBoolOrEmptySchema = n;
  function i(a, c) {
    const { gen: u, schema: d } = a;
    d === !1 ? (u.var(c, !1), s(a)) : u.var(c, !0);
  }
  Ge.boolOrEmptySchema = i;
  function s(a, c) {
    const { gen: u, data: d } = a, y = {
      gen: u,
      keyword: "false schema",
      data: d,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: a
    };
    (0, o.reportError)(y, r, void 0, c);
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
  const o = ti(), e = ri(), t = Xt(), r = te(), n = ie();
  var i;
  (function(l) {
    l[l.Correct = 0] = "Correct", l[l.Wrong = 1] = "Wrong";
  })(i || (_e.DataType = i = {}));
  function s(l) {
    const f = a(l.type);
    if (f.includes("null")) {
      if (l.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!f.length && l.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      l.nullable === !0 && f.push("null");
    }
    return f;
  }
  _e.getSchemaTypes = s;
  function a(l) {
    const f = Array.isArray(l) ? l : l ? [l] : [];
    if (f.every(o.isJSONType))
      return f;
    throw new Error("type must be JSONType or JSONType[]: " + f.join(","));
  }
  _e.getJSONTypes = a;
  function c(l, f) {
    const { gen: g, data: $, opts: w } = l, P = d(f, w.coerceTypes), M = f.length > 0 && !(P.length === 0 && f.length === 1 && (0, e.schemaHasRulesForType)(l, f[0]));
    if (M) {
      const j = S(f, $, w.strictNumbers, i.Wrong);
      g.if(j, () => {
        P.length ? y(l, f, P) : h(l);
      });
    }
    return M;
  }
  _e.coerceAndCheckDataType = c;
  const u = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function d(l, f) {
    return f ? l.filter((g) => u.has(g) || f === "array" && g === "array") : [];
  }
  function y(l, f, g) {
    const { gen: $, data: w, opts: P } = l, M = $.let("dataType", (0, r._)`typeof ${w}`), j = $.let("coerced", (0, r._)`undefined`);
    P.coerceTypes === "array" && $.if((0, r._)`${M} == 'object' && Array.isArray(${w}) && ${w}.length == 1`, () => $.assign(w, (0, r._)`${w}[0]`).assign(M, (0, r._)`typeof ${w}`).if(S(f, w, P.strictNumbers), () => $.assign(j, w))), $.if((0, r._)`${j} !== undefined`);
    for (const D of g)
      (u.has(D) || D === "array" && P.coerceTypes === "array") && L(D);
    $.else(), h(l), $.endIf(), $.if((0, r._)`${j} !== undefined`, () => {
      $.assign(w, j), _(l, j);
    });
    function L(D) {
      switch (D) {
        case "string":
          $.elseIf((0, r._)`${M} == "number" || ${M} == "boolean"`).assign(j, (0, r._)`"" + ${w}`).elseIf((0, r._)`${w} === null`).assign(j, (0, r._)`""`);
          return;
        case "number":
          $.elseIf((0, r._)`${M} == "boolean" || ${w} === null
              || (${M} == "string" && ${w} && ${w} == +${w})`).assign(j, (0, r._)`+${w}`);
          return;
        case "integer":
          $.elseIf((0, r._)`${M} === "boolean" || ${w} === null
              || (${M} === "string" && ${w} && ${w} == +${w} && !(${w} % 1))`).assign(j, (0, r._)`+${w}`);
          return;
        case "boolean":
          $.elseIf((0, r._)`${w} === "false" || ${w} === 0 || ${w} === null`).assign(j, !1).elseIf((0, r._)`${w} === "true" || ${w} === 1`).assign(j, !0);
          return;
        case "null":
          $.elseIf((0, r._)`${w} === "" || ${w} === 0 || ${w} === false`), $.assign(j, null);
          return;
        case "array":
          $.elseIf((0, r._)`${M} === "string" || ${M} === "number"
              || ${M} === "boolean" || ${w} === null`).assign(j, (0, r._)`[${w}]`);
      }
    }
  }
  function _({ gen: l, parentData: f, parentDataProperty: g }, $) {
    l.if((0, r._)`${f} !== undefined`, () => l.assign((0, r._)`${f}[${g}]`, $));
  }
  function v(l, f, g, $ = i.Correct) {
    const w = $ === i.Correct ? r.operators.EQ : r.operators.NEQ;
    let P;
    switch (l) {
      case "null":
        return (0, r._)`${f} ${w} null`;
      case "array":
        P = (0, r._)`Array.isArray(${f})`;
        break;
      case "object":
        P = (0, r._)`${f} && typeof ${f} == "object" && !Array.isArray(${f})`;
        break;
      case "integer":
        P = M((0, r._)`!(${f} % 1) && !isNaN(${f})`);
        break;
      case "number":
        P = M();
        break;
      default:
        return (0, r._)`typeof ${f} ${w} ${l}`;
    }
    return $ === i.Correct ? P : (0, r.not)(P);
    function M(j = r.nil) {
      return (0, r.and)((0, r._)`typeof ${f} == "number"`, j, g ? (0, r._)`isFinite(${f})` : r.nil);
    }
  }
  _e.checkDataType = v;
  function S(l, f, g, $) {
    if (l.length === 1)
      return v(l[0], f, g, $);
    let w;
    const P = (0, n.toHash)(l);
    if (P.array && P.object) {
      const M = (0, r._)`typeof ${f} != "object"`;
      w = P.null ? M : (0, r._)`!${f} || ${M}`, delete P.null, delete P.array, delete P.object;
    } else
      w = r.nil;
    P.number && delete P.integer;
    for (const M in P)
      w = (0, r.and)(w, v(M, f, g, $));
    return w;
  }
  _e.checkDataTypes = S;
  const m = {
    message: ({ schema: l }) => `must be ${l}`,
    params: ({ schema: l, schemaValue: f }) => typeof l == "string" ? (0, r._)`{type: ${l}}` : (0, r._)`{type: ${f}}`
  };
  function h(l) {
    const f = p(l);
    (0, t.reportError)(f, m);
  }
  _e.reportTypeError = h;
  function p(l) {
    const { gen: f, data: g, schema: $ } = l, w = (0, n.schemaRefOrVal)(l, $, "type");
    return {
      gen: f,
      keyword: "type",
      data: g,
      schema: $.type,
      schemaCode: w,
      schemaValue: w,
      parentSchema: $,
      params: {},
      it: l
    };
  }
  return _e;
}
var et = {}, Hr;
function Oi() {
  if (Hr) return et;
  Hr = 1, Object.defineProperty(et, "__esModule", { value: !0 }), et.assignDefaults = void 0;
  const o = te(), e = ie();
  function t(n, i) {
    const { properties: s, items: a } = n.schema;
    if (i === "object" && s)
      for (const c in s)
        r(n, c, s[c].default);
    else i === "array" && Array.isArray(a) && a.forEach((c, u) => r(n, u, c.default));
  }
  et.assignDefaults = t;
  function r(n, i, s) {
    const { gen: a, compositeRule: c, data: u, opts: d } = n;
    if (s === void 0)
      return;
    const y = (0, o._)`${u}${(0, o.getProperty)(i)}`;
    if (c) {
      (0, e.checkStrictMode)(n, `default is ignored for: ${y}`);
      return;
    }
    let _ = (0, o._)`${y} === undefined`;
    d.useDefaults === "empty" && (_ = (0, o._)`${_} || ${y} === null || ${y} === ""`), a.if(_, (0, o._)`${y} = ${(0, o.stringify)(s)}`);
  }
  return et;
}
var Ne = {}, ae = {}, Yr;
function Re() {
  if (Yr) return ae;
  Yr = 1, Object.defineProperty(ae, "__esModule", { value: !0 }), ae.validateUnion = ae.validateArray = ae.usePattern = ae.callValidateCode = ae.schemaProperties = ae.allSchemaProperties = ae.noPropertyInData = ae.propertyInData = ae.isOwnProperty = ae.hasPropFunc = ae.reportMissingProp = ae.checkMissingProp = ae.checkReportMissingProp = void 0;
  const o = te(), e = ie(), t = Fe(), r = ie();
  function n(l, f) {
    const { gen: g, data: $, it: w } = l;
    g.if(d(g, $, f, w.opts.ownProperties), () => {
      l.setParams({ missingProperty: (0, o._)`${f}` }, !0), l.error();
    });
  }
  ae.checkReportMissingProp = n;
  function i({ gen: l, data: f, it: { opts: g } }, $, w) {
    return (0, o.or)(...$.map((P) => (0, o.and)(d(l, f, P, g.ownProperties), (0, o._)`${w} = ${P}`)));
  }
  ae.checkMissingProp = i;
  function s(l, f) {
    l.setParams({ missingProperty: f }, !0), l.error();
  }
  ae.reportMissingProp = s;
  function a(l) {
    return l.scopeValue("func", {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ref: Object.prototype.hasOwnProperty,
      code: (0, o._)`Object.prototype.hasOwnProperty`
    });
  }
  ae.hasPropFunc = a;
  function c(l, f, g) {
    return (0, o._)`${a(l)}.call(${f}, ${g})`;
  }
  ae.isOwnProperty = c;
  function u(l, f, g, $) {
    const w = (0, o._)`${f}${(0, o.getProperty)(g)} !== undefined`;
    return $ ? (0, o._)`${w} && ${c(l, f, g)}` : w;
  }
  ae.propertyInData = u;
  function d(l, f, g, $) {
    const w = (0, o._)`${f}${(0, o.getProperty)(g)} === undefined`;
    return $ ? (0, o.or)(w, (0, o.not)(c(l, f, g))) : w;
  }
  ae.noPropertyInData = d;
  function y(l) {
    return l ? Object.keys(l).filter((f) => f !== "__proto__") : [];
  }
  ae.allSchemaProperties = y;
  function _(l, f) {
    return y(f).filter((g) => !(0, e.alwaysValidSchema)(l, f[g]));
  }
  ae.schemaProperties = _;
  function v({ schemaCode: l, data: f, it: { gen: g, topSchemaRef: $, schemaPath: w, errorPath: P }, it: M }, j, L, D) {
    const V = D ? (0, o._)`${l}, ${f}, ${$}${w}` : f, z = [
      [t.default.instancePath, (0, o.strConcat)(t.default.instancePath, P)],
      [t.default.parentData, M.parentData],
      [t.default.parentDataProperty, M.parentDataProperty],
      [t.default.rootData, t.default.rootData]
    ];
    M.opts.dynamicRef && z.push([t.default.dynamicAnchors, t.default.dynamicAnchors]);
    const H = (0, o._)`${V}, ${g.object(...z)}`;
    return L !== o.nil ? (0, o._)`${j}.call(${L}, ${H})` : (0, o._)`${j}(${H})`;
  }
  ae.callValidateCode = v;
  const S = (0, o._)`new RegExp`;
  function m({ gen: l, it: { opts: f } }, g) {
    const $ = f.unicodeRegExp ? "u" : "", { regExp: w } = f.code, P = w(g, $);
    return l.scopeValue("pattern", {
      key: P.toString(),
      ref: P,
      code: (0, o._)`${w.code === "new RegExp" ? S : (0, r.useFunc)(l, w)}(${g}, ${$})`
    });
  }
  ae.usePattern = m;
  function h(l) {
    const { gen: f, data: g, keyword: $, it: w } = l, P = f.name("valid");
    if (w.allErrors) {
      const j = f.let("valid", !0);
      return M(() => f.assign(j, !1)), j;
    }
    return f.var(P, !0), M(() => f.break()), P;
    function M(j) {
      const L = f.const("len", (0, o._)`${g}.length`);
      f.forRange("i", 0, L, (D) => {
        l.subschema({
          keyword: $,
          dataProp: D,
          dataPropType: e.Type.Num
        }, P), f.if((0, o.not)(P), j);
      });
    }
  }
  ae.validateArray = h;
  function p(l) {
    const { gen: f, schema: g, keyword: $, it: w } = l;
    if (!Array.isArray(g))
      throw new Error("ajv implementation error");
    if (g.some((L) => (0, e.alwaysValidSchema)(w, L)) && !w.opts.unevaluated)
      return;
    const M = f.let("valid", !1), j = f.name("_valid");
    f.block(() => g.forEach((L, D) => {
      const V = l.subschema({
        keyword: $,
        schemaProp: D,
        compositeRule: !0
      }, j);
      f.assign(M, (0, o._)`${M} || ${j}`), l.mergeValidEvaluated(V, j) || f.if((0, o.not)(M));
    })), l.result(M, () => l.reset(), () => l.error(!0));
  }
  return ae.validateUnion = p, ae;
}
var Wr;
function qi() {
  if (Wr) return Ne;
  Wr = 1, Object.defineProperty(Ne, "__esModule", { value: !0 }), Ne.validateKeywordUsage = Ne.validSchemaType = Ne.funcKeywordCode = Ne.macroKeywordCode = void 0;
  const o = te(), e = Fe(), t = Re(), r = Xt();
  function n(_, v) {
    const { gen: S, keyword: m, schema: h, parentSchema: p, it: l } = _, f = v.macro.call(l.self, h, p, l), g = u(S, m, f);
    l.opts.validateSchema !== !1 && l.self.validateSchema(f, !0);
    const $ = S.name("valid");
    _.subschema({
      schema: f,
      schemaPath: o.nil,
      errSchemaPath: `${l.errSchemaPath}/${m}`,
      topSchemaRef: g,
      compositeRule: !0
    }, $), _.pass($, () => _.error(!0));
  }
  Ne.macroKeywordCode = n;
  function i(_, v) {
    var S;
    const { gen: m, keyword: h, schema: p, parentSchema: l, $data: f, it: g } = _;
    c(g, v);
    const $ = !f && v.compile ? v.compile.call(g.self, p, l, g) : v.validate, w = u(m, h, $), P = m.let("valid");
    _.block$data(P, M), _.ok((S = v.valid) !== null && S !== void 0 ? S : P);
    function M() {
      if (v.errors === !1)
        D(), v.modifying && s(_), V(() => _.error());
      else {
        const z = v.async ? j() : L();
        v.modifying && s(_), V(() => a(_, z));
      }
    }
    function j() {
      const z = m.let("ruleErrs", null);
      return m.try(() => D((0, o._)`await `), (H) => m.assign(P, !1).if((0, o._)`${H} instanceof ${g.ValidationError}`, () => m.assign(z, (0, o._)`${H}.errors`), () => m.throw(H))), z;
    }
    function L() {
      const z = (0, o._)`${w}.errors`;
      return m.assign(z, null), D(o.nil), z;
    }
    function D(z = v.async ? (0, o._)`await ` : o.nil) {
      const H = g.opts.passContext ? e.default.this : e.default.self, ce = !("compile" in v && !f || v.schema === !1);
      m.assign(P, (0, o._)`${z}${(0, t.callValidateCode)(_, w, H, ce)}`, v.modifying);
    }
    function V(z) {
      var H;
      m.if((0, o.not)((H = v.valid) !== null && H !== void 0 ? H : P), z);
    }
  }
  Ne.funcKeywordCode = i;
  function s(_) {
    const { gen: v, data: S, it: m } = _;
    v.if(m.parentData, () => v.assign(S, (0, o._)`${m.parentData}[${m.parentDataProperty}]`));
  }
  function a(_, v) {
    const { gen: S } = _;
    S.if((0, o._)`Array.isArray(${v})`, () => {
      S.assign(e.default.vErrors, (0, o._)`${e.default.vErrors} === null ? ${v} : ${e.default.vErrors}.concat(${v})`).assign(e.default.errors, (0, o._)`${e.default.vErrors}.length`), (0, r.extendErrors)(_);
    }, () => _.error());
  }
  function c({ schemaEnv: _ }, v) {
    if (v.async && !_.$async)
      throw new Error("async keyword in sync schema");
  }
  function u(_, v, S) {
    if (S === void 0)
      throw new Error(`keyword "${v}" failed to compile`);
    return _.scopeValue("keyword", typeof S == "function" ? { ref: S } : { ref: S, code: (0, o.stringify)(S) });
  }
  function d(_, v, S = !1) {
    return !v.length || v.some((m) => m === "array" ? Array.isArray(_) : m === "object" ? _ && typeof _ == "object" && !Array.isArray(_) : typeof _ == m || S && typeof _ > "u");
  }
  Ne.validSchemaType = d;
  function y({ schema: _, opts: v, self: S, errSchemaPath: m }, h, p) {
    if (Array.isArray(h.keyword) ? !h.keyword.includes(p) : h.keyword !== p)
      throw new Error("ajv implementation error");
    const l = h.dependencies;
    if (l?.some((f) => !Object.prototype.hasOwnProperty.call(_, f)))
      throw new Error(`parent schema must have dependencies of ${p}: ${l.join(",")}`);
    if (h.validateSchema && !h.validateSchema(_[p])) {
      const g = `keyword "${p}" value is invalid at path "${m}": ` + S.errorsText(h.validateSchema.errors);
      if (v.validateSchema === "log")
        S.logger.error(g);
      else
        throw new Error(g);
    }
  }
  return Ne.validateKeywordUsage = y, Ne;
}
var ze = {}, Qr;
function Di() {
  if (Qr) return ze;
  Qr = 1, Object.defineProperty(ze, "__esModule", { value: !0 }), ze.extendSubschemaMode = ze.extendSubschemaData = ze.getSubschema = void 0;
  const o = te(), e = ie();
  function t(i, { keyword: s, schemaProp: a, schema: c, schemaPath: u, errSchemaPath: d, topSchemaRef: y }) {
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
      if (u === void 0 || d === void 0 || y === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: c,
        schemaPath: u,
        topSchemaRef: y,
        errSchemaPath: d
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  ze.getSubschema = t;
  function r(i, s, { dataProp: a, dataPropType: c, data: u, dataTypes: d, propertyName: y }) {
    if (u !== void 0 && a !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: _ } = s;
    if (a !== void 0) {
      const { errorPath: S, dataPathArr: m, opts: h } = s, p = _.let("data", (0, o._)`${s.data}${(0, o.getProperty)(a)}`, !0);
      v(p), i.errorPath = (0, o.str)`${S}${(0, e.getErrorPath)(a, c, h.jsPropertySyntax)}`, i.parentDataProperty = (0, o._)`${a}`, i.dataPathArr = [...m, i.parentDataProperty];
    }
    if (u !== void 0) {
      const S = u instanceof o.Name ? u : _.let("data", u, !0);
      v(S), y !== void 0 && (i.propertyName = y);
    }
    d && (i.dataTypes = d);
    function v(S) {
      i.data = S, i.dataLevel = s.dataLevel + 1, i.dataTypes = [], s.definedProperties = /* @__PURE__ */ new Set(), i.parentData = s.data, i.dataNames = [...s.dataNames, S];
    }
  }
  ze.extendSubschemaData = r;
  function n(i, { jtdDiscriminator: s, jtdMetadata: a, compositeRule: c, createErrors: u, allErrors: d }) {
    c !== void 0 && (i.compositeRule = c), u !== void 0 && (i.createErrors = u), d !== void 0 && (i.allErrors = d), i.jtdDiscriminator = s, i.jtdMetadata = a;
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
  function e(r, n, i, s, a, c, u, d, y, _) {
    if (s && typeof s == "object" && !Array.isArray(s)) {
      n(s, a, c, u, d, y, _);
      for (var v in s) {
        var S = s[v];
        if (Array.isArray(S)) {
          if (v in o.arrayKeywords)
            for (var m = 0; m < S.length; m++)
              e(r, n, i, S[m], a + "/" + v + "/" + m, c, a, v, s, m);
        } else if (v in o.propsKeywords) {
          if (S && typeof S == "object")
            for (var h in S)
              e(r, n, i, S[h], a + "/" + v + "/" + t(h), c, a, v, s, h);
        } else (v in o.keywords || r.allKeys && !(v in o.skipKeywords)) && e(r, n, i, S, a + "/" + v, c, a, v, s);
      }
      i(s, a, c, u, d, y, _);
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
  const o = ie(), e = ni(), t = Li(), r = /* @__PURE__ */ new Set([
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
      if (h++, !r.has(p) && (typeof m[p] == "object" && (0, o.eachItem)(m[p], (l) => h += a(l)), h === 1 / 0))
        return 1 / 0;
    }
    return h;
  }
  function c(m, h = "", p) {
    p !== !1 && (h = y(h));
    const l = m.parse(h);
    return u(m, l);
  }
  Ee.getFullPath = c;
  function u(m, h) {
    return m.serialize(h).split("#")[0] + "#";
  }
  Ee._getFullPath = u;
  const d = /#\/?$/;
  function y(m) {
    return m ? m.replace(d, "") : "";
  }
  Ee.normalizeId = y;
  function _(m, h, p) {
    return p = y(p), m.resolve(h, p);
  }
  Ee.resolveUrl = _;
  const v = /^[a-z_][-a-z0-9._]*$/i;
  function S(m, h) {
    if (typeof m == "boolean")
      return {};
    const { schemaId: p, uriResolver: l } = this.opts, f = y(m[p] || h), g = { "": f }, $ = c(l, f, !1), w = {}, P = /* @__PURE__ */ new Set();
    return t(m, { allKeys: !0 }, (L, D, V, z) => {
      if (z === void 0)
        return;
      const H = $ + D;
      let ce = g[z];
      typeof L[p] == "string" && (ce = de.call(this, L[p])), ye.call(this, L.$anchor), ye.call(this, L.$dynamicAnchor), g[D] = ce;
      function de(ne) {
        const he = this.opts.uriResolver.resolve;
        if (ne = y(ce ? he(ce, ne) : ne), P.has(ne))
          throw j(ne);
        P.add(ne);
        let O = this.refs[ne];
        return typeof O == "string" && (O = this.refs[O]), typeof O == "object" ? M(L, O.schema, ne) : ne !== y(H) && (ne[0] === "#" ? (M(L, w[ne], ne), w[ne] = L) : this.refs[ne] = H), ne;
      }
      function ye(ne) {
        if (typeof ne == "string") {
          if (!v.test(ne))
            throw new Error(`invalid anchor "${ne}"`);
          de.call(this, `#${ne}`);
        }
      }
    }), w;
    function M(L, D, V) {
      if (D !== void 0 && !e(L, D))
        throw j(V);
    }
    function j(L) {
      return new Error(`reference "${L}" resolves to more than one schema`);
    }
  }
  return Ee.getSchemaRefs = S, Ee;
}
var tn;
function er() {
  if (tn) return De;
  tn = 1, Object.defineProperty(De, "__esModule", { value: !0 }), De.getData = De.KeywordCxt = De.validateFunctionCode = void 0;
  const o = Ii(), e = Wt(), t = ri(), r = Wt(), n = Oi(), i = qi(), s = Di(), a = te(), c = Fe(), u = Zt(), d = ie(), y = Xt();
  function _(T) {
    if ($(T) && (P(T), g(T))) {
      h(T);
      return;
    }
    v(T, () => (0, o.topBoolOrEmptySchema)(T));
  }
  De.validateFunctionCode = _;
  function v({ gen: T, validateName: A, schema: C, schemaEnv: q, opts: B }, X) {
    B.code.es5 ? T.func(A, (0, a._)`${c.default.data}, ${c.default.valCxt}`, q.$async, () => {
      T.code((0, a._)`"use strict"; ${l(C, B)}`), m(T, B), T.code(X);
    }) : T.func(A, (0, a._)`${c.default.data}, ${S(B)}`, q.$async, () => T.code(l(C, B)).code(X));
  }
  function S(T) {
    return (0, a._)`{${c.default.instancePath}="", ${c.default.parentData}, ${c.default.parentDataProperty}, ${c.default.rootData}=${c.default.data}${T.dynamicRef ? (0, a._)`, ${c.default.dynamicAnchors}={}` : a.nil}}={}`;
  }
  function m(T, A) {
    T.if(c.default.valCxt, () => {
      T.var(c.default.instancePath, (0, a._)`${c.default.valCxt}.${c.default.instancePath}`), T.var(c.default.parentData, (0, a._)`${c.default.valCxt}.${c.default.parentData}`), T.var(c.default.parentDataProperty, (0, a._)`${c.default.valCxt}.${c.default.parentDataProperty}`), T.var(c.default.rootData, (0, a._)`${c.default.valCxt}.${c.default.rootData}`), A.dynamicRef && T.var(c.default.dynamicAnchors, (0, a._)`${c.default.valCxt}.${c.default.dynamicAnchors}`);
    }, () => {
      T.var(c.default.instancePath, (0, a._)`""`), T.var(c.default.parentData, (0, a._)`undefined`), T.var(c.default.parentDataProperty, (0, a._)`undefined`), T.var(c.default.rootData, c.default.data), A.dynamicRef && T.var(c.default.dynamicAnchors, (0, a._)`{}`);
    });
  }
  function h(T) {
    const { schema: A, opts: C, gen: q } = T;
    v(T, () => {
      C.$comment && A.$comment && z(T), L(T), q.let(c.default.vErrors, null), q.let(c.default.errors, 0), C.unevaluated && p(T), M(T), H(T);
    });
  }
  function p(T) {
    const { gen: A, validateName: C } = T;
    T.evaluated = A.const("evaluated", (0, a._)`${C}.evaluated`), A.if((0, a._)`${T.evaluated}.dynamicProps`, () => A.assign((0, a._)`${T.evaluated}.props`, (0, a._)`undefined`)), A.if((0, a._)`${T.evaluated}.dynamicItems`, () => A.assign((0, a._)`${T.evaluated}.items`, (0, a._)`undefined`));
  }
  function l(T, A) {
    const C = typeof T == "object" && T[A.schemaId];
    return C && (A.code.source || A.code.process) ? (0, a._)`/*# sourceURL=${C} */` : a.nil;
  }
  function f(T, A) {
    if ($(T) && (P(T), g(T))) {
      w(T, A);
      return;
    }
    (0, o.boolOrEmptySchema)(T, A);
  }
  function g({ schema: T, self: A }) {
    if (typeof T == "boolean")
      return !T;
    for (const C in T)
      if (A.RULES.all[C])
        return !0;
    return !1;
  }
  function $(T) {
    return typeof T.schema != "boolean";
  }
  function w(T, A) {
    const { schema: C, gen: q, opts: B } = T;
    B.$comment && C.$comment && z(T), D(T), V(T);
    const X = q.const("_errs", c.default.errors);
    M(T, X), q.var(A, (0, a._)`${X} === ${c.default.errors}`);
  }
  function P(T) {
    (0, d.checkUnknownRules)(T), j(T);
  }
  function M(T, A) {
    if (T.opts.jtd)
      return de(T, [], !1, A);
    const C = (0, e.getSchemaTypes)(T.schema), q = (0, e.coerceAndCheckDataType)(T, C);
    de(T, C, !q, A);
  }
  function j(T) {
    const { schema: A, errSchemaPath: C, opts: q, self: B } = T;
    A.$ref && q.ignoreKeywordsWithRef && (0, d.schemaHasRulesButRef)(A, B.RULES) && B.logger.warn(`$ref: keywords ignored in schema at path "${C}"`);
  }
  function L(T) {
    const { schema: A, opts: C } = T;
    A.default !== void 0 && C.useDefaults && C.strictSchema && (0, d.checkStrictMode)(T, "default is ignored in the schema root");
  }
  function D(T) {
    const A = T.schema[T.opts.schemaId];
    A && (T.baseId = (0, u.resolveUrl)(T.opts.uriResolver, T.baseId, A));
  }
  function V(T) {
    if (T.schema.$async && !T.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function z({ gen: T, schemaEnv: A, schema: C, errSchemaPath: q, opts: B }) {
    const X = C.$comment;
    if (B.$comment === !0)
      T.code((0, a._)`${c.default.self}.logger.log(${X})`);
    else if (typeof B.$comment == "function") {
      const le = (0, a.str)`${q}/$comment`, Te = T.scopeValue("root", { ref: A.root });
      T.code((0, a._)`${c.default.self}.opts.$comment(${X}, ${le}, ${Te}.schema)`);
    }
  }
  function H(T) {
    const { gen: A, schemaEnv: C, validateName: q, ValidationError: B, opts: X } = T;
    C.$async ? A.if((0, a._)`${c.default.errors} === 0`, () => A.return(c.default.data), () => A.throw((0, a._)`new ${B}(${c.default.vErrors})`)) : (A.assign((0, a._)`${q}.errors`, c.default.vErrors), X.unevaluated && ce(T), A.return((0, a._)`${c.default.errors} === 0`));
  }
  function ce({ gen: T, evaluated: A, props: C, items: q }) {
    C instanceof a.Name && T.assign((0, a._)`${A}.props`, C), q instanceof a.Name && T.assign((0, a._)`${A}.items`, q);
  }
  function de(T, A, C, q) {
    const { gen: B, schema: X, data: le, allErrors: Te, opts: pe, self: ve } = T, { RULES: me } = ve;
    if (X.$ref && (pe.ignoreKeywordsWithRef || !(0, d.schemaHasRulesButRef)(X, me))) {
      B.block(() => F(T, "$ref", me.all.$ref.definition));
      return;
    }
    pe.jtd || ne(T, A), B.block(() => {
      for (const Pe of me.rules)
        Oe(Pe);
      Oe(me.post);
    });
    function Oe(Pe) {
      (0, t.shouldUseGroup)(X, Pe) && (Pe.type ? (B.if((0, r.checkDataType)(Pe.type, le, pe.strictNumbers)), ye(T, Pe), A.length === 1 && A[0] === Pe.type && C && (B.else(), (0, r.reportTypeError)(T)), B.endIf()) : ye(T, Pe), Te || B.if((0, a._)`${c.default.errors} === ${q || 0}`));
    }
  }
  function ye(T, A) {
    const { gen: C, schema: q, opts: { useDefaults: B } } = T;
    B && (0, n.assignDefaults)(T, A.type), C.block(() => {
      for (const X of A.rules)
        (0, t.shouldUseRule)(q, X) && F(T, X.keyword, X.definition, A.type);
    });
  }
  function ne(T, A) {
    T.schemaEnv.meta || !T.opts.strictTypes || (he(T, A), T.opts.allowUnionTypes || O(T, A), k(T, T.dataTypes));
  }
  function he(T, A) {
    if (A.length) {
      if (!T.dataTypes.length) {
        T.dataTypes = A;
        return;
      }
      A.forEach((C) => {
        N(T.dataTypes, C) || E(T, `type "${C}" not allowed by context "${T.dataTypes.join(",")}"`);
      }), b(T, A);
    }
  }
  function O(T, A) {
    A.length > 1 && !(A.length === 2 && A.includes("null")) && E(T, "use allowUnionTypes to allow union type keyword");
  }
  function k(T, A) {
    const C = T.self.RULES.all;
    for (const q in C) {
      const B = C[q];
      if (typeof B == "object" && (0, t.shouldUseRule)(T.schema, B)) {
        const { type: X } = B.definition;
        X.length && !X.some((le) => I(A, le)) && E(T, `missing type "${X.join(",")}" for keyword "${q}"`);
      }
    }
  }
  function I(T, A) {
    return T.includes(A) || A === "number" && T.includes("integer");
  }
  function N(T, A) {
    return T.includes(A) || A === "integer" && T.includes("number");
  }
  function b(T, A) {
    const C = [];
    for (const q of T.dataTypes)
      N(A, q) ? C.push(q) : A.includes("integer") && q === "number" && C.push("integer");
    T.dataTypes = C;
  }
  function E(T, A) {
    const C = T.schemaEnv.baseId + T.errSchemaPath;
    A += ` at "${C}" (strictTypes)`, (0, d.checkStrictMode)(T, A, T.opts.strictTypes);
  }
  class R {
    constructor(A, C, q) {
      if ((0, i.validateKeywordUsage)(A, C, q), this.gen = A.gen, this.allErrors = A.allErrors, this.keyword = q, this.data = A.data, this.schema = A.schema[q], this.$data = C.$data && A.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, d.schemaRefOrVal)(A, this.schema, q, this.$data), this.schemaType = C.schemaType, this.parentSchema = A.schema, this.params = {}, this.it = A, this.def = C, this.$data)
        this.schemaCode = A.gen.const("vSchema", Q(this.$data, A));
      else if (this.schemaCode = this.schemaValue, !(0, i.validSchemaType)(this.schema, C.schemaType, C.allowUndefined))
        throw new Error(`${q} value must be ${JSON.stringify(C.schemaType)}`);
      ("code" in C ? C.trackErrors : C.errors !== !1) && (this.errsCount = A.gen.const("_errs", c.default.errors));
    }
    result(A, C, q) {
      this.failResult((0, a.not)(A), C, q);
    }
    failResult(A, C, q) {
      this.gen.if(A), q ? q() : this.error(), C ? (this.gen.else(), C(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(A, C) {
      this.failResult((0, a.not)(A), void 0, C);
    }
    fail(A) {
      if (A === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(A), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(A) {
      if (!this.$data)
        return this.fail(A);
      const { schemaCode: C } = this;
      this.fail((0, a._)`${C} !== undefined && (${(0, a.or)(this.invalid$data(), A)})`);
    }
    error(A, C, q) {
      if (C) {
        this.setParams(C), this._error(A, q), this.setParams({});
        return;
      }
      this._error(A, q);
    }
    _error(A, C) {
      (A ? y.reportExtraError : y.reportError)(this, this.def.error, C);
    }
    $dataError() {
      (0, y.reportError)(this, this.def.$dataError || y.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, y.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(A) {
      this.allErrors || this.gen.if(A);
    }
    setParams(A, C) {
      C ? Object.assign(this.params, A) : this.params = A;
    }
    block$data(A, C, q = a.nil) {
      this.gen.block(() => {
        this.check$data(A, q), C();
      });
    }
    check$data(A = a.nil, C = a.nil) {
      if (!this.$data)
        return;
      const { gen: q, schemaCode: B, schemaType: X, def: le } = this;
      q.if((0, a.or)((0, a._)`${B} === undefined`, C)), A !== a.nil && q.assign(A, !0), (X.length || le.validateSchema) && (q.elseIf(this.invalid$data()), this.$dataError(), A !== a.nil && q.assign(A, !1)), q.else();
    }
    invalid$data() {
      const { gen: A, schemaCode: C, schemaType: q, def: B, it: X } = this;
      return (0, a.or)(le(), Te());
      function le() {
        if (q.length) {
          if (!(C instanceof a.Name))
            throw new Error("ajv implementation error");
          const pe = Array.isArray(q) ? q : [q];
          return (0, a._)`${(0, r.checkDataTypes)(pe, C, X.opts.strictNumbers, r.DataType.Wrong)}`;
        }
        return a.nil;
      }
      function Te() {
        if (B.validateSchema) {
          const pe = A.scopeValue("validate$data", { ref: B.validateSchema });
          return (0, a._)`!${pe}(${C})`;
        }
        return a.nil;
      }
    }
    subschema(A, C) {
      const q = (0, s.getSubschema)(this.it, A);
      (0, s.extendSubschemaData)(q, this.it, A), (0, s.extendSubschemaMode)(q, A);
      const B = { ...this.it, ...q, items: void 0, props: void 0 };
      return f(B, C), B;
    }
    mergeEvaluated(A, C) {
      const { it: q, gen: B } = this;
      q.opts.unevaluated && (q.props !== !0 && A.props !== void 0 && (q.props = d.mergeEvaluated.props(B, A.props, q.props, C)), q.items !== !0 && A.items !== void 0 && (q.items = d.mergeEvaluated.items(B, A.items, q.items, C)));
    }
    mergeValidEvaluated(A, C) {
      const { it: q, gen: B } = this;
      if (q.opts.unevaluated && (q.props !== !0 || q.items !== !0))
        return B.if(C, () => this.mergeEvaluated(A, a.Name)), !0;
    }
  }
  De.KeywordCxt = R;
  function F(T, A, C, q) {
    const B = new R(T, C, A);
    "code" in C ? C.code(B, q) : B.$data && C.validate ? (0, i.funcKeywordCode)(B, C) : "macro" in C ? (0, i.macroKeywordCode)(B, C) : (C.compile || C.validate) && (0, i.funcKeywordCode)(B, C);
  }
  const x = /^\/(?:[^~]|~0|~1)*$/, W = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function Q(T, { dataLevel: A, dataNames: C, dataPathArr: q }) {
    let B, X;
    if (T === "")
      return c.default.rootData;
    if (T[0] === "/") {
      if (!x.test(T))
        throw new Error(`Invalid JSON-pointer: ${T}`);
      B = T, X = c.default.rootData;
    } else {
      const ve = W.exec(T);
      if (!ve)
        throw new Error(`Invalid JSON-pointer: ${T}`);
      const me = +ve[1];
      if (B = ve[2], B === "#") {
        if (me >= A)
          throw new Error(pe("property/index", me));
        return q[A - me];
      }
      if (me > A)
        throw new Error(pe("data", me));
      if (X = C[A - me], !B)
        return X;
    }
    let le = X;
    const Te = B.split("/");
    for (const ve of Te)
      ve && (X = (0, a._)`${X}${(0, a.getProperty)((0, d.unescapeJsonPointer)(ve))}`, le = (0, a._)`${le} && ${X}`);
    return le;
    function pe(ve, me) {
      return `Cannot access ${ve} ${me} levels up, current level is ${A}`;
    }
  }
  return De.getData = Q, De;
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
  const o = te(), e = $r(), t = Fe(), r = Zt(), n = ie(), i = er();
  class s {
    constructor(p) {
      var l;
      this.refs = {}, this.dynamicAnchors = {};
      let f;
      typeof p.schema == "object" && (f = p.schema), this.schema = p.schema, this.schemaId = p.schemaId, this.root = p.root || this, this.baseId = (l = p.baseId) !== null && l !== void 0 ? l : (0, r.normalizeId)(f?.[p.schemaId || "$id"]), this.schemaPath = p.schemaPath, this.localRefs = p.localRefs, this.meta = p.meta, this.$async = f?.$async, this.refs = {};
    }
  }
  Me.SchemaEnv = s;
  function a(h) {
    const p = d.call(this, h);
    if (p)
      return p;
    const l = (0, r.getFullPath)(this.opts.uriResolver, h.root.baseId), { es5: f, lines: g } = this.opts.code, { ownProperties: $ } = this.opts, w = new o.CodeGen(this.scope, { es5: f, lines: g, ownProperties: $ });
    let P;
    h.$async && (P = w.scopeValue("Error", {
      ref: e.default,
      code: (0, o._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const M = w.scopeName("validate");
    h.validateName = M;
    const j = {
      gen: w,
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
      topSchemaRef: w.scopeValue("schema", this.opts.code.source === !0 ? { ref: h.schema, code: (0, o.stringify)(h.schema) } : { ref: h.schema }),
      validateName: M,
      ValidationError: P,
      schema: h.schema,
      schemaEnv: h,
      rootId: l,
      baseId: h.baseId || l,
      schemaPath: o.nil,
      errSchemaPath: h.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, o._)`""`,
      opts: this.opts,
      self: this
    };
    let L;
    try {
      this._compilations.add(h), (0, i.validateFunctionCode)(j), w.optimize(this.opts.code.optimize);
      const D = w.toString();
      L = `${w.scopeRefs(t.default.scope)}return ${D}`, this.opts.code.process && (L = this.opts.code.process(L, h));
      const z = new Function(`${t.default.self}`, `${t.default.scope}`, L)(this, this.scope.get());
      if (this.scope.value(M, { ref: z }), z.errors = null, z.schema = h.schema, z.schemaEnv = h, h.$async && (z.$async = !0), this.opts.code.source === !0 && (z.source = { validateName: M, validateCode: D, scopeValues: w._values }), this.opts.unevaluated) {
        const { props: H, items: ce } = j;
        z.evaluated = {
          props: H instanceof o.Name ? void 0 : H,
          items: ce instanceof o.Name ? void 0 : ce,
          dynamicProps: H instanceof o.Name,
          dynamicItems: ce instanceof o.Name
        }, z.source && (z.source.evaluated = (0, o.stringify)(z.evaluated));
      }
      return h.validate = z, h;
    } catch (D) {
      throw delete h.validate, delete h.validateName, L && this.logger.error("Error compiling schema, function code:", L), D;
    } finally {
      this._compilations.delete(h);
    }
  }
  Me.compileSchema = a;
  function c(h, p, l) {
    var f;
    l = (0, r.resolveUrl)(this.opts.uriResolver, p, l);
    const g = h.refs[l];
    if (g)
      return g;
    let $ = _.call(this, h, l);
    if ($ === void 0) {
      const w = (f = h.localRefs) === null || f === void 0 ? void 0 : f[l], { schemaId: P } = this.opts;
      w && ($ = new s({ schema: w, schemaId: P, root: h, baseId: p }));
    }
    if ($ !== void 0)
      return h.refs[l] = u.call(this, $);
  }
  Me.resolveRef = c;
  function u(h) {
    return (0, r.inlineRef)(h.schema, this.opts.inlineRefs) ? h.schema : h.validate ? h : a.call(this, h);
  }
  function d(h) {
    for (const p of this._compilations)
      if (y(p, h))
        return p;
  }
  Me.getCompilingSchema = d;
  function y(h, p) {
    return h.schema === p.schema && h.root === p.root && h.baseId === p.baseId;
  }
  function _(h, p) {
    let l;
    for (; typeof (l = this.refs[p]) == "string"; )
      p = l;
    return l || this.schemas[p] || v.call(this, h, p);
  }
  function v(h, p) {
    const l = this.opts.uriResolver.parse(p), f = (0, r._getFullPath)(this.opts.uriResolver, l);
    let g = (0, r.getFullPath)(this.opts.uriResolver, h.baseId, void 0);
    if (Object.keys(h.schema).length > 0 && f === g)
      return m.call(this, l, h);
    const $ = (0, r.normalizeId)(f), w = this.refs[$] || this.schemas[$];
    if (typeof w == "string") {
      const P = v.call(this, h, w);
      return typeof P?.schema != "object" ? void 0 : m.call(this, l, P);
    }
    if (typeof w?.schema == "object") {
      if (w.validate || a.call(this, w), $ === (0, r.normalizeId)(p)) {
        const { schema: P } = w, { schemaId: M } = this.opts, j = P[M];
        return j && (g = (0, r.resolveUrl)(this.opts.uriResolver, g, j)), new s({ schema: P, schemaId: M, root: h, baseId: g });
      }
      return m.call(this, l, w);
    }
  }
  Me.resolveSchema = v;
  const S = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function m(h, { baseId: p, schema: l, root: f }) {
    var g;
    if (((g = h.fragment) === null || g === void 0 ? void 0 : g[0]) !== "/")
      return;
    for (const P of h.fragment.slice(1).split("/")) {
      if (typeof l == "boolean")
        return;
      const M = l[(0, n.unescapeFragment)(P)];
      if (M === void 0)
        return;
      l = M;
      const j = typeof l == "object" && l[this.opts.schemaId];
      !S.has(P) && j && (p = (0, r.resolveUrl)(this.opts.uriResolver, p, j));
    }
    let $;
    if (typeof l != "boolean" && l.$ref && !(0, n.schemaHasRulesButRef)(l, this.RULES)) {
      const P = (0, r.resolveUrl)(this.opts.uriResolver, p, l.$ref);
      $ = v.call(this, f, P);
    }
    const { schemaId: w } = this.opts;
    if ($ = $ || new s({ schema: l, schemaId: w, root: f, baseId: p }), $.schema !== $.root.schema)
      return $;
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
    let p = "", l = !0;
    for (const f of m) {
      if (o[f] === void 0) return;
      f !== "0" && l === !0 && (l = !1), l || (p += f);
    }
    return h && p.length === 0 && (p = "0"), p;
  }
  function n(m) {
    let h = 0;
    const p = { error: !1, address: "", zone: "" }, l = [], f = [];
    let g = !1, $ = !1, w = !1;
    function P() {
      if (f.length) {
        if (g === !1) {
          const M = r(f);
          if (M !== void 0)
            l.push(M);
          else
            return p.error = !0, !1;
        }
        f.length = 0;
      }
      return !0;
    }
    for (let M = 0; M < m.length; M++) {
      const j = m[M];
      if (!(j === "[" || j === "]"))
        if (j === ":") {
          if ($ === !0 && (w = !0), !P())
            break;
          if (h++, l.push(":"), h > 7) {
            p.error = !0;
            break;
          }
          M - 1 >= 0 && m[M - 1] === ":" && ($ = !0);
          continue;
        } else if (j === "%") {
          if (!P())
            break;
          g = !0;
        } else {
          f.push(j);
          continue;
        }
    }
    return f.length && (g ? p.zone = f.join("") : w ? l.push(f.join("")) : l.push(r(f))), p.address = l.join(""), p;
  }
  function i(m) {
    if (a(m, ":") < 2)
      return { host: m, isIPV6: !1 };
    const h = n(m);
    if (h.error)
      return { host: m, isIPV6: !1 };
    {
      let p = h.address, l = h.address;
      return h.zone && (p += "%" + h.zone, l += "%25" + h.zone), { host: p, escapedHost: l, isIPV6: !0 };
    }
  }
  function s(m, h) {
    let p = "", l = !0;
    const f = m.length;
    for (let g = 0; g < f; g++) {
      const $ = m[g];
      $ === "0" && l ? (g + 1 <= f && m[g + 1] === h || g + 1 === f) && (p += $, l = !1) : ($ === h ? l = !0 : l = !1, p += $);
    }
    return p;
  }
  function a(m, h) {
    let p = 0;
    for (let l = 0; l < m.length; l++)
      m[l] === h && p++;
    return p;
  }
  const c = /^\.\.?\//u, u = /^\/\.(?:\/|$)/u, d = /^\/\.\.(?:\/|$)/u, y = /^\/?(?:.|\n)*?(?=\/|$)/u;
  function _(m) {
    const h = [];
    for (; m.length; )
      if (m.match(c))
        m = m.replace(c, "");
      else if (m.match(u))
        m = m.replace(u, "/");
      else if (m.match(d))
        m = m.replace(d, "/"), h.pop();
      else if (m === "." || m === "..")
        m = "";
      else {
        const p = m.match(y);
        if (p) {
          const l = p[0];
          m = m.slice(l.length), h.push(l);
        } else
          throw new Error("Unexpected dot segment condition");
      }
    return h.join("");
  }
  function v(m, h) {
    const p = h !== !0 ? escape : unescape;
    return m.scheme !== void 0 && (m.scheme = p(m.scheme)), m.userinfo !== void 0 && (m.userinfo = p(m.userinfo)), m.host !== void 0 && (m.host = p(m.host)), m.path !== void 0 && (m.path = p(m.path)), m.query !== void 0 && (m.query = p(m.query)), m.fragment !== void 0 && (m.fragment = p(m.fragment)), m;
  }
  function S(m) {
    const h = [];
    if (m.userinfo !== void 0 && (h.push(m.userinfo), h.push("@")), m.host !== void 0) {
      let p = unescape(m.host);
      const l = t(p);
      if (l.isIPV4)
        p = l.host;
      else {
        const f = i(l.host);
        f.isIPV6 === !0 ? p = `[${f.escapedHost}]` : p = m.host;
      }
      h.push(p);
    }
    return (typeof m.port == "number" || typeof m.port == "string") && (h.push(":"), h.push(String(m.port))), h.length ? h.join("") : void 0;
  }
  return hr = {
    recomposeAuthority: S,
    normalizeComponentEncoding: v,
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
  function t(l) {
    return typeof l.secure == "boolean" ? l.secure : String(l.scheme).toLowerCase() === "wss";
  }
  function r(l) {
    return l.host || (l.error = l.error || "HTTP URIs must have a host."), l;
  }
  function n(l) {
    const f = String(l.scheme).toLowerCase() === "https";
    return (l.port === (f ? 443 : 80) || l.port === "") && (l.port = void 0), l.path || (l.path = "/"), l;
  }
  function i(l) {
    return l.secure = t(l), l.resourceName = (l.path || "/") + (l.query ? "?" + l.query : ""), l.path = void 0, l.query = void 0, l;
  }
  function s(l) {
    if ((l.port === (t(l) ? 443 : 80) || l.port === "") && (l.port = void 0), typeof l.secure == "boolean" && (l.scheme = l.secure ? "wss" : "ws", l.secure = void 0), l.resourceName) {
      const [f, g] = l.resourceName.split("?");
      l.path = f && f !== "/" ? f : void 0, l.query = g, l.resourceName = void 0;
    }
    return l.fragment = void 0, l;
  }
  function a(l, f) {
    if (!l.path)
      return l.error = "URN can not be parsed", l;
    const g = l.path.match(e);
    if (g) {
      const $ = f.scheme || l.scheme || "urn";
      l.nid = g[1].toLowerCase(), l.nss = g[2];
      const w = `${$}:${f.nid || l.nid}`, P = p[w];
      l.path = void 0, P && (l = P.parse(l, f));
    } else
      l.error = l.error || "URN can not be parsed.";
    return l;
  }
  function c(l, f) {
    const g = f.scheme || l.scheme || "urn", $ = l.nid.toLowerCase(), w = `${g}:${f.nid || $}`, P = p[w];
    P && (l = P.serialize(l, f));
    const M = l, j = l.nss;
    return M.path = `${$ || f.nid}:${j}`, f.skipEscape = !0, M;
  }
  function u(l, f) {
    const g = l;
    return g.uuid = g.nss, g.nss = void 0, !f.tolerant && (!g.uuid || !o.test(g.uuid)) && (g.error = g.error || "UUID is not valid."), g;
  }
  function d(l) {
    const f = l;
    return f.nss = (l.uuid || "").toLowerCase(), f;
  }
  const y = {
    scheme: "http",
    domainHost: !0,
    parse: r,
    serialize: n
  }, _ = {
    scheme: "https",
    domainHost: y.domainHost,
    parse: r,
    serialize: n
  }, v = {
    scheme: "ws",
    domainHost: !0,
    parse: i,
    serialize: s
  }, S = {
    scheme: "wss",
    domainHost: v.domainHost,
    parse: v.parse,
    serialize: v.serialize
  }, p = {
    http: y,
    https: _,
    ws: v,
    wss: S,
    urn: {
      scheme: "urn",
      parse: a,
      serialize: c,
      skipNormalize: !0
    },
    "urn:uuid": {
      scheme: "urn:uuid",
      parse: u,
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
    return typeof h == "string" ? h = d(S(h, p), p) : typeof h == "object" && (h = S(d(h, p), p)), h;
  }
  function a(h, p, l) {
    const f = Object.assign({ scheme: "null" }, l), g = c(S(h, f), S(p, f), f, !0);
    return d(g, { ...f, skipEscape: !0 });
  }
  function c(h, p, l, f) {
    const g = {};
    return f || (h = S(d(h, l), l), p = S(d(p, l), l)), l = l || {}, !l.tolerant && p.scheme ? (g.scheme = p.scheme, g.userinfo = p.userinfo, g.host = p.host, g.port = p.port, g.path = t(p.path || ""), g.query = p.query) : (p.userinfo !== void 0 || p.host !== void 0 || p.port !== void 0 ? (g.userinfo = p.userinfo, g.host = p.host, g.port = p.port, g.path = t(p.path || ""), g.query = p.query) : (p.path ? (p.path.charAt(0) === "/" ? g.path = t(p.path) : ((h.userinfo !== void 0 || h.host !== void 0 || h.port !== void 0) && !h.path ? g.path = "/" + p.path : h.path ? g.path = h.path.slice(0, h.path.lastIndexOf("/") + 1) + p.path : g.path = p.path, g.path = t(g.path)), g.query = p.query) : (g.path = h.path, p.query !== void 0 ? g.query = p.query : g.query = h.query), g.userinfo = h.userinfo, g.host = h.host, g.port = h.port), g.scheme = h.scheme), g.fragment = p.fragment, g;
  }
  function u(h, p, l) {
    return typeof h == "string" ? (h = unescape(h), h = d(n(S(h, l), !0), { ...l, skipEscape: !0 })) : typeof h == "object" && (h = d(n(h, !0), { ...l, skipEscape: !0 })), typeof p == "string" ? (p = unescape(p), p = d(n(S(p, l), !0), { ...l, skipEscape: !0 })) : typeof p == "object" && (p = d(n(p, !0), { ...l, skipEscape: !0 })), h.toLowerCase() === p.toLowerCase();
  }
  function d(h, p) {
    const l = {
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
    }, f = Object.assign({}, p), g = [], $ = i[(f.scheme || l.scheme || "").toLowerCase()];
    $ && $.serialize && $.serialize(l, f), l.path !== void 0 && (f.skipEscape ? l.path = unescape(l.path) : (l.path = escape(l.path), l.scheme !== void 0 && (l.path = l.path.split("%3A").join(":")))), f.reference !== "suffix" && l.scheme && g.push(l.scheme, ":");
    const w = r(l);
    if (w !== void 0 && (f.reference !== "suffix" && g.push("//"), g.push(w), l.path && l.path.charAt(0) !== "/" && g.push("/")), l.path !== void 0) {
      let P = l.path;
      !f.absolutePath && (!$ || !$.absolutePath) && (P = t(P)), w === void 0 && (P = P.replace(/^\/\//u, "/%2F")), g.push(P);
    }
    return l.query !== void 0 && g.push("?", l.query), l.fragment !== void 0 && g.push("#", l.fragment), g.join("");
  }
  const y = Array.from({ length: 127 }, (h, p) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(p)));
  function _(h) {
    let p = 0;
    for (let l = 0, f = h.length; l < f; ++l)
      if (p = h.charCodeAt(l), p > 126 || y[p])
        return !0;
    return !1;
  }
  const v = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
  function S(h, p) {
    const l = Object.assign({}, p), f = {
      scheme: void 0,
      userinfo: void 0,
      host: "",
      port: void 0,
      path: "",
      query: void 0,
      fragment: void 0
    }, g = h.indexOf("%") !== -1;
    let $ = !1;
    l.reference === "suffix" && (h = (l.scheme ? l.scheme + ":" : "") + "//" + h);
    const w = h.match(v);
    if (w) {
      if (f.scheme = w[1], f.userinfo = w[3], f.host = w[4], f.port = parseInt(w[5], 10), f.path = w[6] || "", f.query = w[7], f.fragment = w[8], isNaN(f.port) && (f.port = w[5]), f.host) {
        const M = e(f.host);
        if (M.isIPV4 === !1) {
          const j = o(M.host);
          f.host = j.host.toLowerCase(), $ = j.isIPV6;
        } else
          f.host = M.host, $ = !0;
      }
      f.scheme === void 0 && f.userinfo === void 0 && f.host === void 0 && f.port === void 0 && f.query === void 0 && !f.path ? f.reference = "same-document" : f.scheme === void 0 ? f.reference = "relative" : f.fragment === void 0 ? f.reference = "absolute" : f.reference = "uri", l.reference && l.reference !== "suffix" && l.reference !== f.reference && (f.error = f.error || "URI is not a " + l.reference + " reference.");
      const P = i[(l.scheme || f.scheme || "").toLowerCase()];
      if (!l.unicodeSupport && (!P || !P.unicodeSupport) && f.host && (l.domainHost || P && P.domainHost) && $ === !1 && _(f.host))
        try {
          f.host = URL.domainToASCII(f.host.toLowerCase());
        } catch (M) {
          f.error = f.error || "Host's domain name can not be converted to ASCII: " + M;
        }
      (!P || P && !P.skipNormalize) && (g && f.scheme !== void 0 && (f.scheme = unescape(f.scheme)), g && f.host !== void 0 && (f.host = unescape(f.host)), f.path && (f.path = escape(unescape(f.path))), f.fragment && (f.fragment = encodeURI(decodeURIComponent(f.fragment)))), P && P.parse && P.parse(f, l);
    } else
      f.error = f.error || "URI can not be parsed.";
    return f;
  }
  const m = {
    SCHEMES: i,
    normalize: s,
    resolve: a,
    resolveComponents: c,
    equal: u,
    serialize: d,
    parse: S
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
    var t = te();
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
    const r = $r(), n = tr(), i = ti(), s = Sr(), a = te(), c = Zt(), u = Wt(), d = ie(), y = Ki, _ = Qi(), v = (O, k) => new RegExp(O, k);
    v.code = "new RegExp";
    const S = ["removeAdditional", "useDefaults", "coerceTypes"], m = /* @__PURE__ */ new Set([
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
    }, l = 200;
    function f(O) {
      var k, I, N, b, E, R, F, x, W, Q, T, A, C, q, B, X, le, Te, pe, ve, me, Oe, Pe, Ke, Je;
      const G = O.strict, U = (k = O.code) === null || k === void 0 ? void 0 : k.optimize, K = U === !0 || U === void 0 ? 1 : U || 0, Y = (N = (I = O.code) === null || I === void 0 ? void 0 : I.regExp) !== null && N !== void 0 ? N : v, re = (b = O.uriResolver) !== null && b !== void 0 ? b : _.default;
      return {
        strictSchema: (R = (E = O.strictSchema) !== null && E !== void 0 ? E : G) !== null && R !== void 0 ? R : !0,
        strictNumbers: (x = (F = O.strictNumbers) !== null && F !== void 0 ? F : G) !== null && x !== void 0 ? x : !0,
        strictTypes: (Q = (W = O.strictTypes) !== null && W !== void 0 ? W : G) !== null && Q !== void 0 ? Q : "log",
        strictTuples: (A = (T = O.strictTuples) !== null && T !== void 0 ? T : G) !== null && A !== void 0 ? A : "log",
        strictRequired: (q = (C = O.strictRequired) !== null && C !== void 0 ? C : G) !== null && q !== void 0 ? q : !1,
        code: O.code ? { ...O.code, optimize: K, regExp: Y } : { optimize: K, regExp: Y },
        loopRequired: (B = O.loopRequired) !== null && B !== void 0 ? B : l,
        loopEnum: (X = O.loopEnum) !== null && X !== void 0 ? X : l,
        meta: (le = O.meta) !== null && le !== void 0 ? le : !0,
        messages: (Te = O.messages) !== null && Te !== void 0 ? Te : !0,
        inlineRefs: (pe = O.inlineRefs) !== null && pe !== void 0 ? pe : !0,
        schemaId: (ve = O.schemaId) !== null && ve !== void 0 ? ve : "$id",
        addUsedSchema: (me = O.addUsedSchema) !== null && me !== void 0 ? me : !0,
        validateSchema: (Oe = O.validateSchema) !== null && Oe !== void 0 ? Oe : !0,
        validateFormats: (Pe = O.validateFormats) !== null && Pe !== void 0 ? Pe : !0,
        unicodeRegExp: (Ke = O.unicodeRegExp) !== null && Ke !== void 0 ? Ke : !0,
        int32range: (Je = O.int32range) !== null && Je !== void 0 ? Je : !0,
        uriResolver: re
      };
    }
    class g {
      constructor(k = {}) {
        this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), k = this.opts = { ...k, ...f(k) };
        const { es5: I, lines: N } = this.opts.code;
        this.scope = new a.ValueScope({ scope: {}, prefixes: m, es5: I, lines: N }), this.logger = V(k.logger);
        const b = k.validateFormats;
        k.validateFormats = !1, this.RULES = (0, i.getRules)(), $.call(this, h, k, "NOT SUPPORTED"), $.call(this, p, k, "DEPRECATED", "warn"), this._metaOpts = L.call(this), k.formats && M.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), k.keywords && j.call(this, k.keywords), typeof k.meta == "object" && this.addMetaSchema(k.meta), P.call(this), k.validateFormats = b;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: k, meta: I, schemaId: N } = this.opts;
        let b = y;
        N === "id" && (b = { ...y }, b.id = b.$id, delete b.$id), I && k && this.addMetaSchema(b, b[N], !1);
      }
      defaultMeta() {
        const { meta: k, schemaId: I } = this.opts;
        return this.opts.defaultMeta = typeof k == "object" ? k[I] || k : void 0;
      }
      validate(k, I) {
        let N;
        if (typeof k == "string") {
          if (N = this.getSchema(k), !N)
            throw new Error(`no schema with key or ref "${k}"`);
        } else
          N = this.compile(k);
        const b = N(I);
        return "$async" in N || (this.errors = N.errors), b;
      }
      compile(k, I) {
        const N = this._addSchema(k, I);
        return N.validate || this._compileSchemaEnv(N);
      }
      compileAsync(k, I) {
        if (typeof this.opts.loadSchema != "function")
          throw new Error("options.loadSchema should be a function");
        const { loadSchema: N } = this.opts;
        return b.call(this, k, I);
        async function b(Q, T) {
          await E.call(this, Q.$schema);
          const A = this._addSchema(Q, T);
          return A.validate || R.call(this, A);
        }
        async function E(Q) {
          Q && !this.getSchema(Q) && await b.call(this, { $ref: Q }, !0);
        }
        async function R(Q) {
          try {
            return this._compileSchemaEnv(Q);
          } catch (T) {
            if (!(T instanceof n.default))
              throw T;
            return F.call(this, T), await x.call(this, T.missingSchema), R.call(this, Q);
          }
        }
        function F({ missingSchema: Q, missingRef: T }) {
          if (this.refs[Q])
            throw new Error(`AnySchema ${Q} is loaded but ${T} cannot be resolved`);
        }
        async function x(Q) {
          const T = await W.call(this, Q);
          this.refs[Q] || await E.call(this, T.$schema), this.refs[Q] || this.addSchema(T, Q, I);
        }
        async function W(Q) {
          const T = this._loading[Q];
          if (T)
            return T;
          try {
            return await (this._loading[Q] = N(Q));
          } finally {
            delete this._loading[Q];
          }
        }
      }
      // Adds schema to the instance
      addSchema(k, I, N, b = this.opts.validateSchema) {
        if (Array.isArray(k)) {
          for (const R of k)
            this.addSchema(R, void 0, N, b);
          return this;
        }
        let E;
        if (typeof k == "object") {
          const { schemaId: R } = this.opts;
          if (E = k[R], E !== void 0 && typeof E != "string")
            throw new Error(`schema ${R} must be string`);
        }
        return I = (0, c.normalizeId)(I || E), this._checkUnique(I), this.schemas[I] = this._addSchema(k, N, I, b, !0), this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(k, I, N = this.opts.validateSchema) {
        return this.addSchema(k, I, !0, N), this;
      }
      //  Validate schema against its meta-schema
      validateSchema(k, I) {
        if (typeof k == "boolean")
          return !0;
        let N;
        if (N = k.$schema, N !== void 0 && typeof N != "string")
          throw new Error("$schema must be a string");
        if (N = N || this.opts.defaultMeta || this.defaultMeta(), !N)
          return this.logger.warn("meta-schema not available"), this.errors = null, !0;
        const b = this.validate(N, k);
        if (!b && I) {
          const E = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(E);
          else
            throw new Error(E);
        }
        return b;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(k) {
        let I;
        for (; typeof (I = w.call(this, k)) == "string"; )
          k = I;
        if (I === void 0) {
          const { schemaId: N } = this.opts, b = new s.SchemaEnv({ schema: {}, schemaId: N });
          if (I = s.resolveSchema.call(this, b, k), !I)
            return;
          this.refs[k] = I;
        }
        return I.validate || this._compileSchemaEnv(I);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(k) {
        if (k instanceof RegExp)
          return this._removeAllSchemas(this.schemas, k), this._removeAllSchemas(this.refs, k), this;
        switch (typeof k) {
          case "undefined":
            return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
          case "string": {
            const I = w.call(this, k);
            return typeof I == "object" && this._cache.delete(I.schema), delete this.schemas[k], delete this.refs[k], this;
          }
          case "object": {
            const I = k;
            this._cache.delete(I);
            let N = k[this.opts.schemaId];
            return N && (N = (0, c.normalizeId)(N), delete this.schemas[N], delete this.refs[N]), this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(k) {
        for (const I of k)
          this.addKeyword(I);
        return this;
      }
      addKeyword(k, I) {
        let N;
        if (typeof k == "string")
          N = k, typeof I == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), I.keyword = N);
        else if (typeof k == "object" && I === void 0) {
          if (I = k, N = I.keyword, Array.isArray(N) && !N.length)
            throw new Error("addKeywords: keyword must be string or non-empty array");
        } else
          throw new Error("invalid addKeywords parameters");
        if (H.call(this, N, I), !I)
          return (0, d.eachItem)(N, (E) => ce.call(this, E)), this;
        ye.call(this, I);
        const b = {
          ...I,
          type: (0, u.getJSONTypes)(I.type),
          schemaType: (0, u.getJSONTypes)(I.schemaType)
        };
        return (0, d.eachItem)(N, b.type.length === 0 ? (E) => ce.call(this, E, b) : (E) => b.type.forEach((R) => ce.call(this, E, b, R))), this;
      }
      getKeyword(k) {
        const I = this.RULES.all[k];
        return typeof I == "object" ? I.definition : !!I;
      }
      // Remove keyword
      removeKeyword(k) {
        const { RULES: I } = this;
        delete I.keywords[k], delete I.all[k];
        for (const N of I.rules) {
          const b = N.rules.findIndex((E) => E.keyword === k);
          b >= 0 && N.rules.splice(b, 1);
        }
        return this;
      }
      // Add format
      addFormat(k, I) {
        return typeof I == "string" && (I = new RegExp(I)), this.formats[k] = I, this;
      }
      errorsText(k = this.errors, { separator: I = ", ", dataVar: N = "data" } = {}) {
        return !k || k.length === 0 ? "No errors" : k.map((b) => `${N}${b.instancePath} ${b.message}`).reduce((b, E) => b + I + E);
      }
      $dataMetaSchema(k, I) {
        const N = this.RULES.all;
        k = JSON.parse(JSON.stringify(k));
        for (const b of I) {
          const E = b.split("/").slice(1);
          let R = k;
          for (const F of E)
            R = R[F];
          for (const F in N) {
            const x = N[F];
            if (typeof x != "object")
              continue;
            const { $data: W } = x.definition, Q = R[F];
            W && Q && (R[F] = he(Q));
          }
        }
        return k;
      }
      _removeAllSchemas(k, I) {
        for (const N in k) {
          const b = k[N];
          (!I || I.test(N)) && (typeof b == "string" ? delete k[N] : b && !b.meta && (this._cache.delete(b.schema), delete k[N]));
        }
      }
      _addSchema(k, I, N, b = this.opts.validateSchema, E = this.opts.addUsedSchema) {
        let R;
        const { schemaId: F } = this.opts;
        if (typeof k == "object")
          R = k[F];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof k != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let x = this._cache.get(k);
        if (x !== void 0)
          return x;
        N = (0, c.normalizeId)(R || N);
        const W = c.getSchemaRefs.call(this, k, N);
        return x = new s.SchemaEnv({ schema: k, schemaId: F, meta: I, baseId: N, localRefs: W }), this._cache.set(x.schema, x), E && !N.startsWith("#") && (N && this._checkUnique(N), this.refs[N] = x), b && this.validateSchema(k, !0), x;
      }
      _checkUnique(k) {
        if (this.schemas[k] || this.refs[k])
          throw new Error(`schema with key or id "${k}" already exists`);
      }
      _compileSchemaEnv(k) {
        if (k.meta ? this._compileMetaSchema(k) : s.compileSchema.call(this, k), !k.validate)
          throw new Error("ajv implementation error");
        return k.validate;
      }
      _compileMetaSchema(k) {
        const I = this.opts;
        this.opts = this._metaOpts;
        try {
          s.compileSchema.call(this, k);
        } finally {
          this.opts = I;
        }
      }
    }
    g.ValidationError = r.default, g.MissingRefError = n.default, o.default = g;
    function $(O, k, I, N = "error") {
      for (const b in O) {
        const E = b;
        E in k && this.logger[N](`${I}: option ${b}. ${O[E]}`);
      }
    }
    function w(O) {
      return O = (0, c.normalizeId)(O), this.schemas[O] || this.refs[O];
    }
    function P() {
      const O = this.opts.schemas;
      if (O)
        if (Array.isArray(O))
          this.addSchema(O);
        else
          for (const k in O)
            this.addSchema(O[k], k);
    }
    function M() {
      for (const O in this.opts.formats) {
        const k = this.opts.formats[O];
        k && this.addFormat(O, k);
      }
    }
    function j(O) {
      if (Array.isArray(O)) {
        this.addVocabulary(O);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const k in O) {
        const I = O[k];
        I.keyword || (I.keyword = k), this.addKeyword(I);
      }
    }
    function L() {
      const O = { ...this.opts };
      for (const k of S)
        delete O[k];
      return O;
    }
    const D = { log() {
    }, warn() {
    }, error() {
    } };
    function V(O) {
      if (O === !1)
        return D;
      if (O === void 0)
        return console;
      if (O.log && O.warn && O.error)
        return O;
      throw new Error("logger must implement log, warn and error methods");
    }
    const z = /^[a-z_$][a-z0-9_$:-]*$/i;
    function H(O, k) {
      const { RULES: I } = this;
      if ((0, d.eachItem)(O, (N) => {
        if (I.keywords[N])
          throw new Error(`Keyword ${N} is already defined`);
        if (!z.test(N))
          throw new Error(`Keyword ${N} has invalid name`);
      }), !!k && k.$data && !("code" in k || "validate" in k))
        throw new Error('$data keyword must have "code" or "validate" function');
    }
    function ce(O, k, I) {
      var N;
      const b = k?.post;
      if (I && b)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES: E } = this;
      let R = b ? E.post : E.rules.find(({ type: x }) => x === I);
      if (R || (R = { type: I, rules: [] }, E.rules.push(R)), E.keywords[O] = !0, !k)
        return;
      const F = {
        keyword: O,
        definition: {
          ...k,
          type: (0, u.getJSONTypes)(k.type),
          schemaType: (0, u.getJSONTypes)(k.schemaType)
        }
      };
      k.before ? de.call(this, R, F, k.before) : R.rules.push(F), E.all[O] = F, (N = k.implements) === null || N === void 0 || N.forEach((x) => this.addKeyword(x));
    }
    function de(O, k, I) {
      const N = O.rules.findIndex((b) => b.keyword === I);
      N >= 0 ? O.rules.splice(N, 0, k) : (O.rules.push(k), this.logger.warn(`rule ${I} is not defined`));
    }
    function ye(O) {
      let { metaSchema: k } = O;
      k !== void 0 && (O.$data && this.opts.$data && (k = he(k)), O.validateSchema = this.compile(k, !0));
    }
    const ne = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function he(O) {
      return { anyOf: [O, ne] };
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
  const o = tr(), e = Re(), t = te(), r = Fe(), n = Sr(), i = ie(), s = {
    keyword: "$ref",
    schemaType: "string",
    code(u) {
      const { gen: d, schema: y, it: _ } = u, { baseId: v, schemaEnv: S, validateName: m, opts: h, self: p } = _, { root: l } = S;
      if ((y === "#" || y === "#/") && v === l.baseId)
        return g();
      const f = n.resolveRef.call(p, l, v, y);
      if (f === void 0)
        throw new o.default(_.opts.uriResolver, v, y);
      if (f instanceof n.SchemaEnv)
        return $(f);
      return w(f);
      function g() {
        if (S === l)
          return c(u, m, S, S.$async);
        const P = d.scopeValue("root", { ref: l });
        return c(u, (0, t._)`${P}.validate`, l, l.$async);
      }
      function $(P) {
        const M = a(u, P);
        c(u, M, P, P.$async);
      }
      function w(P) {
        const M = d.scopeValue("schema", h.code.source === !0 ? { ref: P, code: (0, t.stringify)(P) } : { ref: P }), j = d.name("valid"), L = u.subschema({
          schema: P,
          dataTypes: [],
          schemaPath: t.nil,
          topSchemaRef: M,
          errSchemaPath: y
        }, j);
        u.mergeEvaluated(L), u.ok(j);
      }
    }
  };
  function a(u, d) {
    const { gen: y } = u;
    return d.validate ? y.scopeValue("validate", { ref: d.validate }) : (0, t._)`${y.scopeValue("wrapper", { ref: d })}.validate`;
  }
  Ve.getValidate = a;
  function c(u, d, y, _) {
    const { gen: v, it: S } = u, { allErrors: m, schemaEnv: h, opts: p } = S, l = p.passContext ? r.default.this : t.nil;
    _ ? f() : g();
    function f() {
      if (!h.$async)
        throw new Error("async schema referenced by sync schema");
      const P = v.let("valid");
      v.try(() => {
        v.code((0, t._)`await ${(0, e.callValidateCode)(u, d, l)}`), w(d), m || v.assign(P, !0);
      }, (M) => {
        v.if((0, t._)`!(${M} instanceof ${S.ValidationError})`, () => v.throw(M)), $(M), m || v.assign(P, !1);
      }), u.ok(P);
    }
    function g() {
      u.result((0, e.callValidateCode)(u, d, l), () => w(d), () => $(d));
    }
    function $(P) {
      const M = (0, t._)`${P}.errors`;
      v.assign(r.default.vErrors, (0, t._)`${r.default.vErrors} === null ? ${M} : ${r.default.vErrors}.concat(${M})`), v.assign(r.default.errors, (0, t._)`${r.default.vErrors}.length`);
    }
    function w(P) {
      var M;
      if (!S.opts.unevaluated)
        return;
      const j = (M = y?.validate) === null || M === void 0 ? void 0 : M.evaluated;
      if (S.props !== !0)
        if (j && !j.dynamicProps)
          j.props !== void 0 && (S.props = i.mergeEvaluated.props(v, j.props, S.props));
        else {
          const L = v.var("props", (0, t._)`${P}.evaluated.props`);
          S.props = i.mergeEvaluated.props(v, L, S.props, t.Name);
        }
      if (S.items !== !0)
        if (j && !j.dynamicItems)
          j.items !== void 0 && (S.items = i.mergeEvaluated.items(v, j.items, S.items));
        else {
          const L = v.var("items", (0, t._)`${P}.evaluated.items`);
          S.items = i.mergeEvaluated.items(v, L, S.items, t.Name);
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
  const o = te(), e = o.operators, t = {
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
  const o = te(), t = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: !0,
    error: {
      message: ({ schemaCode: r }) => (0, o.str)`must be multiple of ${r}`,
      params: ({ schemaCode: r }) => (0, o._)`{multipleOf: ${r}}`
    },
    code(r) {
      const { gen: n, data: i, schemaCode: s, it: a } = r, c = a.opts.multipleOfPrecision, u = n.let("res"), d = c ? (0, o._)`Math.abs(Math.round(${u}) - ${u}) > 1e-${c}` : (0, o._)`${u} !== parseInt(${u})`;
      r.fail$data((0, o._)`(${s} === 0 || (${u} = ${i}/${s}, ${d}))`);
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
  const o = te(), e = ie(), t = io(), n = {
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
      const { keyword: s, data: a, schemaCode: c, it: u } = i, d = s === "maxLength" ? o.operators.GT : o.operators.LT, y = u.opts.unicode === !1 ? (0, o._)`${a}.length` : (0, o._)`${(0, e.useFunc)(i.gen, t.default)}(${a})`;
      i.fail$data((0, o._)`${y} ${d} ${c}`);
    }
  };
  return wt.default = n, wt;
}
var $t = {}, bn;
function so() {
  if (bn) return $t;
  bn = 1, Object.defineProperty($t, "__esModule", { value: !0 });
  const o = Re(), e = te(), r = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: n }) => (0, e.str)`must match pattern "${n}"`,
      params: ({ schemaCode: n }) => (0, e._)`{pattern: ${n}}`
    },
    code(n) {
      const { data: i, $data: s, schema: a, schemaCode: c, it: u } = n, d = u.opts.unicodeRegExp ? "u" : "", y = s ? (0, e._)`(new RegExp(${c}, ${d}))` : (0, o.usePattern)(n, a);
      n.fail$data((0, e._)`!${y}.test(${i})`);
    }
  };
  return $t.default = r, $t;
}
var St = {}, wn;
function ao() {
  if (wn) return St;
  wn = 1, Object.defineProperty(St, "__esModule", { value: !0 });
  const o = te(), t = {
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
  const o = Re(), e = te(), t = ie(), n = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: i } }) => (0, e.str)`must have required property '${i}'`,
      params: ({ params: { missingProperty: i } }) => (0, e._)`{missingProperty: ${i}}`
    },
    code(i) {
      const { gen: s, schema: a, schemaCode: c, data: u, $data: d, it: y } = i, { opts: _ } = y;
      if (!d && a.length === 0)
        return;
      const v = a.length >= _.loopRequired;
      if (y.allErrors ? S() : m(), _.strictRequired) {
        const l = i.parentSchema.properties, { definedProperties: f } = i.it;
        for (const g of a)
          if (l?.[g] === void 0 && !f.has(g)) {
            const $ = y.schemaEnv.baseId + y.errSchemaPath, w = `required property "${g}" is not defined at "${$}" (strictRequired)`;
            (0, t.checkStrictMode)(y, w, y.opts.strictRequired);
          }
      }
      function S() {
        if (v || d)
          i.block$data(e.nil, h);
        else
          for (const l of a)
            (0, o.checkReportMissingProp)(i, l);
      }
      function m() {
        const l = s.let("missing");
        if (v || d) {
          const f = s.let("valid", !0);
          i.block$data(f, () => p(l, f)), i.ok(f);
        } else
          s.if((0, o.checkMissingProp)(i, a, l)), (0, o.reportMissingProp)(i, l), s.else();
      }
      function h() {
        s.forOf("prop", c, (l) => {
          i.setParams({ missingProperty: l }), s.if((0, o.noPropertyInData)(s, u, l, _.ownProperties), () => i.error());
        });
      }
      function p(l, f) {
        i.setParams({ missingProperty: l }), s.forOf(l, c, () => {
          s.assign(f, (0, o.propertyInData)(s, u, l, _.ownProperties)), s.if((0, e.not)(f), () => {
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
  const o = te(), t = {
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
  const o = Wt(), e = te(), t = ie(), r = Pr(), i = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i: s, j: a } }) => (0, e.str)`must NOT have duplicate items (items ## ${a} and ${s} are identical)`,
      params: ({ params: { i: s, j: a } }) => (0, e._)`{i: ${s}, j: ${a}}`
    },
    code(s) {
      const { gen: a, data: c, $data: u, schema: d, parentSchema: y, schemaCode: _, it: v } = s;
      if (!u && !d)
        return;
      const S = a.let("valid"), m = y.items ? (0, o.getSchemaTypes)(y.items) : [];
      s.block$data(S, h, (0, e._)`${_} === false`), s.ok(S);
      function h() {
        const g = a.let("i", (0, e._)`${c}.length`), $ = a.let("j");
        s.setParams({ i: g, j: $ }), a.assign(S, !0), a.if((0, e._)`${g} > 1`, () => (p() ? l : f)(g, $));
      }
      function p() {
        return m.length > 0 && !m.some((g) => g === "object" || g === "array");
      }
      function l(g, $) {
        const w = a.name("item"), P = (0, o.checkDataTypes)(m, w, v.opts.strictNumbers, o.DataType.Wrong), M = a.const("indices", (0, e._)`{}`);
        a.for((0, e._)`;${g}--;`, () => {
          a.let(w, (0, e._)`${c}[${g}]`), a.if(P, (0, e._)`continue`), m.length > 1 && a.if((0, e._)`typeof ${w} == "string"`, (0, e._)`${w} += "_"`), a.if((0, e._)`typeof ${M}[${w}] == "number"`, () => {
            a.assign($, (0, e._)`${M}[${w}]`), s.error(), a.assign(S, !1).break();
          }).code((0, e._)`${M}[${w}] = ${g}`);
        });
      }
      function f(g, $) {
        const w = (0, t.useFunc)(a, r.default), P = a.name("outer");
        a.label(P).for((0, e._)`;${g}--;`, () => a.for((0, e._)`${$} = ${g}; ${$}--;`, () => a.if((0, e._)`${w}(${c}[${g}], ${c}[${$}])`, () => {
          s.error(), a.assign(S, !1).break(P);
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
  const o = te(), e = ie(), t = Pr(), n = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({ schemaCode: i }) => (0, o._)`{allowedValue: ${i}}`
    },
    code(i) {
      const { gen: s, data: a, $data: c, schemaCode: u, schema: d } = i;
      c || d && typeof d == "object" ? i.fail$data((0, o._)`!${(0, e.useFunc)(s, t.default)}(${a}, ${u})`) : i.fail((0, o._)`${d} !== ${a}`);
    }
  };
  return kt.default = n, kt;
}
var xt = {}, Tn;
function fo() {
  if (Tn) return xt;
  Tn = 1, Object.defineProperty(xt, "__esModule", { value: !0 });
  const o = te(), e = ie(), t = Pr(), n = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: i }) => (0, o._)`{allowedValues: ${i}}`
    },
    code(i) {
      const { gen: s, data: a, $data: c, schema: u, schemaCode: d, it: y } = i;
      if (!c && u.length === 0)
        throw new Error("enum must have non-empty array");
      const _ = u.length >= y.opts.loopEnum;
      let v;
      const S = () => v ?? (v = (0, e.useFunc)(s, t.default));
      let m;
      if (_ || c)
        m = s.let("valid"), i.block$data(m, h);
      else {
        if (!Array.isArray(u))
          throw new Error("ajv implementation error");
        const l = s.const("vSchema", d);
        m = (0, o.or)(...u.map((f, g) => p(l, g)));
      }
      i.pass(m);
      function h() {
        s.assign(m, !1), s.forOf("v", d, (l) => s.if((0, o._)`${S()}(${a}, ${l})`, () => s.assign(m, !0).break()));
      }
      function p(l, f) {
        const g = u[f];
        return typeof g == "object" && g !== null ? (0, o._)`${S()}(${a}, ${l}[${f}])` : (0, o._)`${a} === ${g}`;
      }
    }
  };
  return xt.default = n, xt;
}
var Mn;
function po() {
  if (Mn) return yt;
  Mn = 1, Object.defineProperty(yt, "__esModule", { value: !0 });
  const o = ro(), e = no(), t = oo(), r = so(), n = ao(), i = co(), s = lo(), a = uo(), c = ho(), u = fo(), d = [
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
    u.default
  ];
  return yt.default = d, yt;
}
var At = {}, He = {}, kn;
function ii() {
  if (kn) return He;
  kn = 1, Object.defineProperty(He, "__esModule", { value: !0 }), He.validateAdditionalItems = void 0;
  const o = te(), e = ie(), r = {
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
    const { gen: a, schema: c, data: u, keyword: d, it: y } = i;
    y.items = !0;
    const _ = a.const("len", (0, o._)`${u}.length`);
    if (c === !1)
      i.setParams({ len: s.length }), i.pass((0, o._)`${_} <= ${s.length}`);
    else if (typeof c == "object" && !(0, e.alwaysValidSchema)(y, c)) {
      const S = a.var("valid", (0, o._)`${_} <= ${s.length}`);
      a.if((0, o.not)(S), () => v(S)), i.ok(S);
    }
    function v(S) {
      a.forRange("i", s.length, _, (m) => {
        i.subschema({ keyword: d, dataProp: m, dataPropType: e.Type.Num }, S), y.allErrors || a.if((0, o.not)(S), () => a.break());
      });
    }
  }
  return He.validateAdditionalItems = n, He.default = r, He;
}
var Nt = {}, Ye = {}, xn;
function oi() {
  if (xn) return Ye;
  xn = 1, Object.defineProperty(Ye, "__esModule", { value: !0 }), Ye.validateTuple = void 0;
  const o = te(), e = ie(), t = Re(), r = {
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
    const { gen: c, parentSchema: u, data: d, keyword: y, it: _ } = i;
    m(u), _.opts.unevaluated && a.length && _.items !== !0 && (_.items = e.mergeEvaluated.items(c, a.length, _.items));
    const v = c.name("valid"), S = c.const("len", (0, o._)`${d}.length`);
    a.forEach((h, p) => {
      (0, e.alwaysValidSchema)(_, h) || (c.if((0, o._)`${S} > ${p}`, () => i.subschema({
        keyword: y,
        schemaProp: p,
        dataProp: p
      }, v)), i.ok(v));
    });
    function m(h) {
      const { opts: p, errSchemaPath: l } = _, f = a.length, g = f === h.minItems && (f === h.maxItems || h[s] === !1);
      if (p.strictTuples && !g) {
        const $ = `"${y}" is ${f}-tuple, but minItems or maxItems/${s} are not specified or different at path "${l}"`;
        (0, e.checkStrictMode)(_, $, p.strictTuples);
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
  const o = te(), e = ie(), t = Re(), r = ii(), i = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: s } }) => (0, o.str)`must NOT have more than ${s} items`,
      params: ({ params: { len: s } }) => (0, o._)`{limit: ${s}}`
    },
    code(s) {
      const { schema: a, parentSchema: c, it: u } = s, { prefixItems: d } = c;
      u.items = !0, !(0, e.alwaysValidSchema)(u, a) && (d ? (0, r.validateAdditionalItems)(s, d) : s.ok((0, t.validateArray)(s)));
    }
  };
  return Rt.default = i, Rt;
}
var Ct = {}, Rn;
function yo() {
  if (Rn) return Ct;
  Rn = 1, Object.defineProperty(Ct, "__esModule", { value: !0 });
  const o = te(), e = ie(), r = {
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
      const { gen: i, schema: s, parentSchema: a, data: c, it: u } = n;
      let d, y;
      const { minContains: _, maxContains: v } = a;
      u.opts.next ? (d = _ === void 0 ? 1 : _, y = v) : d = 1;
      const S = i.const("len", (0, o._)`${c}.length`);
      if (n.setParams({ min: d, max: y }), y === void 0 && d === 0) {
        (0, e.checkStrictMode)(u, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (y !== void 0 && d > y) {
        (0, e.checkStrictMode)(u, '"minContains" > "maxContains" is always invalid'), n.fail();
        return;
      }
      if ((0, e.alwaysValidSchema)(u, s)) {
        let f = (0, o._)`${S} >= ${d}`;
        y !== void 0 && (f = (0, o._)`${f} && ${S} <= ${y}`), n.pass(f);
        return;
      }
      u.items = !0;
      const m = i.name("valid");
      y === void 0 && d === 1 ? p(m, () => i.if(m, () => i.break())) : d === 0 ? (i.let(m, !0), y !== void 0 && i.if((0, o._)`${c}.length > 0`, h)) : (i.let(m, !1), h()), n.result(m, () => n.reset());
      function h() {
        const f = i.name("_valid"), g = i.let("count", 0);
        p(f, () => i.if(f, () => l(g)));
      }
      function p(f, g) {
        i.forRange("i", 0, S, ($) => {
          n.subschema({
            keyword: "contains",
            dataProp: $,
            dataPropType: e.Type.Num,
            compositeRule: !0
          }, f), g();
        });
      }
      function l(f) {
        i.code((0, o._)`${f}++`), y === void 0 ? i.if((0, o._)`${f} >= ${d}`, () => i.assign(m, !0).break()) : (i.if((0, o._)`${f} > ${y}`, () => i.assign(m, !1).break()), d === 1 ? i.assign(m, !0) : i.if((0, o._)`${f} >= ${d}`, () => i.assign(m, !0)));
      }
    }
  };
  return Ct.default = r, Ct;
}
var pr = {}, Cn;
function vo() {
  return Cn || (Cn = 1, (function(o) {
    Object.defineProperty(o, "__esModule", { value: !0 }), o.validateSchemaDeps = o.validatePropertyDeps = o.error = void 0;
    const e = te(), t = ie(), r = Re();
    o.error = {
      message: ({ params: { property: c, depsCount: u, deps: d } }) => {
        const y = u === 1 ? "property" : "properties";
        return (0, e.str)`must have ${y} ${d} when property ${c} is present`;
      },
      params: ({ params: { property: c, depsCount: u, deps: d, missingProperty: y } }) => (0, e._)`{property: ${c},
    missingProperty: ${y},
    depsCount: ${u},
    deps: ${d}}`
      // TODO change to reference
    };
    const n = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: o.error,
      code(c) {
        const [u, d] = i(c);
        s(c, u), a(c, d);
      }
    };
    function i({ schema: c }) {
      const u = {}, d = {};
      for (const y in c) {
        if (y === "__proto__")
          continue;
        const _ = Array.isArray(c[y]) ? u : d;
        _[y] = c[y];
      }
      return [u, d];
    }
    function s(c, u = c.schema) {
      const { gen: d, data: y, it: _ } = c;
      if (Object.keys(u).length === 0)
        return;
      const v = d.let("missing");
      for (const S in u) {
        const m = u[S];
        if (m.length === 0)
          continue;
        const h = (0, r.propertyInData)(d, y, S, _.opts.ownProperties);
        c.setParams({
          property: S,
          depsCount: m.length,
          deps: m.join(", ")
        }), _.allErrors ? d.if(h, () => {
          for (const p of m)
            (0, r.checkReportMissingProp)(c, p);
        }) : (d.if((0, e._)`${h} && (${(0, r.checkMissingProp)(c, m, v)})`), (0, r.reportMissingProp)(c, v), d.else());
      }
    }
    o.validatePropertyDeps = s;
    function a(c, u = c.schema) {
      const { gen: d, data: y, keyword: _, it: v } = c, S = d.name("valid");
      for (const m in u)
        (0, t.alwaysValidSchema)(v, u[m]) || (d.if(
          (0, r.propertyInData)(d, y, m, v.opts.ownProperties),
          () => {
            const h = c.subschema({ keyword: _, schemaProp: m }, S);
            c.mergeValidEvaluated(h, S);
          },
          () => d.var(S, !0)
          // TODO var
        ), c.ok(S));
    }
    o.validateSchemaDeps = a, o.default = n;
  })(pr)), pr;
}
var jt = {}, jn;
function bo() {
  if (jn) return jt;
  jn = 1, Object.defineProperty(jt, "__esModule", { value: !0 });
  const o = te(), e = ie(), r = {
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
      const u = i.name("valid");
      i.forIn("key", a, (d) => {
        n.setParams({ propertyName: d }), n.subschema({
          keyword: "propertyNames",
          data: d,
          dataTypes: ["string"],
          propertyName: d,
          compositeRule: !0
        }, u), i.if((0, o.not)(u), () => {
          n.error(!0), c.allErrors || i.break();
        });
      }), n.ok(u);
    }
  };
  return jt.default = r, jt;
}
var It = {}, In;
function si() {
  if (In) return It;
  In = 1, Object.defineProperty(It, "__esModule", { value: !0 });
  const o = Re(), e = te(), t = Fe(), r = ie(), i = {
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
      const { gen: a, schema: c, parentSchema: u, data: d, errsCount: y, it: _ } = s;
      if (!y)
        throw new Error("ajv implementation error");
      const { allErrors: v, opts: S } = _;
      if (_.props = !0, S.removeAdditional !== "all" && (0, r.alwaysValidSchema)(_, c))
        return;
      const m = (0, o.allSchemaProperties)(u.properties), h = (0, o.allSchemaProperties)(u.patternProperties);
      p(), s.ok((0, e._)`${y} === ${t.default.errors}`);
      function p() {
        a.forIn("key", d, (w) => {
          !m.length && !h.length ? g(w) : a.if(l(w), () => g(w));
        });
      }
      function l(w) {
        let P;
        if (m.length > 8) {
          const M = (0, r.schemaRefOrVal)(_, u.properties, "properties");
          P = (0, o.isOwnProperty)(a, M, w);
        } else m.length ? P = (0, e.or)(...m.map((M) => (0, e._)`${w} === ${M}`)) : P = e.nil;
        return h.length && (P = (0, e.or)(P, ...h.map((M) => (0, e._)`${(0, o.usePattern)(s, M)}.test(${w})`))), (0, e.not)(P);
      }
      function f(w) {
        a.code((0, e._)`delete ${d}[${w}]`);
      }
      function g(w) {
        if (S.removeAdditional === "all" || S.removeAdditional && c === !1) {
          f(w);
          return;
        }
        if (c === !1) {
          s.setParams({ additionalProperty: w }), s.error(), v || a.break();
          return;
        }
        if (typeof c == "object" && !(0, r.alwaysValidSchema)(_, c)) {
          const P = a.name("valid");
          S.removeAdditional === "failing" ? ($(w, P, !1), a.if((0, e.not)(P), () => {
            s.reset(), f(w);
          })) : ($(w, P), v || a.if((0, e.not)(P), () => a.break()));
        }
      }
      function $(w, P, M) {
        const j = {
          keyword: "additionalProperties",
          dataProp: w,
          dataPropType: r.Type.Str
        };
        M === !1 && Object.assign(j, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), s.subschema(j, P);
      }
    }
  };
  return It.default = i, It;
}
var Ot = {}, On;
function wo() {
  if (On) return Ot;
  On = 1, Object.defineProperty(Ot, "__esModule", { value: !0 });
  const o = er(), e = Re(), t = ie(), r = si(), n = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(i) {
      const { gen: s, schema: a, parentSchema: c, data: u, it: d } = i;
      d.opts.removeAdditional === "all" && c.additionalProperties === void 0 && r.default.code(new o.KeywordCxt(d, r.default, "additionalProperties"));
      const y = (0, e.allSchemaProperties)(a);
      for (const h of y)
        d.definedProperties.add(h);
      d.opts.unevaluated && y.length && d.props !== !0 && (d.props = t.mergeEvaluated.props(s, (0, t.toHash)(y), d.props));
      const _ = y.filter((h) => !(0, t.alwaysValidSchema)(d, a[h]));
      if (_.length === 0)
        return;
      const v = s.name("valid");
      for (const h of _)
        S(h) ? m(h) : (s.if((0, e.propertyInData)(s, u, h, d.opts.ownProperties)), m(h), d.allErrors || s.else().var(v, !0), s.endIf()), i.it.definedProperties.add(h), i.ok(v);
      function S(h) {
        return d.opts.useDefaults && !d.compositeRule && a[h].default !== void 0;
      }
      function m(h) {
        i.subschema({
          keyword: "properties",
          schemaProp: h,
          dataProp: h
        }, v);
      }
    }
  };
  return Ot.default = n, Ot;
}
var qt = {}, qn;
function _o() {
  if (qn) return qt;
  qn = 1, Object.defineProperty(qt, "__esModule", { value: !0 });
  const o = Re(), e = te(), t = ie(), r = ie(), n = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(i) {
      const { gen: s, schema: a, data: c, parentSchema: u, it: d } = i, { opts: y } = d, _ = (0, o.allSchemaProperties)(a), v = _.filter((g) => (0, t.alwaysValidSchema)(d, a[g]));
      if (_.length === 0 || v.length === _.length && (!d.opts.unevaluated || d.props === !0))
        return;
      const S = y.strictSchema && !y.allowMatchingProperties && u.properties, m = s.name("valid");
      d.props !== !0 && !(d.props instanceof e.Name) && (d.props = (0, r.evaluatedPropsToName)(s, d.props));
      const { props: h } = d;
      p();
      function p() {
        for (const g of _)
          S && l(g), d.allErrors ? f(g) : (s.var(m, !0), f(g), s.if(m));
      }
      function l(g) {
        for (const $ in S)
          new RegExp(g).test($) && (0, t.checkStrictMode)(d, `property ${$} matches pattern ${g} (use allowMatchingProperties)`);
      }
      function f(g) {
        s.forIn("key", c, ($) => {
          s.if((0, e._)`${(0, o.usePattern)(i, g)}.test(${$})`, () => {
            const w = v.includes(g);
            w || i.subschema({
              keyword: "patternProperties",
              schemaProp: g,
              dataProp: $,
              dataPropType: r.Type.Str
            }, m), d.opts.unevaluated && h !== !0 ? s.assign((0, e._)`${h}[${$}]`, !0) : !w && !d.allErrors && s.if((0, e.not)(m), () => s.break());
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
  const o = ie(), e = {
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
  const o = te(), e = ie(), r = {
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
      const u = s, d = i.let("valid", !1), y = i.let("passing", null), _ = i.name("_valid");
      n.setParams({ passing: y }), i.block(v), n.result(d, () => n.reset(), () => n.error(!0));
      function v() {
        u.forEach((S, m) => {
          let h;
          (0, e.alwaysValidSchema)(c, S) ? i.var(_, !0) : h = n.subschema({
            keyword: "oneOf",
            schemaProp: m,
            compositeRule: !0
          }, _), m > 0 && i.if((0, o._)`${_} && ${d}`).assign(d, !1).assign(y, (0, o._)`[${y}, ${m}]`).else(), i.if(_, () => {
            i.assign(d, !0), i.assign(y, m), h && n.mergeEvaluated(h, o.Name);
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
  const o = ie(), e = {
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
        const u = t.subschema({ keyword: "allOf", schemaProp: c }, s);
        t.ok(s), t.mergeEvaluated(u);
      });
    }
  };
  return Vt.default = e, Vt;
}
var Ft = {}, Fn;
function To() {
  if (Fn) return Ft;
  Fn = 1, Object.defineProperty(Ft, "__esModule", { value: !0 });
  const o = te(), e = ie(), r = {
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
      const u = n(c, "then"), d = n(c, "else");
      if (!u && !d)
        return;
      const y = s.let("valid", !0), _ = s.name("_valid");
      if (v(), i.reset(), u && d) {
        const m = s.let("ifClause");
        i.setParams({ ifClause: m }), s.if(_, S("then", m), S("else", m));
      } else u ? s.if(_, S("then")) : s.if((0, o.not)(_), S("else"));
      i.pass(y, () => i.error(!0));
      function v() {
        const m = i.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, _);
        i.mergeEvaluated(m);
      }
      function S(m, h) {
        return () => {
          const p = i.subschema({ keyword: m }, _);
          s.assign(y, _), i.mergeValidEvaluated(p, y), h ? s.assign(h, (0, o._)`${m}`) : i.setParams({ ifClause: m });
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
  const o = ie(), e = {
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
  const o = ii(), e = mo(), t = oi(), r = go(), n = yo(), i = vo(), s = bo(), a = si(), c = wo(), u = _o(), d = $o(), y = So(), _ = Po(), v = Eo(), S = To(), m = Mo();
  function h(p = !1) {
    const l = [
      // any
      d.default,
      y.default,
      _.default,
      v.default,
      S.default,
      m.default,
      // object
      s.default,
      a.default,
      i.default,
      c.default,
      u.default
    ];
    return p ? l.push(e.default, r.default) : l.push(o.default, t.default), l.push(n.default), l;
  }
  return At.default = h, At;
}
var Bt = {}, Ut = {}, Un;
function xo() {
  if (Un) return Ut;
  Un = 1, Object.defineProperty(Ut, "__esModule", { value: !0 });
  const o = te(), t = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: r }) => (0, o.str)`must match format "${r}"`,
      params: ({ schemaCode: r }) => (0, o._)`{format: ${r}}`
    },
    code(r, n) {
      const { gen: i, data: s, $data: a, schema: c, schemaCode: u, it: d } = r, { opts: y, errSchemaPath: _, schemaEnv: v, self: S } = d;
      if (!y.validateFormats)
        return;
      a ? m() : h();
      function m() {
        const p = i.scopeValue("formats", {
          ref: S.formats,
          code: y.code.formats
        }), l = i.const("fDef", (0, o._)`${p}[${u}]`), f = i.let("fType"), g = i.let("format");
        i.if((0, o._)`typeof ${l} == "object" && !(${l} instanceof RegExp)`, () => i.assign(f, (0, o._)`${l}.type || "string"`).assign(g, (0, o._)`${l}.validate`), () => i.assign(f, (0, o._)`"string"`).assign(g, l)), r.fail$data((0, o.or)($(), w()));
        function $() {
          return y.strictSchema === !1 ? o.nil : (0, o._)`${u} && !${g}`;
        }
        function w() {
          const P = v.$async ? (0, o._)`(${l}.async ? await ${g}(${s}) : ${g}(${s}))` : (0, o._)`${g}(${s})`, M = (0, o._)`(typeof ${g} == "function" ? ${P} : ${g}.test(${s}))`;
          return (0, o._)`${g} && ${g} !== true && ${f} === ${n} && !${M}`;
        }
      }
      function h() {
        const p = S.formats[c];
        if (!p) {
          $();
          return;
        }
        if (p === !0)
          return;
        const [l, f, g] = w(p);
        l === n && r.pass(P());
        function $() {
          if (y.strictSchema === !1) {
            S.logger.warn(M());
            return;
          }
          throw new Error(M());
          function M() {
            return `unknown format "${c}" ignored in schema at path "${_}"`;
          }
        }
        function w(M) {
          const j = M instanceof RegExp ? (0, o.regexpCode)(M) : y.code.formats ? (0, o._)`${y.code.formats}${(0, o.getProperty)(c)}` : void 0, L = i.scopeValue("formats", { key: c, ref: M, code: j });
          return typeof M == "object" && !(M instanceof RegExp) ? [M.type || "string", M.validate, (0, o._)`${L}.validate`] : ["string", M, L];
        }
        function P() {
          if (typeof p == "object" && !(p instanceof RegExp) && p.async) {
            if (!v.$async)
              throw new Error("async format in sync schema");
            return (0, o._)`await ${g}(${s})`;
          }
          return typeof f == "function" ? (0, o._)`${g}(${s})` : (0, o._)`${g}.test(${s})`;
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
  const o = te(), e = Co(), t = Sr(), r = tr(), n = ie(), s = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: a, tagName: c } }) => a === e.DiscrError.Tag ? `tag "${c}" must be string` : `value of tag "${c}" must be in oneOf`,
      params: ({ params: { discrError: a, tag: c, tagName: u } }) => (0, o._)`{error: ${a}, tag: ${u}, tagValue: ${c}}`
    },
    code(a) {
      const { gen: c, data: u, schema: d, parentSchema: y, it: _ } = a, { oneOf: v } = y;
      if (!_.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const S = d.propertyName;
      if (typeof S != "string")
        throw new Error("discriminator: requires propertyName");
      if (d.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!v)
        throw new Error("discriminator: requires oneOf keyword");
      const m = c.let("valid", !1), h = c.const("tag", (0, o._)`${u}${(0, o.getProperty)(S)}`);
      c.if((0, o._)`typeof ${h} == "string"`, () => p(), () => a.error(!1, { discrError: e.DiscrError.Tag, tag: h, tagName: S })), a.ok(m);
      function p() {
        const g = f();
        c.if(!1);
        for (const $ in g)
          c.elseIf((0, o._)`${h} === ${$}`), c.assign(m, l(g[$]));
        c.else(), a.error(!1, { discrError: e.DiscrError.Mapping, tag: h, tagName: S }), c.endIf();
      }
      function l(g) {
        const $ = c.name("valid"), w = a.subschema({ keyword: "oneOf", schemaProp: g }, $);
        return a.mergeEvaluated(w, o.Name), $;
      }
      function f() {
        var g;
        const $ = {}, w = M(y);
        let P = !0;
        for (let D = 0; D < v.length; D++) {
          let V = v[D];
          if (V?.$ref && !(0, n.schemaHasRulesButRef)(V, _.self.RULES)) {
            const H = V.$ref;
            if (V = t.resolveRef.call(_.self, _.schemaEnv.root, _.baseId, H), V instanceof t.SchemaEnv && (V = V.schema), V === void 0)
              throw new r.default(_.opts.uriResolver, _.baseId, H);
          }
          const z = (g = V?.properties) === null || g === void 0 ? void 0 : g[S];
          if (typeof z != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${S}"`);
          P = P && (w || M(V)), j(z, D);
        }
        if (!P)
          throw new Error(`discriminator: "${S}" must be required`);
        return $;
        function M({ required: D }) {
          return Array.isArray(D) && D.includes(S);
        }
        function j(D, V) {
          if (D.const)
            L(D.const, V);
          else if (D.enum)
            for (const z of D.enum)
              L(z, V);
          else
            throw new Error(`discriminator: "properties/${S}" must have "const" or "enum"`);
        }
        function L(D, V) {
          if (typeof D != "string" || D in $)
            throw new Error(`discriminator: "${S}" values must be unique strings`);
          $[D] = V;
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
        super._addVocabularies(), r.default.forEach((S) => this.addVocabulary(S)), this.opts.discriminator && this.addKeyword(n.default);
      }
      _addDefaultMetaSchema() {
        if (super._addDefaultMetaSchema(), !this.opts.meta)
          return;
        const S = this.opts.$data ? this.$dataMetaSchema(i, s) : i;
        this.addMetaSchema(S, a, !1), this.refs["http://json-schema.org/schema"] = a;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(a) ? a : void 0);
      }
    }
    e.Ajv = c, o.exports = e = c, o.exports.Ajv = c, Object.defineProperty(e, "__esModule", { value: !0 }), e.default = c;
    var u = er();
    Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
      return u.KeywordCxt;
    } });
    var d = te();
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
    var y = $r();
    Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
      return y.default;
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
      const u = c % t.length, d = Math.floor(c / t.length) * 12, y = t[u];
      return a + y + d;
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
    const n = li(o, e), i = e.indexOf(n), s = i > 0 ? i - 1 : i, a = e[s], c = n - o, u = o - a, d = c + u;
    if (d === 0) return i - r;
    const y = 1 - c / d, _ = 1 - u / d, v = i - r, S = s - r;
    return v * y + S * _;
  }
}
function ns(o, e, t) {
  const r = e.indexOf(t), n = Math.round(r + o);
  if (n >= 0 && n < e.length)
    return e[n];
  {
    const i = Math.max(0, Math.min(n, e.length - 1)), s = Math.min(e.length - 1, Math.max(n, 0)), a = e[i], c = e[s], u = s - n, d = n - i, y = u + d;
    if (y === 0)
      return (c + a) / 2;
    const _ = 1 - u / y, v = 1 - d / y;
    return c * _ + a * v;
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
    const [s, a, c] = i, u = e + c;
    if (u > r) {
      const y = [null, u - r, r - e];
      n.push(y);
    }
    n.push(i), r = Math.max(r, u + a);
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
    let u = Math.round(i / t) * t;
    u = Math.min(u, c - a), u > 0 && r.push([n, u, a]);
  }
  return r;
}
function us(o, e) {
  const r = o.filter(([a, , c]) => a !== null && c !== null).sort((a, c) => a[2] - c[2]), n = Math.max(...r.map(([, , a]) => a)), i = Math.floor(n / e) + 1, s = [];
  for (let a = 0; a < i; a++) {
    const c = a * e;
    let u = null, d = 1 / 0;
    for (const [y, , _] of r) {
      const v = c - _;
      if (v >= 0 && v < d && (d = v, u = y), _ > c) break;
    }
    u !== null && s.push(u);
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
      const c = a * t, u = pi(i, c);
      s.push(...u);
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
    for (let u = 0; u < e; u++) {
      const d = this.weightedRandomChoice(this.weights);
      if (s[d].length > 0) {
        const y = s[d][Math.floor(Math.random() * s[d].length)], _ = a[d], v = Array.isArray(y) ? y[0] : y, S = this.generateChord(v, _);
        c.push(S);
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
      const u = s + c, d = i.indexOf(u);
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
        const u = t[s % t.length], d = [c, u, a];
        return a += u, s++, d;
      });
    }
    const i = n.map(([s, a, c]) => [this.pitchToChord(s), a, c]);
    if (r) {
      const s = [];
      for (const [a, c, u] of i) {
        const d = c / a.length;
        a.forEach((y, _) => {
          s.push([y, d, u + _ * d]);
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
        const u = 12 * a + c;
        u >= 0 && u <= 127 && s.push(u);
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
      const c = i * 0.125, u = { pitch: n, duration: i, time: s + c };
      return [
        ...e.slice(0, t),
        { pitch: a, duration: c, time: s },
        u,
        ...e.slice(t + 1)
      ];
    } else {
      const c = i / 2, u = { pitch: n, duration: c, time: s + c };
      return [
        ...e.slice(0, t),
        { pitch: a, duration: c, time: s },
        u,
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
    const u = this.params.by || 1, d = this.params.trillRate || 0.125;
    let y;
    if (this.scale && this.scale.includes(n)) {
      const v = (this.scale.indexOf(n) + Math.round(u)) % this.scale.length;
      y = this.scale[v];
    } else
      y = n + u;
    for (; c < s + i; ) {
      const _ = s + i - c, v = Math.min(d, _ / 2);
      if (_ >= v * 2)
        a.push({ pitch: n, duration: v, time: c }), a.push({ pitch: y, duration: v, time: c + v }), c += 2 * v;
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
    const u = i / 3, d = [
      { pitch: n, duration: u, time: s },
      { pitch: c, duration: u, time: s + u },
      { pitch: n, duration: u, time: s + 2 * u }
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
    let c, u;
    if (this.scale && this.scale.includes(n)) {
      const y = this.scale.indexOf(n);
      c = this.scale[y + 1] || n + 2, u = this.scale[y - 1] || n - 2;
    } else
      c = n + 2, u = n - 2;
    const d = [
      { pitch: n, duration: a, time: s },
      { pitch: c, duration: a, time: s + a },
      { pitch: n, duration: a, time: s + 2 * a },
      { pitch: u, duration: a, time: s + 3 * a }
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
    const u = [];
    if (this.scale && this.scale.includes(n)) {
      const _ = this.scale.indexOf(n);
      u.push(...a.map((v) => this.scale[_ + v] || n + v));
    } else
      u.push(...a.map((_) => n + _));
    c === "down" && u.reverse(), c === "both" && u.push(...u.slice(0, -1).reverse());
    const d = i / u.length, y = u.map((_, v) => ({
      pitch: _,
      duration: d,
      time: s + v * d
    }));
    return [
      ...e.slice(0, t),
      ...y,
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
        a = this.mutate(a), a.sort((c, u) => c[1] - u[1]), r.push(a);
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
  const r = o.map((u) => Array.isArray(u) || typeof u == "object" && u.length ? u[0] : u), n = js(r.length, e.length), i = [], s = [];
  for (let u = 0; u < n; u++)
    i.push(r[u % r.length]), s.push(e[u % e.length]);
  const a = i.map((u, d) => [u, s[d], 1]), c = di(a);
  return t.legacy ? c : c.map(([u, d, y]) => ({
    pitch: u,
    duration: d,
    time: t.useStringTime ? je(y) : y
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
        const u = n.mean[c], d = n.std[c];
        a[c] = u + d * this.sampleStandardNormal();
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
      const u = i - c;
      r[n] = Math.sqrt(Math.max(0, u));
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
  const { timeSignature: t, ticksPerQuarterNote: r } = e, [n, i] = t, s = n * 4 / i, a = Math.floor(o / s), c = o % s, u = Math.floor(c), d = c - u, y = Math.round(d * r);
  return `${a}:${u}:${y}`;
}
function Mr(o, e = Ie) {
  const { timeSignature: t, ticksPerQuarterNote: r } = e, [n, i] = t, s = o.split(":");
  if (s.length !== 3)
    throw new Error(`Invalid bars:beats:ticks format: ${o}`);
  const a = parseInt(s[0], 10), c = parseFloat(s[1]), u = parseInt(s[2], 10);
  if (isNaN(a) || isNaN(c) || isNaN(u))
    throw new Error(`Invalid numeric values in bars:beats:ticks: ${o}`);
  const d = n * 4 / i;
  return a * d + c + u / r;
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
      const u = Array.from({ length: t }, (m, h) => [h]), d = new Ce(u), _ = new Zn(n, i).call(d);
      for (let m = 0; m < _.rows; m++)
        _.set(m, m, _.get(m, m) + s);
      let v = new Array(t).fill(this.walkAround || 0);
      this.walkAround && typeof this.walkAround == "number" && (v = new Array(t).fill(this.walkAround));
      const S = zs(v, _);
      a.push(S);
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
    const u = Math.min(...this.data.map((m) => m[0])), y = (Math.max(...this.data.map((m) => m[0])) - u) / (t - 1), _ = Array.from({ length: t }, (m, h) => [u + h * y]), v = this.gpr.sampleY(_, r), S = _.map((m) => m[0]);
    return r === 1 ? [S, v[0]] : [S, v];
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
    } = n, u = [];
    let d = 0;
    const y = Array.isArray(e[0]) ? e : [e], _ = r || Array.from({ length: y[0].length }, (v, S) => S);
    for (let v = 0; v < y[0].length; v++) {
      const S = t[v % t.length], m = r ? _[v] : d, h = y.map((l) => {
        let f = l[v];
        if (s) {
          const g = Math.min(...l), w = Math.max(...l) - g || 1, P = (f - g) / w, M = Math.floor(P * s.length), j = Math.max(0, Math.min(M, s.length - 1));
          f = s[j];
        } else {
          const g = Math.min(...l), w = Math.max(...l) - g || 1, P = (f - g) / w;
          f = a[0] + P * (a[1] - a[0]);
        }
        return c && (f = Math.round(f)), f;
      }), p = h.length === 1 ? h[0] : h;
      u.push({
        pitch: p,
        duration: S,
        time: i ? Ze(m, this.timingConfig) : m
      }), r || (d += S);
    }
    return u;
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
      const a = s.map((c, u) => {
        if (!c || typeof c != "object")
          throw new Error(`Note ${u} in loop "${n}" must be an object`);
        if (c.pitch !== null && (typeof c.pitch != "number" || c.pitch < 0 || c.pitch > 127))
          throw new Error(`Note ${u} in loop "${n}" has invalid pitch: ${c.pitch}`);
        if (typeof c.time != "number" || c.time < 0)
          throw new Error(`Note ${u} in loop "${n}" has invalid time: ${c.time}`);
        if (typeof c.duration != "number" || c.duration <= 0)
          throw new Error(`Note ${u} in loop "${n}" has invalid duration: ${c.duration}`);
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
    i.forEach((u, d) => {
      if (u) {
        const y = d * a, _ = r[d % r.length];
        s.push({
          pitch: _,
          duration: a * 0.8,
          time: y,
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
        const c = s.count, u = a.count - s.count;
        r = [
          { pattern: [...a.pattern, ...s.pattern], count: c }
        ], u > 0 && r.push({ pattern: a.pattern, count: u });
      } else {
        const c = a.count, u = s.count - a.count;
        r = [
          { pattern: [...s.pattern, ...a.pattern], count: c }
        ], u > 0 && r.push({ pattern: s.pattern, count: u });
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
        const u = e - t % e;
        u < i && u > 0 && (r += Math.min(
          u,
          i - u
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
    for (const [c, u] of Object.entries(n)) {
      const d = i[c];
      if (typeof u == "number" && typeof d == "number") {
        const y = Math.max(Math.abs(u), Math.abs(d), 1), _ = 1 - Math.abs(u - d) / y;
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
      weights: u = null,
      targets: d = null,
      seed: y = null
    } = e;
    this.initialPhrases = t, this.mutationRate = r, this.populationSize = n, this.scale = s, this.measureLength = a, this.timeResolution = c, y !== null ? (this.seed = y, this.randomState = this.createSeededRandom(y)) : this.randomState = Math;
    const _ = [0.125, 0.25, 0.5, 1, 2, 3, 4, 8];
    this.possibleDurations = _.filter(
      (v) => v >= c[0] && v <= Math.min(c[1], a)
    ), this.mutationProbabilities = i || {
      pitch: () => Math.max(0, Math.min(127, Math.floor(this.gaussianRandom(60, 5)))),
      duration: () => {
        const v = this.possibleDurations.map((S, m) => Math.pow(2, -m));
        return this.weightedChoice(this.possibleDurations, v);
      },
      rest: () => this.randomState.random() < 0.02 ? null : 1
    }, this.weights = u || {
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
        const c = a === 0 ? `${n}_pitch` : a === 1 ? `${n}_duration` : `${n}_offset`, u = t[c] || 0, d = i[a], y = s[a];
        if (y > 0 && d !== void 0) {
          const _ = Math.max(Math.abs(d), 1), v = 1 - Math.abs(u - d) / _;
          r += Math.max(0, v) * y;
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
      const u = n;
      n += a, r.push([s, a, u]);
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
    let u = 0;
    for (let d = 0; d < c.length; d++)
      c[d][2] = u, u += c[d][1];
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
      const u = (c - i) / a, d = Math.floor(u * t.length * r), y = Math.floor(d / t.length), _ = d % t.length;
      return 60 + y * 12 + t[_];
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
      const c = (a - n) / s, u = Math.floor(c * t.length), d = Math.max(0, Math.min(u, t.length - 1));
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
      const u = (c - i) / a;
      return t + u * (r - t);
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
    const e = this.getProjection(0), t = e[0], r = e[e.length - 1], n = Math.abs(r - t), i = e.map((u) => Math.pow(u - t, 2)), s = i.reduce((u, d) => u + d, 0) / i.length;
    let a = 0;
    for (let u = 1; u < e.length; u++)
      a += Math.abs(e[u] - e[u - 1]);
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
    } = t, c = this.getProjection(i), u = [];
    let d = 0;
    for (let y = 0; y < c.length; y++) {
      const _ = e[y % e.length];
      let v = c[y];
      if (s) {
        const S = Math.min(...c), h = Math.max(...c) - S || 1, p = (v - S) / h, l = Math.floor(p * s.length), f = Math.max(0, Math.min(l, s.length - 1));
        v = s[f];
      } else
        v = this.mapToScale([c], s || [60, 62, 64, 65, 67, 69, 71])[0][y];
      u.push({
        pitch: v,
        duration: _,
        time: r ? Ze(d, n) : d
      }), d += _;
    }
    return u;
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
      for (let u = 0; u < i.length; u++) {
        const d = n[u], y = i[u];
        if (y === null) {
          d && (d[s] = null);
          continue;
        }
        const _ = this.generateStep(r);
        let v = y + _;
        if (isNaN(v) && (v = y), this.walkRange !== null && (v < this.walkRange[0] ? v = this.walkRange[0] : v > this.walkRange[1] && (v = this.walkRange[1])), isNaN(v) && (v = this.walkStart), d && (d[s] = v), a[u] = v, r() < this.branchingProbability) {
          const S = this.createBranch(n[u], s), m = this.generateStep(r);
          let h = y + m;
          isNaN(h) && (h = y), this.walkRange !== null && (h < this.walkRange[0] ? h = this.walkRange[0] : h > this.walkRange[1] && (h = this.walkRange[1])), isNaN(h) && (h = this.walkStart), S[s] = h, c.push(S), a.push(h);
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
            for (let u = r; u < e[a].length; u++)
              e[a][u] = null;
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
    const c = Math.max(...e.map((u) => u.length));
    for (let u = 0; u < c; u++) {
      const d = e.map((y) => y[u]).filter((y) => y !== null);
      if (d.length > 0) {
        const y = t[a % t.length], _ = d.length === 1 ? d[0] : d;
        i.push({
          pitch: _,
          duration: y,
          time: n ? Ze(s, this.timingConfig) : s
        }), s += y, a++;
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
      const i = this.walkRange[0], a = this.walkRange[1] - i, c = (n - i) / a, u = Math.floor(c * t.length), d = Math.max(0, Math.min(u, t.length - 1));
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
        const u = c.simulate([n], i);
        r.push(...u);
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
      timingConfig: u = this.timingConfig,
      useStringTime: d = !1
    } = r, y = [];
    for (const _ of e) {
      let v, S;
      if (s) {
        const m = Math.max(0, Math.min(1, _.distance / 10));
        v = n[0] + m * (n[1] - n[0]);
      } else
        v = n[0] + _.angle / 360 * (n[1] - n[0]);
      if (a)
        S = i[0] + _.angle / 360 * (i[1] - i[0]);
      else {
        const m = Math.max(0, Math.min(1, _.distance / 10));
        S = i[1] - m * (i[1] - i[0]);
      }
      if (c) {
        const m = Math.floor((v - n[0]) / (n[1] - n[0]) * c.length), h = Math.max(0, Math.min(m, c.length - 1));
        v = c[h];
      } else
        v = Math.round(v);
      y.push({
        pitch: v,
        duration: S,
        time: d ? Ze(_.time, u) : _.time,
        phasorData: {
          distance: _.distance,
          angle: _.angle,
          position: _.position
        }
      });
    }
    return y;
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
      for (let u = a; u <= c; u++)
        t.push(e[i][u]);
      i++;
      for (let u = i; u <= s; u++)
        t.push(e[u][c]);
      if (c--, i <= s) {
        for (let u = c; u >= a; u--)
          t.push(e[s][u]);
        s--;
      }
      if (a <= c) {
        for (let u = s; u >= i; u--)
          t.push(e[u][a]);
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
      const c = (a - n) / s, u = Math.floor(c * t.length * r), d = Math.floor(u / t.length), y = u % t.length;
      return 60 + d * 12 + t[y];
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
      const a = (s - r) / i, c = Math.floor(a * t.length), u = Math.max(0, Math.min(c, t.length - 1));
      return 1 / t[u];
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
      const c = e + a * s, u = this.r;
      this.r = c;
      const d = this.generate();
      this.r = u;
      const y = d.slice(-50);
      for (const _ of y)
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
        for (let u = 0; u < e; u++)
          u !== a && (c += t * (n[u] - n[a]));
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
        const { offset: S, time: m, ...h } = i;
        n.push({
          ...h,
          pitch: void 0,
          time: t ? this.beatsToTime(S) : S
        });
        continue;
      }
      const s = i.pitch, c = this.tChord.map((S) => S - s).map((S, m) => ({ index: m, value: S })).sort((S, m) => Math.abs(S.value) - Math.abs(m.value));
      let u = this.rank, d;
      if (this.currentDirection === "up" || this.currentDirection === "down") {
        const S = c.filter(
          ({ value: m }) => this.currentDirection === "up" ? m >= 0 : m <= 0
        );
        if (S.length === 0)
          d = this.currentDirection === "up" ? Math.max(...this.tChord) : Math.min(...this.tChord);
        else {
          u >= S.length && (u = S.length - 1);
          const m = S[u].index;
          d = this.tChord[m];
        }
      } else {
        u >= c.length && (u = c.length - 1);
        const S = c[u].index;
        d = this.tChord[S];
      }
      this.isAlternate && (this.currentDirection = this.currentDirection === "up" ? "down" : "up");
      const { offset: y, time: _, ...v } = i;
      n.push({
        ...v,
        pitch: d,
        time: t ? this.beatsToTime(y) : y
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
    const r = e.length, n = t || Array(r).fill(1), i = e.map((y, _) => ({ value: y, weight: n[_] })).sort((y, _) => y.value - _.value), s = i.map((y) => y.value), a = i.map((y) => y.weight), c = a.reduce((y, _) => y + _, 0);
    let u = 0, d = 0;
    for (let y = 0; y < r; y++) {
      const _ = a.slice(0, y + 1).reduce(
        (v, S) => v + S,
        0
      );
      u += a[y] * (2 * _ - a[y] - c) * s[y], d += a[y] * s[y] * c;
    }
    return d === 0 ? 0 : u / d;
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
    const r = e.length, n = t || Math.floor(r / 2), i = [], s = e.reduce((c, u) => c + u, 0) / r, a = e.reduce((c, u) => c + Math.pow(u - s, 2), 0) / r;
    for (let c = 0; c <= n; c++) {
      let u = 0;
      for (let d = 0; d < r - c; d++)
        u += (e[d] - s) * (e[d + c] - s);
      u /= r - c, i.push(a === 0 ? 0 : u / a);
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
  const n = new yr(e).convert(o).map((_, v) => ({
    originalTrackIndex: v,
    voiceIndex: 0,
    totalVoices: 1,
    trackInfo: { label: _.label },
    synthConfig: { type: _.type || "PolySynth" },
    partEvents: _.part || []
  })), i = o.tempo || o.metadata?.tempo || o.bpm || 120, [s, a] = (o.timeSignature || "4/4").split("/").map((_) => parseInt(_, 10)), c = isFinite(s) ? s : 4;
  let u = 0;
  n.forEach((_) => {
    _.partEvents && _.partEvents.length > 0 && _.partEvents.forEach((v) => {
      const S = yr.parseBBTToBeats(v.time, c), m = yr.parseDurationToBeats(v.duration, c), h = S + m;
      h > u && (u = h);
    });
  });
  const d = 60 / i, y = u * d;
  return console.log(`[TONEJS] Duration calc: totalBeats=${u.toFixed(2)} beats = ${y.toFixed(2)}s - loop ends exactly when last note finishes`), {
    tracks: n,
    metadata: {
      totalDuration: y,
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
      for (let u = s; u <= a; u += 12)
        c.push(u);
      c.push(60);
      break;
    case "balanced":
      for (let u = s; u <= a; u += 4)
        c.push(u);
      [60, 64, 67].forEach((u) => {
        u >= s && u <= a && !c.includes(u) && c.push(u);
      });
      break;
    case "quality":
      for (let u = s; u <= a; u += 3)
        c.push(u);
      break;
    case "complete":
      for (let u = s; u <= a; u++)
        c.push(u);
      break;
    default:
      return console.warn(`Unknown sampling strategy '${r}', using 'balanced'`), ot(o, e, t, "balanced");
  }
  c = [...new Set(c)].sort((u, d) => u - d);
  for (const u of c) {
    const d = oa(u);
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
      const d = Object.values(Xe).map((y) => y.name).slice(0, 10);
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
    strategy: u = "complete"
    // Use complete sampling by default
  } = t;
  return {
    id: o,
    type: "Sampler",
    options: {
      urls: ot(n, s, a, u),
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
  const u = o.tempo || o.bpm || ya.DEFAULT_TEMPO, y = _i(o, { autoMultivoice: i, maxVoices: s, showDebug: r }), { tracks: _, metadata: v } = y;
  let S = v.totalDuration;
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
  const l = document.createElement("div");
  l.style.cssText = `
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto auto;
        gap: 12px;
        margin-bottom: 0px;
        font-family: 'PT Sans', sans-serif;
    `, l.classList.add("jmon-music-player-main");
  const f = document.createElement("div");
  f.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        font-family: 'PT Sans', sans-serif;
        gap: 24px;
        flex-wrap: wrap;
    `, f.classList.add("jmon-music-player-top");
  const g = document.createElement("div");
  g.style.cssText = `
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
        box-sizing: border-box;
    `, g.classList.add("jmon-music-player-left");
  const $ = document.createElement("div");
  $.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 6px;
    `;
  const w = Si(), P = o.tracks || [], M = [];
  P.forEach((G, U) => {
    const K = _.find(
      (fe) => fe.originalTrackIndex === U
    )?.analysis;
    K?.hasGlissando && console.warn(
      `Track ${G.label || G.name || U + 1} contient un glissando : la polyphonie sera désactivée pour cette piste.`
    );
    const Y = document.createElement("div");
    Y.style.cssText = `
            margin-bottom: 8px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        `, Y.classList.add("jmon-track-selector");
    const re = document.createElement("label");
    re.textContent = G.label || `Track ${U + 1}`, re.style.cssText = `
            font-family: 'PT Sans', sans-serif;
            font-size: 16px;
            color: ${m.text};
            display: block;
            margin-bottom: 0;
            font-weight: normal;
            flex-shrink: 0;
        `;
    const se = document.createElement("select");
    se.style.cssText = `
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
      const fe = o.tracks?.[U]?.synthRef;
      xe.forEach((Z) => {
        if (Z.id && Z.type && Z.type !== "Destination") {
          const Se = document.createElement("option");
          Se.value = `AudioGraph: ${Z.id}`, Se.textContent = Z.id, fe === Z.id && (Se.selected = !0), $e.appendChild(Se);
        }
      });
    }
    we.forEach((fe) => {
      const Z = document.createElement("option");
      Z.value = fe, Z.textContent = fe, (K?.hasGlissando && fe === "Synth" || !K?.hasGlissando && !o.tracks?.[U]?.synthRef && fe === "PolySynth") && (Z.selected = !0), K?.hasGlissando && (fe === "PolySynth" || fe === "DuoSynth") && (Z.disabled = !0, Z.textContent += " (mono only for glissando)"), $e.appendChild(Z);
    }), se.appendChild($e);
    const qe = document.createElement("optgroup");
    qe.label = "Sampled Instruments";
    const ke = {};
    w.forEach((fe) => {
      ke[fe.category] || (ke[fe.category] = []), ke[fe.category].push(fe);
    }), Object.keys(ke).sort().forEach((fe) => {
      const Z = document.createElement("optgroup");
      Z.label = fe, ke[fe].forEach((Se) => {
        const oe = document.createElement("option");
        oe.value = `GM: ${Se.name}`, oe.textContent = Se.name, K?.hasGlissando && (oe.disabled = !0, oe.textContent += " (not suitable for glissando)"), Z.appendChild(oe);
      }), se.appendChild(Z);
    }), M.push(se), Y.append(re, se), $.appendChild(Y);
  }), g.appendChild($);
  const j = document.createElement("div");
  j.style.cssText = `
        display: flex;
        flex-direction: column;
        min-width: 120px;
        max-width: 150px;
        box-sizing: border-box;
        gap: 16px;
    `, j.classList.add("jmon-music-player-right");
  const L = document.createElement("div");
  L.style.cssText = `
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
  V.type = "number", V.min = 60, V.max = 240, V.value = u, V.style.cssText = `
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
    `, L.append(D, V);
  const z = document.createElement("div");
  z.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 8px;
    `, z.classList.add("jmon-music-player-vertical-downloads");
  const H = document.createElement("button");
  H.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music" style="margin-right: 8px;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg><span>MIDI</span>', H.style.cssText = `
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
    `, H.classList.add("jmon-music-player-btn-vertical");
  const ce = document.createElement("button");
  ce.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-audio-lines" style="margin-right: 8px;"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg><span>WAV</span>', ce.style.cssText = `
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
    `, ce.classList.add("jmon-music-player-btn-vertical"), z.append(H, ce), z.style.display = "none", j.append(L, z);
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
  const ye = document.createElement("div");
  ye.textContent = "0:00", ye.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        font-size: 14px;
        color: ${m.text};
        min-width: 40px;
        text-align: center;
    `;
  const ne = document.createElement("div");
  ne.textContent = "0:00", ne.style.cssText = `
        font-family: 'PT Sans', sans-serif;
        font-size: 14px;
        color: ${m.text};
        min-width: 40px;
        text-align: center;
    `;
  const he = document.createElement("input");
  he.type = "range", he.min = 0, he.max = 100, he.value = 0, he.style.cssText = `
        flex-grow: 1;
        -webkit-appearance: none;
        background: ${m.secondary};
        outline: none;
        border-radius: 15px;
        overflow: visible;
        height: 8px;
    `;
  const O = document.createElement("style");
  O.textContent = `
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
    `, document.head.appendChild(O), he.classList.add("jmon-timeline-slider");
  const k = document.createElement("button");
  k.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>', k.style.cssText = `
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
    `, k.classList.add("jmon-music-player-play");
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
  const b = document.createElement("div");
  b.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0px;
    `, b.append(k, I), de.append(ye, he, ne, b);
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
  const F = document.createElement("button");
  F.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-audio-lines" style="margin-right: 5px;"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg><span>WAV</span>', F.style.cssText = `
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
    `, F.classList.add("jmon-music-player-btn"), E.append(R, F), f.append(g, j), l.appendChild(f), l.appendChild(de), h.append(
    l,
    E
  );
  let x, W = !1, Q = [], T = [], A = [], C = null;
  const q = o.tracks || [], B = () => {
    if (!x || !o.audioGraph || !Array.isArray(o.audioGraph))
      return null;
    const G = {}, U = (K) => {
      const Y = {};
      return Object.entries(K || {}).forEach(([re, se]) => {
        let $e = re;
        if (typeof re == "number" || /^\d+$/.test(String(re)))
          try {
            $e = x.Frequency(parseInt(re, 10), "midi").toNote();
          } catch {
          }
        Y[$e] = se;
      }), Y;
    };
    try {
      return o.audioGraph.forEach((K) => {
        const { id: Y, type: re, options: se = {}, target: $e } = K;
        if (!Y || !re) return;
        let we = null;
        if (re === "Sampler") {
          const xe = U(se.urls);
          let qe, ke;
          const fe = new Promise((Se, oe) => {
            qe = Se, ke = oe;
          }), Z = {
            urls: xe,
            onload: () => qe && qe(),
            onerror: (Se) => {
              console.error(`[PLAYER] Sampler load error for ${Y}:`, Se), ke && ke(Se);
            }
          };
          se.baseUrl && (Z.baseUrl = se.baseUrl);
          try {
            console.log(
              `[PLAYER] Building Sampler ${Y} with urls:`,
              xe,
              "baseUrl:",
              Z.baseUrl || "(none)"
            ), we = new x.Sampler(Z);
          } catch (Se) {
            console.error("[PLAYER] Failed to create Sampler:", Se), we = null;
          }
          A.push(fe), we && se.envelope && se.envelope.enabled && (typeof se.envelope.attack == "number" && (we.attack = se.envelope.attack), typeof se.envelope.release == "number" && (we.release = se.envelope.release));
        } else if (ma.includes(re))
          try {
            we = new x[re](se);
          } catch (xe) {
            console.warn(
              `[PLAYER] Failed to create ${re} from audioGraph, using PolySynth:`,
              xe
            ), we = new x.PolySynth();
          }
        else if (pa.includes(re))
          try {
            we = new x[re](se), console.log(`[PLAYER] Created effect ${Y} (${re}) with options:`, se);
          } catch (xe) {
            console.warn(`[PLAYER] Failed to create ${re} effect:`, xe), we = null;
          }
        else re === "Destination" && (G[Y] = x.Destination);
        we && (G[Y] = we);
      }), Object.keys(G).length > 0 && o.audioGraph.forEach((K) => {
        const { id: Y, target: re } = K;
        if (!Y || !G[Y]) return;
        const se = G[Y];
        if (se !== x.Destination)
          if (re && G[re])
            try {
              G[re] === x.Destination ? (se.toDestination(), console.log(`[PLAYER] Connected ${Y} -> Destination`)) : (se.connect(G[re]), console.log(`[PLAYER] Connected ${Y} -> ${re}`));
            } catch ($e) {
              console.warn(`[PLAYER] Failed to connect ${Y} -> ${re}:`, $e), se.toDestination();
            }
          else
            se.toDestination(), console.log(`[PLAYER] Connected ${Y} -> Destination (no target specified)`);
      }), G;
    } catch (K) {
      return console.error("[PLAYER] Failed building audioGraph instruments:", K), null;
    }
  }, X = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1, le = (G) => `${Math.floor(G / 60)}:${Math.floor(G % 60).toString().padStart(2, "0")}`;
  ne.textContent = le(S);
  const Te = async () => {
    if (typeof window < "u") {
      const G = a || window.Tone || (typeof x < "u" ? x : null);
      if (G)
        console.log(
          "[PLAYER] Using existing Tone.js, version:",
          G.version || "unknown"
        ), window.Tone = G;
      else
        try {
          if (typeof require < "u") {
            console.log("[PLAYER] Loading Tone.js via require()...");
            const K = await require("tone@14.8.49/build/Tone.js");
            window.Tone = K.default || K.Tone || K;
          } else {
            console.log("[PLAYER] Loading Tone.js via import()...");
            const K = await import("https://esm.sh/tone@14.8.49");
            window.Tone = K.default || K.Tone || K;
          }
          if (!window.Tone || typeof window.Tone != "object" || !window.Tone.PolySynth) {
            console.warn(
              "[PLAYER] First load attempt failed, trying alternative CDN..."
            );
            try {
              const K = await import("https://cdn.skypack.dev/tone@14.8.49");
              if (window.Tone = K.default || K.Tone || K, !window.Tone || !window.Tone.PolySynth)
                throw new Error("Alternative CDN also failed");
            } catch {
              console.warn(
                "[PLAYER] Alternative CDN failed, trying jsdelivr..."
              );
              try {
                const Y = await import("https://cdn.jsdelivr.net/npm/tone@14.8.49/build/Tone.js");
                if (window.Tone = Y.default || Y.Tone || Y, !window.Tone || !window.Tone.PolySynth)
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
        } catch (K) {
          return console.warn("Could not auto-load Tone.js:", K.message), console.log(
            "To use the player, load Tone.js manually first using one of these methods:"
          ), console.log(
            'Method 1: Tone = await require("tone@14.8.49/build/Tone.js")'
          ), console.log(
            'Method 2: Tone = await import("https://esm.sh/tone@14.8.49").then(m => m.default)'
          ), console.log(
            'Method 3: Tone = await import("https://cdn.skypack.dev/tone@14.8.49").then(m => m.default)'
          ), !1;
        }
      const U = window.Tone || G;
      if (U)
        return x = U, console.log("[PLAYER] Available Tone constructors:", {
          PolySynth: typeof x.PolySynth,
          Synth: typeof x.Synth,
          Part: typeof x.Part,
          Transport: typeof x.Transport,
          start: typeof x.start,
          context: !!x.context
        }), console.log(
          "[PLAYER] Tone.js initialized, context state:",
          x.context ? x.context.state : "no context"
        ), X() && console.log("[PLAYER] iOS device detected - audio context will start on user interaction"), !0;
    }
    return console.warn("Tone.js not available"), !1;
  }, pe = () => {
    if (!x) {
      console.warn("[PLAYER] Tone.js not available, cannot setup audio");
      return;
    }
    const G = [];
    if (x.PolySynth || G.push("PolySynth"), x.Synth || G.push("Synth"), x.Part || G.push("Part"), x.Transport || G.push("Transport"), G.length > 0) {
      console.error(
        "[PLAYER] Tone.js is missing required constructors:",
        G
      ), console.error(
        "[PLAYER] Available Tone properties:",
        Object.keys(x).filter((U) => typeof x[U] == "function").slice(
          0,
          20
        )
      ), console.error("[PLAYER] Tone object:", x), console.error(
        "[PLAYER] This usually means Tone.js did not load correctly. Try refreshing the page or loading Tone.js manually."
      );
      return;
    }
    if (x.Transport.bpm.value = v.tempo, console.log(
      `[PLAYER] Set Transport BPM to ${v.tempo} before building instruments`
    ), !C && (C = B(), C)) {
      const U = Object.keys(C).filter(
        (K) => C[K] && C[K].name === "Sampler"
      );
      U.length > 0 && console.log(
        "[PLAYER] Using audioGraph Samplers for tracks with synthRef:",
        U
      );
    }
    console.log("[PLAYER] Cleaning up existing audio...", {
      synths: Q.length,
      parts: T.length
    }), x.Transport.stop(), x.Transport.position = 0, T.forEach((U, K) => {
      try {
        U.stop();
      } catch (Y) {
        console.warn(`[PLAYER] Failed to stop part ${K}:`, Y);
      }
    }), T.forEach((U, K) => {
      try {
        U.dispose();
      } catch (Y) {
        console.warn(`[PLAYER] Failed to dispose part ${K}:`, Y);
      }
    }), Q.forEach((U, K) => {
      if (!C || !Object.values(C).includes(U))
        try {
          U.disconnect && typeof U.disconnect == "function" && U.disconnect(), U.dispose();
        } catch (Y) {
          console.warn(`[PLAYER] Failed to dispose synth ${K}:`, Y);
        }
    }), Q = [], T = [], console.log("[PLAYER] Audio cleanup completed"), console.log("[PLAYER] Converted tracks:", _.length), _.forEach((U) => {
      const {
        originalTrackIndex: K,
        voiceIndex: Y,
        totalVoices: re,
        trackInfo: se,
        synthConfig: $e,
        partEvents: we
      } = U, qe = (q[K] || {}).synthRef, ke = 60 / v.tempo, fe = (we || []).map((oe) => {
        const J = typeof oe.time == "number" ? oe.time * ke : oe.time, ue = typeof oe.duration == "number" ? oe.duration * ke : oe.duration;
        return { ...oe, time: J, duration: ue };
      });
      let Z = null;
      if (qe && C && C[qe])
        Z = C[qe];
      else {
        const oe = M[K] ? M[K].value : $e.type;
        try {
          if (oe.startsWith("AudioGraph: ")) {
            const J = oe.substring(12);
            if (C && C[J])
              Z = C[J], console.log(
                `[PLAYER] Using audioGraph instrument: ${J}`
              );
            else
              throw new Error(
                `AudioGraph instrument ${J} not found`
              );
          } else if (oe.startsWith("GM: ")) {
            const J = oe.substring(4), ue = w.find(
              (ge) => ge.name === J
            );
            if (ue) {
              console.log(`[PLAYER] Loading GM instrument: ${J}`);
              const ge = ot(
                ue.program,
                xr[0],
                [36, 84],
                "balanced"
              );
              console.log(
                `[PLAYER] Loading GM instrument ${J} with ${Object.keys(ge).length} samples`
              ), console.log(
                "[PLAYER] Sample notes:",
                Object.keys(ge).sort()
              ), Z = new x.Sampler({
                urls: ge,
                onload: () => console.log(
                  `[PLAYER] GM instrument ${J} loaded successfully`
                ),
                onerror: (Ae) => {
                  console.error(
                    `[PLAYER] Failed to load GM instrument ${J}:`,
                    Ae
                  );
                }
              }).toDestination();
            } else
              throw new Error(`GM instrument ${J} not found`);
          } else {
            const J = $e.reason === "glissando_compatibility" ? $e.type : oe;
            if (!x[J] || typeof x[J] != "function")
              throw new Error(`Tone.${J} is not a constructor`);
            Z = new x[J]().toDestination(), $e.reason === "glissando_compatibility" && Y === 0 && console.warn(
              `[MULTIVOICE] Using ${J} instead of ${$e.original} for glissando in ${se.label}`
            );
          }
        } catch (J) {
          console.warn(
            `Failed to create ${oe}, using PolySynth:`,
            J
          );
          try {
            if (!x.PolySynth || typeof x.PolySynth != "function")
              throw new Error("Tone.PolySynth is not available");
            Z = new x.PolySynth().toDestination();
          } catch (ue) {
            console.error(
              "Fatal: Cannot create any synth, Tone.js may not be properly loaded:",
              ue
            );
            return;
          }
        }
      }
      Q.push(Z), re > 1 && console.log(
        `[MULTIVOICE] Track "${se.label}" voice ${Y + 1}: ${we.length} notes`
      );
      const Se = new x.Part((oe, J) => {
        if (Array.isArray(J.pitch))
          J.pitch.forEach((ue) => {
            let ge = "C4";
            typeof ue == "number" ? ge = x.Frequency(ue, "midi").toNote() : typeof ue == "string" ? ge = ue : Array.isArray(ue) && typeof ue[0] == "string" && (ge = ue[0]), Z.triggerAttackRelease(ge, J.duration, oe);
          });
        else if (J.articulation === "glissando" && J.glissTarget !== void 0) {
          let ue = typeof J.pitch == "number" ? x.Frequency(J.pitch, "midi").toNote() : J.pitch, ge = typeof J.glissTarget == "number" ? x.Frequency(J.glissTarget, "midi").toNote() : J.glissTarget;
          console.log("[PLAYER] Glissando", {
            fromNote: ue,
            toNote: ge,
            duration: J.duration,
            time: oe
          }), console.log(
            "[PLAYER] Glissando effect starting from",
            ue,
            "to",
            ge
          ), Z.triggerAttack(ue, oe, J.velocity || 0.8);
          const Ae = x.Frequency(ue).toFrequency(), jr = x.Frequency(ge).toFrequency(), Ir = 1200 * Math.log2(jr / Ae);
          if (Z.detune && Z.detune.setValueAtTime && Z.detune.linearRampToValueAtTime)
            Z.detune.setValueAtTime(0, oe), Z.detune.linearRampToValueAtTime(
              Ir,
              oe + J.duration
            ), console.log(
              "[PLAYER] Applied detune glissando:",
              Ir,
              "cents over",
              J.duration,
              "beats"
            );
          else {
            const ki = x.Frequency(ue).toMidi(), xi = x.Frequency(ge).toMidi(), at = Math.max(3, Math.abs(xi - ki)), Or = J.duration / at;
            for (let ct = 1; ct < at; ct++) {
              const Ai = ct / (at - 1), Ni = Ae * Math.pow(jr / Ae, Ai), Ri = x.Frequency(Ni).toNote(), Ci = oe + ct * Or;
              Z.triggerAttackRelease(
                Ri,
                Or * 0.8,
                Ci,
                (J.velocity || 0.8) * 0.7
              );
            }
            console.log(
              "[PLAYER] Applied chromatic glissando with",
              at,
              "steps"
            );
          }
          Z.triggerRelease(oe + J.duration);
        } else {
          let ue = "C4";
          typeof J.pitch == "number" ? ue = x.Frequency(J.pitch, "midi").toNote() : typeof J.pitch == "string" ? ue = J.pitch : Array.isArray(J.pitch) && typeof J.pitch[0] == "string" && (ue = J.pitch[0]);
          let ge = J.duration, Ae = J.velocity || 0.8;
          J.articulation === "staccato" && (ge = J.duration * 0.5), J.articulation === "accent" && (Ae = Math.min(Ae * 2, 1)), J.articulation === "tenuto" && (ge = J.duration * 1.5, Ae = Math.min(Ae * 1.3, 1)), Z.triggerAttackRelease(
            ue,
            ge,
            oe,
            Ae
          );
        }
      }, fe);
      T.push(Se);
    }), x.Transport.loopEnd = S, x.Transport.loop = !0, x.Transport.stop(), x.Transport.position = 0, ne.textContent = le(S);
  };
  let ve = 0;
  const me = vr.UPDATE_INTERVAL, Oe = () => {
    const G = performance.now(), U = G - ve >= me;
    if (x && W) {
      const K = typeof x.Transport.loopEnd == "number" ? x.Transport.loopEnd : x.Time(x.Transport.loopEnd).toSeconds();
      if (U) {
        const Y = x.Transport.seconds % K, re = Y / K * 100;
        he.value = Math.min(re, 100), ye.textContent = le(Y), ne.textContent = le(K), ve = G;
      }
      if (x.Transport.state === "started" && W)
        requestAnimationFrame(Oe);
      else if (x.Transport.state === "stopped" || x.Transport.state === "paused") {
        if (U) {
          const Y = x.Transport.seconds % K, re = Y / K * 100;
          he.value = Math.min(re, 100), ye.textContent = le(Y), ve = G;
        }
        x.Transport.state === "stopped" && (x.Transport.seconds = 0, he.value = 0, ye.textContent = le(0), W = !1, k.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>');
      }
    }
  };
  k.addEventListener("click", async () => {
    if (!x)
      if (await Te())
        pe();
      else {
        console.error("[PLAYER] Failed to initialize Tone.js");
        return;
      }
    if (W)
      console.log("[PLAYER] Pausing playback..."), x.Transport.pause(), W = !1, k.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>', console.log("[PLAYER] Playback paused");
    else {
      if (!x.context || x.context.state !== "running")
        try {
          await x.start(), console.log(
            "[PLAYER] Audio context started:",
            x.context ? x.context.state : "unknown"
          ), x.context && typeof x.context.resume == "function" && (await x.context.resume(), console.log("[PLAYER] Audio context resumed for iOS compatibility"));
        } catch (G) {
          console.error("[PLAYER] Failed to start audio context:", G);
          let U = "Failed to start audio. ";
          X() ? U += "On iOS, please ensure your device isn't in silent mode and try again." : U += "Please check your audio settings and try again.", alert(U);
          return;
        }
      if (Q.length === 0 && (console.log("[PLAYER] No synths found, setting up audio..."), pe()), x.Transport.state !== "paused" ? (x.Transport.stop(), x.Transport.position = 0, console.log("[PLAYER] Starting from beginning")) : console.log("[PLAYER] Resuming from paused position"), console.log(
        "[PLAYER] Transport state before start:",
        x.Transport.state
      ), console.log(
        "[PLAYER] Transport position reset to:",
        x.Transport.position
      ), console.log(
        "[PLAYER] Audio context state:",
        x.context ? x.context.state : "unknown"
      ), console.log("[PLAYER] Parts count:", T.length), console.log("[PLAYER] Synths count:", Q.length), C) {
        const G = Object.values(C).filter(
          (U) => U && U.name === "Sampler"
        );
        if (G.length > 0 && A.length > 0) {
          console.log(
            `[PLAYER] Waiting for ${G.length} sampler(s) to load...`
          );
          try {
            await Promise.all(A), console.log("[PLAYER] All samplers loaded.");
          } catch (U) {
            console.warn("[PLAYER] Sampler load wait error:", U);
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
      x.Transport.state !== "paused" && T.forEach((G, U) => {
        if (!G || typeof G.start != "function") {
          console.error(`[PLAYER] Part ${U} is invalid:`, G);
          return;
        }
        try {
          G.start(0);
        } catch (K) {
          console.error(`[PLAYER] Failed to start part ${U}:`, K);
        }
      }), x.Transport.start(), W = !0, k.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-pause"><circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/></svg>', Oe();
    }
  }), I.addEventListener("click", async () => {
    x && (console.log("[PLAYER] Stopping playback completely..."), x.Transport.stop(), x.Transport.cancel(), x.Transport.position = 0, T.forEach((G, U) => {
      try {
        G.stop();
      } catch (K) {
        console.warn(
          `[PLAYER] Failed to stop part ${U} during complete stop:`,
          K
        );
      }
    }), W = !1, he.value = 0, ye.textContent = le(0), k.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>', console.log("[PLAYER] Playback stopped completely"));
  }), he.addEventListener("input", () => {
    if (x && S > 0) {
      const G = he.value / 100 * S, U = W;
      U && x.Transport.pause(), x.Transport.seconds = G, ye.textContent = le(G), U && setTimeout(() => {
        x.Transport.start();
      }, 50);
    }
  }), V.addEventListener("change", () => {
    const G = parseInt(V.value);
    x && G >= 60 && G <= 240 ? (console.log(`[PLAYER] Tempo changed to ${G} BPM`), x.Transport.bpm.value = G, console.log(`[PLAYER] Tempo changed to ${G} BPM`)) : V.value = x ? x.Transport.bpm.value : u;
  }), M.forEach((G) => {
    G.addEventListener("change", () => {
      if (x && Q.length > 0) {
        console.log(
          "[PLAYER] Synthesizer selection changed, reinitializing audio..."
        );
        const U = W;
        W && (x.Transport.stop(), W = !1), pe(), U ? setTimeout(() => {
          x.Transport.start(), W = !0, k.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-pause"><circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/></svg>';
        }, 100) : k.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>';
      }
    });
  });
  const Pe = () => {
    console.log("MIDI download - requires MIDI converter implementation");
  }, Ke = () => {
    console.log("WAV download - requires WAV generator implementation");
  };
  R.addEventListener("click", Pe), F.addEventListener("click", Ke), H.addEventListener("click", Pe), ce.addEventListener("click", Ke);
  const Je = typeof window < "u" && window.Tone || (typeof x < "u" ? x : null);
  if (Je && Te().then(() => {
    pe(), t && setTimeout(() => {
      k.click();
    }, 500);
  }), t && !Je) {
    const G = setInterval(() => {
      (typeof window < "u" && window.Tone || (typeof x < "u" ? x : null)) && (clearInterval(G), setTimeout(() => {
        k.click();
      }, 500));
    }, 100);
    setTimeout(() => {
      clearInterval(G);
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
      const r = e.split(":").map(parseFloat), n = r[0] || 0, i = r[1] || 0, s = r[2] || 0, a = 60 / t, c = a * 4, u = a / 480;
      return n * c + i * a + s * u;
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
`, r += `L:1/4
`, r += `Q:1/4=${e.tempo || e.bpm || 120}
`, r += `K:${e.keySignature || "C"}
`;
    const i = e.timeSignature || "4/4", [s, a] = i.split("/").map(Number), c = s * (4 / a), u = t.measuresPerLine || 4, d = t.lineBreaks || [], y = t.renderMode || "merged", _ = t.trackIndex || 0, v = !!t.hideRests, S = t.showArticulations !== !1, m = Array.isArray(e.tracks) ? e.tracks : Object.values(e.tracks || {});
    if (m.length === 0) return r;
    const h = (() => {
      let l = 0;
      return m.forEach((f) => {
        const g = f.notes || f;
        Array.isArray(g) && g.forEach(($) => {
          const w = typeof $.time == "number" ? $.time : 0, P = typeof $.duration == "number" ? $.duration : 1, M = w + P;
          M > l && (l = M);
        });
      }), l;
    })(), p = Math.max(
      1,
      Math.ceil(h / c)
    );
    if (y === "tracks" && m.length > 1)
      r += "%%score {", m.forEach((l, f) => {
        f > 0 && (r += " | "), r += `${f + 1}`;
      }), r += `}
`, m.forEach((l, f) => {
        const g = l.notes || l;
        if (g.length === 0) return;
        const $ = f + 1, w = l.label || `Track ${f + 1}`, P = w.length > 12 ? w.substring(0, 10) + ".." : w, M = l.instrument ? ` [${l.instrument}]` : "";
        r += `V:${$} name="${w}${M}" snm="${P}"
`;
        const j = g.filter((D) => D.pitch !== void 0).sort((D, V) => (D.time || 0) - (V.time || 0)), { abcNotesStr: L } = this.convertNotesToAbc(
          j,
          c,
          u,
          d,
          { hideRests: v, showArticulations: S, padMeasures: p }
        );
        L.trim() && (r += L + `
`);
      });
    else if (y === "drums") {
      r += `V:1 clef=perc name="Drum Set" snm="Drums"
`;
      const l = t.percussionMap || {
        kick: "C,,",
        snare: "D,",
        hat: "F",
        "hi-hat": "F",
        hihat: "F"
      }, f = (P) => {
        const M = (P || "").toLowerCase();
        for (const j of Object.keys(l))
          if (M.includes(j)) return l[j];
        return "E";
      }, g = [];
      m.forEach((P) => {
        const M = P.notes || P, j = P.label || "", L = f(j);
        (M || []).forEach((D) => {
          D.pitch !== void 0 && g.push({
            time: typeof D.time == "number" ? D.time : 0,
            duration: typeof D.duration == "number" ? D.duration : 1,
            // Use mapped ABC pitch string directly in converter
            pitch: L,
            articulation: D.articulation
          });
        });
      });
      const $ = g.sort((P, M) => (P.time || 0) - (M.time || 0)), { abcNotesStr: w } = this.convertNotesToAbc(
        $,
        c,
        u,
        d,
        { hideRests: v, showArticulations: S, padMeasures: p }
      );
      w.trim() && (r += w + `
`);
    } else if (y === "single") {
      const l = m[_];
      if (l) {
        const g = (l.notes || l).filter((w) => w.pitch !== void 0).sort((w, P) => (w.time || 0) - (P.time || 0)), { abcNotesStr: $ } = this.convertNotesToAbc(
          g,
          c,
          u,
          d,
          { hideRests: v, showArticulations: S, padMeasures: p }
        );
        $.trim() && (r += $ + `
`);
      }
    } else {
      const l = [];
      m.forEach(($) => {
        ($.notes || $).forEach((P) => {
          P.pitch !== void 0 && l.push(P);
        });
      });
      const f = l.sort(
        ($, w) => ($.time || 0) - (w.time || 0)
      ), { abcNotesStr: g } = this.convertNotesToAbc(
        f,
        c,
        u,
        d,
        { hideRests: v, showArticulations: S, padMeasures: p }
      );
      g.trim() && (r += g + `
`);
    }
    return r;
  }
  /**
   * Convert notes to ABC notation string
   */
  static convertNotesToAbc(e, t, r, n, i = {}) {
    let s = "", a = 0, c = 0, u = 0, d = 0;
    const y = i?.quantizeBeats || 0.25, _ = 1e-6, v = (g) => Nr(g, y, "nearest"), S = (g) => Ti(g, y), m = (g) => {
      s += g + " ";
    }, h = () => {
      for (; a >= t - _; )
        m("|"), a -= t, c++, u++, (n.includes(c) || u >= r) && (s += `
`, u = 0);
    }, p = (g, { forceVisible: $ = !1 } = {}) => {
      let w = g;
      for (; w > _; ) {
        const P = v(t - a), M = v(Math.min(w, P));
        if (M > _) {
          let j = i.hideRests && !$ ? "x" : "z";
          j += S(M), m(j), a = v(a + M), w = v(w - M);
        }
        h();
      }
    };
    for (const g of e) {
      const $ = typeof g.time == "number" ? v(g.time) : 0, w = typeof g.duration == "number" ? v(g.duration) : 1, P = v($ - d);
      P > _ && p(P);
      let M = "z";
      if (Array.isArray(g.pitch)) {
        const D = (V) => {
          const z = [
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
          ], H = Math.floor(V / 12) - 1, ce = V % 12;
          let de = z[ce].replace("#", "^");
          return H >= 4 ? (de = de.toLowerCase(), H > 4 && (de += "'".repeat(H - 4))) : H < 4 && (de = de.toUpperCase(), H < 3 && (de += ",".repeat(3 - H))), de;
        };
        M = "[" + g.pitch.map(D).join("") + "]";
      } else if (typeof g.pitch == "number") {
        const D = g.pitch, V = [
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
        ], z = Math.floor(D / 12) - 1, H = D % 12;
        M = V[H].replace("#", "^"), z >= 4 ? (M = M.toLowerCase(), z > 4 && (M += "'".repeat(z - 4))) : z < 4 && (M = M.toUpperCase(), z < 3 && (M += ",".repeat(3 - z)));
      } else typeof g.pitch == "string" ? M = g.pitch : g.pitch === null && (M = i.hideRests ? "x" : "z");
      let j = w, L = !0;
      for (; j > _; ) {
        const D = v(t - a), V = v(Math.min(j, D));
        if (V > _) {
          let z = M;
          z += S(V), L && i.showArticulations && (g.articulation === "staccato" && (z += "."), g.articulation === "accent" && (z += ">"), g.articulation === "tenuto" && (z += "-"), g.articulation === "marcato" && (z += "^")), j > V + _ && (z += "-"), m(z), a = v(a + V), j = v(j - V), L = !1;
        }
        h();
      }
      d = v($ + w);
    }
    const l = i.padMeasures || 0;
    for (; c < l; ) {
      const g = v(t - a);
      g > _ && p(g, { forceVisible: !0 }), m("|"), a = 0, c++;
    }
    const f = s.trim();
    return f && !f.endsWith("|") && (s += "|"), { abcNotesStr: s };
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
    } catch (u) {
      throw new Error(`Failed to parse MIDI file: ${u.message}`);
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
      const a = this.generateTrackName(s, i, r), c = this.isDrumTrack(s), u = s.notes.map(
        (_) => this.convertNote(_, t, s)
      ), d = this.options.quantize ? this.quantizeNotes(u, this.options.quantize) : u, y = {
        label: a,
        notes: d
      };
      if (s.channel !== void 0 && (y.midiChannel = s.channel), s.instrument && (y.synth = {
        type: c ? "Sampler" : "PolySynth",
        options: this.getInstrumentOptions(s.instrument, c)
      }), this.options.includeModulations && s.controlChanges) {
        const _ = this.extractModulations(s.controlChanges);
        _.length > 0 && this.applyModulationsToTrack(y, _);
      }
      n.push(y), i++;
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
    autoload: u = !0
  } = e, d = Mi(o, s), y = document.createElement("div");
  y.style.cssText = `
		margin: 15px 0;
		font-family: sans-serif;
	`;
  const _ = document.createElement("div");
  if (_.id = `rendered-score-${Date.now()}`, _.style.cssText = `
		width: 100%;
		overflow-x: auto;
		margin: 10px 0;
	`, y.appendChild(_), n) {
    const S = document.createElement("details");
    S.style.marginTop = "15px";
    const m = document.createElement("summary");
    m.textContent = "ABC Notation (click to expand)", m.style.cursor = "pointer", S.appendChild(m);
    const h = document.createElement("pre");
    h.textContent = d, h.style.cssText = `
			background: #f5f5f5;
			padding: 10px;
			border-radius: 4px;
			overflow-x: auto;
			font-size: 12px;
		`, S.appendChild(h), y.appendChild(S);
  }
  let v = a || c || typeof window < "u" && window.ABCJS || (typeof ABCJS < "u" ? ABCJS : null);
  if (!v && u)
    try {
      if (typeof require < "u")
        console.log("[SCORE] Loading ABCJS via require()..."), v = await require("abcjs");
      else {
        console.log("[SCORE] Loading ABCJS via import()...");
        const S = await import("https://cdn.skypack.dev/abcjs");
        v = S.default || S;
      }
      if (!v || !v.renderAbc) {
        console.warn(
          "[SCORE] First load attempt failed, trying alternative CDN..."
        );
        try {
          const S = await import("https://cdn.jsdelivr.net/npm/abcjs@6.4.0/dist/abcjs-basic-min.js");
          if (v = S.default || S.ABCJS || typeof window < "u" && window.ABCJS, !v || !v.renderAbc)
            throw new Error("Alternative CDN also failed");
        } catch (S) {
          console.warn("[SCORE] Could not auto-load ABCJS:", S.message), v = null;
        }
      }
      v && (console.log(
        "[SCORE] ABCJS loaded successfully, version:",
        v.version || "unknown"
      ), typeof window < "u" && (window.ABCJS = v));
    } catch (S) {
      console.warn("[SCORE] Could not auto-load ABCJS:", S.message), console.log("[SCORE] To use score rendering, load ABCJS manually first:"), console.log('Method 1: ABCJS = await require("abcjs")'), console.log(
        'Method 2: ABCJS = await import("https://cdn.skypack.dev/abcjs").then(m => m.default)'
      ), v = null;
    }
  if (v && v.renderAbc)
    try {
      const S = r || null, m = { responsive: i, scale: t };
      S && (m.staffwidth = S), v.renderAbc(_, d, m), setTimeout(() => {
        if (_.children.length === 0 || _.innerHTML.trim() === "")
          try {
            v.renderAbc(_, d), _.children.length === 0 && (_.innerHTML = '<p style="color: red;">ABCJS rendering failed - no content generated</p><pre>' + d + "</pre>");
          } catch {
            _.innerHTML = "<p>Error with alternative rendering</p><pre>" + d + "</pre>";
          }
      }, 200);
    } catch (S) {
      console.error("[SCORE] Error rendering with ABCJS:", S), _.innerHTML = "<p>Error rendering notation</p><pre>" + d + "</pre>";
    }
  else {
    const S = u ? "ABCJS not available and auto-loading failed - showing text notation only" : "ABCJS not provided and auto-loading disabled - showing text notation only";
    _.innerHTML = `<p>${S}</p><pre>` + d + "</pre>", !v && u && (console.log("[SCORE] To use visual score rendering, try:"), console.log(
      'ABCJS = await require("abcjs"), then jm.score(composition, { ABCJS })'
    ));
  }
  return y;
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
