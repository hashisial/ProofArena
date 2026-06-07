import { Card } from "../ui/Card.jsx";

export function AdminTable({ caption, columns = [], items = [] }) {
  return (
    <>
      <Card className="hidden overflow-x-auto md:block" padding="none" variant="bordered">
        <table className="w-full min-w-[62rem] border-collapse text-left">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-[#F8F4FF] text-xs font-black uppercase tracking-[0.12em] text-[#6F657C]">
            <tr>
              {columns.map((column) => (
                <th className="px-5 py-4" key={column.key} scope="col">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9E2F3]">
            {items.map((item) => (
              <tr className="align-top" key={item.id}>
                {columns.map((column) => (
                  <td className="max-w-sm px-5 py-5 text-sm text-[#6F657C]" key={column.key}>
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="grid gap-4 md:hidden">
        {items.map((item) => (
          <Card key={item.id} variant="bordered">
            <dl className="grid gap-4">
              {columns.map((column) => (
                <div className="grid gap-1" key={column.key}>
                  <dt className="text-xs font-black uppercase tracking-[0.12em] text-[#6F657C]">
                    {column.label}
                  </dt>
                  <dd className="min-w-0 break-words text-sm text-[#493C5E]">
                    {column.render(item)}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        ))}
      </div>
    </>
  );
}
