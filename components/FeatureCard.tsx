type FeatureCardProps = {
  title: string;
  description: string;
  icon: string;
};

export default function FeatureCard({
  title,
  description,
  icon,
}: FeatureCardProps) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-[#101624] p-8 transition duration-300 hover:-translate-y-2 hover:border-indigo-500 hover:shadow-2xl">

      <div className="mb-6 text-5xl">
        {icon}
      </div>

      <h3 className="mb-4 text-2xl font-bold text-white">
        {title}
      </h3>

      <p className="leading-7 text-gray-400">
        {description}
      </p>

    </div>
  );
}