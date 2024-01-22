import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import {
  type BiggerReactorsReactorMessage,
  type BiggerReactorsReactorData,
  BiggerReactorsControlRodDataBank,
  BiggerReactorsControlRodData,
} from '@/types/reactord'
import { defaultBiggerReactor } from '@/utils/defaults'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

function BiggerReactorsReactor() {
  const [biggerReactorsData, setBiggerReactorsData] = useState<
    BiggerReactorsReactorData | undefined
  >(undefined)

  const router = useRouter()

  const biggerReactor = trpc.getBiggerReactorsReactor.useQuery({
    id: parseInt(router.query.id as string),
  })
  const setBiggerReactor = trpc.setBiggerReactorsReactor.useMutation()

  const WS_URL = `ws://127.0.0.1:8080/BiggerReactors_Reactor-${router.query.id}`
  const { sendJsonMessage, lastJsonMessage, readyState } =
    useWebSocket<BiggerReactorsReactorMessage>(WS_URL, {
      share: false,
      shouldReconnect: () => true,
    })

  useEffect(() => {
    if (readyState && lastJsonMessage) {
      setBiggerReactorsData((prev) => {
        return {
          ...prev,
          ...lastJsonMessage.data,
          controlRodData: {
            ...prev?.controlRodData,
            ...lastJsonMessage.data.controlRodData,
          },
        }
      })
    }
  }, [lastJsonMessage, readyState])

  useEffect(() => {
    setBiggerReactorsData((prev) => {
      return {
        ...prev,
        ...biggerReactor.data,
        controlRodData: {
          ...biggerReactor.data?.controlRodData,
        },
      }
    })
  }, [biggerReactor.data])

  if (!biggerReactorsData)
    return (
      <div className='flex justify-center'>
        <div className='bg-stone-800 rounded-lg m-2 p-2'>
          Reactor not found :(
        </div>
      </div>
    )

  if (!biggerReactorsData?.device?.connected) {
    return (
      <div className='flex justify-center'>
        <div className='bg-stone-800 rounded-lg m-2 p-2'>
          Sorry, the reactor is disconnected right now :(
        </div>
      </div>
    )
  }

  if (!biggerReactorsData) return <></>

  return (
    <div className='flex justify-start'>
      <div className='bg-stone-800 rounded-lg m-2 p-2'>
        <div className='text-xl'>BiggerReactors_Reactor {router.query.id}</div>
        <div className='flex items-center gap-2'>
          <span>{biggerReactorsData.apiVersion}</span>
          <div
            className={`w-4 h-4 ${
              biggerReactorsData.active ? 'bg-green-500' : 'bg-red-500'
            } rounded-full`}
          />
        </div>
        <div className='font-bold text-lg my-2 flex justify-center'>
          Control Rods
        </div>
        <Button
          onClick={(e) => {
            setBiggerReactor.mutate({
              active: !biggerReactorsData.active,
            })
          }}
          variant='outline'>
          Set {biggerReactorsData.active && 'in'}active
        </Button>
        <div className='grid grid-flow-row gap-2 grid-cols-2 justify-between'>
          {Object.keys(biggerReactorsData.controlRodData).map((e) => {
            const controlRodData = biggerReactorsData.controlRodData[
              e
            ] as BiggerReactorsControlRodData

            return (
              <div
                key={`bigger_reactor_control_rod_${e}`}
                className='flex-col flex justify-center'>
                <div
                  style={{
                    width: `${controlRodData.level}%`,
                  }}
                  className={`bg-stone-100 text-black rounded-r-lg transition-all text-center`}>
                  {controlRodData.level}
                </div>
                <div className='bg-stone-900 rounded-b-lg hover:bg-stone-700 transition-colors p-1 gap-1 flex flex-col'>
                  <div className=''>
                    <span>ID: </span>
                    {e}
                  </div>
                  <div>
                    <span>Name: </span>
                    {controlRodData.name}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default BiggerReactorsReactor
