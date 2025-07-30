import { db } from "@/lib/db";

type Params = Promise<{ id: string }>;

export default async function UserPage(props: { params: Params }) {
  const { id } = await props.params;

  const user = await db.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    <section className="user-page flex flex-col items-center w-full">
      <p>User not found</p>
    </section>;
  }

  return (
    <section className="user-page flex flex-col w-full">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-semibold">{user?.name}</h2>
          <div className="font-light text-xs">
            <p>User Id: {id} </p>
            <p></p>
          </div>
        </div>
        <button>Log Out</button>
      </div>
    </section>
  );
}
