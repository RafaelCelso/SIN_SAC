export function DashboardChart() {
  return (
    <div className="w-full h-[400px] bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Evolução de Atendimentos</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-sm text-gray-600">Pendentes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-teal-500"></div>
            <span className="text-sm text-gray-600">Realizados</span>
          </div>
        </div>
      </div>

      <div className="relative w-full h-[320px]">
        {/* Simulação de um gráfico */}
        <div className="absolute bottom-0 left-0 w-full h-[280px] flex items-end justify-between px-2">
          {/* Barras do gráfico */}
          {Array.from({ length: 12 }).map((_, i) => {
            const pendingHeight = 30 + Math.random() * 150
            const completedHeight = 50 + Math.random() * 200

            return (
              <div key={i} className="flex flex-col items-center gap-1 w-[7%]">
                <div className="w-full flex flex-col items-center gap-1">
                  <div className="w-full bg-teal-500 rounded-t-sm" style={{ height: `${completedHeight}px` }}></div>
                  <div className="w-full bg-amber-500 rounded-t-sm" style={{ height: `${pendingHeight}px` }}></div>
                </div>
                <span className="text-xs text-gray-500 mt-2">{`Jan${i !== 0 ? i + 1 : ""}`}</span>
              </div>
            )
          })}
        </div>

        {/* Linhas horizontais do gráfico */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="absolute w-full h-px bg-gray-200" style={{ bottom: `${(i * 280) / 4}px` }}>
            <span className="absolute -left-8 -top-2 text-xs text-gray-500">{(4 - i) * 50}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

