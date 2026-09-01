"use server";
import 'server-only'

import type { User as AuthUser } from "@clerk/nextjs/server";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { Agency, Funnel, Lane, Plan, Prisma, Role, SubAccount, Tag, Ticket, User } from "@prisma/client";
import { redirect } from "next/navigation";
import { v4 } from "uuid";
import { db } from "./db";
import { CreateFunnelFormSchema, CreateMediaType, CreatePipeLineType, UpsertFunnelPage } from "./types";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// export const getUser = async (id: String) => {
//     const user = await db.user.findUnique({
//         where: {
//             id,
//         },
//     });

//     return user;
// };


export const getUser = async (id: string) => {
    const user = await db.user.findUnique({
        where: {
            id,
        },
    });

    return user;
};

export const getAuthContext = async () => {
    const user = await currentUser();
    if (!user) return null;

    const dbUser = await db.user.findUnique({
        where: { email: user.emailAddresses[0].emailAddress },
    });
    if (!dbUser) return null;

    return {
        authUser: user,
        dbUser,
        isOwnerOrAdmin:
            dbUser.role === "AGENCY_OWNER" || dbUser.role === "AGENCY_ADMIN",
    };
};

export const requireSubAccountAccess = async (subAccountId: string) => {
    const ctx = await getAuthContext();
    if (!ctx) throw new Error("Unauthorized");

    const subAccount = await db.subAccount.findUnique({
        where: { id: subAccountId },
        select: { agencyId: true },
    });
    if (!subAccount) throw new Error("Subaccount not found");

    if (ctx.dbUser.agencyId === subAccount.agencyId && ctx.isOwnerOrAdmin) {
        return ctx;
    }

    const hasAccess = await db.permissions.findFirst({
        where: {
            subAccountId,
            email: ctx.dbUser.email,
        },
    });

    if (!hasAccess) throw new Error("Unauthorized");
    return ctx;
};

export const deleteUser = async (userId: string) => {
    const ctx = await getAuthContext();
    if (!ctx) throw new Error("Unauthorized");

    const target = await db.user.findUnique({ where: { id: userId } });
    if (!target) throw new Error("User not found");

    const sameAgency =
        target.agencyId === ctx.dbUser.agencyId ||
        ctx.dbUser.role === "AGENCY_OWNER" ||
        ctx.dbUser.role === "AGENCY_ADMIN";
    const isSelf = target.id === ctx.authUser.id;

    if (!sameAgency && !isSelf) throw new Error("Unauthorized");
    if (!isSelf && !ctx.isOwnerOrAdmin) throw new Error("Unauthorized");

    await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
            role: undefined,
        },
    }).catch(() => {});
    const deletedUser = await db.user.delete({ where: { id: userId } });
    return deletedUser;
};

export const getAuthUserDetails = async () => {
    const user = await currentUser();

    if (!user) {
        return;
    }

    const userData = await db.user.findUnique({
        where: {
            email: user.emailAddresses[0].emailAddress,
        },
        include: {
            Agency: {
                include: {
                    SidebarOption: true,
                    SubAccount: {
                        include: {
                            SidebarOption: true,
                        },
                    },
                },
            },
            Permissions: true,
        },
    });

    return userData;
};

// export const saveActivityLogsNotification = async ({ agencyId, description, subAccountId }: { agencyId?: string; description?: string; subAccountId?: SubAccount }) => {
//     const authUser = await currentUser();
//     let userData;
//     if (!authUser) {
//         const response = await db.user.findFirst({
//             where: {
//                 Agency: {
//                     SubAccount: {
//                         some: { id: subAccountId?.id },
//                     },
//                 },
//             },
//         });
//         if (response) {
//             userData = response;
//         }
//     } else {
//         userData = await db.user.findUnique({
//             where: { email: authUser?.emailAddresses[0].emailAddress },
//         });
//     }

//     if (!userData) {
//         console.log("Could not find a user");
//         return;
//     }

//     let foundAgencyId = agencyId;
//     if (!foundAgencyId) {
//         if (!subAccountId) {
//             throw new Error("You need to provide at least an agency Id or subAccount id");
//         }

//         const response = await db.subAccount.findUnique({
//             where: {
//                 id: subAccountId?.id,
//             },
//         });

//         if (response) foundAgencyId = response.agencyId;
//     }

