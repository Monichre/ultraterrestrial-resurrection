// BottomSheet.tsx

import {Sheet} from '@silk-hq/components'
import './BottomSheet.css'

const BottomDrawer = () => (
  <Sheet.Root license='commercial'>
    <Sheet.Trigger>Open</Sheet.Trigger>
    <Sheet.Portal>
      <Sheet.View className='BottomSheet-view' nativeEdgeSwipePrevention={true}>
        <Sheet.Backdrop themeColorDimming='auto' />
        <Sheet.Content className='BottomSheet-content'>
          <Sheet.BleedingBackground className='BottomSheet-bleedingBackground' />
          Some content
        </Sheet.Content>
      </Sheet.View>
    </Sheet.Portal>
  </Sheet.Root>
)

export {BottomDrawer}
