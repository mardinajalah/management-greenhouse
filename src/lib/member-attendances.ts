export type MemberAttendanceDetail = {
  id: number;
  attendanceDate: string;
  workTitle: string;
  workDescription: string | null;
  checkInTime: string;
  checkOutTime: string | null;
  photoUrl: string | null;
};

export async function fetchMemberAttendances(userId: number): Promise<{
  attendances: MemberAttendanceDetail[];
  error: string | null;
}> {
  const response = await fetch(`/api/attendances/member?userId=${userId}`);
  const payload = (await response.json()) as {
    message?: string;
    attendances?: MemberAttendanceDetail[];
  };

  if (!response.ok) {
    return {
      attendances: [],
      error: payload.message ?? "Gagal memuat data presensi.",
    };
  }

  return {
    attendances: payload.attendances ?? [],
    error: null,
  };
}
