'use client'

import type {CSSProperties, ReactNode} from 'react'
import {Card} from '@/components/ui/card'
import {PhotoCaption} from './PhotoCaption'

const PAPER_STYLE: CSSProperties = {
  backgroundColor: '#e8e5de',
  backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
  backgroundRepeat: 'repeat',
  backgroundSize: '200px 200px',
}

const MERCURY_PHOTO_SRC =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250806_1139_Gordon%20Cooper%20Files_remix_01k203xc6jfe9v6mty1jx2k0e9-78sNHEL4Shd9pZTOQj1DkSkF7I9Map.png'

type TapePieceProps = {
  className: string
}

const TapePiece = ({className}: TapePieceProps) => (
  <div className={`absolute z-10 bg-yellow-100 shadow-sm ${className}`} aria-hidden />
)

type PolaroidFrameProps = {
  children: ReactNode
  labelTop: string
  captionNote: string
  frameClassName?: string
  rotateClassName?: string
}

const PolaroidFrame = ({
  children,
  labelTop,
  captionNote,
  frameClassName = '',
  rotateClassName = 'rotate-2',
}: PolaroidFrameProps) => (
  <div
    className={`bg-white shadow-xl transition-transform duration-300 hover:rotate-0 ${rotateClassName} ${frameClassName}`}>
    {children}
    <PhotoCaption labelTop={labelTop} captionNote={captionNote} />
  </div>
)

type AgedPaperCardProps = {
  children: ReactNode
  tiltClassName: string
  stains: ReactNode
}

const AgedPaperCard = ({children, tiltClassName, stains}: AgedPaperCardProps) => (
  <Card
    className={`relative border-amber-200 shadow-2xl transition-transform duration-300 hover:rotate-0 ${tiltClassName}`}
    style={PAPER_STYLE}>
    {children}
    {stains}
  </Card>
)

/**
 * Aged classified case-file composition — UCASEWEIL dossier + Gordon Cooper Mercury 9 debrief.
 * Ported from Dropover classified-document prototype.
 */