//     if (subAccountId) {
//         await db.notification.create({
//             data: {
//                 notification: `${userData.name} | ${description}`,
//                 User: {
//                     connect: {
//                         id: userData.id,
//                     },
//                 },
//                 Agency: {
//                     connect: {
//                         id: foundAgencyId,
//                     },
//                 },
//                 SubAccount: {
//                     connect: {
//                         id: subAccountId?.id,
//                     },
//                 },
//             },
//         });
//     } else {
//         await db.notification.create({
//             data: {
//                 notification: `${userData.name} | ${description}`,
//                 User: {
//                     connect: {
//                         id: userData.id,
//                     },
//                 },
//                 Agency: {
//                     connect: {
//                         id: foundAgencyId,
//                     },
//                 },
//             },
//         });
//     }
// };


export const saveActivityLogsNotification = async ({
    agencyId,
    description,
    subAccountId,
}: {
    agencyId?: string;
    description?: string;
    subAccountId?: string;
}) => {
    const authUser = await currentUser();

    let userData;

    if (!authUser) {
        if (subAccountId) {
            userData = await db.user.findFirst({
                where: {
                    Agency: {
                        SubAccount: {
                            some: {
                                id: subAccountId,
                            },
                        },
                    },
                },
            });
        }
    } else {
        userData = await db.user.findUnique({
            where: {
                email: authUser.emailAddresses[0].emailAddress,
            },
        });
    }

    if (!userData) {
        console.log("Could not find a user");
        return;
    }

    let foundAgencyId = agencyId;

    if (!foundAgencyId && subAccountId) {
        const subAccount = await db.subAccount.findUnique({
            where: {
                id: subAccountId,
            },
        });

        if (subAccount) {
            foundAgencyId = subAccount.agencyId;
        }
    }

    if (!foundAgencyId) {
        throw new Error("Agency ID is required");
    }

    await db.notification.create({
        data: {
            notification: `${userData.name} | ${description}`,

            User: {
                connect: {
                    id: userData.id,
                },
            },

            Agency: {
                connect: {
                    id: foundAgencyId,
                },
            },

            ...(subAccountId && {
                SubAccount: {
                    connect: {
                        id: subAccountId,
                    },
                },
            }),
        },
    });
};




export const updateUser = async (user: Partial<User>) => {
    const ctx = await getAuthContext();
    if (!ctx) throw new Error("Unauthorized");

    const target = await db.user.findUnique({
        where: { email: user.email },
    });
    if (!target) throw new Error("User not found");

    const isSelf = target.id === ctx.authUser.id;
    const inSameAgency =
        !!target.agencyId && target.agencyId === ctx.dbUser.agencyId;

    if (!isSelf && !(ctx.isOwnerOrAdmin && inSameAgency)) {
        throw new Error("Unauthorized");
    }

    if (
        !isSelf &&
        user.role &&
        user.role !== "SUBACCOUNT_USER" &&
        user.role !== ctx.dbUser.role &&
        ctx.dbUser.role !== "AGENCY_OWNER"
    ) {
        throw new Error("Only an agency owner can change roles");
    }

    const response = await db.user.update({
        where: {
            email: user.email,
        },
        data: {
            ...user,
        },
    });
    await clerkClient.users.updateUserMetadata(response.id, {
        publicMetadata: {
            role: user.role || ctx.dbUser.role || "SUBACCOUNT_USER",
        },
    });

    return response;
};

export const changeUserPermission = async (permissionId: string, userEmail: string, subAccountId: string, permission: boolean) => {
    try {
        const ctx = await getAuthContext();
        if (!ctx || !ctx.isOwnerOrAdmin) throw new Error("Unauthorized");

        const subAccount = await db.subAccount.findUnique({
            where: { id: subAccountId },
        });
        if (!subAccount || subAccount.agencyId !== ctx.dbUser.agencyId) {
            throw new Error("Unauthorized");
        }

        const response = await db.permissions.upsert({
            where: {
                id: permissionId,
            },
            update: {
                access: permission,
            },
            create: {
                access: permission,
                email: userEmail,
                subAccountId: subAccountId,
            },
        });
        return response;
    } catch (err) {
        console.log(err);
    }
};

