interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
}

export function Skeleton({ width = "100%", height = "16px", borderRadius = "4px" }: SkeletonProps) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius, flexShrink: 0 }}
    />
  );
}

export function SongCardSkeleton() {
  return (
    <div style={{ background: "#181818", borderRadius: "8px", padding: "16px" }}>
      <Skeleton width="100%" height="0" borderRadius="6px" />
      <div
        style={{
          width: "100%",
          paddingBottom: "100%",
          position: "relative",
          marginBottom: "12px",
        }}
      >
        <div
          className="skeleton"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "6px",
          }}
        />
      </div>
      <Skeleton width="80%" height="14px" />
      <div style={{ marginTop: "8px" }}>
        <Skeleton width="60%" height="12px" />
      </div>
    </div>
  );
}

export function SongRowSkeleton() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "40px 40px 1fr 1fr auto",
        alignItems: "center",
        gap: "12px",
        padding: "8px 16px",
      }}
    >
      <Skeleton width="20px" height="14px" />
      <Skeleton width="40px" height="40px" borderRadius="4px" />
      <div>
        <Skeleton width="70%" height="14px" />
        <div style={{ marginTop: "6px" }}>
          <Skeleton width="50%" height="12px" />
        </div>
      </div>
      <Skeleton width="60%" height="12px" />
      <Skeleton width="32px" height="12px" />
    </div>
  );
}
