import { getAuthUserDetails } from "@/lib/queries";
import { Prisma } from "@prisma/client";
import React from "react";
import MenuOptions from "./menu-option";

type Props = {
    id: string;
    type: "agency" | "subaccount";
    userDetails?: Prisma.PromiseReturnType<typeof getAuthUserDetails>;
};

const Sidebar = async ({ id, type, userDetails }: Props) => {
    const user = userDetails ?? (await getAuthUserDetails());

    if (!user) return;

    if (!user.Agency) return;

    const details = type === "agency" ? user?.Agency : user?.Agency.SubAccount.find((subaccount) => subaccount.id === id);

    const isWhiteLabeledAgency = user.Agency.whiteLabel;
    if (!details) return;

    let sideBarLogo = user.Agency.agencyLogo || "/assets/plura-logo.svg";

    if (!isWhiteLabeledAgency) {
        if (type === "subaccount") {
            sideBarLogo = user?.Agency.SubAccount.find((subaccount) => subaccount.id === id)?.subAccountLogo || user.Agency.agencyLogo;
        }
    }

    const sidebarOpt = type === "agency" ? user.Agency.SidebarOption || [] : user.Agency.SubAccount.find((subaccount) => subaccount.id === id)?.SidebarOption || [];

    const subaccounts = user.Agency.SubAccount.filter((subaccount) => user.Permissions.find((permission) => permission.subAccountId === subaccount.id && permission.access));

    return (
        <>
            <MenuOptions defaultOpen={true} details={details} id={id} sidebarLogo={sideBarLogo} sidebarOpt={sidebarOpt} subAccounts={subaccounts} user={user} />
            <MenuOptions details={details} id={id} sidebarLogo={sideBarLogo} sidebarOpt={sidebarOpt} subAccounts={subaccounts} user={user} />
        </>
    );
};

export default Sidebar;
