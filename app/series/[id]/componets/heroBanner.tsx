interface HeroBannerProps {
  backdropPath: string | null;
  rating?: number; // from 0 to 10, e.g. 8.5
  title?: string;
  overview?: string;
}

function RatingCircle({ rating }: { rating: number }) {
  const radius = 100;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (rating / 10) * circumference;

  let strokeColor = "#22c55e";
  if (rating < 5) strokeColor = "#ef4444";
  else if (rating < 7) strokeColor = "#f59e0b";

  return (
    <svg
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      aria-label={`Rating: ${rating.toFixed(1)}`}
      style={{ width: "100%", height: "100%" }}
      role="img"
    >
      <circle
        stroke="#334155"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={strokeColor}
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        style={{ transition: "stroke-dashoffset 0.35s" }}
      />
      <text
        x="50%"
        y="50%"
        dy="0.3em"
        textAnchor="middle"
        fontSize="50"
        fill="#f8fafc"
        fontWeight="bold"
      >
        {(rating * 10).toFixed(0)}%
      </text>
    </svg>
  );
}

export default function HeroBanner({
  backdropPath,
  rating,
  title,
  overview,
}: HeroBannerProps) {
  if (!backdropPath) {
    return <div className="hero-banner no-banner">No Banner Available</div>;
  }

  const backdropUrl = `https://image.tmdb.org/t/p/original${backdropPath}`;

  return (
    <div
      className="hero-banner"
      style={{ backgroundImage: `url(${backdropUrl})` }}
      role="banner"
    >
      {typeof rating === "number" && (
        <div className="hero-banner__rating-circle">
          <RatingCircle rating={rating} />
        </div>
      )}
      {title && <h1 className="hero-banner__title">{title}</h1>}
      {overview && <p className="hero-banner__overview">{overview}</p>}
    </div>
  );
}
