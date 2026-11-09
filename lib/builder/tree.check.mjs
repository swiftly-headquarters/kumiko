// Self-check for lib/builder/tree.ts. Run: node lib/builder/tree.check.mjs
import assert from "node:assert/strict"

import * as t from "./tree.ts"

const page = t.clone({
  id: "",
  n: "div",
  p: { className: "flex flex-col gap-4" },
  c: [
    {
      id: "",
      m: "@/components/ui/card",
      n: "Card",
      c: [
        { id: "", m: "@/components/ui/card", n: "CardTitle", c: [{ id: "", t: "Hello {you}" }] },
        {
          id: "",
          m: "@/components/ui/dialog",
          n: "DialogTrigger",
          p: { render: { $jsx: { id: "", m: "@/components/ui/button", n: "Button", p: { variant: "outline" } } } },
          c: [{ id: "", t: "Open" }],
        },
      ],
    },
    { id: "", m: "lucide-react", n: "StarIcon", p: { "aria-hidden": true } },
  ],
})
const [card, star] = page.c

// move: into own subtree is refused; reorder within a parent adjusts the index.
assert.equal(t.move(page, page.id, card.id, 0), page)
assert.equal(t.move(page, card.id, card.c[0].id, 0), page)
const moved = t.move(page, card.id, page.id, 2)
assert.deepEqual(moved.c.map((k) => k.id), [star.id, card.id])

// duplicate gives fresh ids, remove drops the node.
const [dup, copyId] = t.duplicate(page, star.id)
assert.equal(dup.c.length, 3)
assert.notEqual(copyId, star.id)
assert.equal(t.remove(dup, copyId).c.length, 2)

assert.equal(t.canHold(card), true)
assert.equal(t.canHold(star), false)
assert.equal(t.canHold({ id: "", n: "img" }), false)
// nests: text-bearing nodes take new items beside them
assert.equal(t.nests(card), true)
assert.equal(t.nests({ id: "", n: "Button", m: "@/components/ui/button", c: [{ id: "", t: "Go" }] }), false)

// install args include components inside JSX props, sorted and unique.
assert.deepEqual(t.slugs(page), ["button", "card", "dialog"])

// code: imports grouped, packages first, text escaped, JSX props inlined.
const code = t.toCode(page)
assert.match(code, /^import \{ StarIcon \} from "lucide-react"\nimport \{ Button \} from "@\/components\/ui\/button"/)
assert.match(code, /import \{ Card, CardTitle \} from "@\/components\/ui\/card"/)
assert.match(code, /<CardTitle>\{"Hello \{you\}"\}<\/CardTitle>/)
assert.match(code, /<DialogTrigger render=\{<Button variant="outline" \/>\}>\n\s+Open\n\s+<\/DialogTrigger>/)
assert.match(code, /<StarIcon aria-hidden \/>/)

assert.equal(t.isSafeProp("onClick"), false)
assert.equal(t.isSafeProp("dangerouslySetInnerHTML"), false)
assert.equal(t.isSafeProp("className"), true)
assert.equal(t.isSafeTag("SCRIPT"), false)
assert.equal(t.isSafeTag("animate"), false)
assert.equal(t.isSafeTag("x-widget"), false)
assert.equal(t.isSafeTag("section"), true)
assert.equal(t.isSafeProp("formAction"), false)
assert.equal(t.isSafeValue(" java\tscript:alert(1)"), false)
assert.equal(t.isSafeValue("VBScript:x"), false)
assert.equal(t.isSafeValue("https://example.com"), true)
assert.equal(t.isSafeValue(42), true)
assert.equal(t.isSafeValue("data:text/html,x", "href"), false)
assert.equal(t.isSafeValue("data:text/html,x", "alt"), true)
assert.equal(t.isSafeValue("https://a.b/c?d=e:f", "href"), true)
assert.equal(t.isSafeValue("/docs#x:y", "href"), true)
assert.equal(t.isSafeValue("mailto:a@b.c", "href"), true)
assert.equal(t.isPlainProp("className"), true)
assert.equal(t.isPlainProp("aria-label"), true)
assert.equal(t.isPlainProp("dangerouslySetInnerHTML"), false)
assert.equal(t.isPlainProp("formAction"), false)
assert.equal(t.isSafeModule("@/components/ui/../../app"), false)
assert.equal(t.isSafeModule("@/components/ui/card"), true)

// URL round trip keeps structure, regenerates ids; garbage decodes to null.
const back = await t.decode(await t.encode(page))
assert.equal(t.toCode(back), code)
assert.notEqual(back.id, page.id)
assert.equal(await t.decode("not-a-design"), null)

// decode rejects injection through module, name, tag and prop key
const bad = async (n) => t.decode(await t.encode({ id: "", n: "div", c: [n] }))
assert.equal(await bad({ id: "", m: "@/components/ui/card", n: "Card" }) !== null, true)
assert.equal(await bad({ id: "", m: "@/components/ui/x.json https://evil/x", n: "Card" }), null)
assert.equal(await bad({ id: "", m: "@/components/ui/card", n: "Card} from 'x'; evil(); //" }), null)
assert.equal(await bad({ id: "", n: "svg" }), null)
assert.equal(await bad({ id: "", n: "div", p: { "a b=1 onClick": "x" } }), null)
assert.equal(
  await bad({ id: "", n: "div", p: { render: { $jsx: { id: "", m: "evil", n: "X" } } } }),
  null
)

// read tells a cut-short link from a rejected design
assert.deepEqual(await t.read("not-a-design"), { error: "broken" })
assert.deepEqual(await t.read(await t.encode({ id: "", n: "svg" })), { error: "unsafe" })
assert.ok("tree" in (await t.read(await t.encode(page))))

// strict parts take new things beside them, not inside
const tabs = { id: "", m: "@/components/ui/tabs", n: "TabsList" }
assert.equal(t.nests(tabs), false)
assert.equal(t.nests({ ...tabs, n: "Tabs" }), true)
assert.equal(t.nests({ id: "", n: "div" }), true)

console.log("tree ok")