export const ClassifiedDocument = () => (
  <div className='space-y-8'>
    {/* First Document - UCASEWEIL */}
    <AgedPaperCard
      tiltClassName='rotate-1'
      stains={
        <>
          <div className='absolute top-2 right-2 h-8 w-8 rounded-full bg-amber-200 opacity-50' />
          <div className='absolute bottom-4 left-20 h-3 w-12 rounded-full bg-amber-300 opacity-30' />
        </>
      }>
      <div className='p-8 font-mono text-sm leading-relaxed'>
        <div className='mb-6 border-b-2 border-gray-800 pb-2'>
          <h1 className='text-2xl font-bold tracking-wider'>UCASEWEIL</h1>
        </div>

        <div className='space-y-4'>
          <div className='flex items-start gap-6'>
            <div className='flex-1'>
              <p className='mb-2'>
                <span className='font-bold'>TA !</span>
                <span className='float-right font-bold'>HOT H6SZ8S /</span>
              </p>
              <p className='text-justify'>
                Raapohant renatling. frigIV forbalag od lang inc&apos; Le in rrer Dumabirgolt ire.
                reocotel naondir o&apos; No the D3Oss bf re:Yentao. nerirevordl dvale &quot;cirpy :I
                I otb bil nomati elrfuy. rarowd bt barhet len,ing. Irnag stat. And bo BA &quot;rs
                Oiri Di rasisr: ivrlbla. srrbsrb riuv. rir&quot;rra. torse oiv:rn zsri lrrevento.
                lsb&quot; &quot;nopatlp Laaob:baurm Alr ino. riro*&quot;--. oievercoa, rroct bothiod
                iat elivirs
              </p>
            </div>

            <div className='relative'>
              <TapePiece className='-top-2 left-4 h-6 w-12 -rotate-12 opacity-80' />
              <TapePiece className='-top-1 right-2 h-4 w-8 rotate-6 opacity-70' />
              <PolaroidFrame
                frameClassName='p-3 pb-8'
                rotateClassName='rotate-2'
                labelTop='AERIAL RECON'
                captionNote='Unidentified object - 14:30 hrs'>
                <div className='h-28 w-40 border border-gray-300 bg-black'>
                  <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-800 to-black'>
                    <div className='h-2 w-2 rounded-full bg-white opacity-20' />
                    <div className='ml-4 h-1 w-1 rounded-full bg-white opacity-30' />
                    <div className='ml-2 mt-2 h-1 w-1 rounded-full bg-white opacity-10' />
                  </div>
                </div>
              </PolaroidFrame>
            </div>
          </div>

          <div className='flex items-start gap-6'>
            <div className='flex-1'>
              <p className='text-justify'>
                :vr: wvn ranbit rwpirirny rvsrrang in tv ri/sr,ral riorert sahir.ikcv. bc olave airs
                arolbova srroil. ohinl. rnas ire:waricav bvr rvc bil srrpot &quot;rbo
                Ir&quot;htomnelir rror: si rifr:rrlj brt or £iol :snan bj: snatilaj irlsrro; bent.
              </p>
              <p className='mt-4'>
                <span className='font-bold'>ROC.</span>
              </p>
            </div>

            <div className='text-right text-xs'>
              <p>wrrnoeirs raerb asnvitag robsrervol</p>
              <p>v.rnoeir;</p>
              <p>ia ron&quot;ir arrslirs riorsbad ribrray</p>
              <p>sninng ba isrrisr awrier aafar tboe</p>
              <p>baad fr:fvai&quot;: rrao.Ysiir&quot;.Yoia</p>
              <p>oi iq:iii: itoal R )boirr ad 9a</p>
              <p>i tos 8/ 9710. &quot;2bv&apos;.250/&quot; Uiani</p>
            </div>
          </div>

          <hr className='my-6 border-gray-600' />

          <div className='flex items-start gap-6'>
            <div className='flex-1'>
              <p className='mb-4'>
                onirfrel Lor i iiG I she Ghe3Vd -<br />
                FOo&quot;RprbF rOufr AZ(TIOrA Iho6on -<br />
                ronbttafad voil rioul v. lid t.A -
              </p>
              <p className='text-justify'>
                A oabra srl.rarot.riran canrrem rht obaroloirol wesrr. ioo:a ooo/. rannvie on
                rosndiiy li.o fvrsbit d bsir ILi:nse iofboi lo&quot;bd tolkv :ai Pars tuota furnoA
                hir Yolrab nlot bevantprs. sr rar&quot;rhi sr sen&quot;radt so. otoobtot pbrr:can
                Aj:nnroa sni sn . A yol xrm rnsiroi sir in aoi i: v Iaran f/niral rari. nir:bit tol
                naft Ynho o A wraf:ro G/. I8opor oh oarba. Ilof 3ttt 3abort
              </p>
            </div>

            <div className='relative'>
              <TapePiece className='-top-1 left-2 h-5 w-10 rotate-3 opacity-75' />
              <TapePiece className='-bottom-1 right-1 h-3 w-6 -rotate-6 opacity-80' />
              <PolaroidFrame
                frameClassName='p-2 pb-6'
                rotateClassName='-rotate-3'
                labelTop='SUBJECT X'
                captionNote='Profile view - classified'>
                <div className='h-36 w-28 border border-gray-300 bg-black'>
                  <div className='flex h-full w-full items-center justify-center bg-gradient-to-b from-gray-700 via-gray-800 to-black'>
                    <div className='h-20 w-16 rounded-lg bg-gradient-to-b from-gray-600 to-gray-900 opacity-60' />
                  </div>
                </div>
              </PolaroidFrame>
            </div>

            <div className='text-right text-xs'>
              <p>al</p>
              <p>oi</p>
              <p>ahr</p>
              <p>oi /</p>
            </div>
          </div>

          <hr className='border-gray-600' />
          <hr className='border-gray-600' />
          <hr className='border-gray-600' />
        </div>
      </div>
    </AgedPaperCard>

    {/* Second Document - Gordon Cooper */}
    <AgedPaperCard
      tiltClassName='-rotate-1'
      stains={
        <>
          <div className='absolute top-4 left-4 h-6 w-6 rounded-full bg-amber-200 opacity-40' />
          <div className='absolute right-8 bottom-8 h-4 w-10 rounded-full bg-amber-300 opacity-25' />
          <div className='absolute top-1/2 left-2 h-8 w-4 rounded-full bg-amber-200 opacity-30' />
        </>
      }>
      <div className='p-8 font-mono text-sm leading-relaxed'>
        <div className='mb-8 text-center'>
          <h1 className='mb-2 text-xl font-bold tracking-wider'>
            GORDON COOPER - MERCURY 9 ASTRONAUT, 1963
          </h1>
          <div className='mb-4 w-full border-b border-gray-400' />
          <h2 className='text-lg font-semibold'>MISSION DEBRIEF TRANSCRIPT</h2>
        </div>

        <div className='space-y-4'>
          <div className='flex gap-6'>
            <div className='flex-1'>
              <p className='mb-4 text-justify'>
                ined entthoonr object ane
                <br />
                surrios a +.000 ferr Curg rie
                <br />
                durmed ar fuetde not ader.
                <br />
                bus of strospheric omnum lands
                <br />
                hvsto any ennotherlt iv he vil
                <br />
                possible phenomenas.
              </p>
              <p className='mb-4 text-justify'>
                it was anight is we lunsun-
                <br />
                that wnoyherd who ste tovunda
                <br />
                there as super shere a stuch
                <br />
                atmosphers is berew libety
                <br />
                can onl severd not
              </p>
              <p className='text-justify'>
                This was Clouds omesimas
                <br />
                watter detrured all visible morsity
                <br />
                stible for semirave since clercit posable to Datsally.
                <br />
                mission.
              </p>
            </div>

            <div className='relative'>
              <TapePiece className='-top-2 left-8 h-8 w-16 rotate-12 opacity-70' />
              <TapePiece className='-bottom-2 right-4 h-6 w-12 -rotate-6 opacity-80' />
              <PolaroidFrame
                frameClassName='p-4 pb-10'
                rotateClassName='rotate-1'
                labelTop='MERCURY 9 - DAY 3'
                captionNote='Anomalous atmospheric phenomena observed at 15:42 GMT'>
                <div className='h-40 w-56 overflow-hidden border border-gray-300'>
                  {/* eslint-disable-next-line @next/next/no-img-element -- external archival blob; not in next/image remotePatterns */}
                  <img
                    src={MERCURY_PHOTO_SRC}
                    alt='Classified aerial photograph'
                    className='h-full w-full object-cover'
                  />
                </div>
              </PolaroidFrame>
            </div>
          </div>

          <div className='mt-8'>
            <p className='text-left'>
              Clouds
              <br />
              water
              <br />
              all visible
            </p>
          </div>

          <div className='mt-8 flex justify-center'>
            <div className='rotate-12 border-4 border-gray-600 px-8 py-4'>
              <span className='text-3xl font-bold tracking-widest text-gray-700'>CLASSIFIED</span>
            </div>
          </div>

          <p className='mt-6 text-center text-xs'>
            Not attempted senetutu congress during the mission.
          </p>
        </div>
      </div>
    </AgedPaperCard>
  </div>
)

export default ClassifiedDocument
