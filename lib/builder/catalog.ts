import { readFileSync } from "node:fs"
import path from "node:path"
import ts from "typescript"

import { components, groups } from "@/lib/docs/components"
import { listExamples, readProps } from "@/lib/docs/source"
import { CHARTS, ICONS, UI, type Node } from "./tree"

export type Field = {
  name: string
  kind: "select" | "boolean" | "number" | "text" | "json"
  options?: string[] // raw tokens: "\"sm\"", "true", "2"
  def?: string
  description?: string
}
export type Part = { name: string; fields: Field[] }
export type Preset = { title: string; nodes: Node[] }
export type Entry = {
  slug: string
  title: string
  group: string
  description: string
  parts: Part[]
  presets: string[]
}
export type Catalog = { groups: { id: string; title: string }[]; entries: Entry[] }

const root = process.cwd()

function exportsOf(slug: string): string[] {
  const src = readFileSync(path.join(root, "components/ui", `${slug}.tsx`), "utf8")
  const names = new Set<string>()
  for (const [, list] of src.matchAll(/^export\s*\{([^}]*)\}/gm))
    for (const raw of list.split(",")) {
      const item = raw.trim()
      if (!item || item.startsWith("type ")) continue
      names.add(item.split(/\s+as\s+/).pop()!.trim())
    }
  for (const [, name] of src.matchAll(/^export (?:function|const) (\w+)/gm))
    names.add(name)
  return [...names].filter((n) => /^[A-Z]/.test(n) && !/(Context|Variants)$/.test(n))
}

const pascal = (slug: string) =>
  slug.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase())

// Turns a docs type string into an inspector input. Function and element
// types are skipped: they cannot be edited as values.
function toField(name: string, type: string, def: string, description: string): Field | null {
  const t = type.trim()
  if (/=>|ReactElement|\bRef\b|Function|\bEvent\b/.test(t)) return null
  const base = { name, description, def: def === "-" ? undefined : def }
  if (t === "boolean") return { ...base, kind: "boolean" }
  if (t === "number") return { ...base, kind: "number" }
  const tokens = t.split("|").map((s) => s.trim())
  if (tokens.length > 1 && tokens.every((s) => /^(".*"|true|false|boolean|-?\d[\d.]*)$/.test(s)))
    return {
      ...base,
      kind: "select",
      options: tokens.flatMap((s) => (s === "boolean" ? ["true", "false"] : [s])),
    }
  if (/^(string|ReactNode|string \| ReactNode|ReactNode \| string)$/.test(t))
    return { ...base, kind: "text" }
  return { ...base, kind: "json" }
}

function partsOf(slug: string): Part[] {
  const names = exportsOf(slug)
  const primary = names.includes(pascal(slug)) ? pascal(slug) : names[0]
  const fields = new Map(names.map((n) => [n, [] as Field[]]))
  for (const row of readProps(slug)) {
    const words = row.prop.trim().split(/\s+/)
    // "CardAction" alone documents a part, not a prop.
    if (words.length === 1 && /^[A-Z]/.test(words[0])) continue
    const [part, prop] = words.length === 2 ? words : [primary, words[0]]
    if (!/^[a-zA-Z][\w-]*$/.test(prop)) continue
    const f = toField(prop, row.type, row.default, row.description)
    if (f && fields.has(part)) fields.get(part)!.push(f)
  }
  return names.map((name) => ({ name, fields: fields.get(name)! }))
}

// A tiny evaluator for the literal subset demos use: strings, numbers, arrays,
// objects, consts, destructured defaults, template strings and `.map(x => <X/>)`.
// Anything else (state, handlers, local components) is dropped.
// ponytail: best-effort, demos needing state come in without it.
const NO = Symbol("unsupported")
type Env = Map<string, () => unknown>
type Ctx = { imports: Map<string, { m: string; n: string }> }

const KNOWN = (m: string) => m.startsWith(UI) || m === ICONS || m === CHARTS

function bind(env: Env, name: ts.BindingName, value: () => unknown) {
  if (ts.isIdentifier(name)) env.set(name.text, value)
  else if (ts.isObjectBindingPattern(name))
    for (const el of name.elements) {
      const key = el.propertyName && ts.isIdentifier(el.propertyName) ? el.propertyName.text : ts.isIdentifier(el.name) ? el.name.text : null
      if (!key) continue
      bind(env, el.name, () => {
        const obj = value() as Record<string, unknown> | undefined
        const v = obj && typeof obj === "object" ? obj[key] : undefined
        return v === undefined && el.initializer ? evaluate(el.initializer, env, null) : v
      })
    }
}

