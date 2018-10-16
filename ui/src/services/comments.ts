import { HttpClient } from "@angular/common/http";
import { URLSearchParams } from "@angular/http";
import { Injectable } from '@angular/core';
import { BaseModel, BaseService } from './base';

class Comment extends BaseModel {
    id: number;
    user: any;
    recipe: number;
    rating: number;
    text: string;
    updated?: Date;

    constructor(payload) {
        super();
        this.id = payload.id;
        this.user = payload.user;
        this.recipe = payload.recipe;
        this.rating = payload.rating;
        this.text = payload.text;
        if (payload.updated) {
            this.updated = new Date(payload.updated);
        }

        this.setHash();
    }

    toPayload() {
        return {
            id: this.id,
            recipe: this.recipe,
            rating: this.rating,
            text: this.text
        }
    }
}

@Injectable()
class CommentService extends BaseService {

    constructor(
        public http: HttpClient,
    ) { super(); }

    baseUrl = '/api/v1/comments/';
    model = Comment;
}

export { Comment, CommentService };