export const createTeamUser = async (user: User) => {
    if (user.role === "AGENCY_OWNER") return null;
    const response = await db.user.create({ data: { ...user } });
    return response;
};export const verifyAndAcceptInvitation = async () => {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }
    const invitationExists = await db.invitation.findUnique
    ({
        where: {
            email: user.emailAddresses[0].emailAddress,
            status: "PENDING",
        },
    });

    if (invitationExists) {
        const exitsUser = await getAuthUserDetails();

        if (exitsUser) {
            return exitsUser.agencyId;
        }

        const userDetails = await createTeamUser({
            email: invitationExists.email,
            agencyId: invitationExists.agencyId,
            avatarUrl: user.imageUrl,
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            role: invitationExists.role,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        // await saveActivityLogsNotification({
        //     agencyId: invitationExists?.agencyId,
        //     description: "Joined",
        //     subAccountId: undefined,
        // });

        await saveActivityLogsNotification({
    agencyId: invitationExists.agencyId,
    description: "Joined",
});

        if (userDetails) {
            await clerkClient.users.updateUserMetadata(user.id, {
                privateMetadata: {
                    role: userDetails.role || "SUBACCOUNT_USER",
                },
            });
            await db.invitation.delete({
                where: {
                    email: userDetails.email,
                },
            });
            return userDetails.agencyId;
        } else {
            return null;
        }
    } else {
        const agency = await db.user.findUnique({
            where: {
                email: user.emailAddresses[0].emailAddress,
            },
        });

        return agency ? agency.agencyId : null;
    }
};

export const updateAgencyDetails = async (agencyId: string, agencyDetails: Partial<Agency>) => {
    const ctx = await getAuthContext();
    if (!ctx || !ctx.isOwnerOrAdmin || ctx.dbUser.agencyId !== agencyId) {
        throw new Error("Unauthorized");
    }
    const response = await db.agency.update({
        where: { id: agencyId },
        data: { ...agencyDetails },
    });
    return response;
};

export const getAgencyDetails = async (agencyId: string) => {
    const response = await db.agency.findUnique({
        where: { id: agencyId },
        include: {
            SubAccount: true,
        },
    });
    return response;
};

export const deleteAgency = async (agencyId: string) => {
    const ctx = await getAuthContext();
    if (!ctx || ctx.dbUser.role !== "AGENCY_OWNER" || ctx.dbUser.agencyId !== agencyId) {
        throw new Error("Unauthorized");
    }
    const response = await db.agency.delete({
        where: {
            id: agencyId,
        },
    });
    return response;
};

export const initUser = async (newUser: Partial<User>) => {
    const user = await currentUser();
    if (!user) return;

    const userData = await db.user.upsert({
        where: {
            email: user.emailAddresses[0].emailAddress,
        },
        update: newUser,
        create: {
            id: user.id,
            avatarUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress,
            name: `${user.firstName} ${user.lastName}`,
            role: newUser.role || "SUBACCOUNT_USER",
        },
    });

    await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
            role: newUser.role || "SUBACCOUNT_USER",
        },
    });

    return userData;
};

export const upsertAgency = async (agency: Agency, price?: Plan) => {
    if (!agency.companyEmail) return null;

    const ctx = await getAuthContext();
    if (!ctx) throw new Error("Unauthorized");

    const existing = await db.agency.findUnique({
        where: { id: agency.id },
        select: { id: true },
    });

    if (existing && (!ctx.isOwnerOrAdmin || ctx.dbUser.agencyId !== agency.id)) {
        throw new Error("Unauthorized");
    }

    try {
        const agencyDetails = await db.agency.upsert({
            where: {
                id: agency.id,
            },
            update: agency,
            create: {
                users: {
                    connect: {
                        email: agency.companyEmail,
                    },
                },
                ...agency,
                SidebarOption: {
                    create: [
                        {
                            name: "Dashboard",
                            icon: "category",
                            link: `/agency/${agency.id}`,
                        },
                        {
                            name: "Launchpad",
                            icon: "clipboardIcon",
                            link: `/agency/${agency.id}/launchpad`,
                        },
                        {
                            name: "Billing",
                            icon: "payment",
                            link: `/agency/${agency.id}/billing`,
                        },
                        {
                            name: "Settings",
                            icon: "settings",
                            link: `/agency/${agency.id}/settings`,
                        },
                        {
                            name: "Sub Accounts",
                            icon: "person",
                            link: `/agency/${agency.id}/all-subaccounts`,
                        },
                        {
                            name: "Team",
                            icon: "shield",
                            link: `/agency/${agency.id}/team`,
                        },
                    ],
                },
            },
        });

        return agencyDetails;
    } catch (error) {
        console.log(error);
    }
};

