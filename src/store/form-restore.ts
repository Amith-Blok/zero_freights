/* eslint-disable no-unused-vars */
import { SeaFormType } from '@/schema/sea-schema'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type SeaType = {
  label: string
  // value:string,
  data: SeaFormType
}
type SeaFormResetStoreType = {
  sea: SeaType[]
  addSea: (newSea: SeaType) => void
  reset: () => void
}

// Schema to validate the SeaFormType array (max length of 5)
// const SeaHistorySchema = z
//   .array(
//     z.object({
//       label: z.string(),
//       data: SeaFormSchema, // This assumes SeaFormSchema is already defined as a valid schema
//     })
//   )
//   .max(5) // Validates an array of SeaFormType with a max length of 5
export const SeaFormResetStore = create<SeaFormResetStoreType>()(
  persist(
    (set) => ({
      sea: [],
      addSea(newSea) {
        set((state) => ({
          sea: [newSea, ...state.sea.slice(0, 4)], // Add new entry and keep max 5
        }))
        // this.reset
      },
      reset() {
        set(() => ({
          sea: [],
        }))
      },
    }),
    {
      name: 'sea-rest',
      storage: createJSONStorage(() => localStorage),
      // Validate the stored data on rehydration
      // deserialize: (str) => {
      //   try {
      //     const parsedData = JSON.parse(str);
      //     const result = SeaHistorySchema.safeParse(
      //       parsedData?.state?.sea?.data
      //     );
      //     if (!result.success) throw new Error('Invalid data');
      //     return parsedData;
      //   } catch {
      //     // If data is invalid, reset to default empty state
      //     return { state: { sea: [] } };
      //   }
      // },
    }
  )
)
