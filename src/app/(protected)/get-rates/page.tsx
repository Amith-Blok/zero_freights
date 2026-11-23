import { AirForm } from '@/components/quote-forms/air-form/air-form'
import { LandForm } from '@/components/quote-forms/land-form/land-form'
import { SeaForm } from '@/components/quote-forms/sea-form/sea-form'
import { WarehouseForm } from '@/components/quote-forms/warehouse-form/warehouse-form'
import { CardWrapper } from '@/components/shared/card-wrapper'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getUser } from '@/lib/user'
import { BlokVerificationDialogForm } from '@/components/auth/blok-verificaiton-dailog-form'
import { getSeaFormDataForEdit } from '@/data/edit-shipment'

export default async function HomePage(props: {
  searchParams: Promise<{ mode: string; edit?: string }>
}) {
  const user = await getUser()

  const searchParams = await props.searchParams
  let defaultMode = searchParams.mode ?? 'SEA'
  if (!['SEA', 'LAND', 'AIR', 'WAR'].includes(defaultMode)) {
    defaultMode = 'SEA'
  }
  if (!user?.blokVerified) {
    return (
      <BlokVerificationDialogForm
        userId={user?.id || ''}
        open={true}
        redirectTo={`/get-rates?mode=${defaultMode}`}
      />
    )
  }
  // Edit shipment details: load the saved sea form of this offer (owner only)
  const seaInitialData =
    searchParams.edit && user?.id
      ? await getSeaFormDataForEdit({
          offerId: searchParams.edit,
          userId: user.id,
        })
      : null
  if (seaInitialData) defaultMode = 'SEA'
  // console.log({ defaultMode })
  return (
    <div className="flex w-full items-center justify-center bg-transparent">
      <CardWrapper
        cardTitle="Instant Quote"
        cardDescription="For India to US ,Canada & Europe."
        titleClass="text-2xl"
        cardClass="my-5  md:m-5 w-full min-h-screen bg-white bg-opacity-95"
      >
        <TabComponent
          key={defaultMode}
          defaultTab={defaultMode}
          seaInitialData={seaInitialData}
        />
      </CardWrapper>
    </div>
  )
}

const TabComponent = async (params: {
  defaultTab: string
  seaInitialData: Record<string, unknown> | null
}) => {
  return (
    <Tabs defaultValue={params.defaultTab}>
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
            <SeaForm initialData={params.seaInitialData} />
          </TabsContent>
          <TabsContent value="AIR">
            <AirForm />
          </TabsContent>
          <TabsContent value="LAND">
            <LandForm />
          </TabsContent>
          <TabsContent value="WAR">
            <WarehouseForm />
          </TabsContent>
        </div>
      </div>
    </Tabs>
  )
}
