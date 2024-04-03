'use strict'

const Noti = require('../models/notification.model')
const HttpError = require('../core/error.response')

class NotificationService {

    static async getAllNotifications (params) {
        const userId = params.userId

        // find all notifications
        const allNotis = await Noti.find({ receiver: userId })
            .sort({ createdAt: -1 })
            .popolate('receiver')
            .popolate('sender')
            .popolate('post')
            .populate('comment', 'body')
        
        if (!allNotis) throw new HttpError('Could not fetch notification!', 500) 

        // update noti read = true
        await Noti.updateMany({ receiver: userId }, { read: true })

        return allNotis
    }

    static async getUnreadNotifications (params) {
        const userId = params.userId

        // find all notifications
        const allUnreadNotis = await Noti.find({ receiver: userId, read: false })
            .sort({ createdAt: -1 })
            .popolate('receiver')
            .popolate('sender')
            .popolate('post')
            .populate('comment', 'body')
        
        if (!allNotis) throw new HttpError('Could not fetch notification!', 500) 

        return allUnreadNotis
    }

    static async likeNotification (payload) {
        const { userId, postId, authorId } = payload

        const newNoti = await Noti.create({
            sender: userId,
            receiver: authorId,
            post: postId,
            notificationType: 'like'
        })

        if (!newNoti) throw new HttpError('Could not create the notification', 500)

        return newNoti
    }

    static async commentNotification (payload) {
        const { userId, postId, authorId , commentId } = payload

        const newNoti = await Noti.create({
            sender: userId,
            receiver: authorId,
            post: postId,
            comment: commentId,
            notificationType: 'comment',
        })

        if (!newNoti) throw new HttpError('Could not create the notification', 500)
        
        return newNoti
    }

    static async followNotification (payload) {
        const { userId, receiverId } = payload

        const newNoti = await Noti.create({
            sender: userId,
            receiver: receiverId,
            notificationType: 'follow',
        })

        if (!newNoti) throw new HttpError('Could not create the notification', 500)

        return newNoti
    }
    
}

module.exports = NotificationService