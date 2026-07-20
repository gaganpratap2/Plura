import { ChildrenProps } from "@/@types";
import BlurPage from "@/components/global/blur-page";
import InfoBar from "@/components/global/infobar";
import Sidebar from "@/components/sidebar";
import Unauthorized from "@/components/unauthorized";
import {
    getNotificationAndUser,
    verifyAndAcceptInvitation,
} from "@/lib/queries";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Props = {
    params: Promise<{
        agencyId: string;
    }>;
} & ChildrenProps;

const AGENCY_ROLES = ["AGENCY_OWNER", "AGENCY_ADMIN"] as const;

const Layout = async ({ children, params }: Props) => {
    const { agencyId: paramAgencyId } = await params;

    const [agencyId, user] = await Promise.all([
        verifyAndAcceptInvitation(),
        currentUser(),
    ]);

    if (!user) {
        redirect("/");
    }

    if (!agencyId) {
        redirect("/agency");
    }

    const role = user.privateMetadata.role as string | undefined;
    if (!role || !AGENCY_ROLES.includes(role as (typeof AGENCY_ROLES)[number])) {
        return <Unauthorized />;
    }

    const notifications = (await getNotificationAndUser(agencyId)) ?? [];

    return (
        <div className="h-screen overflow-hidden">
            <Sidebar id={paramAgencyId} type="agency" />
            <div className="md:pl-[300px]">
                <InfoBar
                    notifications={notifications}
                    role={notifications[0]?.User?.role}
                />
                <div className="relative">
                    <BlurPage>{children}</BlurPage>
                </div>
            </div>
        </div>
    );
};

export default Layout;




















// import { ChildrenProps } from "@/@types";
// import BlurPage from "@/components/global/blur-page";
// import InfoBar from "@/components/global/infobar";
// import Sidebar from "@/components/sidebar";
// import Unauthorized from "@/components/unauthorized";
// import { getNotificationAndUser, verifyAndAcceptInvitation } from "@/lib/queries";
// import { currentUser } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

// type Props = {
//     params: {
//         agencyId: string;
//     };
// } & ChildrenProps;

// const Layout = async ({ children, params }: Props) => {
//     const agencyId = await verifyAndAcceptInvitation();
//     const user = await currentUser();

//     if (!user) {
//         return redirect("/");
//     }

//     if (!agencyId) {
//         return redirect(`/agency`);
//     }

//     if (user.privateMetadata.role !== "AGENCY_OWNER" && user.privateMetadata.role !== "AGENCY_ADMIN") return <Unauthorized />;

//     let allNoti: any = [];
//     const notifications = await getNotificationAndUser(agencyId);
//     if (notifications) allNoti = notifications;

//     return (
//         <div className="h-screen overflow-hidden">
//             <Sidebar id={params.agencyId} type="agency" />
//             <div className="md:pl-[300px]">
//                 <InfoBar notifications={allNoti} role={allNoti.User?.role} />
//                 <div className="relative">
//                     <BlurPage>{children}</BlurPage>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Layout;
