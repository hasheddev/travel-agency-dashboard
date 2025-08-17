import React from "react";
import { Outlet, redirect } from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { MobileSidebar, NavItems } from "components";
import { account } from "~/lib/appwrite/client";
import { getExistingUser, storeUserData } from "~/lib/appwrite/auth";

export async function clientLoader() {
  try {
    const user = await account.get();
    if (!user.$id) return redirect("/sign-in");
    const existingUser = await getExistingUser(user.$id);
    if (existingUser?.status === "user") return redirect("/");
    if (!existingUser) {
      await storeUserData();
      return redirect("/");
    }
    return existingUser;
  } catch (error) {
    console.error("Error in client loder", error);
    return redirect("/sign-in");
  }
}

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <MobileSidebar />
      <aside className="w-full max-w-[270px] hidden lg:block">
        <SidebarComponent width={270} enableGestures={false}>
          <NavItems />
        </SidebarComponent>
      </aside>
      <aside className="children">
        <Outlet />
      </aside>
    </div>
  );
};

export default AdminLayout;
