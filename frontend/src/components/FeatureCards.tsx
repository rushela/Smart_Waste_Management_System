import { CreditCard, AlertCircle, Map, Trash2 } from 'lucide-react';
export const FeatureCards = () => {
  const features = [{
    title: 'Track Waste Collection',
    description: 'View bin status, collection time, and recycling data in real-time.',
    icon: <Trash2 className="h-10 w-10 text-[#2ECC71]" />,
    color: 'bg-green-50'
  }, {
    title: 'Make Online Payments',
    description: 'Securely pay waste bills and get digital receipts instantly.',
    icon: <CreditCard className="h-10 w-10 text-[#2ECC71]" />,
    color: 'bg-green-50'
  }, {
    title: 'Report Issues',
    description: 'Residents can report missed pickups or damaged bins easily.',
    icon: <AlertCircle className="h-10 w-10 text-[#2ECC71]" />,
    color: 'bg-green-50'
  }, {
    title: 'Optimize Routes',
    description: 'Planners can analyze and publish optimized collection routes.',
    icon: <Map className="h-10 w-10 text-[#2ECC71]" />,
    color: 'bg-green-50'
  }];
  return <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Key Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our smart waste management system offers a range of features to make
            waste collection efficient and user-friendly.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => <div key={index} className={`${feature.color} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100`}>
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>)}
        </div>
      </div>
    </section>;
};