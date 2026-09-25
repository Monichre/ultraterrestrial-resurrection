import { Card } from '@/components/ui/card'
import { PhotoCaption } from '../PhotoCaption'

/**
 * Hardcoded dual-document stack from the Downloads donor
 * (`classified-document.tsx`). Kept separate from the data-driven
 * `ClassifiedDocument` so visual reference compositions are not overwritten.
 */
export function HardcodedClassifiedStack() {
  return (
    <div className='space-y-8'>
      {/* First Document - UCASEWEIL */}
      <Card
        className='relative border-amber-200 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300'
        style={{
          backgroundColor: '#e8e5de',
          backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      >
        <div className='p-8 font-mono text-sm leading-relaxed'>
          {/* Header */}
          <div className='border-b-2 border-gray-800 pb-2 mb-6'>
            <h1 className='text-2xl font-bold tracking-wider'>UCASEWEIL</h1>
          </div>

          {/* Content with embedded images */}
          <div className='space-y-4'>
            <div className='flex items-start gap-6'>
              <div className='flex-1'>
                <p className='mb-2'>
                  <span className='font-bold'>TA !</span>
                  <span className='float-right font-bold'>HOT H6SZ8S /</span>
                </p>
                <p className='text-justify'>
                  Raapohant renatling. frigIV forbalag od lang inc&apos; Le in rrer Dumabirgolt ire. reocotel naondir
                  o&apos; No the D3Oss bf re:Yentao. nerirevordl dvale &quot;cirpy :I I otb bil nomati elrfuy. rarowd
                  bt barhet len,ing. Irnag stat. And bo BA &quot;rs Oiri Di rasisr: ivrlbla. srrbsrb riuv.
                  rir&quot;rra. torse oiv:rn zsri lrrevento. lsb&quot; &quot;nopatlp Laaob:baurm Alr ino.
                  riro*&quot;--. oievercoa, rroct bothiod iat elivirs
                </p>
              </div>

              <div className='relative'>
                {/* Tape pieces */}
                <div className='absolute -top-2 left-4 w-12 h-6 bg-yellow-100 opacity-80 transform -rotate-12 z-10 shadow-sm'></div>
                <div className='absolute -top-1 right-2 w-8 h-4 bg-yellow-100 opacity-70 transform rotate-6 z-10 shadow-sm'></div>

                {/* Polaroid frame */}
                <div className='bg-white p-3 pb-8 shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-300'>
                  <div className='w-40 h-28 bg-black border border-gray-300'>
                    <div className='w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center'>
                      <div className='w-2 h-2 bg-white rounded-full opacity-20'></div>
                      <div className='w-1 h-1 bg-white rounded-full opacity-30 ml-4'></div>
                      <div className='w-1 h-1 bg-white rounded-full opacity-10 ml-2 mt-2'></div>
                    </div>
                  </div>
                  <PhotoCaption labelTop='AERIAL RECON' captionNote='Unidentified object - 14:30 hrs' />
                </div>
              </div>
            </div>

            <div className='flex items-start gap-6'>
              <div className='flex-1'>
                <p className='text-justify'>
                  :vr: wvn ranbit rwpirirny rvsrrang in tv ri/sr,ral riorert sahir.ikcv. bc olave airs arolbova srroil.
                  ohinl. rnas ire:waricav bvr rvc bil srrpot &quot;rbo Ir&quot;htomnelir rror: si rifr:rrlj brt or
                  £iol :snan bj: snatilaj irlsrro; bent.
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

            <hr className='border-gray-600 my-6' />

            {/* Second section */}
            <div className='flex items-start gap-6'>
              <div className='flex-1'>
                <p className='mb-4'>
                  onirfrel Lor i iiG I she Ghe3Vd -<br />
                  FOo&quot;RprbF rOufr AZ(TIOrA Iho6on -<br />
                  ronbttafad voil rioul v. lid t.A -
                </p>
                <p className='text-justify'>
                  A oabra srl.rarot.riran canrrem rht obaroloirol wesrr. ioo:a ooo/. rannvie on rosndiiy li.o fvrsbit d
                  bsir ILi:nse iofboi lo&quot;bd tolkv :ai Pars tuota furnoA hir Yolrab nlot bevantprs. sr rar&quot;rhi
                  sr sen&quot;radt so. otoobtot pbrr:can Aj:nnroa sni sn . A yol xrm rnsiroi sir in aoi i: v Iaran
                  f/niral rari. nir:bit tol naft Ynho o A wraf:ro G/. I8opor oh oarba. Ilof 3ttt 3abort
                </p>
              </div>

              <div className='relative'>
                {/* Tape pieces */}
                <div className='absolute -top-1 left-2 w-10 h-5 bg-yellow-100 opacity-75 transform rotate-3 z-10 shadow-sm'></div>
                <div className='absolute -bottom-1 right-1 w-6 h-3 bg-yellow-100 opacity-80 transform -rotate-6 z-10 shadow-sm'></div>

                {/* Polaroid frame */}
                <div className='bg-white p-2 pb-6 shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300'>
                  <div className='w-28 h-36 bg-black border border-gray-300'>
                    <div className='w-full h-full bg-gradient-to-b from-gray-700 via-gray-800 to-black flex items-center justify-center'>
                      <div className='w-16 h-20 bg-gradient-to-b from-gray-600 to-gray-900 rounded-lg opacity-60'></div>
                    </div>
                  </div>
                  <PhotoCaption labelTop='SUBJECT X' captionNote='Profile view - classified' />
                </div>
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

        {/* Aged paper effects */}
        <div className='absolute top-2 right-2 w-8 h-8 bg-amber-200 opacity-50 rounded-full'></div>
        <div className='absolute bottom-4 left-20 w-12 h-3 bg-amber-300 opacity-30 rounded-full'></div>
      </Card>

      {/* Second Document - Gordon Cooper */}
      <Card
        className='relative border-amber-200 shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-300'
        style={{
          backgroundColor: '#e8e5de',
          backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      >
        <div className='p-8 font-mono text-sm leading-relaxed'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-xl font-bold tracking-wider mb-2'>GORDON COOPER - MERCURY 9 ASTRONAUT, 1963</h1>
            <div className='border-b border-gray-400 w-full mb-4'></div>
            <h2 className='text-lg font-semibold'>MISSION DEBRIEF TRANSCRIPT</h2>
          </div>

          {/* Content with embedded image */}
          <div className='space-y-4'>
            <div className='flex gap-6'>
              <div className='flex-1'>
                <p className='text-justify mb-4'>
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
                <p className='text-justify mb-4'>
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
                {/* Tape pieces */}
                <div className='absolute -top-2 left-8 w-16 h-8 bg-yellow-100 opacity-70 transform rotate-12 z-10 shadow-sm'></div>
                <div className='absolute -bottom-2 right-4 w-12 h-6 bg-yellow-100 opacity-80 transform -rotate-6 z-10 shadow-sm'></div>

                {/* Polaroid frame */}
                <div className='bg-white p-4 pb-10 shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-300'>
                  <div className='w-56 h-40 border border-gray-300 overflow-hidden'>
                    <img
                      src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250806_1139_Gordon%20Cooper%20Files_remix_01k203xc6jfe9v6mty1jx2k0e9-78sNHEL4Shd9pZTOQj1DkSkF7I9Map.png'
                      alt='Classified aerial photograph'
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <PhotoCaption
                    labelTop='MERCURY 9 - DAY 3'
                    captionNote='Anomalous atmospheric phenomena observed at 15:42 GMT'
                  />
                </div>
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

            {/* Classified stamp */}
            <div className='flex justify-center mt-8'>
              <div className='border-4 border-gray-600 px-8 py-4 transform rotate-12'>
                <span className='text-3xl font-bold tracking-widest text-gray-700'>CLASSIFIED</span>
              </div>
            </div>

            <p className='text-center text-xs mt-6'>Not attempted senetutu congress during the mission.</p>
          </div>
        </div>

        {/* Aged paper effects */}
        <div className='absolute top-4 left-4 w-6 h-6 bg-amber-200 opacity-40 rounded-full'></div>
        <div className='absolute bottom-8 right-8 w-10 h-4 bg-amber-300 opacity-25 rounded-full'></div>
        <div className='absolute top-1/2 left-2 w-4 h-8 bg-amber-200 opacity-30 rounded-full'></div>
      </Card>
    </div>
  )
}

export default HardcodedClassifiedStack
