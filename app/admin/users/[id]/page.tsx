import { getUserByID } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import UpdateUserForm from "./update-user-form";

export const metadata: Metadata = {
  title: "Edit User",
};

const AdminUserEdit = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;

  const user = await getUserByID(id);
  if (!user) {
    notFound();
  }

  return (
    <div className="space-y08 max-w-lg mx-auto">
      <h2 className="h2-bold">Edit User</h2>
      <UpdateUserForm user={user}/>
    </div>
  );
};

export default AdminUserEdit;
