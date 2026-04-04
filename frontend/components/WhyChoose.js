export default function WhyChoose() {
  const features = ["Save Bills", "Eco Friendly", "Easy Install", "Support"];

  return (
    <div className="p-10 bg-gray-50 text-center">
      <h2 className="text-2xl mb-6">Why Choose Hans Solar</h2>

      <div className="grid md:grid-cols-4 gap-4">
        {features.map((f, i) => (
          <div key={i} className="p-4 bg-white rounded shadow">
            ⚡ {f}
          </div>
        ))}
      </div>
    </div>
  );
}