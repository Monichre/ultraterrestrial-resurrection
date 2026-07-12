import { Card } from "@/components/ui/card"
import type { ClassifiedDocumentProps, ClassifiedDocumentItem } from "@/types/documents"

const DEFAULT_DOCUMENTS: ClassifiedDocumentItem[] = [
    {
      title: "UCASEWEIL",
      rotation: 1,
      content: [
        {
          type: "text",
          data: {
            sections: [
              {
                text: 'Raapohant renatling. frigIV forbalag od lang inc\' Le in rrer Dumabirgolt ire. reocotel naondir o\' No the D3Oss bf re:Yentao. nerirevordl dvale "cirpy :I I otb bil nomati elrfuy. rarowd bt barhet len,ing. Irnag stat. And bo BA "rs Oiri Di rasisr: ivrlbla. srrbsrb riuv. rir"rra. torse oiv:rn zsri lrrevento. lsb" "nopatlp Laaob:baurm Alr ino. riro*"--. oievercoa, rroct bothiod iat elivirs',
                hasImage: true,
              },
              {
                text: ':vr: wvn ranbit rwpirirny rvsrrang in tv ri/sr,ral riorert sahir.ikcv. bc olave airs arolbova srroil. ohinl. rnas ire:waricav bvr rvc bil srrpot "rbo Ir"htomnelir rror: si rifr:rrlj brt or £iol :snan bj: snatilaj irlsrro; bent.',
                sideText: [
                  "wrrnoeirs raerb asnvitag robsrervol",
                  "v.rnoeir;",
                  'ia ron"ir arrslirs riorsbad ribrray',
                  "sninng ba isrrisr awrier aafar tboe",
                  'baad fr:fvai": rrao.Ysiir".Yoia',
                  "oi iq:iii: itoal R )boirr ad 9a",
                  'i tos 8/ 9710. "2bv\'.250/" Uiani',
                ],
              },
            ],
          },
        },
      ],
    },
]

export function ClassifiedDocument(props: ClassifiedDocumentProps = {}) {
  const documents = props.documents || DEFAULT_DOCUMENTS

  return (
    <div className="space-y-8">
      {documents.map((doc, docIndex) => (
        <Card
          key={docIndex}
          className={`relative border-amber-200 shadow-2xl transform rotate-${doc.rotation} hover:rotate-0 transition-transform duration-300`}
          style={{
            backgroundColor: "#e8e5de",
            backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
            backgroundRepeat: "repeat",
            backgroundSize: "200px 200px",
          }}
        >
          <div className="p-8 font-mono text-sm leading-relaxed">
            {/* Header */}
            <div className="border-b-2 border-gray-800 pb-2 mb-6">
              <h1 className="text-2xl font-bold tracking-wider">{doc.title}</h1>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {doc.content.map((section, sectionIndex) => {
                if (section.type === "header") {
                  return (
                    <div key={sectionIndex} className="text-center mb-8">
                      <h1 className="text-xl font-bold tracking-wider mb-2">{section.data.title}</h1>
                      <div className="border-b border-gray-400 w-full mb-4"></div>
                      <h2 className="text-lg font-semibold">{section.data.subtitle}</h2>
                    </div>
                  )
                }

                if (section.type === "stamp") {
                  return (
                    <div key={sectionIndex} className="flex justify-center mt-8">
                      <div className={`border-4 border-gray-600 px-8 py-4 transform rotate-${section.data.rotation}`}>
                        <span className="text-3xl font-bold tracking-widest text-gray-700">{section.data.text}</span>
                      </div>
                    </div>
                  )
                }

                if (section.type === "text") {
                  return (
                    <div key={sectionIndex}>
                      {section.data.sections.map((textSection: any, textIndex: number) => (
                        <div key={textIndex} className="flex items-start gap-6 mb-4">
                          <div className="flex-1">
                            <p className="mb-2">
                              <span className="font-bold">TA !</span>
                              <span className="float-right font-bold">HOT H6SZ8S /</span>
                            </p>
                            <p className="text-justify whitespace-pre-line">{textSection.text}</p>
                          </div>

                          {textSection.hasImage && (
                            <div className="w-48 h-32 bg-black border-2 border-gray-600 shadow-lg">
                              {textSection.imageUrl ? (
                                <img
                                  src={textSection.imageUrl || "/placeholder.svg"}
                                  alt="Classified document image"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full opacity-20"></div>
                                  <div className="w-1 h-1 bg-white rounded-full opacity-30 ml-4"></div>
                                  <div className="w-1 h-1 bg-white rounded-full opacity-10 ml-2 mt-2"></div>
                                </div>
                              )}
                            </div>
                          )}

                          {textSection.sideText && (
                            <div className="text-right text-xs">
                              {textSection.sideText.map((line: string, lineIndex: number) => (
                                <p key={lineIndex}>{line}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                }

                return null
              })}
            </div>
          </div>

          {/* Aged paper effects */}
          <div className="absolute top-2 right-2 w-8 h-8 bg-amber-200 opacity-50 rounded-full"></div>
          <div className="absolute bottom-4 left-20 w-12 h-3 bg-amber-300 opacity-30 rounded-full"></div>
          {docIndex === 1 && (
            <>
              <div className="absolute top-4 left-4 w-6 h-6 bg-amber-200 opacity-40 rounded-full"></div>
              <div className="absolute bottom-8 right-8 w-10 h-4 bg-amber-300 opacity-25 rounded-full"></div>
              <div className="absolute top-1/2 left-2 w-4 h-8 bg-amber-200 opacity-30 rounded-full"></div>
            </>
          )}
        </Card>
      ))}
    </div>
  )
}

export default ClassifiedDocument
