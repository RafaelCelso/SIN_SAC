import { DashboardLayout } from "@/components/dashboard-layout"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DetalhesRegistroLoading() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <Skeleton className="h-6 w-96" />

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-md" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-64" />
            </div>
          </div>
          <Skeleton className="h-9 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="bg-gray-50 border-b">
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-32 w-full" />
                </div>

                <div className="mt-6">
                  <Skeleton className="h-5 w-48 mb-3" />
                  <Skeleton className="h-20 w-full" />
                </div>

                <div className="mt-6">
                  <Skeleton className="h-5 w-24 mb-3" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader className="bg-gray-50 border-b">
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="p-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="mb-6 last:mb-0">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-12 w-0.5 mt-1" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

