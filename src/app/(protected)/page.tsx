// import { AirForm } from '@/components/quote-forms/air-form/air-form'
// import { LandForm } from '@/components/quote-forms/land-form/land-form'
import { SeaForm } from '@/components/quote-forms/sea-form/sea-form'
// import { WarehouseForm } from '@/components/quote-forms/warehouse-form/warehouse-form'
import { CardWrapper } from '@/components/shared/card-wrapper'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ComingSoon } from '@/components/shared/comming-soon'

export default async function HomePage(props: {
  searchParams: Promise<{ mode: string }>
}) {
  const searchParams = await props.searchParams
  let defaultMode = searchParams.mode ?? 'SEA'
  if (!['SEA', 'LAND', 'AIR', 'WAR'].includes(defaultMode)) {
    defaultMode = 'SEA'
  }
  return (
    <div className="flex w-full items-center justify-center bg-transparent">
      <CardWrapper
        cardTitle="Request a quote"
        cardDescription={`Secure the finest rates available from the industry's premier
      logistics providers.`}
        titleClass="text-2xl"
        cardClass="my-5  md:m-5 w-full min-h-screen bg-white bg-opacity-95"
      >
        <Tabs defaultValue={defaultMode}>
          <div className="flex flex-col">
            <div className="w-full md:w-[400px]">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="SEA" className="text-xs md:text-sm">
                  🌊Sea
                </TabsTrigger>
                <TabsTrigger value="AIR" className="text-xs md:text-sm">
                  ✈️Air
                </TabsTrigger>
                <TabsTrigger value="LAND" className="text-xs md:text-sm">
                  🚛Land
                </TabsTrigger>
                <TabsTrigger value="WAR" className="text-xs md:text-sm">
                  🏭Warehouse
                </TabsTrigger>
              </TabsList>
            </div>
            <div>
              <TabsContent value="SEA">
                <SeaForm />
              </TabsContent>
              <TabsContent value="AIR">
                <ComingSoon />
              </TabsContent>
              <TabsContent value="LAND">
                {/* <LandForm /> */}
                <ComingSoon />
              </TabsContent>
              <TabsContent value="WAR">
                {/* <WarehouseForm /> */}
                <ComingSoon />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </CardWrapper>
    </div>
  )
}
