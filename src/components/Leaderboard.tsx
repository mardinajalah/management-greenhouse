type LeaderboardItem = {
  id: number;
  name: string;
  total: number;
};

export function Leaderboard({ items }: { items: LeaderboardItem[] }) {
  return (
    <section className="panel">
      <div className="panelHeader">
        <h2>Leaderboard Presensi</h2>
      </div>
      {items.length === 0 ? (
        <p className="emptyText">Belum ada presensi selesai.</p>
      ) : (
        <div className="leaderboard">
          {items.map((item, index) => (
            <div className="leaderboardRow" key={item.id}>
              <strong>#{index + 1}</strong>
              <span>{item.name}</span>
              <b>{item.total} selesai</b>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