function evaluate(e: ts.Expression, env: Env, ctx: Ctx | null): unknown {
  if (ts.isParenthesizedExpression(e) || ts.isAsExpression(e) || ts.isSatisfiesExpression(e) || ts.isNonNullExpression(e))
    return evaluate(e.expression, env, ctx)
  if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) return e.text
  if (ts.isNumericLiteral(e)) return Number(e.text)
  if (e.kind === ts.SyntaxKind.TrueKeyword) return true
  if (e.kind === ts.SyntaxKind.FalseKeyword) return false
  if (e.kind === ts.SyntaxKind.NullKeyword) return null
  if (ts.isPrefixUnaryExpression(e) && e.operator === ts.SyntaxKind.MinusToken) {
    const v = evaluate(e.operand, env, ctx)
    return typeof v === "number" ? -v : NO
  }
  if (ts.isTemplateExpression(e)) {
    let s = e.head.text
    for (const span of e.templateSpans) {
      const v = evaluate(span.expression, env, ctx)
      if (v === NO || typeof v === "object") return NO
      s += String(v) + span.literal.text
    }
    return s
  }
  if (ts.isIdentifier(e)) {
    if (e.text === "undefined") return undefined
    const get = env.get(e.text)
    return get ? get() : NO
  }
  if (ts.isPropertyAccessExpression(e)) {
    const obj = evaluate(e.expression, env, ctx)
    if (obj === NO || obj === null || typeof obj !== "object") return NO
    return (obj as Record<string, unknown>)[e.name.text]
  }
  if (ts.isElementAccessExpression(e)) {
    const obj = evaluate(e.expression, env, ctx)
    const key = evaluate(e.argumentExpression, env, ctx)
    if (obj === NO || !obj || typeof obj !== "object" || (typeof key !== "string" && typeof key !== "number")) return NO
    return (obj as Record<string, unknown>)[key]
  }
  if (ts.isArrayLiteralExpression(e)) {
    const out: unknown[] = []
    for (const el of e.elements) {
      if (ts.isSpreadElement(el)) return NO
      const v = evaluate(el, env, ctx)
      if (v === NO) return NO
      out.push(v)
    }
    return out
  }
  if (ts.isObjectLiteralExpression(e)) {
    const out: Record<string, unknown> = {}
    for (const p of e.properties) {
      let key: string | undefined
      let v: unknown = NO
      if (ts.isPropertyAssignment(p)) {
        key = ts.isIdentifier(p.name) || ts.isStringLiteral(p.name) || ts.isNumericLiteral(p.name) ? p.name.text : undefined
        v = evaluate(p.initializer, env, ctx)
      } else if (ts.isShorthandPropertyAssignment(p)) {
        key = p.name.text
        v = evaluate(p.name, env, ctx)
      }
      if (key !== undefined && v !== NO && typeof v !== "function") out[key] = v
    }
    return out
  }
  if (ts.isConditionalExpression(e)) {
    const c = evaluate(e.condition, env, ctx)
    return c === NO ? NO : evaluate(c ? e.whenTrue : e.whenFalse, env, ctx)
  }
  if (ts.isBinaryExpression(e)) {
    const l = evaluate(e.left, env, ctx)
    if (l === NO) return NO
    switch (e.operatorToken.kind) {
      case ts.SyntaxKind.AmpersandAmpersandToken:
        return l ? evaluate(e.right, env, ctx) : l
      case ts.SyntaxKind.BarBarToken:
        return l ? l : evaluate(e.right, env, ctx)
      case ts.SyntaxKind.QuestionQuestionToken:
        return l ?? evaluate(e.right, env, ctx)
      case ts.SyntaxKind.PlusToken: {
        const r = evaluate(e.right, env, ctx)
        return r === NO || typeof r === "object" || typeof l === "object" ? NO : (l as string) + (r as string)
      }
    }
    return NO
  }
  if (
    ts.isCallExpression(e) &&
    ts.isPropertyAccessExpression(e.expression) &&
    e.expression.name.text === "map" &&
    e.arguments.length === 1 &&
    (ts.isArrowFunction(e.arguments[0]) || ts.isFunctionExpression(e.arguments[0]))
  ) {
    const arr = evaluate(e.expression.expression, env, ctx)
    const fn = e.arguments[0]
    if (!Array.isArray(arr)) return NO
    const body = ts.isBlock(fn.body)
      ? fn.body.statements.find(ts.isReturnStatement)?.expression
      : fn.body
    if (!body) return NO
    return arr.map((item, i) => {
      const inner: Env = new Map(env)
      if (fn.parameters[0]) bind(inner, fn.parameters[0].name, () => item)
      if (fn.parameters[1]) bind(inner, fn.parameters[1].name, () => i)
      return evaluate(body, inner, ctx)
    })
  }
  if (ctx && (ts.isJsxElement(e) || ts.isJsxSelfClosingElement(e) || ts.isJsxFragment(e))) {
    const nodes = jsxNodes(e, env, ctx)
    return nodes.length === 1 && nodes[0].t === undefined ? { $jsx: nodes[0] } : nodes.length ? nodes : NO
  }
  return NO
}

function valueNodes(v: unknown): Node[] {
  if (v === NO || v === null || v === undefined || typeof v === "boolean") return []
  if (typeof v === "string" || typeof v === "number") return [{ id: "", t: String(v) }]
  if (Array.isArray(v)) return v.flatMap(valueNodes)
  if (typeof v === "object" && v && "$jsx" in v) return [(v as { $jsx: Node }).$jsx]
  if (typeof v === "object" && v && "id" in v) return [v as Node]
  return []
}

