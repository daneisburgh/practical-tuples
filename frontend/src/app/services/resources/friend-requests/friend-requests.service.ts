import { Injectable } from "@angular/core";
import { remove } from "lodash";

import { HttpService } from "../../utils/http/http.service";
import { ToastService } from "../../utils/toast/toast.service";
import { WebSocketService } from "../../utils/websocket/websocket.service";
import { User, UsersService } from "../users/users.service";

const route = "/friend-requests";

export enum FriendRequestStatus {
    accepted = "Accepted",
    rejected = "Rejected",
    pending = "Pending"
}

export type FriendRequest = {
    createdAt: Date;
    updatedAt: Date;
    isVerified: boolean;
    id: string;
    status: FriendRequestStatus;
    requestee: User;
    requester: User;
};

@Injectable({
    providedIn: "root"
})
export class FriendRequestsService {
    constructor(
        private httpService: HttpService,
        private toastService: ToastService,
        private usersService: UsersService,
        private webSocketService: WebSocketService
    ) {
        this.webSocketService.friendRequestEvent.subscribe(async (friendRequestEvent) => {
            const { createFriendRequest, deleteFriendRequest, updateFriendRequest } =
                friendRequestEvent;
            const user = Object.assign({}, this.usersService.user);

            if (createFriendRequest) {
                user.friendRequests.push(createFriendRequest);

                if (user.username === createFriendRequest.requestee.username) {
                    this.toastService.present("primary", "You have a new friend request");
                }
            } else if (deleteFriendRequest) {
                remove(user.friends, (fr) => fr.id === deleteFriendRequest.id);
                remove(user.friendRequests, (fr) => fr.id === deleteFriendRequest.id);
            } else if (updateFriendRequest) {
                this.handleUpdateFriendRequest(user, updateFriendRequest);
            }

            await this.usersService.setUser(user);
            this.usersService.changeEvent.emit();
        });
    }

    async create(username: string) {
        let created = false;

        try {
            const response = await this.httpService.post(route, { username }, true);

            if (response) {
                const user = this.usersService.user;
                user.friendRequests.unshift(response);
                await this.usersService.setUser(user);
                await this.toastService.present("primary", `Friend request sent`);
                created = true;
            }
        } catch (error) {
            console.error(error);

            const {
                error: { message }
            } = error;
            let errorMessage = "Unable to send friend request";

            switch (message) {
                case "Username not found":
                case "Friend request already sent":
                case "User is already a friend":
                case "User's account has maximum allowed friends":
                case "Account has maximum allowed friends":
                    errorMessage = message;
                    break;
            }

            await this.toastService.present("danger", errorMessage);
        }

        return created;
    }

    async delete(id: string) {
        try {
            const response = await this.httpService.delete(`${route}/${id}`);

            if (response) {
                const user = this.usersService.user;
                remove(user.friends, (fr) => fr.id === response.id);
                remove(user.friendRequests, (fr) => fr.id === response.id);
                this.usersService.setUser(user);
            }
        } catch (error) {
            console.error(error);
            await this.toastService.present("danger", "Unable to delete friend request");
        }
    }

    async acceptance(id: string, isAccepted: boolean) {
        try {
            const status = isAccepted ? FriendRequestStatus.accepted : FriendRequestStatus.rejected;
            const response = await this.httpService.patch(`${route}/${id}`, { status });

            if (response) {
                const user = this.usersService.user;
                this.handleUpdateFriendRequest(user, response);
                this.usersService.setUser(user);
            }
        } catch (error) {
            console.error(error);
            await this.toastService.present("danger", "Unable to accept friend request");
        }
    }

    private handleUpdateFriendRequest(user: User, friendRequest: FriendRequest) {
        const { id, requestee, requester, status, updatedAt } = friendRequest;

        if (status === "Accepted") {
            remove(user.friendRequests, (fr) => fr.id === id);
            const { username } = user.username === requestee.username ? requester : requestee;
            user.friends.push({
                id,
                updatedAt,
                username
            });
        } else {
            remove(user.friends, (f) => f.id === id);
            const currentFriendRequestIndex = user.friendRequests.findIndex((fr) => fr.id === id);

            if (currentFriendRequestIndex > -1) {
                user.friendRequests[currentFriendRequestIndex] = friendRequest;
            } else {
                user.friendRequests.push(friendRequest);
            }
        }
    }
}
