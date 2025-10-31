import { db } from "@/lib/db";



export async function createNotification({userId,  type, title, message, link}: {userId: string;  type: string; title: string; message: string; link?: string}) {

    return await db.notification.create({
        data: {
            userId,
            type,
            title,
            message,
            link
        }
    })
}

export async function getUserNotification(userId: string) {
    return await db.notification.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc"
        }
    })
}

export async function markAsRead(notificationId: string) {
    await db.notification.update({
        where: {
            id: notificationId
        },
        data: {
            read: true
        }
    })
}

export async function getUnreadNotificationCount(userId:string) {
    const unread = await db.notification.count({
        where: { userId, read: false },
    });
    return unread
}