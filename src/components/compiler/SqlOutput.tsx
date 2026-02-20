interface SqlOutputProps {
  results: { columns: string[]; values: any[][] }[];
  error: string;
  isRunning: boolean;
}

export function SqlOutput({ results, error, isRunning }: SqlOutputProps) {
  return (
    <div className="flex h-full flex-col bg-[hsl(222,47%,6%)] text-[hsl(210,30%,82%)]">
      <div className="flex items-center border-b border-[hsl(222,30%,14%)] px-3 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[hsl(220,20%,45%)]">
          SQL Results
        </span>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {isRunning ? (
          <p className="text-sm text-[hsl(220,20%,55%)]">Executing query...</p>
        ) : error ? (
          <pre className="whitespace-pre-wrap text-sm text-red-400">{error}</pre>
        ) : results.length === 0 ? (
          <p className="text-sm text-[hsl(220,20%,35%)]">Run a query to see results...</p>
        ) : (
          <div className="space-y-4">
            {results.map((result, i) => (
              <div key={i} className="overflow-auto rounded-lg border border-[hsl(222,30%,16%)]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[hsl(222,30%,16%)] bg-[hsl(222,40%,10%)]">
                      {result.columns.map((col, j) => (
                        <th
                          key={j}
                          className="whitespace-nowrap px-3 py-2 text-left font-semibold text-[hsl(217,91%,60%)]"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.values.map((row, ri) => (
                      <tr
                        key={ri}
                        className="border-b border-[hsl(222,30%,12%)] hover:bg-[hsl(222,40%,8%)]"
                      >
                        {row.map((cell, ci) => (
                          <td key={ci} className="whitespace-nowrap px-3 py-1.5 text-[hsl(210,30%,78%)]">
                            {cell === null ? (
                              <span className="italic text-[hsl(220,20%,35%)]">NULL</span>
                            ) : (
                              String(cell)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="border-t border-[hsl(222,30%,14%)] px-3 py-1.5 text-[10px] text-[hsl(220,20%,40%)]">
                  {result.values.length} row{result.values.length !== 1 ? "s" : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