export const getNotificationAndUser = async (agencyId: string) => {
    try {
        const response = await db.notification.findMany({
            where: {
                agencyId,
            },
            include: {
                User: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 20,
        });
        return response;
    } catch (error) {
        console.log(error);
    }
};

export const upsertSubAccount = async (subAccount: SubAccount) => {
    if (!subAccount.companyEmail) return null;

    const ctx = await getAuthContext();
    if (
        !ctx ||
        !ctx.isOwnerOrAdmin ||
        !subAccount.agencyId ||
        ctx.dbUser.agencyId !== subAccount.agencyId
    ) {
        throw new Error("Unauthorized");
    }

    const agencyOwner = await db.user.findFirst({
        where: {
            Agency: {
                id: subAccount.agencyId,
            },
            role: "AGENCY_OWNER",
        },
    });

    if (!agencyOwner) return console.log("Error could not create subaccount");
    const permissionId = v4();
    const response = await db.subAccount.upsert({
        where: { id: subAccount.id },
        update: subAccount,
        create: {
            ...subAccount,
            Permissions: {
                create: {
                    access: true,
                    email: agencyOwner.email,
                    id: permissionId,
                },
            },
            Pipeline: {
                create: { name: "Lead Cycle" },
            },
            SidebarOption: {
                create: [
                    {
                        name: "Launchpad",
                        icon: "clipboardIcon",
                        link: `/subaccount/${subAccount.id}/launchpad`,
                    },
                    {
                        name: "Settings",
                        icon: "settings",
                        link: `/subaccount/${subAccount.id}/settings`,
                    },
                    {
                        name: "Funnels",
                        icon: "pipelines",
                        link: `/subaccount/${subAccount.id}/funnels`,
                    },
                    {
                        name: "Media",
                        icon: "database",
                        link: `/subaccount/${subAccount.id}/media`,
                    },
                    {
                        name: "Automations",
                        icon: "chip",
                        link: `/subaccount/${subAccount.id}/automations`,
                    },
                    {
                        name: "Pipelines",
                        icon: "flag",
                        link: `/subaccount/${subAccount.id}/pipelines`,
                    },
                    {
                        name: "Contacts",
                        icon: "person",
                        link: `/subaccount/${subAccount.id}/contacts`,
                    },
                    {
                        name: "Dashboard",
                        icon: "category",
                        link: `/subaccount/${subAccount.id}`,
                    },
                ],
            },
        },
    });

    return response;
};

export const getUserDetailsByAuthEmail = async (authEmail: AuthUser) => {
    try {
        const response = await db.user.findUnique({
            where: {
                email: authEmail.emailAddresses[0].emailAddress,
            },
        });

        return response;
    } catch (err) {
        console.log(err);
    }
};

export const getUserPermissions = async (userId: string) => {
    const response = await db.user.findUnique({
        where: { id: userId },
        select: {
            Permissions: {
                include: {
                    SubAccount: true,
                },
            },
        },
    });

    return response;
};

// export const getSubAccountDetails = async (subaccountId: string) => {
//     const response = await db.subAccount.findUnique({
//         where: { id: subaccountId },
//     });

//     return response;
// };

export const getSubAccountDetails = async (subaccountId: string) => {
  if (!subaccountId) throw new Error('subaccountId is required')
  return await db.subAccount.findUnique({ where: { id: subaccountId } })
}

export const deleteSubAccount = async (subaccountId: string) => {
    await requireSubAccountAccess(subaccountId);
    const response = await db.subAccount.delete({
        where: {
            id: subaccountId,
        },
    });

    return response;
};

export const sendInvitation = async (role: Role, email: string, agencyId: string) => {
    const ctx = await getAuthContext();
    if (!ctx || !ctx.isOwnerOrAdmin || ctx.dbUser.agencyId !== agencyId) {
        throw new Error("Unauthorized");
    }
    const response = await db.invitation.create({
        data: {
            email,
            agencyId,
            role,
        },
    });

    try {
        await clerkClient.invitations.createInvitation({
            emailAddress: email,
            redirectUrl: process.env.NEXT_PUBLIC_URL,
            publicMetadata: {
                throwDeprecation: true,
                role,
            },
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
    return response;
};

export const getMedia = async (subaccountId: string) => {
    const response = await db.subAccount.findUnique({
        where: {
            id: subaccountId,
        },
        include: {
            Media: true,
        },
    });
    return response;
};

// export const createMedia = async (subaccountId: string, media: CreateMediaType) => {
//     const response = await db.media.create({
//         data: {
//             link: media.link,
//             name: media.name,
//             subAccountId: subaccountId,
//         },
//     });

//     return response;
// };


export const createMedia = async (subaccountId: string, mediaFile: CreateMediaType) => {
  await requireSubAccountAccess(subaccountId)
  const existing = await db.media.findUnique({ where: { link: mediaFile.link } })
  if (existing) return existing // or throw a friendly "already uploaded" error

  return await db.media.create({
    data: { ...mediaFile, subAccountId: subaccountId },
  })
}

export const deleteMedia = async (mediaId: string) => {
    const target = await db.media.findUnique({ where: { id: mediaId } });
    if (!target) throw new Error("Media not found");
    await requireSubAccountAccess(target.subAccountId);
    const response = await db.media.delete({
        where: {
            id: mediaId,
        },
    });
    return response;
};

export const getPipelineDetails = async (pipelineId: string) => {
    const response = await db.pipeline.findUnique({
        where: {
            id: pipelineId,
        },
    });

    return response;
};

// export const deletePipeline = async (pipelineId: string) => {
//     const response = await db.pipeline.delete({
//         where: {
//             id: pipelineId,
//         },
//     });

//     return response;
// };

export const deletePipeline = async (pipelineId: string) => {
    const existing = await db.pipeline.findUnique({
        where: { id: pipelineId },
    });

    if (!existing) {
        console.log("Pipeline already deleted or not found:", pipelineId);
        return null;
    }

    await requireSubAccountAccess(existing.subAccountId);
    const response = await db.pipeline.delete({
        where: {
            id: pipelineId,
        },
    });

    return response;
}; 

// lib/queries.ts
export const getUsersWithAgencySubAccountPermissionsSidebarOptions = async (
  agencyId: string
) => {
  return await db.user.findFirst({
    where: { Agency: { id: agencyId } },
    include: {
      Agency: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    },
  })
}


export const getLanesWithTicketAndTags = async (pipelineId: string) => {
    const response = await db.lane.findMany({
        where: {
            pipelineId,
        },
        orderBy: {
            order: "asc",
        },
        include: {
            Tickets: {
                orderBy: {
                    order: "asc",
                },
                include: {
                    Tags: true,
                    Assigned: true,
                    Customer: true,
                },
            },
        },
    });

    return response;
};

export const upsertPipeline = async (pipeline: CreatePipeLineType) => {
    if (!pipeline.subAccountId) throw new Error("Subaccount required");
    await requireSubAccountAccess(pipeline.subAccountId);
    const response = await db.pipeline.upsert({
        where: {
            id: pipeline.id || v4(),
        },
        create: pipeline,
        update: pipeline,
    });

    return response;
};

export const getTicketsWithTags = async (pipelineId: string) => {
    const response = await db.ticket.findMany({
        where: {
            Lane: {
                pipelineId,
            },
        },
        include: { Tags: true, Assigned: true, Customer: true },
    });
    return response;
};

export const upsertFunnel = async (subaccountId: string, funnel: z.infer<typeof CreateFunnelFormSchema> & { liveProducts: string }, funnelId: string) => {
    await requireSubAccountAccess(subaccountId);
    const response = await db.funnel.upsert({
        where: {
            id: funnelId || v4(),
        },
        update: funnel,
        create: {
            ...funnel,
            id: funnelId || v4(),
            subAccountId: subaccountId,
        },
    });

    return response;
};

export const upsertLane = async (lane: Prisma.LaneUncheckedCreateInput) => {
    const pipeline = await db.pipeline.findUnique({
        where: { id: lane.pipelineId },
    });
    if (!pipeline) throw new Error("Pipeline not found");
    await requireSubAccountAccess(pipeline.subAccountId);

    let order: number;

    if (!lane.order) {
        const lanes = await db.lane.findMany({
            where: {
                pipelineId: lane.pipelineId,
            },
        });
        order = lanes.length;
    } else {
        order = lane.order;
    }

    const response = await db.lane.upsert({
        where: {
            id: lane.id || v4(),
        },
        update: lane,
        create: {
            ...lane,
            order,
        },
    });

    return response;
};

export const deleteLane = async (laneId: string) => {
    const lane = await db.lane.findUnique({ where: { id: laneId } });
    if (!lane) throw new Error("Lane not found");
    const pipeline = await db.pipeline.findUnique({
        where: { id: lane.pipelineId },
    });
    if (!pipeline) throw new Error("Pipeline not found");
    await requireSubAccountAccess(pipeline.subAccountId);
    const response = await db.lane.delete({
        where: {
            id: laneId,
        },
    });
    return response;
};

export const updateLanesOrder = async (lanes: Lane[]) => {
    try {
        const first = await db.lane.findUnique({
            where: { id: lanes[0]?.id },
        });
        if (first) {
            const pipeline = await db.pipeline.findUnique({
                where: { id: first.pipelineId },
            });
            if (pipeline) await requireSubAccountAccess(pipeline.subAccountId);
        }
        const updateTrans = lanes.map((lane) =>
            db.lane.update({
                where: { id: lane.id },
                data: { order: lane.order },
            })
        );

        await db.$transaction(updateTrans);
        console.log("🟢 Done reordered 🟢");
    } catch (error) {
        console.log(error, "ERROR UPDATE LANES ORDER");
    }
};

export const updateTicketsOrder = async (tickets: Ticket[]) => {
    try {
        const firstTicket = await db.ticket.findUnique({
            where: { id: tickets[0]?.id },
        });
        if (firstTicket) {
            const lane = await db.lane.findUnique({
                where: { id: firstTicket.laneId },
            });
            if (lane) {
                const pipeline = await db.pipeline.findUnique({
                    where: { id: lane.pipelineId },
                });
                if (pipeline) {
                    await requireSubAccountAccess(pipeline.subAccountId);
                }
            }
        }
        const updateTrans = tickets.map((ticket) =>
            db.ticket.update({
                where: { id: ticket.id },
                data: { order: ticket.order, laneId: ticket.laneId },
            })
        );

        await db.$transaction(updateTrans);
        console.log("🟢 Done reordered 🟢");
    } catch (error) {
        console.log(error, "ERROR UPDATE TICKETS ORDER");
    }
};

export const deleteTicket = async (ticketId: string) => {
    const ticket = await db.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) throw new Error("Ticket not found");
    const lane = await db.lane.findUnique({ where: { id: ticket.laneId } });
    if (!lane) throw new Error("Lane not found");
    const pipeline = await db.pipeline.findUnique({
        where: { id: lane.pipelineId },
    });
    if (!pipeline) throw new Error("Pipeline not found");
    await requireSubAccountAccess(pipeline.subAccountId);
    const response = await db.ticket.delete({
        where: {
            id: ticketId,
        },
    });

    return response;
};

export const _getTicketsWithAllRelations = async (laneId: string) => {
    const response = await db.ticket.findMany({
        where: { laneId: laneId },
        include: {
            Assigned: true,
            Customer: true,
            Lane: true,
            Tags: true,
        },
    });
    return response;
};

export const getSubAccountTeamMembers = async (subaccountId: string) => {
    const subaccountUsersWithAccess = await db.user.findMany({
        where: {
            Agency: {
                SubAccount: {
                    some: {
                        id: subaccountId,
                    },
                },
            },
            role: "SUBACCOUNT_USER",
            Permissions: {
                some: {
                    subAccountId: subaccountId,
                    access: true,
                },
            },
        },
    });
    return subaccountUsersWithAccess;
};

export const searchContacts = async (searchTerms: string) => {
    const response = await db.contact.findMany({
        where: {
            name: {
                contains: searchTerms,
            },
        },
    });
    return response;
};

export const upsertTicket = async (ticket: Prisma.TicketUncheckedCreateInput, tags: Tag[]) => {
    const lane = await db.lane.findUnique({ where: { id: ticket.laneId } });
    if (!lane) throw new Error("Lane not found");
    const pipeline = await db.pipeline.findUnique({
        where: { id: lane.pipelineId },
    });
    if (!pipeline) throw new Error("Pipeline not found");
    await requireSubAccountAccess(pipeline.subAccountId);

    let order: number;
    if (!ticket.order) {
        const tickets = await db.ticket.findMany({
            where: { laneId: ticket.laneId },
        });
        order = tickets.length;
    } else {
        order = ticket.order;
    }

    const response = await db.ticket.upsert({
        where: {
            id: ticket.id || v4(),
        },
        update: { ...ticket, Tags: { set: tags } },
        create: { ...ticket, Tags: { connect: tags }, order },
        include: {
            Assigned: true,
            Customer: true,
            Tags: true,
            Lane: true,
        },
    });

    return response;
};

export const getDomainContent = async (subDomainName: string) => {
  const response = await db.funnel.findUnique({
    where: {
      subDomainName,
      published: true,
    },
    include: { FunnelPages: true },
  })
  return response
}


export const upsertTag = async (subaccountId: string, tag: Prisma.TagUncheckedCreateInput) => {
    await requireSubAccountAccess(subaccountId);
    const response = await db.tag.upsert({
        where: { id: tag.id || v4(), subAccountId: subaccountId },
        update: tag,
        create: { ...tag, subAccountId: subaccountId },
    });

    return response;
};

export const getTagsForSubaccount = async (subaccountId: string) => {
    const response = await db.subAccount.findUnique({
        where: { id: subaccountId },
        select: { Tags: true },
    });
    return response;
};

export const deleteTag = async (tagId: string) => {
    const tag = await db.tag.findUnique({ where: { id: tagId } });
    if (!tag) throw new Error("Tag not found");
    await requireSubAccountAccess(tag.subAccountId);
    const response = await db.tag.delete({ where: { id: tagId } });
    return response;
};

export const getContact = async (subaccountId: string) => {
    const response = await db.subAccount.findUnique({
        where: {
            id: subaccountId,
        },
        include: {
            Contact: {
                include: {
                    Ticket: {
                        select: {
                            value: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });

    return response;
};

export const upsertContact = async (contact: Prisma.ContactUncheckedCreateInput) => {
    const subAccount = await db.subAccount.findUnique({
        where: { id: contact.subAccountId },
        select: { id: true },
    });
    if (!subAccount) throw new Error("Subaccount not found");
    const response = await db.contact.upsert({
        where: { id: contact.id || v4() },
        update: contact,
        create: contact,
    });

    return response;
};

export const getFunnels = async (subaccountId: string) => {
    const response = await db.funnel.findMany({
        where: {
            subAccountId: subaccountId,
        },
        include: {
            FunnelPages: true,
        },
    });

    return response;
};

export const getFunnel = async (funnelId: string) => {
    const funnel = await db.funnel.findUnique({
        where: { id: funnelId },
        include: {
            FunnelPages: {
                orderBy: {
                    order: "asc",
                },
            },
        },
    });

    return funnel;
};

export const upsertFunnelPage = async (subaccountId: string, funnelPage: UpsertFunnelPage, funnelId: string) => {
    if (!subaccountId || !funnelId) return;
    await requireSubAccountAccess(subaccountId);

    const response = await db.funnelPage.upsert({
        where: {
            id: funnelPage.id || "",
        },
        update: {
            ...funnelPage,
        },
        create: {
            ...funnelPage,
            content: funnelPage.content
                ? funnelPage.content
                : JSON.stringify([
                      {
                          content: [],
                          id: "__body",
                          name: "Body",
                          styles: {
                              backgroundColor: "white",
                              type: "_body",
                          },
                      },
                  ]),
            funnelId,
        },
    });

    revalidatePath(`/subaccount/${subaccountId}/funnels/${funnelId}`);
    return response;
};

export const deleteFunnelsPage = async (funnelPageId: string) => {
    const page = await db.funnelPage.findUnique({
        where: { id: funnelPageId },
        include: { Funnel: true },
    });
    if (!page || !page.Funnel) throw new Error("Funnel page not found");
    await requireSubAccountAccess(page.Funnel.subAccountId);
    const response = await db.funnelPage.delete({
        where: {
            id: funnelPageId,
        },
    });

    return response;
};

export const updateFunnelProducts = async (products: string, funnelId: string) => {
    const funnel = await db.funnel.findUnique({
        where: { id: funnelId },
    });
    if (!funnel) throw new Error("Funnel not found");
    await requireSubAccountAccess(funnel.subAccountId);
    const data = await db.funnel.update({
        where: { id: funnelId },
        data: { liveProducts: products },
    });

    return data;
};

export const getFunnelPageDetails = async (funnelPageId: string) => {
    const data = await db.funnelPage.findUnique({
        where: {
            id: funnelPageId,
        },
    });
    return data;
};


export const getPipelines = async (subaccountId: string) => {
  const response = await db.pipeline.findMany({
    where: { subAccountId: subaccountId },
    include: {
      Lane: {
        include: { Tickets: true },
      },
    },
  })
  return response
}

