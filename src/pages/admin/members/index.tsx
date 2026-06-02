import type { GetServerSideProps } from "next";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Message } from "@/components/Message";
import { serialize } from "@/lib/serialize";
import type { SessionUser } from "@/lib/session";
import { requireSession } from "@/server/auth";
import { getMembers } from "@/server/data";

type MembersPageProps = {
  user: SessionUser;
  members: Awaited<ReturnType<typeof getMembers>>;
  query: {
    q: string;
    role: string;
    status: string;
  };
  message?: string;
};

export default function MembersPage({ user, members, query, message }: MembersPageProps) {
  return (
    <DashboardLayout title="Manajemen Anggota" user={user}>
      <Message message={message} />
      <section className="panel">
        <div className="panelHeader">
          <h2>Tambah Anggota</h2>
        </div>
        <form className="grid three" action="/api/members" method="post">
          <div className="formRow">
            <label>Nama</label>
            <input name="name" required />
          </div>
          <div className="formRow">
            <label>Email</label>
            <input name="email" type="email" required />
          </div>
          <div className="formRow">
            <label>Username</label>
            <input name="username" />
          </div>
          <div className="formRow">
            <label>Password</label>
            <input name="password" type="password" minLength={6} required />
          </div>
          <div className="formRow">
            <label>Telepon</label>
            <input name="phone" />
          </div>
          <div className="formRow">
            <label>Role</label>
            <select name="role" defaultValue="user">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <input type="hidden" name="isActive" value="true" />
          <button type="submit">Simpan Anggota</button>
        </form>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <h2>Daftar Anggota</h2>
        </div>
        <form className="filters" method="get">
          <div className="formRow">
            <label>Cari</label>
            <input name="q" defaultValue={query.q} placeholder="Nama atau email" />
          </div>
          <div className="formRow">
            <label>Role</label>
            <select name="role" defaultValue={query.role}>
              <option value="">Semua</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="formRow">
            <label>Status</label>
            <select name="status" defaultValue={query.status}>
              <option value="">Semua</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>
          <button type="submit">Filter</button>
        </form>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Telepon</th>
                <th>Role</th>
                <th>Status</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>
                    {member.email}
                    {member.username ? <small style={{ display: "block" }}>@{member.username}</small> : null}
                  </td>
                  <td>{member.phone || "-"}</td>
                  <td>
                    <span className="badge">{member.role}</span>
                  </td>
                  <td>
                    <span className={member.isActive ? "badge" : "badge warn"}>
                      {member.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td>
                    <form className="formGrid" action={`/api/members/${member.id}`} method="post">
                      <input name="name" defaultValue={member.name} aria-label="Nama" required />
                      <input name="email" defaultValue={member.email} type="email" aria-label="Email" required />
                      <input name="username" defaultValue={member.username ?? ""} aria-label="Username" />
                      <input name="phone" defaultValue={member.phone ?? ""} aria-label="Telepon" />
                      <input name="password" type="password" placeholder="Password baru opsional" aria-label="Password baru" />
                      <select name="role" defaultValue={member.role} aria-label="Role">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      <label className="actions">
                        <input type="checkbox" name="isActive" defaultChecked={member.isActive} />
                        Aktif
                      </label>
                      <button type="submit">Update</button>
                    </form>
                  </td>
                </tr>
              ))}
              {members.length === 0 ? (
                <tr>
                  <td colSpan={6}>Belum ada anggota.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps<MembersPageProps> = async (context) => {
  const guard = requireSession(context, { role: "admin" });
  if (guard.redirect || !guard.user) return { redirect: guard.redirect! };

  const query = {
    q: typeof context.query.q === "string" ? context.query.q : "",
    role: typeof context.query.role === "string" ? context.query.role : "",
    status: typeof context.query.status === "string" ? context.query.status : "",
  };

  return {
    props: {
      user: guard.user,
      members: serialize(await getMembers(query)),
      query,
      message: typeof context.query.message === "string" ? context.query.message : "",
    },
  };
};
