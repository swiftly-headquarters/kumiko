import type { PropRow } from "@/lib/docs/types"

export function PropsTable({ rows }: { rows: PropRow[] }) {
  if (rows.length === 0)
    return <p className="text-sm text-muted-foreground">No custom props.</p>
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/50 text-muted-foreground">
          <tr>
            {["Prop", "Type", "Default", "Description"].map((h) => (
              <th key={h} className="px-3 py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.prop} className="border-t align-top">
              <td className="px-3 py-2 font-mono text-xs">{r.prop}</td>
              <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                {r.type}
              </td>
              <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                {r.default}
              </td>
              <td className="px-3 py-2">{r.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
