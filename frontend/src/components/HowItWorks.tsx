import { Tag, Scan, Database, MapPin } from 'lucide-react'

export const HowItWorks = () => {
  const steps = [
    {
      title: 'Residents tag their bins',
      description: "Each household gets unique QR codes to identify their waste bins",
      icon: Tag
    },
    {
      title: 'Workers scan & collect',
      description: 'Collection workers scan bins and record pickup data',
      icon: Scan
    },
    {
      title: 'Data sent to system',
      description: 'Collection data is processed and analyzed',
      icon: Database
    },
    {
      title: 'Authorities optimize routes',
      description: 'Planners use data to improve collection efficiency',
      icon: MapPin
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800">How It Works</h2>
          <p className="mt-4 text-lg text-slate-500">Our smart waste management system follows a simple but effective process</p>
        </div>

        <div className="relative">
          {/* horizontal connector line (behind cards) - moved down to avoid crossing titles */}
          <div className="hidden md:block absolute left-16 right-16 top-44 h-1 bg-[#2ECC71]/30 z-0 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((s, idx) => {
              const Icon = s.icon as any
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-24 h-24 rounded-full bg-white border-4 border-[#2ECC71] shadow-md -mb-10 z-30 ring-4 ring-white">
                    <Icon className="text-[#2ECC71]" size={36} />
                  </div>

                  <div className="w-full bg-white rounded-xl shadow-xl pt-14 pb-10 px-6 relative z-10 flex flex-col md:h-72">
                    <div className="text-orange-500 font-semibold text-sm mb-2 text-center">Step {idx + 1}</div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2 text-center">{s.title}</h3>
                    <p className="text-slate-500 text-center mt-auto">{s.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}