// JSX whitespace rule: text spanning lines is trimmed per line and joined.
function jsxText(raw: string) {
  if (!raw.includes("\n")) return raw
  return raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .join(" ")
}

function jsxNodes(e: ts.Node, env: Env, ctx: Ctx): Node[] {
  if (ts.isJsxFragment(e)) return children(e.children, env, ctx)
  if (!ts.isJsxElement(e) && !ts.isJsxSelfClosingElement(e)) return []
  const open = ts.isJsxElement(e) ? e.openingElement : e
  if (!ts.isIdentifier(open.tagName)) return []
  const tag = open.tagName.text
  let node: Node
  if (/^[a-z]/.test(tag)) node = { id: "", n: tag }
  else {
    const imp = ctx.imports.get(tag)
    if (!imp || !KNOWN(imp.m)) return [] // local helper component
    node = { id: "", m: imp.m, n: imp.n }
  }
  const p: Record<string, unknown> = {}
  for (const a of open.attributes.properties) {
    if (ts.isJsxSpreadAttribute(a)) {
      const v = evaluate(a.expression, env, ctx)
      if (v && typeof v === "object" && !Array.isArray(v)) Object.assign(p, v)
      continue
    }
    const key = a.name.getText()
    if (key === "key" || key === "ref") continue
    let v: unknown = true
    if (a.initializer) {
      if (ts.isStringLiteral(a.initializer)) v = a.initializer.text
      else if (ts.isJsxExpression(a.initializer) && a.initializer.expression)
        v = evaluate(a.initializer.expression, env, ctx)
      else v = NO
    }
    if (v === NO || v === undefined || (Array.isArray(v) && v.includes(NO))) continue
    p[key] = v
  }
  if (Object.keys(p).length) node.p = p
  if (ts.isJsxElement(e)) {
    const kids = children(e.children, env, ctx)
    if (kids.length) node.c = kids
  }
  return [node]
}

function children(list: ts.NodeArray<ts.JsxChild>, env: Env, ctx: Ctx): Node[] {
  const out: Node[] = []
  for (const k of list) {
    if (ts.isJsxText(k)) {
      if (k.containsOnlyTriviaWhiteSpaces) continue
      const t = jsxText(k.text)
      if (t) out.push({ id: "", t })
    } else if (ts.isJsxExpression(k)) {
      if (k.expression) out.push(...valueNodes(evaluate(k.expression, env, ctx)))
    } else out.push(...jsxNodes(k, env, ctx))
  }
  return out
}

function parseDemo(file: string): Node[] {
  const src = readFileSync(file, "utf8")
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const ctx: Ctx = { imports: new Map() }
  const env: Env = new Map()
  let demo: ts.FunctionDeclaration | undefined
  const consts = (stmts: readonly ts.Statement[]) => {
    for (const s of stmts)
      if (ts.isVariableStatement(s))
        for (const d of s.declarationList.declarations)
          if (d.initializer) {
            const init = d.initializer
            let memo: unknown = NO
            let done = false
            bind(env, d.name, () => (done ? memo : ((done = true), (memo = evaluate(init, env, ctx)))))
          }
  }
  for (const s of sf.statements) {
    if (ts.isImportDeclaration(s) && ts.isStringLiteral(s.moduleSpecifier)) {
      const named = s.importClause?.namedBindings
      if (named && ts.isNamedImports(named))
        for (const el of named.elements)
          ctx.imports.set(el.name.text, {
            m: s.moduleSpecifier.text,
            n: (el.propertyName ?? el.name).text,
          })
    } else if (
      ts.isFunctionDeclaration(s) &&
      s.modifiers?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword)
    )
      demo = s
  }
  consts(sf.statements)
  if (!demo?.body) return []
  for (const p of demo.parameters)
    if (ts.isObjectBindingPattern(p.name)) bind(env, p.name, () => ({}))
  consts(demo.body.statements)
  const ret = demo.body.statements.findLast(ts.isReturnStatement)?.expression
  if (!ret) return []
  let e: ts.Expression = ret
  while (ts.isParenthesizedExpression(e)) e = e.expression
  return jsxNodes(e, env, ctx)
}

const presetsOf = (slug: string): Preset[] =>
  listExamples(slug)
    .map((ex) => ({
      title: ex.title,
      nodes: parseDemo(path.join(root, "docs/demos", slug, `${ex.demo}.tsx`)),
    }))
    .filter((p) => p.nodes.length > 0)

const presetCache = new Map<string, Preset[]>()

export function getPresets(slug: string): Preset[] | undefined {
  if (!components.some((c) => c.slug === slug)) return undefined
  if (!presetCache.has(slug)) presetCache.set(slug, presetsOf(slug))
  return presetCache.get(slug)
}

let cached: Catalog | undefined

export function getCatalog(): Catalog {
  if (cached) return cached
  const entries = components.map((c) => ({
    slug: c.slug,
    title: c.title,
    group: c.group,
    description: c.description,
    parts: partsOf(c.slug),
    presets: getPresets(c.slug)!.map((p) => p.title),
  }))
  cached = { groups, entries }
  return cached
}
